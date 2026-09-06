import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';

export const PartnerPlusReviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Shahid Miah',
      location: 'Los Angeles, CA',
      role: 'Property Operations Manager',
      quote: 'Partner Plus is an exceptionally professional company that offers quick turnaround!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160',
      facility: 'Wilshire Commercial Center'
    },
    {
      id: 2,
      name: 'Paul S.',
      location: 'New York, NY',
      role: 'Commercial Facility Director',
      quote: 'Partner Plus fit my schedule and did a great job cleaning the exterior brick and windows!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=160',
      facility: 'Midtown Retail Plaza'
    },
    {
      id: 3,
      name: 'Dianna Delp',
      location: 'Los Angeles, CA',
      role: 'Asset Leasing Director',
      quote: 'They did an excellent job preparing our commercial property ready to lease.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=160',
      facility: 'Pacific Office Lofts'
    },
    {
      id: 4,
      name: 'Marcus Vance',
      location: 'Dallas, TX',
      role: 'Fleet & Logistics Coordinator',
      quote: 'Our commercial fleet of 40+ delivery vans looks immaculate every single week.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=160',
      facility: 'DFW Logistics Hub'
    },
    {
      id: 5,
      name: 'Elena Rostova',
      location: 'Chicago, IL',
      role: 'Hospitality Operations Lead',
      quote: 'The high-pressure sidewalk cleaning removed 10 years of grease and grime in one night.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=160',
      facility: 'Grand Hotel & Promenade'
    }
  ];

  return (
    <section id="about-us" className="py-16 sm:py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with 5 Cyan Stars */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* 5 Cyan Stars */}
          <div className="flex items-center justify-center gap-1.5 mb-3 text-[#00D2FF]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#00D2FF]" />
            ))}
          </div>

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-50 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-3">
            <span>👑</span>
            <span>WE MAKE SURE OUR CLIENT IS HAPPY</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight font-display">
            Customer Satisfaction Is Our #1 Priority.
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Read direct feedback from commercial property managers, asset holders, and fleet directors across America.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#F8FAFC] hover:bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars for Card */}
                <div className="flex items-center gap-1 text-[#00D2FF] mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#00D2FF]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              {/* Author Info */}
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
              <div className="text-sm font-extrabold text-[#0F172A]">100% Workmanship Quality Guarantee</div>
              <div className="text-xs text-gray-600">If any surface does not meet specs, our crew will re-service at zero additional cost.</div>
            </div>
          </div>
          <div className="text-xs font-bold text-[#1D68ED] whitespace-nowrap">
            Commercial Cert: #PP-VERIFIED
          </div>
        </div>
      </div>
    </section>
  );
};
