'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  QrCode,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Building2,
  Phone,
  Sparkles,
  RefreshCw,
  Loader2,
  Ticket
} from 'lucide-react';

export default function TicketScannerPage() {
  const [ticketInput, setTicketInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [marking, setMarking] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleCheckTicket = async (ticketIdToLookup?: string) => {
    const id = ticketIdToLookup || ticketInput.trim();
    if (!id) {
      toast.error('Please enter or scan a ticket ID');
      return;
    }

    setChecking(true);
    setBookingData(null);
    setErrorStatus(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/v1/manager/tickets/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ ticketId: id })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorStatus(data.error || 'Ticket not found or invalid');
        toast.error(data.error || 'Ticket validation failed');
      } else {
        setBookingData(data.data);
        toast.success('Ticket found & verified!');
      }
    } catch (err: any) {
      setErrorStatus(err.message || 'Network error verifying ticket');
      toast.error(err.message || 'Network error');
    } finally {
      setChecking(false);
    }
  };

  const handleMarkUsed = async () => {
    if (!bookingData?.ticketId) return;

    setMarking(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/v1/manager/tickets/mark-used', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ ticketId: bookingData.ticketId })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to mark ticket as used');
      }

      toast.success('Ticket marked as USED / ENTERED successfully!');
      setBookingData({ ...bookingData, status: 'COMPLETED' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update ticket status');
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Gate Check-In & Entry Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Event & Dandiya Ticket Scanner
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Verify attendee tickets in real-time, inspect booking details, and log entry status at the gate.
        </p>
      </div>

      {/* Input Box */}
      <div className="p-6 rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 backdrop-blur-xl space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Enter or Scan Ticket ID
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Ticket className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. TKT-2026-DANDIYA-8921 or paste QR string"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheckTicket();
              }}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
          </div>
          <button
            onClick={() => handleCheckTicket()}
            disabled={checking || !ticketInput.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {checking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Verify Ticket</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error State */}
      {errorStatus && (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/40 text-rose-300 flex items-start gap-4">
          <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-rose-200">Ticket Verification Failed</h3>
            <p className="text-xs text-rose-300/80 mt-1">{errorStatus}</p>
          </div>
        </div>
      )}

      {/* Verified Ticket Card */}
      {bookingData && (
        <div className="p-6 rounded-2xl bg-[#0c1220]/90 border border-emerald-500/40 backdrop-blur-xl shadow-2xl shadow-emerald-950/40 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Verified Booking
                </span>
                <h2 className="text-lg font-black text-white font-mono">
                  {bookingData.ticketId}
                </h2>
              </div>
            </div>

            <div>
              {bookingData.status === 'COMPLETED' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Already Used / Admitted</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid for Entry</span>
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Attendee Name</span>
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <User className="w-4 h-4 text-blue-400" />
                <span>{bookingData.user?.name || 'Guest User'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Contact Phone</span>
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{bookingData.user?.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Venue / Event</span>
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>{bookingData.venue?.name || bookingData.partner?.businessName || 'Dandiya Celebration Venue'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block mb-1">Pass Quantity & Amount</span>
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs">
                  Qty: {bookingData.guestCount || 1}
                </span>
                <span className="text-emerald-400">₹{bookingData.totalAmount || 0}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {bookingData.status !== 'COMPLETED' ? (
            <button
              onClick={handleMarkUsed}
              disabled={marking}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {marking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Marking Entry...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Grant Entry & Mark Ticket As Used</span>
                </>
              )}
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-slate-800/80 text-center text-xs font-semibold text-slate-400">
              This ticket has been marked as scanned. No further action needed.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
