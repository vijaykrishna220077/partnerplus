import { LanguageCode } from '../types';

export type SpeechEventListener = (isSpeaking: boolean, text?: string) => void;

class SoundAndSpeechService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentLanguage: LanguageCode = 'en';
  private currentlySpeakingText: string | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private listeners: SpeechEventListener[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  public subscribe(listener: SpeechEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(isSpeaking: boolean, text?: string): void {
    this.currentlySpeakingText = isSpeaking && text ? text : null;
    this.listeners.forEach(cb => {
      try {
        cb(isSpeaking, text);
      } catch (e) {
        console.error('Error notifying speech listener:', e);
      }
    });
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Play synthetic pleasant audio chime using Web Audio API
   */
  public playChime(type: 'alert' | 'accept' | 'complete' | 'click' | 'toggle'): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'alert') {
        [0, 0.2].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now + offset);
          osc.frequency.exponentialRampToValueAtTime(1320, now + offset + 0.15);
          gain.gain.setValueAtTime(0.3, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.25);
        });
      } else if (type === 'accept') {
        [
          { freq: 523.25, time: 0 },
          { freq: 659.25, time: 0.1 },
          { freq: 783.99, time: 0.2 }
        ].forEach((note) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.freq, now + note.time);
          gain.gain.setValueAtTime(0.25, now + note.time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + note.time);
          osc.stop(now + note.time + 0.25);
        });
      } else if (type === 'complete') {
        [
          { freq: 523.25, time: 0 },
          { freq: 783.99, time: 0.12 },
          { freq: 1046.5, time: 0.24 }
        ].forEach((note) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.freq, now + note.time);
          gain.gain.setValueAtTime(0.3, now + note.time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + note.time);
          osc.stop(now + note.time + 0.4);
        });
      } else if (type === 'toggle') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  /**
   * Find the highest quality voice for a given BCP 47 language code
   */
  public getBestVoiceForLanguage(langCode: string): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const target = langCode.toLowerCase();
    const primary = target.split('-')[0];

    let bestVoice: SpeechSynthesisVoice | null = null;
    let maxScore = -1;

    for (const voice of this.voices) {
      const voiceLang = voice.lang.toLowerCase();
      const voiceName = voice.name.toLowerCase();
      let score = 0;

      // Match level
      if (voiceLang === target) {
        score += 100;
      } else if (voiceLang.startsWith(primary)) {
        score += 60;
      }

      if (score === 0) continue;

      // Quality bonuses for premium voice engines
      if (voiceName.includes('google')) score += 30;
      if (voiceName.includes('natural') || voiceName.includes('neural') || voiceName.includes('premium')) score += 25;
      if (voiceName.includes('veena') || voiceName.includes('lekha') || voiceName.includes('valluvar') || voiceName.includes('rishi') || voiceName.includes('samantha')) score += 20;
      if (voice.localService) score += 10;

      if (score > maxScore) {
        maxScore = score;
        bestVoice = voice;
      }
    }

    return bestVoice;
  }

  /**
   * Map App LanguageCode to BCP 47 Locale Code
   */
  public getBCP47LangCode(lang: LanguageCode | string): string {
    const l = lang.toLowerCase();
    if (l.startsWith('ta')) return 'ta-IN';
    if (l.startsWith('hi')) return 'hi-IN';
    if (l.startsWith('kn')) return 'kn-IN';
    if (l.startsWith('te')) return 'te-IN';
    if (l.startsWith('bn')) return 'bn-IN';
    if (l.startsWith('mr')) return 'mr-IN';
    return 'en-IN';
  }

  /**
   * Primary Speak method: Synthesizes voice in the requested language
   */
  public speak(text: string, lang?: LanguageCode | string): void {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported on this device');
      return;
    }

    const effectiveLang = lang || this.currentLanguage;
    const bcp47 = this.getBCP47LangCode(effectiveLang);

    try {
      window.speechSynthesis.cancel(); // Cancel any active speech utterance

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Friendly, clear speech speed
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = bcp47;

      const voice = this.getBestVoiceForLanguage(bcp47);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        this.notifyListeners(true, text);
      };

      utterance.onend = () => {
        this.notifyListeners(false);
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        this.notifyListeners(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis execution failure:', err);
      this.notifyListeners(false);
    }
  }

  /**
   * Update current language and automatically announce the language switch in the new language!
   */
  public setLanguage(newLang: LanguageCode, announce: boolean = true): void {
    this.currentLanguage = newLang;

    if (!announce || this.isMuted) return;

    const announcements: Record<LanguageCode, string> = {
      ta: 'பார்ட்னர் பிளஸ் தமிழ் குரல் உதவி தயார்.',
      hi: 'पार्टनरप्लस हिंदी वॉयस असिस्टेंट सक्रिय है।',
      kn: 'ಪಾರ್ಟ್ನರ್ ಪ್ಲಸ್ ಕನ್ನಡ ಧ್ವನಿ ಸಹಾಯಕ ಸಕ್ರಿಯವಾಗಿದೆ.',
      te: 'పార్ట్నర్ ప్లస్ తెలుగు వాయిస్ అసిస్టెంట్ సక్రియంగా ఉంది.',
      bn: 'পার্টনারপ্লাস বাংলা ভয়েস সহায়তা সক্রিয়।',
      mr: 'पार्टनरप्लस मराठी व्हॉइस सहाय्यक सक्रिय आहे.',
      en: 'PartnerPlus voice assistance active in English.'
    };

    const textToSpeak = announcements[newLang] || announcements.en;
    this.speak(textToSpeak, newLang);
  }

  public getActiveLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  public isCurrentlySpeaking(): boolean {
    return this.currentlySpeakingText !== null;
  }

  public getCurrentlySpeakingText(): string | null {
    return this.currentlySpeakingText;
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notifyListeners(false);
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopSpeaking();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const soundAndSpeech = new SoundAndSpeechService();
