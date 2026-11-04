'use client';

import { useEffect, useState } from 'react';
import { Loader2, TrendingUp, Package, CalendarClock, AlertCircle, Share2, QrCode, Download, ChevronRight, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { authFetch } from '@/lib/auth-fetch';

export default function PartnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await authFetch('/api/v1/auth/me');
        if (!authRes.ok) throw new Error('Failed to fetch user');
        const authData = await authRes.json();
        const p = authData.user || authData.data;
        setPartner(p);

        const [bookRes, annRes, listRes] = await Promise.all([
          authFetch(`/api/v1/partners/bookings`).catch(() => authFetch(`/api/v1/bookings/partner/${p.id}`)),
          authFetch('/api/v1/announcements/active'),
          authFetch(`/api/v1/listings?partnerId=${p.id}`)
        ]);

        if (bookRes.ok) {
          const bd = await bookRes.json();
          setBookings(bd.data || []);
        }
        if (annRes.ok) {
          const ad = await annRes.json();
          setAnnouncements(ad.data || []);
        }
        if (listRes.ok) {
          const ld = await listRes.json();
          setListings(ld.data || []);
        }
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50/50">
        <Loader2 className="h-10 w-10 animate-spin text-rose-600" />
      </div>
    );
  }

  const getAnnouncementColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-50 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'LOW':
      default: return 'bg-green-50 text-green-800 border-green-200';
    }
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const activeListingsCount = listings.filter(l => l.status === 'Active' || l.status === 'ACTIVE').length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'Pending' || b.status === 'PENDING').length;

  const referralLink = `https://happylokam.com/register?ref=${partner?.referralCode}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralLink)}&color=e11d48`;

  const downloadQR = () => {
    fetch(qrUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `happylokam-referral-${partner?.referralCode}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => toast.error('Failed to download QR Code'));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting Banner */}
      <div className="relative overflow-hidden bg-zinc-950 rounded-[2rem] p-8 md:p-12 shadow-2xl border border-zinc-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Welcome back, {partner?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="mt-2 text-zinc-400 max-w-lg">
              Here's what's happening with your business today. You have {pendingBookingsCount} bookings waiting for approval.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-sm font-medium border border-rose-500/20">
                Partner ID: {partner?.hlpId}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                Wallet: ₹{partner?.walletBalance?.toLocaleString() || 0}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link href="/partner/listings/new" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105">
              <Plus className="w-5 h-5" /> Add Listing
            </Link>
          </div>
        </div>
      </div>

      {announcements.length > 0 && (
        <div className="space-y-3">
          {announcements.map((ann, i) => (
            <div key={i} className={`p-4 border rounded-xl flex items-start gap-3 shadow-sm ${getAnnouncementColor(ann.priority)}`}>
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">{ann.title}</h3>
                <p className="text-sm mt-1 opacity-90">{ann.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Active Listings', value: activeListingsCount, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Bookings', value: pendingBookingsCount, icon: CalendarClock, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
            <Link href="/partner/bookings" className="text-sm font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.slice(0, 5).map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{booking.user?.name || 'Customer'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{booking.user?.email || booking.customerEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {new Date(booking.date || booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{booking.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide
                        ${booking.status === 'CONFIRMED' || booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'PENDING' || booking.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }
                      `}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                        <CalendarClock className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">No bookings yet</h3>
                      <p className="text-sm text-gray-500 mt-1">When customers book your venues, they'll appear here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral Card */}
        <div className="bg-gradient-to-br from-rose-600 to-rose-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Refer & Earn</h3>
            </div>
            
            <p className="text-rose-100/90 text-sm leading-relaxed mb-6">
              Share your unique referral code or QR with other partners. Earn ₹50 in your wallet for every successful partner registration!
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-6 flex flex-col items-center justify-center">
              {showQr ? (
                <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                  <div className="bg-white p-2 rounded-xl mb-4">
                    <img src={qrUrl} alt="Referral QR Code" className="w-32 h-32 rounded-lg" />
                  </div>
                  <button onClick={downloadQR} className="text-sm font-semibold flex items-center gap-2 hover:text-rose-200 transition-colors">
                    <Download className="w-4 h-4" /> Download QR
                  </button>
                </div>
              ) : (
                <div className="text-center w-full py-2">
                  <p className="text-xs text-rose-200 uppercase tracking-widest font-semibold mb-1">Your Code</p>
                  <p className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-rose-200">
                    {partner?.referralCode || 'HLP-REF-XXXX'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-auto flex gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  toast.success('Referral link copied to clipboard!');
                }}
                className="flex-1 py-3 px-4 bg-white text-rose-600 hover:bg-rose-50 font-bold rounded-xl text-sm transition-colors text-center"
              >
                Copy Link
              </button>
              <button 
                onClick={() => setShowQr(!showQr)}
                className="flex-1 py-3 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" /> {showQr ? 'Hide QR' : 'Show QR'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
