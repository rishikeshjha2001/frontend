'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Sparkles, Headphones, ShieldCheck, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    // Simulate fast reliable submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Your message has been received! Our celebration concierge will contact you within 2 hours.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-rose-500/30 pt-24 pb-20">
      {/* Hero Header */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-950 opacity-90" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-block">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> 24/7 Dedicated Support
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-6 font-playfair"
          >
            We're Here to Make Your Celebration <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Unforgettable</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Have a question about booking an event, listing a venue, or tailoring a custom package? Our Patna-based team is always ready to assist.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Cards: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6"
            >
              <h2 className="text-2xl font-black text-slate-900 font-playfair flex items-center gap-3">
                <Headphones className="w-6 h-6 text-rose-600" /> Direct Channels
              </h2>

              <div className="space-y-4">
                <a
                  href="tel:+918969255561"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-rose-50/60 border border-slate-100 hover:border-rose-200 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Call Us Anytime</p>
                    <p className="text-base font-black text-slate-900 group-hover:text-rose-600 transition-colors">+91 89692 55561</p>
                    <p className="text-xs text-slate-500 mt-0.5">Mon - Sun: 9:00 AM - 10:00 PM IST</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/918969255561?text=Hello%20happylokam%20Concierge%2C%20I%20need%20assistance%20with%20my%20event%20booking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-100 hover:border-emerald-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">WhatsApp Concierge</p>
                    <p className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">+91 89692 55561</p>
                    <p className="text-xs text-slate-500 mt-0.5">Instant chat with our celebration planners</p>
                  </div>
                </a>

                <a
                  href="mailto:support@happylokam.com"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-rose-50/60 border border-slate-100 hover:border-rose-200 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Us</p>
                    <p className="text-base font-black text-slate-900 group-hover:text-rose-600 transition-colors">support@happylokam.com</p>
                    <p className="text-xs text-slate-500 mt-0.5">Average response under 2 hours</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Headquarters</p>
                    <p className="text-base font-black text-slate-900">happylokam Celebrations Pvt. Ltd.</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Kanti Factory Road, Mahatma Gandhi Nagar, Kankarbagh, Patna, Bihar 800026
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">100% Booking Guarantee</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      All event tickets, vendor contracts, and venues booked via happylokam are verified, licensed, and backed by our cancellation & safety assurance.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Form: Interactive Message Card */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100"
            >
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 font-playfair">Message Sent Successfully!</h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Thank you, <strong className="text-slate-900">{formState.name}</strong>. Our celebration team has received your inquiry and will connect with you via email or phone shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="mt-6 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-playfair mb-2">Send Us a Message</h2>
                    <p className="text-sm text-slate-500">Fill in the form below and we will respond promptly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Kumar"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Inquiry Type</label>
                      <select
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Event Ticket Support">Event Ticket Support</option>
                        <option value="Vendor / Partner Registration">Vendor / Partner Registration</option>
                        <option value="Corporate / Luxury Booking">Corporate / Luxury Booking</option>
                        <option value="Refund & Cancellation">Refund & Cancellation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your celebration, date, location or any questions you have..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-base shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
