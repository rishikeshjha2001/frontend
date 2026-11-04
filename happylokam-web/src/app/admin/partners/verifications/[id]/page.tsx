'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { authFetch } from '@/lib/auth-fetch';

export default function PartnerVerificationDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (id) {
      fetchPartner();
    }
  }, [id]);

  const fetchPartner = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`/api/v1/admin/partners/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPartner(data.data || data.partner || data);
      } else {
        toast.error('Partner KYC record not found');
        router.push('/admin/partners/verifications');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load partner details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      const res = await authFetch(`/api/v1/admin/partners/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        toast.success('Partner approved & verified successfully!');
        setPartner((prev: any) => ({ ...prev, isVerified: true, status: 'VERIFIED' }));
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || data.error || 'Failed to approve partner');
      }
    } catch (error) {
      toast.error('An error occurred during approval');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    try {
      setActionLoading(true);
      const res = await authFetch(`/api/v1/admin/partners/${id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason || 'Incomplete KYC documentation' }),
      });
      if (res.ok) {
        toast.success('Partner KYC application rejected');
        setPartner((prev: any) => ({ ...prev, isVerified: false, status: 'REJECTED' }));
        setShowRejectReason(false);
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || data.error || 'Failed to reject partner');
      }
    } catch (error) {
      toast.error('An error occurred during rejection');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col justify-center items-center text-zinc-400 gap-4">
        <div className="w-10 h-10 border-3 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold">Loading partner KYC dossier...</p>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col justify-center items-center text-zinc-400 gap-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <p className="text-lg font-bold text-white">Partner Not Found</p>
        <Link
          href="/admin/partners/verifications"
          className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-xs font-semibold hover:bg-zinc-700"
        >
          Return to Verifications
        </Link>
      </div>
    );
  }

  const isVerified = partner.isVerified || partner.status === 'VERIFIED';
  const isRejected = partner.status === 'REJECTED';
  const isPending = !isVerified && !isRejected;

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-200 p-4 sm:p-6 lg:p-10 font-sans relative overflow-x-hidden">
      {/* Background glow effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-[140px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-xl">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/partners/verifications" 
              className="p-2.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all border border-white/10"
              title="Back to Verifications"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Review KYC Application
                </h1>
                {partner.hlpId && (
                  <span className="font-mono text-xs bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-lg border border-amber-500/20 font-bold">
                    {partner.hlpId}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Submitted on {partner.createdAt ? new Date(partner.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <CheckCircle className="w-4 h-4" />
                Verified Partner
              </span>
            ) : isRejected ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <XCircle className="w-4 h-4" />
                Application Rejected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Clock className="w-4 h-4" />
                Pending Verification
              </span>
            )}
          </div>
        </div>

        {/* Two-column dossier layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Business & Contact Information */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Business Information</h2>
                <p className="text-xs text-zinc-400">Core operational and identity parameters</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-zinc-500 font-medium">Business / Trade Name</span>
                <p className="text-base font-bold text-white mt-0.5">
                  {partner.businessName || 'Unnamed Entity'}
                </p>
              </div>

              <div>
                <span className="text-xs text-zinc-500 font-medium">Owner / Authorized Representative</span>
                <p className="text-base font-semibold text-zinc-200 mt-0.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-zinc-400" />
                  {partner.ownerName || partner.name || 'Not provided'}
                </p>
              </div>

              <div>
                <span className="text-xs text-zinc-500 font-medium">Contact Phone</span>
                <p className="font-mono text-emerald-400 font-bold mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${partner.phone}`} className="hover:underline">
                    {partner.phone || 'N/A'}
                  </a>
                </p>
              </div>

              <div>
                <span className="text-xs text-zinc-500 font-medium">Official Email Address</span>
                <p className="text-zinc-300 font-medium mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <a href={`mailto:${partner.email}`} className="hover:underline">
                    {partner.email}
                  </a>
                </p>
              </div>

              <div>
                <span className="text-xs text-zinc-500 font-medium">Registered City / Address</span>
                <p className="text-zinc-300 font-medium mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  {partner.location || partner.businessAddress || 'Patna, Bihar'}
                </p>
              </div>

              <div>
                <span className="text-xs text-zinc-500 font-medium">Business Categories</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {partner.categories && partner.categories.length > 0 ? (
                    partner.categories.map((cat: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 border border-white/5">
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500">General Vendor Services</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tax, KYC & Banking Data */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">KYC & Financial Compliance</h2>
                <p className="text-xs text-zinc-400">Statutory taxation & settlement accounts</p>
              </div>
            </div>

            <div className="space-y-4 text-sm font-mono">
              <div className="bg-zinc-950/60 p-4 rounded-2xl border border-white/5 space-y-3">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Taxation Identity
                </span>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] text-zinc-500 block font-sans">GSTIN Number</span>
                    <span className="text-white font-bold text-sm">
                      {partner.gstNumber || 'Unregistered / Exempt'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-500 block font-sans">PAN Number</span>
                    <span className="text-white font-bold text-sm">
                      {partner.panNumber || 'Not submitted'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/60 p-4 rounded-2xl border border-white/5 space-y-3">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Direct Settlement Account
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] text-zinc-500 block font-sans">Bank Account</span>
                    <span className="text-white font-bold text-sm">
                      {partner.bankAccount || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-zinc-500 block font-sans">IFSC Code</span>
                    <span className="text-white font-bold text-sm">
                      {partner.bankIfsc || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/60 p-4 rounded-2xl border border-white/5 space-y-2">
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider font-sans flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Platform Standing
                </span>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-zinc-400 font-sans">Subscription Status</span>
                  <span className="text-xs font-bold text-white uppercase bg-zinc-800 px-2 py-0.5 rounded">
                    {partner.subscriptionStatus || 'INACTIVE'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-sans">Wallet Balance</span>
                  <span className="text-xs font-bold text-emerald-400">
                    ₹{(partner.walletBalance || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Decision Card */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            Verification Decision & Controls
          </h2>

          {!showRejectReason ? (
            <div className="flex flex-wrap items-center gap-4">
              {!isVerified && (
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Verify Partner</span>
                </button>
              )}

              {isVerified && (
                <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>This partner has been fully verified and is active on happylokam.</span>
                </div>
              )}

              {!isRejected && (
                <button
                  onClick={() => setShowRejectReason(true)}
                  disabled={actionLoading}
                  className="px-6 py-3 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/40 text-rose-300 font-bold rounded-2xl shadow transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject KYC Application</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 bg-zinc-950/80 p-5 rounded-2xl border border-rose-500/30">
              <div>
                <label className="block text-xs font-bold text-rose-400 mb-1">
                  Reason for Rejection (Required feedback for partner)
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why the KYC was rejected (e.g. Blurred PAN card image, invalid bank account details)..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRejectConfirm}
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setShowRejectReason(false);
                    setRejectReason('');
                  }}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
