import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://happylokam.com'),
  applicationName: 'happylokam',
  category: 'events & celebrations',
  title: "happylokam | Plan Weddings, Birthdays & Celebrations in India",
  icons: {
    icon: '/favicon.svg',
  },
  description: "Explore venues, event services and experiences for weddings, birthdays, engagements, festivals and family celebrations across India.",
  keywords: "happylokam, celebrations in India, wedding venues, banquet halls, birthday parties, engagement venues, event services, dandiya events, celebration planning",
  authors: [{ name: 'happylokam', url: 'https://happylokam.com' }],
  creator: 'happylokam',
  publisher: 'happylokam',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  other: {
    'geo.region': 'IN-BR',
    'geo.placename': 'Patna, Bihar, India',
    'geo.position': '25.5941;85.1376',
    'ICBM': '25.5941, 85.1376',
    'rating': 'general',
    'revisit-after': '1 days',
  },
  openGraph: {
    title: "happylokam | Dandiya, Weddings, Banquet Halls & Milestone Celebrations",
    description: "Explore celebration venues, event services, Dandiya events and wedding planning options on happylokam.",
    url: 'https://happylokam.com',
    siteName: 'happylokam',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'happylokam Celebration Platform' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "happylokam | Celebrations, Dandiya & Venues Made Simple",
    description: "Discover and book India's finest event vendors, marriage halls, dandiya nights, and banquet venues seamlessly.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://happylokam.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://happylokam.com/#organization",
        "name": "happylokam",
        "alternateName": ["Happy Lokam", "HappyLokam Celebrations", "Happy Lokam India", "Happy Lokam Patna"],
        "url": "https://happylokam.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://happylokam.com/icon.png",
          "caption": "happylokam Official Logo"
        },
        "description": "A celebration platform for discovering venues, event services, tickets and experiences in India.",
        "sameAs": [
          "https://www.instagram.com/happylokam",
          "https://www.facebook.com/happylokam",
          "https://twitter.com/happylokam",
          "https://www.linkedin.com/company/happylokam"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-8969255561",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi"]
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Kanti Factory Road, Mahatma Gandhi Nagar, Kankarbagh",
          "addressLocality": "Patna",
          "addressRegion": "Bihar",
          "postalCode": "800026",
          "addressCountry": "IN"
        }
      },
      {
        "@type": ["LocalBusiness", "EventVenue"],
        "@id": "https://happylokam.com/#localbusiness",
        "name": "happylokam Celebrations & Venue Booking",
        "url": "https://happylokam.com",
        "telephone": "+91-8969255561",
        "priceRange": "₹₹",
        "image": "https://happylokam.com/og-image.jpg",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Kanti Factory Road, Mahatma Gandhi Nagar, Kankarbagh",
          "addressLocality": "Patna",
          "addressRegion": "Bihar",
          "postalCode": "800026",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 25.5941,
          "longitude": 85.1376
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://happylokam.com/#website",
        "url": "https://happylokam.com",
        "name": "happylokam",
        "publisher": {
          "@id": "https://happylokam.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://happylokam.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://happylokam.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://happylokam.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Dandiya Night Passes",
            "item": "https://happylokam.com/dandiya"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Banquet Halls",
            "item": "https://happylokam.com/banquet-halls"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Wedding Venues",
            "item": "https://happylokam.com/wedding-venues"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "LokSafari Expeditions",
            "item": "https://happylokam.com/loksafari"
          },
          {
            "@type": "ListItem",
            "position": 6,
            "name": "Explore Catalog",
            "item": "https://happylokam.com/explore"
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://happylokam.com/#service-venues",
        "name": "Marriage Hall & Banquet Venue Reservations",
        "provider": { "@id": "https://happylokam.com/#organization" },
        "serviceType": "Wedding & Celebration Venue Booking",
        "areaServed": "IN",
        "description": "Online booking and consultation for premium air-conditioned banquet halls, marriage lawns, and royal wedding palaces across Patna, Bihar, and major Indian cities."
      },
      {
        "@type": "Service",
        "@id": "https://happylokam.com/#service-dandiya",
        "name": "Dandiya & Cultural Festival Digital Passes",
        "provider": { "@id": "https://happylokam.com/#organization" },
        "serviceType": "Event Ticketing & Fast QR Passes",
        "areaServed": "IN",
        "description": "Instant digital QR passes for Navratri Dandiya Raas, Garba nights, music festivals, and live performances with tier options for Single, Couple, Family, and VIP."
      },
      {
        "@type": "Service",
        "@id": "https://happylokam.com/#service-loksafari",
        "name": "LokSafari Heritage & Eco-Tourism Expeditions",
        "provider": { "@id": "https://happylokam.com/#organization" },
        "serviceType": "Guided Eco-Tourism & Cultural Tours",
        "areaServed": "IN",
        "description": "All-inclusive guided eco-tourism, wildlife reserves, heritage circuits, and cultural trails with verified transportation, meals, and certified local guides."
      },
      {
        "@type": "FAQPage",
        "@id": "https://happylokam.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I book Dandiya & Garba Night tickets on happylokam?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Visit happylokam.com/dandiya, select your preferred event and ticket tier (Single, Couple, Family 4, VIP, Group), enter your attendee details, and pay securely via UPI, Card, or Net Banking. You receive instant digital QR tickets on your mobile device."
            }
          },
          {
            "@type": "Question",
            "name": "Can I book marriage halls and banquet venues online in Patna and other Indian cities?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. happylokam showcases verified banquet halls, marriage lawns, and luxury wedding venues with transparent pricing, guest capacity filters, photo galleries, and direct host booking or concierge consultation."
            }
          },
          {
            "@type": "Question",
            "name": "What is LokSafari by happylokam?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "LokSafari is happylokam's curated eco-tourism and heritage expedition service covering royal circuits, wildlife reserves, and sacred trails with AC transport, stays, meals, and certified guides."
            }
          },
          {
            "@type": "Question",
            "name": "What services are included in happylokam wedding and celebration packages?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "happylokam connects you with top-rated wedding decorators, certified pandits for Vedic rituals, premium catering caterers, professional photographers, DJ sound systems, and bridal makeup artists with 100% verified guarantees."
            }
          },
          {
            "@type": "Question",
            "name": "What is the customer support phone number for happylokam?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can reach happylokam Customer Support directly via phone or WhatsApp at +91-8969255561 or by email at support@happylokam.com for immediate booking assistance, venue tours, or ticket verification."
            }
          },
          {
            "@type": "Question",
            "name": "How do I register as a partner or venue vendor on happylokam?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Vendors and venue owners can visit happylokam.com/partner, fill out their business profile, upload hall or service photos and pricing, and get verified by our onboarding team to start receiving verified customer bookings."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang='en' suppressHydrationWarning className={`${jakarta.variable} ${playfair.variable} font-sans`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased bg-slate-50 text-slate-900 selection:bg-rose-500/30">
        <Providers>
          {children}
        </Providers>
      </body>
    </html> 
  ); 
}
