import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Home as HomeIcon, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Star, 
  Zap, 
  Phone, 
  Search, 
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  Building2,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  MessageSquare,
  User
} from 'lucide-react';

import { Home } from '../pages/Home';
import { BookingPage } from '../pages/BookingPage';
import { CustomerBookings } from '../pages/CustomerBookings';
import { ServicesSearch } from '../pages/ServicesSearch';
import { CustomerProfilePage } from '../pages/CustomerProfilePage';
import { chatService } from '../services/chatService';

// Customer Modals
import { JobChatModal } from '../components/chat/JobChatModal';
import { ServiceCompletionQRCodeModal } from '../components/ServiceCompletionQRCodeModal';
import { QuoteCalculatorModal } from '../components/QuoteCalculatorModal';
import { PhoneCallModal } from '../components/PhoneCallModal';
import { ServiceAreaModal } from '../components/ServiceAreaModal';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { BookingFlowModal } from '../components/BookingFlowModal';
import { PaymentCheckoutModal } from '../components/PaymentCheckoutModal';
import { BookingTrackerModal } from '../components/BookingTrackerModal';
import { RatingReviewModal } from '../components/RatingReviewModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { EmergencyServiceModal } from '../components/EmergencyServiceModal';
import { LocationPickerModal } from '../components/LocationPickerModal';
import { WorkerProfileModal } from '../components/WorkerProfileModal';
import { ToastContainer } from '../components/ToastContainer';
import { Footer } from '../components/Footer';
import { PartnerPlusFooter } from '../components/PartnerPlusFooter';

export type CustomerPortalTab = 'services' | 'booking' | 'tracking' | 'invoices' | 'reviews' | 'profile';

export const CustomerPortal: React.FC = () => {
  const { 
    bookings, 
    openEmergency, 
    currentLocation, 
    openLocationPicker,
    openInvoice,
    openReview,
    openTracker,
    activeQrBooking,
    openCompletionQr,
    closeCompletionQr,
    activeChatBooking,
    activeChatRole,
    openChat,
    closeChat
  } = useApp();
  const { user, switchRole } = useAuth();

  const [activeCustomerTab, setActiveCustomerTab] = useState<CustomerPortalTab>('services');
  const [initialServiceForQuote, setInitialServiceForQuote] = useState<string>('electrical');
  const [initialBookingTab, setInitialBookingTab] = useState<'works' | 'workers' | 'cart'>('works');
  const [unreadChatCount, setUnreadChatCount] = useState<number>(() => chatService.getTotalUnreadCount('customer'));

  useEffect(() => {
    const updateUnread = () => {
      setUnreadChatCount(chatService.getTotalUnreadCount('customer'));
    };
    const unsubHub = chatService.subscribe('all', updateUnread);
    const interval = setInterval(updateUnread, 3000);
    return () => {
      unsubHub();
      clearInterval(interval);
    };
  }, []);

  // Modals
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isServiceAreaOpen, setIsServiceAreaOpen] = useState(false);
  const [activeServiceDetail, setActiveServiceDetail] = useState<string | null>(null);

  const handleOpenPrices = (serviceKey?: string, tab: 'works' | 'workers' | 'cart' = 'works') => {
    if (serviceKey) {
      setInitialServiceForQuote(serviceKey);
    }
    setInitialBookingTab(tab);
    setIsQuoteOpen(false);
    setActiveCustomerTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeBookingsCount = bookings.filter(b => 
    !['service_completed', 'cancelled', 'rejected'].includes(b.status)
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-[#0F172A] flex flex-col justify-between selection:bg-cyan-400 selection:text-black">
      {/* Customer Portal Top Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-10 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Logo & Portal Identity */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveCustomerTab('services')}
                className="flex items-center gap-2.5 text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md font-black text-xl group-hover:scale-105 transition-transform">
                  🤝
                </div>
                <div>
                  <div className="text-lg font-black tracking-tight text-gray-950 font-display">
                    SAHAKARI <span className="text-blue-600">SEVA</span>
                  </div>
                  <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    Customer Portal • Citizen Services
                  </div>
                </div>
              </button>

              {/* Location indicator button */}
              <button
                type="button"
                onClick={openLocationPicker}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer border border-slate-200"
                title="Change Service Area"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span className="truncate max-w-[150px]">{currentLocation}</span>
              </button>
            </div>

            {/* Portal Tab Navigation */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setActiveCustomerTab('services')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeCustomerTab === 'services'
                    ? 'bg-white text-blue-600 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HomeIcon className="w-3.5 h-3.5" />
                <span>Services</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCustomerTab('booking')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeCustomerTab === 'booking'
                    ? 'bg-white text-blue-600 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Service</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCustomerTab('tracking')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer relative whitespace-nowrap ${
                  activeCustomerTab === 'tracking'
                    ? 'bg-white text-blue-600 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>My Bookings</span>
                {activeBookingsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center -mr-1">
                    {activeBookingsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveCustomerTab('invoices')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeCustomerTab === 'invoices'
                    ? 'bg-white text-blue-600 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Invoices</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCustomerTab('reviews')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeCustomerTab === 'reviews'
                    ? 'bg-white text-blue-600 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Reviews</span>
              </button>
            </div>

            {/* Right Side Actions & User Profile */}
            <div className="flex items-center gap-2 shrink-0">
              {/* User Profile Pill Button */}
              <button
                type="button"
                onClick={() => setActiveCustomerTab('profile')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs ${
                  activeCustomerTab === 'profile'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
                title="View & Edit Customer Profile"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200" />
                ) : (
                  <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                )}
                <span className="truncate max-w-[85px]">{user?.name?.split(' ')[0] || 'Profile'}</span>
              </button>

              {bookings.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const active = bookings.find(b => !['service_completed', 'cancelled', 'rejected'].includes(b.status)) || bookings[0];
                    if (active) openChat(active, 'customer');
                  }}
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition cursor-pointer shadow-2xs relative"
                  title="Real-time Chat with Assigned Worker"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chat</span>
                  {unreadChatCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center -ml-0.5 animate-pulse">
                      {unreadChatCount}
                    </span>
                  )}
                </button>
              )}

              {bookings.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const active = bookings.find(b => !['service_completed', 'cancelled', 'rejected'].includes(b.status)) || bookings[0];
                    if (active) openCompletionQr(active);
                  }}
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition cursor-pointer shadow-2xs"
                  title="Show Service Completion QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-600" />
                  <span>QR Code</span>
                </button>
              )}

              <button
                onClick={() => setIsPhoneModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                title="Call Cooperative Helpline"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Helpline</span>
              </button>

              <button
                onClick={openEmergency}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md shadow-red-500/20 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                <span className="whitespace-nowrap">SOS</span>
              </button>
            </div>

          </div>

          {/* Mobile Tab Bar */}
          <div className="lg:hidden flex items-center justify-between border-t border-gray-100 py-2 overflow-x-auto gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveCustomerTab('services')}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 ${activeCustomerTab === 'services' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => setActiveCustomerTab('booking')}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 ${activeCustomerTab === 'booking' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              Book Service
            </button>
            <button
              type="button"
              onClick={() => setActiveCustomerTab('tracking')}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 ${activeCustomerTab === 'tracking' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              My Bookings ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCustomerTab('invoices')}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 ${activeCustomerTab === 'invoices' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              Invoices
            </button>
            <button
              type="button"
              onClick={() => setActiveCustomerTab('reviews')}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 ${activeCustomerTab === 'reviews' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              Reviews
            </button>
            <button
              type="button"
              onClick={() => setActiveCustomerTab('profile')}
              className={`px-3 py-1 rounded-lg font-bold shrink-0 ${activeCustomerTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
            >
              My Profile
            </button>
          </div>
        </div>
      </nav>

      {/* Active Sub-View Body */}
      <main className="flex-1 w-full">
        {activeCustomerTab === 'services' && (
          <Home
            onOpenPrices={handleOpenPrices}
            onOpenPhone={() => setIsPhoneModalOpen(true)}
            onSelectService={(svc) => setActiveServiceDetail(svc)}
            onSwitchToWorker={() => switchRole('worker')}
          />
        )}

        {activeCustomerTab === 'booking' && (
          <BookingPage
            initialService={initialServiceForQuote}
            initialTab={initialBookingTab}
            onBack={() => setActiveCustomerTab('services')}
          />
        )}

        {activeCustomerTab === 'tracking' && (
          <div className="py-6">
            <CustomerBookings />
          </div>
        )}

        {activeCustomerTab === 'invoices' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-black font-display text-gray-900">
                    Customer Invoices &amp; Transparent Ledger
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Every rupee tracked with 0% corporate intermediary deductions and 5% member welfare allocation.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Government Labour Cooperative Guarantee
                </span>
              </div>

              {/* Invoices List */}
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div 
                    key={b.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {b.bookingCode}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {b.serviceName}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Artisan: <strong className="text-gray-800">{b.workerName}</strong> • {b.scheduledDate} ({b.scheduledTimeSlot})
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Worker Direct Payout: ₹{b.pricing.workerEarnings} (95%) • Welfare Reserve: ₹{b.pricing.cooperativeWelfareFund} (5%)
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-base font-black text-gray-900">₹{b.pricing.totalAmount}</div>
                        <div className="text-[10px] font-bold text-emerald-600 uppercase">
                          {b.payment.status === 'completed' ? 'Paid Online' : 'Pay on Delivery'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openCompletionQr(b)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        title="View Service Completion QR"
                      >
                        <QrCode className="w-3.5 h-3.5 text-blue-600" />
                        <span className="hidden sm:inline">Verification</span> <span>QR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openInvoice(b)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Invoice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeCustomerTab === 'reviews' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h1 className="text-2xl font-black font-display text-gray-900">
                Cooperative Artisan Ratings &amp; Feedback
              </h1>
              <p className="text-xs text-gray-500 mt-1 mb-6">
                Your direct reviews help maintain honest trade reputations and determine merit-based society benefits.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <div key={b.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-blue-600">{b.bookingCode}</div>
                        <div className="text-sm font-bold text-gray-900">{b.serviceName}</div>
                      </div>
                      <span className="text-xs text-gray-500">{b.scheduledDate}</span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                      <img 
                        src={b.workerPhoto} 
                        alt={b.workerName} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-bold text-gray-900">{b.workerName}</div>
                        <div className="text-[11px] text-gray-500">{b.cooperativeName}</div>
                      </div>
                    </div>

                    {b.review ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: b.review.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-xs font-bold text-emerald-800 ml-1">
                            {b.review.rating} / 5 Stars
                          </span>
                        </div>
                        <p className="text-emerald-950 font-medium italic">&quot;{b.review.comment}&quot;</p>
                        <div className="text-[10px] text-emerald-700 font-bold flex flex-wrap gap-1 mt-1">
                          {b.review.tags.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white rounded-md border border-emerald-200">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-amber-700 font-semibold">Review Pending</span>
                        <button
                          type="button"
                          onClick={() => openReview(b)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                        >
                          <Star className="w-3 h-3" />
                          <span>Leave Review</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeCustomerTab === 'profile' && (
          <CustomerProfilePage />
        )}
      </main>

      {/* Footer */}
      {activeCustomerTab === 'services' ? (
        <PartnerPlusFooter
          onOpenPrices={() => handleOpenPrices()}
          onOpenPhone={() => setIsPhoneModalOpen(true)}
          onOpenProProvider={() => switchRole('worker')}
          onOpenServiceArea={() => setIsServiceAreaOpen(true)}
        />
      ) : (
        <Footer />
      )}

      {/* Global Modals in Customer Portal */}
      <QuoteCalculatorModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialService={initialServiceForQuote}
      />
      <PhoneCallModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />
      <ServiceAreaModal
        isOpen={isServiceAreaOpen}
        onClose={() => setIsServiceAreaOpen(false)}
        onOpenQuote={() => handleOpenPrices()}
      />
      <ServiceDetailModal
        isOpen={activeServiceDetail !== null}
        serviceKey={activeServiceDetail}
        onClose={() => setActiveServiceDetail(null)}
        onOpenQuote={(service) => {
          setActiveServiceDetail(null);
          handleOpenPrices(service);
        }}
      />
      <BookingFlowModal />
      <PaymentCheckoutModal />
      <BookingTrackerModal />
      <JobChatModal
        isOpen={!!activeChatBooking}
        booking={activeChatBooking}
        currentRole={activeChatRole}
        onClose={closeChat}
      />
      <ServiceCompletionQRCodeModal 
        booking={activeQrBooking} 
        onClose={closeCompletionQr} 
      />
      <RatingReviewModal />
      <InvoiceModal />
      <EmergencyServiceModal />
      <LocationPickerModal />
      <WorkerProfileModal />
      <ToastContainer />
    </div>
  );
};
