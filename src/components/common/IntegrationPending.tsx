import React from 'react';
import { Database, X, AlertTriangle, ArrowRight } from 'lucide-react';

interface IntegrationPendingProps {
  title?: string;
  actionName?: string;
  description?: string;
  onClose?: () => void;
  onViewArchitecture?: () => void;
  className?: string;
}

export const IntegrationPending: React.FC<IntegrationPendingProps> = ({
  title = 'Integração com Banco de Dados Pendente',
  actionName = 'Esta ação',
  description = 'Esta funcionalidade será ativada após a conexão com o Supabase. Os dados preenchidos foram validados com sucesso no front-end.',
  onClose,
  onViewArchitecture,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-[#D9C8B5] bg-[#F7F2EB] p-4 text-[#2D241E] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#E8DDD0] text-[#8E3E19] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Database className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E3E19]">
            {title}
          </h4>
          <p className="text-xs text-[#5C4D41] mt-0.5 leading-relaxed">
            <span className="font-semibold text-[#2D241E]">{actionName}:</span> {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {onViewArchitecture && (
          <button
            onClick={onViewArchitecture}
            className="inline-flex items-center gap-1.5 text-xs text-[#8E3E19] hover:text-[#A3471D] font-semibold px-2.5 py-1.5 rounded-lg bg-[#EFE6DC] hover:bg-[#E8DDD0] transition-colors cursor-pointer"
          >
            <span>Ver Blueprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-[#7D6B5D] hover:text-[#2D241E] rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
