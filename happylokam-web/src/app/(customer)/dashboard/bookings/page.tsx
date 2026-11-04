'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle, Clock, XCircle, Ticket, Store } from 'lucide-react';
import { toast } from 'sonner';
import { authFetch } from '@/lib/auth-fetch';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<'Vendor Bookings' | 'Event Tickets'>('Event Tickets');
  const [vendorBookings, setVendorBookings] = useState<any[]>([]);
  const [eventBookings, setEventBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await authFetch('/api/v1/user/bookings');
        const data = await response.json();
        if (data.success) {
          setVendorBookings(data.data.vendorBookings || []);
          setEventBookings(data.data.eventBookings || []);
        }
      } catch (err: any) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-rose-500 font-bold">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['Event Tickets', 'Vendor Bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-black'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'Event Tickets' && (
          <div className="space-y-4">
            {eventBookings.length === 0 ? (
              <p className="text-zinc-500">No event tickets found.</p>
            ) : (
              eventBookings.map((booking) => (
                <div key={booking.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-32 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                    {booking.event?.imageUrl ? (
                      <img src={booking.event.imageUrl} alt={booking.event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-rose-900/30 text-rose-500">
                        <Ticket className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{booking.event?.title || 'Event Booking'}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        booking.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="space-y-1 mb-4 text-zinc-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.event?.date || booking.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.event?.location || 'Venue'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-zinc-500">Total Paid</p>
                        <p className="font-bold text-lg">₹{booking.totalAmount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">Tickets</p>
                        <p className="font-bold text-lg">{booking.ticketsCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'Vendor Bookings' && (
          <div className="space-y-4">
            {vendorBookings.length === 0 ? (
              <p className="text-zinc-500">No vendor bookings found.</p>
            ) : (
              vendorBookings.map((booking) => (
                <div key={booking.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-32 h-32 bg-zinc-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-zinc-500">
                    <Store className="w-8 h-8" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{booking.partner?.businessName || 'Vendor Booking'}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        booking.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="space-y-1 mb-4 text-zinc-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-zinc-500">Total Paid</p>
                        <p className="font-bold text-lg">₹{booking.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
