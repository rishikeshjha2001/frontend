import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck, HeartHandshake, Sparkles, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-[#0B0F19] pt-32 pb-12 overflow-hidden border-t-8 border-rose-600 font-sans">
      {/* Background aesthetic blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -left-64 w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Floating Newsletter & Trust Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 mb-20 shadow-2xl flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-3xl font-black font-playfair text-white mb-4">Join the Celebration</h3>
            <p className="text-slate-400 font-medium mb-6 max-w-md mx-auto lg:mx-0">Get exclusive venue deals, premium vendor discounts, and celebration ideas delivered directly to your inbox.</p>
            <div className="flex relative max-w-md mx-auto lg:mx-0">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full bg-white/10 border border-white/20 rounded-full py-4 pl-6 pr-32 text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6 font-bold flex items-center gap-2 transition-all hover:scale-105">
                Subscribe <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold">100% Secure</h4>
                <p className="text-slate-400 text-sm">Verified Partners</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-400">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold">Zero Platform Fee</h4>
                <p className="text-slate-400 text-sm">Book directly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block text-4xl font-black font-playfair tracking-tight text-white mb-6 hover:text-rose-400 transition-colors">
              happylokam<span className="text-rose-600">.</span>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed mb-8 max-w-sm">
              India's premium celebration platform. We make every moment unforgettable without the planning pressure. From weddings to corporate events, find your perfect match.
            </p>
            <div className="space-y-4">
              <a href="tel:+918969255561" className="flex items-center gap-4 text-slate-300 hover:text-rose-400 transition-colors group">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                  <Phone className="w-4 h-4 text-rose-400" />
                </div>
                <span className="font-bold">+91 89692 55561</span>
              </a>
              <a href="mailto:info@happylokam.com" className="flex items-center gap-4 text-slate-300 hover:text-rose-400 transition-colors group">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                  <Mail className="w-4 h-4 text-rose-400" />
                </div>
                <span className="font-bold">info@happylokam.com</span>
              </a>
              <div className="flex items-center gap-4 text-slate-300 group">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-rose-400" />
                </div>
                <span className="font-bold">Kanti Factory, Patna</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-black tracking-widest uppercase text-xs mb-8 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-rose-500" /> Discover
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><Link href="/banquet-halls" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Banquet Halls</Link></li>
              <li><Link href="/wedding-venues" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Wedding Venues</Link></li>
              <li><Link href="/dandiya" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Dandiya Night Passes</Link></li>
              <li><Link href="/birthdays" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Birthday Celebrations</Link></li>
              <li><Link href="/loksafari" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">LokSafari Expeditions</Link></li>
              <li><Link href="/explore" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Explore All Catalog</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-black tracking-widest uppercase text-xs mb-8">Partners</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><Link href="/partner/register" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">List Your Venue</Link></li>
              <li><Link href="/partner/dashboard" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Partner Login</Link></li>
              <li><Link href="/guidelines" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Quality Guidelines</Link></li>
              <li><Link href="/partner/pricing" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Pricing & Plans</Link></li>
              <li><Link href="/partner/support" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Partner Support</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-black tracking-widest uppercase text-xs mb-8">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><Link href="/about" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-rose-400 hover:translate-x-1 inline-block transition-all">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 font-bold text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} happylokam. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-bold text-sm mr-2">Connect:</span>
            <a href="https://www.instagram.com/happylokam1/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-rose-600 hover:text-white transition-all transform hover:scale-110">
              <span className="sr-only">Instagram</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://in.linkedin.com/company/happylokam" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#0077b5] hover:text-white transition-all transform hover:scale-110">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
