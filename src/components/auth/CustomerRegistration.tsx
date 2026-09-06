import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  MapPin, 
  Globe, 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { onboardingService } from '../../services/onboardingService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface CustomerRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CustomerRegistration: React.FC<CustomerRegistrationProps> = ({
  onBack,
  onSuccess
}) => {
  const { loginWithCredentials } = useAuth();
  const { addToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Step 1: Basic Info
  const [fullName, setFullName] = useState<string>('Ananya Sharma');
  const [phone, setPhone] = useState<string>('+91 94440 12345');
  const [email, setEmail] = useState<string>('ananya.sharma@gmail.com');
  const [password, setPassword] = useState<string>('Customer2026#');
  const [confirmPassword, setConfirmPassword] = useState<string>('Customer2026#');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Step 2: Location
  const [address, setAddress] = useState<string>('42, 4th Main Road, Besant Nagar');
  const [city, setCity] = useState<string>('Chennai');
  const [state, setState] = useState<string>('Tamil Nadu');
  const [postalCode, setPostalCode] = useState<string>('600090');

  // Step 3: Preferences
  const [preferredLanguage, setPreferredLanguage] = useState<string>('en');
  const [smsNotify, setSmsNotify] = useState<boolean>(true);
  const [whatsappNotify, setWhatsappNotify] = useState<boolean>(true);
  const [inAppNotify, setInAppNotify] = useState<boolean>(true);

  // Step 4: OTP Verification & Terms
  const [otpCode, setOtpCode] = useState<string>('842910');
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (step === 4 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const pwdScore = getPasswordStrength(password);

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!fullName.trim() || !phone.trim() || !email.trim() || !password) {
        setErrorMsg('Please complete all required fields in Step 1.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters long.');
        return;
      }
      // Check duplicate
      const dup = onboardingService.checkDuplicate(email, phone);
      if (dup.duplicate) {
        setErrorMsg(dup.message || 'Email or phone already registered.');
        return;
      }
    } else if (step === 2) {
      if (!address.trim() || !city.trim() || !postalCode.trim()) {
        setErrorMsg('Please provide your complete address and postal PIN code.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.length < 4) {
      setErrorMsg('Please enter the 6-digit verification code sent to your phone.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const res = await onboardingService.registerCustomer({
        fullName,
        phone,
        email,
        address,
        city,
        state,
        postalCode,
        preferredLanguage,
        notificationPreferences: {
          sms: smsNotify,
          whatsapp: whatsappNotify,
          in_app: inAppNotify
        }
      });

      if (!res.success) {
        setLoading(false);
        setErrorMsg(res.message || 'Registration failed.');
        return;
      }

      // Automatically authenticate customer and enter portal
      await loginWithCredentials(email, password, 'customer');

      addToast({
        type: 'success',
        title: 'Customer Account Created',
        message: 'Welcome to PartnerPlus! Verified trade artisans are ready for dispatch.'
      });

      setLoading(false);
      onSuccess();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred during customer signup.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <button
          type="button"
          onClick={() => {
            if (step > 1) {
              setStep(prev => prev - 1);
            } else {
              onBack();
            }
          }}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full">
            CUSTOMER SIGN UP
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Register for Sahakari Services
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-400">
            Step {step} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
        <div 
          className="bg-blue-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Legal Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number (for SMS &amp; Dispatch OTP) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98400 00000"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Create Account Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Password Strength Indicator */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500">Security Strength:</span>
              <span className={`font-bold font-mono ${
                pwdScore >= 3 ? 'text-emerald-500' : pwdScore === 2 ? 'text-amber-500' : 'text-rose-500'
              }`}>
                {pwdScore >= 3 ? 'Strong' : pwdScore === 2 ? 'Moderate' : 'Weak'}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  pwdScore >= 3 ? 'bg-emerald-500 w-full' : pwdScore === 2 ? 'bg-amber-500 w-2/3' : 'bg-rose-500 w-1/3'
                }`}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <span>Proceed to Address &amp; Location</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Address & Service Location */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Premises Street Address / House / Flat No. <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door No, Building Name, Street"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PIN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="600001"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span>
              Your exact address is only shared with the verified artisan once you confirm a dispatch booking.
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="w-2/3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Next: Preferences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preferences */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Preferred Language for Portal &amp; Worker Communication
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              >
                <option value="en">English (Official Interface)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Notification Channels
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer bg-slate-50/50 dark:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={whatsappNotify}
                  onChange={(e) => setWhatsappNotify(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <div className="text-xs">
                  <strong className="text-slate-900 dark:text-white block font-semibold">WhatsApp Live Tracking</strong>
                  <span className="text-slate-500">Receive artisan arrival updates, booking PIN, and digital invoice on WhatsApp.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer bg-slate-50/50 dark:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={smsNotify}
                  onChange={(e) => setSmsNotify(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <div className="text-xs">
                  <strong className="text-slate-900 dark:text-white block font-semibold">SMS Dispatch Alerts</strong>
                  <span className="text-slate-500">Critical emergency dispatch alerts and OTPs via telecom SMS.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="w-2/3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Next: Verification &amp; Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Verification & Terms Agreement */}
      {step === 4 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-900 dark:text-blue-300">
                MOBILE OTP VERIFICATION
              </span>
              <span className="text-[11px] text-blue-600 font-mono font-bold">
                SIMULATED SECURE CODE
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              We sent a 6-digit confirmation code to <strong className="font-mono text-slate-900 dark:text-white">{phone}</strong>.
            </p>

            <div>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="842910"
                className="w-full text-center tracking-widest text-lg font-mono font-black py-2.5 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 rounded-xl text-blue-900 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Code expired?'}
              </span>
              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={() => {
                  setResendTimer(30);
                  setOtpCode('519302');
                  addToast({ type: 'info', title: 'Code Resent', message: 'New 6-digit code: 519302' });
                }}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline disabled:opacity-50 cursor-pointer"
              >
                Resend Code
              </button>
            </div>
          </div>

          {/* Terms & Privacy */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded text-blue-600 mt-1 shrink-0"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                I agree to the <strong className="text-slate-900 dark:text-white">PartnerPlus Customer Terms</strong>, transparent cooperative pricing policies, and privacy protection protocols.
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Customer Registration</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
