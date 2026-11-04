'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Plus, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { authFetch } from '@/lib/auth-fetch';

export default function PartnerListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const authRes = await authFetch('/api/v1/auth/me');
        if (!authRes.ok) throw new Error('Failed to fetch user');
        const authData = await authRes.json();
        const pId = authData.user?.id || authData.partner?.id;

        const res = await authFetch(`/api/v1/listings?partnerId=${pId}`);
        if (!res.ok) throw new Error('Failed to fetch listings');
        const data = await res.json();
        setListings(data.data || []);
      } catch (err) {
        toast.error('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">My Listings</h1>
            <p className="text-zinc-500 mt-1">Manage your service offerings</p>
          </div>
          <Link 
            href="/partner/listings/new"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)]"
          >
            <Plus className="w-5 h-5" />
            Add New Listing
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="bg-zinc-900/40 p-12 text-center rounded-3xl border border-white/10 shadow-sm backdrop-blur-xl">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Plus className="w-10 h-10 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white">No listings yet</h3>
            <p className="text-zinc-400 mt-2 mb-8">Start by creating your first service listing</p>
            <Link 
              href="/partner/listings/new"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)]"
            >
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-zinc-900/40 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden hover:border-rose-500/30 hover:shadow-[0_0_30px_rgba(225,29,72,0.1)] transition-all backdrop-blur-xl group">
                <div className="aspect-video bg-black/60 relative overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      No image
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full uppercase shadow-lg backdrop-blur-md
                      ${listing.status === 'Active' || listing.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 text-zinc-400 border border-white/20'}`}
                    >
                      {listing.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-white mb-2">{listing.name}</h3>
                  <div className="flex items-center text-zinc-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1.5 text-rose-500" />
                    {listing.city}
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                    <span className="text-2xl font-bold text-rose-500">₹{listing.price}</span>
                    <Link href={`/partner/listings/${listing.id}`} className="text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 px-4 py-2 rounded-xl transition-colors">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
