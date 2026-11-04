'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle, Search, RefreshCw, Calendar, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { authFetch } from '@/lib/auth-fetch';

export default function PartnerBookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const authRes = await authFetch('/api/v1/auth/me');
      if (!authRes.ok) throw new Error('Failed to fetch user');
      const authData = await authRes.json();
      const pId = authData.user?.id || authData.data?.id;

      const res = await authFetch('/api/v1/partners/bookings');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.bookings || data.data || []);
        setBookings(list);
      } else {
        // Fallback to partner booking by ID
        const fbRes = await authFetch(`/api/v1/bookings/partner/${pId}`);
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          setBookings(fbData.data || fbData.bookings || []);
        } else {
          setBookings([]);
        }
      }
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await authFetch(`/api/v1/partners/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        // Fallback
        await authFetch(`/api/v1/bookings/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
      }
      toast.success(`Booking marked as ${status.toLowerCase()}`);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesTab =
      activeTab === 'All'
        ? true
        : (b.status || '').toLowerCase() === activeTab.toLowerCase();

    if (!matchesTab) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const cName = (b.customerName || b.user?.name || '').toLowerCase();
    const cPhone = (b.customerPhone || b.user?.phone || '').toLowerCase();
    const cEmail = (b.customerEmail || b.user?.email || '').toLowerCase();
    const sName = (b.listing?.name || b.serviceName || b.venue?.name || '').toLowerCase();
    const tId = (b.ticketId || b.id || '').toLowerCase();

    return cName.includes(q) || cPhone.includes(q) || cEmail.includes(q) || sName.includes(q) || tId.includes(q);
  });

  const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-rose-600" />
            Service Bookings & Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time customer reservations for your venues, catering, decor, and celebration services.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, phone, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-rose-500 shadow-sm"
            />
          </div>
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-4 font-semibold">Booking / Ticket ID</th>
                <th className="p-4 font-semibold">Customer Details</th>
                <th className="p-4 font-semibold">Service / Venue</th>
                <th className="p-4 font-semibold">Event Date</th>
                <th className="p-4 font-semibold">Amount & Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    No bookings found in this view. When customers book your services, they will appear here with full contact details and payment confirmation.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking: any) => {
                  const customerName = booking.customerName || booking.user?.name || 'Customer';
                  const customerPhone = booking.customerPhone || booking.user?.phone || 'N/A';
                  const customerEmail = booking.customerEmail || booking.user?.email || 'N/A';
                  const serviceName = booking.listing?.name || booking.serviceName || booking.venue?.name || 'Celebration Service';
                  const bookingDate = booking.bookingDate || booking.date || booking.createdAt;
                  const isPaid = booking.paymentStatus === 'PAID' || booking.paymentStatus === 'CAPTURED';

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                          {booking.ticketId || booking.id.slice(0, 10)}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{customerName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" /> {customerPhone}
                        </p>
                        {customerEmail !== 'N/A' && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {customerEmail}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">{serviceName}</p>
                        {booking.venue?.city && (
                          <span className="text-[11px] text-gray-500">{booking.venue.city}</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600 text-xs font-medium">
                        {bookingDate ? new Date(bookingDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900 text-sm">
                          ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            booking.status?.toUpperCase() === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : booking.status?.toUpperCase() === 'PENDING'
                              ? 'bg-amber-100 text-amber-700'
                              : booking.status?.toUpperCase() === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {booking.status?.toUpperCase() || 'PENDING'}
                          </span>
                          {isPaid && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                              PAID
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {booking.status?.toUpperCase() === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                                title="Accept & Confirm"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Accept
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition"
                                title="Decline"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {booking.status?.toUpperCase() === 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold transition"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
