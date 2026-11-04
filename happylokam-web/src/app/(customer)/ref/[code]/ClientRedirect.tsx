'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRedirect({ referralCode }: { referralCode: string }) {
  const router = useRouter();

  useEffect(() => {
    // Save to localStorage for client-side use
    localStorage.setItem('happylokam_referral_code', referralCode);
    
    // Save as a cookie for SSR access
    document.cookie = `referral_code=${referralCode}; path=/; max-age=${60 * 60 * 24 * 30}`;

    // Redirect to main search page
    const timer = setTimeout(() => {
      router.push('/search');
    }, 2000);

    return () => clearTimeout(timer);
  }, [referralCode, router]);

  return (
    <div className="flex justify-center mt-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
