import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Top Wedding Venues & Marriage Lawns in India | happylokam",
  description: "Discover dream wedding venues, royal marriage gardens, resort stays, and heritage palatial settings for Indian weddings. Complete marriage packages with catering, decor, and bridal suites.",
  keywords: "wedding venues near me, marriage halls, luxury marriage gardens, wedding resorts patna, destination wedding venues india, marriage lawn booking, wedding decorators, happylokam weddings",
  openGraph: {
    title: "Dream Wedding Venues & Marriage Lawns | happylokam",
    description: "Book royal marriage halls, luxury gardens, and full wedding packages across India with verified price guarantees.",
    url: 'https://happylokam.com/wedding-venues',
    siteName: 'happylokam',
    type: 'website',
  },
  other: {
    'geo.region': 'IN-BR',
    'geo.placename': 'Patna, Bihar, India',
  }
};

export default function WeddingVenuesLayout({ children }: { children: React.ReactNode }) {
  const weddingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Wedding Venue & Marriage Hall Booking Service",
    "provider": {
      "@type": "Organization",
      "name": "happylokam",
      "url": "https://happylokam.com"
    },
    "areaServed": "IN",
    "description": "Comprehensive wedding venue discovery, marriage garden booking, mandap decorations, and catering packages across India."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(weddingJsonLd) }}
      />
      {children}
    </>
  );
}
