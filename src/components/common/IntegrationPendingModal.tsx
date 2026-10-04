import React from 'react';
import { Database, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';

export const IntegrationPendingModal: React.FC = () => {
  const { pendingActionNotice, setPendingActionNotice, setIsArchitectureOpen } = useMarketplace();

  if (!pendingActionNotice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FBF8F3] text-[#2D241E] rounded-3xl max-w-md w-full border border-[#D9C8B5] shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setPendingActionNotice(null)}
          className="absolute top-4 right-4 p-2 text-[#7D6B5D] hover:text-[#2D241E] rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#EFE6DC] text-[#8E3E19] flex items-center justify-center mb-4">
          <Database className="w-6 h-6" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3E19] bg-[#EFE6DC] px-2.5 py-1 rounded-md inline-block mb-2">
          Etapa Front-End Ativa
        </span>

        <h3 className="text-xl font-bold font-serif text-[#2D241E] mb-2">
          {pendingActionNotice.title || 'Integração com Banco de Dados Pendente'}
        </h3>

        <p className="text-xs sm:text-sm text-[#5C4D41] leading-relaxed mb-4">
          {pendingActionNotice.description ||
            'Esta ação foi validada no front-end e está pronta para ser conectada com o Supabase na próxima etapa.'}
        </p>

        {pendingActionNotice.validatedDetails && (
          <div className="bg-[#F3ECE1] p-3 rounded-xl border border-[#E5DACD] text-xs text-[#5C4D41] mb-5">
            <div className="flex items-center gap-1.5 font-semibold text-[#2D241E] mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#1A543E]" />
              <span>Validação Concluída no Front-End:</span>
            </div>
            <p className="text-[11px] text-[#6B5A4D]">{pendingActionNotice.validatedDetails}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-[#EAE0D3]">
          <button
            onClick={() => {
              setPendingActionNotice(null);
              setIsArchitectureOpen(true);
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#8E3E19] text-white hover:bg-[#A3471D] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Ver Blueprint Técnico</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPendingActionNotice(null)}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#EFE6DC] text-[#4A3B30] hover:bg-[#E5DACD] transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
