"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Receipt, PlusCircle, Printer, Users, Utensils, IndianRupee, Loader2 } from 'lucide-react';

export default function PartnerDashboard() {
  const [partner, setPartner] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resMe = await fetch('/api/v1/auth/me', { credentials: 'include' });
        const dataMe = await resMe.json();
        setPartner(dataMe.user);

        if (dataMe.user?.id) {
          const resBookings = await fetch(`/api/v1/bookings/partner/${dataMe.user.id}`, { credentials: 'include' });
          const dataBookings = await resBookings.json();
          if (dataBookings.success) {
            setBills(dataBookings.data || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalCustomers = new Set(bills.map(b => b.userId)).size;

  const printBill = (bill: any) => {
    // In a real app, this generates a PDF with happylokam branding.
    alert(`Printing Bill for ${bill.id}. happylokam branding applied.`);
    window.print();
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Partner Dashboard</h1>
            <p className="text-slate-500 font-medium">Welcome back, {partner?.businessName || partner?.name || partner?.hlpId}</p>
          </div>
          <button className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold shadow-md hover:shadow-lg transition flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            New Customer Bill
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><IndianRupee className="w-6 h-6" /></div>
            <p className="text-slate-500 font-bold mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Users className="w-6 h-6" /></div>
            <p className="text-slate-500 font-bold mb-1">Total Customers</p>
            <h3 className="text-3xl font-black text-slate-900">{totalCustomers}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4"><Utensils className="w-6 h-6" /></div>
            <p className="text-slate-500 font-bold mb-1">Total Bookings</p>
            <h3 className="text-3xl font-black text-slate-900">{bills.length}</h3>
          </div>
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl shadow-lg border border-indigo-500/30 text-white">
            <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center mb-4 border border-white/20"><IndianRupee className="w-6 h-6" /></div>
            <p className="text-indigo-200 font-bold mb-1">Estimated Commission (5%)</p>
            <h3 className="text-3xl font-black text-white">₹{Math.floor(totalRevenue * 0.05).toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Your Referral Link</h3>
            <p className="text-slate-500 font-medium text-sm">Share this link to earn 5% commission on every booking!</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input type="text" readOnly value={`https://happylokam.com/ref/${partner?.hlpId || 'PARTNER'}`} className="bg-slate-50 border border-slate-200 text-slate-700 font-mono px-4 py-3 rounded-xl flex-1 md:w-80 outline-none" />
            <button onClick={() => { navigator.clipboard.writeText(`https://happylokam.com/ref/${partner?.hlpId || 'PARTNER'}`); alert('Referral link copied!'); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition">Copy</button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden print:shadow-none print:border-none">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-600" /> Recent Billing & POS
            </h2>
          </div>
          <div className="p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-4 font-bold text-slate-500">Bill ID</th>
                  <th className="pb-4 font-bold text-slate-500">Customer</th>
                  <th className="pb-4 font-bold text-slate-500">Date</th>
                  <th className="pb-4 font-bold text-slate-500">Amount</th>
                  <th className="pb-4 font-bold text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.length > 0 ? bills.map((bill) => (
                  <tr key={bill.id} className="border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-bold text-slate-900">#{bill.id.substring(0, 8)}</td>
                    <td className="py-4 font-medium text-slate-600">{bill.user?.name || 'Customer'}</td>
                    <td className="py-4 font-medium text-slate-500">{new Date(bill.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 font-bold text-emerald-600">₹{bill.totalAmount}</td>
                    <td className="py-4 text-right">
                      <button onClick={() => printBill(bill)} className="text-rose-600 hover:text-rose-700 font-bold flex items-center justify-end gap-1 w-full">
                        <Printer className="w-4 h-4" /> Print Bill
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">No bookings yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
