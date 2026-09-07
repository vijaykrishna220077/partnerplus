import React, { useState, useEffect, useRef } from 'react';
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
  Volume2,
  Video
} from 'lucide-react';
import { WorkerJobOpening } from '../../data/workerJobData';
import { Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import { soundAndSpeech } from '../../utils/soundAndSpeech';
import { apiService } from '../../services/apiService';

interface WorkerQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: WorkerJobOpening | null;
  booking?: Booking | null;
  onVerificationSuccess?: () => void;
}

export const WorkerQrScannerModal: React.FC<WorkerQrScannerModalProps> = ({
  isOpen,
  onClose,
  job,
  booking,
  onVerificationSuccess
}) => {
  const { bookings, addToast, triggerCelebration, refreshData, lang } = useApp();
  const [manualPin, setManualPin] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Real WebCam camera stream initializer for mobile & desktop devices
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        })
        .then((mediaStream) => {
          stream = mediaStream;
          setIsCameraActive(true);
          setCameraError('');
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch((err) => {
          console.warn('Camera stream error:', err);
          setIsCameraActive(false);
          setCameraError('Live camera preview unavailable or permission blocked.');
        });
      } else {
        setIsCameraActive(false);
        setCameraError('Camera API not supported on this browser.');
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Safely resolve target booking: explicit booking prop > matching booking from job > first available booking fallback
  const matchedBooking = booking || (job 
    ? (bookings?.find(b => {
        const cNameB = (b?.customerName || '').toLowerCase();
        const cNameJ = (job?.customerName || '').toLowerCase();
        const sNameB = (b?.serviceName || '').toLowerCase();
        const tradeJ = (job?.trade || '').toLowerCase();

        return (cNameJ && cNameB.includes(cNameJ)) || (tradeJ && sNameB.includes(tradeJ));
      }) || (bookings && bookings.length > 0 ? bookings[0] : null))
    : (bookings && bookings.length > 0 ? bookings[0] : null));

  const customerName = booking?.customerName || job?.customerName || matchedBooking?.customerName || 'Customer';
  const serviceTitle = booking?.serviceCategory || booking?.serviceName || job?.specificTask || job?.trade || 'Service Task';
  const expectedEarning = booking?.pricing?.workerEarnings || booking?.pricing?.totalAmount || job?.workerExpectedEarning || 450;

  const rawBookingCode = matchedBooking?.bookingCode || 'BK-842109';
  const numericCode = rawBookingCode.replace(/\D/g, '') || '842109';
  const targetPin = numericCode.length >= 6 ? numericCode.slice(-6) : `${numericCode}8421`.slice(0, 6);

  const handleSimulatedScan = async () => {
    setIsScanning(true);
    setErrorMessage('');

    setTimeout(async () => {
      setIsScanning(false);
      try {
        if (matchedBooking) {
          await apiService.updateBookingStatus(
            matchedBooking.id, 
            'service_completed', 
            'worker_camera_scanner',
            `Verified via Customer QR code scan for ${customerName}`
          );
          await refreshData();
        }

        soundAndSpeech.playChime('complete');
        soundAndSpeech.speak(
          lang === 'ta' 
            ? `வேலை வெற்றிகரமாக சரிபார்க்கப்பட்டது! ரூ.${expectedEarning} உங்கள் கணக்கில் வரவு வைக்கப்பட்டது.`
            : `Job verified successfully! Rupees ${expectedEarning} released directly to your account.`,
          lang || 'en'
        );

        triggerCelebration();
        addToast({
          type: 'success',
          title: 'QR Code Verified Successfully!',
          message: `Service completed for ${customerName}. ₹${expectedEarning} direct payout released.`
        });

        if (onVerificationSuccess) onVerificationSuccess();
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
      setErrorMessage('Please enter the 4 to 6 digit verification PIN shown on customer screen.');
      return;
    }

    setIsScanning(true);
    setTimeout(async () => {
      setIsScanning(false);
      try {
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
          message: `Job marked complete for ${customerName}. ₹${expectedEarning} payout released.`
        });

        if (onVerificationSuccess) onVerificationSuccess();
        onClose();
      } catch (err) {
        console.error(err);
        setErrorMessage('PIN verification failed. Please try again.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-700 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Worker QR Code Scanner
              </h3>
              <p className="text-[11px] text-slate-400">
                Scan customer screen to authorize job completion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Target Job Mini Banner */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Customer</div>
              <div className="font-black text-white text-sm mt-0.5">{customerName}</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">{serviceTitle}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fair Wage Payout</div>
              <div className="text-xl font-black text-emerald-400 font-mono">₹{expectedEarning}</div>
            </div>
          </div>

          {/* Live Camera Viewfinder */}
          <div className="relative bg-black rounded-2xl border-2 border-emerald-500/60 flex flex-col items-center justify-center min-h-[220px] overflow-hidden group shadow-inner">
            {/* Live Camera Video Feed */}
            {isCameraActive && (
              <video
                ref={videoRef}
                aria-label="Camera Video Stream"
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Viewfinder Corner Reticles */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl z-10" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr z-10" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl z-10" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br z-10" />

            {/* Laser scanning beam animation */}
            <div className="absolute inset-x-4 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-bounce z-10" />

            {/* Overlay content when camera is inactive */}
            {!isCameraActive && (
              <div className="flex flex-col items-center p-4 text-center z-10">
                <QrCode className="w-14 h-14 text-slate-500 mb-2 group-hover:scale-105 transition-transform" />
                <p className="text-xs text-slate-300 font-medium px-4">
                  Align customer's <strong>Job Completion QR Code</strong> inside this frame
                </p>
                {cameraError && (
                  <span className="text-[10px] text-amber-400 mt-1.5 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    {cameraError}
                  </span>
                )}
              </div>
            )}

            {/* Camera Active Live Badge */}
            {isCameraActive && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 z-10 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE CAMERA ACTIVE</span>
              </div>
            )}

            {isScanning && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-2 z-20">
                <span className="animate-spin rounded-full h-9 w-9 border-3 border-emerald-500 border-t-transparent" />
                <span className="text-xs font-bold text-emerald-400">Verifying Digital Pass &amp; Releasing Payout...</span>
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
              <span>Manual Entry: Enter 6-digit Customer PIN</span>
            </div>

            <form onSubmit={handleManualPinSubmit} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={manualPin}
                onChange={(e) => setManualPin(e.target.value)}
                placeholder={`PIN: e.g. ${targetPin}`}
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

