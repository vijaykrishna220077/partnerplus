import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { onboardingService } from '../../services/onboardingService';
import { mockCooperatives } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface CooperativeRegistrationProps {
  onBack: () => void;
  onSuccess: (requestId: string) => void;
}

export const CooperativeRegistration: React.FC<CooperativeRegistrationProps> = ({
  onBack,
  onSuccess
}) => {
  const { addToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 3;

  // Step 1: Cooperative Jurisdiction
  const [selectedCoopId, setSelectedCoopId] = useState<string>(mockCooperatives[0].id);
  const [cooperativeName, setCooperativeName] = useState<string>(mockCooperatives[0].name);
  const [registrationNumber, setRegistrationNumber] = useState<string>(mockCooperatives[0].registrationNumber);
  const [address, setAddress] = useState<string>('Labour Bhavan, Guindy Institutional Area');
  const [city, setCity] = useState<string>('Chennai');
  const [state, setState] = useState<string>('Tamil Nadu');
  const [postalCode, setPostalCode] = useState<string>('600032');

  // Step 2: Official Credentials
  const [contactPerson, setContactPerson] = useState<string>('T. Anbazhagan');
  const [designation, setDesignation] = useState<string>('Zonal Dispatch Inspector & Welfare Officer');
  const [officialEmail, setOfficialEmail] = useState<string>('anbazhagan.dispatch@chennailabourcoop.org');
  const [phone, setPhone] = useState<string>('+91 98409 66778');

  // Step 3: Requested Role & Clearance Rationale
  const [requestedRole, setRequestedRole] = useState<'COOPERATIVE_ADMIN' | 'COOPERATIVE_STAFF'>('COOPERATIVE_STAFF');
  const [reasonForAccess, setReasonForAccess] = useState<string>(
    'Appointed as Zonal Dispatch Inspector by Managing Committee Resolution #42. Requires terminal clearance for real-time artisan emergency dispatch and compliance audit.'
  );
  const [documentName, setDocumentName] = useState<string>('Managing_Committee_Appointment_Order_2026.pdf');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!cooperativeName.trim() || !registrationNumber.trim()) {
        setErrorMsg('Please select or specify the registered cooperative society.');
        return;
      }
    } else if (step === 2) {
      if (!contactPerson.trim() || !designation.trim() || !officialEmail.trim() || !phone.trim()) {
        setErrorMsg('All official staff identity details are required for security review.');
        return;
      }
      const dup = onboardingService.checkDuplicate(officialEmail, phone);
      if (dup.duplicate) {
        setErrorMsg(dup.message || 'Official email or phone already registered.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Register with requested role. System NEVER automatically elevates to admin!
      const res = await onboardingService.registerCooperativeOfficial({
        cooperativeName,
        registrationNumber,
        cooperativeAddress: address,
        city,
        state,
        postalCode,
        officialEmail,
        phone,
        contactPerson,
        designation,
        requestedRole,
        reasonForAccess,
        supportingDocuments: [documentName],
        cooperativeId: selectedCoopId
      });

      if (!res.success) {
        setLoading(false);
        setErrorMsg(res.message || 'Failed to submit clearance request.');
        return;
      }

      setLoading(false);
      addToast({
        type: 'info',
        title: 'Security Clearance Requested',
        message: 'Official credentials submitted for administrative approval.'
      });

      onSuccess(res.memberRequest?.id || 'req-1');
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An error occurred during submission.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
        <button
          type="button"
          onClick={() => {
            if (step > 1) {
              setStep(prev => prev - 1);
            } else {
              onBack();
            }
          }}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full">
            COOPERATIVE OFFICIAL ENROLLMENT
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Official Access Clearance Application
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-400">
            Step {step} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
        <div 
          className="bg-purple-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Security Disclaimer */}
      <div className="mb-5 p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
        <div>
          <strong className="block font-bold">Role-Based Security Protocol:</strong>
          Cooperative administrative terminals hold regulatory authority over dispatch and welfare funds. New registrations require sign-off by an authorized cooperative administrator before console access is granted.
        </div>
      </div>

      {/* STEP 1: Society Jurisdiction */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Registered Cooperative Society Jurisdiction
            </label>
            <select
              value={selectedCoopId}
              onChange={(e) => {
                const coop = mockCooperatives.find(c => c.id === e.target.value);
                if (coop) {
                  setSelectedCoopId(coop.id);
                  setCooperativeName(coop.name);
                  setRegistrationNumber(coop.registrationNumber);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
            >
              {mockCooperatives.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.registrationNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Society Name
              </label>
              <input
                type="text"
                value={cooperativeName}
                onChange={(e) => setCooperativeName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                State Registration Number
              </label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered Office Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <span>Next: Official Identity</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Official Identity Details */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Official Full Legal Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Official Designation / Capacity <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Staff Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-2/3 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Next: Clearance Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Clearance Request & Rationale */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Requested Access Level
            </label>
            <div className="space-y-2">
              <label className={`block p-3 rounded-2xl border-2 transition cursor-pointer ${
                requestedRole === 'COOPERATIVE_STAFF'
                  ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40'
                  : 'border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="req_role"
                    checked={requestedRole === 'COOPERATIVE_STAFF'}
                    onChange={() => setRequestedRole('COOPERATIVE_STAFF')}
                    className="mt-1 text-purple-600"
                  />
                  <div>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                      Cooperative Staff (Operations &amp; Dispatch Clearance)
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Manage emergency dispatches, artisan trade verifications, job tickets, and member inquiries.
                    </span>
                  </div>
                </div>
              </label>

              <label className={`block p-3 rounded-2xl border-2 transition cursor-pointer ${
                requestedRole === 'COOPERATIVE_ADMIN'
                  ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/40'
                  : 'border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="req_role"
                    checked={requestedRole === 'COOPERATIVE_ADMIN'}
                    onChange={() => setRequestedRole('COOPERATIVE_ADMIN')}
                    className="mt-1 text-purple-600"
                  />
                  <div>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                      Cooperative Administrator (Full Executive Governance)
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      Full administrative authority, escrow disbursement, official approval, and audit logs.
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Official Justification / Reason for Administrative Clearance <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={reasonForAccess}
              onChange={(e) => setReasonForAccess(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 space-y-1 text-xs">
            <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Supporting Credentials Attached:</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
              {documentName} (Encrypted society vault)
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting Clearance Request...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit for Administrator Approval</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
