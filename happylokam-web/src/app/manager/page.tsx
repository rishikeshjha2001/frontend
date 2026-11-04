'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Users,
  UserCheck,
  Clock,
  QrCode,
  UserPlus,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  Building2,
  Phone,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/v1/manager/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to load manager dashboard metrics');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not load metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Field Management Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manager Overview & Operations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your partner acquisitions, event gate tickets, and field data logs in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/manager/partners/onboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Partner</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Partners</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">
            {loading ? '...' : stats?.totalPartners ?? 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Acquired by you</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Active / Verified</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-emerald-400">
            {loading ? '...' : stats?.activePartners ?? 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Live on marketplace</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Pending Approvals</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-amber-400">
            {loading ? '...' : stats?.pendingPartners ?? 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Under admin review</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tickets Scanned Today</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-indigo-300">
            {loading ? '...' : stats?.scannedToday ?? 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Gate check-ins</span>
        </div>
      </div>

      {/* Quick Ops Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/manager/partners/onboard"
          className="group p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 via-[#0c1220] to-[#0c1220] border border-blue-800/30 hover:border-blue-600 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
            Onboard New Partner
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Register business owners, capture KYC & bank details, and instantly generate their unique HLP ID.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mt-4">
            <span>Start Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/manager/scanner"
          className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0c1220] to-[#0c1220] border border-emerald-800/30 hover:border-emerald-500 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
            Scan Event & Dandiya Tickets
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Scan attendee QR codes or look up ticket IDs to verify validity and mark entries directly at gate.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mt-4">
            <span>Open Scanner</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/manager/notes"
          className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-[#0c1220] to-[#0c1220] border border-indigo-800/30 hover:border-indigo-500 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
            Field Tasks & Reminders
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Record partner meeting notes, follow-up dates, and verify checklist items on the ground.
          </p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mt-4">
            <span>Manage Tasks</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Two Column Layout: Recent Partners & Quick Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Partners */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Recent Partners Assigned</h2>
              <p className="text-xs text-slate-400">Partners created and managed by your field ID</p>
            </div>
            <Link
              href="/manager/partners"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading partners...</div>
          ) : stats?.recentPartners?.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {stats.recentPartners.map((partner: any) => (
                <div key={partner.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                      {partner.businessName?.[0] || partner.name?.[0] || 'P'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>{partner.businessName || partner.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {partner.hlpId}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{partner.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {partner.isVerified ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No partners onboarded yet</p>
              <p className="text-xs text-slate-500 mt-1">Start by onboarding your first business partner.</p>
            </div>
          )}
        </div>

        {/* Notes & Tasks Preview */}
        <div className="rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">Field Notes</h2>
                <p className="text-xs text-slate-400">Quick reminders & tasks</p>
              </div>
              <Link
                href="/manager/notes"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>All Notes</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading notes...</div>
            ) : stats?.notes?.length > 0 ? (
              <div className="space-y-3">
                {stats.notes.map((note: any) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{note.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{note.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <CheckSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No field notes created yet.</p>
              </div>
            )}
          </div>

          <Link
            href="/manager/notes"
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Create New Note</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
