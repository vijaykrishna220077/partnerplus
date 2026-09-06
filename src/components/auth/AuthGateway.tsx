import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole, LanguageCode } from '../../types';
import { PartnerPlusLogo } from '../PartnerPlusLogo';
import { 
  Building2, 
  User, 
  HardHat, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Sparkles, 
  Droplets,
  Truck,
  Building,
  Eye,
  EyeOff,
  Star,
  Check,
  UserPlus
} from 'lucide-react';
import { AccountTypeSelector, OnboardingRoleType } from './AccountTypeSelector';
import { CustomerRegistration } from './CustomerRegistration';
import { WorkerRegistration } from './WorkerRegistration';
import { OrganizationRegistration } from './OrganizationRegistration';
import { CooperativeRegistration } from './CooperativeRegistration';
import { CooperativePendingApprovalView } from '../cooperative/auth/CooperativePendingApprovalView';

interface AuthGatewayProps {
  initialMode?: 'login' | 'signup';
  initialRole?: UserRole;
  onBackToWelcome?: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  initialMode = 'login',
  initialRole = 'customer',
  onBackToWelcome
}) => {
  const { loginWithCredentials, signup, loginOrganization, signupOrganization, switchRole } = useAuth();
  const { lang, setLang, setRole } = useApp();

  // Mode: Sign In vs Create Account / Join Pro
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  
  // Registration sub-view state
  const [signupSubView, setSignupSubView] = useState<'selector' | 'customer' | 'worker' | 'organization' | 'cooperative' | 'coop_pending'>('selector');
  const [coopApprovalReqId, setCoopApprovalReqId] = useState<string>('');
  
  // User account type
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole); // Default to Commercial Client for real user flow
  
  // Credentials
  const [identifier, setIdentifier] = useState('sarah.jenkins@highpointcorp.com');
  const [password, setPassword] = useState('partnerplus2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [city, setCity] = useState('Coimbatore');
  const [orgType, setOrgType] = useState('Facility Management');
  const [specialty, setSpecialty] = useState('Commercial Pressure Washing');
  const [serviceTerritory, setServiceTerritory] = useState('Dallas-Fort Worth Metro');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // When changing account type, update default email
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    setInfoMessage('');
    if (role === 'customer') {
      setIdentifier('sarah.jenkins@highpointcorp.com');
    } else if (role === 'worker') {
      setIdentifier('marcus.pro@partnerpluscleaning.com');
    } else if (role === 'organization_admin') {
      setIdentifier('priya.n@ltfacilities.co.in');
    } else {
      setIdentifier('dave.robertson@partnerplusdispatch.com');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setInfoMessage('');

    if (selectedRole === 'organization_admin') {
      const loginId = identifier.trim() || 'priya.n@ltfacilities.co.in';
      const res = await loginOrganization(loginId, password || 'partnerplus2025', 'ORGANIZATION_ADMIN');
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Company authentication failed. Check credentials.');
      }
      return;
    }

    const loginId = identifier.trim() || (
      selectedRole === 'customer' 
        ? 'sarah.jenkins@highpointcorp.com' 
        : selectedRole === 'worker' 
        ? 'marcus.pro@partnerpluscleaning.com' 
        : 'dave.robertson@partnerplusdispatch.com'
    );

    const res = await loginWithCredentials(
      loginId,
      password || 'secure123',
      selectedRole
    );
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.message || 'Authentication failed. Please verify your email and password.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (selectedRole === 'organization_admin') {
      if (!companyName.trim() || !name.trim()) {
        setLoading(false);
        setErrorMessage('Please provide Company Name and Authorized Contact Person');
        return;
      }
      const res = await signupOrganization({
        name: companyName,
        registeredName: companyName,
        type: orgType as any,
        registrationNumber: registrationNo || 'CIN-PENDING-2026',
        contactPerson: name,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: phone || '+91 98422 77110',
        address: `${city} Commercial Corridor`,
        city,
        serviceArea: `${city} Metro Zone`,
        description: `Enterprise workforce hiring registration for ${companyName}`
      });
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.message || 'Company registration failed.');
      }
      return;
    }

    if (!name.trim()) {
      setLoading(false);
      setErrorMessage('Please enter your full name or legal business name');
      return;
    }

    const res = await signup({
      name,
      email: email || `${phone.replace(/\D/g, '') || 'client'}@partnerpluscleaning.com`,
      phone: phone || '214-550-5563',
      role: selectedRole,
      primaryTrade: selectedRole === 'worker' ? specialty : undefined,
      workerTier: selectedRole === 'worker' ? 'skilled' : undefined,
      cooperativeName: 'PartnerPlus Commercial Labour Welfare Cooperative',
      cooperativeRegNo: 'TX-DFW-4892',
      city: 'Dallas-Fort Worth'
    });
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.message || 'Registration could not be completed.');
    }
  };

  const handleForgotPassword = () => {
    setInfoMessage(`Password reset instructions sent to ${identifier || 'your email'}. Check your inbox.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF8FE] via-white to-[#DCF3FD] text-[#0F172A] flex flex-col justify-between selection:bg-[#00D2FF] selection:text-black">
      
      {/* ========================================================================= */}
      {/* NAVIGATION HEADER                                                         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div onClick={onBackToWelcome} className={onBackToWelcome ? "cursor-pointer" : ""}>
                <PartnerPlusLogo />
              </div>
              {onBackToWelcome && (
                <button
                  type="button"
                  onClick={onBackToWelcome}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#1D68ED] hover:underline bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 cursor-pointer ml-2"
                >
                  <span>← Back to Home</span>
                </button>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-gray-700">
              <span className="text-gray-500 font-medium">Commercial Services:</span>
              <button 
                type="button" 
                onClick={() => { setSelectedRole('customer'); }}
                className="hover:text-[#1D68ED] transition cursor-pointer flex items-center gap-1.5"
              >
                <Droplets className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>Power Wash</span>
              </button>
              <button 
                type="button" 
                onClick={() => { setSelectedRole('customer'); }}
                className="hover:text-[#1D68ED] transition cursor-pointer flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-[#1D68ED]" />
                <span>Fleet Wash</span>
              </button>
              <button 
                type="button" 
                onClick={() => { setSelectedRole('customer'); }}
                className="hover:text-[#1D68ED] transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>Window Wash</span>
              </button>
              <span className="text-gray-300 font-normal">|</span>
              <span className="text-xs text-gray-500">DFW &amp; North Texas</span>
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Phone Helpline */}
              <a 
                href="tel:2145505563" 
                className="hidden sm:inline-flex items-center gap-1.5 text-xs md:text-sm font-extrabold text-gray-900 hover:text-[#1D68ED] transition"
              >
                <Phone className="w-4 h-4 text-[#1D68ED] fill-[#1D68ED]/20" />
                <span>214-550-5563</span>
              </a>

              {/* Language Selector */}
              <div className="hidden md:flex items-center gap-1.5 bg-gray-50 py-1.5 px-2.5 rounded-full border border-gray-200 text-xs">
                <Globe className="w-3.5 h-3.5 text-[#1D68ED]" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as LanguageCode)}
                  className="bg-transparent text-gray-800 text-xs font-bold focus:outline-none cursor-pointer"
                  aria-label="Portal Language"
                >
                  <option value="en">English (US)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
              </div>

              {/* Worker Login Link */}
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setSelectedRole('worker'); handleRoleChange('worker'); }}
                className={`text-xs sm:text-sm font-black transition px-3 py-1.5 rounded-full cursor-pointer ${
                  authMode === 'login' && selectedRole === 'worker'
                    ? 'text-[#1D68ED] bg-blue-50 ring-2 ring-[#1D68ED]/20'
                    : 'text-gray-800 hover:text-[#1D68ED]'
                }`}
              >
                Worker Login
              </button>

              {/* Register / Choose Account Type */}
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setSignupSubView('selector'); }}
                className={`text-xs sm:text-sm font-black transition px-3 py-1.5 rounded-full cursor-pointer ${
                  authMode === 'signup'
                    ? 'text-[#1D68ED] bg-blue-50 ring-2 ring-[#1D68ED]/20'
                    : 'text-gray-800 hover:text-[#1D68ED]'
                }`}
              >
                Register
              </button>

              {/* Join As Worker Button */}
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setSignupSubView('worker'); }}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#00D2FF] hover:bg-[#33EBFF] text-black font-extrabold rounded-full text-xs sm:text-sm tracking-tight shadow-sm hover:shadow-md transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join As Worker</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SIGNUP WORKFLOW vs LOGIN MAIN SECTION                                     */}
      {/* ========================================================================= */}
      {authMode === 'signup' ? (
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
          {signupSubView === 'selector' && (
            <AccountTypeSelector
              onSelectRole={(role) => setSignupSubView(role)}
              onBackToLogin={() => { setAuthMode('login'); setSignupSubView('selector'); }}
            />
          )}

          {signupSubView === 'customer' && (
            <CustomerRegistration
              onBack={() => setSignupSubView('selector')}
              onSuccess={() => {
                setAuthMode('login');
                setSignupSubView('selector');
                setSelectedRole('customer');
                setInfoMessage('Customer profile registered successfully! Please sign in with your phone number or email.');
              }}
            />
          )}

          {signupSubView === 'worker' && (
            <WorkerRegistration
              onBack={() => setSignupSubView('selector')}
              onSuccess={() => {
                switchRole('worker');
                setRole('worker');
                if (onBackToWelcome) {
                  onBackToWelcome();
                }
              }}
            />
          )}

          {signupSubView === 'organization' && (
            <OrganizationRegistration
              onBack={() => setSignupSubView('selector')}
              onSuccess={() => {
                setAuthMode('login');
                setSignupSubView('selector');
                setSelectedRole('organization_admin');
                setInfoMessage('Enterprise profile registered! You may now sign in to post workforce requirements.');
              }}
            />
          )}

          {signupSubView === 'cooperative' && (
            <CooperativeRegistration
              onBack={() => setSignupSubView('selector')}
              onSuccess={(reqId) => {
                setCoopApprovalReqId(reqId);
                setSignupSubView('coop_pending');
              }}
            />
          )}

          {signupSubView === 'coop_pending' && (
            <CooperativePendingApprovalView
              requestId={coopApprovalReqId}
              onEnterPortal={() => {
                window.history.pushState({}, '', '/cooperative');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              onReturnToHome={() => {
                setAuthMode('login');
                setSignupSubView('selector');
              }}
            />
          )}
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-200/30 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Top Eyebrow Badge */}
        <div className="text-center mb-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs sm:text-sm font-black tracking-wider uppercase shadow-xs mb-3">
            <Building className="w-3.5 h-3.5 text-[#1D68ED]" />
            <span>THE STANDARD FOR COMMERCIAL SERVICES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight font-display">
            {authMode === 'login' ? 'Sign In to Your Account' : 'Create Your PartnerPlus Account'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 font-medium">
            {authMode === 'login' 
              ? 'Access scheduled pressure washing, fleet wash services, and commercial facility management.'
              : 'Join the commercial exterior cleaning network as a verified worker or commercial client.'}
          </p>
        </div>

        {/* Real User-Style Login Card (Clean Split-Screen with Brand Visual) */}
        <div className="w-full max-w-4xl bg-white border border-sky-100 rounded-3xl shadow-xl shadow-sky-500/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* ------------------------------------------------------------- */}
          {/* LEFT COLUMN: Clean Brand & Trust Showcase                     */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1528] via-[#111F38] to-[#152B52] text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <PartnerPlusLogo isLight={true} />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug font-display">
                Commercial Exterior Cleaning &amp; Facility Care
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Trusted by leading facility directors, commercial property managers, and certified exterior cleaning specialists across North Texas.
              </p>

              {/* Brand Trust Guarantees */}
              <div className="mt-6 space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-200">
                    <strong className="text-white block font-bold">$2,000,000 Liability Coverage</strong>
                    Fully insured on every commercial work site.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-[#00D2FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-200">
                    <strong className="text-white block font-bold">Vetted &amp; Certified Technicians</strong>
                    Background-verified workers with commercial equipment.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-slate-200">
                    <strong className="text-white block font-bold">Guaranteed On-Time Dispatch</strong>
                    24/7 emergency response for grease, spills &amp; wash.
                  </span>
                </div>
              </div>

              {/* Client Testimonial */}
              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <p className="italic text-slate-200 leading-relaxed text-[11px]">
                  &ldquo;PartnerPlus handles all parking garage pressure washing and window cleaning for our corporate campuses. Seamless billing and outstanding quality.&rdquo;
                </p>
                <span className="block mt-2 font-bold text-white text-[11px]">
                  — Facilities Management, Highpoint Corporate Towers
                </span>
              </div>
            </div>

            {/* Direct Support Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Commercial Support:</span>
              <a href="tel:2145505563" className="font-bold text-[#00D2FF] hover:underline flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>214-550-5563</span>
              </a>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT COLUMN: Clean, User-Friendly Login / Sign-Up Form       */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Account Type Segmented Tabs (Clean User Style) */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-gray-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('customer')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-black transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      selectedRole === 'customer'
                        ? 'bg-white text-[#1D68ED] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Commercial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('worker')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-black transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      selectedRole === 'worker'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <HardHat className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Workers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('organization_admin')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-black transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      selectedRole === 'organization_admin'
                        ? 'bg-white text-amber-700 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Company / Org</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('cooperative_admin')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-black transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                      selectedRole === 'cooperative_admin'
                        ? 'bg-white text-purple-700 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Admin Officials</span>
                  </button>
                </div>
              </div>

              {/* Notifications */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {infoMessage && (
                <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1D68ED] shrink-0" />
                  <span>{infoMessage}</span>
                </div>
              )}

              {/* 1. SIGN IN FORM */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      {selectedRole === 'customer' && 'Email Address or Account Phone'}
                      {selectedRole === 'worker' && 'Worker Email or Mobile Dispatch Number'}
                      {selectedRole === 'organization_admin' && 'Company Official Email (e.g. priya.n@ltfacilities.co.in)'}
                      {selectedRole === 'cooperative_admin' && 'Admin Official Email or Username'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. name@company.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D68ED] focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] font-bold text-[#1D68ED] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D68ED] focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-gray-300 text-[#1D68ED] focus:ring-[#1D68ED]"
                      />
                      <span>Remember my account</span>
                    </label>
                    <span className="text-[11px] text-gray-400">Insured 256-bit SSL</span>
                  </div>

                  {/* Clean Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 bg-[#1D68ED] hover:bg-[#1554C7] text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <span>
                          {selectedRole === 'customer' && 'Sign In to Client Portal'}
                          {selectedRole === 'worker' && 'Sign In to Worker Portal'}
                          {selectedRole === 'organization_admin' && 'Sign In to Company Portal'}
                          {selectedRole === 'cooperative_admin' && 'Sign In to Admin Officials Console'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* 2. SIGN UP / REGISTRATION FORM */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {selectedRole === 'organization_admin' 
                          ? 'Authorized Representative Name' 
                          : selectedRole === 'customer' 
                          ? 'Full Name / Facility Lead' 
                          : 'Full Name / Worker Lead'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Narayanan"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00D2FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98422 77110"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00D2FF]"
                      />
                    </div>
                  </div>

                  {selectedRole === 'organization_admin' ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Registered Company / Entity Name
                          </label>
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. L&T Kovai Facilities Pvt Ltd"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00D2FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Organization Type
                          </label>
                          <select
                            value={orgType}
                            onChange={(e) => setOrgType(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00D2FF]"
                          >
                            <option value="Facility Management">Facility Management</option>
                            <option value="Contractor">Commercial Contractor</option>
                            <option value="Factory">Factory / Manufacturing Unit</option>
                            <option value="Warehouse">Warehouse / Logistics Hub</option>
                            <option value="Housing Society">Gated Community / Housing Society</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Company CIN / Registration No
                          </label>
                          <input
                            type="text"
                            value={registrationNo}
                            onChange={(e) => setRegistrationNo(e.target.value)}
                            placeholder="e.g. CIN-U45200TN2012PTC087654"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00D2FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Operational District / City
                          </label>
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00D2FF]"
                          >
                            <option value="Coimbatore">Coimbatore</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Madurai">Madurai</option>
                            <option value="Salem">Salem</option>
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {selectedRole === 'customer' ? 'Business / Property Name' : 'Company or Business Trade'}
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Highpoint Corporate Plaza"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00D2FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Primary Service Requirement
                        </label>
                        <select
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00D2FF]"
                        >
                          <option value="Commercial Pressure Washing">Commercial Pressure Washing (Concrete, Garage, Plaza)</option>
                          <option value="High-Rise Window Detailing">Window Washing &amp; Architectural Glass Detailing</option>
                          <option value="Fleet Wash Specialist">Commercial Fleet Washing (Trucks, Vans &amp; Equipment)</option>
                          <option value="Industrial Surface Scrubbing">Floor Scrubbing &amp; Warehouse Degreasing</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Clean Registration Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 bg-[#00D2FF] hover:bg-[#33EBFF] text-black font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                    ) : (
                      <>
                        <span>
                          {selectedRole === 'customer' 
                            ? 'Register Commercial Account' 
                            : selectedRole === 'organization_admin'
                            ? 'Register Enterprise / Company Account'
                            : 'Submit Worker Application'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Mode Switch Link */}
              <div className="mt-5 text-center text-xs text-gray-600">
                {authMode === 'login' ? (
                  <span>
                    Don&apos;t have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setSignupSubView('selector'); setErrorMessage(''); setInfoMessage(''); }}
                      className="font-bold text-[#1D68ED] hover:underline cursor-pointer"
                    >
                      Create one now
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setErrorMessage(''); setInfoMessage(''); }}
                      className="font-bold text-[#1D68ED] hover:underline cursor-pointer"
                    >
                      Sign in here
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Clean Trust Card Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>$2M Commercial Liability</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1D68ED]" />
                <span>Verified Professionals</span>
              </span>
              <span className="text-gray-400">
                Dallas-Fort Worth, TX
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* QUALITY ASSURANCE PILLARS                                                 */}
        {/* ========================================================================= */}
        <div className="w-full max-w-4xl mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-sky-100 shadow-xs">
            <span className="text-base font-black text-[#0F172A] block font-display">100% Insured</span>
            <span className="text-[11px] text-gray-500 font-medium">Commercial Grade Verified</span>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-sky-100 shadow-xs">
            <span className="text-base font-black text-[#00A8E8] block font-display">Zero Middleman</span>
            <span className="text-[11px] text-gray-500 font-medium">Direct Cooperative Payout</span>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-sky-100 shadow-xs">
            <span className="text-base font-black text-[#1D68ED] block font-display">15-Min SOS</span>
            <span className="text-[11px] text-gray-500 font-medium">Emergency Spill &amp; Wash</span>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-sky-100 shadow-xs">
            <span className="text-base font-black text-emerald-600 block font-display">214-550-5563</span>
            <span className="text-[11px] text-gray-500 font-medium">24/7 Commercial Dispatch</span>
          </div>
        </div>

      </main>
      )}

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="w-full border-t border-sky-200/60 bg-gradient-to-t from-sky-100/50 to-transparent py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PartnerPlusLogo isLight={false} />
            <span className="text-gray-400 hidden sm:inline">•</span>
            <span className="text-[11px] text-gray-600">
              The Standard for Commercial Pressure Washing, Window Cleaning &amp; Fleet Wash
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-700">
            <a href="tel:2145505563" className="hover:text-[#1D68ED]">Dispatch: 214-550-5563</a>
            <span className="text-gray-300">|</span>
            <span>Dallas-Fort Worth &amp; Metro Hubs</span>
            <span className="text-gray-300">|</span>
            <span>© 2026 PartnerPlus Co-op</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
