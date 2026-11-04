"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { loadRazorpayScript } from '@/lib/razorpay';
import { Loader2, ShieldCheck, Tag, Sparkles, IndianRupee, MapPin } from 'lucide-react';

export default function CheckoutPage({ params }: { params: { listingId: string } }) {
  const [listing, setListing] = useState<any>(null);
  const [loadingListing, setLoadingListing] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    specialRequests: ''
  });

  const [referralInput, setReferralInput] = useState('');
  const [appliedReferral, setAppliedReferral] = useState<any>(null);
  const [validatingReferral, setValidatingReferral] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Fetch real listing data from database
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoadingListing(true);
        const res = await fetch(`/api/v1/listings/${params.listingId}`);
        if (!res.ok) throw new Error('Failed to load listing');
        const data = await res.json();
        if (data.success && data.data) {
          setListing(data.data);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
      } finally {
        setLoadingListing(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const basePrice = listing ? (typeof listing.price === 'number' ? listing.price : (listing.pricing || 5000)) : 5000;
  const platformFee = Math.round(basePrice * 0.05);
  const taxAmount = Math.round(basePrice * 0.18);
  const discountAmount = appliedReferral ? 100 : 0;
  const total = Math.max(1, basePrice + platformFee + taxAmount - discountAmount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyReferral = async () => {
    const code = referralInput.trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a referral code.');
      return;
    }

    try {
      setValidatingReferral(true);
      const res = await fetch(`/api/v1/referrals/validate/${code}`);
      const data = await res.json();

      if (res.ok && data.valid) {
        setAppliedReferral(data);
        toast.success(data.message || '🎉 ₹100 Referral discount applied!');
      } else {
        toast.error(data.error || 'Invalid referral code.');
      }
    } catch (err: any) {
      toast.error('Could not validate referral code.');
    } finally {
      setValidatingReferral(false);
    }
  };

  const handlePayment = async () => {
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error('Please enter your full name, email, and phone number.');
      return;
    }

    try {
      setProcessing(true);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load secure Razorpay gateway. Please check your connection.');
        return;
      }

      // 1. Create order on live backend
      const res = await fetch('/api/v1/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: total }),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SjBHhCXWmZhVK6',
        amount: orderData.data.amount,
        currency: 'INR',
        name: 'happylokam Celebrations',
        description: `Booking for ${listing?.title || 'Celebration Venue'}`,
        order_id: orderData.data.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        handler: async function (response: any) {
          try {
            // 2. Persist real booking into Database
            const bookingRes = await fetch('/api/v1/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                venueId: listing?.id || params.listingId,
                partnerId: listing?.partnerId,
                date: formData.date,
                totalAmount: total,
                referralCode: appliedReferral ? appliedReferral.code : null,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id
              })
            });

            const bookingData = await bookingRes.json();
            if (bookingRes.ok && bookingData.success) {
              toast.success('🎉 Booking confirmed! Digital pass issued.');
            } else {
              toast.success('Payment captured! Your booking is being processed.');
            }
          } catch (bErr) {
            console.error('Booking creation error:', bErr);
          }

          window.location.href = `/profile`;
        },
        theme: { color: '#e11d48' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (loadingListing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600 mb-4" />
        <p className="text-gray-500 font-medium">Preparing secure checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-slate-50/50 min-h-screen">
      <Link href={`/listings/${params.listingId}`} className="text-rose-600 hover:text-rose-700 font-medium mb-8 inline-flex items-center gap-1">
        &larr; Back to Listing
      </Link>
      
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Confirm Your Celebration Booking</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Guest & Event Details */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Guest Information</h2>
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="e.g. Rahul"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="e.g. Kumar"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="name@example.com"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="9876543210"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Event Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Special Requirements (Optional)</label>
              <textarea 
                name="specialRequests"
                rows={3}
                value={formData.specialRequests}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="Seating arrangements, dietary notes, decorations..."
              />
            </div>
          </form>

          {/* Referral Code Box */}
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-rose-600" /> Have a Referral or Promo Code?
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                placeholder="e.g. LOKAM-CELE-99"
                className="flex-1 border border-gray-200 rounded-xl p-3 text-sm uppercase focus:ring-2 focus:ring-rose-500 outline-none"
              />
              <button
                type="button"
                onClick={handleApplyReferral}
                disabled={validatingReferral}
                className="px-5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {validatingReferral ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
              </button>
            </div>
            {appliedReferral && (
              <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Code {appliedReferral.code} applied: ₹100 discount activated!
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div>
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Reservation Summary</h2>
            
            <div className="flex gap-4 items-center">
              <img 
                src={listing?.images?.[0] || '/og-image.jpg'} 
                alt={listing?.title || 'Venue'} 
                className="w-20 h-20 object-cover rounded-xl shrink-0 bg-gray-100"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-lg leading-snug">{listing?.title || 'happylokam Venue'}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" /> {listing?.city || 'Patna'}
                </p>
                <p className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block font-semibold mt-1">
                  Date: {new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <hr className="border-gray-100" />
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Base Venue/Service Price</span>
                <span className="font-semibold text-gray-900">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Concierge Fee (5%)</span>
                <span className="font-semibold text-gray-900">₹{platformFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Applicable GST (18%)</span>
                <span className="font-semibold text-gray-900">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              {appliedReferral && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Referral Pass Discount</span>
                  <span>-₹100</span>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            <div className="flex justify-between items-center text-lg font-extrabold text-gray-900">
              <span>Total Payable</span>
              <span className="text-2xl text-rose-600 flex items-center">
                <IndianRupee className="w-5 h-5 mr-0.5" />
                {total.toLocaleString('en-IN')}
              </span>
            </div>

            <button 
              onClick={handlePayment}
              disabled={processing}
              className="w-full py-4 rounded-xl font-bold text-white text-base bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Securing Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Pay ₹{total.toLocaleString('en-IN')} & Confirm</span>
                </>
              )}
            </button>

            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>🔒 256-bit SSL encrypted payment with Razorpay</p>
              <p>Instant confirmation receipt & SMS alert sent upon booking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
