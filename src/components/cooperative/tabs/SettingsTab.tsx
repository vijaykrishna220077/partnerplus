import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Users, 
  DollarSign, 
  Radio, 
  Building,
  RotateCcw
} from 'lucide-react';
import { CooperativeOperationalRules } from '../../../types';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';
import { useAuth } from '../../../context/AuthContext';

export const SettingsTab: React.FC = () => {
  const { user } = useAuth();
  const staffRole = user?.staffRole || 'COOPERATIVE_ADMIN';
  const isAdmin = staffRole === 'COOPERATIVE_ADMIN';

  const [rules, setRules] = useState<CooperativeOperationalRules>(() => cooperativeBackend.getRules());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Unauthorized: Only executive COOPERATIVE_ADMIN officials may alter cooperative financial rules and bylaws.');
      return;
    }

    // Verify worker share + welfare = 100%
    if (rules.workerSharePercentage + rules.welfareContributionPercentage !== 100) {
      alert('Validation error: Worker Share Percentage + Welfare Contribution Percentage must sum to exactly 100% (currently ' + (rules.workerSharePercentage + rules.welfareContributionPercentage) + '%).');
      return;
    }

    cooperativeBackend.updateRules(rules, user?.name || 'Cooperative Admin');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="p-5 bg-[#111A2E] rounded-3xl border border-slate-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
                COOPERATIVE BYLAWS &amp; OPERATIONAL GOVERNANCE RULES
              </h2>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-bold ${
                isAdmin 
                  ? 'bg-purple-950 text-purple-300 border-purple-800' 
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {isAdmin ? 'EXECUTIVE ADMIN EDIT ACCESS' : 'STAFF READ-ONLY ACCESS'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cooperative society parameters governing worker dividend splits, welfare reserve rates, dispatch radii, and response SLAs.
            </p>
          </div>

          {!isAdmin && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-mono border border-slate-700">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Restricted: COOPERATIVE_ADMIN clearance required to alter bylaws</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Financial Split Section */}
        <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Revenue Split &amp; Welfare Contribution Bylaw</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Artisan Payout Share (%)
              </label>
              <input
                type="number"
                disabled={!isAdmin}
                value={rules.workerSharePercentage}
                onChange={(e) => setRules({ ...rules, workerSharePercentage: Number(e.target.value) })}
                className="w-full bg-[#0C1322] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold disabled:opacity-60"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 95% straight to artisan bank account</span>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Welfare Reserve Fund (%)
              </label>
              <input
                type="number"
                disabled={!isAdmin}
                value={rules.welfareContributionPercentage}
                onChange={(e) => setRules({ ...rules, welfareContributionPercentage: Number(e.target.value) })}
                className="w-full bg-[#0C1322] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold disabled:opacity-60"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 5% pooled into PMSBY insurance &amp; grants</span>
            </div>
          </div>
        </div>

        {/* Dispatch & SLA Constraints */}
        <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" />
            <span>Dispatch Radii &amp; Emergency Target SLAs</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Maximum Auto-Dispatch Radius (km)
              </label>
              <input
                type="number"
                disabled={!isAdmin}
                value={rules.maxTravelRadiusKm}
                onChange={(e) => setRules({ ...rules, maxTravelRadiusKm: Number(e.target.value) })}
                className="w-full bg-[#0C1322] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold disabled:opacity-60"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Max distance artisan can be auto-assigned</span>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Emergency Response Target (minutes)
              </label>
              <input
                type="number"
                disabled={!isAdmin}
                value={rules.emergencyResponseTimeTargetMinutes}
                onChange={(e) => setRules({ ...rules, emergencyResponseTimeTargetMinutes: Number(e.target.value) })}
                className="w-full bg-[#0C1322] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold disabled:opacity-60"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Breakdown SLA for water/electrical emergencies</span>
            </div>
          </div>
        </div>

        {/* Save button */}
        {isAdmin && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-slate-400">
              All modifications will be recorded with your official digital signature in the Audit Log.
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'Bylaws Updated Successfully!' : 'Save & Publish Operational Rules'}</span>
            </button>
          </div>
        )}

      </form>

    </div>
  );
};
