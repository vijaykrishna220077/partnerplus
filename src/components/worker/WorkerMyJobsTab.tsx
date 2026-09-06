import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  Navigation, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { WorkerJobOpening, WorkerEarningRecord } from '../../data/workerJobData';

interface WorkerMyJobsTabProps {
  activeJob: WorkerJobOpening | null;
  completedJobs: WorkerEarningRecord[];
  upcomingJobs: WorkerJobOpening[];
  onOpenActiveJob: () => void;
  onViewJobDetail: (job: WorkerJobOpening) => void;
}

export const WorkerMyJobsTab: React.FC<WorkerMyJobsTabProps> = ({
  activeJob,
  completedJobs,
  upcomingJobs,
  onOpenActiveJob,
  onViewJobDetail
}) => {
  const [subTab, setSubTab] = useState<'active' | 'upcoming' | 'completed'>(
    activeJob ? 'active' : 'upcoming'
  );

  return (
    <div className="space-y-5">
      {/* 3 Large Tabs: Active, Upcoming, Completed */}
      <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 border border-gray-200">
        <button
          onClick={() => setSubTab('active')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            subTab === 'active'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>Active</span>
          {activeJob && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setSubTab('upcoming')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            subTab === 'upcoming'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>Upcoming</span>
          <span className="px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700 text-[10px]">
            {upcomingJobs.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('completed')}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            subTab === 'completed'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>Completed</span>
          <span className="px-1.5 py-0.2 rounded-full bg-gray-200 text-gray-700 text-[10px]">
            {completedJobs.length}
          </span>
        </button>
      </div>

      {/* Sub-Tab 1: ACTIVE */}
      {subTab === 'active' && (
        <div>
          {activeJob ? (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-blue-500 shadow-md space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
                    {activeJob.tradeIcon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      Currently Assigned
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
                      {activeJob.specificTask}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Customer: {activeJob.customerName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-emerald-600">
                    ₹{activeJob.workerExpectedEarning}
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold">Your Earning</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3.5 text-xs text-gray-700 space-y-1 border border-gray-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{activeJob.customerAddress}</span>
                </div>
                <div className="text-gray-500 pl-5.5">
                  {activeJob.distanceKm} km away • {activeJob.serviceArea}
                </div>
              </div>

              <button
                onClick={onOpenActiveJob}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Go to Active Job Screen (Update Status)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 space-y-2">
              <div className="text-4xl">📋</div>
              <h4 className="text-base font-bold text-gray-800">No Job Active Currently</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Check the "Home" tab to accept available work nearby.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: UPCOMING */}
      {subTab === 'upcoming' && (
        <div className="space-y-3">
          {upcomingJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 space-y-2">
              <div className="text-4xl">📅</div>
              <h4 className="text-base font-bold text-gray-800">No Scheduled Upcoming Jobs</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Scheduled future bookings by cooperative members will appear here.
              </p>
            </div>
          ) : (
            upcomingJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-3 hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
                      {job.tradeIcon}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                        Scheduled
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-gray-900 mt-1">
                        {job.specificTask}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {job.serviceArea} • {job.distanceKm} km
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-600">
                      ₹{job.workerExpectedEarning}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold">You will earn</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-gray-700 flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{job.scheduledDate} • {job.startTime}</span>
                  </span>
                  <span>Duration: {job.estimatedDuration}</span>
                </div>

                <button
                  onClick={() => onViewJobDetail(job)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sub-Tab 3: COMPLETED */}
      {subTab === 'completed' && (
        <div className="space-y-3">
          {completedJobs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-lg">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900">
                    {item.taskTitle}
                  </h4>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.customerArea}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">Paid ({item.paymentMode})</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base sm:text-lg font-black text-emerald-700">
                  +₹{item.amountEarned}
                </div>
                <div className="text-[10px] text-gray-400">
                  Customer Paid ₹{item.customerPaid}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
