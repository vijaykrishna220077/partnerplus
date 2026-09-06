import React from 'react';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Users, 
  Zap, 
  Volume2, 
  Wrench, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { WorkerJobOpening } from '../../data/workerJobData';
import { WorkerJobEligibilityResult } from '../../types/workerSkillRegistry';

interface WorkerJobCardProps {
  job: WorkerJobOpening;
  eligibility?: WorkerJobEligibilityResult;
  onViewJob: (job: WorkerJobOpening) => void;
  onAcceptJob: (job: WorkerJobOpening) => void;
  onListen: (job: WorkerJobOpening) => void;
}

export const WorkerJobCard: React.FC<WorkerJobCardProps> = ({
  job,
  eligibility,
  onViewJob,
  onAcceptJob,
  onListen
}) => {
  const isEmergency = job.urgency === 'emergency';
  const isMultiWorker = job.workersRequired > 1;
  const spotsLeft = job.workersRequired - job.workersAssigned;

  return (
    <div 
      className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-200 border-2 shadow-xs hover:shadow-md ${
        isEmergency 
          ? 'bg-red-50/50 border-red-300 ring-2 ring-red-100' 
          : 'bg-white border-gray-200 hover:border-blue-400'
      }`}
    >
      {/* Top Meta Line: Badges & Audio Voice Button */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Urgency Badge */}
          {isEmergency && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white animate-pulse">
              <Zap className="w-3 h-3 fill-white" />
              <span>EMERGENCY</span>
            </span>
          )}

          {/* Tier Badge */}
          <span 
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${
              job.workerTier === 'skilled'
                ? 'bg-blue-100 text-blue-800'
                : job.workerTier === 'semi_skilled'
                ? 'bg-teal-100 text-teal-800'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {job.workerTierLabel}
          </span>

          {/* Multi-worker badge */}
          {isMultiWorker && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
              <Users className="w-3 h-3" />
              <span>{job.workersAssigned}/{job.workersRequired} Assigned ({spotsLeft} more needed)</span>
            </span>
          )}

          {/* Verified Customer */}
          {job.isCustomerVerified && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Customer</span>
            </span>
          )}

          {/* Match Score */}
          {eligibility && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{eligibility.suitabilityScore}% Match</span>
            </span>
          )}
        </div>

        {/* Listen Voice Button */}
        <button
          type="button"
          onClick={() => onListen(job)}
          className="px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-gray-200 active:scale-95 shrink-0"
          title="Listen in your language"
        >
          <Volume2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px]">Listen</span>
        </button>
      </div>

      {/* Main Row: Trade Icon, Job Title, and Earnings Box */}
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl sm:text-3xl shrink-0">
            {job.tradeIcon}
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
              {job.serviceName}
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
              {job.specificTask}
            </h3>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {job.description}
            </p>
          </div>
        </div>

        {/* Prominent Earnings Box */}
        <div className="text-right shrink-0 bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
            You May Earn
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 leading-none mt-0.5">
            ₹{job.workerExpectedEarning}
          </div>
          <div className="text-[10px] text-gray-500 font-medium mt-1">
            Customer: ₹{job.customerPrice}
          </div>
        </div>
      </div>

      {/* Scannable Grid: Location, Distance, Schedule, Duration */}
      <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 rounded-xl p-2.5 sm:p-3 text-xs font-semibold text-gray-700 border border-gray-100">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate">{job.serviceArea}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
          <span>{job.distanceKm} km away</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{job.scheduledDate} • {job.startTime}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>About {job.estimatedDuration}</span>
        </div>
      </div>

      {/* Skill requirements & Fair Matching summary */}
      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
        {job.requiredSkills && job.requiredSkills.slice(0, 2).map((skill, idx) => (
          <span key={idx} className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200">
            🔧 {skill}
          </span>
        ))}
        {job.experienceRequired && (
          <span className="text-[11px] font-semibold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
            ⏳ {job.experienceRequired}
          </span>
        )}
        {eligibility && eligibility.reasons.length > 0 && (
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 truncate max-w-full">
            ✓ {eligibility.reasons[0]}
          </span>
        )}
      </div>

      {/* Extra Perks (Food, Travel Support, Expiry) */}
      {(job.foodProvided || job.travelSupportAmount || job.expiresInMinutes) && (
        <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[11px] font-semibold text-gray-600">
          {job.foodProvided && (
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
              🍲 Food Provided: Yes
            </span>
          )}
          {job.travelSupportAmount && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
              🛵 Travel Support: ₹{job.travelSupportAmount}
            </span>
          )}
          {job.expiresInMinutes && (
            <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-md border border-red-200 animate-pulse font-bold">
              ⏱ Respond within {job.expiresInMinutes} mins
            </span>
          )}
        </div>
      )}

      {/* Primary Action Buttons: View Job & Accept Job */}
      <div className="mt-4 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onViewJob(job)}
          className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer border border-gray-300 text-center active:scale-98"
        >
          View Job Details
        </button>

        <button
          type="button"
          onClick={() => onAcceptJob(job)}
          className="flex-1 py-2.5 sm:py-3 px-4 sm:px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs sm:text-sm transition cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 active:scale-98"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Accept Job</span>
        </button>
      </div>
    </div>
  );
};
