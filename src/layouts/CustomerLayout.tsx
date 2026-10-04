import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  MessageSquare,
  User,
  Compass,
  Terminal,
  Store,
  Factory,
  ShieldCheck,
  Search,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Home,
  Package,
  Layers,
  PhoneCall,
  LogOut,
  ArrowRight,
  Database,
} from 'lucide-react';
import { useMarketplace } from '../store/marketplaceStore';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const {
    currentRoute,
    navigate,
    setCurrentRole,
    cart,
    customerProfile,
    conversations,
    setIsArchitectureOpen,
    setIsAssistedSignupOpen,
    setIsOnboardingOpen,
    sessions,
    logout,
  } = useMarketplace();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const customerUser = sessions.customer;
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalFavoritesCount = customerProfile.favoriteProductIds.length;
  const totalUnreadChat = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const navLinks = [
    { label: 'Início', route: '/' },
    { label: 'Catálogo de Peças', route: '/produtos' },
    { label: 'Favoritos', route: '/favoritos', badge: totalFavoritesCount > 0 ? totalFavoritesCount : null },
    { label: 'Meus Pedidos', route: '/meus-pedidos' },
    { label: 'Mensagens', route: '/mensagens', badge: totalUnreadChat > 0 ? totalUnreadChat : null },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  const handleRoleSwitch = (role: 'customer' | 'artisan' | 'supplier' | 'admin') => {
    setCurrentRole(role);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7] text-[#2D241E]">
      {/* 1. Clean Top Utility & Multi-Role Switcher Bar */}
      <div className="bg-[#F4ECE1] text-[#4A3B32] border-b border-[#E7DCD0] px-3 sm:px-6 lg:px-8 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          {/* Platform Identity & Split Principle */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] text-[#6E594C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8E3E19]" />
            <span className="font-semibold text-[#2D241E]">Artenós</span>
            <span aria-hidden="true" className="text-[#BFAFA0]">·</span>
            <span className="truncate max-w-[140px] sm:max-w-none">Mercado Autêntico</span>
            <span aria-hidden="true" className="hidden sm:inline text-[#BFAFA0]">·</span>
            <span className="hidden md:inline text-[#8E3E19] font-medium">90% direto para quem cria</span>
          </div>

          {/* Quick Access: Profile Switcher & Help Tour */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Onboarding / Como Funciona Button */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#8E3E19] hover:text-[#733113] hover:bg-white/60 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
              title="Aprenda a mexer na plataforma"
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline sm:inline">Como Funciona</span>
            </button>

            <span aria-hidden="true" className="text-[#D9CDBF] hidden xs:inline">|</span>

            {/* Profile Navigation Pills (Interactive Buttons) */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-white/70 p-0.5 rounded-lg border border-[#E0D4C5]">
              <button
                onClick={() => setCurrentRole('customer')}
                className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md bg-[#8E3E19] text-white shadow-2xs transition-colors cursor-pointer"
              >
                Comprador
              </button>
              <button
                onClick={() => setCurrentRole('artisan')}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[#5C4A3E] hover:text-[#8E3E19] hover:bg-white rounded-md transition-colors cursor-pointer"
                title="Painel da Artesã"
              >
                <Store className="w-3 h-3 text-[#8E3E19]" />
                <span className="hidden sm:inline">Artesã</span>
              </button>
              <button
                onClick={() => setCurrentRole('supplier')}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[#5C4A3E] hover:text-[#1A543E] hover:bg-white rounded-md transition-colors cursor-pointer"
                title="Portal do Fornecedor"
              >
                <Factory className="w-3 h-3 text-[#1A543E]" />
                <span className="hidden sm:inline">Fornecedor</span>
              </button>
              <button
                onClick={() => setCurrentRole('admin')}
                className="px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-[#735F52] hover:text-[#2D241E] hover:bg-white rounded-md transition-colors cursor-pointer"
                title="Painel Administrativo"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Customer Header */}
      <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#EADBCC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8E3E19] text-[#FAF6F0] flex items-center justify-center shadow-xs group-hover:scale-103 transition-transform">
              <span className="font-serif font-bold text-base sm:text-lg leading-none">A</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-[#2D241E] group-hover:text-[#8E3E19] transition-colors leading-none">
                Artenós
              </span>
              <span className="block text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-[#8E3E19] mt-0.5">
                Feito à Mão
              </span>
            </div>
          </button>

          {/* Desktop & Large Tablet Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-[#4A3B32]">
            {navLinks.map((link) => {
              const isActive =
                currentRoute === link.route ||
                (link.route === '/' && currentRoute === '') ||
                (link.route !== '/' && currentRoute.startsWith(link.route));

              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`relative py-1 cursor-pointer transition-colors text-xs lg:text-sm ${
                    isActive
                      ? 'text-[#8E3E19] font-bold border-b-2 border-[#8E3E19]'
                      : 'hover:text-[#8E3E19]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-[#8E3E19] text-white rounded-full text-[10px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Shortcut */}
            <button
              onClick={() => handleNavClick('/produtos')}
              className="p-2 text-[#5C4A3E] hover:text-[#8E3E19] hover:bg-[#F2EAE0] rounded-xl transition-colors cursor-pointer"
              title="Buscar no catálogo"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Favorites Icon */}
            <button
              onClick={() => handleNavClick('/favoritos')}
              className="relative p-2 text-[#5C4A3E] hover:text-[#8E3E19] hover:bg-[#F2EAE0] rounded-xl transition-colors cursor-pointer"
              title="Meus Favoritos"
            >
              <Heart className="w-4.5 h-4.5" />
              {totalFavoritesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8E3E19] rounded-full" />
              )}
            </button>

            {/* Chat Icon (visible on tablet/desktop, mobile has in bottom nav) */}
            <button
              onClick={() => handleNavClick('/mensagens')}
              className="relative p-2 text-[#5C4A3E] hover:text-[#8E3E19] hover:bg-[#F2EAE0] rounded-xl transition-colors cursor-pointer hidden sm:flex"
              title="Mensagens com Artesãs"
            >
              <MessageSquare className="w-4.5 h-4.5" />
              {totalUnreadChat > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8E3E19] rounded-full" />
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => handleNavClick('/carrinho')}
              className="flex items-center gap-1.5 sm:gap-2 bg-[#8E3E19] hover:bg-[#733113] text-[#FAF6F0] px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Ver sacola de compras"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Sacola</span>
              <span className="bg-white/25 px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] font-bold tabular-nums">
                {totalCartCount}
              </span>
            </button>

            {/* Customer Authentication Control (desktop) */}
            {customerUser ? (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#EADBCC]">
                <button
                  onClick={() => handleNavClick('/perfil')}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F2EAE0] transition-colors cursor-pointer text-xs font-semibold text-[#2D241E]"
                  title="Meu Perfil"
                >
                  <div className="w-7 h-7 rounded-full bg-[#8E3E19] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {customerUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-xs font-medium max-w-[85px] truncate">
                    {customerUser.name.split(' ')[0]}
                  </span>
                </button>
                <button
                  onClick={() => logout('customer')}
                  className="text-[11px] text-[#8C7667] hover:text-[#8E3E19] px-1.5 py-1 rounded cursor-pointer transition-colors"
                  title="Sair da conta"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-[#EADBCC]">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="text-xs font-bold text-[#4A3B32] hover:text-[#8E3E19] px-2 py-1.5 rounded-xl hover:bg-[#F2EAE0] transition-colors cursor-pointer"
                >
                  Entrar
                </button>
              </div>
            )}

            {/* Mobile Hamburger Drawer Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#4A3B32] hover:text-[#8E3E19] hover:bg-[#F2EAE0] rounded-xl transition-colors cursor-pointer md:hidden"
              aria-label="Abrir Menu Completo"
              title="Abrir menu de opções"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Mobile Off-Canvas Drawer (Slides in on mobile and tablet) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#FCFAF7] h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#EADBCC] z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div>
              <div className="p-4 sm:p-5 bg-[#F4EDE2] border-b border-[#E5DACD] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#8E3E19] text-white flex items-center justify-center font-serif font-bold text-base">
                    A
                  </div>
                  <div>
                    <span className="font-bold text-base font-serif text-[#2D241E] block leading-none">
                      Artenós
                    </span>
                    <span className="text-[10px] text-[#8E3E19] font-semibold uppercase tracking-wider">
                      Menu Completo
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-[#735F52] hover:text-[#2D241E] hover:bg-black/5 cursor-pointer"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card inside Drawer */}
              <div className="p-4 border-b border-[#EADBCC] bg-white">
                {customerUser ? (
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handleNavClick('/perfil')}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#8E3E19] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {customerUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#2D241E] block truncate">
                          {customerUser.name}
                        </span>
                        <span className="text-[11px] text-[#8C7667] block truncate">
                          {customerUser.email}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        logout('customer');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-xs text-rose-700 hover:text-rose-900 font-semibold p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Sair da conta"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-[#5C4A3E]">
                      Acesse sua conta para ver pedidos e conversar com artesãs.
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleNavClick('/login')}
                        className="w-full py-2 text-center text-xs font-bold bg-[#8E3E19] text-white rounded-xl shadow-2xs cursor-pointer"
                      >
                        Entrar
                      </button>
                      <button
                        onClick={() => handleNavClick('/cadastrar')}
                        className="w-full py-2 text-center text-xs font-bold bg-white text-[#8E3E19] border border-[#E0D4C5] rounded-xl cursor-pointer"
                      >
                        Cadastrar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Navigation Links */}
              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7667] px-3 block mb-2">
                  Navegação da Loja
                </span>
                {navLinks.map((link) => {
                  const isActive =
                    currentRoute === link.route ||
                    (link.route === '/' && currentRoute === '') ||
                    (link.route !== '/' && currentRoute.startsWith(link.route));

                  return (
                    <button
                      key={link.route}
                      onClick={() => handleNavClick(link.route)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#8E3E19] text-white shadow-2xs'
                          : 'text-[#4A3B32] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-[#8E3E19] text-white'
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Multi-Role Switcher (Mobile Cards) */}
              <div className="p-4 pt-2 border-t border-[#EADBCC] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7667] px-1 block mb-2">
                  Alternar Ambiente da Plataforma
                </span>

                <button
                  onClick={() => handleRoleSwitch('customer')}
                  className="w-full p-2.5 rounded-xl border border-[#8E3E19]/30 bg-[#FAF7F2] text-left flex items-start gap-2.5 cursor-pointer hover:border-[#8E3E19]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#8E3E19] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2D241E]">Comprador</span>
                      <span className="text-[9px] bg-[#8E3E19] text-white px-1.5 py-0.2 rounded font-bold">Ativo</span>
                    </div>
                    <p className="text-[10px] text-[#735F52] leading-tight">Explorar catálogo e peças autênticas</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSwitch('artisan')}
                  className="w-full p-2.5 rounded-xl border border-[#EADBCC] bg-white text-left flex items-start gap-2.5 cursor-pointer hover:border-[#8E3E19]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#8E3E19]/10 text-[#8E3E19] flex items-center justify-center shrink-0 mt-0.5">
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2D241E]">Painel da Artesã</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8C7667]" />
                    </div>
                    <p className="text-[10px] text-[#735F52] leading-tight">Ateliê, precificação, pedidos e estoque</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSwitch('supplier')}
                  className="w-full p-2.5 rounded-xl border border-[#EADBCC] bg-white text-left flex items-start gap-2.5 cursor-pointer hover:border-[#1A543E]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#1A543E]/10 text-[#1A543E] flex items-center justify-center shrink-0 mt-0.5">
                    <Factory className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2D241E]">Portal do Fornecedor</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8C7667]" />
                    </div>
                    <p className="text-[10px] text-[#735F52] leading-tight">Venda de matérias-primas e cotações B2B</p>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className="w-full p-2.5 rounded-xl border border-[#EADBCC] bg-white text-left flex items-start gap-2.5 cursor-pointer hover:border-[#2D241E]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#2D241E]/10 text-[#2D241E] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2D241E]">Administração & Split</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8C7667]" />
                    </div>
                    <p className="text-[10px] text-[#735F52] leading-tight">Governança, taxas e aprovação de ateliês</p>
                  </div>
                </button>
              </div>

              {/* Quick Tools & Assistance */}
              <div className="p-4 pt-2 border-t border-[#EADBCC] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7667] px-1 block mb-2">
                  Ajuda & Ferramentas
                </span>

                <button
                  onClick={() => {
                    setIsOnboardingOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 text-xs text-[#8E3E19] hover:text-[#733113] p-2 rounded-xl hover:bg-[#FAF6F0] font-semibold cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Guia da Plataforma (Onboarding)</span>
                </button>

                <button
                  onClick={() => {
                    setIsAssistedSignupOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 text-xs text-[#5C4A3E] hover:text-[#2D241E] p-2 rounded-xl hover:bg-[#FAF6F0] cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#1A543E]" />
                  <span>Cadastro Assistido por WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    setIsArchitectureOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 text-xs text-[#5C4A3E] hover:text-[#2D241E] p-2 rounded-xl hover:bg-[#FAF6F0] cursor-pointer"
                >
                  <Terminal className="w-4 h-4 text-[#8C7667]" />
                  <span>Documentação Técnica & SQL</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#F4EDE2] border-t border-[#E5DACD] text-center text-[10px] text-[#8C7667]">
              Artenós © 2026 · Feito para todas as telas
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Content Area (padding bottom ensures bottom nav doesn't cover content on mobile) */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* 5. Mobile Ergonomic Bottom Navigation Bar (Smartphones & Small Tablets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-t border-[#EADBCC] px-2 py-1 flex items-center justify-around shadow-lg">
        {/* Tab 1: Início */}
        <button
          onClick={() => handleNavClick('/')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/' || currentRoute === ''
              ? 'text-[#8E3E19]'
              : 'text-[#735F52] hover:text-[#2D241E]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Início</span>
        </button>

        {/* Tab 2: Catálogo */}
        <button
          onClick={() => handleNavClick('/produtos')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute.startsWith('/produtos') || currentRoute.startsWith('/categoria')
              ? 'text-[#8E3E19]'
              : 'text-[#735F52] hover:text-[#2D241E]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Catálogo</span>
        </button>

        {/* Tab 3: Sacola / Carrinho */}
        <button
          onClick={() => handleNavClick('/carrinho')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute.startsWith('/carrinho') || currentRoute.startsWith('/checkout')
              ? 'text-[#8E3E19]'
              : 'text-[#735F52] hover:text-[#2D241E]'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#8E3E19] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums shadow-xs">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Sacola</span>
        </button>

        {/* Tab 4: Mensagens */}
        <button
          onClick={() => handleNavClick('/mensagens')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute.startsWith('/mensagens')
              ? 'text-[#8E3E19]'
              : 'text-[#735F52] hover:text-[#2D241E]'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {totalUnreadChat > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#8E3E19] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums shadow-xs">
                {totalUnreadChat}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Chat</span>
        </button>

        {/* Tab 5: Menu Completo / Perfil */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            isMobileMenuOpen || currentRoute.startsWith('/perfil')
              ? 'text-[#8E3E19]'
              : 'text-[#735F52] hover:text-[#2D241E]'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Menu</span>
        </button>
      </nav>

      {/* 6. Clean & Organized Footer */}
      <footer className="bg-[#241B15] text-[#FAF6F0] pt-14 pb-10 border-t border-[#382B22] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#8E3E19] text-[#FAF6F0] flex items-center justify-center">
                  <span className="font-bold font-serif text-sm">A</span>
                </div>
                <span className="text-xl font-bold font-serif tracking-tight text-white">Artenós</span>
              </div>
              <p className="text-xs text-[#B5A596] leading-relaxed">
                Fortalecendo quem cria à mão. Valorização do artesanato brasileiro através de comércio justo, tecnologia transparente e split ético.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#E5A882] hover:text-white font-medium cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Ver Guia da Plataforma (Onboarding)</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-[#E5A882]">Compradores</h4>
              <ul className="space-y-2 text-[#C9BDB0]">
                <li><button onClick={() => navigate('/produtos')} className="hover:text-white cursor-pointer">Catálogo de Produtos</button></li>
                <li><button onClick={() => navigate('/meus-pedidos')} className="hover:text-white cursor-pointer">Acompanhar Meus Pedidos</button></li>
                <li><button onClick={() => navigate('/favoritos')} className="hover:text-white cursor-pointer">Lista de Desejos</button></li>
                <li><button onClick={() => navigate('/carrinho')} className="hover:text-white cursor-pointer">Carrinho & Frete</button></li>
              </ul>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-[#E5A882]">Ecossistema</h4>
              <ul className="space-y-2 text-[#C9BDB0]">
                <li><button onClick={() => setCurrentRole('artisan')} className="hover:text-white cursor-pointer">Painel Exclusivo da Artesã</button></li>
                <li><button onClick={() => setCurrentRole('supplier')} className="hover:text-white cursor-pointer">Painel de Fornecedores de Insumos</button></li>
                <li><button onClick={() => setIsAssistedSignupOpen(true)} className="hover:text-white cursor-pointer">Cadastro Assistido por WhatsApp</button></li>
                <li><button onClick={() => setCurrentRole('admin')} className="hover:text-white cursor-pointer">Painel de Governança (Admin)</button></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs text-[#C9BDB0]">
              <h4 className="font-bold uppercase tracking-wider text-[#E5A882]">Transparência</h4>
              <p className="text-xs text-[#B5A596] leading-relaxed">
                90% do valor de cada peça comprada vai direto para a conta bancária da artesã criadora.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setIsArchitectureOpen(true)}
                  className="flex items-center gap-1 text-[11px] text-[#E5A882] hover:text-white cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Documentação & Blueprint SQL</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#382B22] text-xs text-[#99887B] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>Artenós — Artesanato autêntico. © 2026. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Termos de Uso</span>
              <span>·</span>
              <span>Privacidade & LGPD</span>
              <span>·</span>
              <button onClick={() => setIsOnboardingOpen(true)} className="text-[#E5A882] hover:underline cursor-pointer">
                Tour Interativo
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

