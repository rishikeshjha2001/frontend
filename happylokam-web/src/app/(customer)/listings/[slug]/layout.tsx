import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://happylokam.com';
    // Fetch listing data to generate dynamic SEO
    const res = await fetch(`${apiBase}/api/v1/listings/${slug}`, { next: { revalidate: 60 } });
    const data = await res.json();
    
    if (data.success && data.data) {
      const listing = data.data;
      return {
        title: `${listing.title} - ${listing.category} in ${listing.city} | happylokam`,
        description: `Book ${listing.title}, a premium ${listing.category} in ${listing.city}. Verified by happylokam.`,
        keywords: `${listing.category}, ${listing.city}, ${listing.title}, Celebration Services, Book ${listing.category}`,
        openGraph: {
          title: `${listing.title} | Premium ${listing.category}`,
          description: `View details and book ${listing.title} for your next celebration.`,
          images: listing.images && listing.images.length > 0 ? [listing.images[0]] : [],
        },
      };
    }
  } catch (error) {
    console.error('Error fetching listing for SEO:', error);
  }

  // Fallback metadata
  return {
    title: 'Service Listing | happylokam',
    description: 'Discover premium celebration services on happylokam.',
  };
}

export default function ListingDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
