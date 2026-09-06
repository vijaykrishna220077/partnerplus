import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Award, 
  AlertTriangle,
  Flame,
  Calendar,
  Building,
  UserCheck,
  Building2,
  Lock
} from 'lucide-react';
import { Worker } from '../../../types';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';
import { onboardingService } from '../../../services/onboardingService';
import { CooperativeMemberRecord } from '../../../types/onboarding';
import { useAuth } from '../../../context/AuthContext';

interface VerificationTabProps {
  workers: Worker[];
  onRefresh?: () => void;
}

interface VerificationApplication {
  id: string;
  workerName: string;
  phone: string;
  trade: string;
  experienceYears: number;
  appliedDate: string;
  aadhaarNumber: string;
  policeVerificationFile: string;
  tradeCertificateFile: string;
  bankAccountVerified: boolean;
  emergencyCertifiedRequested: boolean;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'TRADE_TEST_SCHEDULED';
}

export const VerificationTab: React.FC<VerificationTabProps> = ({ workers, onRefresh }) => {
  const { user } = useAuth();

  // Active view: Worker Verifications vs Cooperative Official Requests
  const [subTab, setSubTab] = useState<'workers' | 'coop_officials'>('workers');

  // Cooperative Official Requests state
  const [officialRequests, setOfficialRequests] = useState<CooperativeMemberRecord[]>(() => {
    return onboardingService.getAllCooperativeOfficialRequests();
  });

  const refreshOfficialRequests = () => {
    setOfficialRequests(onboardingService.getAllCooperativeOfficialRequests());
  };

  const [applications, setApplications] = useState<VerificationApplication[]>([
    {
      id: 'app-001',
      workerName: 'G. Shanmugam',
      phone: '+91 98402 33441',
      trade: 'Plumbing & Drainage Engineering',
      experienceYears: 7,
      appliedDate: 'Yesterday, 14:20',
      aadhaarNumber: 'XXXX-XXXX-8921',
      policeVerificationFile: 'Police_Clearance_Cert_TN_Pol_882.pdf',
      tradeCertificateFile: 'NSDC_Skill_Plumbing_Cert_Level4.pdf',
      bankAccountVerified: true,
      emergencyCertifiedRequested: true,
      status: 'PENDING_REVIEW'
    },
    {
      id: 'app-002',
      workerName: 'M. Jayakumar',
      phone: '+91 97890 55667',
      trade: 'Electrical & Industrial Wiring',
      experienceYears: 9,
      appliedDate: '2 days ago, 09:15',
      aadhaarNumber: 'XXXX-XXXX-4512',
      policeVerificationFile: 'Police_Clearance_Cert_TN_Pol_904.pdf',
      tradeCertificateFile: 'Govt_Wireman_License_B_Grade.pdf',
      bankAccountVerified: true,
      emergencyCertifiedRequested: true,
      status: 'PENDING_REVIEW'
    },
    {
      id: 'app-003',
      workerName: 'L. Saraswathi',
      phone: '+91 98404 88990',
      trade: 'Deep Sanitization & Housekeeping',
      experienceYears: 5,
      appliedDate: '3 days ago, 11:40',
      aadhaarNumber: 'XXXX-XXXX-1123',
      policeVerificationFile: 'Police_Clearance_Cert_TN_Pol_712.pdf',
      tradeCertificateFile: 'Hygiene_Safety_Protocol_Badge.pdf',
      bankAccountVerified: true,
      emergencyCertifiedRequested: false,
      status: 'PENDING_REVIEW'
    }
  ]);

  const [selectedApp, setSelectedApp] = useState<VerificationApplication | null>(null);

  // Cooperative Official Approval Handler (Test 14)
  const handleApproveOfficial = (req: CooperativeMemberRecord) => {
    const confirmApprove = window.confirm(
      `Approve security clearance for ${req.full_name} as ${req.requested_role}? Under cooperative rules, their actual role will now be elevated.`
    );
    if (!confirmApprove) return;

    const res = onboardingService.approveCooperativeOfficial(
      req.id,
      user?.name || 'Authorized Managing Committee Admin'
    );

    if (res) {
      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: 'COOPERATIVE_OFFICIAL_APPROVED',
        affectedEntity: 'COOPERATIVE_MEMBER_REQUEST',
        entityId: req.id,
        previousState: 'PENDING_APPROVAL',
        newState: req.requested_role,
        reason: `Cryptographic sign-off granted by ${user?.name || 'Cooperative Admin'} for official ${req.full_name}. Actual role is now ${req.requested_role}.`
      });

      refreshOfficialRequests();
      alert(`Official clearance approved! ${req.full_name}'s actual role is now elevated to ${req.requested_role}.`);
    }
  };

  const handleRejectOfficial = (req: CooperativeMemberRecord) => {
    const reason = window.prompt(`Enter reason for rejecting official request for ${req.full_name}:`, 'Failed statutory background verification');
    if (!reason) return;

    const res = onboardingService.rejectCooperativeOfficial(
      req.id,
      reason,
      user?.name || 'Authorized Managing Committee Admin'
    );

    if (res) {
      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: 'COOPERATIVE_OFFICIAL_REJECTED',
        affectedEntity: 'COOPERATIVE_MEMBER_REQUEST',
        entityId: req.id,
        previousState: 'PENDING_APPROVAL',
        newState: 'REJECTED',
        reason
      });

      refreshOfficialRequests();
      alert(`Clearance request rejected for ${req.full_name}.`);
    }
  };

  const handleApprove = (app: VerificationApplication) => {
    const confirm = window.confirm(`Approve cooperative membership and grant official dispatch license to ${app.workerName}?`);
    if (confirm) {
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'APPROVED' } : a));

      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: 'WORKER_KYC_APPROVED',
        affectedEntity: 'WORKER_APPLICATION',
        entityId: app.id,
        previousState: 'PENDING_REVIEW',
        newState: 'APPROVED_AND_ACTIVE',
        reason: `Verified Aadhaar, Police Clearance Certificate, and trade credentials for ${app.workerName}.`
      });

      alert(`Artisan ${app.workerName} approved! Membership enrolled.`);
    }
  };

  const handleReject = (app: VerificationApplication) => {
    const reason = window.prompt(`Enter official reason for rejecting ${app.workerName}:`);
    if (reason && reason.trim()) {
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'REJECTED' } : a));

      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: 'WORKER_KYC_REJECTED',
        affectedEntity: 'WORKER_APPLICATION',
        entityId: app.id,
        previousState: 'PENDING_REVIEW',
        newState: 'REJECTED',
        reason: reason.trim()
      });

      alert(`Application ${app.id} rejected. Reason logged.`);
    }
  };

  const handleScheduleTradeTest = (app: VerificationApplication) => {
    const testDate = window.prompt(`Enter trade test schedule date & test center for ${app.workerName}:`, 'Saturday 10:00 AM at Guindy ITI Center');
    if (testDate) {
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'TRADE_TEST_SCHEDULED' } : a));

      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: 'TRADE_TEST_SCHEDULED',
        affectedEntity: 'WORKER_APPLICATION',
        entityId: app.id,
        previousState: 'PENDING_REVIEW',
        newState: 'TRADE_TEST_SCHEDULED',
        reason: `In-person assessment arranged: ${testDate}`
      });

      alert(`Practical trade test scheduled for ${app.workerName}.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Sub-tab selection */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setSubTab('workers')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
            subTab === 'workers'
              ? 'bg-amber-600 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Worker &amp; Artisan Verification ({applications.filter(a => a.status === 'PENDING_REVIEW').length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSubTab('coop_officials');
            refreshOfficialRequests();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
            subTab === 'coop_officials'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Cooperative Official Clearance ({officialRequests.filter(r => r.status === 'PENDING_APPROVAL').length})</span>
        </button>
      </div>

      {/* 1. COOPERATIVE OFFICIAL CLEARANCE SECTION (TEST 14) */}
      {subTab === 'coop_officials' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-950/40 rounded-2xl border border-purple-800/80 space-y-1 text-xs">
            <span className="font-mono font-bold text-purple-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>COOPERATIVE OFFICIAL CLEARANCE DESK (TEST 14 PROTOCOL)</span>
            </span>
            <p className="text-slate-300">
              Under cooperative governance bylaws, registered officials are created with status <span className="text-amber-400 font-mono">PENDING_APPROVAL</span> and actual role <span className="text-amber-400 font-mono">PENDING</span>. Approving them activates their credentials into <span className="text-emerald-400 font-mono font-bold">COOPERATIVE_ADMIN</span> or <span className="text-indigo-400 font-mono font-bold">COOPERATIVE_STAFF</span>.
            </p>
          </div>

          <div className="space-y-3">
            {officialRequests.map((req) => {
              const isPending = req.status === 'PENDING_APPROVAL';
              const isApproved = req.status === 'APPROVED';
              const isRejected = req.status === 'REJECTED';

              return (
                <div 
                  key={req.id}
                  className={`p-5 rounded-3xl border bg-[#111A2E] text-white space-y-3 transition-all ${
                    isPending ? 'border-purple-800/80 shadow-lg' : isApproved ? 'border-emerald-800/80' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-purple-400 text-sm">{req.id}</span>
                        <span className="font-bold text-white text-base">{req.full_name}</span>
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          isPending ? 'bg-amber-950 text-amber-300 border-amber-800' : isApproved ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-1">
                        {req.designation} • Official Email: {req.official_email} • Phone: {req.phone}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <div className="text-right">
                        <span className="text-slate-500 block text-[10px] uppercase">Requested Role</span>
                        <span className="text-amber-400 font-bold">{req.requested_role}</span>
                      </div>
                      <div className="text-right pl-3 border-l border-slate-800">
                        <span className="text-slate-500 block text-[10px] uppercase">Actual Role</span>
                        <span className={`font-bold ${isApproved ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {req.actual_role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0C1322] border border-slate-800 text-xs font-mono space-y-1">
                    <span className="text-slate-500 text-[10px] uppercase block">Official Justification Rationale</span>
                    <p className="text-slate-300">{req.reason_for_access}</p>
                    <div className="pt-1 text-[11px] text-purple-300">
                      Credentials Attached: {req.supporting_documents?.join(', ') || 'Appointment_Order.pdf'}
                    </div>
                  </div>

                  {isPending && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        Requires authorized administrator sign-off.
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRejectOfficial(req)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveOfficial(req)}
                          className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold shadow-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Authorize Clearance (Elevate to {req.requested_role})</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. WORKER & ARTISAN VERIFICATION DESK */}
      {subTab === 'workers' && (
        <div className="space-y-4">
          {/* Header Banner */}
          <div className="p-5 bg-[#111A2E] rounded-3xl border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
                    COOPERATIVE WORKER VERIFICATION &amp; ACCREDITATION DESK
                  </h2>
                  <p className="text-xs text-slate-400">
                    Statutory onboarding pipeline enforcing Aadhaar KYC, Police Clearance Certificates, and practical trade competencies.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold px-3 py-1 rounded-xl bg-amber-950/60 border border-amber-800">
                {applications.filter(a => a.status === 'PENDING_REVIEW').length} Awaiting Scrutiny
              </span>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {applications.map((app) => {
              const isPending = app.status === 'PENDING_REVIEW';
              const isApproved = app.status === 'APPROVED';
              const isRejected = app.status === 'REJECTED';

              return (
                <div 
                  key={app.id}
                  className={`p-5 rounded-3xl border bg-[#111A2E] text-white space-y-4 transition-all ${
                    isPending ? 'border-amber-800/80 shadow-lg' : isApproved ? 'border-emerald-800/80' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-amber-400 text-sm">{app.id}</span>
                        <span className="font-bold text-white text-base">{app.workerName}</span>
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          isPending ? 'bg-amber-950 text-amber-300 border-amber-800' : isApproved ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}>
                          {app.status.replace(/_/g, ' ')}
                        </span>
                        {app.emergencyCertifiedRequested && (
                          <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3 text-rose-400" />
                            EMG Requested
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-1">
                        {app.trade} • {app.experienceYears} Years Trade Experience • Applied {app.appliedDate}
                      </div>
                    </div>

                    <div className="text-xs font-mono text-slate-300">
                      <span>Mobile: </span>
                      <span className="text-white font-bold">{app.phone}</span>
                    </div>
                  </div>

                  {/* Document Scrutiny Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-2xl bg-[#0C1322] border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase block">Identity Proof</span>
                      <div className="text-white font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Aadhaar ({app.aadhaarNumber})</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0C1322] border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase block">Law Enforcement Clearance</span>
                      <div className="text-white font-semibold flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        <span className="truncate">{app.policeVerificationFile}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0C1322] border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase block">Trade Accreditation</span>
                      <div className="text-white font-semibold flex items-center gap-1.5 truncate">
                        <Award className="w-3.5 h-3.5 text-sky-400" />
                        <span className="truncate">{app.tradeCertificateFile}</span>
                      </div>
                    </div>
                  </div>

                  {/* Administrative Actions */}
                  {isPending && (
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        Cooperative Committee Scrutiny Protocol Required.
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleScheduleTradeTest(app)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                        >
                          Schedule Trade Test
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(app)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                        >
                          Reject with Reason
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(app)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-lg transition-colors cursor-pointer"
                        >
                          Approve &amp; Enroll Member
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
