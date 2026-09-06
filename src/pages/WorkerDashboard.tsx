import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Power, 
  Zap, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Star, 
  Award, 
  Building2, 
  HeartHandshake, 
  FileBadge, 
  Navigation, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Booking, BookingStatus, Worker } from '../types';
import { apiService } from '../services/apiService';
import { mockWorkers } from '../data/mockData';
import { RuralWorkerPortal } from '../components/RuralWorkerPortal';
import { NewJobAlertModal, JobAlertData, DEFAULT_SAMPLE_JOB } from '../components/NewJobAlertModal';

export const WorkerDashboard: React.FC = () => {
  const { 
    workers, 
    bookings, 
    addToast, 
    openTracker, 
    openInvoice, 
    triggerCelebration,
    refreshData,
    setRole,
    setActiveTab
  } = useApp();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('worker-1');
  const [viewMode, setViewMode] = useState<'rural_simple' | 'advanced'>('rural_simple');

  // Pick logged-in demo worker safely
  const activeWorker: Worker = (workers && workers.length > 0)
    ? (workers.find(w => w.id === selectedWorkerId) || workers[0])
    : mockWorkers[0];

  const [isOnline, setIsOnline] = useState<boolean>(activeWorker?.isAvailableToday ?? true);
  const [isEmergencyReady, setIsEmergencyReady] = useState<boolean>(activeWorker?.isEmergencyReady ?? true);
  const [isJobAlertOpen, setIsJobAlertOpen] = useState<boolean>(false);
  const [currentJobAlert, setCurrentJobAlert] = useState<JobAlertData>(DEFAULT_SAMPLE_JOB);

  // If in rural simple mode, render the low-literacy accessible companion
  if (viewMode === 'rural_simple') {
    return (
      <div className="relative">
        <div className="bg-amber-100 border-b border-amber-300 py-2 px-4 text-xs font-bold text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📢 सरल कामगार मोड (Easy Mode Active)</span>
            <span className="hidden sm:inline font-normal">• बड़े बटन और आवाज़ के साथ</span>
          </div>
          <button
            onClick={() => setViewMode('advanced')}
            className="px-3 py-1 bg-amber-800 text-white rounded-lg text-xs font-black hover:bg-amber-900 transition cursor-pointer"
          >
            📊 Show Detailed Analytics (विस्तृत हिसाब)
          </button>
        </div>
        <RuralWorkerPortal
          onSwitchToCustomer={() => {
            setRole('customer');
            setActiveTab('home');
          }}
        />
      </div>
    );
  }

  // Worker bookings
  const myBookings = bookings.filter(b => b.workerId === activeWorker?.id);
  const pendingRequests = myBookings.filter(b => b.status === 'confirmed');
  const activeJobs = myBookings.filter(b => 
    b.status === 'worker_accepted' || b.status === 'on_the_way' || b.status === 'arrived' || b.status === 'service_started'
  );
  const completedJobs = myBookings.filter(b => b.status === 'service_completed');

  const totalEarnings = completedJobs.reduce((sum, b) => sum + b.pricing.workerEarnings, 0);
  const totalWelfareSaved = completedJobs.reduce((sum, b) => sum + b.pricing.cooperativeWelfareFund, 0);

  const handleToggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    addToast({
      type: next ? 'success' : 'info',
      title: next ? 'You are Online' : 'You are Offline',
      message: next ? 'You will now receive job broadcasts from households nearby.' : 'New job broadcasts paused.'
    });
  };

  const handleToggleEmergency = () => {
    const next = !isEmergencyReady;
    setIsEmergencyReady(next);
    addToast({
      type: next ? 'emergency' : 'info',
      title: next ? 'Emergency Mode Active' : 'Emergency Mode Disabled',
      message: next ? 'Ready to receive 15-min urgent express household jobs.' : 'Standard bookings only.'
    });
  };

  const handleAcceptJob = async (bookingId: string) => {
    try {
      await apiService.updateBookingStatus(bookingId, 'worker_accepted');
      await refreshData();
      triggerCelebration();
      addToast({
        type: 'success',
        title: 'Job Accepted!',
        message: 'Customer notified. Please proceed to the address on schedule.'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdvanceJobStatus = async (booking: Booking, nextStatus: BookingStatus) => {
    try {
      await apiService.updateBookingStatus(booking.id, nextStatus);
      await refreshData();
      addToast({
        type: nextStatus === 'service_completed' ? 'success' : 'info',
        title: 'Status Updated',
        message: `Booking advanced to "${nextStatus.replace('_', ' ').toUpperCase()}".`
      });

      if (nextStatus === 'service_completed') {
        triggerCelebration();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Return to Simple Accessible Rural Worker Portal Bar */}
      <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-bold">
          <span className="text-xl">👷</span>
          <span>Switch to Rural &amp; Labor-Friendly Voice Mode (सरल आवाज़ मोड)</span>
        </div>
        <button
          onClick={() => setViewMode('rural_simple')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
        >
          🔊 Open Rural Worker Portal (सरल मोड)
        </button>
      </div>

      {/* Worker Identity & Status Controls Banner */}
      <div className="bg-[#121212] text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <img
              src={activeWorker.photoUrl}
              alt={activeWorker.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#121212] flex items-center justify-center ${isOnline ? 'bg-blue-600' : 'bg-gray-600'}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black font-serif text-white">{activeWorker.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                ✓ Co-op Member
              </span>
            </div>
            <p className="text-xs text-blue-300 font-medium">{activeWorker.primarySkillLabel} • {activeWorker.experienceYears} Years Certified Exp</p>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs pt-0.5 font-light">
              <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{activeWorker.cooperativeName} (Reg: {activeWorker.cooperativeRegNo})</span>
            </div>

            {/* Worker profile switcher */}
            {workers && workers.length > 1 && (
              <div className="pt-2">
                <select
                  value={activeWorker.id}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="bg-neutral-900 text-xs text-gray-300 border border-neutral-700 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                >
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      Switch to: {w.name} ({w.primarySkillLabel})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Dual Switch Controls: Duty & Emergency */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Duty Status Toggle */}
          <button
            onClick={handleToggleOnline}
            className={`flex-1 md:flex-none px-5 py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isOnline
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-800 hover:bg-neutral-700 text-gray-400 border border-neutral-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'On-Duty (Receiving)' : 'Off-Duty (Paused)'}</span>
          </button>

          {/* Emergency 15-min Toggle */}
          <button
            onClick={handleToggleEmergency}
            className={`flex-1 md:flex-none px-5 py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isEmergencyReady
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30'
                : 'bg-neutral-800 hover:bg-neutral-700 text-gray-400 border border-neutral-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{isEmergencyReady ? '15-Min Urgent Active' : 'Urgent Inactive'}</span>
          </button>

          {/* Test New Job Alert Modal (Instant Delivery Partner Style) */}
          <button
            onClick={() => {
              setCurrentJobAlert(DEFAULT_SAMPLE_JOB);
              setIsJobAlertOpen(true);
            }}
            className="flex-1 md:flex-none px-5 py-3 rounded-full font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
            title="Preview Partner Job Alert with 30s Countdown & Swipe to Accept"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>⚡ Test Job Alert (Instant Mode)</span>
          </button>
        </div>
      </div>

      {/* KPI Financial & Welfare Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Total Earnings (94%)</span>
          <div className="text-2xl sm:text-3xl font-black text-[#121212] font-serif mt-1">₹{totalEarnings + 12800}</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Zero platform cuts deducted</span>
        </div>

        <div className="bg-[#121212] text-white rounded-3xl p-6 border border-neutral-800 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
            Welfare Pension Pool
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-serif mt-1">₹{totalWelfareSaved + 3420}</div>
          <span className="text-[11px] text-gray-400 mt-1 block font-light">Retirement & health reserve</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Customer Rating</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 font-serif mt-1 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-500" />
            <span>{activeWorker.rating} / 5.0</span>
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block font-light">{activeWorker.jobsCompleted} completed jobs</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">PMSBY Govt Cover</span>
          <div className="text-xl sm:text-2xl font-black text-green-700 font-serif mt-1">₹2,00,000 Active</div>
          <span className="text-[11px] text-gray-500 mt-1 block font-light">Society accident security</span>
        </div>
      </div>

      {/* NEW PENDING JOB BROADCASTS */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#121212] flex items-center gap-2">
            <span>New Incoming Job Broadcasts</span>
            <span className="bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">
              {pendingRequests.length} New
            </span>
          </h2>

          <div className="space-y-3">
            {pendingRequests.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#121212] text-base font-sans">{b.serviceName}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                      New Broadcast
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-light">{b.problemDescription}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 flex-wrap font-light">
                    <span>📍 {b.address.street}, {b.address.area}</span>
                    <span>🕒 {b.scheduledDate} ({b.scheduledTimeSlot})</span>
                    <span>👤 Customer: {b.customerName} ({b.customerPhone})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                  <div className="text-right mr-2">
                    <span className="text-lg font-black text-blue-600 font-serif">₹{b.pricing.workerEarnings}</span>
                    <span className="text-[10px] text-gray-400 block font-light">Direct Take-Home</span>
                  </div>

                  <button
                    onClick={() => handleAcceptJob(b.id)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-full font-bold text-xs shadow-md shadow-blue-200 transition-all cursor-pointer"
                  >
                    Accept Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE JOBS IN PROGRESS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#121212]">Active Assigned Tasks ({activeJobs.length})</h2>

        {activeJobs.length > 0 ? (
          <div className="space-y-4">
            {activeJobs.map((b) => {
              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-600/40 shadow-md space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-[#121212] text-lg font-sans">{b.serviceName}</h3>
                        <span className="bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-gray-400 mt-0.5 block">Ref: #{b.bookingCode}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-blue-600 font-serif">₹{b.pricing.workerEarnings}</span>
                      <span className="text-[10px] text-gray-400 block font-light">Your Take-Home</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-700">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Customer</span>
                      <p className="font-bold text-[#121212] mt-1 text-sm">{b.customerName}</p>
                      <a href={`tel:${b.customerPhone}`} className="text-blue-600 font-semibold block mt-1">
                        📞 {b.customerPhone}
                      </a>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Location</span>
                      <p className="font-bold text-[#121212] mt-1 truncate">{b.address.street}</p>
                      <span className="text-xs text-gray-500 font-light">{b.address.area}, {b.address.city}</span>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Schedule</span>
                      <p className="font-bold text-[#121212] mt-1">{b.scheduledDate}</p>
                      <span className="text-xs text-gray-500 font-light">{b.scheduledTimeSlot}</span>
                    </div>
                  </div>

                  {/* Worker Action Bar to Advance Status */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
                    <button
                      onClick={() => openTracker(b)}
                      className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span>View Live Customer Tracker</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {b.status === 'worker_accepted' && (
                        <button
                          onClick={() => handleAdvanceJobStatus(b, 'on_the_way')}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-xs cursor-pointer transition-all"
                        >
                          Mark "I am On The Way" 🛵
                        </button>
                      )}
                      {b.status === 'on_the_way' && (
                        <button
                          onClick={() => handleAdvanceJobStatus(b, 'arrived')}
                          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-full shadow-xs cursor-pointer transition-all"
                        >
                          Mark "I have Arrived" 📍
                        </button>
                      )}
                      {b.status === 'arrived' && (
                        <button
                          onClick={() => handleAdvanceJobStatus(b, 'service_started')}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs cursor-pointer transition-all"
                        >
                          Start Service Work 🛠️
                        </button>
                      )}
                      {b.status === 'service_started' && (
                        <button
                          onClick={() => handleAdvanceJobStatus(b, 'service_completed')}
                          className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-full shadow-md cursor-pointer transition-all"
                        >
                          ✓ Complete Service & Trigger Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 bg-white rounded-3xl border border-gray-200 text-center text-xs text-gray-500 font-light">
            No active jobs in progress. You are currently marked on-duty to receive requests.
          </div>
        )}
      </div>

      {/* COMPLETED JOBS & REVIEWS HISTORY */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#121212]">Recent Customer Reviews & Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeWorker.reviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-3xl p-5 border border-gray-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#121212]">{rev.customerName}</span>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic font-light">"{rev.comment}"</p>
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {rev.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-medium">
                    {t}
                  </span>
                ))}
                <span className="text-[10px] text-gray-400 ml-auto font-light">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Job Alert Modal (Zomato/Swiggy Delivery Partner Style) */}
      <NewJobAlertModal
        isOpen={isJobAlertOpen}
        job={currentJobAlert}
        countdownSeconds={30}
        onAccept={(accepted) => {
          setIsJobAlertOpen(false);
          addToast({
            type: 'success',
            title: 'Job Accepted! (स्वीकृत)',
            message: `${accepted.title} • ₹${accepted.earnings} Direct Cash added to your route!`
          });
        }}
        onDecline={(jobId) => {
          setIsJobAlertOpen(false);
          addToast({
            type: 'info',
            title: 'Order Passed (काम छोड़ा)',
            message: 'No penalty on PartnerPlus. Waiting for next nearby request.'
          });
        }}
      />
    </div>
  );
};
