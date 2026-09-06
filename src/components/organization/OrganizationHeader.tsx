import React from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  Radio, 
  Bell, 
  LogOut, 
  UserCheck, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

interface OrganizationHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  openNotifications: () => void;
  unreadNotifsCount: number;
}

export const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
  activeTab,
  onTabChange,
  openNotifications,
  unreadNotifsCount
}) => {
  const { user, logout, switchRole } = useAuth();
  const [showRoleSwitcher, setShowRoleSwitcher] = React.useState(false);

  const orgName = user?.organizationName || 'L&T Kovai Facilities & Infrastructure Ltd.';
  const isVerified = user?.organizationVerificationStatus === 'VERIFIED';
  const orgRoleLabel = user?.role === 'organization_admin' ? 'Organization Admin' : 'Organization Staff';

  return (
    <header className="sticky top-0 z-30 bg-[#0F172A] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Organization Identity & Seal */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white line-clamp-1">
                  {orgName}
                </span>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Company</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Clock className="w-3 h-3" />
                    <span>Pending Verification</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Workforce Operations Command</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">{orgRoleLabel}</span>
              </div>
            </div>
          </div>

          {/* Center telemetry: Realtime WebSocket & GPS Status */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live GPS &amp; Dispatch Sync (18ms)</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Portal Switcher (For demonstration evaluation) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition"
              >
                <span>Demo Portals</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
                  <div className="px-2 py-1 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800 mb-1">
                    Switch Evaluation Role
                  </div>
                  {DEMO_ACCOUNTS.map((acc, idx) => (
                    <button
                      key={acc.user.id}
                      type="button"
                      onClick={() => {
                        switchRole(acc.role);
                        setShowRoleSwitcher(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold">{acc.roleLabel}</div>
                        <div className="text-[10px] text-slate-400">{acc.user.name}</div>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${acc.badgeColor}`}>
                        {acc.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              type="button"
              onClick={openNotifications}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Operational Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
