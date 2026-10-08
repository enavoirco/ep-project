import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Phone,
  Trash2,
  Check,
} from 'lucide-react';
import { FollowUp } from '../../types/index.ts';
import { api } from '../../services/api.ts';

interface AdminFollowUpsProps {
  navigate: (path: string) => void;
}

export const AdminFollowUps: React.FC<AdminFollowUpsProps> = ({ navigate }) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'dueToday' | 'overdue' | 'completed'>('all');

  const fetchFollowUps = async () => {
    setIsLoading(true);
    try {
      const data = await api.getFollowUps();
      setFollowUps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const dueToday = followUps.filter(f => f.status === 'Pending' && f.due_date === todayStr);
  const overdue = followUps.filter(f => f.status === 'Pending' && f.due_date < todayStr);
  const completed = followUps.filter(f => f.status === 'Completed');

  const handleToggleStatus = async (item: FollowUp) => {
    try {
      const newStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
      await api.updateFollowUp(item.id, { status: newStatus });
      fetchFollowUps();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this follow-up reminder?')) return;
    try {
      await api.deleteFollowUp(id);
      fetchFollowUps();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems =
    activeTab === 'dueToday'
      ? dueToday
      : activeTab === 'overdue'
      ? overdue
      : activeTab === 'completed'
      ? completed
      : followUps;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#302B2B] tracking-tight">
            Client Follow-up Schedules
          </h1>
          <p className="text-xs text-[#747474] mt-0.5">
            Never miss an outdoor media advertiser callback, rate card negotiation, or artwork deadline.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E3E3E0] pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#1098C7] text-white font-bold'
              : 'bg-white border border-[#E3E3E0] text-[#454141] hover:text-[#1098C7]'
          }`}
        >
          All Schedules ({followUps.length})
        </button>
        <button
          onClick={() => setActiveTab('dueToday')}
          className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'dueToday'
              ? 'bg-[#1098C7] text-white font-bold'
              : 'bg-white border border-[#E3E3E0] text-amber-700 hover:border-amber-400'
          }`}
        >
          <span>Due Today</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
            {dueToday.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'overdue'
              ? 'bg-rose-600 text-white font-bold'
              : 'bg-white border border-[#E3E3E0] text-rose-700 hover:border-rose-400'
          }`}
        >
          <span>Overdue</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
            {overdue.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3.5 py-1.5 rounded-xs text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white font-bold'
              : 'bg-white border border-[#E3E3E0] text-[#454141] hover:text-[#1098C7]'
          }`}
        >
          Completed ({completed.length})
        </button>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#747474] animate-pulse">Loading follow-ups...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-sm bg-white border border-[#E3E3E0] space-y-2 shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-[#302B2B]">No pending tasks in this view</h3>
            <p className="text-xs text-[#747474]">All client interactions are currently up-to-date.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isOverdue = item.status === 'Pending' && item.due_date < todayStr;
            const isDueToday = item.status === 'Pending' && item.due_date === todayStr;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-sm border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.status === 'Completed'
                    ? 'bg-[#F7F7F4] border-[#E3E3E0] opacity-60'
                    : isOverdue
                    ? 'bg-rose-50/60 border-rose-300 shadow-xs'
                    : isDueToday
                    ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                    : 'bg-white border-[#E3E3E0] shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`mt-1 w-5 h-5 rounded-xs flex items-center justify-center border transition-all cursor-pointer ${
                      item.status === 'Completed'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-[#E3E3E0] bg-white hover:border-[#1098C7]'
                    }`}
                  >
                    {item.status === 'Completed' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-xs ${item.status === 'Completed' ? 'line-through text-[#747474]' : 'text-[#302B2B]'}`}>
                        {item.title}
                      </span>
                      {isOverdue && (
                        <span className="px-1.5 py-0.5 rounded-xs text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                          OVERDUE
                        </span>
                      )}
                      {isDueToday && (
                        <span className="px-1.5 py-0.5 rounded-xs text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300">
                          DUE TODAY
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-[#747474] flex flex-wrap items-center gap-3">
                      <span>Client: <strong className="text-[#302B2B]">{item.lead_name}</strong> ({item.lead_company || 'N/A'})</span>
                      <span>&bull;</span>
                      <a href={`tel:${item.lead_phone}`} className="text-[#1098C7] hover:underline flex items-center gap-1 font-medium">
                        <Phone className="w-3 h-3" />
                        <span>{item.lead_phone}</span>
                      </a>
                      <span>&bull;</span>
                      <span className="text-[#747474]">Scheduled: {item.due_date}</span>
                    </div>

                    {item.notes && <p className="text-[11px] text-[#454141] italic pt-0.5">{item.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => navigate('/admin/leads')}
                    className="px-2.5 py-1.5 rounded-xs bg-[#E8F6FA] hover:bg-[#1098C7] text-[#1098C7] hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    View Lead
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-xs hover:bg-rose-50 text-rose-600 cursor-pointer"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
