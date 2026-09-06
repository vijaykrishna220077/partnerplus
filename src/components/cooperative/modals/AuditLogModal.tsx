import React, { useState, useEffect } from 'react';
import { X, Shield, Search, Filter, History, Download, ArrowRight } from 'lucide-react';
import { CooperativeAuditLog } from '../../../types';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';
import { realtimeHub } from '../../../services/db';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<CooperativeAuditLog[]>(() => cooperativeBackend.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    setLogs(cooperativeBackend.getAuditLogs());

    const unsubscribe = realtimeHub.subscribe('sahakari:audit_logged', (newLog: CooperativeAuditLog) => {
      setLogs(prev => [newLog, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.affectedEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.reason && log.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAction = actionFilter === 'ALL' || log.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["Timestamp,Admin,Role,Action,Entity,EntityID,PreviousState,NewState,Reason"]
      .concat(filteredLogs.map(l => `"${l.timestamp}","${l.adminName}","${l.adminRole}","${l.action}","${l.affectedEntity}","${l.entityId}","${l.previousState || ''}","${l.newState || ''}","${l.reason || ''}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cooperative_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-5xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] text-white overflow-hidden"
        role="dialog"
        aria-label="Cooperative Operations Audit Log"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white font-mono">
                  OFFICIAL COOPERATIVE AUDIT TRAIL
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  TAMPER-EVIDENT LEDGER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Immutable operational trace of all admin actions, dispatch interventions, rules, and verifications.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-[#111A2E] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail by official, ticket, entity or keyword..."
                className="w-full bg-[#0F172A] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-[#0F172A] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-mono"
            >
              <option value="ALL">All Actions</option>
              <option value="VERIFICATION">Verification</option>
              <option value="DISPATCH">Dispatch</option>
              <option value="RULES">Rules & Governance</option>
              <option value="COMPLAINT">Complaints</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Audit Log Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              No audit records match the selected criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase bg-[#111A2E]/50">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Official</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Affected Entity</th>
                    <th className="py-2.5 px-3">State Transition</th>
                    <th className="py-2.5 px-3">Official Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-bold text-white">{log.adminName}</div>
                        <span className="text-[10px] text-purple-400 block">{log.adminRole}</span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-slate-300 font-medium">{log.affectedEntity}</span>
                        <span className="text-slate-500 text-[10px] block">{log.entityId}</span>
                      </td>
                      <td className="py-3 px-3 text-[11px]">
                        {log.previousState && log.newState ? (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <span className="line-through text-slate-500">{log.previousState}</span>
                            <ArrowRight className="w-3 h-3 text-purple-400 shrink-0" />
                            <span className="text-emerald-400 font-semibold">{log.newState}</span>
                          </div>
                        ) : (
                          <span className="text-emerald-400 font-semibold">{log.newState || 'Executed'}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px] max-w-xs truncate">
                        {log.reason || 'Routine cooperative administration'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#1E293B]/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Total Log Entries: {filteredLogs.length}</span>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Real-time Audit Ledger Synchronized
          </span>
        </div>
      </div>
    </div>
  );
};
