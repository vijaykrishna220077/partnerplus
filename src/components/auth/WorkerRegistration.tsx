import React, { useState } from 'react';
import { 
  HardHat, 
  User, 
  Phone, 
  Mail,
  MapPin, 
  Award, 
  Calendar, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  FileText, 
  Upload,
  Info,
  Check
} from 'lucide-react';
import { ProfilePhotoUploader } from '../common/ProfilePhotoUploader';
import { onboardingService } from '../../services/onboardingService';
import { mockCooperatives } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface WorkerRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AVAILABLE_TRADES = [
  { id: 'electrical', name: 'Electrician (Domestic & Commercial)' },
  { id: 'plumbing', name: 'Plumber & Pipe Fitter' },
  { id: 'carpentry', name: 'Carpenter & Furniture Fabricator' },
  { id: 'painting', name: 'Painter & Surface Finisher' },
  { id: 'masonry', name: 'Mason & Tile Layer' },
  { id: 'appliance', name: 'Appliance & HVAC Repair Technician' },
  { id: 'cleaning', name: 'Deep Exterior Cleaning & Power Washer' },
  { id: 'housekeeping', name: 'Facility Care & Sanitization' },
  { id: 'gardening', name: 'Gardener & Landscape Maintenance' }
];

const GENERAL_TASKS = [
  'Material Handling & Logistics',
  'Construction Site Helper',
  'Agricultural & Farm Assistance',
  'Warehouse Loading & Stacking',
  'Event Setup & Site Cleanup'
];

export const WorkerRegistration: React.FC<WorkerRegistrationProps> = ({
  onBack,
  onSuccess
}) => {
  const { loginWithCredentials, switchRole } = useAuth();
  const { addToast, setRole, refreshData } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Step 1: Personal Details
  const [fullName, setFullName] = useState<string>('Murugan Shanmugam');
  const [phone, setPhone] = useState<string>('+91 98412 34567');
  const [email, setEmail] = useState<string>('murugan.artisan@partnerplus.org');
  const [dob, setDob] = useState<string>('1988-06-15');
  const [gender, setGender] = useState<string>('Male');
  const [address, setAddress] = useState<string>('12, Bharathiyar Street, Guindy Industrial Estate');
  const [city, setCity] = useState<string>('Chennai');
  const [state, setState] = useState<string>('Tamil Nadu');
  const [postalCode, setPostalCode] = useState<string>('600032');
  const [preferredLanguage, setPreferredLanguage] = useState<string>('ta');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('');

  // Step 2: Classification
  const [workerType, setWorkerType] = useState<'skilled' | 'semi_skilled' | 'general'>('skilled');

  // Step 3: Skills (Primary + Additional)
  const [primaryTradeId, setPrimaryTradeId] = useState<string>('electrical');
  const [primaryExperienceYears, setPrimaryExperienceYears] = useState<number>(8);
  const [primarySkillLevel, setPrimarySkillLevel] = useState<'beginner' | 'intermediate' | 'expert'>('expert');

  const [additionalSkills, setAdditionalSkills] = useState<Array<{
    id: string;
    name: string;
    years: number;
    level: 'beginner' | 'intermediate' | 'expert';
  }>>([
    { id: 'plumbing', name: 'Plumber & Pipe Fitter', years: 4, level: 'intermediate' }
  ]);

  const [generalTaskSelection, setGeneralTaskSelection] = useState<string[]>([
    'Material Handling & Logistics',
    'Construction Site Helper'
  ]);

  // Step 4: Certifications & Identity Documents
  const [certTitle, setCertTitle] = useState<string>('Govt Electrical ' + 'B-Grade Wireman License');
  const [certIssuer, setCertIssuer] = useState<string>('Tamil Nadu Electrical Licensing Board');
  const [certYear, setCertYear] = useState<string>('2022');
  const [idDocType, setIdDocType] = useState<string>('Aadhaar Card');
  const [idDocNumber, setIdDocNumber] = useState<string>('XXXX-XXXX-8921');
  const [idDocFileName, setIdDocFileName] = useState<string>('Aadhaar_Front_Back_Scanned.pdf');
  const [selectedCooperativeId, setSelectedCooperativeId] = useState<string>(mockCooperatives[0].id);

  // Step 5: Availability & Location Consent
  const [workingDays, setWorkingDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('18:00');
  const [emergencyAvailable, setEmergencyAvailable] = useState<boolean>(true);
  const [serviceRadiusKm, setServiceRadiusKm] = useState<number>(12);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean>(true);
  const [locationWarning, setLocationWarning] = useState<string>('');

  // Step 6: Payout & Bank Details
  const [payoutMethod, setPayoutMethod] = useState<'bank_account' | 'upi' | 'cooperative_passbook'>('upi');
  const [payoutIdentifier, setPayoutIdentifier] = useState<string>('murugan.artisan@oksbi');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submissionComplete, setSubmissionComplete] = useState<boolean>(false);
  const [registeredWorkerId, setRegisteredWorkerId] = useState<string>('');

  // Handle Location Permission Request
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationPermissionGranted(true);
          setLocationWarning('');
          addToast({
            type: 'success',
            title: 'GPS Location Enabled',
            message: `Accurate coordinates detected (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}) for job dispatch.`
          });
        },
        (err) => {
          setLocationPermissionGranted(false);
          setLocationWarning('Location permission was denied. Don\'t worry—dispatch will use your designated postal PIN code and locality instead.');
        }
      );
    } else {
      setLocationPermissionGranted(false);
      setLocationWarning('Geolocation is not supported by your browser. Dispatch will use your postal PIN code.');
    }
  };

  // Add another skill
  const handleAddSkill = () => {
    const unselectedTrade = AVAILABLE_TRADES.find(
      t => t.id !== primaryTradeId && !additionalSkills.some(s => s.id === t.id)
    ) || AVAILABLE_TRADES[1];

    setAdditionalSkills([
      ...additionalSkills,
      {
        id: unselectedTrade.id,
        name: unselectedTrade.name,
        years: 2,
        level: 'intermediate'
      }
    ]);
  };

  const handleRemoveSkill = (index: number) => {
    setAdditionalSkills(additionalSkills.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
        setErrorMsg('Please complete all required fields (Name, Phone, Email, and Address).');
        return;
      }
      const dup = onboardingService.checkDuplicate(email || '', phone);
      if (dup.duplicate) {
        setErrorMsg(dup.message || 'Phone number or email already registered.');
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
      const primaryTradeObj = AVAILABLE_TRADES.find(t => t.id === primaryTradeId) || AVAILABLE_TRADES[0];

      const res = await onboardingService.registerWorker({
        fullName,
        phone,
        email,
        dateOfBirth: dob,
        gender,
        address,
        city,
        state,
        postalCode,
        preferredLanguage,
        profilePhotoUrl: profilePhotoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
        workerType,
        primarySkill: {
          id: primaryTradeId,
          name: workerType === 'general' ? 'General Cooperative Worker' : primaryTradeObj.name,
          years: workerType === 'general' ? 2 : primaryExperienceYears,
          level: primarySkillLevel
        },
        additionalSkills: workerType === 'general' 
          ? generalTaskSelection.map(task => ({ id: task.toLowerCase().replace(/\s+/g, '_'), name: task, years: 1, level: 'intermediate' as const }))
          : additionalSkills,
        certifications: workerType !== 'general' && certTitle ? [
          {
            title: certTitle,
            issuedBy: certIssuer || 'Govt Licensing Authority',
            year: certYear || '2023',
            documentUrl: 'https://partnerplus.org/certs/verified-trade.pdf'
          }
        ] : [],
        documents: [
          {
            type: 'identity_proof',
            name: `${idDocType} (${idDocNumber})`,
            path: `docs/${idDocFileName}`
          }
        ],
        availability: {
          availableToday: true,
          workingDays,
          startTime,
          endTime,
          emergencyAvailable,
          serviceRadiusKm
        },
        locationPermissionGranted,
        payout: {
          method: payoutMethod,
          identifier: payoutIdentifier
        },
        cooperativeId: selectedCooperativeId
      });

      if (!res.success) {
        setLoading(false);
        setErrorMsg(res.message || 'Worker enrollment could not be processed.');
        return;
      }

      setRegisteredWorkerId(res.workerProfile?.id || 'wrk-new');
      setSubmissionComplete(true);
      setLoading(false);

      // Also authenticate worker & set active role with actual registered name and uploaded photo
      await loginWithCredentials(phone, 'worker123', 'worker', {
        name: fullName,
        email: email,
        phone: phone,
        role: 'worker',
        avatar: profilePhotoUrl || undefined
      });
      setRole('worker');
      try {
        await refreshData();
      } catch {}

      addToast({
        type: 'success',
        title: 'Application Enrolled!',
        message: 'Your registration is submitted with PENDING verification status.'
      });
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'An error occurred during registration.');
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submissionComplete) {
    return (
      <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border-2 border-amber-500 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800 inline-block">
            STATUS: VERIFICATION PENDING
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Application Enrolled Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Welcome, <strong className="text-slate-900 dark:text-white">{fullName}</strong>. Your worker profile has been enrolled under the <strong className="text-emerald-600 dark:text-emerald-400">Chennai Labour Cooperative Society</strong>.
          </p>
        </div>

        {/* Verification Checklist */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2.5">
          <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Cooperative Society Verification Pipeline:</span>
            <span className="font-mono text-slate-500">Ref ID: {registeredWorkerId}</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Digital Application &amp; Trade Details Registered</span>
          </div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4 shrink-0" />
            <span>Aadhaar &amp; Police Verification Review (Within 24 Hours)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Cooperative Dispatch License Activation &amp; Passbook Issuance</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          You can now explore your worker dashboard, browse community wage guidelines, and complete skill evaluations.
        </p>

        <button
          type="button"
          onClick={() => {
            switchRole('worker');
            setRole('worker');
            onSuccess();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
        >
          <span>Enter Worker Portal</span>
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
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
            WORKER / ARTISAN ONBOARDING
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Cooperative Member Enrollment
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
          className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Personal & Contact Details + PHOTO UPLOADER */}
      {step === 1 && (
        <div className="space-y-4">
          {/* PROFILE PHOTO UPLOADER COMPONENT (Camera + Device Picker) */}
          <ProfilePhotoUploader
            currentPhotoUrl={profilePhotoUrl}
            onPhotoSelected={(dataUrl) => {
              setProfilePhotoUrl(dataUrl);
              addToast({
                type: 'success',
                title: 'Photo Uploaded',
                message: 'Worker identity photograph registered.'
              });
            }}
            label="Worker Official Profile Photograph"
            required={true}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Legal Name (as in Aadhaar Card) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Murugan Shanmugam"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number (for Dispatch SMS) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98400 00000"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (for Identity & Receipts) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. murugan.artisan@partnerplus.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Residential Address / Settlement Area <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Door No, Street, Landmark"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                City / District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PIN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
              >
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <span>Next: Worker Classification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Worker Classification */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Select how you would like to work with the cooperative. This ensures you are assigned suitable tasks and fair wage rates without forced requirements.
          </div>

          <div className="space-y-3">
            <label className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
              workerType === 'skilled'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="worker_type"
                  checked={workerType === 'skilled'}
                  onChange={() => setWorkerType('skilled')}
                  className="mt-1 text-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-slate-900 dark:text-white">
                      Skilled Artisan / Certified Professional
                    </strong>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-full">
                      Highest Pay Rate
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    For electricians, plumbers, carpenters, HVAC specialists, and technicians with trade experience or vocational training.
                  </p>
                </div>
              </div>
            </label>

            <label className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
              workerType === 'semi_skilled'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="worker_type"
                  checked={workerType === 'semi_skilled'}
                  onChange={() => setWorkerType('semi_skilled')}
                  className="mt-1 text-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-slate-900 dark:text-white">
                      Semi-Skilled Specialist
                    </strong>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300 rounded-full">
                      Specialized Tasks
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    For painters, masonry assistants, tile layers, commercial cleaners, and landscape care workers.
                  </p>
                </div>
              </div>
            </label>

            <label className={`block p-4 rounded-2xl border-2 transition cursor-pointer ${
              workerType === 'general'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="worker_type"
                  checked={workerType === 'general'}
                  onChange={() => setWorkerType('general')}
                  className="mt-1 text-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-slate-900 dark:text-white">
                      General Daily Worker / Helper
                    </strong>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                      Zero Barrier Entry
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    For daily wage work, material handling, packaging, site helpers, and event assistance. <strong>No vocational degrees or specialized licenses required.</strong>
                  </p>
                </div>
              </div>
            </label>
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
              onClick={() => setStep(3)}
              className="w-2/3 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Next: Skills Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Skills Selection */}
      {step === 3 && (
        <div className="space-y-4">
          {workerType !== 'general' ? (
            <>
              {/* PRIMARY SKILL */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-300">
                    PRIMARY OCCUPATIONAL TRADE
                  </span>
                  <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold">
                    PRIMARY DISPATCH
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Your Primary Trade
                  </label>
                  <select
                    value={primaryTradeId}
                    onChange={(e) => setPrimaryTradeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    {AVAILABLE_TRADES.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={45}
                      value={primaryExperienceYears}
                      onChange={(e) => setPrimaryExperienceYears(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Self-Assessed Skill Level
                    </label>
                    <select
                      value={primarySkillLevel}
                      onChange={(e) => setPrimarySkillLevel(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                    >
                      <option value="beginner">Beginner (1-2 Years)</option>
                      <option value="intermediate">Intermediate (3-5 Years)</option>
                      <option value="expert">Master / Expert (6+ Years)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ADDITIONAL SKILLS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Additional Secondary Skills (Stored Independently)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Skill</span>
                  </button>
                </div>

                {additionalSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No additional skills added. Click above to add secondary trades.</p>
                ) : (
                  additionalSkills.map((sk, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex-1 w-full">
                        <select
                          value={sk.id}
                          onChange={(e) => {
                            const newTrade = AVAILABLE_TRADES.find(t => t.id === e.target.value);
                            if (newTrade) {
                              const updated = [...additionalSkills];
                              updated[idx].id = newTrade.id;
                              updated[idx].name = newTrade.name;
                              setAdditionalSkills(updated);
                            }
                          }}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                        >
                          {AVAILABLE_TRADES.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="number"
                          min={0}
                          max={40}
                          value={sk.years}
                          onChange={(e) => {
                            const updated = [...additionalSkills];
                            updated[idx].years = parseInt(e.target.value) || 0;
                            setAdditionalSkills(updated);
                          }}
                          placeholder="Years"
                          className="w-20 px-2.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(idx)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* GENERAL WORKER CAPABILITIES (Zero Forced Credentials) */
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                <strong className="block font-bold mb-1">General Worker Flexibility:</strong>
                You do not need trade licenses or certificates. Select the types of daily tasks you are comfortable performing:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GENERAL_TASKS.map(task => {
                  const isSelected = generalTaskSelection.includes(task);
                  return (
                    <div
                      key={task}
                      onClick={() => {
                        if (isSelected) {
                          setGeneralTaskSelection(generalTaskSelection.filter(t => t !== task));
                        } else {
                          setGeneralTaskSelection([...generalTaskSelection, task]);
                        }
                      }}
                      className={`p-3 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between text-xs font-semibold ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{task}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-2/3 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Next: Documents &amp; Cooperative</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Certifications & Identity Proof */}
      {step === 4 && (
        <div className="space-y-4">
          {/* Identity Document Proof */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
              GOVERNMENT IDENTITY PROOF <span className="text-rose-500">*</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Document Type
                </label>
                <select
                  value={idDocType}
                  onChange={(e) => setIdDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Voter Identity Card">Voter Identity Card</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Ration Card">Ration Card / Smart Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Document Reference Number
                </label>
                <input
                  type="text"
                  required
                  value={idDocNumber}
                  onChange={(e) => setIdDocNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-600 dark:text-slate-300 truncate">
                Attached: {idDocFileName}
              </span>
              <span className="text-emerald-600 font-mono font-bold shrink-0">
                Uploaded
              </span>
            </div>
          </div>

          {/* Optional Trade Certificate (Skilled only) */}
          {workerType === 'skilled' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                TRADE CERTIFICATION / VOCATIONAL LICENSE (OPTIONAL)
              </span>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Certificate Name / License Title
                </label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g. NSDC Level 4 Sanitary Tech"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Year of Issuance
                  </label>
                  <input
                    type="text"
                    value={certYear}
                    onChange={(e) => setCertYear(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cooperative Society Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Designated Labour Cooperative Society Jurisdiction
            </label>
            <select
              value={selectedCooperativeId}
              onChange={(e) => setSelectedCooperativeId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
            >
              {mockCooperatives.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.registrationNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="w-2/3 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Next: Availability &amp; GPS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Availability, Emergency Dispatch & Location Consent */}
      {step === 5 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Available Working Days
            </label>
            <div className="flex flex-wrap gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                const isSelected = workingDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setWorkingDays(workingDays.filter(d => d !== day));
                      } else {
                        setWorkingDays([...workingDays, day]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Shift Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Shift End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Emergency 24/7 Response Readiness
              </span>
              <input
                type="checkbox"
                checked={emergencyAvailable}
                onChange={(e) => setEmergencyAvailable(e.target.checked)}
                className="rounded text-emerald-600"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Receive high-priority emergency alerts (e.g. electrical fire hazard, water main burst) with emergency surge pay (+40%).
            </p>
          </div>

          {/* LOCATION PERMISSION RATIONALE & FALLBACK */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                <span>DEVICE LOCATION CONSENT</span>
              </span>
              <span className={`text-[11px] font-mono font-bold ${
                locationPermissionGranted ? 'text-emerald-600' : 'text-slate-400'
              }`}>
                {locationPermissionGranted ? 'Granted' : 'Optional / Denied'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              PartnerPlus uses your device location to dispatch nearby emergency service requests and minimize your daily travel distances.
            </p>

            {locationWarning ? (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
                {locationWarning}
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={requestLocation}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Navigation className="w-3 h-3" />
                <span>Grant GPS Access</span>
              </button>
              <span className="text-[11px] text-slate-500">
                Registration continues safely even if declined.
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(6)}
              className="w-2/3 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Next: Payout &amp; Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Payout, Passbook & Final Submit */}
      {step === 6 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-300">
              DIRECT DISPATCH PAYOUT &amp; COOPERATIVE PASSBOOK
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Payments are transferred on the same day with 0% platform commission cuts.
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="radio"
                  name="payout_method"
                  checked={payoutMethod === 'upi'}
                  onChange={() => setPayoutMethod('upi')}
                  className="text-emerald-600"
                />
                <span>Instant UPI Virtual Payment Address (VPA)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="radio"
                  name="payout_method"
                  checked={payoutMethod === 'bank_account'}
                  onChange={() => setPayoutMethod('bank_account')}
                  className="text-emerald-600"
                />
                <span>Bank Account (Account Number &amp; IFSC)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="radio"
                  name="payout_method"
                  checked={payoutMethod === 'cooperative_passbook'}
                  onChange={() => setPayoutMethod('cooperative_passbook')}
                  className="text-emerald-600"
                />
                <span>Cooperative Society Member Passbook Account</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {payoutMethod === 'upi' ? 'UPI ID (e.g. mobile@upi)' : 'Account Reference / Passbook No'}
              </label>
              <input
                type="text"
                required
                value={payoutIdentifier}
                onChange={(e) => setPayoutIdentifier(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            By submitting this application, I declare that all trade credentials and identity documents are authentic. I agree to abide by the cooperative society bylaws and fair client service charters.
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(5)}
              className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting Member Enrollment...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Worker Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
