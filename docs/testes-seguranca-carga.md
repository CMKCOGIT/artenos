# Artenós — Roteiro de Testes de Segurança, LGPD e Capacidade

Guia prático para validar segurança, confiabilidade de dados (LGPD), carga no
banco e limite de usuários simultâneos da plataforma. Baseado no código real
deste repositório (`server.ts`, `src/services/*`, `database/schema.sql`).

> **Escopo e autorização:** todos os testes aqui são para a **sua própria**
> infraestrutura. Teste de carga pesado pode ser confundido com abuso pela
> Vercel/Supabase e suspender sua conta — avise os provedores ou use um
> ambiente de **staging** (projeto Supabase separado). Nada aqui é para atacar
> terceiros.

---

## 1. O que já está BEM feito ✅

- **RLS ligado em todas as tabelas** (`schema.sql`), com policies por papel
  (cliente / artesã / fornecedor / admin). É a base correta de isolamento de dados.
- **Webhooks com validação HMAC** (`x-signature`) e **idempotência** via
  `payment_webhook_events` antes de aprovar pagamento. Ótimo contra replay.
- **`service_role` restrita ao servidor**, nunca no cliente.
- **Mascaramento de segredos em logs** (`logger.sanitizeError`).
- **Índices** nas colunas de junção/filtro mais usadas, incluindo GIN/trigram
  para busca textual.
- **Validação de env com Zod** separando público x privado.

---

## 2. Achados prioritários 🔴 (corrigir antes de escalar)

> **Atualização:** os achados A (rate limit), B (paginação) e parte do D
> (limite de corpo) receberam uma **mitigação baseline** nesta branch
> (`src/lib/rate-limit.ts`, teto em `getProducts`, `express.json({ limit })`).
> O texto abaixo mantém o contexto e aponta o que ainda falta (ex.: Redis para
> limite global, paginação real na UI).

### 🔴 A. Sem rate limiting em lugar nenhum
`grep` por `rate limit / throttle / 429` não retornou nada. O `REDIS_URL` está
declarado no `.env.example` mas **não é usado no código**. Sem isso:
- Qualquer um pode marteládar `/api/webhooks/mercadopago`, `/api/chat/signed-url`
  e `/api/audit` sem limite.
- Um único cliente pode disparar `getProducts()` em loop e pesar no banco.

**Ação:** implementar rate limit por IP e por usuário (o Redis já previsto é o
lugar certo — sliding window). Regra sugerida: endpoints públicos 60 req/min/IP;
endpoints autenticados 120 req/min/usuário; webhooks 300 req/min/IP (eles
rejeitam cedo, mas ainda assim limite).

### 🔴 B. `getProducts()` sem paginação (o gargalo nº 1 do banco)
Em `src/services/products.service.ts` a query lê **todos** os produtos ativos
com joins (`artesans`, `categories`, `inventory`) e `select('*')`, **sem
`.limit()` nem `.range()`**. Hoje é rápido porque o catálogo é pequeno; com
alguns milhares de produtos cada acesso à home vira uma leitura enorme — será o
primeiro ponto a cair sob carga.

**Ação:** paginar (`.range(from, to)`), trocar `select('*')` por colunas
explícitas, e considerar cache (Redis/`stale-while-revalidate`) da listagem
pública. Teste isso diretamente com o cenário `stress` do k6.

### 🔴 C. A API Express provavelmente NÃO roda em produção
`vercel.json` usa `framework: vite` e reescreve **tudo** para `/index.html`.
Ou seja, em produção na Vercel as rotas de `server.ts` (`/api/...`) caem no SPA,
não no Express. Confirme onde os webhooks de pagamento realmente são atendidos
(Supabase Edge Functions? outro deploy?). Um webhook de pagamento que não chega
ao destino é risco financeiro, não só de segurança.

**Ação:** confirmar o runtime real das rotas `/api` e apontar o k6 para ele.

### 🟡 D. Sem headers de segurança / CORS / limite de corpo
Não há `helmet`, `cors` configurado, nem `express.json({ limit })`. Um POST com
corpo gigante (ex.: payload de webhook de 50 MB) é aceito e processado.

**Ação:** `app.use(express.json({ limit: '100kb' }))`, `helmet()`, CORS com
allowlist de origens, e headers CSP/HSTS.

### 🟡 E. `/api/audit` confia no corpo enviado pelo cliente
O cliente manda `action`, `entityType`, `metadata` livres e isso vira log de
auditoria "imutável". Um usuário pode poluir/forjar entradas de auditoria.

**Ação:** validar com Zod (enum de ações permitidas), e gravar `actor_id`
sempre do JWT (já faz) — nunca confiar em campo de ator vindo do corpo.

---

## 3. Confiabilidade de dados & LGPD — checklist

LGPD = tratar dado pessoal com base legal, finalidade, segurança e direitos do titular.

- [ ] **Mapa de dados pessoais.** Liste o que é PII em `profiles`, `addresses`,
      `customer_profiles`, `artesans`, `messages`. CPF/CNPJ, endereço, telefone
      e conteúdo de chat são dados pessoais.
- [ ] **Base legal e consentimento.** Tela de cadastro com aceite de Política de
      Privacidade versionada (guardar data/versão aceita).
- [ ] **Minimização.** Você coleta só o necessário? Ex.: precisa mesmo guardar
      CPF de cliente antes do pagamento?
- [ ] **Criptografia em repouso de dados sensíveis.** CPF/CNPJ e dados
      financeiros idealmente cifrados em coluna (pgcrypto) além do RLS.
- [ ] **Direito de exclusão/portabilidade.** Rota para o titular pedir exclusão
      e exportação dos próprios dados. Definir o que é anonimizado vs. apagado
      (pedidos pagos têm retenção fiscal — anonimizar, não apagar).
- [ ] **Retenção.** Política de prazo: por quanto tempo guarda chat, logs,
      carrinho abandonado. `audit_logs` com TTL/arquivamento.
- [ ] **Vazamento em logs.** Confirmar que `logger.sanitizeError` cobre CPF,
      e-mail e tokens de pagamento — teste com um payload real mascarado.
- [ ] **Compartilhamento com terceiros.** Mercado Pago, Pagar.me, antifraude,
      Google GenAI (`@google/genai`): declarar na política e checar se você
      manda só o necessário (não mandar PII desnecessária ao modelo de IA).
- [ ] **URLs assinadas.** Anexos de chat usam `createSignedUrl` com 1h — bom.
      Confirme que o bucket `chat-attachments` é privado (não público).
- [ ] **Incidentes.** Plano de resposta: prazo ANPD (comunicar em prazo
      razoável), quem aciona, como notifica titulares.

**Teste de confiabilidade de dados (integridade):**
- Concorrência de estoque: dois pedidos simultâneos do último item não podem
  vender o mesmo estoque duas vezes. Teste com k6 disparando checkout paralelo
  do mesmo produto e confira `inventory.reserved_quantity` vs `stock_quantity`.
- Idempotência de webhook: reenvie o mesmo `gateway_event_id` 100x e confirme
  que `payments` muda de estado só uma vez.
- Split de pagamento: soma dos valores artesã + plataforma == total pago, sempre.

---

## 4. Carga no banco & limite de simultâneos

### Por que o banco é o teto real
Supabase roda Postgres com um **pool de conexões finito** (o PgBouncer do plano
tem limite; planos menores ~15–60 conexões diretas, mais via pooler). O gargalo
quase nunca é CPU do app React — é:
1. **Conexões/consultas simultâneas ao Postgres.**
2. **Consultas pesadas sem limite** (achado B acima).
3. **Latência de rede por round-trip** quando o front faz N queries em vez de 1.

### Como descobrir o SEU limite (empírico, não chute)
Use a rotina `load-tests/k6-carga.js`:

```bash
# 1) sanidade
BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=smoke  load-tests/k6-carga.js
# 2) carga esperada
BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=load   load-tests/k6-carga.js
# 3) estresse até quebrar — AQUI você acha o limite
BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=stress load-tests/k6-carga.js
# 4) resiliência a pico súbito
BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=spike  load-tests/k6-carga.js
```

**Lendo o resultado:** o "limite de usuários simultâneos" é o número de VUs no
momento em que a **latência p95 dispara** (passa de ~800 ms) e as **falhas HTTP
passam de ~1%**. O `stress` sobe 100 → 200 → 400 → 800; anote em qual degrau isso
acontece. Esse é o número que você comunica ao negócio ("suportamos ~X
simultâneos antes de degradar").

### Observe EM PARALELO (não só o k6)
- **Supabase Dashboard → Database → "Connections"** e "Query Performance":
  veja se o pool satura e quais queries ficam lentas.
- **Vercel → Observability**: concorrência de funções, cold starts, 5xx.
- Rode `EXPLAIN ANALYZE` na query de `getProducts` com volume real de dados.

---

## 5. Resiliência a surto / "DDoS" (defesa, não ataque)

O cenário `spike` simula um surto legítimo (campanha, influencer). Resiliência
de verdade vem de **camadas antes do seu código**, não de otimizar o Node:

- **CDN/cache na borda** (Vercel Edge) para páginas e catálogo públicos — a
  maioria dos acessos nem deve chegar ao banco.
- **WAF + proteção DDoS** (Cloudflare na frente, ou a proteção da Vercel) com
  rate limit por IP na borda.
- **Rate limit na aplicação** (achado A) como segunda camada.
- **Circuit breaker / timeout** nas chamadas a Mercado Pago/Pagar.me para o
  gateway lento não derrubar seu app.
- **Fila** para trabalho pesado de webhook em vez de processar inline.

> Teste de negação de serviço real (saturar deliberadamente até cair) só em
> staging, nunca em produção, e nunca contra infraestrutura que não é sua.

---

## 6. Outros pontos para revisar (dicas)

- **Injeção em busca:** `getProducts` monta `.or(\`title.ilike.%${search}%...\`)`
  com input do usuário. O cliente Supabase parametriza, mas valide/escape o
  `search` (limite de tamanho, sem vírgulas que quebrem o filtro `or`).
- **Enumeração de IDs:** confirme que endpoints por ID (produto, pedido, perfil)
  respeitam RLS mesmo quando chamados direto na API REST do Supabase.
- **Autenticação:** política de senha, rate limit no login, verificação de
  e-mail, proteção contra enumeração de contas ("e-mail já existe").
- **Storage:** todos os buckets que deveriam ser privados estão privados? Teste
  acessar um `storage_path` sem URL assinada.
- **Dependências:** rode `npm audit` / Dependabot. `typescript: ^7` e
  `vite: ^8` são versões muito à frente — confirme que são reais e sem CVEs.
- **Segredos no git:** rode `gitleaks` no histórico para garantir que nenhum
  `sb_secret_`, `APP_USR-` ou `ak_live_` vazou em commit antigo.
- **Observabilidade:** sem métricas/alertas você não sabe que caiu. Configure
  alerta de erro 5xx e de saturação de conexões do Postgres.

---

## 7. Ordem sugerida de execução

1. Rodar `/security-review` (skill deste ambiente) no diff/branch.
2. `npm audit` + `gitleaks` no histórico.
3. Paginar `getProducts` e medir antes/depois com k6 `stress`.
4. Implementar rate limit (Redis) e repetir o `spike`.
5. Confirmar onde as rotas `/api` rodam em produção.
6. Rodar o checklist LGPD com o time.

> Ferramentas: [k6](https://k6.io) (carga), [OWASP ZAP](https://www.zaproxy.org)
> (varredura DAST do site), [gitleaks](https://github.com/gitleaks/gitleaks)
> (segredos), `npm audit`/Dependabot (dependências).
