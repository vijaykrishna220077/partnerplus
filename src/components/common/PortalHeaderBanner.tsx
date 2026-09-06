import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole, LanguageCode } from '../../types';
import { 
  LogOut, 
  User, 
  HardHat, 
  Building2, 
  ArrowLeftRight, 
  Globe, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

export const PortalHeaderBanner: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { lang, setLang } = useApp();
  const [isSwitchMenuOpen, setIsSwitchMenuOpen] = useState(false);

  if (!user) return null;

  const currentRole = user.role;

  const roleInfo = {
    customer: {
      portalName: 'CUSTOMER PORTAL',
      badgeBg: 'bg-blue-600',
      textColor: 'text-blue-400',
      icon: User,
      subtitle: 'Service Booking, Tracking & Reviews'
    },
    worker: {
      portalName: 'WORKER PORTAL',
      badgeBg: 'bg-emerald-600',
      textColor: 'text-emerald-400',
      icon: HardHat,
      subtitle: 'Accessible Job Feed, Earnings & Social Security'
    },
    cooperative_admin: {
      portalName: 'ADMIN OFFICIALS PORTAL',
      badgeBg: 'bg-purple-600',
      textColor: 'text-purple-400',
      icon: Building2,
      subtitle: 'Admin Officials Console, Verification & AI Logistics'
    },
    organization_admin: {
      portalName: 'COMPANY PORTAL',
      badgeBg: 'bg-amber-600',
      textColor: 'text-amber-400',
      icon: Building2,
      subtitle: 'Enterprise Workforce Management & Projects'
    },
    organization_staff: {
      portalName: 'COMPANY STAFF PORTAL',
      badgeBg: 'bg-amber-700',
      textColor: 'text-amber-300',
      icon: Building2,
      subtitle: 'Site Attendance & Workforce Monitoring'
    }
  }[currentRole] || {
    portalName: 'PORTAL',
    badgeBg: 'bg-slate-700',
    textColor: 'text-slate-300',
    icon: Building2,
    subtitle: 'Cooperative Operations'
  };

  const CurrentIcon = roleInfo.icon;

  return (
    <div className="bg-[#050C1B] text-white border-b border-slate-800 py-2 px-3 sm:px-6 text-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Active Portal Indicator & User Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide text-white ${roleInfo.badgeBg} shadow-sm`}>
              <CurrentIcon className="w-3.5 h-3.5" />
              <span>{roleInfo.portalName}</span>
            </span>
            <span className="hidden md:inline text-slate-400 text-[11px] font-medium">
              • {roleInfo.subtitle}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

          {/* User profile capsule */}
          <div className="flex items-center gap-2">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-5 h-5 rounded-full object-cover border border-slate-600"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            <span className="text-slate-200 font-bold text-xs truncate max-w-[120px] sm:max-w-none">
              {user.name}
            </span>
            {user.workerTier && (
              <span className="hidden sm:inline text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {user.workerTier}
              </span>
            )}
          </div>
        </div>

        {/* Right: Switch Role Quick-Menu, Language & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Quick Role Switcher for seamless evaluation */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSwitchMenuOpen(!isSwitchMenuOpen)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-bold transition cursor-pointer"
              title="Switch Portal for Evaluation"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">Switch Portal</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isSwitchMenuOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-64 bg-[#0E172A] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsSwitchMenuOpen(false)}
              >
                <div className="px-2 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Switch Portal View:
                </div>
                {DEMO_ACCOUNTS.map((account) => {
                  const isCurrent = account.role === currentRole;
                  const Icon = account.role === 'customer' ? User : account.role === 'worker' ? HardHat : Building2;
                  return (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => switchRole(account.role)}
                      className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between text-xs cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-800 text-white font-black'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <div>
                          <div className="font-bold">{account.roleLabel}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{account.label}</div>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] text-cyan-400 font-bold">Active</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Regional Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 py-1 px-2.5 rounded-lg border border-slate-700">
            <Globe className="w-3 h-3 text-[#00D2FF]" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LanguageCode)}
              className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
              aria-label="Language Selector"
            >
              <option value="en" className="bg-slate-900 text-white">EN</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी</option>
              <option value="ta" className="bg-slate-900 text-white">தமிழ்</option>
              <option value="te" className="bg-slate-900 text-white">తెలుగు</option>
              <option value="bn" className="bg-slate-900 text-white">বাংলা</option>
              <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ</option>
              <option value="mr" className="bg-slate-900 text-white">मराठी</option>
            </select>
          </div>

          {/* Return to Matching Login Gateway */}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 bg-sky-950/80 hover:bg-sky-900 text-sky-300 hover:text-white px-2.5 py-1 rounded-lg border border-sky-600/40 text-xs font-bold transition cursor-pointer"
            title="Return to User Login Portal"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#00D2FF]" />
            <span className="hidden sm:inline">Login Portal</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-900/40 text-xs font-bold transition cursor-pointer"
            title="Log Out of Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
