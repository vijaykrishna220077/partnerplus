import React from 'react';
import { Home, ClipboardList, Wallet, Heart, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type WorkerNavTab = 'home' | 'my_jobs' | 'earnings' | 'welfare' | 'profile';

interface WorkerBottomNavProps {
  activeTab: WorkerNavTab;
  onSelectTab: (tab: WorkerNavTab) => void;
  hasActiveJob: boolean;
  openJobsCount: number;
}

export const WorkerBottomNav: React.FC<WorkerBottomNavProps> = ({
  activeTab,
  onSelectTab,
  hasActiveJob,
  openJobsCount
}) => {
  const { t } = useApp();

  const tabs = [
    {
      id: 'home' as WorkerNavTab,
      label: t("worker.home"),
      icon: Home,
      badge: openJobsCount > 0 ? openJobsCount : null,
      badgeColor: 'bg-blue-600'
    },
    {
      id: 'my_jobs' as WorkerNavTab,
      label: t("worker.myJobs"),
      icon: ClipboardList,
      badge: hasActiveJob ? '1' : null,
      badgeColor: 'bg-emerald-600 animate-pulse'
    },
    {
      id: 'earnings' as WorkerNavTab,
      label: t("worker.earnings"),
      icon: Wallet,
      badge: null
    },
    {
      id: 'welfare' as WorkerNavTab,
      label: t("worker.welfare"),
      icon: Heart,
      badge: null
    },
    {
      id: 'profile' as WorkerNavTab,
      label: t("worker.profile"),
      icon: User,
      badge: null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg px-2 sm:px-6 py-2">
      <div className="max-w-2xl mx-auto flex items-center justify-around gap-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-blue-600 font-black'
                  : 'text-gray-500 hover:text-gray-800 font-semibold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${isActive ? 'scale-110 text-blue-600' : ''}`} />
                {t.badge && (
                  <span className={`absolute -top-1.5 -right-2 text-[10px] font-black text-white px-1.5 py-0.2 rounded-full shadow-xs ${t.badgeColor}`}>
                    {t.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs mt-1 leading-tight tracking-tight">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
