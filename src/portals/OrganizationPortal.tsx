import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { organizationService } from '../services/organizationService';
import { realtimeHub } from '../services/db';
import { OrganizationHeader } from '../components/organization/OrganizationHeader';
import { OrgDashboardTab } from '../components/organization/tabs/OrgDashboardTab';
import { OrgProjectsTab } from '../components/organization/tabs/OrgProjectsTab';
import { OrgWorkforceRequestsTab } from '../components/organization/tabs/OrgWorkforceRequestsTab';
import { OrgLiveMapTab } from '../components/organization/tabs/OrgLiveMapTab';
import { OrgAttendanceTab } from '../components/organization/tabs/OrgAttendanceTab';
import { OrgBillingTab } from '../components/organization/tabs/OrgBillingTab';
import { CreateWorkRequestModal } from '../components/organization/modals/CreateWorkRequestModal';
import { CreateProjectModal } from '../components/organization/modals/CreateProjectModal';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MapPin, 
  Clock, 
  FileText,
  Radio,
  X,
  Bell
} from 'lucide-react';
import { OrganizationProject, OrganizationWorkRequest, OrganizationProfile } from '../types';

export const OrganizationPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Organization data state
  const [orgProfile, setOrgProfile] = useState<OrganizationProfile | null>(null);
  const [projects, setProjects] = useState<OrganizationProject[]>([]);
  const [workRequests, setWorkRequests] = useState<OrganizationWorkRequest[]>([]);

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [targetProjectIdForRequest, setTargetProjectIdForRequest] = useState<string | undefined>(undefined);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Cooperative Verification Approved',
      message: 'Cooperative Official K. S. Ramanathan approved enterprise compliance verification.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 'n2',
      title: '3 Artisans Checked In',
      message: 'Suresh Kumar and 2 others reported to Peelamedu Logistics Hub gate.',
      time: '3 hours ago',
      read: false
    }
  ]);

  const loadOrgData = () => {
    const orgId = user?.organizationId || 'org-1';
    const profile = organizationService.getOrganizationById(orgId);
    setOrgProfile(profile);

    const projs = organizationService.getProjects(orgId);
    setProjects(projs);

    const reqs = organizationService.getWorkRequests(orgId);
    setWorkRequests(reqs);
  };

  useEffect(() => {
    loadOrgData();

    // Subscribe to realtime updates
    const unsub1 = realtimeHub.subscribe('org:work_request_created', loadOrgData);
    const unsub2 = realtimeHub.subscribe('org:work_request_updated', loadOrgData);
    const unsub3 = realtimeHub.subscribe('org:project_created', loadOrgData);
    const unsub4 = realtimeHub.subscribe('org:assignment_updated', loadOrgData);

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, [user]);

  const openNewRequestModal = (projectId?: string) => {
    setTargetProjectIdForRequest(projectId);
    setIsRequestModalOpen(true);
  };

  const navTabs = [
    { id: 'dashboard', label: 'Operations Command', icon: LayoutDashboard },
    { id: 'projects', label: 'Project Sites', icon: Briefcase },
    { id: 'workforce-requests', label: 'Workforce Requests', icon: Users, badge: workRequests.length },
    { id: 'live-map', label: 'Live GPS Map', icon: MapPin },
    { id: 'attendance', label: 'Daily Muster', icon: Clock },
    { id: 'billing', label: 'Billing & Invoices', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      
      {/* Top Header */}
      <OrganizationHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openNotifications={() => setIsNotificationsOpen(true)}
        unreadNotifsCount={notifications.filter(n => !n.read).length}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col space-y-6">
        
        {/* Navigation Tab Bar */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <OrgDashboardTab
              organization={orgProfile}
              projects={projects}
              workRequests={workRequests}
              onOpenNewRequestModal={() => openNewRequestModal()}
              onOpenNewProjectModal={() => setIsProjectModalOpen(true)}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'projects' && (
            <OrgProjectsTab
              projects={projects}
              workRequests={workRequests}
              onOpenNewProjectModal={() => setIsProjectModalOpen(true)}
              onOpenNewRequestModal={openNewRequestModal}
              onSelectProject={(pId) => {
                setActiveTab('workforce-requests');
              }}
            />
          )}

          {activeTab === 'workforce-requests' && (
            <OrgWorkforceRequestsTab
              workRequests={workRequests}
              onOpenNewRequestModal={() => openNewRequestModal()}
              onRefreshRequests={loadOrgData}
            />
          )}

          {activeTab === 'live-map' && (
            <OrgLiveMapTab
              projects={projects}
              workRequests={workRequests}
            />
          )}

          {activeTab === 'attendance' && (
            <OrgAttendanceTab
              workRequests={workRequests}
              onRefreshRequests={loadOrgData}
            />
          )}

          {activeTab === 'billing' && (
            <OrgBillingTab
              organization={orgProfile}
              projects={projects}
              workRequests={workRequests}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateWorkRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        projects={projects}
        defaultProjectId={targetProjectIdForRequest}
        onSuccess={() => {
          loadOrgData();
          setActiveTab('workforce-requests');
        }}
      />

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        orgId={user?.organizationId || 'org-1'}
        orgName={user?.organizationName || 'L&T Kovai Facilities'}
        onSuccess={() => {
          loadOrgData();
          setActiveTab('projects');
        }}
      />

      {/* Notifications Drawer */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <h3 className="font-black text-sm text-slate-900">Notifications</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="font-extrabold text-slate-900">{n.title}</div>
                    <p className="text-slate-600">{n.message}</p>
                    <span className="text-[10px] text-slate-400 font-semibold block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
                setIsNotificationsOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs transition hover:bg-slate-800 cursor-pointer"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
