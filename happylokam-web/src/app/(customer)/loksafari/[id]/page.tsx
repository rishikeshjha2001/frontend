"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, MapPin, Calendar, Users, Camera, ShieldCheck, 
  ArrowLeft, ArrowRight, Phone, MessageSquare, Star, Sparkles, CheckCircle2,
  Clock, IndianRupee, X, AlertCircle, ChevronDown, Check, Share2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface SafariDetails {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  description: string;
  imageUrl: string;
  status?: string;
  highlights?: string[];
  itinerary?: { day: string; title: string; desc: string }[];
  inclusions?: string[];
  exclusions?: string[];
}

export default function LokSafariDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  const [safari, setSafari] = useState<SafariDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Booking Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    const fetchSafari = async () => {
      try {
        const res: any = await apiClient.get(`/loksafari/${id}`);
        if (res && res.success && res.data) {
          const apiData = res.data;
          setSafari({
            id: apiData.id,
            title: apiData.title,
            location: apiData.location,
            duration: apiData.duration || 'Full Day',
            price: Number(apiData.price) || 0,
            description: apiData.description || '',
            imageUrl: apiData.imageUrl || apiData.image || 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=80',
            highlights: Array.isArray(apiData.highlights) && apiData.highlights.length > 0 ? apiData.highlights : [
              'All-inclusive private transportation',
              'Verified local tour guide & security escort',
              'Hand-picked verified luxury accommodations',
              'Authentic regional meals included',
              'Entry passes and sightseeing tickets pre-arranged'
            ],
            itinerary: Array.isArray(apiData.itinerary) && apiData.itinerary.length > 0 ? apiData.itinerary : [
              { day: 'Day 1', title: 'Pick-up, Journey & Guided Exploration', desc: 'Private transfer, check-in, orientation, and primary sightseeing spots with local escort.' },
              { day: 'Day 2', title: 'Scenic Spots, Culinary Feast & Departure', desc: 'Morning photography walk, cultural heritage visit, lunch, and return transfer.' }
            ],
            inclusions: Array.isArray(apiData.inclusions) && apiData.inclusions.length > 0 ? apiData.inclusions : [
              'Sanitized Vehicle with experienced chauffeur',
              'Verified hotel/resort accommodations',
              'All monument entry passes & toll taxes',
              'Breakfast & Lunch',
              '24/7 happylokam On-ground Support'
            ],
            exclusions: Array.isArray(apiData.exclusions) && apiData.exclusions.length > 0 ? apiData.exclusions : [
              'Personal shopping & additional snacks',
              'Driver tip (optional)'
            ]
          });
          return;
        }
      } catch (err) {
        console.warn('API fetch error:', err);
      }
      setSafari(null);
    };

    if (id) {
      fetchSafari().finally(() => setLoading(false));
    }
  }, [id]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !tripDate) {
      toast.error('Please enter your full name, phone number, and trip date.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsBooked(true);
      toast.success('Your LokSafari reservation request has been submitted!');
    }, 1200);
  };

  const shareSafari = () => {
    if (navigator.share) {
      navigator.share({
        title: safari?.title || 'LokSafari Expedition',
        text: `Check out this LokSafari package: ${safari?.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Compass className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Loading LokSafari expedition details...</p>
        </div>
      </div>
    );
  }

  if (!safari) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-xl border border-gray-100">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Expedition Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">The requested LokSafari tour could not be loaded.</p>
          <Link href="/loksafari">
            <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all">
              Explore All LokSafari Circuits
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = safari.price * guests;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28 selection:bg-emerald-500/30">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tours
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={shareSafari}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              title="Share Tour"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <a 
              href="https://wa.me/918969255561?text=Hi%2C%20I%20have%20an%20inquiry%20about%20LokSafari%20trip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp Help
            </a>
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden bg-slate-100">
        <img 
          src={safari.imageUrl} 
          alt={safari.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-black/25 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 text-white">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider mb-4 shadow-lg">
            <Compass className="w-4 h-4" /> LokSafari Verified Circuit
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-playfair tracking-tight mb-3 max-w-4xl leading-tight">
            {safari.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" /> {safari.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" /> {safari.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" /> Government & Heritage Certified
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Tour Breakdown */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black font-playfair text-slate-900 mb-4">
                Expedition Overview
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-6 font-medium">
                {safari.description}
              </p>

              {/* Highlights Chips */}
              {safari.highlights && safari.highlights.length > 0 && (
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    Circuit Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {safari.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 text-emerald-900 text-xs font-bold">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Day-by-Day Itinerary */}
            {safari.itinerary && safari.itinerary.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black font-playfair text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-600" /> Planned Itinerary
                </h2>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-200">
                  {safari.itinerary.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-6 pl-10">
                      <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black ring-4 ring-emerald-50">
                        {idx + 1}
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-gray-100 flex-1">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full mb-2 inline-block">
                          {item.day}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> What's Included
                </h3>
                <ul className="space-y-3">
                  {(safari.inclusions || []).map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 text-slate-700">
                  <X className="w-5 h-5 text-rose-500" /> What's Excluded
                </h3>
                <ul className="space-y-3">
                  {(safari.exclusions || []).map((exc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs font-semibold text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safety & Quality Guarantee */}
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-lg font-black font-playfair mb-1">happylokam LokSafari Guarantee</h4>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                  Every expedition is led by verified state tourist guides, includes emergency first-aid, full vehicle insurance, and transparent pricing with zero surprise charges.
                </p>
              </div>
            </div>

          </div>

          {/* Right Col: Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
              
              {/* Pricing Header */}
              <div className="border-b border-gray-100 pb-5 mb-5">
                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Package Price</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <div className="text-3xl font-black text-slate-950 flex items-center">
                    <IndianRupee className="w-6 h-6 -mr-1" />
                    {Number(safari.price || 0).toLocaleString('en-IN')}
                  </div>
                  <span className="text-slate-500 text-xs font-bold">/ person</span>
                </div>
                <div className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                  ✓ Instant Confirmation & Verified Guide
                </div>
              </div>

              {/* Guest Counter */}
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Number of Travelers / Guests
                </label>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-gray-200">
                  <button 
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 rounded-xl bg-white text-slate-800 font-black shadow-sm hover:bg-slate-100 flex items-center justify-center text-lg transition-all"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <span className="text-lg font-black text-slate-900">{guests}</span>
                    <span className="text-xs text-slate-500 block font-medium">Travelers</span>
                  </div>
                  <button 
                    onClick={() => setGuests(guests + 1)}
                    className="w-10 h-10 rounded-xl bg-white text-slate-800 font-black shadow-sm hover:bg-slate-100 flex items-center justify-center text-lg transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-100 mb-6 space-y-2 text-xs font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>₹{safari.price} × {guests} Traveler{guests > 1 ? 's' : ''}</span>
                  <span className="font-bold text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>State Taxes & Tourism Cess</span>
                  <span className="font-bold text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Entry Passes & Stays</span>
                  <span className="font-bold text-emerald-600">Included</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-slate-950">
                  <span>Total Payable:</span>
                  <span className="text-emerald-700 text-base">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-base shadow-lg hover:shadow-emerald-600/30 transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Compass className="w-5 h-5" />
                  Reserve This Safari
                </button>

                <a 
                  href={`https://wa.me/918969255561?text=Hi%20happylokam%2C%20I%20want%20to%20book%20${encodeURIComponent(safari.title)}%20for%20${guests}%20travelers`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <button className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    Book via WhatsApp Assistance
                  </button>
                </a>
              </div>

              {/* Direct Call Assistance */}
              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-xs text-slate-500 font-medium mb-1">Need help or a custom vehicle?</p>
                <a href="tel:+918969255561" className="text-xs font-black text-emerald-700 hover:underline flex items-center justify-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Call: +91 8969255561
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-gray-100"
            >
              <button 
                onClick={() => { setIsModalOpen(false); setIsBooked(false); }}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!isBooked ? (
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs uppercase tracking-wider mb-2">
                    <Compass className="w-4 h-4" /> LokSafari Reservation Request
                  </div>
                  <h3 className="text-2xl font-black font-playfair text-slate-900 mb-1">
                    {safari.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium mb-6">
                    ₹{totalPrice.toLocaleString('en-IN')} for {guests} traveler{guests > 1 ? 's' : ''} ({safari.duration})
                  </p>

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Lead Traveler Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Rahul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp / Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email Address (Optional)</label>
                      <input 
                        type="email" 
                        placeholder="e.g. rahul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Start Date *</label>
                      <input 
                        type="date" 
                        required 
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black rounded-xl text-base shadow-lg transition-all mt-6"
                    >
                      {submitting ? 'Submitting Reservation...' : 'Confirm & Request Booking'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black font-playfair text-slate-900 mb-2">Reservation Received!</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                    Thank you, <strong className="text-slate-900">{fullName}</strong>! Our LokSafari coordinator has received your request for <strong>{guests} travelers</strong> on <strong>{tripDate}</strong>. We will call you within 15 minutes to confirm pickup and itinerary details.
                  </p>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 text-xs font-bold text-slate-700 mb-6">
                    Helpline: +91 8969255561 (24x7)
                  </div>
                  <button 
                    onClick={() => { setIsModalOpen(false); setIsBooked(false); }}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    Done
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
