import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Cooperative } from '../../types';
import { 
  Building2, 
  Bell, 
  History, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  LogOut, 
  ChevronDown, 
  Menu, 
  Flame, 
  Database,
  RefreshCw
} from 'lucide-react';

interface CooperativeHeaderProps {
  activeCooperative: Cooperative;
  onOpenNotifications: () => void;
  onOpenAuditLog: () => void;
  onOpenLiveMap: () => void;
  onToggleSidebar: () => void;
  unreadAlertCount: number;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const CooperativeHeader: React.FC<CooperativeHeaderProps> = ({
  activeCooperative,
  onOpenNotifications,
  onOpenAuditLog,
  onOpenLiveMap,
  onToggleSidebar,
  unreadAlertCount,
  isDemoMode,
  onToggleDemoMode
}) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingLatency, setPingLatency] = useState(24);

  const staffRole = user?.staffRole || 'COOPERATIVE_ADMIN';
  const isAdmin = staffRole === 'COOPERATIVE_ADMIN';

  const handleTestPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setPingLatency(Math.floor(18 + Math.random() * 15));
      setIsPinging(false);
    }, 300);
  };

  return (
    <header className="bg-[#0F172A] border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Mobile Menu Toggle + Portal Title & Society Registration */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Official Cooperative Seal / Emblem */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md font-black text-xl shrink-0 border border-purple-400/20">
              🏛️
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black tracking-tight text-white font-mono uppercase">
                  PARTNERPLUS <span className="text-purple-400 hidden sm:inline">• OPERATIONS PORTAL</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 shrink-0">
                  Reg: {activeCooperative.registrationNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5 font-light">
                {activeCooperative.name} • {activeCooperative.city}, {activeCooperative.state}
              </p>
            </div>
          </div>

          {/* Right: Operational Controls & Admin User Info */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            
            {/* Real-time System Status with Ping */}
            <div 
              onClick={handleTestPing}
              title="Click to test live telemetry socket ping"
              className="hidden md:flex items-center gap-2 bg-[#1E293B] hover:bg-[#283548] px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-mono transition-colors cursor-pointer"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-bold">LIVE</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 text-[11px]">{isPinging ? '...' : `${pingLatency}ms`}</span>
            </div>

            {/* Demo Data Mode Toggle Badge */}
            <button
              type="button"
              onClick={onToggleDemoMode}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition-colors cursor-pointer ${
                isDemoMode
                  ? 'bg-amber-950/50 border-amber-800 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-emerald-950/50 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
              }`}
              title="Toggle between demonstration state and live backend state"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isDemoMode ? 'DEMO DATA' : 'LIVE BACKEND'}</span>
            </button>

            {/* Live Tactical Map Modal Trigger */}
            <button
              type="button"
              onClick={onOpenLiveMap}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-slate-300 hover:text-white border border-slate-700/80 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open Live Operations Radar & GPS Clusters"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Tactical Radar</span>
            </button>

            {/* Audit Log Modal Trigger */}
            <button
              type="button"
              onClick={onOpenAuditLog}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-slate-300 hover:text-white border border-slate-700/80 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Inspect Immutable Operations Audit Trail"
            >
              <History className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Audit Log</span>
            </button>

            {/* Notification Center Trigger with Unread Badge */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
              aria-label="Open operational alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-mono text-[10px] font-black flex items-center justify-center border-2 border-[#0F172A] animate-pulse">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            {/* Official Administrator Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(prev => !prev)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 transition-colors text-left cursor-pointer"
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-xl object-cover border border-purple-500/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-purple-700 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                )}
                
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-white leading-none">
                    {user?.name || 'K. S. Ramanathan'}
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase mt-1 inline-block ${
                    isAdmin ? 'text-purple-400' : 'text-indigo-400'
                  }`}>
                    {staffRole}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Menu Popover */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#1E293B] border border-slate-700 shadow-2xl p-3 z-50 text-xs text-white space-y-3 font-mono animate-in fade-in">
                  <div className="border-b border-slate-700/80 pb-2.5">
                    <div className="font-bold text-sm text-white">{user?.name}</div>
                    <div className="text-[11px] text-slate-400">{user?.email}</div>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {staffRole}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-400">
                    <div>Jurisdiction: <span className="text-slate-200">{activeCooperative.name}</span></div>
                    <div>Society Reg: <span className="text-slate-200">{activeCooperative.registrationNumber}</span></div>
                    <div>Account Status: <span className="text-emerald-400 font-bold">Active &amp; Vetted</span></div>
                  </div>

                  <div className="border-t border-slate-700/80 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out from Official Terminal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
