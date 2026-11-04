'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Store, Loader2, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function PremiumLoginPage() {
  const [activeTab, setActiveTab] = useState<'customer' | 'partner'>('customer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.startsWith('admin.')) {
      setIsAdminSubdomain(true);
      document.title = 'Admin/Manager Login | happylokam';
    } else {
      const search = window.location.search;
      if (search.includes('role=partner')) {
        setActiveTab('partner');
        document.title = 'Partner Login | happylokam';
      } else {
        document.title = 'User Login | happylokam';
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hlpId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = formData.email ? formData.email.trim().toLowerCase() : '';
    const cleanHlpId = formData.hlpId ? formData.hlpId.trim() : '';

    const payload: any = { password: formData.password };
    
    if (isAdminSubdomain) {
      payload.email = cleanEmail;
    } else if (activeTab === 'partner') {
      if (cleanHlpId) payload.hlpId = cleanHlpId;
      else payload.email = cleanEmail;
    } else {
      payload.email = cleanEmail;
    }

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Login failed');

      toast.success('Welcome back to happylokam!');
      
      // Store credentials and profile details
      const authToken = data.token || data.data?.token || data.accessToken;
      if (authToken) { localStorage.setItem('token', authToken); }
      if (data.user || data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user || data.data?.user));
      }
      
      const role = data.user?.role || data.data?.user?.role;
      if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'MANAGER') window.location.href = '/admin';
      else if (role === 'PARTNER') window.location.href = '/partner';
      else {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/';
        window.location.href = redirect;
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      const payload = {
        idToken,
        name: user.displayName,
        role: activeTab === 'partner' ? 'PARTNER' : 'USER'
      };

      const res = await fetch('/api/v1/auth/firebase-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google Login failed');

      toast.success(`Welcome back to happylokam!`);
      
      // Store credentials and profile details
      const authToken = data.token || data.data?.token || data.accessToken;
      if (authToken) { localStorage.setItem('token', authToken); }
      if (data.user || data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user || data.data?.user));
      }

      const role = data.user?.role || data.data?.user?.role;
      if (role === 'SUPER_ADMIN') {
        window.location.href = '/admin';
      } else if (role === 'PARTNER') {
        window.location.href = '/partner';
      } else {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/';
        window.location.href = redirect;
      }
    } catch (err: any) {
      toast.error(err.message || 'Error with Google Login');
    } finally {
      setLoading(false);
    }
  };

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  };

  const handleSendOtp = async () => {
    if (otpPhone.replace(/\D/g, '').length !== 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    const fullPhone = `+91${otpPhone}`;
    try {
      setLoading(true);
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;
      const idToken = await user.getIdToken();

      const payload = {
        idToken,
        name: user.displayName || 'User',
        phone: user.phoneNumber,
        role: activeTab === 'partner' ? 'PARTNER' : 'USER'
      };

      const res = await fetch('/api/v1/auth/firebase-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP Login failed');

      toast.success(`Welcome back to happylokam!`);
      setShowOtpModal(false);
      
      // Store user profile and auth token
      const authToken = data.token || data.data?.token || data.accessToken;
      if (authToken) { localStorage.setItem('token', authToken); }
      if (data.user || data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user || data.data?.user));
      }

      const role = data.user?.role || data.data?.user?.role;
      if (role === 'SUPER_ADMIN') {
        window.location.href = '/admin';
      } else if (role === 'PARTNER') {
        window.location.href = '/partner';
      } else {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/';
        window.location.href = redirect;
      }
    } catch (err: any) {
      toast.error("Invalid OTP or authentication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center relative overflow-hidden selection:bg-rose-500/30">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-rose-900/20 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-rose-600/10 blur-[150px]"
        />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10 min-h-screen py-6 sm:py-12">
        <div className="w-full flex flex-col lg:flex-row bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] border border-zinc-800/50 overflow-hidden shadow-2xl">
          
          {/* Left Side - Branding (Desktop only) */}
          <div className="hidden lg:flex lg:w-5/12 p-12 lg:p-16 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-rose-600 to-rose-950">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Link href="/" className="inline-flex items-center gap-2 text-white">
                  <Sparkles className="w-6 h-6 text-rose-300" />
                  <span className="text-2xl font-bold tracking-tight">happylokam</span>
                </Link>
                <h1 className="mt-12 text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                  Where every <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-rose-400">
                    celebration
                  </span> <br/>
                  begins.
                </h1>
                <p className="mt-6 text-rose-100/80 text-lg max-w-sm font-light">
                  Join India&apos;s most premium marketplace for event planning, venues, and specialized vendors.
                </p>
              </motion.div>
            </div>
            
            <div className="relative z-10 mt-12 lg:mt-0">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-12 h-12 rounded-full border-2 border-rose-600 bg-zinc-800 flex items-center justify-center z-[${5-i}] overflow-hidden`}>
                    <img src={`/slide${i}.jpg`} className="w-full h-full object-cover opacity-80" alt="Celebration" />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-rose-200 font-bold tracking-wide uppercase">Pan India Celebration Network</p>
              <p className="mt-1 text-sm text-rose-200/70 font-medium">Grow your business & reach more clients</p>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full lg:w-7/12 p-6 sm:p-12 lg:p-16 flex flex-col justify-center bg-zinc-950/50">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-md w-full mx-auto"
            >
              {/* Mobile Branding (Visible only on mobile/tablet) */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-7 h-7 text-rose-500" />
                <span className="text-2xl font-bold text-white tracking-tight">happylokam</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center lg:text-left">Welcome Back</h2>
              <p className="text-zinc-400 mb-6 sm:mb-10 text-center lg:text-left text-sm sm:text-base">Enter your details to access your account.</p>

              {/* Custom Animated Tab Switcher */}
              {!isAdminSubdomain && (
                <div className="relative flex p-1.5 bg-zinc-900 rounded-2xl mb-10 border border-zinc-800">
                  <div 
                    className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 transition-all duration-300 ease-in-out"
                    style={{ left: activeTab === 'customer' ? '6px' : 'calc(50%)' }}
                  />
                  
                  <button
                    type="button"
                    onClick={() => setActiveTab('customer')}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-colors z-10 ${
                      activeTab === 'customer' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <User className="w-4 h-4" /> User
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('partner')}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-colors z-10 ${
                      activeTab === 'partner' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Store className="w-4 h-4" /> Partner
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {isAdminSubdomain ? (
                    <motion.div
                      key="admin"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Admin / Manager Email</label>
                        <input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter authorized email"
                          className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-white placeholder:text-zinc-600"
                        />
                      </div>
                    </motion.div>
                  ) : activeTab === 'customer' ? (
                    <motion.div
                      key="customer"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Email or Phone Number</label>
                        <input
                          name="email"
                          type="text"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com or 9999999999"
                          className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-white placeholder:text-zinc-600"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="partner"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Partner ID or Email</label>
                        <input
                          name={formData.hlpId ? 'hlpId' : 'email'}
                          type="text"
                          required
                          placeholder="HLP12345 or email@example.com"
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.toLowerCase().startsWith('hlp')) {
                              setFormData({ ...formData, hlpId: val, email: '' });
                            } else {
                              setFormData({ ...formData, email: val, hlpId: '' });
                            }
                          }}
                          className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-white placeholder:text-zinc-600"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-zinc-300">Password</label>
                    <Link href="#" className="text-sm font-medium text-rose-500 hover:text-rose-400">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-white placeholder:text-zinc-600 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden py-4 px-4 rounded-xl font-semibold text-white shadow-[0_0_20px_rgba(225,29,72,0.2)] disabled:opacity-70 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 transition-all duration-300 group-hover:scale-[1.02]"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex-1 h-px bg-zinc-800"></div>
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Or continue with</span>
                <div className="flex-1 h-px bg-zinc-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 py-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-sm font-semibold text-white transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" onClick={(e) => { e.preventDefault(); setShowOtpModal(true); }} className="flex items-center justify-center gap-2 py-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-sm font-semibold text-white transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Phone OTP
                </button>
              </div>

              <div className="mt-10 text-center">
                <p className="text-zinc-400 text-sm">
                  Don't have an account yet?{' '}
                  <Link href="/register" className="font-semibold text-white hover:text-rose-400 transition-colors">
                    Create an account
                  </Link>
                </p>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Phone OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => { setShowOtpModal(false); setOtpSent(false); }} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
                ✕
              </button>
              
              <h3 className="text-2xl font-bold text-white mb-2">Phone Login</h3>
              <p className="text-zinc-400 mb-6 text-sm">We will send a one-time password to your phone.</p>

              {!otpSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Phone Number</label>
                    <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl focus-within:ring-2 focus-within:ring-rose-500/50 overflow-hidden">
                      <div className="px-4 py-3 bg-zinc-900 border-r border-zinc-800 text-zinc-400 font-semibold flex items-center justify-center">
                        +91
                      </div>
                      <input 
                        type="tel" 
                        maxLength={10}
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="99999 99999"
                        className="w-full px-4 py-3 bg-transparent text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Enter 6-digit OTP</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-white text-center tracking-widest text-lg font-mono"
                    />
                  </div>
                  <button 
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div id="recaptcha-container"></div>
    </div>
  );
}
