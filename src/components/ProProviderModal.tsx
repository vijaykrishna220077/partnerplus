import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, Sparkles, Wrench, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProProviderModal: React.FC<ProProviderModalProps> = ({ isOpen, onClose }) => {
  const [contractorName, setContractorName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Dallas-Fort Worth, TX');
  const [hasHotWaterSkid, setHasHotWaterSkid] = useState(true);
  const [hasWaterRecovery, setHasWaterRecovery] = useState(true);
  const [hasInsurance, setHasInsurance] = useState(true);
  const [yearsExperience, setYearsExperience] = useState('5+ years');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 my-6">
        {/* Header with cyan branding */}
        <div className="bg-[#0A1226] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Commercial Contractor Network</span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-white">
            Join The Pro Providers
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Partner with Partner Plus Exterior Cleaning. Guaranteed commercial accounts, fair high-volume pay, and zero marketing spend.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#00D2FF]/20 text-[#0088CC] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black text-[#0F172A]">Application Submitted!</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
              Welcome aboard, <span className="font-bold text-gray-900">{contractorName || 'Provider Partner'}</span>. Our Partner Plus Onboarding Director in <span className="font-bold text-[#1D68ED]">{city}</span> will review your equipment verification within 24 hours.
            </p>
            <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-cyan-900 text-left space-y-1.5">
              <div className="font-bold text-sm text-[#0077B6]">What happens next:</div>
              <div>1. Quick phone verification of hot water pressure rig & liability certificate.</div>
              <div>2. Portal credentials activation for dispatch & job routing.</div>
              <div>3. First commercial property batch assigned.</div>
            </div>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="px-6 py-2.5 bg-black text-white font-bold rounded-xl text-sm hover:bg-neutral-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700">Contractor / Contact Name *</label>
                <input
                  type="text"
                  required
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full mt-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D2FF]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Company / Business Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Vance Exterior Pros LLC"
                  className="w-full mt-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D2FF]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Direct Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="214-550-5563"
                  className="w-full mt-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D2FF]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Primary Metropolitan Hub</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00D2FF] bg-white"
                >
                  <option value="Dallas-Fort Worth, TX">Dallas-Fort Worth, TX</option>
                  <option value="Houston, TX">Houston, TX</option>
                  <option value="Austin, TX">Austin, TX</option>
                  <option value="San Antonio, TX">San Antonio, TX</option>
                  <option value="Los Angeles, CA">Los Angeles, CA</option>
                  <option value="New York, NY">New York, NY</option>
                </select>
              </div>
            </div>

            {/* Equipment & Rig Verification */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Equipment & Compliance Verification
              </div>
              <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasHotWaterSkid}
                  onChange={(e) => setHasHotWaterSkid(e.target.checked)}
                  className="rounded text-[#00D2FF] focus:ring-[#00D2FF] w-4 h-4"
                />
                <span>Hot Water Pressure Skid (3500+ PSI / 5+ GPM)</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasWaterRecovery}
                  onChange={(e) => setHasWaterRecovery(e.target.checked)}
                  className="rounded text-[#00D2FF] focus:ring-[#00D2FF] w-4 h-4"
                />
                <span>EPA Compliant Vacuum Berm / Water Recovery Berm</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInsurance}
                  onChange={(e) => setHasInsurance(e.target.checked)}
                  className="rounded text-[#00D2FF] focus:ring-[#00D2FF] w-4 h-4"
                />
                <span>Active Commercial General Liability Insurance ($1M - $2M)</span>
              </label>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#00D2FF] hover:bg-[#33EBFF] text-black font-extrabold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Submit Pro Provider Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
