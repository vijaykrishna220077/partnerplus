export type WorkerTier = 'skilled' | 'semi_skilled' | 'general';
export type JobUrgency = 'normal' | 'urgent' | 'emergency';
export type JobStatus = 'open' | 'matching' | 'offered' | 'accepted' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'expired';

export interface WorkerJobOpening {
  id: string;
  serviceCategory: string; // e.g. 'plumbing', 'electrical', 'cleaning', 'moving', 'gardening'
  serviceName: string; // e.g. 'Plumbing Service'
  specificTask: string; // e.g. 'Kitchen Tap Repair'
  workerTier: WorkerTier; // 'skilled' | 'semi_skilled' | 'general'
  workerTierLabel: string; // 'Skilled Worker' | 'Semi-Skilled' | 'General Worker'
  requiredSkillId?: string; // e.g. 'skill-electrician', 'skill-plumber'
  requiredSkillName?: string; // e.g. 'Electrician'
  requiredSkills: string[];
  requiredSkillLevel?: 'beginner' | 'intermediate' | 'expert' | 'any';
  minimumExperienceYears?: number;
  toolsRequired: string;
  materialsProvided: string;
  materialsRequired?: string;
  experienceRequired: string;
  customerName: string;
  customerPhone: string;
  isCustomerVerified: boolean;
  serviceArea: string; // e.g. 'Peelamedu, Coimbatore'
  distanceKm: number;
  scheduledDate: string; // e.g. 'Today'
  startTime: string; // e.g. '3:00 PM'
  estimatedDuration: string; // e.g. '45 minutes'
  urgency: JobUrgency;
  customerPrice: number; // e.g. 499
  workerExpectedEarning: number; // e.g. 450
  cooperativeContribution: number; // e.g. 49
  workersRequired: number;
  workersAssigned: number;
  foodProvided?: boolean;
  travelSupportAmount?: number;
  description: string;
  customerAddress: string;
  matchReasons: string[];
  expiresInMinutes?: number;
  tradeIcon: string;
  status: JobStatus;
  createdAt: string;
  photos?: string[];
  expiresAt?: string;
}

export interface WorkerEarningRecord {
  id: string;
  taskTitle: string;
  serviceCategory: string;
  date: string;
  customerArea: string;
  amountEarned: number;
  customerPaid: number;
  welfareDeducted: number;
  status: 'paid' | 'pending';
  paymentMode: 'Cash on Delivery' | 'UPI Direct' | 'Co-op Bank';
  completedAt: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: string;
  duration: string;
  mode: 'In-Person at Co-op Center' | 'Interactive Video & Practice';
  fee: string; // '₹0 / Free'
  certification: string;
  benefits: string;
  enrolled: boolean;
  nextBatch: string;
}

export const INITIAL_WORKER_JOBS: WorkerJobOpening[] = [
  // 1. SKILLED: Plumbing Job
  {
    id: 'job-plumb-01',
    serviceCategory: 'plumbing',
    serviceName: 'Plumbing',
    specificTask: 'Kitchen Tap Repair & Leakage Fix',
    workerTier: 'skilled',
    workerTierLabel: 'Skilled Work',
    requiredSkillId: 'skill-plumber',
    requiredSkillName: 'Plumber',
    requiredSkillLevel: 'intermediate',
    minimumExperienceYears: 1,
    requiredSkills: ['Basic Plumbing', 'Pipe Sealing', 'Tap Replacement'],
    toolsRequired: 'Basic plumbing wrench set & teflon tape',
    materialsProvided: 'Customer has purchased new brass tap',
    materialsRequired: 'None',
    experienceRequired: '1+ year plumbing experience',
    customerName: 'Ananya S. (Verified)',
    customerPhone: '9840123981',
    isCustomerVerified: true,
    serviceArea: 'Peelamedu, Coimbatore',
    distanceKm: 2.4,
    scheduledDate: 'Today',
    startTime: '3:00 PM',
    estimatedDuration: '45 minutes',
    urgency: 'normal',
    customerPrice: 499,
    workerExpectedEarning: 450,
    cooperativeContribution: 49,
    workersRequired: 1,
    workersAssigned: 0,
    description: 'Kitchen sink mixer tap is continuously dripping from base. Needs washer replacement or new tap installation. Tools required from worker.',
    customerAddress: 'Flat 302, Green Meadows Apt, Near PSG Tech, Peelamedu',
    matchReasons: [
      'You have verified plumbing skills',
      'You are available today 12 PM - 5 PM',
      'Close distance (2.4 km away)',
      '100% direct cooperative member earnings'
    ],
    tradeIcon: '🔧',
    status: 'open',
    createdAt: '10 mins ago'
  },

  // 2. SKILLED / EMERGENCY: Electrical Power Issue
  {
    id: 'job-elec-emg-01',
    serviceCategory: 'electrical',
    serviceName: 'Electrical',
    specificTask: 'Power Short Circuit & MCB Trip Repair',
    workerTier: 'skilled',
    workerTierLabel: 'Skilled Work',
    requiredSkillId: 'skill-electrician',
    requiredSkillName: 'Electrician',
    requiredSkillLevel: 'expert',
    minimumExperienceYears: 2,
    requiredSkills: ['Wiring Diagnosis', 'MCB Replacement', 'Short Circuit Safety'],
    toolsRequired: 'Tester, insulation tape, multi-meter, pliers',
    materialsProvided: 'Replacement MCB available if required',
    materialsRequired: 'Tester & safety multimeter',
    experienceRequired: '2+ years certified electrical work',
    customerName: 'Dr. R. Venkat (Verified)',
    customerPhone: '9443218765',
    isCustomerVerified: true,
    serviceArea: 'RS Puram, Coimbatore',
    distanceKm: 1.2,
    scheduledDate: 'Today',
    startTime: 'Available Now (Emergency)',
    estimatedDuration: '30-45 minutes',
    urgency: 'emergency',
    customerPrice: 620,
    workerExpectedEarning: 550,
    cooperativeContribution: 70,
    workersRequired: 1,
    workersAssigned: 0,
    description: 'Main hall and kitchen lights tripped suddenly with burning smell near distribution board. Urgent help needed. Immediate arrival requested.',
    customerAddress: 'House #45, West Club Road, Near Diwan Bahadur Road, RS Puram',
    matchReasons: [
      'Emergency job matching your emergency availability',
      'You hold an ITI / Certified Electrician skill',
      'Very close distance (1.2 km away)',
      'Priority emergency rate of ₹550'
    ],
    expiresInMinutes: 8,
    tradeIcon: '⚡',
    status: 'open',
    createdAt: '2 mins ago'
  },

  // 3. GENERAL / DAILY-WAGE: House Shifting Helper (Multi-Worker Job)
  {
    id: 'job-gen-shift-01',
    serviceCategory: 'moving',
    serviceName: 'General Work',
    specificTask: 'House Shifting & Heavy Furniture Loading',
    workerTier: 'general',
    workerTierLabel: 'General Labour',
    requiredSkillId: 'skill-moving',
    requiredSkillName: 'Loading & Unloading',
    requiredSkillLevel: 'beginner',
    minimumExperienceYears: 0,
    requiredSkills: ['Heavy Lifting', 'Furniture Care', 'Safe Loading'],
    toolsRequired: 'None required (Co-op provides lifting straps & gloves)',
    materialsProvided: 'Cardboard boxes & trolley provided at site',
    experienceRequired: 'No formal certificate required',
    customerName: 'Karthik Narayanan (Verified)',
    customerPhone: '9789012345',
    isCustomerVerified: true,
    serviceArea: 'Gandhipuram, Coimbatore',
    distanceKm: 3.2,
    scheduledDate: 'Today',
    startTime: '9:00 AM – 2:00 PM',
    estimatedDuration: '5 hours',
    urgency: 'normal',
    customerPrice: 800,
    workerExpectedEarning: 700,
    cooperativeContribution: 100,
    workersRequired: 3,
    workersAssigned: 1,
    foodProvided: true,
    travelSupportAmount: 50,
    description: 'Shifting 2BHK items from 1st floor to tempo vehicle. Cot, almirah, sofa, and 12 carton boxes. Lunch & tea provided by customer.',
    customerAddress: 'No. 18, 5th Cross, Cross Cut Road, Gandhipuram',
    matchReasons: [
      'Multi-worker team job with cooperative brothers',
      'Fair daily-wage: ₹700 + ₹50 travel support',
      'Free food provided by customer',
      'Safe lifting gloves provided by cooperative'
    ],
    tradeIcon: '📦',
    status: 'open',
    createdAt: '15 mins ago'
  },

  // 4. GENERAL: House Deep Cleaning Helper
  {
    id: 'job-clean-01',
    serviceCategory: 'cleaning',
    serviceName: 'House Cleaning',
    specificTask: 'Floor Scrubbing & Balcony Deep Cleaning',
    workerTier: 'general',
    workerTierLabel: 'General Labour',
    requiredSkillId: 'skill-cleaning',
    requiredSkillName: 'House & Office Cleaning',
    requiredSkillLevel: 'beginner',
    minimumExperienceYears: 0,
    requiredSkills: ['Floor Scrubbing', 'Wet & Dry Mopping', 'Cobweb Removal'],
    toolsRequired: 'Mop, brush & wiper provided by customer',
    materialsProvided: 'Cleaning liquids, phenyle, buckets available',
    experienceRequired: 'Household cleaning experience',
    customerName: 'Meenakshi Sundaram (Verified)',
    customerPhone: '9841234567',
    isCustomerVerified: true,
    serviceArea: 'Saibaba Colony, Coimbatore',
    distanceKm: 2.8,
    scheduledDate: 'Today',
    startTime: '5:00 PM',
    estimatedDuration: '2 hours',
    urgency: 'normal',
    customerPrice: 720,
    workerExpectedEarning: 650,
    cooperativeContribution: 70,
    workersRequired: 1,
    workersAssigned: 0,
    description: '2-bedroom floor deep scrubbing after painting work. Balcony water wash and dust cleaning. Straightforward cleaning job.',
    customerAddress: '12-A, Alagesan Road, Saibaba Colony',
    matchReasons: [
      'Evening shift match',
      'Quick 2-hour job with ₹650 net earning',
      'Direct member payout on completion'
    ],
    tradeIcon: '🧹',
    status: 'open',
    createdAt: '22 mins ago'
  },

  // 5. SKILLED: Electrician - Ceiling Fan Installation
  {
    id: 'job-elec-fan-01',
    serviceCategory: 'electrical',
    serviceName: 'Electrician',
    specificTask: 'Ceiling Fan Assembly & Installation',
    workerTier: 'skilled',
    workerTierLabel: 'Skilled Work',
    requiredSkillId: 'skill-electrician',
    requiredSkillName: 'Electrician',
    requiredSkillLevel: 'intermediate',
    minimumExperienceYears: 1,
    requiredSkills: ['Fan Assembly', 'Hook Connection', 'Regulator Check'],
    toolsRequired: 'Ladder (customer has), basic electrical tools',
    materialsProvided: 'New Crompton fan in sealed box',
    experienceRequired: '1+ year electrical work',
    customerName: 'Praveen Chandran (Verified)',
    customerPhone: '9940128765',
    isCustomerVerified: true,
    serviceArea: 'Ramanathapuram, Coimbatore',
    distanceKm: 1.7,
    scheduledDate: 'Today',
    startTime: '5:00 PM',
    estimatedDuration: '45 minutes',
    urgency: 'normal',
    customerPrice: 399,
    workerExpectedEarning: 360,
    cooperativeContribution: 39,
    workersRequired: 1,
    workersAssigned: 0,
    description: 'New ceiling fan to be assembled and installed on existing ceiling hook in bedroom. Wire connection and regulator verification.',
    customerAddress: 'Plot 7, Trichy Road, Near Ramanathapuram Signal',
    matchReasons: [
      'Matches your primary electrical skill',
      'Short travel distance (1.7 km)',
      'Quick 45-minute task'
    ],
    tradeIcon: '⚡',
    status: 'open',
    createdAt: '30 mins ago'
  },

  // 6. SEMI-SKILLED: Gardening & Lawn Trimming
  {
    id: 'job-garden-01',
    serviceCategory: 'gardening',
    serviceName: 'Gardening',
    specificTask: 'Garden Hedge Trimming & Leaf Cleanup',
    workerTier: 'semi_skilled',
    workerTierLabel: 'Semi-Skilled',
    requiredSkillId: 'skill-garden-helper',
    requiredSkillName: 'Gardening Assistant',
    requiredSkillLevel: 'beginner',
    minimumExperienceYears: 0,
    requiredSkills: ['Hedge Trimming', 'Weed Removal', 'Plant Watering'],
    toolsRequired: 'Pruner / Hedge shears (customer provides large rake)',
    materialsProvided: 'Water connection & compost bags on site',
    experienceRequired: 'Basic garden maintenance experience',
    customerName: 'Gopinath Krishnan (Verified)',
    customerPhone: '9842109876',
    isCustomerVerified: true,
    serviceArea: 'Race Course, Coimbatore',
    distanceKm: 3.5,
    scheduledDate: 'Tomorrow',
    startTime: '8:00 AM',
    estimatedDuration: '2.5 hours',
    urgency: 'normal',
    customerPrice: 600,
    workerExpectedEarning: 540,
    cooperativeContribution: 60,
    workersRequired: 1,
    workersAssigned: 0,
    description: 'Trimming side hedge bushes, weeding 4 flower beds, and sweeping dry leaves into municipal compost bags.',
    customerAddress: 'Bungalow 4, Race Course Ring Road',
    matchReasons: [
      'Morning calm shift',
      'Lush open garden workspace',
      'Cooperative welfare covered'
    ],
    tradeIcon: '🌱',
    status: 'open',
    createdAt: '45 mins ago'
  },

  // 7. GENERAL / DAILY-WAGE: Loading / Unloading at Commercial Godown
  {
    id: 'job-load-01',
    serviceCategory: 'moving',
    serviceName: 'General Work',
    specificTask: 'Tile Boxes & Hardware Unloading',
    workerTier: 'general',
    workerTierLabel: 'General Labour',
    requiredSkillId: 'skill-moving',
    requiredSkillName: 'Loading & Unloading',
    requiredSkillLevel: 'beginner',
    minimumExperienceYears: 0,
    requiredSkills: ['Material Unloading', 'Stowage Alignment'],
    toolsRequired: 'Hand gloves provided by shop',
    materialsProvided: 'Hand trolley available for rolling boxes',
    experienceRequired: 'Physical fitness for manual unloading',
    customerName: 'Sri Balaji Hardware Store',
    customerPhone: '9443890123',
    isCustomerVerified: true,
    serviceArea: 'Ukkadam, Coimbatore',
    distanceKm: 4.1,
    scheduledDate: 'Today',
    startTime: '11:00 AM',
    estimatedDuration: '3 hours',
    urgency: 'normal',
    customerPrice: 750,
    workerExpectedEarning: 650,
    cooperativeContribution: 100,
    workersRequired: 2,
    workersAssigned: 1,
    foodProvided: true,
    description: 'Unloading 120 tile cartons from mini truck into ground-floor godown. 2 workers required. Tea and drinking water provided.',
    customerAddress: 'Godown 14, Ukkadam Market Road',
    matchReasons: [
      '1 worker already joined - team work',
      'Direct shop payout verified by cooperative',
      'Immediate payment on job sign-off'
    ],
    tradeIcon: '🏗️',
    status: 'open',
    createdAt: '1 hour ago'
  },

  // 8. SKILLED: Appliance Repair - Washing Machine Drum Noise
  {
    id: 'job-app-wm-01',
    serviceCategory: 'appliance_repair',
    serviceName: 'Appliance Repair',
    specificTask: 'Washing Machine Drum & Motor Diagnostics',
    workerTier: 'skilled',
    workerTierLabel: 'Skilled Work',
    requiredSkillId: 'skill-appliance',
    requiredSkillName: 'Appliance Repair Technician',
    requiredSkillLevel: 'intermediate',
    minimumExperienceYears: 2,
    requiredSkills: ['Motor Belt Check', 'Drain Pump Unclogging', 'Spin Balance'],
    toolsRequired: 'Multimeter, socket wrench set, clamp meter',
    materialsProvided: 'None (technician brings test meters)',
    experienceRequired: '2+ years appliance repair experience',
    customerName: 'Sangeetha Mohan (Verified)',
    customerPhone: '9894123456',
    isCustomerVerified: true,
    serviceArea: 'Peelamedu, Coimbatore',
    distanceKm: 2.1,
    scheduledDate: 'Today',
    startTime: '4:30 PM',
    estimatedDuration: '1 hour',
    urgency: 'normal',
    customerPrice: 650,
    workerExpectedEarning: 580,
    cooperativeContribution: 70,
    workersRequired: 1,
    workersAssigned: 0,
    description: 'LG Front Load washing machine producing loud rattling noise during high spin cycle. Water drainage is slow.',
    customerAddress: 'Flat 4A, Mayflower Park, Avinashi Road, Peelamedu',
    matchReasons: [
      'Matches your certified appliance repair trade',
      'Close to your service route',
      'High member payout (₹580)'
    ],
    tradeIcon: '⚙️',
    status: 'open',
    createdAt: '1.5 hours ago'
  },

  // 9. SEMI-SKILLED: Electrical Helper for Conduit Laying
  {
    id: 'job-hlp-elec-01',
    serviceCategory: 'electrical',
    serviceName: 'Electrical Helper',
    specificTask: 'Carrying Electrical Materials & Cable Pulling',
    workerTier: 'semi_skilled',
    workerTierLabel: 'Semi-Skilled Helper',
    requiredSkillId: 'skill-elec-helper',
    requiredSkillName: 'Electrical Helper',
    requiredSkillLevel: 'beginner',
    minimumExperienceYears: 0,
    requiredSkills: ['Carrying Materials', 'Assisting Wireman', 'Conduit Holding'],
    toolsRequired: 'Safety gloves and sturdy footwear',
    materialsProvided: 'Cables, pipes, ladders on construction site',
    experienceRequired: 'Basic helper experience',
    customerName: 'Shree Sai Electrical Contractors',
    customerPhone: '9443311223',
    isCustomerVerified: true,
    serviceArea: 'Singanallur, Coimbatore',
    distanceKm: 3.8,
    scheduledDate: 'Tomorrow',
    startTime: '9:00 AM – 1:00 PM',
    estimatedDuration: '4 hours',
    urgency: 'normal',
    customerPrice: 600,
    workerExpectedEarning: 520,
    cooperativeContribution: 80,
    workersRequired: 2,
    workersAssigned: 1,
    foodProvided: true,
    description: 'Assisting senior licensed electrician on residential new building. Carrying conduit pipes and helping pull 2.5 sqmm copper wires.',
    customerAddress: 'Site #19, Kamarajar Road, Near Singanallur Bus Stand',
    matchReasons: [
      'Learn on-site alongside senior cooperative wireman',
      'Co-op guaranteed wage + free lunch provided',
      '1 helper already joined'
    ],
    tradeIcon: '🔌',
    status: 'open',
    createdAt: '2 hours ago'
  },

  // 10. GENERAL: Event Setup - Community Hall Chairs Arrangement
  {
    id: 'job-event-01',
    serviceCategory: 'general',
    serviceName: 'Event Setup',
    specificTask: 'Chair Arrangement & Banquet Setup',
    workerTier: 'general',
    workerTierLabel: 'General Labour',
    requiredSkillId: 'skill-event-helper',
    requiredSkillName: 'Event Setup Worker',
    requiredSkillLevel: 'beginner',
    minimumExperienceYears: 0,
    requiredSkills: ['Chair Arrangement', 'Table Setup', 'Banner Hanging'],
    toolsRequired: 'None',
    materialsProvided: 'All chairs & banquet cloths available at mandapam',
    experienceRequired: 'No experience required',
    customerName: 'Coimbatore Cultural Mandapam',
    customerPhone: '9442233445',
    isCustomerVerified: true,
    serviceArea: 'RS Puram, Coimbatore',
    distanceKm: 2.2,
    scheduledDate: 'Today',
    startTime: '6:00 PM',
    estimatedDuration: '2 hours',
    urgency: 'normal',
    customerPrice: 500,
    workerExpectedEarning: 450,
    cooperativeContribution: 50,
    workersRequired: 2,
    workersAssigned: 0,
    foodProvided: true,
    description: 'Arranging 300 plastic chairs and 10 dining tables for an evening community felicitation meeting. Simple 2-hour task with snacks.',
    customerAddress: 'Community Hall, Diwan Bahadur Road, RS Puram',
    matchReasons: [
      'Short 2-hour evening gig',
      'Free refreshments provided',
      'Centrally located in RS Puram'
    ],
    tradeIcon: '🎪',
    status: 'open',
    createdAt: '2.5 hours ago'
  }
];

export const INITIAL_WORKER_EARNINGS_HISTORY: WorkerEarningRecord[] = [
  {
    id: 'earn-01',
    taskTitle: 'Kitchen Tap Replacement & Seal',
    serviceCategory: 'plumbing',
    date: 'Today',
    customerArea: 'Peelamedu',
    amountEarned: 450,
    customerPaid: 499,
    welfareDeducted: 49,
    status: 'paid',
    paymentMode: 'Cash on Delivery',
    completedAt: '11:30 AM'
  },
  {
    id: 'earn-02',
    taskTitle: 'House Deep Cleaning & Balcony Wash',
    serviceCategory: 'cleaning',
    date: 'Today',
    customerArea: 'RS Puram',
    amountEarned: 650,
    customerPaid: 720,
    welfareDeducted: 70,
    status: 'paid',
    paymentMode: 'UPI Direct',
    completedAt: '2:15 PM'
  },
  {
    id: 'earn-03',
    taskTitle: 'Switchboard Wire Fix & Fuse Repair',
    serviceCategory: 'electrical',
    date: 'Today',
    customerArea: 'Gandhipuram',
    amountEarned: 350,
    customerPaid: 399,
    welfareDeducted: 49,
    status: 'paid',
    paymentMode: 'Cash on Delivery',
    completedAt: '4:45 PM'
  },
  {
    id: 'earn-04',
    taskTitle: 'Ceiling Fan Installation',
    serviceCategory: 'electrical',
    date: 'Yesterday',
    customerArea: 'Saibaba Colony',
    amountEarned: 360,
    customerPaid: 399,
    welfareDeducted: 39,
    status: 'paid',
    paymentMode: 'UPI Direct',
    completedAt: '5:30 PM'
  },
  {
    id: 'earn-05',
    taskTitle: 'House Shifting Helper (Half Day)',
    serviceCategory: 'moving',
    date: 'Yesterday',
    customerArea: 'Race Course',
    amountEarned: 700,
    customerPaid: 800,
    welfareDeducted: 100,
    status: 'paid',
    paymentMode: 'Co-op Bank',
    completedAt: '2:00 PM'
  },
  {
    id: 'earn-06',
    taskTitle: 'Garden Pruning & Hedge Work',
    serviceCategory: 'gardening',
    date: '2 days ago',
    customerArea: 'Singanallur',
    amountEarned: 540,
    customerPaid: 600,
    welfareDeducted: 60,
    status: 'paid',
    paymentMode: 'Cash on Delivery',
    completedAt: '12:00 PM'
  }
];

export const INITIAL_COOPERATIVE_TRAININGS: TrainingCourse[] = [
  {
    id: 'train-01',
    title: 'Electrical Safety & Shock Prevention Protocol',
    category: 'Electrical Safety',
    duration: '2 Hours (Sat Morning)',
    mode: 'In-Person at Co-op Center',
    fee: '₹0 / Free for Members',
    certification: 'NSDC / State Labour Board Recognized Certificate',
    benefits: 'Qualifies for high-voltage and commercial repair work with 35% higher earnings',
    enrolled: false,
    nextBatch: 'Saturday, 10:00 AM'
  },
  {
    id: 'train-02',
    title: 'Modern PVC & CPVC Pipe Fitting Standards',
    category: 'Plumbing Upgrade',
    duration: '3 Hours',
    mode: 'Interactive Video & Practice',
    fee: '₹0 / Free for Members',
    certification: 'Cooperative Skilled Plumber Badge',
    benefits: 'Learn heat-welded joints & modern concealed flush valves',
    enrolled: true,
    nextBatch: 'Available anytime on mobile'
  },
  {
    id: 'train-03',
    title: 'Safe Furniture Lifting & Ergonomic Handling',
    category: 'General Labour Health',
    duration: '1.5 Hours',
    mode: 'In-Person at Co-op Center',
    fee: '₹0 / Free for Members',
    certification: 'Certified Safe Handling Member',
    benefits: 'Prevents back strain and qualifies for premium warehouse loading contracts',
    enrolled: false,
    nextBatch: 'Monday, 9:00 AM'
  },
  {
    id: 'train-04',
    title: 'Customer Communication & Digital Receipts',
    category: 'Soft Skills & Tech',
    duration: '1 Hour',
    mode: 'Interactive Video & Practice',
    fee: '₹0 / Free for Members',
    certification: '5-Star Service Partner Badge',
    benefits: 'Higher customer tip rate and priority booking allocation',
    enrolled: false,
    nextBatch: 'Online Audio Lessons'
  }
];
