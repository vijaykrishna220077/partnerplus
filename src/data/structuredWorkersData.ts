import { StructuredWorkerProfile } from '../types/workerSkillRegistry';

/**
 * Pre-configured realistic worker profiles representing the 3 tiers:
 * - SKILLED (Single trade or multi-skilled)
 * - SEMI-SKILLED (Helper / assistants)
 * - GENERAL (Daily-wage, material handling, cleaning, shifting)
 */
export const STRUCTURED_WORKER_PROFILES: StructuredWorkerProfile[] = [
  // 1. RAMESH KUMAR — SKILLED (Electrician Specialist)
  {
    id: 'wrk-ramesh-elec',
    name: 'Ramesh Kumar',
    name_hi: 'रमेश कुमार',
    name_ta: 'ரமேஷ் குமார்',
    phone: '+91 98401 54321',
    worker_type: 'skilled',
    primary_skill_id: 'skill-electrician',
    primary_skill_label: 'Certified Electrician',
    experience_years: 5,
    verification_status: 'verified',
    availability_status: true,
    emergency_available: true,
    rating: 4.88,
    completed_jobs: 128,
    current_location: 'Gandhipuram, Coimbatore',
    service_radius_km: 10,
    skills: [
      {
        id: 'ws-ramesh-1',
        worker_id: 'wrk-ramesh-elec',
        skill_id: 'skill-electrician',
        skill_name: 'Electrician',
        category: 'skilled',
        skill_level: 'expert',
        years_experience: 5,
        is_primary: true,
        verified: true,
        certified: true,
        certification_name: 'ITI Electrician National Trade Certificate',
        tasks: [
          'Fan Installation',
          'Light Installation',
          'Switch & Socket Repair',
          'House Wiring & Circuit Repair',
          'Emergency MCB & Distribution Board'
        ],
        created_at: '2024-01-15'
      }
    ],
    certifications: [
      {
        title: 'ITI Electrician National Trade Certificate',
        issuedBy: 'Directorate General of Training (DGT), Govt of India',
        year: 2019,
        certificateId: 'DGT-ITI-2019-88192'
      },
      {
        title: 'B-Grade Electrical Wireman Competency Licence',
        issuedBy: 'Tamil Nadu Electrical Licensing Board',
        year: 2021,
        certificateId: 'TN-ELB-B-55219'
      }
    ],
    preferences: {
      preferred_job_types: ['Electrical', 'Emergency Wiring', 'Fan Installation'],
      preferred_areas: ['Gandhipuram', 'RS Puram', 'Peelamedu', 'Ramanathapuram'],
      max_travel_distance_km: 10,
      preferred_shifts: ['Morning (6 AM – 12 PM)', 'Afternoon (12 PM – 5 PM)', 'Evening (5 PM – 9 PM)'],
      active_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    opportunities_received_count: 34,
    cooperative_id: 'COOP-TN-8891',
    cooperative_name: 'Coimbatore District Labour Cooperative Union',
    created_at: '2023-08-10'
  },

  // 2. MANOJ VARMA — SKILLED MULTI-TRADE (Electrician + Plumber + Appliance Repair)
  {
    id: 'wrk-manoj-multi',
    name: 'Manoj Varma',
    name_hi: 'मनोज वर्मा',
    name_ta: 'மனோஜ் வர்மா',
    phone: '+91 97890 87654',
    worker_type: 'skilled',
    primary_skill_id: 'skill-electrician',
    primary_skill_label: 'Electrician & Sanitary Plumber',
    experience_years: 7,
    verification_status: 'verified',
    availability_status: true,
    emergency_available: true,
    rating: 4.92,
    completed_jobs: 215,
    current_location: 'Peelamedu, Coimbatore',
    service_radius_km: 12,
    skills: [
      {
        id: 'ws-manoj-1',
        worker_id: 'wrk-manoj-multi',
        skill_id: 'skill-electrician',
        skill_name: 'Electrician',
        category: 'skilled',
        skill_level: 'expert',
        years_experience: 7,
        is_primary: true,
        verified: true,
        certified: true,
        certification_name: 'Wireman Permit & NSDC Level 4',
        tasks: ['Fan Installation', 'Light Installation', 'Switch & Socket Repair', 'House Wiring & Circuit Repair'],
        created_at: '2023-05-12'
      },
      {
        id: 'ws-manoj-2',
        worker_id: 'wrk-manoj-multi',
        skill_id: 'skill-plumber',
        skill_name: 'Plumber',
        category: 'skilled',
        skill_level: 'intermediate',
        years_experience: 4,
        is_primary: false,
        verified: true,
        certified: true,
        certification_name: 'Plumbing CPVC Joint Certification',
        tasks: ['Tap Repair & Washer Replacement', 'Pipe Leakage Repair', 'Bathroom Plumbing & Flush Tank'],
        created_at: '2023-09-20'
      },
      {
        id: 'ws-manoj-3',
        worker_id: 'wrk-manoj-multi',
        skill_id: 'skill-appliance',
        skill_name: 'Appliance Repair Technician',
        category: 'skilled',
        skill_level: 'intermediate',
        years_experience: 3,
        is_primary: false,
        verified: true,
        certified: false,
        tasks: ['Washing Machine Repair', 'AC Technician & Servicing'],
        created_at: '2024-02-10'
      }
    ],
    certifications: [
      {
        title: 'NSDC Master Technician Certified',
        issuedBy: 'Skill India / NSDC',
        year: 2020,
        certificateId: 'NSDC-TECH-2020-9941'
      }
    ],
    preferences: {
      preferred_job_types: ['Electrical', 'Plumbing', 'Appliance Repair'],
      preferred_areas: ['Peelamedu', 'Hopes College', 'Singanallur', 'Ramanathapuram'],
      max_travel_distance_km: 12,
      preferred_shifts: ['Morning (6 AM – 12 PM)', 'Afternoon (12 PM – 5 PM)', 'Evening (5 PM – 9 PM)'],
      active_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    opportunities_received_count: 52,
    cooperative_id: 'COOP-TN-8891',
    cooperative_name: 'Coimbatore District Labour Cooperative Union',
    created_at: '2022-11-04'
  },

  // 3. MURUGAN PALANIVEL — SKILLED (Plumber Specialist)
  {
    id: 'wrk-murugan-plumb',
    name: 'Murugan Palanivel',
    name_hi: 'मुरुगन पलानीवेल',
    name_ta: 'முருகன் பழனிவேல்',
    phone: '+91 94441 22334',
    worker_type: 'skilled',
    primary_skill_id: 'skill-plumber',
    primary_skill_label: 'Master Sanitary Plumber',
    experience_years: 15,
    verification_status: 'verified',
    availability_status: true,
    emergency_available: true,
    rating: 4.96,
    completed_jobs: 312,
    current_location: 'RS Puram, Coimbatore',
    service_radius_km: 8,
    skills: [
      {
        id: 'ws-murugan-1',
        worker_id: 'wrk-murugan-plumb',
        skill_id: 'skill-plumber',
        skill_name: 'Plumber',
        category: 'skilled',
        skill_level: 'expert',
        years_experience: 15,
        is_primary: true,
        verified: true,
        certified: true,
        certification_name: 'Tamil Nadu Master Plumber Council',
        tasks: [
          'Tap Repair & Washer Replacement',
          'Pipe Leakage Repair',
          'Bathroom Plumbing & Flush Tank',
          'Water Tank Connection & Float Valve'
        ],
        created_at: '2021-03-01'
      }
    ],
    certifications: [
      {
        title: 'Master Plumbing & Hydro-Testing Certificate',
        issuedBy: 'State Artisans Guild',
        year: 2015,
        certificateId: 'SAG-MP-2015-1044'
      }
    ],
    preferences: {
      preferred_job_types: ['Plumbing', 'Bathroom Fittings', 'Overhead Tank Pipeline'],
      preferred_areas: ['RS Puram', 'Race Course', 'Gandhipuram', 'Saibaba Colony'],
      max_travel_distance_km: 8,
      preferred_shifts: ['Morning (6 AM – 12 PM)', 'Afternoon (12 PM – 5 PM)'],
      active_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    opportunities_received_count: 88,
    cooperative_id: 'COOP-TN-8891',
    cooperative_name: 'Coimbatore District Labour Cooperative Union',
    created_at: '2020-04-18'
  },

  // 4. LAKSHMI PRIYA — GENERAL WORKER (Cleaning, Loading, Household Helper)
  {
    id: 'wrk-lakshmi-gen',
    name: 'Lakshmi Priya',
    name_hi: 'लक्ष्मी प्रिया',
    name_ta: 'லட்சுமி பிரியா',
    phone: '+91 98412 99881',
    worker_type: 'general',
    primary_skill_id: 'skill-cleaning',
    primary_skill_label: 'General Work & Household Services',
    experience_years: 3,
    verification_status: 'verified',
    availability_status: true,
    emergency_available: false,
    rating: 4.82,
    completed_jobs: 94,
    current_location: 'Saibaba Colony, Coimbatore',
    service_radius_km: 8,
    skills: [
      {
        id: 'ws-lakshmi-1',
        worker_id: 'wrk-lakshmi-gen',
        skill_id: 'skill-cleaning',
        skill_name: 'House & Office Cleaning',
        category: 'general',
        skill_level: 'expert',
        years_experience: 3,
        is_primary: true,
        verified: true,
        tasks: ['House Cleaning', 'Deep Cleaning & Floor Scrubbing', 'Office Cleaning'],
        created_at: '2023-04-01'
      },
      {
        id: 'ws-lakshmi-2',
        worker_id: 'wrk-lakshmi-gen',
        skill_id: 'skill-moving',
        skill_name: 'Loading & Unloading',
        category: 'general',
        skill_level: 'intermediate',
        years_experience: 2,
        is_primary: false,
        verified: true,
        tasks: ['House Shifting Helper', 'Packing & Wrapping'],
        created_at: '2023-06-15'
      },
      {
        id: 'ws-lakshmi-3',
        worker_id: 'wrk-lakshmi-gen',
        skill_id: 'skill-household',
        skill_name: 'Household Helper',
        category: 'general',
        skill_level: 'intermediate',
        years_experience: 3,
        is_primary: false,
        verified: true,
        tasks: ['Household General Assistance'],
        created_at: '2023-04-01'
      }
    ],
    certifications: [
      {
        title: 'PMSBY Cooperative Safety & Hygiene Induction',
        issuedBy: 'Labour Welfare Board',
        year: 2023,
        certificateId: 'LWB-HYG-2023-4109'
      }
    ],
    preferences: {
      preferred_job_types: ['Deep Cleaning', 'House Shifting Helper', 'Packing Work'],
      preferred_areas: ['Saibaba Colony', 'RS Puram', 'Rathinapuri', 'Gandhipuram'],
      max_travel_distance_km: 8,
      preferred_shifts: ['Morning (6 AM – 12 PM)', 'Afternoon (12 PM – 5 PM)'],
      active_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    opportunities_received_count: 22,
    cooperative_id: 'COOP-TN-8891',
    cooperative_name: 'Coimbatore District Labour Cooperative Union',
    created_at: '2023-04-01'
  },

  // 5. ARUMUGAM S. — SEMI-SKILLED HELPER (Electrical & Construction Helper)
  {
    id: 'wrk-arumugam-helper',
    name: 'Arumugam S.',
    name_hi: 'अरुमुगम एस.',
    name_ta: 'ஆறுமுகம் எஸ்.',
    phone: '+91 94432 66778',
    worker_type: 'semi_skilled',
    primary_skill_id: 'skill-elec-helper',
    primary_skill_label: 'Electrical & Site Helper',
    experience_years: 2,
    verification_status: 'verified',
    availability_status: true,
    emergency_available: false,
    rating: 4.75,
    completed_jobs: 67,
    current_location: 'Ramanathapuram, Coimbatore',
    service_radius_km: 10,
    skills: [
      {
        id: 'ws-arumugam-1',
        worker_id: 'wrk-arumugam-helper',
        skill_id: 'skill-elec-helper',
        skill_name: 'Electrical Helper',
        category: 'semi_skilled',
        skill_level: 'intermediate',
        years_experience: 2,
        is_primary: true,
        verified: true,
        tasks: ['Carrying Electrical Materials & Channelling', 'Basic Wire Preparation & Cable Pulling'],
        created_at: '2024-01-10'
      },
      {
        id: 'ws-arumugam-2',
        worker_id: 'wrk-arumugam-helper',
        skill_id: 'skill-const-helper',
        skill_name: 'Construction Helper',
        category: 'semi_skilled',
        skill_level: 'intermediate',
        years_experience: 2,
        is_primary: false,
        verified: true,
        tasks: ['Mortar Preparation & Material Staging'],
        created_at: '2024-03-01'
      }
    ],
    certifications: [
      {
        title: 'Apprentice Helper On-Site Safety Course',
        issuedBy: 'Cooperative Apprentice Council',
        year: 2024,
        certificateId: 'CAC-SAF-2024-0081'
      }
    ],
    preferences: {
      preferred_job_types: ['Electrical Helper', 'Site Material Handling'],
      preferred_areas: ['Ramanathapuram', 'Singanallur', 'Ukkadam'],
      max_travel_distance_km: 10,
      preferred_shifts: ['Morning (6 AM – 12 PM)', 'Afternoon (12 PM – 5 PM)'],
      active_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    opportunities_received_count: 18,
    cooperative_id: 'COOP-TN-8891',
    cooperative_name: 'Coimbatore District Labour Cooperative Union',
    created_at: '2024-01-10'
  }
];

export const DEFAULT_ACTIVE_WORKER = STRUCTURED_WORKER_PROFILES[0]; // Ramesh Kumar (Skilled Electrician)
