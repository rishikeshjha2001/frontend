'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Calculator,
  Calendar,
  Users,
  MapPin,
  Utensils,
  Building2,
  Flower2,
  Camera,
  ShieldCheck,
  TrendingUp,
  Percent,
  CheckCircle2,
  ChevronRight,
  Share2,
  Save,
  Trash2,
  Phone,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  IndianRupee,
  Layers,
  Award,
  Crown,
  Heart,
  Star,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import {
  EVENT_PLANNER_THEMES,
  DESTINATION_CITIES,
  PlannerTheme,
} from '@/constants/eventPlannerThemes';

interface SavedPlan {
  id: string;
  savedAt: string;
  themeId: string;
  themeName: string;
  city: string;
  eventType: string;
  guests: number;
  totalBudget: number;
  cateringCost: number;
  venueCost: number;
  decorCost: number;
  mediaCost: number;
  bufferCost: number;
  foodOptionId: string;
  decorLevelId: string;
  mediaTierId: string;
}

export default function EventPlannerPage() {
  // Primary configuration inputs
  const [selectedCity, setSelectedCity] = useState<string>('Patna');
  const [eventType, setEventType] = useState<string>('wedding');
  const [guestCount, setGuestCount] = useState<number>(350);
  const [customBudget, setCustomBudget] = useState<number>(850000);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('vedic-royal');

  // Customizer selections
  const [selectedFoodId, setSelectedFoodId] = useState<string>('rajwadi-classic');
  const [selectedDecorId, setSelectedDecorId] = useState<string>('palace-illumination');
  const [selectedMediaId, setSelectedMediaId] = useState<string>('cinematic-teaser');

  // Live packages from catalog
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(true);

  // Saved plans state
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Active theme object
  const currentTheme = useMemo(() => {
    return (
      EVENT_PLANNER_THEMES.find((t) => t.id === selectedThemeId) ||
      EVENT_PLANNER_THEMES[0]
    );
  }, [selectedThemeId]);

  // Destination city object
  const currentCityObj = useMemo(() => {
    return (
      DESTINATION_CITIES.find((c) => c.name === selectedCity) ||
      DESTINATION_CITIES[0]
    );
  }, [selectedCity]);

  // Sync customizer options when theme changes
  useEffect(() => {
    if (currentTheme.foodOptions[0]) {
      setSelectedFoodId(currentTheme.foodOptions[0].id);
    }
    if (currentTheme.decorLevels[0]) {
      setSelectedDecorId(currentTheme.decorLevels[0].id);
    }
    if (currentTheme.mediaTiers[0]) {
      setSelectedMediaId(currentTheme.mediaTiers[0].id);
    }
  }, [selectedThemeId, currentTheme]);

  // Fetch real catalog packages matching celebration/venue keywords
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoadingItems(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://happylokam.com/api/v1';
        const res = await fetch(`${apiUrl}/sections`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const allItems: any[] = [];
            json.data.forEach((sec: any) => {
              if (Array.isArray(sec.items)) {
                sec.items.forEach((item: any) => {
                  allItems.push(item);
                });
              }
            });

            // Filter relevant packages
            const filtered = allItems.filter((item) => {
              const text = `${item.title} ${item.subtitle || ''} ${item.category || ''} ${item.location || ''}`.toLowerCase();
              return (
                text.includes('venue') ||
                text.includes('lawn') ||
                text.includes('banquet') ||
                text.includes('hall') ||
                text.includes('palace') ||
                text.includes('wedding') ||
                text.includes('celebration') ||
                text.includes('resort')
              );
            });

            if (isMounted) {
              setCatalogItems(filtered.length > 0 ? filtered.slice(0, 6) : allItems.slice(0, 6));
            }
          }
        }
      } catch (err) {
        console.warn('Catalog fetch error:', err);
      } finally {
        if (isMounted) setLoadingItems(false);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load saved blueprints from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('@happylokam_saved_event_plans');
      if (stored) {
        setSavedPlans(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load saved plans:', e);
    }
  }, []);

  // 5-Pillar Live Budget Calculations
  const calculations = useMemo(() => {
    const cityMult = currentCityObj.multiplier;
    const basePlateRate = currentTheme.perPlateEstimate.veg;

    const chosenFood = currentTheme.foodOptions.find((f) => f.id === selectedFoodId);
    const chosenDecor = currentTheme.decorLevels.find((d) => d.id === selectedDecorId);
    const chosenMedia = currentTheme.mediaTiers.find((m) => m.id === selectedMediaId);

    const plateRate = (basePlateRate + (chosenFood?.priceDelta || 0)) * cityMult;
    const cateringCost = Math.round(plateRate * guestCount);

    // Venue scaling based on guest capacity
    let venueMultiplier = 1.0;
    if (guestCount > 600) venueMultiplier = 1.45;
    else if (guestCount > 350) venueMultiplier = 1.25;
    else if (guestCount > 150) venueMultiplier = 1.05;

    const baseVenueEstimate = 120000 * cityMult * venueMultiplier;
    const venueCost = Math.round(baseVenueEstimate);

    // Decor
    const baseDecor = 65000 * currentTheme.decorMultiplier * cityMult;
    const decorDelta = (chosenDecor?.priceDelta || 0) * cityMult;
    const decorCost = Math.round(baseDecor + decorDelta);

    // Media
    const baseMedia = 45000 * cityMult;
    const mediaDelta = (chosenMedia?.priceDelta || 0) * cityMult;
    const mediaCost = Math.round(baseMedia + mediaDelta);

    const subTotal = cateringCost + venueCost + decorCost + mediaCost;
    const bufferCost = Math.round(subTotal * 0.05);
    const calculatedTotal = subTotal + bufferCost;

    // Percentages
    const cateringPct = Math.round((cateringCost / calculatedTotal) * 100);
    const venuePct = Math.round((venueCost / calculatedTotal) * 100);
    const decorPct = Math.round((decorCost / calculatedTotal) * 100);
    const mediaPct = Math.round((mediaCost / calculatedTotal) * 100);
    const bufferPct = 100 - (cateringPct + venuePct + decorPct + mediaPct);

    // Savings tip
    const diffFromCustom = customBudget - calculatedTotal;

    return {
      plateRate: Math.round(plateRate),
      cateringCost,
      venueCost,
      decorCost,
      mediaCost,
      bufferCost,
      calculatedTotal,
      subTotal,
      cateringPct,
      venuePct,
      decorPct,
      mediaPct,
      bufferPct: Math.max(bufferPct, 5),
      diffFromCustom,
      isUnderBudget: diffFromCustom >= 0,
    };
  }, [
    currentTheme,
    currentCityObj,
    guestCount,
    customBudget,
    selectedFoodId,
    selectedDecorId,
    selectedMediaId,
  ]);

  // Save Blueprint Handler
  const handleSavePlan = () => {
    const newPlan: SavedPlan = {
      id: `plan_${Date.now()}`,
      savedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      themeId: currentTheme.id,
      themeName: currentTheme.name,
      city: selectedCity,
      eventType,
      guests: guestCount,
      totalBudget: calculations.calculatedTotal,
      cateringCost: calculations.cateringCost,
      venueCost: calculations.venueCost,
      decorCost: calculations.decorCost,
      mediaCost: calculations.mediaCost,
      bufferCost: calculations.bufferCost,
      foodOptionId: selectedFoodId,
      decorLevelId: selectedDecorId,
      mediaTierId: selectedMediaId,
    };

    const updated = [newPlan, ...savedPlans.filter((p) => p.id !== newPlan.id)];
    setSavedPlans(updated);
    try {
      localStorage.setItem('@happylokam_saved_event_plans', JSON.stringify(updated));
      setSaveSuccessMsg('Blueprint saved successfully to your browser!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  // Delete saved plan
  const handleDeletePlan = (id: string) => {
    const updated = savedPlans.filter((p) => p.id !== id);
    setSavedPlans(updated);
    try {
      localStorage.setItem('@happylokam_saved_event_plans', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update localStorage:', e);
    }
  };

  // Load a saved plan
  const handleLoadPlan = (p: SavedPlan) => {
    setSelectedCity(p.city);
    setEventType(p.eventType);
    setGuestCount(p.guests);
    setSelectedThemeId(p.themeId);
    setSelectedFoodId(p.foodOptionId);
    setSelectedDecorId(p.decorLevelId);
    setSelectedMediaId(p.mediaTierId);
    setShowSavedModal(false);
  };

  // WhatsApp Concierge Share
  const handleWhatsAppShare = () => {
    const text = `*happylokam AI Celebration Blueprint*%0A` +
      `--------------------------------%0A` +
      `*Theme:* ${currentTheme.name}%0A` +
      `*Destination City:* ${selectedCity}%0A` +
      `*Guest Count:* ${guestCount} Guests%0A` +
      `*Total Estimated Budget:* ₹${calculations.calculatedTotal.toLocaleString('en-IN')}%0A%0A` +
      `*5-Pillar Breakdown:*%0A` +
      `• Catering (${calculations.cateringPct}%): ₹${calculations.cateringCost.toLocaleString('en-IN')}%0A` +
      `• Venue & Lawn (${calculations.venuePct}%): ₹${calculations.venueCost.toLocaleString('en-IN')}%0A` +
      `• Themed Decor (${calculations.decorPct}%): ₹${calculations.decorCost.toLocaleString('en-IN')}%0A` +
      `• Cinematography (${calculations.mediaPct}%): ₹${calculations.mediaCost.toLocaleString('en-IN')}%0A` +
      `• Contingency Buffer: ₹${calculations.bufferCost.toLocaleString('en-IN')}%0A%0A` +
      `Please connect me with a dedicated Happylokam Concierge to review available banquet dates and vendor packages!`;

    window.open(`https://wa.me/919155655222?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Top Banner / Hero */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-rose-900 via-rose-950 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>AI Event & Wedding Budget Engine 2.0</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-playfair font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Design Your Dream Wedding with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-pink-400">Algorithmic Precision</span>
          </h1>

          <p className="text-sm sm:text-base text-rose-100/80 max-w-2xl mx-auto leading-relaxed">
            Eliminate hidden vendor markups. Simulate full-scale food plates, luxury venues, designer mandaps, and 4K cinema drones with live catalog integration.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setShowSavedModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>Saved Blueprints ({savedPlans.length})</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Concierge WhatsApp</span>
            </button>
            <a
              href="tel:+919155655222"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Phone className="w-4 h-4 text-rose-300" />
              <span>Call +91 9155655222</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Workspace Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {saveSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm text-center shadow-lg animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Controls & Themes (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Destination & Event Parameters Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Celebration Parameters</h2>
                    <p className="text-xs text-slate-500">Pick destination, ceremony type & attendee volume</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                  Live Calculator
                </span>
              </div>

              {/* Destination City Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Destination City
                </label>
                <div className="flex flex-wrap gap-2">
                  {DESTINATION_CITIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCity(c.name)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCity === c.name
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {c.name}
                      <span className="ml-1 opacity-70 text-[10px]">
                        {c.multiplier !== 1.0 ? `(${c.multiplier}x)` : ''}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Event Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'wedding', label: 'Wedding Ceremony' },
                    { id: 'pre-wedding', label: 'Sangeet / Haldi' },
                    { id: 'birthday', label: 'Milestone Birthday' },
                    { id: 'corporate', label: 'Grand Reception' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setEventType(t.id)}
                      className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                        eventType === t.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Count Slider & Direct Input */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-bold text-slate-800">Expected Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={30}
                      max={3000}
                      step={10}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Math.max(10, parseInt(e.target.value) || 10))}
                      className="w-24 text-right px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <span className="text-xs text-slate-500 font-bold">guests</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={50}
                  max={1500}
                  step={25}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />

                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>50 (Intimate)</span>
                  <span>350 (Standard Grand)</span>
                  <span>800 (Royal)</span>
                  <span>1500+ (Extravaganza)</span>
                </div>
              </div>

              {/* Target Budget Slider */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-800">Target Budget Benchmark</span>
                  </div>
                  <span className="text-base font-extrabold text-slate-900">
                    ₹{customBudget.toLocaleString('en-IN')}
                  </span>
                </div>

                <input
                  type="range"
                  min={100000}
                  max={3500000}
                  step={50000}
                  value={customBudget}
                  onChange={(e) => setCustomBudget(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>₹1 Lakh</span>
                  <span>₹8.5 Lakhs</span>
                  <span>₹20 Lakhs</span>
                  <span>₹35 Lakhs+</span>
                </div>
              </div>
            </div>

            {/* Step 2: Curated Celebration Themes (6 Distinct Themes) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Select Curated Celebration Theme</h2>
                    <p className="text-xs text-slate-500">
                      Pre-modeled architectural aesthetics, lighting & culinary profiles
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600">
                  {EVENT_PLANNER_THEMES.length} Themes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EVENT_PLANNER_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`group cursor-pointer rounded-3xl overflow-hidden border-2 transition-all relative ${
                        isSelected
                          ? 'border-rose-600 shadow-xl shadow-rose-600/10 scale-[1.02] bg-white ring-2 ring-rose-500/20'
                          : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      {/* Theme Thumbnail */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        <img
                          src={theme.bannerImage}
                          alt={theme.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        
                        {/* Vibe Tag badge */}
                        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap max-w-[80%]">
                          {theme.vibeTags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {isSelected && (
                          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-base font-bold text-white line-clamp-1">{theme.name}</h3>
                          <p className="text-[11px] text-rose-200 line-clamp-1">{theme.tagline}</p>
                        </div>
                      </div>

                      {/* Theme Specs */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Base Plate Est.</span>
                          <span className="font-extrabold text-slate-900">
                            ₹{theme.perPlateEstimate.veg}/plate
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Ideal Crowd</span>
                          <span className="font-bold text-slate-700">
                            {theme.recommendedGuests.optimal} Guests
                          </span>
                        </div>

                        {/* Palette dots */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-bold mr-1">Palette:</span>
                          {theme.colorPalette.map((col, idx) => (
                            <span
                              key={idx}
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Interactive Component Customizer */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                  3
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Component Customizer: {currentTheme.name}</h2>
                  <p className="text-xs text-slate-500">Fine-tune dining menu, mandap decor & 4K media production</p>
                </div>
              </div>

              {/* Food Customizer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Catering & Culinary Spread
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-600">
                    Est. ₹{calculations.plateRate}/plate
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {currentTheme.foodOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedFoodId(opt.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        selectedFoodId === opt.id
                          ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                          {opt.priceDelta !== 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                              {opt.priceDelta > 0 ? `+₹${opt.priceDelta}` : `-₹${Math.abs(opt.priceDelta)}`}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedFoodId === opt.id ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                      }`}>
                        {selectedFoodId === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decor Customizer */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flower2 className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Mandap & Themed Decor Styling
                    </span>
                  </div>
                  <span className="text-xs font-bold text-rose-600">
                    ₹{calculations.decorCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {currentTheme.decorLevels.map((dec) => (
                    <div
                      key={dec.id}
                      onClick={() => setSelectedDecorId(dec.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        selectedDecorId === dec.id
                          ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{dec.label}</span>
                          {dec.priceDelta > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                              +₹{(dec.priceDelta).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{dec.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedDecorId === dec.id ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300'
                      }`}>
                        {selectedDecorId === dec.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Customizer */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      4K Cinematography & Photography
                    </span>
                  </div>
                  <span className="text-xs font-bold text-sky-600">
                    ₹{calculations.mediaCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {currentTheme.mediaTiers.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => setSelectedMediaId(med.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        selectedMediaId === med.id
                          ? 'border-sky-500 bg-sky-50/50 ring-1 ring-sky-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{med.label}</span>
                          {med.priceDelta > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                              +₹{(med.priceDelta).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{med.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedMediaId === med.id ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300'
                      }`}>
                        {selectedMediaId === med.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 5-Pillar Budget Breakdown & Action Hub (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Sticky summary card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl space-y-6 lg:sticky lg:top-28">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-600 uppercase tracking-widest">
                    AI Budget Blueprint
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {selectedCity} • {guestCount} Guests
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 font-playfair">
                    ₹{calculations.calculatedTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">est. total</span>
                </div>
              </div>

              {/* Target Budget Comparison */}
              <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                calculations.isUnderBudget
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {calculations.isUnderBudget
                      ? `₹${calculations.diffFromCustom.toLocaleString('en-IN')} Under Benchmark`
                      : `₹${Math.abs(calculations.diffFromCustom).toLocaleString('en-IN')} Above Benchmark`}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold">
                  {calculations.isUnderBudget ? 'Optimized' : 'High Tier'}
                </span>
              </div>

              {/* 5-Pillar Visual Proportion Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Pillar Allocation</span>
                  <span>100% Comprehensive</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 shadow-inner">
                  <div
                    style={{ width: `${calculations.cateringPct}%` }}
                    className="h-full bg-amber-500 transition-all duration-300"
                    title={`Food: ${calculations.cateringPct}%`}
                  />
                  <div
                    style={{ width: `${calculations.venuePct}%` }}
                    className="h-full bg-emerald-600 transition-all duration-300"
                    title={`Venue: ${calculations.venuePct}%`}
                  />
                  <div
                    style={{ width: `${calculations.decorPct}%` }}
                    className="h-full bg-rose-500 transition-all duration-300"
                    title={`Decor: ${calculations.decorPct}%`}
                  />
                  <div
                    style={{ width: `${calculations.mediaPct}%` }}
                    className="h-full bg-sky-500 transition-all duration-300"
                    title={`Media: ${calculations.mediaPct}%`}
                  />
                  <div
                    style={{ width: `${calculations.bufferPct}%` }}
                    className="h-full bg-slate-400 transition-all duration-300"
                    title={`Buffer: ${calculations.bufferPct}%`}
                  />
                </div>

                {/* Micro Legend */}
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-bold pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Food ({calculations.cateringPct}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" /> Venue ({calculations.venuePct}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Decor ({calculations.decorPct}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-500" /> Media ({calculations.mediaPct}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Buffer ({calculations.bufferPct}%)
                  </span>
                </div>
              </div>

              {/* 5-Pillar Itemized Breakdown List */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                {/* 1. Food */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <div className="flex items-center gap-2.5">
                    <Utensils className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-bold text-slate-900">Food & Catering</p>
                      <p className="text-[10px] text-slate-500">
                        ₹{calculations.plateRate} x {guestCount} plates
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ₹{calculations.cateringCost.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* 2. Venue */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-900">Venue & Lawns</p>
                      <p className="text-[10px] text-slate-500">
                        {currentCityObj.name} tier rate
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ₹{calculations.venueCost.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* 3. Decor */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
                  <div className="flex items-center gap-2.5">
                    <Flower2 className="w-4 h-4 text-rose-600" />
                    <div>
                      <p className="font-bold text-slate-900">Themed Decor</p>
                      <p className="text-[10px] text-slate-500">Mandap & lighting setup</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ₹{calculations.decorCost.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* 4. Media */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/50 border border-sky-100">
                  <div className="flex items-center gap-2.5">
                    <Camera className="w-4 h-4 text-sky-600" />
                    <div>
                      <p className="font-bold text-slate-900">Cinematography</p>
                      <p className="text-[10px] text-slate-500">4K drone, film & candid</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ₹{calculations.mediaCost.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* 5. Buffer */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-slate-600" />
                    <div>
                      <p className="font-bold text-slate-900">5% Contingency Buffer</p>
                      <p className="text-[10px] text-slate-500">Generator & last-minute plates</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ₹{calculations.bufferCost.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* AI Smart Tips Accordion */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Cost Optimization Tips</span>
                </div>
                <ul className="space-y-1.5 text-indigo-950/80 leading-relaxed text-[11px]">
                  {currentTheme.aiTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleSavePlan}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>Save Blueprint to Browser</span>
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share Blueprint on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Matching Venue Packages from Catalog */}
        <div className="mt-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Live Catalog Matching</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-playfair">
                Curated Banquet & Lawn Packages for {selectedCity}
              </h2>
              <p className="text-xs text-slate-500">
                Direct booking available with your configured guest count ({guestCount} Guests)
              </p>
            </div>
            <Link
              href={`/wedding-venues`}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore All Venues</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingItems ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-72 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : catalogItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col group"
                >
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-600" />
                        <span>{item.location || selectedCity}</span>
                      </span>
                      {item.rating && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] flex items-center gap-1">
                          <Star className="w-3 h-3 fill-slate-950" />
                          <span>{item.rating}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.subtitle || 'Spacious lawn and banquet hall with full catering amenities.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Tariff from</span>
                        <p className="text-base font-extrabold text-slate-900">
                          ₹{typeof item.price === 'number' ? item.price.toLocaleString('en-IN') : item.price}
                        </p>
                      </div>

                      <Link
                        href={`/item/${item.id}?guests=${guestCount}&plates=${guestCount}&theme=${encodeURIComponent(currentTheme.name)}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                      >
                        <span>Reserve</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-700">No specific packages listed for this filter right now.</p>
              <p className="text-xs text-slate-400 mt-1">Our concierge can arrange any venue in {selectedCity} on demand.</p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Blueprints Drawer / Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-lg text-slate-900">My Saved Blueprints</h3>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {savedPlans.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-bold">
                  No saved blueprints yet. Adjust the sliders and click &quot;Save Blueprint to Browser&quot;.
                </div>
              ) : (
                savedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{plan.themeName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                          {plan.city}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {plan.guests} Guests • ₹{plan.totalBudget.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-slate-400">Saved on {plan.savedAt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoadPlan(plan)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={() => setShowSavedModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
