import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  Star, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Flame, 
  X, 
  AlertTriangle,
  Award,
  Radio,
  Eye,
  Send,
  Ban
} from 'lucide-react';
import { Worker } from '../../../types';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';
import { useAuth } from '../../../context/AuthContext';

interface WorkersTabProps {
  workers: Worker[];
  onOpenWorkerProfile?: (worker: Worker) => void;
}

export const WorkersTab: React.FC<WorkersTabProps> = ({ workers }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('ALL');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [workerList, setWorkerList] = useState<Worker[]>(workers);

  const filtered = workerList.filter(w => {
    const matchesSearch = 
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.primarySkillLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterAvailability === 'AVAILABLE') return matchesSearch && w.isAvailableToday;
    if (filterAvailability === 'EMERGENCY') return matchesSearch && w.isEmergencyReady;
    if (filterAvailability === 'VERIFIED') return matchesSearch && w.verificationStatus === 'verified';
    if (filterAvailability === 'UNDER_REVIEW') return matchesSearch && w.verificationStatus === 'under_review';
    return matchesSearch;
  });

  const handleToggleEmergency = (worker: Worker) => {
    const updated = !worker.isEmergencyReady;
    setWorkerList(prev => prev.map(w => w.id === worker.id ? { ...w, isEmergencyReady: updated } : w));
    
    cooperativeBackend.addAuditLog({
      adminId: user?.id || 'admin-1',
      adminName: user?.name || 'Cooperative Admin',
      adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
      action: 'WORKER_EMERGENCY_STATUS_UPDATED',
      affectedEntity: 'WORKER',
      entityId: worker.id,
      previousState: worker.isEmergencyReady ? 'Emergency Certified' : 'Standard Routine',
      newState: updated ? 'Emergency Certified' : 'Standard Routine',
      reason: `Operational roster certification adjusted for ${worker.name}.`
    });
  };

  const handleToggleSuspension = (worker: Worker) => {
    const isSuspending = worker.verificationStatus !== 'rejected';
    const reason = window.prompt(`Enter administrative reason for ${isSuspending ? 'suspending' : 'reactivating'} ${worker.name}:`);
    if (reason && reason.trim()) {
      const newStatus = isSuspending ? 'rejected' : 'verified';
      setWorkerList(prev => prev.map(w => w.id === worker.id ? { ...w, verificationStatus: newStatus as any } : w));
      
      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: isSuspending ? 'WORKER_SUSPENDED' : 'WORKER_REACTIVATED',
        affectedEntity: 'WORKER',
        entityId: worker.id,
        previousState: worker.verificationStatus,
        newState: newStatus,
        reason: reason.trim()
      });
      alert(`Worker ${worker.name} status updated to ${newStatus}. Action recorded in immutable audit ledger.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header & Filter Controls */}
      <div className="p-5 bg-[#111A2E] rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
              COOPERATIVE ARTISAN &amp; WORKFORCE DIRECTORY
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified union member records, skill accreditations, police clearance, and emergency readiness flags.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {filtered.length} Artisans Listed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by artisan name, trade, mobile, or member ID..."
              className="w-full bg-[#0F172A] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="bg-[#0F172A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
          >
            <option value="ALL">All Artisans ({workerList.length})</option>
            <option value="AVAILABLE">Available Online</option>
            <option value="EMERGENCY">Emergency Dispatch Certified</option>
            <option value="VERIFIED">100% Vetted</option>
            <option value="UNDER_REVIEW">Awaiting Verification</option>
          </select>
        </div>
      </div>

      {/* Workers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((worker) => {
          const isSuspended = worker.verificationStatus === 'rejected';

          return (
            <div 
              key={worker.id}
              className={`p-4 rounded-3xl border bg-[#111A2E] text-white flex flex-col justify-between space-y-3 transition-all ${
                isSuspended ? 'border-rose-900/80 opacity-75' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={worker.photoUrl} 
                      alt={worker.name} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-sm">{worker.name}</span>
                        {worker.isEmergencyReady && (
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                            EMG
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-purple-400 block mt-0.5">
                        {worker.primarySkillLabel} • {worker.experienceYears} yrs exp
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    worker.isAvailableToday 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {worker.isAvailableToday ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-mono p-2.5 rounded-xl bg-[#0C1322] border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Rating</span>
                    <span className="font-bold text-amber-300 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-300" />
                      {worker.rating}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Jobs Done</span>
                    <span className="font-bold text-white">{worker.jobsCompleted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Earnings Share</span>
                    <span className="font-bold text-emerald-400">95%</span>
                  </div>
                </div>

                {/* Vetting Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Aadhaar KYC
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-purple-400" /> Police Clearance
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <Award className="w-3 h-3 text-sky-400" /> NSDC Trade Certified
                  </span>
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setSelectedWorker(worker)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer text-[11px]"
                >
                  Dossier
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleEmergency(worker)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      worker.isEmergencyReady 
                        ? 'bg-rose-950 text-rose-300 border-rose-800' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Toggle Emergency Dispatch Readiness"
                  >
                    {worker.isEmergencyReady ? 'EMG Ready' : 'Make EMG'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleSuspension(worker)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      isSuspended
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950/60 text-rose-400 border-rose-800'
                    }`}
                    title={isSuspended ? 'Reactivate Worker' : 'Suspend Worker Account'}
                  >
                    {isSuspended ? 'Reactivate' : 'Suspend'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Worker Full Dossier Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedWorker.photoUrl} 
                  alt={selectedWorker.name} 
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedWorker.name}</h3>
                  <span className="text-[11px] text-purple-400">{selectedWorker.primarySkillLabel} ({selectedWorker.id})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#111A2E] border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">Contact Mobile:</div>
                <div className="text-white font-bold">{selectedWorker.phone}</div>
                <div className="text-slate-400 text-[10px] pt-1">Cooperative Registration:</div>
                <div className="text-white font-bold">COOP-MEM-2024-{selectedWorker.id.toUpperCase()}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#111A2E] border border-slate-800 space-y-2">
                <div className="font-bold text-white text-[11px]">Accredited Trade Certifications:</div>
                <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                  <li>National Skill Development Corp (NSDC) - Level 4</li>
                  <li>Tamil Nadu Building &amp; Other Construction Workers Welfare Board</li>
                  <li>Govt Electrical Wireman License Grade-B</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/50 space-y-1">
                <div className="font-bold text-purple-300 text-[11px]">Welfare Protection Status:</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Active beneficiary of Cooperative Pooled Welfare Fund. Covered under PMSBY Accidental Insurance (₹2,00,000 policy) and Tool Replacement Grant.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
