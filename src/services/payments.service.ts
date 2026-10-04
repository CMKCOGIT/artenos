import { supabase, isSupabaseConfigured } from '../lib/supabase/client';

export class PaymentsService {
  /**
   * Registra intenção e metadados de pagamento no Supabase (tabela payments).
   */
  static async createPaymentIntent(
    orderId: string,
    method: 'pix' | 'credit_card',
    amountCents: number,
    splitPlatformCents: number = 0,
    splitArtisanCents: number = 0
  ): Promise<{ success: boolean; message: string; paymentId?: string; pixCopyPaste?: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Conecte o Supabase para registrar a transação financeira no banco.',
      };
    }

    try {
      const pixCopyPaste =
        method === 'pix'
          ? `00020126580014br.gov.bcb.pix0136artenos-split-${orderId}520400005303986540${(amountCents / 100).toFixed(2)}5802BR5913ARTENOS LTDA6009SAO PAULO62070503***6304`
          : undefined;

      const { data, error } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          gateway_name: 'mercadopago',
          method,
          status: 'pending',
          amount_cents: amountCents,
          split_platform_cents: splitPlatformCents,
          split_artisan_cents: splitArtisanCents,
          pix_copy_paste: pixCopyPaste || null,
        })
        .select()
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message: 'Registro de pagamento criado com sucesso no Supabase!',
        paymentId: data?.id,
        pixCopyPaste,
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Falha ao processar pagamento.' };
    }
  }
}
