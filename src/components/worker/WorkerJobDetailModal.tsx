import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  Volume2, 
  Users, 
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { WorkerJobOpening } from '../../data/workerJobData';
import { WorkerJobEligibilityResult } from '../../types/workerSkillRegistry';

interface WorkerJobDetailModalProps {
  job: WorkerJobOpening | null;
  eligibility?: WorkerJobEligibilityResult | null;
  isOpen: boolean;
  onClose: () => void;
  onAcceptJob: (job: WorkerJobOpening) => void;
  onListen: (job: WorkerJobOpening) => void;
}

export const WorkerJobDetailModal: React.FC<WorkerJobDetailModalProps> = ({
  job,
  eligibility,
  isOpen,
  onClose,
  onAcceptJob,
  onListen
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gray-50 px-5 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-sm">
              {job.tradeIcon}
            </div>
            <div>
              <div className="text-xs font-black uppercase text-blue-600 tracking-wide">
                {job.serviceName} • {job.workerTierLabel}
              </div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                {job.specificTask}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-200/80 hover:bg-gray-300 text-gray-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Transparent Earnings Breakdown (Section 10) */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                Transparent Earnings Breakdown
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                0% Exploitative Cut
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100">
                <div className="text-[11px] text-gray-500 font-semibold">Customer Pays</div>
                <div className="text-base sm:text-lg font-black text-gray-800 mt-0.5">₹{job.customerPrice}</div>
              </div>
              <div className="bg-emerald-600 text-white rounded-xl p-2.5 shadow-sm">
                <div className="text-[11px] text-emerald-100 font-semibold">You Will Receive</div>
                <div className="text-lg sm:text-xl font-black mt-0.5">₹{job.workerExpectedEarning}</div>
              </div>
              <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100">
                <div className="text-[11px] text-gray-500 font-semibold">Co-op Welfare</div>
                <div className="text-base sm:text-lg font-black text-gray-700 mt-0.5">₹{job.cooperativeContribution}</div>
              </div>
            </div>

            <p className="text-[11px] text-emerald-800 leading-tight">
              Cooperative welfare contribution goes 100% to your accident insurance (PMSBY), pension fund, and safety gear.
              <span className="block mt-1 font-semibold text-emerald-900">
                *Final amount may change if extra spare parts or materials are approved by customer.
              </span>
            </p>
          </div>

          {/* Location & Time Info */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2.5">
            <div className="text-xs font-black uppercase tracking-wider text-gray-500">
              Work Location & Time
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-black text-gray-800">{job.serviceArea}</div>
                  <div className="text-gray-500 font-medium">{job.distanceKm} km from your current area</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-black text-gray-800">{job.scheduledDate} • {job.startTime}</div>
                  <div className="text-gray-500 font-medium">Estimated Duration: {job.estimatedDuration}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 text-xs text-gray-600">
              <span className="font-bold text-gray-700">Approximate Landmark:</span> Near {job.serviceArea.split(',')[0]}
              <p className="text-[11px] text-gray-500 mt-0.5">
                Exact street number and building are shown immediately upon accepting the job to safeguard customer privacy.
              </p>
            </div>
          </div>

          {/* Description & Tools */}
          <div className="space-y-3">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Job Description</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200 leading-relaxed">
                {job.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
                  <Wrench className="w-3.5 h-3.5 text-teal-600" />
                  <span>Tools Needed:</span>
                </div>
                <div className="text-gray-600">{job.toolsRequired}</div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-800 flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Materials on Site:</span>
                </div>
                <div className="text-gray-600">{job.materialsProvided}</div>
              </div>
            </div>
          </div>

          {/* Why This Job Matches You (Section 37: Job Fairness & Skill Matching) */}
          <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                <span>🎯</span>
                <span>Why this job was offered to you (Cooperative Fair Matching)</span>
              </div>
              {eligibility && (
                <span className="text-[11px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {eligibility.suitabilityScore}% Match
                </span>
              )}
            </div>

            <ul className="space-y-1 text-xs text-blue-950 font-medium">
              {(eligibility?.reasons && eligibility.reasons.length > 0 
                ? eligibility.reasons 
                : job.matchReasons
              ).map((reason, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="bg-gray-50 px-5 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-3">
          {/* Audio read aloud */}
          <button
            type="button"
            onClick={() => onListen(job)}
            className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-xl font-bold text-xs border border-gray-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span>Listen Details</span>
          </button>

          {/* Decline / Go Back */}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-xl font-bold text-xs sm:text-sm border border-gray-300 transition cursor-pointer"
          >
            Go Back
          </button>

          {/* Accept Job */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onAcceptJob(job);
            }}
            className="flex-1 w-full py-3 sm:py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm sm:text-base transition cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Accept Job (₹{job.workerExpectedEarning})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
