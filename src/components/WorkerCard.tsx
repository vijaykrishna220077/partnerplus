import React, { useState } from 'react';
import { Worker } from '../types';
import { useApp } from '../context/AppContext';
import { matchingService } from '../services/matchingService';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Award, 
  Building2, 
  CheckCircle, 
  Zap, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
  compact?: boolean;
  matchScore?: number;
  matchReasons?: string[];
  scoreBreakdown?: {
    skillScore: number;
    distanceScore: number;
    ratingScore: number;
    experienceScore: number;
    availabilityScore: number;
    emergencyScore: number;
    workloadScore: number;
  };
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ 
  worker, 
  compact = false,
  matchScore: explicitMatchScore,
  matchReasons: explicitMatchReasons,
  scoreBreakdown: explicitScoreBreakdown
}) => {
  const { t, openWorkerProfile, openBooking, currentLocation } = useApp();
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  // Compute AI Match Score dynamically if not passed explicitly
  const computedMatch = React.useMemo(() => {
    if (explicitMatchScore !== undefined) {
      return {
        matchScore: explicitMatchScore,
        reasons: explicitMatchReasons || ['Primary trade expert', 'Available in area'],
        scoreBreakdown: explicitScoreBreakdown || {
          skillScore: 30,
          distanceScore: 30,
          ratingScore: 15,
          experienceScore: 10,
          availabilityScore: 15,
          emergencyScore: 5,
          workloadScore: 8
        }
      };
    }

    const rankRes = matchingService.rankWorkers({
      category: worker.primarySkill,
      customerArea: currentLocation,
      isEmergency: worker.isEmergencyReady
    });
    const found = rankRes.find(r => r.worker.id === worker.id);
    return found || {
      matchScore: Math.round(85 + (worker.rating - 4) * 10 + (worker.isAvailableToday ? 5 : 0)),
      reasons: [
        `Primary expert in ${worker.primarySkillLabel}`,
        `Within ${worker.distanceKm || 1.8} km distance`,
        `Top rated ${worker.rating} ★`
      ],
      scoreBreakdown: {
        skillScore: 30,
        distanceScore: Math.max(10, 35 - Math.round((worker.distanceKm || 2) * 5)),
        ratingScore: Math.round((worker.rating / 5) * 15),
        experienceScore: Math.min(10, worker.experienceYears),
        availabilityScore: worker.isAvailableToday ? 15 : 0,
        emergencyScore: worker.isEmergencyReady ? 10 : 0,
        workloadScore: 8
      }
    };
  }, [explicitMatchScore, explicitMatchReasons, explicitScoreBreakdown, worker, currentLocation]);

  const score = computedMatch.matchScore;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group relative">
      
      {/* AI Match Score Badge (Top Right Pill) */}
      <div className="px-6 pt-5 pb-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-200/80 rounded-full font-black text-xs shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{score}% AI Match Score</span>
        </div>

        <button
          type="button"
          onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition"
          title="View AI Matching Breakdown"
        >
          <Sliders className="w-3 h-3 text-blue-600" />
          <span>Breakdown</span>
          {showScoreBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      <div className="p-6 pt-3 space-y-4">
        {/* Top Header: Avatar + Info */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={worker.photoUrl}
              alt={worker.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-gray-100 group-hover:scale-105 transition-transform duration-200 bg-gray-100"
            />
            {worker.isVerified && (
              <div 
                className="absolute -bottom-1.5 -right-1.5 bg-blue-600 text-white p-1 rounded-full border-2 border-white shadow-xs"
                title="Verified by Labour Cooperative"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-extrabold text-[#121212] text-base leading-tight truncate font-sans">
                {worker.name}
              </h3>
              {worker.isVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                  <CheckCircle className="w-3 h-3" />
                  {t("common.verified")}
                </span>
              )}
            </div>

            {/* Subheader summary line matching user example: 1.8 km • Electrician • 4.8 ⭐ • Available now */}
            <p className="text-xs font-medium text-slate-600 mt-1 truncate">
              <span className="font-bold text-blue-600">{worker.distanceKm} km</span> •{' '}
              <span className="font-bold text-slate-900">{t("jobs." + worker.primarySkill + "Job") || worker.primarySkillLabel}</span> •{' '}
              <span className="font-bold text-amber-600">{worker.rating} ⭐</span> •{' '}
              <span className={`font-bold ${worker.isAvailableToday ? 'text-emerald-600' : 'text-slate-500'}`}>
                {worker.isAvailableToday ? 'Available now' : 'Offline'}
              </span>
            </p>

            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
              <Building2 className="w-3.5 h-3.5 shrink-0 text-gray-400" />
              <span className="truncate text-[11px] font-light" title={worker.cooperativeName}>
                {worker.cooperativeName}
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible AI Match Score Factor Breakdown */}
        {showScoreBreakdown && (
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">AI Algorithm Factors</span>
              <span className="font-black text-emerald-700">{score}% Score</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">📍 Proximity ({worker.distanceKm} km):</span>
                <span className="font-bold text-slate-900">+{computedMatch.scoreBreakdown.distanceScore} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">🛠️ Skill Match:</span>
                <span className="font-bold text-slate-900">+{computedMatch.scoreBreakdown.skillScore} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">⭐ Rating ({worker.rating}):</span>
                <span className="font-bold text-slate-900">+{computedMatch.scoreBreakdown.ratingScore} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">🕐 Availability:</span>
                <span className="font-bold text-slate-900">+{computedMatch.scoreBreakdown.availabilityScore} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">💰 Rate ({worker.startingPrice}):</span>
                <span className="font-bold text-emerald-700">Co-op Standard</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">🚨 Emergency Priority:</span>
                <span className="font-bold text-slate-900">+{computedMatch.scoreBreakdown.emergencyScore} pts</span>
              </div>
            </div>

            {computedMatch.reasons && computedMatch.reasons.length > 0 && (
              <div className="pt-1.5 border-t border-slate-200 text-[10px] text-slate-600 space-y-0.5">
                {computedMatch.reasons.map((r, i) => (
                  <p key={i} className="flex items-center gap-1 font-medium text-emerald-800">
                    <span>✓</span> <span>{r}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Row: Rating, Distance, Experience */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
          <div className="bg-gray-50 rounded-2xl p-2">
            <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{worker.rating}</span>
            </div>
            <span className="text-[10px] text-gray-500 block leading-tight mt-0.5 font-light">
              {worker.jobsCompleted} {t("cooperative.jobs")}
            </span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-2">
            <div className="flex items-center justify-center gap-1 text-gray-800 font-bold text-xs">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{worker.distanceKm} {t("common.km")}</span>
            </div>
            <span className="text-[10px] text-gray-500 block leading-tight mt-0.5 truncate font-light">
              {worker.locationArea}
            </span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-2">
            <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold text-xs">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{worker.experienceYears} {t("jobs.duration") || "yrs exp"}</span>
            </div>
            <span className="text-[10px] text-gray-500 block leading-tight mt-0.5 font-light">
              {t("common.verified")}
            </span>
          </div>
        </div>

        {/* Availability & Emergency Badges */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {worker.isAvailableToday ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t("worker.available")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              {t("worker.offline")}
            </span>
          )}

          {worker.isEmergencyReady && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
              <Zap className="w-3 h-3 text-red-600" />
              {t("common.emergency")}
            </span>
          )}
        </div>

        {/* NSDC / ITI Certificate Highlight */}
        {worker.certifications && worker.certifications.length > 0 && !compact && (
          <p className="text-[11px] text-gray-600 truncate bg-amber-50/70 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-200/60 font-medium">
            ✓ {worker.certifications[0].title}
          </p>
        )}
      </div>

      {/* Footer: Price + Action Buttons */}
      <div className="bg-gray-50/90 px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block leading-none">
            {t("booking.baseLabourCharge")}
          </span>
          <span className="text-base font-black text-[#121212]">
            ₹{worker.startingPrice}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openWorkerProfile(worker)}
            className="px-3.5 py-2 rounded-full border border-gray-300 hover:border-black hover:bg-white text-gray-800 text-xs font-semibold transition cursor-pointer"
          >
            {t("common.viewDetails")}
          </button>
          <button
            onClick={() => openBooking(worker)}
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-blue-200 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{t("booking.bookNow")}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

