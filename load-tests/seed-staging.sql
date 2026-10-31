-- ============================================================================
-- SEED de dados de teste para carga — RODAR APENAS EM STAGING
-- ============================================================================
-- Cria dados fake (categorias, artesãs e produtos) para o teste de carga ter
-- o que ler. NÃO rode em produção: insere lixo no catálogo.
--
-- Pré-requisito: rodar antes o database/schema.sql no projeto novo (cria as
-- tabelas, RLS e índices).
--
-- Como usar:
--   1. Abra o SQL Editor do projeto de STAGING no Supabase.
--   2. Cole e rode este arquivo UMA vez.
--   3. (No SQL Editor você roda como admin, então o RLS não bloqueia os inserts.)
--
-- Ajuste os números abaixo se quiser mais/menos volume:
--   12 categorias, 50 artesãs, 2000 produtos.
-- ============================================================================

BEGIN;

-- 1. Categorias de teste --------------------------------------------------------
INSERT INTO public.categories (name, slug, display_order)
SELECT 'Categoria Teste ' || g, 'seed-cat-' || g, g
FROM generate_series(1, 12) g
ON CONFLICT (slug) DO NOTHING;

-- 2. Perfis (role artisan) + artesãs -------------------------------------------
WITH novos_perfis AS (
  INSERT INTO public.profiles (email, full_name, role)
  SELECT 'seed+' || g || '@teste.local', 'Artesã Teste ' || g, 'artisan'
  FROM generate_series(1, 50) g
  ON CONFLICT (email) DO NOTHING
  RETURNING id
)
INSERT INTO public.artesans (profile_id, studio_name, bio, story, location_city, location_state)
SELECT id, 'Estúdio Teste', 'Bio de teste.', 'História de teste.', 'São Paulo', 'SP'
FROM novos_perfis;

-- 3. Produtos (distribuídos entre as artesãs/categorias por módulo) ------------
WITH arts AS (
  SELECT id, (row_number() OVER (ORDER BY created_at) - 1) AS idx
  FROM public.artesans
),
cats AS (
  SELECT id, (row_number() OVER (ORDER BY id) - 1) AS idx
  FROM public.categories WHERE slug LIKE 'seed-cat-%'
),
n_arts AS (SELECT count(*)::int AS c FROM arts),
n_cats AS (SELECT count(*)::int AS c FROM cats)
INSERT INTO public.products
  (artisan_id, category_id, title, slug, description, price_cents, image_url, materials, is_ready_to_ship)
SELECT
  a.id,
  c.id,
  'Produto Teste ' || g,
  'seed-prod-' || g,
  'Descrição de teste para carga. Peça artesanal fictícia.',
  (1000 + (random() * 50000))::int,                  -- R$ 10,00 a R$ 510,00
  'https://picsum.photos/seed/' || g || '/800/600',
  ARRAY['madeira', 'algodão'],
  (random() > 0.3)
FROM generate_series(1, 2000) g
JOIN arts a ON a.idx = g % (SELECT c FROM n_arts)
JOIN cats c ON c.idx = g % (SELECT c FROM n_cats);

-- 4. Estoque dos produtos de teste ---------------------------------------------
INSERT INTO public.inventory (product_id, stock_quantity)
SELECT id, (1 + random() * 20)::int
FROM public.products WHERE slug LIKE 'seed-prod-%'
ON CONFLICT (product_id) DO NOTHING;

COMMIT;

-- Confirmação
SELECT
  (SELECT count(*) FROM public.products  WHERE slug  LIKE 'seed-prod-%') AS produtos_teste,
  (SELECT count(*) FROM public.artesans) AS artesas,
  (SELECT count(*) FROM public.categories WHERE slug LIKE 'seed-cat-%') AS categorias_teste;

-- ============================================================================
-- LIMPEZA (rode isto para apagar TODOS os dados de teste depois)
-- ============================================================================
-- BEGIN;
--   DELETE FROM public.products  WHERE slug  LIKE 'seed-prod-%';   -- inventory cai em cascata
--   DELETE FROM public.artesans  WHERE profile_id IN
--     (SELECT id FROM public.profiles WHERE email LIKE 'seed+%@teste.local');
--   DELETE FROM public.profiles  WHERE email LIKE 'seed+%@teste.local';
--   DELETE FROM public.categories WHERE slug LIKE 'seed-cat-%';
-- COMMIT;
