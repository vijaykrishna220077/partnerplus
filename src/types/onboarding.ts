import { OrganizationType, OrganizationVerificationStatus, LanguageCode } from './index';

export type AccountRole = 
  | 'CUSTOMER' 
  | 'WORKER' 
  | 'ORGANIZATION_ADMIN' 
  | 'ORGANIZATION_STAFF' 
  | 'COOPERATIVE_ADMIN' 
  | 'COOPERATIVE_STAFF'
  | 'PENDING';

export type AccountStatus = 
  | 'PENDING' 
  | 'ACTIVE' 
  | 'SUSPENDED' 
  | 'REJECTED' 
  | 'DEACTIVATED' 
  | 'PENDING_APPROVAL' 
  | 'PENDING_VERIFICATION';

export type WorkerClassification = 'skilled' | 'semi_skilled' | 'general';
export type SkillLevel = 'beginner' | 'intermediate' | 'expert';
export type DocumentVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';

/**
 * 1. Central Users Table (users)
 * Matches Supabase / PostgreSQL users table schema
 */
export interface UserAccount {
  id: string;
  auth_user_id: string;
  email: string;
  phone: string;
  role: AccountRole;
  requested_role?: string;
  account_status: AccountStatus;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * 2. Customer Profile (customer_profiles)
 */
export interface CustomerProfile {
  id: string;
  user_id: string;
  full_name: string;
  profile_photo_url?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  preferred_language: LanguageCode | string;
  notification_preferences?: {
    sms: boolean;
    whatsapp: boolean;
    in_app: boolean;
  };
  created_at: string;
  updated_at: string;
}

/**
 * 3. Worker Profile (worker_profiles)
 */
export interface WorkerProfileRecord {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email?: string;
  profile_photo_path?: string;
  profile_photo_url?: string;
  worker_type: WorkerClassification;
  primary_skill_id: string;
  primary_skill_label: string;
  experience_years: number;
  verification_status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
  account_status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';
  emergency_available: boolean;
  service_radius: number; // in kilometers
  preferred_language: string;
  date_of_birth?: string;
  gender?: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  location_permission_granted: boolean;
  working_days: string[];
  working_hours: {
    start: string;
    end: string;
  };
  payout_method: 'bank_account' | 'upi' | 'cooperative_passbook';
  payout_identifier: string; // masked / safe identifier
  cooperative_id: string;
  cooperative_name: string;
  created_at: string;
  updated_at: string;
}

/**
 * 4. Worker Skills Table (worker_skills)
 */
export interface WorkerSkillRecord {
  id: string;
  worker_id: string;
  skill_id: string;
  skill_name: string;
  skill_level: SkillLevel;
  years_experience: number;
  is_primary: boolean;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  created_at: string;
}

/**
 * 5. Worker Certifications Table (worker_certifications)
 */
export interface WorkerCertificationRecord {
  id: string;
  worker_id: string;
  skill_id?: string;
  certificate_name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  document_url?: string;
  verification_status: DocumentVerificationStatus;
  created_at: string;
}

/**
 * 6. Worker Documents Table (worker_documents)
 */
export interface WorkerDocumentRecord {
  id: string;
  worker_id: string;
  document_type: 'identity_proof' | 'address_proof' | 'skill_certificate' | 'training_certificate' | 'other';
  document_name: string;
  storage_path: string;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploaded_at: string;
  verified_at?: string;
  verified_by?: string;
}

/**
 * 7. Organization Profile Table (organization_profiles)
 */
export interface OrganizationProfileRecord {
  id: string;
  user_id: string;
  organization_name: string;
  legal_name: string;
  organization_type: OrganizationType;
  registration_number?: string;
  gst_number?: string;
  contact_person: string;
  designation: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  website?: string;
  description: string;
  supporting_document_name?: string;
  verification_status: OrganizationVerificationStatus;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

/**
 * 8. Organization Members Table (organization_members)
 */
export interface OrganizationMemberRecord {
  id: string;
  organization_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  role: 'ORGANIZATION_ADMIN' | 'ORGANIZATION_STAFF';
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  invited_at: string;
  joined_at?: string;
}

/**
 * 9. Cooperative Profile Table (cooperative_profiles)
 */
export interface CooperativeProfileRecord {
  id: string;
  cooperative_name: string;
  registration_number: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  official_email: string;
  phone: string;
  contact_person: string;
  verification_status: 'VERIFIED' | 'PENDING';
  created_at: string;
  updated_at: string;
}

/**
 * 10. Cooperative Members & Access Requests Table (cooperative_members)
 */
export interface CooperativeMemberRecord {
  id: string;
  cooperative_id: string;
  user_id: string;
  full_name: string;
  official_email: string;
  phone: string;
  designation: string;
  requested_role: 'COOPERATIVE_ADMIN' | 'COOPERATIVE_STAFF' | 'AUTHORIZED_REPRESENTATIVE';
  actual_role: 'PENDING' | 'COOPERATIVE_ADMIN' | 'COOPERATIVE_STAFF';
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  reason_for_access: string;
  supporting_documents: string[];
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

/**
 * 11. Audit Logs (audit_logs)
 */
export interface AuditLogRecord {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  status: string;
  details?: string;
}
