import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, ArrowUp } from 'lucide-react';
import { PartnerPlusLogo } from './PartnerPlusLogo';

interface PartnerPlusFooterProps {
  onOpenPrices: () => void;
  onOpenPhone: () => void;
  onOpenProProvider: () => void;
  onOpenServiceArea: () => void;
}

export const PartnerPlusFooter: React.FC<PartnerPlusFooterProps> = ({
  onOpenPrices,
  onOpenPhone,
  onOpenProProvider,
  onOpenServiceArea
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070D1E] text-white border-t border-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <PartnerPlusLogo isLight />
            <p className="text-xs text-gray-400 leading-relaxed">
              Commercial pressure washing, window cleaning, and mobile fleet wash solutions. Protecting asset value and elevating curb appeal nationwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#00D2FF] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>EPA Compliant &amp; $2M Insured</span>
            </div>
          </div>

          {/* Col 2: Commercial Services */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-300 mb-4">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={onOpenPrices} className="hover:text-white transition cursor-pointer">Commercial Pressure Washing</button></li>
              <li><button onClick={onOpenPrices} className="hover:text-white transition cursor-pointer">High-Rise Window Cleaning</button></li>
              <li><button onClick={onOpenPrices} className="hover:text-white transition cursor-pointer">Mobile Fleet Washing</button></li>
              <li><button onClick={onOpenPrices} className="hover:text-white transition cursor-pointer">Concrete &amp; Sidewalk Restoration</button></li>
              <li><button onClick={onOpenPrices} className="hover:text-white transition cursor-pointer">Dumpster Pad &amp; Oil Degreasing</button></li>
            </ul>
          </div>

          {/* Col 3: Company & Providers */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-300 mb-4">
              Partners &amp; Coverage
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={onOpenProProvider} className="hover:text-white transition cursor-pointer">Join The Pro Providers</button></li>
              <li><button onClick={onOpenServiceArea} className="hover:text-white transition cursor-pointer">Service Areas &amp; Hubs</button></li>
              <li><button onClick={onOpenPrices} className="hover:text-white transition cursor-pointer">Get Instant Rate Estimate</button></li>
              <li><a href="#about-us" className="hover:text-white transition">Customer Reviews</a></li>
              <li><span className="text-gray-500">Commercial Safety Manual</span></li>
            </ul>
          </div>

          {/* Col 4: Direct Dispatch Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-300 mb-4">
              Commercial Dispatch
            </h4>
            <div
              onClick={onOpenPhone}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <div className="text-[10px] text-[#00D2FF] font-bold uppercase tracking-wider">Direct Hotline</div>
              <div className="text-lg font-black text-white font-display flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#00D2FF]" />
                <span>214-550-5563</span>
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">24/7 National Dispatch Service</div>
            </div>

            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Dallas-Fort Worth Metroplex • Regional Depots</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>dispatch@partnerpluscommercial.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} partnerplus Exterior Cleaning LLC. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition ml-2"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
