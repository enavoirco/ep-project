import React, { useState, useEffect } from 'react';
import { History, Shield, Clock, Search } from 'lucide-react';
import { ActivityLog } from '../../types/index.ts';
import { api } from '../../services/api.ts';

export const AdminActivity: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await api.getActivityLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    l =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.admin_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-[#302B2B] tracking-tight">
          System Activity & Audit Trail
        </h1>
        <p className="text-xs text-[#747474] mt-0.5">
          Operational log recording every creation, mutation, and deletion performed by authorized staff in Kalaburagi.
        </p>
      </div>

      <div className="p-4 rounded-sm bg-white border border-[#E3E3E0] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#747474] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-xs text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
          />
        </div>
      </div>

      <div className="rounded-sm bg-white border border-[#E3E3E0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F4] border-b border-[#E3E3E0] text-[#747474] uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">Authorized User</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-3">Entity Target</th>
                <th className="py-3 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E3E0]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#747474]">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#747474]">
                    No activity logs recorded.
                  </td>
                </tr>
              ) : (
                filtered.map(log => (
                  <tr key={log.id} className="hover:bg-[#F7F7F4] transition-colors">
                    <td className="py-3 px-4 text-[#747474] whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#302B2B]">
                      {log.admin_name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-xs text-[10px] uppercase font-bold bg-[#E8F6FA] text-[#0879A3] border border-[#1098C7]/30">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#454141] font-mono text-[11px]">
                      {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                    </td>
                    <td className="py-3 px-4 text-[#454141]">
                      {log.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
