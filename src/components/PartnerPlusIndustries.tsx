import React from 'react';
import {
  Building2,
  Truck,
  Store,
  Hotel,
  Home,
  HardHat,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const CitySkylineSilhouette: React.FC = () => (
  <svg viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 sm:h-20 text-blue-900/30">
    <path
      d="M0 80 L0 55 L30 55 L30 40 L60 40 L60 65 L90 65 L90 35 L120 35 L120 80 L160 80 L160 25 L190 25 L190 50 L220 50 L220 80 L280 80 L280 15 L320 15 L320 60 L360 60 L360 80 L420 80 L420 30 L450 30 L450 70 L490 70 L490 20 L530 20 L530 80 L590 80 L590 45 L620 45 L620 80 L680 80 L680 10 L730 10 L730 55 L770 55 L770 80 L840 80 L840 35 L880 35 L880 70 L920 70 L920 20 L960 20 L960 65 L1000 65 L1000 80 L1070 80 L1070 40 L1110 40 L1110 75 L1150 75 L1150 30 L1200 30 L1200 80 Z"
      fill="currentColor"
    />
  </svg>
);

interface PartnerPlusIndustriesProps {
  onOpenQuote: () => void;
}

export const PartnerPlusIndustries: React.FC<PartnerPlusIndustriesProps> = ({ onOpenQuote }) => {
  const { t } = useApp();

  const industries = [
    {
      title: 'Residential Homes & Flats',
      icon: <Home className="w-5 h-5 text-white" />,
      description:
        'Immediate help for plumbing emergencies, tripping electrical circuits, room painting, bathroom scrubbing, and house furniture assembly.'
    },
    {
      title: 'Warehouses & Logistics Hubs',
      icon: <Truck className="w-5 h-5 text-white" />,
      description:
        'Reliable daily wage workers and helpers for heavy loading, container unloading, pallet packaging, and material movement shifts.'
    },
    {
      title: 'Retail Stores & Showrooms',
      icon: <Store className="w-5 h-5 text-white" />,
      description:
        'Keep customer spaces pristine and functional with certified electrical illumination, sparkling floor scrub, and rapid handyman fixes.'
    },
    {
      title: 'Restaurants & Commercial Kitchens',
      icon: <Hotel className="w-5 h-5 text-white" />,
      description:
        'Deep grease extraction, plumbing drainage unclogging, exhaust fan maintenance, and hygienic hospital-grade floor sanitation.'
    },
    {
      title: 'Construction & Renovation Sites',
      icon: <HardHat className="w-5 h-5 text-white" />,
      description:
        'Skilled masons, painters, and reliable daily wage helpers for site debris clearing, mortar mixing, and surface plastering.'
    },
    {
      title: 'Offices & Co-working Spaces',
      icon: <Building2 className="w-5 h-5 text-white" />,
      description:
        'Comprehensive maintenance: workstation data/power cabling, desk carpentry repairs, washroom upkeep, and emergency repair technicians.'
    }
  ];

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      {/* Outer Card with Midnight Dark Theme */}
      <div className="max-w-7xl mx-auto bg-[#070D1E] rounded-3xl relative overflow-hidden text-white pt-12 sm:pt-16 pb-0 shadow-2xl border border-blue-950">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#1D68ED]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Speech Bubbles Row */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-8 sm:mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 relative z-10">
          {/* Left Speech Bubble */}
          <div className="relative bg-white text-[#0F172A] p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 flex items-start gap-3">
            <div className="text-xl sm:text-2xl shrink-0">🤝</div>
            <div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                <span className="font-extrabold text-[#1D68ED]">100% {t("landing.guaranteedCooperative")}</span> {t("landing.heroSub")}
              </p>
            </div>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2.5 left-8 w-5 h-5 bg-white transform rotate-45 border-r border-b border-gray-100 hidden sm:block" />
          </div>

          {/* Right Speech Bubble */}
          <div className="relative bg-white text-[#0F172A] p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 flex items-start gap-3">
            <div className="text-xl sm:text-2xl shrink-0">🛡️</div>
            <div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                <span className="font-extrabold text-[#0284C7]">{t("landing.verifiedWorkers")}</span> {t("customer.customerPortalSub")}
              </p>
            </div>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2.5 right-8 w-5 h-5 bg-white transform rotate-45 border-r border-b border-gray-100 hidden sm:block" />
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto px-4 relative z-10 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-[#00D2FF] text-xs font-bold uppercase tracking-wider mb-3">
            <span>🏢</span>
            <span>{t("landing.guaranteedCooperative")}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            {t("landing.industriesTitle")}
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mt-2 font-medium">
            {t("landing.industriesSub")}
          </p>
        </div>

        {/* 6 Electric Blue Industry Cards Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {industries.map((ind, idx) => (
            <div
              key={idx}
              className="bg-[#0C66E4] hover:bg-[#0b5bd0] rounded-2xl p-6 sm:p-7 text-white shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  {ind.icon}
                </div>
                <h3 className="text-xl font-black tracking-tight font-display mb-2.5">
                  {ind.title}
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  {ind.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-cyan-200">
                <span>{t("common.verified")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="text-center mt-12 sm:mt-16 mb-8 sm:mb-12 relative z-20">
          <button
            onClick={onOpenQuote}
            className="px-9 py-3.5 bg-[#00E5FF] hover:bg-[#33EBFF] text-black font-black text-sm sm:text-base rounded-xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 active:scale-98 cursor-pointer inline-flex items-center gap-2"
          >
            <span>{t("booking.bookNow")}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Bottom Decorative Skyline Silhouette */}
        <div className="w-full relative z-0 mt-4">
          <CitySkylineSilhouette />
        </div>
      </div>
    </section>
  );
};
