import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Package,
  MessageSquareReply,
  FileCheck2,
  Truck,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Compass,
  Menu,
  X,
  LogOut,
  Home,
  Database,
} from 'lucide-react';
import { useMarketplace } from '../store/marketplaceStore';

interface SupplierLayoutProps {
  children: React.ReactNode;
}

export const SupplierLayout: React.FC<SupplierLayoutProps> = ({ children }) => {
  const {
    currentRoute,
    navigate,
    setCurrentRole,
    supplierCompany,
    supplierMaterials,
    demands,
    quotes,
    logout,
    setIsOnboardingOpen,
  } = useMarketplace();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const totalQuotesCount = Object.values(quotes).reduce((acc, qList) => acc + qList.length, 0);
  const openDemandsCount = demands.filter((d) => d.status === 'open' || d.status === 'quotes_received').length;

  const menuItems = [
    {
      label: 'Dashboard',
      route: '/fornecedor/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Minha Empresa',
      route: '/fornecedor/minha-empresa',
      icon: Building2,
    },
    {
      label: 'Materiais & Lotes',
      route: '/fornecedor/materiais',
      icon: Package,
      badge: supplierMaterials.length,
    },
    {
      label: 'Demandas das Artesãs',
      route: '/fornecedor/solicitacoes',
      icon: MessageSquareReply,
      badge: openDemandsCount > 0 ? `${openDemandsCount} novas` : null,
      badgeColor: 'bg-emerald-600',
    },
    {
      label: 'Orçamentos',
      route: '/fornecedor/orcamentos',
      icon: FileCheck2,
      badge: totalQuotesCount > 0 ? totalQuotesCount : null,
    },
    {
      label: 'Pedidos Atacado',
      route: '/fornecedor/pedidos',
      icon: Truck,
    },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F7F5] text-[#1E2E25]">
      {/* Top Banner with Supplier Context */}
      <div className="bg-[#122B20] text-[#EDF7F2] px-3 sm:px-4 py-2 text-xs flex items-center justify-between flex-wrap gap-2 border-b border-[#1A3D2E]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-semibold truncate max-w-[150px] sm:max-w-none">{supplierCompany.name}</span>
          <span className="text-white/40 hidden xs:inline">·</span>
          <span className="text-white/70 hidden sm:inline">CNPJ: {supplierCompany.cnpj}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white cursor-pointer"
            title="Aprenda a usar o portal do fornecedor"
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Guia</span>
          </button>
          <span className="text-white/30 hidden xs:inline">|</span>
          <span className="text-emerald-400 font-semibold text-[11px] hidden md:flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Homologado</span>
          </span>
          <span className="text-white/30 hidden md:inline">|</span>
          <button
            onClick={() => logout('supplier')}
            className="text-[11px] text-emerald-200 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
            title="Sair da empresa"
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

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white px-4 py-2.5 border-b border-[#D2E3DB] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1A543E] text-white flex items-center justify-center font-bold text-xs shrink-0">
            F
          </div>
          <div>
            <h2 className="font-bold text-xs text-[#1E2E25] leading-tight truncate max-w-[190px]">
              {supplierCompany.name}
            </h2>
            <span className="text-[10px] text-[#1A543E] font-medium block">
              Portal do Fornecedor B2B
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="p-2 text-[#2D4537] hover:text-[#1A543E] hover:bg-[#EEF6F2] rounded-xl transition-colors cursor-pointer"
          aria-label="Abrir Menu do Fornecedor"
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

          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#D2E3DB] z-10 animate-in slide-in-from-right duration-250">
            <div>
              <div className="p-4 bg-[#EEF6F2] border-b border-[#D2E3DB] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#1A543E] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    F
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#1E2E25]">{supplierCompany.name}</h3>
                    <span className="text-[10px] text-[#1A543E] block">{supplierCompany.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-[#557567] hover:text-[#1E2E25] hover:bg-black/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links inside Drawer */}
              <nav className="p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#557567] px-2 block mb-2">
                  Gestão B2B de Insumos
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
                          ? 'bg-[#1A543E] text-white shadow-2xs'
                          : 'text-[#3E5C4E] hover:bg-[#EEF6F2]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#638C7A]'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== null && item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor
                              ? `${item.badgeColor} text-white`
                              : 'bg-[#E0EFE8] text-[#1A543E]'
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
              <div className="p-3 border-t border-[#E0EFE8] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#557567] px-2 block mb-1">
                  Atalhos
                </span>

                <button
                  onClick={() => {
                    setIsOnboardingOpen(true);
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-xs text-[#1A543E] font-semibold p-2 rounded-xl hover:bg-[#EEF6F2] cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Guia do Fornecedor</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentRole('customer');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2 text-xs text-[#3E5C4E] p-2 rounded-xl hover:bg-[#EEF6F2] cursor-pointer"
                >
                  <Home className="w-4 h-4 text-[#638C7A]" />
                  <span>Voltar para Loja Comprador</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-[#D2E3DB] bg-[#EEF6F2]">
              <button
                onClick={() => {
                  logout('supplier');
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-700 bg-white border border-rose-200 py-2.5 rounded-xl shadow-2xs hover:bg-rose-50 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Empresa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Supplier Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-[#D2E3DB] p-4 flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* Company Badge Card */}
            <div className="flex items-center gap-3 p-3 bg-[#EEF6F2] rounded-2xl border border-[#CCE3D7]">
              <div className="w-10 h-10 rounded-xl bg-[#1A543E] text-white flex items-center justify-center font-bold text-sm shrink-0">
                F
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-[#1E2E25] truncate">{supplierCompany.name}</h3>
                <span className="text-[10px] text-[#1A543E] font-medium block truncate">{supplierCompany.category}</span>
                <span className="text-[10px] text-[#557567]">{supplierCompany.location}</span>
              </div>
            </div>

            {/* Navigation Links */}
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
                        ? 'bg-[#1A543E] text-white shadow-xs'
                        : 'text-[#3E5C4E] hover:bg-[#EEF6F2] hover:text-[#122B20]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#638C7A]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor
                            ? `${item.badgeColor} text-white`
                            : 'bg-[#E0EFE8] text-[#1A543E]'
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

          <div className="mt-6 pt-4 border-t border-[#E0EFE8] text-[11px] text-[#638C7A] space-y-1">
            <span className="font-bold text-[#1E2E25] block">Canal Direto B2B</span>
            <p className="text-[10px] text-[#4A6E5D]">Cotações em lote e fornecimento de matérias-primas com rastreabilidade de lote e banho.</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for Supplier */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D2E3DB] px-2 py-1 flex items-center justify-around shadow-lg">
        {/* Tab 1: Painel */}
        <button
          onClick={() => handleNavClick('/fornecedor/dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/fornecedor/dashboard'
              ? 'text-[#1A543E]'
              : 'text-[#557567] hover:text-[#1E2E25]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Painel</span>
        </button>

        {/* Tab 2: Materiais */}
        <button
          onClick={() => handleNavClick('/fornecedor/materiais')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/fornecedor/materiais'
              ? 'text-[#1A543E]'
              : 'text-[#557567] hover:text-[#1E2E25]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Materiais</span>
        </button>

        {/* Tab 3: Demandas */}
        <button
          onClick={() => handleNavClick('/fornecedor/solicitacoes')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/fornecedor/solicitacoes'
              ? 'text-[#1A543E]'
              : 'text-[#557567] hover:text-[#1E2E25]'
          }`}
        >
          <div className="relative">
            <MessageSquareReply className="w-5 h-5" />
            {openDemandsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                {openDemandsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Demandas</span>
        </button>

        {/* Tab 4: Orçamentos */}
        <button
          onClick={() => handleNavClick('/fornecedor/orcamentos')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            currentRoute === '/fornecedor/orcamentos'
              ? 'text-[#1A543E]'
              : 'text-[#557567] hover:text-[#1E2E25]'
          }`}
        >
          <div className="relative">
            <FileCheck2 className="w-5 h-5" />
            {totalQuotesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#1A543E] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                {totalQuotesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Cotações</span>
        </button>

        {/* Tab 5: Menu / Mais */}
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer min-w-[56px] ${
            isMobileDrawerOpen || currentRoute === '/fornecedor/minha-empresa' || currentRoute === '/fornecedor/pedidos'
              ? 'text-[#1A543E]'
              : 'text-[#557567] hover:text-[#1E2E25]'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Mais</span>
        </button>
      </nav>
    </div>
  );
};

