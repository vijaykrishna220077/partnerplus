import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock, 
  IndianRupee, 
  AlertCircle,
  CheckCircle2,
  Coffee,
  Wrench,
  Truck
} from 'lucide-react';
import { OrganizationProject, OrganizationWorkRequest } from '../../../types';
import { organizationService } from '../../../services/organizationService';

interface CreateWorkRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: OrganizationProject[];
  defaultProjectId?: string;
  onSuccess: (newReq: OrganizationWorkRequest) => void;
}

export const CreateWorkRequestModal: React.FC<CreateWorkRequestModalProps> = ({
  isOpen,
  onClose,
  projects,
  defaultProjectId,
  onSuccess
}) => {
  const [projectId, setProjectId] = useState<string>(defaultProjectId || projects[0]?.id || '');
  const [workerType, setWorkerType] = useState<OrganizationWorkRequest['workerType']>('GENERAL');
  const [tradeCategory, setTradeCategory] = useState<string>('daily_labor');
  const [workersNeeded, setWorkersNeeded] = useState<number>(10);
  const [date, setDate] = useState<string>('2026-09-06');
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [endTime, setEndTime] = useState<string>('05:00 PM');
  const [dailyPay, setDailyPay] = useState<number>(850);
  const [mealsProvided, setMealsProvided] = useState<boolean>(true);
  const [toolsProvided, setToolsProvided] = useState<boolean>(true);
  const [transportProvided, setTransportProvided] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [skillsInput, setSkillsInput] = useState<string>('Loading, Unloading, Material Handling');

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id === projectId) || projects[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const newReq = organizationService.createWorkRequest({
      projectId: currentProject.id,
      projectName: currentProject.title,
      organizationId: currentProject.organizationId,
      organizationName: currentProject.organizationName,
      workerType,
      tradeCategory,
      requiredSkills: skills.length ? skills : ['General Operations'],
      experienceRequired: workerType === 'SKILLED' ? '2+ years' : 'Standard experience',
      workersNeeded: Number(workersNeeded),
      date,
      startTime,
      endTime,
      location: currentProject.location,
      city: currentProject.city,
      latitude: currentProject.latitude,
      longitude: currentProject.longitude,
      dailyPayPerWorker: Number(dailyPay),
      mealsProvided,
      toolsProvided,
      transportProvided,
      description: description || `Contract workforce deployment for ${currentProject.title}`
    });

    onSuccess(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-black text-lg text-slate-900">
              Post Bulk Workforce Hiring Request
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify workforce requirements for dispatch by Chennai Central Labour Cooperative.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Target Project Site */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Project Site</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.city})</option>
              ))}
            </select>
          </div>

          {/* Worker Classification & Trade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Worker Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {(['SKILLED', 'SEMI_SKILLED', 'GENERAL'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      setWorkerType(tier);
                      if (tier === 'SKILLED' && dailyPay < 1100) setDailyPay(1250);
                      if (tier === 'SEMI_SKILLED' && dailyPay < 900) setDailyPay(950);
                      if (tier === 'GENERAL' && dailyPay < 750) setDailyPay(850);
                    }}
                    className={`py-2 rounded-xl text-[11px] font-black uppercase transition cursor-pointer border ${
                      workerType === tier 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tier.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Trade Category</label>
              <select
                value={tradeCategory}
                onChange={(e) => setTradeCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="daily_labor">Daily Labor / Loading / Packing</option>
                <option value="electrical">Electrical &amp; Wiring</option>
                <option value="plumbing">Plumbing &amp; Sanitary</option>
                <option value="carpentry">Carpentry &amp; Woodwork</option>
                <option value="cleaning">Deep Cleaning &amp; Housekeeping</option>
                <option value="masonry">Civil Masonry &amp; Concreting</option>
                <option value="painting">Commercial Painting &amp; Coating</option>
                <option value="hvac">HVAC &amp; Ventilation</option>
              </select>
            </div>
          </div>

          {/* Quick Worker Count Presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Number of Workers Needed</label>
              <span className="text-amber-600 font-extrabold">{workersNeeded} Workers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 5, 10, 20, 50, 100].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setWorkersNeeded(cnt)}
                  className={`px-3 py-1.5 rounded-lg font-black text-xs transition cursor-pointer border ${
                    workersNeeded === cnt 
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs' 
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {cnt} {cnt === 1 ? 'Worker' : 'Workers'}
                </button>
              ))}
            </div>
          </div>

          {/* Date, Shift Timing, & Daily Wage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Shift Window</label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="09:00 AM"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs focus:outline-none"
                />
                <span>-</span>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="05:00 PM"
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Daily Wage / Worker (₹)</label>
              <input
                type="number"
                value={dailyPay}
                onChange={(e) => setDailyPay(Number(e.target.value))}
                min={750}
                step={50}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Amenities Provided */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Site Amenities Provided</label>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mealsProvided}
                  onChange={(e) => setMealsProvided(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <span>Mid-Day Meals &amp; Water</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={toolsProvided}
                  onChange={(e) => setToolsProvided(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <span>Heavy Tools &amp; PPE on Site</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={transportProvided}
                  onChange={(e) => setTransportProvided(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <span>Pick-up Shuttle</span>
              </label>
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Loading, Conveyor Wiring, Quality Inspection"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Job Instructions / Site Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Provide gate entry directions, supervisor contact, and specific task checklist..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Broadcast Workforce Request</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
