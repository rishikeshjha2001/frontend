import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | happylokam',
  description: 'Sign in to your happylokam account. Manage your bookings, save your favorite venues, and connect with top event partners.',
  openGraph: {
    title: 'Login | happylokam',
    description: 'Sign in to your happylokam account.',
    url: 'https://happylokam.com/login',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
