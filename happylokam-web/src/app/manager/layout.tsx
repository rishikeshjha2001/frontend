'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  QrCode,
  CheckSquare,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const managerNavItems = [
  { name: 'Dashboard', href: '/manager', icon: LayoutDashboard },
  { name: 'My Partners', href: '/manager/partners', icon: Users },
  { name: 'Onboard Partner', href: '/manager/partners/onboard', icon: UserPlus },
  { name: 'Ticket Scanner', href: '/manager/scanner', icon: QrCode },
  { name: 'Notes & Tasks', href: '/manager/notes', icon: CheckSquare },
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Manager Operating System | happylokam';
    const fetchManager = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch('/api/v1/auth/me', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: 'include'
        });
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
        const data = await res.json();
        if (data?.user?.role !== 'MANAGER' && data?.user?.role !== 'ADMIN' && data?.user?.role !== 'SUPER_ADMIN') {
          toast.error('Manager access required');
          router.push('/login');
          return;
        }
        setUser(data.user);
      } catch (err) {
        toast.error('Session expired. Please log in.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include'
      }).catch(() => {});
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.clear();
      }
      toast.success('Logged out successfully');
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-xl shadow-blue-500/20 animate-pulse flex items-center justify-center">
          <div className="w-full h-full bg-[#070b14] rounded-2xl flex items-center justify-center">
            <span className="text-xl font-black tracking-tight text-white">hl</span>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-400">Loading Manager OS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0c1220]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/manager" className="flex items-center gap-3 group">
            {/* Logo with royal blue background and pure white happylokam text */}
            <div className="h-10 px-3 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-300">
              <span className="font-extrabold text-white text-base tracking-tight select-none">
                happylokam
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-800/50 w-fit">
                Field Manager OS
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/manager/scanner"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Fast Ticket Scan</span>
          </Link>

          {/* User Profile Badge */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-500/20">
              {user?.name ? user.name[0].toUpperCase() : 'M'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-white">{user?.name || 'Manager'}</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email || 'manager@happylokam.com'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c1220]/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between overflow-y-auto shrink-0 z-30"
            >
              <div className="p-4 space-y-1.5">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Manager Operations
                </div>
                {managerNavItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/manager' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      <span>{item.name}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-75" />}
                    </Link>
                  );
                })}
              </div>

              {/* Sidebar Footer Info */}
              <div className="p-4 border-t border-slate-800/80 m-4 rounded-2xl bg-gradient-to-b from-blue-950/20 to-transparent border border-blue-900/20">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Verified Field Manager</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Real-time partner onboarding, Dandiya ticket scanning, and direct ops sync.
                </p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#070b14] via-[#090e1a] to-[#070b14]">
          {children}
        </main>
      </div>
    </div>
  );
}
