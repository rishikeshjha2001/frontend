import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Users } from 'lucide-react';

interface ListingCardProps {
  title: string;
  image: string;
  price: number;
  rating: number;
  capacity: number;
  location: string;
  slug: string;
}

export function ListingCard({
  title,
  image,
  price,
  rating,
  capacity,
  location,
  slug,
}: ListingCardProps) {
  return (
    <Link href={`/listings/${slug}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="relative aspect-[4/3] w-full bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{title}</h3>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Star className="w-4 h-4 fill-rose-600 text-rose-600" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Users className="w-4 h-4" />
            <span>Up to {capacity} guests</span>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="font-bold text-lg text-gray-900">
              ₹{price.toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-500">/ day</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
