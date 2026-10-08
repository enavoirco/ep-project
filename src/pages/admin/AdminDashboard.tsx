import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Users,
  CalendarCheck,
  FileText,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DashboardStats, Lead, ActivityLog } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { LeadStatusBadge, PriorityBadge } from '../../components/common/Badge.tsx';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-[#E3E3E0] rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-28 bg-white border border-[#E3E3E0] rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Billboard Sites',
      value: stats.locations_count,
      sub: `${stats.available_count} Available in Kalaburagi`,
      icon: MapPin,
      color: 'text-[#1098C7]',
      bg: 'bg-[#E8F6FA]',
      path: '/admin/locations',
    },
    {
      title: 'Active Booked Sites',
      value: stats.booked_count,
      sub: `${stats.reserved_count} Reserved Pending`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      path: '/admin/locations',
    },
    {
      title: 'Pipeline Leads',
      value: stats.total_leads,
      sub: `${stats.new_leads} New Inquiries`,
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      path: '/admin/leads',
    },
    {
      title: 'Follow-ups Due',
      value: stats.follow_ups_due,
      sub: 'Action required today',
      icon: CalendarCheck,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      path: '/admin/follow-ups',
    },
    {
      title: 'Quote Inquiries',
      value: stats.quotes_requested,
      sub: 'From online rate cards',
      icon: FileText,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      path: '/admin/enquiries',
    },
    {
      title: 'Recent Inquiries',
      value: stats.recent_leads?.length || 0,
      sub: 'Active in lead pipeline',
      icon: Eye,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      path: '/admin/leads',
    },
    {
      title: 'Inventory Occupancy',
      value: `${stats.locations_count ? Math.round((stats.booked_count / stats.locations_count) * 100) : 0}%`,
      sub: 'Current capacity utilized',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      path: '/admin/locations',
    },
    {
      title: 'Campaign Pipeline',
      value: `${stats.total_leads} Inquiries`,
      sub: 'Potential booking volume',
      icon: Sparkles,
      color: 'text-[#1098C7]',
      bg: 'bg-[#E8F6FA]',
      path: '/admin/leads',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#302B2B]">
            Operations Dashboard
          </h1>
          <p className="text-xs text-[#747474] mt-1">
            Real-time outdoor advertising metrics, Kalaburagi inventory availability, and sales CRM pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/leads')}
            className="px-4 py-2 bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>View Leads Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => navigate(card.path)}
              className="p-5 bg-white border border-[#E3E3E0] rounded-sm hover:border-[#1098C7] transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#747474]">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xs ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <p className="font-display font-black text-2xl text-[#302B2B]">{card.value}</p>
                <p className="text-xs text-[#747474] mt-0.5">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Column: Leads Pipeline Breakdown & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Leads By Stage */}
        <div className="lg:col-span-7 bg-white border border-[#E3E3E0] p-6 rounded-sm space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E3E3E0] pb-4">
            <div>
              <h3 className="font-display font-bold text-base text-[#302B2B]">
                Leads Pipeline by Stage
              </h3>
              <p className="text-xs text-[#747474]">Distribution across the customer acquisition funnel</p>
            </div>
            <button
              onClick={() => navigate('/admin/leads')}
              className="text-xs text-[#1098C7] hover:underline font-semibold"
            >
              Open Pipeline &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.leads_by_status).map(([status, count]) => {
              const max = Math.max(...Object.values(stats.leads_by_status), 1);
              const percentage = Math.round((count / max) * 100);

              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#454141]">{status}</span>
                    <span className="font-bold text-[#302B2B]">{count} lead{count === 1 ? '' : 's'}</span>
                  </div>
                  <div className="w-full h-2 bg-[#F7F7F4] rounded-full overflow-hidden border border-[#E3E3E0]">
                    <div
                      className="h-full bg-[#1098C7] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Follow-up Alert Box */}
        <div className="lg:col-span-5 bg-white border border-[#E3E3E0] p-6 rounded-sm space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E3E3E0] pb-4">
              <CalendarCheck className="w-5 h-5 text-[#1098C7]" />
              <div>
                <h3 className="font-display font-bold text-base text-[#302B2B]">
                  Follow-ups Action Desk
                </h3>
                <p className="text-xs text-[#747474]">Calls & proposals scheduled</p>
              </div>
            </div>

            <div className="p-4 bg-[#E8F6FA] border border-[#1098C7]/30 rounded-xs space-y-2">
              <span className="text-xs font-bold text-[#0879A3] uppercase tracking-wider block">
                Today's Action Required
              </span>
              <p className="text-xs text-[#454141]">
                You have <strong className="text-[#302B2B] font-bold">{stats.follow_ups_due}</strong> pending follow-up tasks due today. Follow up promptly to keep campaign inquiries warm.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#E3E3E0]">
                <span className="text-[#747474]">Sedam Road Sites Available:</span>
                <span className="font-semibold text-[#302B2B]">High Demand</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#E3E3E0]">
                <span className="text-[#747474]">Station Road Commuter Junctions:</span>
                <span className="font-semibold text-[#302B2B]">Active</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#747474]">Super Market Retail Commercial:</span>
                <span className="font-semibold text-[#302B2B]">Available</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/follow-ups')}
            className="w-full py-2.5 bg-[#302B2B] hover:bg-[#454141] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors text-center cursor-pointer"
          >
            Manage Due Follow-ups
          </button>
        </div>
      </div>
    </div>
  );
};
