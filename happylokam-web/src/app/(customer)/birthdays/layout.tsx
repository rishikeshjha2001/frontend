import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Birthday Party Halls & Celebration Venues in India | happylokam",
  description: "Book vibrant birthday party venues, kids play areas, themed balloon decor, customized cakes, and entertainment artists on happylokam. Best birthday venues with instant confirmation.",
  keywords: "birthday party venues, birthday celebration halls, kids birthday party places patna, birthday decorators, party halls near me, cake and decor packages, happylokam birthdays",
  openGraph: {
    title: "Birthday Party Halls & Venues | happylokam",
    description: "Discover fun birthday venues, cafe halls, and celebration packages with verified decorators & catering.",
    url: 'https://happylokam.com/birthdays',
    siteName: 'happylokam',
    type: 'website',
  },
  other: {
    'geo.region': 'IN-BR',
    'geo.placename': 'Patna, Bihar, India',
  }
};

export default function BirthdaysLayout({ children }: { children: React.ReactNode }) {
  const birthdayJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Birthday Celebration & Party Venue Booking Service",
    "provider": {
      "@type": "Organization",
      "name": "happylokam",
      "url": "https://happylokam.com"
    },
    "description": "Party halls, custom theme decoration, magic shows, and catering for kids and adult birthdays."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(birthdayJsonLd) }}
      />
      {children}
    </>
  );
}
