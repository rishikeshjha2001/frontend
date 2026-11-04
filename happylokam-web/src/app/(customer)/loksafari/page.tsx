"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, MapPin, Calendar, Users, Camera, ShieldCheck, 
  ArrowRight, Phone, MessageSquare, Star, Sparkles, CheckCircle2,
  Clock, IndianRupee, Heart, Search, Filter
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

export default function LokSafariCustomerPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res: any = await apiClient.get('/loksafari/active');
        if (res && res.success && Array.isArray(res.data)) {
          setPackages(res.data);
        } else if (res && Array.isArray(res.packages)) {
          setPackages(res.packages);
        } else {
          setPackages([]);
        }
      } catch (error) {
        console.warn("Error fetching LokSafari packages:", error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const categories = ['All', 'Heritage', 'Wildlife', 'Spiritual', 'Adventure'];

  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = selectedCategory === 'All' || 
      (pkg.category && pkg.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      (pkg.title && pkg.title.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (pkg.description && pkg.description.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesSearch = !searchQuery || 
      (pkg.title && pkg.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pkg.location && pkg.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pkg.description && pkg.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans selection:bg-rose-500/30 pb-24">
      
      {/* LokSafari Cinematic Hero */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=2000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-[#070b14]/70 to-[#070b14]" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 pt-28 pb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6 }} 
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-bold tracking-widest uppercase shadow-2xl backdrop-blur-md">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" /> Discover Bihar & India
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.2 }} 
            className="text-5xl md:text-7xl lg:text-8xl font-black font-playfair tracking-tight mb-6 text-white drop-shadow-2xl"
          >
            Lok<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Safari</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.4 }} 
            className="text-lg md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed mb-10 drop-shadow"
          >
            All-Inclusive Guided Eco-Tourism, Royal Heritage Circuits & Spiritual Expeditions. 
            Transport, verified local guides, luxury stays, and memorable celebrations — handled end-to-end.
          </motion.p>

          {/* Quick Search & Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl mx-auto bg-slate-900/90 backdrop-blur-md p-2 rounded-full shadow-2xl border border-slate-700/80 flex items-center gap-2"
          >
            <div className="pl-4 text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search destinations or circuits..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder-slate-400 font-medium text-sm md:text-base outline-none px-2 py-2"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full font-bold transition-all"
              >
                Clear
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 -mt-10 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/90 rounded-3xl p-6 shadow-2xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3 p-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">100% Verified</p>
              <p className="text-xs text-slate-400 font-medium">Licensed guides & security</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">All-Inclusive</p>
              <p className="text-xs text-slate-400 font-medium">Travel, stay & food covered</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">Memory Promise</p>
              <p className="text-xs text-slate-400 font-medium">Scenic photo spots planned</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">24/7 Helpline</p>
              <p className="text-xs text-slate-400 font-medium">+91 8969255561 on trip</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Packages Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-3xl md:text-4xl font-black font-playfair text-white">
              Curated LokSafari Expeditions
            </h2>
            <p className="text-slate-400 font-medium text-sm mt-1">
              Select an expedition to view itinerary details, pricing, and book your group pass.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All Expeditions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/90 rounded-3xl border border-slate-800 p-8 shadow-2xl">
            <Compass className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">No LokSafari Expeditions Available Yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              There are currently no active LokSafari packages uploaded by the admin. Check back soon or create new circuits from the Admin portal.
            </p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/90 rounded-3xl border border-slate-800 p-8 shadow-2xl">
            <Compass className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No expeditions match your criteria</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Try adjusting your search query or select another category filter to explore all available circuits.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-full hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/40"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800 shadow-xl hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/30 transition-all duration-300 group flex flex-col justify-between backdrop-blur-md"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={pkg.imageUrl || pkg.image || "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=800&q=80"} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Compass className="w-3.5 h-3.5" /> LokSafari
                    </div>

                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> {pkg.duration || 'Full Day'}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-300 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" /> {pkg.location}
                      </div>
                      <h3 className="text-xl font-black text-white font-playfair line-clamp-1 drop-shadow-sm">
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-slate-300 text-sm font-medium leading-relaxed line-clamp-3 mb-6">
                      {pkg.description || "Join us on this verified all-inclusive LokSafari expedition with curated transportation, meals, and experienced local guide."}
                    </p>

                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/80 rounded-2xl text-xs font-semibold text-slate-300 mb-2 border border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>AC Travel Included</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Cultural Escort</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Entry Passes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Stay & Meals</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Per Person</span>
                      <div className="text-white font-black text-2xl flex items-center">
                        <IndianRupee className="w-5 h-5 -mr-0.5 text-emerald-400" />
                        {Number(pkg.price || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <Link href={`/loksafari/${pkg.id}`} className="inline-block">
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg shadow-emerald-950/40 flex items-center gap-1.5">
                        <span>View Itinerary</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </section>

      {/* Custom Group & Corporate Expeditions Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-8 md:p-14 shadow-2xl border border-emerald-900/40">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
                Custom Groups & Corporate
              </span>
              <h3 className="text-3xl md:text-5xl font-black font-playfair mb-4 leading-tight">
                Planning a Family Trip, Wedding Tour or Corporate Retreat?
              </h3>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                We craft tailor-made private safaris with dedicated tempo travelers, luxury bus fleets, customized picnic meals, and exclusive sightseeing timings.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <a 
                href="https://wa.me/918969255561?text=Hi%20happylokam%2C%20I%20am%20interested%20in%20custom%20LokSafari%20group%20booking"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-base">
                  <MessageSquare className="w-5 h-5" />
                  Chat on WhatsApp
                </button>
              </a>
              <a href="tel:+918969255561" className="w-full">
                <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all border border-white/20 flex items-center justify-center gap-2 text-base">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  Call: +91 8969255561
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
