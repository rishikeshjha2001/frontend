'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  List,
  PlusCircle,
  CalendarDays,
  CreditCard,
  Bell,
  LogOut,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import type { Metadata } from 'next';
import { toast } from 'sonner';

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    document.title = 'Partner Dashboard | happylokam';
  }, []);
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/v1/auth/me', {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        if (data.user?.role !== 'PARTNER' && data.user?.role !== 'ADMIN' && data.user?.role !== 'SUPER_ADMIN') {
          toast.error('Partner access required. Please sign in with a partner account.');
          router.push('/partner/login');
          return;
        }
        setPartner(data.user);
      } catch (error) {
        toast.error('Failed to load profile. Please login again.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
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

  const navItems = [
    { name: 'Dashboard', href: '/partner', icon: LayoutDashboard },
    { name: 'My Listings', href: '/partner/listings', icon: List },
    { name: 'Add Listing', href: '/partner/listings/new', icon: PlusCircle },
    { name: 'Bookings', href: '/partner/bookings', icon: CalendarDays },
    { name: 'Subscription', href: '/partner/subscription', icon: CreditCard },
    { name: 'Notifications', href: '/partner/notifications', icon: Bell },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-rose-600 tracking-tight">happylokam</h2>
            <p className="text-sm text-gray-500 mt-1">Partner Portal</p>
          </div>

          <div className="px-6 py-4 border-t border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {partner?.firstName} {partner?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{partner?.email}</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors
                    ${isActive 
                      ? 'bg-rose-50 text-rose-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-rose-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 h-16 flex items-center justify-between">
            <h2 className="text-xl font-bold text-rose-600">happylokam</h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
