import React from 'react';
import { 
  Users, 
  UserCheck, 
  Zap, 
  Check, 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { CooperativeWorkerProfile } from '../../data/cooperativeWorkers';
import { soundAndSpeech } from '../../utils/soundAndSpeech';
import { useApp } from '../../context/AppContext';

interface AvailableWorkersViewProps {
  workers?: CooperativeWorkerProfile[];
  selectedWorker?: CooperativeWorkerProfile | null;
  onSelectWorker?: (worker: CooperativeWorkerProfile | null) => void;
  categories?: { id: string; name: string }[] | { id: string; name: string; [key: string]: any }[];
  workerCategoryFilter?: string;
  setWorkerCategoryFilter?: (trade: string) => void;
  onProceedToCart?: () => void;
  onProceedWithWorker?: (worker: CooperativeWorkerProfile) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onBackToWorks?: () => void;
}

export const AvailableWorkersView: React.FC<AvailableWorkersViewProps> = ({
  workers = [],
  selectedWorker = null,
  onSelectWorker = (_worker: CooperativeWorkerProfile | null) => {},
  categories = [],
  workerCategoryFilter = 'all',
  setWorkerCategoryFilter = (_trade: string) => {},
  onProceedToCart = () => {},
  onProceedWithWorker
}) => {
  const { t } = useApp();

  const handleProceedWorker = (worker: CooperativeWorkerProfile) => {
    if (onProceedWithWorker) {
      onProceedWithWorker(worker);
    } else {
      onSelectWorker(worker);
      onProceedToCart();
    }
  };
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 pb-28">
      {/* Header & Worker Category Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>{t("booking.step2Available") || "2. Who is Available Nearby?"}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t("landing.guaranteedCooperative") || "Verified cooperative members on active duty"} • {t("location.nearbyWorkers") || "GPS distance"}
            </p>
          </div>

          {/* Selected Worker Indicator */}
          {selectedWorker ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shrink-0">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{t("booking.assignedCoopPartner") || "Preferred"}: <strong>{selectedWorker.name}</strong></span>
              <button
                type="button"
                onClick={() => onSelectWorker(null)}
                className="text-slate-400 hover:text-red-500 ml-1 text-xs underline cursor-pointer"
              >
                {t("common.cancel") || "Clear"}
              </button>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1.5 shrink-0">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>{t("booking.expressAutoMatch") || "Express Auto-Match Active"}</span>
            </div>
          )}
        </div>

        {/* Filter Pills for Trades */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setWorkerCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
              workerCategoryFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Trades
          </button>
          {(categories || []).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setWorkerCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer ${
                workerCategoryFilter === cat.id
                  ? 'bg-[#1D68ED] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Match Recommendation Card */}
      <div 
        onClick={() => {
          onSelectWorker(null);
          soundAndSpeech.playChime('click');
        }}
        className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          selectedWorker === null
            ? 'bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-transparent border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-black text-slate-900">
                ⚡ Auto-Match Nearest Available Partner
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                Fastest (15-25 Mins)
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Dispatches the closest top-rated cooperative technician equipped with required diagnostic tools.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              selectedWorker === null
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {selectedWorker === null ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Auto-Match Selected</span>
              </>
            ) : (
              <span>Use Auto-Match</span>
            )}
          </button>
        </div>
      </div>

      {/* Worker Profiles Directory Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-black text-slate-900">
            Available Worker Partners ({(workers || []).length})
          </h3>
          <span className="text-xs text-slate-500">
            Select a specific technician or proceed with Auto-Match
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(workers || []).map((worker) => {
            const isSelected = selectedWorker?.id === worker.id;

            return (
              <div
                key={worker.id}
                className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 bg-white flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md'
                }`}
              >
                {/* Worker Top Profile Row */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    {/* Photo with Online Beacon */}
                    <div className="relative shrink-0">
                      <img
                        src={worker.photo}
                        alt={worker.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Online & Available Now">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-black text-slate-900 truncate">
                          {worker.name}
                        </h4>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-black border border-amber-200 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{worker.rating.toFixed(2)}</span>
                        </span>
                      </div>

                      <div className="text-xs font-bold text-blue-700 mt-0.5 truncate">
                        {worker.tradeLabel}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="font-semibold text-emerald-700">{worker.jobs} Jobs Done</span>
                        <span>•</span>
                        <span>{worker.experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Distance & ETA Badge */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{worker.distanceKm} km away</span>
                    </span>
                    <span className="font-black text-emerald-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{worker.etaMinutes} mins arrival</span>
                    </span>
                  </div>

                  {/* Cooperative Badge & Certification */}
                  <div className="space-y-1.5 text-xs">
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-blue-50/70 border border-blue-200/60 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{worker.badge}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      <strong>Tools:</strong> {worker.tools}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Coop: {worker.cooperativeName} ({worker.coopId})
                    </div>
                  </div>
                </div>

                {/* Starting Price & Select Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">
                      Starts ₹{worker.rateStarting}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      0% Middleman Cut
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectWorker(isSelected ? null : worker);
                        soundAndSpeech.playChime('click');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleProceedWorker(worker)}
                      className="px-3 py-1.5 rounded-xl bg-[#1D68ED] hover:bg-blue-700 text-white text-xs font-black transition cursor-pointer flex items-center gap-1 shadow-xs"
                      title="Select this worker and proceed directly to cart"
                    >
                      <span>Book &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
