'use client';

import { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { loadRazorpayScript } from '@/lib/razorpay';

export default function PartnerSubscription() {
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<any>(null);
  const [subscribing, setSubscribing] = useState(false);

  const fetchProfile = async () => {
    try {
      // First try partner me endpoint
      let res = await fetch('/api/v1/partners/me', { credentials: 'include' });
      if (!res.ok) {
        res = await fetch('/api/v1/auth/me', { credentials: 'include' });
      }
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setPartner(data.partner || data.user || data.data);
    } catch (err) {
      toast.error('Failed to load partner profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Razorpay gateway failed to load. Please check your internet connection.');
        return;
      }

      // Call dedicated partner server charge endpoint
      const res = await fetch('/api/v1/partners/pay-server-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to initialize subscription order');
      }

      // If fee was waived by admin, account is activated for free immediately
      if (resData.isFreeOnboarding) {
        toast.success(resData.message || 'Partner subscription activated successfully!');
        await fetchProfile();
        return;
      }

      const orderData = resData.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SjBHhCXWmZhVK6',
        amount: orderData.amountPaise,
        currency: 'INR',
        name: 'happylokam Partner Network',
        description: '₹99/Month Cloud Server & Listing Activation',
        order_id: orderData.orderId,
        prefill: {
          name: orderData.partner?.name || partner?.name || '',
          email: orderData.partner?.email || partner?.email || '',
          contact: orderData.partner?.phone || partner?.phone || ''
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/v1/partners/verify-server-charge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              toast.success('🎉 ₹99 Monthly Cloud Server Activation Verified! Your listing is now live.');
              await fetchProfile();
            } else {
              toast.error(verifyData.error || 'Verification failed. Please contact support.');
            }
          } catch (vErr: any) {
            toast.error(vErr.message || 'Error completing payment verification');
          }
        },
        theme: {
          color: '#e11d48'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Subscription payment initiation failed');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  const isSubscribed = partner?.subscriptionStatus === 'ACTIVE';

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Partner Cloud Subscription</h1>
        <p className="text-gray-500 mt-1">Manage your active monthly listing and lead priority status</p>
      </div>

      {isSubscribed ? (
        <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck className="w-32 h-32 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> ACTIVE MONTHLY SUBSCRIPTION
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verified Premium Partner</h2>
            <p className="text-gray-600 mt-2 max-w-md text-sm leading-relaxed">
              Your ₹99 monthly server hosting is active. Your business listing enjoys priority ranking in search, unlimited customer inquiries, and direct WhatsApp connect.
            </p>
            {partner?.subscriptionEnd && (
              <p className="mt-6 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">
                Valid Until: {new Date(partner.subscriptionEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} (Monthly Renewal)
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-rose-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <CreditCard className="w-32 h-32 text-rose-600" />
          </div>
          <div className="relative z-10 text-center py-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold mb-4 mx-auto">
              PENDING ACTIVATION
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Activate Your Business on happylokam</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
              Connect to our cloud infrastructure to publish services, receive verified client bookings, and get featured in the rose-led directory.
            </p>
            
            <div className="flex justify-center items-end gap-1 mb-8">
              <span className="text-4xl font-extrabold text-gray-900">₹99</span>
              <span className="text-gray-500 pb-1 text-sm font-semibold">/month</span>
            </div>

            <div className="max-w-md mx-auto mb-8 text-left bg-rose-50/50 p-4 rounded-xl border border-rose-100 space-y-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified business badge on public directory</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited celebration inquiries & instant WhatsApp leads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Priority ranking in city-wide recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>30-Day billing interval (Renew or cancel anytime)</span>
              </div>
            </div>

            <button 
              onClick={handleSubscribe}
              disabled={subscribing}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-rose-600/30 hover:scale-[1.02] disabled:opacity-50"
            >
              {subscribing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Preparing Gateway...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Activate Now for ₹99/Month</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
