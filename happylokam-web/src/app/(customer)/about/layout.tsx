import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | happylokam - India\'s Premier Celebration Platform',
  description: 'Learn about happylokam, the platform redefining how India celebrates. Connect with the finest venues, creators, and event professionals.',
  openGraph: {
    title: 'About Us | happylokam',
    description: 'Learn about happylokam, the platform redefining how India celebrates.',
    url: 'https://happylokam.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
