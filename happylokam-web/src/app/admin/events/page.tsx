'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Users, Calendar, MapPin, IndianRupee, Tag, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [search, setSearch] = useState('');
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'Navratri Dandiya',
    date: '',
    location: '',
    description: '',
    price: 0,
    totalTickets: 0,
    features: '',
    imageUrl: '',
    ticketTiers: {
      single: 0,
      couple: 0,
      family4: 0,
      family6: 0,
      group5: 0,
      child: 0,
    }
  });

  const categories = [
    'Navratri Dandiya', 'DJ Night', 'Live Concert', 'Standup Comedy', 
    'Wedding', 'Birthday', 'Corporate', 'Religious', 'Anniversary',
    'Baby Shower', 'Bridal Shower', 'Engagement', 'Reception',
    'Cultural Fest', 'College Fest', 'Tech Conference', 'Business Seminar',
    'Workshop', 'Art Exhibition', 'Food Festival', 'Music Festival',
    'Sports Event', 'Marathon', 'Yoga Retreat', 'Wellness Camp',
    'Fashion Show', 'Award Ceremony', 'Product Launch', 'Networking Event',
    'Charity Gala', 'Fundraiser', 'Alumni Meet', 'Flash Mob',
    'Poetry Slam', 'Open Mic', 'Theatre Play', 'Magic Show',
    'Dance Competition', 'Singing Competition', 'Quiz Night',
    'Hackathon', 'Trade Show', 'Flea Market', 'Carnival',
    'Circus', 'Theme Park Event', 'Beach Party', 'Pool Party',
    'Boat Party', 'Camping', 'Trekking', 'Adventure Sports',
    'Other'
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data: any = await apiClient.get('/events/all');
      if (data?.success && data?.data) {
        setEvents(data.data);
      } else {
        toast.error('Failed to fetch events');
      }
    } catch (error: any) { if (error?.status === 401) return; toast.error('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFormData({ ...formData, imageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (event?: any) => {
    if (event) {
      const p = Number(event.price) || 0;
      setFormData({
        id: event.id,
        title: event.title || '',
        category: event.category || 'Navratri Dandiya',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        description: event.description || '',
        price: p,
        totalTickets: event.totalTickets || 0,
        features: Array.isArray(event.features) ? event.features.join(', ') : (event.features || ''),
        imageUrl: event.imageUrl || '',
        ticketTiers: {
          single: event.ticketTiers?.single ?? p,
          couple: event.ticketTiers?.couple ?? Math.round(p * 1.8),
          family4: event.ticketTiers?.family4 ?? Math.round(p * 3.4),
          family6: event.ticketTiers?.family6 ?? Math.round(p * 4.8),
          group5: event.ticketTiers?.group5 ?? Math.round(p * 4.2),
          child: event.ticketTiers?.child ?? Math.round(p * 0.5),
        }
      });
    } else {
      const tomorrow = new Date(Date.now() + 86400000);
      tomorrow.setHours(18, 0, 0, 0);
      const defaultDateStr = tomorrow.toISOString().slice(0, 16);

      setFormData({
        id: '',
        title: '',
        category: 'Navratri Dandiya',
        date: defaultDateStr,
        location: '',
        description: '',
        price: 0,
        totalTickets: 100,
        features: '',
        imageUrl: '',
        ticketTiers: {
          single: 0,
          couple: 0,
          family4: 0,
          family6: 0,
          group5: 0,
          child: 0,
        }
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = !!formData.id;
      const endpoint = isEdit ? `/events/${formData.id}` : '/events';
      
      let parsedDate = new Date();
      if (formData.date) {
        const d = new Date(formData.date);
        if (!isNaN(d.getTime())) parsedDate = d;
      }

      const basePrice = Math.max(0, Number(formData.price) || 0);
      const tiers = {
        single: Math.max(0, Number(formData.ticketTiers?.single) || basePrice),
        couple: Math.max(0, Number(formData.ticketTiers?.couple) || Math.round(basePrice * 1.8)),
        family4: Math.max(0, Number(formData.ticketTiers?.family4) || Math.round(basePrice * 3.4)),
        family6: Math.max(0, Number(formData.ticketTiers?.family6) || Math.round(basePrice * 4.8)),
        group5: Math.max(0, Number(formData.ticketTiers?.group5) || Math.round(basePrice * 4.2)),
        child: Math.max(0, Number(formData.ticketTiers?.child) || Math.round(basePrice * 0.5)),
      };

      const payload = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        date: parsedDate.toISOString(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        price: basePrice,
        totalTickets: Math.max(0, Number(formData.totalTickets) || 0),
        ticketTiers: tiers,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        imageUrl: formData.imageUrl.trim()
      };

      const res: any = isEdit 
        ? await apiClient.put(endpoint, payload)
        : await apiClient.post(endpoint, payload);

      if (res?.success) {
        toast.success(isEdit ? 'Event & ticket tiers updated successfully' : 'Event & ticket tiers created successfully');
        setIsModalOpen(false);
        fetchEvents();
      } else {
        toast.error(res?.error || 'Operation failed');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error?.message || 'Error saving event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res: any = await apiClient.delete(`/events/${id}`);
      if (res?.success) {
        toast.success('Event deleted');
        fetchEvents();
      } else {
        toast.error('Delete failed');
      }
    } catch (error) {
      toast.error('Error deleting event');
    }
  };

  const viewAttendees = async (eventId: string) => {
    setIsAttendeesModalOpen(true);
    setLoadingAttendees(true);
    try {
      const data: any = await apiClient.get(`/events/${eventId}/bookings`);
      if (data?.success && data?.data) {
        setAttendees(data.data?.bookings || []);
      } else {
        toast.error('Failed to fetch attendees');
      }
    } catch (error) {
      toast.error('Error fetching attendees');
    } finally {
      setLoadingAttendees(false);
    }
  };

  const filteredEvents = events.filter(e => 
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
            <p className="text-zinc-400 mt-1">Create and manage your platform events.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40">
                <th className="p-4 font-medium text-zinc-400">Title</th>
                <th className="p-4 font-medium text-zinc-400">Category</th>
                <th className="p-4 font-medium text-zinc-400">Date & Location</th>
                <th className="p-4 font-medium text-zinc-400">Price</th>
                <th className="p-4 font-medium text-zinc-400">Tickets</th>
                <th className="p-4 font-medium text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">Loading events...</td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">No events found.</td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{event.title}</td>
                    <td className="p-4">
                      <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-xs font-medium border border-rose-500/20">
                        {event.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-400">
                      <div>{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</div>
                      <div>{event.location}</div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="font-bold text-white">₹{event.ticketTiers?.single ?? event.price}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        👫 Couple: ₹{event.ticketTiers?.couple ?? Math.round((event.price || 0) * 1.8)}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        👨‍👩‍👧‍👦 Fam(4): ₹{event.ticketTiers?.family4 ?? Math.round((event.price || 0) * 3.4)} • 🧒 Child: ₹{event.ticketTiers?.child ?? Math.round((event.price || 0) * 0.5)}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Users className="w-4 h-4 text-rose-500" />
                        {event.ticketsSold || 0} / {event.totalTickets}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => viewAttendees(event.id)} className="text-blue-400 hover:text-blue-300 transition-colors" title="View Attendees">
                          <Users className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenModal(event)} className="text-zinc-400 hover:text-white transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(event.id)} className="text-rose-500 hover:text-rose-400 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 md:p-6 w-full max-w-lg md:max-w-xl my-4 relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit Celebration Event' : 'Create Celebration Event'}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Title</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none" />
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-medium text-zinc-400">Category</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {['Navratri Dandiya', 'DJ Night', 'Live Concert', 'Standup Comedy'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormData({...formData, category: c})}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${formData.category === c ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] border border-rose-500' : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      required 
                      placeholder="Or type a custom category..." 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Date & Time</label>
                    <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Location</label>
                    <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Base Price (₹)</label>
                    <input 
                      required 
                      type="number" 
                      value={formData.price} 
                      onChange={e => {
                        const val = Number(e.target.value) || 0;
                        setFormData({
                          ...formData, 
                          price: val,
                          ticketTiers: {
                            single: val,
                            couple: Math.round(val * 1.8),
                            family4: Math.round(val * 3.4),
                            family6: Math.round(val * 4.8),
                            group5: Math.round(val * 4.2),
                            child: Math.round(val * 0.5),
                          }
                        });
                      }} 
                      className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400">Total Tickets</label>
                    <input required type="number" value={formData.totalTickets} onChange={e => setFormData({...formData, totalTickets: Number(e.target.value)})} className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none" />
                  </div>
                </div>

                {/* 🎟️ TICKET TYPES & INDIVIDUAL PRICING */}
                <div className="p-4 bg-zinc-950/80 border border-rose-500/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-rose-500" />
                      <h4 className="text-sm font-bold text-white">Ticket Types & Pricing</h4>
                    </div>
                    <span className="text-[11px] text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 font-medium">
                      Admin Configurable
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">👤 Single Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.ticketTiers?.single || 0}
                        onChange={e => setFormData({
                          ...formData,
                          ticketTiers: { ...formData.ticketTiers, single: Number(e.target.value) || 0 }
                        })}
                        className="w-full bg-black border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">👫 Couple Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.ticketTiers?.couple || 0}
                        onChange={e => setFormData({
                          ...formData,
                          ticketTiers: { ...formData.ticketTiers, couple: Number(e.target.value) || 0 }
                        })}
                        className="w-full bg-black border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">👨‍👩‍👧‍👦 Family 4 Pax (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.ticketTiers?.family4 || 0}
                        onChange={e => setFormData({
                          ...formData,
                          ticketTiers: { ...formData.ticketTiers, family4: Number(e.target.value) || 0 }
                        })}
                        className="w-full bg-black border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">👨‍👩‍👧‍👦+2 Family 6 Pax (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.ticketTiers?.family6 || 0}
                        onChange={e => setFormData({
                          ...formData,
                          ticketTiers: { ...formData.ticketTiers, family6: Number(e.target.value) || 0 }
                        })}
                        className="w-full bg-black border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">👥 Group 5 Adults (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.ticketTiers?.group5 || 0}
                        onChange={e => setFormData({
                          ...formData,
                          ticketTiers: { ...formData.ticketTiers, group5: Number(e.target.value) || 0 }
                        })}
                        className="w-full bg-black border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">🧒 Child Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.ticketTiers?.child || 0}
                        onChange={e => setFormData({
                          ...formData,
                          ticketTiers: { ...formData.ticketTiers, child: Number(e.target.value) || 0 }
                        })}
                        className="w-full bg-black border border-white/10 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400">Features (comma separated)</label>
                  <input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none" placeholder="Premium Entry, Free Drinks..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400">Event Image</label>
                  {formData.imageUrl && (
                    <div className="mb-2 relative w-full h-32 rounded-xl overflow-hidden border border-white/10">
                      <img src={formData.imageUrl} alt="Event preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, imageUrl: ''})}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {!formData.imageUrl && (
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none" />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors font-medium">Save Event</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attendees Modal */}
      <AnimatePresence>
        {isAttendeesModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-3xl max-h-[80vh] flex flex-col relative"
            >
              <button onClick={() => setIsAttendeesModalOpen(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-6">Attendees</h2>
              
              <div className="flex-1 overflow-y-auto pr-2">
                {loadingAttendees ? (
                  <div className="text-center py-10 text-zinc-500">Loading attendees...</div>
                ) : attendees.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500">No attendees yet.</div>
                ) : (
                  <div className="space-y-3">
                    {attendees.map((a: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-black border border-white/10 p-4 rounded-xl">
                        <div>
                          <div className="font-medium text-white">{a.user?.name || 'Unknown User'}</div>
                          <div className="text-sm text-zinc-400">{a.user?.email || 'N/A'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full border border-rose-500/20">
                            {a.ticketsCount} Tickets
                          </div>
                          <div className="text-xs text-zinc-500 mt-1">₹{a.totalAmount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
