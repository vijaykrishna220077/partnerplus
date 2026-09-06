import React, { useState } from 'react';
import { 
  MapPin, 
  Radio, 
  Navigation, 
  Users, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Briefcase,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { OrganizationProject, OrganizationWorkRequest, OrganizationWorkerAssignment } from '../../../types';

interface OrgLiveMapTabProps {
  projects: OrganizationProject[];
  workRequests: OrganizationWorkRequest[];
}

export const OrgLiveMapTab: React.FC<OrgLiveMapTabProps> = ({
  projects,
  workRequests
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'ALL');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  // Flatten all assignments
  const relevantRequests = selectedProjectId === 'ALL' 
    ? workRequests 
    : workRequests.filter(r => r.projectId === selectedProjectId);
  const activeAssignments = relevantRequests.flatMap(r => r.assignments);

  const selectedWorker = activeAssignments.find(a => a.workerId === selectedWorkerId) || activeAssignments[0];

  const workingCount = activeAssignments.filter(a => a.status === 'WORKING').length;
  const enRouteCount = activeAssignments.filter(a => a.status === 'ON_THE_WAY').length;
  const arrivedCount = activeAssignments.filter(a => a.status === 'ARRIVED').length;

  return (
    <div className="space-y-6">
      
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>Organization Live Workforce Map</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Privacy-scoped GPS tracking restricted to currently assigned project workforce.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Filter Site:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="ALL">All Active Sites</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Telemetry Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs">
            {workingCount}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Working On-Site</div>
            <div className="text-xs font-extrabold text-slate-900">Active Duty</div>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
            {enRouteCount}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">En Route</div>
            <div className="text-xs font-extrabold text-slate-900">GPS Navigation Active</div>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-xs">
            {arrivedCount}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Arrived</div>
            <div className="text-xs font-extrabold text-slate-900">At Project Gate</div>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-xs">
            {activeAssignments.length}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Total Tracked</div>
            <div className="text-xs font-extrabold text-slate-900">Workforce Roster</div>
          </div>
        </div>
      </div>

      {/* Interactive Tactical Map & Worker Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl min-h-[520px]">
        
        {/* Left / Center: Interactive Map Stage (8 Cols) */}
        <div className="lg:col-span-8 relative p-4 flex flex-col justify-between overflow-hidden bg-[#0A0F1D]">
          
          {/* Subtle Grid Map Canvas Background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          {/* Top Map Overlays */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200 backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Coimbatore Industrial Sector Zone • GPS Mesh Active</span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>GPS ACCURACY: HIGH (&lt;10m)</span>
            </div>
          </div>

          {/* Interactive Worker Pins Stage */}
          <div className="relative z-10 my-auto h-80 w-full flex items-center justify-center">
            
            {/* Center Project Site Pin */}
            <div className="relative flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-dashed border-amber-500/40 animate-pulse flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <span className="mt-1 px-2.5 py-0.5 rounded bg-slate-900/90 text-amber-300 font-bold text-[10px] border border-slate-700">
                Project Site: Peelamedu Logistics Hub
              </span>
            </div>

            {/* Simulated Satellite Positions for Workers */}
            {activeAssignments.map((asgn, idx) => {
              // Calculate spatial circle offset
              const angle = (idx / (activeAssignments.length || 1)) * 2 * Math.PI;
              const radius = asgn.status === 'WORKING' ? 45 : asgn.status === 'ARRIVED' ? 85 : 140;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isSelected = selectedWorker?.workerId === asgn.workerId;

              return (
                <div
                  key={asgn.id}
                  onClick={() => setSelectedWorkerId(asgn.workerId)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                  className={`absolute transition-all duration-500 flex flex-col items-center cursor-pointer group ${
                    isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black shadow-md transition ${
                    asgn.status === 'WORKING'
                      ? 'bg-emerald-500 text-white border-emerald-300 ring-2 ring-emerald-500/40'
                      : asgn.status === 'ARRIVED'
                      ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-500/40'
                      : 'bg-blue-500 text-white border-blue-300 ring-2 ring-blue-500/40'
                  }`}>
                    {asgn.workerName[0]}
                  </div>

                  <span className={`mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold whitespace-nowrap shadow-xs ${
                    isSelected 
                      ? 'bg-amber-400 text-slate-950 font-black' 
                      : 'bg-slate-900/90 text-slate-300 border border-slate-800'
                  }`}>
                    {asgn.workerName.split(' ')[0]} ({asgn.status})
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Map Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-slate-400">
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Working On-Site</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Arrived at Gate</span>
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>En Route (GPS Active)</span>
              </span>
            </div>

            <span className="text-[10px] text-slate-500">
              Only authorized project personnel are mapped.
            </span>
          </div>

        </div>

        {/* Right: Worker Inspection Card (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between text-slate-200">
          {selectedWorker ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Assigned Artisan Dossier
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  selectedWorker.status === 'WORKING' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : selectedWorker.status === 'ARRIVED'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {selectedWorker.status}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-white">
                  {selectedWorker.workerName}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {selectedWorker.trade} • {selectedWorker.workerTier} Tier
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>GPS Proximity:</span>
                    <span className="font-bold text-white">
                      {selectedWorker.currentLocation?.distanceKm || 0.1} km from project
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Estimated Arrival:</span>
                    <span className="font-bold text-amber-400">
                      {selectedWorker.currentLocation?.etaMinutes === 0 ? 'On-Site' : `${selectedWorker.currentLocation?.etaMinutes || 5} minutes`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Muster Check-In:</span>
                    <span className="font-bold text-emerald-400">
                      {selectedWorker.checkInTime || 'Pending Gate Arrival'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Hours Logged:</span>
                    <span className="font-bold text-white">
                      {selectedWorker.hoursWorked || 0} hrs today
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Statutory Insurance &amp; KYC Verified</span>
                  </div>
                  <p>
                    Covered under Cooperative PMSBY accident insurance. Direct daily wage protection guaranteed.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => alert(`Calling site worker ${selectedWorker.workerName} at ${selectedWorker.workerPhone}`)}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Worker ({selectedWorker.workerPhone})</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a worker marker on the map stage to inspect live dispatch telemetry.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
