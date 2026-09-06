import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { mockCooperatives } from '../data/mockData';
import { cooperativeBackend } from '../services/cooperativeBackendService';
import { realtimeHub } from '../services/db';

// Header & Sidebar Shell
import { CooperativeHeader } from '../components/cooperative/CooperativeHeader';
import { CooperativeSidebar, CooperativeSectionId } from '../components/cooperative/CooperativeSidebar';

// 12 Functional Modules
import { OverviewTab } from '../components/cooperative/tabs/OverviewTab';
import { LiveOperationsTab } from '../components/cooperative/tabs/LiveOperationsTab';
import { LiveJobsTab } from '../components/cooperative/tabs/LiveJobsTab';
import { WorkersTab } from '../components/cooperative/tabs/WorkersTab';
import { CustomersTab } from '../components/cooperative/tabs/CustomersTab';
import { VerificationTab } from '../components/cooperative/tabs/VerificationTab';
import { PaymentsTab } from '../components/cooperative/tabs/PaymentsTab';
import { EarningsTab } from '../components/cooperative/tabs/EarningsTab';
import { WelfareTab } from '../components/cooperative/tabs/WelfareTab';
import { ComplaintsTab } from '../components/cooperative/tabs/ComplaintsTab';
import { ReportsTab } from '../components/cooperative/tabs/ReportsTab';
import { SettingsTab } from '../components/cooperative/tabs/SettingsTab';

// Modals & Panels
import { NotificationsDrawer, OFFICIAL_ALERTS } from '../components/cooperative/modals/NotificationsDrawer';
import { AuditLogModal } from '../components/cooperative/modals/AuditLogModal';
import { LiveMapModal } from '../components/cooperative/modals/LiveMapModal';
import { ManualAssignmentModal } from '../components/cooperative/modals/ManualAssignmentModal';
import { WorkerProfileModal } from '../components/WorkerProfileModal';
import { ToastContainer } from '../components/ToastContainer';

export const CooperativePortal: React.FC = () => {
  const { workers, bookings, openWorkerProfile, addToast, triggerCelebration, refreshData } = useApp();
  const { user } = useAuth();

  // Navigation State (12 sections)
  const [currentSection, setCurrentSection] = useState<CooperativeSectionId>('overview');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [selectedCooperativeId, setSelectedCooperativeId] = useState<string>(mockCooperatives[0].id);

  // Modal / Drawer States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isLiveMapOpen, setIsLiveMapOpen] = useState(false);
  const [manualInterveneJobId, setManualInterveneJobId] = useState<string | null>(null);

  // Demo vs Live Mode
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Sync active cooperative
  const activeCooperative = mockCooperatives.find(c => c.id === selectedCooperativeId) || mockCooperatives[0];

  // Derived real-time counters
  const activeJobs = bookings.filter(b => 
    ['worker_assigned', 'on_the_way', 'arrived', 'service_started'].includes(b.status)
  );
  const emergencyBookings = bookings.filter(b => b.isEmergency);
  const pendingKycCount = workers.filter(w => w.verificationStatus === 'under_review').length;
  const openComplaints = cooperativeBackend.getComplaints().filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED');

  // Real-time listener for live interventions
  useEffect(() => {
    const unsubDispatch = realtimeHub.subscribe('sahakari:job_intervened', (data: any) => {
      refreshData();
      addToast({
        type: 'success',
        title: 'Dispatch Override Synchronized',
        message: `Job ${data.jobId} manually assigned to ${data.workerName}. Telemetry updated.`
      });
    });

    return () => {
      unsubDispatch();
    };
  }, [refreshData, addToast]);

  const handleOpenManualIntervene = (jobId: string) => {
    setManualInterveneJobId(jobId);
  };

  const handleInterventionSuccess = (workerName: string) => {
    triggerCelebration();
    addToast({
      type: 'success',
      title: 'Artisan Dispatched Successfully',
      message: `${workerName} has been assigned to job and notified via SMS gateway.`
    });
    refreshData();
  };

  const targetInterventionBooking = bookings.find(b => b.id === manualInterveneJobId) || bookings[0];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* 1. Official Cooperative Header */}
      <CooperativeHeader
        activeCooperative={activeCooperative}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuditLog={() => setIsAuditLogOpen(true)}
        onOpenLiveMap={() => setIsLiveMapOpen(true)}
        onToggleSidebar={() => setIsSidebarMobileOpen(prev => !prev)}
        unreadAlertCount={OFFICIAL_ALERTS.length}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode(prev => !prev)}
      />

      {/* 2. Body Layout: Left Sidebar + Main Content View */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        
        {/* Left Navigation Sidebar */}
        <CooperativeSidebar
          currentSection={currentSection}
          onSelectSection={(section) => setCurrentSection(section)}
          isOpenMobile={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
          selectedCooperativeId={selectedCooperativeId}
          onSelectCooperative={(id) => setSelectedCooperativeId(id)}
          activeJobsCount={activeJobs.length}
          emergencyCount={emergencyBookings.length}
          pendingKycCount={pendingKycCount}
          openComplaintsCount={openComplaints.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentSection === 'overview' && (
            <OverviewTab
              cooperative={activeCooperative}
              workers={workers}
              bookings={bookings}
              onNavigate={(section) => setCurrentSection(section)}
              onOpenManualIntervene={handleOpenManualIntervene}
            />
          )}

          {currentSection === 'live' && (
            <LiveOperationsTab
              bookings={bookings}
              workers={workers}
              onOpenManualIntervene={handleOpenManualIntervene}
              onOpenLiveMap={() => setIsLiveMapOpen(true)}
            />
          )}

          {currentSection === 'jobs' && (
            <LiveJobsTab
              bookings={bookings}
              onOpenManualIntervene={handleOpenManualIntervene}
            />
          )}

          {currentSection === 'workers' && (
            <WorkersTab
              workers={workers}
              onOpenWorkerProfile={openWorkerProfile}
            />
          )}

          {currentSection === 'customers' && (
            <CustomersTab
              bookings={bookings}
            />
          )}

          {currentSection === 'verification' && (
            <VerificationTab
              workers={workers}
              onRefresh={refreshData}
            />
          )}

          {currentSection === 'payments' && (
            <PaymentsTab
              bookings={bookings}
            />
          )}

          {currentSection === 'earnings' && (
            <EarningsTab
              workers={workers}
            />
          )}

          {currentSection === 'welfare' && (
            <WelfareTab />
          )}

          {currentSection === 'complaints' && (
            <ComplaintsTab />
          )}

          {currentSection === 'reports' && (
            <ReportsTab />
          )}

          {currentSection === 'settings' && (
            <SettingsTab />
          )}
        </main>
      </div>

      {/* 3. Operational Modals & Overlays */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab) => setCurrentSection(tab as CooperativeSectionId)}
      />

      <AuditLogModal
        isOpen={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
      />

      <LiveMapModal
        isOpen={isLiveMapOpen}
        onClose={() => setIsLiveMapOpen(false)}
        onManualIntervene={handleOpenManualIntervene}
      />

      {manualInterveneJobId && (
        <ManualAssignmentModal
          isOpen={!!manualInterveneJobId}
          jobId={targetInterventionBooking.bookingCode}
          serviceName={targetInterventionBooking.serviceName}
          area={targetInterventionBooking.address.area}
          isEmergency={targetInterventionBooking.isEmergency}
          onClose={() => setManualInterveneJobId(null)}
          onSuccess={handleInterventionSuccess}
        />
      )}

      <WorkerProfileModal />
      <ToastContainer />
    </div>
  );
};
