/**
 * Artenós — Teste de carga DIRETO no banco (Supabase REST / PostgREST)
 * ===================================================================
 *
 * Por que este arquivo existe:
 * No app, o catálogo é lido pelo NAVEGADOR direto no Supabase
 * (supabase.from('products')...), não pelo servidor Express. Então para medir
 * a carga REAL no Postgres é preciso bater no REST do Supabase, reproduzindo a
 * mesma consulta que o getProducts() faz. É isto que estressa o banco, o pool
 * de conexões e as políticas de RLS.
 *
 * ⚠️  ESCOPO: use a ANON KEY (pública, respeita RLS) do SEU projeto, de
 * preferência um projeto de STAGING separado do de produção. Carga alta no
 * projeto de produção pode disparar a proteção anti-abuso do Supabase.
 *
 * Como rodar (você já instalou o k6):
 *   SUPABASE_URL="https://SEU-PROJETO.supabase.co" \
 *   SUPABASE_ANON_KEY="sb_publishable_... (ou anon key)" \
 *   k6 run -e SCENARIO=stress load-tests/k6-supabase-db.js
 *
 * Cenários: smoke | load | stress | spike  (iguais ao outro script)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const SUPABASE_URL = (__ENV.SUPABASE_URL || '').replace(/\/$/, '');
const ANON_KEY = __ENV.SUPABASE_ANON_KEY || '';
const SCENARIO = __ENV.SCENARIO || 'smoke';

const dbLatency = new Trend('latencia_banco', true);

if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error('Defina SUPABASE_URL e SUPABASE_ANON_KEY (-e ou variáveis de ambiente).');
}

// Mesma consulta do getProducts(): produtos ativos + joins, ordenados por data.
// O embed (artesans/categories/inventory) é o que deixa a query cara.
const SELECT = [
  '*',
  'artesans(id,studio_name,location_city,location_state,avatar_url,profiles(full_name))',
  'categories(id,name,slug)',
  'inventory(stock_quantity,reserved_quantity)',
].join(',');

// Teto de 500 espelha o MAX_PAGE_SIZE do app (products.service.ts).
const CATALOGO_URL =
  `${SUPABASE_URL}/rest/v1/products` +
  `?select=${encodeURIComponent(SELECT)}` +
  `&is_active=eq.true&order=created_at.desc&limit=500`;

const CENARIOS = {
  smoke: { executor: 'constant-vus', vus: 3, duration: '1m' },
  load: {
    executor: 'ramping-vus', startVUs: 0,
    stages: [{ duration: '2m', target: 50 }, { duration: '5m', target: 50 }, { duration: '2m', target: 0 }],
    gracefulRampDown: '30s',
  },
  stress: {
    executor: 'ramping-vus', startVUs: 0,
    stages: [
      { duration: '2m', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '2m', target: 200 },
      { duration: '2m', target: 400 },
      { duration: '2m', target: 0 },
    ],
    gracefulRampDown: '30s',
  },
  spike: {
    executor: 'ramping-vus', startVUs: 0,
    stages: [{ duration: '10s', target: 300 }, { duration: '1m', target: 300 }, { duration: '20s', target: 0 }],
    gracefulRampDown: '10s',
  },
};

export const options = {
  scenarios: { [SCENARIO]: CENARIOS[SCENARIO] },
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<3000'],
    http_req_failed: ['rate<0.02'],
  },
};

const headers = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  Accept: 'application/json',
  // Pede só a contagem exata do range retornado (sem custo de COUNT total).
  Prefer: 'count=none',
};

export default function () {
  const res = http.get(CATALOGO_URL, { headers, tags: { name: 'catalogo_db' } });
  dbLatency.add(res.timings.duration);

  check(res, {
    'status 200': (r) => r.status === 200,
    'não é 401/403 (RLS/chave ok)': (r) => r.status !== 401 && r.status !== 403,
    'não é 429 (limite do Supabase)': (r) => r.status !== 429,
    'latência < 2s': (r) => r.timings.duration < 2000,
  });

  // Pausa humana entre navegações.
  sleep(Math.random() * 2 + 1);
}

export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration?.values['p(95)'] ?? 0;
  const falhas = (data.metrics.http_req_failed?.values.rate ?? 0) * 100;
  return {
    stdout: `
========================================================
 BANCO (Supabase) — cenário: ${SCENARIO}
========================================================
 Requisições : ${data.metrics.http_reqs?.values.count ?? 0}
 p95         : ${p95.toFixed(0)} ms
 Falhas      : ${falhas.toFixed(2)} %
--------------------------------------------------------
 👉 Observe EM PARALELO no painel do Supabase:
    Database > Connections (pool saturou?) e
    Reports/Query Performance (query lenta?).
    O "limite" é o nº de VUs quando p95 dispara ou
    aparecem 429/500.
========================================================
`,
    ['load-tests/resultado-db-' + SCENARIO + '.json']: JSON.stringify(data, null, 2),
  };
}
