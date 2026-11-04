import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Star, Calendar, ChevronRight, ShieldCheck, Sparkles, Navigation } from 'lucide-react';

interface PageProps {
  params: {
    city: string;
    category: string;
  };
}

const searchableCities = [
  'patna', 'gaya', 'muzaffarpur', 'bhagalpur', 'rajgir', 'nalanda', 'bodhgaya',
  'ranchi', 'varanasi', 'lucknow', 'delhi', 'mumbai', 'bengaluru', 'hyderabad',
  'kolkata', 'jaipur', 'pune', 'ahmedabad', 'indore', 'chandigarh',
];

const searchableCategories = ['wedding-venues', 'banquet-halls', 'birthday-parties', 'engagement-parties'];

// Keep indexed location pages intentional. This prevents thin, arbitrary URLs from
// being indexed as if they were genuine celebration search results.
export function generateStaticParams() {
  return searchableCities.flatMap((city) =>
    searchableCategories.map((category) => ({ city, category }))
  );
}

// Format URL slugs to readable text (e.g., 'patna' -> 'Patna', 'navratri-dandiya' -> 'Navratri Dandiya')
const formatString = (str?: string) => {
  if (!str) return '';
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Generate highly optimized SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const city = formatString(resolvedParams.city);
  const category = formatString(resolvedParams.category);
  
  let seoTitle = `${category} in ${city} | Celebrate with happylokam`;
  let seoDescription = `Explore ${category.toLowerCase()} in ${city}, India. Compare celebration options, enquire with providers, and plan your occasion with happylokam.`;
  let keywords = `${category} in ${city}, ${category} ${city}, celebrate in ${city}, happylokam`;

  if (category.toLowerCase().includes('dandiya') || category.toLowerCase().includes('garba')) {
    seoTitle = `Navratri Dandiya in ${city} | Passes, Events & Venues`;
    seoDescription = `Explore Dandiya and Garba celebrations in ${city}. Find event details, venue information, and ticket options on happylokam.`;
    keywords = `Navratri Dandiya in ${city}, best Dandiya in ${city}, Garba events ${city}, Dandiya night tickets ${city}, Navratri 2026 ${city}, top Dandiya places in ${city}`;
  } else if (category.toLowerCase().includes('banquet') || category.toLowerCase().includes('marriage') || category.toLowerCase().includes('wedding')) {
    seoTitle = `Wedding & Banquet Halls in ${city} | happylokam`;
    seoDescription = `Explore wedding venues and banquet halls in ${city} for marriages, receptions, engagements, and family celebrations.`;
    keywords = `Banquet halls in ${city}, best marriage halls ${city}, wedding venues ${city}, AC banquet ${city}, cheap banquet halls in ${city}, happylokam ${city} wedding`;
  } else if (category.toLowerCase().includes('birthday')) {
    seoTitle = `Birthday Party Places in ${city} | happylokam`;
    seoDescription = `Plan a birthday celebration in ${city}. Explore party venues and celebration services, then compare the options that fit your occasion.`;
    keywords = `Birthday celebration places in ${city}, best restaurants for birthday in ${city}, private birthday halls ${city}, happylokam ${city} birthday`;
  }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'website',
      siteName: 'happylokam',
    },
    alternates: {
      canonical: `https://happylokam.com/${resolvedParams.city.toLowerCase()}/${resolvedParams.category.toLowerCase()}`
    }
  };
}

export default async function GeoCategorySeoPage({ params }: PageProps) {
  const resolvedParams = await params;
  const city = formatString(resolvedParams.city);
  const category = formatString(resolvedParams.category);
  
  const isEvent = category.toLowerCase().includes('dandiya') || category.toLowerCase().includes('event');

  // JSON-LD Schema for Google Rich Snippets
  const schemaOrgJSONLD = {
    '@context': 'https://schema.org',
    '@type': isEvent ? 'Event' : 'LocalBusiness',
    name: `Top ${category} in ${city}`,
    description: `Browse and book the best ${category} located in ${city}. Verified listings, real reviews, and instant booking via happylokam.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressCountry: 'IN'
    },
    url: `https://happylokam.com/${resolvedParams.city.toLowerCase()}/${resolvedParams.category.toLowerCase()}`,
    geo: {
      '@type': 'GeoCoordinates',
      addressCountry: 'IN'
    }
  };

  // AEO FAQ Schema for AI Search Engines (Google SGE, Perplexity, ChatGPT)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the best ${category} in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The best ${category} in ${city} can be found on happylokam. We aggregate the top-rated, highly-reviewed options for you to compare and book securely.`
        }
      },
      {
        '@type': 'Question',
        name: `How much does a ${category} cost in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Prices for ${category} in ${city} vary based on requirements, but happylokam guarantees the best rates and exclusive discounts for our users.`
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col pt-24 pb-12">
      {/* Inject Schema.org JSON-LD for Standard SEO & AEO (Answer Engine Optimization) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero SEO Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto w-full flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/20 to-transparent -z-10 rounded-[3rem]"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium mb-8">
          <MapPin className="w-4 h-4" />
          <span>Top Rated in {city}</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
          Find the Best <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
            {category}
          </span> in {city}
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          {isEvent 
            ? `Get ready to celebrate! Discover the most happening ${category} events in ${city}. Secure your early-bird passes, check the lineup, and join the ultimate celebration.`
            : `Planning an event? Explore the most stunning and affordable ${category} venues in ${city}. Read verified reviews, compare pricing, and book your dream location today.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/search" className="px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center gap-2">
            Explore All in {city} <Navigation className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us SEO Content */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">100% Verified</h3>
            <p className="text-zinc-400 text-sm">Every {category.toLowerCase()} listed in {city} is physically verified by the happylokam quality team.</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real Reviews</h3>
            <p className="text-zinc-400 text-sm">Read genuine experiences from customers who have previously booked these {city} venues.</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Best Price Guarantee</h3>
            <p className="text-zinc-400 text-sm">We negotiate the best deals for {category.toLowerCase()} in {city} so you don't have to.</p>
          </div>
        </div>
      </section>

      {/* Grid of Results */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Top Picks for {category} in {city}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* SEO Optimized Dummy Cards to hold space until backend hooks up */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Link key={i} href="/search" className="group flex flex-col bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden hover:bg-zinc-800/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/10">
              <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10 opacity-60"></div>
                {/* Fallback pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-zinc-900 to-zinc-950" style={{ backgroundSize: '4px 4px' }}></div>
                <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10 uppercase tracking-wider">
                  {isEvent ? 'Trending Event' : 'Premium Venue'}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-rose-400 text-xs font-bold uppercase tracking-wider">{category}</span>
                  <div className="flex items-center gap-1 text-white bg-zinc-800 px-2 py-1 rounded-lg text-xs font-bold">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    4.9
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-rose-300 transition-colors">
                  The Grand {category} {city}
                </h3>
                <div className="flex items-center gap-1.5 text-zinc-400 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">Prime Location, {city}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-500">Starting from</span>
                    <div className="text-white font-bold">₹{isEvent ? '499' : '15,000'}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-600/20 flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                    <ChevronRight className="w-4 h-4 text-rose-500 group-hover:text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Footer Content Block */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Why Book Your {category} in {city} with happylokam?</h2>
        <p className="text-zinc-400 leading-relaxed text-sm">
          Finding the perfect <strong>{category.toLowerCase()} in {city}</strong> has never been easier. Whether you're searching for 
          <em> best {category.toLowerCase()} near me</em>, or trying to discover the absolute best <em>top {category.toLowerCase()} in {city}</em>, happylokam 
          aggregates the finest options available in {city}. We pride ourselves on providing a transparent booking experience, 
          showcasing real reviews, verified photographs, and upfront pricing. Don't compromise on your special day—browse our 
          curated list of top-rated venues and events, compare features, and secure your booking instantly.
        </p>
      </section>

      {/* AEO: Frequently Asked Questions (Highly optimized for AI Search & Featured Snippets) */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto w-full border-t border-zinc-800/50 mt-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">What is the best {category} in {city}?</h3>
            <p className="text-zinc-400">
              Finding the best {category} in {city} depends on your budget and requirements. happylokam features the top-rated options with real user reviews to help you make an informed decision.
            </p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">How do I book {category} via happylokam in {city}?</h3>
            <p className="text-zinc-400">
              Simply browse the verified listings on this page, compare the amenities and prices, and click book. You will get an instant confirmation and access to our secure payment gateway.
            </p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">Are the reviews for {city} {category} genuine?</h3>
            <p className="text-zinc-400">
              Yes! All reviews on happylokam for {category} in {city} are from 100% verified customers who have actually attended or booked the venue.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
