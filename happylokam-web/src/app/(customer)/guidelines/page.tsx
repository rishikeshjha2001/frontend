'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, Star, Clock, FileText, Lock } from 'lucide-react';
import Link from 'next/link';

export default function QualityGuidelinesPage() {
  const partnerGuidelines = [
    {
      title: '100% Genuine Portfolio & Real Images',
      desc: 'All listings must feature original photographs and authentic videos of your actual work, venues, or setups. Stock photos, copyrighted third-party images, or misrepresentations are strictly prohibited.',
    },
    {
      title: 'Punctuality & Execution Guarantee',
      desc: 'Vendors must arrive at the venue at least 2 hours before the scheduled event start. Setup completion and sound/light checks must finish before guest arrival.',
    },
    {
      title: 'Transparent Pricing & Zero Hidden Charges',
      desc: 'Quotes provided on happylokam must be all-inclusive (taxes, service charges, equipment logistics). Any extra charges must be agreed in writing before booking confirmation.',
    },
    {
      title: 'Professional Demeanor & Staff Etiquette',
      desc: 'All crew, decorators, catering staff, and artists must be dressed professionally, exhibit courteous behavior, and strictly adhere to venue safety and hygiene protocols.',
    },
  ];

  const customerGuidelines = [
    {
      title: 'Booking Verification & Official Passes',
      desc: 'Only tickets purchased through happylokam.com or the official mobile app are valid. Physical entry requires presenting the dynamic digital QR code on your phone.',
    },
    {
      title: 'Venue Code of Conduct',
      desc: 'Respect venue guidelines, cultural sensitivities, and security staff instructions during festive gatherings such as Navratri Dandiya and private weddings.',
    },
    {
      title: 'Fair Cancellation & Rescheduling',
      desc: 'Cancellations follow our standard cancellation tiers. Please initiate requests promptly through your dashboard to allow vendors sufficient lead time.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-rose-500/30 pt-24 pb-24">
      {/* Hero */}
      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-950 opacity-90" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-block">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> Trust & Excellence Standards
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-6 font-playfair"
          >
            happylokam Quality <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Guidelines</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Our commitment is to ensure every event booked through our platform is flawless, secure, and memorable. Here is what we expect from our partners and community.
          </motion.p>
        </div>
      </section>

      {/* Standards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-16">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-start">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-playfair mb-2">Verified Excellence</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every vendor profile and venue listing undergoes manual document verification and quality screening before public activation.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-playfair mb-2">Financial Protection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Payments are held securely in escrow through Razorpay / official banking rails and released only upon successful milestone fulfillment.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 font-playfair mb-2">Zero Delays Policy</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Timelines matter. We enforce strict arrival times and backup vendor allocation in case of unforeseen emergencies.
            </p>
          </div>
        </div>

        {/* Vendor Guidelines */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
          <div className="mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-rose-600">For Service Providers</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-playfair mt-1">Vendor & Venue Partner Standards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnerGuidelines.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Guidelines */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
          <div className="mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">For Celebration Seekers</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-playfair mt-1">Customer & Attendee Guidelines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customerGuidelines.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Banner */}
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black font-playfair">Report a Quality Concern</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Experienced an issue with an event or vendor not meeting our standards? Our quality audit team reviews every report within 24 hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            Contact Quality Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
