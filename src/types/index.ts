export type UserRole = 'customer' | 'artisan' | 'supplier' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  cpf?: string;
  // Artisan specific
  studioName?: string;
  specialties?: string[];
  location?: string;
  pixKey?: string;
  bio?: string;
  // Supplier specific
  companyName?: string;
  cnpj?: string;
  category?: string;
}

export interface RegisterPayload {
  role: UserRole;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  cpf?: string;
  studioName?: string;
  specialties?: string[];
  location?: string;
  pixKey?: string;
  bio?: string;
  companyName?: string;
  cnpj?: string;
  category?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  artisanId: string;
  artisanName: string;
  artisanLocation: string;
  artisanAvatar: string;
  category: string;
  materials: string[];
  dimensions: string;
  weightGrams: number;
  stock: number;
  isCustomizable: boolean;
  isReadyToShip: boolean;
  productionDays: number;
  priceCents: number; // Stored in cents to avoid float inaccuracies
  description: string;
  story: string;
  rating: number;
  reviewsCount: number;
  badge?: string; // e.g., 'ÚNICO DISPONÍVEL', 'DESTAQUE DO MÊS', 'EXCLUSIVO', 'SOB ENCOMENDA'
  imageUrl: string;
  videoUrl?: string;
}

export interface Artisan {
  id: string;
  name: string;
  studioName: string;
  bio: string;
  story: string;
  location: string;
  specialties: string[];
  avatarUrl: string;
  coverUrl?: string;
  rating: number;
  totalSales: number;
  phone: string;
  instagram: string;
  featuredQuote: string;
  status: 'active' | 'pending_approval' | 'suspended';
  pixKey?: string;
  bankName?: string;
  revenueCents?: number;
}

export interface SupplierCompany {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  category: string;
  location: string;
  phone: string;
  email: string;
  cnpj: string;
  minOrderCents: number;
  verified: boolean;
}

export interface SupplierMaterial {
  id: string;
  supplierId: string;
  supplierName: string;
  companyName: string;
  category: string;
  name: string;
  description: string;
  priceCents: number;
  unit: string; // e.g. "kg", "rolo 500g", "novelo", "peça", "bobina 1kg"
  stockStatus: string;
  stockQty: number;
  location: string;
  minOrderQty: number;
  imageUrl: string;
  // Specific craft batch details:
  batchCode?: string; // Lote (ex: #LT-2026-A4)
  shadeTone?: string; // Tonalidade/Banho (ex: "Banho 12 - Terracota Queimado")
}

export interface MaterialDemand {
  id: string;
  artisanId: string;
  artisanName: string;
  artisanLocation: string;
  title: string;
  details: string;
  category: string;
  quantity: string;
  deadlineDays: number;
  status: 'open' | 'quotes_received' | 'closed';
  quotesCount: number;
  createdAt: string;
}

export interface SupplierQuote {
  id: string;
  demandId: string;
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  priceCents: number;
  shippingCents: number;
  shippingDays: number;
  notes: string;
  status: 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizationNotes?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  artisanId: string;
  artisanName: string;
  unitPriceCents: number;
  quantity: number;
  imageUrl: string;
  customizationNotes?: string;
}

export type OrderStatus = 'created' | 'paid' | 'in_production' | 'shipped' | 'completed';

export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  shippingMethod: 'PAC' | 'Sedex' | 'Transportadora';
  totalCents: number;
  platformFeeCents: number; // Platform split percentage
  artisanPayoutCents: number; // Artisan payout
  paymentMethod: 'pix' | 'credit_card';
  status: OrderStatus;
  trackingCode?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  attachments?: string[];
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  productId?: string;
  productTitle?: string;
  productPriceCents?: number;
  productImg?: string;
  artisanId: string;
  artisanName: string;
  artisanAvatar: string;
  clientId: string;
  clientName: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface CustomPieceRequest {
  id: string;
  clientName: string;
  clientContact: string;
  description: string;
  dimensions: string;
  color: string;
  status: 'pending' | 'reviewed' | 'quoted';
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  favoriteProductIds: string[];
  preferences: string[];
}

export interface PlatformSettings {
  commissionPercent: number; // e.g. 10
  autoApproveArtisans: boolean;
  totalGMVCents: number;
  totalTransactionsCount: number;
}

