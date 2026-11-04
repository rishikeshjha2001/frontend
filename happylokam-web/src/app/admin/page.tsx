'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Users,
  Briefcase,
  CalendarCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Megaphone,
  Compass,
  UserPlus,
  RefreshCw,
  Search,
  Clock,
  ChevronRight,
  Ticket,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { authFetch } from '@/lib/auth-fetch';

function formatDateTimeSafe(val: any): string {
  if (!val) return 'Date Pending';
  const d = new Date(val);
  if (isNaN(d.getTime())) return 'Date Pending';
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

type BookingItem = {
  id: string;
  type: 'SERVICE' | 'EVENT_PASS';
  title: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  status: string;
  date: string;
  createdAt: string;
  tierName?: string;
  ticketsCount?: number;
  referralCode?: string | null;
};

type DashboardData = {
  kpis: {
    totalUsers: number;
    totalPartners: number;
    pendingPartners?: number;
    totalVenues?: number;
    totalBookings: number;
    totalRevenue: number;
    serviceBookingsCount?: number;
    eventBookingsCount?: number;
  };
  recentBookings: BookingItem[];
  monthlyRevenue: Array<{ month: string; revenue: number; count: number }>;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'EVENT_PASS' | 'SERVICE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('from', startDate);
      if (endDate) queryParams.append('to', endDate);

      const response = await authFetch(`/api/v1/admin/dashboard?${queryParams.toString()}`);
      if (!response.ok) {
        if (response.status === 401) {
          // Authentication error is handled cleanly by the Executive Admin Layout
          setLoading(false);
          setRefreshing(false);
          return;
        }
        throw new Error('Failed to fetch dashboard data');
      }
      const result = await response.json();
      setData(result.data || result);
    } catch (error: any) {
      console.warn('Dashboard live metrics notice:', error?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate]);

  const handleExport = async () => {
    try {
      toast.info('Generating official bookings report...');
      const response = await authFetch('/api/v1/admin/export/bookings');
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `happylokam-bookings-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Bookings report downloaded successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  // Filter recent bookings dynamically
  const filteredRecentBookings = useMemo(() => {
    if (!data?.recentBookings) return [];
    return data.recentBookings.filter((b) => {
      const matchesType = selectedFilter === 'ALL' || b.type === selectedFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.customerName?.toLowerCase().includes(q) ||
        b.customerEmail?.toLowerCase().includes(q) ||
        b.customerPhone?.toLowerCase().includes(q) ||
        b.title?.toLowerCase().includes(q) ||
        (b.referralCode && b.referralCode.toLowerCase().includes(q));
      return matchesType && matchesSearch;
    });
  }, [data?.recentBookings, selectedFilter, searchQuery]);

  if (loading && !data) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-zinc-800/60 rounded-xl" />
          <div className="h-10 w-48 bg-zinc-800/60 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-zinc-900/60 rounded-2xl border border-white/5" />
          ))}
        </div>
        <div className="h-96 bg-zinc-900/60 rounded-3xl border border-white/5" />
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalRevenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalPartners: 0,
    pendingPartners: 0,
    serviceBookingsCount: 0,
    eventBookingsCount: 0
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Date Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Executive Dashboard</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live DB
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time analytics, verified revenue ledger, and platform operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker Controls */}
          <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-xl border border-white/10 backdrop-blur-xl shadow-lg">
            <Calendar className="w-4 h-4 text-rose-500 ml-2" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none text-white text-xs focus:ring-0 outline-none px-1 py-1 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
            <span className="text-zinc-500 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none text-white text-xs focus:ring-0 outline-none px-1 py-1 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-xs text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="p-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-white/10 transition-all shadow-lg disabled:opacity-50"
            title="Refresh Real-time Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-rose-500' : ''}`} />
          </button>

          {/* Export Report */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium text-xs transition-all shadow-[0_0_20px_rgba(225,29,72,0.35)] hover:shadow-[0_0_25px_rgba(225,29,72,0.5)] active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Ledger
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (100% Real Live Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1224] to-[#070a14] backdrop-blur-2xl p-6 rounded-3xl border border-white/[0.08] hover:border-rose-500/50 transition-all duration-300 group shadow-2xl hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/25 transition-all duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Gross Platform Revenue</p>
              <h3 className="text-3xl lg:text-4xl font-black text-white mt-2 tracking-tight">
                ₹{Number(kpis.totalRevenue || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                100% Verified Paid Volume
              </p>
            </div>
            <div className="p-3.5 bg-rose-500/15 rounded-2xl border border-rose-500/30 text-rose-400 shadow-lg shadow-rose-500/10 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Total Bookings & Passes */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1224] to-[#070a14] backdrop-blur-2xl p-6 rounded-3xl border border-white/[0.08] hover:border-emerald-500/50 transition-all duration-300 group shadow-2xl hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/25 transition-all duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Bookings & Event Passes</p>
              <h3 className="text-3xl lg:text-4xl font-black text-white mt-2 tracking-tight">
                {Number(kpis.totalBookings || 0).toLocaleString('en-IN')}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-400 font-medium">
                <span className="text-emerald-400 font-semibold">{kpis.eventBookingsCount || 0} passes</span>
                <span>•</span>
                <span>{kpis.serviceBookingsCount || 0} services</span>
              </div>
            </div>
            <div className="p-3.5 bg-emerald-500/15 rounded-2xl border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Verified Partners */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1224] to-[#070a14] backdrop-blur-2xl p-6 rounded-3xl border border-white/[0.08] hover:border-amber-500/50 transition-all duration-300 group shadow-2xl hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/25 transition-all duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Registered Partners</p>
              <h3 className="text-3xl lg:text-4xl font-black text-white mt-2 flex items-center gap-2 tracking-tight">
                {Number(kpis.totalPartners || 0).toLocaleString('en-IN')}
                {kpis.pendingPartners ? (
                  <span className="text-xs font-semibold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {kpis.pendingPartners} review
                  </span>
                ) : null}
              </h3>
              <Link
                href="/admin/partners"
                className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 mt-1.5 font-semibold transition-colors"
              >
                Directory & Onboarding <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-3.5 bg-amber-500/15 rounded-2xl border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1224] to-[#070a14] backdrop-blur-2xl p-6 rounded-3xl border border-white/[0.08] hover:border-indigo-500/50 transition-all duration-300 group shadow-2xl hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/25 transition-all duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Total Registered Users</p>
              <h3 className="text-3xl lg:text-4xl font-black text-white mt-2 tracking-tight">
                {Number(kpis.totalUsers || 0).toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-indigo-400 font-semibold mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Live customer accounts
              </p>
            </div>
            <div className="p-3.5 bg-indigo-500/15 rounded-2xl border border-indigo-500/30 text-indigo-400 shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Action Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Link
          href="/admin/hero"
          className="flex items-center gap-3 p-3.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-rose-500/30 rounded-xl transition-all group backdrop-blur-md"
        >
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">Hero CMS</p>
            <p className="text-[11px] text-zinc-400">Edit banners & text</p>
          </div>
        </Link>

        <Link
          href="/admin/notifications/broadcast"
          className="flex items-center gap-3 p-3.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-amber-500/30 rounded-xl transition-all group backdrop-blur-md"
        >
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Broadcast</p>
            <p className="text-[11px] text-zinc-400">Push live alerts</p>
          </div>
        </Link>

        <Link
          href="/admin/listings/approvals"
          className="flex items-center gap-3 p-3.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-emerald-500/30 rounded-xl transition-all group backdrop-blur-md"
        >
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Approvals</p>
            <p className="text-[11px] text-zinc-400">Review services</p>
          </div>
        </Link>

        <Link
          href="/admin/partners"
          className="flex items-center gap-3 p-3.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-blue-500/30 rounded-xl transition-all group backdrop-blur-md"
        >
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">+ Add Partner</p>
            <p className="text-[11px] text-zinc-400">Instant onboard</p>
          </div>
        </Link>

        <Link
          href="/admin/loksafari"
          className="flex items-center gap-3 p-3.5 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-purple-500/30 rounded-xl transition-all group backdrop-blur-md col-span-2 sm:col-span-1"
        >
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">LokSafari</p>
            <p className="text-[11px] text-zinc-400">Tours & packages</p>
          </div>
        </Link>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Monthly Revenue Velocity</h2>
            <p className="text-xs text-zinc-400 mt-1">Aggregated live turnover across all verified booking streams</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-xs font-medium text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Paid Volume (INR)
            </span>
          </div>
        </div>

        {data?.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRevenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 12 }}
                  tickFormatter={(val) => `₹${val}`}
                  dx={-5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '12px',
                    border: '1px solid #27272a',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fb7185' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#e11d48"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl">
            <TrendingUp className="w-10 h-10 text-zinc-600 mb-3" />
            <p className="text-sm font-semibold text-zinc-300">No Monthly History Recorded Yet</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              As customers complete   passes and service bookings, monthly growth curves will plot automatically.
            </p>
          </div>
        )}
      </div>

      {/* Live Transaction Ledger & Recent Bookings */}
      <div className="bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-rose-500" />
              Live Booking Stream
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Real-time incoming customer orders, event passes, and service bookings</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pills */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedFilter === 'ALL' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('EVENT_PASS')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedFilter === 'EVENT_PASS' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Event Passes
              </button>
              <button
                onClick={() => setSelectedFilter('SERVICE')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedFilter === 'SERVICE' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Services
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, phone, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-zinc-950/80 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/50 w-44 sm:w-56"
              />
            </div>

            <Link
              href="/admin/bookings"
              className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors ml-auto sm:ml-0"
            >
              Full Ledger <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bookings List / Table */}
        <div className="space-y-3">
          {filteredRecentBookings.length > 0 ? (
            filteredRecentBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      b.type === 'EVENT_PASS'
                        ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    {b.type === 'EVENT_PASS' ? <Ticket className="w-5 h-5" /> : <CalendarCheck className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                        {b.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : b.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                      {b.type === 'EVENT_PASS' && b.tierName && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                          {b.tierName} {b.ticketsCount ? `(${b.ticketsCount} tickets)` : ''}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-zinc-400 mt-1.5">
                      <span className="text-zinc-300 font-medium">{b.customerName}</span>
                      {b.customerPhone && <span>• {b.customerPhone}</span>}
                      {b.referralCode && (
                        <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded text-[11px] font-mono">
                          Ref: {b.referralCode}
                        </span>
                      )}
                      <span>• {formatDateTimeSafe(b.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-zinc-500">Amount Paid</p>
                    <p className="text-lg font-extrabold text-white">₹{Number(b.amount || 0).toLocaleString('en-IN')}</p>
                  </div>

                  <Link
                    href="/admin/bookings"
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-black/20">
              <Clock className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-300">No Transactions Found</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                {searchQuery || selectedFilter !== 'ALL'
                  ? 'No bookings match your current filter criteria.'
                  : 'All real incoming bookings and   passes will appear live here.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
