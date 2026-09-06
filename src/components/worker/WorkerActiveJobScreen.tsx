import React, { useState } from 'react';
import { 
  Phone, 
  Navigation, 
  Volume2, 
  MapPin, 
  Clock, 
  Check, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Receipt,
  Car,
  CheckCircle2,
  Camera,
  QrCode,
  MessageSquare
} from 'lucide-react';
import { WorkerJobOpening } from '../../data/workerJobData';
import { LiveRouteMapTracker } from '../common/LiveRouteMapTracker';

export type ActiveStepStatus = 'accepted' | 'on_the_way' | 'arrived' | 'in_progress' | 'completed';

interface WorkerActiveJobScreenProps {
  job: WorkerJobOpening;
  status: ActiveStepStatus;
  onAdvanceStatus: () => void;
  onCallCustomer: () => void;
  onGetDirections: () => void;
  onListenInstructions: () => void;
  onReportProblem: () => void;
  onOpenQrScanner?: () => void;
  onOpenChat?: () => void;
}

export const WorkerActiveJobScreen: React.FC<WorkerActiveJobScreenProps> = ({
  job,
  status,
  onAdvanceStatus,
  onCallCustomer,
  onGetDirections,
  onListenInstructions,
  onReportProblem,
  onOpenQrScanner,
  onOpenChat
}) => {
  const [extraMaterialsCost, setExtraMaterialsCost] = useState<number>(0);
  const totalPayout = job.workerExpectedEarning + extraMaterialsCost;

  return (
    <div className="bg-white rounded-3xl border-3 border-blue-600 shadow-xl overflow-hidden animate-in fade-in duration-300">
      {/* Top Banner: Active Status & Expected Cash */}
      <div className="bg-blue-600 text-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-3xl">
              {job.tradeIcon}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400 text-black text-[11px] font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
                <span>Active Job in Progress</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">
                {job.specificTask}
              </h2>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 text-right border border-white/20">
            <div className="text-[11px] text-blue-100 font-bold uppercase tracking-wider">
              Cash on Completion
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              ₹{totalPayout}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* 5-Step Visual Progression Indicator */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase text-gray-500 tracking-wider">
            Job Progress Status
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs font-black">
            {/* Step 1: Accepted */}
            <div className={`p-2.5 rounded-xl border transition ${
              status === 'accepted' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <div className="text-lg">🤝</div>
              <div className="mt-0.5">1. Accepted</div>
            </div>

            {/* Step 2: On The Way */}
            <div className={`p-2.5 rounded-xl border transition ${
              status === 'on_the_way' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300' 
                : ['arrived', 'in_progress', 'completed'].includes(status)
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            }`}>
              <div className="text-lg">🛵</div>
              <div className="mt-0.5">2. On The Way</div>
            </div>

            {/* Step 3: Arrived */}
            <div className={`p-2.5 rounded-xl border transition ${
              status === 'arrived' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300' 
                : ['in_progress', 'completed'].includes(status)
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            }`}>
              <div className="text-lg">📍</div>
              <div className="mt-0.5">3. Arrived</div>
            </div>

            {/* Step 4: Working */}
            <div className={`p-2.5 rounded-xl border transition ${
              status === 'in_progress' 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300' 
                : status === 'completed'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            }`}>
              <div className="text-lg">⚡</div>
              <div className="mt-0.5">4. Working</div>
            </div>

            {/* Step 5: Completed */}
            <div className={`p-2.5 rounded-xl border transition ${
              status === 'completed' 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                : 'bg-gray-100 text-gray-400 border-gray-200'
            }`}>
              <div className="text-lg">💵</div>
              <div className="mt-0.5">5. Done & Paid</div>
            </div>
          </div>
        </div>

        {/* Live Zomato-Style Navigation & Arrival Map */}
        <LiveRouteMapTracker
          mode="worker"
          workerName="You (Artisan)"
          customerName={job.customerName}
          customerAddress={job.customerAddress}
          status={status}
          distanceKm={job.distanceKm}
          etaMinutes={Math.max(4, Math.round(job.distanceKm * 4))}
          onCall={onCallCustomer}
          onChat={onOpenChat}
        />

        {/* Customer & Location Details Box */}
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/80 pb-3">
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase">Customer</div>
              <div className="text-base font-black text-gray-900 flex items-center gap-1.5">
                <span>{job.customerName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-bold text-gray-500 uppercase">Distance & ETA</div>
              <div className="text-sm font-black text-blue-700">
                {job.distanceKm} km • ~{Math.max(5, Math.round(job.distanceKm * 4))} mins travel
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Full Service Address</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-800 mt-1">
              {job.customerAddress}
            </p>
          </div>

          <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200">
            <span className="font-bold text-gray-800">Customer Instructions:</span> {job.description}
          </div>
        </div>

        {/* Quick Action Bar: Call Customer, Directions, Listen */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Call Customer (Masked Call) */}
          <button
            type="button"
            onClick={onCallCustomer}
            className="py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </button>

          {/* Real-time Chat with Customer */}
          {onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
          )}

          {/* Get Directions (Google Maps) */}
          <button
            type="button"
            onClick={onGetDirections}
            className="py-3 px-3 bg-amber-500 hover:bg-amber-600 text-black rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Map</span>
          </button>

          {/* Read Aloud */}
          <button
            type="button"
            onClick={onListenInstructions}
            className="py-3 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-black text-xs sm:text-sm border border-gray-300 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span>Listen</span>
          </button>
        </div>

        {/* Verification via Customer Service QR */}
        {onOpenQrScanner && (
          <div>
            <button
              type="button"
              onClick={onOpenQrScanner}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-950 text-emerald-400 border border-emerald-500/40 rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2.5 shadow-md cursor-pointer active:scale-98"
            >
              <Camera className="w-5 h-5 text-emerald-400" />
              <span>SCAN CUSTOMER SERVICE QR TO VERIFY COMPLETION</span>
              <QrCode className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        )}

        {/* PRIMARY PROGRESSION BUTTON (GIANT & TACTILE) */}
        <div>
          <button
            type="button"
            onClick={onAdvanceStatus}
            className={`w-full py-4 sm:py-5 px-6 rounded-2xl font-black text-base sm:text-lg transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer active:scale-98 ${
              status === 'accepted'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 ring-4 ring-blue-100'
                : status === 'on_the_way'
                ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/30 ring-4 ring-amber-100'
                : status === 'arrived'
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30 ring-4 ring-purple-100'
                : status === 'in_progress'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 ring-4 ring-emerald-100'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {status === 'accepted' && (
              <>
                <Car className="w-6 h-6" />
                <span>START TRAVELLING (I AM ON THE WAY)</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}

            {status === 'on_the_way' && (
              <>
                <MapPin className="w-6 h-6" />
                <span>I HAVE ARRIVED AT SITE</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}

            {status === 'arrived' && (
              <>
                <Wrench className="w-6 h-6" />
                <span>START WORK NOW</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}

            {status === 'in_progress' && (
              <>
                <CheckCircle2 className="w-6 h-6" />
                <span>WORK COMPLETED (READY FOR PAYMENT)</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}

            {status === 'completed' && (
              <>
                <Check className="w-6 h-6" />
                <span>CONFIRM PAYMENT RECEIVED (₹{totalPayout})</span>
              </>
            )}
          </button>
        </div>

        {/* Report Problem or Emergency Situation */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onReportProblem}
            className="text-gray-500 hover:text-red-600 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Report a problem with this job</span>
          </button>

          <a
            href="tel:1800123456"
            className="text-red-600 font-extrabold flex items-center gap-1 hover:underline"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Help Line</span>
          </a>
        </div>
      </div>
    </div>
  );
};
