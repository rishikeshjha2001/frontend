'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Car,
  Utensils,
  Sparkles,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Trash2,
  Image as ImageIcon,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { authFetch } from '@/lib/auth-fetch';

const CATEGORIES = [
  { id: 'VENUE', label: '🏰 Banquet Hall / Venue' },
  { id: 'CATERING', label: '🍽️ Food & Catering' },
  { id: 'DECORATION', label: '🌸 Stage & Theme Decor' },
  { id: 'DJ_MUSIC', label: '🎶 DJ, Sound & Lights' },
  { id: 'PHOTOGRAPHY', label: '📸 Photography & Video' },
  { id: 'MAKEUP', label: '💄 Bridal Makeup & Mehndi' },
  { id: 'EVENT_PLANNER', label: '📋 Event Planner / Coordinator' },
  { id: 'OTHER', label: '✨ Other Celebration Service' },
];

const CELEBRATION_TYPES = [
  { id: 'WEDDING', label: '💍 Wedding & Engagement', icon: '💍' },
  { id: 'BIRTHDAY', label: '🎂 Birthday & Milestone Party', icon: '🎂' },
  { id: 'OFFICE_EVENTS', label: '🏢 Corporate & Office Events', icon: '🏢' },
  { id: 'ANNIVERSARY', label: '🥂 Anniversary & Romance', icon: '🥂' },
  { id: 'COCKTAIL_PARTY', label: '🎶 Cocktail & Social Night', icon: '🎶' },
  { id: 'FESTIVE', label: '🌸 Festive & Religious Puja', icon: '🌸' },
  { id: 'REUNION', label: '🎓 Farewell & Reunion', icon: '🎓' },
  { id: 'BABY_SHOWER', label: '👶 Baby Shower & Naming', icon: '👶' },
];

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    category: 'VENUE',
    subCategory: '',
    description: '',
    city: 'Patna',
    location: '',
    mapUrl: '',
    latitude: '',
    longitude: '',
    price: '',
    minGuests: '50',
    maxGuests: '500',
    images: [] as string[],
    supportedCelebrations: ['WEDDING', 'BIRTHDAY', 'OFFICE_EVENTS'] as string[],
    celebrationPricing: {
      WEDDING: { baseHallPrice: '25000', pricePerPlateVeg: '850', pricePerPlateNonVeg: '1150' },
      BIRTHDAY: { baseHallPrice: '15000', pricePerPlateVeg: '650', pricePerPlateNonVeg: '950' },
      OFFICE_EVENTS: { baseHallPrice: '20000', pricePerPlateVeg: '750', pricePerPlateNonVeg: '1050' },
    } as Record<string, { baseHallPrice?: string; pricePerPlateVeg?: string; pricePerPlateNonVeg?: string }>,
    amenities: {
      twoWheelerParking: '50',
      fourWheelerParking: '25',
      hasValetParking: true,
      hasAc: true,
      hasPowerBackup: true,
      hasDjSound: true,
      hasBridalRoom: true,
      outsideCateringAllowed: false,
    },
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setInitialLoading(true);
        const res = await authFetch(`/api/v1/listings/${listingId}`);
        if (!res.ok) throw new Error('Failed to load listing details');
        const json = await res.json();
        const data = json.data || json;

        if (data) {
          setFormData({
            name: data.name || data.title || '',
            category: data.category || 'VENUE',
            subCategory: data.subCategory || '',
            description: data.description || '',
            city: data.city || data.location || 'Patna',
            location: data.location || data.city || '',
            mapUrl: data.mapUrl || '',
            latitude: data.latitude ? String(data.latitude) : '',
            longitude: data.longitude ? String(data.longitude) : '',
            price: data.price !== undefined ? String(data.price) : (data.pricing ? String(data.pricing) : ''),
            minGuests: data.capacity ? String(Math.max(10, Math.floor(data.capacity * 0.2))) : '50',
            maxGuests: data.capacity ? String(data.capacity) : '500',
            images: Array.isArray(data.images) ? data.images : [],
            supportedCelebrations: Array.isArray(data.supportedCelebrations) && data.supportedCelebrations.length > 0
              ? data.supportedCelebrations
              : ['WEDDING', 'BIRTHDAY', 'OFFICE_EVENTS'],
            celebrationPricing: data.celebrationPricing || {
              WEDDING: { baseHallPrice: '25000', pricePerPlateVeg: '850', pricePerPlateNonVeg: '1150' },
              BIRTHDAY: { baseHallPrice: '15000', pricePerPlateVeg: '650', pricePerPlateNonVeg: '950' },
              OFFICE_EVENTS: { baseHallPrice: '20000', pricePerPlateVeg: '750', pricePerPlateNonVeg: '1050' },
            },
            amenities: {
              twoWheelerParking: data.amenitiesPolicy?.twoWheelerParking ? String(data.amenitiesPolicy.twoWheelerParking) : '50',
              fourWheelerParking: data.amenitiesPolicy?.fourWheelerParking ? String(data.amenitiesPolicy.fourWheelerParking) : '25',
              hasValetParking: data.amenitiesPolicy?.hasValetParking ?? true,
              hasAc: data.amenitiesPolicy?.hasAc ?? true,
              hasPowerBackup: data.amenitiesPolicy?.hasPowerBackup ?? true,
              hasDjSound: data.amenitiesPolicy?.hasDjSound ?? true,
              hasBridalRoom: data.amenitiesPolicy?.hasBridalRoom ?? true,
              outsideCateringAllowed: data.amenitiesPolicy?.outsideCateringAllowed ?? false,
            },
          });
        }
      } catch (err: any) {
        toast.error(err.message || 'Could not fetch listing details');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleNext = () => setStep((s) => Math.min(5, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const toggleCelebration = (id: string) => {
    setFormData((prev) => {
      const exists = prev.supportedCelebrations.includes(id);
      const updatedCelebs = exists
        ? prev.supportedCelebrations.filter((c) => c !== id)
        : [...prev.supportedCelebrations, id];

      const updatedPricing = { ...prev.celebrationPricing };
      if (!exists && !updatedPricing[id]) {
        updatedPricing[id] = { baseHallPrice: '20000', pricePerPlateVeg: '750', pricePerPlateNonVeg: '1050' };
      }
      return { ...prev, supportedCelebrations: updatedCelebs, celebrationPricing: updatedPricing };
    });
  };

  const updateCelebPrice = (
    celebId: string,
    field: 'baseHallPrice' | 'pricePerPlateVeg' | 'pricePerPlateNonVeg',
    val: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      celebrationPricing: {
        ...prev.celebrationPricing,
        [celebId]: {
          ...(prev.celebrationPricing[celebId] || {}),
          [field]: val,
        },
      },
    }));
  };

  const detectLiveGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          mapUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        }));
        setDetectingGps(false);
        toast.success(`GPS Coordinates pinned: ${lat}, ${lng}`);
      },
      (err) => {
        setDetectingGps(false);
        toast.error('Failed to get current location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleImageAdd = (url: string) => {
    if (!url.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url.trim()],
    }));
  };

  const handleImageRemove = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a listing name');
      setStep(1);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        city: formData.city,
        location: formData.location || `${formData.name}, ${formData.city}`,
        mapUrl: formData.mapUrl,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        price: parseFloat(formData.price) || 0,
        pricing: parseFloat(formData.price) || 0,
        capacity: parseInt(formData.maxGuests, 10) || 500,
        images: formData.images.length > 0 ? formData.images : ['/og-image.jpg'],
        supportedCelebrations: formData.supportedCelebrations,
        celebrationPricing: formData.celebrationPricing,
        amenitiesPolicy: formData.amenities,
      };

      const res = await authFetch(`/api/v1/listings/${listingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to update listing');
      }

      toast.success('Listing updated successfully!');
      router.push('/partner/listings');
    } catch (err: any) {
      toast.error(err.message || 'Error updating listing');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-200 pb-20 selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <div className="border-b border-white/10 bg-[#0c1017]/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/partner/listings"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-rose-500" />
                Edit Listing
              </h1>
              <p className="text-xs text-zinc-400">Update celebration services and venue details</p>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition flex items-center justify-center border ${
                  step === s
                    ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_12px_rgba(225,29,72,0.5)]'
                    : step > s
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-white/5 text-zinc-500 border-white/10'
                }`}
              >
                {step > s ? '✓' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-8">
        {/* Step Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
            Step {step} of 5
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {step === 1 && 'Basic Listing Information & GPS Location'}
            {step === 2 && 'Base Pricing & Guest Capacity'}
            {step === 3 && 'Supported Celebrations & Per-Event Plate Rates'}
            {step === 4 && 'Amenities, Parking & House Policies'}
            {step === 5 && 'Venue Photos & Media Gallery'}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {step === 1 && 'Set the name, category, and precise Google Maps coordinates for customers.'}
            {step === 2 && 'Define your starting price and maximum guest capacity.'}
            {step === 3 && 'Customize veg and non-veg plate rates for each type of celebration.'}
            {step === 4 && 'Highlight parking space, valet, air conditioning, and sound systems.'}
            {step === 5 && 'Showcase high-resolution photos of your halls, stage, and banquet setups.'}
          </p>
        </div>

        {/* Step 1: Basics & GPS */}
        {step === 1 && (
          <div className="space-y-6 bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Venue or Service Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Crystal Banquet & Palace"
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-base focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-rose-500 focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Patna"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Full Physical Address
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bailey Road, Near Saguna More, Danapur, Patna - 801503"
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* GPS Location & Maps Card */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-rose-500" />
                    Precise GPS Coordinates
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Auto-detect your location or paste Google Maps URL so users can get 1-tap navigation
                  </p>
                </div>
                <button
                  type="button"
                  onClick={detectLiveGPS}
                  disabled={detectingGps}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
                >
                  {detectingGps ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  {detectingGps ? 'Detecting...' : 'Pin Live GPS'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="25.612345"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="85.145678"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Google Maps Direct URL</label>
                <input
                  type="url"
                  value={formData.mapUrl}
                  onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Detailed Description & Highlights
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your venue, halls, stage decor, catering varieties, air conditioning, and why customers love celebrating here..."
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Pricing & Capacity */}
        {step === 2 && (
          <div className="space-y-6 bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Base Starting Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="25000"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-base focus:border-rose-500 focus:outline-none font-semibold"
                />
                <span className="text-xs text-zinc-500 mt-1 block">Default minimum booking / hall price</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Maximum Guest Capacity (People) *
                </label>
                <input
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                  placeholder="500"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-base focus:border-rose-500 focus:outline-none"
                />
                <span className="text-xs text-zinc-500 mt-1 block">Floating or banquet seating capacity</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <span className="font-bold block">HappyLokam Price Transparency</span>
                Customers will see this starting price on discovery cards. Detailed per-plate catering and event packages can be customized in the next step.
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Celebrations & Custom Pricing Matrix */}
        {step === 3 && (
          <div className="space-y-6 bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Select Celebrations You Host
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CELEBRATION_TYPES.map((celeb) => {
                  const selected = formData.supportedCelebrations.includes(celeb.id);
                  return (
                    <button
                      key={celeb.id}
                      type="button"
                      onClick={() => toggleCelebration(celeb.id)}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                        selected
                          ? 'bg-rose-600/20 border-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.2)]'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-lg">{celeb.icon}</span>
                      <span className="text-xs font-semibold">{celeb.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Rates Table for selected celebrations */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-rose-500" />
                Catering & Plate Rates per Celebration
              </h3>

              <div className="space-y-3">
                {formData.supportedCelebrations.map((celebId) => {
                  const celeb = CELEBRATION_TYPES.find((c) => c.id === celebId);
                  const p = formData.celebrationPricing[celebId] || {};
                  return (
                    <div
                      key={celebId}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
                    >
                      <div>
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{celeb?.icon}</span>
                          {celeb?.label}
                        </span>
                        <span className="text-[11px] text-zinc-400">Custom rates for this celebration</span>
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Veg Plate Rate (₹)</label>
                        <input
                          type="number"
                          value={p.pricePerPlateVeg || ''}
                          onChange={(e) => updateCelebPrice(celebId, 'pricePerPlateVeg', e.target.value)}
                          placeholder="750"
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Non-Veg Plate Rate (₹)</label>
                        <input
                          type="number"
                          value={p.pricePerPlateNonVeg || ''}
                          onChange={(e) => updateCelebPrice(celebId, 'pricePerPlateNonVeg', e.target.value)}
                          placeholder="1050"
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-rose-400 font-semibold"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Amenities & Rules */}
        {step === 4 && (
          <div className="space-y-6 bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  <Car className="w-4 h-4 inline mr-1 text-rose-500" />
                  Two-Wheeler Parking (Slots)
                </label>
                <input
                  type="number"
                  value={formData.amenities.twoWheelerParking}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amenities: { ...formData.amenities, twoWheelerParking: e.target.value },
                    })
                  }
                  placeholder="50"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  <Car className="w-4 h-4 inline mr-1 text-rose-500" />
                  Four-Wheeler Parking (Cars)
                </label>
                <input
                  type="number"
                  value={formData.amenities.fourWheelerParking}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amenities: { ...formData.amenities, fourWheelerParking: e.target.value },
                    })
                  }
                  placeholder="25"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { key: 'hasValetParking', label: 'Valet Parking Available' },
                { key: 'hasAc', label: 'Central Air Conditioning (AC)' },
                { key: 'hasPowerBackup', label: '100% Generator Power Backup' },
                { key: 'hasDjSound', label: 'In-House Sound & DJ Console' },
                { key: 'hasBridalRoom', label: 'Complimentary Bridal Dressing Room' },
                { key: 'outsideCateringAllowed', label: 'Outside Catering Allowed' },
              ].map(({ key, label }) => {
                const checked = (formData.amenities as any)[key];
                return (
                  <label
                    key={key}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      checked
                        ? 'bg-rose-500/10 border-rose-500/40 text-white'
                        : 'bg-white/5 border-white/10 text-zinc-400'
                    }`}
                  >
                    <span className="text-xs font-medium">{label}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amenities: { ...formData.amenities, [key]: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Photos & Gallery */}
        {step === 5 && (
          <div className="space-y-6 bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Add Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="imgUrlInput"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleImageAdd((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('imgUrlInput') as HTMLInputElement;
                    if (el) {
                      handleImageAdd(el.value);
                      el.value = '';
                    }
                  }}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                >
                  Add Image
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div>
              <span className="text-xs font-semibold text-zinc-400 block mb-3">
                Uploaded Photos ({formData.images.length})
              </span>
              {formData.images.length === 0 ? (
                <div className="p-8 border border-dashed border-white/10 rounded-3xl text-center text-zinc-500">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No images added yet. Enter URLs above or save default placeholder.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group"
                    >
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(i)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(225,29,72,0.4)] transition"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-sm font-bold shadow-[0_0_30px_rgba(225,29,72,0.6)] transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {loading ? 'Saving Changes...' : 'Save & Update Listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
