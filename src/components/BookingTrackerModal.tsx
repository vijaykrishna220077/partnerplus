import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Navigation, 
  AlertCircle, 
  Building2, 
  FileText, 
  Star, 
  Play, 
  FastForward,
  CheckCircle,
  QrCode
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { apiService } from '../services/apiService';
import { LiveRouteMapTracker } from './common/LiveRouteMapTracker';

export const BookingTrackerModal: React.FC = () => {
  const { 
    activeTrackerBooking, 
    closeTracker, 
    openInvoice, 
    openReview, 
    openCompletionQr,
    openChat,
    addToast, 
    triggerCelebration,
    refreshData 
  } = useApp();

  const [booking, setBooking] = useState<Booking | null>(activeTrackerBooking);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  if (!activeTrackerBooking) return null;
  const curBooking = booking || activeTrackerBooking;

  const statusOrder: BookingStatus[] = [
    'confirmed',
    'worker_accepted',
    'on_the_way',
    'arrived',
    'service_started',
    'service_completed'
  ];

  const statusLabels: Record<BookingStatus, { title: string; desc: string }> = {
    requested: { title: 'Booking Requested', desc: 'Finding the optimal verified worker nearby' },
    worker_assigned: { title: 'Worker Assigned', desc: `${curBooking.workerName} has been assigned by cooperative dispatch` },
    confirmed: { title: 'Booking Confirmed', desc: 'Request broadcast to verified cooperative workers nearby' },
    worker_accepted: { title: 'Worker Accepted', desc: `${curBooking.workerName} accepted your booking and is preparing tools` },
    rejected: { title: 'Reassigning Worker', desc: 'Reassigning to the next best available cooperative artisan' },
    on_the_way: { title: 'Worker is on the way', desc: 'Worker is traveling with standard toolkit (Est. ETA: 12 mins)' },
    arrived: { title: 'Worker Arrived', desc: 'Worker has reached your premises and begun inspection' },
    service_started: { title: 'Service Started', desc: 'Work is currently in progress under standard safety guidelines' },
    service_completed: { title: 'Service Completed', desc: 'Job completed successfully! Invoice and receipt ready' },
    payment_pending: { title: 'Payment Pending', desc: 'Awaiting customer payment confirmation' },
    payment_completed: { title: 'Payment Received', desc: 'Worker payout dispatched to bank account with 0% commission' },
    reviewed: { title: 'Service Reviewed', desc: 'Customer review and rating recorded for cooperative reputation' },
    cancelled: { title: 'Booking Cancelled', desc: 'Service cancelled by user or cooperative' },
    expired: { title: 'Request Expired', desc: 'No cooperative worker accepted in time window' }
  };

  const currentIndex = statusOrder.indexOf(curBooking.status);

  const handleAdvanceStatus = async () => {
    if (currentIndex >= statusOrder.length - 1) return;
    const nextStatus = statusOrder[currentIndex + 1];
    setIsUpdating(true);

    try {
      const updated = await apiService.updateBookingStatus(curBooking.id, nextStatus);
      if (updated) {
        setBooking(updated);
        await refreshData();
        addToast({
          type: nextStatus === 'service_completed' ? 'success' : 'info',
          title: `Status: ${statusLabels[nextStatus].title}`,
          message: statusLabels[nextStatus].desc
        });

        if (nextStatus === 'service_completed') {
          triggerCelebration();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                Live Service Tracking
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300">
                #{curBooking.bookingCode}
              </span>
            </div>
            <h3 className="text-xl font-bold font-serif text-white mt-0.5">
              {curBooking.serviceName}
            </h3>
          </div>
          <button
            onClick={closeTracker}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700 max-h-[65vh] overflow-y-auto">
          {/* Worker Quick Info Banner */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={curBooking.workerPhoto}
                alt={curBooking.workerName}
                referrerPolicy="no-referrer"
                className="w-13 h-13 rounded-xl object-cover border border-slate-300 shadow-2xs"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 text-sm">{curBooking.workerName}</h4>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    ✓ Verified
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[200px]">{curBooking.cooperativeName}</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  Assigned Co-op Professional
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${curBooking.workerPhone}`}
                onClick={(e) => {
                  e.preventDefault();
                  addToast({ type: 'info', title: 'Connecting Call', message: `Calling verified worker ${curBooking.workerName} at ${curBooking.workerPhone}...` });
                }}
                className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                title="Call Worker"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => openChat(curBooking, 'customer')}
                className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
                title="Real-time Chat with Worker"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Zomato-Style Live Worker Arrival Route Tracker */}
          <LiveRouteMapTracker
            mode="customer"
            workerName={curBooking.workerName}
            workerPhoto={curBooking.workerPhoto}
            workerPhone={curBooking.workerPhone}
            customerName="You"
            customerAddress={`${curBooking.address.street}, ${curBooking.address.area}`}
            status={curBooking.status}
            distanceKm={1.8}
            etaMinutes={8}
            onCall={() => {
              addToast({ type: 'info', title: 'Connecting Call', message: `Calling ${curBooking.workerName} at ${curBooking.workerPhone}...` });
            }}
            onChat={() => openChat(curBooking, 'customer')}
          />

          {/* Live Progress Timeline */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
              Live Service Timeline
            </h4>

            <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {statusOrder.map((st, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isPending = idx > currentIndex;
                const info = statusLabels[st];

                return (
                  <div key={st} className="relative flex items-start gap-3.5 pl-1.5">
                    <div
                      className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 shrink-0 transition ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-slate-900 text-white ring-4 ring-emerald-100'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5
                          className={`text-xs font-bold leading-tight ${
                            isCurrent
                              ? 'text-emerald-900 font-extrabold'
                              : isPassed
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {info.title}
                        </h5>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          isCurrent ? 'text-slate-600' : 'text-slate-400'
                        }`}
                      >
                        {info.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Completion QR Verification Card */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-gray-900 text-xs block">
                  Service Completion QR Pass
                </span>
                <p className="text-[11px] text-gray-600">
                  Present this QR code for the worker to scan upon work completion to release payment.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openCompletionQr(curBooking)}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Show Service QR Code</span>
            </button>
          </div>

          {/* Interactive Simulation Helper for SIH Evaluation */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                <FastForward className="w-3.5 h-3.5 text-indigo-600" />
                SIH Live Stage Simulator
              </span>
              <p className="text-[11px] text-indigo-700">
                Advance the booking lifecycle step-by-step to test real-time state changes.
              </p>
            </div>

            {currentIndex < statusOrder.length - 1 ? (
              <button
                onClick={handleAdvanceStatus}
                disabled={isUpdating}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 shrink-0"
              >
                <span>Simulate Next Stage</span>
                <FastForward className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200">
                ✓ Service Cycle Complete
              </span>
            )}
          </div>

          {/* Actions when completed: Rate & View Invoice */}
          {curBooking.status === 'service_completed' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Job Completed! Rate your experience & get official invoice</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    closeTracker();
                    openReview(curBooking);
                  }}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Rate Worker ({curBooking.workerName})</span>
                </button>

                <button
                  onClick={() => {
                    closeTracker();
                    openInvoice(curBooking);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Official Invoice</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-slate-500 text-[11px]">
            Address: {curBooking.address.street}, {curBooking.address.area}
          </span>
          <button
            onClick={closeTracker}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
