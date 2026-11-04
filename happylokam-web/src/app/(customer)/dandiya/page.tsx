'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Ticket, Flame, Search, Music, Sparkles, 
  Star, ArrowRight, ShieldCheck, Clock, Users, Award, 
  ChevronRight, HelpCircle, Heart, Zap, CheckCircle2, 
  Compass, Radio, Volume2
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description?: string;
  imageUrl?: string;
  price: number;
  totalTickets: number;
  ticketsSold: number;
  ticketsLeft?: number;
  features?: string[];
  status?: string;
}

export default function DandiyaFestivalHub() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Countdown Timer to Grand Navratri Dandiya Night
  const [timeLeft, setTimeLeft] = useState({ days: 22, hours: 14, minutes: 35, seconds: 18 });

  useEffect(() => {
    const targetDate = new Date('2026-10-18T18:30:00Z').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real events from production API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res: any = await apiClient.get('/events');
        if (res?.data && Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const cities = ['All', 'Patna', 'Ahmedabad', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Kolkata'];

  // Categories list
  const availableCategories = useMemo(() => {
    const set = new Set<string>(['All']);
    events.forEach(e => {
      if (e.category) set.add(e.category);
    });
    return Array.from(set);
  }, [events]);

  // Featured Spotlight Event (prefer Dandiya category or highest ticket event)
  const featuredEvent = useMemo(() => {
    if (!events.length) return null;
    const dandiya = events.find(e => 
      e.category?.toLowerCase().includes('dandiya') || 
      e.title?.toLowerCase().includes('dandiya') ||
      e.title?.toLowerCase().includes('garba')
    );
    return dandiya || events[0];
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = 
        e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
      const matchesCity = selectedCity === 'All' || e.location?.toLowerCase().includes(selectedCity.toLowerCase());

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [events, searchTerm, activeCategory, selectedCity]);

  const faqs = [
    {
      q: 'Will traditional Dandiya sticks be provided at the venue?',
      a: 'Yes! Every valid pass holder receives a complimentary pair of handcrafted polished wooden Dandiya sticks at the welcome lounge.'
    },
    {
      q: 'Is there a strict dress code for the festival?',
      a: 'Traditional attire (Chaniya Choli, Kurta Pajama, Kediyu, or Ethnic Fusion) is strongly encouraged to preserve the authentic festive spirit.'
    },
    {
      q: 'Are tickets transferable or refundable?',
      a: 'Tickets generate a cryptographically signed QR code unique to your booking. You can transfer entry to a family member or friend via the happylokam app up to 4 hours before gates open.'
    },
    {
      q: 'Is valet parking and family security available?',
      a: 'Yes. All our partner venues feature dedicated Premium valet parking, CCTV surveillance, 24/7 private security bouncers, and separate family and couple entry lanes.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06070a] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
          <Sparkles className="w-8 h-8 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-amber-300/80 font-medium tracking-wider text-sm uppercase">Curating Royal Dandiya Experiences...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06070a] text-white selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Ambient Festival Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-rose-600/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[550px] h-[550px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-[500px] h-[500px] bg-purple-600/10 blur-[170px] rounded-full pointer-events-none -z-10" />

      {/* Top Banner Ticker */}
      <div className="w-full bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 py-2 px-4 text-xs font-semibold text-center text-white tracking-widest uppercase flex items-center justify-center gap-3 shadow-lg">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span>India&apos;s #1 Navratri & Dandiya Celebration Platform • Over 50,000+ Celebrators Strong</span>
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Grand Navratri & Garba Season 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Premium Passes Live</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.05]"
          >
            Feel The <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-500 to-amber-400">
              Rhythm & Royalty
            </span>
            <br /> Of Dandiya Nights
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            High-energy Gujarati dhol troupes, celebrity DJ fusion, luxury Premium lounges, and non-stop festive euphoria. Book official passes with zero booking convenience fee.
          </motion.p>

          {/* Live Countdown Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <div className="inline-flex items-center gap-3 sm:gap-6 bg-zinc-950/80 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
              <div className="text-center px-2 sm:px-4">
                <span className="text-3xl sm:text-5xl font-black text-amber-400 font-mono">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="block text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest mt-1">Days</span>
              </div>
              <span className="text-2xl sm:text-4xl text-amber-500/50 font-bold">:</span>
              <div className="text-center px-2 sm:px-4">
                <span className="text-3xl sm:text-5xl font-black text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="block text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest mt-1">Hours</span>
              </div>
              <span className="text-2xl sm:text-4xl text-amber-500/50 font-bold">:</span>
              <div className="text-center px-2 sm:px-4">
                <span className="text-3xl sm:text-5xl font-black text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="block text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest mt-1">Mins</span>
              </div>
              <span className="text-2xl sm:text-4xl text-amber-500/50 font-bold">:</span>
              <div className="text-center px-2 sm:px-4">
                <span className="text-3xl sm:text-5xl font-black text-rose-500 font-mono animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="block text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest mt-1">Secs</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Bar */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-amber-400">100%</p>
              <p className="text-xs text-zinc-400 mt-0.5">Verified Passes</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-rose-400">25K+</p>
              <p className="text-xs text-zinc-400 mt-0.5">Happy Attendees</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-amber-400">Free</p>
              <p className="text-xs text-zinc-400 mt-0.5">Dandiya Sticks</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">Instant</p>
              <p className="text-xs text-zinc-400 mt-0.5">QR Entry Ticket</p>
            </div>
          </div>
        </div>

        {/* SPOTLIGHT FEATURED EVENT HERO CARD */}
        {featuredEvent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 relative rounded-3xl overflow-hidden border border-amber-500/40 bg-zinc-950/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(245,158,11,0.2)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
              {/* Media Section */}
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-[16/10] group">
                <img
                  src={featuredEvent.imageUrl && featuredEvent.imageUrl.trim().length > 10 ? featuredEvent.imageUrl : 'https://images.unsplash.com/photo-1605808360022-d8f1618684cb?q=80&w=1200'}
                  alt={featuredEvent.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1605808360022-d8f1618684cb?q=80&w=1200';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" /> Featured Spotlight
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 font-semibold text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Official Navratri
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-300 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Music className="w-4 h-4 text-amber-400" /> Live Gujarati Band & DJ
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <ShieldCheck className="w-4 h-4" /> Bouncer & Family Secured
                  </span>
                </div>
              </div>

              {/* Details & Quick Action */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Premium Headliner Festival</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 leading-snug">
                    {featuredEvent.title}
                  </h2>
                  <p className="text-zinc-400 text-sm mt-3 line-clamp-3 leading-relaxed">
                    {featuredEvent.description || 'Experience high-octane Garba beats, traditional Raas, authentic gourmet food stalls, and an electrifying ambiance like never before.'}
                  </p>
                </div>

                <div className="space-y-2.5 text-sm text-zinc-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>
                      {new Date(featuredEvent.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="line-clamp-1">{featuredEvent.location}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <span>
                      <strong className="text-white">{featuredEvent.totalTickets - featuredEvent.ticketsSold}</strong> passes remaining out of {featuredEvent.totalTickets}
                    </span>
                  </div>
                </div>

                {/* Scarcity Bar */}
                {featuredEvent.totalTickets > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-400">Pass Demand</span>
                      <span className="text-rose-400 font-bold">
                        {Math.round((featuredEvent.ticketsSold / featuredEvent.totalTickets) * 100)}% Booked
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 rounded-full"
                        style={{ width: `${Math.min((featuredEvent.ticketsSold / featuredEvent.totalTickets) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Price and CTA */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 block font-medium">Starting from</span>
                    <span className="text-3xl font-black text-amber-400">₹{featuredEvent.price}</span>
                    <span className="text-xs text-zinc-500 ml-1">/ person</span>
                  </div>

                  <Link href={`/dandiya/${featuredEvent.id}`}>
                    <button className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                      <span>Reserve Premium Pass</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* FILTER & EXPLORE HUB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-rose-500" />
              Explore All Dandiya & Festival Passes
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Select your city and category to discover upcoming high-octane musical celebrations.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by venue or artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>
        </div>

        {/* City Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-2 shrink-0 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> City:
          </span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCity === city
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-zinc-900/80 text-zinc-400 border border-white/5 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-2 shrink-0 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Category:
          </span>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]'
                  : 'bg-zinc-900/80 text-zinc-400 border border-white/10 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* EVENTS GRID */}
        {filteredEvents.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-zinc-950/50 border border-white/5 space-y-4">
            <Music className="w-16 h-16 text-zinc-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">No Celebration Events Found</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              We couldn&apos;t find any event matching your selected criteria. Try adjusting your filters or search keywords.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCity('All'); setActiveCategory('All'); }}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => {
              const ticketsLeft = event.totalTickets - event.ticketsSold;
              const isSellingFast = ticketsLeft > 0 && ticketsLeft <= 50;
              const isSoldOut = ticketsLeft <= 0 && event.totalTickets > 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-3xl bg-zinc-950/80 border border-white/10 overflow-hidden hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.18)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Event Banner */}
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <img
                        src={event.imageUrl && event.imageUrl.trim().length > 10 ? event.imageUrl : 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800'}
                        alt={event.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 font-bold text-[11px] uppercase tracking-wider">
                          {event.category || 'Dandiya Night'}
                        </span>
                        {isSellingFast && (
                          <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-[11px] animate-pulse flex items-center gap-1 shadow-lg">
                            <Flame className="w-3 h-3" /> Only {ticketsLeft} Left!
                          </span>
                        )}
                        {isSoldOut && (
                          <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 font-bold text-[11px]">
                            Sold Out
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                          {event.description || 'Join thousands of dancers for an unforgettable Dandiya & Garba celebration with live orchestration and celebrity DJs.'}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>
                            {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(event.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Features Badges */}
                      {event.features && event.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {event.features.slice(0, 3).map((feat, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-[11px] text-zinc-300 flex items-center gap-1"
                            >
                              <Star className="w-3 h-3 text-amber-400" />
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-medium">Official Entry</span>
                      <span className="text-2xl font-black text-amber-400">₹{event.price || 0}</span>
                    </div>

                    <Link href={`/dandiya/${event.id}`}>
                      <button
                        disabled={isSoldOut}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                          isSoldOut
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-rose-600 text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95'
                        }`}
                      >
                        <span>{isSoldOut ? 'Sold Out' : 'Book Premium Pass'}</span>
                        {!isSoldOut && <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* WHY HAPPY LOKAM DANDIYA EXPERIENCE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">World-Class Celebration Standards</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">The Billion Dollar Experience</h2>
          <p className="text-zinc-400 text-sm">
            We partner exclusively with verified organizers and luxury venues to deliver safety, grandeur, and authentic joy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 rounded-3xl bg-zinc-950/60 border border-white/10 hover:border-amber-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Live Gujarati Dhol Troupe</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Authentic folk musicians and live dhol players paired with India&apos;s leading celebrity Bollywood DJs.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-950/60 border border-white/10 hover:border-rose-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Free Designer Dandiya Sticks</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every pass includes a pair of polished, handcrafted decorative wooden dandiya sticks handed over at check-in.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-950/60 border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">24/7 Security & Family Safety</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Separate family lanes, vetted security bouncers, zero tolerance for harassment, and medical first-aid on standby.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-950/60 border border-white/10 hover:border-purple-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">VIP Festive Experience</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dedicated celebration areas, fast-track entry, complimentary props, and world-class live festive entertainment.
            </p>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Attendee Help & Guidelines</span>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-zinc-950/70 border border-white/10 overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-amber-300"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-5 h-5 text-zinc-400 transition-transform ${
                    activeFaq === idx ? 'rotate-90 text-amber-400' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM TRUST BADGE FOOTER */}
      <section className="border-t border-white/10 bg-black/60 py-10 px-4 text-center">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-400">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Genuine QR Passes
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Razorpay 256-Bit Encrypted
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" /> Instant Pass Delivery to App & WhatsApp
          </span>
          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400" /> Dedicated 24/7 Celebration Concierge
          </span>
        </div>
      </section>
    </div>
  );
}
