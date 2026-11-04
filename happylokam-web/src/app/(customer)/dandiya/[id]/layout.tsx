import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const apiBase = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const normalizedBase = apiBase.endsWith('/api/v1') ? apiBase : `${apiBase.replace(/\/$/, '')}/api/v1`;
    
    // Fetch event data to generate dynamic SEO safely
    const res = await fetch(`${normalizedBase}/events/${id}`, { 
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data?.success && data?.data) {
          const event = data.data;
          // OpenGraph requires public HTTP(S) image URL, not raw base64 data URLs
          const ogImageUrl = (event.imageUrl && event.imageUrl.startsWith('http')) 
            ? event.imageUrl 
            : 'https://images.unsplash.com/photo-1605808360022-d8f1618684cb?q=80&w=1600';

          return {
            title: `${event.title} - Book Tickets | happylokam`,
            description: event.description || `Join ${event.title} at ${event.location}. Best Dandiya and celebrations exclusively on happylokam.`,
            keywords: `Dandiya, Navratri, ${event.location}, ${event.title}, Book Dandiya Tickets`,
            openGraph: {
              title: `${event.title} | happylokam`,
              description: `Get your tickets for ${event.title}. Limited seats available!`,
              images: [ogImageUrl],
            },
          };
        }
      }
    }
  } catch (error) {
    console.error('Error generating event metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'Dandiya Event | happylokam',
    description: 'Book the best Dandiya events on happylokam.',
  };
}

export default function DandiyaDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
