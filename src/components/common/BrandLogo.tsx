import React from 'react';
import { useStore } from '../../context/StoreContext';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor,
}) => {
  const { settings } = useStore();

  const sizeDimensions = {
    sm: { img: 'w-7 h-7', text: 'text-sm' },
    md: { img: 'w-9 h-9 sm:w-10 sm:h-10', text: 'text-lg sm:text-xl' },
    lg: { img: 'w-12 h-12 sm:w-14 sm:h-14', text: 'text-xl sm:text-2xl' },
    xl: { img: 'w-16 h-16 sm:w-20 sm:h-20', text: 'text-2xl sm:text-3xl' },
  }[size];

  const logoSrc = settings.logoUrl || '/images/ha_clothing_logo.jpg';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Golden Circular Seal Monogram */}
      <div
        className={`relative ${sizeDimensions.img} rounded-full overflow-hidden shrink-0 border border-[#D4AF37]/50 shadow-md bg-black ring-1 ring-[#D4AF37]/30 transition-transform duration-300 hover:scale-105`}
      >
        <img
          src={logoSrc}
          alt={settings.brandName || 'HA Clothing'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to stylized SVG monogram if image fails
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        {/* Fallback stylized HA initials */}
        <div className="absolute inset-0 flex items-center justify-center font-heading font-black text-[#D4AF37] text-xs pointer-events-none opacity-0">
          HA
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-heading font-black tracking-tight leading-none uppercase ${
              textColor || 'text-[#173627]'
            } ${sizeDimensions.text}`}
          >
            {settings.brandName || 'HA CLOTHING'}
          </span>
          <span className="text-[9px] uppercase font-bold tracking-widest text-[#D4AF37] mt-0.5 hidden sm:block">
            Premium Streetwear
          </span>
        </div>
      )}
    </div>
  );
};
