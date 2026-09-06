import React, { useState } from 'react';
import { X, Phone, Copy, Check, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface PhoneCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneCallModal: React.FC<PhoneCallModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const phoneNumber = '214-550-5563';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#0A1226] text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-12 h-12 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] flex items-center justify-center mx-auto mb-2">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black font-display text-white">Direct Commercial Line</h3>
          <p className="text-xs text-gray-300 mt-0.5">Partner Plus Commercial Exterior Dispatch</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Phone Display */}
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-100 text-center">
            <span className="text-xs uppercase tracking-wider font-bold text-blue-600">Operations Phone</span>
            <div className="text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 font-display">
              {phoneNumber}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Available 24/7 for Commercial Inquiries & Quotes</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${phoneNumber.replace(/-/g, '')}`}
              className="py-2.5 bg-[#1D68ED] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Number'}</span>
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00D2FF] shrink-0" />
              <span>Dispatch response within 15 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>EPA Compliant & $2M Insured Operations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
