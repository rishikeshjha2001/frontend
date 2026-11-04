'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    price: '',
    images: [] as string[]
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/v1/auth/me', { credentials: 'include' });
        if (!res.ok) throw new Error('Auth failed');
        const data = await res.json();
        setPartnerId(data.user.id);
      } catch (err) {
        toast.error('Could not authenticate user');
      }
    };
    fetchUser();
  }, []);

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!partnerId) {
      toast.error('Partner ID missing');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        partnerId,
        name: formData.name,
        description: formData.description,
        city: formData.city,
        price: Number(formData.price),
        images: formData.images
      };

      const res = await fetch('/api/v1/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create listing');
      toast.success('Listing created successfully');
      router.push('/partner/listings');
    } catch (err) {
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Listing</h1>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1">
              <div className={`h-2 rounded-full ${step >= i ? 'bg-rose-600' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Basic Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" 
                placeholder="e.g. Premium Wedding Photography"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input 
                type="text" 
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" 
                placeholder="e.g. Mumbai"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Description & Pricing</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none h-32" 
                placeholder="Describe your service..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none" 
                placeholder="e.g. 50000"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Upload Photos</h2>
            <p className="text-sm text-gray-500">Upload photos to showcase your work. Maximum 5 images.</p>
            <div>
              <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-rose-400 transition-colors">
                  <div className="text-gray-400 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="font-medium text-gray-600">Click to upload images</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB each</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={handleAddImage}
                  className="hidden"
                />
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border group">
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Review & Submit</h2>
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>City:</strong> {formData.city}</p>
              <p><strong>Price:</strong> ₹{formData.price}</p>
              <p><strong>Images:</strong> {formData.images.length} added</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={handlePrev}
            disabled={step === 1 || loading}
            className="flex items-center gap-2 px-6 py-2.5 text-gray-600 font-medium disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-8 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
