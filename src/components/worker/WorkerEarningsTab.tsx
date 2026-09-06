import React, { useState } from 'react';
import { 
  Coins, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Calendar,
  Wallet,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { WorkerEarningRecord } from '../../data/workerJobData';

interface WorkerEarningsTabProps {
  records: WorkerEarningRecord[];
  dailyTotal: number;
}

export const WorkerEarningsTab: React.FC<WorkerEarningsTabProps> = ({
  records,
  dailyTotal
}) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  const weekTotal = 7850;
  const monthTotal = 24600;
  const currentTotal = period === 'today' ? dailyTotal : period === 'week' ? weekTotal : monthTotal;
  const completedJobsCount = period === 'today' ? 3 : period === 'week' ? 16 : 48;
  const averagePerJob = Math.round(currentTotal / completedJobsCount);

  return (
    <div className="space-y-6">
      {/* 1. Filter Switch: TODAY | THIS WEEK | THIS MONTH */}
      <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 border border-gray-200">
        <button
          onClick={() => setPeriod('today')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
            period === 'today' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          TODAY
        </button>

        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
            period === 'week' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          THIS WEEK
        </button>

        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
            period === 'month' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          THIS MONTH
        </button>
      </div>

      {/* 2. Giant Friendly Banknote Card (Section 21) */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-7 shadow-md shadow-emerald-700/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-emerald-100 tracking-wider flex items-center gap-1.5">
            <Wallet className="w-4 h-4" />
            <span>Total Earnings ({period.toUpperCase()})</span>
          </span>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-white">
            100% Aapka Direct Cash
          </span>
        </div>

        <div className="text-4xl sm:text-5xl font-black tracking-tight">
          ₹{currentTotal.toLocaleString()}
        </div>

        <div className="pt-2 border-t border-emerald-500/50 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-emerald-200">Jobs Completed</div>
            <div className="font-black text-sm sm:text-base text-white">{completedJobsCount} Work Orders</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-200">Average Per Job</div>
            <div className="font-black text-sm sm:text-base text-white">₹{averagePerJob} / job</div>
          </div>
        </div>
      </div>

      {/* 3. Payment Status (Paid vs Pending) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paid Directly</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            ₹{currentTotal.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">Cleared via Cash/UPI</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending Payout</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-800 mt-1">
            ₹0
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">All accounts settled</div>
        </div>
      </div>

      {/* 4. Cooperative Welfare Contribution Breakdown (Section 23) */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              🤝
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">Your Cooperative Welfare Fund</h4>
              <p className="text-[11px] text-gray-500">Transparent 0% Commission • Fair Welfare Model</p>
            </div>
          </div>
          <span className="text-xs font-black text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
            Active Member
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-blue-100 space-y-2 text-xs">
          <div className="flex justify-between font-bold text-gray-700">
            <span>Gross Work Earnings:</span>
            <span>₹{currentTotal}</span>
          </div>
          <div className="flex justify-between text-blue-700 font-bold">
            <span>Welfare Contribution (PMSBY & Pension):</span>
            <span>₹{Math.round(currentTotal * 0.08)}</span>
          </div>
          <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-gray-900 text-sm">
            <span>Net Take-Home Cash:</span>
            <span className="text-emerald-600">₹{currentTotal}</span>
          </div>
        </div>

        <p className="text-[11px] text-gray-600 leading-relaxed">
          *In PartnerPlus, there are <strong>zero middleman commissions</strong>. Small cooperative contributions are pooled into the Tamil Nadu Labour Welfare Board & PMSBY policy for free medical care, tools subsidy, and family emergency relief.
        </p>
      </div>

      {/* 5. "Where Did My Money Come From?" Detailed Breakdown (Section 21) */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-black text-gray-900">
          Where Did My Money Come From?
        </h3>

        <div className="space-y-2.5">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex items-center justify-between gap-3 hover:border-gray-300 transition"
            >
              <div>
                <div className="text-xs font-black text-gray-900">
                  {rec.taskTitle}
                </div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <span>{rec.date}</span>
                  <span>•</span>
                  <span>{rec.customerArea}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">✓ {rec.status.toUpperCase()} ({rec.paymentMode})</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-emerald-700">
                  +₹{rec.amountEarned}
                </div>
                <div className="text-[10px] text-gray-400">
                  Co-op fee: ₹{rec.welfareDeducted}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
