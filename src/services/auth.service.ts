import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { AuthUser, RegisterPayload, UserRole } from '../types';

export class AuthService {
  /**
   * Autenticação de usuário com Supabase Auth.
   * Utiliza a sessão real do banco e recupera o perfil correspondente em public.profiles.
   */
  static async login(credentials: {
    email: string;
    password?: string;
    role?: UserRole;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Serviço de autenticação não configurado no ambiente.',
      };
    }

    try {
      if (!credentials.email || !credentials.password) {
        return { success: false, error: 'Por favor, informe seu e-mail e senha.' };
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (authError || !authData.user) {
        return {
          success: false,
          error: authError?.message?.includes('Invalid login')
            ? 'E-mail ou senha incorretos. Verifique suas credenciais.'
            : authError?.message || 'Falha na autenticação.',
        };
      }

      // Buscar perfil real do usuário na tabela public.profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError || !profile) {
        // Fallback: se o trigger ainda não tiver executado, consulta novamente
        const role = (authData.user.user_metadata?.role as UserRole) || 'customer';
        return {
          success: true,
          user: {
            id: authData.user.id,
            name: authData.user.user_metadata?.full_name || 'Usuário Artenós',
            email: authData.user.email || credentials.email,
            role,
          },
        };
      }

      const role = profile.role as UserRole;

      // Validação de papel pretendido: impede acesso não autorizado
      if (credentials.role && credentials.role !== 'customer') {
        if (credentials.role === 'admin' && role !== 'admin') {
          return {
            success: false,
            error: 'Acesso negado: esta conta não possui privilégios de administrador.',
          };
        }
        if (credentials.role === 'artisan' && role !== 'artisan' && role !== 'admin') {
          return {
            success: false,
            error: 'Esta conta não está cadastrada como artesã. Cadastre-se como artesã para acessar este painel.',
          };
        }
        if (credentials.role === 'supplier' && role !== 'supplier' && role !== 'admin') {
          return {
            success: false,
            error: 'Esta conta não está cadastrada como fornecedor. Cadastre-se como fornecedor para acessar este painel.',
          };
        }
      }
      let artisanData: any = null;
      let supplierData: any = null;

      if (role === 'artisan') {
        const { data: art } = await supabase
          .from('artesans')
          .select('*')
          .eq('profile_id', authData.user.id)
          .maybeSingle();
        artisanData = art;
      } else if (role === 'supplier') {
        const { data: sup } = await supabase
          .from('suppliers')
          .select('*')
          .eq('profile_id', authData.user.id)
          .maybeSingle();
        supplierData = sup;
      }

      const user: AuthUser = {
        id: authData.user.id,
        name: profile.full_name || authData.user.user_metadata?.full_name || 'Usuário',
        email: authData.user.email || profile.email,
        role,
        avatarUrl: profile.avatar_url || undefined,
        phone: profile.phone || undefined,
        cpf: profile.cpf_cnpj || undefined,
        studioName: artisanData?.studio_name,
        specialties: artisanData?.specialties,
        location: artisanData
          ? [artisanData.location_city, artisanData.location_state].filter(Boolean).join(' - ')
          : undefined,
        pixKey: artisanData?.recipient_gateway_id,
        bio: artisanData?.bio,
        status: artisanData?.status,
        companyName: supplierData?.company_name,
        cnpj: supplierData?.cnpj,
        category: supplierData?.category,
        verified: supplierData?.verified,
      };

      return { success: true, user };
    } catch (err: any) {
      return {
        success: false,
        error: 'Erro de conexão ao autenticar. Tente novamente mais tarde.',
      };
    }
  }

  /**
   * Registro seguro de novo usuário (Cliente, Artesã ou Fornecedor).
   * O papel 'admin' NUNCA pode ser solicitado ou atribuído publicamente.
   */
  static async register(payload: RegisterPayload): Promise<{
    success: boolean;
    user?: AuthUser;
    error?: string;
    emailConfirmationRequired?: boolean;
  }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Banco de dados não configurado para criação de contas.',
      };
    }

    // Regra de segurança: Proibido autoatribuição de admin
    if (payload.role === 'admin') {
      return {
        success: false,
        error: 'Cadastro público não permitido para perfis de governança administrativa.',
      };
    }

    if (!payload.password || payload.password.length < 6) {
      return {
        success: false,
        error: 'A senha é obrigatória e deve ter pelo menos 6 caracteres.',
      };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email.trim(),
        password: payload.password,
        options: {
          data: {
            full_name: payload.name.trim(),
            role: payload.role,
          },
        },
      });

      if (authError || !authData.user) {
        if (authError?.message?.includes('already registered')) {
          return { success: false, error: 'Este e-mail já está cadastrado na plataforma.' };
        }
        return {
          success: false,
          error: authError?.message || 'Falha ao registrar conta no Supabase.',
        };
      }

      const userId = authData.user.id;
      const isEmailConfirmationRequired = authData.session === null;

      // Atualiza o perfil em public.profiles
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

      // Se for perfil de artesã, cadastra com status inicial OBRIGATÓRIO 'pending_approval'
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
            studio_name: payload.studioName || `Ateliê ${payload.name}`,
            bio: payload.bio || '',
            story: '',
            location_city: city,
            location_state: state,
            specialties: payload.specialties || ['Artesanato Geral'],
            phone_whatsapp: payload.phone || null,
            recipient_gateway_id: payload.pixKey || null,
            status: 'pending_approval', // NUNCA ativo de imediato sem curadoria
          },
          { onConflict: 'profile_id' }
        );
      }

      // Se for fornecedor, cadastra com verified OBRIGATÓRIO false
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
            verified: false, // NUNCA autoaprovado sem checagem de CNPJ
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
        status: payload.role === 'artisan' ? 'pending_approval' : undefined,
        companyName: payload.companyName,
        cnpj: payload.cnpj,
        category: payload.category,
        verified: payload.role === 'supplier' ? false : undefined,
      };

      return {
        success: true,
        user,
        emailConfirmationRequired: isEmailConfirmationRequired,
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'Erro inesperado ao registrar conta.',
      };
    }
  }

  /**
   * Recuperação de senha por e-mail.
   */
  static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Serviço de autenticação não configurado.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/#/redefinir-senha`,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message: 'Instruções de redefinição de senha foram enviadas para seu e-mail.',
      };
    } catch (err: any) {
      return { success: false, message: 'Erro ao solicitar redefinição de senha.' };
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
   * Carrega perfil e papéis confirmados diretamente do banco PostgreSQL.
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error || !profile) return null;

      let artisanData: any = null;
      let supplierData: any = null;

      if (profile.role === 'artisan') {
        const { data: art } = await supabase
          .from('artesans')
          .select('*')
          .eq('profile_id', session.user.id)
          .maybeSingle();
        artisanData = art;
      } else if (profile.role === 'supplier') {
        const { data: sup } = await supabase
          .from('suppliers')
          .select('*')
          .eq('profile_id', session.user.id)
          .maybeSingle();
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
        location: artisanData
          ? [artisanData.location_city, artisanData.location_state].filter(Boolean).join(' - ')
          : undefined,
        pixKey: artisanData?.recipient_gateway_id,
        bio: artisanData?.bio,
        status: artisanData?.status,
        companyName: supplierData?.company_name,
        cnpj: supplierData?.cnpj,
        category: supplierData?.category,
        verified: supplierData?.verified,
      };
    } catch (err) {
      console.error('[AuthService.getCurrentUser] Error:', err);
      return null;
    }
  }
}
