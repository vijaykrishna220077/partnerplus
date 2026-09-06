import React from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  IndianRupee, 
  AlertCircle,
  ArrowRight,
  Plus,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { OrganizationProfile, OrganizationProject, OrganizationWorkRequest } from '../../../types';

interface OrgDashboardTabProps {
  organization: OrganizationProfile | null;
  projects: OrganizationProject[];
  workRequests: OrganizationWorkRequest[];
  onOpenNewRequestModal: () => void;
  onOpenNewProjectModal: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const OrgDashboardTab: React.FC<OrgDashboardTabProps> = ({
  organization,
  projects,
  workRequests,
  onOpenNewRequestModal,
  onOpenNewProjectModal,
  onNavigateToTab
}) => {
  // Compute real statistics
  const activeProjects = projects.filter(p => p.status === 'ACTIVE');
  const totalWorkersRequested = workRequests.reduce((acc, r) => acc + r.workersNeeded, 0);
  const totalWorkersAssigned = workRequests.reduce((acc, r) => acc + r.workersAssigned, 0);
  const openRequestsCount = workRequests.filter(r => r.status === 'OPEN' || r.status === 'PARTIALLY_FILLED').length;
  
  // All active assignments across requests
  const allAssignments = workRequests.flatMap(r => r.assignments);
  const workingCount = allAssignments.filter(a => a.status === 'WORKING').length;
  const enRouteCount = allAssignments.filter(a => a.status === 'ON_THE_WAY').length;
  const arrivedCount = allAssignments.filter(a => a.status === 'ARRIVED').length;
  const todayCost = allAssignments.reduce((acc, a) => acc + (a.dailyEarnings || 0), 0);

  const isVerified = organization?.verificationStatus === 'VERIFIED';

  return (
    <div className="space-y-6">
      
      {/* Verification Notice Banner if Pending */}
      {!isVerified && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-amber-950">
              Cooperative Verification Underway (Statutory Compliance)
            </p>
            <p className="text-amber-800 mt-0.5">
              Your registered entity credentials and tax documents have been submitted to Chennai Central Labour Cooperative. You may draft projects and configure workforce requirements; bulk assignments will be activated upon compliance sign-off.
            </p>
          </div>
        </div>
      )}

      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-sm border border-slate-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <span>Workforce Management &amp; Hiring Desk</span>
            <span>•</span>
            <span>Coimbatore &amp; Chennai Corridor</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Enterprise Workforce Command
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Contract verified skilled artisans and daily labor through the official cooperative. Guaranteed minimum wage protection with ₹0 private contractor markup.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenNewProjectModal}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-600 transition flex items-center gap-2 cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>Create Project</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewRequestModal}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Workforce Request</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Workforce on Site */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Workforce</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalWorkersAssigned}</span>
            <span className="text-xs font-semibold text-slate-500">/ {totalWorkersRequested} requested</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{Math.round((totalWorkersAssigned / (totalWorkersRequested || 1)) * 100)}% Fulfilled by Cooperative</span>
          </div>
        </div>

        {/* Live On-Duty Telemetry */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Muster Status</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Radio className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">{workingCount}</span>
            <span className="text-xs font-semibold text-slate-500">actively working</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-2">
            <span className="text-amber-700 font-bold">{enRouteCount} en route</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">{arrivedCount} on-site</span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Open Projects</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{activeProjects.length}</span>
            <span className="text-xs font-semibold text-slate-500">active sites</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <span>{openRequestsCount} workforce slots open</span>
          </div>
        </div>

        {/* Today's Workforce Cost */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Payroll Estimate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">₹{todayCost.toLocaleString('en-IN')}</span>
            <span className="text-xs font-semibold text-slate-500">net daily wage</span>
          </div>
          <div className="mt-2 text-xs text-purple-700 font-bold flex items-center gap-1">
            <span>Direct-to-bank daily settlement</span>
          </div>
        </div>
      </div>

      {/* Split Section: Live Workforce Progress & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Live Workforce Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Live Workforce Progress</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time operational attendance for assigned project workers
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('live-map')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View Live GPS Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {allAssignments.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No active workers assigned yet. Post a workforce request to match with cooperative artisans.
              </div>
            ) : (
              allAssignments.slice(0, 5).map((asgn) => (
                <div 
                  key={asgn.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {asgn.workerName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{asgn.workerName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {asgn.trade}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>
                          {asgn.currentLocation ? `${asgn.currentLocation.distanceKm || 0.2} km away • Updated ${asgn.currentLocation.lastUpdated}` : 'Coimbatore Site'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {asgn.status === 'WORKING' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>WORKING ({asgn.hoursWorked || 4}h)</span>
                      </span>
                    )}
                    {asgn.status === 'ON_THE_WAY' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                        <Clock className="w-3.5 h-3.5" />
                        <span>ON THE WAY ({asgn.currentLocation?.etaMinutes || 8}m ETA)</span>
                      </span>
                    )}
                    {asgn.status === 'ARRIVED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ARRIVED</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Active Projects Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900">
              Active Projects
            </h2>
            <button
              type="button"
              onClick={() => onNavigateToTab('projects')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 3).map((proj) => (
              <div 
                key={proj.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 transition cursor-pointer"
                onClick={() => onNavigateToTab('projects')}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 font-extrabold">{proj.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${
                    proj.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {proj.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {proj.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{proj.city}</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {proj.workforceAssignedTotal} / {proj.workforceRequiredTotal} Workers
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
