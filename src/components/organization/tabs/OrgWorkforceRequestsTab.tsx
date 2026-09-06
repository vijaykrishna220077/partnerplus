import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Coffee,
  Wrench,
  Truck
} from 'lucide-react';
import { OrganizationWorkRequest, OrganizationWorkerAssignment } from '../../../types';
import { organizationService } from '../../../services/organizationService';

interface OrgWorkforceRequestsTabProps {
  workRequests: OrganizationWorkRequest[];
  onOpenNewRequestModal: () => void;
  onRefreshRequests: () => void;
}

export const OrgWorkforceRequestsTab: React.FC<OrgWorkforceRequestsTabProps> = ({
  workRequests,
  onOpenNewRequestModal,
  onRefreshRequests
}) => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(workRequests[0]?.id || null);
  const [matchingInProgress, setMatchingInProgress] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const selectedRequest = workRequests.find(r => r.id === selectedRequestId) || workRequests[0];

  const handleAutoAssign = async (requestId: string, count: number) => {
    setMatchingInProgress(true);
    setFeedbackMessage(null);
    await new Promise(r => setTimeout(r, 600));

    const res = organizationService.autoAssignEligibleWorkers(requestId, count);
    setMatchingInProgress(false);
    onRefreshRequests();

    if (res.assignedCount > 0) {
      setFeedbackMessage(`Successfully matched & assigned ${res.assignedCount} qualified cooperative artisans.`);
    } else {
      setFeedbackMessage('All requested slots are either filled or currently pending artisan confirmation.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Workforce Requests &amp; Bulk Hiring
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Post bulk hiring requirements (1, 10, 50, 100+ workers) across Skilled, Semi-Skilled, and General categories.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewRequestModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Workforce Request</span>
        </button>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer font-extrabold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Requests List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Active Workforce Openings ({workRequests.length})
          </div>

          {workRequests.map((req) => {
            const isSelected = selectedRequest?.id === req.id;
            const percentFilled = Math.round((req.workersAssigned / (req.workersNeeded || 1)) * 100);

            return (
              <div
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-500/50' 
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      isSelected 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {req.workerType} • {req.tradeCategory}
                    </span>
                    <h4 className="font-extrabold text-sm mt-1">
                      {req.projectName}
                    </h4>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    req.status === 'FILLED'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : req.status === 'PARTIALLY_FILLED'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                    {req.workersAssigned} / {req.workersNeeded} Workers Assigned
                  </span>
                  <span className="font-black text-amber-400">
                    ₹{req.dailyPayPerWorker}/worker
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 w-full h-1.5 rounded-full bg-slate-700/40 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${percentFilled}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center gap-3 text-[11px] opacity-80 pt-2 border-t border-slate-700/30">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{req.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{req.startTime} - {req.endTime}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (7 Cols): Selected Request Details & Worker Matching */}
        {selectedRequest ? (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            
            {/* Top Details */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {selectedRequest.workerType} WORKFORCE
                  </span>
                  <span className="text-xs text-slate-500">
                    Req #{selectedRequest.id.slice(-6)}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {selectedRequest.projectName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedRequest.location}</span>
                </p>
              </div>

              {/* Action: Bulk Matching Engine */}
              {selectedRequest.workersAssigned < selectedRequest.workersNeeded && (
                <button
                  type="button"
                  disabled={matchingInProgress}
                  onClick={() => handleAutoAssign(selectedRequest.id, selectedRequest.workersNeeded - selectedRequest.workersAssigned)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs transition shadow-sm flex items-center gap-2 cursor-pointer self-start shrink-0 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {matchingInProgress ? 'Matching Artisans...' : `Fill ${selectedRequest.workersNeeded - selectedRequest.workersAssigned} Available Slots`}
                  </span>
                </button>
              )}
            </div>

            {/* Shift & Perks Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Daily Pay:</span>
                <div className="font-black text-slate-900">₹{selectedRequest.dailyPayPerWorker}/day</div>
              </div>
              <div>
                <span className="text-slate-500">Shift Timing:</span>
                <div className="font-bold text-slate-900">{selectedRequest.startTime} - {selectedRequest.endTime}</div>
              </div>
              <div>
                <span className="text-slate-500">Date:</span>
                <div className="font-bold text-slate-900">{selectedRequest.date}</div>
              </div>
              <div>
                <span className="text-slate-500">Amenities:</span>
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  {selectedRequest.mealsProvided && <span title="Meals Provided">🍲 Meals</span>}
                  {selectedRequest.toolsProvided && <span title="Tools Provided">🔧 Tools</span>}
                </div>
              </div>
            </div>

            {/* Description & Required Skills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600">Task Scope:</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedRequest.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedRequest.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Workers Ledger */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-900 uppercase tracking-wider">
                  Assigned Artisans ({selectedRequest.assignments.length} / {selectedRequest.workersNeeded})
                </span>
                <span className="text-slate-500 font-normal">
                  Privacy Protected: Full credentials unlocked on site check-in
                </span>
              </div>

              {selectedRequest.assignments.length === 0 ? (
                <div className="text-center py-8 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500">
                  No workers assigned yet. Click "Fill Available Slots" to trigger the cooperative matching engine.
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {selectedRequest.assignments.map((asgn, idx) => (
                    <div 
                      key={asgn.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-black text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-extrabold text-slate-900 flex items-center gap-2">
                            <span>{asgn.workerName}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              NSDC Verified
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {asgn.trade} • {asgn.workerPhone.slice(0, 7)}XXXX (Assigned)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          asgn.status === 'WORKING'
                            ? 'bg-emerald-100 text-emerald-800'
                            : asgn.status === 'ARRIVED'
                            ? 'bg-amber-100 text-amber-800'
                            : asgn.status === 'ON_THE_WAY'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {asgn.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
            Select a workforce request to inspect live worker assignments.
          </div>
        )}

      </div>

    </div>
  );
};
