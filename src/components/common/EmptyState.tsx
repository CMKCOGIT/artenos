import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-[#EBE1D5] bg-[#F7F2EB]/60 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#EFE6DC] text-[#8E3E19] flex items-center justify-center mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold font-serif text-[#2D241E] mb-2">
        {title}
      </h3>

      <p className="text-sm text-[#7D6B5D] max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-[#8E3E19] hover:bg-[#A3471D] text-white px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider shadow-sm hover:shadow transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
