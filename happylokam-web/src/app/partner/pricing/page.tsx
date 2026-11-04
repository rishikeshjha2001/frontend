'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PartnerPricingPage() {
  const plans = [
    {
      name: 'Starter Partner',
      price: 'Free',
      period: 'Forever',
      description: 'Ideal for freelance artists, mehendi experts, and emerging photographers.',
      features: [
        'Single service profile listing',
        'Standard search placement',
        'Direct customer chat',
        'Standard payout (T+3 days)',
        'Basic booking dashboard',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Celebration Pro',
      price: '₹1,999',
      period: 'per month',
      description: 'Built for busy banquets, premium caterers, and high-demand wedding planners.',
      features: [
        'Up to 5 service & package listings',
        'Priority placement in city search',
        'Verified Partner Gold Badge',
        'Instant payouts & automated invoicing',
        'Dedicated happylokam Support specialist',
        'Lead notifications via WhatsApp',
      ],
      cta: 'Join Pro Tier',
      popular: true,
    },
    {
      name: 'Enterprise / Venue Elite',
      price: 'Custom',
      period: 'Tailored pricing',
      description: 'For luxury resorts, large convention centers, and multi-city celebration organizers.',
      features: [
        'Unlimited venue & event packages',
        'Top-of-page featured banners',
        '360° virtual tour integration',
        'Custom contracts & multi-calendar sync',
        '24/7 Premium concierge support',
      ],
      cta: 'Talk to Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-rose-500/30 pt-24 pb-24">
      {/* Hero */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-950 opacity-90" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent Growth
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-playfair mb-4">
            Grow Your Celebration <span className="text-rose-500">Business</span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
            Choose the perfect plan to showcase your venues, attract verified high-intent clients, and receive guaranteed payouts.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between ${
                plan.popular
                  ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-rose-500 relative'
                  : 'bg-white text-slate-900 shadow-xl border border-slate-100'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-2xl font-black font-playfair mb-2">{plan.name}</h3>
                <p className={`text-xs mb-6 ${plan.popular ? 'text-slate-300' : 'text-slate-500'}`}>{plan.description}</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                  <span className={`text-xs ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start gap-3 text-xs sm:text-sm">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-rose-400' : 'text-rose-600'}`} />
                      <span className={plan.popular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/partner/register"
                className={`w-full py-4 rounded-2xl font-bold text-center text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-slate-900 hover:bg-rose-600 text-white'
                }`}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
