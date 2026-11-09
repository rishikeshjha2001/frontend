'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Ticket,
  BookmarkCheck,
  MapPin,
  Tag,
  DollarSign,
  Layers,
  X,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  Search,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  FolderPlus,
  Image as ImageIcon,
  Check,
  AlertCircle,
  ArrowRight,
  ListFilter
} from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

interface SectionItem {
  id: string;
  sectionId?: string;
  categoryId?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  cornerTag?: string;
  tag?: string;
  location?: string;
  itemType: 'TICKET' | 'BOOKING';
  price: number;
  priceUnit: string;
  availableDates: string[];
  availableTimes?: string[];
  features?: string[];
  totalSlots: number;
  capacity?: number;
  bookedSlots: number;
  rating: number;
  reviews: number;
  image: string;
  tags: string[];
  description?: string;
  isActive: boolean;
  section?: { title: string };
  category?: { name: string };
}

interface CustomSection {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  order: number;
  isActive: boolean;
  items: SectionItem[];
}

interface CustomCategory {
  id: string;
  name: string;
  image: string;
  tag?: string;
  order: number;
  isActive: boolean;
  items: SectionItem[];
}

interface AdvanceFilterItem {
  id: string;
  title: string;
  subtitle?: string;
  tag?: string;
  route?: string;
  category?: string;
  keywords?: string[];
  icon?: string;
  filterType?: string;
  order?: number;
  isActive?: boolean;
}

interface SectionBooking {
  id: string;
  itemId: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  bookingDate: string;
  bookingTime?: string;
  quantity: number;
  itemType: string;
  totalAmount: number;
  status: string;
  ticketCode: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
  item?: {
    title: string;
    location: string;
    image: string;
    itemType: string;
    price: number;
    badge?: string;
    section?: { title: string };
    category?: { name: string };
  };
}

const PRESET_IMAGES = [
  { label: 'Royal Palace Mandap', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
  { label: 'Grand Banquet Ballroom', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Udaipur Heritage Haveli', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Live DJ Night & Concert', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Waterpark & Poolside Party', url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Desert Safari Camp', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dandiya Garba Night', url: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=800&q=80' },
  { label: 'Catering & Gourmet Feasts', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80' },
  { label: 'Flower & Theme Decor', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80' },
];

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [bookings, setBookings] = useState<SectionBooking[]>([]);
  const [activeTab, setActiveTab] = useState<'sections' | 'categories' | 'bookings' | 'filters'>('sections');
  const [advanceFilters, setAdvanceFilters] = useState<AdvanceFilterItem[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<AdvanceFilterItem | null>(null);
  const [filterForm, setFilterForm] = useState({
    title: '',
    subtitle: '',
    tag: 'WEDDING',
    category: 'Weddings',
    route: '/(tabs)/explore?category=Weddings',
    keywords: 'wedding, mandap, decor, banquet, palace',
    filterType: 'THEME',
    icon: 'Sparkles',
    order: 0,
  });
  const [loading, setLoading] = useState(true);

  // Section Modal (Only name asked)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
  const [sectionForm, setSectionForm] = useState({ title: '', order: 0 });

  // Category Modal (Name and Image asked)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', image: PRESET_IMAGES[0].url, order: 0 });

  // Item Modal (Form 1: Basic Card info, Form 2: Details & Booking times)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [targetType, setTargetType] = useState<'section' | 'category'>('section');
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [editingItem, setEditingItem] = useState<SectionItem | null>(null);
  const [itemFormStep, setItemFormStep] = useState<1 | 2>(1);

  const [itemForm, setItemForm] = useState({
    title: '',
    subtitle: '',
    badge: 'Trending',
    location: 'Patna, Bihar',
    itemType: 'BOOKING' as 'TICKET' | 'BOOKING',
    price: 4999,
    priceUnit: 'per booking',
    tags: 'wedding, packages, mandap',
    celebrationTheme: 'None',
    features: 'AC Banquet Hall, Pure Ghee Delicacies, Dedicated Manager, Instant Pass',
    availableDates: '2026-10-24, 2026-10-25, 2026-10-26, 2026-10-27, 2026-10-28',
    availableTimes: '10:00 AM - 02:00 PM, 06:30 PM - 11:30 PM',
    totalSlots: 100,
    image: PRESET_IMAGES[0].url,
    description: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [secRes, catRes, bkgRes] = await Promise.all([
        authFetch('/api/v1/sections'),
        authFetch('/api/v1/categories'),
        authFetch('/api/v1/sections/bookings/all'),
      ]);

      if (secRes && secRes.ok) {
        const secData = await secRes.json().catch(() => null);
        if (secData && (secData.data || Array.isArray(secData))) {
          setSections(secData.data || secData);
        }
      }

      if (catRes && catRes.ok) {
        const catData = await catRes.json().catch(() => null);
        if (catData && (catData.data || Array.isArray(catData))) {
          setCategories(catData.data || catData);
        }
      }

      if (bkgRes && bkgRes.ok) {
        const bkgData = await bkgRes.json().catch(() => null);
        if (bkgData && (bkgData.data || Array.isArray(bkgData))) {
          setBookings(bkgData.data || bkgData);
        }
      }
    } catch (err) {
      console.warn('Failed to load sections data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  
  // Save Advance Filter / Theme
  const handleSaveFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterForm.title.trim()) return alert('Please enter filter title');

    try {
      const payload = {
        title: filterForm.title.trim(),
        subtitle: filterForm.subtitle.trim(),
        tag: filterForm.tag.trim().toUpperCase(),
        category: filterForm.category.trim(),
        route: filterForm.route.trim(),
        keywords: filterForm.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        filterType: filterForm.filterType.trim().toUpperCase(),
        icon: filterForm.icon.trim(),
        order: Number(filterForm.order) || 0,
      };

      if (editingFilter) {
        await authFetch(`/api/v1/sections/filters/${editingFilter.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await authFetch('/api/v1/sections/filters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setIsFilterModalOpen(false);
      setEditingFilter(null);
      loadData();
    } catch (err: any) {
      alert('Error saving filter: ' + err.message);
    }
  };

  // Delete Advance Filter
  const handleDeleteFilter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advance filter?')) return;
    try {
      await authFetch(`/api/v1/sections/filters/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert('Error deleting filter: ' + err.message);
    }
  };

  // Save Section (Only Name asked)
  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.title.trim()) return alert('Please enter section name');

    try {
      if (editingSection) {
        await authFetch(`/api/v1/sections/${editingSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: sectionForm.title.trim(), order: Number(sectionForm.order) }),
        });
      } else {
        await authFetch('/api/v1/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: sectionForm.title.trim(), order: Number(sectionForm.order) }),
        });
      }
      setIsSectionModalOpen(false);
      setEditingSection(null);
      setSectionForm({ title: '', order: 0 });
      loadData();
    } catch (err: any) {
      alert('Error saving section: ' + err.message);
    }
  };

  // Delete Section
  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section and all its items?')) return;
    try {
      await authFetch(`/api/v1/sections/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert('Error deleting section: ' + err.message);
    }
  };

  // Save Category (Name and Image asked)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return alert('Please enter category name');
    if (!categoryForm.image.trim()) return alert('Please enter or select a category image');

    try {
      if (editingCategory) {
        await authFetch(`/api/v1/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm),
        });
      } else {
        await authFetch('/api/v1/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm),
        });
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', image: PRESET_IMAGES[0].url, order: 0 });
      loadData();
    } catch (err: any) {
      alert('Error saving category: ' + err.message);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category and its items?')) return;
    try {
      await authFetch(`/api/v1/categories/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert('Error deleting category: ' + err.message);
    }
  };

  // Save Item (Form 1: Title, Subtitle, Badge, Price | Form 2: Image, Description, Features, Times)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.title.trim()) return alert('Please enter item title');

    try {
      const datesArr = itemForm.availableDates.split(',').map(d => d.trim()).filter(Boolean);
      const timesArr = itemForm.availableTimes.split(',').map(t => t.trim()).filter(Boolean);
      const featArr = itemForm.features.split(',').map(f => f.trim()).filter(Boolean);
      const rawTags = (itemForm as any).tags ? (itemForm as any).tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
      const themeTag = (itemForm as any).celebrationTheme && (itemForm as any).celebrationTheme !== 'None' ? (itemForm as any).celebrationTheme.toLowerCase() : '';
      const badgeTag = itemForm.badge ? itemForm.badge.toLowerCase() : '';
      const finalTags = Array.from(new Set([...rawTags, themeTag, badgeTag].filter(Boolean)));

      const payload = {
        title: itemForm.title.trim(),
        subtitle: itemForm.subtitle.trim() || itemForm.badge,
        badge: itemForm.badge.trim() || 'Featured',
        location: itemForm.location.trim() || 'Patna, Bihar',
        itemType: itemForm.itemType,
        price: Number(itemForm.price) || 0,
        priceUnit: itemForm.priceUnit.trim() || 'per booking',
        availableDates: datesArr,
        availableTimes: timesArr,
        features: featArr,
        tags: finalTags,
        totalSlots: Number(itemForm.totalSlots) || 100,
        image: itemForm.image.trim(),
        description: itemForm.description.trim(),
        sectionId: targetType === 'section' ? selectedParentId : undefined,
        categoryId: targetType === 'category' ? selectedParentId : undefined,
      };

      if (editingItem) {
        await authFetch(`/api/v1/sections/items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        const endpoint = targetType === 'section' 
          ? `/api/v1/sections/${selectedParentId}/items`
          : `/api/v1/categories/${selectedParentId}/items`;

        await authFetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setIsItemModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      alert('Error saving item: ' + err.message);
    }
  };

  // Delete Item
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    try {
      await authFetch(`/api/v1/sections/items/${itemId}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert('Error deleting item: ' + err.message);
    }
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await authFetch(`/api/v1/sections/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-md">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Dynamic Sections & Categories</h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage app homepage sections, categories, items, and customer booking passes
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setEditingSection(null);
                setSectionForm({ title: '', order: sections.length });
                setIsSectionModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Section
            </button>

            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', image: PRESET_IMAGES[0].url, order: categories.length });
                setIsCategoryModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25 transition cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" /> Add Category
            </button>

            <button
              onClick={loadData}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl border border-zinc-700/60 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80 mt-6 pb-2">
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'sections'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Home Sections ({sections.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            Categories ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <Ticket className="w-4 h-4" />
            Customer Bookings & Passes ({bookings.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 gap-3">
            <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-400 font-medium">Loading CMS items...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: SECTIONS */}
            {activeTab === 'sections' && (
              <div className="space-y-6">
                {sections.length === 0 ? (
                  <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800">
                    <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No Sections Configured Yet</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      Click "Add Section" to create a new homepage section. Whatever you add here will be dynamically shown on the user app!
                    </p>
                  </div>
                ) : (
                  sections.map((section) => (
                    <div
                      key={section.id}
                      className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm"
                    >
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3 mb-6">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h2 className="text-lg font-black text-white">{section.title}</h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Order: {section.order}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {(section.items || []).length} active items linked to this section
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setTargetType('section');
                              setSelectedParentId(section.id);
                              setEditingItem(null);
                              setItemFormStep(1);
                              setIsItemModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Item
                          </button>

                          <button
                            onClick={() => {
                              setEditingSection(section);
                              setSectionForm({ title: section.title, order: section.order });
                              setIsSectionModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                            title="Edit Section Name"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteSection(section.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                            title="Delete Section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Items Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(section.items || []).length === 0 ? (
                          <div className="col-span-full py-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                            No items added in this section yet. Click "Add Item" above to add the first item.
                          </div>
                        ) : (
                          section.items.map((item) => (
                            <div
                              key={item.id}
                              className="bg-black/40 border border-zinc-800/80 rounded-xl overflow-hidden hover:border-rose-500/40 transition group flex flex-col justify-between"
                            >
                              <div className="relative h-40 w-full overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-md">
                                  {item.badge || 'Trending'}
                                </div>
                                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white backdrop-blur-sm">
                                  ₹{item.price.toLocaleString('en-IN')} {item.priceUnit}
                                </div>
                              </div>

                              <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                                  {item.subtitle && (
                                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{item.subtitle}</p>
                                  )}
                                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-2">
                                    <MapPin className="w-3 h-3 text-rose-500" />
                                    <span>{item.location || 'Patna, Bihar'}</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/60">
                                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    {(item.features || []).length} Features
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setTargetType('section');
                                        setSelectedParentId(section.id);
                                        setEditingItem(item);
                                        setItemForm({
                                          title: item.title,
                                          subtitle: item.subtitle || '',
                                          badge: item.badge || 'Trending',
                                          location: item.location || 'Patna, Bihar',
                                          itemType: item.itemType,
                                          price: item.price,
                                          priceUnit: item.priceUnit,
                                          features: (item.features || []).join(', '),
                                          availableDates: (item.availableDates || []).join(', '),
                                          availableTimes: (item.availableTimes || []).join(', '),
                                          totalSlots: item.totalSlots || 100,
                                          image: item.image,
                                          tags: (item.tags || []).join(', '),
                                          celebrationTheme: (item.tags || []).find((t: string) => ['wedding', 'birthday', 'loksafari', 'anniversary', 'corporate'].includes(t.toLowerCase())) || 'None',
                                          description: item.description || '',
                                        });
                                        setItemFormStep(1);
                                        setIsItemModalOpen(true);
                                      }}
                                      className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition cursor-pointer"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="p-1 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                {categories.length === 0 ? (
                  <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800">
                    <FolderPlus className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No Categories Created Yet</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      Click "Add Category" to create a category with its name & image. These will be displayed in the app's Explore/Category screen!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm flex flex-col justify-between"
                      >
                        <div className="relative h-44 w-full">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                            <div>
                              <h3 className="text-base font-black text-white">{cat.name}</h3>
                              <p className="text-[11px] text-zinc-300">
                                {(cat.items || []).length} items attached
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingCategory(cat);
                                  setCategoryForm({ name: cat.name, image: cat.image, order: cat.order });
                                  setIsCategoryModalOpen(true);
                                }}
                                className="p-1.5 bg-black/60 hover:bg-black text-white rounded-lg backdrop-blur-md transition cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-lg backdrop-blur-md transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2 mb-4">
                            <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
                              <span>Category Items:</span>
                              <button
                                onClick={() => {
                                  setTargetType('category');
                                  setSelectedParentId(cat.id);
                                  setEditingItem(null);
                                  setItemFormStep(1);
                                  setIsItemModalOpen(true);
                                }}
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" /> Add Item
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {(cat.items || []).slice(0, 3).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between p-2 rounded-lg bg-black/40 text-xs border border-zinc-800/60"
                                >
                                  <span className="font-semibold text-zinc-200 line-clamp-1">{item.title}</span>
                                  <span className="font-mono text-zinc-400 text-[11px]">₹{item.price}</span>
                                </div>
                              ))}
                              {(cat.items || []).length > 3 && (
                                <p className="text-[11px] text-zinc-500 text-center">
                                  +{(cat.items || []).length - 3} more items in this category
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                  <div>
                    <h2 className="text-lg font-black text-white">Live Customer Bookings & Passes</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Real-time passes booked from user mobile app & web</p>
                  </div>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-16 text-zinc-500 text-xs">
                    No customer bookings made yet. When users book in the app, their tickets and time slots will appear here instantly.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Pass Code / Date</th>
                          <th className="py-3 px-4">Booked Item</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Selected Slot</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-zinc-800/30 transition">
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-bold text-rose-400">{b.ticketCode}</span>
                              <p className="text-[10px] text-zinc-500 mt-0.5">
                                {new Date(b.createdAt).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-white">{b.item?.title || 'Unknown Item'}</p>
                              <p className="text-[10px] text-zinc-400">{b.item?.location}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-zinc-200">{b.userName}</p>
                              <p className="text-[10px] text-zinc-400">{b.userPhone}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1 text-zinc-300">
                                <Calendar className="w-3 h-3 text-rose-500" />
                                <span>{b.bookingDate}</span>
                              </div>
                              {b.bookingTime && (
                                <div className="flex items-center gap-1 text-zinc-400 text-[10px] mt-0.5">
                                  <Clock className="w-3 h-3 text-indigo-400" />
                                  <span>{b.bookingTime}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                              ₹{b.totalAmount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  b.status === 'CONFIRMED'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : b.status === 'COMPLETED'
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <select
                                value={b.status}
                                onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-1 focus:outline-none"
                              >
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      
            {/* ADVANCE FILTERS & THEMES TAB */}
            {activeTab === 'filters' && (
              <div className="space-y-6">
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <ListFilter className="w-5 h-5 text-purple-400" />
                        Advance Filters & Exploration Themes CMS
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        These filters appear dynamically in the mobile app sidebar drawer and explore filter sheet. Connected directly to mobile routes.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingFilter(null);
                        setFilterForm({
                          title: '',
                          subtitle: '',
                          tag: 'WEDDING',
                          category: 'Weddings',
                          route: '/(tabs)/explore?category=Weddings',
                          keywords: 'wedding, mandap, decor, banquet, palace',
                          filterType: 'THEME',
                          icon: 'Sparkles',
                          order: advanceFilters.length,
                        });
                        setIsFilterModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/20 cursor-pointer self-start"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create New Filter
                    </button>
                  </div>

                  {advanceFilters.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                      <ListFilter className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
                      <p className="text-sm font-semibold">No custom filters configured yet.</p>
                      <p className="text-xs text-zinc-600 mt-1">Default celebration presets are currently serving the mobile app.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {advanceFilters.map((f) => (
                        <div
                          key={f.id}
                          className="bg-black/40 border border-zinc-800 rounded-2xl p-4.5 flex flex-col justify-between hover:border-zinc-700 transition relative group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 font-mono">
                                {f.tag || 'THEME'}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                #{f.filterType || 'THEME'}
                              </span>
                            </div>

                            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-purple-300 transition">
                              {f.title}
                            </h3>
                            {f.subtitle && (
                              <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                                {f.subtitle}
                              </p>
                            )}

                            <div className="bg-zinc-900/80 rounded-xl p-2.5 space-y-1.5 text-[11px] mb-3">
                              <div className="flex items-center justify-between text-zinc-400">
                                <span>Category Filter:</span>
                                <span className="font-semibold text-zinc-200">{f.category || f.title}</span>
                              </div>
                              <div className="flex items-center justify-between text-zinc-400">
                                <span>Target Route:</span>
                                <span className="font-mono text-purple-300 text-[10px] truncate max-w-[180px]">{f.route || '/(tabs)/explore'}</span>
                              </div>
                              {Array.isArray(f.keywords) && f.keywords.length > 0 && (
                                <div className="pt-1 border-t border-zinc-800/60 flex flex-wrap gap-1">
                                  {f.keywords.slice(0, 4).map((kw, i) => (
                                    <span key={i} className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Active in App
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingFilter(f);
                                  setFilterForm({
                                    title: f.title,
                                    subtitle: f.subtitle || '',
                                    tag: f.tag || 'FEATURED',
                                    category: f.category || f.title,
                                    route: f.route || `/(tabs)/explore?category=${encodeURIComponent(f.title)}`,
                                    keywords: Array.isArray(f.keywords) ? f.keywords.join(', ') : '',
                                    filterType: f.filterType || 'THEME',
                                    icon: f.icon || 'Sparkles',
                                    order: f.order || 0,
                                  });
                                  setIsFilterModalOpen(true);
                                }}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                                title="Edit Filter"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFilter(f.id)}
                                className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                                title="Delete Filter"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

      {/* SECTION MODAL (Only name asked) */}
      <AnimatePresence>
        {isSectionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-rose-500" />
                  {editingSection ? 'Edit Section' : 'Add New Home Section'}
                </h3>
                <button
                  onClick={() => setIsSectionModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSection} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Section Name *
                  </label>
                  <input
                    type="text"
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                    placeholder="e.g. Wedding Packages, Trending Experiences, Birthday Themes"
                    required
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    This title will appear as a dedicated horizontal section on the mobile user app home screen!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={sectionForm.order}
                    onChange={(e) => setSectionForm({ ...sectionForm, order: Number(e.target.value) })}
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsSectionModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-800 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30"
                  >
                    {editingSection ? 'Update Section' : 'Create Section'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CATEGORY MODAL (Name and Image asked) */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-indigo-500" />
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Destination Weddings, Grand Banquets, DJ & Entertainment"
                    required
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Category Image URL *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    required
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />

                  {/* Preset Image Selector */}
                  <div className="mt-2.5">
                    <p className="text-[11px] text-zinc-400 mb-1.5">Or choose high-res preset image:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_IMAGES.slice(0, 6).map((preset) => (
                        <div
                          key={preset.label}
                          onClick={() => setCategoryForm({ ...categoryForm, image: preset.url })}
                          className={`relative h-14 rounded-lg overflow-hidden border cursor-pointer transition ${
                            categoryForm.image === preset.url ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-zinc-800'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={categoryForm.order}
                    onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-800 text-xs"
                  >
                    Cancel
                  </button>
                                      

<button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                  >
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ITEM MODAL (Form 1: Title, Subtitle, Badge, Price | Form 2: Image, Description, Features, Times) */}
      <AnimatePresence>
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-500" />
                    {editingItem ? 'Edit Item' : 'Add Item'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      onClick={() => setItemFormStep(1)}
                      className={`text-xs font-bold px-2 py-0.5 rounded cursor-pointer ${
                        itemFormStep === 1 ? 'bg-rose-500 text-white' : 'text-zinc-400 bg-zinc-800'
                      }`}
                    >
                      Step 1: Card Overview
                    </span>
                    <span
                      onClick={() => setItemFormStep(2)}
                      className={`text-xs font-bold px-2 py-0.5 rounded cursor-pointer ${
                        itemFormStep === 2 ? 'bg-rose-500 text-white' : 'text-zinc-400 bg-zinc-800'
                      }`}
                    >
                      Step 2: Details & Booking
                    </span>
                  </div>
                </div>

                <button onClick={() => setIsItemModalOpen(false)} className="p-1 rounded-lg text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                {/* FORM STEP 1: Basic Card Specs */}
                {itemFormStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Item Title *
                      </label>
                      <input
                        type="text"
                        value={itemForm.title}
                        onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                        placeholder="e.g. Royal Palace Destination Wedding Pass"
                        required
                        className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={itemForm.subtitle}
                          onChange={(e) => setItemForm({ ...itemForm, subtitle: e.target.value })}
                          placeholder="e.g. Grand Mandap & Luxury Stay"
                          className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Badge (Top Corner)
                        </label>
                        <input
                          type="text"
                          value={itemForm.badge}
                          onChange={(e) => setItemForm({ ...itemForm, badge: e.target.value })}
                          placeholder="e.g. Trending, 50% OFF, Best Seller, VIP"
                          className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          value={itemForm.price}
                          onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                          required
                          className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Price Unit
                        </label>
                        <input
                          type="text"
                          value={itemForm.priceUnit}
                          onChange={(e) => setItemForm({ ...itemForm, priceUnit: e.target.value })}
                          placeholder="e.g. per booking, per guest, per plate"
                          className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Location
                        </label>
                        <input
                          type="text"
                          value={itemForm.location}
                          onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                          placeholder="e.g. Patna, Bihar"
                          className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Type
                        </label>
                        <select
                          value={itemForm.itemType}
                          onChange={(e) => setItemForm({ ...itemForm, itemType: e.target.value as any })}
                          className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                        >
                          <option value="BOOKING">BOOKING (Celebration / Service)</option>
                          <option value="TICKET">TICKET (Admission Pass)</option>
                        </select>
                      </div>
                    </div>

                    {/* Celebration Theme / Package Preset */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                          Celebration Theme / Package
                        </label>
                        <select
                          value={(itemForm as any).celebrationTheme}
                          onChange={(e) => {
                            const val = e.target.value;
                            let newTags = (itemForm as any).tags || '';
                            if (val !== 'None' && !newTags.toLowerCase().includes(val.toLowerCase())) {
                              newTags = newTags ? `${newTags}, ${val.toLowerCase()}` : val.toLowerCase();
                            }
                            setItemForm({ ...itemForm, celebrationTheme: val, tags: newTags } as any);
                          }}
                          className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                        >
                          <option value="None">Standard Item / Single Service</option>
                          <option value="wedding">💍 Wedding & Royal Mandap Package</option>
                          <option value="birthday">🎈 Birthday Fiesta Celebration Package</option>
                          <option value="loksafari">🦁 LokSafari Adventure Entry Pass</option>
                          <option value="catering">🍛 56-Bhog Royal Catering Package</option>
                          <option value="decor">✨ Floral & Theme Decoration Package</option>
                          <option value="anniversary">💖 Engagement & Anniversary Package</option>
                          <option value="corporate">🏢 Corporate & Conference Package</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-indigo-400" />
                          Tags & Keywords (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={(itemForm as any).tags}
                          onChange={(e) => setItemForm({ ...itemForm, tags: e.target.value } as any)}
                          placeholder="e.g. wedding, mandap, royal, package, luxury"
                          className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>

                    {/* Quick Tag Badges */}
                    <div>
                      <p className="text-[11px] text-zinc-400 mb-1.5">Quick Add Tags for Mobile Exploration:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'wedding',
                          'birthday',
                          'packages',
                          'mandap',
                          'royal palace',
                          'catering 56-bhog',
                          'balloon decor',
                          'dj sound',
                          'loksafari',
                          'luxury',
                          'trending',
                        ].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              const cur = (itemForm as any).tags || '';
                              if (!cur.toLowerCase().includes(t.toLowerCase())) {
                                const updated = cur ? `${cur}, ${t}` : t;
                                setItemForm({ ...itemForm, tags: updated } as any);
                              }
                            }}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-300 border border-zinc-700 transition cursor-pointer"
                          >
                            + {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setItemFormStep(2)}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      Next: Features & Booking Times <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* FORM STEP 2: Detail Page, Description, Image, Features, Times */}
                {itemFormStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Item Image URL *
                      </label>
                      <input
                        type="text"
                        value={itemForm.image}
                        onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                        required
                        className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                      />

                      <div className="mt-2.5">
                        <p className="text-[11px] text-zinc-400 mb-1.5">Quick Pick Image:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {PRESET_IMAGES.slice(0, 8).map((preset) => (
                            <div
                              key={preset.label}
                              onClick={() => setItemForm({ ...itemForm, image: preset.url })}
                              className={`relative h-12 rounded-lg overflow-hidden border cursor-pointer transition ${
                                itemForm.image === preset.url ? 'border-rose-500 ring-2 ring-rose-500/50' : 'border-zinc-800'
                              }`}
                            >
                              <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={itemForm.description}
                        onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                        placeholder="Comprehensive details shown when customer opens this item in the app..."
                        className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Features (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={itemForm.features}
                        onChange={(e) => setItemForm({ ...itemForm, features: e.target.value })}
                        placeholder="AC Hall, Free Parking, Security Escort, Pure Veg Food"
                        className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Available Dates (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={itemForm.availableDates}
                          onChange={(e) => setItemForm({ ...itemForm, availableDates: e.target.value })}
                          placeholder="2026-10-24, 2026-10-25"
                          className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Available Times (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={itemForm.availableTimes}
                          onChange={(e) => setItemForm({ ...itemForm, availableTimes: e.target.value })}
                          placeholder="10:00 AM - 02:00 PM, 06:30 PM - 11:30 PM"
                          className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-rose-500 focus:outline-none font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setItemFormStep(1)}
                        className="py-2.5 px-4 rounded-xl border border-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-800 text-xs"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30"
                      >
                        {editingItem ? 'Update Item' : 'Publish Item'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    {/* ADVANCE FILTER / THEME MODAL */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ListFilter className="w-5 h-5 text-purple-400" />
                  {editingFilter ? 'Edit Advance Filter / Theme' : 'Create Advance Filter / Theme'}
                </h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Preset Selector */}
              {!editingFilter && (
                <div className="mb-4 bg-purple-950/20 border border-purple-500/25 rounded-xl p-3">
                  <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-2">
                    Quick Pick Celebration Preset:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Wedding Themes', cat: 'Weddings', tag: 'WEDDING', sub: 'Royal palaces, varmala stages & destination packages', kw: 'wedding, mandap, decor, banquet, palace' },
                      { label: 'Wedding Offers', cat: 'Wedding Offers', tag: 'OFFERS', sub: 'Instant cashback, early bird & VIP promo discounts', kw: 'offer, discount, promo, cashback, deal' },
                      { label: 'Birthday Themes', cat: 'Birthdays', tag: 'BIRTHDAY', sub: 'Neon backdrops, DJ parties, magicians & cake setups', kw: 'birthday, cake, balloon, dj, party, fiesta' },
                      { label: 'Catering & Feasts', cat: 'Catering', tag: 'CATERING', sub: 'Pure Desi Ghee banquets, live chaat & mocktails', kw: 'catering, food, buffet, live chaat, pure ghee' },
                      { label: 'Baby Shower', cat: 'Baby Shower', tag: 'BABY', sub: 'Pastel balloon arches, high tea & cradle setups', kw: 'baby, shower, cradle, balloon, mom-to-be' },
                      { label: 'Engagements', cat: 'Engagements', tag: 'ROKA', sub: 'Ring ceremony stages, acoustic music & fairy lights', kw: 'engagement, roka, ring ceremony, sangeet' },
                      { label: 'Corporate Events', cat: 'Corporate', tag: 'CORP', sub: 'Annual summits, award galas & corporate banquets', kw: 'corporate, summit, conference, meeting, seminar' },
                      { label: 'LokSafari Escapes', cat: 'LokSafari', tag: 'SAFARI', sub: 'Private pool villas, luxury tents & farmstays', kw: 'safari, resort, swimming pool, villa, farmstay' },
                    ].map((pre) => (
                      <button
                        key={pre.label}
                        type="button"
                        onClick={() => {
                          setFilterForm({
                            title: pre.label,
                            subtitle: pre.sub,
                            tag: pre.tag,
                            category: pre.cat,
                            route: `/(tabs)/explore?category=${encodeURIComponent(pre.cat)}`,
                            keywords: pre.kw,
                            filterType: 'THEME',
                            icon: 'Sparkles',
                            order: advanceFilters.length,
                          });
                        }}
                        className="text-[11px] bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/30 px-2.5 py-1 rounded-lg transition cursor-pointer font-medium"
                      >
                        + {pre.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveFilter} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Filter Title *
                  </label>
                  <input
                    type="text"
                    value={filterForm.title}
                    onChange={(e) => setFilterForm({ ...filterForm, title: e.target.value })}
                    placeholder="e.g. Wedding Themes & Mandaps, LokSafari & Resorts"
                    required
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Subtitle / Description
                  </label>
                  <input
                    type="text"
                    value={filterForm.subtitle}
                    onChange={(e) => setFilterForm({ ...filterForm, subtitle: e.target.value })}
                    placeholder="Short description displayed in sidebar"
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      value={filterForm.tag}
                      onChange={(e) => setFilterForm({ ...filterForm, tag: e.target.value })}
                      placeholder="e.g. WEDDING, BIRTHDAY"
                      className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none uppercase font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Matched Category
                    </label>
                    <input
                      type="text"
                      value={filterForm.category}
                      onChange={(e) => setFilterForm({ ...filterForm, category: e.target.value })}
                      placeholder="e.g. Weddings, Catering"
                      className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Target Mobile Route
                  </label>
                  <input
                    type="text"
                    value={filterForm.route}
                    onChange={(e) => setFilterForm({ ...filterForm, route: e.target.value })}
                    placeholder="/(tabs)/explore?category=Weddings"
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-purple-300 font-mono text-xs focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    When the customer clicks this filter in the mobile app, it instantly opens this screen.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Search Keywords (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={filterForm.keywords}
                    onChange={(e) => setFilterForm({ ...filterForm, keywords: e.target.value })}
                    placeholder="wedding, mandap, varmala, palace, decor"
                    className="w-full bg-black/60 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsFilterModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 font-semibold hover:bg-zinc-800 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
                  >
                    {editingFilter ? 'Update Advance Filter' : 'Publish Advance Filter'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



    </div>
  );
}
