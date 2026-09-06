import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  AlertCircle, 
  Menu, 
  X, 
  Briefcase, 
  Building2, 
  UserCheck, 
  Sparkles,
  PhoneCall,
  CalendarCheck,
  ChevronDown,
  PanelLeft,
  Compass,
  Wrench
} from 'lucide-react';
import { LanguageCode, UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { 
    lang, 
    setLang, 
    t, 
    role, 
    setRole, 
    currentLocation, 
    openLocationPicker, 
    openBooking, 
    openEmergency, 
    activeTab, 
    setActiveTab,
    bookings,
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar
  } = useApp();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const pendingOrActiveBookings = bookings.filter(b => b.status !== 'service_completed' && b.status !== 'cancelled').length;

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'en', label: 'English', native: 'English' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Top Utility Ribbon with SIH PS 26089 Banner & Role Switcher */}
      <div className="bg-[#121212] text-gray-300 text-xs py-2 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded text-[11px] border border-blue-500/30">
            SIH PS 26089
          </span>
          <span className="hidden sm:inline text-gray-300 font-medium">
            Cooperative Gig Workers & Household Services Federation
          </span>
        </div>

        {/* Demo Persona Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider hidden md:inline">Role:</span>
          <div className="inline-flex bg-neutral-900 p-0.5 rounded-full border border-neutral-800">
            <button
              onClick={() => { setRole('customer'); setActiveTab('home'); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                role === 'customer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => { setRole('worker'); setActiveTab('worker_dashboard'); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                role === 'worker'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              <span>Worker (Ravi)</span>
            </button>
            <button
              onClick={() => { setRole('cooperative_admin'); setActiveTab('cooperative_dashboard'); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                role === 'cooperative_admin'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Co-op Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Left Side: Left Sidebar Toggle & Brand Logo */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          {/* Left Sidebar Menu Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer border border-gray-200/80 active:scale-96"
            title="Open Sidebar Navigation"
            aria-label="Toggle navigation sidebar"
          >
            <PanelLeft className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline font-bold">Menu</span>
          </button>

          {/* Brand Logo in Editorial Aesthetic */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#121212] font-sans">
                  {t.appName.toUpperCase()}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Co-op
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-none hidden sm:block">
                {t.appTagline}
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions: Location pill, Language, Emergency & Book CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location Selector Pill */}
          <button
            onClick={openLocationPicker}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200/80 rounded-full text-xs font-semibold text-gray-800 transition cursor-pointer"
            title="Change location"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="truncate max-w-[130px]">{currentLocation}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">{languages.find(l => l.code === lang)?.native}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {langDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setLangDropdownOpen(false)}
              >
                {languages.map(item => (
                  <button
                    key={item.code}
                    onClick={() => { setLang(item.code); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
                      lang === item.code ? 'font-bold text-blue-600 bg-blue-50/60' : 'text-gray-700'
                    }`}
                  >
                    <span>{item.native}</span>
                    <span className="text-[10px] text-gray-400">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Emergency SOS Pill */}
          <button
            onClick={openEmergency}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition shadow-xs cursor-pointer"
            title="15-minute urgent emergency household assistance"
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span className="hidden sm:inline">{t.navEmergency}</span>
            <span className="sm:hidden">SOS</span>
          </button>

          {/* Customer Active Bookings Tracker shortcut */}
          {role === 'customer' && (
            <button
              onClick={() => handleNavClick('customer_bookings')}
              className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition cursor-pointer"
              title="My Bookings"
            >
              <CalendarCheck className="w-4 h-4" />
              {pendingOrActiveBookings > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {pendingOrActiveBookings}
                </span>
              )}
            </button>
          )}

          {/* Main Book Service Button in Editorial Style */}
          <button
            onClick={() => openBooking()}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-black hover:bg-neutral-800 active:scale-98 text-white rounded-full text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer"
          >
            <span>{t.navBookService}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
