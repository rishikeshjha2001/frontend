'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  UserPlus,
  Building2,
  Mail,
  Phone,
  Lock,
  MapPin,
  FileText,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Dining & Cafes',
  'Nightlife & Clubs',
  'Resorts & Stays',
  'Events & Dandiya',
  'Adventure & Sports',
  'Spa & Wellness',
  'Shopping & Retail',
  'Activities & Tours'
];

export default function OnboardPartnerPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [createdPartner, setCreatedPartner] = useState<any>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    categories: [] as string[],
    ownerName: '',
    gstNumber: '',
    panNumber: '',
    bankAccount: '',
    bankIfsc: ''
  });

  const toggleCategory = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/v1/manager/partners', {
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
        throw new Error(data.error || 'Failed to onboard partner');
      }

      toast.success('Partner onboarded successfully!');
      setCreatedPartner(data.partner);
    } catch (err: any) {
      toast.error(err.message || 'Error onboarding partner');
    } finally {
      setSubmitting(false);
    }
  };

  if (createdPartner) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Partner Onboarded Successfully!</h2>
        <p className="text-sm text-slate-400">
          The partner account has been created and assigned to your manager profile.
        </p>

        <div className="p-6 rounded-2xl bg-[#0c1220] border border-slate-800 text-left space-y-3 max-w-md mx-auto">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Partner Name:</span>
            <span className="font-bold text-white">{createdPartner.name}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">HLP ID Generated:</span>
            <span className="font-mono font-bold text-blue-400">{createdPartner.hlpId}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Status:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Pending Admin Verification
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => {
              setCreatedPartner(null);
              setFormData({
                businessName: '',
                name: '',
                email: '',
                phone: '',
                password: '',
                location: '',
                categories: [],
                ownerName: '',
                gstNumber: '',
                panNumber: '',
                bankAccount: '',
                bankIfsc: ''
              });
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            Onboard Another
          </button>
          <Link
            href="/manager/partners"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
          >
            View Partner List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/manager"
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Onboard New Partner</h1>
          <p className="text-xs text-slate-400">
            Field registration for local merchants, venues, restaurants & event organizers.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Business Details */}
        <div className="p-6 rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Building2 className="w-4 h-4" />
            <span>Business Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Business Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Palace Resort & Dining"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Primary Location / City <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hyderabad, Telangana"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Categories Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Business Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const selected = formData.categories.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Owner & Auth Credentials */}
        <div className="p-6 rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <UserPlus className="w-4 h-4" />
            <span>Owner & Account Credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Owner / Manager Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, ownerName: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Login Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. rahul@royalpalace.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contact Phone (WhatsApp) <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Initial Login Password <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Create partner password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Tax & Bank Details */}
        <div className="p-6 rounded-2xl bg-[#0c1220]/80 border border-slate-800/80 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <CreditCard className="w-4 h-4" />
            <span>Tax & Bank Details (Optional for Field Entry)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">GST Number</label>
              <input
                type="text"
                placeholder="22AAAAA0000A1Z5"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">PAN Number</label>
              <input
                type="text"
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Bank Account Number</label>
              <input
                type="text"
                placeholder="Account number"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Bank IFSC Code</label>
              <input
                type="text"
                placeholder="HDFC0001234"
                value={formData.bankIfsc}
                onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/manager"
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Onboarding Partner...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Submit & Generate HLP ID</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
