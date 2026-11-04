'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Users,
  MapPin,
  Star,
  ShieldCheck,
  Sparkles,
  Phone,
  Camera,
  Utensils,
  Music,
  CheckCircle2,
  CalendarDays,
  Loader2,
  IndianRupee,
  Building2
} from 'lucide-react';

export default function WeddingVenuesPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch('/api/v1/listings?category=VENUE');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setVenues(data.data || data.listings || []);
          }
        }
      } catch (err) {
        console.error('Error fetching wedding venues:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <main className="flex-1 bg-slate-50/50">
        {/* Hero */}
        <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-50/70 to-transparent text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span>India&apos;s Most Trusted Wedding Platform</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Royal Wedding Venues & Marriage Lawns
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Book grand marriage gardens, luxury palaces, mandap decorators, and full catering packages with our dedicated happylokam Support team.
            </p>
          </div>
        </section>

        {/* Highlights */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5 fill-rose-600" />
              </div>
              <h3 className="text-xs font-bold text-gray-900">Marriage Lawns</h3>
              <p className="text-[11px] text-gray-500">1,000+ guest capacities</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-gray-900">Royal Catering</h3>
              <p className="text-[11px] text-gray-500">Multi-cuisine live counters</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-gray-900">Theme & Mandap Decor</h3>
              <p className="text-[11px] text-gray-500">Floral & fairy light concepts</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-gray-900">DJ & Baraat Band</h3>
              <p className="text-[11px] text-gray-500">Live sound & sound setups</p>
            </div>
          </div>

          {/* Venues Showcase */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Featured Wedding Venues ({venues.length})
                </h2>
                <p className="text-sm text-gray-500">Handpicked for royal celebrations with verified quality guarantee</p>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-600 mb-2" />
                <p className="text-sm text-gray-500">Loading wedding venues...</p>
              </div>
            ) : venues.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center max-w-md mx-auto my-12 shadow-sm">
                <Building2 className="w-12 h-12 text-rose-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">No Wedding Venues Listed Yet</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">
                  Check out other celebration packages or explore our full catalog.
                </p>
                <Link
                  href="/explore"
                  className="px-5 py-2.5 bg-rose-600 text-white font-semibold rounded-xl text-sm hover:bg-rose-700 transition-colors inline-block"
                >
                  Explore All Services
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map((venue) => (
                  <div
                    key={venue.id}
                    className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-rose-600/5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="relative h-52 bg-gray-100 overflow-hidden">
                      <img
                        src={venue.images?.[0] || venue.image || '/og-image.jpg'}
                        alt={venue.title || venue.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-rose-700 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Verified Host
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-gray-900 flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{venue.rating || '4.9'}</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                          {venue.title || venue.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">{venue.location || venue.city || 'Patna, Bihar'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 py-3 border-y border-gray-100 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Users className="w-4 h-4 text-rose-600" />
                          <span>Capacity: <strong>{venue.capacity ? `${venue.capacity}` : '1,000+'}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <IndianRupee className="w-4 h-4 text-emerald-600" />
                          <span>From: <strong>₹{(venue.price || venue.pricing || 35000).toLocaleString('en-IN')}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Link
                          href={`/listings/${venue.id}`}
                          className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold text-center transition-colors shadow-md shadow-rose-600/20"
                        >
                          View Details & Reserve
                        </Link>
                        {venue.partner?.phone && (
                          <a
                            href={`tel:${venue.partner.phone}`}
                            className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Call Host"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
