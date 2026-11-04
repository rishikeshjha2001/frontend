import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Engagement & Ring Ceremony Venues in India | Book on happylokam",
  description: "Find intimate banquet halls, rooftop venues, and luxury dining spaces for engagement ceremonies, roka rituals, and ring exchanges. Customized floral backdrops and gourmet catering.",
  keywords: "engagement venues, ring ceremony banquet, roka ceremony halls, intimate wedding venues, engagement party places patna, engagement photographers, happylokam engagement",
  openGraph: {
    title: "Engagement & Ring Ceremony Venues | happylokam",
    description: "Book intimate banquet spaces, floral backdrops, and engagement catering packages with instant verification.",
    url: 'https://happylokam.com/engagements',
    siteName: 'happylokam',
    type: 'website',
  },
  other: {
    'geo.region': 'IN-BR',
    'geo.placename': 'Patna, Bihar, India',
  }
};

export default function EngagementLayout({ children }: { children: React.ReactNode }) {
  const engagementJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Engagement & Ring Ceremony Booking Service",
    "provider": {
      "@type": "Organization",
      "name": "happylokam",
      "url": "https://happylokam.com"
    },
    "description": "Intimate venues, stage decor, and photography for ring ceremonies and roka celebrations."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(engagementJsonLd) }}
      />
      {children}
    </>
  );
}
