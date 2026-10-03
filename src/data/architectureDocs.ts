import { COMPLETE_DATABASE_SQL } from './completeDatabaseSql';

export interface ArchitectureSection {
  id: string;
  title: string;
  subtitle: string;
  contentMarkdown: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export const architectureSections: ArchitectureSection[] = [
  {
    id: '1-arquitetura',
    title: '1. Arquitetura Completa da Plataforma',
    subtitle: 'Visão sistêmica, separação de responsabilidades e ecossistema triplo',
    contentMarkdown: `### Arquitetura de Alto Nível (C4 Container Model)
A **Artenós** foi concebida não apenas como uma vitrine de compras, mas como um **ecossistema de impacto socioeconômico** para o artesanato brasileiro. A plataforma adota uma arquitetura **Modular Monolith evolutivo** com forte desacoplamento de domínio, preparada para transição em microsserviços orientados a eventos conforme a escala nacional seja atingida.

#### Camadas Principais:
1. **Edge & CDN Layer (Vercel / Cloudflare)**:
   - Terminação SSL, mitigação DDoS L3/L4/L7, cache de ativos estáticos e revalidação de ISR (Incremental Static Regeneration) para páginas de produtos e perfis de artesãs.
2. **Frontend Client & SSR (Next.js 15 / React 19 / TypeScript)**:
   - Vitrine de alta conversão renderizada no servidor para SEO agressivo.
   - SPA reativa para Dashboards da Artesã, Fornecedor e Sistema de Mensageria em tempo real.
   - Gestão de estado cliente com **Zustand** e validações estritas de schema com **Zod**.
3. **API & Server Actions Layer**:
   - Rotas de API tipadas com middleware de autenticação (JWT Supabase), Rate Limiting no Redis (Upstash) e sanitização de entradas.
4. **Camada de Integrações Especializadas**:
   - **Gateway de Pagamento**: Mercado Pago / Pagar.me com **Split Automático** (90% artesã líquida, 10% comissão Artenós) e antifraude nativo.
   - **Logística & Frete**: Integração com Melhor Envio / Correios (cálculo dimensional dinâmico com peso cúbico e cotação de PAC, Sedex e transportadoras privadas).
   - **Comunicação**: Webhooks seguros e notificações transacionais (WhatsApp via Gupshup/Z-API para o programa de Cadastro Assistido e emails transacionais via Resend).
5. **Data & Persistence Layer**:
   - **PostgreSQL 16 (Supabase)** com Row Level Security (RLS) habilitado em 100% das tabelas.
   - **Redis (Upstash)** para cache de cotações de frete por CEP (TTL de 6h), controle de sessões e rate limit contra brute force.
   - **Supabase Storage (S3)** com buckets privados para notas fiscais e públicos com CDN de otimização de imagens (WebP/AVIF) para fotos de produtos e matérias-primas.`,
  },
  {
    id: '2-fluxogramas',
    title: '2. Fluxogramas dos Usuários (Jornadas)',
    subtitle: 'Fluxos detalhados para Comprador, Artesã e Fornecedor de Insumos',
    contentMarkdown: `### 1. Jornada do Comprador (Cliente)
\`\`\`text
Início (Vitrine / Busca)
  │
  ├──> Pesquisa Inteligente (Nome, Categoria, Região, Material)
  │       │
  │       ▼
  │    Página do Produto (História da peça, Fotos, Artesã, Estoque)
  │       │
  │       ├───> [Dúvida/Personalização?] ──> Inicia Chat Direto com Artesã
  │       │                                     └──> Negociação / Proposta personalizada
  │       │
  │       └───> Adicionar ao Carrinho ──> Informa CEP (Melhor Envio PAC/Sedex)
  │                                           │
  │                                           ▼
  │                                    Checkout Seguro
  │                                    (Pix Instantâneo ou Cartão Tokenizado)
  │                                           │
  │                                           ▼
  │                                    Split de Pagamento Executado
  │                                           │
  │                                           ▼
  │                                    Painel Meus Pedidos & Rastreio
\`\`\`

### 2. Jornada da Artesã (Produtora & Vendedora)
\`\`\`text
Entrada na Central da Artesã
  │
  ├──> [Dificuldade com Tecnologia?] ──> Cadastro Assistido (Ligação/WhatsApp)
  │
  ├──> Calculadora de Precificação Inteligente
  │       (Materiais + Horas de Trabalho + Embalagem + Lucro % + Taxa 10%)
  │       └──> Aplica Preço Sugerido direto no Cadastro do Produto
  │
  ├──> Gestão de Produtos & Estoque
  │       (Fotos, Storytelling, Dimensões, Estoque físico, Prazo de produção)
  │
  ├──> Pipeline de Pedidos
  │       [Pedido Criado] ──> [Pago] ──> [Em Produção] ──> [Enviado] ──> [Concluído]
  │
  └──> Mural de Demandas de Insumos
          "Preciso de 20m de fio algodão cru..." ──> Recebe cotações de fornecedores
\`\`\`

### 3. Jornada do Fornecedor de Matéria-Prima
\`\`\`text
Entrada na Central de Fornecedores
  │
  ├──> Cadastro de Materiais & Lotes Atacado (Fios, Argilas, Madeiras, Tecidos)
  │       └──> Visível no Catálogo para milhares de artesãs
  │
  ├──> Visualização do Mural de Demandas das Artesãs
  │       └──> Submissão de Proposta Comercial (Preço do lote + Frete direto)
  │
  └──> Recebimento de Solicitações de Orçamento Direto
\`\`\``,
  },
  {
    id: '3-erd',
    title: '3. Modelo Entidade Relacionamento (DER)',
    subtitle: 'Estrutura relacional normalizada com integridade referencial estrita',
    contentMarkdown: `### Diagrama Entidade-Relacionamento
A base de dados foi projetada seguindo a 3ª Forma Normal (3FN), com total desacoplamento entre autenticação e perfis de domínio específico.

\`\`\`text
[auth.users] (Supabase Auth)
      │
      ▼
[public.profiles] (id, email, role, full_name, phone, avatar_url)
      │
      ├──────────────────────┬──────────────────────┐
      ▼                      ▼                      ▼
[public.artesans]      [public.customers]     [public.suppliers]
(studio_name, bio,     (shipping_addresses,   (company_name, cnpj,
 location, rating,      tax_id_cpf)            materials_catalog,
 bank_account_split)                           min_order_cents)
      │                                             │
      ├──────────────────────┐                      │
      ▼                      ▼                      ▼
[public.products]      [public.demands]       [public.supplier_materials]
(title, description,   (artisan_id, title,    (supplier_id, category,
 price_cents, stock,    specs, quantity)       price_cents, unit)
 weight_g, artisan_id)       │                      │
      │                      │                      │
      │                      ▼                      ▼
      │              [public.supplier_quotes] <─────┘
      │              (demand_id, supplier_id,
      │               price_cents, shipping_cents)
      ▼
[public.order_items] ◄─── [public.orders] (customer_id, status, total_cents)
                                │
                                ├───> [public.payments] (gateway_id, split_artisan_cents, split_fee_cents)
                                └───> [public.shipping] (carrier, tracking_code, status)

[public.conversations] ──── [public.messages] (sender_id, content, attachments)
\`\`\``,
  },
  {
    id: '4-banco-postgresql',
    title: '4. Banco PostgreSQL (DDL Completo & Produção)',
    subtitle: 'Script SQL v2.0 pronto para produção: 26 tabelas, triggers, RLS, índices trigram e seed inicial',
    contentMarkdown: `### Especificações de Engenharia e Integridade Financeira:
- **NUNCA usar FLOAT/REAL**: Todos os valores monetários são gravados em centavos como \`INTEGER\` ou \`BIGINT\` (\`price_cents\`, \`subtotal_cents\`, \`shipping_cents\`), eliminando para sempre erros de arredondamento IEEE-754.
- **26 Tabelas Especializadas**: Cobre Usuários, Perfis, Artesãs, Fornecedores, Endereços, Categorias, Produtos, Galeria, Estoque, Favoritos, Carrinho Persistente, Pedidos, Itens com Snapshot, Pagamentos, Repasses de Split (Payouts), Avaliações, Materiais B2B com Lotes e Banhos, Mural de Demandas, Cotações, Chat em Tempo Real com Leituras, Calculadora de Precificação Salva, Inclusão Digital (Cadastro Assistido) e Configurações Globais.
- **Triggers Automatizadas**:
  1. \`process_order_payment()\`: Ao pagar o pedido, debita atomicamente o estoque, reserva e incrementa vendas e receita líquida da artesã.
  2. \`update_product_and_artisan_rating()\`: Recalcula média de estrelas do produto e da artesã automaticamente.
  3. \`update_conversation_last_message()\`: Atualiza última mensagem e contadores de mensagens não lidas.
  4. \`trigger_set_timestamp()\`: Atualização automática de \`updated_at\` em todas as tabelas.
- **Índices Trigram (pg_trgm)**: Busca textual instantânea com suporte a digitação aproximada (fuzzy search).`,
    codeSnippet: {
      language: 'sql',
      code: COMPLETE_DATABASE_SQL,
    },
  },
  {
    id: '5-politicas-rls',
    title: '5. Políticas de Segurança RLS (Supabase)',
    subtitle: 'Proteção em nível de linha garantindo isolamento absoluto de dados entre artesãs e clientes',
    contentMarkdown: `### Princípios de Row Level Security (RLS)
Todas as tabelas possuem \`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;\`. Nenhuma query direta do frontend pode contornar as regras abaixo:
- **Produtos**: Leitura pública para qualquer visitante; Inserção, edição e exclusão restritas unicamente à artesã proprietária.
- **Pedidos**: Clientes veem somente seus próprios pedidos; Artesãs veem apenas os pedidos vinculados aos seus produtos; Admins possuem visão global.
- **Mensagens do Chat**: Apenas participantes registrados da conversa (\`artisan_id\` ou \`client_id\`) podem ler ou enviar mensagens.
- **Demandas e Cotações**: Artesãs gerenciam suas próprias demandas; Fornecedores veem demandas abertas e só podem alterar suas próprias propostas.`,
    codeSnippet: {
      language: 'sql',
      code: `-- HABILITAÇÃO DO RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_quotes ENABLE ROW LEVEL SECURITY;

-- 1. PRODUTOS: Público para visualização, restrito para modificação
CREATE POLICY "Produtos visíveis para todos"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Artesã gerencia apenas seus produtos"
ON public.products FOR ALL
USING (
  artisan_id IN (
    SELECT id FROM public.artesans WHERE profile_id = auth.uid()
  )
);

-- 2. PEDIDOS: Cliente acessa os seus, artesã acessa os com seus itens
CREATE POLICY "Clientes visualizam seus pedidos"
ON public.orders FOR SELECT
USING (customer_id = auth.uid());

CREATE POLICY "Artesãs visualizam pedidos contendo seus produtos"
ON public.orders FOR SELECT
USING (
  id IN (
    SELECT order_id FROM public.order_items oi
    JOIN public.artesans a ON oi.artisan_id = a.id
    WHERE a.profile_id = auth.uid()
  )
);

-- 3. MENSAGENS DO CHAT: Restrito aos participantes da conversa
CREATE POLICY "Participantes acessam mensagens da conversa"
ON public.messages FOR SELECT
USING (
  conversation_id IN (
    SELECT c.id FROM public.conversations c
    LEFT JOIN public.artesans a ON c.artisan_id = a.id
    WHERE c.client_id = auth.uid() OR a.profile_id = auth.uid()
  )
);

CREATE POLICY "Participante pode enviar mensagem"
ON public.messages FOR INSERT
WITH CHECK (sender_id = auth.uid());`,
    },
  },
  {
    id: '6-apis-necessarias',
    title: '6. APIs Necessárias & Endpoints',
    subtitle: 'Catálogo de rotas REST / Server Actions com contratos de payload e split de pagamentos',
    contentMarkdown: `### 1. Módulo de Produtos & Vitrine
- \`GET /api/v1/products\` — Listagem pública com paginação e filtros (\`category\`, \`min_price\`, \`max_price\`, \`region\`, \`material\`).
- \`POST /api/v1/artisan/products\` — Criação de produto com validação dimensional para cálculo de frete.
- \`PATCH /api/v1/artisan/products/:id/stock\` — Atualização atômica de estoque.

### 2. Módulo Financeiro & Split
- \`POST /api/v1/checkout/create-intent\` — Inicialização do pedido e bloqueio preventivo de reserva no estoque por 15 minutos.
- \`POST /api/v1/webhooks/mercadopago\` — Webhook idempotente assinado via HMAC SHA256:
  - Dispara split: **90% para a conta da artesã**, **10% para a conta plataforma Artenós**.
  - Atualiza status do pedido para \`paid\`.
  - Notifica a artesã via WhatsApp/Email para iniciar a confecção.

### 3. Módulo de Frete & Logística
- \`POST /api/v1/shipping/calculate\` — Recebe CEP de destino e IDs de produtos; soma peso cúbico e consulta API do Melhor Envio; retorna opções **PAC**, **Sedex** e prazos.

### 4. Módulo de Insumos & Demandas
- \`POST /api/v1/artisan/demands\` — Publica demanda de insumo no mural.
- \`POST /api/v1/suppliers/quotes\` — Fornecedor submete proposta com valor do lote e custo de transporte.`,
  },
  {
    id: '7-plano-novembro',
    title: '7. Plano de Desenvolvimento até Novembro',
    subtitle: 'Cronograma quinzenal de sprints e marcos de validação do MVP',
    contentMarkdown: `| Sprint | Período | Foco Principal | Entregáveis Críticos |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | 01/10 – 15/10 | Setup Foundation & Design System | Design tokens terrosos, banco Supabase, tipografia Fraunces + Jakarta Sans, vitrine pública e página de produto. |
| **Sprint 2** | 16/10 – 31/10 | Central da Artesã & Precificação | Calculadora de Precificação inteligente, CRUD de produtos, Cadastro Assistido e gestão de fotos. |
| **Sprint 3** | 01/11 – 15/11 | Checkout Seguro, Split & Logística | Integração Mercado Pago com split 90/10, Melhor Envio com cotação por CEP, tela de acompanhamento. |
| **Sprint 4** | 16/11 – 30/11 | Fornecedores, Chat Interno & Go-Live | Chat interno cliente ↔ artesã em tempo real, mural de insumos B2B, testes de carga, auditoria LGPD e lançamento MVP. |`,
  },
  {
    id: '8-melhorias-ux-ui',
    title: '8. Melhorias UX/UI vs. Telas Enviadas',
    subtitle: 'Análise detalhada das 7 telas enviadas e refinamentos aplicados na versão final',
    contentMarkdown: `### Comparativo Crítico com os Mockups do Cliente:

1. **Top Bar & Navegação**:
   - *Original*: Barra superior com links sem indicação clara de papel do usuário e botão simples de carrinho.
   - *Evolução Artenós*: Navegação com 3 zonas estritas, seletor de perfil interativo (Comprador / Artesã / Fornecedor) para alternância contextual instantânea, carrinho dinâmico com gaveta lateral e acesso à central técnica.
2. **Calculadora de Precificação**:
   - *Original*: Entrada básica com poucos campos e layout estático.
   - *Evolução Artenós*: Engine em tempo real que calcula hora de trabalho, insumos, embalagem, lucro líquido e taxa da plataforma, além de botão para **"Aplicar este preço num novo produto"** imediatamente.
3. **Mural de Fornecedores & Demandas**:
   - *Original*: Telas separadas para cadastro e solicitação simples.
   - *Evolução Artenós*: Ecossistema bidirecional onde a artesã publica suas carências de materiais (ex: fios especiais) e os fornecedores respondem com propostas comerciais comparáveis.
4. **Tipografia & Paleta Sensorial**:
   - Uso de tipografia serifada nobre (\`Fraunces\`) nos títulos para evocar o luxo e a herança cultural do artesanato brasileiro, contrastada com sans-serif geométrica para legibilidade em dados financeiros.
   - Tons de linho cru (\`#FBF8F3\`), terracota nobre (\`#8E3E19\`) e verde floresta mineral (\`#1A543E\`).`,
  },
  {
    id: '9-estrategia-escala',
    title: '9. Estratégia de Escalabilidade para o Futuro',
    subtitle: 'Da validação do MVP ao marketplace nacional de alto impacto',
    contentMarkdown: `### Pilares de Crescimento Pós-MVP:
1. **Comunidade & Escola Artenós (Fase 2)**:
   - Plataforma de micro-cursos em vídeo e receitas em PDF para capacitação contínua das artesãs em técnicas, fotografia com smartphone e finanças.
2. **Selo de Origem & Rastreabilidade de Impacto (Fase 3)**:
   - Certificação de procedência com QR Code na etiqueta das peças que conta a história da artesã e calcula a renda gerada diretamente para a família da criadora.
3. **Arquitetura de Alta Concorrência**:
   - Fila RabbitMQ / BullMQ para orquestração assíncrona de webhooks de frete e notas fiscais.
   - Busca em milissegundos com **Typesense / Meilisearch** indexando sinônimos regionais (ex: "renda de bilro", "barro cozido", "amigurumi").`,
  },
];
