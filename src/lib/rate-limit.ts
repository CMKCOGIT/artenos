import type { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { logger } from './logger';

/**
 * Rate limiting por janela fixa.
 *
 * Primeira camada de defesa contra abuso dos endpoints /api (martelar webhook,
 * /api/audit, /api/chat/signed-url).
 *
 * - Com REDIS_URL configurado: contagem GLOBAL e persistente no Redis (vale
 *   para múltiplas instâncias / serverless). Usa INCR + PEXPIRE atômicos.
 * - Sem Redis: fallback em memória (ok para instância única).
 *
 * FAIL-OPEN: se o Redis estiver indisponível, a requisição é LIBERADA em vez
 * de bloqueada — preferimos não derrubar tráfego legítimo por causa de uma
 * falha de infraestrutura. O limiter em memória continua valendo nesse caso.
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
  /** Prefixo da chave no Redis (isola limiters diferentes). */
  prefix?: string;
  /** Como derivar a chave (padrão: IP do cliente). */
  keyGenerator?: (req: Request) => string;
  /** Instância Redis opcional (compartilhada entre limiters). */
  redis?: Redis | null;
}

function clientIp(req: Request): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'desconhecido';
}

/**
 * Cria uma conexão Redis única a partir do ambiente, ou null se não configurado.
 * lazyConnect + fail-open: erros de conexão não derrubam o processo.
 */
let sharedRedis: Redis | null | undefined;
export function getRedis(url: string, token?: string): Redis | null {
  if (sharedRedis !== undefined) return sharedRedis;
  if (!url) {
    sharedRedis = null;
    return null;
  }
  try {
    sharedRedis = new Redis(url, {
      password: token || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });
    sharedRedis.on('error', (err) => {
      logger.warn('Redis indisponível (rate limit cai para memória):', logger.sanitizeError(err));
    });
    sharedRedis.connect().catch(() => { /* fail-open: tratado no on('error') */ });
    return sharedRedis;
  } catch (err: any) {
    logger.warn('Falha ao iniciar Redis:', logger.sanitizeError(err));
    sharedRedis = null;
    return null;
  }
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max } = options;
  const prefix = options.prefix ?? 'rl';
  const keyGenerator = options.keyGenerator ?? clientIp;
  const redis = options.redis ?? null;

  // Fallback em memória (também usado se o Redis falhar).
  const store = new Map<string, Bucket>();
  const sweeper = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store) {
      if (bucket.resetAt <= now) store.delete(key);
    }
  }, windowMs);
  if (typeof sweeper.unref === 'function') sweeper.unref();

  function memoryHit(key: string): { over: boolean; resetAt: number; remaining: number } {
    const now = Date.now();
    let bucket = store.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      store.set(key, bucket);
    }
    bucket.count += 1;
    return { over: bucket.count > max, resetAt: bucket.resetAt, remaining: Math.max(0, max - bucket.count) };
  }

  async function redisHit(key: string): Promise<{ over: boolean; resetAt: number; remaining: number }> {
    // INCR e, no primeiro hit, define expiração da janela. Atômico o bastante
    // para rate limit (o PEXPIRE só na criação evita reset da janela).
    const redisKey = `${prefix}:${key}`;
    const count = await redis!.incr(redisKey);
    if (count === 1) {
      await redis!.pexpire(redisKey, windowMs);
    }
    const ttl = await redis!.pttl(redisKey);
    const resetAt = Date.now() + (ttl > 0 ? ttl : windowMs);
    return { over: count > max, resetAt, remaining: Math.max(0, max - count) };
  }

  return function rateLimit(req: Request, res: Response, next: NextFunction) {
    const key = keyGenerator(req);

    const apply = (r: { over: boolean; resetAt: number; remaining: number }) => {
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(r.remaining));
      res.setHeader('X-RateLimit-Reset', String(Math.ceil(r.resetAt / 1000)));
      if (r.over) {
        const retryAfter = Math.ceil((r.resetAt - Date.now()) / 1000);
        res.setHeader('Retry-After', String(Math.max(1, retryAfter)));
        return res.status(429).json({ error: 'Muitas requisições. Tente novamente em instantes.' });
      }
      return next();
    };

    if (redis && redis.status === 'ready') {
      redisHit(key)
        .then(apply)
        .catch(() => apply(memoryHit(key))); // fail-open para memória
      return;
    }

    return apply(memoryHit(key));
  };
}
