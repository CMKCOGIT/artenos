import React from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Plus,
  Calculator,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';

export const ArtisanDashboardView: React.FC = () => {
  const {
    currentArtisan,
    products,
    orders,
    conversations,
    navigate,
  } = useMarketplace();

  const artisanProducts = products.filter((p) => p.artisanId === currentArtisan.id);
  const lowStockProducts = artisanProducts.filter((p) => p.stock <= 1);
  const pendingOrders = orders.filter((o) => o.status === 'paid' || o.status === 'in_production');
  const recentOrders = orders.slice(0, 3);
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3E19]">
            Painel da Artesã · {currentArtisan.studioName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E] mt-0.5">
            Olá, {currentArtisan.name}!
          </h1>
          <p className="text-xs text-[#6B5A4E] mt-1">
            Aqui está o resumo da sua produção, vendas e estoque hoje.
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
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Vendas Realizadas */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-medium">Vendas Realizadas</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-[#8E3E19] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-[#2D241E] tabular-nums">
            {currentArtisan.totalSales}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">
            +12% este mês
          </span>
        </div>

        {/* Card 2: Produtos Ativos */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-medium">Produtos Ativos</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-[#2563EB] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-[#2D241E] tabular-nums">
            {artisanProducts.length}
          </span>
          <span className="text-[10px] text-[#6B5A4E] block mt-1">
            Na vitrine pública
          </span>
        </div>

        {/* Card 3: Pedidos Pendentes */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-medium">Pedidos Pendentes</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF6F0] text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-[#2D241E] tabular-nums">
            {pendingOrders.length}
          </span>
          <span className="text-[10px] text-amber-700 font-bold block mt-1">
            Aguardando confecção
          </span>
        </div>

        {/* Card 4: Receita Líquida */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-medium">Receita Líquida</span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF6F2] text-[#1A543E] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-bold font-serif text-[#1A543E] tabular-nums">
            {formatCurrency(currentArtisan.revenueCents || 1845000)}
          </span>
          <span className="text-[10px] text-[#6B5A4E] block mt-1">
            Repasses Split 90%
          </span>
        </div>

        {/* Card 5: Estoque Baixo */}
        <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] shadow-xs">
          <div className="flex items-center justify-between text-[#8C7667] mb-2">
            <span className="text-xs font-medium">Estoque Baixo</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-rose-600 tabular-nums">
            {lowStockProducts.length}
          </span>
          <span className="text-[10px] text-[#8C7667] block mt-1">
            Peças com estoque ≤ 1
          </span>
        </div>
      </div>

      {/* Two columns: Pending Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Recent Orders for the artisan */}
        <div className="bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
            <h2 className="font-serif font-bold text-base text-[#2D241E]">
              Pedidos Recentes para Produção
            </h2>
            <button
              onClick={() => navigate('/artesa/pedidos')}
              className="text-xs font-bold text-[#8E3E19] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBCC] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2D241E]">{o.orderNumber}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                      {o.status === 'in_production' ? 'Em Confecção' : 'Pago'}
                    </span>
                  </div>
                  <p className="text-[#6B5A4E] mt-0.5">Cliente: {o.clientName} ({o.clientPhone})</p>
                  <p className="text-[11px] text-[#8C7667]">Itens: {o.items.map((i) => i.title).join(', ')}</p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-[#1A543E] block tabular-nums">
                    {formatCurrency(o.artisanPayoutCents)}
                  </span>
                  <span className="text-[10px] text-[#8C7667]">Seu repasse</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="font-serif font-bold text-base text-[#2D241E]">
                Alertas de Estoque Físico
              </h2>
            </div>
            <button
              onClick={() => navigate('/artesa/estoque')}
              className="text-xs font-bold text-[#8E3E19] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Gerenciar Estoque</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-rose-200" />
                  <div>
                    <h3 className="font-bold text-[#2D241E]">{p.title}</h3>
                    <span className="text-[11px] text-rose-700 font-bold">
                      Apenas {p.stock} unidade(s) em estoque
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/artesa/estoque')}
                  className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Repor Estoque
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
