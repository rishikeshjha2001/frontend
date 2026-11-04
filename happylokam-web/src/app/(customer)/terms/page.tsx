'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Scale, AlertCircle, RefreshCw, Award } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const termsList = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: Scale,
      content: [
        'By browsing, accessing, or registering on happylokam.com or the happylokam mobile application, you agree to be legally bound by these Terms of Service.',
        'If you do not agree to these terms, you must discontinue using our platform and services immediately.',
      ],
    },
    {
      id: 'bookings',
      title: '2. Celebration Bookings & Event Tickets',
      icon: Award,
      content: [
        'All bookings (including Dandiya Mahotsav passes, birthday packages, venue hires, and wedding services) are subject to real-time verification and organizer confirmation.',
        'Digital tickets generated with an official QR code are personal to the purchaser and must be presented at the venue gate for entry validation.',
        'Event organizers and venues reserve the right to deny admission for failure to adhere to age restrictions, dress codes, or security guidelines.',
      ],
    },
    {
      id: 'payments',
      title: '3. Pricing, Payments & Taxes',
      icon: ShieldCheck,
      content: [
        'Prices listed on happylokam are shown in Indian Rupees (INR) and are inclusive or exclusive of GST as explicitly stated on the checkout screen.',
        'Platform processing and convenience charges are non-refundable once an electronic transaction is completed.',
        'All payment processing is executed via verified RBI-compliant third-party gateways (Razorpay).',
      ],
    },
    {
      id: 'cancellations',
      title: '4. Cancellation & Refund Policy',
      icon: RefreshCw,
      content: [
        'Event Tickets (e.g. Dandiya, Concerts): Tickets are non-refundable unless an event is officially cancelled or rescheduled by the organizer.',
        'Vendor & Venue Bookings: Cancellations made 15+ days prior to event date are eligible for up to 80% refund of advance deposits. Cancellations within 7 days are subject to vendor forfeiture rules.',
        'Refund Processing: Approved refunds are credited back to the original source payment method within 5-7 business banking days.',
      ],
    },
    {
      id: 'conduct',
      title: '5. User Responsibilities & Platform Conduct',
      icon: AlertCircle,
      content: [
        'You agree not to upload fraudulent information, fake reviews, or unauthorized third-party images.',
        'Any attempt to reverse engineer, scrape, bypass rate limits, or disrupt our servers is strictly prohibited and subject to legal prosecution under the Indian IT Act, 2000.',
      ],
    },
    {
      id: 'jurisdiction',
      title: '6. Governing Law & Dispute Resolution',
      icon: FileText,
      content: [
        'These terms shall be governed by and construed in accordance with the laws of the Republic of India.',
        'Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Patna, Bihar, India.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-rose-500/30 pt-24 pb-24">
      {/* Hero */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-950 opacity-90" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-block">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black tracking-widest uppercase">
              <Scale className="w-3.5 h-3.5" /> User Agreement
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-4 font-playfair"
          >
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Service</span>
          </motion.h1>

          <p className="text-slate-400 text-sm">Effective: September 2026</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
            Welcome to <strong>happylokam</strong>. Please read these terms carefully before engaging our celebration booking services, purchasing event passes, or partnering as a vendor.
          </p>

          <div className="space-y-10">
            {termsList.map((term) => (
              <div key={term.id} className="border-t border-slate-100 pt-8 first:border-0 first:pt-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <term.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 font-playfair">{term.title}</h2>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-600 leading-relaxed pl-12 list-disc">
                  {term.content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Need clarification on our terms?</p>
              <p className="text-xs text-slate-500">Our legal and support desks are available for assistance.</p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
