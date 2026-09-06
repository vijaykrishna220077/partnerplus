export type WorkerCategory = 'skilled' | 'semi_skilled' | 'general';
export type SkillLevel = 'beginner' | 'intermediate' | 'expert';
export type VerificationStatusType = 'submitted' | 'under_review' | 'verified' | 'rejected';

/**
 * Cooperative Skill Definition (Admin configurable)
 */
export interface SkillDefinition {
  id: string;
  category: WorkerCategory;
  skill_name: string;
  description: string;
  verification_required: boolean;
  active: boolean;
  trade_icon: string;
  tasks: SkillTaskDefinition[];
}

/**
 * Specific Task under a Skill
 */
export interface SkillTaskDefinition {
  id: string;
  skill_id: string;
  task_name: string;
  description: string;
  min_experience_years: number;
  default_estimated_minutes: number;
  tools_required: string;
  is_regulated_trade: boolean; // Cannot be done by general worker without registered skill
}

/**
 * Worker's registered skill
 */
export interface WorkerSkillRecord {
  id: string;
  worker_id: string;
  skill_id: string;
  skill_name: string;
  category: WorkerCategory;
  skill_level: SkillLevel;
  years_experience: number;
  is_primary: boolean;
  verified: boolean;
  certified?: boolean;
  certification_name?: string;
  tasks: string[];
  created_at: string;
}

/**
 * Worker Preferences
 */
export interface WorkerPreferences {
  preferred_job_types: string[];
  preferred_areas: string[];
  max_travel_distance_km: number;
  preferred_shifts: string[];
  active_days: string[];
}

/**
 * Structured Worker Profile (PostgreSQL/Supabase ready)
 */
export interface StructuredWorkerProfile {
  id: string;
  name: string;
  name_hi?: string;
  name_ta?: string;
  phone: string;
  worker_type: WorkerCategory; // 'skilled' | 'semi_skilled' | 'general'
  primary_skill_id: string;
  primary_skill_label: string;
  experience_years: number;
  verification_status: VerificationStatusType;
  availability_status: boolean; // Available today / online
  emergency_available: boolean; // Emergency ready
  rating: number;
  completed_jobs: number;
  current_location: string;
  service_radius_km: number; // e.g. 10 km
  skills: WorkerSkillRecord[];
  certifications: Array<{
    title: string;
    issuedBy: string;
    year: number;
    certificateId: string;
  }>;
  preferences: WorkerPreferences;
  opportunities_received_count: number; // For fair distribution
  cooperative_id: string;
  cooperative_name: string;
  created_at: string;
}

/**
 * Job Opening with structured skill requirement
 */
export interface StructuredJobRequirement {
  required_skill_id: string;
  required_skill_name: string;
  specific_task_id?: string;
  worker_type_required: WorkerCategory;
  required_skill_level: SkillLevel | 'any';
  minimum_experience_years: number;
  verification_mandatory: boolean;
  tools_required: string;
  materials_provided: string;
}

/**
 * Worker Eligibility Evaluation Result
 */
export interface WorkerJobEligibilityResult {
  eligible: boolean;
  suitabilityScore: number;
  reasons: string[];
  rejectionReason?: string;
  scoreBreakdown: {
    skillMatchScore: number;
    workerTypeScore: number;
    experienceScore: number;
    availabilityScore: number;
    emergencyScore: number;
    verificationScore: number;
    distanceScore: number;
    workloadScore: number;
    ratingScore: number;
    fairDistributionScore: number;
  };
}
