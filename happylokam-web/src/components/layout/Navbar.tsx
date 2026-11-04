'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navData = {
    venues: {
      links: [
        { name: "Banquet Halls", href: "/banquet-halls" },
        { name: "Wedding Venues & Gardens", href: "/wedding-venues" },
        { name: "Birthday Party Halls", href: "/birthdays" },
        { name: "Engagement & Roka Venues", href: "/engagements" },
      ],
      featured: {
        title: "Dandiya Nights & Venues",
        desc: "Book royal venues and special celebration passes.",
        img: "/slide4.jpg",
        link: "/dandiya"
      }
    },
    vendors: {
      links: [
        { name: "Wedding Photographer", href: "/search?q=photographer" },
        { name: "Premium Catering", href: "/search?q=catering" },
        { name: "Bridal Makeup", href: "/search?q=makeup-artist" },
        { name: "DJ & Sound", href: "/search?q=dj" },
      ],
      featured: {
        title: "Top Photographers",
        desc: "Capture every moment perfectly.",
        img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
        link: "/search?category=photography"
      }
    },
    planning: {
      links: [
        { name: "Wedding Planners", href: "/search?q=planner" },
        { name: "Decorators & Florists", href: "/search?q=decorator" },
        { name: "Pandit & Puja Setup", href: "/search?q=pandit" },
        { name: "LokSafari Expeditions", href: "/loksafari" },
      ],
      featured: {
        title: "Luxury Decor",
        desc: "Transform your venue with floral magic.",
        img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop",
        link: "/search?category=decor"
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-rose-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-4xl font-playfair font-black tracking-tight text-rose-600 drop-shadow-sm hover:scale-105 transition-transform">
              happylokam
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8 relative h-full">
            <Link href="/" className="text-slate-700 hover:text-rose-600 font-bold transition-all hover:-translate-y-0.5">
              Home
            </Link>

            {/* Venues Large Dropdown */}
            <div className="group h-full flex items-center relative" onMouseEnter={() => setActiveDropdown('venues')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="text-slate-700 hover:text-rose-600 font-bold flex items-center gap-1 transition-all hover:-translate-y-0.5">
                Venues <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'venues' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'venues' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-24 w-[600px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(225,29,72,0.1)] border border-rose-100 overflow-hidden flex"
                  >
                    <div className="w-1/2 p-6 flex flex-col justify-center">
                      <h3 className="text-rose-600 font-black uppercase tracking-widest text-xs mb-4">Explore Venues</h3>
                      {navData.venues.links.map((item) => (
                        <Link key={item.name} href={item.href} className="block py-3 text-base font-bold text-slate-700 hover:text-rose-600 transition-colors border-b border-gray-50 last:border-0 hover:translate-x-2 transform duration-200">
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="w-1/2 p-4">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden group/card block">
                        <img src={navData.venues.featured.img} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" alt="Featured" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                          <h4 className="text-white font-playfair font-black text-2xl mb-1">{navData.venues.featured.title}</h4>
                          <p className="text-rose-100 text-sm font-medium mb-3">{navData.venues.featured.desc}</p>
                          <Link href={navData.venues.featured.link} className="inline-block text-xs font-bold uppercase tracking-wider text-white border border-white/50 px-4 py-2 rounded-full hover:bg-white hover:text-rose-600 transition-colors">
                            Discover
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vendors Large Dropdown */}
            <div className="group h-full flex items-center relative" onMouseEnter={() => setActiveDropdown('vendors')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="text-slate-700 hover:text-rose-600 font-bold flex items-center gap-1 transition-all hover:-translate-y-0.5">
                Vendors <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'vendors' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'vendors' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-24 w-[600px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(225,29,72,0.1)] border border-rose-100 overflow-hidden flex"
                  >
                    <div className="w-1/2 p-6 flex flex-col justify-center">
                      <h3 className="text-rose-600 font-black uppercase tracking-widest text-xs mb-4">Explore Vendors</h3>
                      {navData.vendors.links.map((item) => (
                        <Link key={item.name} href={item.href} className="block py-3 text-base font-bold text-slate-700 hover:text-rose-600 transition-colors border-b border-gray-50 last:border-0 hover:translate-x-2 transform duration-200">
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="w-1/2 p-4">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden group/card block">
                        <img src={navData.vendors.featured.img} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" alt="Featured" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                          <h4 className="text-white font-playfair font-black text-2xl mb-1">{navData.vendors.featured.title}</h4>
                          <p className="text-rose-100 text-sm font-medium mb-3">{navData.vendors.featured.desc}</p>
                          <Link href={navData.vendors.featured.link} className="inline-block text-xs font-bold uppercase tracking-wider text-white border border-white/50 px-4 py-2 rounded-full hover:bg-white hover:text-rose-600 transition-colors">
                            Discover
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Planning Large Dropdown */}
            <div className="group h-full flex items-center relative" onMouseEnter={() => setActiveDropdown('planning')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="text-slate-700 hover:text-rose-600 font-bold flex items-center gap-1 transition-all hover:-translate-y-0.5">
                Planning <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'planning' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'planning' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-24 w-[600px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(225,29,72,0.1)] border border-rose-100 overflow-hidden flex"
                  >
                    <div className="w-1/2 p-6 flex flex-col justify-center">
                      <h3 className="text-rose-600 font-black uppercase tracking-widest text-xs mb-4">Planning & Decor</h3>
                      {navData.planning.links.map((item) => (
                        <Link key={item.name} href={item.href} className="block py-3 text-base font-bold text-slate-700 hover:text-rose-600 transition-colors border-b border-gray-50 last:border-0 hover:translate-x-2 transform duration-200">
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="w-1/2 p-4">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden group/card block">
                        <img src={navData.planning.featured.img} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" alt="Featured" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                          <h4 className="text-white font-playfair font-black text-2xl mb-1">{navData.planning.featured.title}</h4>
                          <p className="text-rose-100 text-sm font-medium mb-3">{navData.planning.featured.desc}</p>
                          <Link href={navData.planning.featured.link} className="inline-block text-xs font-bold uppercase tracking-wider text-white border border-white/50 px-4 py-2 rounded-full hover:bg-white hover:text-rose-600 transition-colors">
                            Discover
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/loksafari" className="text-slate-700 hover:text-rose-600 font-bold transition-all hover:-translate-y-0.5">
              LokSafari
            </Link>
            
            <Link href="/about" className="text-slate-700 hover:text-rose-600 font-bold transition-all hover:-translate-y-0.5">
              About Us
            </Link>
          </div>

          {/* Right side Auth / Profile */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link href={user.role === 'PARTNER' ? '/partner/dashboard' : '/dashboard'} className="flex items-center gap-2 text-slate-700 hover:text-rose-600 font-bold transition-all">
                  <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 border border-rose-200 shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  {user.name || (user.role === 'PARTNER' ? 'Partner Panel' : 'My Dashboard')}
                </Link>
                <button 
                  onClick={async () => { await logout(); window.location.href = '/'; }}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login?role=partner" className="text-sm text-slate-500 hover:text-rose-600 font-bold transition-colors">
                  For Partners
                </Link>
                <div className="w-px h-5 bg-gray-300 mx-1"></div>
                <Link href="/login" className="text-slate-700 hover:text-rose-600 font-bold transition-colors">
                  Login
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white px-8 py-3 rounded-full font-black shadow-[0_8px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_10px_25px_rgba(225,29,72,0.4)] hover:-translate-y-0.5 transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-slate-700 hover:text-rose-600 focus:outline-none">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-rose-50 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg">Home</Link>
              <Link href="/banquet-halls" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg">Banquet Halls</Link>
              <Link href="/wedding-venues" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg">Wedding Venues</Link>
              <Link href="/dandiya" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg">Dandiya Night Passes</Link>
              <Link href="/birthdays" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg">Birthday Celebrations</Link>
              <Link href="/engagements" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg">Engagements & Roka</Link>
              <Link href="/loksafari" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg">LokSafari Expeditions</Link>
              <Link href="/explore" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg">Explore All Catalog</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg">About Us</Link>
              
              <div className="border-t border-rose-100 pt-4">
                {isAuthenticated && user ? (
                  <>
                    <Link href={user.role === 'PARTNER' ? '/partner/dashboard' : '/dashboard'} className="block px-3 py-2 text-base font-bold text-rose-600 bg-rose-50 rounded-lg">
                      {user.name || (user.role === 'PARTNER' ? 'Partner Panel' : 'My Dashboard')}
                    </Link>
                    <button onClick={async () => { await logout(); window.location.href = '/'; }} className="block w-full text-left px-3 py-2 mt-2 text-base font-bold text-slate-500 hover:text-rose-600 rounded-lg">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login?role=partner" className="block px-3 py-2 text-base font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg">For Partners</Link>
                    <Link href="/login" className="block px-3 py-2 text-base font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg">Login</Link>
                    <Link href="/register" className="block px-3 py-2 mt-2 text-base font-bold text-center text-white bg-rose-600 rounded-lg shadow-sm">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
