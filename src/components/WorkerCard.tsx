import React from 'react';
import { Worker } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Award, 
  Building2, 
  CheckCircle, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
  compact?: boolean;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, compact = false }) => {
  const { t, openWorkerProfile, openBooking } = useApp();

  return (
    <div className="bg-white rounded-3xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-6 space-y-4">
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
              <h3 className="font-bold text-[#121212] text-base leading-tight truncate font-sans">
                {worker.name}
              </h3>
              {worker.isVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-blue-600 mt-1">
              {worker.primarySkillLabel}
            </p>

            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
              <Building2 className="w-3.5 h-3.5 shrink-0 text-gray-400" />
              <span className="truncate text-[11px] font-light" title={worker.cooperativeName}>
                {worker.cooperativeName}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row: Rating, Distance, Experience */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
          <div className="bg-gray-50 rounded-2xl p-2">
            <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{worker.rating}</span>
            </div>
            <span className="text-[10px] text-gray-500 block leading-tight mt-0.5 font-light">
              {worker.jobsCompleted} Jobs
            </span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-2">
            <div className="flex items-center justify-center gap-1 text-gray-800 font-bold text-xs">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{worker.distanceKm} km</span>
            </div>
            <span className="text-[10px] text-gray-500 block leading-tight mt-0.5 truncate font-light">
              {worker.locationArea}
            </span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-2">
            <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold text-xs">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{worker.experienceYears}y exp</span>
            </div>
            <span className="text-[10px] text-gray-500 block leading-tight mt-0.5 font-light">
              Certified
            </span>
          </div>
        </div>

        {/* Availability & Emergency Badges */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {worker.isAvailableToday ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.availableToday}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              Tomorrow Slot
            </span>
          )}

          {worker.isEmergencyReady && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
              <Zap className="w-3 h-3 text-red-600" />
              15-Min Ready
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
            Starts At
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
            Profile
          </button>
          <button
            onClick={() => openBooking(worker)}
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-blue-200 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{t.bookNow}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
