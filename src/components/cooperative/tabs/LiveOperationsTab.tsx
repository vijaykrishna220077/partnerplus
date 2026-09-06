import React, { useState } from 'react';
import { 
  Radio, 
  Flame, 
  Clock, 
  MapPin, 
  Phone, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Filter, 
  Search,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { Booking, Worker } from '../../../types';

interface LiveOperationsTabProps {
  bookings: Booking[];
  workers: Worker[];
  onOpenManualIntervene: (jobId: string) => void;
  onOpenLiveMap: () => void;
}

export const LiveOperationsTab: React.FC<LiveOperationsTabProps> = ({
  bookings,
  workers,
  onOpenManualIntervene,
  onOpenLiveMap
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'EMERGENCY' | 'UNASSIGNED' | 'ACTIVE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Emergency tickets
  const emergencyBookings = bookings.filter(b => b.isEmergency);
  const unassignedCount = bookings.filter(b => b.status === 'requested').length;

  const filteredBookings = bookings.filter(b => {
    if (filterMode === 'EMERGENCY') return b.isEmergency;
    if (filterMode === 'UNASSIGNED') return b.status === 'requested';
    if (filterMode === 'ACTIVE') return ['worker_assigned', 'on_the_way', 'arrived', 'service_started'].includes(b.status);
    return true;
  }).filter(b => {
    return (
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.workerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Live Operational Control Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#111827] via-[#0F172A] to-[#1E1B4B] border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <h2 className="text-base font-black font-mono tracking-tight uppercase">
              LIVE DISPATCH CONTROL &amp; EMERGENCY QUEUE
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
              SLA DISPATCH: &lt; 5 MINS
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time operations dispatch monitoring for ongoing work orders, live ETAs, and emergency calls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenLiveMap}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
          >
            <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>Open Tactical Radar</span>
          </button>
        </div>
      </div>

      {/* SLA & Status Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#111A2E] rounded-2xl border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket code, trade, area, or worker..."
              className="w-full bg-[#0F172A] border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              filterMode === 'ALL' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All Live ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('EMERGENCY')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              filterMode === 'EMERGENCY' ? 'bg-rose-900 text-rose-200 border border-rose-700' : 'bg-slate-800 text-rose-400 hover:text-rose-200'
            }`}
          >
            Emergency ({emergencyBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('UNASSIGNED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              filterMode === 'UNASSIGNED' ? 'bg-amber-900 text-amber-200 border border-amber-700' : 'bg-slate-800 text-amber-400 hover:text-amber-200'
            }`}
          >
            Unassigned ({unassignedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              filterMode === 'ACTIVE' ? 'bg-emerald-900 text-emerald-200 border border-emerald-700' : 'bg-slate-800 text-emerald-400 hover:text-emerald-200'
            }`}
          >
            In Progress
          </button>
        </div>
      </div>

      {/* Emergency Call Queue Highlighted Prominently */}
      {emergencyBookings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              PRIORITY EMERGENCY DISPATCH QUEUE
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyBookings.map((b) => (
              <div 
                key={b.id}
                className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/80 text-white space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-rose-400 text-sm">
                        {b.bookingCode}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-900 text-rose-200 font-bold animate-pulse">
                        EMERGENCY BREAKDOWN
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white mt-1">
                      {b.serviceName}
                    </h4>
                    <p className="text-xs text-rose-200/80 mt-0.5">
                      {b.problemDescription}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-rose-400 block">
                      Target SLA
                    </span>
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      &lt; 15 mins
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-900/60 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Location:</span>
                    <span className="text-white font-semibold">{b.address.area}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Customer Phone:</span>
                    <a href={`tel:${b.customerPhone || '+91 98409 11223'}`} className="text-sky-300 font-semibold flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {b.customerPhone || '+91 98409 11223'}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned Worker:</span>
                    <span className="text-white font-semibold">{b.workerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Worker Phone:</span>
                    <a href={`tel:${b.workerPhone}`} className="text-emerald-300 font-semibold flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {b.workerPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                    Dispatched from sector station
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenManualIntervene(b.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs shadow transition-colors cursor-pointer"
                  >
                    Intervene Dispatch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Routine & Active Operations Table */}
      <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase text-white">
              ACTIVE DISPATCH QUEUE ({filteredBookings.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status tracking: Requested → Assigned → On The Way → Arrived → In Progress → Completed.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase bg-[#0C1322]/60">
                <th className="py-2.5 px-3">Ticket</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Artisan</th>
                <th className="py-2.5 px-3">Area &amp; ETA</th>
                <th className="py-2.5 px-3">Current Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="text-purple-400 font-bold">{b.bookingCode}</span>
                    {b.isEmergency && (
                      <span className="ml-1 text-[9px] uppercase px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        EMG
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white">{b.serviceName}</div>
                    <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                      {b.problemDescription}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="text-slate-200 font-semibold">{b.userName}</div>
                    <a href={`tel:${b.customerPhone || '+91 98409 11223'}`} className="text-[10px] text-sky-400 flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5" />
                      {b.customerPhone || '+91 98409 11223'}
                    </a>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="text-white font-medium">{b.workerName}</div>
                    <a href={`tel:${b.workerPhone}`} className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5" />
                      {b.workerPhone}
                    </a>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="text-slate-300">{b.address.area}</div>
                    <span className="text-[10px] text-emerald-400 font-bold">ETA: 15 mins (2.4 km)</span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      b.status === 'service_completed' 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                        : b.status === 'on_the_way'
                        ? 'bg-sky-950 text-sky-300 border-sky-800 animate-pulse'
                        : 'bg-purple-950 text-purple-300 border-purple-800'
                    }`}>
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onOpenManualIntervene(b.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 border border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Assign / Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
