/**
 * Utilitário de log seguro com mascaramento automático de credenciais e tokens.
 * Impede que tokens JWT, senhas, chaves de API ou segredos apareçam em consoles ou relatórios de erro.
 */

const SENSITIVE_PATTERNS = [
  /sb_secret_[a-zA-Z0-9_\-]+/gi,
  /sb_publishable_[a-zA-Z0-9_\-]+/gi,
  /eyJ[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+/gi, // JWTs
  /whsec_[a-zA-Z0-9_\-]+/gi,
  /ak_live_[a-zA-Z0-9_\-]+/gi,
  /APP_USR-[a-zA-Z0-9_\-]+/gi,
  /password["':\s]+["']?([^"',\s}]+)/gi,
  /bearer\s+[a-zA-Z0-9_\-\.]+/gi,
];

export function maskSecrets(message: string): string {
  if (typeof message !== 'string') {
    try {
      message = JSON.stringify(message);
    } catch {
      return '[Unserializable Message]';
    }
  }

  let sanitized = message;

  for (const pattern of SENSITIVE_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match) => {
      if (match.length <= 10) return '***';
      return `${match.substring(0, 4)}...***...${match.substring(match.length - 3)}`;
    });
  }

  return sanitized;
}

export const logger = {
  info: (msg: string, ...args: any[]) => {
    const sanitizedMsg = maskSecrets(msg);
    const sanitizedArgs = args.map((arg) => (typeof arg === 'string' ? maskSecrets(arg) : arg));
    console.log(`[INFO] ${sanitizedMsg}`, ...sanitizedArgs);
  },
  warn: (msg: string, ...args: any[]) => {
    const sanitizedMsg = maskSecrets(msg);
    const sanitizedArgs = args.map((arg) => (typeof arg === 'string' ? maskSecrets(arg) : arg));
    console.warn(`[WARN] ${sanitizedMsg}`, ...sanitizedArgs);
  },
  error: (msg: string, ...args: any[]) => {
    const sanitizedMsg = maskSecrets(msg);
    const sanitizedArgs = args.map((arg) => (typeof arg === 'string' ? maskSecrets(arg) : arg));
    console.error(`[ERROR] ${sanitizedMsg}`, ...sanitizedArgs);
  },
  sanitizeError: (err: any): string => {
    const message = err?.message || 'Erro interno';
    return maskSecrets(message);
  },
};
