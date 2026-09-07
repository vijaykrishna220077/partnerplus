import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  AlertCircle, 
  Zap, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  PhoneCall, 
  CheckCircle2, 
  Wrench, 
  Tv, 
  Car, 
  HeartHandshake 
} from 'lucide-react';
import { ServiceCategory, Worker } from '../types';
import { apiService } from '../services/apiService';
import { matchingService } from '../services/matchingService';
import { locationService } from '../services/locationService';
import { mockWorkers } from '../data/mockData';

export const EmergencyServiceModal: React.FC = () => {
  const { 
    isEmergencyOpen, 
    closeEmergency, 
    workers, 
    currentLocation, 
    openPayment, 
    addToast, 
    refreshData,
    t 
  } = useApp();

  const [selectedCat, setSelectedCat] = useState<ServiceCategory>('plumbing');
  const [address, setAddress] = useState<string>('Flat 3B, 2nd Avenue, Anna Nagar');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isEmergencyOpen) return null;

  const emergencyCategories: { id: ServiceCategory; title: string; desc: string; icon: string; eta: string }[] = [
    { id: 'plumbing', title: 'Plumbing Burst / Flooding', desc: 'Main water pipe burst, sewer overflow, ceiling drip', icon: 'Wrench', eta: '15-20 mins' },
    { id: 'electrical', title: 'Electrical Spark / Power Outage', desc: 'Main MCB short circuit, sparking board, burnt socket', icon: 'Zap', eta: '12-18 mins' },
    { id: 'appliance_repair', title: 'Appliance Breakdown / Leak', desc: 'Refrigerator defrost failure, washing machine valve rupture', icon: 'Tv', eta: '20-25 mins' },
    { id: 'caregiving', title: 'Urgent Elderly / Patient Assistance', desc: 'Fall assistance, emergency medicine escort, night care', icon: 'HeartHandshake', eta: '15-25 mins' },
    { id: 'driving', title: 'Emergency Hospital Driver', desc: 'Immediate emergency hospital commute & airport transport', icon: 'Car', eta: '10-15 mins' },
  ];

  const rankedEmergencyResults = matchingService.rankWorkers({
    category: selectedCat,
    customerArea: address,
    isEmergency: true
  });

  const matchedEmergencyWorkers = rankedEmergencyResults
    .map(r => r.worker)
    .filter(w => w.isEmergencyReady && (w.primarySkill === selectedCat || (w.otherSkills && w.otherSkills.includes(selectedCat))));
  const selectedWorker: Worker = matchedEmergencyWorkers[0] || (workers && workers.length > 0 ? workers[0] : mockWorkers[0]);

  const handleDispatchEmergency = async () => {
    setIsSubmitting(true);
    try {
      const created = await apiService.createBooking({
        customerId: 'cust-1',
        customerName: 'Vijay Madhesh',
        customerPhone: '+91 98409 11223',
        workerId: selectedWorker.id,
        workerName: selectedWorker.name,
        workerPhoto: selectedWorker.photoUrl,
        workerPhone: selectedWorker.phone,
        cooperativeName: selectedWorker.cooperativeName,
        serviceCategory: selectedCat,
        serviceName: `EMERGENCY 15-MIN: ${emergencyCategories.find(c => c.id === selectedCat)?.title || 'Urgent Service'}`,
        problemDescription: 'URGENT DISPATCH REQUESTED - Immediate cooperative emergency assistance.',
        address: {
          street: address,
          area: 'Anna Nagar',
          city: 'Chennai',
          pincode: '600040'
        },
        scheduledDate: '2026-09-01',
        scheduledTimeSlot: 'Immediate (15-30 Mins)',
        isEmergency: true,
        status: 'confirmed',
        pricing: {
          serviceCharge: (selectedWorker.startingPrice || 399) + 50,
          workerEarnings: selectedWorker.startingPrice || 399,
          cooperativeWelfareFund: 30,
          platformConvenienceFee: 0,
          taxGST: 20,
          totalAmount: (selectedWorker.startingPrice || 399) + 70
        },
        payment: {
          method: 'upi',
          status: 'pending'
        }
      });

      await refreshData();
      setIsSubmitting(false);
      closeEmergency();
      openPayment(created);
      addToast({
        type: 'emergency',
        title: 'Emergency Worker Dispatched!',
        message: `${selectedWorker.name} has been priority alerted and is en route with emergency kit (ETA: 15 mins).`
      });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-rose-950 text-white p-5 sm:p-6 border-b border-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white animate-pulse">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-rose-300">
                15-30 {t("status.inProgress") || "Minute Express Response"}
              </span>
              <h3 className="text-xl font-black font-serif text-white">
                {t("landing.emergencyResponse") || "Emergency Service Help"}
              </h3>
            </div>
          </div>
          <button
            onClick={closeEmergency}
            className="p-1.5 text-rose-300 hover:text-white rounded-lg hover:bg-rose-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[60vh] overflow-y-auto">
          {/* Emergency Category Selector */}
          <div>
            <label className="font-bold text-slate-800 text-xs block mb-2">
              Select Urgent Service Needed
            </label>
            <div className="space-y-2">
              {emergencyCategories.map(cat => {
                const isSelected = selectedCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/70 text-rose-950 ring-2 ring-rose-500/20 font-bold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold">{cat.title}</h5>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5">{cat.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-rose-100 text-rose-800 rounded-lg shrink-0">
                      ETA: {cat.eta}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Confirmation */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Service Address</span>
              <span className="text-emerald-700 font-semibold text-[10px]">📍 {currentLocation}</span>
            </div>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              placeholder="House/Street location..."
            />
          </div>

          {/* Matched Emergency Worker Preview */}
          {selectedWorker && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWorker.photoUrl}
                  alt={selectedWorker.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-300"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-slate-900 text-xs">{selectedWorker.name}</h5>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1 rounded">
                      On-Duty
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{selectedWorker.primarySkillLabel}</p>
                  <p className="text-[10px] text-slate-400">{selectedWorker.distanceKm} km away • {selectedWorker.cooperativeName}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900">₹{(selectedWorker.startingPrice || 399) + 70}</span>
                <span className="text-[10px] text-slate-500 block">Express Rate</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Bottom */}
        <div className="bg-slate-50 p-5 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={closeEmergency}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDispatchEmergency}
            disabled={isSubmitting}
            className="flex-1 py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>{isSubmitting ? 'Dispatching Priority...' : 'Dispatch Emergency Help Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
