"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Users, MapPin, Award, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-rose-500/30">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/80 via-slate-900/80 to-slate-50 backdrop-blur-sm" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-block">
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-100 text-sm font-bold tracking-widest uppercase shadow-2xl backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> Our Story
            </span>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight font-playfair">
            Redefining How India <span className="text-rose-500">Celebrates</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="text-lg md:text-xl text-rose-50/90 font-medium max-w-2xl mx-auto leading-relaxed">
            We noticed that planning a celebration often overshadows the joy of the moment itself. happylokam was born to bring back the magic, making premium event planning as simple as a single click.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-20 -mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: "Platform", value: "Verified", icon: Award },
              { label: "Bookings", value: "Secure", icon: ShieldCheck },
              { label: "Support", value: "24/7", icon: Users },
              { label: "Memories", value: "Priceless", icon: Heart },
            ].map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 font-playfair mb-2">{stat.value}</h3>
                <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-playfair font-black text-slate-900 mb-6 leading-tight">
                Your moments, <br/><span className="text-rose-600">curated to perfection.</span>
              </h2>
              <div className="w-20 h-2 bg-rose-600 mb-8 rounded-full" />
              <p className="text-lg text-slate-600 font-medium leading-relaxed mb-6">
                Planning an event in India traditionally involves endless phone calls, haggling, and uncertainty. We built happylokam to bring transparency, premium quality, and effortless booking to the industry.
              </p>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Whether it's a grand wedding in a palace or an intimate baby shower at home, our platform guarantees 100% verified partners, secure payments, and a flawless execution from start to finish.
              </p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" alt="Wedding Celebration" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 max-w-xs">
                <p className="text-xl font-playfair font-bold text-slate-900 mb-2">"The best decision we made for our wedding."</p>
                <p className="text-rose-600 font-bold text-sm">— Rahul & Sneha</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
