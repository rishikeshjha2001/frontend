'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Search, 
  MoreVertical, 
  Building2, 
  Mail, 
  User, 
  AlertCircle,
  Trash2,
  Eye,
  Phone,
  Calendar,
  Download,
  Plus,
  X
} from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

const useToast = () => {
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  const toast = {
    success: (title: string) => {
      setToastMessage({ title, type: 'success' });
      setTimeout(() => setToastMessage(null), 4000);
    },
    error: (title: string) => {
      setToastMessage({ title, type: 'error' });
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const ToastComponent = () => (
    <AnimatePresence>
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-md flex items-center gap-3 text-sm font-medium z-50 ${toastMessage.type === 'success' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' : 'bg-red-950/80 text-red-400 border-red-500/30'}`}
        >
          {toastMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {toastMessage.title}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { toast, ToastComponent };
};

type Partner = {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  location?: string;
  categories?: string[];
  image?: string;
  imageUrl?: string;
  referralCode?: string;
  isVerified: boolean;
  status?: string;
  createdAt?: string;
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    location: 'Patna, Bihar',
    categories: 'Wedding, Venue, Catering',
    image: '',
    imageUrl: '',
    isVerified: true,
  });
  
  const { toast, ToastComponent } = useToast();

  const handlePartnerImageUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const res = await authFetch('/api/v1/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });
        const data = await res.json().catch(() => null);
        if (data?.url) {
          setNewPartner(prev => ({ ...prev, image: data.url, imageUrl: data.url }));
          toast.success('Partner logo uploaded successfully!');
        } else {
          toast.error('Image upload failed');
        }
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error('Image upload failed');
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/v1/admin/partners');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.partners || data.data || []);
        setPartners(list);
      } else {
        setPartners([]);
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await authFetch(`/api/v1/admin/partners/${id}/approve`, {
        method: 'PUT',
      });

      if (res.ok) {
        toast.success('Partner approved successfully');
        setPartners(prev => prev.map(p => p.id === id ? { ...p, isVerified: true } : p));
      } else {
        toast.error('Failed to approve partner');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async () => {
    if (!partnerToDelete) return;
    try {
      const res = await authFetch(`/api/v1/admin/partners/${partnerToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success !== false) {
        toast.success(data.message || 'Partner removed from system');
        setPartners(prev => prev.filter(p => p.id !== partnerToDelete.id));
        setIsDeleteModalOpen(false);
        setPartnerToDelete(null);
      } else {
        toast.error(data.error || 'Failed to delete partner');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while deleting partner');
    }
  };

  const exportPartnersCSV = () => {
    if (!partners || partners.length === 0) {
      toast.error('No partner data available to export');
      return;
    }

    const headers = ['ID', 'Business Name', 'Owner Name', 'Email', 'Phone', 'Verified', 'Created At'];
    const rows = partners.map(p => [
      `"${p.id}"`,
      `"${(p.businessName || '').replace(/"/g, '""')}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.email || '').replace(/"/g, '""')}"`,
      `"${(p.phone || '').replace(/"/g, '""')}"`,
      p.isVerified ? 'Yes' : 'No',
      `"${p.createdAt ? new Date(p.createdAt).toISOString() : ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `happylokam_partners_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${partners.length} partners successfully`);
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.businessName || !newPartner.email || !newPartner.phone) {
      toast.error('Business name, email, and phone are required');
      return;
    }
    try {
      setCreating(true);
      const res = await authFetch('/api/v1/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner),
      });
      if (res.ok) {
        toast.success('Partner created and onboarded successfully!');
        setIsAddModalOpen(false);
        setNewPartner({
          name: '',
          businessName: '',
          email: '',
          phone: '',
          password: '',
          location: 'Patna, Bihar',
          categories: 'Wedding, Venue, Catering',
          image: '',
          imageUrl: '',
          isVerified: true,
        });
        fetchPartners();
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(errJson.error || 'Failed to create partner');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error creating partner');
    } finally {
      setCreating(false);
    }
  };

  const filteredPartners = partners.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 p-6 md:p-10 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight flex items-center gap-3">
              <Building2 className="w-8 h-8 text-rose-500" />
              Partner Management
            </h1>
            <p className="text-sm text-zinc-400 mt-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Verify, inspect, and manage vendors seamlessly
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-600/30 transition cursor-pointer"
              title="Add New Partner"
            >
              <Plus className="w-4 h-4" />
              Add Partner
            </button>
            <button
              onClick={exportPartnersCSV}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/10 transition shadow-sm"
              title="Export Partners CSV"
            >
              <Download className="w-4 h-4 text-rose-400" />
              Export Partners
            </button>

            <div className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-rose-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search by name, business, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all placeholder:text-zinc-600 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-zinc-400 animate-pulse">Loading Partners...</p>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-zinc-500 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-rose-500/50" />
              </div>
              <p className="text-lg">No partners found in the system</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-zinc-400">
                    <th className="px-6 py-5 font-semibold">Business / Owner</th>
                    <th className="px-6 py-5 font-semibold">Contact Info</th>
                    <th className="px-6 py-5 font-semibold">Status</th>
                    <th className="px-6 py-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {filteredPartners.map((partner, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        key={partner.id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            {partner.imageUrl || partner.image ? (
                              <img src={partner.imageUrl || partner.image} alt={partner.businessName} className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-md" />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center text-rose-500 border border-rose-500/20 group-hover:border-rose-500/50 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all">
                                <Building2 className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <p className="text-base font-semibold text-white group-hover:text-rose-400 transition-colors">{partner.businessName || 'Unnamed Business'}</p>
                              <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                                <User className="w-3.5 h-3.5" /> {partner.name || 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-zinc-300">
                              <Mail className="w-4 h-4 text-zinc-500" />
                              {partner.email}
                            </div>
                            {partner.phone && (
                              <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <Phone className="w-4 h-4 text-zinc-500" />
                                {partner.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {partner.isVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                              <CheckCircle className="w-4 h-4" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                              <AlertCircle className="w-4 h-4" />
                              Pending Approval
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedPartner(partner)}
                              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all tooltip-trigger"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            
                            {!partner.isVerified && (
                              <button
                                onClick={() => handleApprove(partner.id)}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:shadow-[0_0_25px_rgba(244,63,94,0.6)] focus:ring-2 focus:ring-rose-500"
                              >
                                Approve
                              </button>
                            )}
                            
                            <button
                              onClick={() => { setPartnerToDelete(partner); setIsDeleteModalOpen(true); }}
                              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete Partner"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* View Details Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
              <button 
                onClick={() => setSelectedPartner(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center border border-rose-500/30">
                  <Building2 className="w-8 h-8 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedPartner.businessName}</h3>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 rounded-full text-xs font-semibold ${selectedPartner.isVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {selectedPartner.isVerified ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {selectedPartner.isVerified ? 'Verified Partner' : 'Verification Pending'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Owner Name</p>
                  <p className="text-zinc-200 flex items-center gap-2"><User className="w-4 h-4 text-rose-500" /> {selectedPartner.name}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Email Address</p>
                  <p className="text-zinc-200 flex items-center gap-2"><Mail className="w-4 h-4 text-rose-500" /> {selectedPartner.email}</p>
                </div>
                {selectedPartner.phone && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Phone Number</p>
                    <p className="text-zinc-200 flex items-center gap-2"><Phone className="w-4 h-4 text-rose-500" /> {selectedPartner.phone}</p>
                  </div>
                )}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Registration Date</p>
                  <p className="text-zinc-200 flex items-center gap-2"><Calendar className="w-4 h-4 text-rose-500" /> {selectedPartner.createdAt ? new Date(selectedPartner.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && partnerToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-red-500/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_20px_60px_rgba(239,68,68,0.15)] text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Partner?</h3>
              <p className="text-zinc-400 text-sm mb-6">Are you sure you want to permanently remove <strong className="text-white">{partnerToDelete.businessName}</strong>? This action cannot be undone.</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Partner Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-zinc-300 shadow-2xl relative"
            >
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-rose-500" />
                  Onboard New Partner
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePartner} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Business / Brand Name *
                  </label>
                  <input
                    type="text"
                    value={newPartner.businessName}
                    onChange={e => setNewPartner({ ...newPartner, businessName: e.target.value })}
                    placeholder="e.g. Royal Palace Banquets & Catering"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Partner Logo / Brand Photo
                  </label>
                  <div className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-white/10">
                    {newPartner.image ? (
                      <img src={newPartner.image} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        value={newPartner.image}
                        onChange={e => setNewPartner({ ...newPartner, image: e.target.value, imageUrl: e.target.value })}
                        placeholder="Paste logo URL (https://...) or choose file"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:border-rose-500 focus:outline-none"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => e.target.files?.[0] && handlePartnerImageUpload(e.target.files[0])}
                        className="text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-600 file:text-white hover:file:bg-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Owner / Contact Name
                    </label>
                    <input
                      type="text"
                      value={newPartner.name}
                      onChange={e => setNewPartner({ ...newPartner, name: e.target.value })}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={newPartner.phone}
                      onChange={e => setNewPartner({ ...newPartner, phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={newPartner.email}
                      onChange={e => setNewPartner({ ...newPartner, email: e.target.value })}
                      placeholder="partner@example.com"
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Temporary Password
                    </label>
                    <input
                      type="text"
                      value={newPartner.password}
                      onChange={e => setNewPartner({ ...newPartner, password: e.target.value })}
                      placeholder="Default: Happy@1234"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      City & Location
                    </label>
                    <input
                      type="text"
                      value={newPartner.location}
                      onChange={e => setNewPartner({ ...newPartner, location: e.target.value })}
                      placeholder="e.g. Patna, Bihar"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Categories (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newPartner.categories}
                      onChange={e => setNewPartner({ ...newPartner, categories: e.target.value })}
                      placeholder="Wedding, Venue, Catering"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newPartner.isVerified}
                      onChange={e => setNewPartner({ ...newPartner, isVerified: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 rounded focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Instantly Verify Partner</span>
                      <span className="text-[11px] text-zinc-500 block">Marks KYC as pre-verified so partner can immediately publish listings.</span>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-sm font-semibold shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Onboard Partner'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <ToastComponent />

    </div>
  );
}
