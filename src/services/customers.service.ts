import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { CustomerProfile } from '../types';

export class CustomersService {
  /**
   * Obtém o perfil do cliente e seu endereço padrão no Supabase.
   */
  static async getProfile(userId?: string): Promise<CustomerProfile | null> {
    if (!isSupabaseConfigured() || !userId) return null;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          cpf_cnpj,
          addresses (
            recipient_name,
            postal_code,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            is_default
          )
        `)
        .eq('id', userId)
        .maybeSingle();

      if (error || !profile) return null;

      const addrList = (profile as any).addresses || [];
      const defaultAddr = addrList.find((a: any) => a.is_default) || addrList[0] || {};

      return {
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        phone: profile.phone || '',
        cpf: profile.cpf_cnpj || '',
        favoriteProductIds: [],
        preferences: [],
        address: {
          street: defaultAddr.street || '',
          number: defaultAddr.number || '',
          complement: defaultAddr.complement || '',
          neighborhood: defaultAddr.neighborhood || '',
          city: defaultAddr.city || '',
          state: defaultAddr.state || '',
          cep: defaultAddr.postal_code || '',
        },
      };
    } catch (err) {
      console.error('[CustomersService.getProfile] Error:', err);
      return null;
    }
  }

  /**
   * Atualiza perfil e endereço do comprador.
   */
  static async updateProfile(userId: string, data: Partial<CustomerProfile>): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured() || !userId) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      const profileUpdates: any = {};
      if (data.fullName) profileUpdates.full_name = data.fullName;
      if (data.phone) profileUpdates.phone = data.phone;
      if (data.cpf) profileUpdates.cpf_cnpj = data.cpf;

      await supabase.from('profiles').update(profileUpdates).eq('id', userId);

      if (data.address) {
        await supabase.from('addresses').upsert(
          {
            profile_id: userId,
            recipient_name: data.fullName || 'Destinatário',
            postal_code: data.address.cep,
            street: data.address.street,
            number: data.address.number,
            complement: data.address.complement || null,
            neighborhood: data.address.neighborhood,
            city: data.address.city,
            state: data.address.state.substring(0, 2).toUpperCase(),
            is_default: true,
          },
          { onConflict: 'profile_id' }
        );
      }

      return { success: true, message: 'Dados cadastrais atualizados com sucesso!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao atualizar perfil.' };
    }
  }

  /**
   * Lista IDs dos produtos favoritados pelo usuário.
   */
  static async getFavorites(userId?: string): Promise<string[]> {
    if (!isSupabaseConfigured() || !userId) return [];

    try {
      const { data, error } = await supabase
        .from('customer_favorites')
        .select('product_id')
        .eq('profile_id', userId);

      if (error || !data) return [];
      return data.map((f) => f.product_id);
    } catch (err) {
      console.error('[CustomersService.getFavorites] Error:', err);
      return [];
    }
  }

  /**
   * Alterna estado de favorito no Supabase.
   */
  static async toggleFavorite(userId: string, productId: string): Promise<{ isFavorite: boolean }> {
    if (!isSupabaseConfigured() || !userId) return { isFavorite: false };

    try {
      const { data: existing } = await supabase
        .from('customer_favorites')
        .select('product_id')
        .eq('profile_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        await supabase.from('customer_favorites').delete().eq('profile_id', userId).eq('product_id', productId);
        return { isFavorite: false };
      } else {
        await supabase.from('customer_favorites').insert({ profile_id: userId, product_id: productId });
        return { isFavorite: true };
      }
    } catch (err) {
      console.error('[CustomersService.toggleFavorite] Error:', err);
      return { isFavorite: false };
    }
  }
}
