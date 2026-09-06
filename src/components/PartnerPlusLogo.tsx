import React from 'react';

interface LogoProps {
  className?: string;
  isLight?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const PartnerPlusLogo: React.FC<LogoProps> = ({ 
  className = '', 
  isLight = false,
  size = 'md',
  showText = true
}) => {
  const logoDimensions = {
    sm: 'h-6 w-auto',
    md: 'h-8 sm:h-9 w-auto',
    lg: 'h-10 sm:h-11 w-auto',
    xl: 'h-14 sm:h-16 w-auto'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none group cursor-pointer ${className}`}>
      {/* Official PartnerPlus Brand Image Logo */}
      <img 
        src="/partnerplus-logo.png" 
        alt="PartnerPlus Logo" 
        className={`${logoDimensions[size]} object-contain shrink-0 transition-transform duration-200 group-hover:scale-105`}
      />

      {/* Brand Text */}
      {showText && (
        <div className="flex items-baseline gap-1">
          <span className={`${textSizes[size]} font-black tracking-tight font-display ${isLight ? 'text-white' : 'text-[#0F172A]'}`}>
            partner<span className="text-[#1D68ED]">plus</span>
          </span>
        </div>
      )}
    </div>
  );
};
