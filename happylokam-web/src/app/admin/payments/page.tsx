'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { CreditCard, History, X, Search, RefreshCw, User, Phone, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

interface PaymentEvent {
  id: string;
  type: string;
  createdAt: string;
  data: any;
}

interface Payment {
  id: string;
  razorpayId: string;
  amount: number;
  status: string;
  capturedAt: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  serviceName?: string;
  bookingType?: string;
  events?: PaymentEvent[];
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [search, setSearch] = useState('');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/v1/admin/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || data.data || data || []);
      } else {
        toast.error('Failed to fetch payments');
      }
    } catch (err) {
      toast.error('Error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async (paymentId: string) => {
    try {
      const res = await authFetch(`/api/v1/admin/payments/${paymentId}/refund`, {
        method: 'POST',
      });
      if (res.ok) {
        toast.success('Refund initiated successfully');
        fetchPayments();
      } else {
        toast.error('Refund failed');
      }
    } catch (err) {
      toast.error('Error processing refund');
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (p.razorpayId && p.razorpayId.toLowerCase().includes(q)) ||
      (p.customerName && p.customerName.toLowerCase().includes(q)) ||
      (p.customerPhone && p.customerPhone.toLowerCase().includes(q)) ||
      (p.customerEmail && p.customerEmail.toLowerCase().includes(q)) ||
      (p.serviceName && p.serviceName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-rose-500" />
            Payment & Gateway Transactions
          </h1>
          <p className="text-gray-400 mt-1">
            Real-time Razorpay settlements, admission tickets, and celebration booking transactions with customer details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, phone, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Razorpay / Ticket ID</th>
                <th className="px-6 py-4 font-medium">Customer Details</th>
                <th className="px-6 py-4 font-medium">Service / Pass</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Captured Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-28"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No payment records found. Real-time payments from mobile passes and web checkouts will appear here.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    onClick={() => setSelectedPayment(payment)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-rose-400 font-medium">
                      {payment.razorpayId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{payment.customerName || 'Customer'}</div>
                      <div className="text-xs text-gray-400">{payment.customerPhone || payment.customerEmail || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-200 line-clamp-1">{payment.serviceName || 'Celebration Pass'}</div>
                      {payment.bookingType && (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium mt-0.5">
                          {payment.bookingType}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      ₹{payment.amount?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        payment.status?.toLowerCase() === 'captured' || payment.status?.toLowerCase() === 'success' || payment.status?.toLowerCase() === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : payment.status?.toLowerCase() === 'failed'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : payment.status?.toLowerCase() === 'refunded'
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {payment.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {payment.capturedAt ? new Date(payment.capturedAt).toLocaleString('en-IN') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRefund(payment.id);
                        }}
                        disabled={payment.status === 'refunded' || payment.status === 'failed'}
                        className="px-3 py-1.5 text-xs font-medium bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Refund
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-500" />
                  Transaction Details
                </h3>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-semibold">Payment / Pass ID</div>
                    <div className="text-sm font-mono text-rose-400 font-bold mt-1 break-all">{selectedPayment.razorpayId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 uppercase font-semibold">Total Amount</div>
                    <div className="text-lg font-bold text-emerald-400 mt-1">₹{selectedPayment.amount?.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-xs text-gray-400 uppercase font-semibold mb-2">Customer Information</div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <User className="w-4 h-4 text-rose-400" />
                    <span>{selectedPayment.customerName || 'Customer'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{selectedPayment.customerPhone || 'No contact provided'}</span>
                  </div>
                  {selectedPayment.customerEmail && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>{selectedPayment.customerEmail}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="text-xs text-gray-400 uppercase font-semibold">Service / Booking</div>
                  <div className="text-sm font-bold text-white">{selectedPayment.serviceName || 'Celebration Pass'}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Captured on {selectedPayment.capturedAt ? new Date(selectedPayment.capturedAt).toLocaleString('en-IN') : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
