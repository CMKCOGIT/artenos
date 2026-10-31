import type { Request, Response, NextFunction } from 'express';

/**
 * Rate limiting simples por janela fixa, em memória.
 *
 * Esta é a PRIMEIRA camada de defesa contra abuso dos endpoints /api
 * (martelar webhook, /api/audit, /api/chat/signed-url). É proposital que
 * seja sem dependências para já proteger um deploy de instância única.
 *
 * ⚠️  LIMITAÇÃO: o estado vive na memória do processo. Em ambiente
 * serverless (Vercel) ou com várias instâncias, cada instância tem sua
 * própria contagem. Para limite GLOBAL e persistente, trocar o Map por
 * Redis (REDIS_URL/REDIS_TOKEN já previstos no ambiente) usando um
 * algoritmo de sliding window. Veja docs/testes-seguranca-carga.md (achado A).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimitOptions {
  /** Tamanho da janela em milissegundos. */
  windowMs: number;
  /** Máximo de requisições permitidas por janela, por chave. */
  max: number;
  /** Como derivar a chave (padrão: IP do cliente). */
  keyGenerator?: (req: Request) => string;
}

function clientIp(req: Request): string {
  // Respeita proxy (Vercel) via X-Forwarded-For; cai para o socket.
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'desconhecido';
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max } = options;
  const keyGenerator = options.keyGenerator ?? clientIp;
  const store = new Map<string, Bucket>();

  // Limpeza periódica para não vazar memória com chaves antigas.
  const sweeper = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (bucket.resetAt <= now) store.delete(key);
    }
  }, windowMs);
  // Não impede o processo de encerrar.
  if (typeof sweeper.unref === 'function') sweeper.unref();

  return function rateLimit(req: Request, res: Response, next: NextFunction) {
    const key = keyGenerator(req);
    const now = Date.now();
    let bucket = store.get(key);

    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      store.set(key, bucket);
    }

    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({ error: 'Muitas requisições. Tente novamente em instantes.' });
    }

    next();
  };
}
