import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Download, 
  Filter, 
  Search,
  Building
} from 'lucide-react';
import { Booking } from '../../../types';

interface PaymentsTabProps {
  bookings: Booking[];
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ bookings }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Financial aggregates
  const totalVolume = 184500;
  const escrowHolding = 14200;
  const releasedToWorkers = 175275;
  const welfareTransferred = 9225;

  const mockTransactions = [
    {
      id: 'TXN-2026-8812',
      date: 'Today, 15:42',
      customer: 'Ananya Sharma',
      worker: 'Murugan Thangaraj',
      grossAmount: 650,
      workerShare: 617.5,
      welfareShare: 32.5,
      method: 'UPI / BharatPay QR',
      status: 'COMPLETED_RELEASED'
    },
    {
      id: 'TXN-2026-8811',
      date: 'Today, 14:10',
      customer: 'Dr. R. Balaji',
      worker: 'Ravi Kumar',
      grossAmount: 1200,
      workerShare: 1140,
      welfareShare: 60,
      method: 'Cooperative Escrow Wallet',
      status: 'HELD_IN_ESCROW'
    },
    {
      id: 'TXN-2026-8810',
      date: 'Today, 11:30',
      customer: 'Meenakshi Sundaram',
      worker: 'Suresh Narayanan',
      grossAmount: 450,
      workerShare: 427.5,
      welfareShare: 22.5,
      method: 'UPI / GooglePay',
      status: 'COMPLETED_RELEASED'
    },
    {
      id: 'TXN-2026-8809',
      date: 'Yesterday, 18:20',
      customer: 'Siddharth Varma',
      worker: 'Selvam Arumugam',
      grossAmount: 850,
      workerShare: 807.5,
      welfareShare: 42.5,
      method: 'NetBanking / IMPS',
      status: 'COMPLETED_RELEASED'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header & Ledger Aggregate Summary */}
      <div className="p-5 bg-[#111A2E] rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
              COOPERATIVE FINANCIAL RECONCILIATION &amp; SETTLEMENT LEDGER
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent, non-profit financial settlement reconciling 95% worker earnings and 5% pooled welfare.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Escrow Settlement Active
          </span>
        </div>

        {/* 4 Financial Balances */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-[#0C1322] border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 block">Total Volume</span>
            <div className="text-2xl font-bold text-white mt-1">₹{totalVolume.toLocaleString()}</div>
            <span className="text-[10px] text-slate-500 block mt-0.5">100% Verified Inflow</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1322] border border-amber-900/50 bg-amber-950/20">
            <span className="text-[10px] uppercase text-amber-400 block">In Escrow (Transit)</span>
            <div className="text-2xl font-bold text-amber-300 mt-1">₹{escrowHolding.toLocaleString()}</div>
            <span className="text-[10px] text-amber-400/80 block mt-0.5">Releases on OTP match</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1322] border border-emerald-900/50 bg-emerald-950/20">
            <span className="text-[10px] uppercase text-emerald-400 block">Disbursed to Artisans</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">₹{releasedToWorkers.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-400/80 block mt-0.5">Direct to Bank / UPI</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0C1322] border border-purple-900/50 bg-purple-950/20">
            <span className="text-[10px] uppercase text-purple-400 block">Welfare Fund Reserve</span>
            <div className="text-2xl font-bold text-purple-300 mt-1">₹{welfareTransferred.toLocaleString()}</div>
            <span className="text-[10px] text-purple-400/80 block mt-0.5">Statutory 5% Reserve</span>
          </div>
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold uppercase text-white">
            TRANSACTION SETTLEMENT AUDIT ({mockTransactions.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Automated Daily Bank Settlement
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase bg-[#0C1322]/60">
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Payer &amp; Payee</th>
                <th className="py-2.5 px-3">Gross Ticket</th>
                <th className="py-2.5 px-3">95% Worker Net</th>
                <th className="py-2.5 px-3">5% Welfare Net</th>
                <th className="py-2.5 px-3">Gateway</th>
                <th className="py-2.5 px-3 text-right">Settlement State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3 whitespace-nowrap text-purple-400 font-bold">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                    {tx.date}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="text-white font-medium">{tx.customer}</div>
                    <span className="text-[10px] text-slate-400 block">→ {tx.worker}</span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap font-bold text-white">
                    ₹{tx.grossAmount}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap font-bold text-emerald-400">
                    ₹{tx.workerShare}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap font-bold text-purple-300">
                    ₹{tx.welfareShare}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-300">
                    {tx.method}
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      tx.status === 'COMPLETED_RELEASED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse'
                    }`}>
                      {tx.status.replace(/_/g, ' ')}
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
