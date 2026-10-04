# Artenós — Gestão Segura de Credenciais & Arquitetura de Ambiente

Este documento especifica as diretrizes de segurança, gestão de chaves e variáveis de ambiente da plataforma **Artenós**.

---

## 1. Separação de Variáveis (Públicas vs. Privadas)

### Variáveis Públicas (Frontend)
Apenas variáveis com prefixo `NEXT_PUBLIC_` ou `VITE_` podem ser expostas no código do cliente. Elas são validadas na inicialização via Zod em `src/lib/env.ts` (`publicEnv`):

```env
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
NEXT_PUBLIC_APP_URL="https://seu-app.com.br"
```

> **Aviso:** A chave publicável/anônima (`sb_publishable_...` ou `anon_key`) opera sob as políticas de **Row Level Security (RLS)** do PostgreSQL. Ela é segura para leitura e gravação autorizada no cliente.

### Variáveis Privadas (Exclusivas do Servidor / Edge Functions)
NUNCA devem ser acessadas no navegador ou incluídas em builds do cliente. São validadas estritamente no runtime Node.js em `src/lib/env.ts` (`serverEnv`):

```env
SUPABASE_SERVICE_ROLE_KEY="sb_secret_..."
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
MERCADOPAGO_WEBHOOK_SECRET="whsec_..."
PAGARME_API_KEY="ak_live_..."
PAGARME_WEBHOOK_SECRET="whsec_..."
ANTIFRAUD_API_KEY="af_key_..."
REDIS_URL="rediss://..."
REDIS_TOKEN="..."
```

---

## 2. Usos Autorizados da `SUPABASE_SERVICE_ROLE_KEY`

A chave `service_role` contorna as regras de RLS e possui privilégios administrativos completos. Ela é restrita ao arquivo `server.ts` ou Supabase Edge Functions para:

1. **Processar Webhooks Validados**: recepção de notificações do Mercado Pago e Pagar.me com validação HMAC da assinatura (`x-signature`).
2. **Criar e Confirmar Pagamentos**: conciliação atômica de transações financeiras e splits entre artesã e plataforma.
3. **Liquidação e Baixa de Estoque**: garantia de que itens pagos tenham baixa transacional sem risco de race condition.
4. **Anexos Privados de Chat**: emissão de URLs assinadas com tempo de expiração (`createSignedUrl`) para o bucket seguro `chat-attachments`.
5. **Auditoria Imutável**: gravação de logs de governança na tabela `audit_logs`.

---

## 3. Prevenção de Vazamento & .gitignore

1. O arquivo `.gitignore` bloqueia explicitamente:
   - `.env`
   - `.env.local`
   - `.env.*.local`
   - `*.key`, `*.cert`, `*.pem`, `*.secret`
   - `credentials.json`
2. **Mascaramento em Logs (`src/lib/logger.ts`)**: todas as saídas no console passam pelo sanitizador regex que substitui tokens, segredos e hashes por `sb_secret_...***...xxx`.
3. O arquivo `.env.example` contém exclusivamente placeholders sem nenhum valor real.

---

## 4. Política de Rotação de Chaves

Em caso de suspeita de comprometimento ou ciclo trimestral de segurança:

1. **Supabase**:
   - Acesse **Project Settings → API → JWT Settings**.
   - Clique em **Generate new secret** e atualize as chaves publicáveis e service_role.
   - Atualize os Secrets no painel de hospedagem e reinicie a aplicação.
2. **Mercado Pago / Pagar.me**:
   - Gere novas credenciais de produção no dashboard do desenvolvedor.
   - Atualize `MERCADOPAGO_ACCESS_TOKEN` e `MERCADOPAGO_WEBHOOK_SECRET`.
   - Revogue as credenciais anteriores no dashboard do gateway.
