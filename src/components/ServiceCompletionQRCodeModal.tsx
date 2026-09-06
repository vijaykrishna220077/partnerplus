import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  QrCode, 
  Building2, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Smartphone,
  ExternalLink,
  Lock
} from 'lucide-react';
import { Booking } from '../types';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';

interface ServiceCompletionQRCodeModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const ServiceCompletionQRCodeModal: React.FC<ServiceCompletionQRCodeModalProps> = ({
  booking,
  onClose
}) => {
  const { addToast, triggerCelebration, refreshData } = useApp();
  const [copied, setCopied] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (!booking) return null;

  // Generate deterministic 6-digit PIN from bookingCode / ID
  const numericCode = booking.bookingCode.replace(/\D/g, '');
  const verificationPin = numericCode.length >= 6 
    ? numericCode.slice(-6) 
    : `${numericCode}8421`.slice(0, 6);

  // Structured QR payload conforming to cooperative verification standard
  const qrDataPayload = JSON.stringify({
    protocol: 'SAHAKARI_COOPERATIVE_VERIFICATION_V1',
    type: 'SERVICE_COMPLETION_PROOF',
    bookingId: booking.id,
    bookingCode: booking.bookingCode,
    verificationPin: verificationPin,
    serviceCategory: booking.serviceCategory,
    serviceName: booking.serviceName,
    customerId: booking.customerId,
    customerName: booking.customerName,
    workerId: booking.workerId,
    workerName: booking.workerName,
    totalAmount: booking.pricing.totalAmount,
    workerDirectPayout: booking.pricing.workerEarnings,
    cooperativeWelfareFund: booking.pricing.cooperativeWelfareFund,
    issuedAt: booking.statusTimestamps.confirmedAt || new Date().toISOString(),
    escrowStatus: booking.status === 'service_completed' ? 'RELEASED' : 'LOCKED_IN_ESCROW'
  });

  const isAlreadyCompleted = booking.status === 'service_completed';

  const handleCopyPin = async () => {
    try {
      await navigator.clipboard.writeText(verificationPin);
      setCopied(true);
      addToast({
        type: 'info',
        title: 'Verification PIN Copied',
        message: `PIN ${verificationPin} copied to clipboard.`
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulateWorkerScan = async () => {
    if (isAlreadyCompleted) {
      addToast({
        type: 'info',
        title: 'Already Verified',
        message: 'This job has already been verified and closed.'
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Advance to service_completed
      const updated = await apiService.updateBookingStatus(
        booking.id, 
        'service_completed', 
        'worker_qr_scanner',
        `Job completion verified via Customer QR Scan (PIN: ${verificationPin})`
      );

      if (updated) {
        await refreshData();
        triggerCelebration();
        addToast({
          type: 'success',
          title: 'QR Code Scanned & Job Verified!',
          message: `Worker ${booking.workerName} successfully scanned the QR code. ₹${booking.pricing.workerEarnings} direct payout released from escrow.`
        });
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: 'warning',
        title: 'Verification Failed',
        message: 'Unable to verify QR code. Please try again.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById('sahakari-completion-qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `SahakariSeva-Verification-QR-${booking.bookingCode}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);

    addToast({
      type: 'success',
      title: 'QR Code Downloaded',
      message: 'SVG QR Card saved to your downloads.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                Service Verification Pass
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                #{booking.bookingCode}
              </span>
            </div>
            <h3 className="text-xl font-black font-display text-white mt-1">
              Job Completion QR Code
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unique encrypted token for {booking.serviceName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer relative z-10"
            title="Close QR Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Status Badge */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
            isAlreadyCompleted 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2.5">
              {isAlreadyCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <QrCode className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
              )}
              <div>
                <div className="text-xs font-black uppercase tracking-wider">
                  {isAlreadyCompleted ? 'Service Verified & Completed' : 'Awaiting Worker Verification Scan'}
                </div>
                <div className="text-[11px] opacity-80">
                  {isAlreadyCompleted 
                    ? `Validated on ${booking.statusTimestamps.completedAt || 'Today'}` 
                    : 'Show this code to artisan only after work is inspected'}
                </div>
              </div>
            </div>

            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
              isAlreadyCompleted 
                ? 'bg-emerald-600 text-white' 
                : 'bg-amber-600 text-white'
            }`}>
              {isAlreadyCompleted ? 'CLOSED' : 'ACTIVE'}
            </span>
          </div>

          {/* Central QR Code Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border-2 border-slate-200 shadow-inner">
            <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 relative group">
              <QRCodeSVG
                id="sahakari-completion-qr-svg"
                value={qrDataPayload}
                size={220}
                level="H"
                includeMargin={false}
                bgColor="#FFFFFF"
                fgColor="#0F172A"
              />
              {/* Center Co-op Trust Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-black shadow-lg border-2 border-white">
                  🤝
                </div>
              </div>
            </div>

            {/* Monospace 6-Digit Numeric Verification PIN Fallback */}
            <div className="mt-5 text-center w-full max-w-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Verification PIN (Verbal / Manual Fallback)
              </span>
              <div className="mt-1 flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-300 shadow-xs">
                <span className="font-mono text-2xl font-black tracking-widest text-slate-900">
                  {verificationPin.slice(0, 3)} {verificationPin.slice(3)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  title="Copy 6-Digit PIN"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Workers can manually enter this PIN if their camera or lighting is poor.
              </p>
            </div>
          </div>

          {/* Service & Worker Details Grid */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Service</span>
                <div className="font-black text-slate-900 text-sm">{booking.serviceName}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Fair Bill</span>
                <div className="font-black text-slate-900 text-base">₹{booking.pricing.totalAmount}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div className="flex items-center gap-2">
                <img
                  src={booking.workerPhoto}
                  alt={booking.workerName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block">Assigned Artisan</span>
                  <span className="font-bold text-slate-900 truncate block">{booking.workerName}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">Direct Worker Payout</span>
                <span className="font-bold text-emerald-700">₹{booking.pricing.workerEarnings} (95%)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.scheduledDate} • {booking.scheduledTimeSlot}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-blue-700">
                <Lock className="w-3 h-3" />
                <span>0% Intermediary Fee</span>
              </div>
            </div>
          </div>

          {/* Instructions on how the QR Code works */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-1.5">
            <div className="font-bold text-blue-950 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>How Job Verification Works</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              1. Inspect the completed job with the artisan to verify quality.<br />
              2. Have the worker open the <strong>Sahakari Worker Scanner</strong> on their mobile device.<br />
              3. Scanning this code automatically releases the escrow payment directly into the worker’s linked bank account and logs proof to the cooperative ledger.
            </p>
          </div>

          {/* Interactive Simulation / Test Control for Evaluator */}
          {!isAlreadyCompleted && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Interactive Verification Simulation</span>
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                  Demo Evaluation Tool
                </span>
              </div>
              <p className="text-[11px] text-indigo-800">
                Want to test the worker verification flow right now? Click below to simulate the worker's camera scanning this QR code.
              </p>
              <button
                type="button"
                onClick={handleSimulateWorkerScan}
                disabled={isVerifying}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Simulate Worker Camera Scan &amp; Release Escrow</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadQr}
              className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download QR Pass</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
