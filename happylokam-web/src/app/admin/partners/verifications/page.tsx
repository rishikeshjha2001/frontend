'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  Building2, 
  Mail, 
  User,
  AlertCircle,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Clock,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { authFetch } from '@/lib/auth-fetch';

type Partner = {
  id: string;
  hlpId?: string;
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  categories?: string[];
  location?: string;
  isVerified: boolean;
  status?: string;
  ownerName?: string;
  gstNumber?: string;
  panNumber?: string;
  bankAccount?: string;
  bankIfsc?: string;
  createdAt?: string;
};

export default function AdminPartnerVerificationsPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectPartnerTarget, setRejectPartnerTarget] = useState<Partner | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/v1/admin/partners');
      if (!res.ok) {
        throw new Error(`Failed to fetch partners (${res.status})`);
      }
      const data = await res.json();
      const list: Partner[] = Array.isArray(data) 
        ? data 
        : (data.partners || data.data || []);
      setPartners(list);
    } catch (error: any) {
      console.error('Failed to fetch partners:', error);
      toast.error('Failed to load partner verification list');
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await authFetch(`/api/v1/admin/partners/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        toast.success('Partner approved & verified successfully!');
        setPartners(prev =>
          prev.map(p => (p.id === id ? { ...p, isVerified: true, status: 'VERIFIED' } : p))
        );
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || err.error || 'Failed to approve partner');
      }
    } catch (error) {
      toast.error('An error occurred during partner approval');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (partner: Partner) => {
    setRejectPartnerTarget(partner);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectPartnerTarget) return;
    const id = rejectPartnerTarget.id;
    setActionLoadingId(id);
    try {
      const res = await authFetch(`/api/v1/admin/partners/${id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason || 'Incomplete KYC documents' }),
      });

      if (res.ok) {
        toast.success('Partner application rejected');
        setPartners(prev =>
          prev.map(p => (p.id === id ? { ...p, isVerified: false, status: 'REJECTED' } : p))
        );
        setRejectModalOpen(false);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || err.error || 'Failed to reject partner');
      }
    } catch (error) {
      toast.error('An error occurred during rejection');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered partners based on search and status
  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      // Status filter
      if (statusFilter === 'PENDING') {
        if (p.isVerified || (p.status && p.status !== 'PENDING')) return false;
      } else if (statusFilter === 'VERIFIED') {
        if (!p.isVerified && p.status !== 'VERIFIED') return false;
      } else if (statusFilter === 'REJECTED') {
        if (p.status !== 'REJECTED') return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.businessName || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.phone || '').toLowerCase().includes(q) ||
        (p.hlpId || '').toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q) ||
        (p.ownerName || '').toLowerCase().includes(q)
      );
    });
  }, [partners, statusFilter, searchQuery]);

  const pendingCount = partners.filter(p => !p.isVerified && p.status !== 'REJECTED').length;
  const verifiedCount = partners.filter(p => p.isVerified || p.status === 'VERIFIED').length;
  const rejectedCount = partners.filter(p => p.status === 'REJECTED').length;

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-200 p-4 sm:p-6 lg:p-10 font-sans relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-[140px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Partner Verifications & KYC
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Review, verify & approve business partner applications
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={fetchPartners}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 rounded-xl text-xs font-semibold border border-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              Refresh List
            </button>
            <Link
              href="/admin/partners"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/10 transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-rose-400" />
              All Partners
            </Link>
          </div>
        </div>

        {/* Quick KPI Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Partners</span>
              <Building2 className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-3">
              {partners.length}
            </p>
            <span className="text-[11px] text-zinc-500 mt-1 block">Registered in ecosystem</span>
          </div>

          <div className="bg-zinc-900/60 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider">
              <span>Pending Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-3">
              {pendingCount}
            </p>
            <span className="text-[11px] text-amber-400/80 mt-1 block font-medium">Awaiting admin verification</span>
          </div>

          <div className="bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>Verified Active</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-3">
              {verifiedCount}
            </p>
            <span className="text-[11px] text-emerald-400/80 mt-1 block font-medium">Full business privileges</span>
          </div>

          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>Rejected / Inactive</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-3">
              {rejectedCount}
            </p>
            <span className="text-[11px] text-zinc-500 mt-1 block">Requires KYC re-submission</span>
          </div>
        </div>

        {/* Filter Tabs & Search Controls */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by business name, owner name, phone, email, or HLP ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-inner"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'All Partners', value: 'ALL', count: partners.length },
                { label: 'Pending Review', value: 'PENDING', count: pendingCount },
                { label: 'Verified', value: 'VERIFIED', count: verifiedCount },
                { label: 'Rejected', value: 'REJECTED', count: rejectedCount }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    statusFilter === tab.value
                      ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg'
                      : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 text-white/90">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section / Partners Table */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-900/60 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl"
        >
          {loading ? (
            <div className="flex flex-col justify-center items-center h-80 gap-4">
              <div className="w-10 h-10 border-3 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-zinc-400">Loading partner applications...</p>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-80 text-zinc-400 space-y-3 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
                <AlertCircle className="w-8 h-8 opacity-60" />
              </div>
              <p className="text-base font-bold text-white">No partner records found</p>
              <p className="text-xs text-zinc-500 max-w-sm">
                No partners match your current filter or search criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-zinc-400">
                    <th className="p-4 sm:p-5 font-bold">Business & Partner</th>
                    <th className="p-4 sm:p-5 font-bold">Contact Details</th>
                    <th className="p-4 sm:p-5 font-bold">Location & Category</th>
                    <th className="p-4 sm:p-5 font-bold">KYC / Tax Details</th>
                    <th className="p-4 sm:p-5 font-bold">Verification Status</th>
                    <th className="p-4 sm:p-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredPartners.map((partner, index) => {
                    const isVerified = partner.isVerified || partner.status === 'VERIFIED';
                    const isRejected = partner.status === 'REJECTED';
                    const isPending = !isVerified && !isRejected;

                    return (
                      <tr 
                        key={partner.id || index}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* 1. Business & Partner */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm group-hover:text-rose-400 transition-colors">
                                {partner.businessName || 'Unnamed Business'}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-zinc-400 flex items-center gap-1">
                                  <User className="w-3 h-3 text-zinc-500" />
                                  {partner.ownerName || partner.name || 'Owner'}
                                </span>
                                {partner.hlpId && (
                                  <span className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded text-amber-300 border border-white/10">
                                    {partner.hlpId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Contact Details */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div className="space-y-1">
                            {partner.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
                                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <a href={`tel:${partner.phone}`} className="hover:underline hover:text-emerald-400">
                                  {partner.phone}
                                </a>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                              <a href={`mailto:${partner.email}`} className="hover:underline truncate max-w-[200px]">
                                {partner.email}
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* 3. Location & Categories */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-zinc-300">
                              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>{partner.location || 'Patna, Bihar'}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {partner.categories && partner.categories.length > 0 ? (
                                partner.categories.slice(0, 2).map((cat, ci) => (
                                  <span key={ci} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-white/5">
                                    {cat}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-zinc-500">Vendor Services</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 4. KYC / Tax Details */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div className="space-y-1 text-[11px] text-zinc-400 font-mono">
                            <div>
                              <span className="text-zinc-500">GST: </span>
                              <span className="text-zinc-300 font-semibold">{partner.gstNumber || 'Not provided'}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">PAN: </span>
                              <span className="text-zinc-300 font-semibold">{partner.panNumber || 'Not provided'}</span>
                            </div>
                            {partner.bankAccount && (
                              <div>
                                <span className="text-zinc-500">A/C: </span>
                                <span className="text-zinc-300">••••{partner.bankAccount.slice(-4)}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 5. Status Badge */}
                        <td className="p-4 sm:p-5 align-middle">
                          {isVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          ) : isRejected ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                              <XCircle className="w-3.5 h-3.5" />
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              <Clock className="w-3.5 h-3.5" />
                              Pending
                            </span>
                          )}
                        </td>

                        {/* 6. Action Controls */}
                        <td className="p-4 sm:p-5 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Detailed Application View */}
                            <Link
                              href={`/admin/partners/verifications/${partner.id}`}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-white/10 transition-all"
                              title="Review full KYC application"
                            >
                              <FileText className="w-3 h-3 text-amber-400" />
                              <span>Review</span>
                            </Link>

                            {/* Instant Approve button */}
                            {!isVerified && (
                              <button
                                onClick={() => handleApprove(partner.id)}
                                disabled={actionLoadingId === partner.id}
                                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1 disabled:opacity-50"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                            )}

                            {/* Instant Reject button */}
                            {isPending && (
                              <button
                                onClick={() => openRejectModal(partner)}
                                disabled={actionLoadingId === partner.id}
                                className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 text-xs font-bold transition-all active:scale-95 flex items-center gap-1 disabled:opacity-50"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModalOpen && rejectPartnerTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0e1118] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Reject KYC Application</h3>
                  <p className="text-xs text-zinc-400">
                    Partner: <span className="text-white font-semibold">{rejectPartnerTarget.businessName}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">
                  Reason for rejection (will be sent to partner):
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Incomplete GST documents or invalid bank IFSC code. Please re-upload verified proof."
                  className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={actionLoadingId === rejectPartnerTarget.id}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
