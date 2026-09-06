import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Filter, 
  Search, 
  IndianRupee,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { OrganizationProject, OrganizationWorkRequest } from '../../../types';

interface OrgProjectsTabProps {
  projects: OrganizationProject[];
  workRequests: OrganizationWorkRequest[];
  onOpenNewProjectModal: () => void;
  onOpenNewRequestModal: (projectId?: string) => void;
  onSelectProject: (projectId: string) => void;
}

export const OrgProjectsTab: React.FC<OrgProjectsTabProps> = ({
  projects,
  workRequests,
  onOpenNewProjectModal,
  onOpenNewRequestModal,
  onSelectProject
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(p => {
    if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header with Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Organization Project Roster
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage long-term facility sites, industrial contracts, and multi-worker project sites.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewProjectModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Site</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterStatus === status 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by name/city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((proj) => {
          // Get requests belonging to this project
          const projRequests = workRequests.filter(r => r.projectId === proj.id);
          const totalRequested = projRequests.reduce((a, r) => a + r.workersNeeded, 0);
          const totalAssigned = projRequests.reduce((a, r) => a + r.workersAssigned, 0);

          return (
            <div 
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition shadow-xs flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      proj.status === 'ACTIVE' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : proj.status === 'UPCOMING'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {proj.status}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">
                      {proj.title}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Daily Budget</span>
                    <div className="font-black text-slate-900 text-sm">
                      ₹{proj.dailyBudget.toLocaleString('en-IN')}/day
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {proj.description}
                </p>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{proj.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>From {proj.startDate}</span>
                  </div>
                </div>

                {/* Workforce Allocation Breakdown */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Workforce Deployment:</span>
                    <span className="text-slate-900 font-extrabold">
                      {totalAssigned} / {totalRequested || proj.workforceRequiredTotal} Assigned
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.round((totalAssigned / (totalRequested || proj.workforceRequiredTotal || 1)) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Sub-trades pills */}
                {projRequests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {projRequests.map(req => (
                      <span key={req.id} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {req.tradeCategory}: {req.workersAssigned}/{req.workersNeeded}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onOpenNewRequestModal(proj.id)}
                  className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Request Workers for Site</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectProject(proj.id)}
                  className="font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Workforce Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
