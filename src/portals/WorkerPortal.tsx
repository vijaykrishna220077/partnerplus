import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RuralWorkerPortal } from '../components/RuralWorkerPortal';
import { ToastContainer } from '../components/ToastContainer';

export const WorkerPortal: React.FC = () => {
  const { switchRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-400 selection:text-black">
      {/* The Worker Portal provides full low-literacy accessible workstation */}
      <main className="flex-1 w-full">
        <RuralWorkerPortal onSwitchToCustomer={() => switchRole('customer')} />
      </main>

      <ToastContainer />
    </div>
  );
};
