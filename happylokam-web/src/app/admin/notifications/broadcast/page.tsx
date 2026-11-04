'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Send, 
  Users, 
  Briefcase, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Smartphone, 
  MessageSquare,
  Sparkles,
  Loader2
} from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  targetRole: string;
  type: string;
  sentAt: string;
  createdAt: string;
};

export default function AdminBroadcastPage() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'ALL',
    type: 'IN_APP',
  });
  const [history, setHistory] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [toastMsg, setToastMsg] = useState<{ title: string; type: 'success' | 'error' } | null>(null);

  const showToast = (title: string, type: 'success' | 'error') => {
    setToastMsg({ title, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/v1/notifications/all');
      if (res.ok) {
        const json = await res.json();
        setHistory(Array.isArray(json.data) ? json.data : []);
      }
    } catch (error) {
      showToast('Failed to load notification history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      showToast('Title and message are required', 'error');
      return;
    }

    try {
      setSending(true);
      const res = await authFetch('/api/v1/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to broadcast notification');
      }

      showToast('Notification broadcasted to all recipients!', 'success');
      setFormData({ title: '', message: '', targetRole: 'ALL', type: 'IN_APP' });
      fetchHistory();
    } catch (error: any) {
      showToast(error.message || 'Error broadcasting notification', 'error');
    } finally {
      setSending(false);
    }
  };

  const getTargetBadge = (role: string) => {
    switch (role) {
      case 'USER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="w-3 h-3" /> Customers Only
          </span>
        );
      case 'PARTNER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Briefcase className="w-3 h-3" /> Partners Only
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Globe className="w-3 h-3" /> Everyone (All)
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 md:p-10 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />

      {/* Floating Toast */}
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
        {/* Header Section */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-rose-500" />
            Broadcast Notifications
          </h1>
          <p className="text-sm text-zinc-400 mt-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            Send instant alerts, promotional announcements, and updates directly to mobile apps and web user dashboards.
          </p>
        </div>

        {/* Compose Form */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl max-w-3xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-rose-400" />
            Compose New Broadcast
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Notification Headline / Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. 🎉 Special Dandiya Passes Released | 20% Off Venue Bookings!"
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-500 focus:outline-none placeholder:text-zinc-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Broadcast Message Body *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your announcement or alert details here..."
                required
                rows={4}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-500 focus:outline-none placeholder:text-zinc-600 transition resize-none"
              />
            </div>

              <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Target Audience
                </label>
                <select
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-500 focus:outline-none transition"
                >
                  <option value="ALL">Everyone (Users + Partners)</option>
                  <option value="USER">Customers & App Users Only</option>
                  <option value="PARTNER">Vendors & Venue Partners Only</option>
                </select>
              </div>

            </div>

            <button
              type="submit"
              disabled={sending}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl shadow-lg shadow-rose-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Send Broadcast Now
            </button>
          </form>
        </div>

        {/* Broadcast History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-400" />
              Broadcast History ({history.length})
            </h2>
          </div>

          <div className="bg-zinc-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
            {loading ? (
              <div className="py-16 text-center text-zinc-500 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-rose-500" /> Loading history...
              </div>
            ) : history.length === 0 ? (
              <div className="py-16 text-center text-zinc-500">
                <MessageSquare className="w-10 h-10 mx-auto text-zinc-700 mb-2" />
                No broadcast notifications recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-white/[0.03] text-xs font-semibold text-zinc-300 uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">Title & Message</th>
                      <th className="px-6 py-4">Target Audience</th>
                      <th className="px-6 py-4">Channel</th>
                      <th className="px-6 py-4">Sent At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {history.map((record) => (
                      <tr key={record.id} className="hover:bg-white/[0.02] transition">
                        <td className="px-6 py-4 max-w-md">
                          <div className="font-semibold text-white text-base">{record.title}</div>
                          <div className="text-xs text-zinc-400 mt-1 line-clamp-2">{record.message}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTargetBadge(record.targetRole)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-zinc-300 border border-white/10">
                            {record.type === 'PUSH' ? <Smartphone className="w-3.5 h-3.5 text-rose-400" /> : <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />}
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-zinc-500">
                          {new Date(record.sentAt || record.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
