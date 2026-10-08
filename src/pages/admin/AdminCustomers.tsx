import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  DollarSign,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Customer } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { ConfirmationModal } from '../../components/common/ConfirmationModal.tsx';

interface AdminCustomersProps {
  navigate: (path: string) => void;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ navigate }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    total_spend: 0,
    status: 'Active' as 'Active' | 'Inactive',
  });

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      total_spend: 0,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name,
      company: cust.company,
      phone: cust.phone,
      email: cust.email,
      address: cust.address || '',
      notes: cust.notes || '',
      total_spend: cust.total_spend || 0,
      status: cust.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.updateCustomer(editingCustomer.id, {
          ...formData,
          total_spend: Number(formData.total_spend),
        });
      } else {
        await api.createCustomer({
          ...formData,
          total_spend: Number(formData.total_spend),
        });
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      await api.deleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredCustomers = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#302B2B] tracking-tight">
            Customer & Client Directory
          </h1>
          <p className="text-xs text-[#747474] mt-0.5">
            Verified accounts converted from won billboard advertising campaigns in Kalaburagi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xs bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Account</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-sm bg-white border border-[#E3E3E0] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#747474] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by brand, contact, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-xs text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-sm bg-white border border-[#E3E3E0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F4] border-b border-[#E3E3E0] text-[#747474] uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Client / Brand</th>
                <th className="py-3 px-3">Contact Details</th>
                <th className="py-3 px-3">Billing Address</th>
                <th className="py-3 px-3">Total Spend</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E3E0]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#747474]">
                    Loading customer accounts...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#747474]">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr key={cust.id} className="hover:bg-[#F7F7F4] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#302B2B]">{cust.company}</div>
                      <div className="text-[11px] text-[#747474]">{cust.name}</div>
                    </td>
                    <td className="py-3 px-3 text-[#454141]">
                      <div>{cust.phone}</div>
                      <div className="text-[10px] text-[#747474]">{cust.email}</div>
                    </td>
                    <td className="py-3 px-3 text-[#747474] max-w-xs truncate">
                      {cust.address || 'Standard Corporate Billing'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      ₹{cust.total_spend.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-xs text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 rounded-xs hover:bg-[#E8F6FA] text-[#1098C7] hover:text-[#0879A3] cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setCustomerToDelete(cust)}
                          className="p-1.5 rounded-xs hover:bg-rose-50 text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E3E3E0] rounded-sm max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3E3E0] pb-3">
              <h3 className="font-display font-bold text-base text-[#302B2B]">
                {editingCustomer ? 'Edit Client Record' : 'Add New Client Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#747474] hover:text-[#302B2B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#454141] font-semibold mb-1">Company / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                />
              </div>

              <div>
                <label className="block text-[#454141] font-semibold mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#454141] font-semibold mb-1">Billing Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Total Lifetime Spend (₹)</label>
                  <input
                    type="number"
                    value={formData.total_spend}
                    onChange={e => setFormData({ ...formData, total_spend: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E3E3E0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xs bg-[#F7F7F4] hover:bg-[#E3E3E0] text-[#454141] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xs bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!customerToDelete}
        title="Delete Customer Profile"
        message={`Are you sure you want to remove ${customerToDelete?.company}? Historical bookings will remain preserved.`}
        confirmLabel="Delete Customer"
        cancelLabel="Cancel"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setCustomerToDelete(null)}
      />
    </div>
  );
};
