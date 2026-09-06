import React from 'react';
import { Volume2, Check, X, Phone, MapPin, Sparkles, Navigation } from 'lucide-react';
import { WorkerJobOpening } from '../../data/workerJobData';

interface WorkerSimpleModeViewProps {
  jobs: WorkerJobOpening[];
  isOnline: boolean;
  onAcceptJob: (job: WorkerJobOpening) => void;
  onListen: (job: WorkerJobOpening) => void;
  onToggleDuty: () => void;
  onExitSimpleMode: () => void;
}

export const WorkerSimpleModeView: React.FC<WorkerSimpleModeViewProps> = ({
  jobs,
  isOnline,
  onAcceptJob,
  onListen,
  onToggleDuty,
  onExitSimpleMode
}) => {
  const currentJob = jobs[0];

  return (
    <div className="bg-amber-50/50 min-h-[80vh] p-3 sm:p-6 space-y-6">
      {/* Top Banner with Exit Simple Mode */}
      <div className="flex items-center justify-between bg-amber-400 p-4 rounded-3xl text-black shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          <span className="text-base sm:text-lg font-black uppercase tracking-wide">
            Simple Mode (सरल मोड)
          </span>
        </div>

        <button
          onClick={onExitSimpleMode}
          className="px-4 py-2 bg-black text-white font-black text-xs sm:text-sm rounded-2xl cursor-pointer"
        >
          Exit (वापस जाएं)
        </button>
      </div>

      {/* Giant Duty Button */}
      <button
        onClick={onToggleDuty}
        className={`w-full py-6 px-6 rounded-3xl font-black text-xl sm:text-2xl shadow-lg flex items-center justify-center gap-4 transition cursor-pointer active:scale-98 ${
          isOnline
            ? 'bg-emerald-600 text-white shadow-emerald-600/30'
            : 'bg-gray-800 text-white'
        }`}
      >
        <span className="text-3xl">{isOnline ? '🟢' : '⚪'}</span>
        <span>{isOnline ? 'DUTY ON (काम चालू है)' : 'DUTY OFF (काम बंद है)'}</span>
      </button>

      {/* Available Job Giant Display */}
      {currentJob ? (
        <div className="bg-white rounded-3xl p-6 border-4 border-emerald-500 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="text-6xl">{currentJob.tradeIcon}</div>
            <div className="text-xs font-black uppercase text-blue-600 tracking-wider">
              {currentJob.serviceName}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {currentJob.specificTask}
            </h2>
          </div>

          {/* Giant Earning Display */}
          <div className="bg-emerald-100 rounded-3xl p-5 text-center border-2 border-emerald-400">
            <div className="text-xs font-black uppercase text-emerald-900">
              Aapki Kamai (आपकी कमाई)
            </div>
            <div className="text-4xl sm:text-5xl font-black text-emerald-700 mt-1">
              ₹{currentJob.workerExpectedEarning}
            </div>
            <div className="text-xs text-emerald-800 font-bold mt-1">
              Customer Payment: ₹{currentJob.customerPrice}
            </div>
          </div>

          {/* Simple Details (Distance & Time) */}
          <div className="grid grid-cols-2 gap-3 text-center text-sm font-black">
            <div className="bg-gray-100 p-4 rounded-2xl">
              <div className="text-2xl">📍</div>
              <div className="text-gray-900 mt-1">{currentJob.serviceArea.split(',')[0]}</div>
              <div className="text-xs text-gray-500">{currentJob.distanceKm} km dur</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-2xl">
              <div className="text-2xl">⏰</div>
              <div className="text-gray-900 mt-1">{currentJob.scheduledDate}</div>
              <div className="text-xs text-gray-500">{currentJob.startTime}</div>
            </div>
          </div>

          {/* Giant Voice Button */}
          <button
            onClick={() => onListen(currentJob)}
            className="w-full py-4 px-6 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition cursor-pointer border-2 border-blue-300"
          >
            <Volume2 className="w-7 h-7 text-blue-700" />
            <span>BOL KE SUNAO (आवाज़ में सुनें)</span>
          </button>

          {/* Two Giant Buttons: Reject & Accept */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => onAcceptJob(currentJob)}
              className="py-5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black text-lg sm:text-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Check className="w-7 h-7" />
              <span>KAAAM SWIKAR KAREIN (ACCEPT)</span>
            </button>

            <a
              href="tel:1800123456"
              className="py-5 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-3xl font-black text-lg sm:text-xl flex items-center justify-center gap-2 text-center"
            >
              <Phone className="w-6 h-6 text-gray-600" />
              <span>HELPLINE (सहायता)</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center space-y-4 border-2 border-gray-200">
          <div className="text-6xl">☕</div>
          <h3 className="text-2xl font-black text-gray-800">
            Koi kaam abhi nahi hai (कोई नया काम नहीं)
          </h3>
          <p className="text-sm text-gray-500">
            Phone ko paas rakhein. Naya kaam aate hi ghanti bajegi.
          </p>
        </div>
      )}
    </div>
  );
};
