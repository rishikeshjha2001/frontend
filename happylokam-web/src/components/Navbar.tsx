'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Venues', href: '/venues' },
    { name: 'Services', href: '/services' },
    { name: 'Vendors', href: '/vendors' },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'py-3 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-b border-gray-200/50' 
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.4)] group-hover:shadow-[0_0_25px_rgba(244,63,94,0.6)] transition-all group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-2xl tracking-tight transition-colors ${isScrolled ? 'text-gray-900' : 'text-gray-900 drop-shadow-sm'}`}>
                happylokam<span className="text-rose-500">.</span>
              </span>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="relative px-5 py-2 text-sm font-semibold rounded-full transition-colors group"
                  >
                    <span className={`relative z-10 ${isActive ? 'text-rose-600' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-rose-50 rounded-full border border-rose-100"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link 
                href="/login"
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-xl hover:bg-gray-100/80 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link 
                href="/register"
                className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-rose-600 to-rose-500 text-white px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:-translate-y-0.5 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Join Free
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl md:hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    pathname === link.href 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <div className="grid grid-cols-2 gap-3 pb-2">
                <Link 
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center gap-2 py-3 bg-gray-100 text-gray-800 font-bold rounded-xl"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center gap-2 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-md shadow-rose-500/20"
                >
                  Join Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
