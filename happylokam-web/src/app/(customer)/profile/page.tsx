'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogOut, Save, User, Loader2, Calendar } from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ name: string; phone: string; profileImageUrl: string; gender?: string }>({ name: '', phone: '', profileImageUrl: '', gender: '' });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, bookingsRes] = await Promise.all([
        authFetch('/api/v1/users/profile'),
        authFetch('/api/v1/users/bookings')
      ]);

      if (!profileRes.ok) throw new Error('Failed to fetch profile');
      const profileData = await profileRes.json();
      setProfile(profileData.data || profileData);

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        const bList = bookingsData.data?.eventBookings || bookingsData.data?.vendorBookings || bookingsData.data || bookingsData || [];
        setBookings(Array.isArray(bList) ? bList : []);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/v1/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profile)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      await fetch('/api/v1/auth/logout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include'
      }).catch(() => {});
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.clear();
      }
      toast.success('Logged out successfully');
      window.location.href = '/login';
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <button onClick={handleLogout} className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-medium px-4 py-2 bg-rose-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center"><User className="w-5 h-5 mr-2 text-rose-600" /> Profile Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} className="mt-1 block w-full rounded-lg border-gray-300 py-2 px-3 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} className="mt-1 block w-full rounded-lg border-gray-300 py-2 px-3 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select value={profile.gender || ''} onChange={e => setProfile({...profile, gender: e.target.value})} className="mt-1 block w-full rounded-lg border-gray-300 py-2 px-3 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm ring-1 ring-inset ring-gray-300">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                <input type="text" value={profile.profileImageUrl || ''} onChange={e => setProfile({...profile, profileImageUrl: e.target.value})} className="mt-1 block w-full rounded-lg border-gray-300 py-2 px-3 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm ring-1 ring-inset ring-gray-300" />
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 mt-4">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-xl font-semibold mb-6 flex items-center"><Calendar className="w-5 h-5 mr-2 text-rose-600" /> My Tickets & Bookings</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-16 px-4 flex flex-col items-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No Bookings Yet</h3>
                <p className="text-slate-500 max-w-sm mb-6">Looks like you haven't booked any celebration packages or tickets yet. Start planning today!</p>
                <button onClick={() => router.push('/search')} className="bg-rose-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all">
                  Explore Celebrations
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: any, idx) => (
                  <div key={idx} className="relative flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                    {/* Ticket Color Strip */}
                    <div className="h-2 sm:h-auto sm:w-2 bg-gradient-to-b from-rose-500 to-rose-700" />
                    
                    {/* Ticket Content */}
                    <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full bg-slate-100 text-slate-600">
                            {booking.status || 'Confirmed'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">TKT-{booking.id?.substring(0, 8) || 'PREMIUM'}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">
                          {booking.serviceName || booking.event?.title || 'Premium Celebration Package'}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" /> 
                          {new Date(booking.date || booking.createdAt).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>

                      {/* Ticket Stub Divider */}
                      <div className="hidden sm:block h-16 w-px bg-slate-200 border-l border-dashed border-slate-300 mx-2 relative">
                        <div className="absolute -top-6 -left-3 w-6 h-6 bg-white border border-slate-200 border-b-0 rounded-b-full"></div>
                        <div className="absolute -bottom-6 -left-3 w-6 h-6 bg-white border border-slate-200 border-t-0 rounded-t-full"></div>
                      </div>

                      <div className="w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-dashed border-slate-200 flex sm:flex-col items-center justify-between sm:justify-center">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Total Paid</p>
                          <p className="text-xl font-black text-rose-600">₹{booking.totalAmount || 0}</p>
                        </div>
                        <button className="text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors mt-0 sm:mt-3">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
