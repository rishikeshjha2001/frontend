import { Metadata } from 'next';

type Props = {
  params: { city: string; category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const city = resolvedParams.city.charAt(0).toUpperCase() + resolvedParams.city.slice(1).replace('-', ' ');
  const category = resolvedParams.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `Best ${category} in ${city} | Book on happylokam`,
    description: `Find and book the top-rated ${category} in ${city}. Compare prices, read verified reviews, and book instantly on happylokam.`,
    keywords: `${category} in ${city}, best ${category} near me, ${category} booking ${city}, happylokam ${city}`,
  };
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
