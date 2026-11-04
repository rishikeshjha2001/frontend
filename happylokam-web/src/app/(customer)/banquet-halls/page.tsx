'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  MapPin,
  Star,
  CheckCircle2,
  Sparkles,
  Phone,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Calendar,
  Utensils,
  Loader2,
  IndianRupee
} from 'lucide-react';

export default function BanquetHallsPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('All');
  const [search, setSearch] = useState('');

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
      } catch (e) {
        console.error('Error fetching banquet venues:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((v) => {
    const matchesCity = cityFilter === 'All' || v.city?.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesSearch =
      !search ||
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.location?.toLowerCase().includes(search.toLowerCase()) ||
      v.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <main className="flex-1 bg-slate-50/50">
        {/* Hero Section */}
        <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-50/60 to-transparent">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Banquet Halls & Event Spaces</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Find & Book Premium Banquet Halls in India
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
              Explore handpicked luxury AC banquet halls, marriage lawns, and party spaces with verified guest capacities, transparent pricing, and zero hidden charges.
            </p>

            {/* Search & Filter Bar */}
            <div className="max-w-3xl mx-auto mt-6 p-2 rounded-2xl bg-white border border-gray-200 shadow-lg shadow-rose-600/5 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by venue name, locality, or landmark..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-0 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="All">All Cities (Pan India)</option>
                <option value="Patna">Patna</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>
          </div>
        </section>

        {/* Venues Grid */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Available Banquet Halls ({filteredVenues.length})
              </h2>
              <p className="text-sm text-gray-500">Live listings verified with direct host connect</p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-rose-600 mb-2" />
              <p className="text-sm text-gray-500">Loading verified banquet halls...</p>
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center max-w-md mx-auto my-12 shadow-sm">
              <Building2 className="w-12 h-12 text-rose-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No Banquet Halls Found</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Try selecting &ldquo;All Cities&rdquo; or explore other wedding services in our celebration directory.
              </p>
              <button
                onClick={() => { setCityFilter('All'); setSearch(''); }}
                className="px-5 py-2.5 bg-rose-600 text-white font-semibold rounded-xl text-sm hover:bg-rose-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-rose-600/5 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={venue.images?.[0] || venue.image || '/og-image.jpg'}
                      alt={venue.title || venue.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-rose-700 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Venue
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
                        <span className="truncate">{venue.location || venue.city || 'India'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-3 border-y border-gray-100 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Users className="w-4 h-4 text-rose-600" />
                        <span>Capacity: <strong>{venue.capacity ? `${venue.capacity}` : '500+'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                        <span>Price: <strong>₹{(venue.price || venue.pricing || 25000).toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Link
                        href={`/listings/${venue.id}`}
                        className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold text-center transition-colors shadow-md shadow-rose-600/20"
                      >
                        View Details & Book
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
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mt-1">Everything you need to know about booking banquet halls on happylokam</p>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">What is included in a banquet hall booking on happylokam?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bookings generally include the air-conditioned hall space, seating arrangements, basic ambient lighting, bridal dressing rooms, power backup, and catering options depending on the package selected.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">How far in advance should I reserve a banquet hall for a wedding or reception?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                For peak wedding seasons, it is recommended to book 2 to 4 months in advance to secure prime dates and lock in transparent pricing.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">Can I schedule a physical venue visit before paying?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Yes! happylokam verified partners and field concierges can coordinate a guided tour of the banquet hall to inspect dining halls, parking, and stage setups.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
