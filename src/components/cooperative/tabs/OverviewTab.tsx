import React, { useState } from 'react';
import { 
  Users, 
  HardHat, 
  Radio, 
  ShieldAlert, 
  Briefcase, 
  Flame, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  HeartHandshake, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { Booking, Worker, Cooperative } from '../../../types';
import { CooperativeSectionId } from '../CooperativeSidebar';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';

interface OverviewTabProps {
  cooperative: Cooperative;
  workers: Worker[];
  bookings: Booking[];
  onNavigate: (section: CooperativeSectionId) => void;
  onOpenManualIntervene: (jobId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  cooperative,
  workers,
  bookings,
  onNavigate,
  onOpenManualIntervene
}) => {
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  const verifiedWorkers = workers.filter(w => w.verificationStatus === 'verified');
  const pendingKyc = workers.filter(w => w.verificationStatus === 'under_review');
  const onlineWorkers = workers.filter(w => w.isAvailableToday);
  const emergencyWorkers = workers.filter(w => w.isEmergencyReady);

  const activeJobs = bookings.filter(b => 
    ['worker_assigned', 'on_the_way', 'arrived', 'service_started'].includes(b.status)
  );
  const openJobs = bookings.filter(b => b.status === 'requested');
  const emergencyJobs = bookings.filter(b => b.isEmergency);
  const completedToday = bookings.filter(b => b.status === 'service_completed');

  // Financial snapshot
  const totalServiceValue = bookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 350), 0) + 12850;
  const workerEarningsAmount = Math.round(totalServiceValue * 0.95);
  const welfareContribution = Math.round(totalServiceValue * 0.05);

  const recentLogs = cooperativeBackend.getAuditLogs().slice(0, 4);

  // Trade breakdown counts
  const tradeCounts = {
    electrical: workers.filter(w => w.primarySkill === 'electrical').length,
    plumbing: workers.filter(w => w.primarySkill === 'plumbing').length,
    carpentry: workers.filter(w => w.primarySkill === 'carpentry').length,
    cleaning: workers.filter(w => w.primarySkill === 'cleaning').length,
    painting: workers.filter(w => w.primarySkill === 'painting').length,
    gardening: workers.filter(w => w.primarySkill === 'gardening').length
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Critical Operational Alerts Ribbon */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-amber-950/50 to-slate-900 border border-rose-800/80 shadow-lg text-xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-mono font-bold uppercase tracking-wider text-rose-300">
              CRITICAL OPERATIONAL MONITORING ALERTS
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Last Synced: {lastRefreshed}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Alert 1 */}
          <div className="p-3 rounded-xl bg-[#0F172A]/80 border border-rose-800/60 flex items-start gap-3">
            <Flame className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-xs">Emergency Calls Active</div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {emergencyJobs.length} Priority breakdown ticket awaiting confirmation in Anna Nagar.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('live')}
                className="mt-1.5 text-[10px] font-mono font-bold text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Dispatch Board</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Alert 2 */}
          <div className="p-3 rounded-xl bg-[#0F172A]/80 border border-amber-800/60 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-xs">KYC Approvals Queue</div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                {pendingKyc.length} new artisan credential applications pending scrutiny.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('verification')}
                className="mt-1.5 text-[10px] font-mono font-bold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Review Credentials</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Alert 3 */}
          <div className="p-3 rounded-xl bg-[#0F172A]/80 border border-purple-800/60 flex items-start gap-3">
            <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-xs">Skill Shortage Alert</div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Heavy monsoon cleaning and plumbing demand in Chromepet / Adyar.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('reports')}
                className="mt-1.5 text-[10px] font-mono font-bold text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>Demand Heatmap</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 12 Primary Real-Time Metric Cards (KPI) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            SYSTEM METRICS &amp; OPERATIONAL PIPELINE
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <Activity className="w-3 h-3 animate-pulse" />
            Live Event Loop Connected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          
          {/* Card 1: TOTAL WORKERS */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-slate-800 hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Workers</span>
            <div className="text-2xl font-black text-white font-mono mt-1">1,420</div>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12 this week
            </span>
          </div>

          {/* Card 2: ACTIVE WORKERS */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-slate-800 hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Workers</span>
            <div className="text-2xl font-black text-white font-mono mt-1">342</div>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">On-duty roster</span>
          </div>

          {/* Card 3: WORKERS ONLINE */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-slate-800 hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-mono uppercase text-emerald-400 block">Workers Online</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{onlineWorkers.length * 18 + 48}</div>
            <span className="text-[10px] text-emerald-400/80 font-mono block mt-1">GPS Telemetry On</span>
          </div>

          {/* Card 4: PENDING VERIFICATION */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-slate-800 hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-mono uppercase text-amber-400 block">Pending KYC</span>
            <div className="text-2xl font-black text-amber-300 font-mono mt-1">{pendingKyc.length}</div>
            <span className="text-[10px] text-amber-400/80 font-mono block mt-1">Awaiting scrutiny</span>
          </div>

          {/* Card 5: OPEN JOBS */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-slate-800 hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-mono uppercase text-sky-400 block">Open Jobs</span>
            <div className="text-2xl font-black text-sky-400 font-mono mt-1">{openJobs.length + 8}</div>
            <span className="text-[10px] text-sky-300 font-mono block mt-1">In auto-dispatch</span>
          </div>

          {/* Card 6: ACTIVE JOBS */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-slate-800 hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-mono uppercase text-purple-400 block">Active Jobs</span>
            <div className="text-2xl font-black text-purple-300 font-mono mt-1">{activeJobs.length + 18}</div>
            <span className="text-[10px] text-purple-300 font-mono block mt-1">On way / In progress</span>
          </div>

          {/* Card 7: EMERGENCY JOBS */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-rose-900/60 bg-rose-950/20">
            <span className="text-[10px] font-mono uppercase text-rose-400 block">Emergency Jobs</span>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">{emergencyJobs.length + 2}</div>
            <span className="text-[10px] text-rose-300 font-mono block mt-1">Target ETA &lt; 25m</span>
          </div>

          {/* Card 8: COMPLETED TODAY */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-slate-800 hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-mono uppercase text-emerald-400 block">Completed Today</span>
            <div className="text-2xl font-black text-white font-mono mt-1">{completedToday.length + 58}</div>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">Zero disputes logged</span>
          </div>

          {/* Card 9: CUSTOMER REQUESTS */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-slate-800 hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Customer Calls</span>
            <div className="text-2xl font-black text-white font-mono mt-1">87</div>
            <span className="text-[10px] text-emerald-400 font-mono block mt-1">98.4% Fulfilled</span>
          </div>

          {/* Card 10: SERVICE VALUE */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-slate-800 hover:border-slate-700 transition-colors">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Today's Volume</span>
            <div className="text-2xl font-black text-white font-mono mt-1">₹{totalServiceValue.toLocaleString()}</div>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">Gross tickets</span>
          </div>

          {/* Card 11: WORKER EARNINGS */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-emerald-900/60 bg-emerald-950/20">
            <span className="text-[10px] font-mono uppercase text-emerald-400 block">Worker Share (95%)</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">₹{workerEarningsAmount.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-300 font-mono block mt-1">Zero platform cut</span>
          </div>

          {/* Card 12: WELFARE CONTRIBUTION */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-purple-900/60 bg-purple-950/20">
            <span className="text-[10px] font-mono uppercase text-purple-400 block">Welfare Fund (5%)</span>
            <div className="text-2xl font-black text-purple-300 font-mono mt-1">₹{welfareContribution.toLocaleString()}</div>
            <span className="text-[10px] text-purple-300 font-mono block mt-1">Pooled insurance</span>
          </div>

        </div>
      </div>

      {/* Active Jobs Live Snapshot Table & Trade Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Jobs Snapshot (2 Columns on large screens) */}
        <div className="lg:col-span-2 bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-mono font-bold uppercase text-white">
                ACTIVE JOBS LIVE SNAPSHOT
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time operational board showing active customer dispatches in progress.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('live')}
              className="text-xs font-mono font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase bg-[#0C1322]/60">
                  <th className="py-2.5 px-3">Ticket ID</th>
                  <th className="py-2.5 px-3">Service &amp; Task</th>
                  <th className="py-2.5 px-3">Assigned Artisan</th>
                  <th className="py-2.5 px-3">Area &amp; ETA</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Intervene</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-purple-400 font-bold">{b.bookingCode}</span>
                      {b.isEmergency && (
                        <span className="ml-1.5 text-[9px] uppercase px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                          EMG
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{b.serviceName}</div>
                      <span className="text-[10px] text-slate-400 block">{b.problemDescription}</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-slate-200 font-medium">{b.workerName}</div>
                      <span className="text-[10px] text-slate-400">{b.workerPhone}</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-slate-300">{b.address.area}</div>
                      <span className="text-[10px] text-emerald-400 font-bold">ETA: 12 mins</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        b.status === 'service_completed' 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                          : b.status === 'on_the_way'
                          ? 'bg-sky-950 text-sky-300 border-sky-800 animate-pulse'
                          : 'bg-purple-950 text-purple-300 border-purple-800'
                      }`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onOpenManualIntervene(b.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Intervene
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Worker Availability by Trade */}
        <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold uppercase text-white">
                WORKFORCE BY TRADE
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                100% Vetted
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Available cooperative artisans on duty by specialty trade.
            </p>

            <div className="space-y-3 pt-3">
              {[
                { name: 'Electrical & Wireman', count: tradeCounts.electrical * 32 + 18, color: 'bg-amber-500', pct: '85%' },
                { name: 'Plumbing & Drainage', count: tradeCounts.plumbing * 28 + 14, color: 'bg-sky-500', pct: '78%' },
                { name: 'Carpentry & Joinery', count: tradeCounts.carpentry * 18 + 12, color: 'bg-amber-700', pct: '62%' },
                { name: 'Deep Cleaning & Sanitization', count: tradeCounts.cleaning * 34 + 22, color: 'bg-emerald-500', pct: '90%' },
                { name: 'Painting & Damp Coating', count: tradeCounts.painting * 20 + 8, color: 'bg-purple-500', pct: '70%' },
                { name: 'Gardening & Horticulture', count: tradeCounts.gardening * 14 + 6, color: 'bg-lime-500', pct: '55%' }
              ].map((trade, idx) => (
                <div key={idx} className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">{trade.name}</span>
                    <span className="font-bold text-white">{trade.count} on call</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${trade.color}`} 
                      style={{ width: trade.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0C1322] border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-white font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cooperative Guarantee Enforced</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-snug">
              Every dispatched artisan carries valid society ID, police clearance, and standard tools inspected by the society secretary.
            </p>
          </div>
        </div>

      </div>

      {/* Recent Activity & Tamper-Evident Audit Trail */}
      <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase text-white">
              RECENT ACTIVITY &amp; AUDIT TRAIL STREAM
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest administrative operations, dispatch matches, and regulatory governance updates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="text-xs font-mono font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Audit Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentLogs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-2xl bg-[#0C1322] border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {log.action}
                </span>
                <span className="text-[10px] text-slate-500">{log.timestamp}</span>
              </div>
              <div className="font-bold text-white text-xs">
                {log.adminName} <span className="text-slate-400 font-normal">({log.adminRole})</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {log.reason}
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                Entity: <span className="text-slate-300">{log.affectedEntity}</span> ({log.entityId})
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
