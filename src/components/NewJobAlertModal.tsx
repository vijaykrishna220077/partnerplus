import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  ChevronsRight, 
  ShieldCheck, 
  X, 
  Compass, 
  Phone,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';
import { soundAndSpeech } from '../utils/soundAndSpeech';

export interface JobAlertData {
  id: string;
  title: string;
  titleHi?: string;
  category: string;
  tradeIcon?: string;
  earnings: number; // e.g. 650
  earningsTag?: string; // "Direct Cash"
  distanceKm: number; // e.g. 1.2
  estimatedDurationMins?: number; // e.g. 45
  travelDurationMins?: number; // e.g. 4
  customerName: string;
  customerPhone?: string;
  customerRating?: number; // e.g. 4.9
  locationArea: string; // e.g. "7th Cross, Bellandur Outer Ring Rd"
  fullAddress?: string; // e.g. "Flat 402, Green Glen Residency, Outer Ring Road, Bellandur"
  description?: string;
  specialInstructions?: string;
  equipmentProvided?: boolean;
}

interface NewJobAlertModalProps {
  isOpen: boolean;
  job?: JobAlertData | null;
  countdownSeconds?: number;
  onAccept: (job: JobAlertData) => void;
  onDecline: (jobId: string) => void;
  lang?: string;
}

export const DEFAULT_SAMPLE_JOB: JobAlertData = {
  id: 'alert-job-650',
  title: 'Exterior Commercial Pressure Washing',
  titleHi: 'दुकान व दीवार की तेज पानी धुलाई (Pressure Wash)',
  category: 'Pressure Washing & Deep Clean',
  tradeIcon: '🌊',
  earnings: 650,
  earningsTag: 'Direct Cash (सीधा नकद)',
  distanceKm: 1.2,
  estimatedDurationMins: 45,
  travelDurationMins: 4,
  customerName: 'Rajesh Kumar',
  customerPhone: '9845012345',
  customerRating: 4.9,
  locationArea: 'Green Glen Layout, Bellandur',
  fullAddress: 'Shop #4, Ground Floor, Sri Balaji Arcade, Outer Ring Road, Bellandur',
  description: 'Clean front pavement, exterior glass shutters, and driveway area using high-pressure jet.',
  specialInstructions: 'Commercial grade pressure pump and water outlet available at site.',
  equipmentProvided: true
};

export const NewJobAlertModal: React.FC<NewJobAlertModalProps> = ({
  isOpen,
  job = DEFAULT_SAMPLE_JOB,
  countdownSeconds = 30,
  onAccept,
  onDecline,
  lang = 'hi'
}) => {
  const activeJob = job || DEFAULT_SAMPLE_JOB;
  const [timeLeft, setTimeLeft] = useState<number>(countdownSeconds);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  
  // Slider state
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartX = useRef<number>(0);
  const currentDragX = useRef<number>(0);

  // Sound chime on initial alert pop-up
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(countdownSeconds);
      setIsAccepted(false);
      setSliderPosition(0);
      setIsDragging(false);

      if (!isMuted) {
        soundAndSpeech.playChime('alert');
      }

      // Voice prompt: automatically announce to rural workers
      const announceTimer = setTimeout(() => {
        if (!isMuted) {
          handleSpeakJob();
        }
      }, 500);

      return () => clearTimeout(announceTimer);
    }
  }, [isOpen, activeJob.id]);

  // Countdown timer with circular progress
  useEffect(() => {
    if (!isOpen || isAccepted) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        // Last 5 seconds audible warning beep if unmuted
        if (prev <= 5 && !isMuted) {
          soundAndSpeech.playChime('click');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, isAccepted, isMuted]);

  // Timeout handler
  const handleTimeout = useCallback(() => {
    if (isAccepted) return;
    onDecline(activeJob.id);
  }, [activeJob.id, isAccepted, onDecline]);

  // Text-to-speech announcement for rural workers
  const handleSpeakJob = () => {
    setIsSpeaking(true);
    const spokenText = lang === 'en'
      ? `New job alert! ${activeJob.title}. Earn ${activeJob.earnings} rupees direct cash. Distance ${activeJob.distanceKm} kilometers. Swipe green bar below to accept.`
      : `सहकारी सेवा नया काम! ${activeJob.titleHi || activeJob.title}। कमाई ${activeJob.earnings} रुपये सीधा नकद। दूरी ${activeJob.distanceKm} किलोमीटर। स्वीकार करने के लिए नीचे हरा बटन स्वाइप करें।`;

    soundAndSpeech.speak(spokenText, lang === 'en' ? 'en-US' : 'hi-IN');
    setTimeout(() => setIsSpeaking(false), 5000);
  };

  // Toggle voice mute
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    soundAndSpeech.playChime('toggle');
  };

  // Decline order
  const handleDeclineOrder = () => {
    soundAndSpeech.playChime('click');
    onDecline(activeJob.id);
  };

  // Trigger Accept order completion
  const triggerAccept = () => {
    setIsAccepted(true);
    soundAndSpeech.playChime('accept');

    // Announce confirmation
    const confirmText = lang === 'en'
      ? `Job accepted! Proceed to ${activeJob.customerName}.`
      : `काम स्वीकार किया गया! ग्राहक ${activeJob.customerName} के पास जाने के लिए तैयार हों।`;
    soundAndSpeech.speak(confirmText, lang === 'en' ? 'en-US' : 'hi-IN');

    setTimeout(() => {
      onAccept(activeJob);
    }, 900);
  };

  // Interactive Swipe Slider Logic (Mouse & Touch)
  const getMaxTravel = () => {
    if (!sliderRef.current) return 200;
    const trackWidth = sliderRef.current.clientWidth;
    const knobWidth = 58; // knob size in px
    return Math.max(100, trackWidth - knobWidth - 8);
  };

  const handleDragStart = (clientX: number) => {
    if (isAccepted) return;
    setIsDragging(true);
    dragStartX.current = clientX;
    currentDragX.current = sliderPosition;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || isAccepted) return;
    const maxTravel = getMaxTravel();
    const deltaX = clientX - dragStartX.current;
    const newPos = Math.max(0, Math.min(maxTravel, currentDragX.current + deltaX));
    setSliderPosition(newPos);

    // Auto-trigger if dragged past 82% threshold
    if (newPos >= maxTravel * 0.82) {
      setSliderPosition(maxTravel);
      setIsDragging(false);
      triggerAccept();
    }
  };

  const handleDragEnd = () => {
    if (!isDragging || isAccepted) return;
    setIsDragging(false);
    const maxTravel = getMaxTravel();

    if (sliderPosition >= maxTravel * 0.82) {
      setSliderPosition(maxTravel);
      triggerAccept();
    } else {
      // Snap smoothly back to start
      setSliderPosition(0);
    }
  };

  // Mouse event listeners on window during active drag
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX);
    };
    const onMouseUp = () => {
      handleDragEnd();
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, sliderPosition]);

  if (!isOpen) return null;

  // Circular timer geometry
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, Math.min(1, timeLeft / countdownSeconds));
  const strokeDashoffset = circumference * (1 - progressRatio);

  const isCriticalTime = timeLeft <= 8;
  const timerColor = isCriticalTime 
    ? '#EF4444' 
    : timeLeft <= 15 
    ? '#F59E0B' 
    : '#10B981';

  return (
    <div 
      id="new-job-alert-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn transition-all select-none"
    >
      {/* Outer Pulse Glow for Visual Urgency */}
      <div className={`w-full max-w-lg bg-slate-900 text-white rounded-t-3xl sm:rounded-3xl shadow-2xl border-2 ${isCriticalTime ? 'border-red-500 shadow-red-500/30' : 'border-emerald-500/60 shadow-emerald-500/20'} overflow-hidden relative flex flex-col max-h-[92vh] sm:max-h-[90vh]`}>
        
        {/* Pulsing Beacon Ribbon at Top */}
        <div className={`py-1 px-4 text-center font-black text-[11px] tracking-wider uppercase flex items-center justify-between transition-colors ${isCriticalTime ? 'bg-red-600 animate-pulse text-white' : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white'}`}>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span>सहकारी सेवा • SAHAKARI SEVA GIG ALERT</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline bg-black/25 px-2 py-0.5 rounded text-[10px] font-bold">
              0% Cut • 100% Aapka
            </span>
            <button
              onClick={handleToggleMute}
              className="p-1 rounded hover:bg-white/20 transition cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-200" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* TOP SECTION: Circular Countdown Timer + FINANCIAL FOCUS (Earnings in Large Bold Green) */}
          <div className="flex items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 shadow-inner">
            
            {/* Circular Progress Countdown Timer (Swiggy/Zomato style) */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="#334155"
                  strokeWidth="4.5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke={timerColor}
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-lg font-black leading-none ${isCriticalTime ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                  {timeLeft}s
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-tighter">
                  LEFT
                </span>
              </div>
            </div>

            {/* FINANCIAL FOCUS: Large Bold Green Earnings Display */}
            <div className="flex-1 text-center sm:text-right">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400 tracking-tight drop-shadow-sm font-sans">
                  ₹{activeJob.earnings}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wide flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>{activeJob.earningsTag || 'Direct Cash (सीधा नकद)'}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                100% Payout on completion • No deductions
              </div>
            </div>

            {/* Quick Audio Readout Button */}
            <button
              onClick={handleSpeakJob}
              className={`p-2.5 rounded-xl border transition flex flex-col items-center justify-center gap-0.5 shrink-0 cursor-pointer ${
                isSpeaking 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse' 
                  : 'bg-slate-700/60 hover:bg-slate-700 border-slate-600 text-slate-200'
              }`}
              title="Listen to order details in voice (आवाज़ में सुनें)"
            >
              <Volume2 className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase">सुने</span>
            </button>
          </div>

          {/* JOB DETAILS: Title, Distance, Trade Badge */}
          <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 space-y-2.5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl">{activeJob.tradeIcon || '🛠️'}</span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {activeJob.title}
                  </h3>
                </div>
                {activeJob.titleHi && (
                  <div className="text-xs font-semibold text-amber-300/90 mt-0.5">
                    {activeJob.titleHi}
                  </div>
                )}
              </div>

              {/* Distance Pill */}
              <div className="bg-blue-950/80 border border-blue-500/40 text-blue-300 px-3 py-1.5 rounded-xl text-right shrink-0">
                <div className="text-sm font-black flex items-center gap-1 justify-end">
                  <Navigation className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  <span>{activeJob.distanceKm} KM</span>
                </div>
                <div className="text-[10px] text-blue-300/70 font-medium">
                  ~{activeJob.travelDurationMins || 4} mins away
                </div>
              </div>
            </div>

            {/* Customer info & Address snippet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-700/80">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
                  👤
                </div>
                <div className="truncate">
                  <span className="font-bold text-white">{activeJob.customerName}</span>
                  {activeJob.customerRating && (
                    <span className="text-amber-400 font-bold ml-1.5">★ {activeJob.customerRating}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Job Time: <strong>~{activeJob.estimatedDurationMins || 45} mins</strong></span>
              </div>
            </div>
          </div>

          {/* GOOGLE MAPS-STYLE ROUTE & PIN PLACEHOLDER GRAPHIC */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-[#E8ECE9] shadow-md group">
            {/* Maps Header Badge */}
            <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-slate-800 text-[11px] font-black shadow flex items-center gap-1.5 border border-slate-300">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Google Maps Route</span>
              <span className="text-emerald-700 bg-emerald-100 px-1 rounded text-[10px]">Fastest (4 min)</span>
            </div>

            <div className="absolute top-2.5 right-2.5 z-10">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeJob.fullAddress || activeJob.locationArea)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 px-2 py-1 rounded-lg text-[10px] font-bold shadow flex items-center gap-1 border border-slate-200 transition"
              >
                <span>Full Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Stylized Vector Google Maps Canvas Representation */}
            <div className="h-36 sm:h-40 w-full relative overflow-hidden bg-[#E7EDE7]">
              
              {/* Map Streets Grid Lines */}
              <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mapWater" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#C6DEF1" />
                    <stop offset="100%" stopColor="#A8D0E6" />
                  </linearGradient>
                  <linearGradient id="routeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1A73E8" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>

                {/* Land background */}
                <rect width="400" height="160" fill="#E8ECE9" />

                {/* Green Park Patch */}
                <path d="M 10 10 Q 50 20 80 5 C 100 -5 130 15 120 45 C 110 70 70 75 40 65 C 15 55 0 35 10 10 Z" fill="#D2E7D6" />
                <text x="45" y="38" fill="#5F8D69" fontSize="8" fontWeight="bold">Agara Park</text>

                {/* Water Body (Lake) */}
                <path d="M 280 85 C 320 80 370 100 395 125 C 405 140 370 160 330 155 C 290 150 260 120 280 85 Z" fill="url(#mapWater)" />
                <text x="320" y="125" fill="#4682B4" fontSize="8" fontWeight="bold">Lake Zone</text>

                {/* Secondary Gray Roads */}
                <path d="M 0 40 L 400 40" stroke="#FFFFFF" strokeWidth="6" />
                <path d="M 0 40 L 400 40" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3,3" />

                <path d="M 0 115 L 400 115" stroke="#FFFFFF" strokeWidth="6" />
                <path d="M 0 115 L 400 115" stroke="#CBD5E1" strokeWidth="1" />

                <path d="M 120 0 L 120 160" stroke="#FFFFFF" strokeWidth="6" />
                <path d="M 270 0 L 270 160" stroke="#FFFFFF" strokeWidth="6" />

                {/* Major Yellow Highway (Outer Ring Road) */}
                <path d="M 0 80 Q 150 75 220 90 T 400 85" stroke="#FDE68A" strokeWidth="9" />
                <path d="M 0 80 Q 150 75 220 90 T 400 85" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6,4" />
                <text x="135" y="75" fill="#78350F" fontSize="8" fontWeight="900" letterSpacing="0.5">OUTER RING ROAD</text>
                <text x="15" y="110" fill="#475569" fontSize="7" fontWeight="bold">7th Main Rd</text>

                {/* NAVIGATION BLUE ROUTE (Google Maps Style) */}
                <path 
                  d="M 60 120 L 120 120 L 120 80 L 220 90 L 270 90 L 270 50 L 320 50" 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M 60 120 L 120 120 L 120 80 L 220 90 L 270 90 L 270 50 L 320 50" 
                  fill="none" 
                  stroke="url(#routeGrad)" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Moving navigation dots along route */}
                <circle cx="120" cy="100" r="2.5" fill="#FFFFFF" opacity="0.9" />
                <circle cx="170" cy="85" r="2.5" fill="#FFFFFF" opacity="0.9" />
                <circle cx="270" cy="70" r="2.5" fill="#FFFFFF" opacity="0.9" />

                {/* Worker Origin (Blue Dot with Pulse Ring) */}
                <circle cx="60" cy="120" r="8" fill="#1D68ED" opacity="0.25" className="animate-ping" />
                <circle cx="60" cy="120" r="6" fill="#1D68ED" stroke="#FFFFFF" strokeWidth="2" />
                <text x="35" y="142" fill="#0F172A" fontSize="8" fontWeight="bold">You (Start)</text>

                {/* Customer Pin (Classic Google Maps Red Teardrop Pin) */}
                <g transform="translate(320, 50)">
                  <ellipse cx="0" cy="4" rx="5" ry="2" fill="#000000" opacity="0.3" />
                  <path 
                    d="M 0 0 C -7 -7 -7 -18 0 -24 C 7 -18 7 -7 0 0 Z" 
                    fill="#EA4335" 
                    stroke="#B31412" 
                    strokeWidth="0.8" 
                  />
                  <circle cx="0" cy="-14" r="3.2" fill="#FFFFFF" />
                  <circle cx="0" cy="-14" r="1.5" fill="#B31412" />
                </g>
              </svg>

              {/* Bottom Address Overlay Banner */}
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 text-xs flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="font-bold truncate text-slate-900">
                    {activeJob.fullAddress || activeJob.locationArea}
                  </span>
                </div>
                <span className="text-[10px] font-black text-blue-700 shrink-0 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  {activeJob.distanceKm} KM
                </span>
              </div>
            </div>
          </div>

          {/* Accessibility info: Equipment & Safety guarantee */}
          <div className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>सहकारी सुरक्षा: ₹2 लाख सरकारी दुर्घटना बीमा लागू</span>
            </div>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              मशीन उपलब्ध ✅
            </span>
          </div>

          {/* PRIMARY ACTION BUTTON: 'SWIPE TO ACCEPT' SLIDER */}
          <div className="pt-2">
            <div
              id="swipe-to-accept-slider"
              ref={sliderRef}
              className={`relative h-16 w-full rounded-2xl p-1 overflow-hidden transition-all flex items-center ${
                isAccepted 
                  ? 'bg-emerald-600 border-2 border-emerald-400' 
                  : 'bg-slate-950 border-2 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
              }`}
            >
              {/* Dynamic Green Fill Revealed as User Swipes */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl transition-all"
                style={{
                  width: isAccepted ? '100%' : `${sliderPosition + 58}px`,
                  transition: isDragging ? 'none' : 'width 0.25s ease-out'
                }}
              />

              {/* Shimmering Center Text in Slider */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 text-center">
                {isAccepted ? (
                  <span className="font-black text-white text-sm sm:text-base flex items-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>काम स्वीकार किया गया! (ACCEPTED)</span>
                  </span>
                ) : (
                  <span className={`text-xs sm:text-sm font-black tracking-wide uppercase transition-opacity flex items-center gap-1.5 ${sliderPosition > 40 ? 'text-white' : 'text-emerald-400 animate-pulse'}`}>
                    <span>स्वीकार करने के लिए स्वाइप करें</span>
                    <ChevronsRight className="w-4 h-4 inline" />
                  </span>
                )}
              </div>

              {/* Grab Handle Slider Thumb */}
              <div
                role="slider"
                aria-valuenow={Math.round((sliderPosition / getMaxTravel()) * 100)}
                aria-label="Swipe to accept job order"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    triggerAccept();
                  }
                }}
                onMouseDown={(e) => handleDragStart(e.clientX)}
                onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                onTouchEnd={handleDragEnd}
                style={{
                  transform: `translateX(${sliderPosition}px)`,
                  transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
                className={`relative z-10 w-14 h-14 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-xl transition-colors ${
                  isAccepted
                    ? 'bg-white text-emerald-600'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-white/30'
                }`}
              >
                {isAccepted ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                ) : (
                  <div className="flex items-center justify-center">
                    <ChevronsRight className="w-6 h-6 text-slate-950 font-black animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Accessibility fallback button for keyboards / screen readers */}
            <button
              onClick={triggerAccept}
              className="sr-only focus:not-sr-only focus:block w-full mt-2 py-2 bg-emerald-600 text-white font-bold rounded-lg"
            >
              Click or Press Enter to Accept Order
            </button>
          </div>

          {/* SECONDARY ACTION: Smaller, less prominent 'Decline' or 'Pass' text button below slider */}
          <div className="text-center pt-1 pb-1">
            <button
              id="decline-job-alert-btn"
              type="button"
              onClick={handleDeclineOrder}
              className="py-1.5 px-4 text-xs font-bold text-slate-400 hover:text-red-400 active:text-red-500 transition-colors cursor-pointer rounded-lg inline-flex items-center gap-1.5 hover:bg-slate-800/60"
            >
              <X className="w-3.5 h-3.5" />
              <span>Pass this order (यह काम छोड़ें) • No penalty on Sahakari Seva</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
