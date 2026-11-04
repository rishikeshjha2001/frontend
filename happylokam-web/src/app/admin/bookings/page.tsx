'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Download, Filter, Eye, X, Calendar as CalendarIcon, MapPin, 
  User, Building2, CreditCard, Clock, CheckCircle, AlertCircle, 
  TrendingUp, Search, Phone, Mail, Ticket, Sparkles, RefreshCw, 
  Copy, ExternalLink, ArrowUpDown, ChevronRight, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { authFetch } from '@/lib/auth-fetch';

function formatDateSafe(val: any, options?: Intl.DateTimeFormatOptions): string {
  if (!val) return 'Date Pending';
  const d = new Date(val);
  if (isNaN(d.getTime())) return 'Date Pending';
  return d.toLocaleDateString('en-IN', options || {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTimeSafe(val: any): string {
  if (!val) return 'Time Pending';
  const d = new Date(val);
  if (isNaN(d.getTime())) return 'Time Pending';
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTimeSafe(val: any): string {
  if (!val) return 'N/A';
  const d = new Date(val);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleString('en-IN');
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await authFetch(`/api/v1/admin/bookings?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 401) return;
        throw new Error('Failed to fetch bookings');
      }
      const data = await res.json();
      const list = Array.isArray(data) 
        ? data 
        : (data.bookings || data.data || []);
      setBookings(list);
      if (data.stats) setStats(data.stats);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, typeFilter]);

  // Client-side search for instantaneous feedback while typing
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    const q = searchQuery.toLowerCase().trim();
    return bookings.filter((b) => {
      const name = (b.customerName || b.user?.name || '').toLowerCase();
      const phone = (b.customerPhone || b.user?.phone || '').toLowerCase();
      const email = (b.customerEmail || b.user?.email || '').toLowerCase();
      const id = (b.ticketId || b.id || '').toLowerCase();
      const service = (b.serviceName || b.event?.title || b.venue?.name || '').toLowerCase();
      const payment = (b.paymentId || '').toLowerCase();
      return (
        name.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        id.includes(q) ||
        service.includes(q) ||
        payment.includes(q)
      );
    });
  }, [bookings, searchQuery]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await authFetch(`/api/v1/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update status');

      toast.success(`Booking status changed to ${newStatus}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id || b.ticketId === id ? { ...b, status: newStatus } : b))
      );
      if (selectedBooking && (selectedBooking.id === id || selectedBooking.ticketId === id)) {
        setSelectedBooking((prev: any) => ({ ...prev, status: newStatus }));
      }
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || 'Error updating booking status');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this booking record?')) return;
    try {
      const res = await authFetch(`/api/v1/admin/bookings/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete booking');

      toast.success('Booking record deleted successfully');
      setBookings((prev) => prev.filter((b) => b.id !== id && b.ticketId !== id));
      setSelectedBooking(null);
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting booking');
    }
  };

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      toast.error('No booking records to export');
      return;
    }
    const headers = [
      'Ticket/Booking ID',
      'Booking Type',
      'Customer Name',
      'Phone Number',
      'Email',
      'Event / Service',
      'Event Date & Time',
      'Tickets Qty',
      'Amount (INR)',
      'Payment ID',
      'Status',
      'Created At'
    ];

    const rows = filteredBookings.map((b) => [
      `"${b.ticketId || b.id || ''}"`,
      `"${b.bookingType || b.type || ''}"`,
      `"${b.customerName || b.user?.name || ''}"`,
      `"${b.customerPhone || b.user?.phone || ''}"`,
      `"${b.customerEmail || b.user?.email || ''}"`,
      `"${b.serviceName || b.event?.title || b.venue?.name || ''}"`,
      `"${formatDateTimeSafe(b.eventDate || b.date || b.createdAt)}"`,
      b.ticketsCount || 1,
      b.amount || b.totalAmount || 0,
      `"${b.paymentId || ''}"`,
      `"${b.status || ''}"`,
      `"${formatDateTimeSafe(b.createdAt)}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `happylokam_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Bookings exported to CSV successfully');
  };

  const statusTabs = ['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'];
  const typeTabs = [
    { label: 'All Bookings', value: 'ALL' },
    { label: 'Celebration Passes 🎟️', value: 'EVENT_PASS' },
    { label: 'Venue Reservations 🏛️', value: 'VENUE_BOOKING' },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-200 p-4 sm:p-6 lg:p-10 font-sans relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-[140px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto space-y-8 relative z-10">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  All Bookings & Celebration Passes
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Live synchronized database of all customer reservations & tickets
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 rounded-xl text-xs font-semibold border border-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 text-white rounded-xl text-xs font-bold shadow-[0_0_25px_rgba(225,29,72,0.35)] hover:shadow-[0_0_35px_rgba(225,29,72,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-rose-500/40 transition-all">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Bookings</span>
              <CalendarIcon className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-3">
              {stats?.totalBookings ?? filteredBookings.length}
            </p>
            <span className="text-[11px] text-zinc-500 mt-1 block">Live across platform</span>
          </div>

          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Revenue</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-3">
              ₹{(stats?.totalRevenue ?? filteredBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)).toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-400/80 mt-1 block font-medium">100% Verified collections</span>
          </div>

          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>Celebration Passes</span>
              <Ticket className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-300 mt-3">
              {stats?.eventPassesCount ?? filteredBookings.filter(b => b.type === 'EVENT_PASS').length}
            </p>
            <span className="text-[11px] text-zinc-500 mt-1 block">Dandiya, Garba & Events</span>
          </div>

          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <span>Confirmed Orders</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-3">
              {stats?.confirmedCount ?? filteredBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'SUCCESS').length}
            </p>
            <span className="text-[11px] text-zinc-500 mt-1 block">Active & Verified passes</span>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by customer name, phone number, ticket ID, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Type Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {typeTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setTypeFilter(tab.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    typeFilter === tab.value
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 border border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider mr-2">Status:</span>
            {statusTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === tab
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tabular Form of All Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-zinc-950/70 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-zinc-900/90 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-white/10">
                  <th className="p-4 sm:p-5 font-bold">Ticket / Booking ID</th>
                  <th className="p-4 sm:p-5 font-bold">Customer Details</th>
                  <th className="p-4 sm:p-5 font-bold">Celebration / Service</th>
                  <th className="p-4 sm:p-5 font-bold">Event Date & Time</th>
                  <th className="p-4 sm:p-5 font-bold">Quantity</th>
                  <th className="p-4 sm:p-5 font-bold">Amount Paid</th>
                  <th className="p-4 sm:p-5 font-bold">Payment Status</th>
                  <th className="p-4 sm:p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-16 text-center text-zinc-500">
                      <div className="flex flex-col justify-center items-center gap-4">
                        <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="animate-pulse text-zinc-400 font-medium">Synchronizing bookings from database...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-16 text-center text-zinc-500">
                      <div className="flex flex-col justify-center items-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
                          <Ticket className="w-8 h-8 opacity-40" />
                        </div>
                        <p className="text-base text-zinc-300 font-semibold">No bookings found</p>
                        <p className="text-xs text-zinc-500">Try changing your search keywords or filter options.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b, index) => {
                    const ticketId = b.ticketId || b.id;
                    const isEventPass = b.type === 'EVENT_PASS';

                    return (
                      <tr 
                        key={ticketId || index}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        {/* 1. Ticket / Booking ID */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-black text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                {ticketId}
                              </span>
                              <button
                                onClick={() => copyToClipboard(ticketId, 'Ticket ID')}
                                className="p-1 hover:bg-white/10 rounded text-zinc-500 hover:text-zinc-200 transition-colors"
                                title="Copy ID"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              isEventPass
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {b.bookingType || (isEventPass ? 'Celebration Pass' : 'Venue Reservation')}
                            </span>
                          </div>
                        </td>

                        {/* 2. Customer Name, Phone, Email */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                {(b.customerName || 'G')[0]}
                              </div>
                              <span className="font-bold text-white text-sm">
                                {b.customerName || 'Celebration Guest'}
                              </span>
                            </div>

                            {/* Phone number with click-to-call */}
                            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
                              <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                              <a 
                                href={`tel:${b.customerPhone}`}
                                className="hover:text-emerald-400 hover:underline"
                              >
                                {b.customerPhone || 'No Phone Recorded'}
                              </a>
                            </div>

                            {/* Email */}
                            {b.customerEmail && b.customerEmail !== 'N/A' && (
                              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                                <Mail className="w-3 h-3 text-zinc-500 shrink-0" />
                                <span className="truncate max-w-[180px]">{b.customerEmail}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 3. Celebration / Service Details */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div className="space-y-1 max-w-[240px]">
                            <p className="font-bold text-zinc-200 line-clamp-1">
                              {b.serviceName}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              <span className="truncate">{b.location || 'Patna'}</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 block">
                              Category: {b.category || 'Celebration'}
                            </span>
                          </div>
                        </td>

                        {/* 4. Event Date & Time */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
                              <CalendarIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{formatDateSafe(b.eventDate)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                              <Clock className="w-3 h-3 text-zinc-500 shrink-0" />
                              <span>{formatTimeSafe(b.eventDate)} Onwards</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 block">
                              Booked on {formatDateSafe(b.createdAt, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </td>

                        {/* 5. Quantity & Tier */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div className="space-y-1">
                            <span className="px-3 py-1 rounded-xl bg-zinc-800 text-xs font-bold text-zinc-200 border border-white/5 inline-block">
                              {b.ticketsCount || 1} {isEventPass ? 'Pass' + ((b.ticketsCount || 1) > 1 ? 'es' : '') : 'Slot'}
                            </span>
                            {b.tierName && (
                              <span className="block text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 max-w-fit">
                                {b.tierName}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 6. Amount Paid */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div>
                            <span className="text-base font-black text-emerald-400">
                              ₹{(b.amount || b.totalAmount || 0).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-zinc-500 block">
                              Includes 2% + 18% GST
                            </span>
                          </div>
                        </td>

                        {/* 7. Payment Status & Payment ID */}
                        <td className="p-4 sm:p-5 align-middle">
                          <div className="space-y-1.5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                              b.status === 'CONFIRMED' || b.status === 'SUCCESS'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                                : b.status === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}>
                              {b.status === 'CONFIRMED' || b.status === 'SUCCESS' ? (
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                              ) : b.status === 'PENDING' ? (
                                <Clock className="w-3 h-3 text-amber-400" />
                              ) : (
                                <AlertCircle className="w-3 h-3 text-rose-400" />
                              )}
                              {b.status}
                            </span>

                            {b.paymentId && b.paymentId !== 'N/A' && (
                              <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                                <span>PID: {b.paymentId.slice(0, 14)}...</span>
                                <button
                                  onClick={() => copyToClipboard(b.paymentId, 'Payment ID')}
                                  title="Copy Razorpay Payment ID"
                                  className="text-zinc-500 hover:text-zinc-300"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 8. Actions */}
                        <td className="p-4 sm:p-5 align-middle text-right">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-rose-600 text-zinc-300 hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 border border-white/10 group-hover:border-rose-500/40"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Booking Details Full Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0e1118] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-xl flex items-center gap-2">
                      Pass #{selectedBooking.ticketId || selectedBooking.id}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Booked on {formatDateTimeSafe(selectedBooking.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* Customer Details Block */}
                <div className="bg-zinc-900/60 rounded-2xl p-5 border border-white/5 space-y-3">
                  <span className="text-xs text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4" /> Customer Contact Information
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Customer Name</p>
                      <p className="font-bold text-white text-base mt-0.5">{selectedBooking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Phone Number</p>
                      <p className="font-bold text-emerald-400 text-base mt-0.5 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        <a href={`tel:${selectedBooking.customerPhone}`} className="hover:underline">
                          {selectedBooking.customerPhone}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Email Address</p>
                      <p className="font-medium text-zinc-300 text-sm mt-0.5 truncate">{selectedBooking.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Passes & Tier</p>
                      <p className="font-bold text-white text-sm mt-0.5">
                        {selectedBooking.ticketsCount || 1} Pass(es)
                        {selectedBooking.tierName ? ` • ${selectedBooking.tierName}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event / Service Details Block */}
                <div className="bg-zinc-900/60 rounded-2xl p-5 border border-white/5 space-y-3">
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" /> Celebration Event Information
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Event / Celebration</p>
                      <p className="font-bold text-white text-base mt-0.5">{selectedBooking.serviceName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Location / Venue</p>
                      <p className="font-medium text-zinc-300 text-sm mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {selectedBooking.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Scheduled Event Date</p>
                      <p className="font-semibold text-zinc-200 text-sm mt-0.5">
                        {formatDateSafe(selectedBooking.eventDate, {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-medium">Event Time</p>
                      <p className="font-semibold text-zinc-200 text-sm mt-0.5">
                        {formatTimeSafe(selectedBooking.eventDate)} Onwards
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial & Payment Gateway Details */}
                <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-950 p-5 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Total Payment</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Razorpay Payment ID: <span className="font-mono text-zinc-200">{selectedBooking.paymentId}</span>
                    </p>
                    {selectedBooking.referralCode && (
                      <p className="text-xs text-indigo-400">
                        Referral Partner: {selectedBooking.referralCode}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-emerald-400">
                      ₹{(selectedBooking.amount || selectedBooking.totalAmount || 0).toLocaleString('en-IN')}
                    </p>
                    <span className="text-[11px] text-zinc-500 font-medium">Paid Online • Status: {selectedBooking.status}</span>
                  </div>
                </div>
                {/* Status Update & Actions Block */}
                <div className="bg-zinc-900/60 rounded-2xl p-5 border border-white/5 space-y-3">
                  <span className="text-xs text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Admin Status Controls
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(['CONFIRMED', 'COMPLETED', 'CANCELLED', 'REFUNDED'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedBooking.id, st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedBooking.status === st
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                        }`}
                      >
                        Set {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 bg-zinc-950/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(selectedBooking.ticketId || selectedBooking.id, 'Ticket ID')}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Ticket ID</span>
                  </button>
                  <button
                    onClick={() => handleDeleteBooking(selectedBooking.id)}
                    className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 hover:bg-rose-900/60 text-xs font-semibold flex items-center gap-2"
                  >
                    <span>Delete Record</span>
                  </button>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
