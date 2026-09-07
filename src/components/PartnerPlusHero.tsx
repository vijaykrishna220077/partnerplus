import React from 'react';
import { Phone, ArrowRight, Sparkles, Building } from 'lucide-react';
import { HeroCityScene } from './HeroCityScene';
import { useApp } from '../context/AppContext';

interface PartnerPlusHeroProps {
  onOpenPrices: () => void;
  onOpenPhone: () => void;
  onSwitchToWorker?: () => void;
}

export const PartnerPlusHero: React.FC<PartnerPlusHeroProps> = ({ 
  onOpenPrices, 
  onOpenPhone,
  onSwitchToWorker
}) => {
  const { t } = useApp();

  return (
    <section className="relative w-full bg-white pt-6 sm:pt-10 md:pt-12 overflow-hidden border-b border-gray-100">
      {/* Centered Headline Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Top Tagline Pill with Quick Worker Mode Switch */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F7FC] text-[#0284C7] text-xs sm:text-sm font-black tracking-wide uppercase shadow-2xs border border-sky-200">
            <Building className="w-3.5 h-3.5 text-[#1D68ED]" />
            <span>{t("landing.guaranteedCooperative")}</span>
          </div>
          {onSwitchToWorker && (
            <button
              onClick={onSwitchToWorker}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-black shadow-2xs transition cursor-pointer"
              title="Switch to low-literacy Worker Portal"
            >
              <span>👷 {t("worker.workerPortalTitle")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* H1 Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-black text-[#0F172A] tracking-tight leading-[1.08] font-display max-w-4xl mx-auto">
          {t("landing.heroTitle")}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-medium">
          {t("landing.heroSub")}
        </p>

        {/* Popular Service Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto text-xs sm:text-sm font-bold text-gray-600">
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">⚡ {t("jobs.electricianJob")}</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">🚰 {t("jobs.plumbingJob")}</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">🪚 {t("jobs.carpentryJob")}</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">✨ {t("jobs.cleaningJob")}</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">👷 {t("worker.available")}</span>
        </div>

        {/* Action Row */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            id="hero-select-works-workers-btn"
            onClick={onOpenPrices}
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#1D68ED] via-[#1A62E8] to-[#0D4EC7] hover:from-[#1554C7] hover:to-[#093C9E] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/45 border border-blue-400/40 transition-all duration-200 active:scale-98 cursor-pointer flex items-center justify-center gap-3 overflow-hidden ring-4 ring-blue-500/15 hover:ring-blue-500/30"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-sm shadow-emerald-500/50"></span>
              </span>
              <span className="truncate">{t("landing.heroCta")}</span>
            </div>
            
            <div className="w-7 h-7 rounded-xl bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition shrink-0">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-white" />
            </div>
          </button>

          <button
            onClick={onOpenPhone}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#0F172A] hover:text-[#1D68ED] font-extrabold text-sm sm:text-base px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#1D68ED] fill-[#1D68ED]/20" />
            <span>1800-425-PLUS ({t("common.helpline")})</span>
          </button>
        </div>
      </div>

      {/* Vector City Scene Canvas */}
      <div className="w-full mt-4 sm:mt-8 relative">
        <HeroCityScene />
      </div>
    </section>
  );
};
