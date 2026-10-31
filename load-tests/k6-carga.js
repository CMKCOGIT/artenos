/**
 * Artenós — Rotina de teste de carga / estresse / capacidade
 * =========================================================
 *
 * Ferramenta: k6 (https://k6.io). NÃO é um ataque DDoS — é um teste de
 * capacidade CONTRA A SUA PRÓPRIA infraestrutura, para descobrir o limite
 * de usuários simultâneos e o "joelho" de desempenho antes dos clientes
 * reais o encontrarem.
 *
 * ⚠️  REGRAS DE USO (leia antes de rodar):
 *   1. Rode SOMENTE contra um ambiente SEU (de preferência STAGING, um
 *      projeto Supabase separado do de produção). Nunca contra sites de
 *      terceiros.
 *   2. Avise seus provedores se for gerar carga alta em produção:
 *      Vercel e Supabase têm proteção anti-abuso e podem interpretar
 *      um teste pesado como ataque e suspender a conta.
 *   3. Comece pelo cenário "smoke" e suba gradualmente.
 *
 * Como rodar:
 *   # 1. Instale o k6:  https://grafana.com/docs/k6/latest/set-up/install-k6/
 *   # 2. Aponte para o SEU ambiente e escolha o cenário:
 *
 *   BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=smoke  load-tests/k6-carga.js
 *   BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=load   load-tests/k6-carga.js
 *   BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=stress load-tests/k6-carga.js
 *   BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=spike  load-tests/k6-carga.js
 *
 * Interpretação:
 *   - O ponto onde a latência p95 dispara e os erros começam a aparecer é
 *     o seu LIMITE de usuários simultâneos (o "joelho" da curva).
 *   - Anote quantos VUs (usuários virtuais) estavam ativos nesse momento.
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const SCENARIO = __ENV.SCENARIO || 'smoke';

// Métricas customizadas
const errorRate = new Rate('erros_negocio');
const apiLatency = new Trend('latencia_api', true);
const requisicoesPesadas = new Counter('requisicoes_catalogo');

// ---------------------------------------------------------------------------
// Cenários — do mais leve ao mais agressivo.
// ---------------------------------------------------------------------------
const CENARIOS = {
  // Sanidade: pouca carga, confirma que o teste e o ambiente funcionam.
  smoke: {
    executor: 'constant-vus',
    vus: 3,
    duration: '1m',
  },
  // Carga nominal: simula o tráfego que você ESPERA ter em um dia normal.
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 50 },   // sobe para 50 usuários
      { duration: '5m', target: 50 },   // mantém (platô)
      { duration: '2m', target: 0 },    // desce
    ],
    gracefulRampDown: '30s',
  },
  // Estresse: sobe até quebrar, para achar o TETO de capacidade.
  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 100 },
      { duration: '3m', target: 200 },
      { duration: '3m', target: 400 },
      { duration: '3m', target: 800 },  // onde p95 estourar = seu limite
      { duration: '2m', target: 0 },
    ],
    gracefulRampDown: '30s',
  },
  // Pico (resiliência a surto / "efeito DDoS legítimo"): salto repentino,
  // simula uma campanha/influencer mandando muita gente de uma vez.
  spike: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '10s', target: 500 },  // surto súbito
      { duration: '1m', target: 500 },
      { duration: '10s', target: 0 },    // recuo e observa recuperação
      { duration: '1m', target: 0 },
    ],
    gracefulRampDown: '10s',
  },
};

export const options = {
  scenarios: { [SCENARIO]: CENARIOS[SCENARIO] },
  thresholds: {
    // Metas de qualidade: se violar, o k6 marca o teste como "failed".
    http_req_duration: ['p(95)<800', 'p(99)<2000'], // 95% abaixo de 800ms
    http_req_failed: ['rate<0.01'],                  // < 1% de falhas HTTP
    erros_negocio: ['rate<0.05'],
  },
};

// ---------------------------------------------------------------------------
// Jornada do usuário anônimo (o caminho mais comum e mais pesado no banco).
// Ajuste os endpoints conforme sua API real (ver observações no README).
// ---------------------------------------------------------------------------
export default function () {
  group('1. Home / catálogo (leitura pesada no banco)', () => {
    // Esta é a chamada mais cara: hoje getProducts() NÃO tem paginação,
    // então puxa a tabela products inteira + joins a cada acesso.
    const res = http.get(`${BASE_URL}/`, {
      tags: { name: 'home' },
    });
    requisicoesPesadas.add(1);
    apiLatency.add(res.timings.duration);
    const ok = check(res, {
      'home respondeu 200': (r) => r.status === 200,
      'home < 1.5s': (r) => r.timings.duration < 1500,
    });
    errorRate.add(!ok);
  });

  sleep(Math.random() * 2 + 1); // pensa de 1 a 3s (comportamento humano)

  group('2. Endpoint de API (ex.: webhook deve REJEITAR sem assinatura)', () => {
    // Testa que o webhook rejeita rápido (401) ANTES de tocar o banco —
    // é a sua primeira linha de defesa contra abuso do endpoint público.
    const res = http.post(
      `${BASE_URL}/api/webhooks/mercadopago`,
      JSON.stringify({ data: { id: '123' } }),
      { headers: { 'Content-Type': 'application/json' }, tags: { name: 'webhook_sem_assinatura' } }
    );
    check(res, {
      'webhook rejeita sem assinatura (401)': (r) => r.status === 401,
    });
  });

  sleep(Math.random() * 3 + 2);
}

export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration?.values['p(95)'] ?? 0;
  const falhas = (data.metrics.http_req_failed?.values.rate ?? 0) * 100;
  const resumo = `
========================================================
 RESUMO — cenário: ${SCENARIO}
========================================================
 Requisições totais : ${data.metrics.http_reqs?.values.count ?? 0}
 Latência p95       : ${p95.toFixed(0)} ms
 Falhas HTTP        : ${falhas.toFixed(2)} %
--------------------------------------------------------
 👉 O "limite" de simultâneos é o nº de VUs no momento em
    que a p95 dispara e as falhas passam de ~1%.
    Rode 'stress' e observe em qual stage isso acontece.
========================================================
`;
  return {
    stdout: resumo,
    ['load-tests/resultado-' + SCENARIO + '.json']: JSON.stringify(data, null, 2),
  };
}
