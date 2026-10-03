import React from 'react';
import { MarketplaceProvider, useMarketplace } from './store/marketplaceStore';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { ArtisanLayout } from './layouts/ArtisanLayout';
import { SupplierLayout } from './layouts/SupplierLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Dedicated Auth Views per Interface
import { CustomerAuthView } from './views/customer/CustomerAuthView';
import { ArtisanAuthView } from './views/artisan/ArtisanAuthView';
import { SupplierAuthView } from './views/supplier/SupplierAuthView';
import { AdminAuthView } from './views/admin/AdminAuthView';

// Customer Views
import { CustomerHomeView } from './views/customer/CustomerHomeView';
import { CustomerProductsView } from './views/customer/CustomerProductsView';
import { CustomerProductDetailView } from './views/customer/CustomerProductDetailView';
import { CustomerArtisanProfileView } from './views/customer/CustomerArtisanProfileView';
import { CustomerCartView } from './views/customer/CustomerCartView';
import { CustomerCheckoutView } from './views/customer/CustomerCheckoutView';
import { CustomerOrdersView } from './views/customer/CustomerOrdersView';
import { CustomerFavoritesView } from './views/customer/CustomerFavoritesView';
import { CustomerChatView } from './views/customer/CustomerChatView';
import { CustomerProfileView } from './views/customer/CustomerProfileView';

// Artisan Views
import { ArtisanDashboardView } from './views/artisan/ArtisanDashboardView';
import { ArtisanStoreProfileView } from './views/artisan/ArtisanStoreProfileView';
import { ArtisanProductsView } from './views/artisan/ArtisanProductsView';
import { ArtisanOrdersView } from './views/artisan/ArtisanOrdersView';
import { ArtisanPricingView } from './views/artisan/ArtisanPricingView';
import { ArtisanStockView } from './views/artisan/ArtisanStockView';
import { ArtisanMessagesView } from './views/artisan/ArtisanMessagesView';
import { ArtisanFinancialView } from './views/artisan/ArtisanFinancialView';

// Supplier Views
import { SupplierDashboardView } from './views/supplier/SupplierDashboardView';
import { SupplierCompanyView } from './views/supplier/SupplierCompanyView';
import { SupplierMaterialsView } from './views/supplier/SupplierMaterialsView';
import { SupplierDemandsView } from './views/supplier/SupplierDemandsView';

// Admin Views
import { AdminDashboardView } from './views/admin/AdminDashboardView';

// Global Architectural & Assisted Signup Modals
import { ArchitectureModal } from './components/ArchitectureModal';
import { AssistedSignupModal } from './components/AssistedSignupModal';
import { PlatformOnboardingModal } from './components/PlatformOnboardingModal';

const MarketplaceRouter: React.FC = () => {
  const { currentRole, currentRoute, sessions, navigate } = useMarketplace();

  const cleanRoute = (currentRoute || '/').split('?')[0];

  // =========================================================================
  // 1. ADMIN GOVERNANCE ENVIRONMENT
  // =========================================================================
  if (currentRole === 'admin' || cleanRoute.startsWith('/admin')) {
    // Requires Admin Authentication
    if (cleanRoute === '/admin/login' || !sessions.admin) {
      return <AdminAuthView onSuccess={() => navigate('/admin')} />;
    }

    return (
      <AdminLayout>
        <AdminDashboardView />
      </AdminLayout>
    );
  }

  // =========================================================================
  // 2. RAW MATERIAL SUPPLIER ENVIRONMENT
  // =========================================================================
  if (currentRole === 'supplier' || cleanRoute.startsWith('/fornecedor')) {
    // Requires Supplier Authentication
    const isSupplierAuthRoute = cleanRoute === '/fornecedor/login' || cleanRoute === '/fornecedor/cadastrar';
    if (isSupplierAuthRoute || !sessions.supplier) {
      const initialTab = cleanRoute === '/fornecedor/cadastrar' ? 'register' : 'login';
      return (
        <SupplierAuthView
          initialTab={initialTab}
          onSuccess={() => navigate('/fornecedor/dashboard')}
        />
      );
    }

    let content = <SupplierDashboardView />;
    if (cleanRoute.startsWith('/fornecedor/minha-empresa')) {
      content = <SupplierCompanyView />;
    } else if (cleanRoute.startsWith('/fornecedor/materiais')) {
      content = <SupplierMaterialsView />;
    } else if (cleanRoute.startsWith('/fornecedor/solicitacoes') || cleanRoute.startsWith('/fornecedor/orcamentos')) {
      content = <SupplierDemandsView />;
    } else if (cleanRoute.startsWith('/fornecedor/pedidos')) {
      content = <SupplierDashboardView />;
    }

    return <SupplierLayout>{content}</SupplierLayout>;
  }

  // =========================================================================
  // 3. ARTISAN PROFESSIONAL ENVIRONMENT
  // =========================================================================
  const isArtisanDashboard =
    currentRole === 'artisan' ||
    cleanRoute.startsWith('/artesa/login') ||
    cleanRoute.startsWith('/artesa/cadastrar') ||
    cleanRoute === '/artesa/dashboard' ||
    cleanRoute === '/artesa/minha-loja' ||
    cleanRoute === '/artesa/produtos' ||
    cleanRoute === '/artesa/pedidos' ||
    cleanRoute === '/artesa/precificacao' ||
    cleanRoute === '/artesa/estoque' ||
    cleanRoute === '/artesa/mensagens' ||
    cleanRoute === '/artesa/financeiro';

  if (isArtisanDashboard) {
    // Requires Artisan Authentication
    const isArtisanAuthRoute = cleanRoute === '/artesa/login' || cleanRoute === '/artesa/cadastrar';
    if (isArtisanAuthRoute || !sessions.artisan) {
      const initialTab = cleanRoute === '/artesa/cadastrar' ? 'register' : 'login';
      return (
        <ArtisanAuthView
          initialTab={initialTab}
          onSuccess={() => navigate('/artesa/dashboard')}
        />
      );
    }

    let content = <ArtisanDashboardView />;
    if (cleanRoute.startsWith('/artesa/minha-loja')) {
      content = <ArtisanStoreProfileView />;
    } else if (cleanRoute.startsWith('/artesa/produtos')) {
      content = <ArtisanProductsView />;
    } else if (cleanRoute.startsWith('/artesa/pedidos')) {
      content = <ArtisanOrdersView />;
    } else if (cleanRoute.startsWith('/artesa/precificacao')) {
      content = <ArtisanPricingView />;
    } else if (cleanRoute.startsWith('/artesa/estoque')) {
      content = <ArtisanStockView />;
    } else if (cleanRoute.startsWith('/artesa/mensagens')) {
      content = <ArtisanMessagesView />;
    } else if (cleanRoute.startsWith('/artesa/financeiro')) {
      content = <ArtisanFinancialView />;
    }

    return <ArtisanLayout>{content}</ArtisanLayout>;
  }

  // =========================================================================
  // 4. BUYER / CUSTOMER PUBLIC STOREFRONT ENVIRONMENT
  // =========================================================================

  // Customer dedicated Login & Register routes
  if (cleanRoute === '/login') {
    return (
      <CustomerLayout>
        <CustomerAuthView initialTab="login" onSuccess={() => navigate('/')} />
      </CustomerLayout>
    );
  }

  if (cleanRoute === '/cadastrar') {
    return (
      <CustomerLayout>
        <CustomerAuthView initialTab="register" onSuccess={() => navigate('/')} />
      </CustomerLayout>
    );
  }

  // Protected Customer Routes: require customer authentication
  if (cleanRoute.startsWith('/checkout') && !sessions.customer) {
    return (
      <CustomerLayout>
        <CustomerAuthView
          initialTab="login"
          redirectReason="Faça login ou cadastre-se para concluir seu pedido com segurança, split automático e entrega garantida."
          onSuccess={() => navigate('/checkout')}
        />
      </CustomerLayout>
    );
  }

  if (cleanRoute.startsWith('/meus-pedidos') && !sessions.customer) {
    return (
      <CustomerLayout>
        <CustomerAuthView
          initialTab="login"
          redirectReason="Faça login para acompanhar o status de confecção e código de rastreamento dos seus pedidos."
          onSuccess={() => navigate('/meus-pedidos')}
        />
      </CustomerLayout>
    );
  }

  if (cleanRoute.startsWith('/favoritos') && !sessions.customer) {
    return (
      <CustomerLayout>
        <CustomerAuthView
          initialTab="login"
          redirectReason="Faça login para gerenciar suas peças favoritas salvas e receber alertas de novas criações."
          onSuccess={() => navigate('/favoritos')}
        />
      </CustomerLayout>
    );
  }

  if (cleanRoute.startsWith('/perfil') && !sessions.customer) {
    return (
      <CustomerLayout>
        <CustomerAuthView
          initialTab="login"
          redirectReason="Faça login para gerenciar seus dados cadastrais, endereço e preferências de compra."
          onSuccess={() => navigate('/perfil')}
        />
      </CustomerLayout>
    );
  }

  if (cleanRoute.startsWith('/mensagens') && !sessions.customer) {
    return (
      <CustomerLayout>
        <CustomerAuthView
          initialTab="login"
          redirectReason="Faça login para conversar diretamente com as artesãs e solicitar personalizações."
          onSuccess={() => navigate('/mensagens')}
        />
      </CustomerLayout>
    );
  }

  // Public customer pages
  let customerContent = <CustomerHomeView />;

  if (cleanRoute.startsWith('/categoria/')) {
    const rawCat = cleanRoute.replace('/categoria/', '');
    const categoryName = decodeURIComponent(rawCat);
    customerContent = <CustomerProductsView initialCategory={categoryName} />;
  } else if (cleanRoute.startsWith('/produtos')) {
    customerContent = <CustomerProductsView />;
  } else if (cleanRoute.startsWith('/produto/')) {
    const prodId = cleanRoute.replace('/produto/', '');
    customerContent = <CustomerProductDetailView productId={prodId} />;
  } else if (cleanRoute.startsWith('/artesa/')) {
    const artId = cleanRoute.replace('/artesa/', '');
    customerContent = <CustomerArtisanProfileView artisanId={artId} />;
  } else if (cleanRoute.startsWith('/carrinho')) {
    customerContent = <CustomerCartView />;
  } else if (cleanRoute.startsWith('/checkout')) {
    customerContent = <CustomerCheckoutView />;
  } else if (cleanRoute.startsWith('/meus-pedidos')) {
    customerContent = <CustomerOrdersView />;
  } else if (cleanRoute.startsWith('/favoritos')) {
    customerContent = <CustomerFavoritesView />;
  } else if (cleanRoute.startsWith('/mensagens')) {
    customerContent = <CustomerChatView />;
  } else if (cleanRoute.startsWith('/perfil')) {
    customerContent = <CustomerProfileView />;
  } else {
    customerContent = <CustomerHomeView />;
  }

  return <CustomerLayout>{customerContent}</CustomerLayout>;
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceRouter />
      <ArchitectureModal />
      <AssistedSignupModal />
      <PlatformOnboardingModal />
    </MarketplaceProvider>
  );
}
