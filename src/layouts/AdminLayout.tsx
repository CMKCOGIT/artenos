import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Tag,
  Percent,
  Receipt,
  AlertTriangle,
  ArrowLeft,
  Shield,
  BarChart3,
  Compass,
  Menu,
  X,
  LogOut,
  Home,
} from 'lucide-react';
import { useMarketplace } from '../store/marketplaceStore';
import { formatCurrency } from '../utils/formatters';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    currentRoute,
    navigate,
    setCurrentRole,
    artisans,
    orders,
    products,
    platformSettings,
    logout,
    setIsOnboardingOpen,
  } = useMarketplace();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const pendingArtisansCount = artisans.filter((a) => a.status === 'pending_approval').length;

  const menuItems = [
    {
      label: 'Visão Geral',
      route: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Usuários',
      route: '/admin/usuarios',
      icon: Users,
    },
    {
      label: 'Artesãs & Ateliês',
      route: '/admin/artesas',
      icon: UserCheck,
      badge: pendingArtisansCount > 0 ? pendingArtisansCount : null,
      badgeColor: 'bg-amber-600',
    },
    {
      label: 'Fornecedores B2B',
      route: '/admin/fornecedores',
      icon: Shield,
    },
    {
      label: 'Produtos no Catálogo',
      route: '/admin/produtos',
      icon: Tag,
      badge: products.length > 0 ? products.length : null,
    },
    {
      label: 'Pedidos & Split',
      route: '/admin/pedidos',
      icon: Receipt,
      badge: orders.length > 0 ? orders.length : null,
    },
    {
      label: 'Configurações & Taxas',
      route: '/admin/configuracoes',
      icon: Percent,
    },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1614] text-[#E8DCCF]">
      {/* Top Admin Header */}
      <div className="bg-[#241E1B] text-[#FAF6F0] px-3 sm:px-4 py-2 text-xs flex items-center justify-between flex-wrap gap-2 border-b border-[#3D332D]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-bold tracking-wide text-xs">ADMIN ARTENÓS</span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-white/70 text-[11px] hidden sm:inline truncate">
            GMV: {formatCurrency(platformSettings.totalGMVCents)} · Taxa: {platformSettings.commissionPercent}%
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white cursor-pointer"
            title="Aprenda sobre o ecossistema"
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Guia</span>
          </button>
          <span className="text-white/40 hidden xs:inline">|</span>
          <button
            onClick={() => logout('admin')}
            className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
            title="Encerrar sessão de administrador"
          >
            <span>Sair</span>
          </button>
          <span className="text-white/40">|</span>
          <button
            onClick={() => setCurrentRole('customer')}
            className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Loja</span>
          </button>
        </div>
      </div>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#241E1B] px-4 py-2.5 border-b border-[#3D332D] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-xs text-white leading-tight">
              Governança & Administração
            </h2>
            <span className="text-[10px] text-amber-400 font-medium block">
              Split 90/10 · Banco Central / RLS
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="p-2 text-[#C9BDB0] hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          aria-label="Abrir Menu Administrativo"
        >
          {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          <div className="relative w-full max-w-xs bg-[#1F1916] h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#3D332D] z-10 animate-in slide-in-from-right duration-250">
            <div>
              <div className="p-4 bg-[#2A221E] border-b border-[#3D332D] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white">Governança Artenós</h3>
                    <span className="text-[10px] text-amber-400 block">Superusuário</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-[#A8988B] hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links inside Drawer */}
              <nav className="p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8988B] px-2 block mb-2">
                  Painéis Administrativos
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
                          : 'text-[#C9BDB0] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#A8988B]'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== null && item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor
                              ? `${item.badgeColor} text-white`
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Short tools */}
              <div className="p-3 border-t border-[#3D332D] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8988B] px-2 block mb-1">
                  Atalhos
                </span>

                <button
                  onClick={() => {
                    setIsOnboardingOpen(true);
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-xs text-amber-300 font-semibold p-2 rounded-xl hover:bg-white/5 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Guia da Plataforma</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentRole('customer');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-xs text-[#C9BDB0] p-2 rounded-xl hover:bg-white/5 cursor-pointer"
                >
                  <Home className="w-4 h-4 text-[#A8988B]" />
                  <span>Voltar para Vitrine Pública</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-[#3D332D] bg-[#2A221E]">
              <button
                onClick={() => {
                  logout('admin');
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-300 bg-white/5 border border-rose-500/30 py-2.5 rounded-xl shadow-2xs hover:bg-white/10 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair do Modo Administrador</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Admin Sidebar */}
        <aside className="hidden md:flex w-64 bg-[#1F1916] border-r border-[#3D332D] p-4 flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="p-3 bg-[#2A221E] rounded-2xl border border-[#423630]">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Superusuário</span>
              <h3 className="font-bold text-xs text-white">Governança Artenós</h3>
              <p className="text-[10px] text-[#A8988B]">Controle de integridade, aprovações e splits bancários</p>
            </div>

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
                        : 'text-[#C9BDB0] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#A8988B]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor
                            ? `${item.badgeColor} text-white`
                            : 'bg-white/10 text-white'
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

          <div className="mt-6 pt-4 border-t border-[#3D332D] text-[10px] text-[#A8988B]">
            Artenós Core v2.4 · PostgreSQL RLS Ativo
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for Admin */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1F1916]/95 backdrop-blur-md border-t border-[#3D332D] px-2 py-1 flex items-center justify-around shadow-lg">
        {/* Tab 1: Métricas */}
        <button
          onClick={() => handleNavClick('/admin')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/admin'
              ? 'text-amber-400 font-bold'
              : 'text-[#A8988B] hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Métricas</span>
        </button>

        {/* Tab 2: Aprovar Artesãs */}
        <button
          onClick={() => handleNavClick('/admin/artesas')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/admin/artesas'
              ? 'text-amber-400 font-bold'
              : 'text-[#A8988B] hover:text-white'
          }`}
        >
          <div className="relative">
            <UserCheck className="w-5 h-5" />
            {pendingArtisansCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                {pendingArtisansCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Artesãs</span>
        </button>

        {/* Tab 3: Pedidos & Split */}
        <button
          onClick={() => handleNavClick('/admin/pedidos')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/admin/pedidos'
              ? 'text-amber-400 font-bold'
              : 'text-[#A8988B] hover:text-white'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Pedidos</span>
        </button>

        {/* Tab 4: Mais Opções (Abre Drawer) */}
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            isMobileDrawerOpen || currentRoute === '/admin/usuarios' || currentRoute === '/admin/categorias' || currentRoute === '/admin/comissao'
              ? 'text-amber-400 font-bold'
              : 'text-[#A8988B] hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Menu</span>
        </button>
      </nav>
    </div>
  );
};

