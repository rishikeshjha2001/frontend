import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Best Banquet Halls & Luxury Event Venues in India | Book on happylokam",
  description: "Explore and book top-rated AC banquet halls for weddings, corporate events, engagements, and birthday parties. Check real photos, pricing per plate, guest capacity, and book with verified guarantees.",
  keywords: "banquet halls near me, luxury banquet halls, ac banquet hall booking, best banquet in patna, wedding banquets, corporate event venue, marriage banquet halls, happylokam banquets",
  openGraph: {
    title: "Best Banquet Halls & Luxury Venues | happylokam",
    description: "Compare and book premium banquet halls with verified capacities, catering menus, and AC halls across India.",
    url: 'https://happylokam.com/banquet-halls',
    siteName: 'happylokam',
    type: 'website',
  },
  other: {
    'geo.region': 'IN-BR',
    'geo.placename': 'Patna, Bihar, India',
  }
};

export default function BanquetHallsLayout({ children }: { children: React.ReactNode }) {
  const banquetJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Top Verified Banquet Halls",
    "description": "Verified luxury banquet halls and venues across India available on happylokam.",
    "itemListElement": [
      {
        "@type": "Place",
        "name": "Grand Imperial Banquet & Lawns",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Patna",
          "addressRegion": "Bihar",
          "addressCountry": "IN"
        },
        "description": "Air-conditioned banquet hall with 500+ guest capacity, premium multi-cuisine catering, and bridal suite."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(banquetJsonLd) }}
      />
      {children}
    </>
  );
}
