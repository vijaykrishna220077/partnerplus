import { StructuredWorkerProfile } from '../types/workerSkillRegistry';
import { WorkerJobOpening } from '../data/workerJobData';
import { workerEligibilityService } from './workerEligibilityService';
import { realtimeHub } from './db';
import { 
  CooperativeAuditLog, 
  CooperativeComplaint, 
  WorkerWelfareRecord, 
  CooperativeOperationalRules,
  CooperativeStaffRole 
} from '../types';

export interface JobAssignmentRecord {
  id: string;
  job_id: string;
  worker_id: string;
  worker_name: string;
  assigned_at: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  expected_payout: number;
}

export interface AcceptanceResult {
  success: boolean;
  message: string;
  assignment?: JobAssignmentRecord;
  updatedJob?: WorkerJobOpening;
  allSlotsFilled?: boolean;
}

const INITIAL_AUDIT_LOGS: CooperativeAuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-09-05 09:15 AM',
    adminName: 'K. S. Ramanathan',
    adminRole: 'COOPERATIVE_ADMIN',
    action: 'VERIFICATION_APPROVED',
    affectedEntity: 'Worker KYC',
    entityId: 'wrk-1',
    previousState: 'pending',
    newState: 'verified',
    reason: 'Police clearance and NSDC Level-4 Plumbing certificate validated.'
  },
  {
    id: 'log-102',
    timestamp: '2026-09-05 09:32 AM',
    adminName: 'P. Senthil Murugan',
    adminRole: 'COOPERATIVE_STAFF',
    action: 'EMERGENCY_DISPATCH_MANUAL',
    affectedEntity: 'Job Dispatch',
    entityId: 'SS-2026-901',
    previousState: 'requested',
    newState: 'worker_assigned',
    reason: 'Critical water main valve leak in Anna Nagar. Nearest artisan deployed.'
  },
  {
    id: 'log-103',
    timestamp: '2026-09-04 04:20 PM',
    adminName: 'K. S. Ramanathan',
    adminRole: 'COOPERATIVE_ADMIN',
    action: 'RULES_UPDATED',
    affectedEntity: 'Operational Rules',
    entityId: 'RULES-COOP-1',
    previousState: 'Worker 94% / Welfare 6%',
    newState: 'Worker 95% / Welfare 5%',
    reason: 'General body resolution 2026/08 passed to maximize take-home wages.'
  },
  {
    id: 'log-104',
    timestamp: '2026-09-04 02:10 PM',
    adminName: 'P. Senthil Murugan',
    adminRole: 'COOPERATIVE_STAFF',
    action: 'DISPUTE_RESOLVED',
    affectedEntity: 'Complaint Resolution',
    entityId: 'CMP-2026-041',
    previousState: 'UNDER_REVIEW',
    newState: 'RESOLVED',
    reason: 'Mutual agreement reached. Replaced fitting free of charge under guarantee.'
  }
];

const INITIAL_COMPLAINTS: CooperativeComplaint[] = [
  {
    id: 'CMP-2026-041',
    reportedBy: 'Vijay Madhesh',
    reporterType: 'customer',
    relatedBookingId: 'bk-901',
    category: 'Service Quality',
    priority: 'HIGH',
    createdAt: '2026-09-04 11:20 AM',
    assignedStaff: 'P. Senthil Murugan',
    status: 'RESOLVED',
    description: 'Minor drip noticed after valve replacement. Requested quick check.',
    resolutionNotes: 'Artisan visited within 40 minutes, reseated the Teflon seal. Customer confirmed 100% satisfaction.'
  },
  {
    id: 'CMP-2026-042',
    reportedBy: 'Murugan Thangaraj',
    reporterType: 'worker',
    relatedBookingId: 'bk-902',
    category: 'Payment Dispute',
    priority: 'MEDIUM',
    createdAt: '2026-09-05 08:45 AM',
    assignedStaff: 'P. Senthil Murugan',
    status: 'UNDER_REVIEW',
    description: 'Customer UPI transaction was deducted from customer account but delayed in cooperative gateway.',
    resolutionNotes: 'Bank reference UTR retrieved. Cooperative escrow cleared payout to worker wallet.'
  },
  {
    id: 'CMP-2026-043',
    reportedBy: 'Ananya Sundaram',
    reporterType: 'customer',
    relatedBookingId: 'bk-903',
    category: 'Worker Behaviour',
    priority: 'LOW',
    createdAt: '2026-09-05 09:10 AM',
    assignedStaff: 'K. S. Ramanathan',
    status: 'OPEN',
    description: 'Worker arrived without standard shoe covers for living room carpet area.',
    resolutionNotes: ''
  },
  {
    id: 'CMP-2026-044',
    reportedBy: 'Ravi Kumar',
    reporterType: 'worker',
    relatedBookingId: 'bk-901',
    category: 'Safety Issue',
    priority: 'CRITICAL',
    createdAt: '2026-09-03 03:30 PM',
    assignedStaff: 'K. S. Ramanathan',
    status: 'RESOLVED',
    description: 'Exposed high voltage wiring near rooftop water tank. Work halted until power switched off.',
    resolutionNotes: 'Society EB lineman called to isolate main power. Work completed safely.'
  }
];

const INITIAL_WELFARE_RECORDS: WorkerWelfareRecord[] = [
  {
    id: 'welf-1',
    workerId: 'wrk-1',
    workerName: 'Ravi Kumar',
    trade: 'Plumbing & Pipefitting',
    contributionThisMonth: 1240,
    accumulatedWelfare: 18450,
    insuranceScheme: 'PMSBY (Accident ₹2L) + Ayushman Gold',
    benefitsStatus: 'ACTIVE_COVERAGE',
    lastContributionDate: '2026-09-05'
  },
  {
    id: 'welf-2',
    workerId: 'wrk-2',
    workerName: 'Murugan Thangaraj',
    trade: 'Electrical & Wireman',
    contributionThisMonth: 1480,
    accumulatedWelfare: 22100,
    insuranceScheme: 'PMSBY (Accident ₹2L) + Co-op Health Aid',
    benefitsStatus: 'ACTIVE_COVERAGE',
    lastContributionDate: '2026-09-05'
  },
  {
    id: 'welf-3',
    workerId: 'wrk-3',
    workerName: 'Kavita Sundaram',
    trade: 'Gardening & Horticulture',
    contributionThisMonth: 890,
    accumulatedWelfare: 12400,
    insuranceScheme: 'Tamil Nadu Unorganised Workers Welfare Board',
    benefitsStatus: 'ACTIVE_COVERAGE',
    lastContributionDate: '2026-09-04'
  },
  {
    id: 'welf-4',
    workerId: 'wrk-4',
    workerName: 'Selvam Arumugam',
    trade: 'Carpentry & Joinery',
    contributionThisMonth: 1100,
    accumulatedWelfare: 15600,
    insuranceScheme: 'PMSBY + Children Scholarship Grant',
    benefitsStatus: 'ACTIVE_COVERAGE',
    lastContributionDate: '2026-09-03'
  }
];

/**
 * Backend-Ready Service for Atomic Job Assignment and Verification
 * Enforces Rule 22: "The frontend must NEVER be the final authority for worker eligibility."
 */
class CooperativeBackendService {
  private assignments: JobAssignmentRecord[] = [];
  private activeJobsMap: Map<string, string> = new Map();
  private auditLogs: CooperativeAuditLog[] = [...INITIAL_AUDIT_LOGS];
  private complaints: CooperativeComplaint[] = [...INITIAL_COMPLAINTS];
  private welfareRecords: WorkerWelfareRecord[] = [...INITIAL_WELFARE_RECORDS];
  private operationalRules: CooperativeOperationalRules = {
    workerSharePercentage: 95,
    welfareSharePercentage: 5,
    welfareContributionPercentage: 5,
    cooperativeSharePercentage: 0,
    emergencyPriorityFee: 49,
    maxEmergencyEtaMins: 25,
    serviceRadiusKm: 15,
    maxTravelRadiusKm: 15,
    emergencyResponseTimeTargetMinutes: 25
  };

  /**
   * Atomically verifies worker eligibility and assigns worker to the job slot.
   */
  async processJobAcceptance(
    worker: StructuredWorkerProfile,
    job: WorkerJobOpening
  ): Promise<AcceptanceResult> {
    if (!worker || !worker.id) {
      return { success: false, message: 'Backend Error: Worker profile not found.' };
    }

    if (!worker.availability_status) {
      return { success: false, message: 'Backend Error: Worker is currently offline.' };
    }

    if (this.activeJobsMap.has(worker.id)) {
      return { 
        success: false, 
        message: 'Backend Error: Worker already has an active ongoing assignment.' 
      };
    }

    const eligibility = workerEligibilityService.evaluateWorkerEligibility(worker, job, false);
    if (!eligibility.eligible) {
      return {
        success: false,
        message: `Backend Eligibility Failure: ${eligibility.rejectionReason || 'Worker does not qualify for this task.'}`
      };
    }

    const currentAssigned = job.workersAssigned;
    const requiredWorkers = job.workersRequired;

    if (currentAssigned >= requiredWorkers) {
      return {
        success: false,
        message: 'This job opportunity has just been filled by another cooperative member.'
      };
    }

    const newAssignedCount = currentAssigned + 1;
    const allFilled = newAssignedCount >= requiredWorkers;

    const updatedJob: WorkerJobOpening = {
      ...job,
      workersAssigned: newAssignedCount,
      status: allFilled ? 'assigned' : 'open'
    };

    const assignment: JobAssignmentRecord = {
      id: `assign-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      job_id: job.id,
      worker_id: worker.id,
      worker_name: worker.name,
      assigned_at: new Date().toISOString(),
      status: 'assigned',
      expected_payout: job.workerExpectedEarning
    };

    this.assignments.push(assignment);
    this.activeJobsMap.set(worker.id, job.id);

    // Notify real-time hub
    realtimeHub.emit('sahakari:job_assigned', {
      assignment,
      job: updatedJob,
      workerId: worker.id,
      allSlotsFilled: allFilled
    });

    this.addAuditLog({
      adminName: 'Automated Dispatch Engine',
      adminRole: 'COOPERATIVE_ADMIN',
      action: 'JOB_ASSIGNMENT_MATCHED',
      affectedEntity: 'Job Assignment',
      entityId: job.id,
      previousState: 'open',
      newState: allFilled ? 'assigned' : 'open',
      reason: `Matched qualified artisan ${worker.name} (Score: ${eligibility.suitabilityScore}%)`
    });

    return {
      success: true,
      message: `Assignment confirmed for ${worker.name}. Slot reserved successfully.`,
      assignment,
      updatedJob,
      allSlotsFilled: allFilled
    };
  }

  /**
   * Releases worker occupancy upon job completion or cancellation
   */
  completeJobAssignment(workerId: string, jobId: string) {
    this.activeJobsMap.delete(workerId);
    const assignment = this.assignments.find(a => a.worker_id === workerId && a.job_id === jobId);
    if (assignment) {
      assignment.status = 'completed';
    }
  }

  isWorkerOccupied(workerId: string): boolean {
    return this.activeJobsMap.has(workerId);
  }

  // --- AUDIT LOGS ---
  getAuditLogs(): CooperativeAuditLog[] {
    return [...this.auditLogs];
  }

  addAuditLog(entry: Omit<CooperativeAuditLog, 'id' | 'timestamp'>): CooperativeAuditLog {
    const newLog: CooperativeAuditLog = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    this.auditLogs.unshift(newLog);
    realtimeHub.emit('sahakari:audit_logged', newLog);
    return newLog;
  }

  // --- COMPLAINTS ---
  getComplaints(): CooperativeComplaint[] {
    return [...this.complaints];
  }

  updateComplaintStatus(
    id: string, 
    status: CooperativeComplaint['status'], 
    resolutionNotes?: string, 
    adminName: string = 'Cooperative Admin',
    adminRole: CooperativeStaffRole = 'COOPERATIVE_STAFF'
  ): boolean {
    const c = this.complaints.find(item => item.id === id);
    if (!c) return false;
    const oldStatus = c.status;
    c.status = status;
    if (resolutionNotes) {
      c.resolutionNotes = resolutionNotes;
    }

    this.addAuditLog({
      adminName,
      adminRole,
      action: 'COMPLAINT_STATUS_UPDATED',
      affectedEntity: 'Complaint Resolution',
      entityId: id,
      previousState: oldStatus,
      newState: status,
      reason: resolutionNotes || `Status transitioned to ${status}`
    });

    realtimeHub.emit('sahakari:complaint_updated', c);
    return true;
  }

  updateWelfareClaimStatus(
    id: string,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    adminName: string = 'Cooperative Admin',
    reason?: string
  ): boolean {
    const claim = this.welfareRecords.find(w => w.id === id);
    if (!claim) return false;
    claim.status = status;
    claim.adjudicatedBy = adminName;
    if (reason) claim.notes = reason;

    this.addAuditLog({
      adminName,
      adminRole: 'COOPERATIVE_ADMIN',
      action: `WELFARE_CLAIM_${status}`,
      affectedEntity: 'Welfare Reserve Disbursement',
      entityId: id,
      newState: status,
      reason: reason || `Claim ${status.toLowerCase()} by ${adminName}`
    });

    realtimeHub.emit('sahakari:welfare_updated', claim);
    return true;
  }

  assignComplaint(id: string, staffName: string, adminName: string, adminRole: CooperativeStaffRole): boolean {
    const c = this.complaints.find(item => item.id === id);
    if (!c) return false;
    c.assignedStaff = staffName;
    this.addAuditLog({
      adminName,
      adminRole,
      action: 'COMPLAINT_ASSIGNED',
      affectedEntity: 'Dispute Officer',
      entityId: id,
      newState: staffName,
      reason: `Assigned official dispute investigation officer`
    });
    realtimeHub.emit('sahakari:complaint_updated', c);
    return true;
  }

  // --- WELFARE RECORDS ---
  getWelfareRecords(): WorkerWelfareRecord[] {
    return [...this.welfareRecords];
  }

  getWelfareSummary() {
    const totalBalance = 420000;
    const generatedThisMonth = this.welfareRecords.reduce((sum, r) => sum + r.contributionThisMonth, 0) + 38450;
    const activeWorkersCovered = 1388;
    const pendingClaims = 2;
    return {
      totalBalance,
      generatedThisMonth,
      activeWorkersCovered,
      pendingClaims
    };
  }

  // --- OPERATIONAL RULES ---
  getRules(): CooperativeOperationalRules {
    return { ...this.operationalRules };
  }

  updateRules(newRules: Partial<CooperativeOperationalRules>, adminName: string): boolean {
    const oldRulesStr = `Worker: ${this.operationalRules.workerSharePercentage}%, Welfare: ${this.operationalRules.welfareSharePercentage}%`;
    this.operationalRules = {
      ...this.operationalRules,
      ...newRules
    };
    const newRulesStr = `Worker: ${this.operationalRules.workerSharePercentage}%, Welfare: ${this.operationalRules.welfareSharePercentage}%`;

    this.addAuditLog({
      adminName,
      adminRole: 'COOPERATIVE_ADMIN',
      action: 'RULES_UPDATED',
      affectedEntity: 'Cooperative Governance Rules',
      entityId: 'RULES-CURRENT',
      previousState: oldRulesStr,
      newState: newRulesStr,
      reason: 'Official cooperative parameter revision saved by executive board.'
    });

    realtimeHub.emit('sahakari:rules_updated', this.operationalRules);
    return true;
  }

  // --- MANUAL DISPATCH INTERVENTION ---
  manualInterveneJob(
    jobId: string, 
    workerId: string, 
    workerName: string, 
    adminName: string, 
    reason: string
  ): { success: boolean; message: string } {
    this.activeJobsMap.set(workerId, jobId);
    this.addAuditLog({
      adminName,
      adminRole: 'COOPERATIVE_ADMIN',
      action: 'MANUAL_DISPATCH_OVERRIDE',
      affectedEntity: 'Job Dispatch Intervention',
      entityId: jobId,
      newState: `Assigned to ${workerName} (${workerId})`,
      reason: reason || 'Cooperative official manual intervention'
    });

    realtimeHub.emit('sahakari:job_manual_assigned', {
      jobId,
      workerId,
      workerName,
      adminName,
      reason
    });

    return {
      success: true,
      message: `Manual assignment confirmed for ${workerName} on job ${jobId}.`
    };
  }
}

export const cooperativeBackend = new CooperativeBackendService();
export const cooperativeBackendService = cooperativeBackend;
