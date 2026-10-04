import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import { mapProductRowToProduct } from './products.service';
import type { Cart, CartItem, Product } from '../types';

const GUEST_CART_STORAGE_KEY = 'artenos_guest_cart';

export class CartService {
  /**
   * Calcula totais do carrinho.
   */
  static calculateTotals(items: CartItem[], shippingCents: number = 0): Cart {
    const subtotalCents = items.reduce((acc, item) => acc + item.product.priceCents * item.quantity, 0);
    return {
      items,
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
    };
  }

  /**
   * Recupera o carrinho local do visitante.
   */
  static getGuestCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(GUEST_CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Salva o carrinho local do visitante.
   */
  static saveGuestCart(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignora erro de cota
    }
  }

  /**
   * Limpa o carrinho de visitante.
   */
  static clearGuestCart(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  }

  /**
   * Busca itens do carrinho salvos no Supabase para um perfil autenticado.
   */
  static async fetchUserCart(profileId: string): Promise<CartItem[]> {
    if (!isSupabaseConfigured() || !profileId) return this.getGuestCart();

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          customization_notes,
          products (
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
              name
            ),
            inventory (
              stock_quantity
            )
          )
        `)
        .eq('profile_id', profileId);

      if (error || !data) {
        console.error('[CartService.fetchUserCart] Error:', error);
        return this.getGuestCart();
      }

      return data
        .filter((row: any) => Boolean(row.products))
        .map((row: any) => ({
          product: mapProductRowToProduct(row.products),
          quantity: row.quantity,
          customizationNotes: row.customization_notes || undefined,
        }));
    } catch (err) {
      console.error('[CartService.fetchUserCart] Exception:', err);
      return this.getGuestCart();
    }
  }

  /**
   * Mescla os itens de visitante com o carrinho no banco do Supabase após login.
   */
  static async mergeGuestCartWithUserCart(profileId: string): Promise<CartItem[]> {
    const guestItems = this.getGuestCart();
    if (guestItems.length === 0) {
      return this.fetchUserCart(profileId);
    }

    for (const item of guestItems) {
      await this.syncAddItem(profileId, item.product.id, item.quantity, item.customizationNotes);
    }

    this.clearGuestCart();
    return this.fetchUserCart(profileId);
  }

  /**
   * Sincroniza adição de item no banco caso haja usuário autenticado.
   */
  static async syncAddItem(profileId: string, productId: string, quantity: number, customizationNotes?: string) {
    if (!isSupabaseConfigured() || !profileId) return;

    try {
      await supabase.from('cart_items').upsert(
        {
          profile_id: profileId,
          product_id: productId,
          quantity,
          customization_notes: customizationNotes || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'profile_id,product_id' }
      );
    } catch (err) {
      console.warn('[CartService.syncAddItem] Error:', err);
    }
  }

  /**
   * Remove item do carrinho no Supabase.
   */
  static async syncRemoveItem(profileId: string, productId: string) {
    if (!isSupabaseConfigured() || !profileId) return;

    try {
      await supabase.from('cart_items').delete().eq('profile_id', profileId).eq('product_id', productId);
    } catch (err) {
      console.warn('[CartService.syncRemoveItem] Error:', err);
    }
  }

  /**
   * Limpa o carrinho no Supabase após compra concluída.
   */
  static async syncClearCart(profileId: string) {
    if (!isSupabaseConfigured() || !profileId) {
      this.clearGuestCart();
      return;
    }

    try {
      await supabase.from('cart_items').delete().eq('profile_id', profileId);
    } catch (err) {
      console.warn('[CartService.syncClearCart] Error:', err);
    }
  }
}
