import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Building, 
  Stethoscope, 
  GraduationCap, 
  Wrench,
  Clock
} from 'lucide-react';
import { WorkerWelfareRecord } from '../../../types';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';
import { useAuth } from '../../../context/AuthContext';

export const WelfareTab: React.FC = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState<WorkerWelfareRecord[]>(() => cooperativeBackend.getWelfareRecords());

  const fundBalance = 428650;
  const monthlyInflow = 48200;
  const totalDisbursed = 186400;

  const handleApproveClaim = (claim: WorkerWelfareRecord) => {
    const confirm = window.confirm(`Approve disbursement of ₹${claim.amountRequested.toLocaleString()} from Cooperative Welfare Reserve for ${claim.workerName}?`);
    if (confirm) {
      cooperativeBackend.updateWelfareClaimStatus(claim.id, 'APPROVED', user?.name || 'Cooperative Admin');
      setClaims(cooperativeBackend.getWelfareRecords());
      alert(`Welfare claim for ${claim.workerName} approved. Treasury transfer scheduled.`);
    }
  };

  const handleRejectClaim = (claim: WorkerWelfareRecord) => {
    const reason = window.prompt(`Administrative rejection justification for ${claim.workerName}:`);
    if (reason && reason.trim()) {
      cooperativeBackend.updateWelfareClaimStatus(claim.id, 'REJECTED', user?.name || 'Cooperative Admin', reason);
      setClaims(cooperativeBackend.getWelfareRecords());
      alert(`Claim rejected with logged justification.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header & Welfare Balances */}
      <div className="p-5 bg-[#111A2E] rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
              COOPERATIVE WORKER WELFARE POOL &amp; SOCIAL SECURITY FUND
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Statutory 5% reserve funded by service margins, pooled for accident cover, health clinics, and emergency artisan grants.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400 font-bold px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-800">
            PMSBY Accidental Insurance Policy Enforced
          </span>
        </div>

        {/* 3 Welfare Reserve Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-[#0C1322] border border-purple-900/50 bg-purple-950/20">
            <span className="text-[10px] uppercase text-purple-400 block">Total Pooled Reserve</span>
            <div className="text-2xl font-bold text-purple-300 mt-1">₹{fundBalance.toLocaleString()}</div>
            <span className="text-[10px] text-purple-400/80 block mt-0.5">Held in Scheduled Cooperative Bank</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1322] border border-emerald-900/50 bg-emerald-950/20">
            <span className="text-[10px] uppercase text-emerald-400 block">This Month's 5% Inflow</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">₹{monthlyInflow.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-400/80 block mt-0.5">Directly from customer invoices</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1322] border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 block">Lifetime Claims Settled</span>
            <div className="text-2xl font-bold text-white mt-1">₹{totalDisbursed.toLocaleString()}</div>
            <span className="text-[10px] text-slate-400 block mt-0.5">142 Member Families Protected</span>
          </div>
        </div>
      </div>

      {/* Welfare Schemes Covered */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-2xl bg-[#111A2E] border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold">
            <Stethoscope className="w-4 h-4" />
            <span>Health &amp; Accident</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            ₹2,00,000 accidental cover + cashless hospitalization subsidy.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#111A2E] border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Wrench className="w-4 h-4" />
            <span>Tool Replacement</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            Zero-interest microgrants for stolen or broken master toolkit items.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#111A2E] border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>Child Education</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            Annual textbook and school tuition support for member children.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#111A2E] border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <HeartHandshake className="w-4 h-4" />
            <span>Pension Annuity</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            Cooperative retirement contribution match for veterans &gt; 5 yrs.
          </p>
        </div>
      </div>

      {/* Welfare Claims Queue Table */}
      <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold uppercase text-white">
            MEMBER WELFARE CLAIMS &amp; GRANT SCRUTINY ({claims.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Adjudicated by Cooperative Welfare Board
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase bg-[#0C1322]/60">
                <th className="py-2.5 px-3">Claim ID</th>
                <th className="py-2.5 px-3">Artisan Member</th>
                <th className="py-2.5 px-3">Benefit Category</th>
                <th className="py-2.5 px-3">Amount Requested</th>
                <th className="py-2.5 px-3">Filed Date</th>
                <th className="py-2.5 px-3">Claim Status</th>
                <th className="py-2.5 px-3 text-right">Adjudication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {claims.map((claim) => {
                const isPending = claim.status === 'PENDING';
                const isApproved = claim.status === 'APPROVED';

                return (
                  <tr key={claim.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3 whitespace-nowrap text-purple-400 font-bold">
                      {claim.id}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap font-bold text-white">
                      {claim.workerName}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-300">
                      {claim.claimType}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap font-bold text-white">
                      ₹{claim.amountRequested.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                      {claim.dateFiled}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        isPending
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : isApproved
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap space-x-1.5">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveClaim(claim)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer text-[11px]"
                          >
                            Approve Grant
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectClaim(claim)}
                            className="px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold transition-colors cursor-pointer text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">
                          {claim.adjudicatedBy ? `Approved by ${claim.adjudicatedBy}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
