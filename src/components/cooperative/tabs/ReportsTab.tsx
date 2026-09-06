import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  MapPin, 
  CheckCircle2, 
  Users, 
  Zap, 
  ShieldCheck, 
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (format: string) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`PartnerPlus Official Monthly Performance Report (${format.toUpperCase()}) downloaded successfully.`);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner with Download Options */}
      <div className="p-5 bg-[#111A2E] rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
              COOPERATIVE OPERATIONAL INTELLIGENCE &amp; AUDIT REPORTS
            </h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
              AI DEMAND OPTIMIZED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time geospatial heatmaps, member productivity indexes, welfare impact metrics, and statutory compliance audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleDownload('pdf')}
            disabled={downloading}
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official PDF</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownload('csv')}
            disabled={downloading}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Raw CSV</span>
          </button>
        </div>
      </div>

      {/* SLA & Performance Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-4 rounded-3xl bg-[#111A2E] border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase text-slate-400 block">Average Dispatch SLA</span>
          <div className="text-2xl font-bold text-emerald-400">3.8 mins</div>
          <p className="text-[11px] text-slate-400">
            Target SLA &lt; 5 mins maintained across 96.2% of emergency callouts this month.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-[#111A2E] border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase text-slate-400 block">Customer Repeat Rate</span>
          <div className="text-2xl font-bold text-sky-400">84.5%</div>
          <p className="text-[11px] text-slate-400">
            Household clients booking repeat service within 60 days via verified society artisans.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-[#111A2E] border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase text-slate-400 block">Artisan Retention</span>
          <div className="text-2xl font-bold text-purple-400">98.1%</div>
          <p className="text-[11px] text-slate-400">
            Zero attrition to commercial venture aggregators due to 95% revenue retention and welfare pool.
          </p>
        </div>
      </div>

      {/* Geospatial Demand Heatmap Analysis */}
      <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase text-white">
              GEOSPATIAL SERVICE DEMAND HEATMAP
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live sector demand spikes vs artisan availability clustering.
            </p>
          </div>
          <span className="text-[10px] font-mono text-purple-400">
            AI Heat Index
          </span>
        </div>

        <div className="space-y-3">
          {[
            { area: 'Anna Nagar / Kilpauk', trade: 'Plumbing & Emergency Breakdown', demand: 'Extreme (96%)', available: '8 Artisans', surge: '+28% monsoon spike', color: 'bg-rose-500' },
            { area: 'T. Nagar / Nungambakkam', trade: 'Electrical & AC Servicing', demand: 'High (82%)', available: '14 Artisans', surge: '+14% routine callouts', color: 'bg-amber-500' },
            { area: 'Mylapore / Santhome', trade: 'Carpentry & Heritage Restoration', demand: 'Moderate (64%)', available: '9 Artisans', surge: 'Balanced demand', color: 'bg-sky-500' },
            { area: 'Adyar / Velachery', trade: 'Deep Cleaning & Sanitization', demand: 'High (88%)', available: '12 Artisans', surge: '+22% weekend orders', color: 'bg-emerald-500' }
          ].map((item, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[#0C1322] border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold text-sm">{item.area}</span>
                  <span className="text-slate-400 text-[11px] block">{item.trade}</span>
                </div>
                <div className="text-right">
                  <span className="text-purple-400 font-bold block">{item.demand}</span>
                  <span className="text-slate-400 text-[10px]">{item.available} on call</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: item.demand.includes('96') ? '96%' : item.demand.includes('88') ? '88%' : '75%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
