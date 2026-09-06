import React from 'react';
import { PartnerPlusLogo } from '../PartnerPlusLogo';
import { useApp } from '../../context/AppContext';
import { LanguageCode, UserRole } from '../../types';
import { 
  User, 
  HardHat, 
  Building2, 
  Building, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Droplets,
  Truck,
  Phone,
  Globe,
  CheckCircle2,
  HeartHandshake,
  Receipt,
  Zap,
  Wrench
} from 'lucide-react';

interface WelcomePageProps {
  onNavigateToAuth: (mode?: 'login' | 'signup', role?: UserRole) => void;
  onNavigateToCooperative?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onNavigateToAuth,
  onNavigateToCooperative
}) => {
  const { lang, setLang } = useApp();

  const servicesList = [
    {
      id: 'electrical',
      name: 'Electrical & Power Wiring',
      desc: 'Distribution box repairs, 16A switches, circuit testing & commercial wiring.',
      icon: Zap,
      badge: 'Popular',
      color: 'bg-amber-500'
    },
    {
      id: 'plumbing',
      name: 'Plumbing & Sanitation',
      desc: 'Pipeline overhaul, overhead valve repairs, leak detection & fixture installs.',
      icon: Droplets,
      badge: '24/7 Dispatch',
      color: 'bg-blue-500'
    },
    {
      id: 'pressure_wash',
      name: 'Commercial Pressure Wash',
      desc: 'Building exterior wash, roof cleaning, pavement degreasing & graffiti removal.',
      icon: Sparkles,
      badge: 'Eco-Friendly',
      color: 'bg-cyan-500'
    },
    {
      id: 'fleet_wash',
      name: 'Fleet & Transit Wash',
      desc: 'On-site mobile truck washing, logistics fleet sanitization & steam detailing.',
      icon: Truck,
      badge: 'Bulk Rates',
      color: 'bg-indigo-500'
    },
    {
      id: 'carpentry',
      name: 'Carpentry & Woodwork',
      desc: 'Door latching, modular fitting repairs, custom shelving & furniture assembly.',
      icon: Wrench,
      badge: 'Certified',
      color: 'bg-emerald-500'
    },
    {
      id: 'facility_mgmt',
      name: 'Facility Management',
      desc: 'Enterprise crew deployments, factory floor maintenance & event site cleanup.',
      icon: Building,
      badge: 'Enterprise',
      color: 'bg-purple-500'
    }
  ];

  const portalCards = [
    {
      role: 'customer' as UserRole,
      badge: 'COMMERCIAL & HOUSEHOLD',
      title: 'Customer Portal',
      subtitle: 'Book Verified Artisans',
      description: 'Instant auto-location booking, real-time worker route map tracking, Razorpay escrow protection, and 5% GST audited tax invoices.',
      icon: User,
      gradient: 'from-blue-600 to-cyan-600',
      btnText: 'Book Service Now',
      features: ['Live GPS Route Map', '5% GST Tax Invoices', 'Direct Worker Calling']
    },
    {
      role: 'worker' as UserRole,
      badge: 'ARTISANS & DAILY WORKERS',
      title: 'Worker Portal',
      subtitle: '95% Payout & Welfare Benefits',
      description: 'Receive verified local job alerts, live navigation to customer sites, guaranteed 95% payout, and 5% cooperative health & accident protection.',
      icon: HardHat,
      gradient: 'from-emerald-600 to-teal-600',
      btnText: 'Join as Skilled Worker',
      features: ['95% Earnings Payout', '5% Welfare & Accident Reserve', 'Real-time Arrival Navigation']
    },
    {
      role: 'organization_admin' as UserRole,
      badge: 'ENTERPRISE & CONTRACTORS',
      title: 'Company Portal',
      subtitle: 'Bulk Crew Hiring & GST Invoicing',
      description: 'Hire structured artisan crews for factories, construction sites, and facility management with GST compliance and dedicated account managers.',
      icon: Building,
      gradient: 'from-amber-600 to-orange-600',
      btnText: 'Enterprise Hiring Portal',
      features: ['Contract Compliance & GST Billing', 'Bulk Artisan Deployments', 'Audited Shift Logs']
    },
    {
      role: 'cooperative_admin' as UserRole,
      badge: 'OFFICIALS & DISPATCHERS',
      title: 'Cooperative Portal',
      subtitle: 'Society Governance & Welfare',
      description: 'State and district level admin dashboard for member verification, trade certifications, welfare fund auditing, and emergency dispatch control.',
      icon: Building2,
      gradient: 'from-purple-600 to-indigo-600',
      btnText: 'Cooperative Federation Portal',
      features: ['State Clearance Standards', 'Audited Welfare Fund', 'Emergency Dispatch Terminal']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF8FE] via-white to-[#DCF3FD] text-[#0F172A] flex flex-col justify-between selection:bg-[#00D2FF] selection:text-black">
      
      {/* ========================================================================= */}
      {/* NAVIGATION HEADER                                                         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo */}
            <div 
              onClick={() => onNavigateToAuth('login', 'customer')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <PartnerPlusLogo />
            </div>

            {/* Nav Items */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-slate-700">
              <a href="#portals" className="hover:text-[#1D68ED] transition">Portals</a>
              <a href="#services" className="hover:text-[#1D68ED] transition">Services</a>
              <a href="#how-it-works" className="hover:text-[#1D68ED] transition">How It Works</a>
              <a href="#welfare" className="hover:text-[#1D68ED] transition">Cooperative Welfare</a>
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Phone Helpline */}
              <a 
                href="tel:2145505563" 
                className="hidden sm:inline-flex items-center gap-1.5 text-xs md:text-sm font-extrabold text-slate-900 hover:text-[#1D68ED] transition"
              >
                <Phone className="w-4 h-4 text-[#1D68ED] fill-[#1D68ED]/20" />
                <span>214-550-5563</span>
              </a>

              {/* Language Selector */}
              <div className="hidden md:flex items-center gap-1.5 bg-slate-50 py-1.5 px-2.5 rounded-full border border-slate-200 text-xs">
                <Globe className="w-3.5 h-3.5 text-[#1D68ED]" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as LanguageCode)}
                  className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer"
                  aria-label="Platform Language"
                >
                  <option value="en">English (US)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
              </div>

              {/* Sign In CTA */}
              <button
                type="button"
                onClick={() => onNavigateToAuth('login', 'customer')}
                className="px-4 py-2.5 rounded-full border border-slate-300 hover:border-[#1D68ED] text-slate-800 hover:text-[#1D68ED] font-extrabold text-xs sm:text-sm transition cursor-pointer"
              >
                Sign In
              </button>

              {/* Get Started CTA */}
              <button
                type="button"
                onClick={() => onNavigateToAuth('signup', 'customer')}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#1D68ED] to-[#00D2FF] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg hover:opacity-95 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION                                                              */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-200/40 via-sky-300/30 to-blue-400/20 blur-3xl rounded-full pointer-events-none -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            {/* Platform Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-900 text-xs font-mono font-bold tracking-wide shadow-2xs animate-in fade-in slide-in-from-top-4 duration-300">
              <ShieldCheck className="w-4 h-4 text-[#1D68ED]" />
              <span>🇮🇳 SAHAKARI SEVA • COOPERATIVE GIG SERVICES PLATFORM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-display leading-[1.1]">
              Empowering Skilled Workers, Safeguarding Fair Wages &amp; Delivering Certified Services.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              India&apos;s premier transparent, government-governed gig cooperative platform connecting customers, skilled artisans, enterprises, and local societies with live GPS route map tracking, 5% GST tax billing, and 95% direct earnings protection.
            </p>

            {/* Action Button Strip */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => onNavigateToAuth('login', 'customer')}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#1D68ED] to-[#00D2FF] text-white font-black text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] transition cursor-pointer flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                <span>Book Service / Customer Portal</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateToAuth('signup', 'worker')}
                className="px-6 py-4 rounded-2xl bg-slate-900 text-white font-black text-base shadow-xl hover:bg-slate-800 hover:scale-[1.02] transition cursor-pointer flex items-center gap-2"
              >
                <HardHat className="w-5 h-5 text-emerald-400" />
                <span>Join as Skilled Artisan</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToAuth('signup', 'organization_admin')}
                className="px-6 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold text-base shadow-md hover:border-amber-500 hover:bg-amber-50/50 transition cursor-pointer flex items-center gap-2"
              >
                <Building className="w-5 h-5 text-amber-600" />
                <span>Enterprise Hiring</span>
              </button>
            </div>

            {/* Key Value Pill Highlights */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-sky-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">
                  95%
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Direct Earnings</h4>
                  <p className="text-[11px] text-slate-500">5% Welfare &amp; Reserve</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-sky-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-sm">
                  📍
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Live GPS Route</h4>
                  <p className="text-[11px] text-slate-500">Zomato-Style ETA Map</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-sky-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 font-bold text-sm">
                  🛡️
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Escrow Security</h4>
                  <p className="text-[11px] text-slate-500">Instant Razorpay Settlement</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-sky-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-sm">
                  🧾
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">5% GST Billing</h4>
                  <p className="text-[11px] text-slate-500">Official Tax Invoice</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PORTALS ACCESS CARDS                                                      */}
      {/* ========================================================================= */}
      <section id="portals" className="py-16 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-extrabold text-[#1D68ED] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Select Your Access Portal
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              Four Tailored Experience Portals
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
              Every participant receives a specialized workspace engineered for maximum security, governance, and ease of service execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portalCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (card.role === 'cooperative_admin') {
                      if (onNavigateToCooperative) {
                        onNavigateToCooperative();
                      } else {
                        onNavigateToAuth('login', 'cooperative_admin');
                      }
                    } else {
                      onNavigateToAuth('login', card.role);
                    }
                  }}
                  className="group relative bg-slate-50 rounded-3xl p-6 border border-slate-200 hover:border-[#1D68ED] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Badge */}
                    <span className="inline-block text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 uppercase">
                      {card.badge}
                    </span>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${card.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-[#1D68ED] transition">
                        {card.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">{card.subtitle}</p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {card.description}
                    </p>

                    {/* Feature Checkpoints */}
                    <ul className="space-y-2 pt-2 border-t border-slate-200/80">
                      {card.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button CTA */}
                  <div className="pt-6">
                    <button
                      type="button"
                      className="w-full py-3 px-4 rounded-2xl bg-white group-hover:bg-gradient-to-r group-hover:from-[#1D68ED] group-hover:to-[#00D2FF] group-hover:text-white border border-slate-300 group-hover:border-transparent text-slate-900 font-extrabold text-xs transition duration-200 shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>{card.btnText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* POPULAR SERVICES SHOWCASE                                                 */}
      {/* ========================================================================= */}
      <section id="services" className="py-16 bg-gradient-to-b from-white via-sky-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-[#1D68ED] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Certified Trades
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display mt-2">
                Popular Cooperative Services
              </h2>
              <p className="text-sm text-slate-600 max-w-xl font-medium mt-1">
                Book verified skilled workers backed by government cooperative skill registry and transparent standardized rates.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToAuth('login', 'customer')}
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1D68ED] hover:underline cursor-pointer"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  onClick={() => onNavigateToAuth('login', 'customer')}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400 transition cursor-pointer flex items-start gap-4"
                >
                  <div className={`w-12 h-12 rounded-2xl ${srv.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-base text-slate-900">{srv.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {srv.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* HOW IT WORKS                                                              */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 bg-white border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-14">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              How Sahakari Seva Operates
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
              Transparent, automated, and fair end-to-end service execution cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="space-y-3 relative text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                1
              </div>
              <h3 className="font-black text-lg text-slate-900">Select &amp; Detect Location</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Automatic GPS location detection pinpoints your address with accuracy warnings for instant dispatch.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 relative text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                2
              </div>
              <h3 className="font-black text-lg text-slate-900">Algorithmic Worker Match</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Matches the closest verified skilled worker based on trade credentials, location radius, and availability.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 relative text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white font-black text-lg flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                3
              </div>
              <h3 className="font-black text-lg text-slate-900">Real-Time Route Map</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Live interactive route map shows the worker arriving with estimated ETA updates for both customer and worker.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3 relative text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-lg flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                4
              </div>
              <h3 className="font-black text-lg text-slate-900">Escrow &amp; Tax Invoice</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Razorpay escrow releases 95% direct to worker and 5% to welfare fund, generating an official 5% GST tax invoice.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* COOPERATIVE WELFARE IMPACT BANNER                                         */}
      {/* ========================================================================= */}
      <section id="welfare" className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                <HeartHandshake className="w-4 h-4" />
                <span>STATE COOPERATIVE SOCIETIES ACT PROTECTED</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-white">
                Dignity, Fair Wages &amp; Accident Protection for Every Artisan
              </h2>

              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Unlike commercial gig aggregators that take up to 30% commission cuts, Sahakari Seva is built on cooperative principles. Workers retain 95% of their service fee while 5% feeds into a transparent welfare &amp; accident insurance reserve.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No hidden commission cuts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5% Accident &amp; Health Reserve</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Audited society dispatch logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multilingual voice assistance</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => onNavigateToAuth('signup', 'worker')}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <HardHat className="w-4 h-4" />
                  <span>Register as Worker Member</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700 space-y-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span>Transparent Fare Distribution</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                  <span className="text-slate-300 font-semibold">Direct Worker Payout</span>
                  <span className="font-extrabold text-emerald-400 text-sm">95%</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                  <span className="text-slate-300 font-semibold">Cooperative Welfare &amp; Reserve</span>
                  <span className="font-extrabold text-cyan-400 text-sm">5%</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                  <span className="text-slate-300 font-semibold">Government GST Tax</span>
                  <span className="font-extrabold text-amber-400 text-sm">5%</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Registered under Tamil Nadu / State Cooperative Societies Act • Reg No: TN-LCS-442/2014 • GSTIN: 33AAATC8891C1ZV
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <PartnerPlusLogo isLight={true} />
            </div>

            <div className="flex flex-wrap items-center gap-6 font-bold text-slate-300">
              <button onClick={() => onNavigateToAuth('login', 'customer')} className="hover:text-white transition cursor-pointer">Customer Portal</button>
              <button onClick={() => onNavigateToAuth('login', 'worker')} className="hover:text-white transition cursor-pointer">Worker Portal</button>
              <button onClick={() => onNavigateToAuth('login', 'organization_admin')} className="hover:text-white transition cursor-pointer">Enterprise Portal</button>
              <button onClick={() => onNavigateToAuth('login', 'cooperative_admin')} className="hover:text-white transition cursor-pointer">Cooperative Admin</button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <p>© 2026 Sahakari Seva Platform. PartnerPlus Exterior &amp; Cooperative Gig Services. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Helpline: 1800-425-7242</span>
              <span>•</span>
              <span>Emergency Dispatch: 214-550-5563</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
