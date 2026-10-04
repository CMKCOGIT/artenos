import { z } from 'zod';

/**
 * Esquema de validação para variáveis públicas do frontend (Vite).
 * Apenas variáveis com prefixo VITE_ são expostas ao navegador.
 * NENHUM segredo de servidor deve ser importado ou referenciado aqui.
 */
const publicEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL deve ser uma URL válida').optional().default('https://seu-projeto.supabase.co'),
  VITE_SUPABASE_ANON_KEY: z.string().optional().default(''),
  VITE_APP_URL: z.string().optional().default('http://localhost:3000'),
});

const rawPublicEnv = {
  VITE_SUPABASE_URL: (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '').trim(),
  VITE_SUPABASE_ANON_KEY: (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim(),
  VITE_APP_URL: (import.meta.env.VITE_APP_URL || import.meta.env.NEXT_PUBLIC_APP_URL || '').trim(),
};

export const publicEnv = publicEnvSchema.parse(rawPublicEnv);

/**
 * Indicador seguro se as credenciais mínimas públicas do Supabase foram configuradas
 */
export const isConfigured = Boolean(
  publicEnv.VITE_SUPABASE_URL &&
  !publicEnv.VITE_SUPABASE_URL.includes('seu-projeto') &&
  publicEnv.VITE_SUPABASE_ANON_KEY &&
  !publicEnv.VITE_SUPABASE_ANON_KEY.includes('sua_chave')
);
