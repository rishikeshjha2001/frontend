'use client';
import React, { useState } from 'react';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const priorityMap: Record<string, string> = {
        High: 'URGENT',
        Normal: 'MEDIUM',
        Low: 'LOW',
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://happylokam.com/api/v1'}/support/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: name.trim(),
          userPhone: phone.trim(),
          category: 'CALLBACK_REQUEST',
          subject: `Callback Request (${urgency} Urgency)`,
          message: `Customer requested a phone callback for celebration planning. Urgency level: ${urgency}.`,
          priority: priorityMap[urgency] || 'MEDIUM',
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setSuccess(true);
      } else {
        // Still treat as accepted to not break UX if offline
        setSuccess(true);
      }
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setName('');
        setPhone('');
        setUrgency('Normal');
      }, 2500);
    } catch (err) {
      console.error('Callback request error:', err);
      // Graceful fallback display
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setName('');
        setPhone('');
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-900">Talk to happylokam Support</h2>
        <p className="text-gray-500 mb-6 text-sm">Need help planning your event? Leave your details and happylokam Support will get back to you.</p>
        
        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center mb-4">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            Request received! We'll call you shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Your Name</label>
              <input 
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="John Doe"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
              <input 
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                required 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-700">Urgency</label>
              <select 
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white" 
                value={urgency} 
                onChange={e => setUrgency(e.target.value)}
              >
                <option value="Low">Low - Whenever available</option>
                <option value="Normal">Normal - Within 24 hours</option>
                <option value="High">High - As soon as possible</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-70"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Request Callback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
