'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  CheckSquare, 
  Building2, 
  MapPin, 
  Tag, 
  DollarSign, 
  Users, 
  Check, 
  X, 
  AlertCircle,
  Eye,
  Clock,
  Sparkles,
  Loader2
} from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

type PartnerService = {
  id: string;
  partnerId: string;
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  pricing: number;
  pricingUnit: string;
  capacity?: number;
  images: string[];
  location: string;
  city: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  adminRemarks?: string;
  createdAt: string;
  partner?: {
    id: string;
    name: string;
    businessName: string;
    email: string;
    phone: string;
    location: string;
    isVerified: boolean;
  };
};

export default function ListingApprovalsPage() {
  const [services, setServices] = useState<PartnerService[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<PartnerService | null>(null);
  const [rejectingService, setRejectingService] = useState<PartnerService | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const [toastMsg, setToastMsg] = useState<{ title: string; type: 'success' | 'error' } | null>(null);

  const showToast = (title: string, type: 'success' | 'error') => {
    setToastMsg({ title, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/v1/partners/admin/services');
      if (res.ok) {
        const json = await res.json();
        setServices(Array.isArray(json.data) ? json.data : (json.services || []));
      } else {
        setServices([]);
      }
    } catch (error) {
      showToast('Failed to fetch partner services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setSubmittingAction(true);
      const res = await authFetch(`/api/v1/partners/admin/services/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      if (res.ok) {
        showToast('Service approved and published successfully!', 'success');
        setServices(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
      } else {
        const json = await res.json().catch(() => ({}));
        showToast(json.error || 'Failed to approve service', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error occurred', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingService) return;

    try {
      setSubmittingAction(true);
      const res = await authFetch(`/api/v1/partners/admin/services/${rejectingService.id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', remarks: rejectReason }),
      });

      if (res.ok) {
        showToast('Service rejected with remarks', 'success');
        setServices(prev => prev.map(s => s.id === rejectingService.id ? { ...s, status: 'REJECTED', adminRemarks: rejectReason } : s));
        setRejectingService(null);
        setRejectReason('');
      } else {
        const json = await res.json().catch(() => ({}));
        showToast(json.error || 'Failed to reject service', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error occurred', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  const filteredServices = services.filter(s => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      s.name.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query) ||
      s.partner?.businessName?.toLowerCase().includes(query) ||
      s.partner?.name?.toLowerCase().includes(query) ||
      s.city?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 md:p-10 font-sans relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-center gap-3 text-sm font-medium z-50 ${
              toastMsg.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
                : 'bg-red-950/90 text-red-300 border-red-500/30'
            }`}
          >
            {toastMsg.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
            {toastMsg.title}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-rose-500" />
              Service & Listing Approvals
            </h1>
            <p className="text-sm text-zinc-400 mt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              Review vendor services, venues, catering packages, and decor offerings before they go live on happylokam.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-rose-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search service, partner, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all placeholder:text-zinc-600 shadow-inner"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {(['ALL', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'] as const).map(tab => {
            const count = tab === 'ALL' 
              ? services.length 
              : services.filter(s => s.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition uppercase cursor-pointer whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.replace('_', ' ')}
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  statusFilter === tab ? 'bg-white/20 text-white' : 'bg-white/10 text-zinc-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table / Grid */}
        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
          {loading ? (
            <div className="py-20 text-center text-zinc-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-rose-500" /> Loading partner services...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="py-20 text-center text-zinc-500">
              <CheckSquare className="w-12 h-12 mx-auto text-zinc-700 mb-2" />
              No services found matching this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-white/[0.03] text-xs font-semibold text-zinc-300 uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Service Details</th>
                    <th className="px-6 py-4">Partner</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Pricing</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredServices.map(service => (
                    <tr key={service.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white text-base">{service.name}</div>
                        <div className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{service.description}</div>
                        {service.capacity && (
                          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                            <Users className="w-3 h-3 text-rose-400" /> Capacity: {service.capacity} guests
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-zinc-200">{service.partner?.businessName || service.partner?.name || 'Unknown Partner'}</div>
                        <div className="text-xs text-zinc-500">{service.partner?.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <Tag className="w-3 h-3" /> {service.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono">
                        <div className="text-white font-bold text-base">₹{service.pricing.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-zinc-500 uppercase">{service.pricingUnit.replace('_', ' ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <div className="flex items-center gap-1 text-zinc-300">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {service.city || service.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          service.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : service.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {service.status.replace('_', ' ')}
                        </span>
                        {service.adminRemarks && (
                          <div className="text-[10px] text-zinc-500 mt-1 italic">Note: {service.adminRemarks}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedService(service)}
                            title="Inspect Details"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {service.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleApprove(service.id)}
                              disabled={submittingAction}
                              title="Approve Service"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}

                          {service.status !== 'REJECTED' && (
                            <button
                              onClick={() => setRejectingService(service)}
                              disabled={submittingAction}
                              title="Reject Service"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold transition"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-zinc-300 shadow-2xl relative"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedService.name}</h3>
                  <p className="text-xs text-zinc-400">Category: {selectedService.category} • {selectedService.city}</p>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Description</span>
                  <p className="bg-black/40 p-3 rounded-xl border border-white/5 text-zinc-300">{selectedService.description || 'No description provided.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Pricing</span>
                    <span className="text-xl font-bold text-white">₹{selectedService.pricing.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-zinc-400 block mt-0.5">{selectedService.pricingUnit}</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Partner</span>
                    <span className="text-sm font-bold text-white block">{selectedService.partner?.businessName}</span>
                    <span className="text-xs text-zinc-400 block">{selectedService.partner?.phone}</span>
                  </div>
                </div>

                {selectedService.images && selectedService.images.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Service Media</span>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedService.images.map((img, i) => (
                        <img key={i} src={img} alt="" className="w-full h-20 object-cover rounded-lg border border-white/10" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {rejectingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-red-500/20 rounded-2xl w-full max-w-md p-6 text-zinc-300 shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2">Reject Partner Service</h3>
              <p className="text-xs text-zinc-400 mb-4">
                Provide feedback for <strong className="text-white">{rejectingService.name}</strong> so the vendor can update their listing.
              </p>

              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Rejection Reason / Feedback *
                  </label>
                  <textarea
                    rows={3}
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="e.g. Please provide clearer photos and accurate pricing unit."
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-red-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRejectingService(null)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingAction}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg shadow-red-600/30 transition disabled:opacity-50"
                  >
                    {submittingAction ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
