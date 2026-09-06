import React, { useState } from 'react';
import { X, MapPin, CheckCircle, Navigation, Phone, ArrowRight } from 'lucide-react';

interface ServiceAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
}

const REGIONS = [
  {
    name: 'Dallas-Fort Worth Metroplex (HQ)',
    state: 'TX',
    hotline: '214-550-5563',
    coverage: ['Dallas', 'Fort Worth', 'Plano', 'Irving', 'Arlington', 'Frisco', 'McKinney'],
    status: 'Full Same-Day Dispatch'
  },
  {
    name: 'Greater Houston Area',
    state: 'TX',
    hotline: '214-550-5563',
    coverage: ['Downtown Houston', 'The Woodlands', 'Katy', 'Sugar Land', 'Pasadena'],
    status: 'Active Pro Fleet'
  },
  {
    name: 'Austin & Central Texas',
    state: 'TX',
    hotline: '214-550-5563',
    coverage: ['Austin Downtown', 'Round Rock', 'Cedar Park', 'San Marcos'],
    status: 'Active Pro Fleet'
  },
  {
    name: 'San Antonio Metro',
    state: 'TX',
    hotline: '214-550-5563',
    coverage: ['River Walk District', 'New Braunfels', 'Stone Oak'],
    status: 'Active Pro Fleet'
  },
  {
    name: 'Los Angeles & SoCal',
    state: 'CA',
    hotline: '214-550-5563',
    coverage: ['Downtown LA', 'Long Beach', 'Irvine', 'Pasadena', 'Burbank'],
    status: 'Regional Crew Network'
  },
  {
    name: 'Greater New York Metro',
    state: 'NY',
    hotline: '214-550-5563',
    coverage: ['Manhattan', 'Queens', 'Brooklyn', 'Northern NJ'],
    status: 'Commercial High-Rise Crew'
  }
];

export const ServiceAreaModal: React.FC<ServiceAreaModalProps> = ({ isOpen, onClose, onOpenQuote }) => {
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col">
        <div className="bg-[#0A1226] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] text-xs font-bold uppercase tracking-wider mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>National Footprint • Local Crews</span>
          </div>
          <h2 className="text-2xl font-black font-display text-white">Commercial Service Areas</h2>
          <p className="text-sm text-gray-300 mt-1">
            Partner Plus deploys fully insured exterior cleaning teams across leading commercial hubs.
          </p>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REGIONS.map((region) => (
              <button
                key={region.name}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`p-4 rounded-xl text-left border transition cursor-pointer ${
                  selectedRegion.name === region.name
                    ? 'border-[#00D2FF] bg-cyan-50/50 shadow-sm ring-1 ring-[#00D2FF]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-sm text-[#0F172A]">{region.name}</div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {region.status}
                </div>
                <div className="text-[11px] text-[#1D68ED] font-semibold mt-2">
                  Key areas: {region.coverage.slice(0, 3).join(', ')}...
                </div>
              </button>
            ))}
          </div>

          {/* Selected Region Focus Card */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-gray-400">Selected Hub</span>
                <h4 className="text-lg font-black text-[#0F172A]">{selectedRegion.name}</h4>
              </div>
              <a
                href={`tel:${selectedRegion.hotline.replace(/-/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-100 transition shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#1D68ED]" />
                <span>{selectedRegion.hotline}</span>
              </a>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1.5">Direct Municipal Coverage:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedRegion.coverage.map((city) => (
                  <span
                    key={city}
                    className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-md shadow-2xs"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500">
            Need service outside these zones? We coordinate regional commercial routes.
          </div>
          <button
            onClick={() => { onClose(); onOpenQuote(); }}
            className="px-5 py-2.5 bg-[#1D68ED] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <span>Request Area Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
