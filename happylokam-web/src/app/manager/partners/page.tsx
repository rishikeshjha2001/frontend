'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  Building2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Filter
} from 'lucide-react';

export default function MyPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const fetchPartners = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/v1/manager/partners', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch assigned partners');
      const data = await res.json();
      if (data.success) {
        setPartners(data.data || []);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load partners');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPartners();
  };

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      p.hlpId?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search);

    if (statusFilter === 'ACTIVE') return matchesSearch && p.isVerified;
    if (statusFilter === 'PENDING') return matchesSearch && !p.isVerified;
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Assigned Partners
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, manage, and verify status for all businesses onboarded under your manager account.
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
            <span>Onboard New Partner</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by business name, HLP ID, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Filter:</span>
          {(['ALL', 'ACTIVE', 'PENDING'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status === 'ALL' ? 'All Partners' : status === 'ACTIVE' ? 'Active / Verified' : 'Pending Review'}
            </button>
          ))}
        </div>
      </div>

      {/* Partners List Table */}
      <div className="rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 overflow-hidden backdrop-blur-xl">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mb-2" />
            <span>Loading partners...</span>
          </div>
        ) : filteredPartners.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Business Details</th>
                  <th className="py-3.5 px-4">HLP ID</th>
                  <th className="py-3.5 px-4">Phone & Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">
                        {partner.businessName || partner.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Owner: {partner.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      {partner.hlpId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{partner.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{partner.location || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {partner.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>Pending Admin</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`tel:${partner.phone}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3 h-3 text-blue-400" />
                        <span>Call</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">No partners found</p>
            <p className="text-xs text-slate-400 mt-1">
              {search ? 'Try adjusting your search criteria' : 'Click below to onboard your first partner'}
            </p>
            {!search && (
              <Link
                href="/manager/partners/onboard"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Onboard Partner</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
