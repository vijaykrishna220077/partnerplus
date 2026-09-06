import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Star, 
  FileText, 
  Navigation, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  HeartHandshake, 
  ArrowRight,
  Zap,
  Phone,
  QrCode,
  MessageSquare
} from 'lucide-react';
import { Booking } from '../types';

export const CustomerBookings: React.FC = () => {
  const { 
    bookings, 
    openTracker, 
    openInvoice, 
    openReview, 
    openBooking, 
    openCompletionQr,
    openChat,
    setActiveTab,
    t 
  } = useApp();

  const activeBookings = bookings.filter(b => b.status !== 'service_completed' && b.status !== 'cancelled');
  const pastBookings = bookings.filter(b => b.status === 'service_completed' || b.status === 'cancelled');

  const totalSpent = bookings
    .filter(b => b.status === 'service_completed')
    .reduce((sum, b) => sum + b.pricing.totalAmount, 0);

  const totalWelfareFund = bookings
    .filter(b => b.status === 'service_completed')
    .reduce((sum, b) => sum + b.pricing.cooperativeWelfareFund, 0);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-200">Confirmed</span>;
      case 'worker_accepted':
        return <span className="bg-blue-50 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-200">Worker Accepted</span>;
      case 'on_the_way':
        return <span className="bg-indigo-50 text-indigo-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-indigo-200 animate-pulse">On The Way</span>;
      case 'arrived':
        return <span className="bg-purple-50 text-purple-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-purple-200">Arrived</span>;
      case 'service_started':
        return <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-200 animate-pulse">In Progress</span>;
      case 'service_completed':
        return <span className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Completed</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Cancelled</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header in Editorial Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-[#121212] mt-1">
            My Service Bookings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-light">
            Manage real-time bookings, track assigned workers, and download society invoices.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('services_search')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-200 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>+ Book New Service</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Active Tasks</span>
          <div className="text-3xl font-black text-[#121212] font-serif mt-1">{activeBookings.length} In Progress</div>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">Live GPS tracking active</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Completed Bookings</span>
          <div className="text-3xl font-black text-[#121212] font-serif mt-1">{pastBookings.length} Finished</div>
          <span className="text-xs text-gray-500 mt-1 block font-light">₹{totalSpent} spent across services</span>
        </div>

        <div className="bg-[#121212] text-white rounded-3xl p-6 border border-neutral-800 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
            Welfare Fund Contribution
          </span>
          <div className="text-3xl font-black text-white font-serif mt-1">₹{totalWelfareFund}</div>
          <span className="text-xs text-gray-400 mt-1 block font-light">Directly funded worker pension & medical pool</span>
        </div>
      </div>

      {/* ACTIVE ONGOING BOOKINGS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif text-[#121212] flex items-center gap-2">
            <span>Active Bookings</span>
            {activeBookings.length > 0 && (
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                {activeBookings.length}
              </span>
            )}
          </h2>
        </div>

        {/* Cooperative QR Completion Protocol Notice */}
        <div className="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 text-xs text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs font-black">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-blue-950 block">
                Job Completion Verification Protocol
              </span>
              <p className="text-[11px] text-blue-800 leading-snug mt-0.5">
                Every booked service generates an encrypted, single-use QR pass. Workers scan this code upon finishing work to confirm satisfaction and unlock direct bank payout.
              </p>
            </div>
          </div>
          {activeBookings.length > 0 && (
            <button
              onClick={() => openCompletionQr(activeBookings[0])}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shrink-0 self-start sm:self-auto transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Show Latest QR Pass</span>
            </button>
          )}
        </div>

        {activeBookings.length > 0 ? (
          <div className="space-y-4">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-600/30 shadow-md space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-[#121212] text-lg font-sans">{b.serviceName}</h3>
                      {getStatusBadge(b.status)}
                      {b.isEmergency && (
                        <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-red-200">
                          <Zap className="w-3 h-3" /> Emergency 15-min
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-gray-400 mt-1 block">
                      Ref: #{b.bookingCode}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-extrabold text-[#121212] font-serif">₹{b.pricing.totalAmount}</span>
                    <span className="text-[10px] text-gray-400 block font-light">Cooperative Fair Rate</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-700">
                  {/* Worker preview */}
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <img
                      src={b.workerPhoto}
                      alt={b.workerName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                    />
                    <div>
                      <h4 className="font-bold text-[#121212] text-sm">{b.workerName}</h4>
                      <p className="text-[11px] text-green-700 font-semibold">✓ Verified Worker</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[140px] font-light">{b.cooperativeName}</p>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Schedule Slot</span>
                      <span className="font-bold text-[#121212] text-xs">{b.scheduledDate}</span>
                      <span className="text-[11px] text-gray-600 block">{b.scheduledTimeSlot}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Service Address</span>
                      <p className="text-xs font-bold text-[#121212] truncate">{b.address.street}</p>
                      <span className="text-[11px] text-gray-600 block truncate">{b.address.area}, {b.address.city}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons: Open Completion QR & Live Tracker */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs text-blue-600 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    Live GPS status updates active
                  </span>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
                    <button
                      type="button"
                      onClick={() => openChat(b, 'customer')}
                      className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      title="Real-time messaging with assigned worker"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Chat Worker</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openCompletionQr(b)}
                      className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      title="Show Service Completion QR code for worker verification"
                    >
                      <QrCode className="w-4 h-4 text-blue-600" />
                      <span>Completion QR</span>
                    </button>

                    <button
                      onClick={() => openTracker(b)}
                      className="px-5 py-2.5 bg-black hover:bg-neutral-800 active:scale-98 text-white rounded-full font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Track Live Progress →</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 text-gray-500 text-xs space-y-3">
            <p className="text-sm font-light">No active bookings at the moment. Need a repair or household help?</p>
            <button
              onClick={() => setActiveTab('services_search')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-xs shadow-sm cursor-pointer"
            >
              Book a Service Now
            </button>
          </div>
        )}
      </div>

      {/* COMPLETED & PAST BOOKINGS */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold font-serif text-[#121212]">Past Bookings History</h2>

        <div className="space-y-3">
          {pastBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 hover:border-black transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-4">
                <img
                  src={b.workerPhoto}
                  alt={b.workerName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#121212] text-sm">{b.serviceName}</h4>
                    {getStatusBadge(b.status)}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 font-light">
                    Served by <strong className="text-gray-900">{b.workerName}</strong> ({b.cooperativeName}) on {b.scheduledDate}
                  </p>
                  <span className="text-[10px] font-mono text-gray-400">Ref: #{b.bookingCode}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                <button
                  onClick={() => openCompletionQr(b)}
                  className="px-3.5 py-2 rounded-full border border-gray-300 hover:border-black text-gray-800 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="View Verification QR Pass"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>QR Pass</span>
                </button>

                <button
                  onClick={() => openReview(b)}
                  className="px-4 py-2 rounded-full border border-gray-300 hover:border-black text-gray-800 font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Rate</span>
                </button>

                <button
                  onClick={() => openInvoice(b)}
                  className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>

                <button
                  onClick={() => setActiveTab('services_search')}
                  className="px-5 py-2 rounded-full bg-black hover:bg-neutral-800 text-white font-bold transition-all cursor-pointer"
                >
                  Rebook
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
