import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Download,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { OrganizationWorkRequest, OrganizationWorkerAssignment } from '../../../types';
import { organizationService } from '../../../services/organizationService';

interface OrgAttendanceTabProps {
  workRequests: OrganizationWorkRequest[];
  onRefreshRequests: () => void;
}

export const OrgAttendanceTab: React.FC<OrgAttendanceTabProps> = ({
  workRequests,
  onRefreshRequests
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Flatten assignments
  const allAssignments = workRequests.flatMap(r => 
    r.assignments.map(a => ({ ...a, requestName: r.projectName, reqId: r.id }))
  );

  const filteredAssignments = allAssignments.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.workerName.toLowerCase().includes(q) || a.trade.toLowerCase().includes(q) || a.requestName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleStatusChange = (requestId: string, assignmentId: string, newStatus: OrganizationWorkerAssignment['status']) => {
    organizationService.updateAssignmentStatus(requestId, assignmentId, newStatus);
    onRefreshRequests();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Daily Muster &amp; Workforce Attendance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time gate check-in, check-out, and active duty hours verification for daily payroll.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Attendance report exported to CSV for payroll.')}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Muster Sheet (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {['ALL', 'WORKING', 'ARRIVED', 'ON_THE_WAY', 'COMPLETED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === st 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search artisan by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Artisan Details</th>
                <th className="px-5 py-3">Project Site</th>
                <th className="px-5 py-3">Trade &amp; Tier</th>
                <th className="px-5 py-3">Check-In</th>
                <th className="px-5 py-3">Check-Out</th>
                <th className="px-5 py-3">Hours</th>
                <th className="px-5 py-3">Duty Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((asgn) => (
                  <tr key={asgn.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-slate-900">{asgn.workerName}</div>
                      <div className="text-[11px] text-slate-400">{asgn.workerPhone}</div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {asgn.requestName}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-slate-900">{asgn.trade}</span>
                      <span className="text-[10px] text-slate-500 block">{asgn.workerTier}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-900">
                      {asgn.checkInTime || '—'}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-900">
                      {asgn.checkOutTime || '—'}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {asgn.hoursWorked ? `${asgn.hoursWorked}h` : '0h'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        asgn.status === 'WORKING'
                          ? 'bg-emerald-100 text-emerald-800'
                          : asgn.status === 'ARRIVED'
                          ? 'bg-amber-100 text-amber-800'
                          : asgn.status === 'ON_THE_WAY'
                          ? 'bg-blue-100 text-blue-800'
                          : asgn.status === 'COMPLETED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {asgn.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <select
                        value={asgn.status}
                        onChange={(e) => handleStatusChange(asgn.reqId, asgn.id, e.target.value as any)}
                        className="text-[11px] font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value="ON_THE_WAY">On The Way</option>
                        <option value="ARRIVED">Arrived</option>
                        <option value="WORKING">Working</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="ABSENT">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
