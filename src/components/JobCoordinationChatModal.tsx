import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Phone, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Check, 
  CheckCheck, 
  Sparkles, 
  User, 
  Wrench, 
  ShieldCheck, 
  Info, 
  Star
} from 'lucide-react';
import { Booking, ChatMessage, Worker } from '../types';
import { apiService } from '../services/apiService';
import { chatService } from '../services/chatService';
import { realtimeHub } from '../services/db';
import { soundAndSpeech } from '../utils/soundAndSpeech';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface JobCoordinationChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  initialRole?: 'customer' | 'worker';
}

export const JobCoordinationChatModal: React.FC<JobCoordinationChatModalProps> = ({
  isOpen,
  onClose,
  booking,
  initialRole = 'customer'
}) => {
  const { lang, workers } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeakingMessageId, setIsSpeakingMessageId] = useState<string | null>(null);
  const [showQuickChips, setShowQuickChips] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // activeRole is determined strictly by initialRole (portal context)
  const activeRole: 'customer' | 'worker' = initialRole === 'worker' ? 'worker' : 'customer';

  // Find worker details for this booking
  const assignedWorker: Worker | undefined = workers.find(
    (w) => w.id === booking?.workerId || w.name === booking?.workerName
  );

  const { user } = useAuth();
  const customerName = (user?.role === 'customer' ? user.name : booking?.customerName) || user?.name || booking?.customerName || 'Customer';
  const workerName = assignedWorker?.name || booking?.workerName || 'Murugan Thangaraj';
  const workerPhone = assignedWorker?.phone || booking?.workerPhone || '+91 98412 34567';
  const customerPhone = booking?.customerPhone || user?.phone || '+91 94432 67890';

  // Customer photo priority: user avatar (if customer) -> booking customerPhoto -> default unsplash avatar
  const customerPhoto = (user?.role === 'customer' && user?.avatar)
    || (booking as any)?.customerPhoto 
    || user?.avatar 
    || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

  // Worker photo priority: assignedWorker photoUrl -> booking workerPhoto -> default unsplash worker photo
  const workerPhoto = assignedWorker?.photoUrl 
    || booking?.workerPhoto 
    || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';

  // Person the current user is chatting with in this modal:
  // If activeRole === 'customer', chatting with Worker (Murugan Thangaraj)
  // If activeRole === 'worker', chatting with Customer (Subanthar)
  const isCustomerPortalView = activeRole === 'customer';
  const otherPartyName = isCustomerPortalView ? workerName : customerName;
  const otherPartyPhone = isCustomerPortalView ? workerPhone : customerPhone;
  const otherPartyPhoto = isCustomerPortalView ? workerPhoto : customerPhoto;

  // Load messages for this booking
  const loadMessages = async () => {
    if (!booking) return;
    try {
      const chatList = chatService.getMessages(booking.id, workerName, customerName);
      setMessages(chatList);
      await apiService.markMessagesAsRead(booking.id, activeRole);
    } catch (err) {
      console.error('Error loading chat messages:', err);
    }
  };

  // Initial load and subscriptions
  useEffect(() => {
    if (!isOpen || !booking) return;

    loadMessages();

    // Subscribe to in-memory real-time hub
    const unsubscribeMessage = realtimeHub.subscribe('sahakari:message_sent', (newMsg: ChatMessage) => {
      if (newMsg.bookingId === booking.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        // Play gentle incoming sound if sent by the other party
        if (newMsg.senderRole !== activeRole) {
          soundAndSpeech.playChime('alert');
        }
        apiService.markMessagesAsRead(booking.id, activeRole);
      }
    });

    const unsubscribeRead = realtimeHub.subscribe('sahakari:messages_read', (data: { bookingId: string }) => {
      if (data.bookingId === booking.id) {
        setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      }
    });

    // Cross-tab broadcast channel listener
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        broadcastChannel = new BroadcastChannel('sahakari_chat_channel');
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'NEW_MESSAGE' && event.data.payload?.bookingId === booking.id) {
            const incoming = event.data.payload as ChatMessage;
            setMessages((prev) => {
              if (prev.some((m) => m.id === incoming.id)) return prev;
              return [...prev, incoming];
            });
          }
        };
      }
    } catch {
      // Broadcast fallback
    }

    return () => {
      unsubscribeMessage();
      unsubscribeRead();
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, [isOpen, booking?.id, activeRole]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Quick Action Chips
  const customerQuickChips = [
    { label: '📍 Flat & Gate Details', text: 'Please take the elevator to 2nd floor, Apt 2B. Ring 2B bell.' },
    { label: '⏱️ What is your ETA?', text: 'Hi! Could you share your estimated arrival time?' },
    { label: '🚗 Visitor Parking', text: 'You can park your vehicle inside the visitor parking lot near tower entrance.' },
    { label: '📞 Call at Security Gate', text: 'Security needs your name at main gate, please call when you reach.' },
    { label: '🛠️ Spare Parts / Tools', text: 'Do you need any additional ladders, water, or specific materials?' }
  ];

  const workerQuickChips = [
    { label: '🚗 On My Way (10 mins)', text: 'I am on the way! Estimated arrival time is 10 to 15 minutes.' },
    { label: '📍 Arrived at Site', text: 'Vanakkam! I have arrived at your building main entrance gate.' },
    { label: '🔍 Inspecting Issue', text: 'I have started diagnosing the repair and inspecting the wiring.' },
    { label: '📦 Buying Spare Part', text: 'Need a replacement switch/valve. Purchasing genuine part from nearby hardware store.' },
    { label: '✅ Work Completed', text: 'The repair work is complete and tested. Ready for your inspection!' }
  ];

  const handleSendMessage = async (textToSend?: string, quickType?: any) => {
    const text = (textToSend || inputText).trim();
    if (!text || !booking) return;

    const senderRole = activeRole;
    const senderName = activeRole === 'customer' ? customerName : workerName;
    const senderId = activeRole === 'customer' ? (user?.id || booking.customerId || 'cust-demo-1') : (assignedWorker?.id || 'worker-1');

    setInputText('');

    try {
      soundAndSpeech.playChime('click');
      await apiService.sendMessage({
        bookingId: booking.id,
        senderId,
        senderName,
        senderRole,
        text,
        quickReplyType: quickType || 'general'
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Simulate automated friendly response from the other party
  const handleSimulateReply = () => {
    if (!booking) return;
    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);
      const isReplyingAsWorker = activeRole === 'customer';
      const senderRole = isReplyingAsWorker ? 'worker' : 'customer';
      const senderName = isReplyingAsWorker ? workerName : customerName;
      const senderId = isReplyingAsWorker ? (assignedWorker?.id || 'worker-1') : (booking.customerId || 'cust-demo-1');

      const sampleWorkerReplies = [
        'Vanakkam! Received your instructions. I am just 2 minutes away from your street.',
        'Noted! I have the required safety tools and cooperative ID badge with me.',
        'Everything is checked and working smoothly now! Please inspect the repair.'
      ];

      const sampleCustomerReplies = [
        'Thank you! The front door is open, please come right in.',
        'Great, thanks for the update. Let me know if you need an extension cord.',
        'Awesome! The repair looks very clean. Thank you for the quick work.'
      ];

      const replies = isReplyingAsWorker ? sampleWorkerReplies : sampleCustomerReplies;
      const randomText = replies[Math.floor(Math.random() * replies.length)];

      await apiService.sendMessage({
        bookingId: booking.id,
        senderId,
        senderName,
        senderRole,
        text: randomText,
        quickReplyType: 'general'
      });
    }, 1200);
  };

  // Speech Recognition (Dictate)
  const toggleSpeechRecognition = () => {
    if (isListeningSpeech) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningSpeech(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListeningSpeech(true);
        soundAndSpeech.playChime('toggle');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListeningSpeech(false);
      };

      recognition.onerror = () => {
        setIsListeningSpeech(false);
      };

      recognition.onend = () => {
        setIsListeningSpeech(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListeningSpeech(false);
    }
  };

  // Read message aloud via Web Speech
  const handleSpeakMessage = (msg: ChatMessage) => {
    if (isSpeakingMessageId === msg.id) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingMessageId(null);
      return;
    }

    setIsSpeakingMessageId(msg.id);
    soundAndSpeech.speak(msg.text, lang || 'en');
    setTimeout(() => {
      setIsSpeakingMessageId(null);
    }, Math.min(msg.text.length * 100, 6000));
  };

  if (!isOpen || !booking) return null;

  const currentChips = activeRole === 'customer' ? customerQuickChips : workerQuickChips;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl h-[92vh] max-h-[780px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/90 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-slate-900 text-white px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            {/* Clean Circular Avatar */}
            <div className="relative inline-flex shrink-0">
              <img 
                src={otherPartyPhoto} 
                alt={otherPartyName} 
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = isCustomerPortalView
                    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
                    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                }}
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-xs"></span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                  {otherPartyName}
                </h3>
                {isCustomerPortalView ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span>👷</span>
                    <span>{assignedWorker?.primarySkillLabel || 'Verified Worker'}</span>
                    <span className="text-amber-300 font-bold ml-1 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                      {assignedWorker?.rating || 4.9}
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <span>👤</span>
                    <span>Customer</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mt-1">
                <span className="text-emerald-400 font-semibold">{booking.serviceName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-mono bg-slate-800/90 px-2 py-0.5 rounded-md text-[11px]">
                  #{booking.bookingCode || booking.bookingReference || booking.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Call Shortcut */}
            <a
              href={`tel:${otherPartyPhone}`}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95 shrink-0"
              title={`Call ${otherPartyName}`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call {isCustomerPortalView ? 'Worker' : 'Customer'}</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer shrink-0"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOCATION & REACTION BAR */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 py-2 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate max-w-[260px] sm:max-w-[420px] text-slate-200 text-[11px]">
              {typeof booking.address === 'string' ? booking.address : `${booking.address?.street || ''}, ${booking.address?.area || ''}`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSimulateReply}
            className="text-emerald-400 hover:text-emerald-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0 ml-2 active:scale-95 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700"
            title="Simulate quick reply for testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Reply</span>
          </button>
        </div>

        {/* SECURITY PROTOCOL NOTICE */}
        <div className="bg-blue-50/80 border-b border-blue-100 px-4 py-1.5 flex items-center justify-between text-[11px] text-blue-900 shrink-0">
          <div className="flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Cooperative Safe Channel: Direct end-to-end dispatch & fair wage logging.</span>
          </div>
        </div>

        {/* MESSAGES SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
          <div className="text-center my-1">
            <span className="px-3 py-1 bg-slate-200/80 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider border border-slate-300/60">
              Today • Direct Coordination
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Info className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">No messages yet for this service</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Send arrival updates, gate security entry instructions, or clarify spare part requirements below.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderRole === activeRole;
              const isSpeaking = isSpeakingMessageId === msg.id;

              const isCustomerMsg = msg.senderRole === 'customer';
              const displaySenderName = isCustomerMsg ? customerName : workerName;
              const displaySenderPhoto = isCustomerMsg ? customerPhoto : workerPhoto;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-200`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 px-1 font-semibold">
                    <span>{isMe ? 'You' : displaySenderName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({isCustomerMsg ? 'Customer' : 'Worker'})
                    </span>
                  </div>

                  <div className={`flex items-end gap-2 max-w-[88%] sm:max-w-[78%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img
                      src={displaySenderPhoto}
                      alt={displaySenderName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs mb-0.5"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = isCustomerMsg
                          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
                      }}
                    />

                    <div
                      className={`px-4 py-2.5 rounded-2xl shadow-xs text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap wrap-break-word font-normal">{msg.text}</p>
                      
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isMe ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          <span>
                            {msg.read ? (
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-300 inline" />
                            ) : (
                              <Check className="w-3.5 h-3.5 inline" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Listen Audio Button for messages */}
                    <button
                      type="button"
                      onClick={() => handleSpeakMessage(msg)}
                      className={`p-1.5 rounded-full border transition cursor-pointer mb-0.5 shrink-0 ${
                        isSpeaking 
                          ? 'bg-blue-600 text-white border-blue-600 animate-pulse' 
                          : 'bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-slate-200 shadow-2xs'
                      }`}
                      title="Listen to message (Text to Speech)"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-xs py-1 animate-in fade-in">
              <img
                src={otherPartyPhoto}
                alt={otherPartyName}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-slate-600 font-semibold ml-1">
                  {otherPartyName} is typing...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK COORDINATION CHIPS TRAY */}
        <div className="bg-white border-t border-slate-200/80 px-4 py-2.5 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Tap Quick Coordination ({isCustomerPortalView ? 'Customer phrases' : 'Worker phrases'}):
            </span>
            <button
              type="button"
              onClick={() => setShowQuickChips(!showQuickChips)}
              className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer"
            >
              {showQuickChips ? 'Hide' : 'Show All'}
            </button>
          </div>

          {showQuickChips && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {currentChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip.text, 'general')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer active:scale-95 border border-slate-200 hover:border-blue-300 flex items-center gap-1"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MESSAGE INPUT BAR */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-white border-t border-slate-200 px-4 py-3 sm:px-5 flex items-center gap-2.5 shrink-0"
        >
          {/* Voice Dictate Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl transition cursor-pointer border ${
              isListeningSpeech 
                ? 'bg-red-500 text-white border-red-600 animate-pulse ring-2 ring-red-200' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title={isListeningSpeech ? 'Listening... click to stop' : 'Click to dictate message by voice'}
          >
            {isListeningSpeech ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListeningSpeech 
                ? 'Listening to your voice...' 
                : isCustomerPortalView 
                  ? 'Ask worker about ETA, gate access, parking...' 
                  : 'Update customer on arrival, spare parts...'
            }
            className="flex-1 bg-slate-100 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden transition shadow-2xs"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 ${
              inputText.trim()
                ? isCustomerPortalView
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
