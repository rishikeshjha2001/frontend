'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Calendar, MapPin, Tag, Image as ImageIcon, Users, List, Loader2, Plus, X, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function CreateCelebrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Birthday',
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    location: '',
    description: '',
    price: '',
    totalTickets: '100',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80',
  });
  const [ticketTiers, setTicketTiers] = useState({
    single: '',
    couple: '',
    family4: '',
    family6: '',
    group5: '',
    child: '',
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'price') {
        const p = parseFloat(value) || 0;
        setTicketTiers({
          single: value,
          couple: p > 0 ? String(Math.round(p * 1.8)) : '',
          family4: p > 0 ? String(Math.round(p * 3.4)) : '',
          family6: p > 0 ? String(Math.round(p * 4.8)) : '',
          group5: p > 0 ? String(Math.round(p * 4.2)) : '',
          child: p > 0 ? String(Math.round(p * 0.5)) : '',
        });
      }
      return updated;
    });
  };

  const handleTierChange = (tier: keyof typeof ticketTiers, val: string) => {
    setTicketTiers(prev => ({ ...prev, [tier]: val }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (f: string) => {
    setFeatures(features.filter(item => item !== f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let parsedDate = new Date();
      if (formData.date) {
        const d = new Date(formData.date);
        if (!isNaN(d.getTime())) parsedDate = d;
      }

      const baseP = Math.max(0, parseFloat(formData.price) || 0);
      const computedTiers = {
        single: Math.max(0, parseFloat(ticketTiers.single) || baseP),
        couple: Math.max(0, parseFloat(ticketTiers.couple) || Math.round(baseP * 1.8)),
        family4: Math.max(0, parseFloat(ticketTiers.family4) || Math.round(baseP * 3.4)),
        family6: Math.max(0, parseFloat(ticketTiers.family6) || Math.round(baseP * 4.8)),
        group5: Math.max(0, parseFloat(ticketTiers.group5) || Math.round(baseP * 4.2)),
        child: Math.max(0, parseFloat(ticketTiers.child) || Math.round(baseP * 0.5)),
      };

      const payload = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        date: parsedDate.toISOString(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        price: baseP,
        totalTickets: Math.max(0, parseInt(formData.totalTickets) || 0),
        ticketTiers: computedTiers,
        features
      };

      const res: any = await apiClient.post('/events', payload);

      if (res?.success) {
        toast.success('Celebration package with 6 ticket tiers created successfully!');
        router.push('/admin/events');
      } else {
        toast.error(res?.error || 'Failed to create celebration');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error?.message || 'Error creating celebration package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="relative overflow-hidden bg-zinc-950 rounded-[2rem] p-8 md:p-12 shadow-2xl border border-zinc-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Create Celebration</h1>
          </div>
          <p className="text-zinc-400 max-w-xl">Design a dynamic package for birthdays, weddings, or general events. Customize tickets, pricing, and features.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                <Tag className="w-4 h-4 text-purple-400" /> Package Title
              </label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Grand Wedding Bash" className="w-full px-5 py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-zinc-600" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                <Calendar className="w-4 h-4 text-rose-400" /> Date & Time
              </label>
              <input type="datetime-local" name="date" required value={formData.date} onChange={handleChange} className="w-full px-5 py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Ticket Price (₹)</label>
                <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} placeholder="0 for Free" className="w-full px-5 py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                  <Users className="w-4 h-4 text-blue-400" /> Total Capacity
                </label>
                <input type="number" name="totalTickets" required min="1" value={formData.totalTickets} onChange={handleChange} className="w-full px-5 py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-5 py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none">
                <option value="Birthday">Birthday Party</option>
                <option value="Wedding">Wedding Celebration</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Corporate">Corporate Event</option>
                <option value="General">General Event</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                <MapPin className="w-4 h-4 text-orange-400" /> Location
              </label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="Full Address or Venue Name" className="w-full px-5 py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-zinc-600" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" /> Cover Photo URL
              </label>
              <input type="url" name="imageUrl" required value={formData.imageUrl} onChange={handleChange} placeholder="https://..." className="w-full px-5 py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-zinc-600" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-2">
                <List className="w-4 h-4 text-pink-400" /> Features & Highlights
              </label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="e.g. VIP Seating, Live DJ" className="flex-1 px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all text-sm placeholder:text-zinc-600" />
                <button type="button" onClick={addFeature} className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {features.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300">
                    {f} <button type="button" onClick={() => removeFeature(f)} className="text-zinc-500 hover:text-rose-400"><X className="w-3.5 h-3.5" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🎟️ TICKET TYPES & PRICING CONFIGURATION */}
        <div className="p-6 bg-zinc-950/70 border border-purple-500/20 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Ticket className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Ticket Types & Pricing</h3>
                <p className="text-xs text-zinc-400">Set individual prices for Single, Couple, Family, and Group ticket tiers</p>
              </div>
            </div>
            <span className="inline-flex items-center self-start sm:self-auto text-xs text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 font-medium">
              6 Ticket Tiers Supported
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">👤 Single Pass (₹)</label>
              <input
                type="number"
                min="0"
                value={ticketTiers.single}
                onChange={(e) => handleTierChange('single', e.target.value)}
                placeholder={formData.price || '0'}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              />
              <span className="text-[11px] text-zinc-500">1 Adult entry</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">👫 Couple Pass (₹)</label>
              <input
                type="number"
                min="0"
                value={ticketTiers.couple}
                onChange={(e) => handleTierChange('couple', e.target.value)}
                placeholder={formData.price ? String(Math.round(Number(formData.price) * 1.8)) : '0'}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              />
              <span className="text-[11px] text-zinc-500">2 People (Pair)</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">👨‍👩‍👧‍👦 Family (4 Pax) (₹)</label>
              <input
                type="number"
                min="0"
                value={ticketTiers.family4}
                onChange={(e) => handleTierChange('family4', e.target.value)}
                placeholder={formData.price ? String(Math.round(Number(formData.price) * 3.4)) : '0'}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              />
              <span className="text-[11px] text-zinc-500">Family of 4 people</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">👨‍👩‍👧‍👦+2 Family (6 Pax) (₹)</label>
              <input
                type="number"
                min="0"
                value={ticketTiers.family6}
                onChange={(e) => handleTierChange('family6', e.target.value)}
                placeholder={formData.price ? String(Math.round(Number(formData.price) * 4.8)) : '0'}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              />
              <span className="text-[11px] text-zinc-500">Large family (6 people)</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">👥 Group (5 Adults) (₹)</label>
              <input
                type="number"
                min="0"
                value={ticketTiers.group5}
                onChange={(e) => handleTierChange('group5', e.target.value)}
                placeholder={formData.price ? String(Math.round(Number(formData.price) * 4.2)) : '0'}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              />
              <span className="text-[11px] text-zinc-500">Group of 5 adults</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">🧒 Child Pass (₹)</label>
              <input
                type="number"
                min="0"
                value={ticketTiers.child}
                onChange={(e) => handleTierChange('child', e.target.value)}
                placeholder={formData.price ? String(Math.round(Number(formData.price) * 0.5)) : '0'}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              />
              <span className="text-[11px] text-zinc-500">Kids / Child entry</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-300 mb-2">Description</label>
          <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} placeholder="Detail what makes this celebration package special..." className="w-full px-5 py-4 bg-zinc-950/50 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-zinc-600 resize-none"></textarea>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-3.5 rounded-xl font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] flex items-center justify-center min-w-[200px]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Package'}
          </button>
        </div>
      </form>
    </div>
  );
}
