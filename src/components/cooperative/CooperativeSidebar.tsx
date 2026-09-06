import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  Briefcase, 
  Users, 
  UserCheck, 
  ShieldAlert, 
  CreditCard, 
  Banknote, 
  HeartHandshake, 
  MessageSquareWarning, 
  BarChart3, 
  Settings, 
  X,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Cooperative } from '../../types';
import { mockCooperatives } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export type CooperativeSectionId = 
  | 'overview'
  | 'live'
  | 'jobs'
  | 'workers'
  | 'customers'
  | 'verification'
  | 'payments'
  | 'earnings'
  | 'welfare'
  | 'complaints'
  | 'reports'
  | 'settings';

interface CooperativeSidebarProps {
  currentSection: CooperativeSectionId;
  onSelectSection: (section: CooperativeSectionId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  selectedCooperativeId: string;
  onSelectCooperative: (id: string) => void;
  activeJobsCount: number;
  emergencyCount: number;
  pendingKycCount: number;
  openComplaintsCount: number;
}

export const CooperativeSidebar: React.FC<CooperativeSidebarProps> = ({
  currentSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
  selectedCooperativeId,
  onSelectCooperative,
  activeJobsCount,
  emergencyCount,
  pendingKycCount,
  openComplaintsCount
}) => {
  const { user } = useAuth();
  const staffRole = user?.staffRole || 'COOPERATIVE_ADMIN';
  const isAdmin = staffRole === 'COOPERATIVE_ADMIN';

  const navItems = [
    { 
      id: 'overview' as CooperativeSectionId, 
      label: 'OVERVIEW', 
      subtitle: 'Real-time Metrics & Alerts',
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'live' as CooperativeSectionId, 
      label: 'LIVE OPERATIONS', 
      subtitle: 'Dispatch & Active Board',
      icon: Radio,
      badge: emergencyCount > 0 ? `${emergencyCount} EMG` : `${activeJobsCount} Active`,
      badgeColor: emergencyCount > 0 ? 'bg-rose-900 text-rose-200 border-rose-700 animate-pulse' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
    },
    { 
      id: 'jobs' as CooperativeSectionId, 
      label: 'JOBS', 
      subtitle: 'Job Feed & Monitoring',
      icon: Briefcase,
      badge: `${activeJobsCount}`
    },
    { 
      id: 'workers' as CooperativeSectionId, 
      label: 'WORKERS', 
      subtitle: 'Availability & Roster',
      icon: Users,
      badge: 'Online'
    },
    { 
      id: 'customers' as CooperativeSectionId, 
      label: 'CUSTOMERS', 
      subtitle: 'Accounts & Service History',
      icon: UserCheck,
      badge: null
    },
    { 
      id: 'verification' as CooperativeSectionId, 
      label: 'VERIFICATION', 
      subtitle: 'KYC, Police & Trade Tests',
      icon: ShieldAlert,
      badge: pendingKycCount > 0 ? `${pendingKycCount} Queue` : 'Vetted',
      badgeColor: pendingKycCount > 0 ? 'bg-amber-900 text-amber-200 border-amber-700' : 'bg-slate-800 text-slate-400'
    },
    { 
      id: 'payments' as CooperativeSectionId, 
      label: 'PAYMENTS', 
      subtitle: 'Ledger & Transactions',
      icon: CreditCard,
      badge: null
    },
    { 
      id: 'earnings' as CooperativeSectionId, 
      label: 'EARNINGS', 
      subtitle: 'Worker Payouts & 95% Share',
      icon: Banknote,
      badge: '95%'
    },
    { 
      id: 'welfare' as CooperativeSectionId, 
      label: 'WELFARE', 
      subtitle: '5% Reserve & PMSBY Benefits',
      icon: HeartHandshake,
      badge: '₹4.2L'
    },
    { 
      id: 'complaints' as CooperativeSectionId, 
      label: 'COMPLAINTS', 
      subtitle: 'Dispute Resolution Desk',
      icon: MessageSquareWarning,
      badge: openComplaintsCount > 0 ? `${openComplaintsCount} Open` : null,
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800'
    },
    { 
      id: 'reports' as CooperativeSectionId, 
      label: 'REPORTS', 
      subtitle: 'Demand Analytics & Heatmaps',
      icon: BarChart3,
      badge: 'AI'
    },
    { 
      id: 'settings' as CooperativeSectionId, 
      label: 'SETTINGS', 
      subtitle: 'Bylaws, Rules & Staff Roles',
      icon: Settings,
      badge: isAdmin ? 'Admin' : 'Restricted',
      badgeColor: isAdmin ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-slate-800 text-slate-500'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B111E] border-r border-slate-800 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header (Mobile close + Jurisdiction selector) */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0F172A]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
              COOPERATIVE REGISTRY
            </span>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-1 mt-0.5">
              <Building className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>SOCIETY JURISDICTION</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cooperative Jurisdiction Switcher */}
        <div className="p-3 border-b border-slate-800/60 bg-[#090E1A]">
          <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
            Active Society Branch:
          </label>
          <select
            value={selectedCooperativeId}
            onChange={(e) => onSelectCooperative(e.target.value)}
            className="w-full bg-[#111A2E] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono truncate cursor-pointer"
          >
            {mockCooperatives.map(c => (
              <option key={c.id} value={c.id} className="bg-[#111A2E] text-white">
                {c.name} ({c.city})
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Items (12 Primary Sections) */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectSection(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl font-mono text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/20'
                    : 'text-slate-300 hover:bg-[#151F33] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-purple-700/80 text-white' : 'bg-slate-800/80 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate leading-snug">
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-purple-200' : 'text-slate-500'}`}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                    item.badgeColor || (isActive ? 'bg-purple-700 text-white border-purple-500' : 'bg-slate-800 text-slate-300 border-slate-700')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Staff Role Authorization Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-[#0F172A] text-xs font-mono space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase">Security Clearance:</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
              isAdmin 
                ? 'bg-purple-950 text-purple-300 border-purple-800' 
                : 'bg-indigo-950 text-indigo-300 border-indigo-800'
            }`}>
              {staffRole}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            {isAdmin 
              ? 'Full executive authority: All dispatch, financial %, and dispute powers enabled.' 
              : 'Operations desk authority: Dispatch & verification enabled; rules modification restricted.'}
          </p>
        </div>
      </aside>
    </>
  );
};
