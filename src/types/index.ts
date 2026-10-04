export type UserRole = 'customer' | 'artisan' | 'supplier' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  cpfCnpj?: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
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
  status?: 'pending_approval' | 'active' | 'suspended';
  verified?: boolean;
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

export interface Customer {
  id: string;
  profileId: string;
  fullName: string;
  email: string;
  phone?: string;
  cpf?: string;
  preferences?: string[];
  createdAt: string;
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

export interface Supplier {
  id: string;
  profileId?: string;
  companyName: string;
  tradeName?: string;
  cnpj?: string;
  category: string;
  description?: string;
  logoUrl?: string;
  location: string;
  phone: string;
  email: string;
  minOrderCents: number;
  rating: number;
  verified: boolean;
  createdAt?: string;
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  parentId?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
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
  categoryId?: string;
  materials: string[];
  dimensions: string;
  weightGrams: number;
  stock: number;
  isCustomizable: boolean;
  isReadyToShip: boolean;
  productionDays: number;
  priceCents: number;
  description: string;
  story: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  imageUrl: string;
  videoUrl?: string;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizationNotes?: string;
}

export interface Cart {
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
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

export type OrderStatus = 'created' | 'paid' | 'in_production' | 'shipped' | 'completed' | 'cancelled';

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
  platformFeeCents: number;
  artisanPayoutCents: number;
  paymentMethod: 'pix' | 'credit_card';
  status: OrderStatus;
  trackingCode?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  gatewayName: string;
  method: 'pix' | 'credit_card';
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  amountCents: number;
  splitPlatformCents: number;
  splitArtisanCents: number;
  paidAt?: string;
}

export interface Shipping {
  id: string;
  orderId: string;
  carrier: string;
  service: string;
  trackingCode?: string;
  priceCents: number;
  estimatedDeliveryDays: number;
  status: 'pending' | 'shipped' | 'delivered';
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

export type Message = ChatMessage;

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

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface Material {
  id: string;
  supplierId: string;
  supplierName: string;
  companyName: string;
  category: string;
  name: string;
  description: string;
  priceCents: number;
  unit: string;
  stockStatus: string;
  stockQty: number;
  location: string;
  minOrderQty: number;
  imageUrl: string;
  batchCode?: string;
  shadeTone?: string;
}

export type SupplierMaterial = Material;

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
  commissionPercent: number;
  autoApproveArtisans: boolean;
  totalGMVCents: number;
  totalTransactionsCount: number;
}
