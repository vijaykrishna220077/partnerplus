import React from 'react';
import { X, AlertTriangle, Flame, ShieldAlert, CheckCircle2, Clock, Bell } from 'lucide-react';

export interface OfficialAlert {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  isActionRequired: boolean;
  actionLabel?: string;
  targetTab?: string;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const OFFICIAL_ALERTS: OfficialAlert[] = [
  {
    id: 'alt-1',
    priority: 'CRITICAL',
    title: 'Emergency Breakdown Ticket Unassigned',
    description: 'Electrical main switchboard sparking in Anna Nagar (SS-2026-901). No worker auto-assigned within 3 mins.',
    timestamp: '2 mins ago',
    source: 'Dispatch Gateway',
    isActionRequired: true,
    actionLabel: 'Manual Dispatch',
    targetTab: 'live'
  },
  {
    id: 'alt-2',
    priority: 'HIGH',
    title: '4 Worker KYC Applications Awaiting Scrutiny',
    description: 'Police verification certificates & NSDC trade credentials uploaded for plumbing and electrical trades.',
    timestamp: '14 mins ago',
    source: 'Verification Desk',
    isActionRequired: true,
    actionLabel: 'Review KYC',
    targetTab: 'verification'
  },
  {
    id: 'alt-3',
    priority: 'HIGH',
    title: 'Critical Skill Shortage Detected in Chromepet',
    description: 'Surge in AC servicing and plumbing calls with only 1 worker currently marked available.',
    timestamp: '35 mins ago',
    source: 'AI Demand Forecast',
    isActionRequired: true,
    actionLabel: 'View Demand Monitor',
    targetTab: 'reports'
  },
  {
    id: 'alt-4',
    priority: 'NORMAL',
    title: 'Monthly Welfare Fund Contribution Cleared',
    description: 'Escrow reconciled ₹38,450 to cooperative member accident & healthcare pooled reserve.',
    timestamp: '2 hours ago',
    source: 'Co-op Treasury',
    isActionRequired: false,
    actionLabel: 'View Welfare Ledger',
    targetTab: 'welfare'
  }
];

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0F172A] border-l border-slate-800 text-white flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Official Operations Notifications"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white font-mono">
                OPERATIONAL NOTIFICATION CENTER
              </h2>
              <p className="text-[11px] text-slate-400">
                Official real-time alerts & dispatch warnings
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {OFFICIAL_ALERTS.map((alert) => {
            const isCritical = alert.priority === 'CRITICAL';
            const isHigh = alert.priority === 'HIGH';

            return (
              <div 
                key={alert.id}
                className={`p-3.5 rounded-xl border text-xs space-y-2 transition-colors ${
                  isCritical 
                    ? 'bg-rose-950/40 border-rose-800/80 text-rose-100' 
                    : isHigh 
                    ? 'bg-amber-950/40 border-amber-800/80 text-amber-100' 
                    : 'bg-[#1E293B]/70 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    isCritical 
                      ? 'bg-rose-900 text-rose-200 border border-rose-700' 
                      : isHigh 
                      ? 'bg-amber-900 text-amber-200 border border-amber-700' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {isCritical && <Flame className="w-3 h-3 text-rose-400 animate-pulse" />}
                    {isHigh && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                    {alert.priority}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs leading-snug">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/50 text-[10px]">
                  <span className="text-slate-500 font-mono">
                    Source: {alert.source}
                  </span>

                  {alert.isActionRequired && alert.targetTab && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateTab(alert.targetTab!);
                        onClose();
                      }}
                      className="font-bold text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      {alert.actionLabel || 'Investigate'} →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#1E293B]/60 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            System monitored in compliance with Cooperative By-laws Act.
          </p>
        </div>
      </div>
    </div>
  );
};
