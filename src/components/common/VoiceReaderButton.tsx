import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Square } from 'lucide-react';
import { soundAndSpeech } from '../../utils/soundAndSpeech';
import { LanguageCode } from '../../types';

interface VoiceReaderButtonProps {
  text: string;
  lang?: LanguageCode | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  className?: string;
}

export const VoiceReaderButton: React.FC<VoiceReaderButtonProps> = ({
  text,
  lang,
  label = 'Listen',
  size = 'md',
  variant = 'secondary',
  className = ''
}) => {
  const [isSpeakingThis, setIsSpeakingThis] = useState(false);

  useEffect(() => {
    const unsubscribe = soundAndSpeech.subscribe((isSpeaking, speakingText) => {
      setIsSpeakingThis(isSpeaking && speakingText === text);
    });
    return () => unsubscribe();
  }, [text]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeakingThis) {
      soundAndSpeech.stopSpeaking();
    } else {
      soundAndSpeech.speak(text, lang);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-[11px] gap-1',
    md: 'px-3 py-1.5 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm',
    secondary: 'bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200',
    ghost: 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium',
    icon: 'p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`relative transition cursor-pointer active:scale-95 flex items-center justify-center ${variantClasses.icon} ${className}`}
        title={isSpeakingThis ? 'Stop voice readout' : 'Listen in your language'}
      >
        {isSpeakingThis ? (
          <Square className="w-4 h-4 fill-blue-600 text-blue-600 animate-pulse" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-xl transition cursor-pointer active:scale-95 inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${variantClasses[variant]} ${isSpeakingThis ? 'ring-2 ring-blue-500 ring-offset-1' : ''} ${className}`}
      title={isSpeakingThis ? 'Click to stop reading' : 'Listen in your language'}
    >
      {isSpeakingThis ? (
        <>
          {/* Animated sound wave bars */}
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
