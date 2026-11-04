"use client";

import React, { useState } from 'react';
import { Phone, MessageCircle, MessageSquare, X, Headphones, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Do not render the customer concierge widget on admin or internal dashboard pages
  if (
    pathname?.startsWith('/admin') ||
    (typeof window !== 'undefined' && window.location.hostname.startsWith('admin.'))
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Popover Menu */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200/80 transition-all animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Celebration Concierge</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close concierge menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            How can our celebration planning specialists assist you today?
          </p>

          <div className="space-y-2">
            {/* WhatsApp */}
            <a
              href="https://wa.me/918969255561?text=Hello%20happylokam%20Concierge%2C%20I%20need%20assistance%20with%20my%20event%20booking"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">WhatsApp Concierge</p>
                <p className="text-[10px] text-slate-500 truncate">+91 89692 55561 (Instant reply)</p>
              </div>
            </a>

            {/* Direct Call */}
            <a
              href="tel:+918969255561"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 group-hover:text-rose-900">Call Us Directly</p>
                <p className="text-[10px] text-slate-500 truncate">9:00 AM - 10:00 PM IST</p>
              </div>
            </a>

            {/* Message Support Desk */}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900">Send Inquiry Message</p>
                <p className="text-[10px] text-slate-500 truncate">Concierge support ticket</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full shadow-2xl shadow-emerald-900/30 font-bold text-xs tracking-wide transition-all transform hover:scale-105 active:scale-95 group"
        aria-label="happylokam Concierge Support"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <Headphones className="w-4 h-4" />
        <span className="hidden sm:inline">Concierge Support</span>
      </button>
    </div>
  );
}
