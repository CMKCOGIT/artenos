import { z } from 'zod';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente exclusivamente em ambiente Node.js
if (typeof process !== 'undefined') {
  dotenv.config();
}

/**
 * Esquema de validação para variáveis de servidor (Express / Supabase Edge Functions).
 * Este arquivo NUNCA deve ser importado em componentes ou módulos do navegador.
 */
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),
  SUPABASE_URL: z.string().optional().default(''),
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional().default(''),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional().default(''),
  PAGARME_API_KEY: z.string().optional().default(''),
  PAGARME_WEBHOOK_SECRET: z.string().optional().default(''),
  ANTIFRAUD_API_KEY: z.string().optional().default(''),
  PORT: z.string().optional().default('3000'),
});

export const serverEnv = serverEnvSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  MERCADOPAGO_WEBHOOK_SECRET: process.env.MERCADOPAGO_WEBHOOK_SECRET || '',
  PAGARME_API_KEY: process.env.PAGARME_API_KEY || '',
  PAGARME_WEBHOOK_SECRET: process.env.PAGARME_WEBHOOK_SECRET || '',
  ANTIFRAUD_API_KEY: process.env.ANTIFRAUD_API_KEY || '',
  PORT: process.env.PORT || '3000',
});
