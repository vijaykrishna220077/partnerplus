import React from 'react';

export const PressureWashingIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-44' }) => {
  return (
    <div className={`relative flex items-center justify-center bg-white overflow-hidden ${className}`}>
      <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background building facade with arched windows & brick lines */}
        <g opacity="0.85" stroke="#93C5FD" strokeWidth="1.5">
          <rect x="35" y="25" width="250" height="175" fill="#F8FAFC" stroke="#93C5FD" />
          {/* Arched windows in background */}
          <path d="M55 90 L55 60 Q70 45 85 60 L85 90 Z" fill="#EFF6FF" stroke="#60A5FA" strokeWidth="1.5" />
          <path d="M125 90 L125 60 Q140 45 155 60 L155 90 Z" fill="#EFF6FF" stroke="#60A5FA" strokeWidth="1.5" />
          <path d="M195 90 L195 60 Q210 45 225 60 L225 90 Z" fill="#EFF6FF" stroke="#60A5FA" strokeWidth="1.5" />
          {/* Subtle picture frames / wall accents */}
          <rect x="55" y="110" width="20" height="25" fill="#EFF6FF" stroke="#93C5FD" />
          <rect x="235" y="110" width="20" height="25" fill="#EFF6FF" stroke="#93C5FD" />
        </g>

        {/* Floor Line */}
        <line x1="20" y1="175" x2="300" y2="175" stroke="#CBD5E1" strokeWidth="2" />

        {/* Small potted plant on left */}
        <path d="M48 165 L52 175 L62 175 L66 165 Z" fill="#0F172A" />
        <path d="M57 148 C52 152 52 165 57 165 C62 165 62 152 57 148 Z" fill="#3B82F6" />

        {/* Cleaning bucket with spray bottles on right */}
        <path d="M235 158 L238 175 L252 175 L255 158 Z" fill="#00D2FF" />
        <rect x="240" y="152" width="4" height="6" fill="#1D68ED" />
        <rect x="247" y="150" width="4" height="8" fill="#F59E0B" />

        {/* Cleaning Technician with Pressure Wand / Squeegee */}
        {/* Legs in dark trousers */}
        <path d="M175 125 L168 155 L160 174" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />
        <path d="M185 125 L195 152 L210 174" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />
        {/* Shoes */}
        <rect x="152" y="171" width="12" height="5" rx="2" fill="#0284C7" />
        <rect x="206" y="171" width="12" height="5" rx="2" fill="#0284C7" />
        {/* Torso in Cyan Shirt */}
        <path d="M172 105 L190 108 L182 135 L168 132 Z" fill="#00D2FF" />
        {/* Arms holding long extension pole */}
        <path d="M175 110 L155 128" stroke="#00D2FF" strokeWidth="6" strokeLinecap="round" />
        <path d="M155 128 L142 136" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" />
        {/* Long pressure wand / pole angled to wall */}
        <line x1="180" y1="120" x2="100" y2="175" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="180" y1="120" x2="188" y2="114" stroke="#0F172A" strokeWidth="2.5" />
        {/* Head */}
        <circle cx="182" cy="94" r="8" fill="#FDBA74" />
        <path d="M176 92 C176 86 190 86 190 92 Z" fill="#0F172A" />
      </svg>
    </div>
  );
};

export const WindowWashingIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-44' }) => {
  return (
    <div className={`relative flex items-center justify-center bg-white overflow-hidden ${className}`}>
      <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Tall Blue Skyscrapers */}
        {/* Left building */}
        <rect x="50" y="80" width="50" height="100" fill="#1E40AF" />
        {Array.from({ length: 4 }).map((_, r) => (
          <g key={`wb1-${r}`}>
            <rect x="58" y={90 + r * 20} width="12" height="12" rx="1" fill="#93C5FD" />
            <rect x="76" y={90 + r * 20} width="12" height="12" rx="1" fill="#BFDBFE" />
          </g>
        ))}

        {/* Center Main Skyscraper */}
        <rect x="95" y="45" width="115" height="135" fill="#0284C7" />
        {/* Grid Windows */}
        {Array.from({ length: 4 }).map((_, c) => (
          <g key={`wc-${c}`}>
            {Array.from({ length: 5 }).map((_, r) => (
              <rect
                key={`wr-${c}-${r}`}
                x={106 + c * 24}
                y={55 + r * 22}
                width="16"
                height="14"
                rx="1"
                fill="#FFFFFF"
                opacity="0.9"
              />
            ))}
          </g>
        ))}

        {/* Right Building */}
        <rect x="205" y="65" width="60" height="115" fill="#1D4ED8" />
        {Array.from({ length: 4 }).map((_, r) => (
          <g key={`wb2-${r}`}>
            <rect x="215" y={75 + r * 22} width="14" height="14" rx="1" fill="#60A5FA" />
            <rect x="238" y={75 + r * 22} width="14" height="14" rx="1" fill="#BFDBFE" />
          </g>
        ))}

        {/* Suspended Window Cleaning Stage / Cradle */}
        {/* Suspension Cables */}
        <line x1="125" y1="40" x2="125" y2="105" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="175" y1="40" x2="175" y2="105" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="2 2" />
        {/* Cradle Basket */}
        <rect x="120" y="105" width="60" height="18" rx="2" fill="#00D2FF" stroke="#0088CC" strokeWidth="1.5" />
        <line x1="120" y1="114" x2="180" y2="114" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Window Washer inside Cradle */}
        {/* Torso */}
        <rect x="145" y="93" width="12" height="15" fill="#0F172A" />
        {/* Squeegee arm */}
        <line x1="152" y1="96" x2="165" y2="85" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
        <line x1="163" y1="83" x2="168" y2="88" stroke="#00D2FF" strokeWidth="4" strokeLinecap="round" />
        {/* Head with safety helmet */}
        <circle cx="151" cy="86" r="5" fill="#FDBA74" />
        <path d="M146 86 C146 80 156 80 156 86 Z" fill="#F59E0B" />

        {/* Sparkling clean gleam on glass */}
        <path d="M135 65 L140 68 L135 71 L132 68 Z" fill="#FFFFFF" />
        <circle cx="136" cy="68" r="1.5" fill="#00D2FF" />
      </svg>
    </div>
  );
};

export const FleetWashingIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-44' }) => {
  return (
    <div className={`relative flex items-center justify-center bg-white overflow-hidden ${className}`}>
      <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background arched garage windows */}
        <g opacity="0.75" stroke="#93C5FD" strokeWidth="1.5">
          <path d="M135 85 L135 45 Q155 25 175 45 L175 85 Z" fill="#EFF6FF" />
          <path d="M195 85 L195 45 Q215 25 235 45 L235 85 Z" fill="#EFF6FF" />
        </g>

        {/* Ground */}
        <line x1="20" y1="175" x2="300" y2="175" stroke="#CBD5E1" strokeWidth="2" />

        {/* Commercial Yellow Fleet Transit Bus / Van */}
        <g id="yellow-bus">
          {/* Main Bus Body */}
          <rect x="145" y="80" width="105" height="75" rx="8" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
          {/* Front Windshield & Windows */}
          <rect x="155" y="88" width="40" height="24" rx="2" fill="#0F172A" />
          <rect x="200" y="88" width="40" height="24" rx="2" fill="#0F172A" />
          <rect x="158" y="91" width="34" height="18" fill="#7DD3FC" opacity="0.9" />
          <rect x="203" y="91" width="34" height="18" fill="#7DD3FC" opacity="0.9" />
          {/* Front Grille */}
          <rect x="160" y="125" width="75" height="15" rx="3" fill="#1E293B" />
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`gr-${i}`} x1={168 + i * 11} y1="128" x2={168 + i * 11} y2="137" stroke="#94A3B8" strokeWidth="1.5" />
          ))}
          {/* Headlights */}
          <circle cx="152" cy="120" r="5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="243" cy="120" r="5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Wheels */}
          <rect x="140" y="152" width="115" height="12" fill="#0F172A" />
          <circle cx="160" cy="160" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
          <circle cx="235" cy="160" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
        </g>

        {/* Technician Washing the Fleet Vehicle */}
        {/* Water wash wand and high-pressure hose */}
        <path
          d="M85 140 C85 165 95 170 115 172 C125 172 135 155 145 150"
          stroke="#00D2FF"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Technician */}
        {/* Legs */}
        <path d="M92 125 L88 152 L82 174" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />
        <path d="M102 125 L108 152 L115 174" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />
        <rect x="76" y="171" width="12" height="5" rx="2" fill="#0284C7" />
        <rect x="110" y="171" width="12" height="5" rx="2" fill="#0284C7" />
        {/* Backpack water tank */}
        <rect x="80" y="98" width="8" height="20" rx="3" fill="#00D2FF" stroke="#0284C7" strokeWidth="1" />
        {/* Torso in Cyan Uniform */}
        <path d="M88 102 L106 102 L102 130 L88 130 Z" fill="#00D2FF" />
        {/* Arms holding spray wand directed at bus */}
        <path d="M96 106 L118 116" stroke="#00D2FF" strokeWidth="6" strokeLinecap="round" />
        <path d="M118 116 L126 120" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" />
        {/* Spray Wand */}
        <line x1="124" y1="120" x2="148" y2="108" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        {/* Water Spray Foam onto bus front */}
        <path d="M148 108 L160 102 L162 115 Z" fill="#E0F2FE" opacity="0.8" />
        {/* Head */}
        <circle cx="96" cy="92" r="7" fill="#FDBA74" />
        <path d="M90 90 C90 85 102 85 102 90 Z" fill="#0F172A" />
      </svg>
    </div>
  );
};
