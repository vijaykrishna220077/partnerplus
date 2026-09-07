import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Mail, Lock, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export const QuickSupabaseSignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client-side validations
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (!supabase) {
        throw new Error('Supabase client is not initialized. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
      }

      // Call Supabase Auth signUp method
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
          setErrorMessage('This email address is already in use. Please log in or use a different email.');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data.user) {
        // Check if email confirmation is required (session is null when email confirmation is active)
        if (data.user.identities && data.user.identities.length === 0) {
          setErrorMessage('This email is already registered. Please log in.');
        } else if (!data.session) {
          setSuccessMessage(`Account created successfully! Please check your email (${email}) for a confirmation link to activate your account.`);
        } else {
          setSuccessMessage(`Registration complete! User ID: ${data.user.id}. You can now access your account.`);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-5 font-sans">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-500">Sign up using Supabase Authentication</p>
      </div>

      {/* Error Alert Message */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Success Alert Message (Email Confirmation Alert) */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-800 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm text-emerald-950">Registration Successful</div>
            <div className="text-emerald-700 leading-relaxed">{successMessage}</div>
          </div>
        </div>
      )}

      {!successMessage && (
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Email Input Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
            </div>
            <p className="text-[10px] text-slate-400">Must be at least 6 characters long.</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Registering in Supabase Auth...</span>
              </>
            ) : (
              <>
                <span>Register User</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
