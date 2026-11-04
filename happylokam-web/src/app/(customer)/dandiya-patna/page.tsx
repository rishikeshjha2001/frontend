'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, Music, Users, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function DandiyaPatnaPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<any>('/events')
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          // Filter only Dandiya events in Patna, or just show events if demo
          const dandiyaEvents = data.data.filter((e: any) => 
            e.title?.toLowerCase().includes('dandiya') || e.category?.toLowerCase().includes('dandiya')
          );
          setEvents(dandiyaEvents.length > 0 ? dandiyaEvents : data.data);
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to fetch Dandiya events");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1605808360022-d8f1618684cb?q=80&w=2000" 
            alt="Navratri Dandiya Nights Patna" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-full font-bold text-sm mb-6 uppercase tracking-widest shadow-lg">
              <Sparkles className="w-4 h-4" /> Patna&apos;s Biggest Navratri Festival
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 font-playfair drop-shadow-lg leading-tight">
              Best Navratri Dandiya <br className="hidden md:block"/> Nights in Patna
            </h1>
            <p className="text-lg md:text-xl text-rose-100 max-w-2xl mx-auto font-medium mb-10">
              Experience the magic of Navratri with the most premium Garba and Dandiya events in Patna. Live music, celebrity DJs, food stalls, and non-stop celebration!
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEO Content & Events Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Book Your Dandiya Tickets Now</h2>
            <p className="text-slate-600 text-lg">
              Looking for &quot;Dandiya in Patna&quot;? You&apos;re in the right place. happylokam brings you exclusive access to the most secure, family-friendly, and energetic Dandiya nights happening near you.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((evt, idx) => (
                <div key={evt.id || idx} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 group">
                  <div className="relative h-64 overflow-hidden">
                    <img src={evt.imageUrl || "https://images.unsplash.com/photo-1605808360022-d8f1618684cb?q=80&w=800"} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-900 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">
                      {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{evt.title}</h3>
                    <div className="space-y-2 mb-6">
                      <p className="flex items-center gap-2 text-slate-600 text-sm"><MapPin className="w-4 h-4 text-rose-500" /> {evt.location}</p>
                      <p className="flex items-center gap-2 text-slate-600 text-sm"><Music className="w-4 h-4 text-rose-500" /> Live DJ & Band</p>
                      <p className="flex items-center gap-2 text-slate-600 text-sm"><Users className="w-4 h-4 text-rose-500" /> Family Friendly</p>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Entry Pass</p>
                        <p className="text-xl font-black text-rose-600">₹{evt.price || evt.ticketPrice || 499}</p>
                      </div>
                      <Link href={`/dandiya/${evt.id}`}>
                        <button className="bg-slate-900 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                          Book Now <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
