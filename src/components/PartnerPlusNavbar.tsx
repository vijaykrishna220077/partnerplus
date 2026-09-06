import React, { useState } from 'react';
import { Menu, X, Phone, ArrowRight, ShieldCheck, ChevronRight, LayoutDashboard, Globe, HardHat, Sparkles, Wrench, Users, Tag } from 'lucide-react';
import { PartnerPlusLogo } from './PartnerPlusLogo';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';

interface PartnerPlusNavbarProps {
  onOpenQuote: () => void;
  onOpenProProvider: () => void;
  onOpenProLogin: () => void;
  onOpenPhone: () => void;
  onOpenServiceArea: () => void;
  onSelectService: (service: 'pressure_washing' | 'window_washing' | 'fleet_washing') => void;
  onToggleSidebar?: () => void;
  onSwitchToWorker?: () => void;
}

export const PartnerPlusNavbar: React.FC<PartnerPlusNavbarProps> = ({
  onOpenQuote,
  onOpenProProvider,
  onOpenProLogin,
  onOpenPhone,
  onOpenServiceArea,
  onSelectService,
  onToggleSidebar,
  onSwitchToWorker
}) => {
  const { lang, setLang, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLabels = {
    en: { about: "About Cooperative", trades: "Trades (Electric/Plumbing)", dailyLabor: "Daily Wage Helpers", cleaning: "Deep Cleaning", pricing: "Check Prices", serviceArea: "Service Area", proLogin: "Worker Login", joinPro: "Join as Worker", workerMode: "Worker Mode (कामगार)" },
    hi: { about: "सहकारी के बारे में", trades: "बिजली व प्लंबिंग", dailyLabor: "दैनिक मजदूर व हेल्पर", cleaning: "डीप क्लीनिंग", pricing: "पारदर्शी मूल्य", serviceArea: "सेवा क्षेत्र", proLogin: "कामगार लॉगिन", joinPro: "कामगार के रूप में जुड़ें", workerMode: "कामगार पोर्टल" },
    ta: { about: "கூட்டுறவு பற்றி", trades: "எலக்ட்ரீஷியன் & பிளம்பர்", dailyLabor: "தினக்கூலி உதவியாளர்", cleaning: "முழு சுத்தம்", pricing: "கட்டண விவரம்", serviceArea: "சேவை பகுதி", proLogin: "உள்நுழைவு", joinPro: "பணியாளராக இணையுங்கள்", workerMode: "தொழிலாளர் தளம்" },
    te: { about: "మా గురించి", trades: "ఎలక్ట్రీషియన్ & ప్లంబర్", dailyLabor: "దినసరి కూలీలు", cleaning: "క్లీనింగ్", pricing: "ధరలు చూడండి", serviceArea: "సేవా ప్రాంతం", proLogin: "లాగిన్", joinPro: "కార్మికుడిగా చేరండి", workerMode: "కార్మికుల పోర్టల్" },
    bn: { about: "আমাদের সম্পর্কে", trades: "ইলেকট্রিশিয়ান ও প্লাম্বার", dailyLabor: "দৈনিক শ্রমিক", cleaning: "ডিপ ক্লিনিং", pricing: "রেট দেখুন", serviceArea: "সেবা এলাকা", proLogin: "লগইন", joinPro: "শ্রমিক হিসেবে যোগ দিন", workerMode: "শ্রমিক পোর্টাল" },
    kn: { about: "ನಮ್ಮ ಬಗ್ಗೆ", trades: "ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ & ಪ್ಲಂಬರ್", dailyLabor: "ದಿನಗೂಲಿ ಕಾರ್ಮಿಕರು", cleaning: "ಕ್ಲೀನಿಂಗ್", pricing: "ದರ ಪರಿಶೀಲಿಸಿ", serviceArea: "ಸೇವಾ ಪ್ರದೇಶ", proLogin: "ಲಾಗಿನ್", joinPro: "ಕಾರ್ಮಿಕರಾಗಿ ಸೇರಿ", workerMode: "ಕಾರ್ಮಿಕರ ಪೋರ್ಟಲ್" },
    mr: { about: "आमच्याबद्दल", trades: "इलेक्ट्रिशियन व प्लंबर", dailyLabor: "दैनिक मजूर व मदतनीस", cleaning: "डीप क्लिनिंग", pricing: "पारदर्शक दर", serviceArea: "सेवा क्षेत्र", proLogin: "कामगार लॉगिन", joinPro: "कामगार म्हणून सामील व्हा", workerMode: "कामगार पोर्टल" }
  };
  const curNav = navLabels[lang] || navLabels.en;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Sidebar toggle */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                title="Open Platform Dashboards & Navigation"
                aria-label="Toggle Applet Navigation"
              >
                <LayoutDashboard className="w-5 h-5 text-[#1D68ED]" />
              </button>
            )}
            <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <PartnerPlusLogo />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('core-services')}
              className="text-sm font-semibold text-gray-700 hover:text-[#1D68ED] transition cursor-pointer"
            >
              {curNav.trades}
            </button>
            <button
              onClick={() => onSelectService('daily_labor')}
              className="text-sm font-semibold text-gray-700 hover:text-[#1D68ED] transition cursor-pointer"
            >
              {curNav.dailyLabor}
            </button>
            <button
              onClick={() => onSelectService('cleaning')}
              className="text-sm font-semibold text-gray-700 hover:text-[#1D68ED] transition cursor-pointer"
            >
              {curNav.cleaning}
            </button>
            <button
              onClick={onOpenQuote}
              className="text-sm font-bold text-[#1D68ED] hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 transition cursor-pointer flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-[#1D68ED]" />
              <span>{curNav.pricing}</span>
            </button>
            <button
              onClick={onOpenServiceArea}
              className="text-sm font-semibold text-gray-700 hover:text-[#1D68ED] transition cursor-pointer"
            >
              {curNav.serviceArea}
            </button>
          </nav>

          {/* Right Action Controls matching Screenshot 1 */}
          <div className="hidden sm:flex items-center gap-3">
            {onSwitchToWorker && (
              <button
                onClick={onSwitchToWorker}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full text-xs font-black tracking-tight shadow-xs hover:shadow-sm transition-all duration-200 active:scale-98 cursor-pointer flex items-center gap-1.5"
                title="Switch to low-literacy Worker Portal"
              >
                <HardHat className="w-3.5 h-3.5 text-emerald-700" />
                <span>{curNav.workerMode}</span>
              </button>
            )}
            <button
              onClick={onOpenProLogin}
              className="text-sm font-bold text-gray-800 hover:text-[#1D68ED] transition px-2 py-1 cursor-pointer"
            >
              {curNav.proLogin}
            </button>
            <button
              onClick={onOpenProProvider}
              className="px-5 py-2.5 bg-[#00D2FF] hover:bg-[#33EBFF] text-black font-extrabold rounded-full text-xs sm:text-sm tracking-tight shadow-sm hover:shadow-md transition-all duration-200 active:scale-98 cursor-pointer"
            >
              {curNav.joinPro}
            </button>
          </div>

          {/* Mobile Menu Button matching Screenshot 2 */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenPhone}
              className="p-2 text-gray-700 hover:text-[#1D68ED] rounded-lg sm:hidden"
              aria-label="Call Dispatch"
            >
              <Phone className="w-5 h-5 text-[#1D68ED]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-800 hover:text-black rounded-lg transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-xl px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => { setMobileMenuOpen(false); scrollToSection('core-services'); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 flex items-center justify-between"
            >
              <span>{curNav.trades}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onSelectService('daily_labor'); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 flex items-center justify-between"
            >
              <span>{curNav.dailyLabor}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onSelectService('cleaning'); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 flex items-center justify-between"
            >
              <span>{curNav.cleaning}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenQuote(); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-[#1D68ED] bg-blue-50/50 hover:bg-blue-50 flex items-center justify-between"
            >
              <span>{curNav.pricing}</span>
              <ChevronRight className="w-4 h-4 text-[#1D68ED]" />
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenServiceArea(); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 flex items-center justify-between"
            >
              <span>{curNav.serviceArea}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            {onToggleSidebar && (
              <button
                onClick={() => { setMobileMenuOpen(false); onToggleSidebar(); }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-[#1D68ED] hover:bg-blue-50 flex items-center justify-between"
              >
                <span>Platform Dashboards &amp; Settings</span>
                <ChevronRight className="w-4 h-4 text-[#1D68ED]" />
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
            {onSwitchToWorker && (
              <button
                onClick={() => { setMobileMenuOpen(false); onSwitchToWorker(); }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm text-center shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <HardHat className="w-4 h-4 text-white" />
                <span>{curNav.workerMode}</span>
              </button>
            )}
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenProProvider(); }}
              className="w-full py-3 bg-[#00D2FF] text-black font-extrabold rounded-xl text-sm text-center shadow-xs"
            >
              {curNav.joinPro}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenProLogin(); }}
                className="flex-1 py-2.5 bg-gray-100 text-gray-800 font-bold rounded-xl text-xs text-center"
              >
                {curNav.proLogin}
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenPhone(); }}
                className="flex-1 py-2.5 bg-blue-50 text-[#1D68ED] font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>214-550-5563</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
