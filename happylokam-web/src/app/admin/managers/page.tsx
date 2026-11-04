'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { authFetch } from '@/lib/auth-fetch';
import {
  ShieldAlert,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  KeyRound,
  RefreshCw,
  Loader2,
  Users,
  Building2,
  Filter,
  BadgeCheck,
  Calendar
} from 'lucide-react';

interface Manager {
  id: string;
  hlpId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLocation, setFormLocation] = useState('Patna, Bihar');
  const [formPassword, setFormPassword] = useState('');

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/v1/admin/managers');
      const data = await res.json();
      if (data.success) {
        setManagers(data.data || []);
      } else {
        toast.error(data.error || 'Failed to fetch managers');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error fetching managers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPassword || !formLocation) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const res = await authFetch('/api/v1/admin/managers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          location: formLocation,
          password: formPassword
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create manager');
      }

      toast.success(`Manager ${data.data.name} created! Unique ID: ${data.data.hlpId}`);
      setShowAddModal(false);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormPassword('');
      fetchManagers();
    } catch (err: any) {
      toast.error(err.message || 'Could not create manager');
    } finally {
      setCreating(false);
    }
  };

  const filteredManagers = managers.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.hlpId.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.location && m.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Field Operations & Staff Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Field Managers & Supervisors
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Assign unique Manager IDs, manage field supervisor permissions, and monitor ground team onboarding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchManagers()}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Manager</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#090d1a]/80 border border-white/10 backdrop-blur-xl">
          <span className="text-xs text-zinc-400 block font-medium">Total Field Managers</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-white font-mono">{managers.length}</span>
            <span className="text-xs text-rose-400 font-bold">Registered Staff</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090d1a]/80 border border-white/10 backdrop-blur-xl">
          <span className="text-xs text-zinc-400 block font-medium">Active On-Field</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {managers.filter((m) => m.isActive !== false).length}
            </span>
            <span className="text-xs text-emerald-500 font-bold">Ready for Operations</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090d1a]/80 border border-white/10 backdrop-blur-xl">
          <span className="text-xs text-zinc-400 block font-medium">Primary Operating Hub</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-blue-400 font-mono">Patna, Bihar</span>
          </div>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#090d1a]/80 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Manager ID, Name, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#05070f] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        <div className="text-xs text-zinc-400">
          Showing <span className="text-white font-bold">{filteredManagers.length}</span> managers
        </div>
      </div>

      {/* Managers Table */}
      <div className="rounded-2xl bg-[#090d1a]/80 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#05070f]/90 border-b border-white/10 text-zinc-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-4">Manager ID</th>
                <th className="px-5 py-4">Supervisor Details</th>
                <th className="px-5 py-4">Assigned Location</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-rose-500 mb-2" />
                    <span>Loading field managers ledger...</span>
                  </td>
                </tr>
              ) : filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-zinc-500">
                    <Users className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
                    <p className="font-bold text-zinc-400">No managers found matching criteria.</p>
                    <p className="text-[11px] text-zinc-600 mt-1">
                      Click &quot;Add New Manager&quot; to onboard your first field supervisor.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredManagers.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono font-black text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2.5 py-1 rounded-lg">
                        {m.hlpId.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{m.name}</span>
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      </div>
                      <span className="text-zinc-400 text-[11px] block mt-0.5">{m.email}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{m.location || 'Patna Hub'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{m.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ACTIVE</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 font-mono text-[11px]">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Manager Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-[#0d1222] border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Add Field Manager</h2>
                    <p className="text-xs text-zinc-400">Generate credentials and assign operating zone</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateManager} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="manager@happylokam.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Assigned Location / City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Patna Central"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Manager...</span>
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="w-4 h-4" />
                        <span>Save & Generate ID</span>
                      </>
                    )}
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
