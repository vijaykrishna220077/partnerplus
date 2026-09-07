import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft,
  Calculator, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Calendar, 
  Volume2, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  FileText, 
  CreditCard, 
  Star, 
  Droplets, 
  HardHat, 
  Hammer, 
  Paintbrush, 
  AirVent, 
  BrickWall, 
  Flame, 
  Car, 
  Tractor, 
  Trees, 
  Network, 
  Wrench, 
  ShoppingBag, 
  Share2, 
  UserCheck, 
  Users, 
  ChevronRight,
  Home as HomeIcon,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundAndSpeech } from '../utils/soundAndSpeech';
import { useApp } from '../context/AppContext';
import { bookingService } from '../services/bookingService';
import { apiService } from '../services/apiService';
import { locationService } from '../services/locationService';
import { initializeRazorpayPayment } from '../services/razorpayService';
import { Booking, WorkerMatchResult } from '../types';
import { 
  CooperativeWorkerProfile, 
  ALL_COOPERATIVE_WORKERS 
} from '../data/cooperativeWorkers';
import { WorksCatalogView, TaskItem, CategoryData } from '../components/booking/WorksCatalogView';
import { AvailableWorkersView } from '../components/booking/AvailableWorkersView';
import { BookingCheckoutView } from '../components/booking/BookingCheckoutView';
import { CATEGORIES } from '../components/QuoteCalculatorModal';

interface BookingPageProps {
  initialService?: string;
  initialTab?: 'works' | 'workers' | 'cart';
  onBack?: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  initialService = 'electrical',
  initialTab = 'works',
  onBack
}) => {
  const { t, lang, openTracker, openPayment, openInvoice, addToast, refreshData, setActiveTab } = useApp();

  // Navigation mode: 'works' (Step 1) | 'workers' (Step 2) | 'cart' (Step 3)
  const [modalView, setModalView] = useState<'works' | 'workers' | 'cart'>(initialTab || 'works');

  // Search & Filter States
  const [worksSearchQuery, setWorksSearchQuery] = useState<string>('');
  const [workerCategoryFilter, setWorkerCategoryFilter] = useState<string>('all');
  const [selectedWorker, setSelectedWorker] = useState<CooperativeWorkerProfile | null>(null);

  // Service & Cart State
  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialService);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [cart, setCart] = useState<Record<string, number>>({});

  // Synchronize when initialService or initialTab changes
  useEffect(() => {
    if (initialService) {
      setActiveCategoryId(initialService);
      setWorkerCategoryFilter(initialService);
    }
  }, [initialService]);

  useEffect(() => {
    if (initialTab) {
      setModalView(initialTab);
    }
  }, [initialTab]);

  const currentCategory = useMemo(() => {
    return CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];
  }, [activeCategoryId]);

  const activeTaskFallback = useMemo(() => {
    return currentCategory.tasks.find((t) => t.id === selectedTaskId) || currentCategory.tasks[0];
  }, [currentCategory, selectedTaskId]);

  // Find task and category by taskId helper
  const findTaskById = (taskId: string) => {
    for (const cat of CATEGORIES) {
      const found = cat.tasks.find((t) => t.id === taskId);
      if (found) return { task: found, category: cat };
    }
    return null;
  };

  // Cart operations
  const handleAddToCart = (taskId: string) => {
    soundAndSpeech.playChime('click');
    setCart((prev) => ({
      ...prev,
      [taskId]: (Number(prev[taskId]) || 0) + 1
    }));
    // Find task category and switch directly to showing available workers in that field
    const found = findTaskById(taskId);
    const catId = found ? found.category.id : activeCategoryId;
    setWorkerCategoryFilter(catId);
    setModalView('workers');
    addToast({
      type: 'success',
      title: 'Work Selected',
      message: `Showing verified ${found ? found.category.name : 'trade'} partners available nearby.`
    });
  };

  const handleRemoveFromCart = (taskId: string) => {
    soundAndSpeech.playChime('click');
    setCart((prev) => {
      const current = Number(prev[taskId]) || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[taskId];
        return next;
      }
      return { ...prev, [taskId]: current - 1 };
    });
  };

  const handleDeleteItem = (taskId: string) => {
    soundAndSpeech.playChime('click');
    setCart((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
  };

  // Filtered tasks list
  const filteredTasksList = useMemo(() => {
    const q = worksSearchQuery.trim().toLowerCase();
    if (!q) {
      return currentCategory.tasks.map((t) => ({ task: t, category: currentCategory }));
    }
    const results: { task: TaskItem; category: CategoryData }[] = [];
    CATEGORIES.forEach((cat) => {
      cat.tasks.forEach((t) => {
        if (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.nameHi.toLowerCase().includes(q) ||
          t.nameTa.toLowerCase().includes(q) ||
          cat.name.toLowerCase().includes(q)
        ) {
          results.push({ task: t, category: cat });
        }
      });
    });
    return results;
  }, [worksSearchQuery, currentCategory]);

  // Filtered workers list
  const filteredWorkersList = useMemo(() => {
    let list = ALL_COOPERATIVE_WORKERS;
    if (workerCategoryFilter !== 'all') {
      list = list.filter((w) => w.trade === workerCategoryFilter);
    }
    const q = worksSearchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.tradeLabel.toLowerCase().includes(q) ||
          w.tools.toLowerCase().includes(q) ||
          w.badge.toLowerCase().includes(q)
      );
    }
    return list;
  }, [workerCategoryFilter, worksSearchQuery]);

  // Add-ons & Instructions
  const [isEmergencySOS, setIsEmergencySOS] = useState<boolean>(false);
  const [needMaterials, setNeedMaterials] = useState<boolean>(false);
  const [workerTip, setWorkerTip] = useState<number>(0);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string[]>(['ring_bell']);
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('COOPDIRECT');
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(true);

  // Customer Details
  const [customerName, setCustomerName] = useState<string>(() => {
    return localStorage.getItem('partnerplus_user_name') || localStorage.getItem('sahakari_user_name') || 'Ramesh Kumar';
  });
  const [customerPhone, setCustomerPhone] = useState<string>(() => {
    return localStorage.getItem('partnerplus_user_phone') || localStorage.getItem('sahakari_user_phone') || '98765 43210';
  });
  const [customerAddress, setCustomerAddress] = useState<string>(() => {
    return localStorage.getItem('partnerplus_user_address') || localStorage.getItem('sahakari_user_address') || 'Sri Krishna College of Engineering and Technology (SKCET), Kuniamuthur, Coimbatore';
  });
  const [addressTag, setAddressTag] = useState<'home' | 'work' | 'other'>('home');
  const [selectedSlot, setSelectedSlot] = useState<'immediate' | 'evening' | 'tomorrow' | 'custom'>('immediate');
  const [customSlotDate, setCustomSlotDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [customSlotTime, setCustomSlotTime] = useState<string>('10:00 AM');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('cash');

  // Submission & Workflow State
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [matchResult, setMatchResult] = useState<WorkerMatchResult | null>(null);

  useEffect(() => {
    const cat = CATEGORIES.find((c) => c.id === activeCategoryId);
    if (cat && cat.tasks.length > 0) {
      setSelectedTaskId(cat.tasks[0].id);
    }
  }, [activeCategoryId]);

  // Compute Cart Totals
  const cartEntries = Object.entries(cart).filter(([_, qty]) => Number(qty) > 0);
  const isCartEmpty = cartEntries.length === 0;

  let subtotalLabor = 0;
  let totalItemsCount = 0;

  if (isCartEmpty) {
    subtotalLabor = activeTaskFallback.basePrice;
    totalItemsCount = 1;
  } else {
    cartEntries.forEach(([tId, qty]) => {
      const count = Number(qty) || 0;
      const found = findTaskById(tId);
      if (found) {
        subtotalLabor += found.task.basePrice * count;
        totalItemsCount += count;
      }
    });
  }

  const welfareFund = Math.round(subtotalLabor * 0.03); // 3% worker welfare fund
  const gstTax = Math.round(subtotalLabor * 0.05); // 5% GST
  const emergencyCharge = isEmergencySOS ? 99 : 0;
  const couponDiscount = isCouponApplied ? 50 : 0;

  const grossTotal = Math.max(0, subtotalLabor + welfareFund + gstTax + emergencyCharge + workerTip - couponDiscount);
  const workerPayout = subtotalLabor + welfareFund + workerTip;

  // Voice Read-Out of the quote
  const handleListenPrice = () => {
    soundAndSpeech.playChime('click');
    const spoken = lang === 'hi'
      ? `सहकारी बुकिंग का कुल शुल्क ₹${grossTotal} है। इसमें से ₹${workerPayout} सीधे आपके कामगार को मिलेंगे। कोई बिचौलिया कमीशन नहीं है। आपका कामगार 15 से 25 मिनट में पहुंचेगा।`
      : lang === 'ta'
      ? `கூட்டுறவு கட்டணம் ₹${grossTotal}. இதில் ₹${workerPayout} நேரடியாக தொழிலாளருக்கு செல்கிறது. 15-25 நிமிடங்களில் தொழிலாளர் வருவார்.`
      : `Your cooperative transparent booking total is ₹${grossTotal}. ₹${workerPayout} goes directly to the worker with zero platform commission. Delivery in 15 to 25 minutes.`;

    soundAndSpeech.speak(spoken, lang || 'hi');
  };

  // GPS Location auto-detect
  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      addToast({ type: 'warning', title: 'GPS Unavailable', message: 'Geolocation is not supported by your browser.' });
      return;
    }
    setIsLocating(true);
    try {
      const { coords, isSimulated } = await locationService.getCurrentLocation();
      const geoResult = await locationService.fetchReverseGeocode(coords.latitude, coords.longitude);
      const cleanAddress = geoResult.address || `GPS Verified (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`;
      setCustomerAddress(cleanAddress);
      addToast({
        type: isSimulated ? 'info' : 'success',
        title: isSimulated ? 'Default Location Set' : 'Location Verified',
        message: `${cleanAddress}`
      });
    } catch {
      setCustomerAddress('Sri Krishna College of Engineering and Technology (SKCET), Kuniamuthur, Coimbatore');
      addToast({ type: 'info', title: 'Default Location', message: 'Using SKCET Coimbatore Cooperative Cluster Zone.' });
    } finally {
      setIsLocating(false);
    }
  };

  const toggleInstruction = (inst: string) => {
    setDeliveryInstructions((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  };

  const handleBackToHome = () => {
    if (onBack) {
      onBack();
    } else {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!customerAddress.trim()) {
      setErrorMessage('Please provide your service address and landmark');
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.setItem('partnerplus_user_name', customerName.trim());
      localStorage.setItem('partnerplus_user_phone', customerPhone.trim());
      localStorage.setItem('partnerplus_user_address', customerAddress.trim());

      let primaryTaskId = activeTaskFallback.id;
      let primaryTaskName = activeTaskFallback.name;
      let itemsListDescription = '';

      if (!isCartEmpty) {
        const itemNames: string[] = [];
        cartEntries.forEach(([tId, qty]) => {
          const found = findTaskById(tId);
          if (found) {
            itemNames.push(`${found.task.name} (×${qty})`);
          }
        });
        primaryTaskName = itemNames.join(', ');
        itemsListDescription = itemNames.join(' + ');
      } else {
        itemsListDescription = activeTaskFallback.name;
      }

      const result = await bookingService.createBookingFromCalculator({
        categoryId: currentCategory.id,
        categoryName: currentCategory.name,
        taskId: activeTaskFallback.id,
        taskName: itemsListDescription,
        taskUnit: activeTaskFallback.unit,
        basePrice: subtotalLabor,
        quantity: totalItemsCount,
        isEmergency: isEmergencySOS,
        needMaterials,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: `${customerAddress} [Tag: ${addressTag.toUpperCase()}]`,
        selectedSlot,
        customDate: customSlotDate,
        customTime: customSlotTime,
        paymentMode,
        problemDescription: [
          deliveryInstructions.join(', '),
          customInstructions,
          selectedWorker ? `Preferred Worker: ${selectedWorker.name}` : ''
        ].filter(Boolean).join(' | ')
      });

      if (selectedWorker && result.match && result.match.worker) {
        result.match.worker.id = selectedWorker.id;
        result.match.worker.name = selectedWorker.name;
        result.match.worker.phone = selectedWorker.phone;
        result.match.worker.photoUrl = selectedWorker.photo;
        result.match.worker.distanceKm = selectedWorker.distanceKm;
        result.match.worker.rating = selectedWorker.rating;
        result.match.worker.jobsCompleted = selectedWorker.jobs;
        result.match.worker.primarySkillLabel = selectedWorker.tradeLabel;
        result.match.worker.cooperativeName = selectedWorker.cooperativeName;
      }

      // If UPI / Razorpay payment mode is selected, launch Razorpay Checkout SDK modal directly before confirming
      if (paymentMode === 'upi') {
        await initializeRazorpayPayment({
          booking: result.booking,
          onSuccess: async (payload) => {
            await apiService.updateBookingStatus(result.booking.id, 'worker_accepted');
            await refreshData();
            setCreatedBooking(result.booking);
            setMatchResult(result.match);
            setBookingRef(result.booking.bookingCode);
            setSubmitted(true);
            setIsSubmitting(false);

            soundAndSpeech.playChime('complete');
            confetti({
              particleCount: 110,
              spread: 80,
              origin: { y: 0.55 }
            });

            addToast({
              type: 'success',
              title: 'Razorpay UPI Payment Successful! 🎉',
              message: `Ref: ${payload.razorpay_payment_id}. Partner ${result.match.worker.name} dispatched!`
            });
          },
          onFailure: async (err) => {
            console.warn('Razorpay payment cancelled by user:', err);
            await apiService.cancelBooking(result.booking.id, 'Payment cancelled by customer', 'customer');
            await refreshData();
            setIsSubmitting(false);
            addToast({
              type: 'warning',
              title: 'Payment & Booking Cancelled',
              message: 'Payment was cancelled. The booking has been voided.'
            });
          }
        });
        return;
      }

      setCreatedBooking(result.booking);
      setMatchResult(result.match);
      setBookingRef(result.booking.bookingCode);
      setSubmitted(true);
      await refreshData();

      soundAndSpeech.playChime('complete');
      
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.55 }
      });

      addToast({
        type: 'success',
        title: 'Worker Partner Dispatched!',
        message: `${result.match.worker.name} (${result.match.worker.distanceKm} km away) is on the way.`
      });

      const successVoice = lang === 'hi'
        ? `सहकारी बुकिंग सफल! कामगार ${result.match.worker.name} जल्द पहुंचेगा। रेफरेंस कोड ${result.booking.bookingCode}।`
        : `Booking confirmed! Your cooperative partner ${result.match.worker.name} is on the way. Reference: ${result.booking.bookingCode}.`;
      soundAndSpeech.speak(successVoice, lang || 'en');
    } catch (err: any) {
      setErrorMessage(err.message || 'Booking submission failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* 1. TOP DEDICATED PAGE HEADER (Not an overlap) */}
      <div className="bg-[#050B17] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackToHome}
              className="p-2 -ml-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold active:scale-95"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>

            <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D68ED] to-blue-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>Cooperative Direct Booking Portal</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Dispatch
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                0% Middleman Commission • 100% Payout to Workers • 15-25 Mins Express Arrival
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleListenPrice}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Listen to price summary"
            >
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="hidden md:inline">Voice Assist</span>
            </button>

            <button
              type="button"
              onClick={handleBackToHome}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Exit to Home"
            >
              <HomeIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. 3-STEP SWIGGY / ZOMATO NAVIGATION BAR */}
        {!submitted && (
          <div className="bg-white border-t border-slate-200 border-b border-slate-200 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto text-slate-800">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Step 1: Works */}
                <button
                  type="button"
                  onClick={() => {
                    setModalView('works');
                    soundAndSpeech.playChime('click');
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    modalView === 'works'
                      ? 'bg-[#1D68ED] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Hammer className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.step1Works || '1. What Kind of Works'}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    modalView === 'works' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {CATEGORIES.length} {t.trades || 'Trades'}
                  </span>
                </button>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:inline" />

                {/* Step 2: Workers */}
                <button
                  type="button"
                  onClick={() => {
                    setModalView('workers');
                    soundAndSpeech.playChime('click');
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    modalView === 'workers'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.step2Available || '2. Who is Available Nearby'}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    modalView === 'workers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {ALL_COOPERATIVE_WORKERS.length} {t.onDuty || 'On Duty'}
                  </span>
                </button>

                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:inline" />

                {/* Step 3: Cart & Book */}
                <button
                  type="button"
                  onClick={() => {
                    setModalView('cart');
                    soundAndSpeech.playChime('click');
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    modalView === 'cart'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.step3Review || '3. Review Cart & Book'}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    modalView === 'cart' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                  }`}>
                    ₹{grossTotal}
                  </span>
                </button>
              </div>

              {/* Selected worker indicator badge */}
              <div className="hidden md:flex items-center gap-2 shrink-0">
                {selectedWorker ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Partner: <strong>{selectedWorker.name}</strong></span>
                    <span className="text-[10px] text-emerald-600">({selectedWorker.etaMinutes}m ETA)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-semibold">
                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                    <span>⚡ {t.expressAutoMatch || 'Express Auto-Match (15-25 Mins)'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. MAIN PAGE BODY (Full Page View, Not an Overlap) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col">
        {submitted && matchResult ? (
          /* BOOKING DISPATCH SUCCESS VIEW */
          <div className="max-w-2xl w-full mx-auto my-auto bg-slate-900 text-white border border-slate-700 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                Worker Partner Dispatched
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Booking Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Booking Ref: <span className="font-mono text-emerald-300 font-bold tracking-wider">{bookingRef}</span>
              </p>
            </div>

            {/* Worker Partner Identity Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-left">
              <img
                src={matchResult.worker.photoUrl}
                alt={matchResult.worker.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-white truncate">
                    {matchResult.worker.name}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    {matchResult.worker.rating.toFixed(1)} ★
                  </span>
                </div>

                <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                  <span>{matchResult.worker.primarySkillLabel || currentCategory.name}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{matchResult.worker.distanceKm} km away</span>
                </div>

                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                  <span>ETA: <strong className="text-white">15-25 Mins</strong></span>
                  <span>•</span>
                  <span>{matchResult.worker.jobsCompleted}+ Verified Jobs</span>
                </div>
              </div>
            </div>

            {/* Transparent Billing Summary */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-xs space-y-2 text-slate-300 text-left">
              <div className="flex justify-between">
                <span>Task Subtotal ({totalItemsCount} items)</span>
                <span className="font-bold text-white">₹{subtotalLabor}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>100% Direct to Worker Partner</span>
                <span className="font-bold">₹{workerPayout}</span>
              </div>
              <div className="flex justify-between text-blue-400">
                <span>Middleman Platform Cut</span>
                <span className="font-bold">₹0 (Zero Markup)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700 text-sm font-black text-white">
                <span>Total Amount Due</span>
                <span className="text-[#00D2FF]">₹{grossTotal} ({paymentMode.toUpperCase()})</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (createdBooking) openTracker(createdBooking);
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#1D68ED] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Track Live Worker On Map</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (createdBooking) openInvoice(createdBooking);
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Cooperative Tax Invoice</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleBackToHome}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                &larr; Return to Home Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[650px] relative">
            {/* VIEW 1: WHAT KIND OF WORKS */}
            {modalView === 'works' && (
              <WorksCatalogView
                categories={CATEGORIES}
                activeCategoryId={activeCategoryId}
                setActiveCategoryId={(catId) => {
                  setActiveCategoryId(catId);
                  setWorkerCategoryFilter(catId);
                }}
                filteredTasks={filteredTasksList}
                filteredTasksList={filteredTasksList}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onDeleteItem={handleDeleteItem}
                totalItemsCount={totalItemsCount}
                grossTotal={grossTotal}
                onProceedToWorkers={() => setModalView('workers')}
                onProceedToCart={() => setModalView('cart')}
                onViewWorkers={(catId) => {
                  if (catId) setWorkerCategoryFilter(catId);
                  setModalView('workers');
                }}
                totalWorkersCount={ALL_COOPERATIVE_WORKERS.length}
                searchQuery={worksSearchQuery}
                setSearchQuery={setWorksSearchQuery}
                lang={lang}
              />
            )}

            {/* VIEW 2: WHO IS AVAILABLE NEARBY */}
            {modalView === 'workers' && (
              <AvailableWorkersView
                workers={filteredWorkersList}
                selectedWorker={selectedWorker}
                onSelectWorker={(worker) => {
                  setSelectedWorker(worker);
                  soundAndSpeech.playChime('click');
                  if (worker) {
                    addToast({
                      type: 'success',
                      title: 'Partner Chosen',
                      message: `${worker.name} assigned to your booking.`
                    });
                  }
                }}
                workerCategoryFilter={workerCategoryFilter}
                setWorkerCategoryFilter={setWorkerCategoryFilter}
                searchQuery={worksSearchQuery}
                setSearchQuery={setWorksSearchQuery}
                categories={CATEGORIES.map((c) => ({ id: c.id, name: c.name }))}
                onProceedToCart={() => {
                  setModalView('cart');
                  soundAndSpeech.playChime('click');
                }}
                onProceedWithWorker={(worker) => {
                  setSelectedWorker(worker);
                  setModalView('cart');
                  soundAndSpeech.playChime('click');
                }}
                onBackToWorks={() => {
                  setModalView('works');
                  soundAndSpeech.playChime('click');
                }}
              />
            )}

            {/* VIEW 3: REVIEW CART & BOOK */}
            {modalView === 'cart' && (
              <BookingCheckoutView
                cart={cart}
                findTaskById={findTaskById}
                activeTaskFallback={activeTaskFallback}
                totalItemsCount={totalItemsCount}
                subtotalLabor={subtotalLabor}
                welfareFund={welfareFund}
                gstTax={gstTax}
                couponDiscount={couponDiscount}
                isCouponApplied={isCouponApplied}
                grossTotal={grossTotal}
                selectedWorker={selectedWorker}
                onSelectWorker={setSelectedWorker}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onDeleteItem={handleDeleteItem}
                onNavigateToWorks={() => setModalView('works')}
                onNavigateToWorkers={() => setModalView('workers')}
                deliveryInstructions={deliveryInstructions}
                toggleInstruction={toggleInstruction}
                customInstructions={customInstructions}
                setCustomInstructions={setCustomInstructions}
                isEmergencySOS={isEmergencySOS}
                setIsEmergencySOS={setIsEmergencySOS}
                needMaterials={needMaterials}
                setNeedMaterials={setNeedMaterials}
                addressTag={addressTag}
                setAddressTag={setAddressTag}
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerAddress={customerAddress}
                setCustomerAddress={setCustomerAddress}
                handleDetectLocation={handleDetectLocation}
                isLocating={isLocating}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                customSlotDate={customSlotDate}
                setCustomSlotDate={setCustomSlotDate}
                customSlotTime={customSlotTime}
                setCustomSlotTime={setCustomSlotTime}
                workerTip={workerTip}
                setWorkerTip={setWorkerTip}
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
                errorMessage={errorMessage}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmitBooking}
                lang={lang}
              />
            )}

            {/* FLOATING BOTTOM BAR (When on 'works' or 'workers' view) */}
            {modalView !== 'cart' && (
              <div className="sticky bottom-0 left-0 right-0 bg-[#050B17] text-white p-3.5 sm:p-4 border-t border-slate-800 shadow-2xl flex items-center justify-between gap-3 z-30">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-white">
                      ₹{grossTotal} Total
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black border border-blue-500/30">
                      {totalItemsCount} Work(s)
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 truncate mt-0.5">
                    {selectedWorker ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Assigned: {selectedWorker.name} ({selectedWorker.tradeLabel})</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>⚡ Express Auto-Match (15-25 Mins Arrival)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {modalView === 'works' && (
                    <button
                      type="button"
                      onClick={() => setModalView('workers')}
                      className="hidden sm:inline-flex px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition cursor-pointer"
                    >
                      See Available Crew &rarr;
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setModalView('cart')}
                    className="px-5 py-2.5 rounded-xl bg-[#1D68ED] hover:bg-blue-600 text-white text-xs sm:text-sm font-black transition cursor-pointer shadow-lg shadow-blue-500/30 flex items-center gap-2"
                  >
                    <span>View Cart &amp; Book &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
