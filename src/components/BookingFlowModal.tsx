import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  Upload, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  Zap, 
  ArrowRight,
  Info,
  Camera,
  HeartHandshake
} from 'lucide-react';
import { ServiceItem, Worker, ServiceCategory } from '../types';
import { apiService } from '../services/apiService';
import { matchingService } from '../services/matchingService';
import { locationService } from '../services/locationService';
import { mockWorkers } from '../data/mockData';
import { ServiceIcon } from './ServiceIcon';

export const BookingFlowModal: React.FC = () => {
  const { 
    isBookingOpen, 
    closeBooking, 
    selectedWorkerForBooking, 
    selectedServiceForBooking, 
    services, 
    workers, 
    currentLocation, 
    openPayment, 
    addToast,
    refreshData,
    t 
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [problemDescription, setProblemDescription] = useState<string>('');
  const [selectedProblemTag, setSelectedProblemTag] = useState<string>('');
  const [addressStreet, setAddressStreet] = useState<string>('Flat 3B, Shanthi Heights, 2nd Avenue');
  const [addressArea, setAddressArea] = useState<string>('Anna Nagar');
  const [addressPincode, setAddressPincode] = useState<string>('600040');
  const [scheduledDate, setScheduledDate] = useState<string>('2026-09-01');
  const [scheduledSlot, setScheduledSlot] = useState<string>('11:00 AM - 12:00 PM');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isBookingOpen) {
      if (selectedWorkerForBooking) {
        setSelectedWorker(selectedWorkerForBooking);
        const matchSrv = services.find(s => s.category === selectedWorkerForBooking.primarySkill) || services[0];
        setSelectedService(matchSrv);
        setStep(2); // Jump straight to location & schedule
      } else if (selectedServiceForBooking) {
        setSelectedService(selectedServiceForBooking);
        setStep(2);
      } else {
        setSelectedService(services[0] || null);
        setStep(1);
      }
    }
  }, [isBookingOpen, selectedWorkerForBooking, selectedServiceForBooking, services]);

  if (!isBookingOpen) return null;

  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate photo preview
      setUploadedPhotoUrl('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80');
      addToast({
        type: 'info',
        title: 'Photo Attached',
        message: 'Problem photo uploaded for the worker.'
      });
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) return;
    setIsSubmitting(true);

    try {
      const chosenWorker: Worker = selectedWorker || (workers && workers.length > 0 ? (workers.find(w => w.primarySkill === selectedService.category) || workers[0]) : mockWorkers[0]);
      const baseCharge = chosenWorker.startingPrice || selectedService.startingPrice;
      const workerEarnings = Math.round(baseCharge * 0.94);
      const welfareFund = Math.round(baseCharge * 0.06);
      const taxGST = Math.round(baseCharge * 0.05);
      const totalAmount = baseCharge + taxGST;

      const created = await apiService.createBooking({
        customerId: 'cust-1',
        customerName: 'Vijay Madhesh',
        customerPhone: '+91 98409 11223',
        workerId: chosenWorker.id,
        workerName: chosenWorker.name,
        workerPhoto: chosenWorker.photoUrl,
        workerPhone: chosenWorker.phone,
        cooperativeName: chosenWorker.cooperativeName,
        serviceCategory: selectedService.category,
        serviceName: `${selectedService.name} - ${selectedProblemTag || 'General Repair'}`,
        problemDescription: problemDescription || selectedProblemTag || 'Standard cooperative service request.',
        photoAttachmentUrl: uploadedPhotoUrl || undefined,
        address: {
          street: addressStreet,
          area: addressArea,
          city: 'Chennai',
          pincode: addressPincode
        },
        scheduledDate,
        scheduledTimeSlot: scheduledSlot,
        isEmergency: false,
        status: 'confirmed',
        pricing: {
          serviceCharge: baseCharge,
          workerEarnings,
          cooperativeWelfareFund: welfareFund,
          platformConvenienceFee: 0,
          taxGST,
          totalAmount
        },
        payment: {
          method: 'upi',
          status: 'pending'
        }
      });

      await refreshData();
      setIsSubmitting(false);
      closeBooking();
      openPayment(created);
      addToast({
        type: 'success',
        title: 'Booking Created!',
        message: `Booking #${created.bookingCode} confirmed with ${chosenWorker.name}. Proceed to sandbox payment.`
      });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: t("common.all") || 'Service' },
    { num: 2, label: t("location.changeLocation") || 'Location' },
    { num: 3, label: t("booking.chooseArrivalSlot") || 'Date & Time' },
    { num: 4, label: t("jobs.jobDetails") || 'Details' },
    { num: 5, label: t("organization.workers") || 'Worker' },
    { num: 6, label: t("common.confirm") || 'Confirm' },
  ];

  // Matched workers for step 5 ranked using Proximity-First algorithm
  const rankedResults = matchingService.rankWorkers({
    category: selectedService?.category || 'plumbing',
    customerArea: addressArea || addressStreet,
    isEmergency: false
  });
  const matchedWorkers = rankedResults.map(r => r.worker);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
              {t("landing.guaranteedCooperative") || "Cooperative Booking Wizard"}
            </span>
            <h2 className="text-xl font-bold font-serif text-white">
              {t("booking.bookNow") || "Book a Verified Local Worker"}
            </h2>
          </div>
          <button
            onClick={closeBooking}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between overflow-x-auto gap-2">
          {stepsList.map(s => {
            const isDone = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex items-center gap-1.5 shrink-0 text-xs">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] transition ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-slate-900 text-white ring-2 ring-emerald-500'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? '✓' : s.num}
                </div>
                <span className={`font-semibold hidden sm:inline ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {s.num < 6 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-1 hidden sm:inline" />}
              </div>
            );
          })}
        </div>

        {/* Dynamic Wizard Body */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[56vh] space-y-6">
          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 1 — What service do you need?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select from standard labour cooperative categories.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {services.map(srv => {
                  const isSelected = selectedService?.id === srv.id;
                  return (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-2">
                        <ServiceIcon name={srv.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{srv.name}</h4>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          ₹{srv.startingPrice} {srv.unit}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 2 — Where should the worker come?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Enter your service address or landmark.</p>
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">Current Detected Zone</span>
                    <span className="text-xs text-emerald-800">{currentLocation}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-1 rounded border border-emerald-200">
                  GPS Active
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">House / Flat / Street Address *</label>
                  <input
                    type="text"
                    value={addressStreet}
                    onChange={e => setAddressStreet(e.target.value)}
                    placeholder="e.g. Flat 3B, 2nd Avenue"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Locality / Ward Area *</label>
                    <input
                      type="text"
                      value={addressArea}
                      onChange={e => setAddressArea(e.target.value)}
                      placeholder="e.g. Anna Nagar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Postal Pincode *</label>
                    <input
                      type="text"
                      value={addressPincode}
                      onChange={e => setAddressPincode(e.target.value)}
                      placeholder="600040"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Date & Time */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 3 — When do you need the service?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a convenient schedule slot.</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-2">Select Date</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: 'Today', date: '2026-09-01', sub: 'Sept 1 (Tue)' },
                    { label: 'Tomorrow', date: '2026-09-02', sub: 'Sept 2 (Wed)' },
                    { label: 'Day After', date: '2026-09-03', sub: 'Sept 3 (Thu)' },
                  ].map(d => (
                    <button
                      key={d.date}
                      onClick={() => setScheduledDate(d.date)}
                      className={`p-3 rounded-xl border text-center transition ${
                        scheduledDate === d.date
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="block text-xs">{d.label}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{d.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-2">Select Time Window</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    '09:00 AM - 10:30 AM',
                    '11:00 AM - 12:30 PM',
                    '02:00 PM - 03:30 PM',
                    '04:30 PM - 06:00 PM',
                    '06:30 PM - 08:00 PM'
                  ].map(slot => (
                    <button
                      key={slot}
                      onClick={() => setScheduledSlot(slot)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        scheduledSlot === slot
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot}</span>
                      </div>
                      {scheduledSlot === slot && <span className="text-emerald-600 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Details & Problem Description */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 4 — Describe the problem</h3>
                <p className="text-xs text-slate-500 mt-0.5">Help the cooperative worker bring the exact tools.</p>
              </div>

              {selectedService?.popularProblems && (
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-2">Common Problem Types (Quick Pick)</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.popularProblems.map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setSelectedProblemTag(p);
                          setProblemDescription(prev => prev ? `${p}. ${prev}` : p);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                          selectedProblemTag === p
                            ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        + {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">Detailed Description (Optional)</label>
                <textarea
                  rows={3}
                  value={problemDescription}
                  onChange={e => setProblemDescription(e.target.value)}
                  placeholder="e.g. Tap in the master bedroom washbasin is continuously dripping and the water valve is tight..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              {/* Photo Upload Attachment Simulation */}
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs">Attach Photo of Problem (Optional)</h5>
                      <p className="text-[11px] text-slate-500">Allows worker to diagnose beforehand</p>
                    </div>
                  </div>

                  <label className="cursor-pointer px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleSimulatePhotoUpload} className="hidden" />
                  </label>
                </div>

                {uploadedPhotoUrl && (
                  <div className="mt-3 flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Problem photo attached successfully</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Choose Worker */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 5 — Choose your Nearby Worker</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Ranked by Haversine GPS proximity and trade certifications.</p>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
                  📍 Proximity Algorithm Active
                </span>
              </div>

              <div className="space-y-3">
                {matchedWorkers.map((w, idx) => {
                  const isSelected = selectedWorker?.id === w.id;
                  const etaMins = locationService.calculateEtaMinutes(w.distanceKm);
                  const isClosest = idx === 0;

                  return (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWorker(w)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={w.photoUrl}
                          alt={w.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{w.name}</h4>
                            {isClosest ? (
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                                📍 Closest Worker
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">{w.primarySkillLabel} • {w.experienceYears} yrs exp</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{w.locationArea}, {w.city} ({w.cooperativeName})</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-slate-900">₹{w.startingPrice}</span>
                        <div className="flex items-center justify-end gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
                          <span>⭐ {w.rating}</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">
                          📍 {w.distanceKm} km (ETA ~{etaMins}m)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Confirm & Transparent Breakdown */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 6 — Review & Confirm Booking</h3>
                <p className="text-xs text-slate-500 mt-0.5">Verify your booking details and cooperative rate card.</p>
              </div>

              {/* Service & Worker Summary Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <ServiceIcon name={selectedService?.icon || 'Wrench'} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{selectedService?.name}</h4>
                      <p className="text-slate-500">{problemDescription || 'Standard service inspection'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Assigned Worker</span>
                    <span className="font-bold text-slate-900">{selectedWorker?.name || 'Top Matched Worker'}</span>
                    <span className="text-[11px] text-emerald-700 block">✓ {selectedWorker?.cooperativeName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Schedule & Location</span>
                    <span className="font-bold text-slate-900">{scheduledDate} ({scheduledSlot})</span>
                    <span className="text-[11px] text-slate-500 block truncate">{addressStreet}, {addressArea}</span>
                  </div>
                </div>
              </div>

              {/* Transparent Cooperative Pricing Breakdown */}
              <div className="p-4 bg-emerald-950 text-emerald-50 rounded-2xl space-y-2.5 text-xs shadow-lg">
                <div className="flex items-center justify-between font-bold text-emerald-300 pb-1 border-b border-emerald-800">
                  <span>Transparent Price Breakdown</span>
                  <span className="text-[10px] uppercase tracking-wider bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">
                    Zero Private Commission
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Direct Worker Service Wage (94%)</span>
                  <span className="font-semibold text-white">₹{Math.round((selectedWorker?.startingPrice || 349) * 0.94)}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                    Cooperative Worker Welfare & Pension Fund (6%)
                  </span>
                  <span className="font-semibold text-emerald-300">₹{Math.round((selectedWorker?.startingPrice || 349) * 0.06)}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Government GST (5%)</span>
                  <span>₹{Math.round((selectedWorker?.startingPrice || 349) * 0.05)}</span>
                </div>

                <div className="flex justify-between font-extrabold text-sm text-white pt-2 border-t border-emerald-800">
                  <span>Total Payable</span>
                  <span className="text-base text-emerald-400">
                    ₹{(selectedWorker?.startingPrice || 349) + Math.round((selectedWorker?.startingPrice || 349) * 0.05)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Controls Bottom Bar */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 6 ? (
            <button
              onClick={() => {
                if (step === 1 && !selectedService) {
                  addToast({ type: 'warning', title: 'Select Service', message: 'Please choose a service to proceed.' });
                  return;
                }
                setStep(step + 1);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-extrabold shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming...' : 'Confirm & Proceed to Payment'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
