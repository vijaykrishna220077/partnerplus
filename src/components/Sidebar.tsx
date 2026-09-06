import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home,
  Wrench,
  Users,
  HelpCircle,
  Briefcase,
  Building2,
  PhoneCall,
  CalendarCheck,
  ShieldCheck,
  Zap,
  MapPin,
  Globe,
  X,
  ChevronRight,
  UserCheck,
  Award,
  Sparkles,
  ExternalLink,
  Calculator
} from 'lucide-react';
import { LanguageCode, UserRole } from '../types';

export const Sidebar: React.FC = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    activeTab,
    setActiveTab,
    role,
    setRole,
    currentLocation,
    openLocationPicker,
    openBooking,
    openEmergency,
    openWorkerRegister,
    lang,
    setLang,
    t,
    bookings
  } = useApp();

  if (!isSidebarOpen) return null;

  const pendingOrActiveBookings = bookings.filter(
    b => b.status !== 'service_completed' && b.status !== 'cancelled'
  ).length;

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        onClick={() => setIsSidebarOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Slide-out Sidebar Panel */}
      <aside 
        className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-250 border-r border-gray-200"
        aria-label="Sidebar Navigation"
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-100 bg-[#FAF9F6]">
          <div className="flex items-center justify-between mb-3">
            <div 
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-extrabold text-base shadow-xs group-hover:scale-105 transition-transform">
                S
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-[#121212] font-sans">
                    {t.appName.toUpperCase()}
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Co-op
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium leading-none">
                  {t.appTagline}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Persona / Role Selector inside Sidebar */}
          <div className="mt-3 pt-3 border-t border-gray-200/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Active Role</span>
              <span className="text-[10px] text-blue-600 font-medium">Switch view</span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-gray-200/60 p-1 rounded-xl">
              <button
                onClick={() => { setRole('customer'); handleNavigate('home'); }}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition text-center cursor-pointer ${
                  role === 'customer'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => { setRole('worker'); handleNavigate('worker_dashboard'); }}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition text-center cursor-pointer ${
                  role === 'worker'
                    ? 'bg-white text-amber-700 shadow-xs font-bold'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Worker
              </button>
              <button
                onClick={() => { setRole('cooperative_admin'); handleNavigate('cooperative_dashboard'); }}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition text-center cursor-pointer ${
                  role === 'cooperative_admin'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Main Exploration */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Explore & Book
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('home')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{t.navHome}</span>
                </div>
                {activeTab === 'home' && <ChevronRight className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleNavigate('direct_booking')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'direct_booking'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calculator className={`w-4 h-4 ${activeTab === 'direct_booking' ? 'text-blue-600' : 'text-blue-600'}`} />
                  <span className="font-bold text-[#1D68ED]">Direct Cooperative Booking</span>
                </div>
                <span className="text-[10px] font-black bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded-md">
                  0% Cut
                </span>
              </button>

              <button
                onClick={() => handleNavigate('services')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'services' || activeTab === 'services_search'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wrench className={`w-4 h-4 ${activeTab === 'services' || activeTab === 'services_search' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{t.navServices}</span>
                </div>
                <span className="text-[10px] font-bold bg-blue-100/60 text-blue-700 px-1.5 py-0.5 rounded-md">
                  Browse
                </span>
              </button>

              <button
                onClick={() => handleNavigate('find_worker')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'find_worker'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 ${activeTab === 'find_worker' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{t.navFindWorker}</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md">
                  Verified
                </span>
              </button>

              <button
                onClick={() => handleNavigate('how_it_works')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'how_it_works'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className={`w-4 h-4 ${activeTab === 'how_it_works' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{t.navHowItWorks}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Portals & Management */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Portals & Workspace
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('customer_bookings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'customer_bookings' || activeTab === 'customer_dashboard'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className={`w-4 h-4 ${activeTab === 'customer_bookings' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>Customer Bookings</span>
                </div>
                {pendingOrActiveBookings > 0 && (
                  <span className="text-[11px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    {pendingOrActiveBookings}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setRole('worker'); handleNavigate('worker_dashboard'); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'worker_dashboard'
                    ? 'bg-amber-50 text-amber-800 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className={`w-4 h-4 ${activeTab === 'worker_dashboard' ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span>Worker Dashboard</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                  Ravi
                </span>
              </button>

              <button
                onClick={() => { setRole('cooperative_admin'); handleNavigate('cooperative_dashboard'); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'cooperative_dashboard'
                    ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className={`w-4 h-4 ${activeTab === 'cooperative_dashboard' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span>Co-op Admin Portal</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                  Admin
                </span>
              </button>
            </div>
          </div>

          {/* Cooperative Ecosystem & Info */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Cooperative Federation
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('for_workers')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'for_workers'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className={`w-4 h-4 ${activeTab === 'for_workers' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{t.navForWorkers}</span>
                </div>
              </button>

              <button
                onClick={() => handleNavigate('for_cooperatives')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'for_cooperatives'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className={`w-4 h-4 ${activeTab === 'for_cooperatives' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{t.navForCooperatives}</span>
                </div>
              </button>

              <button
                onClick={() => handleNavigate('help')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === 'help'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PhoneCall className={`w-4 h-4 ${activeTab === 'help' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{t.navHelp}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Emergency 15-min SOS Action Card */}
          <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200/80">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-4 h-4 text-red-600 animate-pulse" />
              <span className="text-xs font-bold text-red-800">15-Min Emergency SOS</span>
            </div>
            <p className="text-[11px] text-red-700 mb-2.5 leading-relaxed">
              Urgent burst pipe, short circuit, or lockout? Get an on-duty worker in 15-30 mins.
            </p>
            <button
              onClick={() => { openEmergency(); setIsSidebarOpen(false); }}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white" />
              <span>Request Urgent SOS</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/70 space-y-3">
          {/* Location pill */}
          <button
            onClick={() => { openLocationPicker(); setIsSidebarOpen(false); }}
            className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 hover:border-gray-300 transition cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{currentLocation}</span>
            </div>
            <span className="text-[10px] text-blue-600 font-bold shrink-0">Change</span>
          </button>

          {/* Language selector in sidebar */}
          <div className="flex items-center justify-between gap-1 bg-white p-1 rounded-xl border border-gray-200">
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  lang === l.code
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
            <span>SIH PS 26089 Co-op Platform</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="w-3 h-3" />
              Govt Certified
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
};
