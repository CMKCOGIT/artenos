import { z } from 'zod';
import dotenv from 'dotenv';

// Garante carregamento do .env no ambiente Node.js
if (typeof process !== 'undefined') {
  try {
    dotenv.config();
  } catch {
    // Silencioso se estiver no browser
  }
}

/**
 * Esquema de validação para variáveis públicas permitidas no frontend.
 * Estas variáveis podem ser lidas no navegador com segurança.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_URL é obrigatória'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY é obrigatória'),
  NEXT_PUBLIC_APP_URL: z.string().min(1, 'NEXT_PUBLIC_APP_URL é obrigatória'),
});

/**
 * Esquema de validação para variáveis privadas, exclusivas do servidor / Edge Functions.
 * NUNCA devem ser expostas ou acessadas no navegador.
 */
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(''),
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional().default(''),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional().default(''),
  PAGARME_API_KEY: z.string().optional().default(''),
  PAGARME_WEBHOOK_SECRET: z.string().optional().default(''),
  ANTIFRAUD_API_KEY: z.string().optional().default(''),
  REDIS_URL: z.string().optional().default(''),
  REDIS_TOKEN: z.string().optional().default(''),
});

// Helper seguro para obter variáveis de ambiente seja no Node ou no Vite (Browser)
function getEnvVar(key: string, viteFallbackKey?: string): string {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const metaEnv = (import.meta as any).env;
    if (metaEnv[key]) return metaEnv[key];
    if (viteFallbackKey && metaEnv[viteFallbackKey]) return metaEnv[viteFallbackKey];
  }
  return '';
}

/**
 * Variáveis públicas validadas com Zod.
 * Seguras para uso em componentes e serviços do cliente.
 */
export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL:
    getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL') ||
    'https://seu-projeto.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    getEnvVar('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'VITE_SUPABASE_PUBLISHABLE_KEY') ||
    getEnvVar('VITE_SUPABASE_ANON_KEY') ||
    'sb_publishable_placeholder',
  NEXT_PUBLIC_APP_URL:
    getEnvVar('NEXT_PUBLIC_APP_URL', 'VITE_APP_URL') ||
    'http://localhost:3000',
});

/**
 * Variáveis privadas do servidor.
 * Retorna null no navegador para impedir qualquer vazamento de credenciais privadas.
 */
export const serverEnv =
  typeof window === 'undefined'
    ? serverSchema.parse({
        SUPABASE_SERVICE_ROLE_KEY:
          getEnvVar('SUPABASE_SERVICE_ROLE_KEY') ||
          (typeof process !== 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY || '' : ''),
        MERCADOPAGO_ACCESS_TOKEN: getEnvVar('MERCADOPAGO_ACCESS_TOKEN'),
        MERCADOPAGO_WEBHOOK_SECRET: getEnvVar('MERCADOPAGO_WEBHOOK_SECRET'),
        PAGARME_API_KEY: getEnvVar('PAGARME_API_KEY'),
        PAGARME_WEBHOOK_SECRET: getEnvVar('PAGARME_WEBHOOK_SECRET'),
        ANTIFRAUD_API_KEY: getEnvVar('ANTIFRAUD_API_KEY'),
        REDIS_URL: getEnvVar('REDIS_URL'),
        REDIS_TOKEN: getEnvVar('REDIS_TOKEN'),
      })
    : null;

/**
 * Garante que código cliente nunca tente invocar serverEnv.
 */
export function getServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error(
      '[Security Violation] Tentativa de acessar variáveis privadas do servidor (serverEnv) no ambiente do navegador.'
    );
  }
  return serverEnv!;
}
