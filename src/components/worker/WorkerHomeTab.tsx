import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Zap, 
  Wrench, 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  Filter,
  Users,
  AlertCircle
} from 'lucide-react';
import { WorkerJobOpening } from '../../data/workerJobData';
import { WorkerJobCard } from './WorkerJobCard';
import { StructuredWorkerProfile, WorkerJobEligibilityResult } from '../../types/workerSkillRegistry';
import { STRUCTURED_WORKER_PROFILES } from '../../data/structuredWorkersData';

interface WorkerHomeTabProps {
  jobs: WorkerJobOpening[];
  isOnline: boolean;
  isEmergencyReady: boolean;
  dailyEarnings: number;
  completedCount: number;
  activeJob: WorkerJobOpening | null;
  activeWorker?: StructuredWorkerProfile;
  eligibilityMap?: Map<string, WorkerJobEligibilityResult>;
  onSwitchWorker?: (worker: StructuredWorkerProfile) => void;
  onViewJob: (job: WorkerJobOpening) => void;
  onAcceptJob: (job: WorkerJobOpening) => void;
  onListenJob: (job: WorkerJobOpening) => void;
  onOpenActiveJob: () => void;
  onGoToEarnings: () => void;
  onToggleDuty: () => void;
}

export type JobFilterType = 'all' | 'nearby' | 'today' | 'emergency' | 'skilled' | 'general';

export const WorkerHomeTab: React.FC<WorkerHomeTabProps> = ({
  jobs,
  isOnline,
  isEmergencyReady,
  dailyEarnings,
  completedCount,
  activeJob,
  activeWorker,
  eligibilityMap,
  onSwitchWorker,
  onViewJob,
  onAcceptJob,
  onListenJob,
  onOpenActiveJob,
  onGoToEarnings,
  onToggleDuty
}) => {
  const [activeFilter, setActiveFilter] = useState<JobFilterType>('all');

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    if (activeFilter === 'nearby') return job.distanceKm <= 2.5;
    if (activeFilter === 'today') return job.scheduledDate.toLowerCase().includes('today');
    if (activeFilter === 'emergency') return job.urgency === 'emergency';
    if (activeFilter === 'skilled') return job.workerTier === 'skilled';
    if (activeFilter === 'general') return job.workerTier === 'general' || job.workerTier === 'semi_skilled';
    return true;
  });

  const emergencyJobs = jobs.filter(j => j.urgency === 'emergency');
  const multiWorkerJobs = jobs.filter(j => j.workersRequired > 1);

  return (
    <div className="space-y-6">
      {/* 1. Availability Status Banner */}
      {!isOnline ? (
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-2xl">
              ⚪
            </div>
            <div>
              <div className="text-sm font-black uppercase text-gray-400 tracking-wide">
                You Are Currently Offline
              </div>
              <div className="text-base sm:text-lg font-bold text-white">
                New nearby job offers are currently paused.
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Turn your status ON to receive instant work calls in your area.
              </p>
            </div>
          </div>

          <button
            onClick={onToggleDuty}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm rounded-2xl transition cursor-pointer active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Go Online Now
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-100">
                You Are Available For Work
              </div>
              <div className="text-xs sm:text-sm font-bold text-white">
                Nearby jobs are appearing in real-time. Audio alert enabled.
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-white">
              🟢 Live Duty
            </span>
          </div>
        </div>
      )}

      {/* 2. Today's Earnings Snippet (Section 4) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>Today's Work Summary</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black text-gray-900">
              ₹{dailyEarnings}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {completedCount} jobs completed today
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Approx. ₹480+ more available in pending jobs nearby
          </p>
        </div>

        <button
          onClick={onGoToEarnings}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer border border-gray-300 active:scale-95"
        >
          <span>View Earnings & Passbook</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
        </button>
      </div>

      {/* 3. Active Job Quick Jump Banner (If Worker Accepted a Job) */}
      {activeJob && (
        <div 
          onClick={onOpenActiveJob}
          className="bg-blue-50 border-2 border-blue-500 rounded-3xl p-4 sm:p-5 shadow-md flex items-center justify-between gap-3 cursor-pointer hover:bg-blue-100/70 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-xs">
              {activeJob.tradeIcon}
            </div>
            <div>
              <div className="text-[11px] font-black uppercase text-blue-700 tracking-wide flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>My Active Job (In Progress)</span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-gray-900">
                {activeJob.specificTask} • {activeJob.serviceArea}
              </h4>
              <p className="text-xs text-gray-600">
                You will receive ₹{activeJob.workerExpectedEarning} cash on completion
              </p>
            </div>
          </div>

          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-xs transition shadow-sm hover:bg-blue-700 shrink-0"
          >
            Open Active Job
          </button>
        </div>
      )}

      {/* 4. EMERGENCY JOBS SECTION (If Any Emergency Job is Available) */}
      {emergencyJobs.length > 0 && isEmergencyReady && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <h3 className="text-base sm:text-lg font-black text-red-700 uppercase tracking-wide">
                🚨 Emergency Jobs Near You
              </h3>
            </div>
            <span className="text-xs text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded-full">
              Higher Payout • Urgent Arrival
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {emergencyJobs.map((emgJob) => (
              <WorkerJobCard
                key={emgJob.id}
                job={emgJob}
                eligibility={eligibilityMap?.get(emgJob.id)}
                onViewJob={onViewJob}
                onAcceptJob={onAcceptJob}
                onListen={onListenJob}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. JOB FILTERS BAR & SKILL PROFILE CONTEXT */}
      <div className="space-y-3 pt-1">
        {activeWorker && (
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-blue-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl shrink-0">
                {activeWorker.worker_type === 'skilled' ? '⚡' : activeWorker.worker_type === 'semi_skilled' ? '🔧' : '📦'}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-gray-900">{activeWorker.name}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    activeWorker.worker_type === 'skilled' 
                      ? 'bg-blue-100 text-blue-800' 
                      : activeWorker.worker_type === 'semi_skilled'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {activeWorker.worker_type === 'skilled' ? 'Skilled Worker' : activeWorker.worker_type === 'semi_skilled' ? 'Semi-Skilled' : 'General Worker'}
                  </span>
                  <span className="text-[11px] font-bold text-gray-600">
                    • {activeWorker.primary_skill_label} ({activeWorker.experience_years}y exp)
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Showing jobs verified for your trade &amp; {activeWorker.service_radius_km} km cooperative service radius.
                </p>
              </div>
            </div>

            {onSwitchWorker && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-gray-500 hidden sm:inline">Switch Persona:</span>
                <select
                  value={activeWorker.id}
                  onChange={(e) => {
                    const found = STRUCTURED_WORKER_PROFILES.find((p) => p.id === e.target.value);
                    if (found) onSwitchWorker(found);
                  }}
                  className="text-xs font-bold bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-xl px-2.5 py-1.5 text-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STRUCTURED_WORKER_PROFILES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.worker_type === 'skilled' ? 'Skilled' : p.worker_type === 'semi_skilled' ? 'Semi-Skilled' : 'General'} • {p.primary_skill_label})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-gray-900">
              Jobs Near You
            </h2>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {filteredJobs.length} Available
            </span>
          </div>

          <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
            Tap cards to see details or accept
          </span>
        </div>

        {/* Large Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Work ({jobs.length})
          </button>

          <button
            onClick={() => setActiveFilter('nearby')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'nearby'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            📍 Within 2.5 km
          </button>

          <button
            onClick={() => setActiveFilter('today')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'today'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            🕐 Today Only
          </button>

          <button
            onClick={() => setActiveFilter('emergency')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'emergency'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            ⚡ Emergency
          </button>

          <button
            onClick={() => setActiveFilter('skilled')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'skilled'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            🔧 Skilled Trades
          </button>

          <button
            onClick={() => setActiveFilter('general')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
              activeFilter === 'general'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            📦 General / Daily-Wage
          </button>
        </div>
      </div>

      {/* 6. REAL-TIME JOB LIST (Section 5, 8, 11) */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 space-y-3">
          <div className="text-4xl">☕</div>
          <div className="text-base sm:text-lg font-bold text-gray-800">
            No Jobs In This Category Right Now
          </div>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Keep your availability ON. As soon as a matching customer request is made nearby, your phone will ring with an audio alert.
          </p>
          <button
            onClick={() => setActiveFilter('all')}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            Show All Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <WorkerJobCard
              key={job.id}
              job={job}
              eligibility={eligibilityMap?.get(job.id)}
              onViewJob={onViewJob}
              onAcceptJob={onAcceptJob}
              onListen={onListenJob}
            />
          ))}
        </div>
      )}

      {/* 7. Cooperative Member Welfare Protection Card */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shrink-0">
            🛡️
          </div>
          <div>
            <div className="text-sm font-black text-gray-900">
              Cooperative Fair Wage & Welfare Guarantee
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              100% of the customer payment minus transparent welfare contribution reaches you. Covered by PMSBY ₹2,00,000 accident insurance.
            </p>
          </div>
        </div>

        <a
          href="tel:1800123456"
          className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-gray-50 text-emerald-800 border border-emerald-300 font-extrabold text-xs rounded-xl text-center shrink-0 cursor-pointer shadow-2xs"
        >
          Co-op Helpline: 1800-SAHAKARI
        </a>
      </div>
    </div>
  );
};
