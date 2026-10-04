import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { publicEnv } from '../env';

/**
 * Cliente Supabase seguro para uso exclusivo no Frontend.
 * Utiliza apenas variáveis públicas declaradas e validadas em publicEnv.
 * NUNCA utilize ou importe a chave service_role neste cliente.
 */
const supabaseUrl = publicEnv.VITE_SUPABASE_URL;
const supabasePublishableKey = publicEnv.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient<any> = createClient<any>(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Verifica se as credenciais públicas do Supabase estão configuradas via ambiente.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    supabasePublishableKey &&
    !supabasePublishableKey.includes('placeholder') &&
    !supabaseUrl.includes('placeholder')
  );
}

/**
 * Teste interno de integridade de conexão com o banco.
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  categoriesCount?: number;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase não configurado nas variáveis de ambiente.',
    };
  }

  try {
    const { data, error, count } = await supabase
      .from('categories')
      .select('id, name, slug', { count: 'exact' })
      .limit(10);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: 'Conexão ativa.',
      categoriesCount: count ?? data?.length ?? 0,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Erro de rede.',
    };
  }
}
