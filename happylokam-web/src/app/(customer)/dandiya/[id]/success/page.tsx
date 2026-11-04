'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, MapPin, Calendar, CheckCircle2, QrCode, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import html2canvas from 'html2canvas';
import { apiClient } from '@/lib/api-client';

export default function TicketSuccessPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [ticketId, setTicketId] = useState('');
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data: any = await apiClient.get(`/events/${id}`);
        if (data?.data) {
          setEvent(data.data);
        }
      } catch (err) {}
    };
    if (id) fetchEvent();
    setTicketId(`HL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  }, [id]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, // High resolution
        backgroundColor: '#18181b', // match zinc-900
        useCORS: true,
      });
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `happylokam-ticket-${ticketId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Ticket downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download ticket image');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 flex items-center justify-center relative overflow-hidden print:bg-white print:text-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/20 blur-[120px] rounded-full pointer-events-none print:hidden" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 print:block print:w-full">
        {/* Success Message */}
        <div className="space-y-6 text-center md:text-left print:hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-8"
          >
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400"
          >
            {event ? `You're all set for ${event.title}. Your digital ticket is ready.` : 'Your event booking has been confirmed!'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"
          >
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-2xl font-bold shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:scale-105 transition-all disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {isDownloading ? 'Generating Ticket...' : 'Download Ticket'}
            </button>
            <Link href="/dandiya">
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/5 transition-all w-full">
                <ArrowLeft className="w-5 h-5" />
                Browse More Events
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Ticket Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="print:w-full print:max-w-none"
        >
          <div ref={ticketRef} className="w-full max-w-sm mx-auto bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative print:border-black print:bg-white print:text-black print:shadow-none print:w-full print:max-w-none">
            <div className="h-48 relative print:h-64">
              {event?.imageUrl ? (
                <img src={event.imageUrl} className="w-full h-full object-cover" alt="Event" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-900/50 to-purple-900/50 print:bg-none print:bg-gray-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent print:hidden" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-white font-black tracking-tight">
                happylokam
              </div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-rose-400 uppercase tracking-widest print:border-black print:text-black">
                Confirmed
              </div>
            </div>

            <div className="p-8 pb-4 relative">
              <h3 className="text-2xl font-bold text-white mb-6 print:text-black">{event?.title || 'Event Ticket'}</h3>

              <div className="space-y-4 mb-8">
                {event?.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white print:text-black">{event.location}</p>
                    </div>
                  </div>
                )}
                {event?.date && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white print:text-black">
                        {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-zinc-500 print:text-gray-600">
                        Starts at {new Date(event.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative h-px w-full border-t border-dashed border-white/20 my-6 print:border-black/20">
                <div className="absolute -left-10 -top-4 w-8 h-8 bg-[#050505] rounded-full print:bg-white" />
                <div className="absolute -right-10 -top-4 w-8 h-8 bg-[#050505] rounded-full print:bg-white" />
              </div>

              <div className="mb-6 space-y-1 print:mb-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider print:text-gray-600">Ticket Holder</p>
                <p className="text-base font-bold text-white print:text-black">{user?.name || 'Guest User'}</p>
                <p className="text-sm font-medium text-zinc-400 print:text-gray-700">{(user as any)?.phone || 'No Phone'}</p>
                <p className="text-xs text-zinc-500 mt-2 font-mono">TICKET ID: {ticketId}</p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/10 print:border-black/10 print:pt-4 mt-2">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 print:text-gray-600">Price Per Ticket</p>
                  <p className="text-lg font-mono font-bold text-white print:text-black">₹{event?.price || 0}</p>
                </div>
                <div className="w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center border border-zinc-200">
                  <QrCode className="w-full h-full text-black" />
                </div>
              </div>
            </div>

            <div className="h-2 w-full bg-gradient-to-r from-rose-600 to-purple-600" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
