'use client';

import { useEffect, useState } from 'react';
import { Loader2, Bell, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/v1/notifications/my', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data.data || []);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to mark as read');
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with your activities</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="font-medium text-gray-900">No notifications yet</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-6 flex items-start gap-4 transition-colors ${!notif.read ? 'bg-rose-50/30' : 'hover:bg-gray-50'}`}
              >
                <div className={`p-2 rounded-full mt-1 ${!notif.read ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`text-base font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notif.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
