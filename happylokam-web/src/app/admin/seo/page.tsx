'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Search, X, Edit, RefreshCw, Save } from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

interface SeoMetadata {
  id: string;
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
}

export default function SeoPage() {
  const [seoRecords, setSeoRecords] = useState<SeoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<SeoMetadata | null>(null);
  
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    canonicalUrl: '',
  });

  const fetchSeoRecords = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/v1/admin/seo');
      if (res.ok) {
        const data = await res.json();
        setSeoRecords(data.seoMetadata || data);
      } else {
        toast.error('Failed to fetch SEO records');
      }
    } catch (err) {
      toast.error('Error fetching SEO records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoRecords();
  }, []);

  const openEditModal = (record: SeoMetadata) => {
    setEditingRecord(record);
    setEditForm({
      title: record.title || '',
      description: record.description || '',
      canonicalUrl: record.canonicalUrl || '',
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    try {
      const res = await authFetch(`/api/v1/admin/seo/${editingRecord.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        toast.success('SEO record updated successfully');
        setEditingRecord(null);
        fetchSeoRecords();
      } else {
        toast.error('Failed to update SEO record');
      }
    } catch (err) {
      toast.error('Error updating SEO record');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-rose-500" />
            SEO Management
          </h1>
          <p className="text-gray-400 mt-1">Manage global and page-specific SEO metadata</p>
        </div>
        <button
          onClick={fetchSeoRecords}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Path / Identifier</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-64"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : seoRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No SEO records found
                  </td>
                </tr>
              ) : (
                seoRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-rose-400">{record.path}</td>
                    <td className="px-6 py-4 font-medium truncate max-w-[200px]" title={record.title}>
                      {record.title}
                    </td>
                    <td className="px-6 py-4 text-gray-400 truncate max-w-[300px]" title={record.description}>
                      {record.description}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(record)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-rose-500" />
                  Edit SEO Metadata
                </h3>
                <button
                  onClick={() => setEditingRecord(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Path</label>
                  <input
                    type="text"
                    value={editingRecord.path}
                    disabled
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                    placeholder="Page Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all min-h-[100px]"
                    placeholder="Meta Description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Canonical URL</label>
                  <input
                    type="text"
                    value={editForm.canonicalUrl}
                    onChange={(e) => setEditForm({ ...editForm, canonicalUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                    placeholder="https://happylokam.com/..."
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingRecord(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
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
