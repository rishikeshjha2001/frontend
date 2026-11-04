'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ShieldCheck, CreditCard, Users, CheckCircle2, XCircle, 
  RefreshCw, AlertTriangle, ArrowRight, IndianRupee, Clock, Search,
  Sliders, Save, Sparkles, Building, Phone, Mail, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface SubscriptionConfig {
  planId: string;
  name: string;
  amount: number;
  currency: string;
  active: boolean;
  features: string[];
}

interface PartnerItem {
  id: string;
  hlpId: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  location: string;
  isVerified: boolean;
  status: string;
  subscriptionStatus: string;
  subscriptionEnd: string | null;
  createdAt: string;
  subscriptions: {
    id: string;
    amount: number;
    status: string;
    startDate: string;
    endDate: string;
    razorpayPaymentId: string | null;
    createdAt: string;
  }[];
}

export default function PartnerSubscriptionsAdminPage() {
  const [config, setConfig] = useState<SubscriptionConfig>({
    planId: '',
    name: 'Partner Monthly Subscription',
    amount: 99,
    currency: 'INR',
    active: true,
    features: []
  });
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [stats, setStats] = useState({
    totalPartners: 0,
    activeSubscriptions: 0,
    inactiveSubscriptions: 0,
    totalCollected: 0,
    subscriptionEnforcement: true
  });
  const [loading, setLoading] = useState(true);
  const [updatingConfig, setUpdatingConfig] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [editableAmount, setEditableAmount] = useState<number>(99);

  const fetchSubscriptionsData = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/admin/subscriptions');
      if (res && res.success) {
        if (res.config) {
          setConfig(res.config);
          setEditableAmount(res.config.amount || 99);
        }
        if (res.stats) {
          setStats(res.stats);
        }
        if (Array.isArray(res.partners)) {
          setPartners(res.partners);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load subscription settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionsData();
  }, []);

  const handleToggleMasterSubscription = async (newActiveState: boolean) => {
    try {
      setUpdatingConfig(true);
      const res: any = await apiClient.put('/admin/subscriptions/config', {
        active: newActiveState,
        amount: editableAmount
      });
      if (res && res.success) {
        setConfig(prev => ({ ...prev, active: newActiveState }));
        setStats(prev => ({ ...prev, subscriptionEnforcement: newActiveState }));
        toast.success(res.message || `Partner ₹99 Subscription requirement turned ${newActiveState ? 'ON' : 'OFF'}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update subscription requirement');
    } finally {
      setUpdatingConfig(false);
    }
  };

  const handleSaveAmount = async () => {
    try {
      setUpdatingConfig(true);
      const res: any = await apiClient.put('/admin/subscriptions/config', {
        active: config.active,
        amount: editableAmount
      });
      if (res && res.success) {
        setConfig(prev => ({ ...prev, amount: editableAmount }));
        toast.success(`Subscription fee updated to ₹${editableAmount}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update fee');
    } finally {
      setUpdatingConfig(false);
    }
  };

  const handleTogglePartner = async (partnerId: string, currentStatus: string) => {
    try {
      setActionInProgress(partnerId);
      const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const res: any = await apiClient.put(`/admin/subscriptions/partners/${partnerId}/toggle`, {
        status: nextStatus,
        durationDays: 30
      });
      if (res && res.success) {
        toast.success(res.message);
        fetchSubscriptionsData();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update partner subscription');
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredPartners = partners.filter(p => {
    const matchesSearch = !searchQuery || 
      p.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone?.includes(searchQuery) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hlpId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && p.subscriptionStatus === 'ACTIVE') ||
      (statusFilter === 'INACTIVE' && p.subscriptionStatus !== 'ACTIVE');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Partner Monetization Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white font-playfair tracking-tight">
            ₹99 Partner Subscription & Onboarding Control
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Toggle the mandatory ₹99 monthly partner subscription requirement ON or OFF, customize fees, and grant direct access.
          </p>
        </div>

        <button 
          onClick={fetchSubscriptionsData} 
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* MASTER TOGGLE CONTROL CARD */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-[#0d1424] via-[#101b33] to-[#0d1829] border border-amber-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Left 2 Cols: The Master Switch & Status */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${
                config.active 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {config.active ? '● MANDATORY MONETIZATION MODE' : '○ FREE ONBOARDING GROWTH MODE'}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              {config.active 
                ? 'Partner ₹99 Subscription is Currently ACTIVE'
                : 'Partner ₹99 Subscription is Currently WAIVED (OFF)'
              }
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl font-medium">
              {config.active 
                ? 'All newly onboarding partners must complete the ₹99 Cloud Server & Listing activation charge via Razorpay before their venues and services are verified and displayed in customer search results.'
                : 'The ₹99 subscription gate is bypassed! New partners can register and publish celebration services completely for free. Use this mode for explosive partner acquisition campaigns in new cities.'
              }
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleToggleMasterSubscription(!config.active)}
                disabled={updatingConfig}
                className={`px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center gap-2.5 ${
                  config.active
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>
                  {updatingConfig ? 'Updating...' : config.active ? 'Turn OFF Subscription Requirement' : 'Turn ON Mandatory ₹99 Subscription'}
                </span>
              </button>

              <div className="text-xs text-slate-400 font-medium">
                Changes apply instantly across all partner portals and registration APIs.
              </div>
            </div>
          </div>

          {/* Right Col: Configure Fee Amount */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Monthly Fee Amount</span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">Configurable</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  value={editableAmount}
                  onChange={(e) => setEditableAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-white font-extrabold text-lg focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                onClick={handleSaveAmount}
                disabled={updatingConfig || editableAmount === config.amount}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              Billed yearly. Default recommended amount is ₹99 for cloud server verification.
            </p>
          </div>

        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#090d1a] border border-white/10 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Partners</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">{stats.totalPartners}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Registered vendor accounts</div>
        </div>

        <div className="bg-[#090d1a] border border-emerald-500/20 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Active Subscriptions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{stats.activeSubscriptions}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Can list services & take bookings</div>
        </div>

        <div className="bg-[#090d1a] border border-rose-500/20 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Pending / Inactive</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400">{stats.inactiveSubscriptions}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Requires fee or admin grant</div>
        </div>

        <div className="bg-[#090d1a] border border-amber-500/20 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Collected Revenue</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300 flex items-center">
            <IndianRupee className="w-6 h-6 -mr-1" />
            {stats.totalCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">From ₹99 Cloud Activations</div>
        </div>

      </div>

      {/* PARTNERS LEDGER & INDIVIDUAL ACCESS TABLE */}
      <div className="bg-[#090d1a] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Table Filters Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              <span>Partner Subscription Ledger & Override Controls</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Admin can grant 1-year free access to any partner or toggle their listing activation directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search business, owner, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    statusFilter === filter
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Partner / Business</th>
                <th className="pb-3 px-3">Contact</th>
                <th className="pb-3 px-3">City / Area</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Last Payment</th>
                <th className="pb-3 px-3">Expires On</th>
                <th className="pb-3 px-3 text-right">Quick Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-medium">
                    {loading ? 'Loading partners...' : 'No partners found matching criteria.'}
                  </td>
                </tr>
              ) : (
                filteredPartners.map((p) => {
                  const isActive = p.subscriptionStatus === 'ACTIVE';
                  const latestSub = p.subscriptions[0];

                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-3">
                        <div className="font-bold text-white text-sm">{p.businessName || 'Business Unnamed'}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-amber-400 font-semibold">{p.hlpId || 'HLP-PENDING'}</span>
                          <span>•</span>
                          <span>{p.name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-3 text-slate-300">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" /> {p.phone || 'N/A'}
                        </div>
                        {p.email && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <Mail className="w-3 h-3" /> {p.email}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-3 text-slate-300 font-medium">
                        {p.location || 'Patna, Bihar'}
                      </td>

                      <td className="py-4 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}>
                          {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {p.subscriptionStatus || 'INACTIVE'}
                        </span>
                      </td>

                      <td className="py-4 px-3 text-slate-300">
                        {latestSub ? (
                          <div>
                            <span className="font-bold text-white">₹{latestSub.amount}</span>
                            <div className="text-[10px] text-slate-400">
                              {latestSub.razorpayPaymentId ? 'Razorpay' : 'Admin Granted'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">No record</span>
                        )}
                      </td>

                      <td className="py-4 px-3 text-slate-300">
                        {p.subscriptionEnd ? (
                          <div>
                            <span className="font-medium">{new Date(p.subscriptionEnd).toLocaleDateString()}</span>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> 1 Year Plan
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={() => handleTogglePartner(p.id, p.subscriptionStatus)}
                          disabled={actionInProgress === p.id}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            isActive
                              ? 'bg-white/5 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-white/10'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                          }`}
                        >
                          {actionInProgress === p.id 
                            ? 'Processing...' 
                            : isActive ? 'Mark Inactive' : 'Grant 1-Yr Free Access'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
