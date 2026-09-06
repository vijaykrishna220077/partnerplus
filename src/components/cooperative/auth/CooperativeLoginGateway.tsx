import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { mockCooperatives } from '../../../data/mockData';
import { CooperativeStaffRole } from '../../../types';
import { 
  Building2, 
  ShieldAlert, 
  Lock, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface CooperativeLoginGatewayProps {
  isUnauthorizedAttempt?: boolean;
  onReturnToNormalPortal?: () => void;
  onLoginSuccess?: () => void;
}

export const CooperativeLoginGateway: React.FC<CooperativeLoginGatewayProps> = ({
  isUnauthorizedAttempt = false,
  onReturnToNormalPortal,
  onLoginSuccess
}) => {
  const { user, loginCooperative, logout } = useAuth();
  
  const [showUnauthorizedWarning, setShowUnauthorizedWarning] = useState<boolean>(
    isUnauthorizedAttempt && !!user && user.role !== 'cooperative_admin'
  );

  // Login form state
  const [selectedCoopId, setSelectedCoopId] = useState<string>('coop-1');
  const [staffRole, setStaffRole] = useState<CooperativeStaffRole>('COOPERATIVE_ADMIN');
  const [identifier, setIdentifier] = useState<string>('admin.ramanathan@chennailabourcoop.org');
  const [password, setPassword] = useState<string>('coop2026admin');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectedCoop = mockCooperatives.find(c => c.id === selectedCoopId) || mockCooperatives[0];

  const handleRoleSelection = (role: CooperativeStaffRole) => {
    setStaffRole(role);
    setErrorMessage('');
    if (role === 'COOPERATIVE_ADMIN') {
      setIdentifier('admin.ramanathan@chennailabourcoop.org');
      setPassword('coop2026admin');
    } else {
      setIdentifier('ops.senthil@chennailabourcoop.org');
      setPassword('staff2026ops');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const res = await loginCooperative(identifier, password, selectedCoopId, staffRole);
    setLoading(false);

    if (res.success) {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setErrorMessage(res.message || 'Authentication failed: Invalid credentials or role clearance.');
    }
  };

  // If unauthorized user attempted to access the terminal
  if (showUnauthorizedWarning && user) {
    return (
      <div className="min-h-screen bg-[#090E1A] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-lg bg-[#0F172A] border border-rose-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800 inline-block">
              SECURITY CLEARANCE RESTRICTED
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono uppercase">
              Unauthorized Access
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              This terminal is reserved exclusively for registered cooperative society officials (<span className="text-white font-mono font-bold">COOPERATIVE_ADMIN</span> or <span className="text-white font-mono font-bold">COOPERATIVE_STAFF</span>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1E293B]/70 border border-slate-800 text-left text-xs font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Current Authenticated User:</span>
              <span className="text-white font-bold">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active Role Profile:</span>
              <span className="text-amber-400 font-bold uppercase">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Required Clearance:</span>
              <span className="text-rose-400 font-bold">COOPERATIVE OFFICIAL</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (onReturnToNormalPortal) {
                  onReturnToNormalPortal();
                } else {
                  window.history.pushState({}, '', '/');
                  window.location.hash = '';
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Return to My {user.role === 'customer' ? 'Customer' : 'Worker'} Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                setShowUnauthorizedWarning(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Sign In as Cooperative Official
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Official Cooperative Login Form
  return (
    <div className="min-h-screen bg-[#0A0F1D] flex flex-col justify-center items-center p-4 selection:bg-purple-600 selection:text-white">
      <div className="w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-white">
        
        {/* Emblem & Portal Identity */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg text-2xl font-black border border-purple-400/30">
            🏛️
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono uppercase">
            PARTNERPLUS
          </h1>
          <p className="text-xs text-purple-400 font-mono font-bold uppercase tracking-wider">
            Official Cooperative Operations Portal
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Authorized administrative terminal for member governance, real-time dispatch, financial reconciliation, and artisan verification.
          </p>
        </div>

        {/* Evaluation Quick-Fill Pills */}
        <div className="p-3.5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>OFFICIAL DEMO PRESETS:</span>
            <span className="text-emerald-400 font-bold">1-Click Evaluation</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => handleRoleSelection('COOPERATIVE_ADMIN')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                staffRole === 'COOPERATIVE_ADMIN'
                  ? 'bg-purple-950/60 border-purple-500 text-white shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-white text-xs">K. S. Ramanathan</div>
              <div className="text-[10px] text-purple-400">COOPERATIVE_ADMIN (Full)</div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelection('COOPERATIVE_STAFF')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                staffRole === 'COOPERATIVE_STAFF'
                  ? 'bg-indigo-950/60 border-indigo-500 text-white shadow'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-white text-xs">P. Senthil Murugan</div>
              <div className="text-[10px] text-indigo-400">COOPERATIVE_STAFF (Operations)</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Registered Cooperative Selector */}
          <div>
            <label className="text-xs font-mono font-bold uppercase text-slate-300 block mb-1.5">
              Registered Cooperative Society Jurisdiction
            </label>
            <select
              value={selectedCoopId}
              onChange={(e) => setSelectedCoopId(e.target.value)}
              className="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            >
              {mockCooperatives.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.registrationNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Official Identifier */}
          <div>
            <label className="text-xs font-mono font-bold uppercase text-slate-300 block mb-1.5">
              Official Email / Staff Identity ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full bg-[#111827] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Password / Security Key */}
          <div>
            <label className="text-xs font-mono font-bold uppercase text-slate-300 block mb-1.5">
              Security Access Key / PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#111827] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying Cooperative Credentials...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate into Cooperative Control Center</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            Protected under Cooperative Societies Act &amp; Multi-State Cooperative Rules. Unauthorized tampering is strictly prohibited and logged.
          </p>
        </div>
      </div>
    </div>
  );
};
