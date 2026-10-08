import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'badge';
  theme?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'full',
  theme = 'light',
}) => {
  if (variant === 'badge') {
    return (
      <img
        src="/logo.svg"
        alt="Bhagyalaxmi Billboards Logo"
        className={`object-contain rounded shadow-xs ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Billboard B Emblem */}
      <img
        src="/logo.svg"
        alt="Bhagyalaxmi Billboards"
        className="h-11 w-auto object-contain rounded shadow-xs"
      />
      {variant === 'full' && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span
              className={`font-display font-extrabold text-lg tracking-tight leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-[#302B2B]'
              }`}
            >
              BHAGYALAXMI
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#1098C7] text-white rounded-xs">
              Billboards
            </span>
          </div>
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase ${
              theme === 'dark' ? 'text-zinc-400' : 'text-[#747474]'
            }`}
          >
            Kalaburagi &bull; Karnataka
          </span>
        </div>
      )}
    </div>
  );
};
