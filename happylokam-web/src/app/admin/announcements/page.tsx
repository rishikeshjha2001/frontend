'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { authFetch } from '@/lib/auth-fetch';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'ALL',
    priority: 'LOW',
    expiresAt: ''
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/v1/announcements/all');
      if (!res.ok) throw new Error('Failed to fetch announcements');
      const data = await res.json();
      setAnnouncements(data.announcements || data.data || []);
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/v1/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create announcement');
      
      toast.success('Announcement created successfully');
      setIsModalOpen(false);
      setFormData({ title: '', message: '', targetAudience: 'ALL', priority: 'LOW', expiresAt: '' });
      fetchAnnouncements();
    } catch (error) {
      toast.error('Error creating announcement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await authFetch(`/api/v1/announcements/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete announcement');
      toast.success('Announcement deleted');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Error deleting announcement');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'URGENT': return 'bg-red-100 text-red-700';
      case 'HIGH': return 'bg-orange-100 text-orange-700';
      case 'MEDIUM': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-rose-600" />
            System Announcements
          </h1>
          <p className="text-gray-500 mt-1">Broadcast messages to users and partners</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Announcement
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Target</th>
                <th className="p-4 font-medium">Priority</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Expires</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 bg-gray-100 rounded"></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No announcements found
                  </td>
                </tr>
              ) : (
                announcements.map((announcement) => {
                  const isExpired = new Date(announcement.expiresAt) < new Date();
                  return (
                    <tr key={announcement._id || announcement.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{announcement.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{announcement.message}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                          {announcement.targetAudience}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          isExpired ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                        }`}>
                          {isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(announcement.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(announcement._id || announcement.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Announcement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">New Announcement</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  placeholder="e.g. Scheduled Maintenance"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  >
                    <option value="ALL">All Users</option>
                    <option value="USER">Customers Only</option>
                    <option value="PARTNER">Partners Only</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Expires At</label>
                <input
                  required
                  type="date"
                  value={formData.expiresAt}
                  onChange={e => setFormData({...formData, expiresAt: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none"
                  placeholder="Announcement details..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
