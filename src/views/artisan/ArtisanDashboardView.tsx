import React from 'react';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Calculator,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Store,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';

export const ArtisanDashboardView: React.FC = () => {
  const {
    currentArtisan,
    products,
    orders,
    conversations,
    navigate,
  } = useMarketplace();

  const studioName = currentArtisan?.studioName || 'Meu Ateliê';
  const artisanName = currentArtisan?.name || 'Artesã';

  const artisanProducts = currentArtisan
    ? products.filter((p) => p.artisanId === currentArtisan.id)
    : products;

  const lowStockProducts = artisanProducts.filter((p) => p.stock <= 1);
  const pendingOrders = orders.filter((o) => o.status === 'paid' || o.status === 'in_production');
  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3E19]">
            Painel da Artesã · {studioName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E] mt-0.5">
            Olá, {artisanName}!
          </h1>
          <p className="text-xs text-[#6B5A4E] mt-1">
            Central de gestão das suas peças, cálculo de preços justos e encomendas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/artesa/precificacao')}
            className="flex items-center gap-1.5 bg-[#FAF6F0] hover:bg-[#F2EAE0] text-[#4A3B32] border border-[#D9CDBF] px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-[#8E3E19]" />
            <span>Calculadora</span>
          </button>
          <button
            onClick={() => navigate('/artesa/produtos')}
            className="flex items-center gap-1.5 bg-[#8E3E19] hover:bg-[#733113] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Peça</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Vendas Realizadas */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-medium">Vendas Realizadas</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-[#8E3E19] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-[#2D241E] tabular-nums">
            {currentArtisan?.totalSales || 0}
          </span>
          <span className="text-[10px] text-[#8C7667] block mt-1">
            {currentArtisan?.totalSales ? 'Peças comercializadas' : 'Nenhuma venda registrada'}
          </span>
        </div>

        {/* Card 2: Produtos Cadastrados */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-medium">Peças no Catálogo</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-[#2563EB] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-[#2D241E] tabular-nums">
            {artisanProducts.length}
          </span>
          <span className="text-[10px] text-[#6B5A4E] block mt-1">
            {artisanProducts.length > 0 ? 'Na vitrine pública' : 'Nenhum produto cadastrado'}
          </span>
        </div>

        {/* Card 3: Pedidos a Confeccionar */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-medium">Pedidos em Produção</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-[#7C3AED] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-[#2D241E] tabular-nums">
            {pendingOrders.length}
          </span>
          <span className="text-[10px] text-[#6B5A4E] block mt-1">
            {pendingOrders.length > 0 ? 'Em andamento' : 'Nenhum pedido recebido'}
          </span>
        </div>

        {/* Card 4: Faturamento Líquido */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-medium">Faturamento Líquido</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-[#1A543E] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-[#1A543E] tabular-nums">
            {formatCurrency(currentArtisan?.revenueCents || 0)}
          </span>
          <span className="text-[10px] text-[#1A543E] font-medium block mt-1">
            Split de 90% direto na conta
          </span>
        </div>
      </div>

      {/* Main Content: Recent Orders & Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Section */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCC] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#2D241E]">
                Pedidos Recentes
              </h2>
              <p className="text-xs text-[#6B5A4E]">
                Acompanhe as encomendas enviadas aos clientes
              </p>
            </div>
            <button
              onClick={() => navigate('/artesa/pedidos')}
              className="text-xs font-bold text-[#8E3E19] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Ver Todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Nenhum pedido recebido ainda"
              description="Quando clientes realizarem compras de suas peças na vitrine, você verá as informações de envio e prazos de confecção aqui."
              actionText="Cadastrar Primeiro Produto"
              onAction={() => navigate('/artesa/produtos')}
            />
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-[#EADBCC] bg-[#FAF8F5] flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-bold text-sm text-[#2D241E]">{order.orderNumber}</span>
                    <p className="text-xs text-[#6B5A4E]">{order.clientName} · {order.items.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-[#8E3E19] tabular-nums">
                      {formatCurrency(order.artisanPayoutCents)}
                    </span>
                    <span className="text-[10px] text-[#8C7667] block uppercase">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tools & Shortcuts Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#2D241E] pb-2 border-b border-[#F2EAE0]">
              Atalhos Rápidos
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => navigate('/artesa/precificacao')}
                className="w-full p-3 rounded-2xl border border-[#EADBCC] bg-[#FAF7F2] hover:bg-[#F3ECE1] text-left transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-4 h-4 text-[#8E3E19]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D241E]">Calculadora de Preço</h4>
                    <p className="text-[10px] text-[#6B5A4E]">Calcular hora e insumos</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8C7667] group-hover:text-[#8E3E19]" />
              </button>

              <button
                onClick={() => navigate('/artesa/estoque')}
                className="w-full p-3 rounded-2xl border border-[#EADBCC] bg-[#FAF7F2] hover:bg-[#F3ECE1] text-left transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#2563EB]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D241E]">Controle de Estoque</h4>
                    <p className="text-[10px] text-[#6B5A4E]">Pronta entrega e encomendas</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8C7667] group-hover:text-[#8E3E19]" />
              </button>

              <button
                onClick={() => navigate('/artesa/minha-loja')}
                className="w-full p-3 rounded-2xl border border-[#EADBCC] bg-[#FAF7F2] hover:bg-[#F3ECE1] text-left transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-[#1A543E]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#2D241E]">Perfil do Atelier</h4>
                    <p className="text-[10px] text-[#6B5A4E]">Biografia, fotos e chave Pix</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8C7667] group-hover:text-[#8E3E19]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
