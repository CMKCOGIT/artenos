import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Carregando...',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-10 gap-3 text-[#7D6B5D] ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-[#8E3E19]`} />
      {message && <span className="text-xs font-medium tracking-wide">{message}</span>}
    </div>
  );
};
