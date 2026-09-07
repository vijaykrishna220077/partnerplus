import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Filter, 
  SlidersHorizontal, 
  Star, 
  Zap, 
  ShieldCheck, 
  ArrowUpDown, 
  Clock, 
  X, 
  Info,
  Building2 
} from 'lucide-react';
import { ServiceCategory } from '../types';
import { ServiceIcon } from '../components/ServiceIcon';
import { WorkerCard } from '../components/WorkerCard';
import { getLocalizedServiceName, getLocalizedServiceDesc } from '../utils/localization';

export const ServicesSearch: React.FC = () => {
  const { 
    services, 
    workers, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    currentLocation, 
    openLocationPicker, 
    openBooking, 
    t,
    lang 
  } = useApp();

  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'price_low' | 'experience'>('rating');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState<boolean>(false);
  const [onlyEmergencyReady, setOnlyEmergencyReady] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Filter & sort logic
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory = w.primarySkill === selectedCategory || w.otherSkills.includes(selectedCategory);
        if (!matchesCategory) return false;
      }

      // Keyword query search (name, skill, bio, cooperative)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = w.name.toLowerCase().includes(q);
        const matchesSkill = w.primarySkillLabel.toLowerCase().includes(q);
        const matchesCoop = w.cooperativeName.toLowerCase().includes(q);
        const matchesArea = w.locationArea.toLowerCase().includes(q);
        const matchesBio = w.bio.toLowerCase().includes(q);
        if (!matchesName && !matchesSkill && !matchesCoop && !matchesArea && !matchesBio) return false;
      }

      // Availability filters
      if (onlyAvailableToday && !w.isAvailableToday) return false;
      if (onlyEmergencyReady && !w.isEmergencyReady) return false;
      if (minRating > 0 && w.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'price_low') return a.startingPrice - b.startingPrice;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      return 0;
    });
  }, [workers, selectedCategory, searchQuery, onlyAvailableToday, onlyEmergencyReady, minRating, sortBy]);

  const activeServiceObj = services.find(s => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search & Location Header in Editorial Style */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by worker name, skill, trade (e.g. Electrician, Geyser, Motor repair)..."
              className="w-full pl-12 pr-10 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 text-sm text-[#121212] placeholder-gray-400 outline-none font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1.5 text-gray-400 hover:text-black rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openLocationPicker}
              className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200/80 border border-gray-200 text-xs font-bold text-gray-800 transition shrink-0 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate max-w-[160px]">{currentLocation}</span>
            </button>

            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden p-4 rounded-2xl bg-gray-100 text-gray-800 hover:bg-gray-200"
              title="Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pill Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full font-bold transition shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {t("common.all") || "All Categories"} ({workers.length})
          </button>

          {services.map(srv => {
            const isSelected = selectedCategory === srv.category;
            return (
              <button
                key={srv.id}
                onClick={() => setSelectedCategory(srv.category)}
                className={`px-4 py-2 rounded-full font-bold transition shrink-0 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ServiceIcon name={srv.icon} className="w-3.5 h-3.5" />
                <span>{getLocalizedServiceName(srv, lang, t)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Category Guideline Banner */}
      {activeServiceObj && (
        <div className="bg-[#121212] text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center text-blue-400 shrink-0 border border-neutral-700">
              <ServiceIcon name={activeServiceObj.icon} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-serif text-white">{getLocalizedServiceName(activeServiceObj, lang, t)}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-700/50">
                  {t("landing.guaranteedCooperative") || "Standard Rate"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 font-light">
                {getLocalizedServiceDesc(activeServiceObj, lang, t)} • {t("jobs.duration") || "Standard visit duration"} ~{activeServiceObj.typicalDurationMinutes || activeServiceObj.estimatedDuration || 60}
              </p>
            </div>
          </div>

          <div className="bg-neutral-800/80 px-5 py-3 rounded-2xl text-right shrink-0 border border-neutral-700 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">{t("booking.baseLabourCharge") || "Guideline Base Rate"}</span>
            <span className="text-xl font-black text-white font-serif">₹{activeServiceObj.startingPrice} {t("landing.priceTagline") || activeServiceObj.unit}</span>
          </div>
        </div>
      )}

      {/* Main Content Layout: Filters Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Column */}
        <div className={`space-y-6 lg:block ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#121212] font-bold text-xs uppercase tracking-wider">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>{t("worker.filterWorkers") || "Filter Workers"}</span>
              </div>
              {(onlyAvailableToday || onlyEmergencyReady || minRating > 0 || searchQuery) && (
                <button
                  onClick={() => {
                    setOnlyAvailableToday(false);
                    setOnlyEmergencyReady(false);
                    setMinRating(0);
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Quick Toggle Switches */}
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Available Today Only
                </span>
                <input
                  type="checkbox"
                  checked={onlyAvailableToday}
                  onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition">
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-red-600" />
                  15-Min Express Ready
                </span>
                <input
                  type="checkbox"
                  checked={onlyEmergencyReady}
                  onChange={(e) => setOnlyEmergencyReady(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
              </label>
            </div>

            {/* Rating Filter */}
            <div>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-2">
                Minimum Rating
              </span>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[0, 4.5, 4.8, 4.9].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`py-2 rounded-xl font-bold border transition text-center cursor-pointer ${
                      minRating === r
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-black'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {r === 0 ? 'All' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Society Guarantee Box */}
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-1.5 text-[11px] text-blue-950">
              <div className="flex items-center gap-1.5 font-bold text-blue-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>100% Cooperative Verified</span>
              </div>
              <p className="text-blue-900/80 leading-relaxed font-light">
                All workers undergo police clearance, DigiLocker verification, and NSDC skill appraisal before assignment.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Search Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Count & Sort Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-gray-200">
            <div className="text-xs text-gray-600">
              Showing <strong className="text-[#121212] font-bold">{filteredWorkers.length}</strong> verified cooperative workers
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-semibold flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-2 bg-gray-50 rounded-full border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="rating">Highest Rating (★ 5.0)</option>
                <option value="distance">Nearest Distance (GPS)</option>
                <option value="price_low">Lowest Price (₹)</option>
                <option value="experience">Most Experienced (Years)</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {filteredWorkers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#121212] font-serif">No Workers Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 font-light">
                  We could not find any active workers matching your selected filters. Try clearing your search query or reset filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyAvailableToday(false);
                  setOnlyEmergencyReady(false);
                  setMinRating(0);
                }}
                className="px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-full font-bold text-xs shadow-sm transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
