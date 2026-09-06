import { SkillDefinition, WorkerCategory } from '../types/workerSkillRegistry';

const SKILLS_STORAGE_KEY = 'sahakari_coop_skills_registry_v1';

/**
 * Initial Master Skill Registry for Cooperative Gig Platform
 * Distinguishes between SKILLED, SEMI_SKILLED, and GENERAL.
 * Fully configurable by Cooperative Admins.
 */
export const INITIAL_SKILLS_REGISTRY: SkillDefinition[] = [
  // ===================== SKILLED =====================
  {
    id: 'skill-electrician',
    category: 'skilled',
    skill_name: 'Electrician',
    description: 'Electrical installations, diagnosis, wiring, and appliance circuit repairs',
    verification_required: true,
    active: true,
    trade_icon: '⚡',
    tasks: [
      {
        id: 'task-elec-fan',
        skill_id: 'skill-electrician',
        task_name: 'Fan Installation',
        description: 'Ceiling, exhaust, and wall fan assembly, hook connection and testing',
        min_experience_years: 1,
        default_estimated_minutes: 45,
        tools_required: 'Tester, insulated pliers, screwdriver set',
        is_regulated_trade: true
      },
      {
        id: 'task-elec-light',
        skill_id: 'skill-electrician',
        task_name: 'Light Installation',
        description: 'LED battens, spotlights, chandeliers and decorative lighting fixtures',
        min_experience_years: 1,
        default_estimated_minutes: 30,
        tools_required: 'Wire stripper, drill machine, tester',
        is_regulated_trade: true
      },
      {
        id: 'task-elec-switch',
        skill_id: 'skill-electrician',
        task_name: 'Switch & Socket Repair',
        description: 'Replacement of burnt switches, modular sockets, and power points',
        min_experience_years: 1,
        default_estimated_minutes: 30,
        tools_required: 'Insulated tester, wire cutter',
        is_regulated_trade: true
      },
      {
        id: 'task-elec-wiring',
        skill_id: 'skill-electrician',
        task_name: 'House Wiring & Circuit Repair',
        description: 'Conduit wiring, MCB distribution board installation and short circuit isolation',
        min_experience_years: 2,
        default_estimated_minutes: 90,
        tools_required: 'Multimeter, insulation tape, conduit wire puller',
        is_regulated_trade: true
      },
      {
        id: 'task-elec-mcb',
        skill_id: 'skill-electrician',
        task_name: 'Emergency MCB & Distribution Board',
        description: 'Emergency tripping diagnostics and distribution panel repairs',
        min_experience_years: 2,
        default_estimated_minutes: 45,
        tools_required: 'Heavy duty insulated pliers, digital multimeter, clamp meter',
        is_regulated_trade: true
      }
    ]
  },
  {
    id: 'skill-plumber',
    category: 'skilled',
    skill_name: 'Plumber',
    description: 'Sanitary plumbing, leakage diagnosis, CPVC piping, and water fixture installation',
    verification_required: true,
    active: true,
    trade_icon: '🔧',
    tasks: [
      {
        id: 'task-plumb-tap',
        skill_id: 'skill-plumber',
        task_name: 'Tap Repair & Washer Replacement',
        description: 'Dripping tap repair, angle valve change, and mixer cartridge replacement',
        min_experience_years: 1,
        default_estimated_minutes: 30,
        tools_required: 'Pipe wrench, adjustable spanner, teflon tape',
        is_regulated_trade: true
      },
      {
        id: 'task-plumb-leak',
        skill_id: 'skill-plumber',
        task_name: 'Pipe Leakage Repair',
        description: 'Concealed or exposed PVC/CPVC pipeline joint leak repair',
        min_experience_years: 1,
        default_estimated_minutes: 45,
        tools_required: 'Hacksaw, solvent cement, coupling connectors',
        is_regulated_trade: true
      },
      {
        id: 'task-plumb-bath',
        skill_id: 'skill-plumber',
        task_name: 'Bathroom Plumbing & Flush Tank',
        description: 'Flush valve replacement, commode fitting, shower head installation',
        min_experience_years: 2,
        default_estimated_minutes: 60,
        tools_required: 'Basin wrench, silicone sealant, heavy spanners',
        is_regulated_trade: true
      },
      {
        id: 'task-plumb-tank',
        skill_id: 'skill-plumber',
        task_name: 'Water Tank Connection & Float Valve',
        description: 'Overhead tank inlet/outlet fitting and automatic float ball valve setup',
        min_experience_years: 2,
        default_estimated_minutes: 90,
        tools_required: 'Pipe dies, threading machine, chain wrench',
        is_regulated_trade: true
      }
    ]
  },
  {
    id: 'skill-carpenter',
    category: 'skilled',
    skill_name: 'Carpenter',
    description: 'Woodwork, door latch repair, furniture restoration, and modular cabinetry',
    verification_required: true,
    active: true,
    trade_icon: '🪚',
    tasks: [
      {
        id: 'task-carp-door',
        skill_id: 'skill-carpenter',
        task_name: 'Door Repair & Lock Installation',
        description: 'Door hinge alignment, cylindrical lock fitting, tower bolt repair',
        min_experience_years: 1,
        default_estimated_minutes: 45,
        tools_required: 'Chisel set, cordless drill, wooden planer',
        is_regulated_trade: true
      },
      {
        id: 'task-carp-furniture',
        skill_id: 'skill-carpenter',
        task_name: 'Furniture Repair & Assembly',
        description: 'Bed frame stabilization, chair joint fixing, flat-pack wardrobe assembly',
        min_experience_years: 1,
        default_estimated_minutes: 60,
        tools_required: 'Hammer, clamp, screw bits, wood glue',
        is_regulated_trade: true
      },
      {
        id: 'task-carp-shelf',
        skill_id: 'skill-carpenter',
        task_name: 'Shelf Installation & Woodwork',
        description: 'Wall floating shelves, plywood partition, curtain rod mounting',
        min_experience_years: 1,
        default_estimated_minutes: 45,
        tools_required: 'Spirit level, masonry drill, screws',
        is_regulated_trade: true
      }
    ]
  },
  {
    id: 'skill-appliance',
    category: 'skilled',
    skill_name: 'Appliance Repair Technician',
    description: 'Washing machine, refrigerator, water purifier, and microwave servicing',
    verification_required: true,
    active: true,
    trade_icon: '⚙️',
    tasks: [
      {
        id: 'task-app-wm',
        skill_id: 'skill-appliance',
        task_name: 'Washing Machine Repair',
        description: 'Motor belt check, drain pump unclogging, spin cycle balance',
        min_experience_years: 2,
        default_estimated_minutes: 60,
        tools_required: 'Socket set, multimeter, clamp meter',
        is_regulated_trade: true
      },
      {
        id: 'task-app-ac',
        skill_id: 'skill-appliance',
        task_name: 'AC Technician & Servicing',
        description: 'Filter jet spray cleaning, cooling coil wash, gas pressure check',
        min_experience_years: 2,
        default_estimated_minutes: 60,
        tools_required: 'Pressure pump, manifold gauge, fin comb',
        is_regulated_trade: true
      }
    ]
  },
  {
    id: 'skill-mason',
    category: 'skilled',
    skill_name: 'Mason',
    description: 'Brickwork, plastering, tile replacement, and structural civil repairs',
    verification_required: true,
    active: true,
    trade_icon: '🧱',
    tasks: [
      {
        id: 'task-mason-tile',
        skill_id: 'skill-mason',
        task_name: 'Tile Replacement & Grouting',
        description: 'Broken floor tile replacement, epoxy grouting in bathrooms',
        min_experience_years: 1,
        default_estimated_minutes: 90,
        tools_required: 'Trowel, tile cutter, rubber mallet',
        is_regulated_trade: true
      },
      {
        id: 'task-mason-plaster',
        skill_id: 'skill-mason',
        task_name: 'Plaster Repair & Crack Filling',
        description: 'Wall patch plastering and waterproof seal application',
        min_experience_years: 2,
        default_estimated_minutes: 90,
        tools_required: 'Float, trowel, mixing pan',
        is_regulated_trade: true
      }
    ]
  },

  // ===================== SEMI-SKILLED =====================
  {
    id: 'skill-elec-helper',
    category: 'semi_skilled',
    skill_name: 'Electrical Helper',
    description: 'Carrying electrical materials, trench channelling, and assisting wireman',
    verification_required: false,
    active: true,
    trade_icon: '🔌',
    tasks: [
      {
        id: 'task-hlp-carry-elec',
        skill_id: 'skill-elec-helper',
        task_name: 'Carrying Electrical Materials & Channelling',
        description: 'Assisting senior wireman with conduit layout and carrying ladders',
        min_experience_years: 0,
        default_estimated_minutes: 60,
        tools_required: 'Safety gloves',
        is_regulated_trade: false
      },
      {
        id: 'task-hlp-strip',
        skill_id: 'skill-elec-helper',
        task_name: 'Basic Wire Preparation & Cable Pulling',
        description: 'Pulling cable through pipes under supervision of certified wireman',
        min_experience_years: 0.5,
        default_estimated_minutes: 60,
        tools_required: 'Gloves, wire cutter',
        is_regulated_trade: false
      }
    ]
  },
  {
    id: 'skill-plumb-helper',
    category: 'semi_skilled',
    skill_name: 'Plumbing Helper',
    description: 'Trench digging for pipelines, carrying sanitary ware, and pipe cleaning assistance',
    verification_required: false,
    active: true,
    trade_icon: '🚰',
    tasks: [
      {
        id: 'task-hlp-trench',
        skill_id: 'skill-plumb-helper',
        task_name: 'Pipeline Trenching & Assisting Plumber',
        description: 'Digging ground channels for drain pipes and carrying PVC materials',
        min_experience_years: 0,
        default_estimated_minutes: 90,
        tools_required: 'Spade, gloves',
        is_regulated_trade: false
      }
    ]
  },
  {
    id: 'skill-const-helper',
    category: 'semi_skilled',
    skill_name: 'Construction Helper',
    description: 'Mortar mixing assistance, scaffolding support, and site material staging',
    verification_required: false,
    active: true,
    trade_icon: '🏗️',
    tasks: [
      {
        id: 'task-hlp-mortar',
        skill_id: 'skill-const-helper',
        task_name: 'Mortar Preparation & Material Staging',
        description: 'Assisting mason with sand and cement mixing on site',
        min_experience_years: 0,
        default_estimated_minutes: 120,
        tools_required: 'Boots, gloves',
        is_regulated_trade: false
      }
    ]
  },
  {
    id: 'skill-garden-helper',
    category: 'semi_skilled',
    skill_name: 'Gardening Assistant',
    description: 'Lawn mowing, hedge trimming, weeding beds, and organic composting',
    verification_required: false,
    active: true,
    trade_icon: '🌱',
    tasks: [
      {
        id: 'task-garden-trim',
        skill_id: 'skill-garden-helper',
        task_name: 'Hedge Trimming & Pruning',
        description: 'Trimming boundary shrubs and garden border maintenance',
        min_experience_years: 0.5,
        default_estimated_minutes: 90,
        tools_required: 'Pruning shears, gloves',
        is_regulated_trade: false
      }
    ]
  },

  // ===================== GENERAL WORKERS =====================
  {
    id: 'skill-cleaning',
    category: 'general',
    skill_name: 'House & Office Cleaning',
    description: 'Deep cleaning, floor scrubbing, post-renovation cleanup, and sanitization',
    verification_required: false,
    active: true,
    trade_icon: '🧹',
    tasks: [
      {
        id: 'task-clean-house',
        skill_id: 'skill-cleaning',
        task_name: 'House Cleaning',
        description: 'Sweeping, wet mopping, dusting furniture, kitchen wipe-down',
        min_experience_years: 0,
        default_estimated_minutes: 90,
        tools_required: 'Mop, wiper, dusting cloths',
        is_regulated_trade: false
      },
      {
        id: 'task-clean-deep',
        skill_id: 'skill-cleaning',
        task_name: 'Deep Cleaning & Floor Scrubbing',
        description: 'Acid-free tile scrubbing, bathroom scaling removal, balcony wash',
        min_experience_years: 0,
        default_estimated_minutes: 120,
        tools_required: 'Scrubbing brush, wiper, buckets',
        is_regulated_trade: false
      },
      {
        id: 'task-clean-office',
        skill_id: 'skill-cleaning',
        task_name: 'Office Cleaning',
        description: 'Desk wipe down, waste bin disposal, and reception floor upkeep',
        min_experience_years: 0,
        default_estimated_minutes: 90,
        tools_required: 'Microfiber cloth, mop',
        is_regulated_trade: false
      }
    ]
  },
  {
    id: 'skill-moving',
    category: 'general',
    skill_name: 'Loading & Unloading',
    description: 'Manual material handling, truck loading/unloading, and warehouse stacking',
    verification_required: false,
    active: true,
    trade_icon: '📦',
    tasks: [
      {
        id: 'task-move-load',
        skill_id: 'skill-moving',
        task_name: 'Loading & Unloading Goods',
        description: 'Carrying cartons, tile boxes, and commercial cargo from tempos',
        min_experience_years: 0,
        default_estimated_minutes: 120,
        tools_required: 'Grip gloves, lifting straps (co-op provided)',
        is_regulated_trade: false
      },
      {
        id: 'task-move-shift',
        skill_id: 'skill-moving',
        task_name: 'House Shifting Helper',
        description: 'Moving cot, sofa, refrigerator, and boxes up/down stairs carefully',
        min_experience_years: 0,
        default_estimated_minutes: 180,
        tools_required: 'Cotton gloves',
        is_regulated_trade: false
      },
      {
        id: 'task-move-pack',
        skill_id: 'skill-moving',
        task_name: 'Packing & Wrapping',
        description: 'Bubble wrapping fragile items, sealing corrugated boxes',
        min_experience_years: 0,
        default_estimated_minutes: 90,
        tools_required: 'Tape dispenser, box cutter',
        is_regulated_trade: false
      }
    ]
  },
  {
    id: 'skill-event-helper',
    category: 'general',
    skill_name: 'Event Setup Worker',
    description: 'Arranging chairs, banquet tables, shamiana setup, and stage assistance',
    verification_required: false,
    active: true,
    trade_icon: '🎪',
    tasks: [
      {
        id: 'task-event-setup',
        skill_id: 'skill-event-helper',
        task_name: 'Event Setup & Chair Arrangement',
        description: 'Unloading 200+ plastic chairs, arranging rows, cloth table coverings',
        min_experience_years: 0,
        default_estimated_minutes: 120,
        tools_required: 'None',
        is_regulated_trade: false
      }
    ]
  },
  {
    id: 'skill-household',
    category: 'general',
    skill_name: 'Household Helper',
    description: 'General daily home assistance, terrace clearing, water storage help',
    verification_required: false,
    active: true,
    trade_icon: '🏡',
    tasks: [
      {
        id: 'task-house-help',
        skill_id: 'skill-household',
        task_name: 'Household General Assistance',
        description: 'Clearing store room, shifting flower pots, water container filling',
        min_experience_years: 0,
        default_estimated_minutes: 60,
        tools_required: 'None',
        is_regulated_trade: false
      }
    ]
  }
];

class CooperativeSkillRegistryService {
  private skills: SkillDefinition[] = [];

  constructor() {
    this.loadSkills();
  }

  private loadSkills() {
    try {
      const stored = localStorage.getItem(SKILLS_STORAGE_KEY);
      if (stored) {
        this.skills = JSON.parse(stored);
      } else {
        this.skills = INITIAL_SKILLS_REGISTRY;
        this.saveSkills();
      }
    } catch {
      this.skills = INITIAL_SKILLS_REGISTRY;
    }
  }

  private saveSkills() {
    try {
      localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(this.skills));
    } catch (e) {
      console.error('Failed to persist skills registry:', e);
    }
  }

  /**
   * Returns all active skills
   */
  getActiveSkills(): SkillDefinition[] {
    return this.skills.filter((s) => s.active);
  }

  /**
   * Alias for getActiveSkills
   */
  getAllSkills(): SkillDefinition[] {
    return this.getActiveSkills();
  }

  /**
   * Returns skills by category
   */
  getSkillsByCategory(category: WorkerCategory): SkillDefinition[] {
    return this.skills.filter((s) => s.active && s.category === category);
  }

  /**
   * Find skill by ID
   */
  getSkillById(id: string): SkillDefinition | undefined {
    return this.skills.find((s) => s.id === id);
  }

  /**
   * Find skill by name or partial match
   */
  getSkillByName(name: string): SkillDefinition | undefined {
    const clean = name.toLowerCase().trim();
    return this.skills.find((s) => 
      s.skill_name.toLowerCase().includes(clean) || clean.includes(s.skill_name.toLowerCase())
    );
  }

  /**
   * Admin API: Add new skill
   */
  addSkill(skill: Omit<SkillDefinition, 'id'>): SkillDefinition {
    const newSkill: SkillDefinition = {
      ...skill,
      id: `skill-${Date.now()}`
    };
    this.skills.push(newSkill);
    this.saveSkills();
    return newSkill;
  }

  /**
   * Admin API: Toggle active status of a skill
   */
  toggleSkillActive(skillId: string): boolean {
    const target = this.skills.find((s) => s.id === skillId);
    if (target) {
      target.active = !target.active;
      this.saveSkills();
      return target.active;
    }
    return false;
  }

  /**
   * Reset registry to defaults
   */
  resetToDefaults() {
    this.skills = INITIAL_SKILLS_REGISTRY;
    this.saveSkills();
  }
}

export const skillRegistry = new CooperativeSkillRegistryService();
export const cooperativeSkillRegistry = skillRegistry;
