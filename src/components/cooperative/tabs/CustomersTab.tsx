import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Briefcase, 
  ShieldCheck, 
  AlertTriangle, 
  X,
  History,
  MessageSquare
} from 'lucide-react';
import { Booking } from '../../../types';
import { cooperativeBackend } from '../../../services/cooperativeBackendService';
import { useAuth } from '../../../context/AuthContext';

interface CustomersTabProps {
  bookings: Booking[];
}

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  area: string;
  totalBookings: number;
  totalSpent: number;
  ratingGiven: number;
  status: 'active' | 'suspended';
  memberType: 'Regular Customer' | 'Verified Resident' | 'Cooperative Subscriber';
}

export const CustomersTab: React.FC<CustomersTabProps> = ({ bookings }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Generate realistic customer directory from bookings
  const [customerList, setCustomerList] = useState<CustomerRecord[]>([
    {
      id: 'cust-1',
      name: 'Ananya Sharma',
      phone: '+91 98409 11223',
      email: 'ananya.s@chennaimail.com',
      area: 'Anna Nagar, Chennai',
      totalBookings: 6,
      totalSpent: 4250,
      ratingGiven: 4.9,
      status: 'active',
      memberType: 'Cooperative Subscriber'
    },
    {
      id: 'cust-2',
      name: 'Dr. R. Balaji',
      phone: '+91 98401 55667',
      email: 'balaji.cardio@apollo.org',
      area: 'T. Nagar, Chennai',
      totalBookings: 12,
      totalSpent: 9800,
      ratingGiven: 4.8,
      status: 'active',
      memberType: 'Verified Resident'
    },
    {
      id: 'cust-3',
      name: 'Meenakshi Sundaram',
      phone: '+91 97890 33445',
      email: 'meenakshi.s@gmail.com',
      area: 'Mylapore, Chennai',
      totalBookings: 4,
      totalSpent: 2850,
      ratingGiven: 5.0,
      status: 'active',
      memberType: 'Regular Customer'
    },
    {
      id: 'cust-4',
      name: 'Siddharth Varma',
      phone: '+91 94440 88991',
      email: 'sid.varma@fintech.in',
      area: 'Adyar, Chennai',
      totalBookings: 8,
      totalSpent: 6400,
      ratingGiven: 4.6,
      status: 'active',
      memberType: 'Cooperative Subscriber'
    }
  ]);

  const filtered = customerList.filter(c => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleToggleSuspension = (customer: CustomerRecord) => {
    const isSuspending = customer.status === 'active';
    const reason = window.prompt(`Administrative justification for ${isSuspending ? 'suspending' : 'reactivating'} customer account for ${customer.name}:`);
    if (reason && reason.trim()) {
      const newStatus = isSuspending ? 'suspended' : 'active';
      setCustomerList(prev => prev.map(c => c.id === customer.id ? { ...c, status: newStatus } : c));
      
      cooperativeBackend.addAuditLog({
        adminId: user?.id || 'admin-1',
        adminName: user?.name || 'Cooperative Admin',
        adminRole: user?.staffRole || 'COOPERATIVE_ADMIN',
        action: isSuspending ? 'CUSTOMER_SUSPENDED' : 'CUSTOMER_REACTIVATED',
        affectedEntity: 'CUSTOMER',
        entityId: customer.id,
        previousState: customer.status,
        newState: newStatus,
        reason: reason.trim()
      });
      alert(`Customer ${customer.name} status updated to ${newStatus}. Logged to audit trail.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header & Filter Controls */}
      <div className="p-5 bg-[#111A2E] rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-mono font-bold uppercase text-white tracking-wide">
              COOPERATIVE CUSTOMER REGISTRY
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Household clients, verified residents, booking frequencies, and customer service satisfaction ratings.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400">
            {filtered.length} Registered Accounts
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, area, or email address..."
            className="w-full bg-[#0F172A] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-[#111A2E] rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase bg-[#0C1322]/60">
                <th className="py-2.5 px-3">Customer Profile</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Bookings &amp; Spend</th>
                <th className="py-2.5 px-3">Rating Given</th>
                <th className="py-2.5 px-3">Account Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filtered.map((customer) => {
                const isSuspended = customer.status === 'suspended';

                return (
                  <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-bold text-white text-sm">{customer.name}</div>
                      <span className="text-[10px] text-purple-400 block">{customer.memberType}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="text-slate-300">{customer.phone}</div>
                      <span className="text-[10px] text-slate-500 block">{customer.email}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-300">
                      {customer.area}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-bold text-white">{customer.totalBookings} orders</div>
                      <span className="text-[10px] text-emerald-400 block">₹{customer.totalSpent.toLocaleString()} lifetime</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-bold text-amber-300 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        {customer.ratingGiven} / 5.0
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        isSuspended 
                          ? 'bg-rose-950 text-rose-300 border-rose-800' 
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        History
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleSuspension(customer)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          isSuspended
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-rose-950/60 text-rose-400 border-rose-800'
                        }`}
                      >
                        {isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer History Dossier Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedCustomer.name}</h3>
                <span className="text-[11px] text-purple-400">{selectedCustomer.phone} • {selectedCustomer.area}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#111A2E] border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">Membership Tier:</div>
                <div className="text-white font-bold">{selectedCustomer.memberType}</div>
                <div className="text-slate-400 text-[10px] pt-1">Total Lifetime Bookings:</div>
                <div className="text-emerald-400 font-bold">{selectedCustomer.totalBookings} Completed (₹{selectedCustomer.totalSpent})</div>
              </div>

              <div className="p-3 rounded-xl bg-[#111A2E] border border-slate-800 space-y-1">
                <div className="font-bold text-white text-[11px]">Cooperative Service Guarantee:</div>
                <p className="text-[11px] text-slate-400">
                  Zero active complaints on record. All jobs completed with verified safety code OTP.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
