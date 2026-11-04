'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Star, Ticket, Minus, Plus, ArrowLeft, 
  Flame, ShieldCheck, Music, Sparkles, CheckCircle2, 
  Clock, Share2, Compass, Award, ExternalLink, Zap,
  Info, Tag, ChevronDown, Heart, Phone
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api-client';

interface EventData {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description?: string;
  imageUrl?: string;
  price: number;
  totalTickets: number;
  ticketsSold: number;
  ticketsLeft: number;
  features?: string[];
  status?: string;
}

export default function DandiyaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedTier, setSelectedTier] = useState<string>('SINGLE');
  const [booking, setBooking] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [contactPhone, setContactPhone] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showMobileBreakdown, setShowMobileBreakdown] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedPhone = (user as any)?.phone || (typeof window !== 'undefined' ? (localStorage.getItem('user_phone') || localStorage.getItem('phone')) : '') || '';
    if (savedPhone) setContactPhone(savedPhone);
  }, [user]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res: any = await apiClient.get(`/events/${id}`);
        if (!res || !res.data) throw new Error('Event not found');
        setEvent(res.data);
      } catch (err: any) {
        toast.error('Event details could not be retrieved');
        router.push('/dandiya');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id, router]);

  // Pricing calculation based strictly on admin-uploaded base price & tiers
  const basePrice = event?.price || 0;
  const eventTiers = (event as any)?.ticketTiers || {};
  
  const tiers: Record<string, { name: string; price: number; tag: string; desc: string; perks: string[] }> = useMemo(() => {
    const singlePrice = eventTiers.single || Math.max(basePrice, 1);
    const couplePrice = eventTiers.couple || Math.round(basePrice * 1.8);
    const family4Price = eventTiers.family4 || Math.round(basePrice * 3.4);
    const family6Price = eventTiers.family6 || Math.round(basePrice * 4.8);
    const group5Price = eventTiers.group5 || Math.round(basePrice * 4.2);
    const childPrice = eventTiers.child || Math.round(basePrice * 0.5);

    return {
      SINGLE: {
        name: 'Single Pass',
        price: Math.max(singlePrice, 1),
        tag: '1 Adult Entry',
        desc: `Official individual admission pass for ${event?.title || 'Celebration'}.`,
        perks: event?.features && event?.features.length > 0 
          ? event.features 
          : ['100% Verified Entry', 'Full Access to Event Arena', 'Instant QR Pass']
      },
      COUPLE: {
        name: 'Couple Pass',
        price: Math.max(couplePrice, 1),
        tag: '2 People (Pair)',
        desc: `Entry pass for 2 guests to ${event?.title || 'Celebration'}.`,
        perks: ['Dual Priority Entry', 'Access to Couple Dance Arena', 'Complimentary Dandiya Sticks']
      },
      FAMILY_4: {
        name: 'Family Pass (4 Pax)',
        price: Math.max(family4Price, 1),
        tag: 'Family (4 People)',
        desc: `Family celebration pass for 4 members with reserved zones.`,
        perks: ['Reserved Family Zone', 'Free Entry for Kids under 5', 'Complimentary Refreshments']
      },
      FAMILY_6: {
        name: 'Family Pass (6 Pax)',
        price: Math.max(family6Price, 1),
        tag: 'Family (6 People)',
        desc: `Grand package for large families and joint gatherings (6 persons).`,
        perks: ['Dedicated Lounge Seating', 'Free Dandiya Sticks for All', 'Snack Platter Included']
      },
      GROUP_5: {
        name: 'Group Pass (5 Adults)',
        price: Math.max(group5Price, 1),
        tag: 'Group (5 Adults)',
        desc: `Friends and colleagues group celebration package for 5 adults.`,
        perks: ['Fast-track VIP Turnstile', 'Exclusive Group Photo Spot', 'Beverage Coupons']
      },
      CHILD: {
        name: 'Child Pass',
        price: Math.max(childPrice, 1),
        tag: 'Kids / Child',
        desc: `Admission pass for children aged 5-12 years.`,
        perks: ['Safe Kids Play Area Access', 'Free Glow Bands', 'Sweet Treats Box']
      }
    };
  }, [basePrice, event?.title, event?.features, eventTiers]);

  const activeTierConfig = tiers[selectedTier] || tiers.SINGLE;
  const currentTierPrice = activeTierConfig.price;
  const subtotal = currentTierPrice * ticketCount;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const discountedSubtotal = subtotal - discountAmount;

  // 1. 2% Transaction / Payment gateway charge on every transaction
  const transactionFee = Number((discountedSubtotal * 0.02).toFixed(2));

  // 2. 18% GST on the 2% transaction charge
  const feeGst = Number((transactionFee * 0.18).toFixed(2));

  // 3. 18% GST on whole celebration section if order exceeds ₹500
  const eventGst = discountedSubtotal > 500 ? Number((discountedSubtotal * 0.18).toFixed(2)) : 0;

  // Total payable amount (strictly no other charges added)
  const finalAmount = Math.max(1, Math.round(discountedSubtotal + transactionFee + feeGst + eventGst));

  const handleApplyPromo = () => {
    const cleaned = promoCode.trim().toUpperCase();
    if (cleaned === 'NAVRATRI2026' || cleaned === 'HAPPYDANDIYA') {
      setDiscountPercent(15);
      setPromoApplied(true);
      toast.success('Promo Code Applied! 15% Festive Discount applied.');
    } else if (cleaned === 'Premium50') {
      setDiscountPercent(10);
      setPromoApplied(true);
      toast.success('Premium Promo Applied! 10% Discount applied.');
    } else {
      toast.error('Invalid promo code. Try NAVRATRI2026');
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    try {
      setBooking(true);
      if (!isAuthenticated) {
        toast.info('Please log in or sign up to secure your Premium passes');
        router.push(`/login?redirect=/dandiya/${id}`);
        return;
      }
      
      if (!event) return;

      // Extract and format mobile number smoothly without blocking the user
      let phoneToUse = contactPhone.replace(/\D/g, '');
      if (!phoneToUse && (user as any)?.phone) {
        phoneToUse = String((user as any).phone).replace(/\D/g, '');
      }
      if (!phoneToUse && typeof window !== 'undefined') {
        phoneToUse = (localStorage.getItem('user_phone') || localStorage.getItem('phone') || '').replace(/\D/g, '');
      }
      if (!phoneToUse || phoneToUse.length < 10) {
        // Fallback default so user is never blocked and Razorpay does not prompt
        phoneToUse = '9876543210';
      }

      if (phoneToUse && phoneToUse !== '9876543210') {
        localStorage.setItem('user_phone', phoneToUse);
      }

      const resLoaded = await loadRazorpay();
      if (!resLoaded) {
        toast.error('Failed to initialize secure payment gateway. Please check your connection.');
        return;
      }

      // Create order with live backend
      const orderRes: any = await apiClient.post('/payments/create-order', { 
        amount: finalAmount 
      });

      if (!orderRes || !orderRes.success) {
        throw new Error(orderRes?.error || 'Failed to initialize payment order');
      }

      const orderData = orderRes.data;

      // Prefill contact details so Razorpay skips the manual contact prompt
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SjBHhCXWmZhVK6',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'happylokam Celebrations',
        description: `${ticketCount}x ${activeTierConfig.name} - ${event.title}`,
        order_id: orderData.id,
        prefill: {
          name: user?.name || 'Celebration Guest',
          email: user?.email || 'guest@happylokam.com',
          contact: phoneToUse,
        },
        handler: async function (response: any) {
          try {
            const referralCodeUsed = localStorage.getItem('referralCode') || undefined;
            const bookRes: any = await apiClient.post('/events/book', {
              eventId: id,
              ticketsCount: ticketCount,
              tierType: selectedTier.toLowerCase(),
              tierName: activeTierConfig.name,
              paymentId: response.razorpay_payment_id,
              referralCodeUsed
            });

            if (!bookRes || !bookRes.success) {
              throw new Error(bookRes?.error || 'Booking verification failed');
            }

            toast.success('🎉 Tickets confirmed! QR passes generated.');
            router.push(`/dandiya/${id}/success`);
          } catch (err: any) {
            toast.error(err.message || 'Payment verification failed. Our team will assist you.');
          }
        },
        theme: { color: '#f59e0b' }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Join me at ${event?.title} on happylokam!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06070a] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
        <p className="text-amber-400 font-medium text-xs tracking-widest uppercase">Loading Premium Experience...</p>
      </div>
    );
  }

  if (!event) return null;

  const ticketsLeft = event.totalTickets - event.ticketsSold;
  const isSellingFast = ticketsLeft > 0 && ticketsLeft <= 50;
  const isSoldOut = ticketsLeft <= 0 && event.totalTickets > 0;

  return (
    <div className="min-h-screen bg-[#06070a] text-white selection:bg-amber-500 selection:text-black pt-16 pb-36 lg:pb-24 relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-10 left-1/3 w-[650px] h-[650px] bg-amber-500/10 blur-[180px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 w-[550px] h-[550px] bg-rose-600/10 blur-[170px] rounded-full pointer-events-none -z-10" />

      {/* TOP NAVIGATION / BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/dandiya">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:border-amber-500/40 transition-all">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Events
          </button>
        </Link>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" /> Share Event
        </button>
      </div>

      {/* HERO BANNER SECTION (100% Mobile Responsive) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="relative isolate rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[460px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-end p-5 sm:p-8 bg-zinc-950">
          <img
            src={event.imageUrl && event.imageUrl.trim().length > 10 ? event.imageUrl : 'https://images.unsplash.com/photo-1605808360022-d8f1618684cb?q=80&w=1600'}
            alt={event.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1605808360022-d8f1618684cb?q=80&w=1600';
            }}
            className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-all duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#06070a]/60 to-black/25 z-[1] pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-center justify-between gap-2 z-[2] pointer-events-none">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-extrabold text-[11px] sm:text-xs tracking-wider uppercase shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {event.category || 'Dandiya Mahotsav'}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-emerald-400 font-bold text-[11px] sm:text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Entry
              </span>
            </div>

            {isSellingFast && (
              <div className="px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider animate-pulse flex items-center gap-1.5 shadow-[0_0_20px_rgba(225,29,72,0.6)]">
                <Flame className="w-3.5 h-3.5" /> Only {ticketsLeft} Passes Left
              </div>
            )}
          </div>

          {/* Title & Metadata Over Banner Bottom */}
          <div className="relative z-[2] pt-16 sm:pt-0">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-3 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {mounted && event.date ? (
                    new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                  ) : (
                    event.date ? event.date.slice(0, 10) : ''
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {mounted && event.date ? (
                    new Date(event.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' Onwards'
                  ) : 'Evening'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* LEFT CONTENT COLUMN (7 COLS) */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10">

            {/* STEP 1: SELECT PASS TIER */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Step 1</span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Choose Your Pass Tier</h2>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">100% Genuine happylokam Support Verified</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {Object.keys(tiers).map((tierKey) => {
                  const t = tiers[tierKey];
                  const isSelected = selectedTier === tierKey;

                  return (
                    <div
                      key={tierKey}
                      onClick={() => setSelectedTier(tierKey)}
                      className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                          : 'bg-zinc-950/60 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base sm:text-lg font-extrabold text-white">{t.name}</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-amber-300 uppercase">
                              {t.tag}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{t.desc}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-2xl font-black text-amber-400">₹{t.price}</span>
                          <span className="block text-[10px] text-zinc-500">per pass</span>
                        </div>
                      </div>

                      {/* Tier Perks */}
                      <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                        {t.perks.map((perk, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="line-clamp-1">{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ABOUT EVENT SECTION */}
            <div className="rounded-3xl bg-zinc-950/60 border border-white/10 p-5 sm:p-8 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> About The Celebration
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-light">
                {event.description || `Welcome to ${event.title}! Celebrate this auspicious celebration with authentic festivities, live music, verified security, and a vibrant community atmosphere.`}
              </p>
            </div>

            {/* WHAT'S INCLUDED / PERKS */}
            {event.features && event.features.length > 0 && (
              <div className="rounded-3xl bg-zinc-950/60 border border-white/10 p-5 sm:p-8 space-y-5">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-rose-500" /> What&apos;s Included In Your Pass
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3 text-xs sm:text-sm text-zinc-200"
                    >
                      <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OFFICIAL EVENT POSTER & FLYER */}
            <div className="rounded-3xl bg-zinc-950/60 border border-white/10 p-5 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> Event Visuals & Poster
                </h2>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase">
                  Official Media
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[16/9] sm:aspect-[21/9]">
                <img
                  src={event.imageUrl && event.imageUrl.trim().length > 10 ? event.imageUrl : 'https://images.unsplash.com/photo-1605808360022-d8f1618684cb?q=80&w=1600'}
                  alt={`${event.title} Poster`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1605808360022-d8f1618684cb?q=80&w=1600';
                  }}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* VENUE & LOCATION CARD */}
            <div className="rounded-3xl bg-zinc-950/60 border border-white/10 p-5 sm:p-8 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" /> Venue & Directions
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 font-medium">{event.location}</p>
              
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-amber-300 hover:bg-white/10 transition-all"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* RIGHT CHECKOUT SIDEBAR COLUMN (5 COLS - Desktop view) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">

              {/* CHECKOUT WIDGET */}
              <div className="rounded-3xl bg-zinc-950/90 backdrop-blur-2xl border border-amber-500/30 p-5 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-5">
                
                {/* Header info */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Selected Tier</span>
                    <h3 className="text-lg sm:text-xl font-black text-white">{tiers[selectedTier].name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400">₹{currentTierPrice}</span>
                    <span className="block text-[10px] text-zinc-400">each</span>
                  </div>
                </div>

                {/* TICKET COUNT STEPPER */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-300">Number of Passes</span>
                    <span className="text-amber-400">{ticketsLeft} passes available</span>
                  </div>

                  <div className="flex items-center justify-between bg-black/60 rounded-2xl border border-white/10 p-2">
                    <button
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                      disabled={ticketCount <= 1}
                      className="w-12 h-12 rounded-xl bg-white/5 hover:bg-amber-500/20 disabled:opacity-30 disabled:hover:bg-white/5 flex items-center justify-center text-white transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-black text-white">{ticketCount}</span>
                    <button
                      onClick={() => setTicketCount(Math.min(ticketsLeft > 0 ? ticketsLeft : 10, ticketCount + 1))}
                      disabled={ticketCount >= ticketsLeft}
                      className="w-12 h-12 rounded-xl bg-white/5 hover:bg-amber-500/20 disabled:opacity-30 disabled:hover:bg-white/5 flex items-center justify-center text-white transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* CONTACT MOBILE NUMBER (Auto-prefills in Razorpay to eliminate contact prompt) */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" /> Mobile Number for WhatsApp Pass
                  </label>
                  <div className="flex items-center bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-amber-500">
                    <span className="text-xs font-bold text-zinc-400 mr-2 border-r border-white/10 pr-2">🇮🇳 +91</span>
                    <input
                      id="contact-phone-input"
                      type="tel"
                      placeholder="Enter 10-digit mobile"
                      maxLength={10}
                      value={contactPhone}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setContactPhone(clean);
                        if (clean.length === 10) localStorage.setItem('user_phone', clean);
                      }}
                      className="w-full bg-transparent text-xs text-white placeholder:text-zinc-600 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">QR entry passes and Razorpay invoice will be sent directly to this number.</p>
                </div>

                {/* PROMO CODE INPUT */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" /> Have a Festive Promo Code?
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. NAVRATRI2026"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 uppercase"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoApplied || !promoCode.trim()}
                      className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-amber-500 hover:text-black disabled:opacity-40 transition-all"
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {discountPercent}% Festival Discount Applied!
                    </p>
                  )}
                </div>

                {/* PRICE BREAKDOWN TABLE */}
                <div className="space-y-2.5 text-xs text-zinc-400 pt-4 border-t border-white/10">
                  <div className="flex justify-between">
                    <span>Base Passes ({ticketCount}x ₹{currentTierPrice})</span>
                    <span className="text-white font-medium">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Festive Discount ({discountPercent}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Payment Processing Charge (2%)</span>
                    <span className="text-white font-medium">₹{transactionFee}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST on Transaction Charge (18%)</span>
                    <span className="text-white font-medium">₹{feeGst}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Celebration GST (18% on orders &gt; ₹500)</span>
                    <span className="text-white font-medium">{eventGst > 0 ? `₹${eventGst}` : '₹0 (Exempt under ₹500)'}</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-white pt-3 border-t border-white/10">
                    <span>Total Amount</span>
                    <span className="text-amber-400 text-xl font-extrabold">₹{finalAmount}</span>
                  </div>
                </div>

                {/* PRIMARY CHECKOUT BUTTON */}
                <button
                  onClick={handleBooking}
                  disabled={isSoldOut || booking}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] ${
                    isSoldOut
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-black hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {booking ? 'Securing Premium Pass...' : isSoldOut ? 'Sold Out' : `Pay ₹${finalAmount} & Get QR Pass`}
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 text-center">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant QR Pass
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-rose-400" /> Verified Host
                  </span>
                </div>
              </div>

              {/* HELPLINE & CONCIERGE ASSISTANCE */}
              <div className="rounded-2xl bg-zinc-950/40 border border-white/5 p-4 text-xs text-zinc-400 space-y-1">
                <p className="font-semibold text-white">Need Table or Bulk Booking Assistance?</p>
                <p>Call our 24/7 Navratri Concierge at <strong className="text-amber-400">+91 91234 56789</strong> or email support@happylokam.com</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT DRAWER (FITTS'S LAW - THUMB REACH) */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/98 backdrop-blur-2xl border-t border-amber-500/30 lg:hidden z-50 shadow-[0_-10px_35px_rgba(0,0,0,0.9)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* Quick collapsible breakdown for mobile */}
        {showMobileBreakdown && (
          <div className="p-4 bg-zinc-900/95 border-b border-white/10 space-y-2 text-xs text-zinc-300 animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="font-bold text-white">Price Breakdown ({ticketCount} Passes)</span>
              <button onClick={() => setShowMobileBreakdown(false)} className="text-zinc-400 text-xs hover:text-white">✕ Close</button>
            </div>
            <div className="flex justify-between">
              <span>Passes ({ticketCount}x ₹{currentTierPrice})</span>
              <span>₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Festive Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Payment Processing Fee (+2%)</span>
              <span>₹{transactionFee}</span>
            </div>
            <div className="flex justify-between">
              <span>GST on 2% Fee (18%)</span>
              <span>₹{feeGst}</span>
            </div>
            <div className="flex justify-between">
              <span>Event GST (18% &gt; ₹500)</span>
              <span>{eventGst > 0 ? `₹${eventGst}` : '₹0 (Exempt under ₹500)'}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 gap-3">
          {/* Left: Price and Details Toggle */}
          <div className="shrink-0 cursor-pointer" onClick={() => setShowMobileBreakdown(!showMobileBreakdown)}>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-amber-400">₹{finalAmount}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${showMobileBreakdown ? 'rotate-180' : ''}`} />
            </div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
              {ticketCount} {ticketCount > 1 ? 'Passes' : 'Pass'} • <span className="text-amber-400 underline">Details</span>
            </span>
          </div>

          {/* Stepper on mobile right near thumb */}
          <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1 shrink-0">
            <button
              onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
              disabled={ticketCount <= 1}
              className="w-8 h-8 rounded-lg bg-white/10 active:bg-amber-500/30 disabled:opacity-30 flex items-center justify-center text-white"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-black text-sm text-white">{ticketCount}</span>
            <button
              onClick={() => setTicketCount(Math.min(ticketsLeft > 0 ? ticketsLeft : 10, ticketCount + 1))}
              disabled={ticketCount >= ticketsLeft}
              className="w-8 h-8 rounded-lg bg-white/10 active:bg-amber-500/30 disabled:opacity-30 flex items-center justify-center text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Big Thumb-Friendly Book Now Button */}
          <button
            onClick={handleBooking}
            disabled={isSoldOut || booking}
            className={`flex-1 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-1.5 ${
              isSoldOut
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-black active:scale-95'
            }`}
          >
            {booking ? 'Securing...' : isSoldOut ? 'Sold Out' : (
              <>
                <span>Book Now</span>
                <span className="text-[10px] opacity-80">• ₹{finalAmount}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
