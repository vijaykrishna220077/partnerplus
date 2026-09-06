import React from 'react';

export const HeroCityScene: React.FC = () => {
  return (
    <div className="w-full relative select-none overflow-hidden">
      {/* Cityscape and Cleaning Crew Panoramic SVG */}
      <svg
        viewBox="0 0 1440 660"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto min-h-[380px] sm:min-h-[460px] md:min-h-[540px] max-h-[700px] object-cover"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Cloud linear gradient */}
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.9" />
          </linearGradient>

          {/* Cyan Ground Gradient */}
          <linearGradient id="cyanGround" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00C4F4" />
            <stop offset="100%" stopColor="#00D2FF" />
          </linearGradient>

          {/* Building Gradients */}
          <linearGradient id="darkBlueBldg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          <linearGradient id="midBlueBldg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="cyanBldg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          <linearGradient id="brightCyanBldg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00A8E8" />
            <stop offset="100%" stopColor="#0077B6" />
          </linearGradient>

          {/* Water Spray Gradient */}
          <linearGradient id="sprayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* ======================================================== */}
        {/* LAYER 1: SKY & FLUFFY CLOUDS                             */}
        {/* ======================================================== */}
        {/* Left Cloud Cluster */}
        <g opacity="0.95">
          <path
            d="M80 180 C80 145 105 120 140 120 C155 120 170 125 180 135 C195 105 230 90 265 105 C295 118 310 145 305 175 C325 175 340 190 340 210 C340 230 320 245 295 245 L100 245 C75 245 60 225 60 205 C60 190 70 180 80 180 Z"
            fill="url(#cloudGrad)"
          />
        </g>

        {/* Right Cloud Cluster */}
        <g opacity="0.95">
          <path
            d="M1160 190 C1160 155 1185 130 1220 130 C1235 130 1250 135 1260 145 C1275 115 1310 100 1345 115 C1375 128 1390 155 1385 185 C1405 185 1420 200 1420 220 C1420 240 1400 255 1375 255 L1180 255 C1155 255 1140 235 1140 215 C1140 200 1150 190 1160 190 Z"
            fill="url(#cloudGrad)"
          />
        </g>

        {/* Center subtle cloud */}
        <g opacity="0.6">
          <path
            d="M480 260 C495 245 520 245 535 260 C550 240 580 240 595 260 C610 260 620 270 620 280 L460 280 C460 270 470 260 480 260 Z"
            fill="url(#cloudGrad)"
          />
          <path
            d="M840 270 C855 255 880 255 895 270 C910 250 940 250 955 270 C970 270 980 280 980 290 L820 290 C820 280 830 270 840 270 Z"
            fill="url(#cloudGrad)"
          />
        </g>

        {/* ======================================================== */}
        {/* LAYER 2: BACKGROUND TALL SKYSCRAPERS (DEEP BLUE/COBALT)  */}
        {/* ======================================================== */}
        {/* Left deep skyscrapers */}
        <rect x="0" y="240" width="110" height="260" fill="#1D4ED8" />
        {/* Grid windows on bldg 1 */}
        {Array.from({ length: 6 }).map((_, r) => (
          <g key={`lbg1-${r}`}>
            <rect x="15" y={260 + r * 34} width="16" height="20" rx="2" fill="#60A5FA" opacity="0.8" />
            <rect x="42" y={260 + r * 34} width="16" height="20" rx="2" fill="#BFDBFE" opacity="0.9" />
            <rect x="70" y={260 + r * 34} width="16" height="20" rx="2" fill="#93C5FD" opacity="0.8" />
          </g>
        ))}

        {/* Left tiered building */}
        <rect x="90" y="200" width="130" height="300" fill="#1E40AF" />
        <rect x="110" y="170" width="90" height="30" fill="#1E3A8A" />
        <line x1="155" y1="140" x2="155" y2="170" stroke="#60A5FA" strokeWidth="3" />
        <circle cx="155" cy="138" r="3" fill="#EF4444" />
        {Array.from({ length: 7 }).map((_, r) => (
          <g key={`lbg2-${r}`}>
            <rect x="105" y={215 + r * 36} width="28" height="12" rx="2" fill="#BFDBFE" />
            <rect x="145" y={215 + r * 36} width="28" height="12" rx="2" fill="#60A5FA" />
            <rect x="185" y={215 + r * 36} width="24" height="12" rx="2" fill="#DBEAFE" />
          </g>
        ))}

        {/* Angled roof high-rise (left-center) */}
        <path d="M190 280 L290 230 L290 500 L190 500 Z" fill="#2563EB" />
        {Array.from({ length: 5 }).map((_, r) => (
          <g key={`lag3-${r}`}>
            <rect x="205" y={290 + r * 36} width="20" height="22" rx="2" fill="#93C5FD" />
            <rect x="235" y={280 + r * 36} width="20" height="22" rx="2" fill="#DBEAFE" />
            <rect x="265" y={270 + r * 36} width="15" height="22" rx="2" fill="#60A5FA" />
          </g>
        ))}

        {/* Center-left midground high-rise */}
        <rect x="260" y="270" width="130" height="230" fill="#1D4ED8" />
        {Array.from({ length: 6 }).map((_, r) => (
          <g key={`lbg4-${r}`}>
            <rect x="275" y={285 + r * 32} width="22" height="16" rx="2" fill="#60A5FA" opacity="0.75" />
            <rect x="310" y={285 + r * 32} width="22" height="16" rx="2" fill="#BFDBFE" />
            <rect x="345" y={285 + r * 32} width="22" height="16" rx="2" fill="#93C5FD" />
          </g>
        ))}

        {/* Right deep background skyscrapers */}
        <rect x="1100" y="220" width="160" height="280" fill="#1E40AF" />
        <rect x="1130" y="190" width="100" height="30" fill="#1E3A8A" />
        <line x1="1180" y1="160" x2="1180" y2="190" stroke="#60A5FA" strokeWidth="3" />
        <circle cx="1180" cy="158" r="3" fill="#EF4444" />
        {Array.from({ length: 7 }).map((_, r) => (
          <g key={`rbg1-${r}`}>
            <rect x="1120" y={235 + r * 34} width="24" height="18" rx="2" fill="#60A5FA" />
            <rect x="1155" y={235 + r * 34} width="24" height="18" rx="2" fill="#BFDBFE" />
            <rect x="1190" y={235 + r * 34} width="24" height="18" rx="2" fill="#93C5FD" />
            <rect x="1225" y={235 + r * 34} width="24" height="18" rx="2" fill="#DBEAFE" />
          </g>
        ))}

        {/* Far Right blue high-rise */}
        <rect x="1240" y="250" width="200" height="250" fill="#2563EB" />
        {Array.from({ length: 6 }).map((_, r) => (
          <g key={`rbg2-${r}`}>
            <rect x="1260" y={270 + r * 34} width="24" height="18" rx="2" fill="#BFDBFE" />
            <rect x="1295" y={270 + r * 34} width="24" height="18" rx="2" fill="#93C5FD" />
            <rect x="1330" y={270 + r * 34} width="24" height="18" rx="2" fill="#60A5FA" />
            <rect x="1365" y={270 + r * 34} width="24" height="18" rx="2" fill="#DBEAFE" />
            <rect x="1400" y={270 + r * 34} width="24" height="18" rx="2" fill="#93C5FD" />
          </g>
        ))}

        {/* Antenna & roof grid top right */}
        <rect x="1140" y="280" width="80" height="20" rx="3" fill="#0284C7" />
        <g stroke="#0284C7" strokeWidth="2">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`rg-${i}`} x1={1145 + i * 10} y1="268" x2={1145 + i * 10} y2="280" />
          ))}
        </g>

        {/* ======================================================== */}
        {/* LAYER 3: FOREGROUND STOREFRONTS & MODERN CYAN BUILDINGS   */}
        {/* ======================================================== */}
        {/* Far left modern building with grid windows */}
        <rect x="15" y="320" width="130" height="180" fill="#00A8E8" />
        <rect x="25" y="335" width="24" height="30" rx="3" fill="#FFFFFF" opacity="0.9" />
        <rect x="58" y="335" width="24" height="30" rx="3" fill="#FFFFFF" opacity="0.9" />
        <rect x="91" y="335" width="24" height="30" rx="3" fill="#FFFFFF" opacity="0.9" />

        <rect x="25" y="375" width="24" height="30" rx="3" fill="#FFFFFF" opacity="0.9" />
        <rect x="58" y="375" width="24" height="30" rx="3" fill="#FFFFFF" opacity="0.9" />
        <rect x="91" y="375" width="24" height="30" rx="3" fill="#FFFFFF" opacity="0.9" />

        <rect x="25" y="415" width="24" height="30" rx="3" fill="#FFFFFF" opacity="0.9" />
        <rect x="58" y="415" width="24" height="30" rx="3" fill="#FFFFFF" opacity="0.9" />
        <rect x="91" y="415" width="24" height="30" rx="3" fill="#FFFFFF" opacity="0.9" />

        {/* Left Storefront with Awning */}
        <rect x="100" y="380" width="150" height="120" fill="#0088CC" />
        {/* Striped Awning */}
        <path d="M95 400 L255 400 L245 425 L105 425 Z" fill="#FFFFFF" />
        <path d="M110 400 L125 400 L120 425 L105 425 Z" fill="#0284C7" />
        <path d="M140 400 L155 400 L150 425 L135 425 Z" fill="#0284C7" />
        <path d="M170 400 L185 400 L180 425 L165 425 Z" fill="#0284C7" />
        <path d="M200 400 L215 400 L210 425 L195 425 Z" fill="#0284C7" />
        <path d="M230 400 L245 400 L240 425 L225 425 Z" fill="#0284C7" />
        {/* Store Window & Door */}
        <rect x="115" y="435" width="60" height="65" fill="#E0F2FE" />
        <rect x="185" y="435" width="45" height="65" fill="#FFFFFF" />
        <circle cx="192" cy="465" r="3" fill="#0284C7" />

        {/* Left Center Modern Building (Cyan Architecture) */}
        <rect x="135" y="360" width="160" height="140" fill="#0284C7" opacity="0.9" />
        <path d="M140 370 L285 315 L285 500 L140 500 Z" fill="#00A8E8" />
        <path d="M155 385 L270 335 L270 490 L155 490 Z" fill="#FFFFFF" opacity="0.85" />
        {/* Glass mullions */}
        <line x1="180" y1="375" x2="180" y2="490" stroke="#0284C7" strokeWidth="2" />
        <line x1="210" y1="360" x2="210" y2="490" stroke="#0284C7" strokeWidth="2" />
        <line x1="240" y1="348" x2="240" y2="490" stroke="#0284C7" strokeWidth="2" />
        <line x1="155" y1="410" x2="270" y2="410" stroke="#0284C7" strokeWidth="2" />
        <line x1="155" y1="450" x2="270" y2="450" stroke="#0284C7" strokeWidth="2" />

        {/* Small city commercial storefront (left-center mid) */}
        <rect x="230" y="415" width="160" height="85" fill="#0077B6" />
        <rect x="245" y="430" width="22" height="18" rx="2" fill="#E0F2FE" />
        <rect x="275" y="430" width="22" height="18" rx="2" fill="#E0F2FE" />
        <rect x="305" y="430" width="22" height="18" rx="2" fill="#E0F2FE" />
        {/* Arched windows */}
        <path d="M245 480 L245 465 Q256 455 267 465 L267 480 Z" fill="#FFFFFF" />
        <path d="M275 480 L275 465 Q286 455 297 465 L297 480 Z" fill="#FFFFFF" />
        {/* Double Entrance door */}
        <rect x="315" y="455" width="40" height="45" fill="#FFFFFF" />
        <line x1="335" y1="455" x2="335" y2="500" stroke="#0077B6" strokeWidth="2" />

        {/* Right side commercial retail & storefronts */}
        <rect x="645" y="420" width="120" height="80" fill="#0088CC" />
        <rect x="660" y="435" width="30" height="20" rx="3" fill="#E0F2FE" />
        <rect x="700" y="435" width="30" height="20" rx="3" fill="#E0F2FE" />
        {/* Donut / circular sign on shop */}
        <circle cx="705" cy="470" r="16" fill="#7DD3FC" />
        <circle cx="705" cy="470" r="8" fill="#0088CC" />
        <rect x="655" y="465" width="35" height="35" fill="#FFFFFF" />

        {/* Right side modern high-rise facade with white vertical mullions */}
        <rect x="730" y="380" width="330" height="120" fill="#0284C7" />
        <rect x="745" y="395" width="30" height="40" fill="#FFFFFF" />
        <rect x="785" y="395" width="30" height="40" fill="#FFFFFF" />
        <rect x="825" y="395" width="30" height="40" fill="#FFFFFF" />
        <rect x="865" y="395" width="30" height="40" fill="#FFFFFF" />
        <rect x="905" y="395" width="30" height="40" fill="#FFFFFF" />
        <rect x="945" y="395" width="30" height="40" fill="#FFFFFF" />
        <rect x="985" y="395" width="30" height="40" fill="#FFFFFF" />
        <rect x="1025" y="395" width="25" height="40" fill="#FFFFFF" />

        {/* Right large commercial glass tower with white grid lines */}
        <rect x="850" y="300" width="200" height="200" fill="#00A8E8" />
        {Array.from({ length: 4 }).map((_, c) => (
          <g key={`rtw-c-${c}`}>
            {Array.from({ length: 4 }).map((_, r) => (
              <rect
                key={`rtw-${c}-${r}`}
                x={870 + c * 44}
                y={320 + r * 42}
                width="32"
                height="32"
                rx="2"
                fill="#FFFFFF"
              />
            ))}
          </g>
        ))}

        {/* Modern city trees */}
        {/* Left tree */}
        <rect x="65" y="450" width="8" height="50" fill="#1E3A8A" />
        <path d="M69 395 C45 395 40 460 69 460 C98 460 93 395 69 395 Z" fill="#3B82F6" />
        <path d="M69 410 C50 410 46 460 69 460 C92 460 88 410 69 410 Z" fill="#60A5FA" />

        {/* Right tree */}
        <rect x="965" y="450" width="8" height="50" fill="#1E3A8A" />
        <path d="M969 415 C945 415 940 470 969 470 C998 470 993 415 969 415 Z" fill="#6366F1" />
        <path d="M969 430 C950 430 946 470 969 470 C992 470 988 430 969 430 Z" fill="#818CF8" />

        {/* Modern street lamps */}
        {/* Left Lamp */}
        <g stroke="#38BDF8" strokeWidth="3" fill="none">
          <line x1="365" y1="420" x2="365" y2="500" stroke="#0284C7" strokeWidth="4" />
          <path d="M365 435 C355 425 330 420 325 430" />
          <path d="M365 435 C375 425 400 420 405 430" />
          <circle cx="325" cy="432" r="4" fill="#FFFFFF" stroke="none" />
          <circle cx="405" cy="432" r="4" fill="#FFFFFF" stroke="none" />
        </g>

        {/* Right Lamp */}
        <g stroke="#38BDF8" strokeWidth="3" fill="none">
          <line x1="725" y1="420" x2="725" y2="500" stroke="#0284C7" strokeWidth="4" />
          <path d="M725 435 C715 425 690 420 685 430" />
          <path d="M725 435 C735 425 760 420 765 430" />
          <circle cx="685" cy="432" r="4" fill="#FFFFFF" stroke="none" />
          <circle cx="765" cy="432" r="4" fill="#FFFFFF" stroke="none" />
        </g>

        {/* ======================================================== */}
        {/* LAYER 4: PAVEMENT, CURB & ELECTRIC CYAN STREET           */}
        {/* ======================================================== */}
        {/* White concrete sidewalk slab */}
        <rect x="0" y="495" width="1440" height="20" fill="#FFFFFF" />
        <line x1="0" y1="495" x2="1440" y2="495" stroke="#BAE6FD" strokeWidth="1" />
        <line x1="0" y1="515" x2="1440" y2="515" stroke="#0284C7" strokeWidth="2" />

        {/* Electric Cyan ground / street */}
        <rect x="0" y="515" width="1440" height="145" fill="url(#cyanGround)" />

        {/* Clean water sheen highlights on wet ground */}
        <ellipse cx="230" cy="560" rx="90" ry="8" fill="#FFFFFF" opacity="0.35" />
        <ellipse cx="480" cy="580" rx="140" ry="10" fill="#FFFFFF" opacity="0.4" />
        <ellipse cx="980" cy="575" rx="110" ry="8" fill="#FFFFFF" opacity="0.35" />
        <ellipse cx="1260" cy="565" rx="130" ry="9" fill="#FFFFFF" opacity="0.35" />

        {/* ======================================================== */}
        {/* LAYER 5: 4 EXTERIOR CLEANING CREWS & MACHINES            */}
        {/* ======================================================== */}

        {/* -------------------------------------------------------- */}
        {/* WORKER 1 (FAR LEFT): Walk-Behind Commercial Scrubber/Washer */}
        {/* -------------------------------------------------------- */}
        <g id="worker-left-machine">
          {/* Floor Scrubber Body in Cyan */}
          <path
            d="M70 575 C70 540 100 530 145 530 L200 530 C208 530 215 537 215 545 L215 575 L70 575 Z"
            fill="#00D2FF"
            stroke="#0088CC"
            strokeWidth="2"
          />
          {/* Scrubber Base & Wheels */}
          <rect x="68" y="570" width="150" height="15" rx="4" fill="#0F172A" />
          <circle cx="95" cy="580" r="14" fill="#1E293B" stroke="#00D2FF" strokeWidth="3" />
          <circle cx="185" cy="580" r="14" fill="#1E293B" stroke="#00D2FF" strokeWidth="3" />
          <rect x="155" y="545" width="35" height="10" rx="2" fill="#FFFFFF" />
          {/* Scrubber Handles */}
          <path d="M195 535 L225 515 L235 520" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />

          {/* Technician 1 Walking */}
          {/* Legs / Dark Trousers */}
          <path d="M245 490 L240 550 L230 575" stroke="#0F172A" strokeWidth="12" strokeLinecap="round" />
          <path d="M255 490 L265 545 L290 572" stroke="#0F172A" strokeWidth="12" strokeLinecap="round" />
          {/* Boots */}
          <rect x="218" y="570" width="22" height="10" rx="4" fill="#0284C7" />
          <rect x="280" y="568" width="22" height="10" rx="4" fill="#0284C7" />
          {/* Torso / Cyan Polo Shirt */}
          <path d="M238 460 L268 460 L262 505 L236 505 Z" fill="#00D2FF" />
          {/* Arms holding handle */}
          <path d="M240 468 L220 515" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
          <path d="M240 468 L225 515" stroke="#00D2FF" strokeWidth="10" strokeLinecap="round" />
          {/* Head & Hair */}
          <circle cx="245" cy="445" r="12" fill="#FDBA74" />
          <path d="M235 440 C235 430 255 430 258 438 C258 445 250 448 240 448 Z" fill="#0F172A" />
        </g>

        {/* -------------------------------------------------------- */}
        {/* WORKER 2 (CENTER LEFT): Pressure Washer with Spray Wand   */}
        {/* -------------------------------------------------------- */}
        <g id="worker-center-left">
          {/* Coiled Cyan Hose connected to wand */}
          <path
            d="M485 550 C480 575 470 585 495 585 C515 585 495 545 475 545 C455 545 450 580 435 570"
            stroke="#0284C7"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Technician Standing / Working */}
          {/* Legs in Dark Overalls */}
          <path d="M495 510 L488 565 L485 582" stroke="#0F172A" strokeWidth="13" strokeLinecap="round" />
          <path d="M515 510 L525 565 L535 582" stroke="#0F172A" strokeWidth="13" strokeLinecap="round" />
          {/* Boots */}
          <rect x="475" y="578" width="22" height="9" rx="3" fill="#00D2FF" />
          <rect x="525" y="578" width="22" height="9" rx="3" fill="#00D2FF" />
          {/* Body / Overalls with cyan shirt underneath */}
          <rect x="490" y="470" width="34" height="45" rx="5" fill="#0F172A" />
          {/* Cyan shirt shoulders/sleeves */}
          <path d="M485 470 L530 470 L525 490 L490 490 Z" fill="#00D2FF" />
          <rect x="497" y="480" width="6" height="25" fill="#00D2FF" />
          <rect x="512" y="480" width="6" height="25" fill="#00D2FF" />
          {/* Arms holding pressure wand */}
          <path d="M490 475 L465 520" stroke="#00D2FF" strokeWidth="9" strokeLinecap="round" />
          <path d="M465 520 L455 530" stroke="#FDBA74" strokeWidth="7" strokeLinecap="round" />
          <path d="M525 475 L475 515" stroke="#00D2FF" strokeWidth="9" strokeLinecap="round" />
          <path d="M475 515 L465 522" stroke="#FDBA74" strokeWidth="7" strokeLinecap="round" />
          {/* Long Stainless Pressure Washer Wand */}
          <line x1="472" y1="510" x2="410" y2="585" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="410" y1="585" x2="402" y2="588" stroke="#38BDF8" strokeWidth="3" />
          {/* Water Spray Mist on Ground */}
          <path d="M402 588 L385 578 L375 595 Z" fill="url(#sprayGrad)" />

          {/* Head & Hair */}
          <circle cx="505" cy="445" r="12" fill="#FDBA74" />
          <path d="M495 442 C495 432 515 432 518 440 C518 448 510 450 500 450 Z" fill="#0F172A" />
        </g>

        {/* -------------------------------------------------------- */}
        {/* WORKER 3 (CENTER RIGHT): Angled Wand Pressure Washing     */}
        {/* -------------------------------------------------------- */}
        <g id="worker-center-right">
          {/* Coiled Hose */}
          <path
            d="M980 550 C995 565 1010 575 990 585 C970 590 950 555 975 545 C995 540 1020 570 1040 575"
            stroke="#0284C7"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Technician In Motion (Lunging forward) */}
          {/* Legs */}
          <path d="M965 510 L940 550 L915 578" stroke="#0F172A" strokeWidth="13" strokeLinecap="round" />
          <path d="M985 510 L1000 550 L1015 578" stroke="#0F172A" strokeWidth="13" strokeLinecap="round" />
          {/* Boots */}
          <rect x="905" y="574" width="22" height="9" rx="3" fill="#00D2FF" />
          <rect x="1010" y="574" width="22" height="9" rx="3" fill="#00D2FF" />
          {/* Torso & Uniform */}
          <path d="M950 468 L985 468 L980 515 L955 515 Z" fill="#0F172A" />
          <path d="M948 468 L987 468 L980 488 L955 488 Z" fill="#00D2FF" />
          {/* Arms holding pressure trigger */}
          <path d="M955 475 L995 515" stroke="#00D2FF" strokeWidth="9" strokeLinecap="round" />
          <path d="M995 515 L1020 545" stroke="#FDBA74" strokeWidth="7" strokeLinecap="round" />
          <path d="M980 475 L1010 515" stroke="#00D2FF" strokeWidth="9" strokeLinecap="round" />
          {/* Long Spray Wand Pointed Down */}
          <line x1="1015" y1="520" x2="1085" y2="578" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="1085" y1="578" x2="1092" y2="582" stroke="#38BDF8" strokeWidth="3" />
          {/* Water Spray Effect */}
          <path d="M1092 582 L1110 575 L1118 590 Z" fill="url(#sprayGrad)" />

          {/* Head & Hair */}
          <circle cx="975" cy="445" r="12" fill="#FDBA74" />
          <path d="M965 440 C965 430 985 430 988 438 C988 446 980 448 970 448 Z" fill="#0F172A" />
        </g>

        {/* -------------------------------------------------------- */}
        {/* WORKER 4 (FAR RIGHT): Ride-On Commercial Scrubber Buggy  */}
        {/* -------------------------------------------------------- */}
        <g id="worker-right-vehicle">
          {/* Ride-on Machine Body (Cyan rounded styling) */}
          <path
            d="M1200 580 C1180 540 1205 500 1245 495 L1290 495 C1310 495 1325 520 1325 550 L1325 580 Z"
            fill="#00D2FF"
            stroke="#0088CC"
            strokeWidth="2"
          />
          {/* Seat & Backrest */}
          <rect x="1225" y="475" width="10" height="35" rx="3" fill="#0F172A" />
          <rect x="1225" y="505" width="30" height="10" rx="2" fill="#0F172A" />

          {/* Technician Seated Driving */}
          {/* Legs bent in driving position */}
          <path d="M1250 510 L1285 530 L1280 565" stroke="#0F172A" strokeWidth="12" strokeLinecap="round" />
          <rect x="1275" y="560" width="18" height="8" rx="2" fill="#0284C7" />
          {/* Body */}
          <path d="M1240 465 L1268 472 L1255 515 L1238 510 Z" fill="#00D2FF" />
          {/* Arms holding steering wheel */}
          <path d="M1255 478 L1290 500" stroke="#00D2FF" strokeWidth="8" strokeLinecap="round" />
          <path d="M1290 500 L1300 505" stroke="#FDBA74" strokeWidth="6" strokeLinecap="round" />
          {/* Steering Column & Wheel */}
          <line x1="1295" y1="525" x2="1300" y2="495" stroke="#0F172A" strokeWidth="4" />
          <ellipse cx="1302" cy="495" rx="8" ry="4" fill="#1E293B" />
          {/* Head & Hair */}
          <circle cx="1275" cy="445" r="11" fill="#FDBA74" />
          <path d="M1268 440 C1268 432 1285 432 1288 440 C1288 448 1280 449 1272 449 Z" fill="#0F172A" />

          {/* Machine Chassis, Wheels & Brush Strip */}
          <rect x="1195" y="575" width="135" height="14" rx="4" fill="#0F172A" />
          {/* Wheels */}
          <circle cx="1215" cy="590" r="15" fill="#1E293B" stroke="#00D2FF" strokeWidth="3" />
          <circle cx="1310" cy="590" r="15" fill="#1E293B" stroke="#00D2FF" strokeWidth="3" />
          {/* Heavy scrub brush bristle strip on bottom */}
          <g stroke="#BAE6FD" strokeWidth="2" strokeDasharray="3 3">
            <line x1="1235" y1="585" x2="1290" y2="585" />
          </g>
        </g>
      </svg>
    </div>
  );
};
