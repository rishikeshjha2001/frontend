import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Navbar />
      <main className="flex-1 w-full bg-slate-50">{children}</main>
      <Footer />
    </div>
  );
}
