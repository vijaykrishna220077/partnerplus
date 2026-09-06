import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Download, 
  Share2, 
  Printer, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  QrCode, 
  HeartHandshake 
} from 'lucide-react';
import { Booking } from '../types';

export const InvoiceModal: React.FC = () => {
  const { activeInvoiceBooking, closeInvoice, addToast } = useApp();

  if (!activeInvoiceBooking) return null;
  const booking = activeInvoiceBooking;

  const invoiceNo = `INV-COOP-${booking.bookingCode.replace('SS-', '')}`;
  const currentDate = booking.statusTimestamps.completedAt || new Date().toISOString().split('T')[0];

  const serviceCharge = booking.pricing.serviceCharge || 0;
  const workerEarnings = booking.pricing.workerEarnings || Math.round(serviceCharge * 0.95);
  const welfareFund = booking.pricing.cooperativeWelfareFund || (serviceCharge - workerEarnings);
  const gstAmount = (booking.pricing.taxGST && booking.pricing.taxGST > 0) 
    ? booking.pricing.taxGST 
    : Math.round(serviceCharge * 0.05);
  const totalAmount = (booking.pricing.totalAmount && booking.pricing.totalAmount > serviceCharge)
    ? booking.pricing.totalAmount
    : (serviceCharge + gstAmount);

  const handleDownloadInvoice = () => {
    window.print();
    addToast({
      type: 'info',
      title: 'Invoice Download',
      message: 'Print / Save as PDF dialog initiated.'
    });
  };

  const handleShareInvoice = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`PartnerPlus Official Invoice: ${invoiceNo} | Service: ${booking.serviceName} | Amount: ₹${totalAmount}`);
    }
    addToast({
      type: 'success',
      title: 'Invoice Link Copied',
      message: 'Invoice details copied to clipboard. Ready to share via WhatsApp / SMS.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 print:shadow-none print:border-none print:m-0">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold font-serif text-white">
              Official Cooperative Tax Invoice
            </h3>
          </div>
          <button
            onClick={closeInvoice}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-800" id="printable-invoice">
          {/* Top Organization Details */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 font-serif">PartnerPlus</span>
                <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Co-op Federation
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-700 mt-1">{booking.cooperativeName}</p>
              <p className="text-[10px] text-slate-500">Reg No: TN-LCS-442/2014 | GSTIN: 33AAATC8891C1ZV</p>
              <p className="text-[10px] text-slate-500">Registered under State Cooperative Societies Act</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[11px] uppercase tracking-wider">
                ✓ Paid in Full
              </span>
              <div className="mt-2 text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Invoice No</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{invoiceNo}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Date: {currentDate}</span>
              </div>
            </div>
          </div>

          {/* Customer & Worker Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Customer Details</span>
              <h5 className="font-bold text-slate-900 text-xs">{booking.customerName}</h5>
              <p className="text-[11px] text-slate-600">{booking.customerPhone}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{booking.address.street}, {booking.address.area}, {booking.address.city} - {booking.address.pincode}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Service Professional</span>
              <h5 className="font-bold text-slate-900 text-xs">{booking.workerName}</h5>
              <p className="text-[11px] text-emerald-800 font-semibold">Verified Co-op Skilled Worker</p>
              <p className="text-[11px] text-slate-500">{booking.cooperativeName}</p>
            </div>
          </div>

          {/* Service Line Item Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-[10px] uppercase text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Description of Service</th>
                  <th className="p-3 text-center">Category</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{booking.serviceName}</span>
                    <span className="text-[11px] text-slate-500">{booking.problemDescription}</span>
                  </td>
                  <td className="p-3 text-center capitalize text-slate-600">{booking.serviceCategory}</td>
                  <td className="p-3 text-right font-bold text-slate-900">₹{booking.pricing.serviceCharge}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Breakdown calculation */}
          <div className="space-y-1.5 border-t border-slate-200 pt-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Direct Worker Service Fee (95%)</span>
              <span>₹{workerEarnings}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                Cooperative Welfare & Accident Reserve (5%)
              </span>
              <span>₹{welfareFund}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Government GST (5%)</span>
              <span>₹{gstAmount}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t border-slate-300 pt-2">
              <span>Total Amount Paid</span>
              <span className="text-base text-emerald-700">₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Method & Security Seal */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment Method</span>
              <span className="font-bold text-slate-800 uppercase text-xs">
                {booking.payment.method} ({booking.payment.transactionId || 'SANDBOX-COOP-OK'})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-slate-700" />
              <div className="text-[10px] text-slate-500 leading-tight">
                <span>Digitally Signed</span>
                <span className="block font-semibold text-emerald-800">Govt SIH Standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-slate-50 p-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={handleShareInvoice}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Invoice</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={closeInvoice}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition"
            >
              Done
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download / Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
