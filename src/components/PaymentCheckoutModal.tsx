import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  Lock, 
  Building2,
  HeartHandshake,
  Sparkles,
  Zap
} from 'lucide-react';
import { Booking } from '../types';
import { apiService } from '../services/apiService';
import { initializeRazorpayPayment } from '../services/razorpayService';

export const PaymentCheckoutModal: React.FC = () => {
  const { 
    activePaymentBooking, 
    closePayment, 
    openTracker, 
    addToast, 
    triggerCelebration,
    refreshData 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card' | 'netbanking' | 'cash'>('razorpay');
  const [upiId, setUpiId] = useState<string>('customer@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!activePaymentBooking) return null;
  const booking = activePaymentBooking;

  const handleCompleteSuccessPayment = async (paymentId?: string) => {
    try {
      const updated = await apiService.updateBookingStatus(booking.id, 'worker_accepted');
      await refreshData();
      setIsProcessing(false);
      closePayment();
      triggerCelebration();
      
      if (updated) {
        openTracker(updated);
      }

      addToast({
        type: 'success',
        title: 'Payment Successful! 🎉',
        message: `₹${booking.pricing.totalAmount} processed via ${paymentId ? `Razorpay (Ref: ${paymentId})` : 'Cooperative Gateway'}. ${booking.workerName} is on the way!`
      });
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleCancelPaymentAndBooking = async () => {
    setIsProcessing(true);
    try {
      await apiService.cancelBooking(booking.id, 'Payment cancelled by user', 'customer');
      await refreshData();
      addToast({
        type: 'warning',
        title: 'Payment & Booking Cancelled',
        message: `Booking #${booking.bookingCode} was cancelled because payment was not completed.`
      });
    } catch (e) {
      console.error('Error cancelling booking:', e);
    } finally {
      setIsProcessing(false);
      closePayment();
    }
  };

  const handlePayWithRazorpay = async () => {
    setIsProcessing(true);

    try {
      await initializeRazorpayPayment({
        booking,
        onSuccess: (payload) => {
          handleCompleteSuccessPayment(payload.razorpay_payment_id);
        },
        onFailure: (err) => {
          console.warn('Razorpay checkout cancelled by user:', err);
          setIsProcessing(false);
          addToast({
            type: 'warning',
            title: 'Payment Cancelled',
            message: 'Razorpay checkout was closed. Click Pay to retry or Cancel to void the booking.'
          });
        }
      });
    } catch (err) {
      console.error('Razorpay initialization error:', err);
      setIsProcessing(false);
      addToast({
        type: 'warning',
        title: 'Payment Error',
        message: 'Could not open Razorpay gateway. Please retry or choose Cash on Visit.'
      });
    }
  };

  const handlePayNow = async () => {
    // Route Razorpay, UPI, Card, and NetBanking through Razorpay Checkout SDK
    if (paymentMethod === 'razorpay' || paymentMethod === 'upi' || paymentMethod === 'card' || paymentMethod === 'netbanking') {
      await handlePayWithRazorpay();
      return;
    }

    setIsProcessing(true);

    // Simulate safe transaction for cash selection
    setTimeout(async () => {
      await handleCompleteSuccessPayment();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold tracking-wider uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                  Razorpay Verified
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                  Escrow Protected
                </span>
              </div>
              <h3 className="text-lg font-bold font-serif text-white mt-0.5">
                Cooperative Payment Gateway
              </h3>
            </div>
          </div>
          <button
            onClick={handleCancelPaymentAndBooking}
            disabled={isProcessing}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
            title="Cancel Payment & Booking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Amount Due Card */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                Booking Reference
              </span>
              <h4 className="text-sm font-bold text-emerald-950 mt-0.5">{booking.bookingCode}</h4>
              <p className="text-[11px] text-emerald-700">{booking.serviceName}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Payable</span>
              <div className="text-2xl font-black text-slate-950">₹{booking.pricing.totalAmount}</div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="font-bold text-slate-800 text-xs block mb-2">Select Payment Method</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'razorpay', label: 'Razorpay', icon: Zap, badge: 'Fast' },
                { id: 'upi', label: 'UPI / QR', icon: Smartphone, badge: 'RZP' },
                { id: 'card', label: 'Cards', icon: CreditCard },
                { id: 'netbanking', label: 'NetBank', icon: Building2 },
                { id: 'cash', label: 'Cash', icon: Banknote },
              ].map(m => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    disabled={isProcessing}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 font-bold ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span className="text-[11px] flex items-center gap-1">
                      {m.label}
                      {m.badge && <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1 rounded">{m.badge}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Method Details */}
          {paymentMethod === 'razorpay' && (
            <div className="p-4 bg-gradient-to-br from-blue-50/70 to-emerald-50/60 rounded-2xl border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs tracking-wider uppercase shadow-2xs">
                    RAZORPAY
                  </span>
                  <span className="text-xs font-bold text-slate-800">Standard Checkout</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Instant Settlement
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                Pay seamlessly using <strong>Google Pay, PhonePe, Paytm, Credit/Debit Cards, NetBanking, or Cred</strong> via Razorpay’s 256-bit encrypted checkout modal.
              </p>

              <div className="flex items-center gap-3 pt-1 border-t border-blue-200/50 text-[10px] text-slate-500 font-medium">
                <span>🔒 256-Bit SSL</span>
                <span>•</span>
                <span>⚡ Instant Refund Protection</span>
                <span>•</span>
                <span>🛡️ PCI-DSS Compliant</span>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-blue-700" />
                  <span className="text-xs font-bold text-blue-950">Razorpay UPI Checkout</span>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  GPay • PhonePe • Paytm • BHIM
                </span>
              </div>

              <p className="text-[11px] text-slate-600">
                Selecting <strong>UPI / QR</strong> launches Razorpay's native UPI modal directly, allowing instant 1-tap app checkout or QR code scanning.
              </p>

              <button
                type="button"
                onClick={handlePayWithRazorpay}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Launch Razorpay UPI Checkout (₹{booking.pricing.totalAmount})</span>
              </button>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-700 block">Demo Card Details</span>
              <input
                type="text"
                disabled
                value="4532 •••• •••• 8821 (Demo Card)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-600"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  disabled
                  value="12 / 28"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-600"
                />
                <input
                  type="password"
                  disabled
                  value="•••"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-600"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1 text-amber-900">
              <span className="font-bold text-xs">Cash on Service Completion</span>
              <p className="text-[11px] leading-relaxed">
                You can hand over cash directly to {booking.workerName} upon job satisfaction. The worker will mark receipt on their app to issue your official digital invoice.
              </p>
            </div>
          )}

          {/* Guarantee pill */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cooperative Escrow Guarantee: Funds disbursed to worker only upon service satisfaction.</span>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="bg-slate-50 p-5 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleCancelPaymentAndBooking}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition cursor-pointer disabled:opacity-50"
          >
            Cancel Booking
          </button>

          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className={`flex-1 py-3 px-5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed ${
              paymentMethod === 'razorpay'
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            {paymentMethod === 'razorpay' ? <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> : <Lock className="w-4 h-4" />}
            <span>
              {isProcessing
                ? 'Launching Razorpay SDK...'
                : paymentMethod === 'razorpay'
                ? `Pay ₹${booking.pricing.totalAmount} with Razorpay`
                : `Pay ₹${booking.pricing.totalAmount} (Demo Sandbox)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

