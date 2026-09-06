import React from 'react';

interface LogoProps {
  className?: string;
  isLight?: boolean;
}

export const PartnerPlusLogo: React.FC<LogoProps> = ({ className = '', isLight = false }) => {
  return (
    <div className={`flex items-center gap-2 select-none group cursor-pointer ${className}`}>
      {/* Stylized P Mark */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Vertical stem in dark navy / royal blue */}
          <rect x="6" y="6" width="7" height="24" rx="3.5" fill="#00D2FF" />
          {/* Rounded loop in royal blue & cyan fold */}
          <path
            d="M13 6H22C26.4183 6 30 9.58172 30 14C30 18.4183 26.4183 22 22 22H13V6Z"
            fill="#1D68ED"
          />
          {/* Accent inner cutout */}
          <path
            d="M13 10H21C23.2091 10 25 11.7909 25 14C25 16.2091 23.2091 18 21 18H13V10Z"
            fill={isLight ? '#0B132B' : '#ffffff'}
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex items-baseline gap-1.5">
        <span className={`text-xl sm:text-2xl font-black tracking-tight font-display ${isLight ? 'text-white' : 'text-[#0F172A]'}`}>
          partnerplus
        </span>
        <span className={`text-[10px] font-semibold leading-none tracking-tight ${isLight ? 'text-cyan-300' : 'text-slate-500'}`}>
          Exterior<br />Cleaning
        </span>
      </div>
    </div>
  );
};
