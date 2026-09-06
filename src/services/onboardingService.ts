import { 
  UserAccount, 
  CustomerProfile, 
  WorkerProfileRecord, 
  WorkerSkillRecord, 
  WorkerCertificationRecord, 
  WorkerDocumentRecord, 
  OrganizationProfileRecord, 
  CooperativeMemberRecord, 
  AuditLogRecord 
} from '../types/onboarding';
import { realtimeHub } from './db';
import { mockCooperatives } from '../data/mockData';

const ONBOARDING_STORAGE_KEYS = {
  USERS: 'sahakari_users_v2',
  CUSTOMERS: 'sahakari_customer_profiles_v2',
  WORKERS: 'sahakari_worker_profiles_v2',
  WORKER_SKILLS: 'sahakari_worker_skills_v2',
  WORKER_CERTS: 'sahakari_worker_certifications_v2',
  WORKER_DOCS: 'sahakari_worker_documents_v2',
  ORGANIZATIONS: 'sahakari_organization_profiles_v2',
  COOPERATIVE_MEMBERS: 'sahakari_cooperative_members_v2',
  AUDIT_LOGS: 'sahakari_audit_logs_v2'
};

function readTable<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeTable<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage write error for', key, err);
  }
}

// Initial seed data for pre-existing accounts
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-w1',
    auth_user_id: 'auth-w1',
    email: 'murugan.artisan@sahakariseva.org',
    phone: '+91 98412 34567',
    role: 'WORKER',
    account_status: 'ACTIVE',
    email_verified: true,
    phone_verified: true,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z'
  },
  {
    id: 'user-c1',
    auth_user_id: 'auth-c1',
    email: 'ananya.sharma@gmail.com',
    phone: '+91 94440 12345',
    role: 'CUSTOMER',
    account_status: 'ACTIVE',
    email_verified: true,
    phone_verified: true,
    created_at: '2025-01-15T12:00:00Z',
    updated_at: '2025-01-15T12:00:00Z'
  },
  {
    id: 'user-admin1',
    auth_user_id: 'auth-admin1',
    email: 'admin.ramanathan@chennailabourcoop.org',
    phone: '+91 44 2615 8890',
    role: 'COOPERATIVE_ADMIN',
    account_status: 'ACTIVE',
    email_verified: true,
    phone_verified: true,
    created_at: '2024-03-01T09:00:00Z',
    updated_at: '2024-03-01T09:00:00Z'
  },
  {
    id: 'user-org1',
    auth_user_id: 'auth-org1',
    email: 'priya.n@ltfacilities.co.in',
    phone: '+91 98422 77110',
    role: 'ORGANIZATION_ADMIN',
    account_status: 'ACTIVE',
    email_verified: true,
    phone_verified: true,
    created_at: '2024-10-05T14:00:00Z',
    updated_at: '2024-10-05T14:00:00Z'
  }
];

class OnboardingService {
  private users: UserAccount[];
  private customers: CustomerProfile[];
  private workers: WorkerProfileRecord[];
  private workerSkills: WorkerSkillRecord[];
  private workerCerts: WorkerCertificationRecord[];
  private workerDocs: WorkerDocumentRecord[];
  private organizations: OrganizationProfileRecord[];
  private cooperativeMembers: CooperativeMemberRecord[];
  private auditLogs: AuditLogRecord[];

  constructor() {
    this.users = readTable(ONBOARDING_STORAGE_KEYS.USERS, INITIAL_USERS);
    this.customers = readTable(ONBOARDING_STORAGE_KEYS.CUSTOMERS, []);
    this.workers = readTable(ONBOARDING_STORAGE_KEYS.WORKERS, []);
    this.workerSkills = readTable(ONBOARDING_STORAGE_KEYS.WORKER_SKILLS, []);
    this.workerCerts = readTable(ONBOARDING_STORAGE_KEYS.WORKER_CERTS, []);
    this.workerDocs = readTable(ONBOARDING_STORAGE_KEYS.WORKER_DOCS, []);
    this.organizations = readTable(ONBOARDING_STORAGE_KEYS.ORGANIZATIONS, []);
    this.cooperativeMembers = readTable(ONBOARDING_STORAGE_KEYS.COOPERATIVE_MEMBERS, [
      {
        id: 'coop-mem-demo-1',
        cooperative_id: 'coop-1',
        user_id: 'user-coop-pending-1',
        full_name: 'V. Sundaram',
        official_email: 'sundaram.secretary@chennailabourcoop.org',
        phone: '+91 98401 22334',
        designation: 'Joint Secretary & Compliance Inspector',
        requested_role: 'COOPERATIVE_ADMIN',
        actual_role: 'PENDING',
        status: 'PENDING_APPROVAL',
        reason_for_access: 'Elected as Joint Secretary by General Body. Requires oversight of dispatch audits and dispute settlements.',
        supporting_documents: ['Govt_Gazette_Election_Order.pdf', 'Official_ID_Card.jpg'],
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      }
    ]);
    this.auditLogs = readTable(ONBOARDING_STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'audit-init-1',
        timestamp: new Date().toISOString(),
        user: 'System Setup',
        action: 'PLATFORM_SECURITY_INITIALIZED',
        entity: 'AUTH_SUBSYSTEM',
        status: 'SUCCESS',
        details: 'Multi-role authentication, separation of concerns, and credential storage initialized.'
      }
    ]);
  }

  private save() {
    writeTable(ONBOARDING_STORAGE_KEYS.USERS, this.users);
    writeTable(ONBOARDING_STORAGE_KEYS.CUSTOMERS, this.customers);
    writeTable(ONBOARDING_STORAGE_KEYS.WORKERS, this.workers);
    writeTable(ONBOARDING_STORAGE_KEYS.WORKER_SKILLS, this.workerSkills);
    writeTable(ONBOARDING_STORAGE_KEYS.WORKER_CERTS, this.workerCerts);
    writeTable(ONBOARDING_STORAGE_KEYS.WORKER_DOCS, this.workerDocs);
    writeTable(ONBOARDING_STORAGE_KEYS.ORGANIZATIONS, this.organizations);
    writeTable(ONBOARDING_STORAGE_KEYS.COOPERATIVE_MEMBERS, this.cooperativeMembers);
    writeTable(ONBOARDING_STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
  }

  public recordAuditLog(log: Omit<AuditLogRecord, 'id' | 'timestamp'>) {
    const entry: AuditLogRecord = {
      ...log,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(entry);
    this.save();
    realtimeHub.emit('audit:logged', entry);
  }

  public getAuditLogs(): AuditLogRecord[] {
    return [...this.auditLogs];
  }

  /**
   * Check if phone or email already registered
   */
  public checkDuplicate(email: string, phone: string): { duplicate: boolean; field?: 'email' | 'phone'; message?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    const existingEmail = cleanEmail ? this.users.find(u => u.email.toLowerCase() === cleanEmail) : null;
    if (existingEmail) {
      return { duplicate: true, field: 'email', message: 'An account with this email address already exists.' };
    }

    const existingPhone = cleanPhone ? this.users.find(u => u.phone.replace(/\D/g, '') === cleanPhone) : null;
    if (existingPhone) {
      return { duplicate: true, field: 'phone', message: 'An account with this mobile number already exists.' };
    }

    return { duplicate: false };
  }

  /**
   * 1. Register Customer Flow
   */
  public async registerCustomer(params: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    preferredLanguage: string;
    profilePhotoUrl?: string;
    notificationPreferences?: { sms: boolean; whatsapp: boolean; in_app: boolean };
  }): Promise<{ success: boolean; user?: UserAccount; profile?: CustomerProfile; message?: string }> {
    const dup = this.checkDuplicate(params.email, params.phone);
    if (dup.duplicate) {
      return { success: false, message: dup.message };
    }

    const userId = `user-c-${Date.now()}`;
    const authUserId = `auth-${Date.now()}`;
    const now = new Date().toISOString();

    const newUser: UserAccount = {
      id: userId,
      auth_user_id: authUserId,
      email: params.email.trim().toLowerCase(),
      phone: params.phone.trim(),
      role: 'CUSTOMER',
      account_status: 'ACTIVE',
      email_verified: true,
      phone_verified: true,
      created_at: now,
      updated_at: now
    };

    const newProfile: CustomerProfile = {
      id: `cust-prof-${Date.now()}`,
      user_id: userId,
      full_name: params.fullName.trim(),
      profile_photo_url: params.profilePhotoUrl,
      phone: params.phone.trim(),
      email: params.email.trim().toLowerCase(),
      address: params.address.trim(),
      city: params.city.trim(),
      state: params.state.trim() || 'Tamil Nadu',
      postal_code: params.postalCode.trim(),
      preferred_language: params.preferredLanguage || 'en',
      notification_preferences: params.notificationPreferences || { sms: true, whatsapp: true, in_app: true },
      created_at: now,
      updated_at: now
    };

    this.users.unshift(newUser);
    this.customers.unshift(newProfile);
    this.recordAuditLog({
      user: params.fullName,
      action: 'CUSTOMER_REGISTERED',
      entity: 'USERS & CUSTOMER_PROFILES',
      status: 'ACTIVE',
      details: `Customer registered in ${params.city} with verified phone & OTP.`
    });
    this.save();
    realtimeHub.emit('customer:registered', { user: newUser, profile: newProfile });

    return { success: true, user: newUser, profile: newProfile };
  }

  /**
   * 2. Register Worker Flow (Mobile-First, Photo, Skills, Certs, Docs)
   */
  public async registerWorker(params: {
    fullName: string;
    phone: string;
    email?: string;
    dateOfBirth?: string;
    gender?: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    preferredLanguage: string;
    profilePhotoPath?: string;
    profilePhotoUrl?: string;
    workerType: 'skilled' | 'semi_skilled' | 'general';
    primarySkill: { id: string; name: string; years: number; level: 'beginner' | 'intermediate' | 'expert' };
    additionalSkills: Array<{ id: string; name: string; years: number; level: 'beginner' | 'intermediate' | 'expert' }>;
    certifications?: Array<{ title: string; issuedBy: string; year: string; documentUrl?: string }>;
    documents?: Array<{ type: 'identity_proof' | 'address_proof' | 'skill_certificate' | 'training_certificate' | 'other'; name: string; path: string }>;
    availability: {
      availableToday: boolean;
      workingDays: string[];
      startTime: string;
      endTime: string;
      emergencyAvailable: boolean;
      serviceRadiusKm: number;
    };
    locationPermissionGranted: boolean;
    payout: {
      method: 'bank_account' | 'upi' | 'cooperative_passbook';
      identifier: string;
    };
    cooperativeId?: string;
  }): Promise<{ success: boolean; user?: UserAccount; workerProfile?: WorkerProfileRecord; message?: string }> {
    const dup = this.checkDuplicate(params.email || '', params.phone);
    if (dup.duplicate) {
      return { success: false, message: dup.message };
    }

    const userId = `user-w-${Date.now()}`;
    const authUserId = `auth-${Date.now()}`;
    const workerId = `wrk-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const selectedCoop = mockCooperatives.find(c => c.id === params.cooperativeId) || mockCooperatives[0];

    // 1. Central users record
    const newUser: UserAccount = {
      id: userId,
      auth_user_id: authUserId,
      email: params.email?.trim().toLowerCase() || `${params.phone.replace(/\D/g, '')}@sahakariseva.org`,
      phone: params.phone.trim(),
      role: 'WORKER',
      account_status: 'PENDING_VERIFICATION',
      email_verified: !!params.email,
      phone_verified: true,
      created_at: now,
      updated_at: now
    };

    // 2. Worker Profile record
    const newWorkerProfile: WorkerProfileRecord = {
      id: workerId,
      user_id: userId,
      full_name: params.fullName.trim(),
      phone: params.phone.trim(),
      email: params.email?.trim(),
      profile_photo_path: params.profilePhotoPath,
      profile_photo_url: params.profilePhotoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      worker_type: params.workerType,
      primary_skill_id: params.primarySkill.id,
      primary_skill_label: params.primarySkill.name,
      experience_years: params.primarySkill.years,
      verification_status: 'PENDING',
      account_status: 'PENDING_VERIFICATION',
      emergency_available: params.availability.emergencyAvailable,
      service_radius: params.availability.serviceRadiusKm || 10,
      preferred_language: params.preferredLanguage || 'en',
      date_of_birth: params.dateOfBirth,
      gender: params.gender,
      address: params.address.trim(),
      city: params.city.trim(),
      state: params.state.trim() || 'Tamil Nadu',
      postal_code: params.postalCode.trim(),
      location_permission_granted: params.locationPermissionGranted,
      working_days: params.availability.workingDays,
      working_hours: {
        start: params.availability.startTime,
        end: params.availability.endTime
      },
      payout_method: params.payout.method,
      payout_identifier: params.payout.identifier,
      cooperative_id: selectedCoop.id,
      cooperative_name: selectedCoop.name,
      created_at: now,
      updated_at: now
    };

    // 3. Worker skills table
    const skillsToInsert: WorkerSkillRecord[] = [
      {
        id: `w-sk-${Date.now()}-1`,
        worker_id: workerId,
        skill_id: params.primarySkill.id,
        skill_name: params.primarySkill.name,
        skill_level: params.primarySkill.level,
        years_experience: params.primarySkill.years,
        is_primary: true,
        verification_status: 'PENDING',
        created_at: now
      },
      ...params.additionalSkills.map((sk, idx) => ({
        id: `w-sk-${Date.now()}-${idx + 2}`,
        worker_id: workerId,
        skill_id: sk.id,
        skill_name: sk.name,
        skill_level: sk.level,
        years_experience: sk.years,
        is_primary: false,
        verification_status: 'PENDING' as const,
        created_at: now
      }))
    ];

    // 4. Worker certifications
    const certsToInsert: WorkerCertificationRecord[] = (params.certifications || []).map((c, idx) => ({
      id: `w-cert-${Date.now()}-${idx}`,
      worker_id: workerId,
      certificate_name: c.title,
      issuing_organization: c.issuedBy,
      issue_date: c.year,
      document_url: c.documentUrl,
      verification_status: 'PENDING',
      created_at: now
    }));

    // 5. Worker documents
    const docsToInsert: WorkerDocumentRecord[] = (params.documents || []).map((d, idx) => ({
      id: `w-doc-${Date.now()}-${idx}`,
      worker_id: workerId,
      document_type: d.type,
      document_name: d.name,
      storage_path: d.path,
      verification_status: 'PENDING',
      uploaded_at: now
    }));

    this.users.unshift(newUser);
    this.workers.unshift(newWorkerProfile);
    this.workerSkills.push(...skillsToInsert);
    this.workerCerts.push(...certsToInsert);
    this.workerDocs.push(...docsToInsert);

    this.recordAuditLog({
      user: params.fullName,
      action: 'WORKER_REGISTERED_PENDING_VERIFICATION',
      entity: 'WORKER_PROFILES',
      status: 'PENDING',
      details: `Worker ${params.fullName} registered under ${selectedCoop.name}. Trade: ${params.primarySkill.name}. Status: PENDING.`
    });
    this.save();
    realtimeHub.emit('worker:registered', { user: newUser, profile: newWorkerProfile, skills: skillsToInsert });

    return { success: true, user: newUser, workerProfile: newWorkerProfile };
  }

  /**
   * 3. Register Organization / Company Flow
   */
  public async registerOrganization(params: {
    organizationName: string;
    legalName: string;
    organizationType: any;
    registrationNumber?: string;
    gstNumber?: string;
    contactPerson: string;
    designation: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    website?: string;
    description: string;
    supportingDocumentName?: string;
  }): Promise<{ success: boolean; user?: UserAccount; profile?: OrganizationProfileRecord; message?: string }> {
    const dup = this.checkDuplicate(params.email, params.phone);
    if (dup.duplicate) {
      return { success: false, message: dup.message };
    }

    const userId = `user-org-${Date.now()}`;
    const authUserId = `auth-${Date.now()}`;
    const orgId = `org-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const newUser: UserAccount = {
      id: userId,
      auth_user_id: authUserId,
      email: params.email.trim().toLowerCase(),
      phone: params.phone.trim(),
      role: 'ORGANIZATION_ADMIN',
      requested_role: 'ORGANIZATION_ADMIN',
      account_status: 'PENDING_VERIFICATION',
      email_verified: true,
      phone_verified: true,
      created_at: now,
      updated_at: now
    };

    const newOrgProfile: OrganizationProfileRecord = {
      id: orgId,
      user_id: userId,
      organization_name: params.organizationName.trim(),
      legal_name: params.legalName.trim(),
      organization_type: params.organizationType,
      registration_number: params.registrationNumber?.trim(),
      gst_number: params.gstNumber?.trim(),
      contact_person: params.contactPerson.trim(),
      designation: params.designation.trim(),
      phone: params.phone.trim(),
      email: params.email.trim().toLowerCase(),
      address: params.address.trim(),
      city: params.city.trim(),
      state: params.state.trim() || 'Tamil Nadu',
      postal_code: params.postalCode.trim(),
      website: params.website?.trim(),
      description: params.description.trim(),
      supporting_document_name: params.supportingDocumentName || 'Incorporation_GST_Cert.pdf',
      verification_status: 'PENDING',
      created_at: now,
      updated_at: now
    };

    this.users.unshift(newUser);
    this.organizations.unshift(newOrgProfile);
    this.recordAuditLog({
      user: params.contactPerson,
      action: 'ORGANIZATION_REGISTERED_PENDING_VERIFICATION',
      entity: 'ORGANIZATION_PROFILES',
      status: 'PENDING_VERIFICATION',
      details: `Company ${params.organizationName} registered by ${params.contactPerson}. Status: PENDING_VERIFICATION.`
    });
    this.save();
    realtimeHub.emit('organization:registered', { user: newUser, profile: newOrgProfile });

    return { success: true, user: newUser, profile: newOrgProfile };
  }

  /**
   * 4. Register Cooperative Official Flow (Approval-Based Security)
   */
  public async registerCooperativeOfficial(params: {
    cooperativeName: string;
    registrationNumber: string;
    cooperativeAddress: string;
    city: string;
    state: string;
    postalCode: string;
    officialEmail: string;
    phone: string;
    contactPerson: string;
    designation: string;
    requestedRole: 'COOPERATIVE_ADMIN' | 'COOPERATIVE_STAFF' | 'AUTHORIZED_REPRESENTATIVE';
    reasonForAccess: string;
    supportingDocuments: string[];
    cooperativeId?: string;
  }): Promise<{ success: boolean; user?: UserAccount; memberRequest?: CooperativeMemberRecord; message?: string }> {
    const dup = this.checkDuplicate(params.officialEmail, params.phone);
    if (dup.duplicate) {
      return { success: false, message: dup.message };
    }

    const userId = `user-coop-${Date.now()}`;
    const authUserId = `auth-${Date.now()}`;
    const memberRequestId = `coop-req-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    // User is created with PENDING role & PENDING_APPROVAL status.
    // Privileged access is NOT granted automatically!
    const newUser: UserAccount = {
      id: userId,
      auth_user_id: authUserId,
      email: params.officialEmail.trim().toLowerCase(),
      phone: params.phone.trim(),
      role: 'PENDING',
      requested_role: params.requestedRole,
      account_status: 'PENDING_APPROVAL',
      email_verified: true,
      phone_verified: true,
      created_at: now,
      updated_at: now
    };

    const newMemberRequest: CooperativeMemberRecord = {
      id: memberRequestId,
      cooperative_id: params.cooperativeId || 'coop-1',
      user_id: userId,
      full_name: params.contactPerson.trim(),
      official_email: params.officialEmail.trim().toLowerCase(),
      phone: params.phone.trim(),
      designation: params.designation.trim(),
      requested_role: params.requestedRole,
      actual_role: 'PENDING',
      status: 'PENDING_APPROVAL',
      reason_for_access: params.reasonForAccess.trim(),
      supporting_documents: params.supportingDocuments.length > 0 ? params.supportingDocuments : ['Cooperative_Appointment_Letter.pdf'],
      created_at: now
    };

    this.users.unshift(newUser);
    this.cooperativeMembers.unshift(newMemberRequest);
    this.recordAuditLog({
      user: params.contactPerson,
      action: 'COOPERATIVE_OFFICIAL_REQUEST_SUBMITTED',
      entity: 'COOPERATIVE_MEMBERS',
      status: 'PENDING_APPROVAL',
      details: `Official application from ${params.contactPerson} (${params.designation}) for ${params.requestedRole}. Access held until authorized approval.`
    });
    this.save();
    realtimeHub.emit('cooperative:official_requested', { user: newUser, request: newMemberRequest });

    return { success: true, user: newUser, memberRequest: newMemberRequest };
  }

  /**
   * Cooperative Admin approves official application
   */
  public approveCooperativeOfficial(requestId: string, approvedBy: string): boolean {
    const memberReq = this.cooperativeMembers.find(m => m.id === requestId);
    if (!memberReq) return false;

    const targetRole = memberReq.requested_role === 'COOPERATIVE_ADMIN' ? 'COOPERATIVE_ADMIN' : 'COOPERATIVE_STAFF';
    memberReq.status = 'APPROVED';
    memberReq.actual_role = targetRole;
    memberReq.approved_by = approvedBy;
    memberReq.approved_at = new Date().toISOString();

    const user = this.users.find(u => u.id === memberReq.user_id);
    if (user) {
      user.role = targetRole;
      user.account_status = 'ACTIVE';
      user.updated_at = new Date().toISOString();
    }

    this.recordAuditLog({
      user: approvedBy,
      action: 'COOPERATIVE_OFFICIAL_APPROVED',
      entity: 'COOPERATIVE_MEMBERS',
      status: 'APPROVED',
      details: `Official application ${requestId} for ${memberReq.full_name} approved as ${targetRole}.`
    });
    this.save();
    realtimeHub.emit('cooperative:official_approved', { memberReq, user });
    return true;
  }

  /**
   * Cooperative Admin rejects official application
   */
  public rejectCooperativeOfficial(requestId: string, rejectedBy: string, reason: string): boolean {
    const memberReq = this.cooperativeMembers.find(m => m.id === requestId);
    if (!memberReq) return false;

    memberReq.status = 'REJECTED';
    memberReq.actual_role = 'PENDING';

    const user = this.users.find(u => u.id === memberReq.user_id);
    if (user) {
      user.account_status = 'REJECTED';
      user.updated_at = new Date().toISOString();
    }

    this.recordAuditLog({
      user: rejectedBy,
      action: 'COOPERATIVE_OFFICIAL_REJECTED',
      entity: 'COOPERATIVE_MEMBERS',
      status: 'REJECTED',
      details: `Application ${requestId} for ${memberReq.full_name} rejected. Reason: ${reason}`
    });
    this.save();
    realtimeHub.emit('cooperative:official_rejected', { memberReq, user });
    return true;
  }

  /**
   * Approve organization compliance
   */
  public verifyOrganization(orgId: string, verifiedBy: string): boolean {
    const org = this.organizations.find(o => o.id === orgId);
    if (!org) return false;

    org.verification_status = 'VERIFIED';
    org.verified_at = new Date().toISOString();
    org.verified_by = verifiedBy;
    org.updated_at = new Date().toISOString();

    const user = this.users.find(u => u.id === org.user_id);
    if (user) {
      user.account_status = 'ACTIVE';
      user.updated_at = new Date().toISOString();
    }

    this.recordAuditLog({
      user: verifiedBy,
      action: 'ORGANIZATION_VERIFIED',
      entity: 'ORGANIZATION_PROFILES',
      status: 'VERIFIED',
      details: `Enterprise compliance verified for ${org.organization_name}.`
    });
    this.save();
    realtimeHub.emit('organization:verified', org);
    return true;
  }

  /**
   * Approve worker verification
   */
  public verifyWorker(workerId: string, verifiedBy: string): boolean {
    const worker = this.workers.find(w => w.id === workerId);
    if (!worker) return false;

    worker.verification_status = 'VERIFIED';
    worker.account_status = 'ACTIVE';
    worker.updated_at = new Date().toISOString();

    // Verify skills
    this.workerSkills.filter(s => s.worker_id === workerId).forEach(s => {
      s.verification_status = 'VERIFIED';
    });
    // Verify docs
    this.workerDocs.filter(d => d.worker_id === workerId).forEach(d => {
      d.verification_status = 'VERIFIED';
      d.verified_at = new Date().toISOString();
      d.verified_by = verifiedBy;
    });

    const user = this.users.find(u => u.id === worker.user_id);
    if (user) {
      user.account_status = 'ACTIVE';
      user.updated_at = new Date().toISOString();
    }

    this.recordAuditLog({
      user: verifiedBy,
      action: 'WORKER_VERIFIED',
      entity: 'WORKER_PROFILES',
      status: 'VERIFIED',
      details: `Worker ${worker.full_name} KYC and trade credentials verified.`
    });
    this.save();
    realtimeHub.emit('worker:verified', worker);
    return true;
  }

  public getPendingCooperativeOfficials(): CooperativeMemberRecord[] {
    return this.cooperativeMembers.filter(m => m.status === 'PENDING_APPROVAL');
  }

  public getAllCooperativeOfficialRequests(): CooperativeMemberRecord[] {
    return [...this.cooperativeMembers];
  }

  public getPendingOrganizations(): OrganizationProfileRecord[] {
    return this.organizations.filter(o => o.verification_status === 'PENDING');
  }

  public getPendingWorkers(): WorkerProfileRecord[] {
    return this.workers.filter(w => w.verification_status === 'PENDING');
  }

  public getWorkerSkills(workerId: string): WorkerSkillRecord[] {
    return this.workerSkills.filter(s => s.worker_id === workerId);
  }

  public getWorkerDocuments(workerId: string): WorkerDocumentRecord[] {
    return this.workerDocs.filter(d => d.worker_id === workerId);
  }

  public getWorkerProfileByUserId(userId: string): WorkerProfileRecord | undefined {
    return this.workers.find(w => w.user_id === userId);
  }

  public getCustomerProfileByUserId(userId: string): CustomerProfile | undefined {
    return this.customers.find(c => c.user_id === userId);
  }

  public getOrganizationProfileByUserId(userId: string): OrganizationProfileRecord | undefined {
    return this.organizations.find(o => o.user_id === userId);
  }

  public getCooperativeMemberByUserId(userId: string): CooperativeMemberRecord | undefined {
    return this.cooperativeMembers.find(m => m.user_id === userId);
  }

  public getUserByEmailOrPhone(identifier: string): UserAccount | undefined {
    const clean = identifier.trim().toLowerCase();
    const phoneDigits = identifier.replace(/\D/g, '');
    return this.users.find(u => 
      u.email.toLowerCase() === clean || 
      (phoneDigits && u.phone.replace(/\D/g, '') === phoneDigits)
    );
  }
}

export const onboardingService = new OnboardingService();
