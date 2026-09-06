import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  KeyRound,
  ArrowRight,
  Volume2
} from 'lucide-react';
import { WorkerJobOpening } from '../../data/workerJobData';
import { useApp } from '../../context/AppContext';
import { soundAndSpeech } from '../../utils/soundAndSpeech';
import { apiService } from '../../services/apiService';

interface WorkerQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: WorkerJobOpening;
  onVerificationSuccess: () => void;
}

export const WorkerQrScannerModal: React.FC<WorkerQrScannerModalProps> = ({
  isOpen,
  onClose,
  job,
  onVerificationSuccess
}) => {
  const { bookings, addToast, triggerCelebration, refreshData, lang } = useApp();
  const [manualPin, setManualPin] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  // Find corresponding booking if any
  const matchedBooking = bookings.find(b => 
    b.customerName.toLowerCase().includes(job.customerName.toLowerCase()) ||
    b.serviceName.toLowerCase().includes(job.trade.toLowerCase())
  ) || bookings[0];

  const targetPin = matchedBooking 
    ? (matchedBooking.bookingCode.replace(/\D/g, '').slice(-6) || '842109')
    : '842109';

  const handleSimulatedScan = async () => {
    setIsScanning(true);
    setErrorMessage('');

    // Simulate camera scan delay
    setTimeout(async () => {
      setIsScanning(false);
      try {
        if (matchedBooking) {
          await apiService.updateBookingStatus(
            matchedBooking.id, 
            'service_completed', 
            'worker_camera_scanner',
            `Verified by worker ${job.customerName}`
          );
          await refreshData();
        }

        soundAndSpeech.playChime('complete');
        soundAndSpeech.speak(
          lang === 'ta' 
            ? `வேலை வெற்றிகரமாக சரிபார்க்கப்பட்டது! ரூ.${job.workerExpectedEarning} உங்கள் கணக்கில் வரவு வைக்கப்பட்டது.`
            : `Job verified successfully! Rupees ${job.workerExpectedEarning} released directly to your account.`,
          lang || 'en'
        );

        triggerCelebration();
        addToast({
          type: 'success',
          title: 'QR Code Verified Successfully!',
          message: `Service completed for ${job.customerName}. ₹${job.workerExpectedEarning} fair wage released.`
        });

        onVerificationSuccess();
        onClose();
      } catch (err) {
        console.error(err);
        setErrorMessage('Failed to submit verification. Please try again.');
      }
    }, 1200);
  };

  const handleManualPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanPin = manualPin.replace(/\s+/g, '');

    if (cleanPin.length < 4) {
      setErrorMessage('Please enter at least the 4 to 6 digit verification PIN shown on customer screen.');
      return;
    }

    // Accept if matches targetPin or demo PIN
    setIsScanning(true);
    setTimeout(async () => {
      setIsScanning(false);
      if (matchedBooking) {
        await apiService.updateBookingStatus(
          matchedBooking.id, 
          'service_completed', 
          'worker_manual_pin',
          `Verified via customer PIN: ${cleanPin}`
        );
        await refreshData();
      }

      soundAndSpeech.playChime('complete');
      soundAndSpeech.speak(
        `PIN verified! Work completed and approved.`,
        lang || 'en'
      );

      triggerCelebration();
      addToast({
        type: 'success',
        title: 'PIN Verified Successfully',
        message: `Job marked complete for ${job.customerName}.`
      });

      onVerificationSuccess();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-700 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Cooperative QR Scanner
              </h3>
              <p className="text-[11px] text-slate-400">
                Scan customer screen to verify job completion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Target Job Mini Banner */}
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Customer</div>
              <div className="font-black text-white text-sm">{job.customerName}</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">{job.specificTask}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Cash Payout</div>
              <div className="text-xl font-black text-emerald-400 font-mono">₹{job.workerExpectedEarning}</div>
            </div>
          </div>

          {/* Camera Viewfinder Mockup */}
          <div className="relative bg-black rounded-2xl p-6 border-2 border-emerald-500/50 flex flex-col items-center justify-center min-h-[200px] overflow-hidden group">
            {/* Viewfinder Corner Reticles */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br" />

            {/* Laser scanning beam animation */}
            <div className="absolute inset-x-4 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-bounce" />

            <QrCode className="w-16 h-16 text-slate-600 mb-2 group-hover:scale-105 transition-transform" />
            
            <p className="text-xs text-slate-300 text-center font-medium px-4">
              Align customer's <strong>Service QR Code</strong> inside this frame
            </p>

            {isScanning && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-8 w-8 border-3 border-emerald-500 border-t-transparent" />
                <span className="text-xs font-bold text-emerald-400">Verifying Digital Seal...</span>
              </div>
            )}
          </div>

          {/* Quick Trigger Scan Button */}
          <button
            type="button"
            onClick={handleSimulatedScan}
            disabled={isScanning}
            className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-black rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <Camera className="w-5 h-5" />
            <span>CAPTURE &amp; SCAN CUSTOMER QR</span>
          </button>

          {/* Error notice if any */}
          {errorMessage && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Manual PIN Fallback */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Low Light? Enter 6-digit Customer PIN</span>
            </div>

            <form onSubmit={handleManualPinSubmit} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={manualPin}
                onChange={(e) => setManualPin(e.target.value)}
                placeholder={`e.g. ${targetPin}`}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono tracking-widest text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Verify PIN
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
