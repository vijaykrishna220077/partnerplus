import React, { useState, useEffect } from 'react';
import { Volume2, Square, X, Sparkles } from 'lucide-react';
import { soundAndSpeech } from '../../utils/soundAndSpeech';

export const VoiceAssistantBanner: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState<string>('');

  useEffect(() => {
    const unsubscribe = soundAndSpeech.subscribe((speaking, text) => {
      setIsSpeaking(speaking);
      if (text) setSpokenText(text);
    });
    return () => unsubscribe();
  }, []);

  if (!isSpeaking) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-inner">
          <Volume2 className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
            <span>Voice Assistant Active</span>
          </div>
          <p className="text-xs text-slate-200 truncate font-medium mt-0.5">
            &quot;{spokenText}&quot;
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => soundAndSpeech.stopSpeaking()}
          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
          title="Stop Speech"
        >
          <Square className="w-3 h-3 fill-white" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
};
