'use client';

import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Phone,
  MessageCircle,
  Mail,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Send,
  Trash2,
  User,
  Ticket,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  userPhone: string;
  category: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  adminReply?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Metrics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  urgent: number;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  BOOKING_PASS: { label: 'Pass & QR Admission', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  PAYMENT_RAZORPAY: { label: 'Razorpay & Payments', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  CATERING_DECOR: { label: 'Catering & Decor Themes', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  VENUE_ACCESS: { label: 'Venue & Location', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  GENERAL: { label: 'General Inquiry', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

const PRIORITY_BADGES: Record<string, { label: string; color: string }> = {
  URGENT: { label: 'Urgent', color: 'bg-rose-600 text-white animate-pulse' },
  HIGH: { label: 'High Priority', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  MEDIUM: { label: 'Normal', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  LOW: { label: 'Low', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ total: 0, open: 0, inProgress: 0, resolved: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL') params.append('priority', priorityFilter);
      if (searchQuery.trim()) params.append('q', searchQuery.trim());

      const res: any = await apiClient.get(`/admin/support?${params.toString()}`);
      if (res?.success) {
        setTickets(res.data || []);
        if (res.metrics) setMetrics(res.metrics);
      } else if (Array.isArray(res)) {
        setTickets(res);
      }
    } catch (err: any) {
      console.warn('Load support tickets fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [statusFilter, priorityFilter]);

  const handleUpdateStatus = async (ticketId: string, newStatus: string, reply?: string) => {
    try {
      setUpdatingStatus(true);
      const res: any = await apiClient.patch(`/admin/support/${ticketId}/status`, {
        status: newStatus,
        adminReply: reply !== undefined ? reply : undefined,
      });

      if (res?.success) {
        showToast(`Ticket status updated to ${newStatus}`);
        setTickets(prev =>
          prev.map(t =>
            t.id === ticketId
              ? { ...t, status: newStatus as any, adminReply: reply || t.adminReply }
              : t
          )
        );
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(prev => prev ? { ...prev, status: newStatus as any, adminReply: reply || prev.adminReply } : null);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update ticket status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to permanently delete this support ticket?')) return;
    try {
      await apiClient.delete(`/admin/support/${ticketId}`);
      showToast('Support ticket deleted successfully');
      setTickets(prev => prev.filter(t => t.id !== ticketId));
      if (selectedTicket?.id === ticketId) setSelectedTicket(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete support ticket');
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.ticketNumber?.toLowerCase().includes(q) ||
        t.userName?.toLowerCase().includes(q) ||
        t.userPhone?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.message?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Customer Support Desk</h1>
              <p className="text-xs text-zinc-400">
                Live help tickets, callback requests, payment assistance, and gate pass troubleshooting
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadTickets}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Tickets</span>
          <p className="text-2xl font-black text-white mt-1">{metrics.total}</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Needs Review
          </span>
          <p className="text-2xl font-black text-amber-300 mt-1">{metrics.open}</p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> In Progress
          </span>
          <p className="text-2xl font-black text-blue-300 mt-1">{metrics.inProgress}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
          <p className="text-2xl font-black text-emerald-300 mt-1">{metrics.resolved}</p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 col-span-2 md:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" /> Urgent / Critical
          </span>
          <p className="text-2xl font-black text-rose-300 mt-1">{metrics.urgent}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-zinc-900/60 p-3.5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {status === 'ALL' ? 'All Tickets' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ticket #, guest, phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
            Loading dynamic support requests...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">All Clear! No Pending Tickets</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              No customer inquiries match your current filter. Real customer tickets submitted from the user app will appear here instantly.
            </p>
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const catBadge = CATEGORY_LABELS[ticket.category] || CATEGORY_LABELS.GENERAL;
            const priorityBadge = PRIORITY_BADGES[ticket.priority] || PRIORITY_BADGES.MEDIUM;

            return (
              <div
                key={ticket.id}
                className={`p-5 rounded-2xl border transition-all ${
                  ticket.status === 'OPEN'
                    ? 'bg-gradient-to-r from-zinc-900/90 to-zinc-900/60 border-amber-500/30'
                    : ticket.status === 'RESOLVED'
                    ? 'bg-zinc-950/60 border-white/5 opacity-80'
                    : 'bg-zinc-900/70 border-white/10'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-amber-400 px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/20">
                        {ticket.ticketNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${catBadge.color}`}>
                        {catBadge.label}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${priorityBadge.color}`}>
                        {priorityBadge.label}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {new Date(ticket.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">{ticket.subject}</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                      "{ticket.message}"
                    </p>

                    {ticket.adminReply && (
                      <div className="bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Support Resolution: </span>
                          {ticket.adminReply}
                        </div>
                      </div>
                    )}

                    {/* Customer Info & Direct Contacts */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 font-bold text-zinc-200">
                        <User className="w-3.5 h-3.5 text-rose-400" />
                        {ticket.userName}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-zinc-300">{ticket.userPhone}</span>
                      {ticket.userEmail && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-400">{ticket.userEmail}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col gap-2 shrink-0 md:min-w-[190px]">
                    {/* Direct Contact Buttons */}
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/91${ticket.userPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                          ticket.userName
                        )},%20regarding%20your%20happylokam%20support%20ticket%20${ticket.ticketNumber}:`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold transition"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-400" />
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${ticket.userPhone}`}
                        className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-[11px] font-bold transition"
                      >
                        <Phone className="w-3 h-3 text-blue-400" />
                        Call
                      </a>
                      {ticket.userEmail && (
                        <a
                          href={`mailto:${ticket.userEmail}?subject=happylokam%20Support%20Ticket%20${ticket.ticketNumber}`}
                          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition"
                          title="Send Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative">
                      <select
                        value={ticket.status}
                        onChange={e => handleUpdateStatus(ticket.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-rose-500 cursor-pointer appearance-none"
                      >
                        <option value="OPEN">🔴 Open / Needs Review</option>
                        <option value="IN_PROGRESS">🟡 In Progress</option>
                        <option value="RESOLVED">🟢 Resolved</option>
                        <option value="CLOSED">⚪ Closed</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Reply / Resolution Button */}
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setReplyText(ticket.adminReply || '');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      {ticket.adminReply ? 'Edit Resolution' : 'Resolve & Reply'}
                    </button>

                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="text-[11px] text-zinc-500 hover:text-rose-400 flex items-center justify-center gap-1 transition pt-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Ticket
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolution & Reply Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center font-black">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Resolve Support Ticket</h3>
                  <p className="text-[11px] text-zinc-400">
                    {selectedTicket.ticketNumber} • {selectedTicket.userName} ({selectedTicket.userPhone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Customer Query:</span>
              <p className="text-xs text-zinc-200 font-semibold">{selectedTicket.subject}</p>
              <p className="text-xs text-zinc-400">"{selectedTicket.message}"</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Resolution Note / Reply
              </label>
              <textarea
                rows={3}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="e.g. Verified payment transaction with Razorpay. Entry pass #HL-TCK-8123 confirmed and QR code re-sent via WhatsApp."
                className="w-full bg-black/50 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={updatingStatus}
                onClick={async () => {
                  await handleUpdateStatus(selectedTicket.id, 'RESOLVED', replyText);
                  setSelectedTicket(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                {updatingStatus ? 'Saving...' : 'Mark as Resolved & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
