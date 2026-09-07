import React from 'react';
import { 
  Hammer, 
  Search, 
  X, 
  Clock, 
  Plus, 
  Minus, 
  Users, 
  ShieldCheck,
  LucideIcon 
} from 'lucide-react';
import { soundAndSpeech } from '../../utils/soundAndSpeech';
import { useApp } from '../../context/AppContext';

export interface TaskItem {
  id: string;
  name: string;
  nameHi: string;
  nameTa: string;
  basePrice: number;
  unit: string;
  duration: string;
  description: string;
}

export interface CategoryData {
  id: string;
  name: string;
  nameHi: string;
  nameTa: string;
  icon: LucideIcon;
  desc: string;
  tasks: TaskItem[];
}

interface WorksCatalogViewProps {
  categories?: CategoryData[];
  activeCategoryId?: string;
  setActiveCategoryId?: (id: string) => void;
  filteredTasks?: { task: TaskItem; category: CategoryData }[];
  filteredTasksList?: { task: TaskItem; category: CategoryData }[];
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  cart?: Record<string, number>;
  onAddToCart?: (taskId: string) => void;
  onRemoveFromCart?: (taskId: string) => void;
  onDeleteItem?: (taskId: string) => void;
  totalItemsCount?: number;
  grossTotal?: number;
  onProceedToWorkers?: () => void;
  onProceedToCart?: () => void;
  onViewWorkers?: (categoryId?: string) => void;
  lang?: string;
  totalWorkersCount?: number;
}

export const WorksCatalogView: React.FC<WorksCatalogViewProps> = ({
  categories = [],
  activeCategoryId = '',
  setActiveCategoryId = (_id: string) => {},
  filteredTasks,
  filteredTasksList,
  searchQuery = '',
  setSearchQuery = (_q: string) => {},
  cart = {},
  onAddToCart = (_taskId: string) => {},
  onRemoveFromCart = (_taskId: string) => {},
  onProceedToWorkers,
  onViewWorkers,
  lang = 'en',
  totalWorkersCount = 0
}) => {
  const currentCategory = (categories && categories.find((c) => c.id === activeCategoryId)) || (categories && categories[0]) || {
    id: 'general',
    name: 'General Works',
    nameHi: 'सामान्य कार्य',
    nameTa: 'பொது வேலைகள்',
    icon: Hammer,
    desc: 'Cooperative verified skilled technicians at transparent government rates.',
    tasks: []
  };

  const tasksToDisplay = filteredTasks || filteredTasksList || [];

  const handleViewWorkers = (catId?: string) => {
    if (onViewWorkers) {
      onViewWorkers(catId);
    } else if (onProceedToWorkers) {
      onProceedToWorkers();
    }
  };

  const { t } = useApp();

  const getCategoryLabel = (cat: CategoryData) => {
    const key = `jobs.${cat.id}Job`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
    if (lang === 'hi' && cat.nameHi) return cat.nameHi;
    if (lang === 'ta' && cat.nameTa) return cat.nameTa;
    return cat.name;
  };

  const getTaskLabel = (task: TaskItem) => {
    const key = `jobs.${task.id}`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
    if (lang === 'hi' && task.nameHi) return task.nameHi;
    if (lang === 'ta' && task.nameTa) return task.nameTa;
    return task.name;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 pb-28">
      {/* Search & Top Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Hammer className="w-5 h-5 text-[#1D68ED]" />
              <span>1. What Kind of Works Do You Need?</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose from 50+ standardized skilled trade works • Transparent fixed rates • 0% middleman commission
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleViewWorkers(activeCategoryId)}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>See Available Workers ({totalWorkersCount}) &rarr;</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search works (e.g., tap leak, switchboard wiring, AC jet wash, bricklaying, welding, car diagnostics)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1D68ED] bg-slate-50 focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold p-1 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Pill Carousel */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <span>Select Trade Category</span>
          </span>
          <span className="text-[11px] font-bold text-[#1D68ED]">
            {(categories || []).length} Skilled Trade Categories
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(categories || []).map((cat) => {
            const isSelected = activeCategoryId === cat.id;
            const IconComp = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setSearchQuery('');
                  soundAndSpeech.playChime('click');
                }}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-[#1D68ED] text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400 scale-102'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                }`}
              >
                <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                <span>{getCategoryLabel(cat)}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {cat.tasks ? cat.tasks.length : 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Spotlight & Available Nearby Crew Badge */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1D68ED] text-white flex items-center justify-center shrink-0 shadow-sm">
            <currentCategory.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-slate-900">
                {getCategoryLabel(currentCategory)}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 text-[10px] font-black border border-emerald-300">
                ₹0 Middleman Fee
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentCategory.desc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleViewWorkers(currentCategory.id)}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>View {getCategoryLabel(currentCategory)} Crew &rarr;</span>
        </button>
      </div>

      {/* Tasks / Works Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span>Available Works ({(tasksToDisplay || []).length})</span>
          </h3>
          <span className="text-xs text-slate-500">
            Click <strong className="text-blue-600">+ ADD</strong> to add to booking cart
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(tasksToDisplay || []).map(({ task, category }) => {
            const qtyInCart = cart[task.id] || 0;
            const CatIcon = category.icon;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col justify-between gap-3 bg-white ${
                  qtyInCart > 0
                    ? 'border-[#1D68ED] shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                      <CatIcon className="w-3 h-3 text-blue-600" />
                      <span>{getCategoryLabel(category)}</span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{task.duration}</span>
                    </span>
                  </div>

                  {/* Task Title */}
                  <h4 className="text-sm font-black text-slate-900 leading-snug">
                    {getTaskLabel(task)}
                  </h4>
                  {lang !== 'en' && (
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {task.name}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Price & Stepper CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-base font-black text-slate-900">
                      ₹{task.basePrice}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      per {task.unit}
                    </div>
                  </div>

                  {/* Swiggy / Zomato ADD / Stepper */}
                  <div className="flex items-center gap-2">
                    {qtyInCart > 0 ? (
                      <div className="inline-flex items-center bg-[#1D68ED] text-white rounded-xl shadow-sm border border-blue-600 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onRemoveFromCart(task.id)}
                          className="px-2.5 py-1.5 hover:bg-blue-700 transition cursor-pointer text-white"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <span className="px-3 py-1 text-xs font-black min-w-[24px] text-center">
                          {qtyInCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => onAddToCart(task.id)}
                          className="px-2.5 py-1.5 hover:bg-blue-700 transition cursor-pointer text-white"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToCart(task.id)}
                        className="px-4 py-2 bg-blue-50 hover:bg-[#1D68ED] text-[#1D68ED] hover:text-white font-black text-xs rounded-xl border border-blue-200 transition-all duration-150 shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
