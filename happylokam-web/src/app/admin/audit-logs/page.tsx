'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { authFetch } from '@/lib/auth-fetch';

interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  action: string;
  resource: string;
  ipAddress: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/v1/admin/audit');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || data);
      } else {
        toast.error('Failed to fetch audit logs');
      }
    } catch (err) {
      toast.error('Error fetching audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            Audit Logs
          </h1>
          <p className="text-gray-400 mt-1">System security and action logs</p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">Admin ID</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Resource</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-rose-400">{log.adminId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/5 rounded-md text-xs font-medium border border-white/10">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{log.resource}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{log.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
