-- ============================================================================
-- PLATAFORMA ARTENÓS — ESQUEMA RELACIONAL POSTGRESQL (PRODUCTION-READY V2.0)
-- Banco de Dados Completo para Marketplace de Artesanato Brasileiro & B2B
-- Compatível com: Supabase, PostgreSQL 14+, Neon, AWS RDS, Cloud SQL
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSÕES DO POSTGRESQL
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Geração de UUIDv4
CREATE EXTENSION IF NOT EXISTS "citext";         -- Emails insensíveis a maiúsculas/minúsculas
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Busca textual difusa (fuzzy search / autocomplete)
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- Remoção de acentos para busca de artesanato regional

-- ----------------------------------------------------------------------------
-- 1. TIPOS ENUMERADOS (ENUMS)
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'artisan', 'supplier', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE artisan_status AS ENUM ('active', 'pending_approval', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('created', 'paid', 'in_production', 'shipped', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('pix', 'credit_card', 'boleto');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected', 'refunded', 'disputed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE shipping_method AS ENUM ('PAC', 'Sedex', 'Transportadora', 'Retirada');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE demand_status AS ENUM ('open', 'quotes_received', 'closed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quote_status AS ENUM ('sent', 'accepted', 'rejected', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE custom_piece_status AS ENUM ('pending', 'reviewed', 'quoted', 'accepted', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assisted_signup_status AS ENUM ('pending', 'contacted', 'completed', 'declined');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. FUNÇÃO UTILITÁRIA PARA ATUALIZAÇÃO AUTOMÁTICA DE TIMESTAMP
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 3. PERFIS DE USUÁRIOS (BASE UNIFICADA E ROLES)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email CITEXT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(25),
    cpf_cnpj VARCHAR(20),
    role user_role NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 4. PERFIL DA ARTESÃ (Mestras e Produtoras Artesanais)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artesans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    studio_name VARCHAR(120) NOT NULL,
    bio TEXT NOT NULL,
    story TEXT NOT NULL,
    location_city VARCHAR(80) NOT NULL,
    location_state VARCHAR(2) NOT NULL,
    specialties TEXT[] NOT NULL DEFAULT '{}',
    avatar_url TEXT,
    cover_url TEXT,
    rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating_avg >= 0 AND rating_avg <= 5.00),
    total_sales INT NOT NULL DEFAULT 0 CHECK (total_sales >= 0),
    revenue_cents BIGINT NOT NULL DEFAULT 0 CHECK (revenue_cents >= 0),
    phone_whatsapp VARCHAR(25),
    instagram_handle VARCHAR(80),
    featured_quote TEXT,
    pix_key VARCHAR(120),
    bank_name VARCHAR(80),
    bank_agency VARCHAR(20),
    bank_account VARCHAR(30),
    recipient_gateway_id VARCHAR(100), -- ID de subconta de split (Mercado Pago / Pagar.me)
    assisted_signup BOOLEAN NOT NULL DEFAULT FALSE,
    status artisan_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_artesans
BEFORE UPDATE ON public.artesans
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 5. PERFIL DO FORNECEDOR (Matérias-Primas, Fios, Argilas, Madeiras)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL,
    trade_name VARCHAR(150),
    cnpj VARCHAR(20) UNIQUE,
    category VARCHAR(80) NOT NULL,
    description TEXT,
    logo_url TEXT,
    location_city VARCHAR(80) NOT NULL,
    location_state VARCHAR(2) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    email CITEXT NOT NULL,
    min_order_cents INT NOT NULL DEFAULT 0 CHECK (min_order_cents >= 0),
    rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating_avg >= 0 AND rating_avg <= 5.00),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_suppliers
BEFORE UPDATE ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 6. PERFIL DO CLIENTE (Preferências e Dados de Entrega)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    preferences TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_customer_profiles
BEFORE UPDATE ON public.customer_profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 7. ENDEREÇOS DE ENTREGA (Normalizado)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_name VARCHAR(120) NOT NULL,
    recipient_phone VARCHAR(25),
    postal_code VARCHAR(10) NOT NULL, -- CEP: '00000-000'
    street VARCHAR(150) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(80),
    neighborhood VARCHAR(80) NOT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(2) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_addresses
BEFORE UPDATE ON public.addresses
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 8. TAXONOMIA: CATEGORIAS DE ARTESANATO
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    parent_id INT REFERENCES public.categories(id) ON DELETE SET NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. CATÁLOGO DE PRODUTOS DAS ARTESÃS
-- Regra de Ouro Financeira: Preços em centavos (INTEGER)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID NOT NULL REFERENCES public.artesans(id) ON DELETE CASCADE,
    category_id INT REFERENCES public.categories(id) ON DELETE SET NULL,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    story TEXT,
    materials TEXT[] NOT NULL DEFAULT '{}',
    dimensions_str VARCHAR(80),
    weight_grams INT NOT NULL DEFAULT 500 CHECK (weight_grams > 0),
    production_days INT NOT NULL DEFAULT 1 CHECK (production_days >= 0),
    is_customizable BOOLEAN NOT NULL DEFAULT FALSE,
    is_ready_to_ship BOOLEAN NOT NULL DEFAULT TRUE,
    price_cents INT NOT NULL CHECK (price_cents > 0), -- em centavos (ex: 28000 = R$ 280,00)
    badge VARCHAR(50), -- ex: 'ÚNICO DISPONÍVEL', 'DESTAQUE', 'SOB ENCOMENDA'
    image_url TEXT NOT NULL,
    video_url TEXT,
    rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating_avg >= 0 AND rating_avg <= 5.00),
    reviews_count INT NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
    views_count INT NOT NULL DEFAULT 0 CHECK (views_count >= 0),
    sales_count INT NOT NULL DEFAULT 0 CHECK (sales_count >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_products
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 10. IMAGENS ADICIONAIS DO PRODUTO (Galeria)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(150),
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. CONTROLE DE ESTOQUE COM LOCK PREVENTIVO DE CHECKOUT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory (
    product_id UUID PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 2,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_inventory
BEFORE UPDATE ON public.inventory
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 12. FAVORITOS / WISHLIST DO CLIENTE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_favorites (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (profile_id, product_id)
);

-- ----------------------------------------------------------------------------
-- 13. CARRINHO DE COMPRAS PERSISTENTE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    customization_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (profile_id, product_id)
);

CREATE TRIGGER set_timestamp_cart_items
BEFORE UPDATE ON public.cart_items
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 14. PEDIDOS (ENGINE TRANSACIONAL E FINANCEIRA)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_name VARCHAR(150) NOT NULL,
    client_email CITEXT NOT NULL,
    client_phone VARCHAR(25) NOT NULL,
    status order_status NOT NULL DEFAULT 'created',
    subtotal_cents INT NOT NULL CHECK (subtotal_cents >= 0),
    shipping_cents INT NOT NULL DEFAULT 0 CHECK (shipping_cents >= 0),
    shipping_method shipping_method NOT NULL DEFAULT 'PAC',
    total_cents INT NOT NULL CHECK (total_cents >= 0),
    platform_fee_cents INT NOT NULL DEFAULT 0 CHECK (platform_fee_cents >= 0), -- split 10%
    artisan_payout_cents INT NOT NULL DEFAULT 0 CHECK (artisan_payout_cents >= 0), -- split 90%
    payment_method payment_method NOT NULL DEFAULT 'pix',
    shipping_address JSONB NOT NULL, -- Snapshot imutável do endereço no momento da compra
    tracking_code VARCHAR(80),
    estimated_delivery_days INT,
    shipped_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_orders
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 15. ITENS DO PEDIDO (COM SNAPSHOT DO PRODUTO)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    artisan_id UUID NOT NULL REFERENCES public.artesans(id),
    title VARCHAR(180) NOT NULL,
    unit_price_cents INT NOT NULL CHECK (unit_price_cents > 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    item_subtotal_cents INT NOT NULL CHECK (item_subtotal_cents > 0),
    image_url TEXT NOT NULL,
    customization_notes TEXT,
    product_snapshot JSONB, -- Backup do estado do produto no instante da venda
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 16. PAGAMENTOS & TRANSAÇÕES (WEBHOOKS E AUDITORIA DO GATEWAY)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    gateway_name VARCHAR(50) NOT NULL DEFAULT 'mercadopago', -- 'mercadopago', 'pagarme'
    gateway_payment_id VARCHAR(120),
    method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    amount_cents INT NOT NULL CHECK (amount_cents > 0),
    split_platform_cents INT NOT NULL DEFAULT 0,
    split_artisan_cents INT NOT NULL DEFAULT 0,
    pix_qr_code TEXT,
    pix_copy_paste TEXT,
    paid_at TIMESTAMPTZ,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_payments
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 17. REPASSES FINANCEIROS PARA ARTESÃS (PAYOUT ENGINE)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artisan_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID NOT NULL REFERENCES public.artesans(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount_cents INT NOT NULL CHECK (amount_cents > 0),
    fee_deducted_cents INT NOT NULL DEFAULT 0,
    net_payout_cents INT NOT NULL CHECK (net_payout_cents > 0),
    pix_key_destination VARCHAR(120),
    gateway_transfer_id VARCHAR(120),
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'processing', 'transferred', 'failed'
    scheduled_for DATE NOT NULL,
    transferred_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 18. AVALIAÇÕES DE PRODUTOS E ARTESÃS (REPUTAÇÃO)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    is_verified_purchase BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 19. B2B: MATERIAIS DOS FORNECEDORES (Argila, Linhas, Madeiras)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.supplier_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    price_cents INT NOT NULL CHECK (price_cents > 0),
    unit VARCHAR(40) NOT NULL, -- ex: "kg", "rolo 500g", "novelo", "bobina 1kg", "peça"
    min_order_qty INT NOT NULL DEFAULT 1 CHECK (min_order_qty > 0),
    stock_qty INT NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    stock_status VARCHAR(60) NOT NULL DEFAULT 'Em estoque / Pronta entrega',
    location VARCHAR(80) NOT NULL,
    image_url TEXT NOT NULL,
    batch_code VARCHAR(50), -- Código de Lote (ex: #LT-2026-A4)
    shade_tone VARCHAR(80), -- Tonalidade/Banho (ex: "Banho 12 - Terracota Queimado")
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_supplier_materials
BEFORE UPDATE ON public.supplier_materials
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 20. B2B: DEMANDAS DE INSUMOS DAS ARTESÃS (MURAL DE COMPRAS COLETIVAS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.material_demands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID NOT NULL REFERENCES public.artesans(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    details TEXT NOT NULL,
    category VARCHAR(80) NOT NULL,
    quantity VARCHAR(80) NOT NULL,
    deadline_days INT NOT NULL DEFAULT 7 CHECK (deadline_days > 0),
    status demand_status NOT NULL DEFAULT 'open',
    quotes_count INT NOT NULL DEFAULT 0 CHECK (quotes_count >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_material_demands
BEFORE UPDATE ON public.material_demands
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 21. B2B: COTAÇÕES E PROPOSTAS DOS FORNECEDORES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.supplier_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demand_id UUID NOT NULL REFERENCES public.material_demands(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    price_cents INT NOT NULL CHECK (price_cents > 0),
    shipping_cents INT NOT NULL DEFAULT 0 CHECK (shipping_cents >= 0),
    shipping_days INT NOT NULL CHECK (shipping_days >= 0),
    notes TEXT,
    status quote_status NOT NULL DEFAULT 'sent',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_supplier_quotes
BEFORE UPDATE ON public.supplier_quotes
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 22. CHAT EM TEMPO REAL: CONVERSAS & MENSAGENS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID NOT NULL REFERENCES public.artesans(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    last_message TEXT,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    client_unread_count INT NOT NULL DEFAULT 0,
    artisan_unread_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (artisan_id, client_id, product_id)
);

CREATE TRIGGER set_timestamp_conversations
BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 23. CALCULADORA DE PRECIFICAÇÃO DA ARTESÃ (HISTÓRICO SALVO)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artisan_pricing_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID NOT NULL REFERENCES public.artesans(id) ON DELETE CASCADE,
    piece_title VARCHAR(150) NOT NULL,
    raw_materials_cost_cents INT NOT NULL DEFAULT 0,
    hours_worked NUMERIC(6, 2) NOT NULL DEFAULT 0,
    hourly_rate_cents INT NOT NULL DEFAULT 0,
    packaging_cost_cents INT NOT NULL DEFAULT 0,
    fixed_overhead_cents INT NOT NULL DEFAULT 0,
    desired_profit_percent NUMERIC(5, 2) NOT NULL DEFAULT 30.00,
    platform_fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    suggested_price_cents INT NOT NULL DEFAULT 0,
    applied_to_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 24. INCLUSÃO DIGITAL: CADASTRO ASSISTIDO DA ARTESÃ
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assisted_signup_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_name VARCHAR(150) NOT NULL,
    phone_whatsapp VARCHAR(25) NOT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(2) NOT NULL,
    craft_type VARCHAR(100) NOT NULL,
    preferred_channel VARCHAR(30) NOT NULL DEFAULT 'whatsapp', -- 'whatsapp', 'call'
    preferred_time VARCHAR(50),
    status assisted_signup_status NOT NULL DEFAULT 'pending',
    assigned_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    agent_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_assisted_signup
BEFORE UPDATE ON public.assisted_signup_requests
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 25. SOLICITAÇÕES DE PEÇAS SOB ENCOMENDA (CUSTOM COMMISSIONS)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_piece_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID NOT NULL REFERENCES public.artesans(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_name VARCHAR(150) NOT NULL,
    client_contact VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    dimensions VARCHAR(80),
    color_palette VARCHAR(100),
    status custom_piece_status NOT NULL DEFAULT 'pending',
    quoted_price_cents INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_custom_piece_requests
BEFORE UPDATE ON public.custom_piece_requests
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 26. CONFIGURAÇÕES GLOBAIS DA PLATAFORMA
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key VARCHAR(60) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 27. ÍNDICES DE PERFORMANCE E BUSCA FULL-TEXT (PG_TRGM)
-- ============================================================================
-- Índices para integridade e junções frequentes
CREATE INDEX IF NOT EXISTS idx_artesans_profile ON public.artesans(profile_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_profile ON public.suppliers(profile_id);
CREATE INDEX IF NOT EXISTS idx_products_artisan ON public.products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_artisan ON public.order_items(artisan_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_quotes_demand ON public.supplier_quotes(demand_id);
CREATE INDEX IF NOT EXISTS idx_supplier_materials_category ON public.supplier_materials(category);

-- Busca Textual Ultra-Rápida com trigramas (Fuzzy Search para o catálogo)
CREATE INDEX IF NOT EXISTS idx_products_title_trgm ON public.products USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_materials_gin ON public.products USING gin (materials);
CREATE INDEX IF NOT EXISTS idx_materials_name_trgm ON public.supplier_materials USING gin (name gin_trgm_ops);

-- ============================================================================
-- 28. TRIGGERS INTELIGENTES DE NEGÓCIO (BUSINESS LOGIC AUTOMATION)
-- ============================================================================

-- A. Atualização atômica de estoque e faturamento da artesã ao pagar o pedido
CREATE OR REPLACE FUNCTION process_order_payment()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
BEGIN
    -- Quando o pedido transiciona para 'paid'
    IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
        FOR item IN SELECT product_id, quantity, artisan_id, item_subtotal_cents 
                    FROM public.order_items 
                    WHERE order_id = NEW.id LOOP
            -- Decrementa o estoque físico
            UPDATE public.inventory
            SET stock_quantity = GREATEST(0, stock_quantity - item.quantity),
                reserved_quantity = GREATEST(0, reserved_quantity - item.quantity)
            WHERE product_id = item.product_id;

            -- Incrementa contador de vendas no produto
            UPDATE public.products
            SET sales_count = sales_count + item.quantity
            WHERE id = item.product_id;

            -- Atualiza receita e volume de vendas da artesã
            UPDATE public.artesans
            SET total_sales = total_sales + item.quantity,
                revenue_cents = revenue_cents + (item.item_subtotal_cents * 0.9)::BIGINT -- 90% artesã
            WHERE id = item.artisan_id;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_order_paid_stock ON public.orders;
CREATE TRIGGER trigger_order_paid_stock
AFTER UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION process_order_payment();

-- B. Atualização da média de avaliações após nova avaliação de produto
CREATE OR REPLACE FUNCTION update_product_and_artisan_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_artisan_id UUID;
    new_product_avg NUMERIC(3, 2);
    new_product_count INT;
    new_artisan_avg NUMERIC(3, 2);
BEGIN
    -- Média e contagem do produto
    SELECT ROUND(AVG(rating), 2), COUNT(*)
    INTO new_product_avg, new_product_count
    FROM public.product_reviews
    WHERE product_id = NEW.product_id;

    UPDATE public.products
    SET rating_avg = COALESCE(new_product_avg, 5.00),
        reviews_count = new_product_count
    WHERE id = NEW.product_id
    RETURNING artisan_id INTO target_artisan_id;

    -- Média geral da artesã
    SELECT ROUND(AVG(rating_avg), 2)
    INTO new_artisan_avg
    FROM public.products
    WHERE artisan_id = target_artisan_id AND reviews_count > 0;

    IF new_artisan_avg IS NOT NULL THEN
        UPDATE public.artesans
        SET rating_avg = new_artisan_avg
        WHERE id = target_artisan_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_review_ratings ON public.product_reviews;
CREATE TRIGGER trigger_review_ratings
AFTER INSERT OR UPDATE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION update_product_and_artisan_rating();

-- C. Atualização da conversa com a última mensagem enviada
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
DECLARE
    conv RECORD;
BEGIN
    SELECT artisan_id, client_id INTO conv
    FROM public.conversations
    WHERE id = NEW.conversation_id;

    IF NEW.sender_id = conv.client_id THEN
        -- Mensagem enviada pelo cliente: incrementa não lidas da artesã
        UPDATE public.conversations
        SET last_message = NEW.content,
            last_message_at = NEW.created_at,
            artisan_unread_count = artisan_unread_count + 1,
            updated_at = NOW()
        WHERE id = NEW.conversation_id;
    ELSE
        -- Mensagem enviada pela artesã: incrementa não lidas do cliente
        UPDATE public.conversations
        SET last_message = NEW.content,
            last_message_at = NEW.created_at,
            client_unread_count = client_unread_count + 1,
            updated_at = NOW()
        WHERE id = NEW.conversation_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_message_sent ON public.messages;
CREATE TRIGGER trigger_message_sent
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ============================================================================
-- 29. POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS)
-- Isolamento absoluto de dados entre Compradores, Artesãs, Fornecedores e Admins
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artesans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_pricing_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assisted_signup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_piece_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES: Usuário lê o seu e pode atualizar seu próprio perfil
CREATE POLICY "Leitura pública de perfis básicos"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Usuário edita seu próprio perfil"
ON public.profiles FOR UPDATE USING (id = auth.uid());

-- 2. ARTESANS & SUPPLIERS: Leitura pública, edição restrita ao dono
CREATE POLICY "Leitura pública de artesãs"
ON public.artesans FOR SELECT USING (true);

CREATE POLICY "Artesã edita seu próprio estúdio"
ON public.artesans FOR ALL USING (profile_id = auth.uid());

CREATE POLICY "Leitura pública de fornecedores"
ON public.suppliers FOR SELECT USING (true);

CREATE POLICY "Fornecedor edita seus dados cadastrais"
ON public.suppliers FOR ALL USING (profile_id = auth.uid());

-- 3. PRODUTOS & ESTOQUE: Visualização pública, mutação pela artesã dona
CREATE POLICY "Visualização pública de produtos ativos"
ON public.products FOR SELECT USING (is_active = TRUE OR artisan_id IN (
    SELECT id FROM public.artesans WHERE profile_id = auth.uid()
));

CREATE POLICY "Artesã insere seus próprios produtos"
ON public.products FOR INSERT WITH CHECK (
    artisan_id IN (SELECT id FROM public.artesans WHERE profile_id = auth.uid())
);

CREATE POLICY "Artesã atualiza e exclui seus produtos"
ON public.products FOR UPDATE USING (
    artisan_id IN (SELECT id FROM public.artesans WHERE profile_id = auth.uid())
);

CREATE POLICY "Artesã remove seus produtos"
ON public.products FOR DELETE USING (
    artisan_id IN (SELECT id FROM public.artesans WHERE profile_id = auth.uid())
);

CREATE POLICY "Visualização pública de estoque"
ON public.inventory FOR SELECT USING (true);

-- 4. PEDIDOS & ITENS: Cliente vê os seus, Artesã vê pedidos de suas peças
CREATE POLICY "Cliente vê seus próprios pedidos"
ON public.orders FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Artesã vê pedidos com seus itens"
ON public.orders FOR SELECT USING (
    id IN (
        SELECT order_id FROM public.order_items oi
        JOIN public.artesans a ON oi.artisan_id = a.id
        WHERE a.profile_id = auth.uid()
    )
);

CREATE POLICY "Cliente visualiza itens dos seus pedidos"
ON public.order_items FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid())
);

CREATE POLICY "Artesã visualiza itens confeccionados por ela"
ON public.order_items FOR SELECT USING (
    artisan_id IN (SELECT id FROM public.artesans WHERE profile_id = auth.uid())
);

-- 5. CHAT & MENSAGENS: Apenas participantes
CREATE POLICY "Participantes leem suas conversas"
ON public.conversations FOR SELECT USING (
    client_id = auth.uid() OR 
    artisan_id IN (SELECT id FROM public.artesans WHERE profile_id = auth.uid())
);

CREATE POLICY "Participantes leem mensagens da conversa"
ON public.messages FOR SELECT USING (
    conversation_id IN (
        SELECT id FROM public.conversations 
        WHERE client_id = auth.uid() OR artisan_id IN (SELECT id FROM public.artesans WHERE profile_id = auth.uid())
    )
);

CREATE POLICY "Participantes enviam mensagens"
ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- 6. B2B: MATERIAIS, DEMANDAS E COTAÇÕES
CREATE POLICY "Materiais de fornecedores visíveis a todos"
ON public.supplier_materials FOR SELECT USING (true);

CREATE POLICY "Fornecedor gerencia seus próprios materiais"
ON public.supplier_materials FOR ALL USING (
    supplier_id IN (SELECT id FROM public.suppliers WHERE profile_id = auth.uid())
);

CREATE POLICY "Demandas de insumos visíveis a fornecedores e artesãs"
ON public.material_demands FOR SELECT USING (true);

CREATE POLICY "Artesã publica e gerencia suas demandas"
ON public.material_demands FOR ALL USING (
    artisan_id IN (SELECT id FROM public.artesans WHERE profile_id = auth.uid())
);

CREATE POLICY "Fornecedor vê e gerencia suas cotações"
ON public.supplier_quotes FOR ALL USING (
    supplier_id IN (SELECT id FROM public.suppliers WHERE profile_id = auth.uid())
);

CREATE POLICY "Artesã visualiza cotações de suas demandas"
ON public.supplier_quotes FOR SELECT USING (
    demand_id IN (
        SELECT id FROM public.material_demands 
        WHERE artisan_id IN (SELECT id FROM public.artesans WHERE profile_id = auth.uid())
    )
);

-- ============================================================================
-- 30. CARGA INICIAL DE DADOS (SEEDING ESSENCIAL)
-- Categorias Brasileiras, Configurações Globais e Dados Mestres
-- ============================================================================

-- Categorias de Artesanato Nacional
INSERT INTO public.categories (name, slug, description, icon_name, display_order) VALUES
('Cerâmica & Barro', 'ceramica-e-barro', 'Vasos, panelas de barro, utilitários vitrificados e esculturas em argila de alta temperatura', 'Sparkles', 1),
('Renda & Bordado', 'renda-e-bordado', 'Renda de bilro, bordado filé alagoano, ponto cruz, richelieu e tapeçaria manual', 'Feather', 2),
('Fibras Naturais & Palha', 'fibras-naturais', 'Cestarias em carnaúba, palha de buriti, tucum, capim dourado e taboa', 'Wheat', 3),
('Madeira & Marcenaria', 'madeira-e-marcenaria', 'Esculturas entalhadas, gamelas em madeira maciça, cutelaria e marchetaria', 'Hammer', 4),
('Tecelagem & Tear', 'tecelagem-e-tear', 'Mantas em algodão cru, redes artesanais, passadeiras e xales de tear manual', 'Layers', 5),
('Biojoias & Acessórios', 'biojoias-e-acessorios', 'Jóias orgânicas com sementes de açaí, jarina, prata brasileira e capim dourado', 'Gem', 6),
('Macramê & Nós', 'macrame-e-nos', 'Painéis de parede, suportes botânicos para plantas e bolsas em cordão ecológico', 'Anchor', 7)
ON CONFLICT (slug) DO NOTHING;

-- Configurações Globais do Marketplace
INSERT INTO public.platform_settings (key, value, description) VALUES
('commission_percent', '{"value": 10, "unit": "percent"}', 'Taxa retida pela plataforma para manutenção e infraestrutura'),
('escrow_hold_days', '{"value": 7, "unit": "days"}', 'Dias de retenção do valor após a entrega do produto para proteção contra disputas'),
('shipping_carrier_default', '{"provider": "melhor_envio", "mode": "sandbox"}', 'Provedor padrão de cotação e etiquetas de frete'),
('assisted_signup_phone', '{"whatsapp": "+55 85 99876-5432", "hours": "08:00 - 18:00"}', 'Canal oficial do programa de inclusão digital de artesãs')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- FIM DO SCRIPT DE BANCO DE DADOS — ARTENÓS V2.0
-- ============================================================================
