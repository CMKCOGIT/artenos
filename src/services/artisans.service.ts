import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { Artisan } from '../types';

export function mapArtisanRowToArtisan(row: any): Artisan {
  const profile = row.profiles || {};
  const location = [row.location_city, row.location_state].filter(Boolean).join(' - ') || 'Brasil';

  return {
    id: row.id,
    name: profile.full_name || row.studio_name || 'Artesã Artenós',
    studioName: row.studio_name || 'Ateliê Artenós',
    bio: row.bio || '',
    story: row.story || '',
    location,
    specialties: row.specialties || [],
    avatarUrl: row.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    coverUrl: row.cover_url || undefined,
    rating: Number(row.rating_avg) || 5.0,
    totalSales: row.total_sales || 0,
    revenueCents: Number(row.revenue_cents) || 0,
    phone: row.phone_whatsapp || profile.phone || '',
    instagram: row.instagram_handle || '',
    featuredQuote: row.featured_quote || '',
    status: row.status || 'active',
    pixKey: row.recipient_gateway_id || undefined,
  };
}

export class ArtisansService {
  /**
   * Listagem de artesãs cadastradas na plataforma.
   */
  static async getArtisans(): Promise<Artisan[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('artesans')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .order('total_sales', { ascending: false });

      if (error) {
        console.error('[ArtisansService.getArtisans] Error:', error);
        return [];
      }

      return (data || []).map(mapArtisanRowToArtisan);
    } catch (err) {
      console.error('[ArtisansService.getArtisans] Exception:', err);
      return [];
    }
  }

  /**
   * Busca artesã por ID ou por Profile ID.
   */
  static async getArtisanById(id: string): Promise<Artisan | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (!isUuid) return null;

      const { data, error } = await supabase
        .from('artesans')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .or(`id.eq.${id},profile_id.eq.${id}`)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return mapArtisanRowToArtisan(data);
    } catch (err) {
      console.error('[ArtisansService.getArtisanById] Exception:', err);
      return null;
    }
  }

  /**
   * Atualização de perfil de artesã.
   */
  static async updateProfile(id: string, profile: Partial<Artisan>): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      const updateData: any = {};
      if (profile.studioName) updateData.studio_name = profile.studioName;
      if (profile.bio !== undefined) updateData.bio = profile.bio;
      if (profile.story !== undefined) updateData.story = profile.story;
      if (profile.phone) updateData.phone_whatsapp = profile.phone;
      if (profile.instagram) updateData.instagram_handle = profile.instagram;
      if (profile.pixKey) updateData.recipient_gateway_id = profile.pixKey;
      if (profile.specialties) updateData.specialties = profile.specialties;
      if (profile.avatarUrl) updateData.avatar_url = profile.avatarUrl;

      if (profile.location) {
        const parts = profile.location.split('-');
        if (parts.length >= 2) {
          updateData.location_city = parts[0].trim();
          updateData.location_state = parts[1].trim().substring(0, 2).toUpperCase();
        } else {
          updateData.location_city = profile.location.trim();
        }
      }

      const { error } = await supabase.from('artesans').update(updateData).eq('id', id);

      if (error) {
        return { success: false, message: `Erro ao salvar: ${error.message}` };
      }

      return { success: true, message: 'Perfil da artesã atualizado com sucesso no Supabase!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao atualizar artesã.' };
    }
  }

  /**
   * Aprovação de ateliê (Área administrativa).
   */
  static async approveArtisan(id: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      const { error } = await supabase.from('artesans').update({ status: 'active' }).eq('id', id);
      if (error) return { success: false, message: error.message };
      return { success: true, message: 'Ateliê aprovado com sucesso!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao aprovar ateliê.' };
    }
  }

  /**
   * Salvar cálculo da Calculadora de Precificação no banco.
   */
  static async savePricingCalculation(data: {
    artisanId: string;
    pieceTitle: string;
    rawMaterialsCostCents: number;
    hoursWorked: number;
    hourlyRateCents: number;
    packagingCostCents: number;
    fixedOverheadCents: number;
    desiredProfitPercent: number;
    platformFeePercent: number;
    suggestedPriceCents: number;
  }): Promise<{ success: boolean; message: string; id?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não configurado.' };
    }

    try {
      const { data: res, error } = await supabase
        .from('artisan_pricing_calculations')
        .insert({
          artisan_id: data.artisanId,
          piece_title: data.pieceTitle,
          raw_materials_cost_cents: data.rawMaterialsCostCents,
          hours_worked: data.hoursWorked,
          hourly_rate_cents: data.hourlyRateCents,
          packaging_cost_cents: data.packagingCostCents,
          fixed_overhead_cents: data.fixedOverheadCents,
          desired_profit_percent: data.desiredProfitPercent,
          platform_fee_percent: data.platformFeePercent,
          suggested_price_cents: data.suggestedPriceCents,
        })
        .select('id')
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Cálculo de precificação salvo com sucesso!', id: res?.id };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Erro ao salvar cálculo.' };
    }
  }

  /**
   * Submeter solicitação de Cadastro Assistido no Supabase (tabela assisted_signup_requests).
   */
  static async submitAssistedSignup(data: {
    artisanName: string;
    phoneWhatsapp: string;
    city: string;
    state: string;
    craftType: string;
    preferredChannel: string;
    preferredTime?: string;
  }): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Conecte o Supabase para registrar a solicitação no banco de dados.',
      };
    }

    try {
      const channel = data.preferredChannel === 'call' ? 'call' : 'whatsapp';

      const { error } = await supabase.from('assisted_signup_requests').insert({
        artisan_name: data.artisanName,
        phone_whatsapp: data.phoneWhatsapp,
        city: data.city,
        state: data.state.substring(0, 2).toUpperCase(),
        craft_type: data.craftType,
        preferred_channel: channel,
        preferred_time: data.preferredTime || null,
        status: 'pending',
      });

      if (error) {
        return {
          success: false,
          message: `Erro ao enviar solicitação: ${error.message}`,
        };
      }

      return {
        success: true,
        message: 'Solicitação de Cadastro Assistido enviada com sucesso! Nossa equipe entrará em contato.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Exceção: ${err?.message || 'Falha ao registrar solicitação.'}`,
      };
    }
  }
}
