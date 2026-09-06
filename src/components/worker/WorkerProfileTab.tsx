import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  Globe, 
  Sparkles, 
  Volume2, 
  HelpCircle, 
  AlertTriangle, 
  Phone, 
  Check, 
  Plus,
  ArrowRight,
  Award,
  MapPin
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { StructuredWorkerProfile, WorkerSkillRecord } from '../../types/workerSkillRegistry';
import { STRUCTURED_WORKER_PROFILES } from '../../data/structuredWorkersData';
import { cooperativeSkillRegistry } from '../../services/cooperativeSkillRegistry';

interface WorkerProfileTabProps {
  workerName: string;
  coopId: string;
  isSimpleMode: boolean;
  isAudioEnabled: boolean;
  selectedLang: string;
  isEmergencyReady: boolean;
  worker?: StructuredWorkerProfile;
  onSwitchWorker?: (worker: StructuredWorkerProfile) => void;
  onUpdateWorkerSkills?: (updatedSkills: WorkerSkillRecord[]) => void;
  onToggleSimpleMode: () => void;
  onToggleAudio: () => void;
  onToggleEmergency: () => void;
  onChangeLanguage: (code: LanguageCode) => void;
  onOpenReportProblem: () => void;
}

export const WorkerProfileTab: React.FC<WorkerProfileTabProps> = ({
  workerName,
  coopId,
  isSimpleMode,
  isAudioEnabled,
  selectedLang,
  isEmergencyReady,
  worker,
  onSwitchWorker,
  onUpdateWorkerSkills,
  onToggleSimpleMode,
  onToggleAudio,
  onToggleEmergency,
  onChangeLanguage,
  onOpenReportProblem
}) => {
  const [activeDays, setActiveDays] = useState<string[]>([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]);
  const [preferredSlots, setPreferredSlots] = useState<string[]>([
    'Morning (6 AM – 12 PM)',
    'Afternoon (12 PM – 5 PM)',
    'Evening (5 PM – 9 PM)'
  ]);

  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [selectedNewSkillId, setSelectedNewSkillId] = useState('');
  const [selectedNewLevel, setSelectedNewLevel] = useState<1 | 2 | 3 | 4>(2);
  const [selectedNewExp, setSelectedNewExp] = useState<number>(2);

  const currentWorker = worker || STRUCTURED_WORKER_PROFILES[0];
  const allRegistrySkills = cooperativeSkillRegistry.getAllSkills();

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const allSlots = [
    'Morning (6 AM – 12 PM)',
    'Afternoon (12 PM – 5 PM)',
    'Evening (5 PM – 9 PM)'
  ];

  const languages: { code: LanguageCode; label: string; script: string }[] = [
    { code: 'hi', label: 'Hindi', script: 'हिंदी' },
    { code: 'ta', label: 'Tamil', script: 'தமிழ்' },
    { code: 'te', label: 'Telugu', script: 'తెలుగు' },
    { code: 'kn', label: 'Kannada', script: 'ಕನ್ನಡ' },
    { code: 'bn', label: 'Bengali', script: 'বাংলা' },
    { code: 'mr', label: 'Marathi', script: 'मराठी' },
    { code: 'en', label: 'English', script: 'English' }
  ];

  const toggleDay = (day: string) => {
    if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter(d => d !== day));
    } else {
      setActiveDays([...activeDays, day]);
    }
  };

  const toggleSlot = (slot: string) => {
    if (preferredSlots.includes(slot)) {
      setPreferredSlots(preferredSlots.filter(s => s !== slot));
    } else {
      setPreferredSlots([...preferredSlots, slot]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. Cooperative Persona Switcher (For demonstration & testing matching tiers) */}
      {onSwitchWorker && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm border border-blue-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-blue-200">
                Cooperative Member Persona (Evaluation & Demo Mode)
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                Switch personas to see how job eligibility &amp; matching strictly adapts
              </div>
            </div>
            <select
              value={currentWorker.id}
              onChange={(e) => {
                const found = STRUCTURED_WORKER_PROFILES.find((p) => p.id === e.target.value);
                if (found) {
                  if (found.id === 'wrk-ramesh-elec' && (currentWorker.name || workerName)) {
                    onSwitchWorker({ ...found, name: currentWorker.name || workerName });
                  } else {
                    onSwitchWorker(found);
                  }
                }
              }}
              className="w-full sm:w-auto text-xs font-bold bg-white text-gray-900 rounded-xl px-3 py-2 border border-blue-300 cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-400"
            >
              {STRUCTURED_WORKER_PROFILES.map((p) => {
                const isCurrentActive = p.id === currentWorker.id || (p.id === 'wrk-ramesh-elec' && (currentWorker.name || workerName));
                const displayName = isCurrentActive ? (currentWorker.name || workerName) : p.name;
                return (
                  <option key={p.id} value={p.id}>
                    {displayName} — {p.worker_type === 'skilled' ? 'Skilled' : p.worker_type === 'semi_skilled' ? 'Semi-Skilled' : 'General'} ({p.primary_skill_label})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}

      {/* 1. Worker Profile Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-18 h-18 rounded-3xl bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-4xl shrink-0">
          {currentWorker.worker_type === 'skilled' ? '⚡' : currentWorker.worker_type === 'semi_skilled' ? '🔧' : '📦'}
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{currentWorker.name}</h2>
            
            {/* Worker Tier Badge */}
            <span 
              className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wide ${
                currentWorker.worker_type === 'skilled'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : currentWorker.worker_type === 'semi_skilled'
                  ? 'bg-teal-100 text-teal-800 border border-teal-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {currentWorker.worker_type === 'skilled' ? 'Skilled Worker' : currentWorker.worker_type === 'semi_skilled' ? 'Semi-Skilled Worker' : 'General Worker'}
            </span>

            {currentWorker.identity_verified && (
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 font-bold">
            {currentWorker.coop_id} • Tamil Nadu Labour Cooperative Society • Cluster: Gandhipuram
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 pt-1 flex-wrap">
            <span className="text-amber-500 font-black">★ {currentWorker.rating} Rating</span>
            <span>•</span>
            <span>{currentWorker.jobs_completed_count} Jobs Done</span>
            <span>•</span>
            <span className="text-blue-700 font-extrabold">{currentWorker.primary_skill_label}</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">{currentWorker.experience_years} Years Experience</span>
          </div>
        </div>
      </div>

      {/* 2. My Skills & Qualifications (Cooperative Skill Registry) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>Registered Skills &amp; Qualifications</span>
            </h3>
            <p className="text-xs text-gray-500">
              Cooperative certified competencies used by the 10-step matching engine
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingSkill(!isAddingSkill)}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingSkill ? 'Close Form' : 'Register New Skill'}</span>
          </button>
        </div>

        {/* Inline Register New Skill Form */}
        {isAddingSkill && (
          <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200 space-y-3">
            <div className="text-xs font-black text-blue-900">
              Add Verified Cooperative Skill
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Select Skill</label>
                <select
                  value={selectedNewSkillId}
                  onChange={(e) => setSelectedNewSkillId(e.target.value)}
                  className="w-full text-xs font-semibold bg-white border border-gray-300 rounded-xl p-2"
                >
                  <option value="">-- Choose skill --</option>
                  {allRegistrySkills
                    .filter((s) => !currentWorker.skills.some((ws) => ws.skill_id === s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.skill_name} ({s.category})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Skill Level</label>
                <select
                  value={selectedNewLevel}
                  onChange={(e) => setSelectedNewLevel(Number(e.target.value) as 1 | 2 | 3 | 4)}
                  className="w-full text-xs font-semibold bg-white border border-gray-300 rounded-xl p-2"
                >
                  <option value={1}>Level 1 - Novice / Helper</option>
                  <option value={2}>Level 2 - Competent</option>
                  <option value={3}>Level 3 - Expert Artisan</option>
                  <option value={4}>Level 4 - Master Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={selectedNewExp}
                  onChange={(e) => setSelectedNewExp(Number(e.target.value))}
                  className="w-full text-xs font-semibold bg-white border border-gray-300 rounded-xl p-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingSkill(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedNewSkillId) return;
                  const regSkill = cooperativeSkillRegistry.getSkillById(selectedNewSkillId);
                  if (!regSkill) return;
                  const newRec: WorkerSkillRecord = {
                    id: `ws-${Date.now()}`,
                    worker_id: currentWorker.id,
                    skill_id: regSkill.id,
                    skill_name: regSkill.skill_name,
                    category: regSkill.category,
                    skill_level: selectedNewLevel === 1 ? 'beginner' : selectedNewLevel >= 3 ? 'expert' : 'intermediate',
                    years_experience: selectedNewExp,
                    is_primary: false,
                    verified: true,
                    certified: true,
                    certification_name: 'Cooperative Technical Committee',
                    tasks: regSkill.tasks ? regSkill.tasks.map((t) => t.task_name) : [],
                    created_at: new Date().toISOString()
                  };
                  const updated = [...currentWorker.skills, newRec];
                  if (onUpdateWorkerSkills) {
                    onUpdateWorkerSkills(updated);
                  }
                  setIsAddingSkill(false);
                  setSelectedNewSkillId('');
                }}
                disabled={!selectedNewSkillId}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Save Skill
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {/* Primary Trade */}
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase">Primary Trade &amp; Qualification</div>
              <div className="text-sm font-black text-gray-900 mt-0.5">
                ⚡ {currentWorker.primary_skill_label} ({currentWorker.experience_years} Years Experience)
              </div>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
              Primary Trade
            </span>
          </div>

          {/* List of Registered Competencies */}
          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">Verified Skill Competencies ({currentWorker.skills.length}):</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentWorker.skills.map((skillRec) => {
                const levelLabel = 
                  skillRec.skill_level === 'expert' ? 'Level 3 (Expert)' :
                  skillRec.skill_level === 'intermediate' ? 'Level 2 (Competent)' : 'Level 1 (Novice)';

                return (
                  <div 
                    key={skillRec.id} 
                    className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{skillRec.skill_name}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800">
                        {levelLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600 flex items-center justify-between">
                      <span>Experience: {skillRec.years_experience} years</span>
                      {skillRec.verified && (
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5 text-[10px]">
                          <Award className="w-3 h-3" />
                          <span>Certified</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Service Radius & Geographic Cluster */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-3">
        <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          <span>Cooperative Service Radius &amp; Cluster</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <span className="text-gray-500 font-semibold block text-[11px]">Primary Cluster</span>
            <span className="font-black text-gray-800 text-sm">{currentWorker.cluster_id || 'Gandhipuram Central'}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <span className="text-gray-500 font-semibold block text-[11px]">Dispatch Radius</span>
            <span className="font-black text-gray-800 text-sm">Up to {currentWorker.service_radius_km} km</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
            <span className="text-gray-500 font-semibold block text-[11px]">Emergency Response</span>
            <span className="font-black text-emerald-700 text-sm">
              {currentWorker.emergency_available ? '⚡ 15-Min Ready' : 'Standard Shifts'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Worker Working Hours & Availability (Section 24, 25) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Working Hours &amp; Shift Preferences</span>
          </h3>
          <p className="text-xs text-gray-500">
            Jobs will only be dispatched to you during your selected slots.
          </p>
        </div>

        {/* Shift slots */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-700">Preferred Shifts:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {allSlots.map((slot) => {
              const active = preferredSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={`p-3 rounded-xl text-xs font-bold text-left transition cursor-pointer border flex items-center justify-between ${
                    active 
                      ? 'bg-blue-50 text-blue-900 border-blue-300 ring-1 ring-blue-300' 
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  <span>{slot}</span>
                  {active && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Working days */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="text-xs font-bold text-gray-700">Working Days:</div>
          <div className="flex flex-wrap gap-1.5">
            {allDays.map((day) => {
              const active = activeDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    active 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency toggle */}
        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black text-red-900">Emergency Job Availability</div>
            <p className="text-[11px] text-red-700">Receive urgent 15-minute requests with emergency pay bonus.</p>
          </div>
          <button
            onClick={onToggleEmergency}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              isEmergencyReady ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            {isEmergencyReady ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </div>

      {/* 4. Accessibility & Language (Section 31, 32, 33) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" />
            <span>Language &amp; Easy Reading Settings</span>
          </h3>
          <p className="text-xs text-gray-500">Choose your language and audio voice preferences</p>
        </div>

        {/* Language Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => onChangeLanguage(l.code)}
              className={`p-3 rounded-2xl text-xs font-black transition cursor-pointer border flex flex-col items-center justify-center gap-1 ${
                selectedLang === l.code 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
              }`}
            >
              <span className="text-base">{l.script}</span>
              <span className="text-[10px] opacity-80">{l.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          {/* Simple Mode Toggle */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Simple Mode (Low Literacy)</span>
              </div>
              <p className="text-[11px] text-amber-800 mt-0.5">Huge icons &amp; minimal text</p>
            </div>
            <button
              onClick={onToggleSimpleMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                isSimpleMode ? 'bg-amber-600 text-white' : 'bg-white text-gray-800 border border-gray-300'
              }`}
            >
              {isSimpleMode ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Voice Assistant Toggle */}
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Voice Audio Guidance</span>
              </div>
              <p className="text-[11px] text-blue-800 mt-0.5">Speaks job details automatically</p>
            </div>
            <button
              onClick={onToggleAudio}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                isAudioEnabled ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300'
              }`}
            >
              {isAudioEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Worker Support & Report a Problem (Section 34, 35, 36) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-3">
        <h3 className="text-base font-black text-gray-900">
          Support, Safety &amp; Problem Reporting
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onOpenReportProblem}
            className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Report a Problem</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Payment issue, wrong address, customer problem
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>

          <a
            href="tel:1800123456"
            className="p-4 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-left transition cursor-pointer flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-black text-red-900 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-red-600" />
                <span>Call Cooperative Helpline</span>
              </div>
              <p className="text-[11px] text-red-700 mt-0.5">
                Toll Free 1800-SAHAKARI • 24/7 Supervisor
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-red-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
