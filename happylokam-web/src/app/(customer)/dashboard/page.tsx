"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Heart, Star, Clock, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function CustomerProfile() {
  const [activeTab, setActiveTab] = useState('bookings');
  const { user, logout } = useAuth();
  const router = useRouter();
  const [eventBookings, setEventBookings] = useState<any[]>([]);
  const [serviceBookings, setServiceBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  React.useEffect(() => {
    if (user && activeTab === 'bookings') {
      const fetchBookings = async () => {
        try {
          const [eventRes, serviceRes]: any = await Promise.all([
            apiClient.get('/events/my/bookings'),
            apiClient.get('/bookings/my')
          ]);
          
          if (eventRes?.success && eventRes?.data) {
            setEventBookings(eventRes.data);
          }
          if (serviceRes?.success && serviceRes?.data) {
            setServiceBookings(serviceRes.data);
          }
        } catch (e: any) {
          console.error("Bookings API Error:", e);
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchBookings();
    }
  }, [user, activeTab]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-rose-100 flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="w-32 h-32 bg-rose-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden shrink-0">
            {(user as any)?.profileImage ? (
              <img src={(user as any).profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-rose-500" />
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black font-playfair text-slate-900 mb-2">{user.name || 'User Profile'}</h1>
            <p className="text-slate-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4" /> {(user as any).phone ? (user as any).phone : 'India'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <button className="px-5 py-2 bg-rose-50 text-rose-600 rounded-full font-bold text-sm hover:bg-rose-100 transition-colors">Edit Profile</button>
              <button className="px-5 py-2 bg-slate-100 text-slate-600 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 sticky top-28 space-y-2">
              <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'}`}>
                <Calendar className="w-5 h-5" /> My Bookings
              </button>
              <button onClick={() => setActiveTab('wishlist')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all ${activeTab === 'wishlist' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'}`}>
                <Heart className="w-5 h-5" /> Saved Venues
              </button>
              <button onClick={() => setActiveTab('reviews')} className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all ${activeTab === 'reviews' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'}`}>
                <Star className="w-5 h-5" /> My Reviews
              </button>
              <div className="h-px bg-gray-100 my-4" />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'bookings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[400px]">
                <h2 className="text-2xl font-black font-playfair text-slate-900 mb-6">Upcoming Bookings</h2>
                
                {loadingBookings ? (
                  <div className="flex justify-center py-10"><div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" /></div>
                ) : eventBookings.length > 0 || serviceBookings.length > 0 ? (
                  <div className="space-y-4">
                    {eventBookings.map((b) => (
                      <div key={b.id} className="border border-gray-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                        <div>
                          <p className="text-xs text-rose-600 font-bold mb-1 uppercase tracking-wider">EVENT BOOKING</p>
                          <h3 className="text-xl font-bold text-slate-900">{b.event?.title || 'Unknown Event'}</h3>
                          <p className="text-slate-500 font-medium">Tickets: {b.ticketsCount} | Total Paid: ₹{b.totalAmount}</p>
                        </div>
                        <Link href={`/dandiya/${b.eventId}/success`} className="px-6 py-2 bg-white border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition shadow-sm">
                          View Ticket
                        </Link>
                      </div>
                    ))}
                    {serviceBookings.map((b) => (
                      <div key={b.id} className="border border-gray-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                        <div>
                          <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">SERVICE BOOKING</p>
                          <h3 className="text-xl font-bold text-slate-900">{b.venue?.name || 'Unknown Venue'}</h3>
                          <p className="text-slate-500 font-medium">Partner: {b.partner?.name} | Total Paid: ₹{b.totalAmount}</p>
                          <p className="text-slate-500 font-medium text-sm">Date: {new Date(b.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-xl font-bold text-sm ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                      <Calendar className="w-8 h-8 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Active Bookings</h3>
                    <p className="text-slate-500 font-medium max-w-sm mb-8">You haven't booked any celebration services yet. Start exploring premium events in your city.</p>
                    <Link href="/search" className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition-all">
                      Explore Services
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[400px]">
                <h2 className="text-2xl font-black font-playfair text-slate-900 mb-6">Saved Venues & Partners</h2>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Your Wishlist is Empty</h3>
                  <p className="text-slate-500 font-medium max-w-sm">Tap the heart icon on any venue or service to save it here for later.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[400px]">
                <h2 className="text-2xl font-black font-playfair text-slate-900 mb-6">My Reviews</h2>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <Star className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No Reviews Yet</h3>
                  <p className="text-slate-500 font-medium max-w-sm">After you complete a booking, you can share your experience here.</p>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
