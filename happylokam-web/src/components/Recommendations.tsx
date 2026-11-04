'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Venue {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
}

export default function Recommendations({ userId }: { userId: string }) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/ai/recommendations/${userId}`)
      .then(res => res.json())
      .then(data => {
        setVenues(data.recommendations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading recommendations...</div>;
  if (!venues.length) return null;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended for you</h2>
      <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory hide-scrollbar">
        {venues.map(venue => (
          <div key={venue.id} className="min-w-[300px] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow snap-start">
            <div className="h-48 bg-gray-200 relative w-full">
              {venue.imageUrl ? (
                /* Using standard img for mock purposes to avoid next/image host configuration issues */
                <img src={venue.imageUrl} alt={venue.name} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 truncate">{venue.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{venue.location}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-rose-600">₹{(venue.price / 100).toLocaleString()} <span className="text-sm text-gray-500 font-normal">/ day</span></span>
                <button className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
