import {
  Product,
  Artisan,
  SupplierMaterial,
  MaterialDemand,
  Order,
  Conversation,
  SupplierCompany,
  CustomerProfile,
  PlatformSettings,
} from '../types';

/**
 * Estado Inicial Real da Plataforma Artenós (Pré-Conexão Supabase)
 * Conforme especificação:
 * users = 0 | products = 0 | orders = 0 | suppliers = 0
 * messages = 0 | reviews = 0 | favorites = 0 | sales = 0
 */

export const initialProducts: Product[] = [];
export const initialArtisans: Artisan[] = [];
export const initialSuppliersMaterials: SupplierMaterial[] = [];
export const initialMaterialDemands: MaterialDemand[] = [];
export const initialOrders: Order[] = [];
export const initialConversations: Conversation[] = [];

export const initialSupplierCompany: SupplierCompany = {
  id: '',
  name: '',
  logoUrl: '',
  description: '',
  category: '',
  location: '',
  phone: '',
  email: '',
  cnpj: '',
  minOrderCents: 0,
  verified: false,
};

export const initialCustomerProfile: CustomerProfile = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  cpf: '',
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
  },
  favoriteProductIds: [],
  preferences: [],
};

export const initialPlatformSettings: PlatformSettings = {
  commissionPercent: 10,
  autoApproveArtisans: false,
  totalGMVCents: 0,
  totalTransactionsCount: 0,
};
