'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, Database, Bell } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      icon: Database,
      content: [
        'Personal Identifiers: Full name, email address, phone number, and physical billing/shipping address provided during registration or checkout.',
        'Booking & Event Information: Dates of celebration, venue preferences, attendee count, custom requirements, and booked tickets.',
        'Location Data: With your explicit permission on our website or mobile application, we collect approximate or precise GPS coordinates to show nearby wedding venues, decorators, and event listings in Patna and your city.',
        'Payment Details: All payments are processed through RBI-authorized payment aggregators (e.g. Razorpay). happylokam does not store complete debit/credit card numbers or CVVs on its servers.',
      ],
    },
    {
      id: 'usage',
      title: '2. How We Use Your Information',
      icon: Eye,
      content: [
        'To facilitate, confirm, and manage event reservations and issue verifiable digital QR tickets.',
        'To connect you with verified vendors, event planners, and banquet venues of your choice.',
        'To send real-time SMS, WhatsApp, and email alerts regarding booking updates, ticket confirmations, and customer support tickets.',
        'To detect, investigate, and prevent fraudulent transactions or unauthorized account access.',
      ],
    },
    {
      id: 'sharing',
      title: '3. Data Sharing & Third Parties',
      icon: Lock,
      content: [
        'With Confirmed Vendors: We share necessary contact and booking details with the specific venue or service provider you book to ensure seamless event execution.',
        'Payment & Cloud Infrastructure: We utilize encrypted enterprise cloud servers (AWS) and PCI-DSS Level 1 compliant payment gateways.',
        'No Selling of Personal Data: We strictly do not sell, rent, or trade your personal information to third-party advertisers.',
      ],
    },
    {
      id: 'security',
      title: '4. Security & Retention',
      icon: ShieldCheck,
      content: [
        'All data transmission is protected using modern Transport Layer Security (TLS 1.3 / HTTPS encryption).',
        'Authentication tokens and passwords are cryptographically hashed using industry-standard salt routines.',
        'We retain your transaction records as required by Indian taxation and regulatory laws (including GST and IT Act compliance).',
      ],
    },
    {
      id: 'rights',
      title: '5. Your Rights & Grievance Redressal',
      icon: Bell,
      content: [
        'You have the right to review, update, or request the deletion of your personal account data at any time via your Profile settings.',
        'For privacy inquiries or grievance redressal, please contact our designated Grievance Officer at privacy@happylokam.com or support@happylokam.com.',
        'Office Address: happylokam Celebrations Pvt. Ltd., Kanti Factory Road, Kankarbagh, Patna, Bihar 800026.',
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
              <ShieldCheck className="w-3.5 h-3.5" /> Legal & Transparency
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-4 font-playfair"
          >
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Policy</span>
          </motion.h1>

          <p className="text-slate-400 text-sm">Last Updated: September 2026</p>
        </div>
      </section>

      {/* Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
            At <strong>happylokam</strong> ("we", "our", or "us"), we prioritize the privacy and security of your personal data. This Privacy Policy details how we collect, use, store, and safeguard your data when using our website (<strong>happylokam.com</strong>) and our mobile applications.
          </p>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.id} className="border-t border-slate-100 pt-8 first:border-0 first:pt-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <section.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 font-playfair">{section.title}</h2>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-600 leading-relaxed pl-12 list-disc">
                  {section.content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Have questions about your data?</p>
              <p className="text-xs text-slate-500">Contact our data protection team anytime.</p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs transition-colors"
            >
              Reach Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
