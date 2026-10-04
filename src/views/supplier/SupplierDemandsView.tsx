import React, { useState } from 'react';
import { MessageSquareReply, Send, Check, Clock, MapPin, Package, FileCheck2, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency, parseBRLToCents } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { IntegrationPending } from '../../components/common/IntegrationPending';

export const SupplierDemandsView: React.FC = () => {
  const {
    demands,
    quotes,
    addSupplierQuote,
    supplierCompany,
    currentRoute,
    navigate,
    setIsArchitectureOpen,
  } = useMarketplace();

  const isOrcamentosRoute = currentRoute.startsWith('/fornecedor/orcamentos');
  const [activeTab, setActiveTab] = useState<'solicitacoes' | 'orcamentos'>(() =>
    isOrcamentosRoute ? 'orcamentos' : 'solicitacoes'
  );

  React.useEffect(() => {
    if (currentRoute.startsWith('/fornecedor/orcamentos')) {
      setActiveTab('orcamentos');
    } else if (currentRoute.startsWith('/fornecedor/solicitacoes')) {
      setActiveTab('solicitacoes');
    }
  }, [currentRoute]);

  const [replyingDemandId, setReplyingDemandId] = useState<string | null>(null);
  const [offerPriceBRL, setOfferPriceBRL] = useState('');
  const [shippingBRL, setShippingBRL] = useState('');
  const [shippingDays, setShippingDays] = useState('');
  const [notes, setNotes] = useState('');
  const [showPending, setShowPending] = useState(false);

  const allQuotesList = Object.entries(quotes).flatMap(([demandId, quoteArray]) =>
    quoteArray.map((q) => ({ ...q, demandId }))
  );

  const handleSendQuote = (demandId: string) => {
    if (!offerPriceBRL.trim()) return;

    addSupplierQuote(demandId, {
      supplierId: supplierCompany.id || 'supplier-current',
      supplierName: supplierCompany.name || 'Fornecedor Parceiro',
      supplierContact: supplierCompany.phone || 'Comercial',
      priceCents: parseBRLToCents(offerPriceBRL) || 0,
      shippingCents: parseBRLToCents(shippingBRL) || 0,
      shippingDays: parseInt(shippingDays) || 0,
      notes: notes || 'Disponibilidade imediata em lote.',
      status: 'sent',
    });

    setReplyingDemandId(null);
    setShowPending(true);
    setOfferPriceBRL('');
    setShippingBRL('');
    setShippingDays('');
    setNotes('');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#122B20]">
            {activeTab === 'solicitacoes' ? 'Solicitações de Insumos das Artesãs' : 'Meus Orçamentos Enviados'}
          </h1>
          <p className="text-xs text-[#4A6E5D]">
            {activeTab === 'solicitacoes'
              ? 'Artesãs publicam necessidades de linhas, fios, argilas e insumos para os ateliês.'
              : 'Acompanhe as propostas comerciais e cotações de lote enviadas.'}
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-[#CCE3D7] self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('solicitacoes');
              navigate('/fornecedor/solicitacoes');
            }}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'solicitacoes'
                ? 'bg-[#1A543E] text-white font-bold shadow-xs'
                : 'text-[#4A6E5D] hover:text-[#122B20]'
            }`}
          >
            <MessageSquareReply className="w-3.5 h-3.5" />
            <span>Solicitações ({demands.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('orcamentos');
              navigate('/fornecedor/orcamentos');
            }}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orcamentos'
                ? 'bg-[#1A543E] text-white font-bold shadow-xs'
                : 'text-[#4A6E5D] hover:text-[#122B20]'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Orçamentos ({allQuotesList.length})</span>
          </button>
        </div>
      </div>

      {showPending && (
        <IntegrationPending
          title="Envio de Orçamento Pendente"
          actionName="Proposta Comercial"
          description="A proposta comercial foi validada no front-end. O envio definitivo à artesã será concluído após conexão com o banco de dados Supabase."
          onViewArchitecture={() => setIsArchitectureOpen(true)}
          onClose={() => setShowPending(false)}
        />
      )}

      {/* TAB 1: SOLICITAÇÕES */}
      {activeTab === 'solicitacoes' && (
        <>
          {demands.length === 0 ? (
            <EmptyState
              icon={MessageSquareReply}
              title="Nenhuma solicitação de orçamento disponível."
              description="Quando as artesãs cadastradas publicarem necessidades de matérias-primas e insumos sob medida, elas aparecerão aqui para envio de cotações."
              actionText="Cadastrar Matéria-Prima no Catálogo"
              onAction={() => navigate('/fornecedor/materiais')}
            />
          ) : (
            <div className="space-y-4">
              {demands.map((demand) => (
                <div
                  key={demand.id}
                  className="bg-white p-6 rounded-3xl border border-[#D2E3DB] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#E0EFE8] text-[#1A543E] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {demand.category}
                        </span>
                        <span className="text-xs text-[#638C7A]">
                          Publicado por: <strong>{demand.artisanName}</strong> ({demand.artisanLocation})
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-[#122B20]">{demand.title}</h3>
                      <p className="text-xs text-[#4A6E5D] mt-1">{demand.details}</p>
                      <div className="flex items-center gap-4 text-xs font-semibold text-[#1A543E] mt-2">
                        <span>Quantidade desejada: {demand.quantity}</span>
                        <span>·</span>
                        <span>Prazo limite: {demand.deadlineDays} dias</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setReplyingDemandId(replyingDemandId === demand.id ? null : demand.id)}
                      className="bg-[#1A543E] hover:bg-[#123D2C] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
                    >
                      {replyingDemandId === demand.id ? 'Fechar Formulário' : 'Enviar Proposta / Orçamento'}
                    </button>
                  </div>

                  {/* Inlined Quote Form */}
                  {replyingDemandId === demand.id && (
                    <div className="mt-4 pt-4 border-t border-[#E0EFE8] bg-[#F8FAF9] p-5 rounded-2xl border border-[#CCE3D7] space-y-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#122B20]">
                        Formular Proposta Comercial para {demand.artisanName}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#1E2E25] mb-1">Valor do Lote (R$) *</label>
                          <input
                            type="text"
                            required
                            placeholder="0,00"
                            value={offerPriceBRL}
                            onChange={(e) => setOfferPriceBRL(e.target.value)}
                            className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3 py-2 text-xs font-bold text-[#122B20]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#1E2E25] mb-1">Custo do Frete (R$)</label>
                          <input
                            type="text"
                            placeholder="0,00"
                            value={shippingBRL}
                            onChange={(e) => setShippingBRL(e.target.value)}
                            className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3 py-2 text-xs font-bold text-[#122B20]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#1E2E25] mb-1">Prazo de Transporte (Dias)</label>
                          <input
                            type="number"
                            placeholder="Ex: 5"
                            value={shippingDays}
                            onChange={(e) => setShippingDays(e.target.value)}
                            className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3 py-2 text-xs text-[#122B20]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1E2E25] mb-1">
                          Especificações do Lote / Tonalidade / Nota Fiscal
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Fio 100% algodão, banho padronizado número 04, emissão de NF-e..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3 py-2 text-xs text-[#122B20]"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setReplyingDemandId(null)}
                          className="px-4 py-2 text-xs font-semibold text-[#557567] cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendQuote(demand.id)}
                          className="bg-[#1A543E] hover:bg-[#123D2C] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Orçamento Oficial</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: ORÇAMENTOS */}
      {activeTab === 'orcamentos' && (
        <>
          {allQuotesList.length === 0 ? (
            <EmptyState
              icon={FileCheck2}
              title="Você ainda não enviou nenhum orçamento."
              description="Navegue pelas solicitações das artesãs para formular suas primeiras propostas comerciais com preço de lote e prazo de entrega."
              actionText="Ver Solicitações das Artesãs"
              onAction={() => {
                setActiveTab('solicitacoes');
                navigate('/fornecedor/solicitacoes');
              }}
            />
          ) : (
            <div className="space-y-4">
              {allQuotesList.map((quote, idx) => (
                <div
                  key={quote.id || idx}
                  className="bg-white p-6 rounded-3xl border border-[#D2E3DB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-[#122B20]">Proposta Comercial #{quote.id || idx + 1}</span>
                    <p className="text-[#4A6E5D]">{quote.notes}</p>
                    <span className="text-[11px] text-[#638C7A]">Prazo de envio: {quote.shippingDays} dias</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#638C7A] uppercase block">Valor Ofertado</span>
                    <span className="text-base font-bold text-[#1A543E] tabular-nums block">
                      {formatCurrency(quote.priceCents)}
                    </span>
                    <span className="text-[10px] text-[#4A6E5D]">Frete: {formatCurrency(quote.shippingCents)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
