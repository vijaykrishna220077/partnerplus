import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const ProLoginModal: React.FC<ProLoginModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin();
      onClose();
    }, 600);
  };

  const handleDemoLogin = () => {
    setEmail('crew.lead@partnerplus.com');
    setPassword('••••••••••••');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccessLogin();
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#0A1226] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-[#00D2FF] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3 h-3" />
            <span>Authorized Crew Access</span>
          </div>
          <h3 className="text-xl font-black font-display text-white">Pro Portal Login</h3>
          <p className="text-xs text-gray-300 mt-1">
            Access daily commercial routes, dispatch tickets, and automated invoice clearance.
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700">Technician Email</label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tech@partnerplus.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D68ED]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">PIN / Password</label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D68ED]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#1D68ED] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In to Crew Portal'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative px-2 bg-white text-[11px] text-gray-400 font-medium">
              Demo Access
            </span>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            ⚡ One-Click Demo Pro Login
          </button>
        </form>
      </div>
    </div>
  );
};
