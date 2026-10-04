import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { SupplierCompany, SupplierMaterial, MaterialDemand, SupplierQuote } from '../types';

export function mapSupplierMaterialRow(row: any): SupplierMaterial {
  const supplier = row.suppliers || {};
  return {
    id: row.id,
    supplierId: row.supplier_id,
    supplierName: supplier.trade_name || supplier.company_name || 'Fornecedor',
    companyName: supplier.company_name || supplier.trade_name || 'Indústria & Distribuição',
    category: row.category,
    name: row.name,
    description: row.description,
    priceCents: row.price_cents,
    unit: row.unit,
    stockStatus: row.stock_status || 'Em estoque',
    stockQty: row.stock_qty || 0,
    location: row.location || [supplier.location_city, supplier.location_state].filter(Boolean).join(' - ') || 'Brasil',
    minOrderQty: row.min_order_qty || 1,
    imageUrl: row.image_url || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80',
    batchCode: row.batch_code || undefined,
    shadeTone: row.shade_tone || undefined,
  };
}

export function mapDemandRow(row: any): MaterialDemand {
  const artisan = row.artesans || {};
  const profile = artisan.profiles || {};
  const artisanLocation = [artisan.location_city, artisan.location_state].filter(Boolean).join(' - ') || 'Brasil';

  return {
    id: row.id,
    artisanId: row.artisan_id,
    artisanName: artisan.studio_name || profile.full_name || 'Artesã',
    artisanLocation,
    title: row.title,
    details: row.details,
    category: row.category,
    quantity: row.quantity,
    deadlineDays: row.deadline_days,
    status: (row.status === 'cancelled' ? 'closed' : row.status) as any,
    quotesCount: row.quotes_count || 0,
    createdAt: row.created_at,
  };
}

export class SuppliersService {
  /**
   * Retorna os dados da empresa do fornecedor conectado.
   */
  static async getCompany(profileIdOrId?: string): Promise<SupplierCompany | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      let query = supabase.from('suppliers').select('*');
      if (profileIdOrId) {
        query = query.or(`id.eq.${profileIdOrId},profile_id.eq.${profileIdOrId}`);
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) return null;

      const location = [data.location_city, data.location_state].filter(Boolean).join(' - ') || '';

      return {
        id: data.id,
        name: data.company_name,
        logoUrl: data.logo_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=200&q=80',
        description: data.description || '',
        category: data.category,
        location,
        phone: data.phone || '',
        email: data.email || '',
        cnpj: data.cnpj || '',
        minOrderCents: data.min_order_cents || 0,
        verified: data.verified,
      };
    } catch (err) {
      console.error('[SuppliersService.getCompany] Exception:', err);
      return null;
    }
  }

  /**
   * Atualiza os dados cadastrais da empresa do fornecedor.
   */
  static async updateCompany(id: string, updates: Partial<SupplierCompany>): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      const payload: any = {};
      if (updates.name) payload.company_name = updates.name;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.category) payload.category = updates.category;
      if (updates.phone) payload.phone = updates.phone;
      if (updates.email) payload.email = updates.email;
      if (updates.cnpj) payload.cnpj = updates.cnpj;
      if (updates.minOrderCents !== undefined) payload.min_order_cents = updates.minOrderCents;

      if (updates.location) {
        const parts = updates.location.split('-');
        if (parts.length >= 2) {
          payload.location_city = parts[0].trim();
          payload.location_state = parts[1].trim().substring(0, 2).toUpperCase();
        } else {
          payload.location_city = updates.location.trim();
        }
      }

      const { error } = await supabase.from('suppliers').update(payload).eq('id', id);

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Dados da empresa atualizados com sucesso no Supabase!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao atualizar fornecedor.' };
    }
  }

  /**
   * Lista materiais/insumos cadastrados por fornecedores no B2B.
   */
  static async getMaterials(supplierId?: string): Promise<SupplierMaterial[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase
        .from('supplier_materials')
        .select(`
          *,
          suppliers (
            id,
            company_name,
            trade_name,
            location_city,
            location_state
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[SuppliersService.getMaterials] Error:', error);
        return [];
      }

      return (data || []).map(mapSupplierMaterialRow);
    } catch (err) {
      console.error('[SuppliersService.getMaterials] Exception:', err);
      return [];
    }
  }

  /**
   * Criação de novo insumo/matéria-prima no Supabase.
   */
  static async createMaterial(material: {
    supplierId: string;
    name: string;
    category: string;
    description: string;
    priceCents: number;
    unit: string;
    minOrderQty: number;
    stockQty: number;
    location?: string;
    imageUrl: string;
    batchCode?: string;
    shadeTone?: string;
  }): Promise<{ success: boolean; message: string; data?: SupplierMaterial }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Conecte o Supabase para cadastrar insumos.' };
    }

    try {
      const { data, error } = await supabase
        .from('supplier_materials')
        .insert({
          supplier_id: material.supplierId,
          name: material.name,
          category: material.category,
          description: material.description,
          price_cents: material.priceCents,
          unit: material.unit,
          min_order_qty: material.minOrderQty,
          stock_qty: material.stockQty,
          stock_status: material.stockQty > 0 ? 'Em estoque / Pronta entrega' : 'Sob encomenda / Produção',
          location: material.location || null,
          image_url: material.imageUrl,
          batch_code: material.batchCode || null,
          shade_tone: material.shadeTone || null,
          is_active: true,
        })
        .select(`
          *,
          suppliers (
            id,
            company_name,
            trade_name,
            location_city,
            location_state
          )
        `)
        .single();

      if (error || !data) {
        return { success: false, message: error?.message || 'Falha ao cadastrar insumo no Supabase.' };
      }

      return {
        success: true,
        message: 'Insumo cadastrado com sucesso no catálogo B2B!',
        data: mapSupplierMaterialRow(data),
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Exceção ao cadastrar insumo.' };
    }
  }

  /**
   * Busca solicitações de cotação / demandas de matérias-primas criadas por artesãs.
   */
  static async getDemands(): Promise<MaterialDemand[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('material_demands')
        .select(`
          *,
          artesans (
            id,
            studio_name,
            location_city,
            location_state,
            profiles (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[SuppliersService.getDemands] Error:', error);
        return [];
      }

      return (data || []).map(mapDemandRow);
    } catch (err) {
      console.error('[SuppliersService.getDemands] Exception:', err);
      return [];
    }
  }

  /**
   * Criação de nova demanda por uma artesã.
   */
  static async createDemand(demand: {
    artisanId: string;
    title: string;
    details: string;
    category: string;
    quantity: string;
    deadlineDays?: number;
  }): Promise<{ success: boolean; message: string; data?: MaterialDemand }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      const { data, error } = await supabase
        .from('material_demands')
        .insert({
          artisan_id: demand.artisanId,
          title: demand.title,
          details: demand.details,
          category: demand.category,
          quantity: demand.quantity,
          deadline_days: demand.deadlineDays || 7,
          status: 'open',
          quotes_count: 0,
        })
        .select(`
          *,
          artesans (
            id,
            studio_name,
            location_city,
            location_state,
            profiles (
              full_name
            )
          )
        `)
        .single();

      if (error || !data) {
        return { success: false, message: error?.message || 'Erro ao publicar demanda.' };
      }

      return {
        success: true,
        message: 'Solicitação de orçamento publicada na rede de fornecedores!',
        data: mapDemandRow(data),
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao criar demanda.' };
    }
  }

  /**
   * Envio de proposta/orçamento de fornecedor para uma demanda.
   */
  static async submitQuote(quoteData: {
    demandId: string;
    supplierId: string;
    priceCents: number;
    shippingCents?: number;
    shippingDays?: number;
    notes?: string;
  }): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      const { error } = await supabase.from('supplier_quotes').insert({
        demand_id: quoteData.demandId,
        supplier_id: quoteData.supplierId,
        price_cents: quoteData.priceCents,
        shipping_cents: quoteData.shippingCents || 0,
        shipping_days: quoteData.shippingDays || 5,
        notes: quoteData.notes || null,
        status: 'sent',
      });

      if (error) {
        return { success: false, message: error.message };
      }

      // Atualiza contador de cotações na demanda
      const { data: dem } = await supabase.from('material_demands').select('quotes_count').eq('id', quoteData.demandId).single();
      if (dem) {
        await supabase
          .from('material_demands')
          .update({
            quotes_count: dem.quotes_count + 1,
            status: 'quotes_received',
          })
          .eq('id', quoteData.demandId);
      }

      return { success: true, message: 'Orçamento enviado com sucesso para a artesã!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao enviar orçamento.' };
    }
  }
}
