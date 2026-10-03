import React, { useState } from 'react';
import { MessageSquareReply, Send, Check, Clock, MapPin, Package } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency, parseBRLToCents } from '../../utils/formatters';

export const SupplierDemandsView: React.FC = () => {
  const { demands, addSupplierQuote, supplierCompany } = useMarketplace();

  const [replyingDemandId, setReplyingDemandId] = useState<string | null>(null);
  const [offerPriceBRL, setOfferPriceBRL] = useState('120,00');
  const [shippingBRL, setShippingBRL] = useState('22,00');
  const [shippingDays, setShippingDays] = useState('4');
  const [notes, setNotes] = useState('Lote com disponibilidade imediata, pronta entrega.');
  const [feedbackNotice, setFeedbackNotice] = useState(false);

  const handleSendQuote = (demandId: string) => {
    addSupplierQuote(demandId, {
      supplierId: supplierCompany.id,
      supplierName: supplierCompany.name,
      supplierContact: supplierCompany.phone,
      priceCents: parseBRLToCents(offerPriceBRL) || 12000,
      shippingCents: parseBRLToCents(shippingBRL) || 2200,
      shippingDays: parseInt(shippingDays) || 4,
      notes,
      status: 'sent',
    });

    setReplyingDemandId(null);
    setFeedbackNotice(true);
    setTimeout(() => setFeedbackNotice(false), 4000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#122B20]">
          Demandas & Solicitações das Artesãs
        </h1>
        <p className="text-xs text-[#4A6E5D]">
          Artesãs publicam suas necessidades de fios, argilas e insumos. Envie propostas comerciais com preço e prazo!
        </p>
      </div>

      {feedbackNotice && (
        <div className="p-4 bg-[#EDF6F1] text-[#1A543E] rounded-2xl text-xs font-semibold border border-[#C5E3D2] flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Proposta comercial enviada diretamente para a artesã solicitante!</span>
        </div>
      )}

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
                    <label className="block text-[11px] font-bold text-[#1E2E25] mb-1">Valor do Lote (R$)</label>
                    <input
                      type="text"
                      required
                      value={offerPriceBRL}
                      onChange={(e) => setOfferPriceBRL(e.target.value)}
                      className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3 py-2 text-xs font-bold text-[#122B20]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1E2E25] mb-1">Custo do Frete (R$)</label>
                    <input
                      type="text"
                      required
                      value={shippingBRL}
                      onChange={(e) => setShippingBRL(e.target.value)}
                      className="w-full bg-white border border-[#CCE3D7] rounded-xl px-3 py-2 text-xs font-bold text-[#122B20]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1E2E25] mb-1">Prazo de Transporte (Dias)</label>
                    <input
                      type="number"
                      required
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
    </div>
  );
};
