"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, ShieldCheck, Gift, Star, MapPin, HeartHandshake, Camera, Search, Heart, Clock, Users, ArrowRight, Calendar, Music, Utensils, Shield, Compass, Ticket } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

const slides = [
  {
    image: "/slide1.jpg",
    badge: "Enjoy every moment of life.",
    title1: "We'll create",
    title2: "your memory.",
    desc: "India's rose-led celebration platform designed to make every moment unforgettable without the planning pressure.",
    ctaText: "Search Packages",
    ctaLink: "/search",
    gradient: "from-rose-500 to-rose-700"
  },
  {
    image: "/slide2.jpg",
    badge: "Celebrate Birthdays!",
    title1: "Unforgettable",
    title2: "Birthdays.",
    desc: "From golden balloons to perfectly themed parties. Book everything you need for the perfect birthday celebration.",
    ctaText: "Plan a Birthday",
    ctaLink: "/search?q=birthday",
    gradient: "from-amber-400 to-orange-500"
  },
  {
    image: "/slide3.jpg",
    badge: "Traditional & Sacred",
    title1: "Sacred",
    title2: "Weddings.",
    desc: "Discover beautiful mandaps, verified pandits, and premium catering for your most sacred and memorable moments.",
    ctaText: "Book Pandit & Decor",
    ctaLink: "/search?q=pandit",
    gradient: "from-emerald-500 to-teal-700"
  },
  {
    image: "/slide4.jpg",
    badge: "Dandiya Nights Special",
    title1: "Dandiya",
    title2: "Nights.",
    desc: "Book royal venues, massive party halls, and energetic DJs for the ultimate Dandiya Night celebration with friends.",
    ctaText: "Book Now",
    ctaLink: "/dandiya",
    gradient: "from-indigo-500 to-purple-700"
  }
];

export default function LandingPage() {
  const [activeSlides, setActiveSlides] = useState<any[]>(slides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<any[]>([]);
  const [loksafaris, setLoksafaris] = useState<any[]>([]);
  const [customSections, setCustomSections] = useState<any[]>([]);

  useEffect(() => {
    // Fetch live hero slides configured by admin
    apiClient.get<any>('/hero-slides').then(res => {
      const fetchedSlides = res?.data || res?.slides || [];
      if (Array.isArray(fetchedSlides) && fetchedSlides.length > 0) {
        setActiveSlides(fetchedSlides);
      }
    }).catch(() => {});

    // Fetch custom sections from admin CMS
    apiClient.get<any>('/sections').then(res => {
      if (res?.success && Array.isArray(res.data)) {
        setCustomSections(res.data);
      }
    }).catch(() => {});

    // Fetch data safely
    Promise.all([
      apiClient.get<any>('/events').catch(() => ({ success: false, data: [] })),
      apiClient.get<any>('/loksafari').catch(() => ({ success: false, data: [] }))
    ]).then(([eventsRes, loksafarisRes]) => {
      const eData = eventsRes?.data || eventsRes?.events || [];
      
      const processedEvents = Array.isArray(eData) ? eData : [];
      const isBeforeOct18 = new Date() < new Date('2026-10-19'); // Active till Oct 18
      
      if (isBeforeOct18) {
        // Show up to 20 Dandiya events as requested by Admin
        const dandiyas = processedEvents.filter(e => e.title?.toLowerCase().includes('dandiya') || e.category?.toLowerCase().includes('dandiya')).slice(0, 20);
        setEvents(dandiyas.length > 0 ? dandiyas : processedEvents.slice(0, 4));
      } else {
        // Hide Dandiya after Oct 18, show regular events
        const otherEvents = processedEvents.filter(e => !e.title?.toLowerCase().includes('dandiya') && !e.category?.toLowerCase().includes('dandiya')).slice(0, 4);
        setEvents(otherEvents);
      }
      
      const lData = loksafarisRes?.data || loksafarisRes?.packages || loksafarisRes?.loksafaris || [];
      setLoksafaris(Array.isArray(lData) ? lData.slice(0, 4) : []);
    }).catch(err => {
      console.error("Failed to fetch homepage data", err);
      setLoksafaris([]);
    });
  }, []);

  useEffect(() => {
    if (!activeSlides.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const currentSlideData = activeSlides[currentSlide] || activeSlides[0] || slides[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-500/30 font-sans overflow-hidden">
      
      {/* 1. ADVANCED HERO SLIDER SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden bg-slate-900">
        
        {/* Animated Background Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={currentSlideData.image} 
              alt={currentSlideData.title1} 
              fetchPriority={currentSlide === 0 ? "high" : "auto"}
              loading={currentSlide === 0 ? "eager" : "lazy"}
              decoding={currentSlide === 0 ? "sync" : "async"}
              className="w-full h-full object-cover opacity-60"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200';
              }}
            />
            {/* Accurate Cinematic Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.1)_0%,_rgba(0,0,0,0.55)_65%,_rgba(15,23,42,0.95)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-900 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Floating Abstract Category Pills */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden lg:block">
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[30%] left-[10%] px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <span className="text-white font-semibold">📸 Premium Photography</span>
          </motion.div>
          <motion.div animate={{ y: [0, 25, 0], rotate: [0, -3, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[50%] right-[12%] px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <span className="text-white font-semibold">🏰 Royal Venues</span>
          </motion.div>
          <motion.div animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[25%] left-[15%] px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <span className="text-white font-semibold">🌺 Floral Decor</span>
          </motion.div>
          <motion.div animate={{ y: [0, 20, 0], rotate: [0, 4, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute top-[20%] right-[20%] px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <span className="text-white font-semibold">🎵 DJ & Sound</span>
          </motion.div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center mt-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 flex justify-center">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold tracking-wide shadow-lg backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer">
                  <Sparkles className="w-4 h-4 text-rose-300" />
                  {currentSlideData.badge}
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black font-playfair tracking-tight mb-6 leading-[1.1]">
                <span className="block text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{currentSlideData.title1}</span>
                <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${currentSlideData.gradient} pb-2 drop-shadow-2xl`}>
                  {currentSlideData.title2}
                </span>
              </h1>

              <p className="text-lg md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
                {currentSlideData.desc}
              </p>

              {/* Premium Floating Search Bar */}
              <div className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-2xl p-2 md:p-3 rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-between gap-2 mb-16 group hover:bg-white/15 transition-all">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-6 h-6 text-rose-300" />
                  <input 
                    type="text" 
                    placeholder="Search for Dandiya, Venues, Pandits, Decorators..." 
                    className="w-full bg-transparent text-white placeholder:text-slate-300 text-lg outline-none font-medium"
                    onClick={() => { window.location.href = '/search' }}
                  />
                </div>
                <Link href={currentSlideData.ctaLink || '/search'}>
                  <button className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white px-8 md:px-10 py-4 rounded-full font-black text-lg shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-all transform group-hover:scale-105 whitespace-nowrap">
                    {currentSlideData.ctaText}
                  </button>
                </Link>
              </div>

              {/* Slider Dots */}
              <div className="flex gap-2.5 justify-center mb-8">
                {activeSlides.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      currentSlide === i ? "bg-rose-500 w-10 shadow-[0_0_12px_rgba(225,29,72,0.9)]" : "bg-white/30 w-2.5 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="max-w-4xl mx-auto mt-16 relative z-20">
            {/* Advanced Search Bar below slider */}
            <form action="/search" method="GET" className="flex flex-col md:flex-row items-center bg-white/95 backdrop-blur-xl p-2 md:p-3 rounded-3xl shadow-2xl border border-gray-200">
              <div className="flex-1 flex items-center w-full px-4 py-3 md:py-2 md:border-r border-gray-200">
                <Search className="w-6 h-6 text-rose-500 mr-3 shrink-0" />
                <input 
                  type="text" 
                  name="q"
                  placeholder="Search 'Banquet Hall', 'DJ', 'Photographer'..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-lg text-slate-900 font-medium placeholder-slate-400 outline-none"
                />
              </div>
              <div className="flex-1 flex items-center w-full px-4 py-3 md:py-2 border-t md:border-t-0 border-gray-200">
                <MapPin className="w-6 h-6 text-rose-500 mr-3 shrink-0" />
                <input 
                  type="text" 
                  name="location"
                  placeholder="Location (e.g. Patna, Delhi)" 
                  className="w-full bg-transparent border-none focus:ring-0 text-lg text-slate-900 font-medium placeholder-slate-400 outline-none"
                />
              </div>
              <div className="w-full md:w-auto p-2">
                <button type="submit" className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                  Search
                </button>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8">
              <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm text-sm font-bold text-white">
                <Zap className="w-4 h-4 text-yellow-400" />
                2-Minute Fast Booking
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm text-sm font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Secure & Verified
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm text-sm font-bold text-white">
                <Star className="w-4 h-4 text-rose-400" />
                Premium Partners Only
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 1A. UPCOMING EVENTS & CELEBRATIONS */}
      {events.length > 0 && (
        <section className="relative py-20 px-4 bg-white mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm uppercase tracking-wider mb-2">
                  <Calendar className="w-4 h-4" /> Happening Soon
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-playfair">Upcoming Events</h2>
              </div>
              <Link href="/dandiya" className="hidden md:flex items-center gap-2 text-rose-600 font-bold hover:text-rose-700 transition-colors">
                View all <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((evt, idx) => (
                <div key={evt.id || idx} className="group relative h-[350px] rounded-[2rem] overflow-hidden shadow-lg cursor-pointer border border-gray-100">
                  <img src={evt.imageUrl || evt.image || "https://images.unsplash.com/photo-1598284693998-5c4e97eb65e8?q=80&w=800&auto=format&fit=crop"} alt={evt.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <div className="absolute top-6 left-6 bg-rose-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {evt.category || 'Event'}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <p className="text-rose-200 font-bold text-sm mb-2 tracking-wide uppercase">
                      {new Date(evt.date || evt.startDate).toLocaleDateString()} {evt.location ? `- ${evt.location}` : ''}
                    </p>
                    <h3 className="text-3xl font-bold text-white mb-4">{evt.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-black text-2xl drop-shadow-md">₹{evt.ticketPrice || evt.price} <span className="text-sm font-medium opacity-80">onwards</span></span>
                      <Link href={`/dandiya/${evt.id}`}>
                        <button className="bg-white hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-full font-bold text-sm transition-colors shadow-lg">
                          Book Tickets
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DYNAMIC ADMIN CELEBRATION SECTIONS (Weddings, Birthdays, Book Pandit, Catering, Decor) */}
      {customSections.map((sec) => (
        sec.items && sec.items.length > 0 && (
          <section key={sec.id} className="relative py-16 px-4 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                  {sec.tag && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2 border border-rose-100">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{sec.tag}</span>
                    </div>
                  )}
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-playfair">{sec.title}</h2>
                  {sec.subtitle && (
                    <p className="text-sm text-slate-600 mt-1 max-w-2xl">{sec.subtitle}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sec.items.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/item/${item.id}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-rose-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Card with Red Corner Tag */}
                      <div className="h-52 overflow-hidden relative">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* Top-Left Item Type Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border shadow-md ${
                              item.itemType === 'TICKET'
                                ? 'bg-amber-500/90 text-slate-950 border-amber-400'
                                : 'bg-blue-600/90 text-white border-blue-400'
                            }`}
                          >
                            {item.itemType === 'TICKET' ? <Ticket className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                            <span>{item.itemType === 'TICKET' ? 'Pass' : 'Booking'}</span>
                          </span>
                        </div>

                        {/* Top-Right Small Red Corner Tag */}
                        {(item.cornerTag || item.tag) && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-lg shadow-rose-600/50 border border-rose-400">
                              {item.cornerTag || item.tag}
                            </span>
                          </div>
                        )}

                        {item.location && (
                          <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1 drop-shadow">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{item.rating || 4.9}</span>
                          <span className="text-slate-400 font-normal">({item.reviews || 84})</span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                          {item.title}
                        </h3>

                        {item.subtitle && (
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2">
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400">Price</span>
                          <div className="text-slate-900 font-extrabold text-xl font-mono">
                            ₹{Number(item.price || 0).toLocaleString('en-IN')}{' '}
                            <span className="text-xs font-normal text-slate-400">/{item.priceUnit || (item.itemType === 'TICKET' ? 'ticket' : 'event')}</span>
                          </div>
                        </div>

                        <span className="bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 shadow-sm">
                          <span>View Detail</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      ))}

      {/* 1B. LOKSAFARI TOURISM & HERITAGE EXPEDITIONS */}
      {loksafaris.length > 0 && (
      <section className="relative py-24 px-4 bg-gradient-to-b from-slate-50 via-emerald-50/20 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-3">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                LokSafari Eco-Tourism & Heritage
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-playfair tracking-tight">
                LokSafari Expeditions
              </h2>
              <p className="text-lg text-slate-600 font-medium mt-2 max-w-2xl">
                Curated royal circuits, wildlife tiger reserves, natural waterfalls, and sacred trails with certified local experts.
              </p>
            </div>
            <Link
              href="/loksafari"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-emerald-700 text-white rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg shrink-0 self-start md:self-end"
            >
              Explore All Circuits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loksafaris.slice(0, 3).map((pkg, idx) => (
              <div
                key={pkg.id || idx}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-emerald-100/60 hover:border-emerald-500/40 group flex flex-col justify-between"
              >
                <div>
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={pkg.imageUrl || pkg.image || "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=800&q=80"}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Compass className="w-3.5 h-3.5" /> LokSafari
                    </div>

                    {pkg.duration && (
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-emerald-400" /> {pkg.duration}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-4 text-white text-xs font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" /> {pkg.location}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {pkg.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Per Person</span>
                      <div className="text-slate-900 font-extrabold text-2xl">
                        ₹{Number(pkg.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <Link href={pkg.id ? `/loksafari/${pkg.id}` : '/loksafari'}>
                      <button className="bg-slate-900 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow hover:shadow-md flex items-center gap-1">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 1C. EXPLORE ALL SERVICES */}
      <section className="relative py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-playfair mb-6">Explore All Services</h2>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">From basic religious setups to advanced cinematic decorators, we bring the entire city's celebration ecosystem to your fingertips.</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: "Navratri Dandiya", icon: Music, color: "bg-purple-100 text-purple-600", border: "border-purple-200", href: "/dandiya", badge: "TRENDING" },
            { name: "Banquet Halls", icon: MapPin, color: "bg-rose-100 text-rose-600", border: "border-rose-200", href: "/banquet-halls", badge: "POPULAR" },
            { name: "Wedding Venues", icon: Heart, color: "bg-pink-100 text-pink-600", border: "border-pink-200", href: "/wedding-venues" },
            { name: "Birthday Celebrations", icon: Sparkles, color: "bg-amber-100 text-amber-600", border: "border-amber-200", href: "/birthdays" },
            { name: "Engagements & Roka", icon: HeartHandshake, color: "bg-emerald-100 text-emerald-600", border: "border-emerald-200", href: "/engagements" },
            { name: "LokSafari Expeditions", icon: Compass, color: "bg-teal-100 text-teal-600", border: "border-teal-200", href: "/loksafari", badge: "ECO-TOUR" },
            { name: "Premium Catering", icon: Utensils, color: "bg-orange-100 text-orange-600", border: "border-orange-200", href: "/search?q=catering" },
            { name: "DJ & Sound", icon: Music, color: "bg-indigo-100 text-indigo-600", border: "border-indigo-200", href: "/search?q=dj" },
            { name: "Photography", icon: Camera, color: "bg-blue-100 text-blue-600", border: "border-blue-200", href: "/search?q=photographer" },
            { name: "Theme Decorators", icon: Sparkles, color: "bg-pink-100 text-pink-600", border: "border-pink-200", href: "/search?q=decorator" },
            { name: "Pandit & Puja Setup", icon: Sparkles, color: "bg-amber-100 text-amber-700", border: "border-amber-200", href: "/search?q=pandit" },
            { name: "Bridal Makeup", icon: Heart, color: "bg-fuchsia-100 text-fuchsia-600", border: "border-fuchsia-200", href: "/search?q=makeup" },
          ].map((service, idx) => (
            <Link href={service.href || `/search?category=${encodeURIComponent(service.name)}`} key={idx}>
              <div className={`p-6 rounded-3xl border ${service.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 bg-white flex flex-col items-center text-center cursor-pointer group relative overflow-hidden`}>
                {service.badge && (
                  <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-sm tracking-wider">
                    {service.badge}
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors text-base">{service.name}</h4>
                <span className="text-xs text-rose-500 font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/search">
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105">
              View All Services
            </button>
          </Link>
        </div>
      </section>

      {/* 2. THE CORE PROMISES */}
      <section className="relative py-20 px-4 bg-slate-50 mt-12">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: HeartHandshake, title: "Zero Platform Fee", desc: "Discover premium partners, compare ideas, and plan your day without any hidden platform charges or agent fees." },
              { icon: Gift, title: "Bonus Perks", desc: "Unlock surprise perks, curated extras, and celebration bonuses across selected partner listings on our network." },
              { icon: Clock, title: "Stress-Free Booking", desc: "Search, shortlist, and confirm services in one clean flow without endless calls and confusion." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(225,29,72,0.1)] transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform" />
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-8 text-rose-600">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black font-playfair mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. PREMIUM PARTNERS & SPEED */}
      <section className="relative py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 font-bold text-sm mb-6">
              <Zap className="w-4 h-4" /> Lightning Fast
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">Book in Under <br/><span className="text-rose-600 font-black font-playfair">2 Minutes</span></h2>
            <p className="text-lg text-slate-600 font-medium mb-8 leading-relaxed">Search, choose, and confirm your celebration service faster than ordering food. No phone calls, no waiting, just instant confirmation.</p>
            <Link href="/search" className="inline-flex items-center gap-2 text-rose-600 font-bold hover:text-rose-700 transition-colors">
              Explore more <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200" alt="Wedding Couple" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* FINAL MEMORY PROMISE CTA */}
      <section className="relative py-32 px-4 overflow-hidden border-t border-gray-200 bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-rose-50 blur-[100px] pointer-events-none z-0" />
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative z-10 max-w-3xl mx-auto text-center p-12 rounded-[3rem] border border-gray-100 bg-white/80 backdrop-blur-2xl shadow-2xl">
          <Camera className="w-12 h-12 text-rose-600 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black font-playfair mb-6 text-slate-900">Memory Promise</h2>
          <p className="text-xl text-slate-600 mb-4 font-medium">We will create your memory with curated styling, premium gifts, and thoughtfully planned photography support.</p>
          <p className="text-sm text-rose-600 font-bold mb-10">*T&C applied</p>
          
          <Link href="/search">
            <button className="px-10 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-extrabold text-xl shadow-lg hover:shadow-xl transition-all scale-100 hover:scale-105 active:scale-95">
              Book your celebration
            </button>
          </Link>
        </motion.div>
      </section>



    </div>
  );
}
