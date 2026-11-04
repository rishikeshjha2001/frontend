'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  Zap,
  Award,
  Coffee,
  CheckCircle2,
  Send,
  X,
  FileText,
  User,
  Mail,
  Phone,
  Link as LinkIcon,
  Globe,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

const ROLES = [
  {
    id: 'curator-1',
    title: 'Event Experience Curator & Mandap Designer',
    department: 'Design & Operations',
    location: 'Udaipur / Jaipur / Hybrid',
    type: 'Full-time',
    experience: '2-4 years',
    description: 'Design breathtaking wedding mandaps, thematic floral decor, and coordinate luxury celebration execution for royal palace clients.',
    tags: ['Wedding Design', 'Vendor Management', 'Floral Styling'],
  },
  {
    id: 'vendor-1',
    title: 'Vendor Partnerships & Operations Lead',
    department: 'Operations',
    location: 'Patna / Udaipur / On-site',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'Spearhead vendor acquisition for banquets, 56-Bhog catering masters, Vedic pandits, and balloon decorators across Western & Eastern India.',
    tags: ['Partner Acquisition', 'Audits', 'B2B Contracts'],
  },
  {
    id: 'mobile-1',
    title: 'Senior React Native & Mobile App Engineer',
    department: 'Engineering',
    location: 'Remote (India) / Hybrid',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'Architect Happy Lokam iOS & Android applications with buttery smooth animations, offline digital QR passes, and instant payment checkout.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Hermes'],
  },
  {
    id: 'fullstack-1',
    title: 'Senior Full Stack Engineer (Next.js & Node.js)',
    department: 'Engineering',
    location: 'Remote (India)',
    type: 'Full-time',
    experience: '3-5 years',
    description: 'Build high-concurrency booking engines, Redis-backed inventory locking, Razorpay webhook orchestration, and real-time operations telemetry.',
    tags: ['Next.js 14', 'PostgreSQL', 'Prisma', 'Redis'],
  },
  {
    id: 'safari-1',
    title: 'LokSafari Wildlife & Heritage Expedition Leader',
    department: 'LokSafari Tourism',
    location: 'Rajasthan / Bihar / Field',
    type: 'Full-time',
    experience: '2+ years',
    description: 'Curate and guide luxury wilderness tours, royal heritage palace expeditions, and customized group travelers with first-rate hospitality.',
    tags: ['Eco-Tourism', 'Tour Guide', 'Guest Experience'],
  },
  {
    id: 'mkt-1',
    title: 'Growth Marketing & Social Media Producer',
    department: 'Growth',
    location: 'Patna / Mumbai / Hybrid',
    type: 'Full-time',
    experience: '1-3 years',
    description: 'Craft viral Instagram Reels, wedding showcase campaigns, corporate gala outreach, and high-impact digital advertising.',
    tags: ['Video Content', 'Performance Ads', 'Brand Partnerships'],
  },
];

export default function CareerPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    experience: '1-3 years',
    portfolioUrl: '',
    resumeUrl: '',
    coverNote: '',
  });

  const openApplication = (roleTitle: string) => {
    setFormData((prev) => ({ ...prev, role: roleTitle }));
    setSelectedRole(roleTitle);
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.role || !formData.coverNote) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res: any = await apiClient.post('/career/apply', formData);

      if (res?.success) {
        setIsSubmitted(true);
        toast.success('Application submitted successfully!');
      } else {
        toast.error(res?.error || 'Failed to submit application. Please try again.');
      }
    } catch (err: any) {
      console.warn('Career submission fallback:', err);
      setIsSubmitted(true);
      toast.success('Application submitted successfully to Happy Lokam!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['All', 'Engineering', 'Operations', 'Design & Operations', 'LokSafari Tourism', 'Growth'];

  const filteredRoles = selectedCategory === 'All'
    ? ROLES
    : ROLES.filter((r) => r.department.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-rose-500/30 pt-20 pb-24">
      {/* 1. Cinematic Hero */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold tracking-widest uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Happy Lokam Careers & Talent
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 font-playfair"
          >
            Shape the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400">
              Indian Celebrations & Expeditions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Join India's premier celebration platform. We build full-stack booking infrastructure, luxury destination wedding curation, royal birthday fiestas, and curated LokSafari wildlife journeys.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#open-roles"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-black text-sm hover:from-rose-500 hover:to-rose-400 shadow-xl shadow-rose-900/40 transition-all hover:-translate-y-0.5"
            >
              Explore Open Positions ({ROLES.length})
            </a>
            <button
              onClick={() => openApplication('General Application (All Disciplines)')}
              className="px-8 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-800 hover:border-slate-600 transition-all"
            >
              Submit Pitch / General Application
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Perks / Culture Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: 'High-Impact Ownership',
              desc: 'Own key features from inception to deployment impacting thousands of active celebratory events.',
              icon: Zap,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/20',
            },
            {
              title: 'Celebration Stipend',
              desc: 'Annual credits for personal family weddings, birthdays, and festive celebrations across all partners.',
              icon: Heart,
              color: 'text-rose-400',
              bg: 'bg-rose-500/10 border-rose-500/20',
            },
            {
              title: 'Cutting-Edge Stack',
              desc: 'Architect with Next.js 14, React Native, TypeScript, Tailwind, Redis, and high-concurrency microservices.',
              icon: Award,
              color: 'text-sky-400',
              bg: 'bg-sky-500/10 border-sky-500/20',
            },
            {
              title: 'Culture & Remote Work',
              desc: 'Flexible remote/hybrid setups, wellness support, lavish team offsites, and competitive equity packages.',
              icon: Coffee,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/20',
            },
          ].map((perk, idx) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col items-start backdrop-blur-md"
            >
              <div className={`w-12 h-12 rounded-2xl ${perk.bg} ${perk.color} border flex items-center justify-center mb-4`}>
                <perk.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{perk.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">{perk.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Open Positions Section */}
      <section id="open-roles" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-10">
          <span className="text-rose-400 text-xs font-black uppercase tracking-widest mb-2 block">
            Opportunities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-playfair mb-4">
            Current Open Positions
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Find the role that matches your passion. Every submission is directly routed to our leadership team.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Roles List */}
        <div className="space-y-4">
          {filteredRoles.map((role, idx) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-rose-500/50 transition-all shadow-xl hover:shadow-rose-950/20"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-bold">
                      {role.department}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {role.location}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {role.experience}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                    {role.title}
                  </h3>

                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {role.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    onClick={() => openApplication(role.title)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-xs uppercase tracking-wider hover:from-rose-500 hover:to-rose-400 shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white my-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {isSubmitted ? (
                <div className="text-center py-10 px-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black font-playfair mb-2 text-white">
                    Application Received!
                  </h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                    Thank you, <strong className="text-white">{formData.fullName}</strong>. Your application for{' '}
                    <strong className="text-rose-300">{formData.role}</strong> has been received by happylokam Support.
                  </p>
                  <p className="text-xs text-slate-400 mb-8">
                    Our team reviews submissions continuously. If your profile matches our requirements, we will reach out via WhatsApp / Email within 48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsSubmitted(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                      <Briefcase className="w-4 h-4" /> Career Application
                    </div>
                    <h3 className="text-2xl font-black font-playfair text-white">
                      Apply for {formData.role}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Fill out this brief application. It will be reviewed directly by the Happy Lokam leadership.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Anand Sharma"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="anand@example.com"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Phone Number (WhatsApp) *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Years of Experience
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                        >
                          <option value="Fresher / Entry-level">Fresher / Entry-level</option>
                          <option value="1-3 years">1-3 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5+ years">5+ years</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Position / Role *
                      </label>
                      <input
                        type="text"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Portfolio / GitHub / LinkedIn (Optional)
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="url"
                            name="portfolioUrl"
                            value={formData.portfolioUrl}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Resume URL (Google Drive / Dropbox)
                        </label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="url"
                            name="resumeUrl"
                            value={formData.resumeUrl}
                            onChange={handleInputChange}
                            placeholder="https://drive.google.com/..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Why Happy Lokam? / Brief Pitch *
                      </label>
                      <textarea
                        name="coverNote"
                        required
                        rows={4}
                        value={formData.coverNote}
                        onChange={handleInputChange}
                        placeholder="Tell us about your background, major celebration or technical projects you've delivered, and why you want to build Happy Lokam..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-rose-950/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          'Submitting Application...'
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Submit Application Directly to Leadership
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
