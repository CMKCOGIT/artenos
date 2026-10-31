# load-tests — teste de carga e capacidade

Rotina para medir o limite de usuários simultâneos da plataforma **contra o seu
próprio ambiente** (de preferência staging). Guia completo e checklist de
segurança/LGPD em [`../docs/testes-seguranca-carga.md`](../docs/testes-seguranca-carga.md).

## Pré-requisitos
Instale o k6: https://grafana.com/docs/k6/latest/set-up/install-k6/

## Rodar
```bash
BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=smoke  k6-carga.js   # sanidade
BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=load   k6-carga.js   # carga esperada
BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=stress k6-carga.js   # acha o teto
BASE_URL="https://staging.seu-app.com.br" k6 run -e SCENARIO=spike  k6-carga.js   # surto súbito
```

## Resultado
Cada execução imprime um resumo e grava `resultado-<cenario>.json`. O **limite
de simultâneos** é o nº de VUs no instante em que a latência p95 passa de ~800 ms
e as falhas HTTP passam de ~1% (observe no cenário `stress`).

## ⚠️ Antes de rodar em produção
Vercel/Supabase podem interpretar carga alta como abuso e suspender a conta.
Use staging, ou avise os provedores. Nunca aponte para infraestrutura de terceiros.

> Os arquivos `resultado-*.json` são saída de teste e estão no `.gitignore`.
