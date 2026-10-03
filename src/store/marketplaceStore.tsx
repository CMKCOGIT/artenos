import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { craftPlaceholders } from '../utils/craftAssets';

interface MarketplaceContextType {
  // Navigation & Authentication
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentRoute: string;
  navigate: (route: string) => void;

  // Multi-profile Auth State
  currentUser: AuthUser | null;
  sessions: Record<UserRole, AuthUser | null>;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password?: string; role: UserRole; rememberMe?: boolean }) => { success: boolean; error?: string };
  register: (payload: RegisterPayload) => { success: boolean; error?: string };
  logout: (role?: UserRole) => void;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (productId: string, updated: Partial<Product>) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  deleteProduct: (productId: string) => void;

  // Artisans
  artisans: Artisan[];
  currentArtisan: Artisan;
  updateArtisanProfile: (updated: Partial<Artisan>) => void;
  approveArtisan: (artisanId: string) => void;

  // Customer Profile & Favorites
  customerProfile: CustomerProfile;
  updateCustomerProfile: (updated: Partial<CustomerProfile>) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, customizationNotes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingCode?: string) => void;

  // Chat
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (conversationId: string, content: string, attachments?: string[]) => void;
  startChatWithArtisan: (product: Product) => void;

  // Supplier Module
  supplierCompany: SupplierCompany;
  updateSupplierCompany: (updated: Partial<SupplierCompany>) => void;
  supplierMaterials: SupplierMaterial[];
  addSupplierMaterial: (mat: Omit<SupplierMaterial, 'id'>) => void;
  updateSupplierMaterial: (matId: string, updated: Partial<SupplierMaterial>) => void;
  deleteSupplierMaterial: (matId: string) => void;

  // Demands & Quotes
  demands: MaterialDemand[];
  addDemand: (demand: Omit<MaterialDemand, 'id' | 'quotesCount' | 'createdAt' | 'status'>) => void;
  quotes: Record<string, SupplierQuote[]>;
  addSupplierQuote: (demandId: string, quote: Omit<SupplierQuote, 'id' | 'demandId' | 'createdAt'>) => void;

  // Custom Requests
  customRequests: CustomPieceRequest[];
  submitCustomRequest: (req: Omit<CustomPieceRequest, 'id' | 'createdAt' | 'status'>) => void;

  // Admin & Platform Settings
  platformSettings: PlatformSettings;
  updatePlatformCommission: (percent: number) => void;
  toggleAutoApproveArtisans: () => void;

  // Modals
  isArchitectureOpen: boolean;
  setIsArchitectureOpen: (open: boolean) => void;
  isAssistedSignupOpen: boolean;
  setIsAssistedSignupOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'artenos_marketplace_v2';

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync route with URL hash for browser history and deep linking
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

  // Listen to window hash change
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

  // Multi-profile Authentication Sessions
  const [sessions, setSessions] = useState<Record<UserRole, AuthUser | null>>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_sessions`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      customer: null,
      artisan: null,
      supplier: null,
      admin: null,
    };
  });

  const currentUser = sessions[currentRole] || null;
  const isAuthenticated = Boolean(currentUser);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [artisans, setArtisans] = useState<Artisan[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_artisans`);
    return saved ? JSON.parse(saved) : initialArtisans;
  });

  const [activeArtisanId, setActiveArtisanId] = useState<string>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY}_active_artisan`) || initialArtisans[0].id;
  });
  const currentArtisan = artisans.find((a) => a.id === activeArtisanId) || artisans[0];

  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : initialCustomerProfile;
  });

  const [supplierCompany, setSupplierCompany] = useState<SupplierCompany>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_company`);
    return saved ? JSON.parse(saved) : initialSupplierCompany;
  });

  // Auth Operations
  const login = (credentials: { email: string; password?: string; role: UserRole; rememberMe?: boolean }) => {
    const { email, role } = credentials;
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Por favor, informe um endereço de e-mail válido.' };
    }

    let user: AuthUser;

    if (role === 'customer') {
      const isKaike = email.toLowerCase().includes('kaike');
      user = {
        id: 'cust-kaike',
        name: isKaike ? 'Kaike Elias' : (email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
        email,
        role: 'customer',
        phone: customerProfile.phone || '(11) 98765-4321',
        cpf: customerProfile.cpf || '123.456.789-00',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      };
      setCustomerProfile((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
    } else if (role === 'artisan') {
      const existing = artisans.find((a) => a.name.toLowerCase().includes(email.split('@')[0].toLowerCase())) || currentArtisan;
      user = {
        id: existing.id,
        name: existing.name,
        email,
        role: 'artisan',
        studioName: existing.studioName,
        specialties: existing.specialties,
        location: existing.location,
        pixKey: existing.pixKey,
        avatarUrl: existing.avatarUrl,
        bio: existing.bio,
      };
      setActiveArtisanId(existing.id);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_artisan`, existing.id);
    } else if (role === 'supplier') {
      user = {
        id: supplierCompany.id,
        name: 'Roberto Guimarães (Comercial)',
        email,
        role: 'supplier',
        companyName: supplierCompany.name,
        cnpj: supplierCompany.cnpj,
        category: supplierCompany.category,
        location: supplierCompany.location,
      };
    } else {
      user = {
        id: 'admin-1',
        name: 'Superusuário Artenós',
        email,
        role: 'admin',
      };
    }

    setSessions((prev) => {
      const updated = { ...prev, [role]: user };
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_sessions`, JSON.stringify(updated));
      return updated;
    });

    return { success: true };
  };

  const register = (payload: RegisterPayload) => {
    if (!payload.email || !payload.email.includes('@')) {
      return { success: false, error: 'Por favor, informe um endereço de e-mail válido.' };
    }
    if (!payload.name || payload.name.trim().length < 2) {
      return { success: false, error: 'Por favor, preencha o seu nome completo ou razão social.' };
    }

    const newId = `${payload.role}-${Date.now()}`;
    const user: AuthUser = {
      id: newId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      phone: payload.phone,
      cpf: payload.cpf,
      studioName: payload.studioName,
      specialties: payload.specialties,
      location: payload.location,
      pixKey: payload.pixKey,
      bio: payload.bio,
      companyName: payload.companyName,
      cnpj: payload.cnpj,
      category: payload.category,
      avatarUrl: payload.role === 'artisan'
        ? craftPlaceholders.artisan_clara
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    };

    if (payload.role === 'artisan') {
      const newArtisan: Artisan = {
        id: newId,
        name: payload.name,
        studioName: payload.studioName || `Ateliê ${payload.name}`,
        bio: payload.bio || 'Mestra artesã cadastrada na plataforma Artenós.',
        story: payload.bio || 'Criando peças manuais exclusivas com técnicas tradicionais e afeto.',
        location: payload.location || 'Brasil',
        specialties: payload.specialties && payload.specialties.length > 0 ? payload.specialties : ['Crochê & Amigurumi'],
        avatarUrl: craftPlaceholders.artisan_clara,
        rating: 5.0,
        totalSales: 0,
        phone: payload.phone || '(11) 98765-4321',
        instagram: `@atelie.${payload.name.toLowerCase().replace(/\s+/g, '')}`,
        featuredQuote: 'Artesanato com alma e memória viva.',
        status: 'active',
        pixKey: payload.pixKey || `${payload.email}`,
        revenueCents: 0,
      };

      setArtisans((prev) => {
        const next = [newArtisan, ...prev];
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_artisans`, JSON.stringify(next));
        return next;
      });
      setActiveArtisanId(newArtisan.id);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_artisan`, newArtisan.id);
    } else if (payload.role === 'customer') {
      setCustomerProfile((prev) => {
        const next = {
          ...prev,
          fullName: payload.name,
          email: payload.email,
          phone: payload.phone || prev.phone,
          cpf: payload.cpf || prev.cpf,
        };
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_profile`, JSON.stringify(next));
        return next;
      });
    } else if (payload.role === 'supplier') {
      setSupplierCompany((prev) => {
        const next = {
          ...prev,
          name: payload.companyName || payload.name,
          email: payload.email,
          phone: payload.phone || prev.phone,
          cnpj: payload.cnpj || prev.cnpj,
          category: payload.category || prev.category,
          location: payload.location || prev.location,
        };
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_company`, JSON.stringify(next));
        return next;
      });
    }

    setSessions((prev) => {
      const updated = { ...prev, [payload.role]: user };
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_sessions`, JSON.stringify(updated));
      return updated;
    });

    return { success: true };
  };

  const logout = (role?: UserRole) => {
    const targetRole = role || currentRole;
    setSessions((prev) => {
      const updated = { ...prev, [targetRole]: null };
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_sessions`, JSON.stringify(updated));
      return updated;
    });

    if (targetRole === 'customer') {
      navigate('/login');
    } else if (targetRole === 'artisan') {
      navigate('/artesa/login');
    } else if (targetRole === 'supplier') {
      navigate('/fornecedor/login');
    } else if (targetRole === 'admin') {
      navigate('/admin/login');
    }
  };


  const [supplierMaterials, setSupplierMaterials] = useState<SupplierMaterial[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_materials`);
    return saved ? JSON.parse(saved) : initialSuppliersMaterials;
  });

  const [demands, setDemands] = useState<MaterialDemand[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_demands`);
    return saved ? JSON.parse(saved) : initialMaterialDemands;
  });

  const [quotes, setQuotes] = useState<Record<string, SupplierQuote[]>>({
    'dem-1': [
      {
        id: 'q-1',
        demandId: 'dem-1',
        supplierId: 'sup-1',
        supplierName: 'Fios do Nordeste Ltda',
        supplierContact: '(81) 3721-9988',
        priceCents: 11000,
        shippingCents: 1500,
        shippingDays: 3,
        notes: 'Algodão mercerizado azul celeste em 4 rolos lacrados. Lote #LT-2026-F08.',
        status: 'sent',
        createdAt: 'Hoje às 09:15',
      },
    ],
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cart`);
    return saved ? JSON.parse(saved) : [];
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_convs`);
    return saved ? JSON.parse(saved) : initialConversations;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'conv-1': [
      {
        id: 'm-1',
        conversationId: 'conv-1',
        senderId: 'artisan-1',
        senderName: 'Maria das Dores',
        senderRole: 'artisan',
        content: 'Olá querido(a)! Seja muito bem-vindo(a) ao meu atelier virtual. Como posso ajudar com a girafinha?',
        timestamp: '10:30',
        status: 'read',
      },
      {
        id: 'm-2',
        conversationId: 'conv-1',
        senderId: 'client-current',
        senderName: 'Kaike Elias (Você)',
        senderRole: 'customer',
        content: 'Oi Maria! Adorei a peça! É possível fazer com um lacinho verde oliva no pescocinho dela?',
        timestamp: '10:42',
        status: 'read',
      },
      {
        id: 'm-3',
        conversationId: 'conv-1',
        senderId: 'artisan-1',
        senderName: 'Maria das Dores',
        senderRole: 'artisan',
        content: 'Com certeza! Tenho um fio de algodão verde oliva perfeito para esse detalhe. Posso tecer com muito carinho para você.',
        timestamp: '10:45',
        status: 'read',
      },
    ],
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : initialPlatformSettings;
  });

  const [customRequests, setCustomRequests] = useState<CustomPieceRequest[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  // Modals
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAssistedSignupOpen, setIsAssistedSignupOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    // Open on initial visit if user hasn't seen it yet
    return !localStorage.getItem('artenos_onboarding_completed_v1');
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_artisans`, JSON.stringify(artisans));
  }, [artisans]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_materials`, JSON.stringify(supplierMaterials));
  }, [supplierMaterials]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_demands`, JSON.stringify(demands));
  }, [demands]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_profile`, JSON.stringify(customerProfile));
  }, [customerProfile]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_company`, JSON.stringify(supplierCompany));
  }, [supplierCompany]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(platformSettings));
  }, [platformSettings]);

  const addProduct = (prodData: Omit<Product, 'id' | 'slug' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      slug: prodData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewsCount: 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (productId: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updated } : p))
    );
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateArtisanProfile = (updated: Partial<Artisan>) => {
    setArtisans((prev) =>
      prev.map((a) => (a.id === currentArtisan.id ? { ...a, ...updated } : a))
    );
  };

  const approveArtisan = (artisanId: string) => {
    setArtisans((prev) =>
      prev.map((a) => (a.id === artisanId ? { ...a, status: 'active' } : a))
    );
  };

  const updateCustomerProfile = (updated: Partial<CustomerProfile>) => {
    setCustomerProfile((prev) => ({ ...prev, ...updated }));
  };

  const toggleFavorite = (productId: string) => {
    setCustomerProfile((prev) => {
      const exists = prev.favoriteProductIds.includes(productId);
      const newFavorites = exists
        ? prev.favoriteProductIds.filter((id) => id !== productId)
        : [...prev.favoriteProductIds, productId];
      return { ...prev, favoriteProductIds: newFavorites };
    });
  };

  const isFavorite = (productId: string) => {
    return customerProfile.favoriteProductIds.includes(productId);
  };

  const addToCart = (product: Product, quantity = 1, customizationNotes?: string) => {
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
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `#ART-${randomNum}`,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Decrease stock for ordered products
    newOrder.items.forEach((item) => {
      updateProductStock(item.productId, 0);
    });

    clearCart();

    // Update platform GMV
    setPlatformSettings((prev) => ({
      ...prev,
      totalGMVCents: prev.totalGMVCents + newOrder.totalCents,
      totalTransactionsCount: prev.totalTransactionsCount + 1,
    }));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], trackingCode?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              trackingCode: trackingCode || o.trackingCode,
              updatedAt: new Date().toLocaleDateString('pt-BR'),
            }
          : o
      )
    );
  };

  const startChatWithArtisan = (product: Product) => {
    const existing = conversations.find(
      (c) => c.artisanId === product.artisanId && c.productId === product.id
    );

    if (existing) {
      setActiveConversation(existing);
    } else {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        productPriceCents: product.priceCents,
        productImg: product.imageUrl,
        artisanId: product.artisanId,
        artisanName: product.artisanName,
        artisanAvatar: product.artisanAvatar,
        clientId: customerProfile.id,
        clientName: customerProfile.fullName,
        lastMessage: `Olá ${product.artisanName}, tenho uma dúvida sobre ${product.title}...`,
        updatedAt: 'Agora',
        unreadCount: 0,
      };

      setConversations((prev) => [newConv, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newConv.id]: [
          {
            id: `m-init-${Date.now()}`,
            conversationId: newConv.id,
            senderId: product.artisanId,
            senderName: product.artisanName,
            senderRole: 'artisan',
            content: `Olá ${customerProfile.fullName}! Fico feliz pelo seu interesse em "${product.title}". Posso tirar qualquer dúvida sobre medidas, cores ou prazo para você!`,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status: 'delivered',
          },
        ],
      }));
      setActiveConversation(newConv);
    }

    if (currentRole === 'artisan') {
      navigate('/artesa/mensagens');
    } else {
      navigate('/mensagens');
    }
  };

  const sendMessage = (conversationId: string, content: string, attachments?: string[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    const isArtisanRole = currentRole === 'artisan';

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId,
      senderId: isArtisanRole ? currentArtisan.id : customerProfile.id,
      senderName: isArtisanRole ? currentArtisan.name : customerProfile.fullName,
      senderRole: isArtisanRole ? 'artisan' : 'customer',
      content,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      attachments,
      status: 'sent',
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: content, updatedAt: 'Agora' }
          : c
      )
    );

    // Auto reply simulation if customer sent
    if (!isArtisanRole) {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `m-reply-${Date.now()}`,
          conversationId,
          senderId: 'artisan-1',
          senderName: 'Maria das Dores',
          senderRole: 'artisan',
          content: 'Perfeito! Anotei todos os detalhes aqui na minha prancheta de encomendas. Ficará linda!',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
        };
        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), reply],
        }));
      }, 1600);
    }
  };

  const updateSupplierCompany = (updated: Partial<SupplierCompany>) => {
    setSupplierCompany((prev) => ({ ...prev, ...updated }));
  };

  const addSupplierMaterial = (matData: Omit<SupplierMaterial, 'id'>) => {
    const newMat: SupplierMaterial = {
      ...matData,
      id: `mat-${Date.now()}`,
    };
    setSupplierMaterials((prev) => [newMat, ...prev]);
  };

  const updateSupplierMaterial = (matId: string, updated: Partial<SupplierMaterial>) => {
    setSupplierMaterials((prev) =>
      prev.map((m) => (m.id === matId ? { ...m, ...updated } : m))
    );
  };

  const deleteSupplierMaterial = (matId: string) => {
    setSupplierMaterials((prev) => prev.filter((m) => m.id !== matId));
  };

  const addDemand = (demandData: Omit<MaterialDemand, 'id' | 'quotesCount' | 'createdAt' | 'status'>) => {
    const newDem: MaterialDemand = {
      ...demandData,
      id: `dem-${Date.now()}`,
      quotesCount: 0,
      status: 'open',
      createdAt: 'Agora',
    };
    setDemands((prev) => [newDem, ...prev]);
  };

  const addSupplierQuote = (demandId: string, quoteData: Omit<SupplierQuote, 'id' | 'demandId' | 'createdAt'>) => {
    const newQuote: SupplierQuote = {
      ...quoteData,
      id: `q-${Date.now()}`,
      demandId,
      createdAt: 'Agora',
    };

    setQuotes((prev) => ({
      ...prev,
      [demandId]: [...(prev[demandId] || []), newQuote],
    }));

    setDemands((prev) =>
      prev.map((d) =>
        d.id === demandId
          ? { ...d, quotesCount: d.quotesCount + 1, status: 'quotes_received' }
          : d
      )
    );
  };

  const submitCustomRequest = (req: Omit<CustomPieceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: CustomPieceRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    setCustomRequests((prev) => [newReq, ...prev]);
  };

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
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
