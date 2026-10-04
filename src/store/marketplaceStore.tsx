import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Artisan,
  SupplierMaterial,
  MaterialDemand,
  Order,
  Conversation,
  ChatMessage,
  CartItem,
  UserRole,
  CustomPieceRequest,
  SupplierQuote,
  SupplierCompany,
  CustomerProfile,
  PlatformSettings,
  AuthUser,
  RegisterPayload,
} from '../types';
import {
  initialProducts,
  initialArtisans,
  initialSuppliersMaterials,
  initialMaterialDemands,
  initialOrders,
  initialConversations,
  initialSupplierCompany,
  initialCustomerProfile,
  initialPlatformSettings,
} from '../data/mockData';
import {
  ProductsService,
  ArtisansService,
  SuppliersService,
  OrdersService,
  ChatService,
  AuthService,
  CustomersService,
} from '../services';
import { isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase/client';

export interface PendingActionNotice {
  title: string;
  description: string;
  validatedDetails?: string;
}

interface MarketplaceContextType {
  // Navigation & Current Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentRoute: string;
  navigate: (route: string) => void;

  // Supabase Live Connection
  isSupabaseConnected: boolean;
  syncSupabaseData: () => Promise<void>;

  // Multi-profile Auth State
  currentUser: AuthUser | null;
  sessions: Record<UserRole, AuthUser | null>;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password?: string; role: UserRole; rememberMe?: boolean }) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: (role?: UserRole) => Promise<void>;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'rating' | 'reviewsCount'>) => Promise<void>;
  updateProduct: (productId: string, updated: Partial<Product>) => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Artisans
  artisans: Artisan[];
  currentArtisan: Artisan | null;
  updateArtisanProfile: (updated: Partial<Artisan>) => Promise<void>;
  approveArtisan: (artisanId: string) => Promise<void>;

  // Customer Profile & Favorites
  customerProfile: CustomerProfile;
  updateCustomerProfile: (updated: Partial<CustomerProfile>) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, customizationNotes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingCode?: string) => Promise<void>;

  // Chat
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (conversationId: string, content: string, attachments?: string[]) => Promise<void>;
  startChatWithArtisan: (product: Product) => Promise<void>;

  // Supplier Module
  supplierCompany: SupplierCompany;
  updateSupplierCompany: (updated: Partial<SupplierCompany>) => Promise<void>;
  supplierMaterials: SupplierMaterial[];
  addSupplierMaterial: (mat: Omit<SupplierMaterial, 'id'>) => Promise<void>;
  updateSupplierMaterial: (matId: string, updated: Partial<SupplierMaterial>) => Promise<void>;
  deleteSupplierMaterial: (matId: string) => Promise<void>;

  // Demands & Quotes
  demands: MaterialDemand[];
  addDemand: (demand: Omit<MaterialDemand, 'id' | 'quotesCount' | 'createdAt' | 'status'>) => Promise<void>;
  quotes: Record<string, SupplierQuote[]>;
  addSupplierQuote: (demandId: string, quote: Omit<SupplierQuote, 'id' | 'demandId' | 'createdAt'>) => Promise<void>;

  // Custom Piece Commissions
  customRequests: CustomPieceRequest[];
  submitCustomRequest: (req: Omit<CustomPieceRequest, 'id' | 'createdAt' | 'status'>) => void;

  // Platform Governance Settings
  platformSettings: PlatformSettings;
  updatePlatformCommission: (percent: number) => void;
  toggleAutoApproveArtisans: () => void;

  // Modals & Notices
  isArchitectureOpen: boolean;
  setIsArchitectureOpen: (open: boolean) => void;
  isAssistedSignupOpen: boolean;
  setIsAssistedSignupOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;

  pendingActionNotice: PendingActionNotice | null;
  setPendingActionNotice: (notice: PendingActionNotice | null) => void;
  notifyPendingIntegration: (actionName: string, validatedDetails?: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation sync with Hash
  const getInitialRoute = () => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);

  const isArtisanDashboardRoute = (route: string) => {
    return [
      '/artesa/dashboard',
      '/artesa/minha-loja',
      '/artesa/produtos',
      '/artesa/pedidos',
      '/artesa/precificacao',
      '/artesa/estoque',
      '/artesa/mensagens',
      '/artesa/financeiro',
      '/artesa/login',
      '/artesa/cadastrar',
    ].some((p) => route.startsWith(p));
  };

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (isArtisanDashboardRoute(hash)) return 'artisan';
    if (hash.startsWith('/fornecedor')) return 'supplier';
    if (hash.startsWith('/admin')) return 'admin';
    return 'customer';
  });

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (role === 'customer') {
      navigate('/');
    } else if (role === 'artisan') {
      navigate('/artesa/dashboard');
    } else if (role === 'supplier') {
      navigate('/fornecedor/dashboard');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '') || '/';
      setCurrentRoute(hash);
      if (isArtisanDashboardRoute(hash)) setCurrentRoleState('artisan');
      else if (hash.startsWith('/fornecedor')) setCurrentRoleState('supplier');
      else if (hash.startsWith('/admin')) setCurrentRoleState('admin');
      else setCurrentRoleState('customer');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Supabase Connection Status
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured());

  // Authentication Sessions
  const [sessions, setSessions] = useState<Record<UserRole, AuthUser | null>>({
    customer: null,
    artisan: null,
    supplier: null,
    admin: null,
  });

  const currentUser = sessions[currentRole];
  const isAuthenticated = Boolean(currentUser);

  // Data Collections (initialized with clean state)
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [artisans, setArtisans] = useState<Artisan[]>(initialArtisans);
  const [currentArtisan, setCurrentArtisan] = useState<Artisan | null>(null);

  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(initialCustomerProfile);
  const [supplierCompany, setSupplierCompany] = useState<SupplierCompany>(initialSupplierCompany);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  const [supplierMaterials, setSupplierMaterials] = useState<SupplierMaterial[]>(initialSuppliersMaterials);
  const [demands, setDemands] = useState<MaterialDemand[]>(initialMaterialDemands);
  const [quotes, setQuotes] = useState<Record<string, SupplierQuote[]>>({});
  const [customRequests, setCustomRequests] = useState<CustomPieceRequest[]>([]);

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(initialPlatformSettings);

  // Modals
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAssistedSignupOpen, setIsAssistedSignupOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [pendingActionNotice, setPendingActionNotice] = useState<PendingActionNotice | null>(null);

  const notifyPendingIntegration = (actionName: string, validatedDetails?: string) => {
    setPendingActionNotice({
      title: isSupabaseConfigured() ? 'Ação Processada' : 'Conexão Supabase Disponível',
      description: isSupabaseConfigured()
        ? `${actionName} foi sincronizado com o Supabase.`
        : `${actionName} validado no front-end. Conecte sua URL e Chave do Supabase para persistência em tempo real.`,
      validatedDetails,
    });
  };

  // Sync / Load live data from Supabase
  const syncSupabaseData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setIsSupabaseConnected(false);
      return;
    }

    try {
      const ping = await testSupabaseConnection();
      setIsSupabaseConnected(ping.success);

      if (ping.success) {
        const [prods, arts, mats, dems, ords, convs] = await Promise.all([
          ProductsService.getProducts(),
          ArtisansService.getArtisans(),
          SuppliersService.getMaterials(),
          SuppliersService.getDemands(),
          OrdersService.getOrders(),
          ChatService.getConversations(),
        ]);

        if (prods.length > 0) setProducts(prods);
        if (arts.length > 0) {
          setArtisans(arts);
          if (!currentArtisan) setCurrentArtisan(arts[0]);
        }
        if (mats.length > 0) setSupplierMaterials(mats);
        if (dems.length > 0) setDemands(dems);
        if (ords.length > 0) setOrders(ords);
        if (convs.length > 0) setConversations(convs);

        // Verifica sessão ativa
        const user = await AuthService.getCurrentUser();
        if (user) {
          setSessions((prev) => ({ ...prev, [user.role]: user }));
        }
      }
    } catch (err) {
      console.warn('[syncSupabaseData] Warning:', err);
    }
  }, [currentArtisan]);

  useEffect(() => {
    syncSupabaseData();
  }, [syncSupabaseData]);

  // Auth Operations
  const login = async (credentials: { email: string; password?: string; role: UserRole; rememberMe?: boolean }) => {
    if (isSupabaseConfigured()) {
      const res = await AuthService.login(credentials);
      if (res.success && res.user) {
        setSessions((prev) => ({ ...prev, [credentials.role]: res.user! }));
        return { success: true };
      }
      return { success: false, error: res.error || 'Credenciais inválidas no Supabase.' };
    }

    // Fallback demo session quando Supabase ainda não estiver conectado
    const demoUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: credentials.role,
    };
    setSessions((prev) => ({ ...prev, [credentials.role]: demoUser }));
    return { success: true };
  };

  const register = async (payload: RegisterPayload) => {
    if (isSupabaseConfigured()) {
      const res = await AuthService.register(payload);
      if (res.success && res.user) {
        setSessions((prev) => ({ ...prev, [payload.role]: res.user! }));
        return { success: true };
      }
      return { success: false, error: res.error || 'Erro ao registrar no Supabase.' };
    }

    const demoUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      studioName: payload.studioName,
      location: payload.location,
    };
    setSessions((prev) => ({ ...prev, [payload.role]: demoUser }));
    return { success: true };
  };

  const logout = async (role?: UserRole) => {
    const targetRole = role || currentRole;
    await AuthService.logout();
    setSessions((prev) => ({ ...prev, [targetRole]: null }));
  };

  // Product Operations
  const addProduct = async (productData: Omit<Product, 'id' | 'slug' | 'rating' | 'reviewsCount'>) => {
    const artisanId = currentArtisan?.id || sessions.artisan?.id || '00000000-0000-0000-0000-000000000001';

    if (isSupabaseConfigured()) {
      const res = await ProductsService.createProduct({
        ...productData,
        artisanId,
      });

      if (res.success && res.data) {
        setProducts((prev) => [res.data!, ...prev]);
        setPendingActionNotice({
          title: 'Produto Salvo no Supabase!',
          description: `A peça "${productData.title}" foi gravada com sucesso nas tabelas products e inventory do seu banco de dados.`,
        });
        return;
      }
    }

    // Adiciona na memória local caso Supabase não esteja conectado
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug: productData.title.toLowerCase().replace(/\s+/g, '-'),
      rating: 5.0,
      reviewsCount: 0,
      ...productData,
      artisanId,
      artisanName: currentArtisan?.name || 'Artesã',
      artisanLocation: currentArtisan?.location || 'Brasil',
      artisanAvatar: currentArtisan?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    setPendingActionNotice({
      title: 'Produto Cadastrado!',
      description: `A peça "${productData.title}" foi adicionada. Conecte suas credenciais do Supabase para persistir permanentemente.`,
    });
  };

  const updateProduct = async (productId: string, updated: Partial<Product>) => {
    if (isSupabaseConfigured()) {
      await ProductsService.updateProduct(productId, updated);
    }
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updated } : p)));
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    if (isSupabaseConfigured()) {
      await ProductsService.updateProduct(productId, { stock: newStock });
    }
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)));
  };

  const deleteProduct = async (productId: string) => {
    if (isSupabaseConfigured()) {
      await ProductsService.deleteProduct(productId);
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Artisan Profile Operations
  const updateArtisanProfile = async (updated: Partial<Artisan>) => {
    if (currentArtisan && isSupabaseConfigured()) {
      await ArtisansService.updateProfile(currentArtisan.id, updated);
    }
    setCurrentArtisan((prev) => (prev ? { ...prev, ...updated } : null));
    setArtisans((prev) =>
      prev.map((a) => (a.id === currentArtisan?.id ? { ...a, ...updated } : a))
    );
  };

  const approveArtisan = async (artisanId: string) => {
    if (isSupabaseConfigured()) {
      await ArtisansService.approveArtisan(artisanId);
    }
    setArtisans((prev) =>
      prev.map((a) => (a.id === artisanId ? { ...a, status: 'active' } : a))
    );
  };

  // Customer Profile Operations
  const updateCustomerProfile = async (updated: Partial<CustomerProfile>) => {
    if (sessions.customer?.id && isSupabaseConfigured()) {
      await CustomersService.updateProfile(sessions.customer.id, updated);
    }
    setCustomerProfile((prev) => ({ ...prev, ...updated }));
  };

  const toggleFavorite = async (productId: string) => {
    if (sessions.customer?.id && isSupabaseConfigured()) {
      await CustomersService.toggleFavorite(sessions.customer.id, productId);
    }
    setCustomerProfile((prev) => {
      const current = prev.favoriteProductIds || [];
      const exists = current.includes(productId);
      return {
        ...prev,
        favoriteProductIds: exists ? current.filter((id) => id !== productId) : [...current, productId],
      };
    });
  };

  const isFavorite = (productId: string) => {
    return customerProfile.favoriteProductIds?.includes(productId) || false;
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, customizationNotes = '') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, customizationNotes: customizationNotes || item.customizationNotes }
            : item
        );
      }
      return [...prev, { product, quantity, customizationNotes }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  // Order Operations
  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order | null> => {
    if (isSupabaseConfigured()) {
      const res = await OrdersService.createOrder({
        customerId: sessions.customer?.id,
        clientName: orderData.clientName,
        clientEmail: orderData.clientEmail,
        clientPhone: orderData.clientPhone,
        shippingAddress: orderData.clientAddress,
        items: cart,
        subtotalCents: orderData.subtotalCents,
        shippingCents: orderData.shippingCents,
        shippingMethod: orderData.shippingMethod,
        totalCents: orderData.totalCents,
        paymentMethod: orderData.paymentMethod,
        platformFeePercent: platformSettings.commissionPercent,
      });

      if (res.success && res.order) {
        setOrders((prev) => [res.order!, ...prev]);
        clearCart();
        return res.order;
      }
    }

    // Fallback local memory
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ART-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], trackingCode?: string) => {
    if (isSupabaseConfigured()) {
      await OrdersService.updateOrderStatus(orderId, status, trackingCode);
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, trackingCode: trackingCode || o.trackingCode } : o))
    );
  };

  // Chat Operations
  const sendMessage = async (conversationId: string, content: string) => {
    const senderId = currentUser?.id || '00000000-0000-0000-0000-000000000001';

    if (isSupabaseConfigured()) {
      const res = await ChatService.sendMessage(conversationId, senderId, content);
      if (res.success && res.message) {
        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), res.message!],
        }));
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, lastMessage: content, updatedAt: new Date().toISOString() } : c))
        );
        return;
      }
    }

    const localMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName: currentUser?.name || 'Eu',
      senderRole: currentRole,
      content,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), localMsg],
    }));

    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, lastMessage: content, updatedAt: new Date().toISOString() } : c))
    );
  };

  const startChatWithArtisan = async (product: Product) => {
    const clientId = sessions.customer?.id || '00000000-0000-0000-0000-000000000002';

    if (isSupabaseConfigured()) {
      const res = await ChatService.getOrCreateConversation(clientId, product.artisanId, product);
      if (res.success && res.conversation) {
        setActiveConversation(res.conversation);
        if (!conversations.some((c) => c.id === res.conversation!.id)) {
          setConversations((prev) => [res.conversation!, ...prev]);
        }
        navigate('/mensagens');
        return;
      }
    }

    // Local fallback
    const convId = `conv-${product.id}`;
    const newConv: Conversation = {
      id: convId,
      productId: product.id,
      productTitle: product.title,
      productPriceCents: product.priceCents,
      productImg: product.imageUrl,
      artisanId: product.artisanId,
      artisanName: product.artisanName,
      artisanAvatar: product.artisanAvatar,
      clientId,
      clientName: currentUser?.name || 'Cliente',
      lastMessage: `Olá! Tenho interesse na peça "${product.title}".`,
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
    };

    setActiveConversation(newConv);
    if (!conversations.some((c) => c.id === convId)) {
      setConversations((prev) => [newConv, ...prev]);
    }
    navigate('/mensagens');
  };

  // Supplier Operations
  const updateSupplierCompany = async (updated: Partial<SupplierCompany>) => {
    if (supplierCompany.id && isSupabaseConfigured()) {
      await SuppliersService.updateCompany(supplierCompany.id, updated);
    }
    setSupplierCompany((prev) => ({ ...prev, ...updated }));
  };

  const addSupplierMaterial = async (mat: Omit<SupplierMaterial, 'id'>) => {
    const supplierId = supplierCompany.id || '00000000-0000-0000-0000-000000000003';

    if (isSupabaseConfigured()) {
      const res = await SuppliersService.createMaterial({
        ...mat,
        supplierId,
      });

      if (res.success && res.data) {
        setSupplierMaterials((prev) => [res.data!, ...prev]);
        setPendingActionNotice({
          title: 'Insumo Salvo no Supabase!',
          description: `O material "${mat.name}" foi registrado com sucesso na tabela supplier_materials.`,
        });
        return;
      }
    }

    const newMat: SupplierMaterial = {
      id: `mat-${Date.now()}`,
      ...mat,
      supplierId,
    };
    setSupplierMaterials((prev) => [newMat, ...prev]);
    setPendingActionNotice({
      title: 'Insumo Cadastrado!',
      description: `O material "${mat.name}" foi registrado. Conecte o Supabase para sincronização permanente.`,
    });
  };

  const updateSupplierMaterial = async (matId: string, updated: Partial<SupplierMaterial>) => {
    setSupplierMaterials((prev) => prev.map((m) => (m.id === matId ? { ...m, ...updated } : m)));
  };

  const deleteSupplierMaterial = async (matId: string) => {
    setSupplierMaterials((prev) => prev.filter((m) => m.id !== matId));
  };

  // Demands & Quotes
  const addDemand = async (demand: Omit<MaterialDemand, 'id' | 'quotesCount' | 'createdAt' | 'status'>) => {
    const artisanId = currentArtisan?.id || '00000000-0000-0000-0000-000000000001';

    if (isSupabaseConfigured()) {
      const res = await SuppliersService.createDemand({
        ...demand,
        artisanId,
      });
      if (res.success && res.data) {
        setDemands((prev) => [res.data!, ...prev]);
        return;
      }
    }

    const newDem: MaterialDemand = {
      id: `dem-${Date.now()}`,
      ...demand,
      artisanId,
      status: 'open',
      quotesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setDemands((prev) => [newDem, ...prev]);
  };

  const addSupplierQuote = async (demandId: string, quote: Omit<SupplierQuote, 'id' | 'demandId' | 'createdAt'>) => {
    const supplierId = supplierCompany.id || '00000000-0000-0000-0000-000000000003';

    if (isSupabaseConfigured()) {
      await SuppliersService.submitQuote({
        demandId,
        supplierId,
        priceCents: quote.priceCents,
        shippingCents: quote.shippingCents,
        shippingDays: quote.shippingDays,
        notes: quote.notes,
      });
    }

    const newQuote: SupplierQuote = {
      id: `quote-${Date.now()}`,
      demandId,
      createdAt: new Date().toISOString(),
      ...quote,
      supplierId,
    };

    setQuotes((prev) => ({
      ...prev,
      [demandId]: [...(prev[demandId] || []), newQuote],
    }));

    setDemands((prev) =>
      prev.map((d) => (d.id === demandId ? { ...d, quotesCount: d.quotesCount + 1, status: 'quotes_received' } : d))
    );
  };

  const submitCustomRequest = (req: Omit<CustomPieceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: CustomPieceRequest = {
      id: `req-${Date.now()}`,
      ...req,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setCustomRequests((prev) => [newReq, ...prev]);
    notifyPendingIntegration('Solicitação Sob Encomenda', `Pedido de ${req.clientName} registrado.`);
  };

  // Admin Governance
  const updatePlatformCommission = (percent: number) => {
    setPlatformSettings((prev) => ({ ...prev, commissionPercent: percent }));
  };

  const toggleAutoApproveArtisans = () => {
    setPlatformSettings((prev) => ({ ...prev, autoApproveArtisans: !prev.autoApproveArtisans }));
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentRoute,
        navigate,
        isSupabaseConnected,
        syncSupabaseData,
        currentUser,
        sessions,
        isAuthenticated,
        login,
        register,
        logout,
        products,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        updateProduct,
        updateProductStock,
        deleteProduct,
        artisans,
        currentArtisan,
        updateArtisanProfile,
        approveArtisan,
        customerProfile,
        updateCustomerProfile,
        toggleFavorite,
        isFavorite,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        orders,
        createOrder,
        updateOrderStatus,
        conversations,
        activeConversation,
        setActiveConversation,
        messages,
        sendMessage,
        startChatWithArtisan,
        supplierCompany,
        updateSupplierCompany,
        supplierMaterials,
        addSupplierMaterial,
        updateSupplierMaterial,
        deleteSupplierMaterial,
        demands,
        addDemand,
        quotes,
        addSupplierQuote,
        customRequests,
        submitCustomRequest,
        platformSettings,
        updatePlatformCommission,
        toggleAutoApproveArtisans,
        isArchitectureOpen,
        setIsArchitectureOpen,
        isAssistedSignupOpen,
        setIsAssistedSignupOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        pendingActionNotice,
        setPendingActionNotice,
        notifyPendingIntegration,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = (): MarketplaceContextType => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
