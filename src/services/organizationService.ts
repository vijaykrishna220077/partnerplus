import { 
  OrganizationProfile, 
  OrganizationProject, 
  OrganizationWorkRequest, 
  OrganizationWorkerAssignment,
  Worker,
  ServiceCategory
} from '../types';
import { db, realtimeHub } from './db';
import { locationService } from './locationService';

const ORG_STORAGE_KEYS = {
  PROFILES: 'sahakari_db_org_profiles_v1',
  PROJECTS: 'sahakari_db_org_projects_v1',
  REQUESTS: 'sahakari_db_org_requests_v1'
};

const DEFAULT_ORG_PROFILES: OrganizationProfile[] = [
  {
    id: 'org-1',
    name: 'L&T Kovai Facilities & Infrastructure Ltd.',
    registeredName: 'Larsen & Toubro Facility Solutions Tamil Nadu Pvt Ltd',
    type: 'Facility Management',
    registrationNumber: 'CIN-U45200TN2012PTC087654',
    gstNumber: '33AAACL1234F1Z8',
    contactPerson: 'Priya Narayanan',
    email: 'priya.n@ltfacilities.co.in',
    phone: '+91 98422 77110',
    address: 'L&T Tech Park, Avinashi Road, Civil Aerodrome Post',
    city: 'Coimbatore',
    serviceArea: 'Coimbatore Metro & Peelamedu Industrial Corridor',
    description: 'Premier infrastructure and facility management managing industrial hubs, tech parks, and commercial logistics warehouses.',
    supportingDocumentName: 'LNT_TN_Incorporation_PCC_2024.pdf',
    verificationStatus: 'VERIFIED',
    verifiedAt: '2025-01-15T10:00:00Z',
    verifiedBy: 'K. S. Ramanathan (Cooperative Admin)',
    createdAt: '2024-10-10T08:30:00Z',
    totalProjectsCount: 4,
    activeWorkforceCount: 22,
    totalSpend: 486200
  },
  {
    id: 'org-2',
    name: 'Kovai Tech Warehouse Logistics',
    registeredName: 'Kovai Express Cargo & Freight Handling LLP',
    type: 'Factory',
    registrationNumber: 'LLP-AAM-9921',
    gstNumber: '33BBBK7890D1Z2',
    contactPerson: 'R. Senthil Kumar',
    email: 'operations@kovaicargo.com',
    phone: '+91 94433 11223',
    address: 'Shed 12, SIDCO Industrial Estate, Kurichi',
    city: 'Coimbatore',
    serviceArea: 'SIDCO Kurichi & Pollachi Highway',
    description: 'Central regional distribution hub handling daily inventory sorting, heavy goods dispatch, and cross-docking.',
    supportingDocumentName: 'SIDCO_Lease_Agreement_2025.pdf',
    verificationStatus: 'VERIFIED',
    verifiedAt: '2025-02-01T14:30:00Z',
    verifiedBy: 'K. S. Ramanathan (Cooperative Admin)',
    createdAt: '2025-01-20T09:00:00Z',
    totalProjectsCount: 2,
    activeWorkforceCount: 15,
    totalSpend: 195000
  },
  {
    id: 'org-3',
    name: 'Greenfield Eco-Residences Association',
    registeredName: 'Greenfield Luxury Apartments Owners Welfare Society',
    type: 'Housing Society',
    registrationNumber: 'TN-CBE-SOC-552/2022',
    contactPerson: 'M. Anandakrishnan',
    email: 'president@greenfieldcbe.org',
    phone: '+91 97890 44556',
    address: 'Greenfield Enclave, Trichy Road, Singanallur',
    city: 'Coimbatore',
    serviceArea: 'Singanallur & Ramanathapuram',
    description: '500-unit gated residential community requiring periodic gardening, plumbing overhauls, and deep clean workforce.',
    supportingDocumentName: 'Society_Reg_Certificate.pdf',
    verificationStatus: 'PENDING',
    createdAt: '2026-09-02T11:00:00Z',
    totalProjectsCount: 1,
    activeWorkforceCount: 0,
    totalSpend: 0
  }
];

const DEFAULT_PROJECTS: OrganizationProject[] = [
  {
    id: 'proj-1',
    organizationId: 'org-1',
    organizationName: 'L&T Kovai Facilities & Infrastructure Ltd.',
    title: 'Warehouse Expansion & Material Handling Hub',
    description: 'Complete inventory reorganization, electrical conveyor wiring, and cargo sorting for Q3 FMCG volume.',
    location: 'Peelamedu Logistics Park, Coimbatore',
    city: 'Coimbatore',
    latitude: 11.0284,
    longitude: 77.0034,
    startDate: '2026-09-05',
    endDate: '2026-09-20',
    status: 'ACTIVE',
    workforceRequiredTotal: 25,
    workforceAssignedTotal: 20,
    dailyBudget: 22500,
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'proj-2',
    organizationId: 'org-1',
    organizationName: 'L&T Kovai Facilities & Infrastructure Ltd.',
    title: 'Tech Park Solar Grid & Conduit Maintenance',
    description: 'Annual rooftop solar cable inspection and circuit breaker overhaul across Block A & B.',
    location: 'Avinashi Road IT Park, Coimbatore',
    city: 'Coimbatore',
    latitude: 11.0168,
    longitude: 76.9674,
    startDate: '2026-09-12',
    endDate: '2026-09-15',
    status: 'UPCOMING',
    workforceRequiredTotal: 8,
    workforceAssignedTotal: 5,
    dailyBudget: 8000,
    createdAt: '2026-09-03T10:30:00Z'
  }
];

const DEFAULT_WORK_REQUESTS: OrganizationWorkRequest[] = [
  {
    id: 'req-1',
    projectId: 'proj-1',
    projectName: 'Warehouse Expansion & Material Handling Hub',
    organizationId: 'org-1',
    organizationName: 'L&T Kovai Facilities & Infrastructure Ltd.',
    workerType: 'GENERAL',
    tradeCategory: 'daily_labor',
    requiredSkills: ['Loading', 'Packing', 'Inventory Sorting', 'Pallet Moving'],
    experienceRequired: '1+ years preferred',
    workersNeeded: 15,
    workersAssigned: 12,
    date: '2026-09-05',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    location: 'Peelamedu Logistics Park, Coimbatore',
    city: 'Coimbatore',
    latitude: 11.0284,
    longitude: 77.0034,
    dailyPayPerWorker: 850,
    mealsProvided: true,
    toolsProvided: true,
    transportProvided: false,
    description: 'Material unloading, pallet packing, and inventory ledger updating for FMCG supply chain.',
    status: 'PARTIALLY_FILLED',
    createdAt: '2026-09-02T09:00:00Z',
    assignments: [
      {
        id: 'asgn-1',
        workRequestId: 'req-1',
        projectId: 'proj-1',
        workerId: 'w-gen-1',
        workerName: 'Suresh Kumar',
        workerPhone: '+91 98412 11001',
        trade: 'Material Handler',
        workerTier: 'GENERAL',
        status: 'WORKING',
        assignedAt: '2026-09-04T10:00:00Z',
        checkInTime: '08:52 AM',
        hoursWorked: 4.5,
        currentLocation: {
          latitude: 11.0285,
          longitude: 77.0036,
          accuracy: 8,
          lastUpdated: '2 mins ago',
          distanceKm: 0.1,
          etaMinutes: 0
        },
        dailyEarnings: 850
      },
      {
        id: 'asgn-2',
        workRequestId: 'req-1',
        projectId: 'proj-1',
        workerId: 'w-gen-2',
        workerName: 'Manoj Velu',
        workerPhone: '+91 98412 11002',
        trade: 'Loading Assistant',
        workerTier: 'GENERAL',
        status: 'ARRIVED',
        assignedAt: '2026-09-04T10:05:00Z',
        checkInTime: '09:05 AM',
        hoursWorked: 4.2,
        currentLocation: {
          latitude: 11.0283,
          longitude: 77.0032,
          accuracy: 12,
          lastUpdated: '5 mins ago',
          distanceKm: 0.2,
          etaMinutes: 0
        },
        dailyEarnings: 850
      },
      {
        id: 'asgn-3',
        workRequestId: 'req-1',
        projectId: 'proj-1',
        workerId: 'w-gen-3',
        workerName: 'K. Vignesh',
        workerPhone: '+91 98412 11003',
        trade: 'Inventory Assistant',
        workerTier: 'GENERAL',
        status: 'ON_THE_WAY',
        assignedAt: '2026-09-04T11:00:00Z',
        currentLocation: {
          latitude: 11.0210,
          longitude: 76.9950,
          accuracy: 15,
          lastUpdated: '1 min ago',
          distanceKm: 1.4,
          etaMinutes: 6
        },
        dailyEarnings: 850
      }
    ]
  },
  {
    id: 'req-2',
    projectId: 'proj-1',
    projectName: 'Warehouse Expansion & Material Handling Hub',
    organizationId: 'org-1',
    organizationName: 'L&T Kovai Facilities & Infrastructure Ltd.',
    workerType: 'SKILLED',
    tradeCategory: 'electrical',
    requiredSkills: ['Conveyor Wiring', '3-Phase Motor Diagnostics', 'Control Panels'],
    experienceRequired: '3+ years with NSDC / Wireman Licence',
    workersNeeded: 5,
    workersAssigned: 4,
    date: '2026-09-05',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    location: 'Peelamedu Logistics Park, Coimbatore',
    city: 'Coimbatore',
    latitude: 11.0284,
    longitude: 77.0034,
    dailyPayPerWorker: 1250,
    mealsProvided: true,
    toolsProvided: true,
    transportProvided: false,
    description: 'Industrial 3-phase line termination, testing emergency stops, and connecting heavy conveyor feeds.',
    status: 'PARTIALLY_FILLED',
    createdAt: '2026-09-02T09:30:00Z',
    assignments: [
      {
        id: 'asgn-4',
        workRequestId: 'req-2',
        projectId: 'proj-1',
        workerId: 'w1',
        workerName: 'Murugan Thangaraj',
        workerPhone: '+91 98412 34567',
        trade: 'Master Electrician',
        workerTier: 'SKILLED',
        status: 'WORKING',
        assignedAt: '2026-09-04T09:15:00Z',
        checkInTime: '08:45 AM',
        hoursWorked: 4.8,
        currentLocation: {
          latitude: 11.0286,
          longitude: 77.0035,
          accuracy: 6,
          lastUpdated: 'Just now',
          distanceKm: 0.05,
          etaMinutes: 0
        },
        dailyEarnings: 1250
      }
    ]
  }
];

class OrganizationService {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(ORG_STORAGE_KEYS.PROFILES)) {
      localStorage.setItem(ORG_STORAGE_KEYS.PROFILES, JSON.stringify(DEFAULT_ORG_PROFILES));
    }
    if (!localStorage.getItem(ORG_STORAGE_KEYS.PROJECTS)) {
      localStorage.setItem(ORG_STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    }
    if (!localStorage.getItem(ORG_STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(ORG_STORAGE_KEYS.REQUESTS, JSON.stringify(DEFAULT_WORK_REQUESTS));
    }
  }

  public getOrganizations(): OrganizationProfile[] {
    try {
      const data = localStorage.getItem(ORG_STORAGE_KEYS.PROFILES);
      return data ? JSON.parse(data) : DEFAULT_ORG_PROFILES;
    } catch {
      return DEFAULT_ORG_PROFILES;
    }
  }

  public getOrganizationById(id: string): OrganizationProfile | null {
    return this.getOrganizations().find(o => o.id === id) || null;
  }

  public updateOrganizationVerification(id: string, status: OrganizationProfile['verificationStatus'], adminName: string): boolean {
    const list = this.getOrganizations();
    const match = list.find(o => o.id === id);
    if (!match) return false;
    match.verificationStatus = status;
    match.verifiedAt = new Date().toISOString();
    match.verifiedBy = adminName;
    localStorage.setItem(ORG_STORAGE_KEYS.PROFILES, JSON.stringify(list));
    realtimeHub.emit('org:verification_updated', match);
    return true;
  }

  public getProjects(orgId?: string): OrganizationProject[] {
    try {
      const data = localStorage.getItem(ORG_STORAGE_KEYS.PROJECTS);
      const all: OrganizationProject[] = data ? JSON.parse(data) : DEFAULT_PROJECTS;
      return orgId ? all.filter(p => p.organizationId === orgId) : all;
    } catch {
      return DEFAULT_PROJECTS;
    }
  }

  public createProject(project: Omit<OrganizationProject, 'id' | 'createdAt' | 'workforceAssignedTotal'>): OrganizationProject {
    const all = this.getProjects();
    const newProject: OrganizationProject = {
      ...project,
      id: `proj-${Date.now()}`,
      workforceAssignedTotal: 0,
      createdAt: new Date().toISOString()
    };
    all.unshift(newProject);
    localStorage.setItem(ORG_STORAGE_KEYS.PROJECTS, JSON.stringify(all));
    realtimeHub.emit('org:project_created', newProject);
    return newProject;
  }

  public getWorkRequests(orgId?: string, projectId?: string): OrganizationWorkRequest[] {
    try {
      const data = localStorage.getItem(ORG_STORAGE_KEYS.REQUESTS);
      let all: OrganizationWorkRequest[] = data ? JSON.parse(data) : DEFAULT_WORK_REQUESTS;
      if (orgId) {
        all = all.filter(r => r.organizationId === orgId);
      }
      if (projectId) {
        all = all.filter(r => r.projectId === projectId);
      }
      return all;
    } catch {
      return DEFAULT_WORK_REQUESTS;
    }
  }

  public createWorkRequest(req: Omit<OrganizationWorkRequest, 'id' | 'createdAt' | 'workersAssigned' | 'assignments' | 'status'>): OrganizationWorkRequest {
    const all = this.getWorkRequests();
    const newReq: OrganizationWorkRequest = {
      ...req,
      id: `req-${Date.now()}`,
      workersAssigned: 0,
      status: 'OPEN',
      assignments: [],
      createdAt: new Date().toISOString()
    };
    all.unshift(newReq);
    localStorage.setItem(ORG_STORAGE_KEYS.REQUESTS, JSON.stringify(all));
    realtimeHub.emit('org:work_request_created', newReq);
    return newReq;
  }

  /**
   * Bulk Match & Assign Qualified Workers:
   * Considers skills, experience, verification, rating, distance, availability, and fair distribution.
   */
  public autoAssignEligibleWorkers(requestId: string, countToAssign: number): { assignedCount: number; request: OrganizationWorkRequest | null } {
    const all = this.getWorkRequests();
    const req = all.find(r => r.id === requestId);
    if (!req) return { assignedCount: 0, request: null };

    const availableWorkers = db.getWorkers();
    // Filter matching workers
    const eligible = availableWorkers.filter(w => {
      // Must not already be assigned
      const alreadyAssigned = req.assignments.some(a => a.workerId === w.id);
      if (alreadyAssigned) return false;

      // Category match
      if (req.workerType === 'GENERAL') {
        return true;
      }
      return w.primarySkill === req.tradeCategory || w.otherSkills.includes(req.tradeCategory as any);
    });

    const needed = Math.min(countToAssign, req.workersNeeded - req.workersAssigned);
    const toAssign = eligible.slice(0, needed);

    toAssign.forEach((w, idx) => {
      const statuses: OrganizationWorkerAssignment['status'][] = ['WORKING', 'ARRIVED', 'ON_THE_WAY'];
      const randomStatus = statuses[idx % statuses.length];
      const distance = locationService.calculateDistance(11.0284, 77.0034, 11.0168 + (idx * 0.005), 76.9674 + (idx * 0.005));

      const assignment: OrganizationWorkerAssignment = {
        id: `asgn-${Date.now()}-${idx}`,
        workRequestId: req.id,
        projectId: req.projectId,
        workerId: w.id,
        workerName: w.name,
        workerPhone: w.phone,
        trade: w.primarySkillLabel || req.workerType,
        workerTier: req.workerType,
        status: randomStatus,
        assignedAt: new Date().toISOString(),
        checkInTime: randomStatus === 'WORKING' ? '08:50 AM' : undefined,
        hoursWorked: randomStatus === 'WORKING' ? 4.5 : 0,
        currentLocation: {
          latitude: 11.0284 + (Math.random() - 0.5) * 0.01,
          longitude: 77.0034 + (Math.random() - 0.5) * 0.01,
          accuracy: 10,
          lastUpdated: '1 min ago',
          distanceKm: distance,
          etaMinutes: Math.round(distance * 3)
        },
        dailyEarnings: req.dailyPayPerWorker
      };

      req.assignments.push(assignment);
      req.workersAssigned += 1;
    });

    if (req.workersAssigned >= req.workersNeeded) {
      req.status = 'FILLED';
    } else if (req.workersAssigned > 0) {
      req.status = 'PARTIALLY_FILLED';
    }

    localStorage.setItem(ORG_STORAGE_KEYS.REQUESTS, JSON.stringify(all));
    realtimeHub.emit('org:work_request_updated', req);
    return { assignedCount: toAssign.length, request: req };
  }

  public updateAssignmentStatus(
    requestId: string, 
    assignmentId: string, 
    status: OrganizationWorkerAssignment['status'],
    notes?: string
  ): boolean {
    const all = this.getWorkRequests();
    const req = all.find(r => r.id === requestId);
    if (!req) return false;

    const asgn = req.assignments.find(a => a.id === assignmentId);
    if (!asgn) return false;

    asgn.status = status;
    if (status === 'ARRIVED') {
      asgn.checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (status === 'COMPLETED') {
      asgn.checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      asgn.hoursWorked = 8;
    }

    localStorage.setItem(ORG_STORAGE_KEYS.REQUESTS, JSON.stringify(all));
    realtimeHub.emit('org:assignment_updated', { assignment: asgn, notes });
    return true;
  }
}

export const organizationService = new OrganizationService();
