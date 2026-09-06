export interface WorkerPortalPhrases {
  workerAppTitle: string;
  workerAppSub: string;
  switchToCustomer: string;
  voiceOn: string;
  voiceOff: string;
  workerName: string;
  tradeTag: string;
  verifiedBadge: string;
  coopId: string;
  readyForWork: string;
  resting: string;
  todayEarnings: string;
  directCashTag: string;
  directToYou: string;
  jobsDone: string;
  jobsUnit: string;
  jobsCompletedBadge: string;
  activeJobBadge: string;
  cashWillGet: string;
  customerLabel: string;
  distanceAway: string;
  addressLabel: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  onMyWay: string;
  arrived: string;
  startWork: string;
  workFinished: string;
  collectCash: string;
  cashReceived: string;
  onMyWayAction: string;
  arrivedAction: string;
  startWorkAction: string;
  workFinishedAction: string;
  cashReceivedAction: string;
  callCustomer: string;
  openMap: string;
  listen: string;
  allJobs: string;
  unskilled: string;
  skilled: string;
  testJob: string;
  incomingJob: string;
  availableTag: string;
  nearYourArea: string;
  noJobsTitle: string;
  noJobsSubtitle: string;
  accept: string;
  decline: string;
  morning: string;
  afternoon: string;
  evening: string;
  coopProtectionTitle: string;
  coopProtectionSub: string;
  needHelp: string;
  speakingPromptNewJob: (name: string, service: string, amount: number) => string;
  speakingAccepted: string;
  speakingOnTheWay: string;
  speakingArrived: string;
  speakingCompleted: (amount: number) => string;
}

export const WORKER_LANGUAGES = [
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export const WORKER_PHRASES: Record<string, WorkerPortalPhrases> = {
  hi: {
    workerAppTitle: 'कामगार पोर्टल (श्रमिक ऐप)',
    workerAppSub: 'कुशल व अकुशल श्रमिकों के लिए सरल साथी',
    switchToCustomer: '🏢 ग्राहक दृश्य पर जाएँ',
    voiceOn: '🔊 आवाज़ चालू (Voice ON)',
    voiceOff: '🔇 आवाज़ बंद (Voice Mute)',
    workerName: 'रामेश्वर यादव (Rameshwar)',
    tradeTag: '🌊 प्रेशर मशीन ऑपरेटर व हेल्पर',
    verifiedBadge: 'सरकारी सत्यापित सदस्य',
    coopId: 'श्रम सहकारी ID: #COOP-IN-8891 • 5 वर्ष अनुभव',
    readyForWork: 'काम चालू (ड्यूटी पर हैं)',
    resting: 'आराम / छुट्टी (ऑफलाइन)',
    todayEarnings: 'आज की कमाई (नकद)',
    directCashTag: 'नकद / Direct Cash',
    directToYou: '100% पूरा पैसा आपका • कोई कट नहीं',
    jobsDone: 'काम पूरे किए',
    jobsUnit: 'काम',
    jobsCompletedBadge: 'शानदार काम! (Excellent Work)',
    activeJobBadge: 'चालू काम (Active Job)',
    cashWillGet: 'नकद मिलेंगे',
    customerLabel: 'ग्राहक',
    distanceAway: 'दूर',
    addressLabel: 'पता',
    step1: '1. स्वीकृत',
    step2: '2. रास्ते में',
    step3: '3. पहुँचा',
    step4: '4. काम चालू',
    step5: '5. पैसे मिले',
    onMyWay: 'मैं रास्ते में हूँ',
    arrived: 'पहुँच गया हूँ',
    startWork: 'काम शुरू किया',
    workFinished: 'काम पूरा हो गया',
    collectCash: 'नकद पैसे लें',
    cashReceived: 'पैसे मिल गए ✅',
    onMyWayAction: '🛵 रास्ते में हूँ (निकलने पर दबाएँ)',
    arrivedAction: '📍 साइट पर पहुँच गया (पहुँचने पर दबाएँ)',
    startWorkAction: '⚡ काम शुरू किया (शुरू करने पर दबाएँ)',
    workFinishedAction: '✅ काम पूरा हुआ (पूरा होने पर दबाएँ)',
    cashReceivedAction: '💵 पैसे मिल गए - अगले काम के लिए तैयार',
    callCustomer: 'ग्राहक को फोन करें',
    openMap: 'रास्ता देखें (नक्शा)',
    listen: 'आवाज़ में सुनें',
    allJobs: 'सभी काम',
    unskilled: 'हेल्पर / सादा काम',
    skilled: 'मिस्त्री / मशीन काम',
    testJob: '🔔 नया काम डेमो देखें',
    incomingJob: 'नया काम आया है!',
    availableTag: 'उपलब्ध',
    nearYourArea: 'आपके क्षेत्र के पास • स्वीकार करने के लिए हरा बटन दबाएँ',
    noJobsTitle: 'अभी कोई नया काम नहीं है',
    noJobsSubtitle: 'ड्यूटी चालू रखें। जैसे ही पास में कोई काम आएगा, फोन में घंटी बजेगी और आवाज़ में सुनाई देगा।',
    accept: 'काम स्वीकार करें (स्वीकार)',
    decline: 'मना करें',
    morning: 'सुबह (Morning)',
    afternoon: 'दोपहर (Afternoon)',
    evening: 'शाम (Evening)',
    coopProtectionTitle: 'श्रम सहकारी समिति सुरक्षा',
    coopProtectionSub: '₹2,00,000 सरकारी दुर्घटना बीमा (PMSBY) • निःशुल्क सुरक्षा उपकरण',
    needHelp: '🆘 सुपरवाइजर हेल्पलाइन',
    speakingPromptNewJob: (name, service, amount) =>
      `नमस्ते! नया काम मिला है। काम है ${service}। ग्राहक का नाम ${name} है। आपको मिलेंगे ${amount} रुपये नकद। स्वीकार करने के लिए हरा बटन दबाएं।`,
    speakingAccepted: 'काम स्वीकार कर लिया गया है। ग्राहक को फोन करने के लिए नीला बटन दबाएँ।',
    speakingOnTheWay: 'आप रास्ते में हैं। सावधानी से जाएं।',
    speakingArrived: 'आप ग्राहक के घर पहुँच गए हैं।',
    speakingCompleted: (amount) => `काम पूरा हो गया है। कृपया ग्राहक से ${amount} रुपये नकद लें।`
  },
  ta: {
    workerAppTitle: 'தொழிலாளர் போர்டல் (Worker App)',
    workerAppSub: 'தொழிலாளர்களுக்கான எளிய வழிகாட்டி தளம்',
    switchToCustomer: '🏢 வாடிக்கையாளர் முறைக்கு மாறவும்',
    voiceOn: '🔊 குரல் உதவி இயங்குகிறது (Voice ON)',
    voiceOff: '🔇 குரல் உதவி முடக்கப்பட்டது (Voice Mute)',
    workerName: 'ராமேஸ்வர யாதவ் (Rameshwar)',
    tradeTag: '🌊 பிரஷர் வாஷிங் & உதவியாளர்',
    verifiedBadge: 'அரசு அங்கீகாரம் பெற்ற உறுப்பினர்',
    coopId: 'கூட்டுறவு ஐடி: #COOP-IN-8891 • 5 ஆண்டுகள் அனுபவம்',
    readyForWork: 'வேலைக்கு தயார் (ஆன்லைன்)',
    resting: 'ஓய்வு (ஆஃப்லைன்)',
    todayEarnings: 'இன்றைய வருமானம் (ரொக்கம்)',
    directCashTag: 'நேரடி ரொக்கம் / Direct Cash',
    directToYou: '100% முழு பணமும் உங்களுக்கே • கமிஷன் இல்லை',
    jobsDone: 'முடிந்த வேலைகள்',
    jobsUnit: 'வேலைகள்',
    jobsCompletedBadge: 'சிறப்பான உழைப்பு! (Excellent Work)',
    activeJobBadge: 'தற்போதைய வேலை (Active Job)',
    cashWillGet: 'ரொக்கமாக கிடைக்கும்',
    customerLabel: 'வாடிக்கையாளர்',
    distanceAway: 'தொலைவில்',
    addressLabel: 'முகவரி',
    step1: '1. ஏற்கப்பட்டது',
    step2: '2. வழியில்',
    step3: '3. வந்துவிட்டேன்',
    step4: '4. வேலை நடக்கிறது',
    step5: '5. பணம் பெற்றது',
    onMyWay: 'நான் வழியில் வருகிறேன்',
    arrived: 'வந்துவிட்டேன்',
    startWork: 'வேலை தொடங்கியது',
    workFinished: 'வேலை முடிந்தது',
    collectCash: 'பணம் வாங்கவும்',
    cashReceived: 'பணம் பெற்றது ✅',
    onMyWayAction: '🛵 வழியில் கிளம்பும்போது அழுத்தவும்',
    arrivedAction: '📍 இடத்தை அடைந்தவுடன் அழுத்தவும்',
    startWorkAction: '⚡ வேலை தொடங்கும்போது அழுத்தவும்',
    workFinishedAction: '✅ வேலை முடிந்தவுடன் அழுத்தவும்',
    cashReceivedAction: '💵 பணம் பெற்றது - அடுத்த வேலைக்கு தயார்',
    callCustomer: 'வாடிக்கையாளருக்கு அழைக்கவும்',
    openMap: 'வழி பார்க்க (மேப்)',
    listen: 'குரலில் கேளுங்கள்',
    allJobs: 'அனைத்து வேலைகள்',
    unskilled: 'ஹெல்பர் / எளிய வேலை',
    skilled: 'மெக்கானிக் / மெஷின் வேலை',
    testJob: '🔔 மாதிரி வேலை பார்க்க',
    incomingJob: 'புதிய வேலை வந்துள்ளது!',
    availableTag: 'கிடைக்கும்',
    nearYourArea: 'உங்கள் பகுதி அருகில் • ஏற்க பச்சை பொத்தானை அழுத்தவும்',
    noJobsTitle: 'தற்போது புதிய வேலைகள் இல்லை',
    noJobsSubtitle: 'ஆன்லைனில் இருங்கள். வேலை வந்தவுடன் போனில் மணி ஒலிக்கும் மற்றும் குரல் ஒலிக்கும்.',
    accept: 'வேலையை ஏற்கவும் (ஏற்கிறேன்)',
    decline: 'வேண்டாம்',
    morning: 'காலை (Morning)',
    afternoon: 'மதியம் (Afternoon)',
    evening: 'மாலை (Evening)',
    coopProtectionTitle: 'தொழிலாளர் கூட்டுறவு சங்கம் பாதுகாப்பு',
    coopProtectionSub: '₹2,00,000 அரசு விபத்து காப்பீடு (PMSBY) • இலவச உபகரணங்கள்',
    needHelp: '🆘 மேற்பார்வையாளர் உதவி எண்',
    speakingPromptNewJob: (name, service, amount) =>
      `வணக்கம்! புதிய வேலை வந்துள்ளது. வேலை: ${service}. வாடிக்கையாளர் பெயர் ${name}. கட்டணம் ரூபாய் ${amount}. ஏற்க பச்சை பொத்தானை அழுத்தவும்.`,
    speakingAccepted: 'வேலை ஏற்கப்பட்டது. வாடிக்கையாளரை அழைக்க நீல பொத்தானை அழுத்தவும்.',
    speakingOnTheWay: 'நீங்கள் வழியில் செல்கிறீர்கள். கவனமாக செல்லவும்.',
    speakingArrived: 'நீங்கள் இடத்தை அடைந்துவிட்டீர்கள்.',
    speakingCompleted: (amount) => `வேலை முடிந்தது. வாடிக்கையாளரிடமிருந்து ரூபாய் ${amount} வாங்கவும்.`
  },
  te: {
    workerAppTitle: 'కార్మికుల పోర్టల్ (Worker App)',
    workerAppSub: 'కార్మికుల కోసం సులభమైన మొబైల్ యాప్',
    switchToCustomer: '🏢 కస్టమర్ వ్యూకి మారండి',
    voiceOn: '🔊 వాయిస్ ఆన్ (Voice ON)',
    voiceOff: '🔇 వాయిస్ ఆఫ్ (Voice Mute)',
    workerName: 'రామేశ్వర్ యాదవ్ (Rameshwar)',
    tradeTag: '🌊 ప్రెషర్ వాషింగ్ & హెల్పర్',
    verifiedBadge: 'ప్రభుత్వ ధృవీకృత సభ్యుడు',
    coopId: 'కో-ఆపరేటివ్ ID: #COOP-IN-8891 • 5 ఏళ్ల అనుభవం',
    readyForWork: 'పనికి సిద్ధంగా ఉన్నాను (ఆన్‌లైన్)',
    resting: 'విశ్రాంతి (ఆఫ్‌లైన్)',
    todayEarnings: 'ఈరోజు సంపాదన (నగదు)',
    directCashTag: 'ప్రత్యక్ష నగదు / Direct Cash',
    directToYou: '100% మొత్తం డబ్బు మీదే • కమీషన్ లేదు',
    jobsDone: 'పూర్తయిన పనులు',
    jobsUnit: 'పనులు',
    jobsCompletedBadge: 'అద్భుతమైన పని! (Excellent Work)',
    activeJobBadge: 'ప్రస్తుత పని (Active Job)',
    cashWillGet: 'నగదు అందుతుంది',
    customerLabel: 'కస్టమర్',
    distanceAway: 'దూరంలో',
    addressLabel: 'చిరునామా',
    step1: '1. అంగీకరించబడింది',
    step2: '2. దారిలో',
    step3: '3. చేరుకున్నాను',
    step4: '4. పని జరుగుతోంది',
    step5: '5. నగదు అందింది',
    onMyWay: 'నేను దారిలో ఉన్నాను',
    arrived: 'చేరుకున్నాను',
    startWork: 'పని ప్రారంభమైంది',
    workFinished: 'పని పూర్తయింది',
    collectCash: 'డబ్బు తీసుకోండి',
    cashReceived: 'డబ్బు అందింది ✅',
    onMyWayAction: '🛵 బయలుదేరినప్పుడు నొక్కండి',
    arrivedAction: '📍 చేరిన తర్వాత నొక్కండి',
    startWorkAction: '⚡ పని ప్రారంభించేటప్పుడు నొక్కండి',
    workFinishedAction: '✅ పని పూర్తయినప్పుడు నొక్కండి',
    cashReceivedAction: '💵 నగదు అందింది - తదుపరి పనికి సిద్ధం',
    callCustomer: 'కస్టమర్‌కు కాల్ చేయండి',
    openMap: 'దారి చూడండి (మ్యాప్)',
    listen: 'వాయిస్ వినండి',
    allJobs: 'అన్ని పనులు',
    unskilled: 'హెల్పర్ / సాధారణ పని',
    skilled: 'నైపుణ్యం కలిగిన మెషీన్ పని',
    testJob: '🔔 డెమో పని చూడండి',
    incomingJob: 'కొత్త పని వచ్చింది!',
    availableTag: 'అందుబాటులో ఉంది',
    nearYourArea: 'మీ ప్రాంతం దగ్గర • అంగీకరించడానికి ఆకుపచ్చ బటన్ నొక్కండి',
    noJobsTitle: 'ప్రస్తుతం కొత్త పనులు లేవు',
    noJobsSubtitle: 'ఆన్‌లైన్‌లో ఉండండి. పని రాగానే ఫోన్‌లో రింగ్ అవుతుంది మరియు వాయిస్ వినిపిస్తుంది.',
    accept: 'పనిని అంగీకరించండి',
    decline: 'వద్దు',
    morning: 'ఉదయం (Morning)',
    afternoon: 'మధ్యాహ్నం (Afternoon)',
    evening: 'సాయంత్రం (Evening)',
    coopProtectionTitle: 'లేబర్ కో-ఆపరేటివ్ రక్షణ',
    coopProtectionSub: '₹2,00,000 ప్రభుత్వ ప్రమాద భీమా (PMSBY) • ఉచిత రక్షణ సామాగ్రి',
    needHelp: '🆘 సూపర్వైజర్ హెల్ప్‌లైన్',
    speakingPromptNewJob: (name, service, amount) =>
      `నమస్కారం! కొత్త పని వచ్చింది. పని: ${service}. కస్టమర్ పేరు ${name}. మొత్తం ${amount} రూపాయలు. అంగీకరించడానికి ఆకుపచ్చ బటన్ నొక్కండి.`,
    speakingAccepted: 'పని అంగీకరించబడింది. కస్టమర్‌కు కాల్ చేయడానికి నీలం బటన్ నొక్కండి.',
    speakingOnTheWay: 'మీరు దారిలో ఉన్నారు. జాగ్రత్తగా వెళ్ళండి.',
    speakingArrived: 'మీరు చేరుకున్నారు.',
    speakingCompleted: (amount) => `పని పూర్తయింది. దయచేసి ${amount} రూపాయలు తీసుకోండి.`
  },
  bn: {
    workerAppTitle: 'শ্রমিক পোর্টাল (Worker App)',
    workerAppSub: 'সহজ শ্রমিক সাথী মোবাইল পোর্টাল',
    switchToCustomer: '🏢 গ্রাহক মোডে যান',
    voiceOn: '🔊 ভয়েস চালু (Voice ON)',
    voiceOff: '🔇 ভয়েস বন্ধ (Voice Mute)',
    workerName: 'রামেশ্বর যাদব (Rameshwar)',
    tradeTag: '🌊 প্রেশার ওয়াশিং ও হেল্পার',
    verifiedBadge: 'সরকারি যাচাইকৃত সদস্য',
    coopId: 'সমবায় আইডি: #COOP-IN-8891 • ৫ বছরের অভিজ্ঞতা',
    readyForWork: 'কাজের জন্য প্রস্তুত (অনলাইন)',
    resting: 'বিশ্রাম (অফলাইন)',
    todayEarnings: 'আজকের আয় (নগদ)',
    directCashTag: 'সরাসরি নগদ / Direct Cash',
    directToYou: '১০০% সম্পূর্ণ টাকা আপনার • কোনো কমিশন কাটা হবে না',
    jobsDone: 'সম্পন্ন কাজ',
    jobsUnit: 'কাজ',
    jobsCompletedBadge: 'চমৎকার কাজ! (Excellent Work)',
    activeJobBadge: 'চলমান কাজ (Active Job)',
    cashWillGet: 'নগদ পাবেন',
    customerLabel: 'গ্রাহক',
    distanceAway: 'দূরে',
    addressLabel: 'ঠিকানা',
    step1: '১. গৃহীত',
    step2: '২. রাস্তায়',
    step3: '৩. পৌঁছেছি',
    step4: '৪. কাজ চলছে',
    step5: '৫. টাকা পেয়েছি',
    onMyWay: 'আমি রাস্তায় আছি',
    arrived: 'পৌঁছে গেছি',
    startWork: 'কাজ শুরু',
    workFinished: 'কাজ শেষ হয়েছে',
    collectCash: 'টাকা নিন',
    cashReceived: 'টাকা পেয়েছি ✅',
    onMyWayAction: '🛵 রওনা দেওয়ার সময় চাপুন',
    arrivedAction: '📍 পৌঁছানোর পর চাপুন',
    startWorkAction: '⚡ কাজ শুরুর সময় চাপুন',
    workFinishedAction: '✅ কাজ শেষ হলে চাপুন',
    cashReceivedAction: '💵 টাকা পেয়েছি - পরবর্তী কাজের জন্য প্রস্তুত',
    callCustomer: 'গ্রাহককে ফোন করুন',
    openMap: 'রাস্তা দেখুন (ম্যাপ)',
    listen: 'শুনে নিন',
    allJobs: 'সব কাজ',
    unskilled: 'হেল্পার / সাধারণ কাজ',
    skilled: 'দক্ষ কাজ / মেশিন',
    testJob: '🔔 ডেমো কাজ দেখুন',
    incomingJob: 'নতুন কাজ এসেছে!',
    availableTag: 'উপলব্ধ',
    nearYourArea: 'আপনার এলাকার কাছে • গ্রহণ করতে সবুজ বোতাম চাপুন',
    noJobsTitle: 'বর্তমানে কোনো কাজ নেই',
    noJobsSubtitle: 'অনলাইনে থাকুন। কাজ এলে ফোনে রিং হবে এবং ভয়েস শোনা যাবে।',
    accept: 'কাজ গ্রহণ করুন',
    decline: 'বাতিল করুন',
    morning: 'সকাল (Morning)',
    afternoon: 'দুপুর (Afternoon)',
    evening: 'সন্ধ্যা (Evening)',
    coopProtectionTitle: 'শ্রমিক সমবায় সুরক্ষা',
    coopProtectionSub: '₹২,০০,০০০ সরকারি দুর্ঘটনা বীমা (PMSBY) • বিনামূল্যে সরঞ্জাম',
    needHelp: '🆘 সুপারভাইজার হেল্পলাইন',
    speakingPromptNewJob: (name, service, amount) =>
      `নমস্কার! নতুন কাজ এসেছে। কাজ: ${service}। গ্রাহক: ${name}। টাকা: ${amount} টাকা নগদ। গ্রহণ করতে সবুজ বোতাম চাপুন।`,
    speakingAccepted: 'কাজ গ্রহণ করা হয়েছে। গ্রাহককে ফোন করতে নীল বোতাম চাপুন।',
    speakingOnTheWay: 'আপনি রাস্তায় আছেন। সাবধানে যান।',
    speakingArrived: 'আপনি পৌঁছে গেছেন।',
    speakingCompleted: (amount) => `কাজ সম্পূর্ণ হয়েছে। গ্রাহকের কাছ থেকে ${amount} টাকা নিন।`
  },
  kn: {
    workerAppTitle: 'ಕಾರ್ಮಿಕರ ಪೋರ್ಟಲ್ (Worker App)',
    workerAppSub: 'ಕಾರ್ಮಿಕರಿಗಾಗಿ ಸರಳ ಮೊಬೈಲ್ ಆಪ್',
    switchToCustomer: '🏢 ಗ್ರಾಹಕರ ವೀಕ್ಷಣೆಗೆ ಬದಲಿಸಿ',
    voiceOn: '🔊 ಧ್ವನಿ ಆನ್ (Voice ON)',
    voiceOff: '🔇 ಧ್ವನಿ ಆಫ್ (Voice Mute)',
    workerName: 'ರಾಮೇಶ್ವರ ಯಾದವ್ (Rameshwar)',
    tradeTag: '🌊 ಪ್ರೆಶರ್ ವಾಷಿಂಗ್ & ಸಹಾಯಕ',
    verifiedBadge: 'ಸರ್ಕಾರಿ ಪರಿಶೀಲಿಸಿದ ಸದಸ್ಯ',
    coopId: 'ಸಹಕಾರ ಸಂಘ ID: #COOP-IN-8891 • 5 ವರ್ಷ ಅನುಭವ',
    readyForWork: 'ಕೆಲಸಕ್ಕೆ ಸಿದ್ಧ (ಆನ್‌ಲೈನ್)',
    resting: 'ವಿಶ್ರಾಂತಿ (ಆಫ್‌ಲೈನ್)',
    todayEarnings: 'ಇಂದಿನ ಸಂಪಾದನೆ (ನಗದು)',
    directCashTag: 'ನೇರ ನಗದು / Direct Cash',
    directToYou: '100% ಪೂರ್ಣ ಹಣ ನಿಮ್ಮದೇ • ಯಾವುದೇ ಕಮಿಷನ್ ಇಲ್ಲ',
    jobsDone: 'ಮುಗಿದ ಕೆಲಸಗಳು',
    jobsUnit: 'ಕೆಲಸ',
    jobsCompletedBadge: 'ಉತ್ತಮ ಕೆಲಸ! (Excellent Work)',
    activeJobBadge: 'ಪ್ರಸ್ತುತ ಕೆಲಸ (Active Job)',
    cashWillGet: 'ನಗದು ಸಿಗಲಿದೆ',
    customerLabel: 'ಗ್ರಾಹಕರು',
    distanceAway: 'ದೂರದಲ್ಲಿ',
    addressLabel: 'ವಿಳಾಸ',
    step1: '1. ಒಪ್ಪಿಕೊಳ್ಳಲಾಗಿದೆ',
    step2: '2. ದಾರಿಯಲ್ಲಿ',
    step3: '3. ತಲುಪಿದೆ',
    step4: '4. ಕೆಲಸ ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    step5: '5. ಹಣ ಸಿಕ್ಕಿದೆ',
    onMyWay: 'ದಾರಿಯಲ್ಲಿದ್ದೇನೆ',
    arrived: 'ತಲುಪಿದ್ದೇನೆ',
    startWork: 'ಕೆಲಸ ಶುರು',
    workFinished: 'ಕೆಲಸ ಮುಗಿದಿದೆ',
    collectCash: 'ಹಣ ಪಡೆದುಕೊಳ್ಳಿ',
    cashReceived: 'ಹಣ ಸಿಕ್ಕಿದೆ ✅',
    onMyWayAction: '🛵 ಹೊರಡುವಾಗ ಒತ್ತಿ',
    arrivedAction: '📍 ತಲುಪಿದಾಗ ಒತ್ತಿ',
    startWorkAction: '⚡ ಕೆಲಸ ಶುರು ಮಾಡಲು ಒತ್ತಿ',
    workFinishedAction: '✅ ಕೆಲಸ ಮುಗಿದಾಗ ಒತ್ತಿ',
    cashReceivedAction: '💵 ಹಣ ಸಿಕ್ಕಿದೆ - ಮುಂದಿನ ಕೆಲಸಕ್ಕೆ ಸಿದ್ಧ',
    callCustomer: 'ಗ್ರಾಹಕರಿಗೆ ಕರೆ ಮಾಡಿ',
    openMap: 'ದಾರಿ ನೋಡಿ (ಮ್ಯಾಪ್)',
    listen: 'ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ',
    allJobs: 'ಎಲ್ಲಾ ಕೆಲಸಗಳು',
    unskilled: 'ಸಹಾಯಕ / ಸುಲಭ ಕೆಲಸ',
    skilled: 'ಕುಶಲ / ಮೆಷಿನ್ ಕೆಲಸ',
    testJob: '🔔 ಡೆಮೊ ಕೆಲಸ ನೋಡಿ',
    incomingJob: 'ಹೊಸ ಕೆಲಸ ಬಂದಿದೆ!',
    availableTag: 'ಲಭ್ಯವಿದೆ',
    nearYourArea: 'ನಿಮ್ಮ ಹತ್ತಿರ • ಒಪ್ಪಿಕೊಳ್ಳಲು ಹಸಿರು ಬಟನ್ ಒತ್ತಿ',
    noJobsTitle: 'ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ಹೊಸ ಕೆಲಸವಿಲ್ಲ',
    noJobsSubtitle: 'ಆನ್‌ಲೈನ್‌ನಲ್ಲಿರಿ. ಕೆಲಸ ಬಂದಾಗ ಫೋನ್ ರಿಂಗ್ ಆಗುತ್ತದೆ ಮತ್ತು ಧ್ವನಿ ಕೇಳಿಸುತ್ತದೆ.',
    accept: 'ಕೆಲಸವನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ',
    decline: 'ಬೇಡ',
    morning: 'ಬೆಳಗ್ಗೆ (Morning)',
    afternoon: 'ಮಧ್ಯಾಹ್ನ (Afternoon)',
    evening: 'ಸಂಜೆ (Evening)',
    coopProtectionTitle: 'ಕಾರ್ಮಿಕ ಸಹಕಾರ ಸಂಘದ ರಕ್ಷಣೆ',
    coopProtectionSub: '₹2,00,000 ಸರ್ಕಾರಿ ಅಪಘಾತ ವಿಮೆ (PMSBY) • ಉಚಿತ ಉಪಕರಣಗಳು',
    needHelp: '🆘 ಮೇಲ್ವಿಚಾರಕರ ಸಹಾಯವಾಣಿ',
    speakingPromptNewJob: (name, service, amount) =>
      `ನಮಸ್ಕಾರ! ಹೊಸ ಕೆಲಸ ಬಂದಿದೆ. ಕೆಲಸ: ${service}. ಗ್ರಾಹಕರು: ${name}. ಹಣ: ${amount} ರೂಪಾಯಿ. ಒಪ್ಪಿಕೊಳ್ಳಲು ಹಸಿರು ಬಟನ್ ಒತ್ತಿ.`,
    speakingAccepted: 'ಕೆಲಸವನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಲಾಗಿದೆ. ಗ್ರಾಹಕರಿಗೆ ಕರೆ ಮಾಡಲು ನೀಲಿ ಬಟನ್ ಒತ್ತಿ.',
    speakingOnTheWay: 'ನೀವು ದಾರಿಯಲ್ಲಿದ್ದೀರಿ. ಜಾಗರೂಕರಾಗಿ ಹೋಗಿ.',
    speakingArrived: 'ನೀವು ತಲುಪಿದ್ದೀರಿ.',
    speakingCompleted: (amount) => `ಕೆಲಸ ಮುಗಿದಿದೆ. ಗ್ರಾಹಕರಿಂದ ${amount} ರೂಪಾಯಿ ಪಡೆದುಕೊಳ್ಳಿ.`
  },
  mr: {
    workerAppTitle: 'कामगार पोर्टल (Worker App)',
    workerAppSub: 'कामगारांसाठी सोपे मोबाईल ॲप',
    switchToCustomer: '🏢 ग्राहक मोडवर जा',
    voiceOn: '🔊 आवाज चालू (Voice ON)',
    voiceOff: '🔇 आवाज बंद (Voice Mute)',
    workerName: 'रामेश्वर यादव (Rameshwar)',
    tradeTag: '🌊 प्रेशर मशीन ऑपरेटर व हेल्पर',
    verifiedBadge: 'सरकारी प्रमाणित सभासद',
    coopId: 'सहकारी संस्था ID: #COOP-IN-8891 • 5 वर्षांचा अनुभव',
    readyForWork: 'कामासाठी तयार (ऑनलाईन)',
    resting: 'विश्रांती (ऑफलाईन)',
    todayEarnings: 'आजची कमाई (रोख)',
    directCashTag: 'थेट रोख / Direct Cash',
    directToYou: '100% पूर्ण पैसे तुमचे • कोणतेही कमिशन नाही',
    jobsDone: 'पूर्ण झालेली कामे',
    jobsUnit: 'कामे',
    jobsCompletedBadge: 'उत्कृष्ट काम! (Excellent Work)',
    activeJobBadge: 'सुरू असलेले काम (Active Job)',
    cashWillGet: 'रोख मिळतील',
    customerLabel: 'ग्राहक',
    distanceAway: 'अंतरावर',
    addressLabel: 'पत्ता',
    step1: '1. स्वीकारले',
    step2: '2. रस्त्यात',
    step3: '3. पोहोचलो',
    step4: '4. काम चालू',
    step5: '5. पैसे मिळाले',
    onMyWay: 'मी रस्त्यात आहे',
    arrived: 'पोहोचलो आहे',
    startWork: 'काम सुरू केले',
    workFinished: 'काम पूर्ण झाले',
    collectCash: 'पैसे घ्या',
    cashReceived: 'पैसे मिळाले ✅',
    onMyWayAction: '🛵 रस्त्यात निघाल्यावर दाबा',
    arrivedAction: '📍 साईटवर पोहोचल्यावर दाबा',
    startWorkAction: '⚡ काम सुरू करताना दाबा',
    workFinishedAction: '✅ काम पूर्ण झाल्यावर दाबा',
    cashReceivedAction: '💵 पैसे मिळाले - पुढील कामासाठी सज्ज',
    callCustomer: 'ग्राहकाला फोन करा',
    openMap: 'रस्ता पहा (नकाशा)',
    listen: 'आवाजात ऐका',
    allJobs: 'सर्व कामे',
    unskilled: 'हेल्पर / साधे काम',
    skilled: 'कुशल काम / मशीन ऑपरेटर',
    testJob: '🔔 नवीन काम डेमो पहा',
    incomingJob: 'नवीन काम आले आहे!',
    availableTag: 'उपलब्ध',
    nearYourArea: 'तुमच्या परिसराजवळ • स्वीकारण्यासाठी हिरवे बटण दाबा',
    noJobsTitle: 'सध्या कोणतेही नवीन काम नाही',
    noJobsSubtitle: 'ड्युटी चालू ठेवा. काम येताच फोनवर रिंग वाजेल आणि आवाजात ऐकू येईल.',
    accept: 'काम स्वीकारा (स्वीकार)',
    decline: 'नकार द्या',
    morning: 'सकाळ (Morning)',
    afternoon: 'दुपार (Afternoon)',
    evening: 'संध्याकाळ (Evening)',
    coopProtectionTitle: 'कामगार सहकारी संस्था सुरक्षा',
    coopProtectionSub: '₹2,00,000 सरकारी अपघात विमा (PMSBY) • मोफत सुरक्षा साधने',
    needHelp: '🆘 सुपरवायझर हेल्पलाइन',
    speakingPromptNewJob: (name, service, amount) =>
      `नमस्कार! नवीन काम आले आहे. काम आहे ${service}. ग्राहक: ${name}. रक्कम: ${amount} रुपये रोख. स्वीकारण्यासाठी हिरवे बटण दाबा.`,
    speakingAccepted: 'काम स्वीकारले आहे. ग्राहकाला कॉल करण्यासाठी निळे बटण दाबा.',
    speakingOnTheWay: 'तुम्ही निघाला आहात. सावधगिरीने जा.',
    speakingArrived: 'तुम्ही पोहोचला आहात.',
    speakingCompleted: (amount) => `काम पूर्ण झाले आहे. कृपया ग्राहकाकडून ${amount} रुपये घ्या.`
  },
  en: {
    workerAppTitle: 'WORKER APP (Worker Companion)',
    workerAppSub: 'Skilled & Unskilled Labor Companion',
    switchToCustomer: '🏢 Switch to Customer View',
    voiceOn: '🔊 Voice Guidance ON',
    voiceOff: '🔇 Voice Guidance OFF',
    workerName: 'Rameshwar Yadav (Verified Pro)',
    tradeTag: '🌊 Pressure Machine Operator & Helper',
    verifiedBadge: 'Govt Verified Member',
    coopId: 'Labour Cooperative ID: #COOP-IN-8891 • 5 Yrs Exp',
    readyForWork: 'READY FOR WORK (ONLINE)',
    resting: 'RESTING / OFF-DUTY',
    todayEarnings: "TODAY'S CASH EARNINGS",
    directCashTag: 'Direct Cash',
    directToYou: '100% Direct Cash to You • Zero Platform Deductions',
    jobsDone: 'Jobs Completed',
    jobsUnit: 'Jobs',
    jobsCompletedBadge: 'Excellent Work! ⭐⭐⭐',
    activeJobBadge: 'Active Job in Progress',
    cashWillGet: 'Direct Cash',
    customerLabel: 'Customer',
    distanceAway: 'Away',
    addressLabel: 'Address',
    step1: '1. Accepted',
    step2: '2. On The Way',
    step3: '3. Arrived',
    step4: '4. Working',
    step5: '5. Cash Paid',
    onMyWay: 'I Am On The Way 🛵',
    arrived: 'Arrived at Location 📍',
    startWork: 'Start Job Now ⚡',
    workFinished: 'Work Finished ✅',
    collectCash: 'Collect Cash / Payment 💵',
    cashReceived: 'Payment Received ✅',
    onMyWayAction: '🛵 Click When Moving',
    arrivedAction: '📍 Click When Reached Site',
    startWorkAction: '⚡ Click to Start Work',
    workFinishedAction: '✅ Click When Done',
    cashReceivedAction: '💵 Payment Received - Ready for Next Work',
    callCustomer: 'Call Customer Directly',
    openMap: 'Open Route / GPS Map',
    listen: 'Listen to Details (Audio)',
    allJobs: 'All Available Work',
    unskilled: 'Unskilled (Helper / Sweeping / Loading)',
    skilled: 'Skilled (Machine / Equipment)',
    testJob: '🔔 Send Test Job Broadcast',
    incomingJob: 'NEW JOB ALERT!',
    availableTag: 'Available',
    nearYourArea: 'Near your area • Tap green button to accept',
    noJobsTitle: 'No Pending Jobs Right Now',
    noJobsSubtitle: 'Keep duty active. When a job arrives nearby, your phone will ring with voice alerts.',
    accept: 'ACCEPT JOB (Green Button)',
    decline: 'Decline Job',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    coopProtectionTitle: 'Labour Cooperative Worker Protection',
    coopProtectionSub: '₹2,00,000 Govt Accident Insurance (PMSBY) • Free Safety Equipment',
    needHelp: '🆘 Call Cooperative Supervisor',
    speakingPromptNewJob: (name, service, amount) =>
      `Hello! You have a new job alert. Service: ${service}. Customer name: ${name}. Earnings: ${amount} rupees cash. Press the big green button to accept.`,
    speakingAccepted: 'Job accepted. Press the blue button to call the customer.',
    speakingOnTheWay: 'You are now on the way to the customer location.',
    speakingArrived: 'You have arrived at the job site.',
    speakingCompleted: (amount) => `Job completed. Please collect ${amount} rupees cash from the customer.`
  }
};

export interface LocalizedJobItem {
  id: string;
  customerPhone: string;
  serviceCategory: 'skilled' | 'unskilled';
  toolIcon: string;
  distanceKm: number;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  earningsCash: number;
  customerName: Record<string, string>;
  serviceTitle: Record<string, string>;
  description: Record<string, string>;
  locationArea: Record<string, string>;
  addressDetail: Record<string, string>;
}

export const SAMPLE_LOCALIZED_JOBS: LocalizedJobItem[] = [
  {
    id: 'job-101',
    customerPhone: '9845012345',
    serviceCategory: 'skilled',
    toolIcon: '🌊',
    distanceKm: 1.2,
    timeSlot: 'morning',
    earningsCash: 650,
    customerName: {
      hi: 'राजेश कुमार (Rajesh Kumar)',
      ta: 'ராஜேஷ் குமார் (Rajesh Kumar)',
      te: 'రాజేష్ కుమార్ (Rajesh Kumar)',
      bn: 'রাজেশ কুমার (Rajesh Kumar)',
      kn: 'ರಾಜೇಶ್ ಕುಮಾರ್ (Rajesh Kumar)',
      mr: 'राजेश कुमार (Rajesh Kumar)',
      en: 'Rajesh Kumar'
    },
    serviceTitle: {
      hi: 'दुकान व दीवार की तेज पानी धुलाई (Pressure Wash)',
      ta: 'கடை மற்றும் வெளிப்புற பிரஷர் வாஷிங் (Pressure Wash)',
      te: 'దుకాణం మరియు గోడల ప్రెషర్ వాషింగ్ (Pressure Wash)',
      bn: 'দোকান ও দেওয়ালের প্রেশার ওয়াশিং (Pressure Wash)',
      kn: 'ಅಂಗಡಿ ಮತ್ತು ಗೋಡೆಯ ಪ್ರೆಶರ್ ವಾಷಿಂಗ್ (Pressure Wash)',
      mr: 'दुकान व भिंतीची हाय-प्रेशर धुलाई (Pressure Wash)',
      en: 'Exterior Commercial Pressure Washing'
    },
    description: {
      hi: 'प्रेशर मशीन से फुटपाथ, दुकान का अगला हिस्सा व दीवार की गहरी धुलाई।',
      ta: 'பிரஷர் மெஷின் மூலம் நடைபாதை, கடையின் முன்புறம் மற்றும் சுவரை சுத்தம் செய்தல்.',
      te: 'ప్రెషర్ మెషీన్‌తో ఫుట్‌పాత్, దుకాణం ముందు భాగం మరియు గోడలను శుభ్రం చేయడం.',
      bn: 'মেশিনের উচ্চ চাপে ফুটপাত ও দেওয়ালের ময়লা গভীর পরিষ্কার।',
      kn: 'ಪ್ರೆಶರ್ ಮೆಷಿನ್ ಮೂಲಕ ಕಾಲುದಾರಿ ಮತ್ತು ಗೋಡೆಯನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ತೊಳೆಯುವುದು.',
      mr: 'प्रेशर मशीनने फुटपाथ आणि दुकानाची दर्शनी भिंत स्वच्छ करणे.',
      en: 'Clean outside shop pavement & storefront wall with pressure machine.'
    },
    locationArea: {
      hi: 'मेन मार्केट, ब्लॉक-बी',
      ta: 'மெயின் மார்க்கெட், பிளாக்-பி',
      te: 'మెయిన్ మార్కెట్, బ్లాక్-బి',
      bn: 'মেইন মার্কেট, ব্লক-বি',
      kn: 'ಮೈನ್ ಮಾರ್ಕೆಟ್, ಬ್ಲಾಕ್-ಬಿ',
      mr: 'मुख्य बाजारपेठ, ब्लॉक-बी',
      en: 'Main Commercial Market / Block B'
    },
    addressDetail: {
      hi: 'दुकान नं. १४, पोस्ट ऑफिस व बस स्टैंड के पास',
      ta: 'கடை எண் 14, தபால் நிலையம் & பேருந்து நிலையம் அருகில்',
      te: 'షాప్ నం. 14, పోస్ట్ ఆఫీస్ & బస్టాండ్ దగ్గర',
      bn: 'দোকান নং ১৪, পোস্ট অফিস ও বাস স্ট্যান্ডের কাছে',
      kn: 'ಶಾಪ್ ನಂ. 14, ಪೋಸ್ಟ್ ಆಫೀಸ್ & ಬಸ್ ನಿಲ್ದಾಣದ ಬಳಿ',
      mr: 'दुकान क्र. १४, पोस्ट ऑफिस आणि बस स्टँडजवळ',
      en: 'Shop 14, Near Post Office & Bus Stand'
    }
  },
  {
    id: 'job-102',
    customerPhone: '9876543210',
    serviceCategory: 'unskilled',
    toolIcon: '🧹',
    distanceKm: 0.8,
    timeSlot: 'afternoon',
    earningsCash: 450,
    customerName: {
      hi: 'सुरेश पटेल (Suresh Patel)',
      ta: 'சுரேஷ் படேல் (Suresh Patel)',
      te: 'సురేష్ పటేల్ (Suresh Patel)',
      bn: 'সুরেশ প্যাটেল (Suresh Patel)',
      kn: 'ಸುರೇಶ್ ಪಟೇಲ್ (Suresh Patel)',
      mr: 'सुरेश पटेल (Suresh Patel)',
      en: 'Suresh Patel'
    },
    serviceTitle: {
      hi: 'झाड़ू सफाई व परिसर हेल्पर कार्य',
      ta: 'துப்புரவு & வளாக உதவியாளர் வேலை',
      te: 'స్వీపింగ్ & ప్రాంగణ హెల్పర్ పని',
      bn: 'ঝাড়ু দেওয়া ও চত্বর পরিষ্কার হেল্পার কাজ',
      kn: 'ಕಸ ಗುಡಿಸುವುದು & ಆವರಣ ಸಹಾಯಕ ಕೆಲಸ',
      mr: 'झाडू मारणे व परिसर मदतनीस काम',
      en: 'Helper & Driveway Sweeping'
    },
    description: {
      hi: 'सोसायटी में सूखे पत्ते उठाना, रास्ता झाड़ना व कचरा डंप में डालना।',
      ta: 'வளாகத்தில் காய்ந்த இலைகளை அகற்றுதல், சாலையை பெருக்குதல் மற்றும் குப்பை கொட்டுதல்.',
      te: 'ఆకులు తొలగించడం, రోడ్డు ఊడ్చడం మరియు చెత్త డంప్‌లో వేయడం.',
      bn: 'বাগানের পাতা পরিষ্কার, রাস্তা ঝাড়ু দেওয়া ও ময়লা ফেলা।',
      kn: 'ರಸ್ತೆ ಗುಡಿಸುವುದು, ಒಣ ಎಲೆಗಳನ್ನು ತೆಗೆಯುವುದು ಮತ್ತು ಕಸ ವಿಲೇವಾರಿ.',
      mr: 'परिसरातील कचरा गोळा करणे व रस्ता स्वच्छ झाडणे.',
      en: 'Clean garden leaves, sweep building driveways & trash.'
    },
    locationArea: {
      hi: 'ग्रीन वैली रेजिडेंशियल सोसायटी',
      ta: 'கிரீன் வேலி குடியிருப்பு வளாகம்',
      te: 'గ్రీన్ వ్యాలీ రెసిడెన్షియల్ సొసైటీ',
      bn: 'গ্রিন ভ্যালি আবাসিক এলাকা',
      kn: 'ಗ್ರೀನ್ ವ್ಯಾಲಿ ವಸತಿ ಸಮುಚ್ಚಯ',
      mr: 'ग्रीन व्हॅली गृहनिर्माण संस्था',
      en: 'Green Valley Residential Society'
    },
    addressDetail: {
      hi: 'मकान ४२, ग्रीन वैली गेट नं. २',
      ta: 'வீடு 42, கிரீன் வேலி கேட் எண் 2',
      te: 'ఇల్లు 42, గ్రీన్ వ్యాలీ గేట్ నం. 2',
      bn: 'বাড়ি ৪২, গ্রিন ভ্যালি গেট ২',
      kn: 'ಮನೆ 42, ಗ್ರೀನ್ ವ್ಯಾಲಿ ಗೇಟ್ 2',
      mr: 'घर क्र. ४२, ग्रीन व्हॅली सोसायटी गेट २',
      en: 'House 42, Green Valley Society Gate 2'
    }
  }
];

export const SIMULATION_LOCALIZED_JOBS: LocalizedJobItem[] = [
  {
    id: 'sim-1',
    customerPhone: '9812345678',
    serviceCategory: 'skilled',
    toolIcon: '🚚',
    distanceKm: 1.5,
    timeSlot: 'morning',
    earningsCash: 700,
    customerName: {
      hi: 'कविता शर्मा (Kavita Sharma)',
      ta: 'கவிதா சர்மா (Kavita Sharma)',
      te: 'కవితా శర్మ (Kavita Sharma)',
      bn: 'কবিতা শর্মা (Kavita Sharma)',
      kn: 'ಕವಿತಾ ಶರ್ಮಾ (Kavita Sharma)',
      mr: 'कविता शर्मा (Kavita Sharma)',
      en: 'Kavita Sharma'
    },
    serviceTitle: {
      hi: 'वाहन व पिकअप ट्रक धुलाई (Pressure Rinse)',
      ta: 'வாகனம் மற்றும் டிரக் வாஷிங் (Vehicle Wash)',
      te: 'వాహనం మరియు ట్రక్ వాషింగ్ (Vehicle Wash)',
      bn: 'গাড়ি ও ট্রাক ওয়াশিং (Vehicle Wash)',
      kn: 'ವಾಹನ & ಟ್ರಕ್ ವಾಷಿಂಗ್ (Vehicle Wash)',
      mr: 'गाडी व ट्रक हाय-प्रेशर वॉश',
      en: 'Vehicle & Truck Power Washing'
    },
    description: {
      hi: 'व्यावसायिक वैन की बाहरी प्रेशर धुलाई व टायर सफाई।',
      ta: 'வணிக வாகனத்தின் வெளிப்புற பிரஷர் வாஷிங் & டயர் சுத்தம்.',
      te: 'వాణిజ్య వ్యాన్ బాహ్య ప్రెషర్ వాష్ మరియు టైర్ల క్లీనింగ్.',
      bn: 'কমার্শিয়াল ভ্যানের বাইরের প্রেশার ওয়াশ ও চাকা পরিষ্কার।',
      kn: 'ವಾಣಿಜ್ಯ ವ್ಯಾನ್‌ನ ಹೊರಭಾಗದ ಪ್ರೆಶರ್ ವಾಶ್ ಮತ್ತು ಟೈರ್ ಸ್ವಚ್ಛತೆ.',
      mr: 'कमर्शियल व्हॅनची बाहेरील प्रेशर वॉश व टायर स्वच्छता.',
      en: 'Commercial van exterior power wash & wheel rinse.'
    },
    locationArea: {
      hi: 'ट्रांसपोर्ट नगर / बाईपास रोड',
      ta: 'டிரான்ஸ்போர்ட் நகர் / பைபாஸ் சாலை',
      te: 'ట్రాన్స్‌పోర్ట్ నగర్ / బైపాస్ రోడ్డు',
      bn: 'ট্রান্সপোর্ট নগর / বাইপাস রোড',
      kn: 'ಟ್ರಾನ್ಸ್‌ಪೋರ್ಟ್ ನಗರ / ಬೈಪಾಸ್ ರಸ್ತೆ',
      mr: 'ट्रान्सपोर्ट नगर / बायपास रोड',
      en: 'Truck Depot / Bypass Road'
    },
    addressDetail: {
      hi: 'हाईवे सर्विस पॉइंट, गेट ३',
      ta: 'ஹைவே சர்வீஸ் பாயிண்ட், கேட் 3',
      te: 'హైవే సర్వీస్ పాయింట్, గేట్ 3',
      bn: 'হাইওয়ে সার্ভিস পয়েন্ট, গেট ৩',
      kn: 'ಹೆದ್ದಾರಿ ಸರ್ವಿಸ್ ಪಾಯಿಂಟ್, ಗೇಟ್ 3',
      mr: 'हायवे सर्व्हिस पॉईंट, गेट ३',
      en: 'Highway Service Point, Gate 3'
    }
  },
  {
    id: 'sim-2',
    customerPhone: '9822334455',
    serviceCategory: 'unskilled',
    toolIcon: '📦',
    distanceKm: 0.5,
    timeSlot: 'afternoon',
    earningsCash: 500,
    customerName: {
      hi: 'मोहन लाल (Mohan Lal)',
      ta: 'மோகன் லால் (Mohan Lal)',
      te: 'మోహన్ లాల్ (Mohan Lal)',
      bn: 'মোহন লাল (Mohan Lal)',
      kn: 'ಮೋಹನ್ ಲಾಲ್ (Mohan Lal)',
      mr: 'मोहन लाल (Mohan Lal)',
      en: 'Mohan Lal'
    },
    serviceTitle: {
      hi: 'सामग्री उठाना व कचरा लोडिंग (Helper Work)',
      ta: 'பொருட்கள் ஏற்றுதல் & குப்பை அகற்றுதல்',
      te: 'సామాను ఎత్తడం & చెత్త లోడింగ్',
      bn: 'মালামাল বহন ও আবর্জনা লোডিং',
      kn: 'ಸಾಮಾನು ಹೊರುವುದು & ಕಸ ಲೋಡಿಂಗ್',
      mr: 'साहित्य उचलणे व कचरा लोडिंग काम',
      en: 'Site Debris & Material Loading'
    },
    description: {
      hi: 'निर्माण स्थल से मलबा हटाना व ईंटें एक जगह से दूसरी जगह ले जाना।',
      ta: 'கட்டுமான கழிவுகளை அகற்றுதல் மற்றும் செங்கற்களை சுமந்து செல்லுதல்.',
      te: 'నిర్మాణ వ్యర్థాలను తొలగించడం మరియు ఇటుకలను మోయడం.',
      bn: 'নির্মাণ ধ্বংসাবশেষ সরানো এবং ইট স্থানান্তর করা।',
      kn: 'ನಿರ್ಮಾಣ ತ್ಯಾಜ್ಯವನ್ನು ತೆಗೆಯುವುದು ಮತ್ತು ಇಟ್ಟಿಗೆಗಳನ್ನು ಸಾಗಿಸುವುದು.',
      mr: 'बांधकाम कचरा हलवणे आणि विटांची ने-आण करणे.',
      en: 'Move construction rubble, carry bricks & bucket water.'
    },
    locationArea: {
      hi: 'सिविल कंस्ट्रक्शन साइट, सेक्टर ४',
      ta: 'கட்டுமான தளம், செக்டார் 4',
      te: 'నిర్మాణ స్థలం, సెక్టార్ 4',
      bn: 'নির্মাণ এলাকা, সেক্টর ৪',
      kn: 'ನಿರ್ಮಾಣ ಪ್ರದೇಶ, ಸೆಕ್ಟರ್ 4',
      mr: 'बांधकाम साईट, सेक्टर ४',
      en: 'Civil Construction Site, Sector 4'
    },
    addressDetail: {
      hi: 'प्लॉट ८८, पानी की टंकी के सामने',
      ta: 'பிளாட் 88, தண்ணீர் தொட்டிக்கு எதிரில்',
      te: 'ప్లాట్ 88, వాటర్ ట్యాంక్ దగ్గర',
      bn: 'প্লট ৮৮, জলের ট্যাঙ্কের সামনে',
      kn: 'ಪ್ಲಾಟ್ 88, ನೀರಿನ ಟ್ಯಾಂಕ್ ಎದುರು',
      mr: 'प्लॉट ८८, पाण्याच्या टाकीसमोर',
      en: 'Plot 88, Near Water Tank'
    }
  }
];
