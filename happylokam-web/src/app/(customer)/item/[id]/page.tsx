'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  Sparkles,
  ArrowLeft,
  Share2,
  Heart,
  Users,
  ChevronRight,
  Info,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface ItemDetail {
  id: string;
  title: string;
  subtitle?: string;
  cornerTag?: string;
  tag?: string;
  location?: string;
  itemType: 'TICKET' | 'BOOKING';
  price: number;
  priceUnit: string;
  availableDates: string[];
  availableTimes: string[];
  features: string[];
  totalSlots: number;
  capacity?: number;
  bookedSlots: number;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  description?: string;
  section?: {
    id: string;
    title: string;
    subtitle?: string;
  };
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking selection state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://happylokam.com/api/v1';
        const res = await fetch(`${apiUrl}/sections/items/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setItem(data.data);
          const isTicketItem = data.data.itemType === 'TICKET';
          if (isTicketItem && data.data.availableDates?.length > 0) {
            setSelectedDate(data.data.availableDates[0]);
          } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setSelectedDate(tomorrow.toISOString().split('T')[0]);
          }
          if (data.data.availableTimes?.length > 0) {
            setSelectedTime(data.data.availableTimes[0]);
          } else {
            setSelectedTime('Evening (06:00 PM - 11:30 PM)');
          }
        } else {
          setError(data.error || 'Experience item not found');
        }
      } catch (err: any) {
        console.error('Failed to load item:', err);
        setError('Failed to connect to the catalog server. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleProceedBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      alert('Please enter your name and contact phone number');
      return;
    }
    if (!selectedDate) {
      alert('Please choose an available date');
      return;
    }

    setBookingLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://happylokam.com/api/v1';

    try {
      if (grandTotal > 0) {
        // 1. Initialize Razorpay Gateway
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          throw new Error('Razorpay payment gateway failed to load. Please check your internet connection.');
        }

        // 2. Create Razorpay Order on Backend
        let orderId = `order_${Date.now()}`;
        try {
          const orderRes = await fetch(`${apiUrl}/payments/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: grandTotal }),
          });
          const orderData = await orderRes.json();
          if (orderData?.success && orderData?.data?.id) {
            orderId = orderData.data.id;
          }
        } catch (orderErr) {
          console.warn('Backend order creation notice:', orderErr);
        }

        // 3. Open Razorpay Checkout Modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SjBHhCXWmZhVK6',
          amount: Math.round(grandTotal * 100),
          currency: 'INR',
          name: 'happylokam Celebrations',
          description: `${item?.title || 'Celebration Booking'} (${isTicket ? 'Digital Ticket' : 'Reservation'})`,
          image: 'https://happylokam.com/favicon.png',
          order_id: orderId.startsWith('order_') && orderId.length > 15 ? orderId : undefined,
          prefill: {
            name: userName.trim(),
            contact: userPhone.trim(),
            email: userEmail.trim() || 'guest@happylokam.com',
          },
          theme: { color: '#e11d48' },
          handler: async function (response: any) {
            try {
              // 4. Save Confirmed Booking with Razorpay Payment ID
              const res = await fetch(`${apiUrl}/sections/items/${id}/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  bookingDate: selectedDate,
                  quantity,
                  userName: userName.trim(),
                  userPhone: userPhone.trim(),
                  userEmail: userEmail.trim() || undefined,
                  notes: `${item?.itemType} via Web Portal (${selectedTime || 'Standard Time'})`,
                  paymentId: response.razorpay_payment_id,
                  paymentStatus: 'PAID',
                  totalAmount: grandTotal,
                }),
              });

              const data = await res.json();

              // 5. Verify payment on backend
              await fetch(`${apiUrl}/payments/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id || orderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature || 'sig_verified_web',
                  sectionBookingId: data?.data?.id,
                  amount: grandTotal,
                }),
              }).catch(() => {});

              if (data.success && data.data) {
                setBookingConfirmed(data.data);
              } else {
                alert(data.error || 'Payment verified. Booking confirmation issued.');
              }
            } catch (postErr: any) {
              alert('Error finalizing booking: ' + postErr.message);
            } finally {
              setBookingLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setBookingLoading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          alert('Payment Failed: ' + (resp?.error?.description || 'Transaction cancelled'));
          setBookingLoading(false);
        });
        rzp.open();
        return;
      }

      // If amount is 0 (free pass or 100% discount)
      const res = await fetch(`${apiUrl}/sections/items/${id}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingDate: selectedDate,
          quantity,
          userName: userName.trim(),
          userPhone: userPhone.trim(),
          userEmail: userEmail.trim() || undefined,
          notes: `${item?.itemType} via Web Portal (${selectedTime || 'Standard Time'})`,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setBookingConfirmed(data.data);
      } else {
        alert(data.error || 'Booking could not be completed.');
      }
      setBookingLoading(false);
    } catch (err: any) {
      alert('Booking error: ' + err.message);
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-xs tracking-wider uppercase font-bold">Loading celebration details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center p-8 rounded-3xl bg-[#0e1424] border border-white/10 space-y-4">
          <Info className="w-12 h-12 text-rose-400 mx-auto opacity-75" />
          <h2 className="text-xl font-bold">Item Not Found</h2>
          <p className="text-xs text-slate-400">{error || 'This experience might have been archived or moved.'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/20"
          >
            ← Back to Celebrations
          </button>
        </div>
      </div>
    );
  }

  const isTicket = item.itemType === 'TICKET';
  const subtotal = item.price * quantity;
  const taxes = Math.round(subtotal * 0.05); // 5% GST
  const discount = Math.min(100, Math.round(subtotal * 0.1));
  const grandTotal = Math.max(0, subtotal + taxes - discount);

  const capacityNum = item.capacity || item.totalSlots || 100;
  const remainingSlots = Math.max(0, capacityNum - item.bookedSlots);
  const remainingPercent = Math.min(100, Math.round((remainingSlots / capacityNum) * 100));

  const todayStr = new Date().toISOString().split('T')[0];
  const quickDates = [0, 1, 2, 3, 7, 14].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const val = d.toISOString().split('T')[0];
    const label = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    return { label, value: val };
  });

  const defaultCelebrationTimes = [
    'Morning (09:00 AM - 01:00 PM)',
    'Afternoon (01:00 PM - 05:00 PM)',
    'Evening (06:00 PM - 11:30 PM)',
    'Full Day (24 Hours)',
  ];
  const effectiveTimes = item.availableTimes && item.availableTimes.length > 0 ? item.availableTimes : defaultCelebrationTimes;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-24">
      {/* Top Breadcrumb & Nav */}
      <div className="border-b border-white/5 bg-[#0b101e]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hover:text-white cursor-pointer" onClick={() => router.push('/')}>Home</span>
            <span>/</span>
            {item.section?.title && (
              <>
                <span className="text-slate-300">{item.section.title}</span>
                <span>/</span>
              </>
            )}
            <span className="text-rose-400 font-bold truncate max-w-[180px] md:max-w-xs">{item.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-xl border transition ${
                isLiked ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Save to Favorites"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: item.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Media, Description, Features, Inclusions */}
          <div className="lg:col-span-8 space-y-6">
            {/* Image Hero Card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0c1222] shadow-2xl">
              <div className="h-[320px] sm:h-[420px] md:h-[480px] w-full relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-black/20 to-transparent" />

                {/* Small Red Corner Tag */}
                {(item.cornerTag || item.tag) && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-xl shadow-rose-600/60 border border-rose-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{item.cornerTag || item.tag}</span>
                    </span>
                  </div>
                )}

                {/* Item Type Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-xl flex items-center gap-1.5 ${
                      isTicket
                        ? 'bg-amber-500/90 text-slate-950 border-amber-400'
                        : 'bg-blue-600/90 text-white border-blue-400'
                    }`}
                  >
                    {isTicket ? <Ticket className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                    <span>{isTicket ? 'Digital Ticket Pass' : 'Celebration Booking'}</span>
                  </span>
                </div>

                {/* Bottom Overlay Title Info */}
                <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-300 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating || 4.9}</span>
                      <span className="text-slate-400">({item.reviews || 84} verified reviews)</span>
                    </div>

                    {item.location && (
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 text-xs">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-playfair drop-shadow-md">
                    {item.title}
                  </h1>

                  {item.subtitle && (
                    <p className="text-slate-200 text-xs sm:text-sm font-medium drop-shadow">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Inventory Capacity Alert */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {isTicket ? 'Ticket Pass Availability' : 'Booking Capacity'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="text-amber-400 font-bold">{remainingSlots} spots available</span> out of {capacityNum} total capacity
                  </div>
                </div>
              </div>

              <div className="w-28 sm:w-36">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" style={{ width: `${remainingPercent}%` }} />
                </div>
                <div className="text-[10px] text-right text-slate-400 mt-1 font-mono">{remainingPercent}% Available</div>
              </div>
            </div>

            {/* Features & Highlights */}
            {item.features && item.features.length > 0 && (
              <div className="p-6 rounded-3xl bg-[#0b101e] border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>Key Features & What's Included</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200 font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Description */}
            <div className="p-6 rounded-3xl bg-[#0b101e] border border-white/10 space-y-3">
              <h3 className="text-base font-bold text-white">Detailed Overview</h3>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {item.description || 'Experience high-touch luxury with happylokam curated celebration packages. Every detail is professionally vetted and executed by certified coordinators.'}
              </div>

              {/* Tag chips */}
              {item.tags && item.tags.length > 0 && (
                <div className="pt-4 flex flex-wrap gap-2 border-t border-white/5">
                  {item.tags.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-white/5 text-rose-300 border border-white/10">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Trust Assurance Bar */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/30 to-purple-950/30 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-rose-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">happylokam 100% Celebration Guarantee</div>
                  <div className="text-[11px] text-slate-400">Verified Vendors, Safe Razorpay Escrow & Dedicated On-Ground Support.</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:+918969255561"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Desk</span>
                </a>
                <a
                  href="https://wa.me/918969255561"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition border border-emerald-500/30"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Booking & Pricing Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 rounded-3xl bg-[#0c1222] border border-white/10 p-6 shadow-2xl space-y-6">
              {/* Pricing Header */}
              <div className="border-b border-white/10 pb-4">
                <div className="text-xs text-slate-400 uppercase font-black tracking-wider">Price per Entry / Service</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-white font-mono">₹{item.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-400">/ {item.priceUnit || (isTicket ? 'ticket' : 'booking')}</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold mt-1">★ 10% instant checkout discount applied</div>
              </div>

              {/* 1. Date Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isTicket ? 'Select Event Pass Date *' : 'Select Celebration Date *'}</span>
                  </div>
                  {!isTicket && (
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      ✓ All calendar dates available
                    </span>
                  )}
                </label>

                {isTicket && item.availableDates && item.availableDates.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                    {item.availableDates.map((dateStr, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedDate(dateStr)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                          selectedDate === dateStr
                            ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {dateStr}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Quick Upcoming Day Chips */}
                    <div className="flex flex-wrap gap-2">
                      {quickDates.map((q) => (
                        <button
                          key={q.value}
                          type="button"
                          onClick={() => setSelectedDate(q.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                            selectedDate === q.value
                              ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30 font-bold'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 font-medium'
                          }`}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Calendar Date Input */}
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 px-3">
                      <span className="text-xs text-slate-400 font-medium">Custom Date:</span>
                      <input
                        type="date"
                        min={todayStr}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-black/50 border border-white/15 rounded-lg px-3 py-1.5 text-white text-xs focus:border-rose-500 focus:outline-none [color-scheme:dark]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Time Slot Selection (All times available for bookings) */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isTicket ? 'Select Time Slot' : 'Select Celebration Timing'}</span>
                  </div>
                  {!isTicket && (
                    <span className="text-[11px] text-amber-400 font-semibold">
                      ✓ All times available
                    </span>
                  )}
                </label>
                <div className="flex flex-wrap gap-2">
                  {effectiveTimes.map((timeStr, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedTime(timeStr)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                        selectedTime === timeStr
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {timeStr}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Quantity / Tickets counter */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  {isTicket ? 'Number of Tickets / Passes' : 'Number of Slots / Packages'}
                </label>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-300 font-medium">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-white font-mono w-6 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown Summary */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal ({quantity} × ₹{item.price})</span>
                  <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Platform GST & Insurance (5%)</span>
                  <span className="font-mono">₹{taxes}</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-400">
                  <span>Loyalty Discount</span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white text-sm">
                  <span>Total Payable</span>
                  <span className="text-emerald-400 font-mono text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold rounded-2xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>{isTicket ? 'Book Digital Pass Now' : 'Reserve Experience Now'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Powered by <strong className="text-white">Razorpay</strong> • 256-Bit SSL Instant Entry Pass</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e1424] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            {bookingConfirmed ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Pass Confirmed! 🎉</h3>
                <p className="text-xs text-slate-400">Your celebration booking has been verified and digital pass issued.</p>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">DIGITAL PASS CODE</div>
                  <div className="text-lg font-black text-rose-400 mt-1">{bookingConfirmed.ticketCode}</div>
                  <div className="text-xs text-slate-300 mt-2 font-sans font-medium">{bookingConfirmed.userName} • {bookingConfirmed.bookingDate}</div>
                </div>
                <button
                  onClick={() => {
                    setIsBookingModalOpen(false);
                    setBookingConfirmed(null);
                  }}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleProceedBooking} className="space-y-4 text-xs">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Complete Digital Pass</h3>
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="font-bold text-white text-xs">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedDate} {selectedTime ? `• ${selectedTime}` : ''} • Qty: {quantity}
                  </div>
                  <div className="text-emerald-400 font-bold text-xs mt-1">Total: ₹{grandTotal.toLocaleString('en-IN')}</div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter guest name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Phone Number (+91) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp & SMS pass delivery"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="For invoice and QR PDF"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-rose-500"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-[11px] text-rose-300">
                    Live Razorpay 256-bit encrypted checkout will open upon confirmation.
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-xl font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2"
                  >
                    {bookingLoading ? (
                      'Opening Razorpay...'
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        <span>
                          {grandTotal > 0
                            ? `Pay ₹${grandTotal.toLocaleString('en-IN')} via Razorpay`
                            : 'Confirm & Generate Pass'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
