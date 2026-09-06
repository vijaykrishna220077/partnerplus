import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageCode, Booking } from '../types';
import { soundAndSpeech } from '../utils/soundAndSpeech';
import { 
  WorkerJobOpening, 
  INITIAL_WORKER_JOBS, 
  INITIAL_WORKER_EARNINGS_HISTORY,
  INITIAL_COOPERATIVE_TRAININGS,
  WorkerEarningRecord,
  TrainingCourse
} from '../data/workerJobData';
import { 
  StructuredWorkerProfile, 
  WorkerSkillRecord, 
  WorkerJobEligibilityResult 
} from '../types/workerSkillRegistry';
import { STRUCTURED_WORKER_PROFILES } from '../data/structuredWorkersData';
import { workerEligibilityService } from '../services/workerEligibilityService';
import { cooperativeBackendService } from '../services/cooperativeBackendService';
import { WorkerHeader } from './worker/WorkerHeader';
import { WorkerBottomNav, WorkerNavTab } from './worker/WorkerBottomNav';
import { WorkerHomeTab } from './worker/WorkerHomeTab';
import { WorkerMyJobsTab } from './worker/WorkerMyJobsTab';
import { WorkerEarningsTab } from './worker/WorkerEarningsTab';
import { WorkerWelfareTab } from './worker/WorkerWelfareTab';
import { WorkerProfileTab } from './worker/WorkerProfileTab';
import { WorkerJobDetailModal } from './worker/WorkerJobDetailModal';
import { WorkerActiveJobScreen, ActiveStepStatus } from './worker/WorkerActiveJobScreen';
import { WorkerQrScannerModal } from './worker/WorkerQrScannerModal';
import { WorkerReportProblemModal } from './worker/WorkerReportProblemModal';
import { WorkerSimpleModeView } from './worker/WorkerSimpleModeView';
import { WorkerDemoDrawer } from './worker/WorkerDemoDrawer';
import { NewJobAlertModal, JobAlertData } from './NewJobAlertModal';
import { JobChatModal } from './chat/JobChatModal';
import { LocationPickerModal } from './LocationPickerModal';
import { chatService } from '../services/chatService';

interface RuralWorkerPortalProps {
  onSwitchToCustomer: () => void;
}

export const RuralWorkerPortal: React.FC<RuralWorkerPortalProps> = ({ onSwitchToCustomer }) => {
  const { 
    lang, 
    setLang, 
    toggleSidebar, 
    openChat, 
    closeChat, 
    activeChatBooking, 
    activeChatRole, 
    bookings 
  } = useApp();

  // Navigation and view states
  const [activeTab, setActiveTab] = useState<WorkerNavTab>('home');
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isEmergencyReady, setIsEmergencyReady] = useState<boolean>(true);

  // Cooperative Worker Persona State (Structured profile with skill registry)
  const [activeWorker, setActiveWorker] = useState<StructuredWorkerProfile>(STRUCTURED_WORKER_PROFILES[0]);

  // Data states
  const [jobs, setJobs] = useState<WorkerJobOpening[]>(INITIAL_WORKER_JOBS);
  const [completedJobs, setCompletedJobs] = useState<WorkerEarningRecord[]>(INITIAL_WORKER_EARNINGS_HISTORY);
  const [trainings, setTrainings] = useState<TrainingCourse[]>(INITIAL_COOPERATIVE_TRAININGS);
  const [dailyEarnings, setDailyEarnings] = useState<number>(1450);
  const [completedCount, setCompletedCount] = useState<number>(3);

  // Active Job Workflow
  const [activeJob, setActiveJob] = useState<WorkerJobOpening | null>(null);
  const [activeJobStep, setActiveJobStep] = useState<ActiveStepStatus>('accepted');
  const [isViewingActiveJobScreen, setIsViewingActiveJobScreen] = useState<boolean>(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [unreadWorkerChatCount, setUnreadWorkerChatCount] = useState<number>(() => chatService.getTotalUnreadCount('worker'));

  useEffect(() => {
    const updateUnread = () => {
      setUnreadWorkerChatCount(chatService.getTotalUnreadCount('worker'));
    };
    const unsub = chatService.subscribe('all', updateUnread);
    const interval = setInterval(updateUnread, 3000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  // Synchronize online status & emergency readiness with activeWorker
  useEffect(() => {
    setActiveWorker((prev) => ({
      ...prev,
      availability_status: isOnline ? 'available' : 'offline',
      emergency_available: isEmergencyReady
    }));
  }, [isOnline, isEmergencyReady]);

  // Dynamic 10-step eligibility calculation for all current jobs
  const eligibilityMap = React.useMemo(() => {
    const map = new Map<string, WorkerJobEligibilityResult>();
    jobs.forEach((job) => {
      const res = workerEligibilityService.evaluateWorkerEligibility(
        activeWorker,
        job,
        !!activeJob
      );
      map.set(job.id, res);
    });
    return map;
  }, [jobs, activeWorker, activeJob]);

  // Jobs that match this worker's trade, skills, and tier
  const eligibleJobs = React.useMemo(() => {
    return jobs.filter((job) => {
      const res = eligibilityMap.get(job.id);
      return res ? res.eligible : false;
    });
  }, [jobs, eligibilityMap]);

  // Modals
  const [selectedJobDetail, setSelectedJobDetail] = useState<WorkerJobOpening | null>(null);
  const [isReportProblemOpen, setIsReportProblemOpen] = useState<boolean>(false);
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertJobData, setAlertJobData] = useState<JobAlertData | null>(null);

  const selectedLang = lang || 'en';

  // Speak helper
  const speakText = (text: string) => {
    if (isAudioEnabled) {
      soundAndSpeech.speak(text, selectedLang);
    }
  };

  // Switch Worker Persona
  const handleSwitchWorker = (workerProfile: StructuredWorkerProfile) => {
    setActiveWorker(workerProfile);
    setIsEmergencyReady(workerProfile.emergency_available);
    soundAndSpeech.playChime('toggle');
    speakText(`${workerProfile.name} profile active. ${workerProfile.primary_skill_label}.`);
  };

  // Update registered skills
  const handleUpdateWorkerSkills = (updatedSkills: WorkerSkillRecord[]) => {
    setActiveWorker((prev) => ({
      ...prev,
      skills: updatedSkills
    }));
    soundAndSpeech.playChime('complete');
  };

  // Toggle online duty
  const handleToggleDuty = () => {
    const next = !isOnline;
    setIsOnline(next);
    soundAndSpeech.playChime('toggle');
    if (next) {
      speakText('Aap online hain. Naye kaam ki call aane par ghanti bajegi.');
    } else {
      speakText('Aap offline hain. Naye kaam pause kar diye gaye hain.');
    }
  };

  // Toggle emergency readiness
  const handleToggleEmergency = () => {
    setIsEmergencyReady(!isEmergencyReady);
    soundAndSpeech.playChime('toggle');
  };

  // Accept job with backend validation & atomic multi-worker assignment
  const handleAcceptJob = async (job: WorkerJobOpening) => {
    const result = await cooperativeBackendService.processJobAcceptance(activeWorker, job);
    if (!result.success) {
      soundAndSpeech.playChime('alert');
      speakText(result.message);
      alert(result.message);
      return;
    }

    soundAndSpeech.playChime('accept');
    setActiveJob(job);
    setActiveJobStep('accepted');
    setIsViewingActiveJobScreen(true);

    if (result.updatedJob && result.updatedJob.status === 'open') {
      // Multi-worker job still requires more workers
      setJobs((prev) => prev.map((j) => (j.id === job.id ? result.updatedJob! : j)));
    } else {
      // Single worker job or final worker slot filled
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    }

    speakText(`Kaam swikar kar liya gaya hai. ${job.specificTask}. Aapko milenge ₹${job.workerExpectedEarning}.`);
  };

  // Listen to job readout in local language
  const handleListenJob = (job: WorkerJobOpening) => {
    soundAndSpeech.playChime('click');
    const spoken = `${job.serviceName}. ${job.specificTask}. Jagah hai ${job.serviceArea}. Doori hai lagbhag ${job.distanceKm} kilometer. Aapki kamai hogi ₹${job.workerExpectedEarning}. Kaam lene ke liye hara button dabayein.`;
    speakText(spoken);
  };

  // Advance active job 5-step progression
  const handleAdvanceActiveJobStep = () => {
    if (!activeJob) return;

    if (activeJobStep === 'accepted') {
      soundAndSpeech.playChime('click');
      setActiveJobStep('on_the_way');
      speakText('Aap nikal chuke hain. Customer ko suchna bhej di gayi hai.');
    } else if (activeJobStep === 'on_the_way') {
      soundAndSpeech.playChime('click');
      setActiveJobStep('arrived');
      speakText('Aap pahuche gaye hain. Kaam shuru karne ke liye button dabayein.');
    } else if (activeJobStep === 'arrived') {
      soundAndSpeech.playChime('click');
      setActiveJobStep('in_progress');
      speakText('Kaam shuru ho chuka hai. Poora hone par Work Completed dabayein.');
    } else if (activeJobStep === 'in_progress') {
      soundAndSpeech.playChime('complete');
      setActiveJobStep('completed');
      speakText(`Kaam poora ho gaya hai. Customer se ₹${activeJob.workerExpectedEarning} cash ya UPI lene ke baad confirm karein.`);
    } else if (activeJobStep === 'completed') {
      soundAndSpeech.playChime('complete');
      // Finalize and add to history
      const newRecord: WorkerEarningRecord = {
        id: `earn-${Date.now()}`,
        taskTitle: activeJob.specificTask,
        serviceCategory: activeJob.serviceCategory,
        date: 'Today',
        customerArea: activeJob.serviceArea.split(',')[0],
        amountEarned: activeJob.workerExpectedEarning,
        customerPaid: activeJob.customerPrice,
        welfareDeducted: activeJob.cooperativeContribution,
        status: 'paid',
        paymentMode: 'Cash on Delivery',
        completedAt: 'Just now'
      };
      setCompletedJobs((prev) => [newRecord, ...prev]);
      setDailyEarnings((prev) => prev + activeJob.workerExpectedEarning);
      setCompletedCount((prev) => prev + 1);
      setActiveJob(null);
      setIsViewingActiveJobScreen(false);
      setActiveTab('earnings');
      speakText(`Badhaai ho! ₹${activeJob.workerExpectedEarning} aapke khate mein jud gaye hain.`);
    }
  };

  // Call customer with phone mask
  const handleCallCustomer = () => {
    soundAndSpeech.playChime('click');
    if (activeJob) {
      window.open(`tel:${activeJob.customerPhone}`, '_self');
    }
  };

  // Open Google Maps directions
  const handleGetDirections = () => {
    soundAndSpeech.playChime('click');
    if (activeJob) {
      const query = encodeURIComponent(`${activeJob.customerAddress}, Coimbatore`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  // Open real-time chat with customer
  const handleOpenChatWithCustomer = () => {
    soundAndSpeech.playChime('click');
    if (activeJob) {
      const matching = bookings.find((b) => b.id === activeJob.id) || ({
        id: activeJob.id,
        bookingCode: activeJob.id.toUpperCase(),
        serviceId: activeJob.serviceCategory,
        serviceName: activeJob.serviceName,
        workerId: activeWorker.id,
        workerName: activeWorker.name,
        workerPhone: activeWorker.phone,
        workerPhoto: activeWorker.avatar,
        customerId: 'cust-1',
        customerName: activeJob.customerName,
        customerPhone: activeJob.customerPhone,
        cooperativeId: activeWorker.cooperative_id,
        cooperativeName: activeWorker.cooperative_name,
        status: 'in_progress',
        isEmergency: activeJob.urgency === 'emergency',
        scheduledDate: activeJob.scheduledDate,
        scheduledTime: activeJob.startTime,
        address: {
          street: activeJob.customerAddress,
          area: activeJob.serviceArea,
          city: 'Coimbatore',
          pincode: '641004'
        },
        pricing: {
          baseRate: activeJob.customerPrice,
          tax: 0,
          workerPayout: activeJob.workerExpectedEarning,
          cooperativeFee: activeJob.cooperativeContribution,
          totalAmount: activeJob.customerPrice
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any);

      openChat(matching, 'worker');
      return;
    }

    const fallbackBooking = bookings.find((b) => !['service_completed', 'cancelled', 'rejected'].includes(b.status)) || bookings[0];
    if (fallbackBooking) {
      openChat(fallbackBooking, 'worker');
    }
  };

  // Toggle training enrollment
  const handleToggleTraining = (courseId: string) => {
    soundAndSpeech.playChime('click');
    setTrainings((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolled: !c.enrolled } : c))
    );
  };

  // Simulation controls for SIH judges
  const handleSimulateIncomingJob = (type: 'emergency' | 'multi_worker' | 'skilled' | 'general') => {
    soundAndSpeech.playChime('alert');
    let simulated: WorkerJobOpening;

    if (type === 'emergency') {
      simulated = {
        id: `job-sim-emg-${Date.now()}`,
        serviceCategory: 'electrical',
        serviceName: 'Emergency Electrical',
        specificTask: 'Main Power Sparking & Fuse Blown',
        workerTier: 'skilled',
        workerTierLabel: 'Skilled Work',
        requiredSkills: ['Main Fuse Check', 'Spark Isolation'],
        toolsRequired: 'Tester & heavy pliers',
        materialsProvided: 'Replacement fuse wire on site',
        experienceRequired: '2+ years electrical',
        customerName: 'Suresh Kumar (Verified)',
        customerPhone: '9845012345',
        isCustomerVerified: true,
        serviceArea: 'Gandhipuram, Coimbatore',
        distanceKm: 0.9,
        scheduledDate: 'Today',
        startTime: 'Available Now (Emergency)',
        estimatedDuration: '30 mins',
        urgency: 'emergency',
        customerPrice: 650,
        workerExpectedEarning: 580,
        cooperativeContribution: 70,
        workersRequired: 1,
        workersAssigned: 0,
        description: 'Urgent sparks from main distribution board after rain. Need immediate assistance.',
        customerAddress: 'House 14, 2nd Cross, Gandhipuram',
        matchReasons: ['Emergency job matched in under 1 km', 'Priority wage rate'],
        expiresInMinutes: 5,
        tradeIcon: '⚡',
        status: 'open',
        createdAt: 'Just now'
      };
    } else if (type === 'multi_worker') {
      simulated = {
        id: `job-sim-multi-${Date.now()}`,
        serviceCategory: 'moving',
        serviceName: 'House Shifting',
        specificTask: 'Furniture Shifting & Loading Team',
        workerTier: 'general',
        workerTierLabel: 'General Labour',
        requiredSkills: ['Heavy Lifting', 'Safe Loading'],
        toolsRequired: 'None (Co-op provided straps)',
        materialsProvided: 'Boxes and tempo arranged',
        experienceRequired: 'Physical fitness',
        customerName: 'Anand & Family',
        customerPhone: '9443219988',
        isCustomerVerified: true,
        serviceArea: 'RS Puram, Coimbatore',
        distanceKm: 2.1,
        scheduledDate: 'Today',
        startTime: '2:00 PM',
        estimatedDuration: '4 hours',
        urgency: 'normal',
        customerPrice: 850,
        workerExpectedEarning: 750,
        cooperativeContribution: 100,
        workersRequired: 3,
        workersAssigned: 1,
        foodProvided: true,
        travelSupportAmount: 50,
        description: '3 workers shifting 2BHK furniture to tempo. Lunch provided.',
        customerAddress: 'Apt 4B, Palm Grove, RS Puram',
        matchReasons: ['Multi-worker team with co-op peers', 'Lunch and travel included'],
        tradeIcon: '📦',
        status: 'open',
        createdAt: 'Just now'
      };
    } else if (type === 'general') {
      simulated = {
        id: `job-sim-gen-${Date.now()}`,
        serviceCategory: 'cleaning',
        serviceName: 'General Work',
        specificTask: 'Garden Grass Clearance & Waste Bagging',
        workerTier: 'general',
        workerTierLabel: 'General Labour',
        requiredSkills: ['Grass Cutting', 'Bagging Waste'],
        toolsRequired: 'Gloves & Sickle',
        materialsProvided: 'Waste bags available on site',
        experienceRequired: 'General fitness',
        customerName: 'Dr. Subramanian',
        customerPhone: '9789123456',
        isCustomerVerified: true,
        serviceArea: 'Race Course, Coimbatore',
        distanceKm: 1.8,
        scheduledDate: 'Today',
        startTime: '4:00 PM',
        estimatedDuration: '2 hours',
        urgency: 'normal',
        customerPrice: 500,
        workerExpectedEarning: 450,
        cooperativeContribution: 50,
        workersRequired: 1,
        workersAssigned: 0,
        description: 'Clearing weeds along boundary wall and packing into municipal compost sacks.',
        customerAddress: 'Plot 22, Race Course Road',
        matchReasons: ['Nearby evening shift', 'Direct cash payout'],
        tradeIcon: '🌱',
        status: 'open',
        createdAt: 'Just now'
      };
    } else {
      simulated = {
        id: `job-sim-plumb-${Date.now()}`,
        serviceCategory: 'plumbing',
        serviceName: 'Plumbing',
        specificTask: 'Bathroom Flush Valve Replacement',
        workerTier: 'skilled',
        workerTierLabel: 'Skilled Work',
        requiredSkills: ['Flush Valve Fix', 'Pipe Sealing'],
        toolsRequired: 'Plumbing wrench set',
        materialsProvided: 'New valve kit ready',
        experienceRequired: '1+ year plumbing',
        customerName: 'Vasanth Raman',
        customerPhone: '9840112233',
        isCustomerVerified: true,
        serviceArea: 'Peelamedu, Coimbatore',
        distanceKm: 1.4,
        scheduledDate: 'Today',
        startTime: 'Available Now',
        estimatedDuration: '40 mins',
        urgency: 'normal',
        customerPrice: 520,
        workerExpectedEarning: 460,
        cooperativeContribution: 60,
        workersRequired: 1,
        workersAssigned: 0,
        description: 'Concealed flush valve leaking continuously into commode. Tools needed from worker.',
        customerAddress: 'Flat 101, Lakeview Residency, Peelamedu',
        matchReasons: ['Verified plumbing trade match', 'Close distance (1.4 km)'],
        tradeIcon: '🔧',
        status: 'open',
        createdAt: 'Just now'
      };
    }

    setJobs((prev) => [simulated, ...prev]);

    // Also pop the instant Delivery-Partner Style Swipe Alert Modal
    const alertData: JobAlertData = {
      id: simulated.id,
      title: simulated.specificTask,
      titleHi: simulated.specificTask,
      category: simulated.workerTierLabel,
      tradeIcon: simulated.tradeIcon,
      earnings: simulated.workerExpectedEarning,
      earningsTag: 'Direct Cash (सीधा नकद)',
      distanceKm: simulated.distanceKm,
      estimatedDurationMins: 45,
      travelDurationMins: Math.max(3, Math.round(simulated.distanceKm * 4)),
      customerName: simulated.customerName,
      customerPhone: simulated.customerPhone,
      customerRating: 4.9,
      locationArea: simulated.serviceArea,
      fullAddress: simulated.customerAddress,
      description: simulated.description,
      specialInstructions: '100% Direct Member Earnings • Cooperative Insured',
      equipmentProvided: true
    };
    setAlertJobData(alertData);
    setIsAlertModalOpen(true);
  };

  // Simulate active job complete & payout
  const handleSimulateJobComplete = () => {
    if (activeJob) {
      handleAdvanceActiveJobStep();
    } else if (jobs.length > 0) {
      handleAcceptJob(jobs[0]);
    }
  };

  // Reset demo data
  const handleResetDemoData = () => {
    setJobs(INITIAL_WORKER_JOBS);
    setCompletedJobs(INITIAL_WORKER_EARNINGS_HISTORY);
    setActiveJob(null);
    setIsViewingActiveJobScreen(false);
    setDailyEarnings(1450);
    setCompletedCount(3);
  };

  // Upcoming scheduled jobs
  const upcomingJobs = jobs.filter((j) => j.scheduledDate.toLowerCase().includes('tomorrow'));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-28">
      {/* 1. TOP HEADER BAR */}
      <WorkerHeader
        workerName={activeWorker.name}
        coopId={activeWorker.coop_id}
        isOnline={isOnline}
        isEmergencyReady={isEmergencyReady}
        isSimpleMode={isSimpleMode}
        isAudioEnabled={isAudioEnabled}
        selectedLang={selectedLang}
        onToggleDuty={handleToggleDuty}
        onToggleEmergency={handleToggleEmergency}
        onToggleSimpleMode={() => setIsSimpleMode(!isSimpleMode)}
        onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
        onChangeLanguage={(code) => setLang(code)}
        onToggleSidebar={toggleSidebar}
        onSwitchToCustomer={onSwitchToCustomer}
        onOpenDemoDrawer={() => setIsDemoDrawerOpen(true)}
        onOpenChat={handleOpenChatWithCustomer}
        unreadChatCount={unreadWorkerChatCount}
      />

      {/* 2. MAIN VIEW BODY */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
        {/* Simple Mode (Low-Literacy Mode) */}
        {isSimpleMode ? (
          <WorkerSimpleModeView
            jobs={eligibleJobs}
            isOnline={isOnline}
            onAcceptJob={handleAcceptJob}
            onListen={handleListenJob}
            onToggleDuty={handleToggleDuty}
            onExitSimpleMode={() => setIsSimpleMode(false)}
          />
        ) : isViewingActiveJobScreen && activeJob ? (
          /* Active Job Screen (5-Step Progression) */
          <div className="space-y-4">
            <button
              onClick={() => setIsViewingActiveJobScreen(false)}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              ← Back to Jobs Dashboard
            </button>
            <WorkerActiveJobScreen
              job={activeJob}
              status={activeJobStep}
              onAdvanceStatus={handleAdvanceActiveJobStep}
              onCallCustomer={handleCallCustomer}
              onGetDirections={handleGetDirections}
              onListenInstructions={() => speakText(activeJob.description)}
              onReportProblem={() => setIsReportProblemOpen(true)}
              onOpenQrScanner={() => setIsQrScannerOpen(true)}
              onOpenChat={handleOpenChatWithCustomer}
            />
          </div>
        ) : (
          /* 5 Bottom Nav Tab Views */
          <div>
            {activeTab === 'home' && (
              <WorkerHomeTab
                jobs={eligibleJobs}
                activeWorker={activeWorker}
                eligibilityMap={eligibilityMap}
                onSwitchWorker={handleSwitchWorker}
                isOnline={isOnline}
                isEmergencyReady={isEmergencyReady}
                dailyEarnings={dailyEarnings}
                completedCount={completedCount}
                activeJob={activeJob}
                onViewJob={(job) => setSelectedJobDetail(job)}
                onAcceptJob={handleAcceptJob}
                onListenJob={handleListenJob}
                onOpenActiveJob={() => setIsViewingActiveJobScreen(true)}
                onGoToEarnings={() => setActiveTab('earnings')}
                onToggleDuty={handleToggleDuty}
              />
            )}

            {activeTab === 'my_jobs' && (
              <WorkerMyJobsTab
                activeJob={activeJob}
                completedJobs={completedJobs}
                upcomingJobs={upcomingJobs}
                onOpenActiveJob={() => setIsViewingActiveJobScreen(true)}
                onViewJobDetail={(job) => setSelectedJobDetail(job)}
              />
            )}

            {activeTab === 'earnings' && (
              <WorkerEarningsTab
                records={completedJobs}
                dailyTotal={dailyEarnings}
              />
            )}

            {activeTab === 'welfare' && (
              <WorkerWelfareTab
                trainings={trainings}
                onToggleTraining={handleToggleTraining}
              />
            )}

            {activeTab === 'profile' && (
              <WorkerProfileTab
                workerName={activeWorker.name}
                coopId={activeWorker.coop_id}
                worker={activeWorker}
                onSwitchWorker={handleSwitchWorker}
                onUpdateWorkerSkills={handleUpdateWorkerSkills}
                isSimpleMode={isSimpleMode}
                isAudioEnabled={isAudioEnabled}
                selectedLang={selectedLang}
                isEmergencyReady={isEmergencyReady}
                onToggleSimpleMode={() => setIsSimpleMode(!isSimpleMode)}
                onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
                onToggleEmergency={handleToggleEmergency}
                onChangeLanguage={(code) => setLang(code)}
                onOpenReportProblem={() => setIsReportProblemOpen(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* 3. BOTTOM NAVIGATION BAR */}
      {!isSimpleMode && (
        <WorkerBottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsViewingActiveJobScreen(false);
          }}
          hasActiveJob={!!activeJob}
          openJobsCount={eligibleJobs.length}
        />
      )}

      {/* 4. MODALS & POP-UPS */}
      {/* Job Detail Modal */}
      <WorkerJobDetailModal
        job={selectedJobDetail}
        eligibility={selectedJobDetail ? eligibilityMap.get(selectedJobDetail.id) : null}
        isOpen={!!selectedJobDetail}
        onClose={() => setSelectedJobDetail(null)}
        onAcceptJob={handleAcceptJob}
        onListen={handleListenJob}
      />

      {/* Report Problem Modal */}
      <WorkerReportProblemModal
        isOpen={isReportProblemOpen}
        onClose={() => setIsReportProblemOpen(false)}
        onSubmit={(issue) => {
          console.log('Worker problem reported:', issue);
        }}
      />

      {/* SIH 2026 Demo Simulation Drawer */}
      <WorkerDemoDrawer
        isOpen={isDemoDrawerOpen}
        onClose={() => setIsDemoDrawerOpen(false)}
        onSimulateIncomingJob={handleSimulateIncomingJob}
        onSimulateJobComplete={handleSimulateJobComplete}
        onResetDemoData={handleResetDemoData}
        onQuickLanguage={(code) => setLang(code)}
        onToggleDuty={handleToggleDuty}
        isOnline={isOnline}
        activeWorker={activeWorker}
        onSwitchWorker={handleSwitchWorker}
      />

      {/* Swipe to Accept Alert Modal (for simulated incoming alerts) */}
      <NewJobAlertModal
        isOpen={isAlertModalOpen}
        job={alertJobData}
        countdownSeconds={30}
        onAccept={(acceptedAlert) => {
          setIsAlertModalOpen(false);
          const found = jobs.find((j) => j.id === acceptedAlert.id) || jobs[0];
          if (found) handleAcceptJob(found);
        }}
        onDecline={() => setIsAlertModalOpen(false)}
        lang={selectedLang}
      />

      {/* QR Scanner Modal for Job Completion Verification */}
      {activeJob && (
        <WorkerQrScannerModal
          isOpen={isQrScannerOpen}
          onClose={() => setIsQrScannerOpen(false)}
          job={activeJob}
          onVerificationSuccess={() => {
            handleSimulateJobComplete();
          }}
        />
      )}
      {/* Real-time Job Coordination Chat Modal */}
      <JobChatModal
        isOpen={!!activeChatBooking}
        booking={activeChatBooking}
        currentRole={activeChatRole || 'worker'}
        onClose={closeChat}
      />
      {/* Location Picker Modal for Worker Operating Area */}
      <LocationPickerModal />
    </div>
  );
};
