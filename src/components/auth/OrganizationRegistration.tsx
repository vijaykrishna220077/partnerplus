import React, { useState } from 'react';
import { 
  Building, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  MapPin, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { onboardingService } from '../../services/onboardingService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { OrganizationType } from '../../types';

interface OrganizationRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const OrganizationRegistration: React.FC<OrganizationRegistrationProps> = ({
  onBack,
  onSuccess
}) => {
  const { signupOrganization } = useAuth();
  const { addToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 3;

  // Step 1: Company Profile
  const [organizationName, setOrganizationName] = useState<string>('L&T Integrated Facility Management');
  const [legalName, setLegalName] = useState<string>('Larsen & Toubro Facility Services Private Limited');
  const [orgType, setOrgType] = useState<OrganizationType>('private_limited');
  const [registrationNumber, setRegistrationNumber] = useState<string>('U74999TN2018PTC123456');
  const [gstNumber, setGstNumber] = useState<string>('33AAACL1234K1Z5');
  const [website, setWebsite] = useState<string>('https://facilities.lt.in');

  // Step 2: Authorized Representative & Contact
  const [contactPerson, setContactPerson] = useState<string>('Priya Narayanan');
  const [designation, setDesignation] = useState<string>('Vice President – Commercial Infrastructure & Procurement');
  const [email, setEmail] = useState<string>('priya.n@ltfacilities.co.in');
  const [phone, setPhone] = useState<string>('+91 98422 77110');

  // Step 3: Location, Scope & Compliance Docs
  const [address, setAddress] = useState<string>('Tower B, Mount Poonamallee Road, Manapakkam');
  const [city, setCity] = useState<string>('Chennai');
  const [state, setState] = useState<string>('Tamil Nadu');
  const [postalCode, setPostalCode] = useState<string>('600089');
  const [description, setDescription] = useState<string>('Commercial campus maintenance, HVAC plant operations, and rapid exterior wash for multi-acre commercial parks.');
  const [docName, setDocName] = useState<string>('GST_Incorporation_Certificate_2024.pdf');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!organizationName.trim() || !legalName.trim() || !registrationNumber.trim()) {
        setErrorMsg('Please provide the commercial company name, legal registered entity, and registration number.');
        return;
      }
    } else if (step === 2) {
      if (!contactPerson.trim() || !designation.trim() || !email.trim() || !phone.trim()) {
        setErrorMsg('Please provide all authorized representative contact details.');
        return;
      }
      const dup = onboardingService.checkDuplicate(email, phone);
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
      const res = await onboardingService.registerOrganization({
        organizationName,
        legalName,
        organizationType: orgType,
        registrationNumber,
        gstNumber,
        contactPerson,
        designation,
        phone,
        email,
        address,
        city,
        state,
        postalCode,
        website,
        description,
        supportingDocumentName: docName
      });

      if (!res.success) {
        setLoading(false);
        setErrorMsg(res.message || 'Company registration failed.');
        return;
      }

      // Also register via AuthContext
      await signupOrganization({
        name: organizationName,
        registeredName: legalName,
        type: orgType,
        registrationNumber,
        contactPerson,
        email,
        phone,
        address,
        city,
        serviceArea: `${city} Metro Zone`,
        description
      });

      setLoading(false);
      setIsSubmitted(true);

      addToast({
        type: 'success',
        title: 'Company Enrolled',
        message: 'Organization registered. Cooperative compliance verification is in progress.'
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An error occurred during organization signup.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border-2 border-amber-500 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800 inline-block">
            STATUS: PENDING_VERIFICATION
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Enterprise Account Registered!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-slate-900 dark:text-white">{contactPerson}</strong>. Your enterprise profile for <strong className="text-amber-600 dark:text-amber-400">{organizationName}</strong> has been submitted to the cooperative society.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
          <div className="font-bold text-slate-900 dark:text-white">Cooperative Compliance Verification Status:</div>
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Registration Profile &amp; CIN / ROC Submitted</span>
          </div>
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Cooperative Officer Document Verification (Expected: 4 Hours)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Unlimited Bulk Artisan Hiring &amp; Escrow Master Contract Unlocked</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onSuccess}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
        >
          <span>Enter Company Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

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
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
            COMPANY &amp; CONTRACTOR REGISTRATION
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Enterprise Workforce Portal
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
          className="bg-amber-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Company Profile */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Organization / Company Brand Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. L&T Integrated Facility Management"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Legal Registered Entity Name (as in ROC / MCA) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Organization Constitution Type
              </label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value as OrganizationType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              >
                <option value="private_limited">Private Limited Company (Pvt Ltd)</option>
                <option value="public_limited">Public Limited Company</option>
                <option value="llp">Limited Liability Partnership (LLP)</option>
                <option value="partnership">Registered Partnership Firm</option>
                <option value="proprietorship">Sole Proprietorship</option>
                <option value="government_psu">Government Department / PSU</option>
                <option value="cooperative_federation">Cooperative Federation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Corporate Registration No. (CIN / ROC / LLPIN) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                GSTIN / Tax Identification
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Company Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <span>Next: Authorized Contact Person</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Authorized Representative */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Authorized Representative Full Name <span className="text-rose-500">*</span>
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
              Corporate Designation / Role <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Corporate Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Phone / Direct Extension <span className="text-rose-500">*</span>
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
              className="w-2/3 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Next: Facility Address &amp; Scope</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Address, Description & Supporting Document */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Headquarters / Operating Campus Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">State</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PIN Code</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Scope of Workforce Needs / Operations
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-1 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Incorporation Certificate Uploaded</span>
            </span>
            <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
              {docName} (Verified 256-bit secure document vault)
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
              className="w-2/3 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting Company Account...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enroll Company &amp; Start Compliance</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
