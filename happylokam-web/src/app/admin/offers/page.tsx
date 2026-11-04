'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, X, Tag, Sparkles } from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    discountPercent: '',
    description: '',
    validFrom: '',
    validTo: '',
  });

  const fetchOffers = async () => {
    try {
      const response = await authFetch('/api/v1/offers/all');
      if (!response.ok) throw new Error('Failed to fetch offers');
      const data = await response.json();
      setOffers(data.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authFetch('/api/v1/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase().trim(),
          discountPercent: Number(formData.discountPercent),
        }),
      });

      if (!response.ok) throw new Error('Failed to create offer');
      toast.success('Promo coupon created successfully');
      setIsModalOpen(false);
      setFormData({ title: '', code: '', discountPercent: '', description: '', validFrom: '', validTo: '' });
      fetchOffers();
    } catch (error: any) {
      toast.error(error.message || 'Error creating offer');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      const response = await authFetch(`/api/v1/offers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete offer');
      toast.success('Offer deleted successfully');
      fetchOffers();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting offer');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Offers & Discounts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
        >
          <Plus size={18} /> Create Offer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-rose-600">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No offers found</td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer._id || offer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{offer.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{offer.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{offer.discountPercent}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(offer.validFrom).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(offer.validTo).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {offer.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleDelete(offer._id || offer.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Create Offer</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input required type="text" name="code" value={formData.code} onChange={handleChange} className="w-full border rounded px-3 py-2 uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                  <input required type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <input required type="date" name="validFrom" value={formData.validFrom} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid To</label>
                  <input required type="date" name="validTo" value={formData.validTo} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700">Save Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
