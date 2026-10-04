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
  CartService,
} from '../services';
import { supabase, isSupabaseConfigured } from '../lib/supabase/client';

interface MarketplaceContextType {
  // Navigation & Route
  currentRoute: string;
  navigate: (route: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Supabase Connection Status
  isSupabaseConnected: boolean;
  syncSupabaseData: () => Promise<void>;

  // Real Supabase Auth Session
  currentUser: AuthUser | null;
  userRole: UserRole;
  isAuthenticated: boolean;
  sessions: {
    customer: AuthUser | null;
    artisan: AuthUser | null;
    supplier: AuthUser | null;
    admin: AuthUser | null;
  };
  login: (credentials: { email: string; password?: string; role?: UserRole }) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string; emailConfirmationRequired?: boolean }>;
  logout: (role?: string) => Promise<void>;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'rating' | 'reviewsCount'>) => Promise<{ success: boolean; message: string }>;
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

  // Cart & Checkout (Persisted)
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
  sendMessage: (conversationId: string, content: string) => Promise<void>;
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

  // Global Modals
  isAssistedSignupOpen: boolean;
  setIsAssistedSignupOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isArchitectureOpen: boolean;
  setIsArchitectureOpen: (open: boolean) => void;
  notifyPendingIntegration: (action?: string, title?: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation sync with URL hash
  const getInitialRoute = () => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '') || '/';
      setCurrentRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Supabase Connection Status
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured());

  // Real Supabase Auth Session
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const isAuthenticated = Boolean(currentUser);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const userRole: UserRole = currentUser?.role || selectedRole;
  const currentRole: UserRole = userRole;

  const setCurrentRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'artisan') {
      if (currentUser?.role === 'artisan') navigate('/artesa/dashboard');
      else navigate('/artesa/login');
    } else if (role === 'supplier') {
      if (currentUser?.role === 'supplier') navigate('/fornecedor/dashboard');
      else navigate('/fornecedor/login');
    } else if (role === 'admin') {
      if (currentUser?.role === 'admin') navigate('/admin');
      else navigate('/admin/login');
    } else {
      navigate('/');
    }
  };

  const sessions = {
    customer: currentUser ? currentUser : null,
    artisan: (currentUser && (currentUser.role === 'artisan' || currentUser.role === 'admin')) ? currentUser : null,
    supplier: (currentUser && (currentUser.role === 'supplier' || currentUser.role === 'admin')) ? currentUser : null,
    admin: (currentUser && currentUser.role === 'admin') ? currentUser : null,
  };

  // Data Collections
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [artisans, setArtisans] = useState<Artisan[]>(initialArtisans);
  const [currentArtisan, setCurrentArtisan] = useState<Artisan | null>(null);

  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(initialCustomerProfile);
  const [supplierCompany, setSupplierCompany] = useState<SupplierCompany>(initialSupplierCompany);

  // Cart with initial hydration from guest storage
  const [cart, setCart] = useState<CartItem[]>(() => CartService.getGuestCart());
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  const [supplierMaterials, setSupplierMaterials] = useState<SupplierMaterial[]>(initialSuppliersMaterials);
  const [demands, setDemands] = useState<MaterialDemand[]>(initialMaterialDemands);
  const [quotes, setQuotes] = useState<Record<string, SupplierQuote[]>>({});
  const [customRequests, setCustomRequests] = useState<CustomPieceRequest[]>([]);

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(initialPlatformSettings);

  // Modais institucionais
  const [isAssistedSignupOpen, setIsAssistedSignupOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const notifyPendingIntegration = (_action?: string, _title?: string) => {};

  // Sync / Load live data from Supabase
  const syncSupabaseData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setIsSupabaseConnected(false);
      return;
    }

    try {
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

      // Carrega usuário autenticado real
      const user = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        // Atualiza perfil da artesã vinculada ao usuário logado
        if (user.role === 'artisan') {
          const matchedArtisan = arts.find((a) => a.id === user.id) || null;
          if (matchedArtisan) setCurrentArtisan(matchedArtisan);
        }
        // Mescla ou carrega o carrinho no banco
        const userCart = await CartService.mergeGuestCartWithUserCart(user.id);
        setCart(userCart);

        // Carrega favoritos
        const favs = await CustomersService.getFavorites(user.id);
        setCustomerProfile((prev) => ({ ...prev, favoriteProductIds: favs }));
      }
    } catch (err) {
      console.warn('[syncSupabaseData] Warning:', err);
    }
  }, [currentArtisan]);

  // Restauração de sessão e escuta de eventos auth no Supabase
  useEffect(() => {
    syncSupabaseData();

    if (isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          const user = await AuthService.getCurrentUser();
          setCurrentUser(user);
          if (user) {
            const userCart = await CartService.mergeGuestCartWithUserCart(user.id);
            setCart(userCart);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setCart(CartService.getGuestCart());
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, [syncSupabaseData]);

  // Auth Operations (SEM MOCK OU SESSÃO DEMO)
  const login = async (credentials: { email: string; password?: string; role?: UserRole }) => {
    const res = await AuthService.login(credentials);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setSelectedRole(res.user.role);
      const userCart = await CartService.mergeGuestCartWithUserCart(res.user.id);
      setCart(userCart);
      return { success: true };
    }
    return { success: false, error: res.error || 'Credenciais inválidas.' };
  };

  const register = async (payload: RegisterPayload) => {
    const res = await AuthService.register(payload);
    if (res.success && res.user) {
      if (!res.emailConfirmationRequired) {
        setCurrentUser(res.user);
      }
      return {
        success: true,
        emailConfirmationRequired: res.emailConfirmationRequired,
      };
    }
    return { success: false, error: res.error || 'Erro ao registrar usuário.' };
  };

  const logout = async (_role?: string) => {
    await AuthService.logout();
    setCurrentUser(null);
    setSelectedRole('customer');
    setCart(CartService.getGuestCart());
    navigate('/');
  };

  // Product Operations
  const addProduct = async (productData: Omit<Product, 'id' | 'slug' | 'rating' | 'reviewsCount'>): Promise<{ success: boolean; message: string }> => {
    if (!currentUser || currentUser.role !== 'artisan') {
      return { success: false, message: 'Apenas ateliês de artesãs podem publicar produtos.' };
    }

    if (currentUser.status === 'pending_approval') {
      return {
        success: false,
        message: 'Seu ateliê está em processo de curadoria. A publicação de peças estará disponível após a aprovação da moderação.',
      };
    }

    const artisanId = currentArtisan?.id || currentUser.id;

    if (isSupabaseConfigured()) {
      const res = await ProductsService.createProduct({
        ...productData,
        artisanId,
      });

      if (res.success && res.data) {
        setProducts((prev) => [res.data!, ...prev]);
        return { success: true, message: 'Peça publicada com sucesso no catálogo da Artenós!' };
      }
      return { success: false, message: res.message || 'Erro ao gravar produto no banco.' };
    }

    return { success: false, message: 'Banco de dados não disponível no momento.' };
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
    if (currentUser?.role !== 'admin') {
      console.warn('Apenas administradores podem aprovar ateliês.');
      return;
    }

    if (isSupabaseConfigured()) {
      await ArtisansService.approveArtisan(artisanId);
    }
    setArtisans((prev) =>
      prev.map((a) => (a.id === artisanId ? { ...a, status: 'active' } : a))
    );
  };

  // Customer Profile Operations
  const updateCustomerProfile = async (updated: Partial<CustomerProfile>) => {
    if (currentUser?.id && isSupabaseConfigured()) {
      await CustomersService.updateProfile(currentUser.id, updated);
    }
    setCustomerProfile((prev) => ({ ...prev, ...updated }));
  };

  const toggleFavorite = async (productId: string) => {
    if (currentUser?.id && isSupabaseConfigured()) {
      await CustomersService.toggleFavorite(currentUser.id, productId);
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

  // Cart Operations (Persistência no banco para logados, localStorage para visitantes)
  const addToCart = (product: Product, quantity = 1, customizationNotes = '') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, customizationNotes: customizationNotes || item.customizationNotes }
            : item
        );
      } else {
        updated = [...prev, { product, quantity, customizationNotes }];
      }

      if (currentUser?.id) {
        const itemQuantity = existing ? existing.quantity + quantity : quantity;
        CartService.syncAddItem(currentUser.id, product.id, itemQuantity, customizationNotes);
      } else {
        CartService.saveGuestCart(updated);
      }

      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      if (currentUser?.id) {
        CartService.syncRemoveItem(currentUser.id, productId);
      } else {
        CartService.saveGuestCart(updated);
      }
      return updated;
    });
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
      if (currentUser?.id) {
        CartService.syncAddItem(currentUser.id, productId, quantity);
      } else {
        CartService.saveGuestCart(updated);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (currentUser?.id) {
      CartService.syncClearCart(currentUser.id);
    } else {
      CartService.clearGuestCart();
    }
  };

  // Order Operations
  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order | null> => {
    if (isSupabaseConfigured()) {
      const res = await OrdersService.createOrder({
        customerId: currentUser?.id,
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
    return null;
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
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (isSupabaseConfigured()) {
      const res = await ChatService.sendMessage(conversationId, currentUser.id, content);
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
  };

  const startChatWithArtisan = async (product: Product) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (isSupabaseConfigured()) {
      const res = await ChatService.getOrCreateConversation(currentUser.id, product.artisanId, product);
      if (res.success && res.conversation) {
        setActiveConversation(res.conversation);
        if (!conversations.some((c) => c.id === res.conversation!.id)) {
          setConversations((prev) => [res.conversation!, ...prev]);
        }
        navigate('/mensagens');
      }
    }
  };

  // Supplier Operations
  const updateSupplierCompany = async (updated: Partial<SupplierCompany>) => {
    if (supplierCompany.id && isSupabaseConfigured()) {
      await SuppliersService.updateCompany(supplierCompany.id, updated);
    }
    setSupplierCompany((prev) => ({ ...prev, ...updated }));
  };

  const addSupplierMaterial = async (mat: Omit<SupplierMaterial, 'id'>) => {
    const supplierId = supplierCompany.id || currentUser?.id;
    if (!supplierId) return;

    if (isSupabaseConfigured()) {
      const res = await SuppliersService.createMaterial({
        ...mat,
        supplierId,
      });

      if (res.success && res.data) {
        setSupplierMaterials((prev) => [res.data!, ...prev]);
      }
    }
  };

  const updateSupplierMaterial = async (matId: string, updated: Partial<SupplierMaterial>) => {
    setSupplierMaterials((prev) => prev.map((m) => (m.id === matId ? { ...m, ...updated } : m)));
  };

  const deleteSupplierMaterial = async (matId: string) => {
    setSupplierMaterials((prev) => prev.filter((m) => m.id !== matId));
  };

  // Demands & Quotes
  const addDemand = async (demand: Omit<MaterialDemand, 'id' | 'quotesCount' | 'createdAt' | 'status'>) => {
    const artisanId = currentArtisan?.id || currentUser?.id;
    if (!artisanId) return;

    if (isSupabaseConfigured()) {
      const res = await SuppliersService.createDemand({
        ...demand,
        artisanId,
      });
      if (res.success && res.data) {
        setDemands((prev) => [res.data!, ...prev]);
      }
    }
  };

  const addSupplierQuote = async (demandId: string, quote: Omit<SupplierQuote, 'id' | 'demandId' | 'createdAt'>) => {
    const supplierId = supplierCompany.id || currentUser?.id;
    if (!supplierId) return;

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
  };

  // Admin Governance
  const updatePlatformCommission = (percent: number) => {
    if (currentUser?.role !== 'admin') return;
    setPlatformSettings((prev) => ({ ...prev, commissionPercent: percent }));
  };

  const toggleAutoApproveArtisans = () => {
    if (currentUser?.role !== 'admin') return;
    setPlatformSettings((prev) => ({ ...prev, autoApproveArtisans: !prev.autoApproveArtisans }));
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentRoute,
        navigate,
        currentRole,
        setCurrentRole,
        isSupabaseConnected,
        syncSupabaseData,
        currentUser,
        userRole,
        isAuthenticated,
        sessions,
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
        isAssistedSignupOpen,
        setIsAssistedSignupOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isArchitectureOpen,
        setIsArchitectureOpen,
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
