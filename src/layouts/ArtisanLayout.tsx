import React, { useState } from 'react';
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  Calculator,
  Boxes,
  MessageSquare,
  DollarSign,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Compass,
  Menu,
  X,
  LogOut,
  PhoneCall,
  Home,
  Database,
} from 'lucide-react';
import { useMarketplace } from '../store/marketplaceStore';

interface ArtisanLayoutProps {
  children: React.ReactNode;
}

export const ArtisanLayout: React.FC<ArtisanLayoutProps> = ({ children }) => {
  const {
    currentRoute,
    navigate,
    setCurrentRole,
    currentArtisan,
    conversations,
    orders,
    products,
    sessions,
    logout,
    setIsOnboardingOpen,
    setIsAssistedSignupOpen,
  } = useMarketplace();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const artisanSession = sessions.artisan;

  const artisanName = currentArtisan?.name || artisanSession?.name || 'Mestra Artesã';
  const artisanStudio = currentArtisan?.studioName || artisanSession?.studioName || 'Meu Ateliê';
  const artisanLocation = currentArtisan?.location || artisanSession?.location || 'Brasil';
  const artisanAvatar = currentArtisan?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80';
  const artisanRating = currentArtisan?.rating || 5.0;
  const artisanTotalSales = currentArtisan?.totalSales || 0;
  const artisanId = currentArtisan?.id || 'artisan-current';

  const artisanProducts = currentArtisan
    ? products.filter((p) => p.artisanId === currentArtisan.id)
    : products;
  const lowStockCount = artisanProducts.filter((p) => p.stock <= 1).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'paid' || o.status === 'in_production').length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const menuItems = [
    {
      label: 'Dashboard',
      route: '/artesa/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Minha Loja',
      route: '/artesa/minha-loja',
      icon: Store,
    },
    {
      label: 'Produtos',
      route: '/artesa/produtos',
      icon: Package,
      badge: artisanProducts.length,
    },
    {
      label: 'Pedidos',
      route: '/artesa/pedidos',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-amber-600',
    },
    {
      label: 'Precificação',
      route: '/artesa/precificacao',
      icon: Calculator,
    },
    {
      label: 'Estoque',
      route: '/artesa/estoque',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} baixo` : null,
      badgeColor: 'bg-rose-600',
    },
    {
      label: 'Mensagens',
      route: '/artesa/mensagens',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
      badgeColor: 'bg-[#8E3E19]',
    },
    {
      label: 'Financeiro',
      route: '/artesa/financeiro',
      icon: DollarSign,
    },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#2D241E]">
      {/* Top Banner with Studio Context & Switcher */}
      <div className="bg-[#2D1F18] text-[#FDF8F3] px-3 sm:px-6 py-2 text-xs flex items-center justify-between flex-wrap gap-2 border-b border-[#47362B]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-semibold truncate max-w-[160px] sm:max-w-none">{artisanStudio}</span>
          <span className="text-white/40 hidden xs:inline">·</span>
          <span className="text-white/70 hidden sm:inline text-[11px]">Painel da Artesã</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-1 text-[11px] text-[#F5C7A9] hover:text-white cursor-pointer"
            title="Aprenda a usar o painel da artesã"
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Guia</span>
          </button>
          <span className="text-white/30 hidden xs:inline">|</span>
          <button
            onClick={() => handleNavClick(`/artesa/${artisanId}`)}
            className="flex items-center gap-1 text-[11px] text-white/90 hover:text-white cursor-pointer"
            title="Ver como os clientes enxergam seu ateliê"
          >
            <span className="hidden sm:inline">Ver Loja Pública</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <span className="text-white/30 hidden sm:inline">|</span>
          <button
            onClick={() => logout('artisan')}
            className="text-[11px] text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
            title="Encerrar sessão da artesã"
          >
            <span>Sair</span>
          </button>
          <span className="text-white/30">|</span>
          <button
            onClick={() => setCurrentRole('customer')}
            className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Comprador</span>
          </button>
        </div>
      </div>

      {/* Mobile Header Bar with Hamburger Button */}
      <div className="md:hidden bg-white px-4 py-2.5 border-b border-[#EADBCC] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={artisanAvatar}
            alt={artisanName}
            className="w-8 h-8 rounded-full object-cover border border-[#D9CDBF]"
          />
          <div>
            <h2 className="font-bold text-xs text-[#2D241E] leading-tight truncate max-w-[180px]">
              {artisanName}
            </h2>
            <span className="text-[10px] text-[#8E3E19] font-medium block">
              ★ {artisanRating} · {artisanStudio}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="p-2 text-[#4A3B32] hover:text-[#8E3E19] hover:bg-[#FAF6F0] rounded-xl transition-colors cursor-pointer"
          aria-label="Menu de Navegação da Artesã"
        >
          {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#EADBCC] z-10 animate-in slide-in-from-right duration-250">
            <div>
              {/* Drawer Header */}
              <div className="p-4 bg-[#FAF6F0] border-b border-[#EADBCC] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={artisanAvatar}
                    alt={artisanName}
                    className="w-10 h-10 rounded-full object-cover border border-[#D9CDBF]"
                  />
                  <div>
                    <h3 className="font-bold text-xs text-[#2D241E]">{artisanName}</h3>
                    <span className="text-[10px] text-[#8E3E19] block">{artisanLocation}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-[#8C7667] hover:text-[#2D241E] hover:bg-black/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links inside Drawer */}
              <nav className="p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7667] px-2 block mb-2">
                  Módulos de Gestão
                </span>
                {menuItems.map((item) => {
                  const isActive = currentRoute === item.route;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.route}
                      onClick={() => handleNavClick(item.route)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#8E3E19] text-white shadow-2xs'
                          : 'text-[#5C4A3E] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8C7667]'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== null && item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor
                              ? `${item.badgeColor} text-white`
                              : 'bg-[#F2EAE0] text-[#5C4A3E]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Extra Tools */}
              <div className="p-3 border-t border-[#F2EAE0] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7667] px-2 block mb-1">
                  Atalhos & Apoio
                </span>

                <button
                  onClick={() => handleNavClick(`/artesa/${artisanId}`)}
                  className="w-full flex items-center gap-2 text-xs text-[#5C4A3E] hover:text-[#8E3E19] p-2 rounded-xl hover:bg-[#FAF6F0] cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#8C7667]" />
                  <span>Ver Minha Vitrine Pública</span>
                </button>

                <button
                  onClick={() => {
                    setIsOnboardingOpen(true);
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-xs text-[#8E3E19] font-semibold p-2 rounded-xl hover:bg-[#FAF6F0] cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Guia do Painel (Onboarding)</span>
                </button>

                <button
                  onClick={() => {
                    setIsAssistedSignupOpen(true);
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-xs text-[#1A543E] p-2 rounded-xl hover:bg-[#FAF6F0] cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Suporte via WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentRole('customer');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-xs text-[#5C4A3E] p-2 rounded-xl hover:bg-[#FAF6F0] cursor-pointer"
                >
                  <Home className="w-4 h-4 text-[#8C7667]" />
                  <span>Voltar para Modo Comprador</span>
                </button>
              </div>
            </div>

            {/* Logout at bottom */}
            <div className="p-4 border-t border-[#EADBCC] bg-[#FAF6F0]">
              <button
                onClick={() => {
                  logout('artisan');
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-700 bg-white border border-rose-200 py-2.5 rounded-xl shadow-2xs hover:bg-rose-50 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair do Painel da Artesã</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Artisan Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-[#EADBCC] p-4 flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* Atelier Identity Card */}
            <div className="flex items-center gap-3 p-3 bg-[#FAF6F0] rounded-2xl border border-[#EADBCC]">
              <img
                src={artisanAvatar}
                alt={artisanName}
                className="w-11 h-11 rounded-full object-cover border border-[#D9CDBF]"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-[#2D241E] truncate">{artisanName}</h3>
                <span className="text-[10px] text-[#8E3E19] font-medium block truncate">{artisanLocation}</span>
                <span className="text-[10px] text-emerald-700 font-bold">★ {artisanRating} ({artisanTotalSales} vendas)</span>
              </div>
            </div>

            {/* Sidebar Navigation Links */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = currentRoute === item.route;
                const Icon = item.icon;

                return (
                  <button
                    key={item.route}
                    onClick={() => handleNavClick(item.route)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#8E3E19] text-white shadow-xs'
                        : 'text-[#5C4A3E] hover:bg-[#FAF6F0] hover:text-[#2D241E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8C7667]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor
                            ? `${item.badgeColor} text-white`
                            : 'bg-[#F2EAE0] text-[#5C4A3E]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Help Box */}
          <div className="mt-6 pt-4 border-t border-[#F2EAE0] text-[11px] text-[#8C7667] space-y-1">
            <span className="font-bold text-[#2D241E] block">Central de Apoio à Artesã</span>
            <p className="text-[10px] text-[#6B5A4E]">Suporte humano disponível no WhatsApp para tirar dúvidas de fotos e envios.</p>
          </div>
        </aside>

        {/* Main Artisan Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for Artisan */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EADBCC] px-2 py-1 flex items-center justify-around shadow-lg">
        {/* Tab 1: Painel */}
        <button
          onClick={() => handleNavClick('/artesa/dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/artesa/dashboard'
              ? 'text-[#8E3E19]'
              : 'text-[#735F52] hover:text-[#2D241E]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Painel</span>
        </button>

        {/* Tab 2: Produtos */}
        <button
          onClick={() => handleNavClick('/artesa/produtos')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/artesa/produtos'
              ? 'text-[#8E3E19]'
              : 'text-[#735F52] hover:text-[#2D241E]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Produtos</span>
        </button>

        {/* Tab 3: Pedidos */}
        <button
          onClick={() => handleNavClick('/artesa/pedidos')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/artesa/pedidos'
              ? 'text-[#8E3E19]'
              : 'text-[#735F52] hover:text-[#2D241E]'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                {pendingOrdersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Pedidos</span>
        </button>

        {/* Tab 4: Mensagens */}
        <button
          onClick={() => handleNavClick('/artesa/mensagens')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/artesa/mensagens'
              ? 'text-[#8E3E19]'
              : 'text-[#735F52] hover:text-[#2D241E]'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#8E3E19] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Chat</span>
        </button>

        {/* Tab 5: Menu Completo (Abre Drawer) */}
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            isMobileDrawerOpen || currentRoute === '/artesa/precificacao' || currentRoute === '/artesa/estoque' || currentRoute === '/artesa/financeiro'
              ? 'text-[#8E3E19]'
              : 'text-[#735F52] hover:text-[#2D241E]'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Mais</span>
        </button>
      </nav>
    </div>
  );
};

