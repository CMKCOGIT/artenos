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
  Shield,
  Package,
  Store,
  Building2,
  Settings,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';

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

  const isUsuarios = currentRoute.includes('/admin/usuarios');
  const isArtesas = currentRoute.includes('/admin/artesas');
  const isFornecedores = currentRoute.includes('/admin/fornecedores');
  const isProdutos = currentRoute.includes('/admin/produtos');
  const isPedidos = currentRoute.includes('/admin/pedidos');
  const isConfiguracoes = currentRoute.includes('/admin/configuracoes') || currentRoute.includes('/admin/comissao');
  const isOverview = !isUsuarios && !isArtesas && !isFornecedores && !isProdutos && !isPedidos && !isConfiguracoes;

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
            Supervisão de ateliês, catálogo de produtos, fornecedores e conformidade de pagamentos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-left">
            <span className="text-[#8C7667] block text-[10px] uppercase font-semibold">Segurança & Conformidade</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Ambiente Seguro
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards (Overview Real State: 0 Mocks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#241E1B] p-5 rounded-2xl border border-[#3D332D]">
          <span className="text-xs text-[#A8988B] font-semibold block mb-1">Volume Bruto de Vendas (GMV)</span>
          <span className="text-2xl font-bold font-serif text-white tabular-nums block">
            {formatCurrency(platformSettings.totalGMVCents)}
          </span>
          <span className="text-[10px] text-[#A8988B] mt-2 block font-medium">
            {platformSettings.totalGMVCents > 0 ? 'Faturamento liquidado' : 'Nenhuma venda registrada'}
          </span>
        </div>

        <div className="bg-[#241E1B] p-5 rounded-2xl border border-[#3D332D]">
          <span className="text-xs text-[#A8988B] font-semibold block mb-1">Receita da Plataforma (Take Rate)</span>
          <span className="text-2xl font-bold font-serif text-amber-400 tabular-nums block">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-[11px] text-[#A8988B] mt-2 block">
            Taxa configurada: {platformSettings.commissionPercent}% por pedido
          </span>
        </div>

        <div className="bg-[#241E1B] p-5 rounded-2xl border border-[#3D332D]">
          <span className="text-xs text-[#A8988B] font-semibold block mb-1">Artesãs Ativas</span>
          <span className="text-2xl font-bold font-serif text-white tabular-nums block">
            {activeArtisans.length}
          </span>
          <span className="text-[11px] text-amber-400 mt-2 block font-semibold">
            {pendingArtisans.length > 0 ? `${pendingArtisans.length} aguardando aprovação` : 'Nenhuma artesã pendente'}
          </span>
        </div>

        <div className="bg-[#241E1B] p-5 rounded-2xl border border-[#3D332D]">
          <span className="text-xs text-[#A8988B] font-semibold block mb-1">Total de Pedidos</span>
          <span className="text-2xl font-bold font-serif text-white tabular-nums block">
            {orders.length}
          </span>
          <span className="text-[10px] text-[#A8988B] mt-2 block">
            {orders.length > 0 ? 'Splits liquidados' : 'Nenhum pedido processado'}
          </span>
        </div>
      </div>

      {/* 1. SEÇÃO /admin/artesas */}
      {(isArtesas || isOverview) && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#3D332D] gap-3">
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

          {artisans.length === 0 ? (
            <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 space-y-2">
              <Store className="w-8 h-8 text-[#A8988B] mx-auto" />
              <p className="text-sm font-semibold text-white">Nenhum ateliê cadastrado ainda</p>
              <p className="text-xs text-[#A8988B]">
                Quando as artesãs realizarem o cadastro na plataforma, seus ateliês e documentos aparecerão aqui para credenciamento.
              </p>
            </div>
          ) : pendingArtisans.length === 0 ? (
            <div className="p-6 text-center bg-black/20 rounded-2xl border border-white/5 space-y-1">
              <Check className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold text-white">Todos os ateliês estão aprovados</p>
              <p className="text-xs text-[#A8988B]">Nenhuma solicitação de credenciamento pendente.</p>
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
                    </div>
                  </div>

                  <button
                    onClick={() => approveArtisan(artisan.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aprovar Ateliê</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SEÇÃO /admin/usuarios */}
      {isUsuarios && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-6">
          <div className="pb-3 border-b border-[#3D332D]">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Base Multiusuário da Artenós</span>
            </h2>
            <p className="text-xs text-[#A8988B]">
              Gerenciamento dos perfis cadastrados de compradores, artesãs e fornecedores
            </p>
          </div>

          <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 space-y-2">
            <Users className="w-8 h-8 text-[#A8988B] mx-auto" />
            <p className="text-sm font-semibold text-white">Nenhum usuário cadastrado ainda</p>
            <p className="text-xs text-[#A8988B] max-w-md mx-auto">
              A plataforma está em estado de pré-conexão com o banco de dados. Quando os primeiros compradores, artesãs e fornecedores realizarem cadastro, seus registros aparecerão listados aqui.
            </p>
          </div>
        </div>
      )}

      {/* 3. SEÇÃO /admin/fornecedores */}
      {isFornecedores && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-6">
          <div className="pb-3 border-b border-[#3D332D]">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Fornecedores de Insumos e Matérias-Primas Homologados</span>
            </h2>
            <p className="text-xs text-[#A8988B]">
              Empresas que vendem fios, argilas e insumos em lote para a rede de artesãs
            </p>
          </div>

          {supplierCompany.name ? (
            <div className="p-4 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white text-sm">{supplierCompany.name}</h4>
                <p className="text-[#A8988B]">CNPJ: {supplierCompany.cnpj || 'Não informado'} · Categoria: {supplierCompany.category}</p>
                <p className="text-[#8C7667]">Contato: {supplierCompany.email} | {supplierCompany.phone}</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 rounded-full font-bold">
                {supplierCompany.verified ? 'Homologado' : 'Pendente de Validação'}
              </span>
            </div>
          ) : (
            <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 space-y-2">
              <Building2 className="w-8 h-8 text-[#A8988B] mx-auto" />
              <p className="text-sm font-semibold text-white">Nenhum fornecedor cadastrado ainda</p>
              <p className="text-xs text-[#A8988B]">
                Quando indústrias e fornecedores homologarem suas contas no portal B2B, eles aparecerão aqui para supervisão.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. SEÇÃO /admin/produtos */}
      {isProdutos && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-6">
          <div className="pb-3 border-b border-[#3D332D]">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-400" />
              <span>Catálogo Global de Peças Artesanais</span>
            </h2>
            <p className="text-xs text-[#A8988B]">
              Auditoria de produtos cadastrados pelas artesãs na vitrine pública
            </p>
          </div>

          {products.length === 0 ? (
            <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 space-y-2">
              <Package className="w-8 h-8 text-[#A8988B] mx-auto" />
              <p className="text-sm font-semibold text-white">Nenhum produto cadastrado no catálogo</p>
              <p className="text-xs text-[#A8988B]">
                Peças cadastradas pelas artesãs nos seus ateliês ficarão disponíveis para auditoria nesta seção.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#3D332D]">
              {products.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs text-[#A8988B]">
                  <div>
                    <h4 className="font-bold text-white text-sm">{p.title}</h4>
                    <p>{p.category} · {p.artisanName}</p>
                  </div>
                  <span className="font-bold text-white tabular-nums">{formatCurrency(p.priceCents)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. SEÇÃO /admin/pedidos */}
      {isPedidos && (
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

          {orders.length === 0 ? (
            <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 space-y-2">
              <Receipt className="w-8 h-8 text-[#A8988B] mx-auto" />
              <p className="text-sm font-semibold text-white">Nenhum pedido realizado ainda</p>
              <p className="text-xs text-[#A8988B]">
                Quando compras forem efetuadas no checkout, os detalhes financeiros e splits bancários aparecerão nesta tabela.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* 6. SEÇÃO /admin/configuracoes */}
      {(isConfiguracoes || isOverview) && (
        <div className="bg-[#241E1B] rounded-3xl border border-[#3D332D] p-6 space-y-4">
          <div className="pb-3 border-b border-[#3D332D]">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>Configuração do Split e Taxas da Plataforma</span>
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
            <span>Segurança: <strong>PCI-DSS & Banco Central (Split Automático)</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
