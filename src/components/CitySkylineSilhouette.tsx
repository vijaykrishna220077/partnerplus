import React from 'react';

export const CitySkylineSilhouette: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 1200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-h-[140px]"
        preserveAspectRatio="none"
      >
        {/* Left Side Skyline Silhouette */}
        <g id="skyline-left">
          {/* Back Buildings in Royal Blue */}
          <rect x="0" y="70" width="55" height="90" fill="#1D4ED8" />
          <rect x="45" y="45" width="65" height="115" fill="#1E40AF" />
          <rect x="100" y="80" width="45" height="80" fill="#2563EB" />
          <rect x="135" y="60" width="70" height="100" fill="#1E3A8A" />

          {/* Front Illuminated Buildings in Cyan / Electric Blue */}
          <rect x="10" y="90" width="50" height="70" fill="#00D2FF" />
          {/* Windows on left front building */}
          {Array.from({ length: 3 }).map((_, r) => (
            <g key={`lsw1-${r}`}>
              <rect x="18" y={98 + r * 18} width="8" height="10" fill="#FFFFFF" />
              <rect x="31" y={98 + r * 18} width="8" height="10" fill="#FFFFFF" />
              <rect x="44" y={98 + r * 18} width="8" height="10" fill="#FFFFFF" />
            </g>
          ))}

          {/* Stepped Cyan Tower */}
          <rect x="70" y="65" width="60" height="95" fill="#00A8E8" />
          {Array.from({ length: 4 }).map((_, r) => (
            <g key={`lsw2-${r}`}>
              <rect x="78" y={75 + r * 18} width="9" height="10" fill="#FFFFFF" />
              <rect x="94" y={75 + r * 18} width="9" height="10" fill="#FFFFFF" />
              <rect x="110" y={75 + r * 18} width="9" height="10" fill="#FFFFFF" />
            </g>
          ))}

          {/* Third Front Building */}
          <rect x="145" y="85" width="55" height="75" fill="#0284C7" />
          {Array.from({ length: 3 }).map((_, r) => (
            <g key={`lsw3-${r}`}>
              <rect x="153" y={95 + r * 18} width="9" height="10" fill="#FFFFFF" />
              <rect x="169" y={95 + r * 18} width="9" height="10" fill="#FFFFFF" />
              <rect x="184" y={95 + r * 18} width="9" height="10" fill="#FFFFFF" />
            </g>
          ))}
        </g>

        {/* Center Ground Glow Divider Line */}
        <line x1="0" y1="158" x2="1200" y2="158" stroke="#00D2FF" strokeWidth="2" opacity="0.6" />

        {/* Right Side Skyline Silhouette */}
        <g id="skyline-right">
          {/* Back Buildings */}
          <rect x="970" y="60" width="70" height="100" fill="#1E3A8A" />
          <rect x="1030" y="45" width="65" height="115" fill="#1E40AF" />
          <rect x="1085" y="70" width="55" height="90" fill="#1D4ED8" />
          <rect x="1130" y="55" width="70" height="105" fill="#2563EB" />

          {/* Front Illuminated Buildings */}
          <rect x="990" y="85" width="55" height="75" fill="#0284C7" />
          {Array.from({ length: 3 }).map((_, r) => (
            <g key={`rsw1-${r}`}>
              <rect x="998" y={95 + r * 18} width="9" height="10" fill="#FFFFFF" />
              <rect x="1014" y={95 + r * 18} width="9" height="10" fill="#FFFFFF" />
              <rect x="1029" y={95 + r * 18} width="9" height="10" fill="#FFFFFF" />
            </g>
          ))}

          {/* Center-Right Tower */}
          <rect x="1055" y="65" width="60" height="95" fill="#00A8E8" />
          {Array.from({ length: 4 }).map((_, r) => (
            <g key={`rsw2-${r}`}>
              <rect x="1063" y={75 + r * 18} width="9" height="10" fill="#FFFFFF" />
              <rect x="1079" y={75 + r * 18} width="9" height="10" fill="#FFFFFF" />
              <rect x="1095" y={75 + r * 18} width="9" height="10" fill="#FFFFFF" />
            </g>
          ))}

          {/* Far Right Cyan Front Building */}
          <rect x="1125" y="90" width="65" height="70" fill="#00D2FF" />
          {Array.from({ length: 3 }).map((_, r) => (
            <g key={`rsw3-${r}`}>
              <rect x="1135" y={98 + r * 18} width="9" height="10" fill="#FFFFFF" />
              <rect x="1152" y={98 + r * 18} width="9" height="10" fill="#FFFFFF" />
              <rect x="1169" y={98 + r * 18} width="9" height="10" fill="#FFFFFF" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
