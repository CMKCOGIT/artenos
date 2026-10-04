import React from 'react';
import {
  Package,
  MessageSquareReply,
  FileCheck2,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';

export const SupplierDashboardView: React.FC = () => {
  const {
    supplierCompany,
    supplierMaterials,
    demands,
    quotes,
    navigate,
  } = useMarketplace();

  const totalQuotesCount = Object.values(quotes).reduce((acc, list) => acc + list.length, 0);
  const openDemands = demands.filter((d) => d.status === 'open' || d.status === 'quotes_received');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#D2E3DB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A543E]">
            Painel do Fornecedor de Matéria-Prima
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#122B20] mt-0.5">
            {supplierCompany.name || 'Minha Empresa Fornecedora'}
          </h1>
          <p className="text-xs text-[#4A6E5D] mt-1">
            Conectado a artesãs de todo o Brasil que buscam fios, argilas, tecidos e insumos em lote.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/fornecedor/solicitacoes')}
            className="bg-[#EEF6F2] hover:bg-[#E0EFE8] text-[#1A543E] px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-[#CCE3D7]"
          >
            Ver Solicitações ({openDemands.length})
          </button>
          <button
            onClick={() => navigate('/fornecedor/materiais')}
            className="bg-[#1A543E] hover:bg-[#123D2C] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Lote / Insumo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D2E3DB] shadow-xs">
          <div className="flex items-center justify-between text-[#638C7A] mb-2">
            <span className="text-xs font-medium">Materiais Cadastrados</span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF6F2] text-[#1A543E] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-[#122B20] tabular-nums">
            {supplierMaterials.length}
          </span>
          <span className="text-[10px] text-[#4A6E5D] block mt-1">
            {supplierMaterials.length > 0 ? 'Lotes e insumos ativos' : 'Nenhum material cadastrado'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D2E3DB] shadow-xs">
          <div className="flex items-center justify-between text-[#638C7A] mb-2">
            <span className="text-xs font-medium">Demandas das Artesãs</span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF6F2] text-[#1A543E] flex items-center justify-center">
              <MessageSquareReply className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-[#1A543E] tabular-nums">
            {openDemands.length}
          </span>
          <span className="text-[10px] text-[#4A6E5D] block mt-1">
            {openDemands.length > 0 ? 'Aguardando cotação' : 'Nenhuma demanda aberta'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D2E3DB] shadow-xs">
          <div className="flex items-center justify-between text-[#638C7A] mb-2">
            <span className="text-xs font-medium">Orçamentos Enviados</span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF6F2] text-[#1A543E] flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-bold font-serif text-[#122B20] tabular-nums">
            {totalQuotesCount}
          </span>
          <span className="text-[10px] text-[#4A6E5D] block mt-1">
            {totalQuotesCount > 0 ? 'Propostas ativas' : 'Nenhum orçamento enviado'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D2E3DB] shadow-xs">
          <div className="flex items-center justify-between text-[#638C7A] mb-2">
            <span className="text-xs font-medium">Status de Homologação</span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF6F2] text-[#1A543E] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-base font-bold font-serif text-[#1A543E] block mt-1">
            {supplierCompany.verified ? 'Homologado' : 'Aguardando Conexão'}
          </span>
          <span className="text-[10px] text-[#4A6E5D] block mt-1">
            Validação de CNPJ e dados
          </span>
        </div>
      </div>

      {/* Demands Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#D2E3DB] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E0EFE8]">
          <div>
            <h2 className="font-serif font-bold text-base text-[#122B20]">
              Últimas Demandas Recebidas de Artesãs
            </h2>
            <p className="text-xs text-[#557567]">
              Artesãs que solicitaram fios, argilas ou tecidos específicos para produção
            </p>
          </div>

          <button
            onClick={() => navigate('/fornecedor/solicitacoes')}
            className="text-xs font-bold text-[#1A543E] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Todas as Solicitações</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {demands.length === 0 ? (
          <EmptyState
            icon={MessageSquareReply}
            title="Nenhuma solicitação de orçamento disponível"
            description="Quando as artesãs cadastradas publicarem necessidades de matérias-primas e lotes, você poderá enviar propostas comerciais personalizadas aqui."
            actionText="Cadastrar Matéria-Prima no Catálogo"
            onAction={() => navigate('/fornecedor/materiais')}
          />
        ) : (
          <div className="space-y-3">
            {demands.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#D2E3DB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#E0EFE8] text-[#1A543E] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {d.category}
                    </span>
                    <span className="text-[#638C7A]">Entrega em: {d.artisanLocation}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#122B20]">{d.title}</h3>
                  <p className="text-[#4A6E5D] mt-0.5">Quantidade solicitada: <strong>{d.quantity}</strong></p>
                </div>

                <button
                  onClick={() => navigate('/fornecedor/solicitacoes')}
                  className="bg-[#1A543E] hover:bg-[#123D2C] text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors shrink-0"
                >
                  Enviar Cotação
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
