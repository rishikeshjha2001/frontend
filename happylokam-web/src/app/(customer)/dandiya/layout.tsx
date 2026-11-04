import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dandiya Nights in Patna 2026 | Book Tickets on happylokam",
  description: "Book passes for the best Navratri Dandiya Nights in Patna. Find venues, dates, early bird offers, and couple passes for live DJ and Garba events exclusively on happylokam.",
  keywords: "dandiya nights patna, navratri garba patna, book dandiya tickets, dj dandiya patna, navratri 2026 patna, garba events in patna, happylokam dandiya, online tickets, best dandiya in patna",
  openGraph: {
    title: "Dandiya Nights in Patna | happylokam",
    description: "Book passes for the best Navratri Dandiya Nights in Patna. Celebrate with live music, garba, and premium food.",
    url: 'https://happylokam.com/dandiya',
    siteName: 'happylokam',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dandiya Nights in Patna | happylokam",
    description: "Book passes for the best Navratri Dandiya Nights in Patna. Celebrate with live music, garba, and premium food.",
  }
};

export default function DandiyaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dandiyaJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Grand Navratri Dandiya Night Patna 2026",
    "startDate": "2026-10-15T18:00:00+05:30",
    "endDate": "2026-10-24T23:30:00+05:30",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "Grand Imperial Celebration Lawns",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bailey Road, Saguna More",
        "addressLocality": "Patna",
        "postalCode": "801503",
        "addressRegion": "Bihar",
        "addressCountry": "IN"
      }
    },
    "image": [
      "https://happylokam.com/og-image.jpg"
    ],
    "description": "Patna's biggest Navratri Dandiya & Garba celebration featuring live DJ, dhol beats, traditional food stalls, and celebrity performers.",
    "offers": {
      "@type": "AggregateOffer",
      "url": "https://happylokam.com/dandiya",
      "priceCurrency": "INR",
      "lowPrice": "299",
      "highPrice": "1499",
      "offerCount": "4",
      "availability": "https://schema.org/InStock",
      "validFrom": "2026-09-01T00:00:00+05:30"
    },
    "organizer": {
      "@type": "Organization",
      "name": "happylokam",
      "url": "https://happylokam.com"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dandiyaJsonLd) }}
      />
      {children}
    </>
  );
}

