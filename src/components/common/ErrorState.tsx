import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Não foi possível carregar as informações',
  message = 'Ocorreu uma instabilidade na consulta. Tente novamente em instantes.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-red-200 bg-red-50/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[#2D241E] mb-1 font-serif">{title}</h3>
      <p className="text-xs text-[#7D6B5D] max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 bg-[#8E3E19] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#A3471D] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Tentar Novamente</span>
        </button>
      )}
    </div>
  );
};
