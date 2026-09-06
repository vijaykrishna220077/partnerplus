import React from 'react';
import { ArrowRight, ShieldCheck, DollarSign, Volume2 } from 'lucide-react';
import { PartnerPlusHero } from '../components/PartnerPlusHero';
import { PartnerPlusCoreServices } from '../components/PartnerPlusCoreServices';
import { PartnerPlusIndustries } from '../components/PartnerPlusIndustries';
import { PartnerPlusReviews } from '../components/PartnerPlusReviews';

interface HomeProps {
  onOpenPrices?: (serviceKey?: string) => void;
  onOpenPhone?: () => void;
  onSelectService?: (service: string) => void;
  onSwitchToWorker?: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onOpenPrices = (_serviceKey?: string) => {},
  onOpenPhone = () => {},
  onSelectService = (_service: string) => {},
  onSwitchToWorker
}) => {
  return (
    <div className="w-full bg-white selection:bg-[#00D2FF] selection:text-black">
      {/* 1. Hero Section with Headline & Panoramic Vector City Crew Scene */}
      <PartnerPlusHero
        onOpenPrices={() => onOpenPrices()}
        onOpenPhone={() => onOpenPhone()}
        onSwitchToWorker={onSwitchToWorker}
      />

      {/* 2. Worker Quick Access Banner (Specially for rural & daily laborers) */}
      {onSwitchToWorker && (
        <div className="bg-[#0B1528] text-white py-4 px-4 border-y border-blue-900/60 shadow-inner">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center text-2xl font-black shrink-0 shadow-lg shadow-emerald-500/20">
                👷
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span>क्या आप काम की तलाश में हैं? (Are you a Worker?)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                    Skilled &amp; Unskilled Labor Welcome
                  </span>
                </div>
                <div className="text-xs text-gray-300">
                  सीधे नकद कमाई • आसान आवाज़ वाला ऐप (Voice Guidance) • कोई कमीशन नहीं
                </div>
              </div>
            </div>

            <button
              onClick={onSwitchToWorker}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98 shrink-0"
            >
              <span>👷 Open Worker Mode (कामगार पोर्टल)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Core Service Section with All Jobs Grid */}
      <PartnerPlusCoreServices
        onSelectService={(svc) => onSelectService(svc)}
        onOpenPrices={(svc) => onOpenPrices(svc)}
      />

      {/* 4. Partnered Industries Section (Dark Midnight Card with Speech Bubbles & 6 Blue Cards) */}
      <PartnerPlusIndustries
        onOpenQuote={() => onOpenPrices()}
      />

      {/* 5. Customer Satisfaction Section (5 Cyan Stars & Testimonial Cards) */}
      <PartnerPlusReviews />
    </div>
  );
};

