export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'bn' | 'kn' | 'mr';

export type UserRole = 
  | 'customer' 
  | 'worker' 
  | 'cooperative_admin' 
  | 'cooperative_staff' 
  | 'organization_admin' 
  | 'organization_staff';

export type OrganizationType =
  | 'Company'
  | 'Contractor'
  | 'Factory'
  | 'Office'
  | 'Construction Company'
  | 'Facility Management'
  | 'Event Organization'
  | 'Housing Society'
  | 'NGO'
  | 'Institution'
  | 'Other';

export type OrganizationVerificationStatus = 
  | 'PENDING' 
  | 'UNDER_REVIEW' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'SUSPENDED';

export interface GeoPoint {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

export interface WorkerLocationRecord {
  id: string;
  workerId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  heading?: number;
  speed?: number;
  status: 'OFFLINE' | 'ONLINE_AVAILABLE' | 'EN_ROUTE_JOB' | 'ARRIVED_WORKING' | 'EMERGENCY_DISPATCH';
  trackingMode: 'OFFLINE' | 'DISCOVERY' | 'ACTIVE_JOB' | 'EMERGENCY';
  timestamp: string;
}

export interface CustomerLocationRecord {
  id: string;
  customerId: string;
  bookingId?: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  sharingStatus: 'OFF' | 'LIVE_SHARING' | 'SERVICE_PIN_ONLY';
  timestamp: string;
}

export interface LocationPermissionState {
  hasGeolocationApi: boolean;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
  isTrackingEnabled: boolean;
  lastKnownCoordinates?: GeoPoint;
  error?: string;
}

export interface OrganizationProfile {
  id: string;
  name: string;
  registeredName: string;
  type: OrganizationType;
  registrationNumber?: string;
  gstNumber?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  serviceArea: string;
  description: string;
  supportingDocumentName?: string;
  verificationStatus: OrganizationVerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  totalProjectsCount: number;
  activeWorkforceCount: number;
  totalSpend: number;
}

export interface OrganizationProject {
  id: string;
  organizationId: string;
  organizationName: string;
  title: string;
  description: string;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  workforceRequiredTotal: number;
  workforceAssignedTotal: number;
  dailyBudget: number;
  createdAt: string;
}

export interface OrganizationWorkerAssignment {
  id: string;
  workRequestId: string;
  projectId: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  trade: string;
  workerTier: 'SKILLED' | 'SEMI_SKILLED' | 'GENERAL';
  status: 'ASSIGNED' | 'ACCEPTED' | 'ON_THE_WAY' | 'ARRIVED' | 'WORKING' | 'COMPLETED' | 'ABSENT';
  assignedAt: string;
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorked?: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    lastUpdated: string;
    distanceKm?: number;
    etaMinutes?: number;
  };
  dailyEarnings: number;
}

export interface OrganizationWorkRequest {
  id: string;
  projectId: string;
  projectName: string;
  organizationId: string;
  organizationName: string;
  workerType: 'SKILLED' | 'SEMI_SKILLED' | 'GENERAL';
  tradeCategory: ServiceCategory | string;
  requiredSkills: string[];
  experienceRequired?: string;
  workersNeeded: number;
  workersAssigned: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  dailyPayPerWorker: number;
  mealsProvided: boolean;
  toolsProvided: boolean;
  transportProvided: boolean;
  description: string;
  status: 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  assignments: OrganizationWorkerAssignment[];
}

export type ServiceCategory = 
  | 'plumbing'
  | 'electrical'
  | 'carpentry'
  | 'painting'
  | 'cleaning'
  | 'gardening'
  | 'driving'
  | 'caregiving'
  | 'appliance_repair'
  | 'masonry'
  | 'pest_control'
  | 'technician'
  | 'hvac'
  | 'welding'
  | 'mechanic'
  | 'heavy_machinery'
  | 'landscaping'
  | 'it_network'
  | 'daily_labor';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  name: string;
  nameTa: string;
  nameHi: string;
  icon: string;
  description: string;
  descriptionTa: string;
  descriptionHi: string;
  startingPrice: number;
  unit: string;
  estimatedDuration: string;
  popularProblems: string[];
  cooperativeRateGuideline: string;
  isEmergencyEligible: boolean;
}

export type VerificationStatus = 'submitted' | 'under_review' | 'verified' | 'rejected';

export interface WorkerSkill {
  name: string;
  experienceYears: number;
  isCertified: boolean;
}

export interface WorkerCertification {
  title: string;
  issuedBy: string; // e.g. "NSDC (National Skill Development Corp)" or "State Labour Board"
  year: number;
  certificateId: string;
}

export interface WorkerReview {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  tags: string[];
  serviceName: string;
}

export interface Worker {
  id: string;
  name: string;
  nameTa?: string;
  nameHi?: string;
  photoUrl: string;
  phone: string;
  primarySkill: ServiceCategory;
  primarySkillLabel: string;
  otherSkills: string[];
  experienceYears: number;
  rating: number;
  jobsCompleted: number;
  distanceKm: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  isAvailableToday: boolean;
  isEmergencyReady: boolean;
  startingPrice: number;
  cooperativeId: string;
  cooperativeName: string;
  cooperativeRegNo: string;
  locationArea: string;
  city: string;
  latitude?: number;
  longitude?: number;
  languages: string[];
  bio: string;
  certifications: WorkerCertification[];
  skillsList: WorkerSkill[];
  reviews: WorkerReview[];
  welfareSchemeId: string; // e.g. "PMSBY-2026-COOP"
  isIdentityChecked: boolean;
  isPoliceClearanceVerified: boolean;
  bankAccountLinked: boolean;
}

export interface Cooperative {
  id: string;
  name: string;
  registrationNumber: string;
  city: string;
  state: string;
  establishedYear: number;
  totalWorkers: number;
  verifiedWorkers: number;
  activeJobs: number;
  completedJobsTotal: number;
  totalEarningsDistributed: number;
  workerWelfareFundBalance: number;
  presidentName: string;
  contactPhone: string;
  email: string;
  address: string;
}

export type BookingStatus = 
  | 'requested'
  | 'worker_assigned'
  | 'confirmed'
  | 'worker_accepted'
  | 'on_the_way'
  | 'arrived'
  | 'service_started'
  | 'service_completed'
  | 'payment_pending'
  | 'payment_completed'
  | 'reviewed'
  | 'cancelled'
  | 'rejected'
  | 'expired';

export interface BookingStatusHistory {
  id: string;
  bookingId: string;
  previousStatus: BookingStatus | null;
  newStatus: BookingStatus;
  changedBy: string;
  notes?: string;
  timestamp: string;
}

export interface BookingPart {
  id: string;
  bookingId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receiptUrl?: string;
  addedBy: string;
  createdAt: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  workerName: string;
  workerPhone: string;
  cooperativeName: string;
  cooperativeRegNo: string;
  serviceCategory: string;
  serviceName: string;
  taskName: string;
  quantity: number;
  baseAmount: number;
  priorityFee: number;
  partsAmount: number;
  totalAmount: number;
  workerEarnings: number;
  welfareFund: number;
  taxGST: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  generatedAt: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cash';
  transactionId: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  providerReference: string;
  createdAt: string;
}

export interface CooperativeRule {
  id: string;
  cooperativeId: string;
  workerSharePercentage: number; // e.g. 95
  welfareSharePercentage: number; // e.g. 5
  emergencyPriorityFee: number; // e.g. 49
  maxEmergencyEtaMins: number; // e.g. 25
}

export interface WorkerMatchResult {
  worker: Worker;
  matchScore: number;
  scoreBreakdown: {
    skillScore: number;
    distanceScore: number;
    ratingScore: number;
    experienceScore: number;
    availabilityScore: number;
    emergencyScore: number;
    workloadScore: number;
  };
  reasons: string[];
}

export interface NotificationRecord {
  id: string;
  recipientId: string;
  recipientType: 'customer' | 'worker' | 'cooperative';
  title: string;
  message: string;
  type: 'booking' | 'status_update' | 'payment' | 'emergency' | 'review';
  bookingId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  workerId: string;
  workerName: string;
  workerPhoto: string;
  workerPhone: string;
  cooperativeName: string;
  serviceCategory: ServiceCategory;
  serviceName: string;
  specificTaskId?: string;
  specificTaskName?: string;
  quantity?: number;
  taskUnit?: string;
  problemDescription: string;
  photoAttachmentUrl?: string;
  address: {
    street: string;
    area: string;
    city: string;
    pincode: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
  };
  scheduledDate: string;
  scheduledTimeSlot: string;
  isEmergency: boolean;
  requiresParts?: boolean;
  partsEstimatedAmount?: number;
  partsAmount?: number;
  priorityFee?: number;
  status: BookingStatus;
  statusTimestamps: {
    confirmedAt: string;
    acceptedAt?: string;
    onTheWayAt?: string;
    arrivedAt?: string;
    startedAt?: string;
    completedAt?: string;
  };
  pricing: {
    serviceCharge: number;
    workerEarnings: number;
    cooperativeWelfareFund: number;
    platformConvenienceFee: number;
    taxGST: number;
    totalAmount: number;
  };
  payment: {
    method: 'upi' | 'card' | 'netbanking' | 'cash';
    status: 'pending' | 'completed' | 'cash_on_delivery';
    transactionId?: string;
    paidAt?: string;
  };
  matchScore?: number;
  workerDistanceKm?: number;
  workerRating?: number;
  cancellationReason?: string;
  cancelledBy?: string;
  assignedAt?: string;
  etaMinutes?: number;
  review?: {
    rating: number;
    tags: string[];
    comment: string;
    reviewedAt: string;
  };
}

export interface DemandForecastItem {
  id: string;
  serviceCategory: ServiceCategory;
  serviceName: string;
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  growthPercentage: number;
  reason: string;
  reasonTa: string;
  reasonHi: string;
  hotspotAreas: {
    areaName: string;
    demandLevel: 'High' | 'Medium' | 'Low';
    activeRequests: number;
    availableWorkers: number;
    recommendedDeployment: number;
  }[];
  peakDays: string[];
  historicalWeeklyTrends: { day: string; requests: number; capacity: number }[];
}

export interface LocationArea {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  popularLandmarks: string[];
}

export type CooperativeStaffRole = 'COOPERATIVE_ADMIN' | 'COOPERATIVE_STAFF';

export interface CooperativeAuditLog {
  id: string;
  timestamp: string;
  adminId?: string;
  adminName: string;
  adminRole: CooperativeStaffRole;
  action: string;
  affectedEntity: string;
  entityId: string;
  previousState?: string;
  newState?: string;
  reason?: string;
}

export interface CooperativeComplaint {
  id: string;
  reportedBy: string;
  reporterType: 'customer' | 'worker';
  relatedBookingId: string;
  jobId?: string;
  complainantName?: string;
  respondentName?: string;
  category: 'Customer Complaint' | 'Worker Complaint' | 'Payment Dispute' | 'Service Quality' | 'Worker Behaviour' | 'Safety Issue' | 'Cancellation Issue' | 'Other' | string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: string;
  assignedStaff: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'REJECTED' | 'ESCALATED' | 'CLOSED' | 'MEDIATION';
  description: string;
  resolutionNotes?: string;
}

export interface WorkerWelfareRecord {
  id: string;
  workerId: string;
  workerName: string;
  trade: string;
  contributionThisMonth: number;
  accumulatedWelfare: number;
  insuranceScheme: string;
  benefitsStatus: 'ACTIVE_COVERAGE' | 'CLAIM_PENDING' | 'DOCS_REQUIRED';
  lastContributionDate: string;
  claimType?: string;
  amountRequested?: number;
  dateFiled?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  adjudicatedBy?: string;
  notes?: string;
}

export interface CooperativeOperationalRules {
  workerSharePercentage: number;
  welfareSharePercentage?: number;
  welfareContributionPercentage: number;
  cooperativeSharePercentage?: number;
  emergencyPriorityFee?: number;
  maxEmergencyEtaMins?: number;
  serviceRadiusKm?: number;
  maxTravelRadiusKm: number;
  emergencyResponseTimeTargetMinutes: number;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'worker' | 'cooperative';
  text: string;
  timestamp: string;
  read: boolean;
  quickReplyType?: 'eta' | 'arrival' | 'direction' | 'materials' | 'general';
  isAudioTranscription?: boolean;
  isVoiceNote?: boolean;
  locationShare?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

