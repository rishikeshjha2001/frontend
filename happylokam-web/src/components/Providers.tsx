"use client";

import React, { ReactNode, useEffect, Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import { useSearchParams } from 'next/navigation';
import FloatingConcierge from './FloatingConcierge';

if (typeof window !== 'undefined' && !(window as any).__happylokam_fetch_patched) {
  (window as any).__happylokam_fetch_patched = true;
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : input.toString());
      // Only target backend APIs, never internal Next.js assets
      if (!url.includes('_next') && (url.includes('api.happylokam.com') || url.includes('/api/v1/') || url.startsWith('/api/v1'))) {
        const token = localStorage.getItem('token');
        const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : {}));
        if (token && !headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return originalFetch(input, {
          ...init,
          headers,
          credentials: 'include'
        });
      }
    } catch (e) {
      // Fallback to original fetch
    }
    return originalFetch(input, init);
  };
}

function ReferralTracker() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('referralCode', ref);
    }
  }, [searchParams]);
  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <ReferralTracker />
      </Suspense>
      {children}
      <FloatingConcierge />
      <Toaster position="top-center" richColors closeButton />
    </AuthProvider>
  );
}
