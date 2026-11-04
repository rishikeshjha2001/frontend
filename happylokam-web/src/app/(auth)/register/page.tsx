'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Store, Loader2, ArrowRight, ArrowLeft, Sparkles, Check, ChevronRight, CheckCircle2, MapPin, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const PARTNER_CATEGORIES = [
  'Catering', 'Parlour', 'Salon', 'Photography', 'Wedding', 'Birthday', 
  'Engagement', 'Office Decor', 'Makeup', 'Mehndi', 'Venue', 'LokSafari',
  'Event Planner', 'Pandit', 'Bouncers & Security', 'DJ & Sound', 'Florist'
];

export default function PremiumRegisterPage() {
  const [activeTab, setActiveTab] = useState<'customer' | 'partner'>('customer');
  const [partnerStep, setPartnerStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const search = window.location.search;
    if (search.includes('role=partner')) {
      setActiveTab('partner');
      document.title = 'Partner Registration | happylokam';
    } else {
      document.title = 'User Registration | happylokam';
    }
    const storedCode = localStorage.getItem('happylokam_referral_code');
    if (storedCode) {
      setFormData(prev => ({ ...prev, referredByCode: storedCode }));
    }
  }, []);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', businessName: '',
    categories: [] as string[], location: '',
    ownerName: '', gstNumber: '', panNumber: '', bankAccount: '', bankIfsc: '',
    referredByCode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const validateStep = (step: number) => {
    if (activeTab === 'customer') return true;
    
    if (step === 1) {
      if (!formData.ownerName || !formData.businessName || !formData.email || !formData.phone || !formData.password) {
        toast.error("Please fill in all basic information fields.");
        return false;
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        toast.error("Please enter a valid 10-digit phone number.");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        return false;
      }
    }
    
    if (step === 2) {
      if (formData.categories.length === 0) {
        toast.error("Please select at least one service category.");
        return false;
      }
      if (!formData.location) {
        toast.error("Please enter your business location.");
        return false;
      }
    }
    
    if (step === 3) {
      if (!/^\d{9,18}$/.test(formData.bankAccount)) {
        toast.error("Please enter a valid Bank Account Number (9-18 digits).");
        return false;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankIfsc)) {
        toast.error("Please enter a valid 11-character IFSC Code.");
        return false;
      }
      if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
        toast.error("Please enter a valid 15-character GST Number.");
        return false;
      }
      if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
        toast.error("Please enter a valid 10-character PAN Number.");
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(partnerStep)) {
      setPartnerStep(p => Math.min(p + 1, 3));
    }
  };
  const prevStep = () => setPartnerStep(p => Math.max(p - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'partner' && partnerStep < 3) {
      nextStep();
      return;
    }
    
    if (activeTab === 'partner' && !validateStep(3)) {
      return;
    }

    setLoading(true);
    const url = activeTab === 'customer' 
      ? '/api/v1/auth/register'
      : '/api/v1/auth/partner/register';

    const payload = activeTab === 'customer'
      ? { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password, referredByCode: formData.referredByCode }
      : { 
          name: formData.name, email: formData.email, phone: formData.phone, password: formData.password,
          businessName: formData.businessName, categories: formData.categories, location: formData.location,
          ownerName: formData.ownerName, gstNumber: formData.gstNumber, panNumber: formData.panNumber,
          bankAccount: formData.bankAccount, bankIfsc: formData.bankIfsc,
          referredByCode: formData.referredByCode
        };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Registration failed');

      // Store user details for UI (Session authentication is handled by HttpOnly cookie)
      if (data.user || data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user || data.data?.user));
      }

      toast.success('Account created successfully!');
      
      // Handle Razorpay ₹99 Sub Checkout
      if (data.subscription_id) {
        if (data.subscription_id.startsWith('mock_')) {
          // Simulate Razorpay success if no keys provided in backend
          toast.info("Simulating Razorpay Payment (No valid keys found)");
          setTimeout(() => {
            toast.success('Autopay Mandate setup successfully! (Simulated)');
            window.location.href = '/partner';
          }, 2000);
          return;
        }

        if ((window as any).Razorpay) {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YourKey',
            subscription_id: data.subscription_id,
            name: 'happylokam',
            description: '₹99/month Platform Autopay',
            handler: function (response: any) {
              toast.success('Autopay Mandate setup successfully!');
              window.location.href = '/partner';
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone
            },
            theme: {
              color: '#e11d48'
            }
          };
          const rzp1 = new (window as any).Razorpay(options);
          rzp1.open();
          return;
        }
      } 
      
      if (activeTab === 'customer') {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/';
        window.location.href = redirect;
      } else {
        window.location.href = '/partner';
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
      
      if (!res.ok) {
        if (res.status === 404 && activeTab === 'partner') {
          // New Partner - populate form and proceed
          setFormData({ ...formData, email: user.email || '', name: user.displayName || '', password: user.uid });
          toast.success("Account linked! Please complete your partner profile.");
          setPartnerStep(2);
          return;
        }
        throw new Error(data.error || 'Google Login failed');
      }

      toast.success(`Welcome to happylokam!`);
      
      // Store user profile for UI (Session managed by secure HttpOnly cookie)
      if (data.user || data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user || data.data?.user));
      }

      if (data.user?.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else if (data.user?.role === 'PARTNER') {
        router.push('/partner');
      } else {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/';
        window.location.href = redirect;
      }
    } catch (err: any) {
      toast.error(err.message || 'Error with Google Authentication');
    } finally {
      setLoading(false);
    }
  };

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPhone, setOtpPhone] = useState('+91');
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
    if (otpPhone.length < 12) {
      toast.error("Please enter a valid phone number with country code.");
      return;
    }
    try {
      setLoading(true);
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, otpPhone, appVerifier);
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
      
      if (!res.ok) {
        if (res.status === 404 && activeTab === 'partner') {
          // New Partner - populate form and proceed
          setFormData({ ...formData, phone: otpPhone, email: user.email || `${user.phoneNumber?.replace('+', '')}@happylokam.com`, password: user.uid });
          toast.success("Phone verified! Please complete your partner profile.");
          setShowOtpModal(false);
          setPartnerStep(2);
          return;
        }
        throw new Error(data.error || 'OTP Login failed');
      }

      toast.success(`Welcome to happylokam!`);
      setShowOtpModal(false);
      
      // Store user profile for UI (Session managed by secure HttpOnly cookie)
      if (data.user || data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user || data.data?.user));
      }

      if (data.user?.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else if (data.user?.role === 'PARTNER') {
        router.push('/partner');
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
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-rose-900/20 blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-rose-600/10 blur-[150px]"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10 min-h-screen py-12">
        <div className="w-full flex flex-col lg:flex-row bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] border border-zinc-800/50 overflow-hidden shadow-2xl min-h-[600px]">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:flex w-5/12 p-12 lg:p-16 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-rose-600 to-rose-950">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Link href="/" className="inline-flex items-center gap-2 text-white">
                  <Sparkles className="w-6 h-6 text-rose-300" />
                  <span className="text-2xl font-bold tracking-tight">happylokam</span>
                </Link>
                <h1 className="mt-12 text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                  Start your <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-rose-400">
                    journey
                  </span> <br/>
                  with us.
                </h1>
                <p className="mt-6 text-rose-100/80 text-lg max-w-sm font-light">
                  Join our growing community and make every celebration incredibly special.
                </p>
              </motion.div>
            </div>
            
            <div className="relative z-10 mt-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="p-3 bg-white/10 rounded-xl"><User className="w-6 h-6 text-rose-200" /></div>
                  <div>
                    <h3 className="font-semibold text-white">For Customers</h3>
                    <p className="text-sm text-rose-200/80">Find the perfect vendors for your event</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="p-3 bg-white/10 rounded-xl"><Store className="w-6 h-6 text-rose-200" /></div>
                  <div>
                    <h3 className="font-semibold text-white">For Partners</h3>
                    <p className="text-sm text-rose-200/80">Grow your business with premium listings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full lg:w-7/12 p-6 sm:p-12 lg:p-16 flex flex-col justify-center bg-zinc-950/50 relative overflow-y-auto max-h-none lg:max-h-[90vh] custom-scrollbar">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl w-full mx-auto"
            >
              {/* Mobile Branding (Visible only on small screens) */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                <Sparkles className="w-8 h-8 text-rose-500" />
                <span className="text-3xl font-bold text-white tracking-tight">happylokam</span>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2 text-center lg:text-left">Create an Account</h2>
              <p className="text-zinc-400 mb-8 text-center lg:text-left">Join the happylokam community today.</p>

              <div className="relative flex p-1.5 bg-zinc-900 rounded-2xl mb-8 border border-zinc-800">
                <div 
                  className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 transition-all duration-300 ease-in-out"
                  style={{ left: activeTab === 'customer' ? '6px' : 'calc(50%)' }}
                />
                
                <button
                  onClick={() => { setActiveTab('customer'); setPartnerStep(1); }}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-colors z-10 ${
                    activeTab === 'customer' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <User className="w-4 h-4" /> User
                </button>
                <button
                  onClick={() => setActiveTab('partner')}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl transition-colors z-10 ${
                    activeTab === 'partner' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Store className="w-4 h-4" /> Partner
                </button>
              </div>

              {activeTab === 'partner' && (
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= partnerStep ? 'bg-rose-600' : 'bg-zinc-800'}`} />
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* CUSTOMER FORM */}
                {activeTab === 'customer' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                      <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-5 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-white" placeholder="John Doe" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-5 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-white" placeholder="you@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Phone Number</label>
                        <div className="flex bg-zinc-900/50 border border-zinc-800 rounded-xl focus-within:ring-2 focus-within:ring-rose-500/50 overflow-hidden">
                          <div className="px-4 py-3 bg-zinc-900 border-r border-zinc-800 text-zinc-400 font-semibold flex items-center justify-center">
                            +91
                          </div>
                          <input name="phone" type="tel" maxLength={10} required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-3 bg-transparent text-white focus:outline-none" placeholder="99999 99999" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Gender</label>
                        <select name="gender" value={(formData as any).gender || ''} onChange={handleChange} className="w-full px-5 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-white appearance-none">
                          <option value="" className="bg-zinc-900 text-zinc-400">Select Gender</option>
                          <option value="Male" className="bg-zinc-900">Male</option>
                          <option value="Female" className="bg-zinc-900">Female</option>
                          <option value="Other" className="bg-zinc-900">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
                        <div className="relative">
                          <input name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} className="w-full px-5 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-white pr-12" placeholder="••••••••" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Referral Code (Optional)</label>
                      <input name="referredByCode" type="text" value={formData.referredByCode} onChange={handleChange} className="w-full px-5 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-white" placeholder="HLP-REF-XXXXX" />
                    </div>
                  </motion.div>
                )}

                {/* PARTNER MESSAGE */}
                {activeTab === 'partner' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-rose-950/30 border border-rose-500/20 rounded-2xl p-8 text-center">
                      <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                        <Store className="w-8 h-8 text-rose-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Join the Premium Network</h3>
                      <p className="text-rose-200/80 mb-6 leading-relaxed">
                        To maintain our high standards of service, partner accounts are exclusively created and verified by our Area Managers.
                      </p>
                      <p className="text-zinc-400 text-sm">
                        Please contact your local happylokam representative or area manager to initiate your onboarding process.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'customer' && (
                  <div className="flex gap-4 mt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 relative group overflow-hidden py-4 px-4 rounded-xl font-semibold text-white shadow-[0_0_20px_rgba(225,29,72,0.2)] disabled:opacity-70 transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 transition-all duration-300 group-hover:scale-[1.02]"></div>
                      <div className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>Complete Registration <Sparkles className="w-5 h-5" /></>
                        )}
                      </div>
                    </button>
                  </div>
                )}
              </form>

              {activeTab === 'customer' && (
                <>
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
                    <button type="button" onClick={() => setShowOtpModal(true)} className="flex items-center justify-center gap-2 py-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-sm font-semibold text-white transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      Phone OTP
                    </button>
                  </div>
                </>
              )}

              <div className="mt-10 text-center pb-8 lg:pb-0">
                <p className="text-zinc-400 text-sm">
                  Already a partner or customer?{' '}
                  <Link href={`/login${activeTab === 'partner' ? '?role=partner' : ''}`} className="font-semibold text-white hover:text-rose-400 transition-colors">
                    Sign In Here
                  </Link>
                </p>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Phone OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => { setShowOtpModal(false); setOtpSent(false); }} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
                ✕
              </button>
              
              <h3 className="text-2xl font-bold text-white mb-2">Phone Registration</h3>
              <p className="text-zinc-400 mb-6 text-sm">We will send a one-time password to your phone.</p>

              {!otpSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
                      placeholder="+91 9999999999"
                      className="w-full px-5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-white"
                    />
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
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Register'}
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
