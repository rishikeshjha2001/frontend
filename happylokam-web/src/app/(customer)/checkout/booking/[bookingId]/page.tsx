"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckoutSummary } from '@/components/CheckoutSummary';
import { loadRazorpayScript } from '@/lib/razorpay';
import { authFetch } from '@/lib/auth-fetch';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await authFetch(`/api/v1/bookings/${bookingId}`);
      if (res.ok) {
        const json = await res.json();
        setBooking(json.booking || json.data || json);
      } else {
        alert("Booking not found");
        router.push('/');
      }
    } catch (error) {
      console.error(error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;
    setIsProcessing(true);
    
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      // 1. Create order on backend
      const orderRes = await authFetch('/api/v1/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: booking.totalAmount,
          currency: 'INR',
          receipt: `booking_${bookingId}`,
        }),
      });

      const orderData = await orderRes.json();
      const order = orderData.data || orderData;

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_51NgQ1P2jW4yq2';

      const options = {
        key: razorpayKey,
        amount: order.amount || Math.round(booking.totalAmount * 100),
        currency: order.currency || 'INR',
        name: 'happylokam Celebrations',
        description: `Booking #${booking.id?.slice(-6) || bookingId}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 2. Verify signature on backend
            const verifyRes = await authFetch('/api/v1/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || order.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking.id || bookingId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              alert('🎉 Payment confirmed! Your celebration booking is confirmed.');
              router.push('/dashboard/bookings');
            } else {
              alert(verifyData.error || 'Payment verification failed. Please contact support.');
            }
          } catch (verErr: any) {
            console.error('Verification error:', verErr);
            alert('Payment recorded. Checking confirmation status...');
            router.push('/dashboard/bookings');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: booking.user?.name || 'Valued Customer',
          email: booking.user?.email || 'customer@happylokam.com',
          contact: booking.user?.phone || '9876543210'
        },
        theme: {
          color: '#1e3a8a' // Royal Blue brand color
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error?.description || 'Transaction declined'}`);
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error('Payment process error:', err);
      alert(err.message || 'Unable to initiate payment.');
      setIsProcessing(false);
    }
  };

  if (loading || !booking) {
    return <div className="min-h-screen flex items-center justify-center">Loading checkout...</div>;
  }

  const bookingData = {
    venueName: booking.venue?.name || 'Grand Celebration Hall',
    date: new Date(booking.date).toLocaleDateString(),
    guests: booking.guests || 150,
    basePrice: booking.baseAmount || booking.totalAmount, // Assuming total amount is base for display
    platformFee: 0,
    tax: 0,
    discount: 0,
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Review your booking</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-medium text-gray-900">{bookingData.venueName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{bookingData.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium text-gray-900">{bookingData.guests}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="specialRequests"
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-3 border"
                  placeholder="Any specific dietary requirements, accessibility needs, or other requests..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CheckoutSummary 
                basePrice={bookingData.basePrice}
                platformFee={bookingData.platformFee}
                tax={bookingData.tax}
                discount={bookingData.discount}
                totalPayable={booking.totalAmount}
              />
              
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Pay Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
