import React from 'react';
import { X, Sparkles, Zap, Users, Play, RotateCcw, CheckCircle2, Shield, UserCheck } from 'lucide-react';
import { LanguageCode } from '../../types';
import { StructuredWorkerProfile } from '../../types/workerSkillRegistry';
import { STRUCTURED_WORKER_PROFILES } from '../../data/structuredWorkersData';

interface WorkerDemoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateIncomingJob: (type: 'emergency' | 'multi_worker' | 'skilled' | 'general') => void;
  onSimulateJobComplete: () => void;
  onResetDemoData: () => void;
  onQuickLanguage: (lang: LanguageCode) => void;
  onToggleDuty: () => void;
  isOnline: boolean;
  activeWorker?: StructuredWorkerProfile;
  onSwitchWorker?: (worker: StructuredWorkerProfile) => void;
}

export const WorkerDemoDrawer: React.FC<WorkerDemoDrawerProps> = ({
  isOpen,
  onClose,
  onSimulateIncomingJob,
  onSimulateJobComplete,
  onResetDemoData,
  onQuickLanguage,
  onToggleDuty,
  isOnline,
  activeWorker,
  onSwitchWorker
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-end p-0 sm:p-4">
      <div 
        className="bg-slate-900 text-white w-full sm:max-w-md h-full sm:h-auto sm:rounded-3xl border border-slate-700 shadow-2xl p-6 space-y-5 overflow-y-auto max-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black">
              SIH
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                SIH 2026 Showcase Controls
              </h3>
              <p className="text-xs text-slate-400">
                Evaluation shortcuts for 3-minute judge demonstrations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Worker Persona Switcher for Skill & Tier Demonstration */}
        {onSwitchWorker && (
          <div className="space-y-2 p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
            <div className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              <span>Demonstrate Worker Skill Tiers</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Switch persona to verify 10-step matching &amp; hard skill constraints:
            </p>
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {STRUCTURED_WORKER_PROFILES.map((p) => {
                const isActive = activeWorker?.id === p.id || (p.id === 'wrk-ramesh-elec' && activeWorker?.name);
                const displayName = isActive ? (activeWorker?.name || p.name) : p.name;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (p.id === 'wrk-ramesh-elec' && activeWorker?.name) {
                        onSwitchWorker?.({ ...p, name: activeWorker.name });
                      } else {
                        onSwitchWorker?.(p);
                      }
                      onClose();
                    }}
                    className={`p-2 rounded-xl text-xs font-bold text-left transition cursor-pointer border flex items-center justify-between ${
                      isActive 
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-xs' 
                        : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <div>
                      <span className="font-black">{displayName}</span>
                      <span className="text-[10px] opacity-80 ml-1.5">
                        ({p.worker_type === 'skilled' ? 'Skilled' : p.worker_type === 'semi_skilled' ? 'Semi-Skilled' : 'General'} • {p.primary_skill_label})
                      </span>
                    </div>
                    {isActive && <span className="text-[10px] font-black uppercase">Active</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action 1: Trigger Incoming Jobs */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Incoming Work Request</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSimulateIncomingJob('emergency');
                onClose();
              }}
              className="p-3 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 rounded-xl text-xs font-black text-left transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <div>Emergency Job</div>
                <div className="text-[10px] text-red-300 font-normal">₹550 • 15 min ETA</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSimulateIncomingJob('multi_worker');
                onClose();
              }}
              className="p-3 bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-purple-200 rounded-xl text-xs font-black text-left transition flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div>Multi-Worker Job</div>
                <div className="text-[10px] text-purple-300 font-normal">3 Workers Needed</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSimulateIncomingJob('skilled');
                onClose();
              }}
              className="p-3 bg-blue-950/60 hover:bg-blue-900 border border-blue-800 text-blue-200 rounded-xl text-xs font-black text-left transition flex items-center gap-2 cursor-pointer"
            >
              <span className="text-base">🔧</span>
              <div>
                <div>Skilled Plumbing</div>
                <div className="text-[10px] text-blue-300 font-normal">₹450 Earning</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSimulateIncomingJob('general');
                onClose();
              }}
              className="p-3 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 rounded-xl text-xs font-black text-left transition flex items-center gap-2 cursor-pointer"
            >
              <span className="text-base">📦</span>
              <div>
                <div>General Labour</div>
                <div className="text-[10px] text-emerald-300 font-normal">Daily-Wage Loading</div>
              </div>
            </button>
          </div>
        </div>

        {/* Action 2: Fast Complete Active Job */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active Job Fast-Forward</span>
          </div>

          <button
            onClick={() => {
              onSimulateJobComplete();
              onClose();
            }}
            className="w-full p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simulate Job Completed &amp; Paid (Update Passbook)</span>
          </button>
        </div>

        {/* Action 3: Quick Duty & Reset */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onToggleDuty}
            className={`p-2.5 rounded-xl text-xs font-black border transition cursor-pointer ${
              isOnline ? 'bg-emerald-900/50 border-emerald-700 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            Toggle Duty ({isOnline ? 'Online' : 'Offline'})
          </button>

          <button
            onClick={() => {
              onResetDemoData();
              onClose();
            }}
            className="p-2.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition cursor-pointer flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Action 4: Quick Language Switching */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-400">Quick Regional Language Test:</div>
          <div className="flex flex-wrap gap-1.5">
            {(['hi', 'ta', 'te', 'kn', 'bn', 'mr', 'en'] as LanguageCode[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onQuickLanguage(lang)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 hover:text-white rounded-lg text-xs font-bold text-slate-300 cursor-pointer"
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
