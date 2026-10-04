import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { Product, Category } from '../types';

export interface ProductFilters {
  category?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  search?: string;
  isReadyToShip?: boolean;
  isCustomizable?: boolean;
  artisanId?: string;
}

export function mapProductRowToProduct(row: any): Product {
  const artisan = row.artesans || {};
  const profile = artisan.profiles || {};
  const category = row.categories || {};
  const inventory = Array.isArray(row.inventory) ? row.inventory[0] : row.inventory;

  const artisanLocation = [artisan.location_city, artisan.location_state]
    .filter(Boolean)
    .join(' - ') || 'Brasil';

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    artisanId: row.artisan_id,
    artisanName: artisan.studio_name || profile.full_name || 'Artesã',
    artisanLocation,
    artisanAvatar: artisan.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    category: category.name || 'Artesanato',
    categoryId: row.category_id ? String(row.category_id) : undefined,
    materials: row.materials || [],
    dimensions: row.dimensions_str || '',
    weightGrams: row.weight_grams || 500,
    stock: inventory ? inventory.stock_quantity : 1,
    isCustomizable: Boolean(row.is_customizable),
    isReadyToShip: Boolean(row.is_ready_to_ship),
    productionDays: row.production_days || 1,
    priceCents: row.price_cents,
    description: row.description,
    story: row.story || '',
    rating: Number(row.rating_avg) || 5.0,
    reviewsCount: row.reviews_count || 0,
    badge: row.badge || undefined,
    imageUrl: row.image_url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    videoUrl: row.video_url || undefined,
    createdAt: row.created_at,
  };
}

export class ProductsService {
  /**
   * Retorna lista de produtos cadastrados direto do Supabase.
   */
  static async getProducts(filters?: ProductFilters): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          artesans (
            id,
            studio_name,
            location_city,
            location_state,
            avatar_url,
            profiles (
              full_name
            )
          ),
          categories (
            id,
            name,
            slug
          ),
          inventory (
            stock_quantity,
            reserved_quantity
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.artisanId) {
        query = query.eq('artisan_id', filters.artisanId);
      }

      if (filters?.category) {
        query = query.ilike('categories.name', `%${filters.category}%`);
      }

      if (filters?.minPriceCents) {
        query = query.gte('price_cents', filters.minPriceCents);
      }

      if (filters?.maxPriceCents) {
        query = query.lte('price_cents', filters.maxPriceCents);
      }

      if (filters?.isReadyToShip !== undefined) {
        query = query.eq('is_ready_to_ship', filters.isReadyToShip);
      }

      if (filters?.isCustomizable !== undefined) {
        query = query.eq('is_customizable', filters.isCustomizable);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[ProductsService.getProducts] Supabase error:', error);
        return [];
      }

      return (data || []).map(mapProductRowToProduct);
    } catch (err) {
      console.error('[ProductsService.getProducts] Exception:', err);
      return [];
    }
  }

  /**
   * Busca um produto por ID ou Slug.
   */
  static async getProductById(id: string): Promise<Product | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      let query = supabase
        .from('products')
        .select(`
          *,
          artesans (
            id,
            studio_name,
            location_city,
            location_state,
            avatar_url,
            profiles (
              full_name
            )
          ),
          categories (
            id,
            name,
            slug
          ),
          inventory (
            stock_quantity,
            reserved_quantity
          )
        `);

      if (isUuid) {
        query = query.eq('id', id);
      } else {
        query = query.eq('slug', id);
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        return null;
      }

      return mapProductRowToProduct(data);
    } catch (err) {
      console.error('[ProductsService.getProductById] Exception:', err);
      return null;
    }
  }

  /**
   * Retorna lista de categorias do banco de dados.
   */
  static async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[ProductsService.getCategories] Error:', error);
        return [];
      }

      return (data || []).map((c) => ({
        id: String(c.id),
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        iconName: c.icon_name || undefined,
        parentId: c.parent_id ? String(c.parent_id) : null,
        displayOrder: c.display_order,
        isActive: c.is_active,
      }));
    } catch (err) {
      console.error('[ProductsService.getCategories] Exception:', err);
      return [];
    }
  }

  /**
   * Cadastro de nova peça pela artesã no Supabase.
   */
  static async createProduct(productData: {
    title: string;
    description: string;
    category: string;
    categoryId?: string;
    priceCents: number;
    stock: number;
    materials: string[];
    dimensions?: string;
    weightGrams?: number;
    productionDays?: number;
    isCustomizable?: boolean;
    isReadyToShip?: boolean;
    imageUrl: string;
    story?: string;
    artisanId: string;
  }): Promise<{ success: boolean; message: string; data?: Product }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Conecte seu projeto Supabase para salvar e sincronizar produtos.',
      };
    }

    try {
      const slug = productData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36);

      // Obter ou resolver category_id se necessário
      let catIdNumber: number | null = productData.categoryId ? parseInt(productData.categoryId, 10) : null;
      if (!catIdNumber && productData.category) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .ilike('name', `%${productData.category}%`)
          .limit(1)
          .maybeSingle();
        if (cat) catIdNumber = cat.id;
      }

      const { data: insertedProduct, error: prodError } = await supabase
        .from('products')
        .insert({
          artisan_id: productData.artisanId,
          category_id: catIdNumber,
          title: productData.title,
          slug,
          description: productData.description,
          story: productData.story || null,
          materials: productData.materials,
          dimensions_str: productData.dimensions || null,
          weight_grams: productData.weightGrams || 500,
          production_days: productData.productionDays || 1,
          is_customizable: Boolean(productData.isCustomizable),
          is_ready_to_ship: productData.isReadyToShip !== undefined ? productData.isReadyToShip : true,
          price_cents: productData.priceCents,
          image_url: productData.imageUrl,
          is_active: true,
        })
        .select()
        .single();

      if (prodError || !insertedProduct) {
        return {
          success: false,
          message: `Erro ao criar produto: ${prodError?.message || 'Falha no Supabase'}`,
        };
      }

      // Inserir registro de inventário inicial
      await supabase.from('inventory').insert({
        product_id: insertedProduct.id,
        stock_quantity: Math.max(0, productData.stock),
        reserved_quantity: 0,
        low_stock_threshold: 2,
      });

      // Inserir imagem primária em product_images
      if (productData.imageUrl) {
        await supabase.from('product_images').insert({
          product_id: insertedProduct.id,
          url: productData.imageUrl,
          alt_text: productData.title,
          display_order: 0,
          is_primary: true,
        });
      }

      const completeProduct = await this.getProductById(insertedProduct.id);

      return {
        success: true,
        message: 'Produto cadastrado com sucesso no catálogo!',
        data: completeProduct || mapProductRowToProduct(insertedProduct),
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Exceção ao cadastrar produto: ${err?.message || 'Erro inesperado'}`,
      };
    }
  }

  /**
   * Atualização de produto.
   */
  static async updateProduct(id: string, updates: Partial<Product>): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      const updatePayload: any = {};
      if (updates.title) updatePayload.title = updates.title;
      if (updates.description) updatePayload.description = updates.description;
      if (updates.priceCents) updatePayload.price_cents = updates.priceCents;
      if (updates.materials) updatePayload.materials = updates.materials;
      if (updates.dimensions) updatePayload.dimensions_str = updates.dimensions;
      if (updates.isReadyToShip !== undefined) updatePayload.is_ready_to_ship = updates.isReadyToShip;
      if (updates.isCustomizable !== undefined) updatePayload.is_customizable = updates.isCustomizable;
      if (updates.imageUrl) updatePayload.image_url = updates.imageUrl;

      const { error } = await supabase.from('products').update(updatePayload).eq('id', id);

      if (error) {
        return { success: false, message: error.message };
      }

      if (updates.stock !== undefined) {
        await supabase
          .from('inventory')
          .update({ stock_quantity: updates.stock, updated_at: new Date().toISOString() })
          .eq('product_id', id);
      }

      return { success: true, message: 'Produto atualizado com sucesso!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao atualizar.' };
    }
  }

  /**
   * Exclusão ou desativação de produto.
   */
  static async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        // Fallback: desativar caso haja restrição de integridade referencial com pedidos
        await supabase.from('products').update({ is_active: false }).eq('id', id);
      }
      return { success: true, message: 'Produto removido com sucesso!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Erro ao excluir.' };
    }
  }
}
