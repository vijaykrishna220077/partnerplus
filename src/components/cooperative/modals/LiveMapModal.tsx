import React, { useState } from 'react';
import { X, MapPin, Navigation, Flame, Shield, CheckCircle2, User, Phone, Radio, Filter } from 'lucide-react';
import { mockBookings, mockWorkers } from '../../../data/mockData';

interface LiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManualIntervene?: (jobId: string) => void;
}

interface MapMarker {
  id: string;
  type: 'emergency_job' | 'active_job' | 'available_worker';
  title: string;
  subtitle: string;
  area: string;
  coords: { x: number; y: number }; // Percentage 0-100% on schematic map
  status: string;
  trade?: string;
  workerName?: string;
  phone?: string;
  eta?: string;
}

export const LiveMapModal: React.FC<LiveMapModalProps> = ({
  isOpen,
  onClose,
  onManualIntervene
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'EMERGENCY' | 'ACTIVE_JOBS' | 'WORKERS'>('ALL');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  if (!isOpen) return null;

  // Realistic map nodes plotted across the schematic urban grid
  const markers: MapMarker[] = [
    {
      id: 'map-emg-1',
      type: 'emergency_job',
      title: 'Emergency: Overhead Pipe Burst',
      subtitle: 'Water main gushing, power cut risk',
      area: 'Anna Nagar (2nd Avenue)',
      coords: { x: 38, y: 32 },
      status: 'UNASSIGNED - PRIORITY CALL',
      phone: '+91 98409 11223',
      eta: 'Immediate (15m Target)'
    },
    {
      id: 'map-emg-2',
      type: 'emergency_job',
      title: 'Emergency: Sparking Switchboard',
      subtitle: 'Smell of burning wire in apartment',
      area: 'T. Nagar (Pondy Bazaar)',
      coords: { x: 55, y: 58 },
      status: 'DISPATCHING',
      phone: '+91 98401 55667',
      eta: '18 mins'
    },
    {
      id: 'map-job-1',
      type: 'active_job',
      title: 'Job: Fan Rewiring & Fitting',
      subtitle: 'Artisan Murugan on the way',
      area: 'Mylapore',
      coords: { x: 68, y: 72 },
      status: 'ON THE WAY',
      workerName: 'Murugan Thangaraj',
      eta: '12 mins'
    },
    {
      id: 'map-job-2',
      type: 'active_job',
      title: 'Job: Door Lock Replacement',
      subtitle: 'Artisan Selvam arrived on site',
      area: 'Adyar',
      coords: { x: 74, y: 82 },
      status: 'IN PROGRESS',
      workerName: 'Selvam Arumugam',
      eta: 'On Site'
    },
    {
      id: 'map-wrk-1',
      type: 'available_worker',
      title: 'Ravi Kumar (Master Plumber)',
      subtitle: 'Govt Certified • Emergency Ready',
      area: 'Anna Nagar East',
      trade: 'Plumbing',
      coords: { x: 42, y: 28 },
      status: 'AVAILABLE TODAY',
      phone: '+91 98401 23456',
      eta: '5 mins to Sector'
    },
    {
      id: 'map-wrk-2',
      type: 'available_worker',
      title: 'Suresh Narayanan (Senior Electrician)',
      subtitle: 'Licensed Wireman Grade-B',
      area: 'Kilpauk / Anna Nagar Border',
      trade: 'Electrical',
      coords: { x: 48, y: 36 },
      status: 'AVAILABLE TODAY',
      phone: '+91 97890 12345',
      eta: '8 mins to Sector'
    },
    {
      id: 'map-wrk-3',
      type: 'available_worker',
      title: 'Kavita Sundaram (Gardener)',
      subtitle: 'Horticulture Certified',
      area: 'Velachery',
      trade: 'Gardening',
      coords: { x: 62, y: 85 },
      status: 'AVAILABLE TODAY',
      phone: '+91 98404 99001',
      eta: '15 mins to Sector'
    }
  ];

  const filteredMarkers = markers.filter(m => {
    if (activeFilter === 'EMERGENCY') return m.type === 'emergency_job';
    if (activeFilter === 'ACTIVE_JOBS') return m.type === 'active_job';
    if (activeFilter === 'WORKERS') return m.type === 'available_worker';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
      <div 
        className="w-full max-w-6xl h-[90vh] bg-[#0A0F1D] border border-slate-800 rounded-2xl shadow-2xl flex flex-col text-white overflow-hidden"
        role="dialog"
        aria-label="Official Live Tactical Map"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-white font-mono uppercase">
                  COOPERATIVE TACTICAL OPERATIONS RADAR
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  REAL-TIME JURISDICTION
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Live geolocation clustering with worker privacy zones (approximate before assignment, exact when on site).
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

        {/* Tactical Map Container */}
        <div className="flex-1 relative bg-[#070B14] overflow-hidden flex flex-col md:flex-row">
          
          {/* Main Map Visual Canvas */}
          <div className="flex-1 relative min-h-[350px] p-4 flex items-center justify-center select-none overflow-hidden">
            {/* Grid background lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="absolute inset-0 border border-cyan-900/30 rounded-2xl m-4 pointer-events-none"></div>

            {/* Simulated Geographic Sector Landmarks */}
            <div className="absolute top-10 left-12 text-[10px] font-mono text-cyan-500/40 uppercase tracking-widest pointer-events-none">
              SECTOR 1: ANNA NAGAR / KILPAUK
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-mono text-cyan-500/30 uppercase tracking-widest pointer-events-none">
              CENTRAL CORRIDOR: T. NAGAR / NUNGAMBAKKAM
            </div>
            <div className="absolute bottom-10 right-14 text-[10px] font-mono text-cyan-500/40 uppercase tracking-widest pointer-events-none">
              SECTOR 4: ADYAR / VELACHERY
            </div>

            {/* Radar Sweep Animation Ring */}
            <div className="absolute w-96 h-96 rounded-full border border-cyan-500/10 pointer-events-none animate-ping [animation-duration:6s]"></div>

            {/* Interactive Map Markers */}
            {filteredMarkers.map((marker) => {
              const isSelected = selectedMarker?.id === marker.id;
              const isEmergency = marker.type === 'emergency_job';
              const isWorker = marker.type === 'available_worker';

              return (
                <div
                  key={marker.id}
                  style={{ left: `${marker.coords.x}%`, top: `${marker.coords.y}%` }}
                  onClick={() => setSelectedMarker(marker)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Pulse for emergency */}
                  {isEmergency && (
                    <div className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping"></div>
                  )}

                  {/* Marker Pin */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform ${
                    isSelected ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                  } ${
                    isEmergency 
                      ? 'bg-rose-600 text-white shadow-rose-600/50' 
                      : isWorker 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/50' 
                      : 'bg-sky-600 text-white shadow-sky-600/50'
                  }`}>
                    {isEmergency ? (
                      <Flame className="w-4 h-4" />
                    ) : isWorker ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>

                  {/* Hover Tag */}
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 shadow pointer-events-none opacity-80 group-hover:opacity-100">
                    {marker.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Tactical Sidebar (Marker Inspector) */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-[#0F172A] p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">
                  TACTICAL RADAR FILTERS
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {filteredMarkers.length} Nodes Online
                </span>
              </div>

              {/* Filter Pills */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-left ${
                    activeFilter === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({markers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('EMERGENCY')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-left ${
                    activeFilter === 'EMERGENCY' ? 'bg-rose-900/80 text-rose-200 border border-rose-700' : 'bg-slate-800/60 text-rose-400 hover:text-rose-200'
                  }`}
                >
                  Emergency (2)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('ACTIVE_JOBS')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-left ${
                    activeFilter === 'ACTIVE_JOBS' ? 'bg-sky-900/80 text-sky-200 border border-sky-700' : 'bg-slate-800/60 text-sky-400 hover:text-sky-200'
                  }`}
                >
                  Jobs On Way (2)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('WORKERS')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-left ${
                    activeFilter === 'WORKERS' ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700' : 'bg-slate-800/60 text-emerald-400 hover:text-emerald-200'
                  }`}
                >
                  Artisans (3)
                </button>
              </div>

              {/* Marker Inspector */}
              <div className="border-t border-slate-800 pt-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
                  SELECTED NODE INSPECTOR
                </span>

                {selectedMarker ? (
                  <div className="p-3 rounded-xl bg-[#1E293B] border border-slate-700 text-xs space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        selectedMarker.type === 'emergency_job'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : selectedMarker.type === 'available_worker'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-sky-950 text-sky-300 border border-sky-800'
                      }`}>
                        {selectedMarker.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ETA: {selectedMarker.eta}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {selectedMarker.title}
                      </h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {selectedMarker.subtitle}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-300 font-mono space-y-1 pt-1 border-t border-slate-700/60">
                      <div><span className="text-slate-500">Jurisdiction:</span> {selectedMarker.area}</div>
                      {selectedMarker.phone && (
                        <div><span className="text-slate-500">Contact:</span> {selectedMarker.phone}</div>
                      )}
                      {selectedMarker.trade && (
                        <div><span className="text-slate-500">Trade:</span> {selectedMarker.trade}</div>
                      )}
                    </div>

                    {selectedMarker.type === 'emergency_job' && onManualIntervene && (
                      <button
                        type="button"
                        onClick={() => {
                          onManualIntervene(selectedMarker.id);
                          onClose();
                        }}
                        className="w-full mt-2 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition-colors cursor-pointer"
                      >
                        Intervene &amp; Dispatch Worker Now
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs font-mono text-center">
                    Select any pin on the radar to inspect live status, ETA, and emergency actions.
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Compliance Notice */}
            <div className="pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500">
              🔒 Privacy Protection Zone: Precise GPS coordinates are only exposed to active emergency workers upon confirmed dispatch acceptance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
