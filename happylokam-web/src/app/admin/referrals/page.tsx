'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, TrendingUp, Users, Search, Activity, DollarSign, ExternalLink, CalendarCheck, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { authFetch } from '@/lib/auth-fetch';

export default function ReferralsAdmin() {
  const [data, setData] = useState<any>({
    kpis: { totalSignupsViaReferral: 0, totalBookingsViaReferral: 0, totalReferralRevenue: 0, totalBonusDistributed: 0 },
    partners: []
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/v1/admin/referrals');
      const result = await res.json();
      if (res.ok) {
        setData(result.data || { kpis: { totalSignupsViaReferral: 0, totalBookingsViaReferral: 0, totalReferralRevenue: 0, totalBonusDistributed: 0 }, partners: [] });
      } else {
        toast.error('Failed to fetch referral data');
      }
    } catch (error) {
      toast.error('Error fetching referral data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const filteredPartners = (data.partners || []).filter((p: any) => 
    p.partnerName?.toLowerCase().includes(search.toLowerCase()) ||
    p.referralCode?.toLowerCase().includes(search.toLowerCase()) ||
    p.hlpId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partner Referrals & QR Portal</h1>
          <p className="text-zinc-400 mt-1">Track partner invite trees, customer bookings via referral codes, and distributed rewards in real-time.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Referred Partners</p>
                <h3 className="text-2xl font-bold mt-1">{data.kpis?.totalSignupsViaReferral || 0}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Code Bookings</p>
                <h3 className="text-2xl font-bold mt-1">{data.kpis?.totalBookingsViaReferral || 0}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Booking Revenue</p>
                <h3 className="text-2xl font-bold mt-1">₹{(data.kpis?.totalReferralRevenue || 0).toLocaleString('en-IN')}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Bonus Distributed</p>
                <h3 className="text-2xl font-bold mt-1">₹{(data.kpis?.totalBonusDistributed || 0).toLocaleString('en-IN')}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search partners, codes, or HLP IDs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40">
                <th className="p-4 font-medium text-zinc-400">Partner & HLP ID</th>
                <th className="p-4 font-medium text-zinc-400">Referral Code</th>
                <th className="p-4 font-medium text-zinc-400 text-center">Invited Partners</th>
                <th className="p-4 font-medium text-zinc-400 text-center">Code Bookings</th>
                <th className="p-4 font-medium text-zinc-400">Amount Booked</th>
                <th className="p-4 font-medium text-zinc-400">Bonus Earned</th>
                <th className="p-4 font-medium text-zinc-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">Loading live referral network...</td>
                </tr>
              ) : filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    No partner referral activities found.
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner: any, idx: number) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{partner.partnerName}</div>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">{partner.hlpId || 'HLP-PRO'}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 text-xs">
                        {partner.referralCode}
                      </span>
                    </td>
                    <td className="p-4 text-center font-semibold text-zinc-300">
                      {partner.totalSignups || 0}
                    </td>
                    <td className="p-4 text-center font-semibold text-purple-400">
                      {partner.bookingsViaCode || 0}
                    </td>
                    <td className="p-4 font-semibold text-emerald-400">
                      ₹{(partner.bookingRevenueGenerated || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 font-semibold text-amber-400">
                      ₹{(partner.referralBonusEarned || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${partner.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                        {partner.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
