import { 
  ServiceItem, 
  Worker, 
  Cooperative, 
  Booking, 
  DemandForecastItem, 
  LocationArea 
} from '../types';

export const mockLocations: LocationArea[] = [
  // Chennai
  { id: 'loc-1', name: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', popularLandmarks: ['Roundtana', 'Tower Park', 'Shanthi Colony'] },
  { id: 'loc-2', name: 'T. Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', popularLandmarks: ['Pondy Bazaar', 'Panagal Park', 'Usman Road'] },
  { id: 'loc-3', name: 'Adyar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600020', popularLandmarks: ['Adyar Signal', 'Gandhi Nagar', 'Besant Nagar Beach'] },
  { id: 'loc-4', name: 'Velachery', city: 'Chennai', state: 'Tamil Nadu', pincode: '600042', popularLandmarks: ['Phoenix Marketcity', 'Vijayanagar Bus Stand'] },
  { id: 'loc-5', name: 'Mylapore', city: 'Chennai', state: 'Tamil Nadu', pincode: '600004', popularLandmarks: ['Kapaleeshwarar Temple', 'Luz Corner'] },
  { id: 'loc-11', name: 'OMR Perungudi', city: 'Chennai', state: 'Tamil Nadu', pincode: '600096', popularLandmarks: ['Tidal Park', 'World Trade Center', 'Kandanchavadi'] },

  // Coimbatore
  { id: 'loc-12', name: 'Peelamedu', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641004', popularLandmarks: ['PSG Tech', 'Avinashi Road', 'TIDEL Park'] },
  { id: 'loc-13', name: 'RS Puram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641002', popularLandmarks: ['DB Road', 'Siruvani Centre', 'Flower Market'] },
  { id: 'loc-14', name: 'Gandhipuram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641012', popularLandmarks: ['Cross Cut Road', 'Central Bus Stand', '100ft Road'] },
  { id: 'loc-15', name: 'Saravanampatti', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641035', popularLandmarks: ['CHIL SEZ', 'KCT Campus', 'Sathy Road'] },
  { id: 'loc-16', name: 'Saibaba Colony', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641011', popularLandmarks: ['NSR Road', 'Ganga Hospital', 'Colony Park'] },

  // Madurai
  { id: 'loc-17', name: 'KK Nagar', city: 'Madurai', state: 'Tamil Nadu', pincode: '625020', popularLandmarks: ['Court Building', 'Lake View Road', 'Walker Park'] },
  { id: 'loc-18', name: 'Anna Nagar', city: 'Madurai', state: 'Tamil Nadu', pincode: '625020', popularLandmarks: ['Suguna Store', 'Ambika Theater', '80 Feet Road'] },
  { id: 'loc-19', name: 'Simmakkal', city: 'Madurai', state: 'Tamil Nadu', pincode: '625001', popularLandmarks: ['Meenakshi Temple Gate', 'Goripalayam', 'Vaigai River Road'] },

  // Salem
  { id: 'loc-20', name: 'Fairlands', city: 'Salem', state: 'Tamil Nadu', pincode: '636016', popularLandmarks: ['Brindavan Road', 'New Bus Stand', 'ALC Complex'] },
  { id: 'loc-21', name: 'Hasthampatti', city: 'Salem', state: 'Tamil Nadu', pincode: '636007', popularLandmarks: ['Yercaud Foot Hills Road', 'Collectorate', 'Five Roads'] },

  // Bengaluru
  { id: 'loc-6', name: 'Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', popularLandmarks: ['100ft Road', 'Defense Colony', 'Metro Station'] },
  { id: 'loc-7', name: 'Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', popularLandmarks: ['Sony World Signal', '4th Block', 'Forum Mall'] },
  { id: 'loc-22', name: 'HSR Layout', city: 'Bengaluru', state: 'Karnataka', pincode: '560102', popularLandmarks: ['27th Main', 'BDA Complex', 'Agara Lake'] },

  // Mumbai
  { id: 'loc-9', name: 'Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400053', popularLandmarks: ['Lokhandwala Complex', 'Infinity Mall', 'Metro'] },
  { id: 'loc-23', name: 'Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', popularLandmarks: ['Linking Road', 'Bandstand', 'Carter Road'] },

  // Delhi NCR
  { id: 'loc-8', name: 'Rohini', city: 'Delhi', state: 'Delhi NCR', pincode: '110085', popularLandmarks: ['Sector 9', 'Swarn Jayanti Park', 'Ring Road Mall'] },
  { id: 'loc-24', name: 'Connaught Place', city: 'Delhi', state: 'Delhi NCR', pincode: '110001', popularLandmarks: ['Inner Circle', 'Janpath', 'Rajiv Chowk Metro'] },

  // Hyderabad
  { id: 'loc-10', name: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034', popularLandmarks: ['Road No. 12', 'GVK One', 'Care Hospital'] },
  { id: 'loc-25', name: 'HITECH City', city: 'Hyderabad', state: 'Telangana', pincode: '500081', popularLandmarks: ['Cyber Towers', 'Mindspace Park', 'IKEA'] }
];

export const mockCooperatives: Cooperative[] = [
  {
    id: 'coop-1',
    name: 'Chennai Central Labour Cooperative Society',
    registrationNumber: 'TN-LCS-442/2014',
    city: 'Chennai',
    state: 'Tamil Nadu',
    establishedYear: 2014,
    totalWorkers: 1420,
    verifiedWorkers: 1388,
    activeJobs: 48,
    completedJobsTotal: 18450,
    totalEarningsDistributed: 5840000,
    workerWelfareFundBalance: 420000,
    presidentName: 'K. S. Ramanathan',
    contactPhone: '+91 44 2615 8890',
    email: 'contact@chennailabourcoop.org',
    address: 'No. 44, Co-op Bhavan, Rajaji Salai, Chennai 600001'
  },
  {
    id: 'coop-2',
    name: 'Bengaluru Urban Shramik Sahakari Sangha',
    registrationNumber: 'KA-BSS-891/2016',
    city: 'Bengaluru',
    state: 'Karnataka',
    establishedYear: 2016,
    totalWorkers: 1890,
    verifiedWorkers: 1820,
    activeJobs: 64,
    completedJobsTotal: 24200,
    totalEarningsDistributed: 8120000,
    workerWelfareFundBalance: 590000,
    presidentName: 'M. S. Manjunath',
    contactPhone: '+91 80 2234 1102',
    email: 'info@bangaloreshramik.org',
    address: 'Sahakara Soudha, 5th Main, Malleshwaram, Bengaluru 560003'
  },
  {
    id: 'coop-3',
    name: 'Delhi Shramik Sahakari Samiti Federation',
    registrationNumber: 'DL-LCU-102/2012',
    city: 'Delhi',
    state: 'Delhi NCR',
    establishedYear: 2012,
    totalWorkers: 2150,
    verifiedWorkers: 2085,
    activeJobs: 79,
    completedJobsTotal: 31050,
    totalEarningsDistributed: 10400000,
    workerWelfareFundBalance: 780000,
    presidentName: 'Rameshwar Dayal Verma',
    contactPhone: '+91 11 2337 9901',
    email: 'help@delhishramik.org',
    address: 'Shramik Bhavan, DDU Marg, New Delhi 110002'
  }
];

export const mockServices: ServiceItem[] = [
  {
    id: 'srv-plumbing',
    category: 'plumbing',
    name: 'Plumbing',
    nameTa: 'குழாய் பழுது நீக்குதல் (பிளம்பிங்)',
    nameHi: 'प्लंबिंग सेवा (नल व पाइप मरम्मत)',
    icon: 'Wrench',
    description: 'Tap leaks, pipe repair, toilet installation, bathroom fittings, water tank cleaning, and emergency blockages.',
    descriptionTa: 'குழாய் கசிவு, பைப் பழுது, வாட்டர் டேங்க் சுத்தம் மற்றும் அடைப்பு நீக்குதல்.',
    descriptionHi: 'नल रिसाव, पाइपलाइन मरम्मत, वाटर टैंक सफाई और सीवरेज ब्लॉकेज समाधान।',
    startingPrice: 349,
    unit: 'per visit',
    estimatedDuration: '45 - 90 mins',
    popularProblems: ['Leaking tap or shower', 'Blocked drain/toilet', 'Motor pump connection', 'Water heater fitting', 'Pipe replacement'],
    cooperativeRateGuideline: 'Standard Inspection: ₹349 | Major Repair: ₹599 + parts at MRP without markup',
    isEmergencyEligible: true
  },
  {
    id: 'srv-electrical',
    category: 'electrical',
    name: 'Electrical',
    nameTa: 'மின்சார வேலைகள் (எலக்ட்ரிக்கல்)',
    nameHi: 'इलेक्ट्रिकल काम (बिजली मिस्त्री)',
    icon: 'Zap',
    description: 'Short circuit troubleshooting, fan/switchboard repair, wiring, MCB replacement, inverter check, light fittings.',
    descriptionTa: 'மின் கசிவு, சுவிட்ச் போர்டு, ஃபேன், வயரிங் மற்றும் இன்வெர்ட்டர் பழுது.',
    descriptionHi: 'शॉर्ट सर्किट, पंखा व स्विचबोर्ड रिपेयर, इनवर्टर वायरिंग और नई फिटिंग।',
    startingPrice: 299,
    unit: 'per visit',
    estimatedDuration: '30 - 60 mins',
    popularProblems: ['Power tripping / MCB fault', 'Ceiling fan not working', 'Switchboard spark/replace', 'Inverter battery setup', 'Tube light & LED fitting'],
    cooperativeRateGuideline: 'Inspection & Minor Fix: ₹299 | Complete Room Rewiring: ₹899',
    isEmergencyEligible: true
  },
  {
    id: 'srv-carpentry',
    category: 'carpentry',
    name: 'Carpentry',
    nameTa: 'தச்சு வேலைகள் (கார்ப்பெண்டர்)',
    nameHi: 'बढ़ई का काम (कारपेंटर)',
    icon: 'Hammer',
    description: 'Door lock repair, furniture assembly, hinges fix, customized wooden shelves, wardrobe repairs, wooden polish.',
    descriptionTa: 'கதவு பூட்டு, மேஜை நாற்காலி சீரமைப்பு, பீரோ பழுது மற்றும் மர வேலைகள்.',
    descriptionHi: 'दरवाजा लॉक रिपेयर, फर्नीचर असेंबली, अलमारी मरम्मत और पॉलिशिंग।',
    startingPrice: 399,
    unit: 'per visit',
    estimatedDuration: '60 - 120 mins',
    popularProblems: ['Door alignment & lock change', 'Bed/Wardrobe assembly', 'Drawer slide fix', 'Chair/Table repair', 'Custom wood shelving'],
    cooperativeRateGuideline: 'Visit & Minor Repair: ₹399 | Full Furniture Build: Day wage ₹900/day',
    isEmergencyEligible: false
  },
  {
    id: 'srv-painting',
    category: 'painting',
    name: 'Painting',
    nameTa: 'பெயிண்டிங் & வெள்ளை அடித்தல்',
    nameHi: 'पेंटिंग और पुट्टी कार्य',
    icon: 'Paintbrush',
    description: 'Single room touch-up, full house interior & exterior painting, waterproof damp coating, stencil wall art.',
    descriptionTa: 'வீடு உட்புறம் மற்றும் வெளிப்புற பெயிண்டிங், ஈரப்பதம் தடுப்பு பூச்சு.',
    descriptionHi: 'कमरा पेंटिंग, वॉटरप्रूफ कोटिंग, वॉल पुट्टी और एक्सटीरियर रंगाई।',
    startingPrice: 699,
    unit: 'per room/quote',
    estimatedDuration: '1 - 3 days',
    popularProblems: ['Wall dampness patch', 'Single room repaint', 'Balcony ceiling touch-up', 'Door/Grill enamel painting', 'Full home festive makeover'],
    cooperativeRateGuideline: 'Cooperative standard ₹12 to ₹16 per sq ft including primer & 2 coats',
    isEmergencyEligible: false
  },
  {
    id: 'srv-cleaning',
    category: 'cleaning',
    name: 'Cleaning',
    nameTa: 'வீடு சுத்தம் செய்தல் (கிளீனிங்)',
    nameHi: 'डीप क्लीनिंग व सफाई',
    icon: 'Sparkles',
    description: 'Deep bathroom cleaning, kitchen degreasing, sofa & mattress shampooing, full home sanitization, floor scrubbing.',
    descriptionTa: 'குளியலறை, சமையலறை மற்றும் முழு வீடு ஆழமாக சுத்தம் செய்தல்.',
    descriptionHi: 'बाथरूम डीप क्लीन, किचन डीग्रीजिंग, सोफा शैम्पू और फर्श पॉलिश।',
    startingPrice: 449,
    unit: 'per service',
    estimatedDuration: '60 - 180 mins',
    popularProblems: ['Bathroom hard water stain removal', 'Kitchen chimney & tiles degreasing', 'Sofa deep vacuum & shampoo', 'Pre-move-in home scrubbing', 'Post-renovation dust clearing'],
    cooperativeRateGuideline: 'Standard Bathroom: ₹449 | Full 2BHK Deep Clean: ₹1,899',
    isEmergencyEligible: false
  },
  {
    id: 'srv-gardening',
    category: 'gardening',
    name: 'Gardening',
    nameTa: 'தோட்டக்கலை & செடி பராமரிப்பு',
    nameHi: 'बागवानी व पौध देखभाल',
    icon: 'Sprout',
    description: 'Lawn mowing, tree pruning, soil revitalization, organic pest spray, balcony garden setup, weed removal.',
    descriptionTa: 'புல்வெளி வெட்டுதல், செடிகள் கவாத்து செய்தல், பால்கனி தோட்டம் அமைத்தல்.',
    descriptionHi: 'घास कटाई, गमलों में नई मिट्टी व खाद, बालकोनी गार्डन सेट और छंटाई।',
    startingPrice: 349,
    unit: 'per visit',
    estimatedDuration: '60 - 120 mins',
    popularProblems: ['Overgrown lawn trimming', 'Potting soil & vermicompost mix', 'Organic pest treatment', 'Balcony planters setup', 'Tree branches trimming'],
    cooperativeRateGuideline: 'Standard 2-hour garden maintenance: ₹349 | Half-day service: ₹650',
    isEmergencyEligible: false
  },
  {
    id: 'srv-driving',
    category: 'driving',
    name: 'Driving',
    nameTa: 'ஓட்டுநர் சேவை (டிரைவிங்)',
    nameHi: 'ड्राइवर सेवा (अनुभवी चालक)',
    icon: 'Car',
    description: 'Experienced verified drivers for city errands, outstation trips, night duty, elderly hospital pickup.',
    descriptionTa: 'நகர பயணங்கள், வெளியூர் பயணம் மற்றும் மருத்துவமனை தேவைகளுக்கு ஓட்டுநர்.',
    descriptionHi: 'शहर में कार ड्राइविंग, आउटस्टेशन ट्रिप और अस्पताल आवागमन।',
    startingPrice: 499,
    unit: 'per 4 hrs',
    estimatedDuration: '4 - 8 hrs',
    popularProblems: ['4-hour local city commute', 'Full-day 8-hour personal driver', 'One-way outstation highway trip', 'Night emergency driving', 'Airport drop & pickup'],
    cooperativeRateGuideline: '4 Hours (Manual/Automatic): ₹499 | 8 Hours: ₹849 | Outstation ₹1,200/day + allowance',
    isEmergencyEligible: true
  },
  {
    id: 'srv-caregiving',
    category: 'caregiving',
    name: 'Caregiving',
    nameTa: 'முதியோர் & நோயாளி பராமரிப்பு',
    nameHi: 'बुजुर्ग व मरीज देखभाल',
    icon: 'HeartHandshake',
    description: 'Trained compassionate caregivers for elderly assistance, post-surgery mobility, medication reminders, companionship.',
    descriptionTa: 'முதியோர் உதவி, அறுவை சிகிச்சைக்குப் பின் கவனிப்பு, மருந்து நினைவூட்டல்.',
    descriptionHi: 'वरिष्ठ नागरिक देखभाल, दवा समय सारणी, व्हीलचेयर सहायता व देखभाल।',
    startingPrice: 599,
    unit: 'per shift',
    estimatedDuration: '4 - 12 hrs',
    popularProblems: ['4-hour morning senior support', '12-hour bedridden care shift', 'Hospital attendant assistance', 'Physiotherapy mobility companion', 'Dementia safe monitoring'],
    cooperativeRateGuideline: 'Cooperative certified nursing assistants starting ₹599/shift with transparent welfare insurance',
    isEmergencyEligible: true
  },
  {
    id: 'srv-appliance',
    category: 'appliance_repair',
    name: 'Appliance Repair',
    nameTa: 'வீட்டு உபகரணங்கள் பழுதுபார்த்தல்',
    nameHi: 'घरेलू उपकरण मरम्मत',
    icon: 'Tv',
    description: 'Washing machine, refrigerator, microwave oven, water purifier, geyser, mixer-grinder diagnosis and fix.',
    descriptionTa: 'வாஷிங் மெஷின், ஃப்ரிட்ஜ், மிக்ஸி, வாட்டர் ப்யூரிஃபையர் பழுது.',
    descriptionHi: 'वाशिंग मशीन, फ्रिज, माइक्रोवेव, वाटर प्यूरीफायर और गीजर रिपेयर।',
    startingPrice: 399,
    unit: 'per appliance',
    estimatedDuration: '45 - 90 mins',
    popularProblems: ['Washing machine drum not spinning', 'Refrigerator not cooling', 'Water purifier filter choked', 'Geyser not heating / shock', 'Microwave heating failure'],
    cooperativeRateGuideline: 'Standard Inspection & Diagnostic: ₹399 | Spare parts billing at direct co-op wholesale rates',
    isEmergencyEligible: true
  },
  {
    id: 'srv-masonry',
    category: 'masonry',
    name: 'Masonry & Tiles',
    nameTa: 'கொத்தனார் & டைல்ஸ் வேலைகள்',
    nameHi: 'राजमिस्त्री व टाइल्स कार्य',
    icon: 'Grid',
    description: 'Tile replacement, wall crack plastering, bathroom waterproofing, cement ramps, kitchen slab fixing.',
    descriptionTa: 'டைல்ஸ் மாற்றுதல், சுவர் விரிசல் பூச்சு, சிமெண்ட் தளம் அமைத்தல்.',
    descriptionHi: 'टूटी टाइल बदलना, प्लास्टर दरार मरम्मत, सीमेंट रैंप व वॉटरप्रूफिंग।',
    startingPrice: 549,
    unit: 'per visit',
    estimatedDuration: '2 - 6 hrs',
    popularProblems: ['Cracked bathroom floor tiles', 'Balcony water seepage repair', 'Brick wall patch plaster', 'Main door threshold step', 'Granite sink counter realignment'],
    cooperativeRateGuideline: 'Half-day Mason + Helper: ₹549 | Daily standard wage: ₹950/day',
    isEmergencyEligible: false
  },
  {
    id: 'srv-pest',
    category: 'pest_control',
    name: 'Pest Control',
    nameTa: 'பூச்சி & கரப்பான் கட்டுப்பாடு',
    nameHi: 'कीट नियंत्रण (पेस्ट कंट्रोल)',
    icon: 'ShieldAlert',
    description: 'Eco-friendly herbal gel for cockroaches, termite eradication, bed bug heat treatment, mosquito fogging.',
    descriptionTa: 'கரப்பான் பூச்சி, கரையான் மற்றும் கொசு கட்டுப்பாடு.',
    descriptionHi: 'दीमक रोकथाम, कॉकरोच हर्बल जेल उपचार व मच्छर नियंत्रण।',
    startingPrice: 499,
    unit: 'per 1BHK/2BHK',
    estimatedDuration: '45 - 90 mins',
    popularProblems: ['Cockroach kitchen infestation', 'Termite wooden wardrobe attack', 'Bed bugs eradication', 'Ants trail repellent', 'Garden mosquito fumigation'],
    cooperativeRateGuideline: 'Herbal Odorless 1BHK: ₹499 | 2BHK: ₹799 with 90-day cooperative warranty',
    isEmergencyEligible: false
  },
  {
    id: 'srv-technician',
    category: 'technician',
    name: 'General Technician',
    nameTa: 'பொது தொழில்நுட்ப வல்லுநர்',
    nameHi: 'सामान्य तकनीशियन / एसी सर्विस',
    icon: 'Cpu',
    description: 'AC gas refill, TV wall mounting, CCTV installation, WiFi router cabling, smart doorbell setup.',
    descriptionTa: 'ஏசி சர்வீஸ், டிவி வால் மவுண்டிங், சிசிடிவி கேமரா பொருத்துதல்.',
    descriptionHi: 'एसी गैस रिफिल, टीवी वॉल माउंटिंग और सीसीटीवी कैमरा इंस्टालेशन।',
    startingPrice: 349,
    unit: 'per task',
    estimatedDuration: '45 - 90 mins',
    popularProblems: ['AC deep foam jet cleaning', 'TV unmount and remount on wall', 'CCTV 4-camera cabling check', 'Smart lock battery & setup', 'Drilling & curtain rod mounting'],
    cooperativeRateGuideline: 'AC Jet Clean: ₹449 | TV Wall Mount: ₹349',
    isEmergencyEligible: true
  }
];

export const mockWorkers: Worker[] = [
  {
    id: 'wrk-1',
    name: 'Ravi Kumar',
    nameTa: 'ரவி குமார்',
    nameHi: 'रवि कुमार',
    photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
    phone: '+91 98401 23456',
    primarySkill: 'plumbing',
    primarySkillLabel: 'Master Plumber',
    otherSkills: ['appliance_repair', 'masonry'],
    experienceYears: 9,
    rating: 4.86,
    jobsCompleted: 142,
    distanceKm: 1.8,
    isVerified: true,
    verificationStatus: 'verified',
    isAvailableToday: true,
    isEmergencyReady: true,
    startingPrice: 349,
    cooperativeId: 'coop-1',
    cooperativeName: 'Chennai Central Labour Cooperative Society',
    cooperativeRegNo: 'TN-LCS-442/2014',
    locationArea: 'Anna Nagar',
    city: 'Chennai',
    latitude: 13.0850,
    longitude: 80.2101,
    languages: ['Tamil', 'English', 'Hindi'],
    bio: 'Dedicated licensed plumber with 9 years of field experience in sanitary fittings, leak detection, and motor pump overhaul. Certified by NSDC with clean police verification.',
    certifications: [
      {
        title: 'NSDC Level 4 Sanitary & Plumbing Technician',
        issuedBy: 'National Skill Development Corporation',
        year: 2018,
        certificateId: 'NSDC-PLB-2018-8849'
      },
      {
        title: 'State Labour Welfare Board Verified ID',
        issuedBy: 'Tamil Nadu Unorganised Workers Welfare Board',
        year: 2020,
        certificateId: 'TN-UWW-990214'
      }
    ],
    skillsList: [
      { name: 'Pipe Leak Repair & Concealed Fitting', experienceYears: 9, isCertified: true },
      { name: 'Overhead Tank & Sump Motor Plumbing', experienceYears: 7, isCertified: true },
      { name: 'Bathroom Sanitaryware Installation', experienceYears: 8, isCertified: true }
    ],
    reviews: [
      {
        id: 'rev-101',
        customerName: 'Senthil Nathan',
        rating: 5,
        date: '2026-08-28',
        comment: 'Ravi arrived within 25 minutes of booking! Fixed our main kitchen water inlet leak cleanly and gave honest advice about worn washers. Very polite.',
        tags: ['On time', 'Skilled', 'Fair price', 'Friendly'],
        serviceName: 'Kitchen Pipe Leak Repair'
      },
      {
        id: 'rev-102',
        customerName: 'Meenakshi Sundaram',
        rating: 5,
        date: '2026-08-15',
        comment: 'Excellent cooperative worker. Billed exactly as per the society rate card with no haggling. Highly recommended.',
        tags: ['Professional', 'On time', 'Good value'],
        serviceName: 'Flush Tank Valve Replacement'
      }
    ],
    welfareSchemeId: 'PMSBY-TN-442-9901',
    isIdentityChecked: true,
    isPoliceClearanceVerified: true,
    bankAccountLinked: true
  },
  {
    id: 'wrk-2',
    name: 'Murugan Thangaraj',
    nameTa: 'முருகன் தங்கராஜ்',
    nameHi: 'मुरुगन थंगराज',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    phone: '+91 97910 88721',
    primarySkill: 'electrical',
    primarySkillLabel: 'Senior Electrician (ITI Certified)',
    otherSkills: ['appliance_repair', 'technician'],
    experienceYears: 12,
    rating: 4.92,
    jobsCompleted: 218,
    distanceKm: 2.3,
    isVerified: true,
    verificationStatus: 'verified',
    isAvailableToday: true,
    isEmergencyReady: true,
    startingPrice: 299,
    cooperativeId: 'coop-1',
    cooperativeName: 'Chennai Central Labour Cooperative Society',
    cooperativeRegNo: 'TN-LCS-442/2014',
    locationArea: 'T. Nagar',
    city: 'Chennai',
    latitude: 13.0418,
    longitude: 80.2341,
    languages: ['Tamil', 'Telugu', 'English'],
    bio: 'ITI Electrical wireman certified with 12 years expertise in domestic and commercial circuits, inverter setups, and short-circuit hazard prevention.',
    certifications: [
      {
        title: 'ITI Electrician National Trade Certificate',
        issuedBy: 'Directorate General of Training (DGT), Govt of India',
        year: 2014,
        certificateId: 'NTC-ELEC-2014-4410'
      },
      {
        title: 'B-Licence Electrical Wireman Wireman Permit',
        issuedBy: 'Tamil Nadu Electrical Licensing Board',
        year: 2017,
        certificateId: 'TN-ELB-B-99214'
      }
    ],
    skillsList: [
      { name: 'Circuit Breaker & MCB Tripping Diagnostics', experienceYears: 12, isCertified: true },
      { name: 'Inverter & Battery Wiring', experienceYears: 10, isCertified: true },
      { name: '3-Phase Switchgear & Energy Meter Setup', experienceYears: 8, isCertified: true }
    ],
    reviews: [
      {
        id: 'rev-103',
        customerName: 'Ananya Raghavan',
        rating: 5,
        date: '2026-08-29',
        comment: 'Saved us during an emergency sparking switchboard! Carried standard safety gear, insulated tools, and repaired the burnt socket swiftly.',
        tags: ['Emergency ready', 'Professional', 'Skilled'],
        serviceName: 'Emergency Switchboard Repair'
      }
    ],
    welfareSchemeId: 'PMSBY-TN-442-8821',
    isIdentityChecked: true,
    isPoliceClearanceVerified: true,
    bankAccountLinked: true
  },
  {
    id: 'wrk-3',
    name: 'Lakshmi Priya Devi',
    nameTa: 'லட்சுமி பிரியா தேவி',
    nameHi: 'लक्ष्मी प्रिया देवी',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    phone: '+91 94443 11209',
    primarySkill: 'caregiving',
    primarySkillLabel: 'Certified Elder Caregiver',
    otherSkills: ['cleaning'],
    experienceYears: 7,
    rating: 4.95,
    jobsCompleted: 184,
    distanceKm: 3.1,
    isVerified: true,
    verificationStatus: 'verified',
    isAvailableToday: true,
    isEmergencyReady: false,
    startingPrice: 599,
    cooperativeId: 'coop-1',
    cooperativeName: 'Chennai Central Labour Cooperative Society',
    cooperativeRegNo: 'TN-LCS-442/2014',
    locationArea: 'Adyar',
    city: 'Chennai',
    latitude: 13.0012,
    longitude: 80.2565,
    languages: ['Tamil', 'English', 'Malayalam'],
    bio: 'Patient and empathetic certified nursing attendant specializing in geriatric care, post-operative mobility, medication schedules, and companionship.',
    certifications: [
      {
        title: 'General Duty Assistant (Healthcare Caregiver)',
        issuedBy: 'Healthcare Sector Skill Council (HSSC)',
        year: 2019,
        certificateId: 'HSSC-GDA-2019-5512'
      }
    ],
    skillsList: [
      { name: 'Geriatric Daily Living Assistance', experienceYears: 7, isCertified: true },
      { name: 'Vitals Monitoring (BP, Sugar, Pulse Oximeter)', experienceYears: 6, isCertified: true },
      { name: 'Post-Orthopedic Surgery Mobility Support', experienceYears: 5, isCertified: true }
    ],
    reviews: [
      {
        id: 'rev-104',
        customerName: 'Dr. Balachander',
        rating: 5,
        date: '2026-08-20',
        comment: 'Lakshmi looked after my 84-year-old mother with supreme warmth, punctuality, and gentle care. True blessing to have cooperative-vetted caregivers.',
        tags: ['Caring', 'On time', 'Professional'],
        serviceName: 'Elderly Day Caregiver'
      }
    ],
    welfareSchemeId: 'PMSBY-TN-442-7719',
    isIdentityChecked: true,
    isPoliceClearanceVerified: true,
    bankAccountLinked: true
  },
  {
    id: 'wrk-4',
    name: 'Karthik Selvam',
    nameTa: 'கார்த்திக் செல்வம்',
    nameHi: 'कार्तिक सेल्वम',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    phone: '+91 98840 55678',
    primarySkill: 'carpentry',
    primarySkillLabel: 'Master Wood Craftsman',
    otherSkills: ['masonry'],
    experienceYears: 11,
    rating: 4.82,
    jobsCompleted: 130,
    distanceKm: 2.7,
    isVerified: true,
    verificationStatus: 'verified',
    isAvailableToday: true,
    isEmergencyReady: false,
    startingPrice: 399,
    cooperativeId: 'coop-1',
    cooperativeName: 'Chennai Central Labour Cooperative Society',
    cooperativeRegNo: 'TN-LCS-442/2014',
    locationArea: 'Mylapore',
    city: 'Chennai',
    latitude: 13.0339,
    longitude: 80.2678,
    languages: ['Tamil', 'English'],
    bio: 'Experienced carpenter skilled in wooden modular cabinetry, door hinges realignments, electronic and deadbolt lock fitting, and teak restoration.',
    certifications: [
      {
        title: 'Furniture & Fitting Skill Council Certification',
        issuedBy: 'FFSC Skill India',
        year: 2017,
        certificateId: 'FFSC-CRP-2017-9102'
      }
    ],
    skillsList: [
      { name: 'Door Lock & Latch Replacement', experienceYears: 11, isCertified: true },
      { name: 'Modular Wardrobe Hinge & Slider Repair', experienceYears: 9, isCertified: true }
    ],
    reviews: [
      {
        id: 'rev-105',
        customerName: 'Gopinath V.',
        rating: 5,
        date: '2026-08-25',
        comment: 'Installed high-security Godrej lock and adjusted two warped wooden doors in under two hours. Clean finish and zero wood dust left behind.',
        tags: ['Skilled', 'On time', 'Good value'],
        serviceName: 'Door Lock Repair'
      }
    ],
    welfareSchemeId: 'PMSBY-TN-442-6632',
    isIdentityChecked: true,
    isPoliceClearanceVerified: true,
    bankAccountLinked: true
  },
  {
    id: 'wrk-5',
    name: 'Anand Basappa',
    nameTa: 'ஆனந்த் பசப்பா',
    nameHi: 'आनंद बसप्पा',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    phone: '+91 99801 44552',
    primarySkill: 'appliance_repair',
    primarySkillLabel: 'Senior Appliance Specialist',
    otherSkills: ['electrical', 'technician'],
    experienceYears: 8,
    rating: 4.88,
    jobsCompleted: 165,
    distanceKm: 2.1,
    isVerified: true,
    verificationStatus: 'verified',
    isAvailableToday: true,
    isEmergencyReady: true,
    startingPrice: 399,
    cooperativeId: 'coop-2',
    cooperativeName: 'Bengaluru Urban Shramik Sahakari Sangha',
    cooperativeRegNo: 'KA-BSS-891/2016',
    locationArea: 'Indiranagar',
    city: 'Bengaluru',
    latitude: 12.9784,
    longitude: 77.6408,
    languages: ['Kannada', 'Hindi', 'English', 'Tamil'],
    bio: 'Specialist in inverter refrigerators, front/top load washing machines, and microwave ovens. Authorized cooperative technician carrying genuine spare parts.',
    certifications: [
      {
        title: 'Electronics Sector Skill Council of India - Home Appliances',
        issuedBy: 'ESSCI Skill India',
        year: 2018,
        certificateId: 'ESSCI-APP-2018-3312'
      }
    ],
    skillsList: [
      { name: 'Washing Machine Drum & Motor Diagnostics', experienceYears: 8, isCertified: true },
      { name: 'Refrigerator Gas Leak & Compressor Check', experienceYears: 7, isCertified: true }
    ],
    reviews: [
      {
        id: 'rev-106',
        customerName: 'Pooja Hegde',
        rating: 5,
        date: '2026-08-27',
        comment: 'Fixed our Samsung washing machine that was not draining. Replaced the pump at standard co-op price. Excellent transparency.',
        tags: ['Skilled', 'Fair price', 'On time'],
        serviceName: 'Washing Machine Drainage Repair'
      }
    ],
    welfareSchemeId: 'PMSBY-KA-891-1102',
    isIdentityChecked: true,
    isPoliceClearanceVerified: true,
    bankAccountLinked: true
  },
  {
    id: 'wrk-6',
    name: 'Meera Bai',
    nameTa: 'மீரா பாய்',
    nameHi: 'मीरा बाई',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    phone: '+91 97422 99018',
    primarySkill: 'cleaning',
    primarySkillLabel: 'Deep Cleaning Team Lead',
    otherSkills: ['gardening'],
    experienceYears: 6,
    rating: 4.89,
    jobsCompleted: 210,
    distanceKm: 1.4,
    isVerified: true,
    verificationStatus: 'verified',
    isAvailableToday: true,
    isEmergencyReady: false,
    startingPrice: 449,
    cooperativeId: 'coop-2',
    cooperativeName: 'Bengaluru Urban Shramik Sahakari Sangha',
    cooperativeRegNo: 'KA-BSS-891/2016',
    locationArea: 'Koramangala',
    city: 'Bengaluru',
    latitude: 12.9352,
    longitude: 77.6245,
    languages: ['Kannada', 'Hindi', 'Telugu'],
    bio: 'Trained professional in eco-friendly steam sanitization, kitchen deep degreasing, bathroom descaling, and upholstery shampooing.',
    certifications: [
      {
        title: 'Professional Housekeeping & Hygiene Standards',
        issuedBy: 'Tourism & Hospitality Skill Council (THSC)',
        year: 2020,
        certificateId: 'THSC-CLN-2020-6671'
      }
    ],
    skillsList: [
      { name: 'Bathroom Hard-Water Descaling', experienceYears: 6, isCertified: true },
      { name: 'Kitchen Oil Degreasing & Chimney Clean', experienceYears: 5, isCertified: true }
    ],
    reviews: [
      {
        id: 'rev-107',
        customerName: 'Aditya Rao',
        rating: 5,
        date: '2026-08-30',
        comment: 'Made our 5-year-old bathroom tiles look brand new. No harsh chemical smell, polite and worked diligently without taking extra breaks.',
        tags: ['Clean work', 'On time', 'Polite'],
        serviceName: 'Bathroom Deep Clean'
      }
    ],
    welfareSchemeId: 'PMSBY-KA-891-5509',
    isIdentityChecked: true,
    isPoliceClearanceVerified: true,
    bankAccountLinked: true
  },
  {
    id: 'wrk-7',
    name: 'Rajesh Sharma',
    nameTa: 'ராஜேஷ் சர்மா',
    nameHi: 'राजेश शर्मा',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    phone: '+91 98110 33419',
    primarySkill: 'driving',
    primarySkillLabel: 'Professional Chauffeur (Badge Holder)',
    otherSkills: ['technician'],
    experienceYears: 14,
    rating: 4.94,
    jobsCompleted: 340,
    distanceKm: 3.5,
    isVerified: true,
    verificationStatus: 'verified',
    isAvailableToday: true,
    isEmergencyReady: true,
    startingPrice: 499,
    cooperativeId: 'coop-3',
    cooperativeName: 'Delhi Shramik Sahakari Samiti Federation',
    cooperativeRegNo: 'DL-LCU-102/2012',
    locationArea: 'Rohini',
    city: 'Delhi',
    languages: ['Hindi', 'Punjabi', 'English'],
    bio: 'Zero-incident verified commercial badge driver with 14 years across manual and luxury automatic vehicles. Clean record with background verification on DigiLocker.',
    certifications: [
      {
        title: 'Commercial Heavy & Light Transport Badge',
        issuedBy: 'Transport Department, Govt of NCT Delhi',
        year: 2012,
        certificateId: 'DL-RTO-COMM-2012-7712'
      }
    ],
    skillsList: [
      { name: 'City Traffic & Highway Defensive Driving', experienceYears: 14, isCertified: true },
      { name: 'Automatic, EV & Luxury Car Handling', experienceYears: 8, isCertified: true }
    ],
    reviews: [
      {
        id: 'rev-108',
        customerName: 'Sunil Chawla',
        rating: 5,
        date: '2026-08-24',
        comment: 'Rajesh ji drove our family to Jaipur and back. Extremely smooth driving, punctual, respected elderly comfort completely.',
        tags: ['Punctual', 'Safe driver', 'Courteous'],
        serviceName: 'Outstation Family Trip'
      }
    ],
    welfareSchemeId: 'PMSBY-DL-102-4419',
    isIdentityChecked: true,
    isPoliceClearanceVerified: true,
    bankAccountLinked: true
  },
  {
    id: 'wrk-8',
    name: 'Kavita Suresh',
    nameTa: 'கவிதா சுரேஷ்',
    nameHi: 'कविता सुरेश',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    phone: '+91 94451 77203',
    primarySkill: 'gardening',
    primarySkillLabel: 'Horticulturist & Balcony Garden Expert',
    otherSkills: ['cleaning'],
    experienceYears: 8,
    rating: 4.87,
    jobsCompleted: 98,
    distanceKm: 1.9,
    isVerified: true,
    verificationStatus: 'verified',
    isAvailableToday: true,
    isEmergencyReady: false,
    startingPrice: 349,
    cooperativeId: 'coop-1',
    cooperativeName: 'Chennai Central Labour Cooperative Society',
    cooperativeRegNo: 'TN-LCS-442/2014',
    locationArea: 'Velachery',
    city: 'Chennai',
    languages: ['Tamil', 'English'],
    bio: 'Diploma holder in Horticulture. Passionate about natural compost, organic pest sprays (Neem oil/Karanja), hydroponic herbs, and lawn rejuvenation.',
    certifications: [
      {
        title: 'Agriculture Skill Council of India - Gardener (Mali)',
        issuedBy: 'ASCI Skill India',
        year: 2019,
        certificateId: 'ASCI-GDN-2019-1190'
      }
    ],
    skillsList: [
      { name: 'Balcony & Terrace Organic Kitchen Garden', experienceYears: 8, isCertified: true },
      { name: 'Rose & Flowering Plants Pruning & Nutrition', experienceYears: 6, isCertified: true }
    ],
    reviews: [
      {
        id: 'rev-109',
        customerName: 'Radha Krishnamoorthy',
        rating: 5,
        date: '2026-08-22',
        comment: 'Kavita revived my dying bougainvillea and set up a neat drip hydration for our potted plants. Truly knowledgeable.',
        tags: ['Expert', 'Friendly', 'Great value'],
        serviceName: 'Terrace Garden Care'
      }
    ],
    welfareSchemeId: 'PMSBY-TN-442-3390',
    isIdentityChecked: true,
    isPoliceClearanceVerified: true,
    bankAccountLinked: true
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'bk-901',
    bookingCode: 'SS-2026-901',
    customerId: 'cust-1',
    customerName: 'Vijay Madhesh',
    customerPhone: '+91 98409 11223',
    workerId: 'wrk-1',
    workerName: 'Ravi Kumar',
    workerPhoto: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
    workerPhone: '+91 98401 23456',
    cooperativeName: 'Chennai Central Labour Cooperative Society',
    serviceCategory: 'plumbing',
    serviceName: 'Plumbing - Leaking Overhead Valve',
    problemDescription: 'Main kitchen pipe leak and low pressure in bathroom washbasin.',
    address: {
      street: 'Flat 3B, Shanthi Heights, 2nd Avenue',
      area: 'Anna Nagar',
      city: 'Chennai',
      pincode: '600040',
      landmark: 'Near Roundtana'
    },
    scheduledDate: '2026-09-01',
    scheduledTimeSlot: '10:30 AM - 11:30 AM',
    isEmergency: false,
    status: 'on_the_way',
    statusTimestamps: {
      confirmedAt: '2026-09-01 08:30 AM',
      acceptedAt: '2026-09-01 08:35 AM',
      onTheWayAt: '2026-09-01 08:45 AM'
    },
    pricing: {
      serviceCharge: 349,
      workerEarnings: 330,
      cooperativeWelfareFund: 19,
      platformConvenienceFee: 0,
      taxGST: 18,
      totalAmount: 367
    },
    payment: {
      method: 'upi',
      status: 'completed',
      transactionId: 'UPI-COOP-8821901',
      paidAt: '2026-09-01 08:31 AM'
    }
  },
  {
    id: 'bk-902',
    bookingCode: 'SS-2026-880',
    customerId: 'cust-1',
    customerName: 'Vijay Madhesh',
    customerPhone: '+91 98409 11223',
    workerId: 'wrk-2',
    workerName: 'Murugan Thangaraj',
    workerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    workerPhone: '+91 97910 88721',
    cooperativeName: 'Chennai Central Labour Cooperative Society',
    serviceCategory: 'electrical',
    serviceName: 'Electrical - Inverter MCB Tripping',
    problemDescription: 'Inverter tripping frequently when AC turns on.',
    address: {
      street: 'Flat 3B, Shanthi Heights, 2nd Avenue',
      area: 'Anna Nagar',
      city: 'Chennai',
      pincode: '600040',
      landmark: 'Near Roundtana'
    },
    scheduledDate: '2026-08-25',
    scheduledTimeSlot: '04:00 PM - 05:00 PM',
    isEmergency: false,
    status: 'service_completed',
    statusTimestamps: {
      confirmedAt: '2026-08-25 03:00 PM',
      acceptedAt: '2026-08-25 03:05 PM',
      onTheWayAt: '2026-08-25 03:40 PM',
      arrivedAt: '2026-08-25 04:02 PM',
      startedAt: '2026-08-25 04:05 PM',
      completedAt: '2026-08-25 04:48 PM'
    },
    pricing: {
      serviceCharge: 299,
      workerEarnings: 284,
      cooperativeWelfareFund: 15,
      platformConvenienceFee: 0,
      taxGST: 15,
      totalAmount: 314
    },
    payment: {
      method: 'upi',
      status: 'completed',
      transactionId: 'UPI-COOP-7731880',
      paidAt: '2026-08-25 04:50 PM'
    },
    review: {
      rating: 5,
      tags: ['On time', 'Skilled', 'Professional'],
      comment: 'Replaced the loose wire terminal safely. Very knowledgeable technician.',
      reviewedAt: '2026-08-25 05:00 PM'
    }
  }
];

export const mockDemandForecast: DemandForecastItem[] = [
  {
    id: 'f-1',
    serviceCategory: 'plumbing',
    serviceName: 'Plumbing & Drainage',
    demandLevel: 'HIGH',
    growthPercentage: 46,
    reason: 'Heavy monsoon showers anticipated in coastal districts leading to sump overflow, roof drain blockages, and tap pressure variations.',
    reasonTa: 'பருவமழை முன்னறிவிப்பால் மழைநீர் வடிகால் அடைப்பு மற்றும் நீர் தொட்டி நிரம்பி வழிதல் பிரச்சனைகள் அதிகரிக்கும்.',
    reasonHi: 'आगामी मानसून के कारण जलभराव और ड्रेनेज ब्लॉकेज की मांग में 46% की भारी वृद्धि संभावित।',
    hotspotAreas: [
      { areaName: 'Anna Nagar', demandLevel: 'High', activeRequests: 38, availableWorkers: 24, recommendedDeployment: 14 },
      { areaName: 'Adyar', demandLevel: 'High', activeRequests: 42, availableWorkers: 22, recommendedDeployment: 20 },
      { areaName: 'Velachery', demandLevel: 'High', activeRequests: 54, availableWorkers: 30, recommendedDeployment: 24 },
      { areaName: 'T. Nagar', demandLevel: 'Medium', activeRequests: 26, availableWorkers: 20, recommendedDeployment: 6 }
    ],
    peakDays: ['Friday', 'Saturday', 'Sunday'],
    historicalWeeklyTrends: [
      { day: 'Mon', requests: 45, capacity: 60 },
      { day: 'Tue', requests: 52, capacity: 60 },
      { day: 'Wed', requests: 58, capacity: 60 },
      { day: 'Thu', requests: 64, capacity: 60 },
      { day: 'Fri', requests: 88, capacity: 60 },
      { day: 'Sat', requests: 104, capacity: 65 },
      { day: 'Sun', requests: 112, capacity: 70 }
    ]
  },
  {
    id: 'f-2',
    serviceCategory: 'electrical',
    serviceName: 'Electrical & Inverter Servicing',
    demandLevel: 'MEDIUM',
    growthPercentage: 24,
    reason: 'Power grid fluctuations and pre-festival lighting installations across residential hubs.',
    reasonTa: 'பண்டிகை கால விளக்கு பொருத்துதல் மற்றும் மின் கசிவு முன்னெச்சரிக்கை சரிபார்ப்புகள்.',
    reasonHi: 'त्योहारी सीजन में घरों में नई वायरिंग और इनवर्टर सर्विसिंग की मांग में 24% बढ़ोतरी।',
    hotspotAreas: [
      { areaName: 'T. Nagar', demandLevel: 'High', activeRequests: 34, availableWorkers: 22, recommendedDeployment: 12 },
      { areaName: 'Mylapore', demandLevel: 'Medium', activeRequests: 22, availableWorkers: 18, recommendedDeployment: 4 },
      { areaName: 'Anna Nagar', demandLevel: 'Medium', activeRequests: 28, availableWorkers: 25, recommendedDeployment: 3 }
    ],
    peakDays: ['Saturday', 'Sunday'],
    historicalWeeklyTrends: [
      { day: 'Mon', requests: 30, capacity: 45 },
      { day: 'Tue', requests: 32, capacity: 45 },
      { day: 'Wed', requests: 38, capacity: 45 },
      { day: 'Thu', requests: 40, capacity: 45 },
      { day: 'Fri', requests: 50, capacity: 45 },
      { day: 'Sat', requests: 62, capacity: 50 },
      { day: 'Sun', requests: 68, capacity: 50 }
    ]
  },
  {
    id: 'f-3',
    serviceCategory: 'cleaning',
    serviceName: 'Deep House & Post-Monsoon Cleaning',
    demandLevel: 'HIGH',
    growthPercentage: 58,
    reason: 'Pre-festival spring cleaning surge and post-monsoon mildew treatment for residential apartments.',
    reasonTa: 'பண்டிகைக்கு முந்தைய முழு வீடு மற்றும் குளியலறை ஆழமாக சுத்தம் செய்யும் முன்பதிவுகள் அதிகரிப்பு.',
    reasonHi: 'दीपावली व पोंगल पूर्व डीप हाउस क्लीनिंग और सोफा वॉश की मांग में 58% उछाल।',
    hotspotAreas: [
      { areaName: 'Adyar', demandLevel: 'High', activeRequests: 48, availableWorkers: 20, recommendedDeployment: 28 },
      { areaName: 'Indiranagar', demandLevel: 'High', activeRequests: 52, availableWorkers: 26, recommendedDeployment: 26 },
      { areaName: 'Rohini', demandLevel: 'High', activeRequests: 40, availableWorkers: 22, recommendedDeployment: 18 }
    ],
    peakDays: ['Friday', 'Saturday', 'Sunday', 'Monday'],
    historicalWeeklyTrends: [
      { day: 'Mon', requests: 25, capacity: 40 },
      { day: 'Tue', requests: 28, capacity: 40 },
      { day: 'Wed', requests: 35, capacity: 40 },
      { day: 'Thu', requests: 45, capacity: 40 },
      { day: 'Fri', requests: 70, capacity: 45 },
      { day: 'Sat', requests: 95, capacity: 50 },
      { day: 'Sun', requests: 102, capacity: 50 }
    ]
  },
  {
    id: 'f-4',
    serviceCategory: 'gardening',
    serviceName: 'Gardening & Pruning',
    demandLevel: 'LOW',
    growthPercentage: -8,
    reason: 'Seasonal stabilization with regular residential gardener visits already booked on monthly rosters.',
    reasonTa: 'வழக்கமான மாதாந்திர பராமரிப்பு அட்டவணை சீராக உள்ளது.',
    reasonHi: 'मासिक नियमित रखरखाव के कारण सामान्य मांग स्तर बना हुआ है।',
    hotspotAreas: [
      { areaName: 'Anna Nagar', demandLevel: 'Low', activeRequests: 12, availableWorkers: 18, recommendedDeployment: 0 },
      { areaName: 'Besant Nagar', demandLevel: 'Low', activeRequests: 10, availableWorkers: 15, recommendedDeployment: 0 }
    ],
    peakDays: ['Saturday', 'Sunday'],
    historicalWeeklyTrends: [
      { day: 'Mon', requests: 15, capacity: 30 },
      { day: 'Tue', requests: 14, capacity: 30 },
      { day: 'Wed', requests: 16, capacity: 30 },
      { day: 'Thu', requests: 15, capacity: 30 },
      { day: 'Fri', requests: 20, capacity: 30 },
      { day: 'Sat', requests: 28, capacity: 30 },
      { day: 'Sun', requests: 30, capacity: 30 }
    ]
  }
];
