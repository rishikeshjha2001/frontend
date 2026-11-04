'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ShoppingBag, X, RefreshCw, Clock } from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

interface BookingEvent {
  id: string;
  status: string;
  createdAt: string;
  note?: string;
}

interface Order {
  id: string;
  customerName: string;
  partnerName: string;
  amount: number;
  status: string;
  events: BookingEvent[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/v1/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || data);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (err) {
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-rose-500" />
            Orders & Bookings
          </h1>
          <p className="text-gray-400 mt-1">Monitor all booking events and order status</p>
        </div>
        <button
          onClick={fetchOrders}
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
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Partner</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-medium">{order.customerName}</td>
                    <td className="px-6 py-4">{order.partnerName}</td>
                    <td className="px-6 py-4">₹{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-rose-500" />
                  Booking Timeline
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {selectedOrder.events?.length > 0 ? (
                    selectedOrder.events.map((event, index) => (
                      <div key={event.id || index} className="relative pl-6 pb-6 border-l border-white/10 last:border-0 last:pb-0">
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-[#0f0f0f]" />
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-white text-sm capitalize">{event.status}</span>
                            <span className="text-xs text-gray-500">{new Date(event.createdAt).toLocaleString()}</span>
                          </div>
                          {event.note && (
                            <p className="text-sm text-gray-400 mt-2">{event.note}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No events found for this order</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
