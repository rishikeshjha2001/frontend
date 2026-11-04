'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Star, Filter, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api-client';

const CATEGORIES = [
  'All', 'Navratri Dandiya', 'Dandiya', 'Wedding', 'Birthday', 'Anniversary', 'Corporate', 
  'Venues', 'Photography', 'Catering', 'Pandit', 'Makeup', 'Decorators', 'DJ & Sound', 'Event Planner'
];

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(100000);
  const [ratingFilter, setRatingFilter] = useState(0);
  
  const [listings, setListings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Relevance');

  useEffect(() => {
    document.title = "Explore | happylokam";
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [listingsRes, eventsRes]: [any, any] = await Promise.all([
          apiClient.get('/listings').catch(() => ({ data: [] })),
          apiClient.get('/events').catch(() => ({ data: [] }))
        ]);
        setListings(listingsRes.data || []);
        setEvents(eventsRes.data || []);
      } catch (err) {
        setListings([]);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredListings = listings
    .filter(l => 
      (query === '' || l.title?.toLowerCase().includes(query.toLowerCase()) || l.category?.toLowerCase().includes(query.toLowerCase())) &&
      (location === '' || l.city?.toLowerCase().includes(location.toLowerCase())) &&
      (category === 'All' || l.category?.toLowerCase() === category.toLowerCase()) &&
      (l.price <= priceRange) &&
      (l.rating >= ratingFilter)
    )
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      if (sortBy === 'Rating: High to Low') return b.rating - a.rating;
      return 0; // Relevance
    });

  const filteredEvents = events.filter(e => {
    const matchesQuery = query === '' || 
      e.title?.toLowerCase().includes(query.toLowerCase()) || 
      e.category?.toLowerCase().includes(query.toLowerCase()) ||
      e.location?.toLowerCase().includes(query.toLowerCase()) ||
      e.description?.toLowerCase().includes(query.toLowerCase());

    const matchesLoc = location === '' || e.location?.toLowerCase().includes(location.toLowerCase());

    const matchesCat = category === 'All' || 
      e.category?.toLowerCase() === category.toLowerCase() ||
      (category === 'Navratri Dandiya' && (e.category?.toLowerCase().includes('dandiya') || e.title?.toLowerCase().includes('dandiya'))) ||
      (category === 'Dandiya' && (e.category?.toLowerCase().includes('dandiya') || e.title?.toLowerCase().includes('dandiya')));

    return matchesQuery && matchesLoc && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full flex items-center bg-slate-100 rounded-full px-4 py-2 border border-transparent focus-within:border-rose-300 focus-within:bg-white transition-all shadow-inner">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search for Dandiya, Venues, Pandits, Decorators..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-800 text-sm font-medium placeholder:text-slate-500"
            />
          </div>
          <div className="flex-1 w-full flex items-center bg-slate-100 rounded-full px-4 py-2 border border-transparent focus-within:border-rose-300 focus-within:bg-white transition-all shadow-inner">
            <MapPin className="w-5 h-5 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="City or Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-800 text-sm font-medium placeholder:text-slate-500"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all ${isFilterOpen ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar - Advanced Filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -50, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 320 }}
              exit={{ opacity: 0, x: -50, width: 0 }}
              className="hidden lg:block shrink-0 h-[calc(100vh-200px)] sticky top-[180px] overflow-y-auto custom-scrollbar pr-4"
            >
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-rose-900/5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Filters</h3>
                  <button onClick={() => { setCategory('All'); setPriceRange(500000); setRatingFilter(0); }} className="text-sm font-bold text-rose-600 hover:text-rose-700">Clear All</button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4 text-rose-500"/> Category</h4>
                  <div className="flex flex-col gap-2">
                    {CATEGORIES.map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${category === cat ? 'bg-rose-600 border-rose-600' : 'border-slate-300 group-hover:border-rose-400'}`}>
                          {category === cat && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input type="radio" name="category" className="hidden" checked={category === cat} onChange={() => setCategory(cat)} />
                        <span className={`text-sm font-medium ${category === cat ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h4 className="font-bold text-slate-900 mb-4">Max Price (₹)</h4>
                  <input 
                    type="range" 
                    min="500" 
                    max="500000" 
                    step="500"
                    value={priceRange} 
                    onChange={e => setPriceRange(Number(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                  <div className="flex justify-between text-xs font-bold text-slate-500 mt-2">
                    <span>₹500</span>
                    <span className="text-rose-600 text-sm">Up to ₹{priceRange.toLocaleString()}</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Minimum Rating</h4>
                  <div className="flex flex-col gap-3">
                    {[4.5, 4.0, 3.5].map(rating => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${ratingFilter === rating ? 'bg-amber-500 border-amber-500' : 'border-slate-300 group-hover:border-amber-400'}`}>
                          {ratingFilter === rating && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input type="radio" name="rating" className="hidden" checked={ratingFilter === rating} onChange={() => setRatingFilter(rating)} />
                        <div className="flex items-center gap-1">
                          {Array.from({length: Math.floor(rating)}).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                          ))}
                          <span className="text-sm font-medium text-slate-700 ml-2">& Up</span>
                        </div>
                      </label>
                    ))}
                    <label className="flex items-center gap-3 cursor-pointer group mt-2">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${ratingFilter === 0 ? 'bg-slate-800 border-slate-800' : 'border-slate-300 group-hover:border-slate-400'}`}>
                        {ratingFilter === 0 && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <input type="radio" name="rating" className="hidden" checked={ratingFilter === 0} onChange={() => setRatingFilter(0)} />
                      <span className="text-sm font-medium text-slate-600">Any Rating</span>
                    </label>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side - Results Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              {filteredListings.length + filteredEvents.length} Results Found
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-500">Sort by:</span>
              <select 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 text-slate-900 text-sm font-bold rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
              >
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              {/* Events Section */}
              {filteredEvents.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-rose-500" /> Upcoming Events & Shows
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredEvents.map(evt => (
                      <Link key={evt.id} href={`/dandiya/${evt.id}`}>
                        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer">
                          <div className="h-48 overflow-hidden relative">
                            <img src={evt.imageUrl || "https://images.unsplash.com/photo-1598284693998-5c4e97eb65e8?q=80&w=600"} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold">{evt.category}</div>
                            {evt.totalTickets - evt.ticketsSold <= 50 && evt.totalTickets - evt.ticketsSold > 0 && (
                              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                Only {evt.totalTickets - evt.ticketsSold} left!
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">{evt.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                              <MapPin className="w-3.5 h-3.5" /> {evt.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                              <Calendar className="w-3.5 h-3.5" /> {new Date(evt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-100">Single</span>
                              <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-100">Couple</span>
                              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">+4 Tiers</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Starts From</span>
                                <span className="font-black text-xl text-slate-900">₹{evt.ticketTiers?.single || evt.price}</span>
                              </div>
                              <span className="bg-rose-600 group-hover:bg-rose-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md shadow-rose-600/20 transition-all">Book Now</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Listings Section */}
              {filteredListings.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isFilterOpen ? 'xl:grid-cols-3' : 'xl:grid-cols-4'} gap-6 transition-all`}>
              {filteredListings.map(listing => (
                <Link 
                  key={listing.id} 
                  href={`/listings/${listing.slug || listing.id}`}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(225,29,72,0.12)] transition-all duration-300 border border-gray-100 hover:border-rose-200 group flex flex-col cursor-pointer"
                >
                  <div className="h-56 overflow-hidden relative">
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black tracking-wide text-slate-900 shadow-lg">
                      {listing.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-1 text-xs font-black text-rose-600 mb-3 uppercase tracking-widest">
                      <MapPin className="w-3 h-3" /> {listing.city}
                    </div>
                    <h3 className="font-extrabold text-xl text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors">{listing.title}</h3>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 mb-1">Starting from</p>
                        <span className="font-black text-xl text-slate-900">₹{listing.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="font-bold text-xs text-amber-700">{listing.rating}</span>
                        </div>
                        <span className="bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm">
                          View
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-dashed border-gray-300 p-16 flex flex-col items-center justify-center text-center mt-10">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-rose-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                We couldn't find any listings matching your specific filters. Try adjusting the category, location, or price range.
              </p>
              <button 
                onClick={() => { setQuery(''); setLocation(''); setCategory('All'); setPriceRange(500000); setRatingFilter(0); }}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
              >
                Clear all filters
              </button>
            </div>
          ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
