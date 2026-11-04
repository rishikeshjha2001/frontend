'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, Phone, Mail, MessageSquare, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function PartnerSupportPage() {
  const faqs = [
    {
      q: 'How do payouts work for completed events?',
      a: 'Payouts are automatically transferred to your verified bank account via NEFT/IMPS within 24 to 72 hours following event completion and client verification.',
    },
    {
      q: 'Can I update my event ticket prices or availability anytime?',
      a: 'Yes! You can manage your live event inventory, ticket pricing tiers, and event descriptions in real time from your Partner Dashboard.',
    },
    {
      q: 'What should I do if a client requests a last-minute schedule change?',
      a: 'Contact happylokam Support immediately or call our 24/7 partner helpline so we can facilitate official schedule amendments and notify the client.',
    },
    {
      q: 'How do I earn the "Verified Partner Gold Badge"?',
      a: 'Partners with more than 5 completed 5-star celebrations, zero unexcused cancellations, and complete KYC documents are automatically awarded the Gold Badge.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-rose-500/30 pt-24 pb-24">
      {/* Hero */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-950 opacity-90" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black tracking-widest uppercase mb-4">
            <Headphones className="w-3.5 h-3.5" /> Partner Success Desk
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-playfair mb-4">
            Partner <span className="text-rose-500">Support</span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
            Priority technical, operational, and billing assistance for our registered venue hosts and service providers.
          </p>
        </div>
      </section>

      {/* Support Channels & FAQs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Partner Hotline</h3>
            <p className="text-xs text-slate-500 mb-4">Urgent day-of-event assistance</p>
            <a href="tel:+918969255561" className="text-rose-600 font-bold text-sm hover:underline">+91 89692 55561</a>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Partner Email</h3>
            <p className="text-xs text-slate-500 mb-4">Invoicing, contracts & onboarding</p>
            <a href="mailto:partners@happylokam.com" className="text-rose-600 font-bold text-sm hover:underline">partners@happylokam.com</a>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">Partner Dashboard</h3>
            <p className="text-xs text-slate-500 mb-4">Live booking & payout status</p>
            <Link href="/partner/dashboard" className="text-emerald-600 font-bold text-sm hover:underline">Go to Dashboard &rarr;</Link>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-rose-600" />
            <h2 className="text-2xl font-black text-slate-900 font-playfair">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-base font-black text-slate-900">{faq.q}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
