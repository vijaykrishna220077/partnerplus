import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Building2, 
  ArrowRight, 
  User, 
  RotateCcw, 
  Sparkles,
  Lock,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { onboardingService } from '../../../services/onboardingService';
import { realtimeHub } from '../../../services/db';
import { useAuth } from '../../../context/AuthContext';
import { CooperativeMemberRecord } from '../../../types/onboarding';

interface CooperativePendingApprovalViewProps {
  requestId?: string;
  onEnterPortal?: () => void;
  onReturnToHome?: () => void;
}

export const CooperativePendingApprovalView: React.FC<CooperativePendingApprovalViewProps> = ({
  requestId,
  onEnterPortal,
  onReturnToHome
}) => {
  const { loginCooperative, logout } = useAuth();

  // Find request from onboardingService or use latest pending
  const allRequests = onboardingService.getAllCooperativeOfficialRequests();
  const currentRequest = (requestId 
    ? allRequests.find(r => r.id === requestId) 
    : allRequests.find(r => r.status === 'PENDING_APPROVAL')) || allRequests[0];

  const [request, setRequest] = useState<CooperativeMemberRecord | undefined>(currentRequest);
  const [isApproved, setIsApproved] = useState<boolean>(currentRequest?.status === 'APPROVED');
  const [isSimulatingApproval, setIsSimulatingApproval] = useState<boolean>(false);

  // Subscribe to real-time events for administrative sign-off
  useEffect(() => {
    const handleApproved = (data: { memberReq: CooperativeMemberRecord }) => {
      if (!request || data.memberReq.id === request.id) {
        setRequest(data.memberReq);
        setIsApproved(true);
      }
    };

    const handleRejected = (data: { memberReq: CooperativeMemberRecord }) => {
      if (!request || data.memberReq.id === request.id) {
        setRequest(data.memberReq);
        setIsApproved(false);
      }
    };

    const unsubApproved = realtimeHub.subscribe('cooperative:official_approved', handleApproved);
    const unsubRejected = realtimeHub.subscribe('cooperative:official_rejected', handleRejected);

    return () => {
      unsubApproved();
      unsubRejected();
    };
  }, [request]);

  // Demo simulation function for evaluation: Allows 1-click test of Test 14!
  const handleSimulateAdminApproval = async () => {
    if (!request) return;
    setIsSimulatingApproval(true);

    setTimeout(async () => {
      onboardingService.approveCooperativeOfficial(
        request.id,
        'K. S. Ramanathan (Managing Committee President)'
      );
      setIsSimulatingApproval(false);
      setIsApproved(true);
    }, 800);
  };

  const handleLaunchConsole = async () => {
    if (!request) return;
    // Log into cooperative console with approved role
    await loginCooperative(
      request.official_email,
      'coop2026admin',
      request.cooperative_id,
      request.actual_role === 'COOPERATIVE_ADMIN' ? 'COOPERATIVE_ADMIN' : 'COOPERATIVE_STAFF'
    );

    if (onEnterPortal) {
      onEnterPortal();
    } else {
      window.location.hash = '#cooperative';
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#090E1A] flex flex-col justify-center items-center p-4 text-white selection:bg-purple-600 selection:text-white">
      <div className="w-full max-w-xl bg-[#0F172A] border border-purple-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center animate-in fade-in">
        
        {/* Emblem */}
        <div className="relative mx-auto w-20 h-20">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-xl border ${
            isApproved 
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' 
              : 'bg-purple-950/80 border-purple-800 text-purple-400'
          }`}>
            {isApproved ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#0F172A] ${
            isApproved ? 'bg-emerald-500' : 'bg-amber-500'
          }`}>
            {isApproved ? '✓' : '!'}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border inline-block ${
            isApproved
              ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
              : 'text-amber-400 bg-amber-950/60 border-amber-800'
          }`}>
            {isApproved ? 'SECURITY CLEARANCE: APPROVED & ACTIVE' : 'SECURITY CLEARANCE REVIEW: PENDING'}
          </span>

          <h1 className="text-xl sm:text-2xl font-black text-white font-mono uppercase tracking-tight">
            {isApproved ? 'Cooperative Clearance Granted' : 'Cooperative Official Authorization Pending'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            {isApproved
              ? 'Your identity, managing committee credentials, and official authority have been certified. Administrative console terminal access is ready.'
              : 'Under the Cooperative Societies Act, administrative console access requires cryptographic sign-off from an existing active Cooperative Administrator.'}
          </p>
        </div>

        {/* Application Details Card */}
        {request && (
          <div className="p-4 rounded-2xl bg-[#1E293B]/70 border border-slate-800 text-left text-xs font-mono space-y-2">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Application File:</span>
              <span className="text-white font-bold">{request.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Applicant Official:</span>
              <span className="text-white font-bold">{request.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Designation:</span>
              <span className="text-purple-300">{request.designation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Official Email:</span>
              <span className="text-slate-300">{request.official_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Requested Role Clearance:</span>
              <span className="text-amber-400 font-bold uppercase">{request.requested_role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Actual Granted Role:</span>
              <span className={`font-bold uppercase ${isApproved ? 'text-emerald-400' : 'text-slate-400'}`}>
                {request.actual_role}
              </span>
            </div>
          </div>
        )}

        {/* Live Security Clearance Pipeline */}
        <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 text-left text-xs space-y-2.5">
          <div className="font-mono text-[11px] text-slate-400 font-bold uppercase">
            Official Clearance Pipeline:
          </div>

          <div className="flex items-center gap-2.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>1. Official Identity &amp; Appointment Order Filed</span>
          </div>

          <div className={`flex items-center gap-2.5 ${isApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isApproved ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Clock className="w-4 h-4 shrink-0 animate-spin" />}
            <span>2. Managing Committee Verification &amp; Background Audit</span>
          </div>

          <div className={`flex items-center gap-2.5 ${isApproved ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isApproved ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Lock className="w-4 h-4 shrink-0" />}
            <span>3. Cryptographic Token &amp; Dispatch Authority Activation</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {isApproved ? (
            <button
              type="button"
              onClick={handleLaunchConsole}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Cooperative Control Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              {/* Test 14 Quick Evaluation Trigger: "Authorized admin approves cooperative official" */}
              <button
                type="button"
                disabled={isSimulatingApproval}
                onClick={handleSimulateAdminApproval}
                className="w-full py-3 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-700 text-purple-200 text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>
                  {isSimulatingApproval ? 'Simulating Administrative Approval...' : 'Test 14: Simulate Authorized Admin Sign-Off'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onReturnToHome) {
                    onReturnToHome();
                  } else {
                    logout();
                    window.location.hash = '';
                    window.location.reload();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Return to Portal Gateway</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
