import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  UserCheck,
  Percent,
  Receipt,
  Tag,
  AlertTriangle,
  Check,
  ShieldCheck,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';

export const AdminDashboardView: React.FC = () => {
  const {
    currentRoute,
    platformSettings,
    updatePlatformCommission,
    toggleAutoApproveArtisans,
    artisans,
    approveArtisan,
    orders,
    products,
    supplierCompany,
    navigate,
  } = useMarketplace();

  const [newCommission, setNewCommission] = useState(platformSettings.commissionPercent.toString());
  const [commissionSaved, setCommissionSaved] = useState(false);

  const pendingArtisans = artisans.filter((a) => a.status === 'pending_approval');
  const activeArtisans = artisans.filter((a) => a.status === 'active');
  const totalRevenue = orders.reduce((acc, o) => acc + o.platformFeeCents, 0);

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newCommission);
    if (!isNaN(val) && val >= 0 && val <= 50) {
      updatePlatformCommission(val);
      setCommissionSaved(true);
      setTimeout(() => setCommissionSaved(false), 3000);
    }
  };

  // Render view based on route or subtab
  const isUsuarios = currentRoute.includes('/admin/usuarios');
  const isArtesas = currentRoute.includes('/admin/artesas');
  const isCategorias = currentRoute.includes('/admin/categorias');
  const isComissao = currentRoute.includes('/admin/comissao');
  const isPedidos = currentRoute.includes('/admin/pedidos');
  const isDenuncias = currentRoute.includes('/admin/denuncias');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-[#241E1B] p-6 rounded-3xl border border-[#3D332D] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Painel Central de Governança
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-0.5">
            Administração da Plataforma Artenós
          </h1>
          <p className="text-xs text-[#A8988B] mt-1">
            Supervisão de transações em tempo real, credenciamento de ateliês e conformidade regulatória.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs">
            <span className="text-[#8C7667] block text-[10px] uppercase font-semibold">Status do Gateway</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Split Automático 90/10 Online
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#241E1B] p-5 rounded-2xl border border-[#3D332D]">
          <span className="text-xs text-[#A8988B] font-semibold block mb-1">Volume Bruto de Vendas (GMV)</span>
          <span className="text-2xl font-bold font-serif text-white tabular-nums block">
            {formatCurrency(platformSettings.totalGMVCents)}
          </span>
          <span className="text-[11px] text-emerald-400 mt-2 block font-medium">
            +24.8% no último mês
          </span>
        </div>

        <div className="bg-[#241E1B] p-5 rounded-2xl border border-[#3D332D]">
          <span className="text-xs text-[#A8988B] font-semibold block mb-1">Receita da Plataforma (Take Rate)</span>
          <span className="text-2xl font-bold font-serif text-amber-400 tabular-nums block">
            {formatCurrency(totalRevenue || (platformSettings.totalGMVCents * 0.1))}
          </span>
          <span className="text-[11px] text-[#A8988B] mt-2 block">
            Taxa média: {platformSettings.commissionPercent}% por pedido
          </span>
        </div>

        <div className="bg-[#241E1B] p-5 rounded-2xl border border-[#3D332D]">
          <span className="text-xs text-[#A8988B] font-semibold block mb-1">Artesãs Ativas</span>
          <span className="text-2xl font-bold font-serif text-white tabular-nums block">
            {activeArtisans.length}
          </span>
          <span className="text-[11px] text-amber-400 mt-2 block font-semibold">
            {pendingArtisans.length} aguardando aprovação
          </span>
        </div>

        <div className="bg-[#241E1B] p-5 rounded-2xl border border-[#3D332D]">
          <span className="text-xs text-[#A8988B] font-semibold block mb-1">Total de Pedidos Processados</span>
          <span className="text-2xl font-bold font-serif text-white tabular-nums block">
            {orders.length}
          </span>
          <span className="text-[11px] text-emerald-400 mt-2 block">
            100% de splits liquidados sem estorno
          </span>
        </div>
      </div>

      {/* Conditional Sub-View Sections */}

      {/* 1. Artesãs Approvals */}
      {(isArtesas || (!isUsuarios && !isCategorias && !isComissao && !isPedidos && !isDenuncias)) && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3D332D]">
            <div>
              <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <span>Aprovação e Credenciamento de Ateliês</span>
              </h2>
              <p className="text-xs text-[#A8988B]">
                Curadoria para garantir peças artesanais autênticas brasileiras
              </p>
            </div>
            <button
              onClick={toggleAutoApproveArtisans}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                platformSettings.autoApproveArtisans
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-black/30 text-[#A8988B] border-white/10'
              }`}
            >
              Aprovação Automática: {platformSettings.autoApproveArtisans ? 'Ativada' : 'Manual (Curadoria)'}
            </button>
          </div>

          {pendingArtisans.length === 0 ? (
            <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 space-y-2">
              <Check className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-white">Todas as artesãs estão aprovadas e ativas!</p>
              <p className="text-xs text-[#A8988B]">Nenhuma solicitação de cadastro pendente no momento.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3D332D]">
              {pendingArtisans.map((artisan) => (
                <div key={artisan.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={artisan.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover border border-white/10" />
                    <div>
                      <h4 className="font-bold text-sm text-white">{artisan.name} · {artisan.studioName}</h4>
                      <p className="text-xs text-[#A8988B]">{artisan.location} · {artisan.specialties.join(', ')}</p>
                      <p className="text-xs text-[#8C7667] mt-0.5 line-clamp-1 italic">"{artisan.story}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveArtisan(artisan.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Aprovar Ateliê</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Platform Commission & Split Controls */}
      {(isComissao || (!isUsuarios && !isCategorias && !isArtesas && !isPedidos && !isDenuncias)) && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-4">
          <div className="pb-3 border-b border-[#3D332D]">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Percent className="w-5 h-5 text-amber-400" />
              <span>Configuração do Split e Take Rate</span>
            </h2>
            <p className="text-xs text-[#A8988B]">
              Define a divisão automática de pagamentos entre a artesã (ex: 90%) e a Artenós (ex: 10%)
            </p>
          </div>

          {commissionSaved && (
            <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Taxa da comissão atualizada para {platformSettings.commissionPercent}% com sucesso!</span>
            </div>
          )}

          <form onSubmit={handleSaveCommission} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-64">
              <label className="block text-xs font-semibold text-[#A8988B] mb-1">
                Comissão da Plataforma (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={newCommission}
                onChange={(e) => setNewCommission(e.target.value)}
                className="w-full bg-[#1A1614] border border-[#3D332D] rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-amber-400 text-sm"
              />
            </div>

            <div className="w-full sm:w-auto pt-5">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#8E3E19] hover:bg-[#733113] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Salvar Nova Taxa
              </button>
            </div>
          </form>

          <div className="p-4 bg-black/20 rounded-2xl border border-white/5 text-xs text-[#A8988B] flex items-center justify-between">
            <span>Repasse Líquido Médio para Artesãs: <strong>{(100 - platformSettings.commissionPercent).toFixed(1)}%</strong></span>
            <span>Segurança: <strong>Contrato com certificação PCI-DSS & Banco Central</strong></span>
          </div>
        </div>
      )}

      {/* 3. Orders & Splits */}
      {(isPedidos || (!isUsuarios && !isCategorias && !isArtesas && !isComissao && !isDenuncias)) && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-4">
          <div className="pb-3 border-b border-[#3D332D]">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-400" />
              <span>Auditoria de Transações e Splits Bancários</span>
            </h2>
            <p className="text-xs text-[#A8988B]">
              Histórico detalhado de pagamentos recebidos, comissão retida e liquidação para a artesã
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#A8988B]">
              <thead className="text-[10px] uppercase text-[#8C7667] border-b border-[#3D332D]">
                <tr>
                  <th className="py-2.5">Pedido</th>
                  <th className="py-2.5">Cliente</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5 text-emerald-400">Repasse Artesã</th>
                  <th className="py-2.5 text-amber-400">Taxa Artenós</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3D332D]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5">
                    <td className="py-3 font-mono font-bold text-white">{order.orderNumber}</td>
                    <td className="py-3 text-white">{order.clientName}</td>
                    <td className="py-3 font-semibold text-white">{formatCurrency(order.totalCents)}</td>
                    <td className="py-3 font-bold text-emerald-400">{formatCurrency(order.artisanPayoutCents)}</td>
                    <td className="py-3 font-bold text-amber-400">{formatCurrency(order.platformFeeCents)}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Users Table */}
      {isUsuarios && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-4">
          <div className="pb-3 border-b border-[#3D332D]">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Base Multiusuário da Artenós</span>
            </h2>
            <p className="text-xs text-[#A8988B]">
              Visão consolidada de Compradores, Artesãs Credenciadas e Fornecedores de Insumos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-black/20 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#E5A882] block">Compradores (Clientes)</span>
              <p className="text-xl font-bold text-white">1.420 cadastrados</p>
              <p className="text-xs text-[#A8988B]">Taxa de recompra: 38%</p>
            </div>

            <div className="p-4 bg-black/20 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Artesãs Parceiras</span>
              <p className="text-xl font-bold text-white">{artisans.length} ateliês</p>
              <p className="text-xs text-[#A8988B]">Em 8 estados brasileiros</p>
            </div>

            <div className="p-4 bg-black/20 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Fornecedores Homologados</span>
              <p className="text-xl font-bold text-white">1 homologado</p>
              <p className="text-xs text-[#A8988B]">{supplierCompany.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Categories Management */}
      {isCategorias && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-4">
          <div className="pb-3 border-b border-[#3D332D]">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-400" />
              <span>Categorias Oficiais de Artesanato</span>
            </h2>
            <p className="text-xs text-[#A8988B]">
              Taxonomia artesanal protegida para indexação e busca inteligente
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Crochê & Amigurumi', 'Cerâmica & Argila', 'Bordado Livre & Bastidor', 'Macramê & Nós'].map((cat) => (
              <div key={cat} className="p-4 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-between">
                <span className="font-semibold text-white text-xs">{cat}</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Ativa
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Denuncias & Suporte */}
      {isDenuncias && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-4">
          <div className="pb-3 border-b border-[#3D332D]">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Ouvidoria, Denúncias e Qualidade</span>
            </h2>
            <p className="text-xs text-[#A8988B]">
              Canal de mediação para produtos fora do padrão artesanal e disputas de envio
            </p>
          </div>

          <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-semibold text-white">Nenhuma denúncia aberta ou disputa pendente</p>
            <p className="text-xs text-[#A8988B]">Índice de satisfação da comunidade Artenós: 99.4%</p>
          </div>
        </div>
      )}
    </div>
  );
};
