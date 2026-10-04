import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { AuthUser, RegisterPayload, UserRole } from '../types';

export class AuthService {
  /**
   * Autenticação de usuário com Supabase Auth.
   */
  static async login(credentials: {
    email: string;
    password?: string;
    role: UserRole;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Conecte o Supabase para realizar login e gerenciar sua sessão com segurança.',
      };
    }

    try {
      if (!credentials.password) {
        return { success: false, error: 'Informe a senha para autenticar.' };
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (authError || !authData.user) {
        return {
          success: false,
          error: authError?.message || 'Credenciais inválidas. Verifique seu e-mail e senha.',
        };
      }

      // Buscar perfil na tabela public.profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      const role = (profile?.role || credentials.role) as UserRole;
      let artisanData: any = null;
      let supplierData: any = null;

      if (role === 'artisan') {
        const { data: art } = await supabase.from('artesans').select('*').eq('profile_id', authData.user.id).maybeSingle();
        artisanData = art;
      } else if (role === 'supplier') {
        const { data: sup } = await supabase.from('suppliers').select('*').eq('profile_id', authData.user.id).maybeSingle();
        supplierData = sup;
      }

      const user: AuthUser = {
        id: authData.user.id,
        name: profile?.full_name || authData.user.user_metadata?.full_name || 'Usuário Artenós',
        email: authData.user.email || credentials.email,
        role,
        avatarUrl: profile?.avatar_url || authData.user.user_metadata?.avatar_url,
        phone: profile?.phone || undefined,
        cpf: profile?.cpf_cnpj || undefined,
        studioName: artisanData?.studio_name,
        specialties: artisanData?.specialties,
        location: artisanData ? [artisanData.location_city, artisanData.location_state].filter(Boolean).join(' - ') : undefined,
        pixKey: artisanData?.recipient_gateway_id,
        bio: artisanData?.bio,
        companyName: supplierData?.company_name,
        cnpj: supplierData?.cnpj,
        category: supplierData?.category,
      };

      return { success: true, user };
    } catch (err: any) {
      return {
        success: false,
        error: `Exceção ao autenticar: ${err?.message || 'Erro inesperado'}`,
      };
    }
  }

  /**
   * Registro de novo usuário (Cliente, Artesã ou Fornecedor) no Supabase Auth e perfis.
   */
  static async register(payload: RegisterPayload): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Conecte o Supabase para criar e persistir contas com segurança.',
      };
    }

    try {
      const password = payload.password || 'Artenos@2026!';

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email.trim(),
        password,
        options: {
          data: {
            full_name: payload.name.trim(),
            role: payload.role,
          },
        },
      });

      if (authError || !authData.user) {
        return {
          success: false,
          error: authError?.message || 'Falha ao registrar usuário no Supabase.',
        };
      }

      const userId = authData.user.id;

      // Atualiza tabela public.profiles caso necessário
      await supabase
        .from('profiles')
        .update({
          full_name: payload.name.trim(),
          role: payload.role,
          phone: payload.phone || null,
          cpf_cnpj: payload.cpf || payload.cnpj || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      // Se for perfil de artesã, cria ou atualiza registro em public.artesans
      if (payload.role === 'artisan') {
        let city: string | null = null;
        let state: string | null = null;
        if (payload.location) {
          const parts = payload.location.split('-');
          city = parts[0]?.trim() || null;
          state = parts[1]?.trim()?.substring(0, 2)?.toUpperCase() || null;
        }

        await supabase.from('artesans').upsert(
          {
            profile_id: userId,
            studio_name: payload.studioName || `${payload.name} Ateliê`,
            bio: payload.bio || '',
            story: '',
            location_city: city,
            location_state: state,
            specialties: payload.specialties || ['Artesanato Geral'],
            phone_whatsapp: payload.phone || null,
            recipient_gateway_id: payload.pixKey || null,
            status: 'active',
          },
          { onConflict: 'profile_id' }
        );
      }

      // Se for perfil de fornecedor, cria registro em public.suppliers
      if (payload.role === 'supplier') {
        let city: string | null = null;
        let state: string | null = null;
        if (payload.location) {
          const parts = payload.location.split('-');
          city = parts[0]?.trim() || null;
          state = parts[1]?.trim()?.substring(0, 2)?.toUpperCase() || null;
        }

        await supabase.from('suppliers').upsert(
          {
            profile_id: userId,
            company_name: payload.companyName || payload.name,
            trade_name: payload.name,
            cnpj: payload.cnpj || null,
            category: payload.category || 'Insumos Gerais',
            location_city: city,
            location_state: state,
            phone: payload.phone || null,
            email: payload.email,
            verified: true,
          },
          { onConflict: 'profile_id' }
        );
      }

      const user: AuthUser = {
        id: userId,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        phone: payload.phone,
        cpf: payload.cpf,
        studioName: payload.studioName,
        specialties: payload.specialties,
        location: payload.location,
        pixKey: payload.pixKey,
        bio: payload.bio,
        companyName: payload.companyName,
        cnpj: payload.cnpj,
        category: payload.category,
      };

      return { success: true, user };
    } catch (err: any) {
      return {
        success: false,
        error: `Exceção ao criar conta: ${err?.message || 'Erro inesperado'}`,
      };
    }
  }

  /**
   * Encerramento de sessão no Supabase.
   */
  static async logout(): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[AuthService.logout] Error:', err);
    }
  }

  /**
   * Obter usuário autenticado na sessão atual.
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!profile) return null;

      let artisanData: any = null;
      let supplierData: any = null;

      if (profile.role === 'artisan') {
        const { data: art } = await supabase.from('artesans').select('*').eq('profile_id', session.user.id).maybeSingle();
        artisanData = art;
      } else if (profile.role === 'supplier') {
        const { data: sup } = await supabase.from('suppliers').select('*').eq('profile_id', session.user.id).maybeSingle();
        supplierData = sup;
      }

      return {
        id: session.user.id,
        name: profile.full_name || 'Usuário',
        email: session.user.email || profile.email,
        role: profile.role,
        avatarUrl: profile.avatar_url || undefined,
        phone: profile.phone || undefined,
        cpf: profile.cpf_cnpj || undefined,
        studioName: artisanData?.studio_name,
        specialties: artisanData?.specialties,
        location: artisanData ? [artisanData.location_city, artisanData.location_state].filter(Boolean).join(' - ') : undefined,
        pixKey: artisanData?.recipient_gateway_id,
        bio: artisanData?.bio,
        companyName: supplierData?.company_name,
        cnpj: supplierData?.cnpj,
        category: supplierData?.category,
      };
    } catch (err) {
      console.error('[AuthService.getCurrentUser] Error:', err);
      return null;
    }
  }
}
