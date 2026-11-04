'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Shield, Loader2, Lock } from 'lucide-react';

export default function SecureAdminAccess() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Access Denied');

      const role = data.user?.role || data.data?.user?.role;
      if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'MANAGER') {
        const authToken = data.token || data.data?.token || data.accessToken;
        if (authToken && typeof window !== 'undefined') {
          localStorage.setItem('token', authToken);
        }
        const userObj = data.user || data.data?.user;
        if (userObj && typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userObj));
        }

        toast.success('System Authorized. Welcome Admin.');
        window.location.href = '/admin';
      } else {
        throw new Error('Unauthorized role level. Administrative privileges required.');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent"></div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-600/10 mb-4">
            <Shield className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Restricted Access</h2>
          <p className="text-zinc-400 text-sm">happylokam Secure Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Authorization ID</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-white"
              placeholder="Enter authorized email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Passcode</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-11 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-white"
              />
              <Lock className="w-5 h-5 text-zinc-500 absolute left-4 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
}
