'use client';
import { toast } from 'sonner';
import { Download, Users, Briefcase, Calendar, CreditCard } from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

export default function AdminExportPage() {
  const handleExport = async (type: string) => {
    try {
      const response = await authFetch(`/api/v1/admin/export/${type}`);

      if (!response.ok) throw new Error(`Failed to export ${type}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `happylokam_${type}_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`${type} exported successfully`);
    } catch (error: any) {
      toast.error(error.message || `Error exporting ${type}`);
    }
  };

  const exportTypes = [
    { id: 'users', title: 'Users Data', icon: Users, description: 'Export all registered user details' },
    { id: 'partners', title: 'Partners Data', icon: Briefcase, description: 'Export partner details, wallet balances, and subscriptions' },
    { id: 'bookings', title: 'Bookings Data', icon: Calendar, description: 'Export all service and event bookings' },
    { id: 'subscriptions', title: 'Subscriptions Data', icon: CreditCard, description: 'Export partner subscription history' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Export Data</h1>
      <p className="text-gray-600 mb-8">Download Excel reports for various platform modules.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {exportTypes.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-full mb-4">
              <item.icon size={32} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h2>
            <p className="text-sm text-gray-500 mb-6 flex-grow">{item.description}</p>
            <button
              onClick={() => handleExport(item.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition"
            >
              <Download size={18} /> Download Excel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
