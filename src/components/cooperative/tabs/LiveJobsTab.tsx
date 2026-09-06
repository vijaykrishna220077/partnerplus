import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  User, 
  Phone, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RotateCcw,
  Eye,
  ArrowRight
} from 'lucide-react';
import { Booking } from '../../../types';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';
import { useAuth } from '../../../context/AuthContext';

interface LiveJobsTabProps {
  bookings: Booking[];
  onOpenManualIntervene: (jobId: string) => void;
}

export const LiveJobsTab: React.FC<LiveJobsTabProps> = ({
  bookings,
  onOpenManualIntervene
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState<Booking | null>(null);

  const filtered = bookings.filter(b => {
    const matchesSearch = 
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || (typeFilter === 'EMERGENCY' ? b.isEmergency : !b.isEmergency);

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCancelJob = (job: Booking) => {
    const reason = window.prompt(`Please provide official cancellation reason for Ticket ${job.bookingCode}:`);
    if (reason && reason.trim()) {
      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: 'JOB_CANCELLED_OVERRIDE',
        affectedEntity: 'BOOKING',
        entityId: job.bookingCode,
        previousState: job.status,
        newState: 'CANCELLED_BY_COOPERATIVE',
        reason: reason.trim()
      });
      alert(`Ticket ${job.bookingCode} has been cancelled with logged audit reason: ${reason}`);
    }
  };

  const handleCompleteOverride = (job: Booking) => {
    const confirm = window.confirm(`Emergency administrative sign-off: Mark Ticket ${job.bookingCode} as officially completed and release escrow payment?`);
    if (confirm) {
      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: 'JOB_COMPLETION_OVERRIDE',
        affectedEntity: 'BOOKING',
        entityId: job.bookingCode,
        previousState: job.status,
        newState: 'SERVICE_COMPLETED_OVERRIDE',
        reason: 'Administrative verification of customer satisfaction & safety compliance.'
      });
      alert(`Ticket ${job.bookingCode} marked completed in cooperative ledger.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header & Filter Bar */}
      <div className="p-5 bg-[#111A2E] rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
              COOPERATIVE JOBS DIRECTORY &amp; DISPATCH CONTROL
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive ledger of all service bookings, transparent pricing, 95% worker split, and 5% welfare contribution.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400">
            Total Tickets: {bookings.length}
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket, customer, worker, or sector area..."
              className="w-full bg-[#0F172A] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0F172A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="requested">Requested</option>
            <option value="worker_assigned">Worker Assigned</option>
            <option value="on_the_way">On The Way</option>
            <option value="service_started">In Progress</option>
            <option value="service_completed">Completed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#0F172A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
          >
            <option value="ALL">All Types</option>
            <option value="NORMAL">Standard Routine</option>
            <option value="EMERGENCY">Emergency Breakdown</option>
          </select>
        </div>
      </div>

      {/* Jobs Ledger Table */}
      <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase bg-[#0C1322]/60">
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Assigned Artisan</th>
                <th className="py-2.5 px-3">Service &amp; Sector</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Split (95% / 5%)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filtered.map((b) => {
                const total = b.pricing?.totalAmount || 450;
                const workerCut = Math.round(total * 0.95);
                const welfareCut = Math.round(total * 0.05);

                return (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-bold text-purple-400">{b.bookingCode}</span>
                      {b.isEmergency && (
                        <span className="ml-1 text-[9px] uppercase px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          EMG
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 block">{b.bookingDate}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-bold text-white">{b.userName}</div>
                      <span className="text-[10px] text-slate-400">{b.customerPhone || '+91 98409 11223'}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="text-white font-medium">{b.workerName}</div>
                      <span className="text-[10px] text-emerald-400">{b.workerPhone}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{b.serviceName}</div>
                      <span className="text-[10px] text-slate-400 block">{b.address.area}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap font-bold text-white">
                      ₹{total}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-[11px]">
                      <div className="text-emerald-400 font-bold">Artisan: ₹{workerCut}</div>
                      <div className="text-purple-400 text-[10px]">Welfare: ₹{welfareCut}</div>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        b.status === 'service_completed' 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                          : b.status === 'on_the_way'
                          ? 'bg-sky-950 text-sky-300 border-sky-800'
                          : 'bg-purple-950 text-purple-300 border-purple-800'
                      }`}>
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(b)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
                        title="View Full Ticket Details"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenManualIntervene(b.id)}
                        className="px-2 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-[10px] font-bold transition-colors cursor-pointer"
                        title="Reassign Worker"
                      >
                        Reassign
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCompleteOverride(b)}
                        className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        title="Administrative Completion"
                      >
                        Complete
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelJob(b)}
                        className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[10px] font-bold transition-colors cursor-pointer"
                        title="Cancel Ticket with Reason"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Inspector Drawer */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-purple-400 uppercase font-bold">COOPERATIVE DISPATCH DOSSIER</span>
                <h3 className="text-base font-bold text-white">{selectedJob.bookingCode} • {selectedJob.serviceName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#111A2E] border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">Customer:</span>
                  <span className="font-bold text-white">{selectedJob.userName}</span>
                  <span className="text-[11px] text-slate-400 block">{selectedJob.customerPhone || '+91 98409 11223'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Assigned Artisan:</span>
                  <span className="font-bold text-white">{selectedJob.workerName}</span>
                  <span className="text-[11px] text-emerald-400 block">{selectedJob.workerPhone}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] block">Customer Reported Problem:</span>
                <p className="text-slate-200 mt-1 p-2.5 rounded-lg bg-[#111A2E] border border-slate-800">
                  {selectedJob.problemDescription}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#111A2E] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Fare</span>
                  <span className="text-sm font-bold text-white">₹{selectedJob.pricing?.totalAmount || 450}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/60">
                  <span className="text-[10px] text-emerald-400 block">Artisan Payout (95%)</span>
                  <span className="text-sm font-bold text-emerald-400">₹{Math.round((selectedJob.pricing?.totalAmount || 450) * 0.95)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-900/60">
                  <span className="text-[10px] text-purple-400 block">Welfare Pool (5%)</span>
                  <span className="text-sm font-bold text-purple-300">₹{Math.round((selectedJob.pricing?.totalAmount || 450) * 0.05)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
