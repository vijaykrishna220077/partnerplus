import React, { useState } from 'react';
import { 
  Banknote, 
  TrendingUp, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Star, 
  Clock, 
  Users, 
  Award,
  ArrowUpRight
} from 'lucide-react';
import { Worker } from '../../../types';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';
import { useAuth } from '../../../context/AuthContext';

interface EarningsTabProps {
  workers: Worker[];
}

export const EarningsTab: React.FC<EarningsTabProps> = ({ workers }) => {
  const { user } = useAuth();
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [batchDisbursed, setBatchDisbursed] = useState(false);

  // Generate realistic income analytics per worker
  const earningsRoster = [
    {
      id: 'wrk-1',
      name: 'Murugan Thangaraj',
      trade: 'Electrical & Industrial Wireman',
      weeklyEarnings: 14850,
      monthlyEarnings: 58200,
      jobsCompletedWeek: 18,
      status: 'HIGH_PERFORMER',
      belowThreshold: false
    },
    {
      id: 'wrk-2',
      name: 'Ravi Kumar',
      trade: 'Master Plumber',
      weeklyEarnings: 12400,
      monthlyEarnings: 49100,
      jobsCompletedWeek: 15,
      status: 'HIGH_PERFORMER',
      belowThreshold: false
    },
    {
      id: 'wrk-3',
      name: 'Selvam Arumugam',
      trade: 'Carpentry & Joinery',
      weeklyEarnings: 9800,
      monthlyEarnings: 38600,
      jobsCompletedWeek: 11,
      status: 'NORMAL',
      belowThreshold: false
    },
    {
      id: 'wrk-4',
      name: 'Kavita Sundaram',
      trade: 'Horticulture & Gardening',
      weeklyEarnings: 3200,
      monthlyEarnings: 14200,
      jobsCompletedWeek: 4,
      status: 'ASSISTANCE_RECOMMENDED',
      belowThreshold: true
    }
  ];

  const handleBatchDisbursement = () => {
    setIsProcessingBatch(true);
    setTimeout(() => {
      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: 'BATCH_PAYOUT_INITIATED',
        affectedEntity: 'TREASURY',
        entityId: `PAYOUT-BATCH-${Date.now()}`,
        previousState: 'RECONCILED',
        newState: 'DISBURSED_TO_BANKS',
        reason: 'Weekly direct cooperative bank transfer disbursed to 342 active worker accounts.'
      });

      setIsProcessingBatch(false);
      setBatchDisbursed(true);
      alert('Batch payout transfer of ₹1,42,850 successfully queued to ICICI/SBI Cooperative clearing gateway.');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header & Payout Trigger */}
      <div className="p-5 bg-[#111A2E] rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
            COOPERATIVE ARTISAN INCOME MONITOR &amp; 95% DIVIDEND LEDGER
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Artisans retain 95% of gross invoice value with zero predatory aggregator cuts. Minimum wage protection alerts active.
          </p>
        </div>

        <button
          type="button"
          onClick={handleBatchDisbursement}
          disabled={isProcessingBatch}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg transition-colors cursor-pointer shrink-0"
        >
          {isProcessingBatch ? (
            <span>Initiating Clearing...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Release Weekly Direct Payout Batch</span>
            </>
          )}
        </button>
      </div>

      {/* Income Threshold Warning Box */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 flex items-start gap-3 text-xs font-mono">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-200">
            1 Artisan Earning Below Cooperative Fair Income Floor (&lt; ₹4,000 / week)
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Cooperative dispatch algorithm has flagged Kavita Sundaram (Gardening). Cooperative dispatch desk recommends priority routing of scheduled lawn care contracts to maintain minimum guaranteed income.
          </p>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold uppercase text-white">
            INDIVIDUAL ARTISAN TAKE-HOME PERFORMANCE
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Updated via Real-time Escrow Sync
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase bg-[#0C1322]/60">
                <th className="py-2.5 px-3">Artisan</th>
                <th className="py-2.5 px-3">Specialty Trade</th>
                <th className="py-2.5 px-3">This Week's 95% Income</th>
                <th className="py-2.5 px-3">30-Day Total</th>
                <th className="py-2.5 px-3">Jobs Completed</th>
                <th className="py-2.5 px-3">Income Health</th>
                <th className="py-2.5 px-3 text-right">Settlement State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {earningsRoster.map((earner) => (
                <tr key={earner.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3 whitespace-nowrap font-bold text-white">
                    {earner.name}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-300">
                    {earner.trade}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap font-bold text-emerald-400 text-sm">
                    ₹{earner.weeklyEarnings.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap font-medium text-white">
                    ₹{earner.monthlyEarnings.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-300">
                    {earner.jobsCompletedWeek} jobs
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      earner.belowThreshold
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {earner.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <span className="text-[11px] text-purple-300 font-mono">
                      {batchDisbursed ? 'Disbursed (SBI IMPS)' : 'Awaiting Next Cycle'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
