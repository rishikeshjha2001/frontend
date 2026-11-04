"use client";

import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Check, 
  Heart, 
  Share, 
  Users, 
  CalendarDays, 
  IndianRupee, 
  ChevronRight, 
  Phone,
  ShieldCheck,
  Sparkles,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function VenueDetailPage({ params }: { params: { slug: string } }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/listings/${params.slug}`);
        if (!res.ok) {
          throw new Error('Listing not found');
        }
        const data = await res.json();
        if (data.success && data.data) {
          setListing(data.data);
        } else {
          throw new Error(data.error || 'Failed to load listing');
        }
      } catch (err: any) {
        setError(err.message || 'Unable to load listing details');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-rose-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading celebration details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Venue or Service Not Found</h2>
        <p className="text-gray-500 max-w-md mb-6">
          The celebration venue or partner service you are looking for is currently unavailable or being reviewed.
        </p>
        <Link 
          href="/explore" 
          className="px-6 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
        >
          Explore All Venues & Services
        </Link>
      </div>
    );
  }

  const images = Array.isArray(listing.images) && listing.images.length > 0 
    ? listing.images 
    : ['/og-image.jpg'];

  const amenities = Array.isArray(listing.features) && listing.features.length > 0 
    ? listing.features 
    : [
        "Air Conditioning",
        "Valet Parking",
        "Decor & Lighting",
        "Sound & DJ Allowed",
        "In-house / Outside Catering",
        "Bridal Dressing Room"
      ];

  const price = typeof listing.price === 'number' ? listing.price : (listing.pricing || 0);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24 font-sans">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/explore" className="hover:text-rose-600">Explore</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-xs">{listing.title}</span>
        </div>
      </div>

      {/* Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold uppercase rounded-full tracking-wide">
                {listing.category || 'Celebration Venue'}
              </span>
              {listing.partner?.isVerified && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {listing.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center text-sm text-gray-600 gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-gray-900">{listing.rating || '4.9'}</span>
                <span className="text-gray-500">({listing.totalBookings || 24} celebrations hosted)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>{listing.location || listing.city || 'Patna, Bihar'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: listing.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }
              }}
              className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <Share className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden h-[360px] md:h-[500px]">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-gray-100">
            <img 
              src={images[0]} 
              alt={listing.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* Additional Images */}
          {images.slice(1, 5).map((img: string, idx: number) => (
            <div key={idx} className="hidden md:block relative group overflow-hidden bg-gray-100">
              <img 
                src={img} 
                alt={`${listing.title} ${idx + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column (Details) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Overview */}
            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Listing</h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {listing.description || "Experience premier celebrations with our fully equipped venue and dedicated service team. From grand weddings to intimate birthdays, every detail is verified for quality and comfort."}
              </p>
              
              <div className="flex flex-wrap gap-8 mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Capacity</div>
                    <div className="text-sm text-gray-500">{listing.capacity ? `${listing.capacity} Guests` : 'Up to 500 Guests'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Availability</div>
                    <div className="text-sm text-gray-500">Live Booking Available</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features & Amenities */}
            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenities.map((amenity: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Partner Details */}
            {listing.partner && (
              <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Managed by Partner</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{listing.partner.businessName || listing.partner.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">happylokam Verified Celebration Host</p>
                </div>
                {listing.partner.phone && (
                  <a 
                    href={`tel:${listing.partner.phone}`}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4 text-rose-600" /> Call Host
                  </a>
                )}
              </section>
            )}

          </div>

          {/* Right Column (Sticky Booking Widget) */}
          <div className="relative">
            <div className="sticky top-24 z-10">
              <div className="bg-white border border-rose-100 shadow-xl shadow-rose-600/5 rounded-3xl p-6 sm:p-8">
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-3xl font-extrabold text-gray-900 flex items-center">
                    <IndianRupee className="w-6 h-6 mr-0.5 text-rose-600" />
                    {price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-500 pb-1 text-sm font-medium">/ {listing.pricingUnit === 'PER_PLATE' ? 'plate' : 'event'}</span>
                </div>

                <div className="border border-gray-200 rounded-2xl p-4 mb-6 space-y-3 bg-gray-50/50">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                      Celebration Date
                    </label>
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <Link href={`/checkout/listing/${listing.id}?date=${selectedDate}`}>
                  <button className="w-full py-4 rounded-xl font-bold text-white text-base bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                    <Sparkles className="w-5 h-5" />
                    <span>Proceed to Reservation</span>
                  </button>
                </Link>

                <div className="text-center mt-4 text-xs text-gray-500">
                  Instant confirmation & Verified host guarantee
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center font-bold text-gray-900">
                  <span>Base Total</span>
                  <span className="flex items-center text-rose-600">
                    <IndianRupee className="w-4 h-4 mr-0.5" />
                    {price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
