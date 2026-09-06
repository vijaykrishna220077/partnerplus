import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Award, 
  Building2, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  Globe, 
  HeartHandshake, 
  FileBadge, 
  ShieldAlert, 
  Clock, 
  DollarSign, 
  MessageSquareQuote 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const WorkerProfileModal: React.FC = () => {
  const { 
    selectedWorkerForProfile, 
    closeWorkerProfile, 
    openBooking, 
    t, 
    openEmergency 
  } = useApp();

  if (!selectedWorkerForProfile) return null;
  const worker = selectedWorkerForProfile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Header */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8">
          <button
            onClick={closeWorkerProfile}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={worker.photoUrl}
                alt={worker.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white/90 shadow-md"
              />
              {worker.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full border-2 border-white shadow-xs font-bold" title="Cooperative Verified">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-2xl font-black font-serif tracking-tight text-white">
                  {worker.name}
                </h2>
                {worker.isVerified && (
                  <span className="bg-emerald-400/20 text-emerald-100 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-300/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    Verified Worker
                  </span>
                )}
              </div>

              <p className="text-emerald-100 font-medium text-sm">
                {worker.primarySkillLabel}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-100/90 pt-1">
                <Building2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{worker.cooperativeName}</span>
              </div>
              <p className="text-[11px] text-emerald-200/70 font-mono">
                Reg No: {worker.cooperativeRegNo}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 mt-6 pt-5 border-t border-emerald-600/50 text-center text-xs">
            <div className="bg-white/10 rounded-xl p-2">
              <div className="flex items-center justify-center gap-1 font-bold text-amber-300 text-sm">
                <Star className="w-4 h-4 fill-amber-300" />
                <span>{worker.rating}</span>
              </div>
              <span className="text-[10px] text-emerald-100 mt-0.5 block">{t.rating}</span>
            </div>

            <div className="bg-white/10 rounded-xl p-2">
              <span className="font-bold text-white text-sm">{worker.jobsCompleted}</span>
              <span className="text-[10px] text-emerald-100 mt-0.5 block">Jobs Completed</span>
            </div>

            <div className="bg-white/10 rounded-xl p-2">
              <span className="font-bold text-white text-sm">{worker.experienceYears} yrs</span>
              <span className="text-[10px] text-emerald-100 mt-0.5 block">Experience</span>
            </div>

            <div className="bg-white/10 rounded-xl p-2">
              <span className="font-bold text-white text-sm">{worker.distanceKm} km</span>
              <span className="text-[10px] text-emerald-100 mt-0.5 block">{worker.locationArea}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[50vh] text-sm text-slate-700">
          {/* About / Bio */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-2">
              Professional Background
            </h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs sm:text-sm">
              {worker.bio}
            </p>
          </div>

          {/* Cooperative & Govt Certifications */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileBadge className="w-4 h-4 text-emerald-600" />
              <span>Skill Certifications & Legal Badges</span>
            </h4>
            <div className="space-y-2">
              {worker.certifications.map((c, i) => (
                <div key={i} className="flex items-start justify-between bg-emerald-50/70 border border-emerald-200/70 p-3 rounded-xl gap-3">
                  <div>
                    <h5 className="font-bold text-emerald-950 text-xs sm:text-sm">{c.title}</h5>
                    <p className="text-xs text-emerald-800 mt-0.5">Issued by {c.issuedBy} ({c.year})</p>
                  </div>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-700 font-semibold shrink-0">
                    {c.certificateId}
                  </span>
                </div>
              ))}

              <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Police Verified
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Digilocker Aadhaar Linked
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> PMSBY Welfare Insured
                </span>
              </div>
            </div>
          </div>

          {/* Specific Skill Matrix */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-2">
              Specialized Skills
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {worker.skillsList.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                  <span className="font-medium text-slate-800">{skill.name}</span>
                  <span className="text-[11px] text-slate-500 font-semibold">{skill.experienceYears}+ yrs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages & Service Area */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
                Languages Spoken
              </span>
              <p className="font-medium text-slate-800">{worker.languages.join(', ')}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
                Service Area
              </span>
              <p className="font-medium text-slate-800">{worker.locationArea}, {worker.city}</p>
            </div>
          </div>

          {/* Customer Reviews */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Customer Reviews ({(worker.reviews || []).length})</span>
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                {worker.rating} / 5.0
              </span>
            </h4>
            <div className="space-y-3">
              {(worker.reviews || []).map((rev) => (
                <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{rev.customerName}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {rev.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-medium bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400 ml-auto">{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-50 p-5 sm:p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block leading-none">
              Standard Co-op Inspection Fee
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900">₹{worker.startingPrice}</span>
              <span className="text-xs text-slate-500 font-medium">/ initial service visit</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {worker.isEmergencyReady && (
              <button
                onClick={() => {
                  closeWorkerProfile();
                  openEmergency();
                }}
                className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition"
              >
                15-Min Urgent
              </button>
            )}
            <button
              onClick={() => {
                const targetWorker = worker;
                closeWorkerProfile();
                openBooking(targetWorker);
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.bookNow}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
