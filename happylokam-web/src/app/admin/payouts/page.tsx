'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Banknote, RefreshCw } from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

interface Payout {
  id: string;
  partnerName: string;
  amount: number;
  settlementDate: string;
  status: string;
}

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/v1/admin/payouts');
      if (res.ok) {
        const data = await res.json();
        setPayouts(data.payouts || data);
      } else {
        toast.error('Failed to fetch payouts');
      }
    } catch (err) {
      toast.error('Error fetching payouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleMarkProcessed = async (payoutId: string) => {
    try {
      const res = await authFetch(`/api/v1/admin/payouts/${payoutId}/process`, {
        method: 'POST',
      });
      if (res.ok) {
        toast.success('Payout marked as processed');
        fetchPayouts();
      } else {
        toast.error('Failed to mark processed');
      }
    } catch (err) {
      toast.error('Error processing payout');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Banknote className="w-6 h-6 text-rose-500" />
            Partner Payouts
          </h1>
          <p className="text-gray-400 mt-1">Manage partner settlements and payouts</p>
        </div>
        <button
          onClick={fetchPayouts}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Partner</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Settlement Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No payouts found
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{payout.partnerName}</td>
                    <td className="px-6 py-4">₹{payout.amount}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {payout.settlementDate ? new Date(payout.settlementDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payout.status === 'processed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        payout.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payout.status !== 'processed' && (
                        <button
                          onClick={() => handleMarkProcessed(payout.id)}
                          className="px-3 py-1.5 text-xs font-medium bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors"
                        >
                          Mark Processed
                        </button>
                      )}
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
