'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Image as ImageIcon, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  X,
  Layers,
  Save,
  Loader2
} from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

type HeroSlide = {
  id: string;
  image: string;
  badge: string;
  title1: string;
  title2: string;
  desc: string;
  ctaText: string;
  ctaLink: string;
  gradient: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const GRADIENT_PRESETS = [
  { name: 'Rose Red', value: 'from-rose-500 to-rose-700' },
  { name: 'Warm Amber', value: 'from-amber-400 to-orange-500' },
  { name: 'Emerald Teal', value: 'from-emerald-500 to-teal-700' },
  { name: 'Indigo Purple', value: 'from-indigo-500 to-purple-700' },
  { name: 'Sunset Glow', value: 'from-fuchsia-600 to-pink-600' },
];

export default function AdminHeroCMSPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [formData, setFormData] = useState({
    image: '',
    badge: 'happylokam Special',
    title1: '',
    title2: '',
    desc: '',
    ctaText: 'Search Packages',
    ctaLink: '/search',
    gradient: 'from-rose-500 to-rose-700',
    order: 0,
    isActive: true,
  });

  const [toastMsg, setToastMsg] = useState<{ title: string; type: 'success' | 'error' } | null>(null);

  const showToast = (title: string, type: 'success' | 'error') => {
    setToastMsg({ title, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/v1/hero-slides/all');
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : (json.slides || []);
        setSlides(list);
      } else {
        // Fallback to public
        const pubRes = await authFetch('/api/v1/hero-slides');
        if (pubRes.ok) {
          const json = await pubRes.json();
          setSlides(json.data || json.slides || []);
        }
      }
    } catch (err: any) {
      showToast('Failed to load hero slides', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setFormData({
      image: '/slide1.jpg',
      badge: 'Celebrate Every Moment',
      title1: 'Make Memories',
      title2: 'Unforgettable.',
      desc: 'Book verified banquet venues, celebration passes, and full event packages.',
      ctaText: 'Explore Now',
      ctaLink: '/search',
      gradient: 'from-rose-500 to-rose-700',
      order: slides.length,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      image: slide.image,
      badge: slide.badge,
      title1: slide.title1,
      title2: slide.title2,
      desc: slide.desc,
      ctaText: slide.ctaText,
      ctaLink: slide.ctaLink,
      gradient: slide.gradient,
      order: slide.order,
      isActive: slide.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.trim() || !formData.title1.trim()) {
      showToast('Image URL and Title 1 are required', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingSlide) {
        // Update
        const res = await authFetch(`/api/v1/hero-slides/${editingSlide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update slide');
        showToast('Hero slide updated successfully!', 'success');
      } else {
        // Create
        const res = await authFetch('/api/v1/hero-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create slide');
        showToast('New hero slide published!', 'success');
      }
      setIsModalOpen(false);
      fetchSlides();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const res = await authFetch(`/api/v1/hero-slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !slide.isActive }),
      });
      if (!res.ok) throw new Error('Failed to toggle status');
      setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, isActive: !s.isActive } : s));
      showToast(`Slide ${!slide.isActive ? 'activated' : 'hidden'}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Toggle failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    try {
      const res = await authFetch(`/api/v1/hero-slides/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete slide');
      setSlides(prev => prev.filter(s => s.id !== id));
      showToast('Slide deleted', 'success');
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 md:p-10 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-600/10 blur-[130px] pointer-events-none" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-center gap-3 text-sm font-medium z-50 ${
              toastMsg.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
                : 'bg-red-950/90 text-red-300 border-red-500/30'
            }`}
          >
            {toastMsg.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
            {toastMsg.title}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight flex items-center gap-3">
              <Layers className="w-8 h-8 text-rose-500" />
              Homepage Hero & Banner CMS
            </h1>
            <p className="text-sm text-zinc-400 mt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Update hero carousel slides, headlines, banner backgrounds, and action buttons dynamically in real-time.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add New Slide
          </button>
        </div>

        {/* Slides Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500 mr-3" />
            Loading hero slides...
          </div>
        ) : slides.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl">
            <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-zinc-300">No Hero Slides Configured</h3>
            <p className="text-sm text-zinc-500 mt-1">Click "Add New Slide" above to create your first homepage banner.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((slide, idx) => (
              <motion.div
                key={slide.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`group relative rounded-2xl border transition-all overflow-hidden ${
                  slide.isActive
                    ? 'bg-zinc-900/60 border-white/10 hover:border-rose-500/40 shadow-xl'
                    : 'bg-zinc-950/40 border-white/5 opacity-60'
                }`}
              >
                {/* Visual Banner Preview */}
                <div className="relative h-48 w-full overflow-hidden bg-black/60">
                  <img
                    src={slide.image}
                    alt={slide.title1}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-60"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient} opacity-40 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                  {/* Badges on image */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-black/60 text-white backdrop-blur-md border border-white/15">
                      {slide.badge}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-white/10 text-zinc-300">
                      Order: {slide.order}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(slide)}
                      title={slide.isActive ? 'Active (Click to Hide)' : 'Hidden (Click to Activate)'}
                      className={`p-2 rounded-lg backdrop-blur-md transition ${
                        slide.isActive
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                      }`}
                    >
                      {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(slide)}
                      title="Edit Slide"
                      className="p-2 rounded-lg bg-black/60 hover:bg-white/20 text-white backdrop-blur-md transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      title="Delete Slide"
                      className="p-2 rounded-lg bg-black/60 hover:bg-red-500/30 text-zinc-400 hover:text-red-400 backdrop-blur-md transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Headline Preview */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-xl font-black text-white leading-tight">
                      {slide.title1} <span className="text-rose-400">{slide.title2}</span>
                    </h2>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-zinc-400 line-clamp-2">{slide.desc}</p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1 text-zinc-500 font-mono">
                      <span>CTA:</span>
                      <span className="text-zinc-300 font-medium">{slide.ctaText}</span>
                      <span className="text-zinc-600">→</span>
                      <span className="text-rose-400">{slide.ctaLink}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      slide.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {slide.isActive ? 'Active on Live' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-zinc-300 shadow-2xl relative"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-rose-500" />
                  {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Image URL / Path *
                    </label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/slide1.jpg or https://images.unsplash..."
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          image: '/images/hero/hero_vedic_vivah.jpg',
                          badge: 'ROYAL VEDIC CELEBRATION',
                          title1: 'Traditional Vedic Vivah',
                          title2: '& Sacred Mandaps',
                          desc: 'Experience timeless rituals, certified vedic pandits, sacred havan, and bespoke floral decor for your special day.',
                          ctaText: 'Explore Weddings',
                          ctaLink: '/(tabs)/explore?category=Weddings',
                          gradient: 'from-amber-600 to-rose-700'
                        })}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[11px] text-amber-300 border border-amber-500/20 transition cursor-pointer"
                      >
                        🪔 Vedic Vivah
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          image: '/images/hero/hero_corporate_events.jpg',
                          badge: 'EXECUTIVE GATHERINGS',
                          title1: 'The Secret Behind',
                          title2: 'Memorable Corporate Events',
                          desc: 'High-level executive summits, luxury banquets, 5-star live gourmet counters & complete AV production.',
                          ctaText: 'Discover Packages',
                          ctaLink: '/(tabs)/explore?category=Packages',
                          gradient: 'from-slate-900 to-amber-900'
                        })}
                        className="px-2.5 py-1 rounded-lg bg-slate-500/20 hover:bg-slate-500/30 text-[11px] text-slate-300 border border-slate-500/30 transition cursor-pointer"
                      >
                        🥂 Corporate Events
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          image: '/images/hero/hero_birthday_throne.jpg',
                          badge: 'ROYAL BIRTHDAYS',
                          title1: 'Grand Royal Birthday',
                          title2: '& Fiesta Themes',
                          desc: 'Enchanted golden thrones, balloon arches, neon backdrops, live magicians & celebration feasts for all ages.',
                          ctaText: 'Book Birthday Theme',
                          ctaLink: '/(tabs)/explore?category=Birthdays',
                          gradient: 'from-pink-600 to-purple-800'
                        })}
                        className="px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-[11px] text-pink-300 border border-pink-500/20 transition cursor-pointer"
                      >
                        👑 Royal Birthday
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          image: '/images/hero/hero_wedding_rings.jpg',
                          badge: 'DESTINATION PALACES',
                          title1: 'Luxury Destination Weddings',
                          title2: '& Lakeside Palaces',
                          desc: 'Sunset lake views, royal heritage suites, 200+ valet parking & royal bridal entries in Rajasthan.',
                          ctaText: 'View Palaces',
                          ctaLink: '/(tabs)/explore?category=Weddings',
                          gradient: 'from-rose-500 to-amber-700'
                        })}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-[11px] text-rose-300 border border-rose-500/20 transition cursor-pointer"
                      >
                        💍 Lakeside Palaces
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1.5">Select a celebration theme preset above or enter custom image URL.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Top Badge Text
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={e => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Traditional & Sacred"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Title Line 1 (White) *
                    </label>
                    <input
                      type="text"
                      value={formData.title1}
                      onChange={e => setFormData({ ...formData, title1: e.target.value })}
                      placeholder="e.g. We'll create"
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Title Line 2 (Highlighted)
                    </label>
                    <input
                      type="text"
                      value={formData.title2}
                      onChange={e => setFormData({ ...formData, title2: e.target.value })}
                      placeholder="e.g. your memory."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Description Text
                  </label>
                  <textarea
                    rows={2}
                    value={formData.desc}
                    onChange={e => setFormData({ ...formData, desc: e.target.value })}
                    placeholder="Brief compelling description for this celebration category..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                      placeholder="e.g. Search Packages"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      CTA Button Link
                    </label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={e => setFormData({ ...formData, ctaLink: e.target.value })}
                      placeholder="/search or /dandiya"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Gradient Theme
                    </label>
                    <select
                      value={formData.gradient}
                      onChange={e => setFormData({ ...formData, gradient: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    >
                      {GRADIENT_PRESETS.map(p => (
                        <option key={p.value} value={p.value}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-rose-600 rounded focus:ring-0"
                      />
                      <span className="text-xs font-medium text-white">Active on Live</span>
                    </label>
                  </div>
                </div>

                {/* Preview Thumbnail */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Live Banner Preview
                  </label>
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-black border border-white/10">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover opacity-60"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${formData.gradient} opacity-40 mix-blend-multiply`} />
                    <div className="absolute inset-0 flex flex-col justify-between p-3">
                      <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/20">
                        {formData.badge || 'Badge'}
                      </span>
                      <div>
                        <div className="text-base font-black text-white">
                          {formData.title1 || 'Title 1'} <span className="text-rose-400">{formData.title2}</span>
                        </div>
                        <div className="text-[10px] text-zinc-300 line-clamp-1">{formData.desc}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-sm font-semibold shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingSlide ? 'Save Changes' : 'Create Slide'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
