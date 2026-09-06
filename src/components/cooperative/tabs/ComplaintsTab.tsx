import React, { useState } from 'react';
import { 
  MessageSquareWarning, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Phone, 
  User, 
  Clock, 
  DollarSign,
  ShieldAlert
} from 'lucide-react';
import { CooperativeComplaint } from '../../../types';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';
import { useAuth } from '../../../context/AuthContext';

export const ComplaintsTab: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<CooperativeComplaint[]>(() => cooperativeBackend.getComplaints());
  const [selectedComplaint, setSelectedComplaint] = useState<CooperativeComplaint | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const handleStatusChange = (complaint: CooperativeComplaint, newStatus: CooperativeComplaint['status']) => {
    cooperativeBackend.updateComplaintStatus(
      complaint.id,
      newStatus,
      resolutionNote || `Status transitioned to ${newStatus} by ${user?.name || 'Cooperative Admin'}`
    );
    setComplaints(cooperativeBackend.getComplaints());
    setSelectedComplaint(null);
    setResolutionNote('');
  };

  const handleRefundOverride = (complaint: CooperativeComplaint) => {
    const amount = window.prompt(`Enter refund amount to return to customer ${complaint.complainantName} from Cooperative Dispute Reserve:`, '450');
    if (amount) {
      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: 'COMPLAINT_REFUND_ISSUED',
        affectedEntity: 'COMPLAINT',
        entityId: complaint.id,
        previousState: complaint.status,
        newState: 'RESOLVED_REFUND_GRANTED',
        reason: `Refund of ₹${amount} issued to ${complaint.complainantName} with zero penalty deducted from worker pending re-inspection.`
      });

      cooperativeBackend.updateComplaintStatus(complaint.id, 'RESOLVED', `Refund of ₹${amount} authorized by ${user?.name}`);
      setComplaints(cooperativeBackend.getComplaints());
      alert(`Refund granted. Ticket ${complaint.id} resolved.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="p-5 bg-[#111A2E] rounded-3xl border border-slate-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
                COOPERATIVE DISPUTE RESOLUTION &amp; MEDIATION DESK
              </h2>
              <p className="text-xs text-slate-400">
                Official arbitration panel ensuring fair resolution without arbitrary worker deactivations or unpaid dues.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-rose-400 font-bold px-3 py-1 rounded-xl bg-rose-950/60 border border-rose-800">
            {complaints.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length} Active Disputes
          </span>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase bg-[#0C1322]/60">
                <th className="py-2.5 px-3">Complaint ID</th>
                <th className="py-2.5 px-3">Complainant vs Target</th>
                <th className="py-2.5 px-3">Job Reference</th>
                <th className="py-2.5 px-3">Issue Category</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Mediation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3 whitespace-nowrap text-purple-400 font-bold">
                    {c.id}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="text-white font-bold">{c.complainantName}</div>
                    <span className="text-[10px] text-slate-400 block">vs {c.respondentName}</span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap font-mono text-purple-300">
                    {c.jobId}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="text-white font-medium">{c.category}</div>
                    <span className="text-[10px] text-slate-400 block truncate max-w-xs">{c.description}</span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      c.priority === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : c.priority === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      c.status === 'RESOLVED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950/60 text-rose-300 border-rose-800'
                    }`}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedComplaint(c)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Arbitrate
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRefundOverride(c)}
                      className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Refund Customer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mediation Dialog Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-rose-400 uppercase font-bold">COOPERATIVE DISPUTE DOSSIER</span>
                <h3 className="text-base font-bold text-white">{selectedComplaint.id} • {selectedComplaint.category}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#111A2E] border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Complainant Statement:</span>
                <p className="text-slate-200 mt-1">{selectedComplaint.description}</p>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Official Mediation Resolution Notes:
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  rows={3}
                  placeholder="Enter findings from speaking with both parties and agreed settlement terms..."
                  className="w-full bg-[#111A2E] border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedComplaint, 'UNDER_INVESTIGATION')}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Mark Under Investigation
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedComplaint, 'MEDIATION')}
                  className="py-2 px-3 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 text-xs font-bold"
                >
                  Schedule Mediation
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedComplaint, 'RESOLVED')}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Mark Amicably Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
