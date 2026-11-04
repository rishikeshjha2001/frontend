import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | Join happylokam',
  description: 'Create your happylokam account. Join as a customer to book events, or register as a partner to grow your business.',
  openGraph: {
    title: 'Register | Join happylokam',
    description: 'Create your happylokam account.',
    url: 'https://happylokam.com/register',
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
