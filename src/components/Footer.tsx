import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Users, 
  Award, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setActiveTab, openWorkerRegister } = useApp();

  return (
    <footer className="bg-[#121212] text-gray-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Highlight Banner: Cooperative Federation Trust */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 mb-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026 • Problem Statement 26089</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-serif">
              Cooperative Gig Services Platform for Household & Community Needs
            </h3>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed font-light">
              Empowering local skilled workers through registered Labour Cooperative Societies. 
              Zero predatory platform fees, guaranteed worker welfare fund, transparent NSDC skill verification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => openWorkerRegister()}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Enroll as a Co-op Worker
            </button>
            <button
              onClick={() => { setActiveTab('for_cooperatives'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-6 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs sm:text-sm border border-neutral-700 transition-all cursor-pointer"
            >
              Cooperative Society Portal
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-neutral-800 text-sm">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="text-xl font-extrabold text-white font-sans tracking-tight">
                {t.appName.toUpperCase()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed pr-6 font-light">
              A democratically governed public-interest platform uniting unorganized household service professionals 
              under primary labour cooperative societies. Bridging customers with skilled dignity of labour.
            </p>
            <div className="space-y-2 pt-2 text-xs text-gray-400 font-light">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Toll-Free Worker & Citizen Helpline: <strong className="text-white font-semibold">1800-425-SEVA (7382)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@sahakariseva.gov.in / federation@coopgig.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>National Federation of Labour Cooperatives, New Delhi</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-[0.2em] uppercase text-blue-400">
              Popular Services
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 font-light">
              <li><button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">Plumbing & Sump Repair</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">Electrical & Inverters</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">Carpentry & Polish Fix</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">Deep House Cleaning</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">Elderly & Patient Care</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">Appliance Maintenance</button></li>
            </ul>
          </div>

          {/* Col 3: For Stakeholders */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-[0.2em] uppercase text-blue-400">
              Portals & Guides
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 font-light">
              <li><button onClick={() => { setActiveTab('find_worker'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Customer Service Discovery</button></li>
              <li><button onClick={() => { setActiveTab('for_workers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Worker Welfare & Enrollment</button></li>
              <li><button onClick={() => { setActiveTab('for_cooperatives'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Cooperative Admin Suite</button></li>
              <li><button onClick={() => { setActiveTab('how_it_works'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Fair Wage Model Explained</button></li>
              <li><button onClick={() => { setActiveTab('help'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Dispute & Grievance Redressal</button></li>
            </ul>
          </div>

          {/* Col 4: Trust & Standards */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-[0.2em] uppercase text-blue-400">
              Trust & Standards
            </h4>
            <div className="space-y-2.5 text-xs text-gray-400 font-light">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>NSDC Skill India Level 4/5 Certifications</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Police Clearance & Identity via DigiLocker</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>PMSBY Government Accident Coverage</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Zero commission to private algorithmic brokers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-light">
          <p>© 2026 Sahakari Seva. Built for Smart India Hackathon (SIH 26089).</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('about')} className="hover:text-gray-300">Cooperative Bye-laws</button>
            <span>•</span>
            <button onClick={() => setActiveTab('help')} className="hover:text-gray-300">Privacy & Citizen Data Policy</button>
            <span>•</span>
            <button onClick={() => setActiveTab('help')} className="hover:text-gray-300">Rate Card Standards</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
