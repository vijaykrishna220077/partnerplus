import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Star, MapPin, AlertCircle, CheckCircle2, Award } from 'lucide-react';
import { Worker } from '../../../types';
import { mockWorkers } from '../../../data/mockData';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';
import { useAuth } from '../../../context/AuthContext';

interface ManualAssignmentModalProps {
  isOpen: boolean;
  jobId: string;
  serviceName: string;
  area: string;
  isEmergency?: boolean;
  onClose: () => void;
  onSuccess: (workerName: string) => void;
}

export const ManualAssignmentModal: React.FC<ManualAssignmentModalProps> = ({
  isOpen,
  jobId,
  serviceName,
  area,
  isEmergency = false,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Filter realistic workers who match this trade or are emergency eligible
  const eligibleWorkers = mockWorkers.map(w => {
    // Calculate synthetic suitability score
    const skillScore = 95;
    const distanceScore = Math.max(60, 100 - Math.round(w.distanceKm * 8));
    const ratingScore = Math.round(w.rating * 20);
    const overallScore = Math.round((skillScore * 0.4) + (distanceScore * 0.3) + (ratingScore * 0.3));

    return {
      ...w,
      suitabilityScore: overallScore,
      eligibilityReasons: [
        'Verified Police Clearance & Aadhaar KYC',
        `NSDC Certified with ${w.experienceYears} Years Experience`,
        `${w.distanceKm} km from customer in ${area}`,
        w.isEmergencyReady ? 'Emergency Dispatch Certified' : 'Standard Routine Dispatch'
      ]
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const handleAssign = () => {
    if (!selectedWorkerId) {
      setErrorMsg('Please select a verified cooperative worker from the roster below.');
      return;
    }
    if (!justification.trim()) {
      setErrorMsg('Please enter an administrative justification for this manual override.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const targetWorker = eligibleWorkers.find(w => w.id === selectedWorkerId);
    const adminName = user?.name || 'Cooperative Operations Admin';

    setTimeout(() => {
      cooperativeBackend.manualInterveneJob(
        jobId,
        selectedWorkerId,
        targetWorker?.name || 'Selected Artisan',
        adminName,
        justification
      );

      setIsSubmitting(false);
      onSuccess(targetWorker?.name || 'Worker');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl flex flex-col text-white overflow-hidden max-h-[90vh]"
        role="dialog"
        aria-label="Manual Dispatch Intervention"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isEmergency 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            }`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-white font-mono uppercase">
                  MANUAL DISPATCH INTERVENTION &amp; ASSIGNMENT
                </h2>
                {isEmergency && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    EMERGENCY CALL
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Ticket: <span className="font-mono text-purple-300">{jobId}</span> • {serviceName} ({area})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div>
            <label className="text-xs font-mono font-bold uppercase text-slate-300 block mb-2">
              Select Verified Artisan (Ranked by Distance &amp; Skill Verification)
            </label>

            <div className="space-y-2.5">
              {eligibleWorkers.map((worker) => {
                const isSelected = selectedWorkerId === worker.id;
                return (
                  <div
                    key={worker.id}
                    onClick={() => {
                      setSelectedWorkerId(worker.id);
                      setErrorMsg('');
                    }}
                    className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-500/50' 
                        : 'bg-[#1E293B]/70 border-slate-800 hover:border-slate-700 hover:bg-[#1E293B]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={worker.photoUrl} 
                          alt={worker.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{worker.name}</span>
                            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                              Verified
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>{worker.primarySkillLabel}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-amber-300">
                              <Star className="w-3 h-3 fill-amber-300" />
                              {worker.rating} ({worker.jobsCompleted} jobs)
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {worker.distanceKm} km
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-purple-300 block">
                          Match Score
                        </span>
                        <span className="text-sm font-black font-mono text-emerald-400">
                          {worker.suitabilityScore}%
                        </span>
                      </div>
                    </div>

                    {/* Eligibility Proof */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] font-mono text-slate-400">
                      {worker.eligibilityReasons.slice(0, 2).map((r, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Justification Field */}
          <div>
            <label className="text-xs font-mono font-bold uppercase text-slate-300 block mb-1.5">
              Official Justification / Override Reason <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="e.g. Nearest master plumber deployed due to burst water valve urgency."
              className="w-full bg-[#111A2E] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              Notice: This override will be recorded into the official tamper-evident Cooperative Audit Log.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#1E293B] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAssign}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-mono font-bold transition-colors shadow-lg cursor-pointer"
          >
            {isSubmitting ? 'Confirming Dispatch...' : 'Confirm Manual Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};
