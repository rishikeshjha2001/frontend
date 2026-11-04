'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function PartnerReferralPage() {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ bookings: 0, views: 0 }); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMe = await fetch('/api/v1/auth/me', { credentials: 'include' });
        const dataMe = await resMe.json();
        const code = dataMe.user?.referralCode || 'NO-CODE-YET';
        setReferralCode(code);

        if (code !== 'NO-CODE-YET') {
          const resStats = await fetch(`/api/v1/referrals/code/${code}`, { credentials: 'include' });
          if (resStats.ok) {
            const dataStats = await resStats.json();
            setStats({
              bookings: dataStats.data?.totalBookings || 0,
              views: 0 // View tracking can be added later
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/ref/${referralCode}` : `https://happylokam.com/ref/${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">Partner Referral Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-zinc-900/40 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 backdrop-blur-xl">
            <h2 className="text-xl font-semibold mb-4 text-white">Your Referral Link & QR</h2>
            <p className="text-zinc-400 mb-8 text-sm">Share this link or QR code with your network to earn points and commissions on their bookings.</p>
            
            <div className="flex flex-col items-center mb-8 p-6 bg-white rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <QRCodeSVG value={referralLink} size={220} />
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={referralLink} 
                className="flex-1 p-3 border border-white/10 rounded-xl bg-black/40 text-white outline-none focus:ring-1 focus:ring-rose-500 text-sm"
              />
              <button 
                onClick={copyToClipboard}
                className="px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-500 transition-colors font-medium shadow-[0_0_15px_rgba(225,29,72,0.4)]"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-zinc-900/40 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-6 text-white">Performance Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-center">
                  <p className="text-sm text-rose-400 font-medium mb-2">Total Bookings</p>
                  <p className="text-4xl font-bold text-white">{stats.bookings}</p>
                </div>
                <div className="p-5 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-center">
                  <p className="text-sm text-purple-400 font-medium mb-2">Wallet Points</p>
                  <p className="text-4xl font-bold text-white">{stats.bookings * 50}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900/40 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-4 text-white">How it works</h2>
              <ul className="space-y-3 text-zinc-400 text-sm">
                <li className="flex gap-3"><span className="text-rose-500 font-bold">1.</span> Share your unique QR code or link with clients.</li>
                <li className="flex gap-3"><span className="text-rose-500 font-bold">2.</span> They use your link to access our premium celebration packages.</li>
                <li className="flex gap-3"><span className="text-rose-500 font-bold">3.</span> You automatically earn points (₹50) in your wallet for every successful ticket booked!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
