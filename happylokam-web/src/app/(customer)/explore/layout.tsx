import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Services, Venues & Navratri Dandiya Nights in Patna | happylokam',
  description: 'Search and filter India\'s finest event professionals, banquets, decorators, and premium catering services. Book exclusive Navratri Dandiya Nights in Patna.',
  keywords: 'Dandiya, Dandiya Nights, Navratri, Patna, Garba in Patna, Event Planner, Banquet Halls, Marriage Halls, Best Dandiya in Patna',
  openGraph: {
    title: 'Navratri Dandiya Nights in Patna & Celebration Services | happylokam',
    description: 'Find the perfect partner for your celebration. Book the best Dandiya Nights in Patna exclusively on happylokam.',
    url: 'https://happylokam.com/search',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
