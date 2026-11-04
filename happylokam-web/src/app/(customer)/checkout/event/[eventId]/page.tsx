'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle2, Loader2, ShieldCheck, CreditCard, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function EventCheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId as string;

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [attendeeName, setAttendeeName] = useState('');

  const [eventData, setEventData] = useState<any>(null);
  const [tickets, setTickets] = useState(1);

  useEffect(() => {
    if (eventId) {
      router.replace(`/dandiya/${eventId}`);
    }
  }, [eventId, router]);

  const handlePayment = async () => {
    if (!attendeeName.trim()) {
      toast.error("Please enter the Attendee Name");
      return;
    }
    setProcessing(true);
    // Simulate API call for creating booking
    setTimeout(() => {
      setProcessing(false);
      const generatedId = 'HL-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      setTicketId(generatedId);
      setIsSuccess(true);
      toast.success("Payment Successful! Tickets Booked.");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Event Not Found</h2>
          <button onClick={() => router.push('/')} className="mt-6 px-6 py-2 bg-rose-600 text-white rounded-full">Go Home</button>
        </div>
      </div>
    );
  }

  const price = eventData.price || 499;
  const total = price * tickets;
  const grandTotal = total + (total * 0.18) + 20;

  // --- SUCCESS STATE: AWESOME TICKET CARD ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow for premium feel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/30 blur-[100px] rounded-full pointer-events-none"></div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 relative z-10"
        >
          {/* Top Header */}
          <div className="bg-gradient-to-br from-rose-600 to-rose-700 p-8 text-center text-white relative">
            <Ticket className="w-12 h-12 mx-auto mb-3 opacity-90" />
            <h2 className="text-3xl font-black tracking-widest uppercase mb-1">happylokam</h2>
            <p className="text-rose-200 text-sm font-medium tracking-wide">OFFICIAL ENTRY PASS</p>
            
            {/* Cutouts for realistic ticket look */}
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-slate-900 rounded-full"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-slate-900 rounded-full"></div>
          </div>
          
          {/* Middle Details */}
          <div className="p-8 pb-6 bg-white relative">
            <h3 className="text-2xl font-black text-slate-900 mb-6 leading-tight">{eventData.title}</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="font-bold text-slate-900 text-right">{new Date(eventData.date).toLocaleDateString()} • 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Location</span>
                <span className="font-bold text-slate-900 text-right max-w-[150px] truncate">{eventData.location}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-slate-500 font-medium">Admit</span>
                <span className="font-bold text-slate-900 text-right">{tickets} Person(s)</span>
              </div>
            </div>
          </div>

          {/* Dashed line */}
          <div className="flex items-center px-6 bg-white">
            <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
          </div>

          {/* Bottom Attendee Info */}
          <div className="p-8 pt-6 bg-slate-50">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Attendee Name</p>
                <p className="text-lg font-black text-slate-900 uppercase">{attendeeName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Ticket ID</p>
                <p className="font-mono text-rose-600 font-bold text-lg">{ticketId}</p>
              </div>
            </div>
            
            <button onClick={() => router.push('/profile')} className="w-full py-4 rounded-xl font-bold text-white text-lg bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg">
              Save Ticket & Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- CHECKOUT STATE ---
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">1</div>
          <h1 className="text-3xl font-bold text-slate-900">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex gap-6 flex-col md:flex-row">
                <img src={eventData.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} alt={eventData.title} className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-sm" />
                <div>
                  <div className="inline-block px-3 py-1 bg-rose-100 text-rose-600 font-bold text-xs rounded-full mb-3 uppercase tracking-wider">
                    {eventData.category || 'Event'}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{eventData.title}</h2>
                  <div className="space-y-2 text-slate-600 text-sm">
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-rose-500" /> {new Date(eventData.date).toLocaleDateString()} at 6:00 PM</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-500" /> {eventData.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Attendee Details</h3>
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Name on Ticket</label>
                <input 
                  type="text" 
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-6 mt-8">Select Tickets</h3>
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50">
                <div>
                  <p className="font-bold text-slate-900">General Admission</p>
                  <p className="text-sm text-slate-500">₹{price} per person</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setTickets(Math.max(1, tickets - 1))} className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-900 font-bold hover:bg-slate-50 transition-colors">-</button>
                  <span className="font-bold text-xl w-4 text-center">{tickets}</span>
                  <button onClick={() => setTickets(Math.min(10, tickets + 1))} className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-900 font-bold hover:bg-slate-50 transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Tickets ({tickets}x)</span>
                  <span className="font-medium text-slate-900">₹{total}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-slate-900">₹{(total * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Fee</span>
                  <span className="font-medium text-slate-900">₹20</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-black text-rose-600">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 mb-4"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Pay Securely</>}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 font-medium">
                <ShieldCheck className="w-4 h-4" /> 100% Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
