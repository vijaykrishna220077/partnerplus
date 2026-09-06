import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Calculator, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  Calendar, 
  Volume2, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  FileText, 
  CreditCard, 
  Star, 
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
  Maximize2, 
  Minimize2, 
  ShoppingBag, 
  Share2, 
  UserCheck, 
  Users, 
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundAndSpeech } from '../utils/soundAndSpeech';
import { useApp } from '../context/AppContext';
import { bookingService } from '../services/bookingService';
import { Booking, WorkerMatchResult } from '../types';
import { 
  CooperativeWorkerProfile, 
  ALL_COOPERATIVE_WORKERS 
} from '../data/cooperativeWorkers';
import { WorksCatalogView, TaskItem, CategoryData } from './booking/WorksCatalogView';
import { AvailableWorkersView } from './booking/AvailableWorkersView';
import { BookingCheckoutView } from './booking/BookingCheckoutView';

export type { CooperativeWorkerProfile, TaskItem, CategoryData };
export { ALL_COOPERATIVE_WORKERS };

interface QuoteCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialTab?: 'works' | 'workers' | 'cart';
}

export const CATEGORIES: CategoryData[] = [
  {
    id: 'electrical',
    name: 'Electrician',
    nameHi: 'बिजली मिस्त्री (Electrician)',
    nameTa: 'மின்சார வல்லுநர்',
    icon: Zap,
    desc: 'Govt. licensed wiremen for domestic, commercial & industrial circuitry with 0% corporate cut.',
    tasks: [
      { id: 'switch_socket_replace', name: 'Switchboard / Socket Repair', nameHi: 'स्विचबोर्ड व सॉकेट रिपेयर', nameTa: 'ஸ்விட்ச் போர்டு பழுது', basePrice: 199, unit: 'point', duration: '20-30 mins', description: 'Testing, wiring diagnostic, switch/socket replacement with zero middleman markup.' },
      { id: 'fan_regulator_repair', name: 'Ceiling Fan Installation & Repair', nameHi: 'छत का पंखा लगाना व रिपेयर', nameTa: 'மின்விசிறி பொருத்துதல்', basePrice: 249, unit: 'appliance', duration: '30-40 mins', description: 'Canopy balancing, capacitor check, bearing noise fix, secure hook mounting.' },
      { id: 'mcb_tripping_check', name: 'MCB Fuse Tripping Diagnostic', nameHi: 'MCB ट्रिपिंग व फॉल्ट ढूंढना', nameTa: 'MCB பழுது கண்டறிதல்', basePrice: 299, unit: 'distribution box', duration: '35-45 mins', description: 'Earth leakage inspection, short-circuit trace, neutral load balancing.' },
      { id: 'inverter_wiring', name: 'Inverter & Home Battery Wiring', nameHi: 'इन्वर्टर व बैटरी कनेक्शन', nameTa: 'இன்வெர்ட்டர் வயரிங்', basePrice: 499, unit: 'system', duration: '60 mins', description: 'Heavy-duty cable routing, bypass switch installation, acid terminal care.' }
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumber',
    nameHi: 'प्लंबर (Plumber)',
    nameTa: 'குழாய் பணியாளர்',
    icon: Droplets,
    desc: 'Certified sanitary engineers for hydro-jet clearing, pipeline repairs & motor installation.',
    tasks: [
      { id: 'tap_leak_repair', name: 'Tap Leakage & Spindle Fix', nameHi: 'नल लीकेज व स्पिंडल बदलना', nameTa: 'குழாய் கசிவு சரிசெய்தல்', basePrice: 199, unit: 'tap', duration: '20 mins', description: 'Washer renewal, Teflon sealing, ceramic cartridge or aerator cleaning.' },
      { id: 'drain_blockage_clear', name: 'Drain & Basin Clog Removal', nameHi: 'सिंक व नाली का ब्लॉकेज खोलना', nameTa: 'வடிகால் அடைப்பு நீக்குதல்', basePrice: 299, unit: 'point', duration: '30-45 mins', description: 'High-tensile snake spring auger clearing, grease dissolve, trap inspection.' },
      { id: 'flush_cistern_repair', name: 'Toilet Flush Tank / Cistern Fix', nameHi: 'टॉयलेट फ्लश टैंक रिपेयर', nameTa: 'டாய்லெட் ஃப்ளஷ் பழுது', basePrice: 349, unit: 'tank', duration: '35 mins', description: 'Dual flush valve calibration, syphon kit swap, inlet float ball tune.' },
      { id: 'water_tank_clean', name: 'Overhead Water Tank Scrub', nameHi: 'पानी की टंकी की गहरी सफाई', nameTa: 'தண்ணீர் தொட்டி சுத்தம்', basePrice: 699, unit: 'tank (up to 1000L)', duration: '60-90 mins', description: 'Sludge extraction, food-grade disinfectant wash, UV sediment check.' }
    ]
  },
  {
    id: 'hvac',
    name: 'HVAC & Refrigeration',
    nameHi: 'एसी व कूलिंग (HVAC)',
    nameTa: 'ஏசி மற்றும் குளிர்சாதனம்',
    icon: AirVent,
    desc: 'High-pressure foam jet wash, gas charging (R32/R410A) & central cooling diagnostics.',
    tasks: [
      { id: 'ac_jet_wash', name: 'Split AC Power Jet Cleaning', nameHi: 'स्प्लिट एसी पावर जेट सर्विसिंग', nameTa: 'ஏசி பவர் ஜெட் சர்வீஸ்', basePrice: 499, unit: 'unit', duration: '45 mins', description: 'Chemical foam jet wash for evaporator coil, blower fan, and outdoor condenser fins.' },
      { id: 'gas_charging_ac', name: 'AC Refrigerant Gas Top-Up & Leak Fix', nameHi: 'एसी गैस रीफिल व लीकेज टेस्ट', nameTa: 'ஏசி கேஸ் நிரப்புதல்', basePrice: 1299, unit: 'unit', duration: '60 mins', description: 'Nitrogen pressure testing, flare nut brazing, and manifold gauge R32/R410A vacuum recharge.' },
      { id: 'ac_install_unmount', name: 'Split AC Complete Installation', nameHi: 'स्प्लिट एसी इंस्टॉलेशन', nameTa: 'ஏசி பொருத்துதல்', basePrice: 999, unit: 'unit', duration: '90 mins', description: 'Core wall hole drilling, copper piping flare connection, bracket mounting, and level testing.' },
      { id: 'cassette_ac_service', name: 'Commercial Cassette / Ducted AC Service', nameHi: 'कमर्शियल कैसेट एसी सर्विसिंग', nameTa: 'வணிக ஏசி சர்வீஸ்', basePrice: 799, unit: 'unit', duration: '60 mins', description: 'Drop ceiling drain tray cleaning, motor capacitor testing, and air filter sterilization.' }
    ]
  },
  {
    id: 'masonry',
    name: 'Masonry & Concrete',
    nameHi: 'राजमिस्त्री व सिविल (Masonry)',
    nameTa: 'மேஸ்திரி & கொத்தனார்',
    icon: BrickWall,
    desc: 'Government recognized master masons for bricklaying, cement plastering & tile setting.',
    tasks: [
      { id: 'brick_laying_wall', name: 'Brick / AAC Block Wall Construction', nameHi: 'ईंट व ब्लॉक चिनाई (दीवार)', nameTa: 'செங்கல் சுவர் கட்டுதல்', basePrice: 599, unit: 'up to 50 sq ft', duration: '3-4 hours', description: 'Mortar mixing, spirit-level plumb alignment, joint raking, and cured bonding.' },
      { id: 'wall_plaster_repair', name: 'Cement Plastering & Crack Rectification', nameHi: 'सीमेंट प्लास्टर व दरार मरम्मत', nameTa: 'சிமெண்ட் பூச்சு & விரிசல் சரிசெய்தல்', basePrice: 499, unit: 'patch (up to 40 sq ft)', duration: '2 hours', description: 'Chipping loose plaster, polymer bonding coat, smooth trowel float finish.' },
      { id: 'tile_laying_floor', name: 'Floor / Wall Tile Laying & Grouting', nameHi: 'टाइल लगाना व वॉटरप्रूफ ग्राउटिंग', nameTa: 'டைல்ஸ் பதித்தல்', basePrice: 549, unit: 'up to 35 sq ft', duration: '2-3 hours', description: 'Subfloor leveling, polymer tile adhesive combing, spacer alignment, and epoxy grouting.' },
      { id: 'concrete_coring_screed', name: 'Floor Screeding & Concrete Core Repair', nameHi: 'फर्श ढलाई व कंक्रीट मरम्मत', nameTa: 'கான்கிரீட் தளம் சரிசெய்தல்', basePrice: 650, unit: 'area', duration: '3 hours', description: 'Aggregate grading, water-cement ratio control, screed bar leveling, and tamp compaction.' }
    ]
  },
  {
    id: 'welding',
    name: 'Welding & Metal Fabrication',
    nameHi: 'वेल्डिंग व मेटल फेब्रिकेशन',
    nameTa: 'வெல்டிங் & மெட்டல் வேலை',
    icon: Flame,
    desc: 'Doorstep mobile ARC/MIG welding, gate repairs, security grills & structural fabrication.',
    tasks: [
      { id: 'gate_grill_repair', name: 'Doorstep Gate & Grill Hinge Welding', nameHi: 'गेट व ग्रिल वेल्डिंग व कब्जा मरम्मत', nameTa: 'கேட் & கிரில் வெல்டிங்', basePrice: 399, unit: 'joint / hinge', duration: '40 mins', description: 'Inverter ARC mobile welding, heavy-duty hinge alignment, and red oxide anti-rust priming.' },
      { id: 'shutter_repair', name: 'Shop Rolling Shutter Alignment & Springs', nameHi: 'दुकान का शटर व स्प्रिंग रिपेयर', nameTa: 'ரோலிங் ஷட்டர் பழுது', basePrice: 649, unit: 'shutter', duration: '60 mins', description: 'Tension coil spring rewinding, side guide channel lubrication, and lock bracket welding.' },
      { id: 'ss_railing_tig', name: 'Stainless Steel (SS304) TIG Welding', nameHi: 'स्टेनलेस स्टील TIG वेल्डिंग', nameTa: 'எஸ்.எஸ் ரெயிலிங் வெல்டிங்', basePrice: 549, unit: 'joint', duration: '45 mins', description: 'Argon shielded TIG bead laying, seam grinding, flap disc mirror polishing.' },
      { id: 'shed_fabrication', name: 'MS Pipe Shed Frame Welding & Bracing', nameHi: 'शेड का ढांचा व पाइप वेल्डिंग', nameTa: 'ஷெட் வெல்டிங் வேலை', basePrice: 799, unit: 'bay', duration: '2 hours', description: 'Square tube cutting, mitre joints, gusset plate strengthening, and structural roof frame.' }
    ]
  },
  {
    id: 'mechanic',
    name: 'Auto & Fleet Mechanics',
    nameHi: 'ऑटो व फ्लीट मैकेनिक',
    nameTa: 'வாகன மெக்கானிக்',
    icon: Car,
    desc: 'Mobile doorstep vehicle breakdown support, OBD-II scanner diagnostics & brake repairs.',
    tasks: [
      { id: 'jumpstart_battery', name: 'Doorstep Battery Jumpstart & Charging', nameHi: 'डोरस्टेप बैटरी जंपस्टार्ट', nameTa: 'பேட்டரி ஜம்ப்ஸ்டார்ட்', basePrice: 349, unit: 'vehicle', duration: '20 mins', description: 'High-amperage jumper pack start, alternator output voltage check, and terminal corrosion cleaning.' },
      { id: 'obd2_diagnostics', name: 'Computerized OBD-II Engine Scan', nameHi: 'कंप्यूटरीकृत OBD-II इंजन स्कैन', nameTa: 'OBD-II எஞ்சின் ஸ்கேன்', basePrice: 499, unit: 'scan & report', duration: '30 mins', description: 'Read and clear diagnostic trouble codes (DTC), live sensor telemetry check, and printed health summary.' },
      { id: 'brake_pad_service', name: 'Brake Pad Replacement & Fluid Bleed', nameHi: 'ब्रेक पैड बदलना व फ्लूइड ब्लीड', nameTa: 'பிரேக் பேட் மாற்றுதல்', basePrice: 449, unit: 'axle', duration: '45 mins', description: 'Disc brake caliper servicing, friction pad installation, rotor thickness measurement, and DOT4 fluid bleeding.' },
      { id: 'fleet_inspection', name: 'Multi-Point Commercial Vehicle Inspection', nameHi: 'व्यावसायिक वाहन बहु-बिंदु जांच', nameTa: 'வணிக வாகன ஆய்வு', basePrice: 599, unit: 'vehicle', duration: '60 mins', description: 'Suspension ball joints, fluid levels, drive belts, tyre tread wear, and electrical circuit check.' }
    ]
  },
  {
    id: 'heavy_machinery',
    name: 'Heavy Machinery Operation',
    nameHi: 'भारी मशीनरी ऑपरेटर (JCB/क्रेन)',
    nameTa: 'கனரக இயந்திர ஆபரேட்டர்',
    icon: Tractor,
    desc: 'NSDC certified excavator (JCB), warehouse forklift & mobile crane operators for civil sites.',
    tasks: [
      { id: 'jcb_excavator_op', name: 'JCB / Excavator Certified Operator', nameHi: 'JCB व एक्सकेवेटर ऑपरेटर', nameTa: 'JCB / எக்ஸ்கவேட்டர் ஆபரேட்டர்', basePrice: 850, unit: '4-hour shift', duration: '4 hours', description: 'Trenching, earth moving, foundation excavation, and site clearing by NSDC-certified heavy machinery operator.' },
      { id: 'forklift_operator', name: 'Industrial Warehouse Forklift Operator', nameHi: 'गोदाम फोर्कलिफ्ट ऑपरेटर', nameTa: 'ஃபோர்க்லிஃப்ட் ஆபரேட்டர்', basePrice: 750, unit: '4-hour shift', duration: '4 hours', description: 'High-bay pallet stacking, container destuffing, and loading bay maneuvering with strict OSHA safety.' },
      { id: 'mobile_crane_op', name: 'Hydraulic Mobile Crane & Rigging Operator', nameHi: 'हाइड्रोलिक मोबाइल क्रेन ऑपरेटर', nameTa: 'மொபைல் கிரேன் ஆபரேட்டர்', basePrice: 950, unit: '4-hour shift', duration: '4 hours', description: 'Boom deployment, sling rigging, heavy steel beam lifting, and safe load radius monitoring.' },
      { id: 'compactor_roller_op', name: 'Earth Compactor / Road Roller Operator', nameHi: 'अर्थ कॉम्पेक्टर / रोलर ऑपरेटर', nameTa: 'ரோடு ரோலர் ஆபரேட்டர்', basePrice: 800, unit: '4-hour shift', duration: '4 hours', description: 'Pavement sub-base compaction, vibrating roller passes, and soil stabilization for civil roadways.' }
    ]
  },
  {
    id: 'landscaping',
    name: 'Landscaping & Yard Care',
    nameHi: 'लैंडस्केपिंग व बगीचा रखरखाव',
    nameTa: 'தோட்ட பராமரிப்பு',
    icon: Trees,
    desc: 'Professional tree trimming, hedge manicuring, lawn mowing & organic soil enrichment.',
    tasks: [
      { id: 'tree_trimming', name: 'High Tree Trimming & Branch Lopping', nameHi: 'पेड़ की छंटाई व शाखा कटाई', nameTa: 'மரம் கவாத்து செய்தல்', basePrice: 549, unit: 'tree', duration: '60-90 mins', description: 'Hazardous overhead branch removal, canopy thinning, arborist safety climbing, and branch reduction.' },
      { id: 'lawn_mowing_edge', name: 'Lawn Mowing & Precision Edge Trimming', nameHi: 'घास कटाई व लॉन ट्रिमिंग', nameTa: 'புல் வெட்டுதல்', basePrice: 449, unit: 'lawn (up to 1500 sq ft)', duration: '60 mins', description: 'Rotary mower cutting, border edging with nylon weed trimmer, and grass clippings bagging.' },
      { id: 'hedge_bush_shaping', name: 'Hedge Shaping & Bush Pruning', nameHi: 'झाड़ियों की कटाई व शेपिंग', nameTa: 'புதர் செடிகள் ஒழுங்குபடுத்துதல்', basePrice: 399, unit: 'hedge row (up to 30 ft)', duration: '45 mins', description: 'Electric hedge shear manicuring, dead foliage extraction, and neat box or curved contour shaping.' },
      { id: 'soil_fertilizing_weeding', name: 'Soil Aeration, Weeding & Compost Dressing', nameHi: 'मिट्टी की गुड़ाई, खाद व खरपतवार', nameTa: 'மண் உழுதல் & உரமிடுதல்', basePrice: 499, unit: 'garden bed', duration: '90 mins', description: 'Manual soil tilling, taproot weed extraction, and organic vermicompost top-dressing.' }
    ]
  },
  {
    id: 'it_network',
    name: 'IT & Network Technicians',
    nameHi: 'आईटी व नेटवर्क तकनीशियन',
    nameTa: 'ஐடி & நெட்வொர்க்',
    icon: Network,
    desc: 'Structured CAT6 LAN cabling, WiFi mesh optimization, PC diagnostics & CCTV camera installation.',
    tasks: [
      { id: 'cat6_lan_cabling', name: 'Structured CAT6 LAN Cable Laying', nameHi: 'CAT6 लैन केबल वायरिंग', nameTa: 'CAT6 கேபிள் வயரிங்', basePrice: 399, unit: 'run (up to 30m)', duration: '45 mins', description: 'Conduit pull-through, RJ45 crimping, faceplate punching, and wiremap continuity certification.' },
      { id: 'wifi_mesh_setup', name: 'Mesh WiFi & Dual-Band Router Configuration', nameHi: 'मेश वाई-फाई व राउटर सेटअप', nameTa: 'வைஃபை ரூட்டர் செட்டப்', basePrice: 349, unit: 'setup', duration: '30 mins', description: 'SSID configuration, channels optimization, dead-zone RF signal testing, and firewall security hardening.' },
      { id: 'pc_hardware_diag', name: 'Desktop PC & Laptop Hardware Repair', nameHi: 'पीसी व लैपटॉप हार्डवेयर रिपेयर', nameTa: 'கணினி வன்பொருள் பழுது', basePrice: 449, unit: 'device', duration: '45 mins', description: 'SMPS testing, RAM/SSD upgrade, thermal paste replacement, and motherboard POST diagnostic.' },
      { id: 'cctv_ip_network', name: 'CCTV IP Camera & NVR Network Setup', nameHi: 'सीसीटीवी कैमरा व NVR सेटअप', nameTa: 'CCTV நெட்வொர்க் அமைப்பு', basePrice: 499, unit: 'system (up to 4 cams)', duration: '60 mins', description: 'PoE switch connection, IP addressing, mobile remote streaming app setup, and motion zone tuning.' }
    ]
  },
  {
    id: 'cleaning',
    name: 'Deep Cleaning',
    nameHi: 'सफाई सेवा (Deep Cleaning)',
    nameTa: 'சுத்தம் செய்தல்',
    icon: Sparkles,
    desc: 'Intensive hospital-grade deep scrubbing, kitchen degreasing & full home sanitization.',
    tasks: [
      { id: 'bathroom_deep', name: 'Bathroom Intensive Scrub', nameHi: 'बाथरूम की गहन सफाई', nameTa: 'குளியலறை முழு சுத்தம்', basePrice: 449, unit: 'bathroom', duration: '45-60 mins', description: 'Hard water tile stain removal, commode descaling, mirror & taps.' },
      { id: 'kitchen_degrease', name: 'Kitchen Deep Degreasing', nameHi: 'किचन व चिमनी ग्रीस सफाई', nameTa: 'சமையலறை டீக்ரீசிங்', basePrice: 699, unit: 'kitchen', duration: '90 mins', description: 'Oil & grease removal from tiles, cabinets, exhaust fan, and slab.' },
      { id: 'home_deep_clean', name: 'Full Home Deep Clean (1-2 BHK)', nameHi: 'पूरे घर की डीप क्लीनिंग', nameTa: 'முழு வீடு சுத்தம் (1-2 BHK)', basePrice: 1499, unit: 'flat', duration: '3-4 hours', description: 'Floor single-disc buffing, cobweb clearing, balcony & window wash.' },
      { id: 'sofa_shampoo', name: 'Sofa & Upholstery Shampooing', nameHi: 'सोफा शैम्पू व वैक्यूम', nameTa: 'சோபா ஷாம்பு வாஷ்', basePrice: 599, unit: 'set (3-seater)', duration: '60 mins', description: 'Dry foam extraction, dust mite removal, and fabric refreshing.' }
    ]
  },
  {
    id: 'daily_labor',
    name: 'Daily Wage Helper',
    nameHi: 'दैनिक मजदूर (Daily Helper)',
    nameTa: 'தினக்கூலி தொழிலாளர்',
    icon: HardHat,
    desc: 'Vetted cooperative helpers for manual shifting, loading, unloading & civil site clearing.',
    tasks: [
      { id: 'helper_half_day', name: 'General Helper (Half Day - 4 Hours)', nameHi: 'जनरल हेल्पर (4 घंटे)', nameTa: 'உதவியாளர் (4 மணிநேரம்)', basePrice: 450, unit: 'worker (4 hrs)', duration: '4 hours', description: 'Manual assistance for shifting, yard clearing, packaging, lifting.' },
      { id: 'helper_full_day', name: 'General Helper (Full Day - 8 Hours)', nameHi: 'जनरल हेल्पर (8 घंटे - पूरा दिन)', nameTa: 'உதவியாளர் (8 மணிநேரம்)', basePrice: 750, unit: 'worker (8 hrs)', duration: '8 hours', description: 'Full day hard manual labor, site clearance, loading and unloading.' },
      { id: 'garden_clearing', name: 'Garden & Lawn Weeding / Clearing', nameHi: 'बगीचे की सफाई व खरपतवार निकालना', nameTa: 'தோட்ட பராமரிப்பு & சுத்தம்', basePrice: 500, unit: 'session (3 hrs)', duration: '3 hours', description: 'Weed removal, dead branch pruning, grass cutting, and waste bagging.' },
      { id: 'house_shifting_labor', name: 'House Shifting & Heavy Lifting', nameHi: 'सामान शिफ्टिंग व भारी भार उठाना', nameTa: 'வீடு மாற்ற பாரம் தூக்குதல்', basePrice: 600, unit: 'session', duration: '3 hours', description: 'Safe furniture carrying, stair climbing, truck loading assistance.' }
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpenter',
    nameHi: 'बढ़ई (लकड़ी व फर्नीचर)',
    nameTa: 'தச்சர் (மர வேலை)',
    icon: Hammer,
    desc: 'Master woodcraftsmen for lock replacements, modular furniture assembly & precision wall drilling.',
    tasks: [
      { id: 'lock_replacement', name: 'Door Lock & Latch Replacement', nameHi: 'दरवाजे का ताला व कुंडी बदलना', nameTa: 'பூட்டு மற்றும் லாட்ச் மாற்றுதல்', basePrice: 299, unit: 'door', duration: '35 mins', description: 'Chiseling, precise mortise lock fitting, and key alignment.' },
      { id: 'hinge_repair', name: 'Cupboard / Door Hinge Alignment', nameHi: 'अलमारी या दरवाजे के कब्जे ठीक करना', nameTa: 'கதவு கீல் சரிசெய்தல்', basePrice: 249, unit: 'unit', duration: '30 mins', description: 'Re-screw stripped holes, fix sagging cabinet doors, smooth closing.' },
      { id: 'wall_drilling', name: 'Wall Drilling & Item Mounting', nameHi: 'दीवार में ड्रिल व हैंगिंग (3-4 आइटम्स)', nameTa: 'சுவர் துளையிடுதல் & மாட்டுதல்', basePrice: 199, unit: 'up to 4 holes', duration: '20 mins', description: 'Curtain brackets, TV bracket, mirror, frames with anchor plugs.' },
      { id: 'furniture_assembly', name: 'Bed & Wardrobe Assembly / Repair', nameHi: 'बेड व अलमारी असेंबली / रिपेयर', nameTa: 'மரச்சாமான்கள் பழுது', basePrice: 499, unit: 'item', duration: '60-90 mins', description: 'Tightening loose joints, plywood reinforcement, and drawer slides.' }
    ]
  },
  {
    id: 'painting',
    name: 'Painting & Civil',
    nameHi: 'पुताई व राजमिस्त्री (Painting)',
    nameTa: 'பெயின்டர் & மேஸ்திரி',
    icon: Paintbrush,
    desc: 'Waterproof seepage coating, crack repair & flawless roller wall painting by certified applicators.',
    tasks: [
      { id: 'wall_crack_patch', name: 'Wall Crack & Seepage Patching', nameHi: 'दीवार में दरार व सीलन का इलाज', nameTa: 'சுவர் விரிசல் சரிசெய்தல்', basePrice: 399, unit: 'patch (up to 20 sq ft)', duration: '45 mins', description: 'Waterproof putty scraping, crack bond filling, and smooth sanding.' },
      { id: 'room_touchup', name: 'Single Room Wall Painting', nameHi: 'एक कमरे की दीवार पुताई', nameTa: 'ஒரு அறை பெயிண்டிங்', basePrice: 899, unit: 'room', duration: '3 hours', description: 'Two coats of premium emulsion roller paint (labor only).' },
      { id: 'tile_grouting', name: 'Broken Tile Fix & Re-Grouting', nameHi: 'टूटी टाइल ठीक करना व ग्राउटिंग', nameTa: 'டைல்ஸ் ஒட்டுதல்', basePrice: 449, unit: 'area', duration: '45 mins', description: 'Epoxy waterproof grouting and loose tile adhesive re-bonding.' }
    ]
  },
  {
    id: 'appliances',
    name: 'Appliance Repair',
    nameHi: 'उपकरण मरम्मत (AC, Washing)',
    nameTa: 'மின்சாதனங்கள் பழுது',
    icon: Wrench,
    desc: 'Diagnostic check and doorstep repairs for washing machines, refrigerators & air conditioners.',
    tasks: [
      { id: 'ac_service', name: 'Split AC Power Jet Cleaning', nameHi: 'स्प्लिट एसी जेट वॉश सर्विसिंग', nameTa: 'ஏசி ஜெட் வாஷ் சர்வீஸ்', basePrice: 499, unit: 'AC unit', duration: '45 mins', description: 'Indoor coil foaming, blower wash, outdoor fin flush, drain check.' },
      { id: 'washing_machine', name: 'Washing Machine Diagnosis', nameHi: 'वाशिंग मशीन स्पिन / ड्रेन रिपेयर', nameTa: 'வாஷிங் மெஷின் பழுது', basePrice: 399, unit: 'machine', duration: '40 mins', description: 'Belt inspection, drain pump blockage, vibration and PCB check.' },
      { id: 'refrigerator', name: 'Refrigerator Cooling Issue', nameHi: 'फ्रिज कूलिंग समस्या व गैस चेक', nameTa: 'பிரிட்ஜ் கூலிங் பழுது', basePrice: 449, unit: 'fridge', duration: '45 mins', description: 'Thermostat testing, compressor relay check, and coil cleaning.' }
    ]
  }
];

export const QuoteCalculatorModal: React.FC<QuoteCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialService = 'electrical',
  initialTab = 'works'
}) => {
  const { lang, openTracker, openPayment, openInvoice, addToast, refreshData, setActiveTab } = useApp();

  useEffect(() => {
    if (isOpen) {
      setActiveTab('direct_booking');
      onClose();
    }
  }, [isOpen, setActiveTab, onClose]);

  if (!isOpen) return null;

  // Navigation mode: 'works' (Step 1) | 'workers' (Step 2) | 'cart' (Step 3)
  const [modalView, setModalView] = useState<'works' | 'workers' | 'cart'>(initialTab || 'works');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(true);

  // Search & Filter States
  const [worksSearchQuery, setWorksSearchQuery] = useState<string>('');
  const [workerCategoryFilter, setWorkerCategoryFilter] = useState<string>('all');
  const [selectedWorker, setSelectedWorker] = useState<CooperativeWorkerProfile | null>(null);

  // Service & Cart State
  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialService);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [cart, setCart] = useState<Record<string, number>>({});

  // Synchronize when initialService or initialTab changes
  useEffect(() => {
    if (initialService) {
      setActiveCategoryId(initialService);
      setWorkerCategoryFilter(initialService);
    }
  }, [initialService]);

  useEffect(() => {
    if (initialTab) {
      setModalView(initialTab);
    }
  }, [initialTab]);

  const currentCategory = useMemo(() => {
    return CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];
  }, [activeCategoryId]);

  const activeTaskFallback = useMemo(() => {
    return currentCategory.tasks.find((t) => t.id === selectedTaskId) || currentCategory.tasks[0];
  }, [currentCategory, selectedTaskId]);

  // Find task and category by taskId helper
  const findTaskById = (taskId: string) => {
    for (const cat of CATEGORIES) {
      const found = cat.tasks.find((t) => t.id === taskId);
      if (found) return { task: found, category: cat };
    }
    return null;
  };

  // Cart operations
  const handleAddToCart = (taskId: string) => {
    soundAndSpeech.playChime('click');
    setCart((prev) => ({
      ...prev,
      [taskId]: (prev[taskId] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (taskId: string) => {
    soundAndSpeech.playChime('click');
    setCart((prev) => {
      const current = prev[taskId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[taskId];
        return next;
      }
      return { ...prev, [taskId]: current - 1 };
    });
  };

  const handleDeleteItem = (taskId: string) => {
    soundAndSpeech.playChime('click');
    setCart((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
  };

  // Filtered tasks list
  const filteredTasksList = useMemo(() => {
    const q = worksSearchQuery.trim().toLowerCase();
    if (!q) {
      return currentCategory.tasks.map((t) => ({ task: t, category: currentCategory }));
    }
    const results: { task: TaskItem; category: CategoryData }[] = [];
    CATEGORIES.forEach((cat) => {
      cat.tasks.forEach((t) => {
        if (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.nameHi.toLowerCase().includes(q) ||
          t.nameTa.toLowerCase().includes(q) ||
          cat.name.toLowerCase().includes(q)
        ) {
          results.push({ task: t, category: cat });
        }
      });
    });
    return results;
  }, [worksSearchQuery, currentCategory]);

  // Filtered workers list
  const filteredWorkersList = useMemo(() => {
    let list = ALL_COOPERATIVE_WORKERS;
    if (workerCategoryFilter !== 'all') {
      list = list.filter((w) => w.trade === workerCategoryFilter);
    }
    const q = worksSearchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.tradeLabel.toLowerCase().includes(q) ||
          w.tools.toLowerCase().includes(q) ||
          w.badge.toLowerCase().includes(q)
      );
    }
    return list;
  }, [workerCategoryFilter, worksSearchQuery]);

  // Add-ons & Instructions
  const [isEmergencySOS, setIsEmergencySOS] = useState<boolean>(false);
  const [needMaterials, setNeedMaterials] = useState<boolean>(false);
  const [workerTip, setWorkerTip] = useState<number>(0);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string[]>(['ring_bell']);
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('COOPDIRECT');
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(true);

  // Customer Details
  const [customerName, setCustomerName] = useState<string>(() => {
    return localStorage.getItem('sahakari_user_name') || 'Ramesh Kumar';
  });
  const [customerPhone, setCustomerPhone] = useState<string>(() => {
    return localStorage.getItem('sahakari_user_phone') || '98765 43210';
  });
  const [customerAddress, setCustomerAddress] = useState<string>(() => {
    return localStorage.getItem('sahakari_user_address') || 'Flat 302, Green Park Apartments, 2nd Avenue, Anna Nagar';
  });
  const [addressTag, setAddressTag] = useState<'home' | 'work' | 'other'>('home');
  const [selectedSlot, setSelectedSlot] = useState<'immediate' | 'evening' | 'tomorrow'>('immediate');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi'>('cash');

  // Submission & Workflow State
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [matchResult, setMatchResult] = useState<WorkerMatchResult | null>(null);

  useEffect(() => {
    const cat = CATEGORIES.find((c) => c.id === activeCategoryId);
    if (cat && cat.tasks.length > 0) {
      setSelectedTaskId(cat.tasks[0].id);
    }
  }, [activeCategoryId]);

  if (!isOpen) return null;

  // Compute Cart Totals
  const cartEntries = Object.entries(cart).filter(([_, qty]) => Number(qty) > 0);
  const isCartEmpty = cartEntries.length === 0;

  let subtotalLabor = 0;
  let totalItemsCount = 0;

  if (isCartEmpty) {
    subtotalLabor = activeTaskFallback.basePrice;
    totalItemsCount = 1;
  } else {
    cartEntries.forEach(([tId, qty]) => {
      const count = Number(qty) || 0;
      const found = findTaskById(tId);
      if (found) {
        subtotalLabor += found.task.basePrice * count;
        totalItemsCount += count;
      }
    });
  }

  const welfareFund = Math.round(subtotalLabor * 0.03); // 3% worker welfare fund
  const gstTax = Math.round(subtotalLabor * 0.05); // 5% GST
  const emergencyCharge = isEmergencySOS ? 99 : 0;
  const couponDiscount = isCouponApplied ? 50 : 0;

  const grossTotal = Math.max(0, subtotalLabor + welfareFund + gstTax + emergencyCharge + workerTip - couponDiscount);
  const workerPayout = subtotalLabor + welfareFund + workerTip;

  // Voice Read-Out of the quote
  const handleListenPrice = () => {
    soundAndSpeech.playChime('click');
    const spoken = lang === 'hi'
      ? `सहकारी बुकिंग का कुल शुल्क ₹${grossTotal} है। इसमें से ₹${workerPayout} सीधे आपके कामगार को मिलेंगे। कोई बिचौलिया कमीशन नहीं है। आपका कामगार 15 से 25 मिनट में पहुंचेगा।`
      : lang === 'ta'
      ? `கூட்டுறவு கட்டணம் ₹${grossTotal}. இதில் ₹${workerPayout} நேரடியாக தொழிலாளருக்கு செல்கிறது. 15-25 நிமிடங்களில் தொழிலாளர் வருவார்.`
      : `Your cooperative transparent booking total is ₹${grossTotal}. ₹${workerPayout} goes directly to the worker with zero platform commission. Delivery in 15 to 25 minutes.`;

    soundAndSpeech.speak(spoken, lang || 'hi');
  };

  // GPS Location auto-detect
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      addToast({ type: 'warning', title: 'GPS Unavailable', message: 'Geolocation is not supported by your browser.' });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCustomerAddress(`GPS Verified (${lat.toFixed(4)}, ${lng.toFixed(4)}), Anna Nagar Sector 4`);
        addToast({ type: 'success', title: 'Location Verified', message: 'GPS coordinates attached for express dispatch.' });
      },
      () => {
        setIsLocating(false);
        addToast({ type: 'info', title: 'Default Location', message: 'Using Anna Nagar Cooperative Cluster Zone.' });
      },
      { timeout: 8000 }
    );
  };

  const toggleInstruction = (inst: string) => {
    setDeliveryInstructions((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!customerAddress.trim()) {
      setErrorMessage('Please provide your service address and landmark');
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.setItem('sahakari_user_name', customerName.trim());
      localStorage.setItem('sahakari_user_phone', customerPhone.trim());
      localStorage.setItem('sahakari_user_address', customerAddress.trim());

      let primaryTaskId = activeTaskFallback.id;
      let primaryTaskName = activeTaskFallback.name;
      let itemsListDescription = '';

      if (!isCartEmpty) {
        const itemNames: string[] = [];
        cartEntries.forEach(([tId, qty]) => {
          const found = findTaskById(tId);
          if (found) {
            itemNames.push(`${found.task.name} (×${qty})`);
          }
        });
        primaryTaskName = itemNames.join(', ');
        itemsListDescription = itemNames.join(' + ');
      } else {
        itemsListDescription = activeTaskFallback.name;
      }

      const result = await bookingService.createBookingFromCalculator({
        categoryId: currentCategory.id,
        categoryName: currentCategory.name,
        taskId: activeTaskFallback.id,
        taskName: itemsListDescription,
        taskUnit: activeTaskFallback.unit,
        basePrice: subtotalLabor,
        quantity: totalItemsCount,
        isEmergency: isEmergencySOS,
        needMaterials,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: `${customerAddress} [Tag: ${addressTag.toUpperCase()}]`,
        selectedSlot,
        paymentMode,
        problemDescription: [
          deliveryInstructions.join(', '),
          customInstructions,
          selectedWorker ? `Preferred Worker: ${selectedWorker.name}` : ''
        ].filter(Boolean).join(' | ')
      });

      if (selectedWorker && result.match && result.match.worker) {
        result.match.worker.id = selectedWorker.id;
        result.match.worker.name = selectedWorker.name;
        result.match.worker.phone = selectedWorker.phone;
        result.match.worker.photoUrl = selectedWorker.photo;
        result.match.worker.distanceKm = selectedWorker.distanceKm;
        result.match.worker.rating = selectedWorker.rating;
        result.match.worker.jobsCompleted = selectedWorker.jobs;
        result.match.worker.primarySkillLabel = selectedWorker.tradeLabel;
        result.match.worker.cooperativeName = selectedWorker.cooperativeName;
      }

      setCreatedBooking(result.booking);
      setMatchResult(result.match);
      setBookingRef(result.booking.bookingCode);
      setSubmitted(true);
      await refreshData();

      soundAndSpeech.playChime('complete');
      
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.55 }
      });

      addToast({
        type: 'success',
        title: 'Worker Partner Dispatched!',
        message: `${result.match.worker.name} (${result.match.worker.distanceKm} km away) is on the way.`
      });

      const successVoice = lang === 'hi'
        ? `सहकारी बुकिंग सफल! कामगार ${result.match.worker.name} जल्द पहुंचेगा। रेफरेंस कोड ${result.booking.bookingCode}।`
        : `Booking confirmed! Your cooperative partner ${result.match.worker.name} is on the way. Reference: ${result.booking.bookingCode}.`;
      soundAndSpeech.speak(successVoice, lang || 'en');
    } catch (err: any) {
      setErrorMessage(err.message || 'Booking submission failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-opacity">
      <div 
        className={`bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullScreen 
            ? 'w-full h-full rounded-none' 
            : 'w-full max-w-6xl max-h-[92vh] rounded-3xl border border-slate-200 m-2 sm:m-4'
        }`}
      >
        {/* TOP BAR / HEADER (Swiggy / Zomato Fullscreen Header) */}
        <div className="bg-[#050B17] text-white px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D68ED] to-blue-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>Direct Cooperative Booking</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Dispatch
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                0% Middleman Commission • 100% Payout to Workers • 15-25 Mins Express Arrival
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleListenPrice}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Listen to price summary"
            >
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="hidden md:inline">Voice</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen View'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3-STEP SWIGGY / ZOMATO NAVIGATION BAR */}
        {!submitted && (
          <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto shrink-0 shadow-2xs">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Step 1: Works */}
              <button
                type="button"
                onClick={() => {
                  setModalView('works');
                  soundAndSpeech.playChime('click');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  modalView === 'works'
                    ? 'bg-[#1D68ED] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Hammer className="w-3.5 h-3.5 shrink-0" />
                <span>1. What Kind of Works</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  modalView === 'works' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {CATEGORIES.length} Trades
                </span>
              </button>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:inline" />

              {/* Step 2: Workers */}
              <button
                type="button"
                onClick={() => {
                  setModalView('workers');
                  soundAndSpeech.playChime('click');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  modalView === 'workers'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>2. Who is Available Nearby</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  modalView === 'workers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {ALL_COOPERATIVE_WORKERS.length} On Duty
                </span>
              </button>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden sm:inline" />

              {/* Step 3: Cart & Book */}
              <button
                type="button"
                onClick={() => {
                  setModalView('cart');
                  soundAndSpeech.playChime('click');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  modalView === 'cart'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>3. Review Cart &amp; Book</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  modalView === 'cart' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  ₹{grossTotal}
                </span>
              </button>
            </div>

            {/* Selected worker indicator badge */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {selectedWorker ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Partner: <strong>{selectedWorker.name}</strong></span>
                  <span className="text-[10px] text-emerald-600">({selectedWorker.etaMinutes}m ETA)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>⚡ Express Auto-Match (15-25 Mins)</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN BODY: SUBMITTED STATE OR 3 NAVIGATION VIEWS                           */}
        {/* ========================================================================= */}
        {submitted && matchResult ? (
          /* BOOKING DISPATCH SUCCESS VIEW */
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-slate-900 text-white">
            <div className="max-w-xl w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                  Worker Partner Dispatched
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  Booking #{bookingRef}
                </h3>
                <p className="text-xs text-slate-300 mt-2">
                  Your certified cooperative partner has accepted this direct booking and is mobilizing to your location with tools.
                </p>
              </div>

              {/* Matched Partner Card */}
              <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 text-left flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={matchResult.worker.photoUrl}
                    alt={matchResult.worker.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <div className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>{matchResult.worker.name}</span>
                      <span className="text-amber-400 text-xs flex items-center">
                        <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
                        {matchResult.worker.rating.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {matchResult.worker.primarySkillLabel} • {matchResult.worker.jobsCompleted} Jobs Done
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      Coop: {matchResult.worker.cooperativeName}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-emerald-400">
                    {matchResult.worker.distanceKm} km away
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ETA ~15-20 Mins
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (createdBooking) {
                      openTracker(createdBooking.id);
                    }
                  }}
                  className="py-3 px-4 rounded-xl bg-[#1D68ED] hover:bg-blue-600 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Track Partner Live &rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (createdBooking) {
                      openPayment(createdBooking.id);
                    }
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay with UPI / QR &rarr;</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Back to Main App
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MULTI-VIEW BOOKING ENGINE: WORKS (1) -> WORKERS (2) -> CART (3) */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
            
            {/* VIEW 1: WHAT KIND OF WORKS */}
            {modalView === 'works' && (
              <WorksCatalogView
                categories={CATEGORIES}
                activeCategoryId={activeCategoryId}
                setActiveCategoryId={setActiveCategoryId}
                filteredTasks={filteredTasksList}
                searchQuery={worksSearchQuery}
                setSearchQuery={setWorksSearchQuery}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onViewWorkers={(catId) => {
                  if (catId) setWorkerCategoryFilter(catId);
                  setModalView('workers');
                }}
                lang={lang}
                totalWorkersCount={ALL_COOPERATIVE_WORKERS.length}
              />
            )}

            {/* VIEW 2: WHO IS AVAILABLE NEARBY */}
            {modalView === 'workers' && (
              <AvailableWorkersView
                workers={filteredWorkersList}
                selectedWorker={selectedWorker}
                onSelectWorker={setSelectedWorker}
                categories={CATEGORIES.map((c) => ({ id: c.id, name: c.name }))}
                workerCategoryFilter={workerCategoryFilter}
                setWorkerCategoryFilter={setWorkerCategoryFilter}
                onProceedToCart={() => setModalView('cart')}
                onProceedWithWorker={(w) => {
                  setSelectedWorker(w);
                  setModalView('cart');
                }}
              />
            )}

            {/* VIEW 3: REVIEW CART & BOOK */}
            {modalView === 'cart' && (
              <BookingCheckoutView
                cart={cart}
                findTaskById={findTaskById}
                activeTaskFallback={activeTaskFallback}
                totalItemsCount={totalItemsCount}
                subtotalLabor={subtotalLabor}
                welfareFund={welfareFund}
                gstTax={gstTax}
                couponDiscount={couponDiscount}
                isCouponApplied={isCouponApplied}
                grossTotal={grossTotal}
                selectedWorker={selectedWorker}
                onSelectWorker={setSelectedWorker}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onDeleteItem={handleDeleteItem}
                onNavigateToWorks={() => setModalView('works')}
                onNavigateToWorkers={() => setModalView('workers')}
                deliveryInstructions={deliveryInstructions}
                toggleInstruction={toggleInstruction}
                customInstructions={customInstructions}
                setCustomInstructions={setCustomInstructions}
                isEmergencySOS={isEmergencySOS}
                setIsEmergencySOS={setIsEmergencySOS}
                needMaterials={needMaterials}
                setNeedMaterials={setNeedMaterials}
                addressTag={addressTag}
                setAddressTag={setAddressTag}
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                customerAddress={customerAddress}
                setCustomerAddress={setCustomerAddress}
                handleDetectLocation={handleDetectLocation}
                isLocating={isLocating}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                workerTip={workerTip}
                setWorkerTip={setWorkerTip}
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
                errorMessage={errorMessage}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmitBooking}
                lang={lang}
              />
            )}

            {/* FLOATING SWIGGY / ZOMATO BOTTOM BAR (When on 'works' or 'workers' view) */}
            {modalView !== 'cart' && (
              <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 bg-[#050B17] text-white p-3 sm:p-4 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-between gap-3 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-white">
                      ₹{grossTotal} Total
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black border border-blue-500/30">
                      {totalItemsCount} Work(s)
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 truncate mt-0.5">
                    {selectedWorker ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Assigned: {selectedWorker.name} ({selectedWorker.tradeLabel})</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>⚡ Express Auto-Match (15-25 Mins Arrival)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {modalView === 'works' && (
                    <button
                      type="button"
                      onClick={() => setModalView('workers')}
                      className="hidden sm:inline-flex px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition cursor-pointer"
                    >
                      See Available Crew &rarr;
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setModalView('cart')}
                    className="px-5 py-2.5 rounded-xl bg-[#1D68ED] hover:bg-blue-600 text-white text-xs sm:text-sm font-black transition cursor-pointer shadow-lg shadow-blue-500/30 flex items-center gap-2"
                  >
                    <span>View Cart &amp; Book &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
