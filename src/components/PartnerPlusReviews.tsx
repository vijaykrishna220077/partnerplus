import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PartnerPlusReviews: React.FC = () => {
  const { t } = useApp();

  const reviews = [
    {
      id: 1,
      name: 'Shahid Miah',
      location: 'Peelamedu, Coimbatore',
      role: 'Property Operations Manager',
      quote: 'Sahakari Seva is an exceptionally professional platform that offers quick turnaround and genuine verified workers!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160',
      facility: 'Commercial Center'
    },
    {
      id: 2,
      name: 'Paul S.',
      location: 'Anna Nagar, Chennai',
      role: 'Commercial Facility Director',
      quote: 'Sahakari Seva fit my schedule and did a great job with electrical and plumbing repairs!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160',
      facility: 'Midtown Retail Plaza'
    },
    {
      id: 3,
      name: 'Dianna Delp',
      location: 'Gandhipuram, Coimbatore',
      role: 'Asset Director',
      quote: 'They did an excellent job preparing our residential property ready for new tenants.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160',
      facility: 'Office Lofts'
    }
  ];

  return (
    <section id="about-us" className="py-16 sm:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with 5 Cyan Stars */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-1.5 mb-3 text-[#00D2FF]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#00D2FF]" />
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-50 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-3">
            <span>👑</span>
            <span>{t("landing.guaranteedCooperative")}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight font-display">
            {t("landing.customerReviewsTitle")}
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            {t("landing.cooperativeGuaranteeTitle")}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#F8FAFC] hover:bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#00D2FF] mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#00D2FF]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200/60 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0F172A] truncate">{rev.name}</div>
                  <div className="text-[11px] text-gray-500 truncate">{rev.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Verification Guarantee Strip */}
        <div className="mt-12 p-4 sm:p-5 bg-blue-50/70 border border-blue-100 rounded-2xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1D68ED] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#0F172A]">{t("landing.guaranteedCooperative")}</div>
              <div className="text-xs text-gray-600">{t("landing.heroSub")}</div>
            </div>
          </div>
          <div className="text-xs font-bold text-[#1D68ED] whitespace-nowrap">
            {t("common.verified")}
          </div>
        </div>
      </div>
    </section>
  );
};
