'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

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

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);
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
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/v1/auth/me', { credentials: 'include' });
        if (!res.ok) throw new Error('Auth failed');
        const data = await res.json();
        setPartnerId(data.user.id);
      } catch (err) {
        toast.error('Could not authenticate partner session');
      }
    };
    fetchUser();
  }, []);

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

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const gMaps = `https://www.google.com/maps?q=${lat},${lon}`;
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toFixed(6),
          longitude: lon.toFixed(6),
          mapUrl: prev.mapUrl || gMaps,
        }));
        toast.success(`GPS coordinates captured: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        setDetectingGps(false);
      },
      (err) => {
        toast.error(`GPS Error: ${err.message}`);
        setDetectingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFormData((prev) => ({ ...prev, images: [...prev.images, reader.result as string] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!partnerId) {
      toast.error('Partner session missing');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter a listing or venue name');
      return;
    }
    setLoading(true);
    try {
      const numericCelebPricing: Record<string, any> = {};
      Object.entries(formData.celebrationPricing).forEach(([k, v]) => {
        numericCelebPricing[k] = {
          baseHallPrice: v.baseHallPrice ? parseFloat(v.baseHallPrice) : undefined,
          pricePerPlateVeg: v.pricePerPlateVeg ? parseFloat(v.pricePerPlateVeg) : undefined,
          pricePerPlateNonVeg: v.pricePerPlateNonVeg ? parseFloat(v.pricePerPlateNonVeg) : undefined,
        };
      });

      const payload = {
        partnerId,
        name: formData.name.trim(),
        category: formData.category,
        subCategory: formData.subCategory.trim() || null,
        description: formData.description.trim(),
        city: formData.city.trim(),
        location: formData.location.trim() || formData.city.trim(),
        mapUrl: formData.mapUrl.trim() || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        price: Number(formData.price || 0),
        capacity: formData.maxGuests ? parseInt(formData.maxGuests) : null,
        supportedCelebrations: formData.supportedCelebrations,
        celebrationPricing: numericCelebPricing,
        amenitiesPolicy: formData.amenities,
        images: formData.images.length > 0 ? formData.images : ['/og-image.jpg'],
      };

      const res = await fetch('/api/v1/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to create listing');
      }

      toast.success('🎉 Celebration Venue / Service Listing Created Successfully!');
      router.push('/partner/listings');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add Celebration Venue / Service</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your banquet hall, custom rates, amenities, and GPS maps location.</p>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1">
              <div className={`h-2 rounded-full transition-all ${step >= i ? 'bg-rose-600' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs font-semibold text-gray-500 mt-2">
          <span className={step === 1 ? 'text-rose-600' : ''}>1. Essentials</span>
          <span className={step === 2 ? 'text-rose-600' : ''}>2. Location & GPS</span>
          <span className={step === 3 ? 'text-rose-600' : ''}>3. Celebrations & Rates</span>
          <span className={step === 4 ? 'text-rose-600' : ''}>4. Amenities & Parking</span>
          <span className={step === 5 ? 'text-rose-600' : ''}>5. Photos & Review</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
        {/* STEP 1: ESSENTIALS */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b pb-3">
              <Building2 className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-gray-900">Service & Venue Essentials</h2>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Listing Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="e.g. Royal Grand Palace & Banquet"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none bg-white font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Theme / Specialization</label>
                <input
                  type="text"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="e.g. Luxury AC Indoor Hall & Lawn"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City / Region *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="e.g. Patna, Bihar"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none h-28"
                placeholder="Describe your venue space, ambiance, guest capacity, and key highlights..."
              />
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & GPS */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-bold text-gray-900">Venue Location & GPS Navigation</h2>
              </div>
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={detectingGps}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                {detectingGps ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                Auto-Detect Current GPS
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Street Address / Landmark</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="e.g. Bailey Road, Near Saguna More, Danapur, Patna"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Google Maps URL / Share Link</label>
              <input
                type="url"
                value={formData.mapUrl}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-blue-600"
                placeholder="https://maps.google.com/?q=..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Latitude</label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                  placeholder="e.g. 25.609324"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Longitude</label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                  placeholder="e.g. 85.123528"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Accurate coordinates allow customer apps to launch turn-by-turn Google Maps driving directions directly to your gate.
            </p>
          </div>
        )}

        {/* STEP 3: CELEBRATIONS & PRICING MATRIX */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3">
              <Sparkles className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-gray-900">Supported Celebrations & Rates Matrix</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Celebrations Hosted *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CELEBRATION_TYPES.map((celeb) => {
                  const isSelected = formData.supportedCelebrations.includes(celeb.id);
                  return (
                    <button
                      key={celeb.id}
                      type="button"
                      onClick={() => toggleCelebration(celeb.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold flex flex-col gap-1 transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/80 text-rose-700 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{celeb.icon}</span>
                      <span>{celeb.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="block text-sm font-bold text-gray-900">Custom Rates Breakdown by Celebration</label>
              {formData.supportedCelebrations.map((celebId) => {
                const celebInfo = CELEBRATION_TYPES.find((c) => c.id === celebId);
                const pricing = formData.celebrationPricing[celebId] || {};
                return (
                  <div key={celebId} className="bg-gray-50 border border-gray-200/80 p-4 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-800">
                      <span>{celebInfo?.icon || '✨'}</span>
                      <span>{celebInfo?.label || celebId}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Base Hall Price (₹)</label>
                        <input
                          type="number"
                          value={pricing.baseHallPrice || ''}
                          onChange={(e) => updateCelebPrice(celebId, 'baseHallPrice', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-white text-sm focus:ring-1 focus:ring-rose-500"
                          placeholder="e.g. 25000"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Veg Plate Rate (₹)</label>
                        <input
                          type="number"
                          value={pricing.pricePerPlateVeg || ''}
                          onChange={(e) => updateCelebPrice(celebId, 'pricePerPlateVeg', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-white text-sm focus:ring-1 focus:ring-rose-500"
                          placeholder="e.g. 750"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Non-Veg Plate Rate (₹)</label>
                        <input
                          type="number"
                          value={pricing.pricePerPlateNonVeg || ''}
                          onChange={(e) => updateCelebPrice(celebId, 'pricePerPlateNonVeg', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-white text-sm focus:ring-1 focus:ring-rose-500"
                          placeholder="e.g. 1050"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: AMENITIES & PARKING */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3">
              <Car className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-gray-900">Amenities & Parking Policies</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Min Guest Capacity</label>
                <input
                  type="number"
                  value={formData.minGuests}
                  onChange={(e) => setFormData({ ...formData, minGuests: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Max Guest Capacity</label>
                <input
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                  placeholder="500"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Parking Capacity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Two-Wheeler (Bikes) Spots</label>
                  <input
                    type="number"
                    value={formData.amenities.twoWheelerParking}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amenities: { ...formData.amenities, twoWheelerParking: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                    placeholder="e.g. 50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Four-Wheeler (Cars) Spots</label>
                  <input
                    type="number"
                    value={formData.amenities.fourWheelerParking}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amenities: { ...formData.amenities, fourWheelerParking: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                    placeholder="e.g. 30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { key: 'hasValetParking', label: 'Valet Parking Available' },
                  { key: 'hasAc', label: 'Full Central AC / Climate' },
                  { key: 'hasPowerBackup', label: '100% Generator Backup' },
                  { key: 'hasDjSound', label: 'DJ & Sound System' },
                  { key: 'hasBridalRoom', label: 'Bridal / Dressing Room' },
                  { key: 'outsideCateringAllowed', label: 'Outside Catering Allowed' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={(formData.amenities as any)[item.key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amenities: { ...formData.amenities, [item.key]: e.target.checked },
                        })
                      }
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: PHOTOS & REVIEW */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-3">
              <ImageIcon className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-gray-900">Photos, Base Pricing & Submission</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Starting / Base Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-lg font-bold text-gray-900"
                placeholder="e.g. 25000"
              />
              <p className="text-xs text-gray-400 mt-1">Starting base package price displayed on cards in exploration feeds.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Venue & Service Photos</label>
              <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-rose-400 transition-colors bg-gray-50/50">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1.5" />
                  <p className="font-semibold text-sm text-gray-700">Click to upload photos</p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG up to 5MB each</p>
                </div>
                <input type="file" accept="image/*" multiple onChange={handleAddImage} className="hidden" />
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border group">
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Final Review Box */}
            <div className="bg-rose-50/60 border border-rose-200/60 p-4 rounded-xl space-y-2 text-xs text-gray-700">
              <h4 className="font-bold text-sm text-rose-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                Ready to Publish Listing
              </h4>
              <p><strong>Name:</strong> {formData.name || 'Untitled Service'}</p>
              <p><strong>Category:</strong> {formData.category} • <strong>City:</strong> {formData.city}</p>
              <p><strong>Celebrations:</strong> {formData.supportedCelebrations.join(', ')}</p>
              <p><strong>Starting Price:</strong> ₹{formData.price || '0'}</p>
              <p><strong>GPS:</strong> {formData.latitude && formData.longitude ? `${formData.latitude}, ${formData.longitude}` : 'Manual entry'}</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1 || loading}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-600 font-semibold text-sm disabled:opacity-50 hover:bg-gray-50 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-gray-200"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Listing 🚀'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
