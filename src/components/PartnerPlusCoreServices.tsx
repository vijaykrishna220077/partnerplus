import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Sparkles, 
  Check, 
  ShieldCheck, 
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
  Layers,
  LucideIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PartnerPlusCoreServicesProps {
  onSelectService: (service: string) => void;
  onOpenPrices: (serviceKey?: string) => void;
}

interface ServiceItemDef {
  id: string;
  type: 'trades' | 'helpers' | 'facility' | 'mechanical' | 'digital';
  title: string;
  titleHi: string;
  titleTa: string;
  startingPrice: number;
  unit: string;
  badge: string;
  icon: LucideIcon;
  gradient: string;
  borderColor: string;
  iconBg: string;
  subtext: string;
  highlights: string[];
}

export const PartnerPlusCoreServices: React.FC<PartnerPlusCoreServicesProps> = ({
  onSelectService,
  onOpenPrices
}) => {
  const { lang, t } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'trades' | 'mechanical' | 'facility' | 'digital' | 'helpers'>('all');

  const services: ServiceItemDef[] = [
    {
      id: 'electrical',
      type: 'trades',
      title: 'Electrical & Power Systems',
      titleHi: 'इलेक्ट्रीशियन व बिजली सेवाएं',
      titleTa: 'எலக்ட்ரிக்கல் மற்றும் மின்சார வேலை',
      startingPrice: 199,
      unit: 'starting rate',
      badge: 'Verified Electricians',
      icon: Zap,
      gradient: 'from-amber-500/10 to-orange-500/10',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-800',
      subtext: 'Switchboards, ceiling fans, MCB tripping, full house rewiring, inverter battery setup, and appliance power line diagnostics.',
      highlights: ['Licensed ITI / Certified Artisans', 'All safety gears & insulated tools', '30-Day Cooperative Guarantee']
    },
    {
      id: 'plumbing',
      type: 'trades',
      title: 'Plumbing & Water Systems',
      titleHi: 'प्लंबिंग व पानी पाइपलाइन',
      titleTa: 'பிளம்பிங் மற்றும் தண்ணீர் குழாய்',
      startingPrice: 249,
      unit: 'starting rate',
      badge: 'Emergency Ready',
      icon: Droplets,
      gradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100 text-blue-800',
      subtext: 'Tap leaks, pipe blockage clearing, overhead tank wash, toilet flush valves, booster motor pumps, and sanitary line repair.',
      highlights: ['Pressure drain unclogging coils', 'No MRP markup on pipe spare parts', '15-25 mins rapid arrival']
    },
    {
      id: 'hvac',
      type: 'digital',
      title: 'HVAC & Refrigeration',
      titleHi: 'एचवीएसी व एयर कंडीशनर मरम्मत',
      titleTa: 'ஏசி மற்றும் குளிரூட்டி பராமரிப்பு',
      startingPrice: 499,
      unit: 'starting rate',
      badge: 'Certified HVAC Techs',
      icon: AirVent,
      gradient: 'from-sky-500/10 to-indigo-500/10',
      borderColor: 'border-sky-200',
      iconBg: 'bg-sky-100 text-sky-800',
      subtext: 'AC jet pump foam wash, R32/R410 gas pressure top-up, compressor capacitor replacement, split AC installation, and duct leaks.',
      highlights: ['Digital manifold gauge testing', 'Copper pipe leak brazing', '90-Day cooling warranty']
    },
    {
      id: 'masonry',
      type: 'trades',
      title: 'Masonry & Concrete Works',
      titleHi: 'राजमिस्त्री व कंक्रीट निर्माण',
      titleTa: 'கொத்தனார் மற்றும் கான்கிரீட் வேலை',
      startingPrice: 550,
      unit: 'half-day starting rate',
      badge: 'Master Artisans',
      icon: BrickWall,
      gradient: 'from-stone-500/10 to-neutral-500/10',
      borderColor: 'border-stone-200',
      iconBg: 'bg-stone-100 text-stone-800',
      subtext: 'Precision bricklaying, mortar cement mixing, structural column patching, floor tile setting, boundary walls, and terrace waterproofing.',
      highlights: [
        'Master guild masons with spirit-level and laser leveling accuracy',
        'Covered under State Labour Board and Worker Welfare Fund',
        '0% Corporate middleman fees with honest material estimates'
      ]
    },
    {
      id: 'welding',
      type: 'trades',
      title: 'Welding & Metal Fabrication',
      titleHi: 'वेल्डिंग व मेटल फैब्रिकेशन',
      titleTa: 'வெல்டிங் மற்றும் மெட்டல் பழுது',
      startingPrice: 399,
      unit: 'starting rate',
      badge: 'Certified Welders',
      icon: Flame,
      gradient: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100 text-orange-800',
      subtext: 'On-site MIG, TIG, and electric arc welding. Safety grill fabrication, rolling shutter repairs, gate hinge realignment, and steel structural joints.',
      highlights: [
        'Portable inverter welding units with industrial fire safety gear',
        'Direct cooperative payout with accidental welfare insurance',
        'High-tensile structural weld guarantee with anti-rust priming'
      ]
    },
    {
      id: 'auto_fleet',
      type: 'mechanical',
      title: 'Auto & Fleet Mechanics',
      titleHi: 'ऑटो व फ्लीट मैकेनिक (Doorstep)',
      titleTa: 'வாகன மற்றும் கடற்படை மெக்கானிக்',
      startingPrice: 349,
      unit: 'starting rate',
      badge: 'Doorstep Mechanics',
      icon: Car,
      gradient: 'from-red-500/10 to-rose-500/10',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100 text-red-800',
      subtext: 'On-demand mobile vehicle repair, OBD-II computerized engine diagnostics, brake pad replacements, alternator jumpstarts, and commercial fleet checks.',
      highlights: [
        'Certified automotive mechanics equipped with OBD-II scanners',
        'Transparent labor charges backed by cooperative fair-wage bylaws',
        'Genuine OEM spare parts procurement with 0% platform markup'
      ]
    },
    {
      id: 'heavy_machinery',
      type: 'mechanical',
      title: 'Heavy Machinery Operation',
      titleHi: 'भारी मशीनरी व क्रेन ऑपरेटर',
      titleTa: 'கனரக இயந்திர ஆபரேட்டர்',
      startingPrice: 850,
      unit: '4-hour shift',
      badge: 'Licensed Operators',
      icon: Tractor,
      gradient: 'from-yellow-500/10 to-amber-500/10',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-100 text-yellow-900',
      subtext: 'Licensed commercial operators for JCB excavators, warehouse forklifts, mobile cranes, soil compactors, and earthmoving construction equipment.',
      highlights: [
        'Commercial license verified with NSDC heavy equipment certification',
        'Comprehensive accident & disability coverage via Welfare Corpus',
        'Direct booking with 0% broker commission deducted from operator earnings'
      ]
    },
    {
      id: 'landscaping',
      type: 'facility',
      title: 'Landscaping & Yard Maintenance',
      titleHi: 'लैंडस्केपिंग व बगीचा रखरखाव',
      titleTa: 'தோட்டம் மற்றும் நிலப்பரப்பு பராமரிப்பு',
      startingPrice: 449,
      unit: 'starting rate',
      badge: 'Green Artisans',
      icon: Trees,
      gradient: 'from-lime-500/10 to-emerald-500/10',
      borderColor: 'border-lime-200',
      iconBg: 'bg-lime-100 text-lime-800',
      subtext: 'Precision tree trimming, high branch lopping, hedge pruning, lawn mowing, weed removal, soil aeration, and organic composting.',
      highlights: [
        'Equipped with commercial string trimmers and safety harness kits',
        'Supported by rural green-worker cooperatives with pension welfare',
        'Zero platform fee guarantee ensuring maximum earnings for gardeners'
      ]
    },
    {
      id: 'it_network',
      type: 'digital',
      title: 'IT & Network Technicians',
      titleHi: 'आईटी व नेटवर्क तकनीशियन',
      titleTa: 'ஐடி மற்றும் நெட்வொர்க் டெக்னீஷியன்',
      startingPrice: 299,
      unit: 'starting rate',
      badge: 'Certified Network Techs',
      icon: Network,
      gradient: 'from-violet-500/10 to-purple-500/10',
      borderColor: 'border-violet-200',
      iconBg: 'bg-violet-100 text-violet-800',
      subtext: 'Structured CAT6 ethernet cable laying, mesh WiFi & router installation, optical fiber termination, CCTV IP configuration, and PC hardware repairs.',
      highlights: [
        'CCNA / ITI-qualified network engineers with digital cable certifiers',
        'Transparent hourly billing with 95% credited directly to the tech',
        '0% Corporate commission with cooperative social security safety net'
      ]
    },
    {
      id: 'daily_labor',
      type: 'helpers',
      title: 'Daily Wage Labor & Helpers',
      titleHi: 'दैनिक मजदूरी व हेल्पर (Unskilled)',
      titleTa: 'தினக்கூலி மற்றும் உதவியாளர்',
      startingPrice: 450,
      unit: 'per 4-hour half day',
      badge: 'Skilled & Unskilled',
      icon: HardHat,
      gradient: 'from-emerald-500/10 to-teal-500/10',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-800',
      subtext: 'Manual assistance for house shifting, heavy lifting, yard clearing, packaging, and general construction site support.',
      highlights: ['Direct cash to rural/unskilled labor', '0% Corporate commission cut', 'Insured under Worker Welfare Fund']
    },
    {
      id: 'cleaning',
      type: 'facility',
      title: 'Deep Cleaning & Sanitation',
      titleHi: 'डीप क्लीनिंग व स्वच्छता सेवा',
      titleTa: 'ஆழமான சுத்தம் செய்தல்',
      startingPrice: 399,
      unit: 'starting rate',
      badge: 'Eco Chemicals',
      icon: Sparkles,
      gradient: 'from-cyan-500/10 to-sky-500/10',
      borderColor: 'border-cyan-200',
      iconBg: 'bg-cyan-100 text-cyan-800',
      subtext: 'Complete 1-2 BHK deep home cleaning, intensive bathroom scrubbing, kitchen grease degreasing, and sofa wash.',
      highlights: ['Commercial disc buffing machines', 'Hospital-grade sanitization', 'Spotless guarantee']
    },
    {
      id: 'carpentry',
      type: 'trades',
      title: 'Carpentry & Woodwork',
      titleHi: 'बढ़ई व फर्नीचर मरम्मत',
      titleTa: 'தச்சு வேலை மற்றும் பழுது',
      startingPrice: 249,
      unit: 'starting rate',
      badge: 'Master Carpenters',
      icon: Hammer,
      gradient: 'from-amber-600/10 to-yellow-600/10',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-900',
      subtext: 'Door locks, cupboard hinge alignment, wall shelf drilling, bed & table repair, and custom wood fixings.',
      highlights: ['Precision mortise chiseling', 'Heavy-duty masonry drill bits', 'Clean dust collection']
    },
    {
      id: 'painting',
      type: 'trades',
      title: 'Painting & Masonry Works',
      titleHi: 'पुताई, राजमिस्त्री व प्लास्टर',
      titleTa: 'வர்ணம் பூசுதல் & மேஸ்திரி வேலை',
      startingPrice: 399,
      unit: 'starting rate',
      badge: 'Waterproof Specialists',
      icon: Paintbrush,
      gradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100 text-purple-800',
      subtext: 'Wall crack patching, seepage & dampness treatment, single room roller paint touch-ups, and tile re-grouting.',
      highlights: ['Waterproof epoxy bonding', 'Smooth putty sanding', 'Color matching assistance']
    }
  ];

  const filteredServices = services.filter((s) => {
    if (activeFilter === 'all') return true;
    return s.type === activeFilter;
  });

  const getLocalizedTitle = (item: ServiceItemDef) => {
    const jobKeyMap: Record<string, string> = {
      electrical: 'jobs.electricianJob',
      plumbing: 'jobs.plumbingJob',
      carpentry: 'jobs.carpentryJob',
      cleaning: 'jobs.cleaningJob',
      hvac: 'jobs.hvacJob',
      masonry: 'jobs.masonryJob',
      welding: 'jobs.weldingJob',
      painting: 'jobs.paintingJob',
      gardening: 'jobs.gardeningJob',
      driving: 'jobs.drivingJob',
      caregiving: 'jobs.caregivingJob',
    };
    if (jobKeyMap[item.id]) {
      return t(jobKeyMap[item.id]);
    }
    if (lang === 'hi') return item.titleHi;
    if (lang === 'ta') return item.titleTa;
    return item.title;
  };

  return (
    <section id="core-services" className="py-14 sm:py-20 bg-[#FAFAFA] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{t("landing.guaranteedCooperative")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight font-display">
            {t("landing.coreServicesTitle")}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-3 font-medium">
            {t("landing.coreServicesSub")}
          </p>

          {/* Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: t("common.all") },
              { id: 'trades', label: t("landing.exploreServices") },
              { id: 'mechanical', label: t("landing.coreServicesTitle") },
              { id: 'facility', label: t("landing.guaranteedCooperative") },
              { id: 'digital', label: t("landing.verifiedWorkers") },
              { id: 'helpers', label: t("worker.workerPortalTitle") }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#1D68ED] text-white shadow-md'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Core Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className={`group bg-white rounded-2xl border ${item.borderColor} p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Badge & Vector Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      {item.badge}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl font-black text-[#0F172A] group-hover:text-[#1D68ED] transition-colors font-display">
                    {getLocalizedTitle(item)}
                  </h3>

                  {/* Price Display */}
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-emerald-700">₹{item.startingPrice}</span>
                    <span className="text-xs font-semibold text-gray-400">/{item.unit}</span>
                  </div>

                  {/* Subtext */}
                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                    {item.subtext}
                  </p>

                  {/* Checklist highlights */}
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                    {item.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenPrices(item.id)}
                    className="flex-1 py-2.5 px-4 bg-[#1D68ED] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer active:scale-98"
                  >
                    <span>{t("booking.bookNow")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectService(item.id)}
                    className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 text-xs font-bold transition cursor-pointer"
                    title="View full specs"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0A1226] to-[#14234B] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-blue-900/50">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Need a custom job or bulk team?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display">
              We dispatch single workers or complete cooperative workforces.
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Zero commission fee. Direct cash/UPI payment. 100% verified workers with police and cooperative background verification.
            </p>
          </div>

          <button
            onClick={() => onOpenPrices()}
            className="px-8 py-3.5 bg-[#00D2FF] hover:bg-cyan-300 text-black font-black rounded-xl text-sm shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-98 flex items-center gap-2 shrink-0"
          >
            <span>Calculate Any Job Price</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

      </div>
    </section>
  );
};

