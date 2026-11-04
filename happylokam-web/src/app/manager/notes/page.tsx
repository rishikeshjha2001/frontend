'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  RefreshCw,
  Loader2,
  X,
  AlertCircle
} from 'lucide-react';

export default function ManagerNotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    reminderAt: ''
  });

  const fetchNotes = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/v1/manager/notes', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch field notes');
      const data = await res.json();
      if (data.success) {
        setNotes(data.data || []);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/v1/manager/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create note');
      }

      toast.success('Field note created!');
      setShowModal(false);
      setFormData({ title: '', content: '', reminderAt: '' });
      fetchNotes();
    } catch (err: any) {
      toast.error(err.message || 'Error creating note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/v1/manager/notes/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus })
      });

      if (!res.ok) throw new Error('Failed to update note status');

      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: nextStatus } : n))
      );
      toast.success(`Task marked as ${nextStatus.toLowerCase()}`);
    } catch (err: any) {
      toast.error(err.message || 'Error updating status');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`/api/v1/manager/notes/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to delete note');

      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success('Note removed');
    } catch (err: any) {
      toast.error(err.message || 'Error deleting note');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Field Notes & Task Checklist
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Keep track of merchant follow-ups, contract signings, and venue visit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchNotes();
            }}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Note / Task</span>
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mb-2" />
          <span>Loading field notes...</span>
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => {
            const isDone = note.status === 'COMPLETED';
            return (
              <div
                key={note.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isDone
                    ? 'bg-[#0c1220]/50 border-slate-800/50 opacity-75'
                    : 'bg-[#0c1220]/90 border-slate-800/90 shadow-lg shadow-black/30'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => handleToggleStatus(note.id, note.status)}
                      className="flex items-center gap-2 text-left group"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 group-hover:text-blue-400 shrink-0 transition-colors" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          isDone ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {note.title}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed whitespace-pre-line pl-7">
                    {note.content}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 pl-7">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(note.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  {note.reminderAt && (
                    <div className="flex items-center gap-1 text-amber-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due: {new Date(note.reminderAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 p-8">
          <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No field notes yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Create field tasks, log partner visits, or set reminders for merchant document verification.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Note</span>
          </button>
        </div>
      )}

      {/* New Note Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c1220] border border-slate-700/80 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-400" />
                <span>Add Field Task or Note</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Task Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visit Grand Hotel for Menu update"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Details / Observations <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Met owner Mr. Venkat, verified GST and bank details..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Reminder Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.reminderAt}
                  onChange={(e) => setFormData({ ...formData, reminderAt: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Note</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
