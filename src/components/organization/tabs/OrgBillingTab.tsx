import React, { useState } from 'react';
import { 
  IndianRupee, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Calendar,
  Eye,
  AlertCircle
} from 'lucide-react';
import { OrganizationProfile, OrganizationProject, OrganizationWorkRequest } from '../../../types';

interface OrgBillingTabProps {
  organization: OrganizationProfile | null;
  projects: OrganizationProject[];
  workRequests: OrganizationWorkRequest[];
}

export const OrgBillingTab: React.FC<OrgBillingTabProps> = ({
  organization,
  projects,
  workRequests
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Compute aggregated financials
  const allAssignments = workRequests.flatMap(r => r.assignments);
  const totalGrossLaborCost = allAssignments.reduce((sum, a) => sum + (a.dailyEarnings || 0) * (a.hoursWorked ? Math.ceil(a.hoursWorked / 8) : 1), 0);
  
  // Statutory breakdown: 90% Worker Direct, 5% Cooperative Admin, 5% Artisan Welfare Fund
  const workerShare = Math.round(totalGrossLaborCost * 0.90);
  const coopShare = Math.round(totalGrossLaborCost * 0.05);
  const welfareShare = Math.round(totalGrossLaborCost * 0.05);
  const gst = Math.round(coopShare * 0.18); // 18% GST on cooperative facilitation only

  const mockInvoices = [
    {
      id: 'INV-ORG-2026-0881',
      date: '05 Sep 2026',
      period: '01 Sep 2026 – 05 Sep 2026',
      project: 'Warehouse Expansion & Material Handling Hub',
      workersCount: 22,
      grossAmount: totalGrossLaborCost,
      workerShare,
      welfareShare,
      coopShare,
      gst,
      netPayable: totalGrossLaborCost + gst,
      status: 'PENDING_APPROVAL'
    },
    {
      id: 'INV-ORG-2026-0840',
      date: '28 Aug 2026',
      period: '15 Aug 2026 – 28 Aug 2026',
      project: 'SIDCO Logistics Warehouse Dispatch',
      workersCount: 18,
      grossAmount: 184500,
      workerShare: 166050,
      welfareShare: 9225,
      coopShare: 9225,
      gst: 1660,
      netPayable: 186160,
      status: 'PAID'
    },
    {
      id: 'INV-ORG-2026-0792',
      date: '14 Aug 2026',
      period: '01 Aug 2026 – 14 Aug 2026',
      project: 'Avinashi Road IT Park Facilities Upgrade',
      workersCount: 12,
      grossAmount: 115000,
      workerShare: 103500,
      welfareShare: 5750,
      coopShare: 5750,
      gst: 1035,
      netPayable: 116035,
      status: 'PAID'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Workforce Billing &amp; Settlement Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent breakdown: Direct-to-artisan escrow, 5% statutory welfare reserve, and ₹0 private middleman commission.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>GSTIN: {organization?.gstNumber || '33AAACL1234F1Z8'}</span>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Invoiced</span>
          <div className="mt-2 text-2xl font-black text-slate-900">
            ₹{(mockInvoices.reduce((a, i) => a + i.netPayable, 0)).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">FY 2026-27 to date</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Direct Artisan Payroll (90%)</span>
          <div className="mt-2 text-2xl font-black text-emerald-600">
            ₹{(mockInvoices.reduce((a, i) => a + i.workerShare, 0)).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Transferred to Bank Accounts</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Welfare Fund Reserve (5%)</span>
          <div className="mt-2 text-2xl font-black text-purple-600">
            ₹{(mockInvoices.reduce((a, i) => a + i.welfareShare, 0)).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">PMSBY &amp; Social Security Pool</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cooperative Admin (5%)</span>
          <div className="mt-2 text-2xl font-black text-slate-900">
            ₹{(mockInvoices.reduce((a, i) => a + i.coopShare, 0)).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Field Dispatch &amp; Dispute Desk</span>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">
            Commercial Workforce Tax Invoices
          </h3>
          <span className="text-xs text-slate-500">
            Compliant with Tamil Nadu Cooperative Societies Act
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Invoice Ref</th>
                <th className="px-5 py-3">Date &amp; Period</th>
                <th className="px-5 py-3">Project Site</th>
                <th className="px-5 py-3">Workers</th>
                <th className="px-5 py-3">Worker Direct (90%)</th>
                <th className="px-5 py-3">Welfare (5%)</th>
                <th className="px-5 py-3">Net Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                    {inv.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-900">{inv.date}</div>
                    <div className="text-[11px] text-slate-400">{inv.period}</div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {inv.project}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {inv.workersCount} Artisans
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-600">
                    ₹{inv.workerShare.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-purple-600">
                    ₹{inv.welfareShare.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 font-black text-slate-900">
                    ₹{inv.netPayable.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status === 'PAID' ? 'PAID & SETTLED' : 'PENDING APPROVAL'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase">Cooperative Tax Invoice</span>
                <h3 className="font-black text-base text-slate-900">{selectedInvoice.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block">Billed To:</span>
                  <span className="font-bold text-slate-900">{organization?.registeredName || organization?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Issuing Authority:</span>
                  <span className="font-bold text-slate-900">Chennai Central Labour Cooperative Society</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Gross Artisan Payroll ({selectedInvoice.workersCount} workers):</span>
                  <span>₹{selectedInvoice.grossAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Direct Artisan Transfer (90%):</span>
                  <span>₹{selectedInvoice.workerShare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-purple-700 font-semibold">
                  <span>Statutory Worker Welfare Fund (5%):</span>
                  <span>₹{selectedInvoice.welfareShare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cooperative Operations &amp; Dispute Desk (5%):</span>
                  <span>₹{selectedInvoice.coopShare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18% on Cooperative facilitation fee):</span>
                  <span>₹{selectedInvoice.gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-300 flex justify-between font-black text-sm text-slate-900">
                  <span>Total Net Payable:</span>
                  <span>₹{selectedInvoice.netPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('Tax invoice downloaded.');
                  setSelectedInvoice(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official PDF Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
