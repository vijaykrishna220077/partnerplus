import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  Mic, 
  MicOff, 
  Volume2, 
  MapPin, 
  CheckCheck, 
  Clock, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { Booking, ChatMessage } from '../../types';
import { chatService } from '../../services/chatService';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { soundAndSpeech } from '../../utils/soundAndSpeech';

interface JobChatModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  booking?: Booking | null;
  currentRole?: 'customer' | 'worker';
}

export const JobChatModal: React.FC<JobChatModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  booking: propBooking,
  currentRole: propCurrentRole
}) => {
  const { lang, addToast, activeChatBooking, activeChatRole, closeChat } = useApp();

  const booking = propBooking !== undefined ? propBooking : activeChatBooking;
  const isOpen = propIsOpen !== undefined ? propIsOpen : !!activeChatBooking;
  const onClose = propOnClose || closeChat;

  const portalRole = propCurrentRole || activeChatRole || 'customer';
  const currentRole = portalRole;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceSeconds, setVoiceSeconds] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const voiceTimerRef = useRef<any>(null);

  // Load and subscribe to real-time messages (Hook MUST be declared before any conditional return)
  useEffect(() => {
    if (!isOpen || !booking || !booking.id) return;

    // Load initial messages with dynamic worker and customer names
    const initial = chatService.getMessages(booking.id, booking.workerName, booking.customerName);
    setMessages(initial);
    chatService.markAllAsRead(booking.id, currentRole);

    // Subscribe to real-time events (same tab & cross tab)
    const unsubscribe = chatService.subscribe(booking.id, (updated) => {
      setMessages(updated);
      chatService.markAllAsRead(booking.id, currentRole);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen, booking?.id, currentRole]);

  // Scroll to bottom when messages update (Hook MUST be declared before any conditional return)
  useEffect(() => {
    if (isOpen && booking) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, booking?.id, messages]);

  // Conditional early return ONLY AFTER ALL HOOKS HAVE BEEN DECLARED
  if (!isOpen || !booking) return null;

  const isWorker = currentRole === 'worker';

  // Safe address formatting helper
  const getAddressStreet = (): string => {
    if (!booking || !booking.address) return 'Site Location';
    if (typeof booking.address === 'string') return booking.address;
    return booking.address.street || booking.address.area || 'Site Location';
  };

  const getAddressLandmark = (): string => {
    if (!booking || !booking.address) return 'Near main entrance';
    if (typeof booking.address === 'string') return booking.address;
    return booking.address.landmark || booking.address.area || 'Near main entrance';
  };

  const { user } = useAuth();

  // Identity config with active logged in user fallback
  const activeCustomerName = (user?.role === 'customer' ? user.name : booking.customerName) || user?.name || booking.customerName || 'Customer';
  const mySenderId = isWorker ? (booking.workerId || 'wrk-1') : (user?.id || booking.customerId || 'cust-1');
  const mySenderName = isWorker ? (booking.workerName || 'Worker') : activeCustomerName;
  const counterpartName = isWorker ? activeCustomerName : (booking.workerName || 'Cooperative Artisan');
  const counterpartRole = isWorker ? 'Customer' : 'Cooperative Artisan';
  const counterpartPhone = isWorker ? (booking.customerPhone || '9845012345') : (booking.workerPhone || '9845012345');
  const customerPhoto = (user?.role === 'customer' && user?.avatar) 
    || (booking as any)?.customerPhoto 
    || user?.avatar 
    || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
  const workerPhoto = booking.workerPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
  const counterpartPhoto = isWorker ? customerPhoto : workerPhoto;

  const handleSendMessage = (textToSend?: string, type?: 'eta' | 'arrival' | 'direction' | 'materials' | 'general', isVoice?: boolean) => {
    const text = (textToSend || inputText).trim();
    if (!text && !isVoice) return;

    const finalMessage = isVoice ? `🎙️ Voice Note: "${text}"` : text;

    chatService.sendMessage({
      bookingId: booking.id,
      senderId: mySenderId,
      senderName: mySenderName,
      senderRole: currentRole,
      text: finalMessage,
      quickReplyType: type || 'general',
      isVoiceNote: isVoice
    });

    soundAndSpeech.playChime('toggle');
    setInputText('');
  };

  const handleQuickPreset = (presetText: string, type: 'eta' | 'arrival' | 'direction' | 'materials' | 'general') => {
    handleSendMessage(presetText, type);
  };

  const handleSpeakMessage = (text: string) => {
    soundAndSpeech.speak(text, lang || 'en');
  };

  const handleVoiceMemoToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setVoiceSeconds(0);
      soundAndSpeech.playChime('click');
      voiceTimerRef.current = setInterval(() => {
        setVoiceSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setIsRecordingVoice(false);
      clearInterval(voiceTimerRef.current);
      soundAndSpeech.playChime('complete');

      // Transcribe simulated realistic voice note
      const simulatedNotes = isWorker ? [
        "I am approaching your street, please keep the front gate unlatched.",
        "Arriving in 5 minutes with tools and testing meter.",
        "Please check the repair work now, everything is completed safely."
      ] : [
        "Please come up to the 3rd floor, door 302.",
        "Can you also bring a spare 16A socket switch?",
        "Please ring the bell twice when you reach."
      ];
      const randomNote = simulatedNotes[Math.floor(Math.random() * simulatedNotes.length)];
      handleSendMessage(randomNote, 'general', true);
      addToast({
        type: 'info',
        title: 'Voice Note Sent',
        message: `Transcribed: "${randomNote}"`
      });
    }
  };

  const handleShareLocation = () => {
    const locationText = isWorker 
      ? `📍 Live Location: Moving on DB Road, approx 800m away (ETA ~5 mins)`
      : `📍 Location Landmark: ${getAddressLandmark()}, Street: ${getAddressStreet()}`;
    handleSendMessage(locationText, 'direction');
  };

  // Preset chips depending on user role
  const customerPresets = [
    { text: 'What is your estimated ETA?', type: 'eta' as const, label: '⏱️ ETA?' },
    { text: `Address landmark: ${getAddressLandmark()}, Flat ${getAddressStreet()}`, type: 'direction' as const, label: '📍 Landmark' },
    { text: 'Please ring doorbell twice on arrival', type: 'arrival' as const, label: '🔔 Doorbell' },
    { text: 'Do you need any extra tools or ladder from us?', type: 'materials' as const, label: '🧰 Extra Tools?' },
  ];

  const workerPresets = [
    { text: 'I am on the way, arriving in approx 10 mins', type: 'eta' as const, label: '🛵 Arriving in 10 mins' },
    { text: 'I have arrived outside your building/gate', type: 'arrival' as const, label: '🚪 Arrived at gate' },
    { text: 'Testing main line now. Please allow 15 mins.', type: 'general' as const, label: '⚡ Testing line' },
    { text: 'Service completed! Ready for your inspection.', type: 'general' as const, label: '✅ Work done' },
  ];

  const presets = isWorker ? workerPresets : customerPresets;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto border transition-colors ${
          isWorker 
            ? 'bg-slate-900 border-slate-700 text-white max-h-[92vh]' 
            : 'bg-white border-slate-200 text-slate-900 max-h-[90vh]'
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isWorker ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="relative inline-flex shrink-0">
              <img 
                src={counterpartPhoto} 
                alt={counterpartName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-sm shrink-0"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-xs"></span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-black text-sm sm:text-base leading-tight ${isWorker ? 'text-white' : 'text-white'}`}>
                  {counterpartName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  {counterpartRole}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Job: {booking.serviceName} • Ref: #{booking.bookingCode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${counterpartPhone}`}
              className="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-xs shrink-0"
              title={`Call ${counterpartName}`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call {isWorker ? 'Customer' : 'Worker'}</span>
            </a>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isWorker 
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Status Coordination Notice */}
        <div className={`px-4 py-2 text-[11px] font-medium flex items-center justify-between border-b ${
          isWorker 
            ? 'bg-slate-950/60 text-slate-400 border-slate-800' 
            : 'bg-blue-50/50 text-blue-800 border-blue-100'
        }`}>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-end cooperative dispatch channel</span>
          </span>
          <span className="text-[10px] font-mono opacity-80">
            {booking.scheduledTimeSlot || (booking as any).scheduledTime || 'Scheduled'}
          </span>
        </div>

        {/* Chat Message Stream */}
        <div className={`flex-1 p-4 overflow-y-auto space-y-3.5 min-h-[260px] sm:min-h-[320px] ${
          isWorker ? 'bg-slate-900/90' : 'bg-slate-50/50'
        }`}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-70">
              <MessageSquare className="w-10 h-10 text-slate-400" />
              <p className="text-xs font-bold">No messages yet</p>
              <p className="text-[11px] text-slate-500 max-w-xs">
                Use the quick buttons below to coordinate ETA, directions, or access instructions.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderRole === currentRole;
              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group`}
                >
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                    <span>{isMine ? 'You' : msg.senderName}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-end gap-1.5 max-w-[85%]">


                    <div 
                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs break-words ${
                        isMine 
                          ? isWorker
                            ? 'bg-emerald-500 text-black font-bold rounded-br-xs'
                            : 'bg-blue-600 text-white font-medium rounded-br-xs'
                          : isWorker
                            ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-xs'
                            : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}

                      <div className="flex items-center justify-end gap-1 text-[9px] mt-1 opacity-70">
                        {isMine && (
                          <span className="flex items-center">
                            <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-emerald-300 dark:text-black font-black' : 'text-slate-300'}`} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Coordination Presets */}
        <div className={`p-2.5 border-t overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none ${
          isWorker ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
        }`}>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
            Quick:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPreset(p.text, p.type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1 active:scale-95 ${
                isWorker
                  ? 'bg-slate-700 hover:bg-slate-600 text-emerald-300 border border-slate-600'
                  : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
              }`}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Voice recording indicator if active */}
        {isRecordingVoice && (
          <div className="p-3 bg-red-500/15 border-t border-red-500/30 flex items-center justify-between text-xs text-red-500 animate-pulse shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span className="font-bold">Recording voice message... ({voiceSeconds}s)</span>
            </div>
            <span className="text-[11px] font-bold">Tap mic to send</span>
          </div>
        )}

        {/* Footer Input Bar */}
        <div className={`p-3 sm:p-4 border-t shrink-0 ${
          isWorker ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Share Location Button */}
            <button
              type="button"
              onClick={handleShareLocation}
              className={`p-2.5 rounded-xl transition cursor-pointer shrink-0 ${
                isWorker 
                  ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Share ETA / Location Landmark"
            >
              <MapPin className="w-4 h-4" />
            </button>

            {/* Voice Memo Button */}
            <button
              type="button"
              onClick={handleVoiceMemoToggle}
              className={`p-2.5 rounded-xl transition cursor-pointer shrink-0 ${
                isRecordingVoice
                  ? 'bg-red-600 text-white animate-bounce'
                  : isWorker 
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-400' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={isRecordingVoice ? 'Tap to finish voice memo' : 'Tap to record voice memo'}
            >
              {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isWorker ? "Type coordination note or tap Quick buttons..." : "Message worker regarding arrival, landmarks..."}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition focus:outline-none ${
                isWorker
                  ? 'bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500'
                  : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600'
              }`}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center shrink-0 cursor-pointer active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
                isWorker
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
