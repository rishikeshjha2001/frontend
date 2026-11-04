'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Sparkles, Filter } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api-client';

export default function DynamicExplorePage({ params }: { params: { city: string; category: string } }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Parse URL params nicely
  const city = params.city.charAt(0).toUpperCase() + params.city.slice(1).replace('-', ' ');
  const category = params.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  useEffect(() => {
    apiClient.get<any>('/listings')
      .then(data => {
        if (data?.success && data?.data) {
          // Client-side fallback filtering & enforce APPROVED only
          const filtered = data.data.filter((l: any) => 
            l.city?.toLowerCase() === params.city.toLowerCase() &&
            l.category?.toLowerCase() === params.category.toLowerCase().replace('-', ' ') &&
            l.status !== 'PENDING' // Enforce partner approval!
          );
          setListings(filtered.length > 0 ? filtered : (data.data.filter((l:any) => l.status !== 'PENDING')));
        } else {
          setListings([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setListings([]);
        setLoading(false);
      });
  }, [params]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Dynamic SEO Hero */}
      <div className="bg-slate-900 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-500 via-slate-900 to-slate-900"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Top Rated in {city}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">{category}</span><br />
              in {city}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Compare prices, read verified reviews, and instantly book the finest {category.toLowerCase()} in {city} exclusively on happylokam.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {loading ? "Searching..." : `${listings.length} Results Found`}
          </h2>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white h-[400px] rounded-2xl"></div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {listings.map((listing: any) => (
              <Link href={`/listings/${listing.slug || listing.id || Math.random().toString(36).substring(7)}`} key={listing.id || Math.random()}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer"
                >
                  <div className="h-60 relative overflow-hidden bg-slate-200">
                    <img 
                      src={listing.images?.[0] || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800'} 
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                      {listing.category || category}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{listing.title}</h3>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md shrink-0">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-amber-700">{listing.rating || '4.5'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-slate-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {listing.location || `${city}, India`}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Starting at</p>
                        <p className="text-lg font-black text-rose-600">₹{listing.price || 'Contact for price'}</p>
                      </div>
                      <div className="text-rose-600 font-bold text-sm bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg transition-colors">
                        View Details
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No {category} found in {city}</h3>
            <p className="text-slate-500 mb-6">We are currently expanding our premium partners in this location.</p>
            <Link href="/search">
              <button className="bg-rose-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl">
                Explore All Locations
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
