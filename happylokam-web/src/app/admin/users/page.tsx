'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Trash2, Users, ShieldCheck, Mail, Phone, Calendar, Wallet, Plus, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authFetch } from '@/lib/auth-fetch';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Wallet Credit Modal State
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [walletAmount, setWalletAmount] = useState<string>('500');
  const [walletReason, setWalletReason] = useState<string>('Celebration discount credit for next booking');
  const [isCreditMode, setIsCreditMode] = useState<boolean>(true); // true: Add to balance, false: Set exact balance
  const [updatingWallet, setUpdatingWallet] = useState<boolean>(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`/api/v1/admin/users?search=${encodeURIComponent(search)}&page=${page}`);
      if (!res.ok) { if (res.status === 401) return; throw new Error('Failed to fetch users'); }
      const data = await res.json();
      setUsers(data.users || data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await authFetch(`/api/v1/admin/users/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete user');
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleOpenWalletModal = (user: any) => {
    setSelectedUser(user);
    setWalletAmount('500');
    setWalletReason('Celebration discount credit for next booking');
    setIsCreditMode(true);
  };

  const handleSaveWallet = async () => {
    if (!selectedUser) return;
    const numAmount = parseFloat(walletAmount);
    if (isNaN(numAmount) || numAmount < 0) {
      toast.error('Please enter a valid discount amount');
      return;
    }

    const currentBalance = Number(selectedUser.walletBalance || 0);
    const targetBalance = isCreditMode ? currentBalance + numAmount : numAmount;

    setUpdatingWallet(true);
    try {
      const userId = selectedUser.id || selectedUser._id;
      const res = await authFetch(`/api/v1/admin/users/${userId}/wallet`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: targetBalance,
          reason: walletReason || 'Admin discount credit for next celebration pass'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update wallet');

      toast.success(`Wallet balance updated to ₹${targetBalance.toLocaleString()} for ${selectedUser.name}!`);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update wallet balance');
    } finally {
      setUpdatingWallet(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await authFetch('/api/v1/admin/export/users');
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users-report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Users exported successfully');
    } catch (error) {
      toast.error('Failed to export users');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Users & Celebration Wallets</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administer user accounts, credit celebration discounts directly into user wallets, and export records.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download Excel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
            />
          </div>
          <div className="text-xs text-gray-500">
            Click <span className="font-semibold text-emerald-600">Credit Discount</span> on any user to add wallet balance for their next booking.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Email & Phone</th>
                <th className="p-4 font-semibold">Celebration Wallet</th>
                <th className="p-4 font-semibold">Joined Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 bg-gray-100 rounded"></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No users found matching your query
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const balance = Number(user.walletBalance || 0);
                  return (
                    <tr key={user._id || user.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-400 capitalize">{user.role || 'USER'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="text-gray-700 font-medium">{user.email}</div>
                        <div className="text-xs text-gray-500">{user.phone || 'No phone recorded'}</div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                          <span>₹{balance.toLocaleString()}</span>
                          <span className="text-[10px] text-emerald-600/80 font-normal">Discount Credit</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(user.createdAt || user.joinedAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenWalletModal(user)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                            title="Credit Discount to Wallet"
                          >
                            <Wallet className="w-3.5 h-3.5" />
                            Credit Discount
                          </button>
                          <button
                            onClick={() => handleDelete(user._id || user.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm bg-gray-50/50">
          <span className="text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Credit Wallet Discount Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Celebration Wallet Discount</h3>
                  <p className="text-xs text-emerald-100">Credit discount for user's next booking</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-700 font-medium">Recipient User</div>
                  <div className="text-sm font-bold text-gray-900">{selectedUser.name}</div>
                  <div className="text-xs text-gray-500">{selectedUser.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-emerald-700 font-medium">Current Balance</div>
                  <div className="text-base font-extrabold text-emerald-700">
                    ₹{Number(selectedUser.walletBalance || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsCreditMode(true)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isCreditMode ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  + Add Credit (Top-up)
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreditMode(false)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    !isCreditMode ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Set Exact Balance
                </button>
              </div>

              {/* Quick Select Chips */}
              {isCreditMode && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Quick Celebration Discount Amount
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['200', '350', '500', '1000'].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWalletAmount(amt)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                          walletAmount === amt
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isCreditMode ? 'Credit Amount (₹)' : 'New Total Balance (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base font-bold text-gray-900"
                    placeholder="500"
                  />
                </div>
                {isCreditMode && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    New balance will be: <strong className="text-emerald-700">₹{(Number(selectedUser.walletBalance || 0) + (parseFloat(walletAmount) || 0)).toLocaleString()}</strong>
                  </p>
                )}
              </div>

              {/* Reason / Admin Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Discount Note / Campaign
                </label>
                <input
                  type="text"
                  value={walletReason}
                  onChange={(e) => setWalletReason(e.target.value)}
                  placeholder="e.g. Navratri Dandiya Pass Discount, VIP Reward"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs text-gray-800"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveWallet}
                  disabled={updatingWallet}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {updatingWallet ? (
                    'Processing...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      {isCreditMode ? `Credit ₹${walletAmount || 0}` : `Update Balance`}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
