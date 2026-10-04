/**
 * Repositórios de Dados Artenós (Contratos para a Próxima Etapa - Supabase)
 *
 * Esta camada abstrairá as queries e mutações diretas do Supabase Client,
 * mantendo os componentes e serviços desacoplados da infraestrutura.
 */

import type {
  Product,
  Artisan,
  Customer,
  Supplier,
  Order,
  Conversation,
  Message,
  Material,
  Review,
  Favorite,
} from '../types';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByArtisanId(artisanId: string): Promise<Product[]>;
  create(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<boolean>;
}

export interface IArtisanRepository {
  findAll(): Promise<Artisan[]>;
  findById(id: string): Promise<Artisan | null>;
  create(artisan: Omit<Artisan, 'id'>): Promise<Artisan>;
  update(id: string, artisan: Partial<Artisan>): Promise<Artisan>;
}

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  create(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer>;
  update(id: string, customer: Partial<Customer>): Promise<Customer>;
}

export interface ISupplierRepository {
  findAll(): Promise<Supplier[]>;
  findById(id: string): Promise<Supplier | null>;
  findMaterials(supplierId?: string): Promise<Material[]>;
}

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order[]>;
  findByArtisanId(artisanId: string): Promise<Order[]>;
  create(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order>;
}

export interface IChatRepository {
  findConversations(userId: string): Promise<Conversation[]>;
  findMessages(conversationId: string): Promise<Message[]>;
  sendMessage(conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<Message>;
}

export interface IReviewRepository {
  findByProductId(productId: string): Promise<Review[]>;
  create(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review>;
}

export interface IFavoriteRepository {
  findByUserId(userId: string): Promise<Favorite[]>;
  toggle(userId: string, productId: string): Promise<boolean>;
}
