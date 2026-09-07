import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  FileCheck2, 
  Award, 
  HeartHandshake, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  DollarSign, 
  Search, 
  Filter, 
  ArrowUpRight, 
  AlertCircle,
  FileBadge,
  Calendar,
  Clock,
  Zap,
  Star,
  MapPin
} from 'lucide-react';
import { Worker, DemandForecastItem } from '../types';
import { mockCooperatives } from '../data/mockData';
import { apiService } from '../services/apiService';

export const CooperativeAdminDashboard: React.FC = () => {
  const { 
    workers, 
    bookings, 
    demandForecasts, 
    openWorkerProfile, 
    addToast, 
    triggerCelebration,
    refreshData,
    t
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'verifications' | 'roster' | 'ai_demand' | 'financials'>('verifications');
  const [workerSearch, setWorkerSearch] = useState<string>('');
  const [selectedCooperativeId, setSelectedCooperativeId] = useState<string>(mockCooperatives[0].id);

  const pendingWorkers = workers.filter(w => !w.isVerified);
  const verifiedWorkers = workers.filter(w => w.isVerified);

  const activeCooperative = mockCooperatives.find(c => c.id === selectedCooperativeId) || mockCooperatives[0];

  const handleVerifyWorker = async (workerId: string, workerName: string) => {
    try {
      await apiService.verifyWorker(workerId);
      await refreshData();
      triggerCelebration();
      addToast({
        type: 'success',
        title: 'Worker Verified!',
        message: `${workerName} has been officially certified and is now active on the public PartnerPlus network.`
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAllocateDemand = (forecast: DemandForecastItem, hotspot: DemandForecastItem['hotspotAreas'][0]) => {
    triggerCelebration();
    addToast({
      type: 'success',
      title: 'Smart Workforce Allocated',
      message: `Allocated ${hotspot.recommendedDeployment} cooperative workers to ${hotspot.areaName} zone for ${forecast.serviceName}. SMS notifications dispatched to society members.`
    });
  };

  // Filter roster
  const filteredRoster = workers.filter(w => {
    if (workerSearch.trim() === '') return true;
    const q = workerSearch.toLowerCase();
    return w.name.toLowerCase().includes(q) || w.primarySkillLabel.toLowerCase().includes(q) || w.cooperativeName.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Society Header in Editorial Style */}
      <div className="bg-[#121212] text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md font-bold text-xl">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-700/50">
                {t("cooperative.cooperativePortalTitle")}
              </span>
              <span className="text-xs font-mono text-gray-400">
                Reg: {activeCooperative.registrationNumber}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">
              {activeCooperative.name}
            </h1>
            <p className="text-xs text-gray-300 font-light">
              State Cooperative Federation • {activeCooperative.city}, {activeCooperative.state} • Est. {activeCooperative.establishedYear}
            </p>
          </div>
        </div>

        {/* Cooperative Branch Selector */}
        <div className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800 w-full md:w-auto text-xs">
          <label className="text-gray-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
            Active Jurisdiction
          </label>
          <select
            value={selectedCooperativeId}
            onChange={(e) => setSelectedCooperativeId(e.target.value)}
            className="w-full bg-[#121212] text-white border border-neutral-700 rounded-xl px-3 py-1.5 font-semibold text-xs focus:outline-none cursor-pointer"
          >
            {mockCooperatives.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">{t("cooperative.workersOnline")}</span>
          <div className="text-2xl sm:text-3xl font-black text-[#121212] font-serif mt-1">{verifiedWorkers.length} Active</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">100% Police & NSDC Verified</span>
        </div>

        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">{t("cooperative.pendingVerification")}</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-950 font-serif mt-1">{pendingWorkers.length} Applicants</div>
          <span className="text-[11px] text-amber-800 font-semibold mt-1 block">Awaiting Scrutiny</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">{t("cooperative.activeJobs")}</span>
          <div className="text-2xl sm:text-3xl font-black text-[#121212] font-serif mt-1">{bookings.length * 142 + 24} Jobs</div>
          <span className="text-[11px] text-gray-500 mt-1 block font-light">Zero intermediary cuts</span>
        </div>

        <div className="bg-[#121212] text-white rounded-3xl p-6 border border-neutral-800 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
            {t("cooperative.welfareFund")}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-serif mt-1">₹8,42,500</div>
          <span className="text-[11px] text-gray-400 mt-1 block font-light">Accident + pension reserve fund</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-3 text-xs">
        {[
          { id: 'verifications', label: `Pending Verifications (${pendingWorkers.length})`, icon: FileCheck2 },
          { id: 'roster', label: `Worker Roster (${workers.length})`, icon: Users },
          { id: 'ai_demand', label: 'AI Demand Forecasting', icon: Sparkles },
          { id: 'financials', label: 'Welfare & Financial Ledger', icon: DollarSign },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeAdminTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveAdminTab(t.id as any)}
              className={`px-5 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white border border-gray-200 hover:border-black text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VERIFICATION QUEUE */}
      {activeAdminTab === 'verifications' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#121212]">
              Worker Verification & Credential Approval
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-light">
              Review applicant identity documents, NSDC trade certificates, and grant official cooperative certification badges.
            </p>
          </div>

          {pendingWorkers.length > 0 ? (
            <div className="space-y-4">
              {pendingWorkers.map((w) => (
                <div
                  key={w.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md space-y-4"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <img
                        src={w.photoUrl}
                        alt={w.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[#121212] text-base font-sans">{w.name}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                            Scrutiny Pending
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 font-semibold">{w.primarySkillLabel} • {w.experienceYears} Years Experience</p>
                        <p className="text-[11px] text-gray-500 font-light">{w.phone} • {w.locationArea}, {w.city}</p>
                      </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => openWorkerProfile(w)}
                        className="px-4 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold text-xs hover:border-black transition-all cursor-pointer"
                      >
                        Inspect Dossier
                      </button>
                      <button
                        onClick={() => handleVerifyWorker(w.id, w.name)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-full font-bold text-xs shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Grant Verified Badge</span>
                      </button>
                    </div>
                  </div>

                  {/* Submitted Documents Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700">
                    <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <FileBadge className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <span className="font-bold text-[#121212] block text-[11px]">NSDC Skill Certificate</span>
                        <span className="text-[10px] text-gray-500 font-light">{w.certifications[0]?.title || 'Sanitary & Plumbing L4'}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                      <div>
                        <span className="font-bold text-[#121212] block text-[11px]">DigiLocker Aadhaar KYC</span>
                        <span className="text-[10px] text-gray-500 font-light">Auto-Validated via UIDAI Gateway</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <HeartHandshake className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <span className="font-bold text-[#121212] block text-[11px]">PMSBY Welfare Policy</span>
                        <span className="text-[10px] text-gray-500 font-light">Auto-Enrolled under Society Plan</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-gray-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#121212] text-sm">All Applicants Verified!</h3>
              <p className="text-xs text-gray-500 font-light">The verification queue is clear. All registered society workers have been vetted.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WORKER ROSTER */}
      {activeAdminTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-gray-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={workerSearch}
                onChange={e => setWorkerSearch(e.target.value)}
                placeholder="Search roster by worker name, skill, trade..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-600"
              />
            </div>
            <span className="text-xs text-gray-500 font-semibold px-2">
              Showing {filteredRoster.length} affiliated workers
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold border-b border-gray-200 tracking-wider">
                <tr>
                  <th className="p-4">Worker Name & Skill</th>
                  <th className="p-4">Cooperative Society</th>
                  <th className="p-4 text-center">Jobs / Rating</th>
                  <th className="p-4 text-center">Duty Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRoster.map(w => (
                  <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={w.photoUrl}
                          alt={w.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#121212]">{w.name}</span>
                            {w.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" title="Verified" />
                            )}
                          </div>
                          <span className="text-[11px] text-blue-600 font-semibold">{w.primarySkillLabel}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[#121212] font-medium">{w.cooperativeName}</span>
                      <span className="text-[10px] text-gray-400 font-mono block">Reg: {w.cooperativeRegNo}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{w.rating}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-light">{w.jobsCompleted} jobs</span>
                    </td>
                    <td className="p-4 text-center">
                      {w.isAvailableToday ? (
                        <span className="px-2.5 py-0.5 bg-green-50 text-green-700 font-bold text-[10px] rounded-full border border-green-200">
                          On Duty
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 font-bold text-[10px] rounded-full">
                          Off Duty
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openWorkerProfile(w)}
                        className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-full text-[11px] transition-colors cursor-pointer"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AI DEMAND FORECASTING */}
      {activeAdminTab === 'ai_demand' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-neutral-950 via-[#121212] to-neutral-900 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                Cooperative Intelligence Engine (SIH PS 26089)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white">
              AI Demand Forecasting & Predictive Workforce Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed font-light">
              Synthesizing real-time seasonal weather triggers, past booking spikes, and ward-level density to forecast household service demand 7 days in advance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demandForecasts.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-black transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold bg-blue-50 text-blue-900 px-3 py-1 rounded-full border border-blue-200">
                      {f.serviceName}
                    </span>
                    <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                      f.demandLevel === 'HIGH' 
                        ? 'bg-green-50 text-green-800 border-green-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {f.growthPercentage > 0 ? `+${f.growthPercentage}% Surge` : `${f.growthPercentage}% Normal`}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100 font-light">
                    💡 <strong className="text-gray-900 font-semibold">Root Driver:</strong> {f.reason}
                  </p>

                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Ward Hotspots & Deployment
                    </h5>
                    <div className="space-y-2">
                      {f.hotspotAreas.map((h, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                          <div>
                            <span className="font-bold text-[#121212] flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-blue-600" />
                              {h.areaName}
                            </span>
                            <span className="text-[10px] text-gray-500 font-light">
                              {h.activeRequests} requests vs {h.availableWorkers} available
                            </span>
                          </div>

                          <button
                            onClick={() => handleAllocateDemand(f, h)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                          >
                            <span>Deploy {h.recommendedDeployment}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-light">Peak Days: <strong className="text-gray-900 font-semibold">{f.peakDays.join(', ')}</strong></span>
                  <span className="text-green-700 font-bold">✓ AI Roster Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIAL & WELFARE LEDGER */}
      {activeAdminTab === 'financials' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#121212]">
              Cooperative Financial & Welfare Pool Statement
            </h2>
            <p className="text-xs text-gray-500 font-light">
              Audited statement of member worker payouts, social welfare reserves, and accident insurance premiums.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121212] text-white rounded-3xl p-8 border border-neutral-800 space-y-2 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Total Direct Member Payouts</span>
              <div className="text-3xl font-black font-serif text-white">₹14,82,450</div>
              <p className="text-xs text-gray-300 font-light">94% gross wages disbursed straight to workers' bank accounts.</p>
            </div>

            <div className="bg-white text-[#121212] rounded-3xl p-8 border border-gray-200 space-y-2 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Welfare & Retirement Reserve</span>
              <div className="text-3xl font-black font-serif text-[#121212]">₹8,42,500</div>
              <p className="text-xs text-gray-500 font-light">6% society levy accumulated for member pensions & emergency relief.</p>
            </div>

            <div className="bg-white text-[#121212] rounded-3xl p-8 border border-gray-200 space-y-2 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">PMSBY Premium Disbursed</span>
              <div className="text-3xl font-black font-serif text-[#121212]">₹24,800</div>
              <p className="text-xs text-gray-500 font-light">100% active workers covered for ₹2 Lakh accident coverage.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
