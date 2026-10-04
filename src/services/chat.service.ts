import { supabase, isSupabaseConfigured } from '../lib/supabase/client';
import type { Conversation, ChatMessage, Product } from '../types';

export function mapConversationRow(row: any): Conversation {
  const artisan = row.artesans || {};
  const profile = artisan.profiles || {};
  const client = row.client || {};
  const product = row.products || {};

  return {
    id: row.id,
    productId: row.product_id || undefined,
    productTitle: product.title || undefined,
    productPriceCents: product.price_cents || undefined,
    productImg: product.image_url || undefined,
    artisanId: row.artisan_id,
    artisanName: artisan.studio_name || profile.full_name || 'Artesã',
    artisanAvatar: artisan.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    clientId: row.client_id,
    clientName: client.full_name || 'Cliente Artenós',
    lastMessage: row.last_message || 'Inicie a conversa...',
    updatedAt: row.last_message_at || row.updated_at || new Date().toISOString(),
    unreadCount: row.client_unread_count || row.artisan_unread_count || 0,
  };
}

export function mapMessageRow(row: any, senderRole: 'customer' | 'artisan' = 'customer'): ChatMessage {
  const sender = row.profiles || {};
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    senderName: sender.full_name || 'Usuário',
    senderRole,
    content: row.content,
    timestamp: row.created_at,
    status: row.is_read ? 'read' : 'delivered',
  };
}

export class ChatService {
  /**
   * Lista as conversas ativas no Supabase.
   */
  static async getConversations(userId?: string): Promise<Conversation[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          artesans (
            id,
            studio_name,
            avatar_url,
            profiles (
              full_name
            )
          ),
          client:profiles!conversations_client_id_fkey (
            id,
            full_name
          ),
          products (
            id,
            title,
            price_cents,
            image_url
          )
        `)
        .order('last_message_at', { ascending: false });

      if (userId) {
        query = query.or(`client_id.eq.${userId},artisan_id.eq.${userId}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[ChatService.getConversations] Error:', error);
        return [];
      }

      return (data || []).map(mapConversationRow);
    } catch (err) {
      console.error('[ChatService.getConversations] Exception:', err);
      return [];
    }
  }

  /**
   * Busca histórico de mensagens de uma conversa.
   */
  static async getMessages(conversationId: string): Promise<ChatMessage[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (
            id,
            full_name,
            role
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[ChatService.getMessages] Error:', error);
        return [];
      }

      return (data || []).map((m: any) => mapMessageRow(m, m.profiles?.role || 'customer'));
    } catch (err) {
      console.error('[ChatService.getMessages] Exception:', err);
      return [];
    }
  }

  /**
   * Cria ou obtém conversa existente para um produto e artesã.
   */
  static async getOrCreateConversation(
    clientId: string,
    artisanId: string,
    product?: Product
  ): Promise<{ success: boolean; conversation?: Conversation; message?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Supabase não conectado.' };
    }

    try {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          artesans (
            id,
            studio_name,
            avatar_url,
            profiles (
              full_name
            )
          ),
          client:profiles!conversations_client_id_fkey (
            id,
            full_name
          ),
          products (
            id,
            title,
            price_cents,
            image_url
          )
        `)
        .eq('client_id', clientId)
        .eq('artisan_id', artisanId);

      if (product) {
        query = query.eq('product_id', product.id);
      }

      const { data: existing } = await query.maybeSingle();

      if (existing) {
        return { success: true, conversation: mapConversationRow(existing) };
      }

      // Cria nova conversa
      const { data: created, error } = await supabase
        .from('conversations')
        .insert({
          client_id: clientId,
          artisan_id: artisanId,
          product_id: product?.id || null,
          last_message: product ? `Olá! Tenho interesse na peça "${product.title}".` : 'Olá!',
          client_unread_count: 0,
          artisan_unread_count: 1,
        })
        .select(`
          *,
          artesans (
            id,
            studio_name,
            avatar_url,
            profiles (
              full_name
            )
          ),
          client:profiles!conversations_client_id_fkey (
            id,
            full_name
          ),
          products (
            id,
            title,
            price_cents,
            image_url
          )
        `)
        .single();

      if (error || !created) {
        return { success: false, message: error?.message || 'Falha ao iniciar conversa.' };
      }

      return { success: true, conversation: mapConversationRow(created) };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Erro ao iniciar conversa.' };
    }
  }

  /**
   * Envia uma mensagem em uma conversa.
   */
  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase não conectado.' };
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content: content.trim(),
          is_read: false,
        })
        .select(`
          *,
          profiles (
            id,
            full_name,
            role
          )
        `)
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || 'Falha ao enviar mensagem.' };
      }

      return {
        success: true,
        message: mapMessageRow(data, data.profiles?.role || 'customer'),
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Exceção ao enviar mensagem.' };
    }
  }

  /**
   * Marca mensagens como lidas chamando a função RPC mark_conversation_read.
   */
  static async markAsRead(conversationId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.rpc('mark_conversation_read', { p_conversation_id: conversationId });
    } catch (err) {
      console.warn('[ChatService.markAsRead] Error marking as read:', err);
    }
  }

  /**
   * Inscreve-se nas mensagens em tempo real através do Supabase Realtime Channel.
   */
  static subscribeToMessages(conversationId: string, onNewMessage: (message: any) => void) {
    if (!isSupabaseConfigured()) return () => {};

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          onNewMessage(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}
