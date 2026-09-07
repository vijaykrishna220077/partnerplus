import React from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Droplets, 
  HardHat, 
  Hammer, 
  Paintbrush, 
  AirVent, 
  BrickWall, 
  Flame, 
  Car, 
  Tractor, 
  Trees, 
  Network, 
  Wrench, 
  Banknote,
  LucideIcon 
} from 'lucide-react';

import { useApp } from '../context/AppContext';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceKey: string | null;
  onOpenQuote: (service: string) => void;
}

interface DetailItem {
  title: string;
  tagline: string;
  icon: LucideIcon;
  description: string;
  specs: string[];
  startingRate: number;
}

const SERVICE_DATA: Record<string, DetailItem> = {
  electrical: {
    title: 'Electrical & Power Systems',
    tagline: 'Licensed & ITI-Certified Electricians with Complete Safety Gear',
    icon: Zap,
    startingRate: 199,
    description: 'Complete household and commercial electrical services. From fixing sparking switchboards, ceiling fan repairs, and fuse tripping to full house rewiring and solar/inverter battery connections.',
    specs: [
      'Certified electricians with digital multimeters and insulated VDE tools',
      'Short-circuit diagnosis, leakage current testing, and earthing audits',
      'Ceiling fans, exhaust fans, chandelier & decorative light installation',
      'MCB / ELCB distribution board repair and load balancing',
      '30-Day Cooperative Service Guarantee on all labor work'
    ]
  },
  plumbing: {
    title: 'Plumbing & Water Systems',
    tagline: 'Rapid Leak Repairs, Blockage Clearing & Water Tank Cleaning',
    icon: Droplets,
    startingRate: 249,
    description: 'Expert plumbing solutions for persistent tap leaks, pipe bursts, bathroom sanitary installations, and high-pressure overhead water tank decontamination.',
    specs: [
      'High-pressure rotary drain unclogging coils for blocked sinks & toilets',
      'Overhead & underground water tank sludge suction and UV sanitization',
      'Hot and cold water CPVC/PPR pipe joint welding and leak stoppage',
      'Water motor pump priming, foot valve, and pressure booster repair',
      'Zero markup on pipes or brass fittings—billed transparently at MRP'
    ]
  },
  hvac: {
    title: 'HVAC & Refrigeration',
    tagline: 'Precision Cooling, Deep Coil Chemical Jet-Wash & Eco Gas Top-Up',
    icon: AirVent,
    startingRate: 499,
    description: 'Complete heating, ventilation, and air conditioning solutions for split, window, cassette, and central ducted setups. High-pressure jet pumps and leak-free copper brazing.',
    specs: [
      'High-pressure chemical jet foaming for evaporator coils and condenser fins',
      'Electronic halogen leak detection and nitrogen pressure load testing',
      'Pure R32/R410A refrigerant gas vacuum charging with manifold gauges',
      'Central AC duct sanitation, air damper balancing, and HEPA filter change',
      'Zero markup on copper tubing, capacitors, or flare brass nuts'
    ]
  },
  masonry: {
    title: 'Masonry & Concrete Works',
    tagline: 'Precision Civil Repair, Laser Tile Setting & Structural Plastering',
    icon: BrickWall,
    startingRate: 499,
    description: 'Master civil masons for residential wall construction, structural plaster repairs, bathroom tile replacements, and concrete floor screeding with zero middleman markup.',
    specs: [
      'Precision spirit-level bricklaying, AAC block bonding, and joint raking',
      'Laser-aligned floor and wall vitrified tile laying with epoxy grouting',
      'Waterproof polymer cement plastering for damp patches and crumbling walls',
      'Concrete slab coring, rebar rust treatment, and structural micro-concrete',
      'Site cleanup and aggregate debris disposal included in service'
    ]
  },
  welding: {
    title: 'Welding & Metal Fabrication',
    tagline: 'Certified Metal Fabricators for Heavy Gates, Grills & Argon TIG Work',
    icon: Flame,
    startingRate: 399,
    description: 'On-site mobile welding and fabrication for security grills, broken gate hinges, rolling shutters, MS frame sheds, and architectural stainless steel railings.',
    specs: [
      'Portable inverter ARC & MIG/TIG shielded welding at your doorstep',
      'High-strength structural welding for heavy entrance gates and window grills',
      'Commercial shop rolling shutter alignment, coil springs, and bracket repair',
      'Stainless steel (SS304) food-grade and aesthetic railing seam blending',
      'Anti-rust red oxide primer application on all newly welded metal joints'
    ]
  },
  mechanic: {
    title: 'Auto & Fleet Mechanics',
    tagline: 'Doorstep Breakdown Assistance, Computerized OBD-II & Fleet Care',
    icon: Car,
    startingRate: 349,
    description: 'Certified mobile mechanics equipped with high-amp jumper packs, OBD-II digital scanners, brake fluid testers, and essential road assistance gear.',
    specs: [
      'Heavy-duty 12V/24V battery jumpstart, terminal cleanup, and alternator test',
      'OBD-II ECU computer error code diagnosis and live sensor health report',
      'Brake pad replacement, disc caliper lubrication, and hydraulic bleed',
      'Multi-point commercial fleet preventive maintenance and fluid top-ups',
      'Clear transparent parts billing with original manufacturer invoices'
    ]
  },
  heavy_machinery: {
    title: 'Heavy Machinery Operators',
    tagline: 'NSDC-Certified Operators for JCBs, Forklifts, Cranes & Compactors',
    icon: Tractor,
    startingRate: 750,
    description: 'Certified, safety-cleared equipment operators for industrial warehouses, construction earthmoving, loading bays, and civil roadway development projects.',
    specs: [
      'Certified operators with valid heavy-transport and equipment endorsements',
      'Trenching, deep foundation excavation, and precision earth leveling',
      'High-bay warehouse pallet maneuvering with strict OSHA protocol',
      'Hydraulic boom rigging, safe radius lifting, and load-limit compliance',
      '100% insured under the Cooperative Labour Welfare and Accidental Shield'
    ]
  },
  landscaping: {
    title: 'Landscaping & Yard Care',
    tagline: 'Horticulture Specialists for High Tree Pruning, Mowing & Turf Care',
    icon: Trees,
    startingRate: 399,
    description: 'Professional lawn and estate groundskeepers. Maintain residential gardens, corporate greens, boundary hedge shaping, and hazardous branch cutting.',
    specs: [
      'Arborist harness climbing for hazardous tall branch thinning and reduction',
      'Rotary lawn mowing, precision nylon edge trimming, and thatch clearing',
      'Artistic hedge contouring, bush manicuring, and ornamental plant pruning',
      'Soil aeration, vermicompost top-dressing, and biological pest prevention',
      'Complete collection, bagging, and composting of green organic waste'
    ]
  },
  it_network: {
    title: 'IT & Network Technicians',
    tagline: 'Certified Network Engineers for Structured Cabling & Fiber Wi-Fi',
    icon: Network,
    startingRate: 349,
    description: 'Doorstep IT infrastructure services for homes and small businesses. Structured CAT6 LAN wiring, dual-band Wi-Fi mesh tuning, and CCTV security setup.',
    specs: [
      'Structured CAT6/CAT6A gigabit cabling with punch-down faceplate jacks',
      'Dual-band and Wi-Fi 6 mesh router coverage optimization and SSID security',
      'IP security camera mounting, PoE switch integration, and NVR remote app setup',
      'Desktop PC motherboard diagnostic, RAM/NVMe SSD upgrades, and thermal paste',
      'Guaranteed bandwidth continuity test with digital cable wiremap reports'
    ]
  },
  daily_labor: {
    title: 'Daily Wage Labor & Helpers',
    tagline: 'Reliable Manual Assistance for Moving, Lifting & Site Clearing',
    icon: HardHat,
    startingRate: 450,
    description: 'Dignified, insured manual labor support. Hire verified helpers for half-day (4 hrs) or full-day (8 hrs) for house shifting, warehouse loading, gardening, and debris clearing.',
    specs: [
      'Dignified fair wages pre-fixed by the Labour Welfare Cooperative',
      '100% Cash/UPI directly to worker hands with zero corporate deduction',
      'House shifting furniture carrying, stair climbing, and vehicle loading',
      'Garden weeding, debris bagging, grass trimming, and waste removal',
      'Each worker insured under cooperative health and accidental welfare fund'
    ]
  },
  cleaning: {
    title: 'Deep Cleaning & Sanitation',
    tagline: 'Single-Disc Machine Buffing & Intensive Degreasing',
    icon: Sparkles,
    startingRate: 399,
    description: 'Hospital-grade sanitization and deep cleaning for 1-3 BHK homes, greasy kitchens, lime-stained bathrooms, and fabric sofa/carpet vacuuming.',
    specs: [
      'Commercial single-disc floor scrubbing and tile grout restoration',
      'Kitchen exhaust, chimney, and oil-stained tile degreasing with eco-cleaners',
      'Hard water scaling removal from glass partitions, taps, and commodes',
      'Dry foam vacuum extraction for sofas, mattresses, and fabric chairs',
      'Pet-safe, biodegradable, and non-corrosive sanitation chemicals'
    ]
  },
  carpentry: {
    title: 'Carpentry & Woodwork',
    tagline: 'Master Woodworkers for Locks, Furniture & Precision Drilling',
    icon: Hammer,
    startingRate: 249,
    description: 'Precision carpentry services for main door lock replacements, sagging cupboard hinges, modular furniture assembly, and heavy-duty wall mounting.',
    specs: [
      'Mortise lock installation, computerized cylinder locks, and latch repairs',
      'Cupboard and hydraulic hinge alignment for smooth soft-closing',
      'Heavy-duty masonry hammer drilling for TV brackets, mirrors, and rods',
      'Bed frame tightening, wooden table repairs, and laminate chip fixings',
      'Clean dust collection and immediate post-work sawdust cleanup'
    ]
  },
  painting: {
    title: 'Painting & Masonry Works',
    tagline: 'Wall Crack Sealing, Seepage Treatment & Roller Emulsion',
    icon: Paintbrush,
    startingRate: 399,
    description: 'Professional wall care and civil masonry repair. Solve wall dampness, crumbling plaster, broken floor tiles, and room repainting with expert masons and painters.',
    specs: [
      'Waterproof putty scraping and crack expansion joint sealing',
      'Roller application of two coats of high-grade emulsion paint',
      'Loose tile removal, adhesive re-bonding, and epoxy anti-fungal grouting',
      'Floor and furniture masking plastic sheets to prevent paint splatters',
      'Transparent cooperative labor rate with no hidden contractor markups'
    ]
  },
  appliances: {
    title: 'Appliance Repair & Servicing',
    tagline: 'Certified Technicians for ACs, Washing Machines & Refrigerators',
    icon: Wrench,
    startingRate: 399,
    description: 'Expert diagnostic and repair for all household appliances. Genuine spare parts at MRP, accurate digital multimeters, and transparent labor charges.',
    specs: [
      'Split & window AC power jet cleaning and refrigerant recharge',
      'Front/top-load washing machine drum balance and drain pump overhaul',
      'Frost-free refrigerator thermostat and compressor relay testing',
      'Microwave magnetron inspection and turntable motor repairs',
      '30-Day Cooperative Warranty on all diagnostic and servicing work'
    ]
  }
};

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  serviceKey,
  onOpenQuote
}) => {
  const { t } = useApp();

  if (!isOpen || !serviceKey) return null;
  const key = SERVICE_DATA[serviceKey] ? serviceKey : 'electrical';
  const data = SERVICE_DATA[key];
  const IconComponent = data.icon;

  const localizedTitle = t("jobs." + key + "Job") || data.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0A1226] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D68ED]/30 text-[#00D2FF] text-xs font-bold uppercase tracking-wider mb-2 border border-[#00D2FF]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("landing.guaranteedCooperative") || "Cooperative Service Standard"}</span>
          </div>
          <h2 className="text-2xl font-black font-display text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#00D2FF] shrink-0">
              <IconComponent className="w-5 h-5" />
            </div>
            <span>{localizedTitle}</span>
          </h2>
          <p className="text-xs text-cyan-200 mt-1">{data.tagline}</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-900">{t("booking.baseLabourCharge") || "Standard Rate Guide"}</div>
                <div className="text-[11px] text-emerald-700">{t("booking.welfareSubsidy") || "95% goes directly to worker hands"}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-600 font-semibold">{t("landing.priceTagline") || "Starts from"}</div>
              <div className="text-xl font-black text-emerald-800">₹{data.startingRate}</div>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            {data.description}
          </p>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">{t("jobs.jobDetails") || "Service Capabilities & Standards"}</h4>
            <div className="space-y-2">
              {data.specs.map((spec, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                  <Check className="w-4 h-4 text-[#1D68ED] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition cursor-pointer"
          >
            {t("common.close") || "Close"}
          </button>
          <button
            type="button"
            onClick={() => { onClose(); onOpenQuote(key); }}
            className="px-6 py-2.5 bg-[#1D68ED] hover:bg-blue-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-98"
          >
            <span>{t("booking.bookNow") || "Book Service Now"}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
