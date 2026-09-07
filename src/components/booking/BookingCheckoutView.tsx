import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  UserCheck,
  Zap,
  Bell,
  VolumeX,
  AlertCircle,
  Car,
  ShieldCheck,
  HardHat,
  MapPin,
  Clock,
  Calendar,
  HeartPulse,
  Tag,
  Banknote,
  QrCode,
  Loader2,
  Minus,
  Plus,
  Trash2,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { CooperativeWorkerProfile } from '../../data/cooperativeWorkers';
import { CategoryData, TaskItem } from './WorksCatalogView';

interface BookingCheckoutViewProps {
  cart: Record<string, number>;
  findTaskById: (taskId: string) => { task: TaskItem; category: CategoryData } | null;
  activeTaskFallback: TaskItem;
  totalItemsCount: number;
  subtotalLabor: number;
  welfareFund: number;
  gstTax: number;
  couponDiscount: number;
  isCouponApplied: boolean;
  grossTotal: number;
  selectedWorker: CooperativeWorkerProfile | null;
  onSelectWorker: (worker: CooperativeWorkerProfile | null) => void;
  onAddToCart: (taskId: string) => void;
  onRemoveFromCart: (taskId: string) => void;
  onDeleteItem: (taskId: string) => void;
  onNavigateToWorks: () => void;
  onNavigateToWorkers: () => void;
  deliveryInstructions: string[];
  toggleInstruction: (inst: string) => void;
  customInstructions: string;
  setCustomInstructions: (val: string) => void;
  isEmergencySOS: boolean;
  setIsEmergencySOS: (val: boolean) => void;
  needMaterials: boolean;
  setNeedMaterials: (val: boolean) => void;
  addressTag: 'home' | 'work' | 'other';
  setAddressTag: (tag: 'home' | 'work' | 'other') => void;
  customerName: string;
  setCustomerName: (val: string) => void;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  customerAddress: string;
  setCustomerAddress: (val: string) => void;
  handleDetectLocation: () => void;
  isLocating: boolean;
  selectedSlot: 'immediate' | 'evening' | 'tomorrow' | 'custom';
  setSelectedSlot: (slot: 'immediate' | 'evening' | 'tomorrow' | 'custom') => void;
  customSlotDate?: string;
  setCustomSlotDate?: (date: string) => void;
  customSlotTime?: string;
  setCustomSlotTime?: (time: string) => void;
  workerTip: number;
  setWorkerTip: (tip: number) => void;
  paymentMode: 'cash' | 'upi';
  setPaymentMode: (mode: 'cash' | 'upi') => void;
  errorMessage: string;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  lang: string;
}

export const BookingCheckoutView: React.FC<BookingCheckoutViewProps> = ({
  cart,
  findTaskById,
  activeTaskFallback,
  totalItemsCount,
  subtotalLabor,
  welfareFund,
  gstTax,
  couponDiscount,
  isCouponApplied,
  grossTotal,
  selectedWorker,
  onSelectWorker,
  onAddToCart,
  onRemoveFromCart,
  onDeleteItem,
  onNavigateToWorks,
  onNavigateToWorkers,
  deliveryInstructions,
  toggleInstruction,
  customInstructions,
  setCustomInstructions,
  isEmergencySOS,
  setIsEmergencySOS,
  needMaterials,
  setNeedMaterials,
  addressTag,
  setAddressTag,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerAddress,
  setCustomerAddress,
  handleDetectLocation,
  isLocating,
  selectedSlot,
  setSelectedSlot,
  customSlotDate = new Date().toISOString().split('T')[0],
  setCustomSlotDate = (_date: string) => {},
  customSlotTime = '10:00 AM',
  setCustomSlotTime = (_time: string) => {},
  workerTip,
  setWorkerTip,
  paymentMode,
  setPaymentMode,
  errorMessage,
  isSubmitting,
  onSubmit,
  lang
}) => {
  const { t } = useApp();
  const cartEntries = Object.entries(cart).filter(([_, qty]) => Number(qty) > 0);
  const isCartEmpty = cartEntries.length === 0;

  const getTaskLabel = (task: TaskItem) => {
    const key = `jobs.${task.id}`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
    if (lang === 'hi' && task.nameHi) return task.nameHi;
    if (lang === 'ta' && task.nameTa) return task.nameTa;
    return task.name;
  };

  const getCategoryLabel = (cat: CategoryData) => {
    if (lang === 'hi') return cat.nameHi || cat.name;
    if (lang === 'ta') return cat.nameTa || cat.name;
    return cat.name;
  };

  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT COLUMN: SELECTED WORKS, ASSIGNED WORKER & INSTRUCTIONS (60-65% width) */}
      <div className="flex-1 lg:w-7/12 xl:w-8/12 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-5 bg-slate-50 border-r border-slate-200 pb-28 lg:pb-8">
        
        {/* Navigation Back Pill */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateToWorks}
            className="text-xs font-extrabold text-[#1D68ED] hover:underline flex items-center gap-1 cursor-pointer"
          >
            {t.addMoreWorks || '← Add More Works / Change Categories'}
          </button>

          <button
            type="button"
            onClick={onNavigateToWorkers}
            className="text-xs font-extrabold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            {t.browseWorkers || 'Browse Available Workers →'}
          </button>
        </div>

        {/* 1. SELECTED WORKS LIST CARD */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#1D68ED]" />
              <h3 className="text-sm font-black text-slate-900">
                {t.selectedWorksCart || 'Selected Works in Cart'} ({totalItemsCount})
              </h3>
            </div>
            <button
              type="button"
              onClick={onNavigateToWorks}
              className="text-xs font-bold text-[#1D68ED] hover:underline cursor-pointer"
            >
              {t.addWorkItems || '+ Add Work Items'}
            </button>
          </div>

          <div className="space-y-2.5">
            {!isCartEmpty ? (
              cartEntries.map(([tId, qty]) => {
                const found = findTaskById(tId);
                if (!found) return null;
                const count = Number(qty) || 0;
                const itemSub = found.task.basePrice * count;

                return (
                  <div
                    key={tId}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-slate-900">
                        {getTaskLabel(found.task)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{getCategoryLabel(found.category)}</span>
                        <span>•</span>
                        <span>₹{found.task.basePrice} per {found.task.unit}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="inline-flex items-center bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => onRemoveFromCart(tId)}
                          className="px-2 py-1 text-slate-600 hover:text-black cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                        <span className="px-2.5 text-xs font-black min-w-[20px] text-center">{qty}</span>
                        <button
                          type="button"
                          onClick={() => onAddToCart(tId)}
                          className="px-2 py-1 text-slate-600 hover:text-black cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>
                      <span className="font-black text-slate-900 min-w-[50px] text-right">
                        ₹{itemSub}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(tId)}
                        className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                        title="Remove work"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-2">
                <p className="text-xs text-blue-800 font-bold">
                  Default selected work: {getTaskLabel(activeTaskFallback)} (1 unit)
                </p>
                <button
                  type="button"
                  onClick={onNavigateToWorks}
                  className="px-4 py-1.5 bg-[#1D68ED] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Browse &amp; Add Works &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. ASSIGNED WORKER PARTNER CARD */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.assignedCoopPartner || 'Assigned Cooperative Partner'}</span>
            </h3>
            <button
              type="button"
              onClick={onNavigateToWorkers}
              className="text-xs font-bold text-[#1D68ED] hover:underline cursor-pointer"
            >
              {selectedWorker ? 'Switch Worker' : (t.pickSpecificWorker || 'Pick Specific Worker')} &rarr;
            </button>
          </div>

          {selectedWorker ? (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWorker.photo}
                  alt={selectedWorker.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover border border-emerald-300"
                />
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>{selectedWorker.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded font-bold">
                      {selectedWorker.rating.toFixed(2)} ★
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                    {selectedWorker.tradeLabel} • {selectedWorker.distanceKm} km away
                  </div>
                  <div className="text-[10px] text-slate-500">
                    ETA: <strong>{selectedWorker.etaMinutes} Mins</strong> • {selectedWorker.badge}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectWorker(null)}
                className="text-[11px] font-bold text-slate-500 hover:text-red-500 cursor-pointer"
              >
                Use Auto-Match
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">
                    ⚡ {t.autoMatchTitle || 'Auto-Match Nearest Available Partner'}
                  </div>
                  <div className="text-[11px] text-blue-800 font-medium mt-0.5">
                    {t.autoMatchSub || 'Automated 15-25 min dispatch to closest certified crew in your sector'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToWorkers}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-2xs"
              >
                {t.choose || 'Choose'}
              </button>
            </div>
          )}
        </div>

        {/* 3. SERVICE INSTRUCTIONS & NOTES */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>{t.serviceInstructions || 'Service Instructions for Worker'}</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{t.optional || 'OPTIONAL'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'ring_bell', label: t.ringDoorbell || 'Ring Doorbell', icon: Bell },
              { id: 'avoid_calling', label: t.avoidCalling || 'Avoid Calling', icon: VolumeX },
              { id: 'pet_at_home', label: t.petInHouse || 'Pet in House', icon: AlertCircle },
              { id: 'parking_spot', label: 'Parking Ready', icon: Car },
              { id: 'security_gate', label: t.leaveAtSecurity || 'Gate Pass Reqd', icon: ShieldCheck }
            ].map((chip) => {
              const active = deliveryInstructions.includes(chip.id);
              const ChipIcon = chip.icon;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => toggleInstruction(chip.id)}
                  className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'bg-blue-50 border-[#1D68ED] text-[#1D68ED]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ChipIcon className={`w-3.5 h-3.5 ${active ? 'text-[#1D68ED]' : 'text-slate-400'}`} />
                  <span className="truncate">{chip.label}</span>
                </button>
              );
            })}
          </div>

          <div>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Specific notes e.g., 'Take elevator to 4th floor, switch is sparking'"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#1D68ED] bg-slate-50"
            />
          </div>
        </div>

        {/* 4. ADD-ONS & EMERGENCY TOGGLE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
            isEmergencySOS ? 'border-red-500 bg-red-50/60' : 'border-slate-200 bg-white'
          }`}>
            <div className="flex items-center gap-2.5">
              <Zap className={`w-4 h-4 ${isEmergencySOS ? 'text-red-600' : 'text-slate-400'}`} />
              <div>
                <div className="text-xs font-black text-slate-900">15-Min Express SOS</div>
                <div className="text-[10px] text-slate-500">+₹99 Priority Siren Dispatch</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isEmergencySOS}
              onChange={(e) => setIsEmergencySOS(e.target.checked)}
              className="w-4 h-4 accent-red-600 cursor-pointer"
            />
          </label>

          <label className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
            needMaterials ? 'border-blue-500 bg-blue-50/60' : 'border-slate-200 bg-white'
          }`}>
            <div className="flex items-center gap-2.5">
              <HardHat className={`w-4 h-4 ${needMaterials ? 'text-blue-600' : 'text-slate-400'}`} />
              <div>
                <div className="text-xs font-black text-slate-900">Partner Brings Materials</div>
                <div className="text-[10px] text-slate-500">Pipes, wires, cement at cost</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={needMaterials}
              onChange={(e) => setNeedMaterials(e.target.checked)}
              className="w-4 h-4 accent-[#1D68ED] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* RIGHT COLUMN: ADDRESS, ARRIVAL SLOT, TIP, BILL & PAYMENT (35-40% width) */}
      <div className="w-full lg:w-5/12 xl:w-4/12 bg-white flex flex-col justify-between overflow-y-auto p-4 sm:p-6 space-y-5 border-t lg:border-t-0 lg:border-l border-slate-200 shadow-xl">
        
        <div className="space-y-5">
          {/* Address & Contact Input Card */}
          <div className="space-y-3 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{t.deliveryAddressContact || 'Delivery Address & Contact'}</span>
              </h3>
              
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                {(['home', 'work', 'other'] as const).map((tagKey) => (
                  <button
                    key={tagKey}
                    type="button"
                    onClick={() => setAddressTag(tagKey)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize transition cursor-pointer ${
                      addressTag === tagKey ? 'bg-white text-[#1D68ED] shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    {tagKey === 'home' ? (t.home || 'Home') : tagKey === 'work' ? (t.work || 'Work') : (t.other || 'Other')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1D68ED] bg-slate-50"
              />
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-Digit Mobile Number"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1D68ED] bg-slate-50"
              />
              <div className="relative">
                <input
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Door / Flat, Building, Street Landmark"
                  className="w-full pl-3 pr-20 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1D68ED] bg-slate-50"
                />
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#1D68ED] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                  <span>GPS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Arrival Slot Selector */}
          <div className="space-y-2.5">
            <div className="text-xs font-black text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.chooseArrivalSlot || 'Choose Arrival Slot'}</span>
              </span>
              {selectedSlot === 'custom' && customSlotDate && (
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  📅 {customSlotDate} {customSlotTime ? `@ ${customSlotTime}` : ''}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'immediate', label: t.slotExpress || '15-25 Mins Express', sub: '⚡ Express' },
                { id: 'evening', label: t.slotEvening || 'Evening 4-7 PM', sub: '4-7 PM' },
                { id: 'tomorrow', label: t.slotTomorrow || 'Tomorrow 9 AM', sub: '9 AM' },
                { id: 'custom', label: '📅 Custom Date & Time', sub: 'Manual Select' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSlot(s.id as any)}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    selectedSlot === s.id
                      ? 'border-[#1D68ED] bg-blue-50 text-[#1D68ED] font-bold shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="text-[11px] font-black">{s.label}</div>
                  <div className="text-[9px] text-slate-500">{s.sub}</div>
                </button>
              ))}
            </div>

            {/* MANUAL DATE & TIME PICKER PANEL */}
            {selectedSlot === 'custom' && (
              <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-black text-blue-900 border-b border-blue-200/80 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Select Manual Date & Time</span>
                  </span>
                  <span className="text-[10px] text-blue-600 font-bold bg-white px-2 py-0.5 rounded-md border border-blue-200">
                    Custom Schedule
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">
                      Service Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={customSlotDate}
                      onChange={(e) => setCustomSlotDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-blue-300 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-600 uppercase mb-1">
                      Service Time
                    </label>
                    <input
                      type="time"
                      value={customSlotTime}
                      onChange={(e) => setCustomSlotTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-blue-300 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Quick Time Preset Pills */}
                <div>
                  <span className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                    Quick Time Slots:
                  </span>
                  <div className="flex flex-wrap items-center gap-1">
                    {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:30 PM', '08:00 PM'].map((slotTime) => (
                      <button
                        key={slotTime}
                        type="button"
                        onClick={() => setCustomSlotTime(slotTime)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                          customSlotTime === slotTime
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white hover:bg-blue-100 text-slate-700 border-blue-200'
                        }`}
                      >
                        {slotTime}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tip Your Worker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                <span>{t.tipWorkerPartner || 'Tip Worker Partner'}</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">{t.tipNotice || '100% goes to partner'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {[0, 20, 50, 100].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setWorkerTip(amount)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-black transition cursor-pointer border ${
                    workerTip === amount
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {amount === 0 ? (t.noTip || 'No Tip') : `₹${amount}`}
                </button>
              ))}
            </div>
          </div>

          {/* Subsidy Coupon Card */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-black text-emerald-900">
                  {t.coopDirectApplied || 'COOPDIRECT Applied'}
                </div>
                <div className="text-[10px] text-emerald-700">
                  ₹{couponDiscount} {t.welfareSubsidy || 'cooperative welfare subsidy'}
                </div>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-800">-₹{couponDiscount}</span>
          </div>

          {/* Transparent Bill Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>{t.baseLabourCharge || 'Base Labour Charge'} ({totalItemsCount} items)</span>
              <span className="font-semibold text-slate-900">₹{subtotalLabor}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>{t.cooperativeWelfareFundLabel || 'Cooperative Worker Welfare (5%)'}</span>
              <span className="font-semibold text-slate-900">₹{welfareFund}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>{t.gstTaxLabel || 'GST Tax (18%)'}</span>
              <span className="font-semibold text-slate-900">₹{gstTax}</span>
            </div>

            {isEmergencySOS && (
              <div className="flex items-center justify-between text-red-600 font-bold">
                <span>Express 15-Min SOS Dispatch</span>
                <span>+₹99</span>
              </div>
            )}

            {workerTip > 0 && (
              <div className="flex items-center justify-between text-emerald-700 font-bold">
                <span>Partner Tip</span>
                <span>+₹{workerTip}</span>
              </div>
            )}

            {isCouponApplied && (
              <div className="flex items-center justify-between text-emerald-700 font-bold">
                <span>{t.directSubsidyLabel || 'Cooperative Direct Subsidy'}</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-blue-600 bg-blue-50 p-2 rounded-xl">
              <span>Middleman Corporate Cut</span>
              <span className="font-black">₹0 (Zero Fees)</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
              <span>{t.totalPayable || 'Total Payable'}</span>
              <span className="text-base text-[#1D68ED]">₹{grossTotal}</span>
            </div>
          </div>

          {/* Payment Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-800 block">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('cash')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                  paymentMode === 'cash'
                    ? 'border-[#1D68ED] bg-blue-50 text-[#1D68ED] font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-black leading-none">Cash on Arrival</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Pay after work</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('upi')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                  paymentMode === 'upi'
                    ? 'border-[#1D68ED] bg-blue-50 text-[#1D68ED] font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-black leading-none">UPI / QR Code</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">GPay, PhonePe</div>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* STICKY BOTTOM SWIGGY PROCEED TO BOOK CTA */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-[#1D68ED] hover:bg-blue-600 text-white font-black text-sm transition-all duration-200 shadow-xl shadow-blue-500/25 flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-blue-200">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </div>
              <div className="text-base font-black text-white">
                ₹{grossTotal} Total
              </div>
            </div>

            <div className="flex items-center gap-2 font-black text-sm">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Dispatching Partner...</span>
                </>
              ) : (
                <>
                  <span>{t.clickToBook || 'Click to Book Partner'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>

          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 text-center">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cooperative 30-Day Guarantee</span>
            </span>
            <span>•</span>
            <span>Free Cancellation</span>
          </div>
        </div>
      </div>
    </form>
  );
};
