/**
 * Tipos TypeScript gerados a partir do Schema Consolidado Supabase / PostgreSQL (Versão 3.0)
 * Tabelas: profiles, customer_profiles, artesans, suppliers, addresses, categories, products,
 * product_images, inventory, artisan_pricing_calculations, customer_favorites, cart_items,
 * orders, order_items, order_fulfillments, payments, payment_webhook_events, artisan_payouts,
 * product_reviews, supplier_materials, material_demands, supplier_quotes, conversations,
 * messages, message_attachments, custom_piece_requests, assisted_signup_requests, notifications,
 * user_consents, platform_settings, audit_logs.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'customer' | 'artisan' | 'supplier' | 'admin';
export type ArtisanStatus = 'pending_approval' | 'active' | 'suspended';
export type OrderStatus = 'created' | 'paid' | 'in_production' | 'shipped' | 'completed' | 'cancelled' | 'refunded';
export type FulfillmentStatus = 'pending' | 'in_production' | 'shipped' | 'completed' | 'cancelled';
export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded' | 'disputed';
export type ShippingMethod = 'PAC' | 'Sedex' | 'Transportadora' | 'Retirada';
export type DemandStatus = 'open' | 'quotes_received' | 'closed' | 'cancelled';
export type QuoteStatus = 'sent' | 'accepted' | 'rejected' | 'expired';
export type CustomPieceStatus = 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'rejected';
export type AssistedSignupStatus = 'pending' | 'contacted' | 'completed' | 'declined';
export type ReservationStatus = 'active' | 'consumed' | 'released' | 'expired';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          cpf_cnpj: string | null;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          cpf_cnpj?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          cpf_cnpj?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_profiles: {
        Row: {
          profile_id: string;
          preferences: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          preferences?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          profile_id?: string;
          preferences?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      artesans: {
        Row: {
          id: string;
          profile_id: string;
          studio_name: string;
          bio: string;
          story: string;
          location_city: string | null;
          location_state: string | null;
          specialties: string[];
          avatar_url: string | null;
          cover_url: string | null;
          rating_avg: number;
          total_sales: number;
          revenue_cents: number;
          phone_whatsapp: string | null;
          instagram_handle: string | null;
          featured_quote: string | null;
          recipient_gateway_id: string | null;
          assisted_signup: boolean;
          status: ArtisanStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          studio_name: string;
          bio?: string;
          story?: string;
          location_city?: string | null;
          location_state?: string | null;
          specialties?: string[];
          avatar_url?: string | null;
          cover_url?: string | null;
          rating_avg?: number;
          total_sales?: number;
          revenue_cents?: number;
          phone_whatsapp?: string | null;
          instagram_handle?: string | null;
          featured_quote?: string | null;
          recipient_gateway_id?: string | null;
          assisted_signup?: boolean;
          status?: ArtisanStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          studio_name?: string;
          bio?: string;
          story?: string;
          location_city?: string | null;
          location_state?: string | null;
          specialties?: string[];
          avatar_url?: string | null;
          cover_url?: string | null;
          rating_avg?: number;
          total_sales?: number;
          revenue_cents?: number;
          phone_whatsapp?: string | null;
          instagram_handle?: string | null;
          featured_quote?: string | null;
          recipient_gateway_id?: string | null;
          assisted_signup?: boolean;
          status?: ArtisanStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          trade_name: string | null;
          cnpj: string | null;
          category: string;
          description: string | null;
          logo_url: string | null;
          location_city: string | null;
          location_state: string | null;
          phone: string | null;
          email: string | null;
          min_order_cents: number;
          rating_avg: number;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name: string;
          trade_name?: string | null;
          cnpj?: string | null;
          category: string;
          description?: string | null;
          logo_url?: string | null;
          location_city?: string | null;
          location_state?: string | null;
          phone?: string | null;
          email?: string | null;
          min_order_cents?: number;
          rating_avg?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          company_name?: string;
          trade_name?: string | null;
          cnpj?: string | null;
          category?: string;
          description?: string | null;
          logo_url?: string | null;
          location_city?: string | null;
          location_state?: string | null;
          phone?: string | null;
          email?: string | null;
          min_order_cents?: number;
          rating_avg?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          profile_id: string;
          recipient_name: string;
          recipient_phone: string | null;
          postal_code: string;
          street: string;
          number: string;
          complement: string | null;
          neighborhood: string;
          city: string;
          state: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          recipient_name: string;
          recipient_phone?: string | null;
          postal_code: string;
          street: string;
          number: string;
          complement?: string | null;
          neighborhood: string;
          city: string;
          state: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          recipient_name?: string;
          recipient_phone?: string | null;
          postal_code?: string;
          street?: string;
          number?: string;
          complement?: string | null;
          neighborhood?: string;
          city?: string;
          state?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          icon_name: string | null;
          parent_id: number | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          icon_name?: string | null;
          parent_id?: number | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          icon_name?: string | null;
          parent_id?: number | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          artisan_id: string;
          category_id: number | null;
          title: string;
          slug: string;
          description: string;
          story: string | null;
          materials: string[];
          dimensions_str: string | null;
          weight_grams: number | null;
          production_days: number;
          is_customizable: boolean;
          is_ready_to_ship: boolean;
          cost_cents: number | null;
          margin_percent: number;
          price_cents: number;
          badge: string | null;
          image_url: string | null;
          video_url: string | null;
          rating_avg: number;
          reviews_count: number;
          views_count: number;
          sales_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artisan_id: string;
          category_id?: number | null;
          title: string;
          slug: string;
          description: string;
          story?: string | null;
          materials?: string[];
          dimensions_str?: string | null;
          weight_grams?: number | null;
          production_days?: number;
          is_customizable?: boolean;
          is_ready_to_ship?: boolean;
          cost_cents?: number | null;
          margin_percent?: number;
          price_cents: number;
          badge?: string | null;
          image_url?: string | null;
          video_url?: string | null;
          rating_avg?: number;
          reviews_count?: number;
          views_count?: number;
          sales_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artisan_id?: string;
          category_id?: number | null;
          title?: string;
          slug?: string;
          description?: string;
          story?: string | null;
          materials?: string[];
          dimensions_str?: string | null;
          weight_grams?: number | null;
          production_days?: number;
          is_customizable?: boolean;
          is_ready_to_ship?: boolean;
          cost_cents?: number | null;
          margin_percent?: number;
          price_cents?: number;
          badge?: string | null;
          image_url?: string | null;
          video_url?: string | null;
          rating_avg?: number;
          reviews_count?: number;
          views_count?: number;
          sales_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      inventory: {
        Row: {
          product_id: string;
          stock_quantity: number;
          reserved_quantity: number;
          low_stock_threshold: number;
          version: number;
          updated_at: string;
        };
        Insert: {
          product_id: string;
          stock_quantity?: number;
          reserved_quantity?: number;
          low_stock_threshold?: number;
          version?: number;
          updated_at?: string;
        };
        Update: {
          product_id?: string;
          stock_quantity?: number;
          reserved_quantity?: number;
          low_stock_threshold?: number;
          version?: number;
          updated_at?: string;
        };
      };
      artisan_pricing_calculations: {
        Row: {
          id: string;
          artisan_id: string;
          piece_title: string;
          raw_materials_cost_cents: number;
          hours_worked: number;
          hourly_rate_cents: number;
          packaging_cost_cents: number;
          fixed_overhead_cents: number;
          desired_profit_percent: number;
          platform_fee_percent: number;
          suggested_price_cents: number;
          applied_to_product_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          artisan_id: string;
          piece_title: string;
          raw_materials_cost_cents?: number;
          hours_worked?: number;
          hourly_rate_cents?: number;
          packaging_cost_cents?: number;
          fixed_overhead_cents?: number;
          desired_profit_percent?: number;
          platform_fee_percent?: number;
          suggested_price_cents?: number;
          applied_to_product_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          artisan_id?: string;
          piece_title?: string;
          raw_materials_cost_cents?: number;
          hours_worked?: number;
          hourly_rate_cents?: number;
          packaging_cost_cents?: number;
          fixed_overhead_cents?: number;
          desired_profit_percent?: number;
          platform_fee_percent?: number;
          suggested_price_cents?: number;
          applied_to_product_id?: string | null;
          created_at?: string;
        };
      };
      customer_favorites: {
        Row: {
          profile_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          profile_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          profile_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          profile_id: string;
          product_id: string;
          quantity: number;
          customization_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          product_id: string;
          quantity?: number;
          customization_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          product_id?: string;
          quantity?: number;
          customization_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          client_name: string;
          client_email: string;
          client_phone: string | null;
          status: OrderStatus;
          subtotal_cents: number;
          shipping_cents: number;
          shipping_method: ShippingMethod;
          total_cents: number;
          platform_fee_cents: number;
          artisan_payout_cents: number;
          payment_method: PaymentMethod;
          shipping_address: Json;
          tracking_code: string | null;
          estimated_delivery_days: number | null;
          shipped_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          client_name: string;
          client_email: string;
          client_phone?: string | null;
          status?: OrderStatus;
          subtotal_cents: number;
          shipping_cents?: number;
          shipping_method?: ShippingMethod;
          total_cents: number;
          platform_fee_cents?: number;
          artisan_payout_cents?: number;
          payment_method?: PaymentMethod;
          shipping_address: Json;
          tracking_code?: string | null;
          estimated_delivery_days?: number | null;
          shipped_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          client_name?: string;
          client_email?: string;
          client_phone?: string | null;
          status?: OrderStatus;
          subtotal_cents?: number;
          shipping_cents?: number;
          shipping_method?: ShippingMethod;
          total_cents?: number;
          platform_fee_cents?: number;
          artisan_payout_cents?: number;
          payment_method?: PaymentMethod;
          shipping_address?: Json;
          tracking_code?: string | null;
          estimated_delivery_days?: number | null;
          shipped_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          artisan_id: string;
          title: string;
          unit_price_cents: number;
          quantity: number;
          item_subtotal_cents: number;
          artisan_payout_cents: number;
          image_url: string | null;
          customization_notes: string | null;
          product_snapshot: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          artisan_id: string;
          title: string;
          unit_price_cents: number;
          quantity: number;
          item_subtotal_cents: number;
          artisan_payout_cents?: number;
          image_url?: string | null;
          customization_notes?: string | null;
          product_snapshot?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          artisan_id?: string;
          title?: string;
          unit_price_cents?: number;
          quantity?: number;
          item_subtotal_cents?: number;
          artisan_payout_cents?: number;
          image_url?: string | null;
          customization_notes?: string | null;
          product_snapshot?: Json | null;
          created_at?: string;
        };
      };
      order_fulfillments: {
        Row: {
          id: string;
          order_id: string;
          artisan_id: string;
          status: FulfillmentStatus;
          tracking_code: string | null;
          shipped_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          artisan_id: string;
          status?: FulfillmentStatus;
          tracking_code?: string | null;
          shipped_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          artisan_id?: string;
          status?: FulfillmentStatus;
          tracking_code?: string | null;
          shipped_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          gateway_name: string;
          gateway_payment_id: string | null;
          idempotency_key: string;
          method: PaymentMethod;
          status: PaymentStatus;
          amount_cents: number;
          split_platform_cents: number;
          split_artisan_cents: number;
          pix_qr_code: string | null;
          pix_copy_paste: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          gateway_name?: string;
          gateway_payment_id?: string | null;
          idempotency_key?: string;
          method: PaymentMethod;
          status?: PaymentStatus;
          amount_cents: number;
          split_platform_cents?: number;
          split_artisan_cents?: number;
          pix_qr_code?: string | null;
          pix_copy_paste?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          gateway_name?: string;
          gateway_payment_id?: string | null;
          idempotency_key?: string;
          method?: PaymentMethod;
          status?: PaymentStatus;
          amount_cents?: number;
          split_platform_cents?: number;
          split_artisan_cents?: number;
          pix_qr_code?: string | null;
          pix_copy_paste?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      artisan_payouts: {
        Row: {
          id: string;
          artisan_id: string;
          order_id: string;
          amount_cents: number;
          fee_deducted_cents: number;
          net_payout_cents: number;
          gateway_transfer_id: string | null;
          status: string;
          scheduled_for: string;
          transferred_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          artisan_id: string;
          order_id: string;
          amount_cents: number;
          fee_deducted_cents?: number;
          net_payout_cents: number;
          gateway_transfer_id?: string | null;
          status?: string;
          scheduled_for: string;
          transferred_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          artisan_id?: string;
          order_id?: string;
          amount_cents?: number;
          fee_deducted_cents?: number;
          net_payout_cents?: number;
          gateway_transfer_id?: string | null;
          status?: string;
          scheduled_for?: string;
          transferred_at?: string | null;
          created_at?: string;
        };
      };
      product_reviews: {
        Row: {
          id: string;
          product_id: string;
          order_id: string | null;
          profile_id: string;
          rating: number;
          comment: string | null;
          images: string[];
          is_verified_purchase: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          order_id?: string | null;
          profile_id: string;
          rating: number;
          comment?: string | null;
          images?: string[];
          is_verified_purchase?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          order_id?: string | null;
          profile_id?: string;
          rating?: number;
          comment?: string | null;
          images?: string[];
          is_verified_purchase?: boolean;
          created_at?: string;
        };
      };
      supplier_materials: {
        Row: {
          id: string;
          supplier_id: string;
          name: string;
          category: string;
          description: string;
          price_cents: number;
          unit: string;
          min_order_qty: number;
          stock_qty: number;
          stock_status: string;
          location: string | null;
          image_url: string | null;
          batch_code: string | null;
          shade_tone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          name: string;
          category: string;
          description: string;
          price_cents: number;
          unit: string;
          min_order_qty?: number;
          stock_qty?: number;
          stock_status?: string;
          location?: string | null;
          image_url?: string | null;
          batch_code?: string | null;
          shade_tone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          name?: string;
          category?: string;
          description?: string;
          price_cents?: number;
          unit?: string;
          min_order_qty?: number;
          stock_qty?: number;
          stock_status?: string;
          location?: string | null;
          image_url?: string | null;
          batch_code?: string | null;
          shade_tone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      material_demands: {
        Row: {
          id: string;
          artisan_id: string;
          title: string;
          details: string;
          category: string;
          quantity: string;
          deadline_days: number;
          status: DemandStatus;
          quotes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artisan_id: string;
          title: string;
          details: string;
          category: string;
          quantity: string;
          deadline_days?: number;
          status?: DemandStatus;
          quotes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artisan_id?: string;
          title?: string;
          details?: string;
          category?: string;
          quantity?: string;
          deadline_days?: number;
          status?: DemandStatus;
          quotes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      supplier_quotes: {
        Row: {
          id: string;
          demand_id: string;
          supplier_id: string;
          price_cents: number;
          shipping_cents: number;
          shipping_days: number;
          notes: string | null;
          status: QuoteStatus;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          demand_id: string;
          supplier_id: string;
          price_cents: number;
          shipping_cents?: number;
          shipping_days?: number;
          notes?: string | null;
          status?: QuoteStatus;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          demand_id?: string;
          supplier_id?: string;
          price_cents?: number;
          shipping_cents?: number;
          shipping_days?: number;
          notes?: string | null;
          status?: QuoteStatus;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          artisan_id: string;
          client_id: string;
          product_id: string | null;
          last_message: string | null;
          last_message_at: string;
          client_unread_count: number;
          artisan_unread_count: number;
          is_closed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artisan_id: string;
          client_id: string;
          product_id?: string | null;
          last_message?: string | null;
          last_message_at?: string;
          client_unread_count?: number;
          artisan_unread_count?: number;
          is_closed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artisan_id?: string;
          client_id?: string;
          product_id?: string | null;
          last_message?: string | null;
          last_message_at?: string;
          client_unread_count?: number;
          artisan_unread_count?: number;
          is_closed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
      };
      message_attachments: {
        Row: {
          id: string;
          message_id: string;
          uploader_id: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          size_bytes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          uploader_id: string;
          storage_path: string;
          file_name: string;
          mime_type: string;
          size_bytes: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          uploader_id?: string;
          storage_path?: string;
          file_name?: string;
          mime_type?: string;
          size_bytes?: number;
          created_at?: string;
        };
      };
      custom_piece_requests: {
        Row: {
          id: string;
          artisan_id: string;
          client_id: string | null;
          client_name: string;
          client_contact: string;
          description: string;
          dimensions: string | null;
          color_palette: string | null;
          status: CustomPieceStatus;
          quoted_price_cents: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artisan_id: string;
          client_id?: string | null;
          client_name: string;
          client_contact: string;
          description: string;
          dimensions?: string | null;
          color_palette?: string | null;
          status?: CustomPieceStatus;
          quoted_price_cents?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artisan_id?: string;
          client_id?: string | null;
          client_name?: string;
          client_contact?: string;
          description?: string;
          dimensions?: string | null;
          color_palette?: string | null;
          status?: CustomPieceStatus;
          quoted_price_cents?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assisted_signup_requests: {
        Row: {
          id: string;
          artisan_name: string;
          phone_whatsapp: string;
          city: string;
          state: string;
          craft_type: string;
          preferred_channel: 'whatsapp' | 'call';
          preferred_time: string | null;
          status: AssistedSignupStatus;
          assigned_agent_id: string | null;
          agent_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artisan_name: string;
          phone_whatsapp: string;
          city: string;
          state: string;
          craft_type: string;
          preferred_channel?: 'whatsapp' | 'call';
          preferred_time?: string | null;
          status?: AssistedSignupStatus;
          assigned_agent_id?: string | null;
          agent_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artisan_name?: string;
          phone_whatsapp?: string;
          city?: string;
          state?: string;
          craft_type?: string;
          preferred_channel?: 'whatsapp' | 'call';
          preferred_time?: string | null;
          status?: AssistedSignupStatus;
          assigned_agent_id?: string | null;
          agent_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      platform_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Json;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          type: string;
          title: string;
          body?: string | null;
          data?: Json;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          data?: Json;
          read_at?: string | null;
          created_at?: string;
        };
      };
      user_consents: {
        Row: {
          id: string;
          profile_id: string;
          consent_type: string;
          policy_version: string;
          granted: boolean;
          ip_hash: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          consent_type: string;
          policy_version: string;
          granted: boolean;
          ip_hash?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          consent_type?: string;
          policy_version?: string;
          granted?: boolean;
          ip_hash?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: number;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: number;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: number;
          actor_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      owns_artisan: {
        Args: { p_artisan_id: string };
        Returns: boolean;
      };
      owns_supplier: {
        Args: { p_supplier_id: string };
        Returns: boolean;
      };
      can_access_order: {
        Args: { p_order_id: string };
        Returns: boolean;
      };
      can_access_conversation: {
        Args: { p_conversation_id: string };
        Returns: boolean;
      };
      mark_conversation_read: {
        Args: { p_conversation_id: string };
        Returns: void;
      };
    };
  };
}
