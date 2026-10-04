import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { Order, OrderItem, OrderStatus, CartItem } from '../types';

export function mapOrderRowToOrder(row: any): Order {
  const items: OrderItem[] = (row.order_items || []).map((item: any) => ({
    productId: item.product_id || '',
    title: item.title,
    artisanId: item.artisan_id,
    artisanName: item.artesans?.studio_name || item.artesans?.profiles?.full_name || 'Artesã',
    unitPriceCents: item.unit_price_cents,
    quantity: item.quantity,
    imageUrl: item.image_url || '',
    customizationNotes: item.customization_notes || undefined,
  }));

  const addr = typeof row.shipping_address === 'string'
    ? JSON.parse(row.shipping_address)
    : (row.shipping_address || {});

  return {
    id: row.id,
    orderNumber: row.order_number,
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientPhone: row.client_phone || '',
    clientAddress: {
      street: addr.street || '',
      number: addr.number || '',
      complement: addr.complement || '',
      neighborhood: addr.neighborhood || '',
      city: addr.city || '',
      state: addr.state || '',
      cep: addr.postal_code || addr.cep || '',
    },
    items,
    subtotalCents: row.subtotal_cents,
    shippingCents: row.shipping_cents,
    shippingMethod: row.shipping_method || 'PAC',
    totalCents: row.total_cents,
    platformFeeCents: row.platform_fee_cents,
    artisanPayoutCents: row.artisan_payout_cents,
    paymentMethod: row.payment_method === 'boleto' ? 'pix' : row.payment_method,
    status: row.status,
    trackingCode: row.tracking_code || undefined,
    createdAt: row.created_at,
  };
}

export class OrdersService {
  /**
   * Lista pedidos associados ao usuário logado ou catálogo geral.
   */
  static async getOrders(filter?: { customerId?: string; artisanId?: string }): Promise<Order[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            artisan_id,
            title,
            unit_price_cents,
            quantity,
            item_subtotal_cents,
            artisan_payout_cents,
            image_url,
            customization_notes,
            artesans (
              studio_name,
              profiles (
                full_name
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (filter?.customerId) {
        query = query.eq('customer_id', filter.customerId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[OrdersService.getOrders] Error:', error);
        return [];
      }

      let orders = (data || []).map(mapOrderRowToOrder);

      if (filter?.artisanId) {
        orders = orders.filter((o) => o.items.some((i) => i.artisanId === filter.artisanId));
      }

      return orders;
    } catch (err) {
      console.error('[OrdersService.getOrders] Exception:', err);
      return [];
    }
  }

  /**
   * Busca um pedido por ID ou Código.
   */
  static async getOrderById(orderId: string): Promise<Order | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);

      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            artisan_id,
            title,
            unit_price_cents,
            quantity,
            item_subtotal_cents,
            artisan_payout_cents,
            image_url,
            customization_notes,
            artesans (
              studio_name,
              profiles (
                full_name
              )
            )
          )
        `);

      if (isUuid) {
        query = query.eq('id', orderId);
      } else {
        query = query.eq('order_number', orderId);
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) return null;

      return mapOrderRowToOrder(data);
    } catch (err) {
      console.error('[OrdersService.getOrderById] Exception:', err);
      return null;
    }
  }

  /**
   * Criação e processamento de pedido no Supabase.
   */
  static async createOrder(orderPayload: {
    customerId?: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    shippingAddress: {
      recipientName?: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      cep: string;
    };
    items: CartItem[];
    subtotalCents: number;
    shippingCents: number;
    shippingMethod: 'PAC' | 'Sedex' | 'Transportadora';
    totalCents: number;
    paymentMethod: 'pix' | 'credit_card';
    platformFeePercent?: number;
  }): Promise<{ success: boolean; message: string; order?: Order }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Conecte o Supabase para processar e registrar pedidos com segurança.',
      };
    }

    try {
      const feePercent = orderPayload.platformFeePercent || 10;
      const platformFeeCents = Math.round(orderPayload.subtotalCents * (feePercent / 100));
      const artisanPayoutCents = orderPayload.subtotalCents - platformFeeCents;
      const orderNumber = `ART-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const { data: insertedOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_id: orderPayload.customerId || null,
          client_name: orderPayload.clientName,
          client_email: orderPayload.clientEmail,
          client_phone: orderPayload.clientPhone,
          status: 'paid', // Simulado pago no front para acionar trigger de split e baixa no estoque do schema
          subtotal_cents: orderPayload.subtotalCents,
          shipping_cents: orderPayload.shippingCents,
          shipping_method: orderPayload.shippingMethod,
          total_cents: orderPayload.totalCents,
          platform_fee_cents: platformFeeCents,
          artisan_payout_cents: artisanPayoutCents,
          payment_method: orderPayload.paymentMethod,
          shipping_address: orderPayload.shippingAddress as any,
          estimated_delivery_days: orderPayload.shippingMethod === 'Sedex' ? 3 : 8,
        })
        .select()
        .single();

      if (orderError || !insertedOrder) {
        return {
          success: false,
          message: `Erro ao gerar pedido no Supabase: ${orderError?.message || 'Falha no banco'}`,
        };
      }

      // Inserir itens do pedido
      const itemsToInsert = orderPayload.items.map((cartItem) => {
        const itemSubtotal = cartItem.product.priceCents * cartItem.quantity;
        const itemFee = Math.round(itemSubtotal * (feePercent / 100));
        const itemPayout = itemSubtotal - itemFee;

        return {
          order_id: insertedOrder.id,
          product_id: cartItem.product.id,
          artisan_id: cartItem.product.artisanId,
          title: cartItem.product.title,
          unit_price_cents: cartItem.product.priceCents,
          quantity: cartItem.quantity,
          item_subtotal_cents: itemSubtotal,
          artisan_payout_cents: itemPayout,
          image_url: cartItem.product.imageUrl,
          customization_notes: cartItem.customizationNotes || null,
        };
      });

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);

      if (itemsError) {
        console.error('[OrdersService.createOrder] Items error:', itemsError);
      }

      // Inserir registro de pagamento
      await supabase.from('payments').insert({
        order_id: insertedOrder.id,
        gateway_name: 'mercadopago',
        method: orderPayload.paymentMethod,
        status: 'approved',
        amount_cents: orderPayload.totalCents,
        split_platform_cents: platformFeeCents,
        split_artisan_cents: artisanPayoutCents,
        paid_at: new Date().toISOString(),
      });

      const fullOrder = await this.getOrderById(insertedOrder.id);

      return {
        success: true,
        message: `Pedido ${orderNumber} criado com sucesso e registrado no Supabase!`,
        order: fullOrder || mapOrderRowToOrder({ ...insertedOrder, order_items: itemsToInsert }),
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Exceção ao criar pedido: ${err?.message || 'Erro inesperado'}`,
      };
    }
  }

  /**
   * Atualização do status de envio e código de rastreamento do pedido.
   */
  static async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    trackingCode?: string
  ): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      const updateData: any = { status };
      if (trackingCode) {
        updateData.tracking_code = trackingCode;
        if (status === 'shipped') {
          updateData.shipped_at = new Date().toISOString();
        }
      }

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: `Status do pedido atualizado para "${status}" no Supabase!` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao atualizar pedido.' };
    }
  }
}
