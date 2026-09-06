import React from 'react';
import { 
  ShieldCheck, 
  Power, 
  Zap, 
  ArrowRight, 
  PanelLeft, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Users,
  MessageSquare,
  MapPin
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { useApp } from '../../context/AppContext';
import { PartnerPlusLogo } from '../PartnerPlusLogo';

interface WorkerHeaderProps {
  workerName: string;
  coopId: string;
  isOnline: boolean;
  isEmergencyReady: boolean;
  isSimpleMode: boolean;
  isAudioEnabled: boolean;
  selectedLang: string;
  onToggleDuty: () => void;
  onToggleEmergency: () => void;
  onToggleSimpleMode: () => void;
  onToggleAudio: () => void;
  onChangeLanguage: (code: LanguageCode) => void;
  onToggleSidebar: () => void;
  onSwitchToCustomer: () => void;
  onOpenDemoDrawer: () => void;
  onOpenChat?: () => void;
  unreadChatCount?: number;
}

export const WorkerHeader: React.FC<WorkerHeaderProps> = ({
  workerName,
  coopId,
  isOnline,
  isEmergencyReady,
  isSimpleMode,
  isAudioEnabled,
  selectedLang,
  onToggleDuty,
  onToggleEmergency,
  onToggleSimpleMode,
  onToggleAudio,
  onChangeLanguage,
  onToggleSidebar,
  onSwitchToCustomer,
  onOpenDemoDrawer,
  onOpenChat,
  unreadChatCount
}) => {
  const { currentLocation, openLocationPicker } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Branding & Main Controls Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Sidebar Menu + Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 sm:px-3 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer border border-gray-200/80 active:scale-95"
              title="Open Navigation Menu"
            >
              <PanelLeft className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">Menu</span>
            </button>

            <div className="flex items-center gap-2 select-none">
              <PartnerPlusLogo />
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Worker Portal</span>
              </span>
            </div>
          </div>

          {/* Right: Quick Controls & Switch Mode */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Simple Mode Toggle */}
            <button
              onClick={onToggleSimpleMode}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 border cursor-pointer active:scale-95 ${
                isSimpleMode 
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
              }`}
              title="Simple Mode for Low-Literacy / Easy Touch"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">{isSimpleMode ? 'Simple Mode (ON)' : 'Simple Mode'}</span>
              <span className="sm:hidden">{isSimpleMode ? 'Simple: ON' : 'Simple'}</span>
            </button>

            {/* Audio Readout Switch */}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer active:scale-95 ${
                isAudioEnabled 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-gray-50 text-gray-400 border-gray-200'
              }`}
              title={isAudioEnabled ? 'Voice Guidance Active' : 'Voice Guidance Muted'}
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>

            {/* Real-time Job Chat */}
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="relative px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Open Real-time Job Chat with Customer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Job Chat</span>
                {unreadChatCount !== undefined && unreadChatCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center -ml-0.5 animate-pulse">
                    {unreadChatCount}
                  </span>
                )}
              </button>
            )}

            {/* SIH Demo Drawer Pill (Clean & Non-Intrusive) */}
            <button
              onClick={onOpenDemoDrawer}
              className="px-2.5 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-xl border border-slate-700 transition flex items-center gap-1 cursor-pointer active:scale-95"
              title="SIH 2026 Presentation Simulation Controls"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="hidden sm:inline">SIH Showcase</span>
              <span className="sm:hidden">Demo</span>
            </button>

            {/* Switch to Customer Button */}
            <button
              onClick={onSwitchToCustomer}
              className="px-2.5 sm:px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Switch to Customer Mode"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Customer Mode</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Sub-Bar: Greeting, Availability Giant Toggle & Emergency Switch */}
        <div className="py-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          {/* Worker Identity */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-xl font-bold text-emerald-800">
                👷
              </div>
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  isOnline ? 'bg-emerald-500' : 'bg-gray-400'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium">Welcome,</span>
                <span className="text-sm sm:text-base font-black text-gray-900">{workerName}</span>
                <span className="inline-flex items-center text-emerald-600" title="Cooperative Verified Member">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-[11px] text-gray-500 font-semibold flex items-center gap-1.5 flex-wrap">
                <span>{coopId}</span>
                <span>•</span>
                <span className={isOnline ? 'text-emerald-600 font-bold' : 'text-gray-500'}>
                  {isOnline ? 'Receiving Nearby Jobs' : 'Job Offers Paused'}
                </span>
                <span>•</span>
                {/* Worker Location Option Button */}
                <button
                  type="button"
                  onClick={openLocationPicker}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-bold transition cursor-pointer"
                  title="Click to view or change your active operating location / GPS"
                >
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span className="truncate max-w-[120px]">{currentLocation || 'Peelamedu, Coimbatore'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Availability Toggles: Primary + Emergency */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Emergency Toggle Pill */}
            <button
              onClick={onToggleEmergency}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition cursor-pointer active:scale-95 ${
                isEmergencyReady 
                  ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-200' 
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
              }`}
              title="Ready for urgent 15-minute emergency jobs near you"
            >
              <Zap className={`w-3.5 h-3.5 ${isEmergencyReady ? 'text-red-600 fill-red-600 animate-pulse' : 'text-gray-400'}`} />
              <span>{isEmergencyReady ? 'Emergency: ON' : 'Emergency: OFF'}</span>
            </button>

            {/* Giant Duty Availability Toggle */}
            <button
              onClick={onToggleDuty}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isOnline
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                  : 'bg-gray-800 hover:bg-gray-900 text-gray-200'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isOnline ? 'AVAILABLE FOR WORK' : 'NOT AVAILABLE'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
