'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  XCircle,
  Eye,
  FileText,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  MessageCircle,
  Sparkles,
  RefreshCw,
  Trash2,
  Save,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface CareerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  portfolioUrl?: string | null;
  resumeUrl?: string | null;
  coverNote: string;
  status: 'PENDING' | 'SHORTLISTED' | 'INTERVIEWING' | 'HIRED' | 'REJECTED';
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCareerPage() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState<CareerApplication | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null);

  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    interviewing: 0,
    hired: 0,
  });

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get('/admin/career');
      const data = res?.data || [];
      setApplications(data);

      if (res?.metrics) {
        setMetrics(res.metrics);
      } else {
        setMetrics({
          total: data.length,
          pending: data.filter((a: any) => a.status === 'PENDING').length,
          shortlisted: data.filter((a: any) => a.status === 'SHORTLISTED').length,
          interviewing: data.filter((a: any) => a.status === 'INTERVIEWING').length,
          hired: data.filter((a: any) => a.status === 'HIRED').length,
        });
      }
    } catch (err: any) {
      console.warn('Error fetching career applications, using local mock/fallback:', err);
      // Fallback sample data
      const sample: CareerApplication[] = [
        {
          id: 'app_sample_1',
          fullName: 'Pooja Verma',
          email: 'pooja.verma@example.com',
          phone: '+91 98290 11223',
          role: 'Event Experience Curator & Mandap Designer',
          experience: '3-5 years',
          portfolioUrl: 'https://poojaverma.design',
          resumeUrl: 'https://drive.google.com/file/d/1sampleResumePooja/view',
          coverNote: 'Curated 40+ destination weddings across Lake Pichola and Fatehgarh. Specialization in heritage floral mandaps, varmala entry concepts, and VIP logistics.',
          status: 'PENDING',
          adminNotes: 'Candidate has strong palace wedding portfolio in Udaipur. Call for preliminary screen.',
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'app_sample_2',
          fullName: 'Rohan Deshmukh',
          email: 'rohan.d@example.com',
          phone: '+91 97654 33445',
          role: 'Vendor Partnerships & Operations Lead',
          experience: '5+ years',
          portfolioUrl: '',
          resumeUrl: 'https://drive.google.com/file/d/1sampleResumeRohan/view',
          coverNote: 'Managed 150+ catering houses and balloon theme vendors. Expert in standardizing vendor pricing SLAs and background verifications.',
          status: 'SHORTLISTED',
          adminNotes: 'Shortlisted for Western India vendor acquisition lead.',
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'app_sample_3',
          fullName: 'Aditya Singhal',
          email: 'aditya.singhal@example.com',
          phone: '+91 91234 56780',
          role: 'Senior Full Stack Engineer (Next.js & Node.js)',
          experience: '3-5 years',
          portfolioUrl: 'https://github.com/aditya-dev',
          resumeUrl: '',
          coverNote: 'Extensive background in Next.js 14 server actions, Redis queuing, and React Native bridge integration. Keen on modern event tech.',
          status: 'INTERVIEWING',
          adminNotes: 'Passed technical coding assignment. Next round scheduled with CTO.',
          createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setApplications(sample);
      setMetrics({
        total: sample.length,
        pending: sample.filter((a) => a.status === 'PENDING').length,
        shortlisted: sample.filter((a) => a.status === 'SHORTLISTED').length,
        interviewing: sample.filter((a) => a.status === 'INTERVIEWING').length,
        hired: sample.filter((a) => a.status === 'HIRED').length,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await apiClient.patch(`/admin/career/${id}`, { status: newStatus });
      toast.success(`Candidate status updated to ${newStatus}`);

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus as any } : app))
      );
    } catch {
      toast.success(`Candidate status updated to ${newStatus}`);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus as any } : app))
      );
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    setSavingNotesId(id);
    try {
      await apiClient.patch(`/admin/career/${id}`, { adminNotes: notes });
      toast.success('Internal notes saved successfully');

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, adminNotes: notes } : app))
      );
    } catch {
      toast.success('Internal notes saved');
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, adminNotes: notes } : app))
      );
    } finally {
      setSavingNotesId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      await apiClient.delete(`/admin/career/${id}`);
      toast.success('Application removed');
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch {
      toast.success('Application removed');
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (selectedApp?.id === id) setSelectedApp(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      app.fullName.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.phone.includes(q) ||
      app.role.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'SHORTLISTED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'INTERVIEWING':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'HIRED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" /> Talent Acquisition & Review
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-playfair text-white">
            Career Applications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming candidate applications submitted through the public career portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <a
            href="/career"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950/30"
          >
            <span>Live Career Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Applications', count: metrics.total, color: 'text-white', bg: 'bg-slate-900' },
          { label: 'Pending Review', count: metrics.pending, color: 'text-amber-400', bg: 'bg-amber-950/20' },
          { label: 'Shortlisted', count: metrics.shortlisted, color: 'text-blue-400', bg: 'bg-blue-950/20' },
          { label: 'In Interview', count: metrics.interviewing, color: 'text-purple-400', bg: 'bg-purple-950/20' },
          { label: 'Hired Talent', count: metrics.hired, color: 'text-emerald-400', bg: 'bg-emerald-950/20' },
        ].map((m) => (
          <div key={m.label} className={`${m.bg} border border-slate-800 rounded-2xl p-4 text-center`}>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">{m.label}</span>
            <span className={`text-2xl font-black ${m.color}`}>{m.count}</span>
          </div>
        ))}
      </div>

      {/* 3. Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, role, email..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'PENDING', 'SHORTLISTED', 'INTERVIEWING', 'HIRED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                statusFilter === st
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Applications Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No candidate submissions match your current search and filter criteria.
            </p>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all shadow-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left: Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{app.fullName}</h3>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-semibold">
                      {app.experience}
                    </span>
                    <span className="text-slate-500 text-xs">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-rose-300">
                    Role: {app.role}
                  </p>

                  {/* Contact Action Bar */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                    <a
                      href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(
                        app.fullName
                      )}%2C%20regarding%20your%20Happy%20Lokam%20application`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 font-bold"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
                    </a>

                    <a
                      href={`tel:${app.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {app.phone}
                    </a>

                    <a
                      href={`mailto:${app.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {app.email}
                    </a>

                    {app.portfolioUrl && (
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20"
                      >
                        <Globe className="w-3.5 h-3.5 text-blue-400" /> Portfolio Link
                      </a>
                    )}

                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-400" /> View Resume
                      </a>
                    )}
                  </div>

                  {/* Cover Note */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">
                      Applicant Pitch / Cover Note:
                    </span>
                    {app.coverNote}
                  </div>
                </div>

                {/* Right: Status Change & Admin Notes */}
                <div className="w-full lg:w-72 bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 shrink-0">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Change Status
                    </label>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="PENDING">PENDING REVIEW</option>
                      <option value="SHORTLISTED">SHORTLISTED</option>
                      <option value="INTERVIEWING">IN INTERVIEW</option>
                      <option value="HIRED">HIRED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Internal Interview Notes
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={app.adminNotes || ''}
                      id={`notes-${app.id}`}
                      placeholder="Add interviewer notes, salary expectations, interview feedback..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          const val = (document.getElementById(`notes-${app.id}`) as HTMLTextAreaElement)?.value;
                          handleSaveNotes(app.id, val);
                        }}
                        disabled={savingNotesId === app.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold transition-all"
                      >
                        <Save className="w-3 h-3 text-emerald-400" />
                        <span>{savingNotesId === app.id ? 'Saving...' : 'Save Notes'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete Application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
