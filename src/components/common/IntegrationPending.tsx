import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface IntegrationPendingProps {
  title?: string;
  actionName?: string;
  description?: string;
  onViewArchitecture?: () => void;
  onClose?: () => void;
}

export const IntegrationPending: React.FC<IntegrationPendingProps> = ({
  title = 'Aviso do Sistema',
  description = 'Operação em processamento ou configuração necessária.',
  onClose,
}) => {
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start justify-between gap-3 text-sm">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-950">{title}</h4>
          <p className="text-amber-800 text-xs mt-0.5">{description}</p>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-amber-600 hover:text-amber-900 p-1 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
