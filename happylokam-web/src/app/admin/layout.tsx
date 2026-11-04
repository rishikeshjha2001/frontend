'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  CalendarDays,
  Sparkles,
  Tag,
  Bell,
  Download,
  LifeBuoy,
  Menu,
  X,
  LogOut,
  CreditCard,
  Banknote,
  ShieldAlert,
  Search,
  Image,
  Layers,
  CheckSquare,
  Package,
  Compass,
  Sliders,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Monitor,
  Laptop,
  Lock,
  Shield,
  Loader2,
  KeyRound
} from 'lucide-react';

interface NavGroup {
  groupTitle: string;
  items: {
    name: string;
    href: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: 'Core Operations',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Bookings & Passes', href: '/admin/bookings', icon: Calendar },
      { name: 'Events & Tickets', href: '/admin/events', icon: CalendarDays },
      { name: 'Career Applications', href: '/admin/career', icon: Briefcase, badge: 'Talent', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      { name: 'Platform Activities', href: '/admin/notifications', icon: Bell, badge: 'Live', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
      { name: 'Support Desk', href: '/admin/support', icon: LifeBuoy, badge: 'Help', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    ],
  },
  {
    groupTitle: 'LokSafari Expeditions',
    items: [
      { name: 'LokSafari Circuits', href: '/admin/loksafari', icon: Compass, badge: 'Active', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    ],
  },
  {
    groupTitle: 'Partner Ecosystem & Fees',
    items: [
      { name: 'Partners Directory', href: '/admin/partners', icon: Briefcase },
      { name: '₹99 Subscription Control', href: '/admin/partners/subscriptions', icon: Zap, badge: 'Toggle', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
      { name: 'Partner Services', href: '/admin/services', icon: CheckSquare },
      { name: 'KYC Verifications', href: '/admin/partners/verifications', icon: ShieldCheck },
      { name: 'Field Managers', href: '/admin/managers', icon: ShieldAlert },
    ],
  },
  {
    groupTitle: 'CMS & Growth',
    items: [
      { name: 'Custom Sections & Items', href: '/admin/sections', icon: Sparkles, badge: 'Active', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
      { name: 'Hero Banners CMS', href: '/admin/hero', icon: Layers },
      { name: 'Broadcast Alerts', href: '/admin/notifications/broadcast', icon: Bell },
      { name: 'Offers & Coupons', href: '/admin/offers', icon: Tag },
      { name: 'Media Library', href: '/admin/media', icon: Image },
    ],
  },
  {
    groupTitle: 'Finance & Audit',
    items: [
      { name: 'Payments Ledger', href: '/admin/payments', icon: CreditCard },
      { name: 'Partner Payouts', href: '/admin/payouts', icon: Banknote },
      { name: 'Referrals & QR', href: '/admin/referrals', icon: Sparkles },
      { name: 'Data Export', href: '/admin/export', icon: Download },
    ],
  },
  {
    groupTitle: 'Platform Controls',
    items: [
      { name: 'System Settings', href: '/admin/settings', icon: Sliders },
      { name: 'Customer Accounts', href: '/admin/users', icon: Users },
      { name: 'Support Desk', href: '/admin/support', icon: LifeBuoy },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Responsive / Viewport
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileOverride, setMobileOverride] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1440, height: 900 });

  // Inline Quick Admin Auth State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const checkAuth = async () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    // Optimistically load cached user for instant rendering
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && (u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' || u.role === 'MANAGER')) {
          setAdminUser(u);
        }
      } catch (e) {}
    }

    // Verify token or HttpOnly cookie with backend
    try {
      const res = await fetch('/api/v1/auth/me', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user || data.data || data;
        if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'MANAGER')) {
          setAdminUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
          setIsAuthorized(true);
          setAuthChecking(false);
          return;
        }
      }

      // If token expired or unauthorized (401/403), require executive re-authentication
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAdminUser(null);
        setIsAuthorized(false);
        setAuthChecking(false);
        return;
      }
    } catch (e) {
      // In offline/network hiccup, allow cached admin if token exists
      if (token && userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u && (u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' || u.role === 'MANAGER')) {
            setAdminUser(u);
            setIsAuthorized(true);
            setAuthChecking(false);
            return;
          }
        } catch {}
      }
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    document.title = 'Executive Admin Operating System | happylokam';

    checkAuth();

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    try {
      const cleanEmail = authEmail.trim().toLowerCase();
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: authPassword }),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Authentication failed');

      const role = data.user?.role || data.data?.user?.role;
      if (role !== 'ADMIN' && role !== 'SUPER_ADMIN' && role !== 'MANAGER') {
        throw new Error('Administrative authority required. Access denied for this role.');
      }

      const token = data.token || data.data?.token || data.accessToken;
      if (token) localStorage.setItem('token', token);

      const userObj = data.user || data.data?.user;
      if (userObj) {
        localStorage.setItem('user', JSON.stringify(userObj));
        setAdminUser(userObj);
      }

      toast.success('Executive authentication successful. Welcome.');
      setIsAuthorized(true);
      setAuthChecking(false);
    } catch (err: any) {
      toast.error(err.message || 'Invalid administrative credentials');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
      }).catch(() => {});
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setIsAuthorized(false);
      setAdminUser(null);
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  // 1. Consistent Loading Placeholder for SSR & Initial Hydration (Prevents Error #418 & DOM mismatch)
  if (!mounted || authChecking) {
    return (
      <div className="min-h-screen bg-[#05070f] text-white flex flex-col justify-center items-center font-sans">
        <div className="relative mb-6">
          <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
          <Shield className="w-5 h-5 text-rose-500 absolute inset-0 m-auto" />
        </div>
        <p className="text-sm font-bold text-white tracking-wide">happylokam Executive Admin OS</p>
        <p className="text-xs text-slate-400 mt-1">Verifying encrypted administrative session...</p>
      </div>
    );
  }

  // 2. Unauthenticated Executive Gateway (Allows direct inline authentication without crashing)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#05070f] text-white flex flex-col justify-center items-center px-4 font-sans relative selection:bg-rose-500/30">
        {/* Ambient Glows */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/10 blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-md w-full bg-[#090d1a]/95 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600/20 to-amber-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/10">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Admin Gateway</h1>
            <p className="text-xs text-slate-400">
              Administrative credentials required to operate the Executive OS.
            </p>
          </div>

          <form onSubmit={handleInlineLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email ID
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@happylokam.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500/60 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Passcode
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500/60 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {authSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate Executive Access</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              ← Main Website
            </Link>
            <Link href="/login?redirect=/admin" className="hover:text-rose-400 transition-colors">
              Standard Login Page →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized Executive Workstation
  return (
    <div className="min-h-screen bg-[#05070f] text-white flex flex-col font-sans selection:bg-rose-500/30">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-rose-600/10 blur-[140px]" />
      </div>

      {/* Responsive Workstation Policy Banner (On mobile viewports with override) */}
      <div className={mobileOverride ? "hidden" : "flex lg:hidden min-h-screen flex-col justify-center items-center px-4 py-12 relative z-30"}>
        <div className="relative z-10 max-w-lg w-full bg-[#090d1a]/95 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Workstation Restriction Enforced</span>
          </div>

          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-indigo-500/20 to-blue-500/20 border border-white/15 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <Monitor className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Desktop Workstation Recommended
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              The <strong className="text-white">happylokam Executive Admin OS</strong> is designed for high-density administrative operations.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setMobileOverride(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              <span>Continue on Mobile</span>
            </button>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs tracking-wide transition-all"
            >
              <span>Main Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Executive Workstation Shell */}
      <div className={mobileOverride ? "flex-1 flex flex-col" : "hidden lg:flex lg:flex-1 lg:flex-col"}>

      {/* Top Header */}
      <header className="h-16 lg:h-20 border-b border-white/10 bg-[#090d1a]/85 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-9 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <span className="font-extrabold text-white text-sm tracking-tight select-none">
                happylokam
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/50">
                Executive OS
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Production Live</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          
          <Link
            href="/admin/partners/subscriptions"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>₹99 Fee System</span>
          </Link>

          <Link
            href="/loksafari"
            target="_blank"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold hover:text-white hover:bg-white/10 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Customer Safari</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* Live Platform Activity Notifications Bell */}
          <Link
            href="/admin/notifications"
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            title="Live Platform Activity Feed"
          >
            <Bell className="w-4 h-4 text-rose-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse border border-[#090d1a]" />
          </Link>

          <div className="flex items-center gap-3 pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-rose-500/20">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-white leading-none">{adminUser?.name || 'Super Administrator'}</p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{adminUser?.role || 'Authority Level 1'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-20">
        
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed lg:static top-16 bottom-0 left-0 z-40 w-72 bg-[#090d1a]/95 lg:bg-[#090d1a]/85 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between shrink-0 shadow-2xl lg:shadow-none"
            >
              
              {/* Sidebar Search Bar */}
              <div className="p-3 border-b border-white/5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Quick jump..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500/60 transition-all"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation Groups Feed */}
              <nav className="p-3 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                {NAV_GROUPS.map((group) => {
                  const filteredItems = group.items.filter(item =>
                    !searchFilter || item.name.toLowerCase().includes(searchFilter.toLowerCase())
                  );

                  if (filteredItems.length === 0) return null;

                  return (
                    <div key={group.groupTitle} className="space-y-1">
                      <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>{group.groupTitle}</span>
                        <span className="text-[9px] text-slate-400 font-medium">{filteredItems.length}</span>
                      </div>

                      {filteredItems.map((item) => {
                        const isActive =
                          pathname === item.href ||
                          (pathname === '/' && item.href === '/admin') ||
                          (pathname.startsWith(item.href) && item.href !== '/admin') ||
                          (item.href !== '/admin' && pathname.startsWith(item.href.replace('/admin', '')));
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => {
                              if (window.innerWidth < 1024) setSidebarOpen(false);
                            }}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                              isActive
                                ? 'bg-gradient-to-r from-rose-600 via-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/30'
                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                              <span>{item.name}</span>
                            </div>

                            {item.badge && (
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-white/10 text-white border-white/20'}`}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  );
                })}
              </nav>

              {/* Bottom Quick Status & Helper */}
              <div className="p-3 border-t border-white/10 bg-black/20 m-2 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>PostgreSQL & APIs Active</span>
                  </div>
                  <span className="text-[10px] text-slate-400">v2.4</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400 font-medium">
                  <Link href="/admin/settings" className="hover:text-rose-400 transition-colors">
                    System Toggles
                  </Link>
                  <Link href="/admin/partners/subscriptions" className="hover:text-amber-400 transition-colors">
                    ₹99 Plan Rules
                  </Link>
                  <Link href="/admin/export" className="hover:text-blue-400 transition-colors">
                    Backup Data
                  </Link>
                </div>
              </div>

            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#05070f] via-[#070b14] to-[#05070f]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      </div>

    </div>
  );
}
