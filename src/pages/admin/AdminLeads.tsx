import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  ChevronRight,
  X,
  Trash2,
  Building,
  UserCheck,
  Send,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import { Lead, LeadStatus, LeadPriority, LeadSource, BillboardLocation, Customer } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { LeadStatusBadge, PriorityBadge } from '../../components/common/Badge.tsx';
import { ConfirmationModal } from '../../components/common/ConfirmationModal.tsx';

interface AdminLeadsProps {
  navigate: (path: string) => void;
}

export const AdminLeads: React.FC<AdminLeadsProps> = ({ navigate }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [locations, setLocations] = useState<BillboardLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Views
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterSource, setFilterSource] = useState('All');

  // Modals & Drawers
  const [selectedLead, setSelectedLead] = useState<(Lead & { notes_list?: any[]; follow_ups_list?: any[] }) | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Manual Lead Creation Form
  const [createForm, setCreateForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    whatsapp: '',
    location_id: '',
    campaign_type: 'Brand Awareness',
    budget: '',
    start_date: '',
    end_date: '',
    message: '',
    source: 'Phone' as LeadSource,
    priority: 'Medium' as LeadPriority,
    status: 'New' as LeadStatus,
  });

  const kanbanColumns: LeadStatus[] = [
    'New',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Negotiation',
    'Won',
    'Lost',
  ];

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminLeads({
        search: search || undefined,
        status: filterStatus !== 'All' ? filterStatus : undefined,
        priority: filterPriority !== 'All' ? filterPriority : undefined,
        source: filterSource !== 'All' ? filterSource : undefined,
      });
      setLeads(data);
    } catch (err) {
      console.error('Failed to load CRM leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchLocs = async () => {
      try {
        const locData = await api.getLocations();
        setLocations(locData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocs();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [search, filterStatus, filterPriority, filterSource]);

  const handleOpenLeadDetails = async (leadId: string) => {
    try {
      const full = await api.getLeadDetails(leadId);
      setSelectedLead(full);
    } catch (err) {
      console.error('Error fetching lead details:', err);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      fetchLeads();
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handlePriorityChange = async (leadId: string, newPriority: LeadPriority) => {
    try {
      await api.updateLead(leadId, { priority: newPriority });
      fetchLeads();
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, priority: newPriority });
      }
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    setIsAddingNote(true);
    try {
      const note = await api.addLeadNote(selectedLead.id, newNoteText.trim());
      setSelectedLead({
        ...selectedLead,
        notes_list: [note, ...(selectedLead.notes_list || [])],
      });
      setNewNoteText('');
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleConvertToCustomer = async (leadId: string) => {
    try {
      const res = await api.convertLeadToCustomer(leadId);
      alert(`Customer profile #${res.customer.id} successfully generated!`);
      fetchLeads();
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: 'Won' });
      }
    } catch (err: any) {
      alert(`Error converting: ${err.message}`);
    }
  };

  const handleDeleteLeadConfirm = async () => {
    if (!leadToDelete) return;
    try {
      await api.deleteLead(leadToDelete.id);
      setLeadToDelete(null);
      if (selectedLead && selectedLead.id === leadToDelete.id) {
        setSelectedLead(null);
      }
      fetchLeads();
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdminLead(createForm);
      setIsCreateModalOpen(false);
      setCreateForm({
        name: '',
        company: '',
        phone: '',
        email: '',
        whatsapp: '',
        location_id: '',
        campaign_type: 'Brand Awareness',
        budget: '',
        start_date: '',
        end_date: '',
        message: '',
        source: 'Phone',
        priority: 'Medium',
        status: 'New',
      });
      fetchLeads();
    } catch (err: any) {
      alert(`Failed to create lead: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#302B2B] tracking-tight">
            CRM & Lead Management System
          </h1>
          <p className="text-xs text-[#747474] mt-0.5">
            Capture, track, qualify, and negotiate outdoor advertising deals across pipeline stages.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* View Toggle */}
          <div className="p-1 rounded-xs bg-white border border-[#E3E3E0] flex items-center gap-1 shadow-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-[#1098C7] text-white font-bold'
                  : 'text-[#747474] hover:text-[#302B2B]'
              }`}
              title="Kanban Pipeline View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xs text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#1098C7] text-white font-bold'
                  : 'text-[#747474] hover:text-[#302B2B]'
              }`}
              title="Table Grid View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-xs bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-sm bg-white border border-[#E3E3E0] flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#747474] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, company, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-xs text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-white border border-[#E3E3E0] rounded-xs px-2.5 py-1.5 text-xs text-[#302B2B] focus:border-[#1098C7]"
          >
            <option value="All">All Stages</option>
            {kanbanColumns.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="bg-white border border-[#E3E3E0] rounded-xs px-2.5 py-1.5 text-xs text-[#302B2B] focus:border-[#1098C7]"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filterSource}
            onChange={e => setFilterSource(e.target.value)}
            className="bg-white border border-[#E3E3E0] rounded-xs px-2.5 py-1.5 text-xs text-[#302B2B] focus:border-[#1098C7]"
          >
            <option value="All">All Sources</option>
            <option value="Website">Website Form</option>
            <option value="Quote Request">Quote Request</option>
            <option value="Billboard Enquiry">Billboard Enquiry</option>
            <option value="Phone">Phone</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Referral">Referral</option>
          </select>
        </div>
      </div>

      {/* Main View: Kanban or Table */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[1200px]">
            {kanbanColumns.map(stage => {
              const stageLeads = leads.filter(l => l.status === stage);
              return (
                <div
                  key={stage}
                  className="flex-1 min-w-[240px] rounded-sm bg-[#F7F7F4] border border-[#E3E3E0] p-3 space-y-3 flex flex-col max-h-[75vh]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-2 py-1 border-b border-[#E3E3E0] pb-2">
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-[#302B2B]">
                      {stage}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8F6FA] text-[#1098C7]">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards list */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => handleOpenLeadDetails(lead.id)}
                        className="p-3.5 rounded-sm bg-white border border-[#E3E3E0] hover:border-[#1098C7] cursor-pointer transition-all hover:-translate-y-0.5 shadow-xs space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-[#302B2B] group-hover:text-[#1098C7] transition-colors line-clamp-1">
                            {lead.name}
                          </h4>
                          <PriorityBadge priority={lead.priority} />
                        </div>

                        <div className="text-[11px] text-[#747474] truncate font-medium">
                          {lead.company}
                        </div>

                        {lead.location_name && (
                          <div className="p-1.5 rounded-xs bg-[#F7F7F4] border border-[#E3E3E0] text-[10px] text-[#454141] truncate">
                            📍 {lead.location_name}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-[#747474] pt-1 border-t border-[#E3E3E0]">
                          <span className="font-semibold text-[#1098C7]">{lead.budget || lead.source}</span>
                          <span>{new Date(lead.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div className="text-center py-8 text-[11px] text-[#747474] italic">
                        Empty Stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="rounded-sm bg-white border border-[#E3E3E0] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F4] border-b border-[#E3E3E0] text-[#747474] uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Customer / Brand</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Billboard Asset</th>
                  <th className="py-3 px-3">Budget</th>
                  <th className="py-3 px-3">Stage</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E3E0]">
                {leads.map(lead => (
                  <tr
                    key={lead.id}
                    onClick={() => handleOpenLeadDetails(lead.id)}
                    className="hover:bg-[#F7F7F4] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#302B2B]">{lead.name}</div>
                      <div className="text-[11px] text-[#747474]">{lead.company}</div>
                    </td>
                    <td className="py-3 px-3 text-[#454141]">
                      <div>{lead.phone}</div>
                      <div className="text-[10px] text-[#747474]">{lead.email}</div>
                    </td>
                    <td className="py-3 px-3 text-[#454141] max-w-[160px] truncate">
                      {lead.location_name || 'General Inquiry'}
                    </td>
                    <td className="py-3 px-3 text-[#1098C7] font-semibold">
                      {lead.budget || 'Open'}
                    </td>
                    <td className="py-3 px-3">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="py-3 px-3">
                      <PriorityBadge priority={lead.priority} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenLeadDetails(lead.id);
                        }}
                        className="px-2.5 py-1 rounded-xs bg-[#E8F6FA] hover:bg-[#1098C7] text-[#1098C7] hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Profile Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl h-full bg-white border-l border-[#E3E3E0] p-6 sm:p-8 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right-4">
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E3E3E0] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1098C7]">
                  CRM Dossier #{selectedLead.id}
                </span>
                <h2 className="font-display font-extrabold text-2xl text-[#302B2B]">
                  {selectedLead.name}
                </h2>
                <div className="text-xs text-[#747474] font-medium">{selectedLead.company}</div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-xs text-[#747474] hover:text-[#302B2B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Buttons (Call, WhatsApp, Email, Convert) */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${selectedLead.phone}`}
                className="py-2.5 px-3 rounded-xs bg-[#F7F7F4] hover:bg-[#E3E3E0] border border-[#E3E3E0] text-[#302B2B] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Phone</span>
              </a>
              <a
                href={`https://wa.me/${(selectedLead.whatsapp || selectedLead.phone).replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xs bg-[#E8F6FA] hover:bg-[#1098C7] hover:text-white border border-[#1098C7]/30 text-[#0879A3] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${selectedLead.email}`}
                className="py-2.5 px-3 rounded-xs bg-[#F7F7F4] hover:bg-[#E3E3E0] border border-[#E3E3E0] text-[#302B2B] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <span>Send Email</span>
              </a>
            </div>

            {/* Stage & Priority Selectors */}
            <div className="p-4 rounded-sm bg-[#F7F7F4] border border-[#E3E3E0] space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#747474] mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    value={selectedLead.status}
                    onChange={e => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                    className="w-full bg-white border border-[#E3E3E0] rounded-xs px-2.5 py-1.5 text-xs text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  >
                    {kanbanColumns.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#747474] mb-1">
                    Deal Priority
                  </label>
                  <select
                    value={selectedLead.priority}
                    onChange={e => handlePriorityChange(selectedLead.id, e.target.value as LeadPriority)}
                    className="w-full bg-white border border-[#E3E3E0] rounded-xs px-2.5 py-1.5 text-xs text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {selectedLead.status === 'Won' && (
                <div className="pt-2 border-t border-[#E3E3E0] flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Deal Concluded
                  </span>
                  <button
                    onClick={() => handleConvertToCustomer(selectedLead.id)}
                    className="px-3 py-1.5 rounded-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Convert to Customer
                  </button>
                </div>
              )}
            </div>

            {/* In-depth Details Grid */}
            <div className="p-4 rounded-sm bg-white border border-[#E3E3E0] space-y-3 text-xs">
              <h4 className="font-bold text-[#302B2B] uppercase tracking-wider text-[11px]">
                Campaign Parameters
              </h4>
              <div className="grid grid-cols-2 gap-3 text-[#454141]">
                <div>
                  <span className="text-[#747474] block">Billboard Asset:</span>
                  <span className="font-semibold text-[#302B2B]">
                    {selectedLead.location_name || 'General Network'}
                  </span>
                </div>
                <div>
                  <span className="text-[#747474] block">Approx. Budget:</span>
                  <span className="font-semibold text-[#1098C7]">
                    {selectedLead.budget || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-[#747474] block">Campaign Type:</span>
                  <span className="text-[#302B2B]">{selectedLead.campaign_type || 'Awareness'}</span>
                </div>
                <div>
                  <span className="text-[#747474] block">Lead Source:</span>
                  <span className="text-[#302B2B]">{selectedLead.source}</span>
                </div>
              </div>

              {selectedLead.message && (
                <div className="pt-2 border-t border-[#E3E3E0]">
                  <span className="text-[#747474] block text-[11px]">Original Message:</span>
                  <p className="text-[#454141] italic mt-0.5">{selectedLead.message}</p>
                </div>
              )}
            </div>

            {/* Internal Notes Thread */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#302B2B] text-xs uppercase tracking-wider">
                Internal Notes & Activity Log
              </h4>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  required
                  placeholder="Add timestamped note on client negotiation, flex printing details, or terms..."
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-xs text-[#302B2B] focus:outline-hidden focus:border-[#1098C7] resize-none"
                />
                <button
                  type="submit"
                  disabled={isAddingNote}
                  className="px-4 py-1.5 rounded-xs bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs transition-colors self-end cursor-pointer"
                >
                  {isAddingNote ? 'Saving...' : 'Add Note'}
                </button>
              </form>

              <div className="space-y-2 pt-2">
                {selectedLead.notes_list && selectedLead.notes_list.length > 0 ? (
                  selectedLead.notes_list.map((n: any) => (
                    <div key={n.id} className="p-3 rounded-xs bg-[#F7F7F4] border border-[#E3E3E0] space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-[#747474]">
                        <span className="font-semibold text-[#1098C7]">{n.created_by}</span>
                        <span>{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-[#454141]">{n.note}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#747474] italic">No notes recorded yet.</div>
                )}
              </div>
            </div>

            {/* Delete Lead Button */}
            <div className="pt-4 border-t border-[#E3E3E0] flex items-center justify-between">
              <button
                onClick={() => setLeadToDelete(selectedLead)}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E3E3E0] rounded-sm max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3E3E0] pb-3">
              <h2 className="font-display font-bold text-lg text-[#302B2B]">Create Lead Record Manually</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-[#747474] hover:text-[#302B2B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#454141] font-semibold mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={createForm.name}
                  onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                />
              </div>

              <div>
                <label className="block text-[#454141] font-semibold mb-1">Company / Brand *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Joyalukkas Jewellery"
                  value={createForm.company}
                  onChange={e => setCreateForm({ ...createForm, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={createForm.phone}
                    onChange={e => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#454141] font-semibold mb-1">Interested Billboard</label>
                <select
                  value={createForm.location_id}
                  onChange={e => setCreateForm({ ...createForm, location_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                >
                  <option value="">-- General Inquiry --</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Budget</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,50,000"
                    value={createForm.budget}
                    onChange={e => setCreateForm({ ...createForm, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Priority</label>
                  <select
                    value={createForm.priority}
                    onChange={e => setCreateForm({ ...createForm, priority: e.target.value as LeadPriority })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E3E3E0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xs bg-[#F7F7F4] hover:bg-[#E3E3E0] text-[#454141] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xs bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold cursor-pointer"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Lead Modal */}
      <ConfirmationModal
        isOpen={!!leadToDelete}
        title="Delete CRM Lead Record"
        message={`Are you sure you want to delete lead for "${leadToDelete?.name}" (${leadToDelete?.company})? All related notes and reminders will be removed.`}
        confirmLabel="Delete Record"
        cancelLabel="Keep Lead"
        isDangerous={true}
        onConfirm={handleDeleteLeadConfirm}
        onCancel={() => setLeadToDelete(null)}
      />
    </div>
  );
};
