import React from 'react';
import { AvailabilityStatus, LeadPriority, LeadStatus } from '../../types/index.ts';

export const AvailabilityBadge: React.FC<{ availability: AvailabilityStatus }> = ({ availability }) => {
  switch (availability) {
    case 'Available':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Available
        </span>
      );
    case 'Booked':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Booked
        </span>
      );
    case 'Reserved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Reserved
        </span>
      );
    case 'Maintenance':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
          Maintenance
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 rounded-sm text-xs font-semibold bg-zinc-100 text-[#302B2B] border border-zinc-200">
          {availability}
        </span>
      );
  }
};

export const LeadStatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const styles: Record<LeadStatus, string> = {
    New: 'bg-[#E8F6FA] text-[#0879A3] border-[#1098C7]/30',
    Contacted: 'bg-sky-50 text-sky-700 border-sky-200',
    Qualified: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Proposal Sent': 'bg-amber-50 text-amber-700 border-amber-200',
    Negotiation: 'bg-orange-50 text-orange-700 border-orange-200',
    Won: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    Lost: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    'Follow-up Required': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
        styles[status] || 'bg-zinc-100 text-zinc-700 border-zinc-200'
      }`}
    >
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: LeadPriority }> = ({ priority }) => {
  const styles: Record<LeadPriority, string> = {
    Urgent: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    High: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
    Medium: 'bg-blue-50 text-blue-700 border-blue-200',
    Low: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border ${styles[priority]}`}
    >
      {priority}
    </span>
  );
};
