'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Compass, Plus, X, Edit2, Trash2, CheckCircle2, Clock, MapPin, 
  IndianRupee, ExternalLink, Image as ImageIcon, Search, RefreshCw, 
  Sparkles, Eye, AlertCircle, Check, ToggleLeft, ToggleRight
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface SafariPackage {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: number;
  description: string;
  imageUrl: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const PRESET_IMAGES = [
  { label: 'Rajgir Stupa & Hills', url: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Valmiki Tiger Reserve Forest', url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Bodh Gaya Mahabodhi Temple', url: 'https://images.unsplash.com/photo-1600100397608-f010e42e0e5a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Kakolat Cascading Falls', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80' }
];

export default function AdminLokSafariPage() {
  const [packages, setPackages] = useState<SafariPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '2 Days / 1 Night',
    price: 3999,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=80',
    status: 'Active',
  });

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/loksafari');
      if (res && res.success) {
        setPackages(res.data || res.packages || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error fetching LokSafari packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      location: 'Bihar, India',
      duration: '2 Days / 1 Night',
      price: 4999,
      description: '',
      imageUrl: PRESET_IMAGES[0].url,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg: SafariPackage) => {
    setEditingId(pkg.id);
    setFormData({
      title: pkg.title,
      location: pkg.location,
      duration: pkg.duration,
      price: pkg.price,
      description: pkg.description,
      imageUrl: pkg.imageUrl,
      status: pkg.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.price) {
      toast.error('Title, location, and price are required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        // Update package
        const res: any = await apiClient.put(`/loksafari/${editingId}`, {
          ...formData,
          price: Number(formData.price),
        });
        if (res && res.success) {
          toast.success('LokSafari expedition updated successfully!');
        }
      } else {
        // Create package
        const res: any = await apiClient.post('/loksafari', {
          ...formData,
          price: Number(formData.price),
        });
        if (res && res.success) {
          toast.success('New LokSafari expedition created successfully!');
        }
      }

      setIsModalOpen(false);
      fetchPackages();
    } catch (error: any) {
      toast.error(error.message || 'Error saving package');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (pkg: SafariPackage) => {
    const nextStatus = pkg.status === 'Active' ? 'Paused' : 'Active';
    try {
      const res: any = await apiClient.put(`/loksafari/${pkg.id}`, { status: nextStatus });
      if (res && res.success) {
        toast.success(`Circuit ${pkg.title} is now ${nextStatus}`);
        setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, status: nextStatus } : p));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDelete = async (pkg: SafariPackage) => {
    if (!confirm(`Are you sure you want to delete the "${pkg.title}" circuit?`)) {
      return;
    }

    try {
      const res: any = await apiClient.delete(`/loksafari/${pkg.id}`);
      if (res && res.success) {
        toast.success('Package deleted successfully');
        setPackages(prev => prev.filter(p => p.id !== pkg.id));
      }
    } catch (error: any) {
      toast.error(error.message || 'Error deleting package');
    }
  };

  const filteredPackages = packages.filter(pkg =>
    !searchQuery ||
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = packages.filter(p => p.status === 'Active').length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Eco-Tourism & Heritage CMS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white font-playfair tracking-tight">
            LokSafari Circuits Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, edit, pause, and preview guided heritage expeditions and river safaris displayed on the website and mobile app.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/loksafari"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-white/10 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Preview Customer Portal</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Expedition</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#090d1a] border border-white/10 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Packages</span>
          <span className="text-3xl font-black text-white">{packages.length}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Configured circuits</span>
        </div>

        <div className="bg-[#090d1a] border border-emerald-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Active Circuits</span>
          <span className="text-3xl font-black text-emerald-400">{activeCount}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Live on Website & App</span>
        </div>

        <div className="bg-[#090d1a] border border-amber-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Paused / Draft</span>
          <span className="text-3xl font-black text-amber-300">{packages.length - activeCount}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Hidden from public</span>
        </div>

        <div className="bg-[#090d1a] border border-blue-500/20 rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block mb-1">Pricing Range</span>
          <span className="text-2xl font-black text-white flex items-center mt-1">
            <IndianRupee className="w-5 h-5 -mr-1 text-slate-400" />
            {packages.length > 0
              ? `${Math.min(...packages.map(p => p.price)).toLocaleString('en-IN')} - ${Math.max(...packages.map(p => p.price)).toLocaleString('en-IN')}`
              : '0'}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">All-inclusive per person</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#090d1a] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expeditions by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={fetchPackages}
            className="self-end sm:self-auto flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-400 hover:text-white bg-white/5 rounded-xl border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>
        </div>

        {/* Packages Cards Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 font-medium">
            <Compass className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-3" />
            Loading LokSafari expeditions...
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5 p-6">
            <Compass className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No expeditions found.</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add New Expedition" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPackages.map((pkg) => {
              const isActive = pkg.status === 'Active';

              return (
                <div
                  key={pkg.id}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-48 overflow-hidden bg-black/40">
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090d1a] via-transparent to-black/40" />

                      <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                        LokSafari
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleToggleStatus(pkg)}
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-md flex items-center gap-1.5 transition-all ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <span>{pkg.status}</span>
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-semibold">
                        <div className="flex items-center gap-1 text-emerald-300">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          <span>{pkg.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-300 bg-black/50 px-2 py-0.5 rounded-full text-[11px]">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{pkg.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
                        {pkg.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">
                        {pkg.description || 'No detailed itinerary provided yet.'}
                      </p>

                      <div className="flex items-baseline gap-1 text-white">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Starting at</span>
                        <span className="text-2xl font-black text-emerald-400 flex items-center">
                          <IndianRupee className="w-4 h-4 -mr-0.5" />
                          {Number(pkg.price || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-400 text-xs">/ person</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 bg-black/30 border-t border-white/5 flex items-center justify-between gap-2">
                    <Link
                      href={`/loksafari/${pkg.id}`}
                      target="_blank"
                      className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      <span>Customer View</span>
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(pkg)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Edit Circuit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(pkg)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                        title="Delete Circuit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Add / Edit Expedition Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d1322] border border-white/15 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4" />
                <span>{editingId ? 'Edit Expedition' : 'New Expedition Circuit'}</span>
              </div>
              <h2 className="text-2xl font-black text-white font-playfair mb-6">
                {editingId ? 'Update LokSafari Circuit' : 'Create LokSafari Expedition'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Expedition Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajgir & Nalanda Royal Heritage Circuit"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Destination Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajgir & Nalanda, Bihar"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Duration *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2 Days / 1 Night or Full Day"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Price per person (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="4999"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#131a2b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      <option value="Active">Active (Visible)</option>
                      <option value="Paused">Paused (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  
                  {/* Preset quick picks */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-[10px] text-slate-400 font-bold self-center">Presets:</span>
                    {PRESET_IMAGES.map((img, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                        className="text-[10px] bg-white/5 hover:bg-white/15 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white border border-white/10 transition-colors"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Image Preview */}
                  {formData.imageUrl && (
                    <div className="mt-3 relative h-36 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                        Live Preview
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Description & Highlights</label>
                  <textarea
                    rows={4}
                    placeholder="Describe the circuit, sights (glass bridge, monuments), inclusions (transport, stays, food)..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update Circuit' : 'Publish Expedition'}
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
