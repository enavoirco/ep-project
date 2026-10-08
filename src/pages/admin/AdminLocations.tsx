import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { BillboardLocation, BillboardType, AvailabilityStatus } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { AvailabilityBadge } from '../../components/common/Badge.tsx';
import { ConfirmationModal } from '../../components/common/ConfirmationModal.tsx';

interface AdminLocationsProps {
  navigate: (path: string) => void;
}

export const AdminLocations: React.FC<AdminLocationsProps> = ({ navigate }) => {
  const [locations, setLocations] = useState<BillboardLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<BillboardLocation | null>(null);
  const [locToDelete, setLocToDelete] = useState<BillboardLocation | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    city: 'Kalaburagi',
    area: '',
    address: '',
    maps_url: '',
    type: 'Hoarding' as BillboardType,
    dimensions: '',
    orientation: '',
    traffic_estimate: '',
    visibility: '',
    lighting: 'Front-lit' as 'Front-lit' | 'Back-lit' | 'Digital LED' | 'Non-lit',
    price: 65000,
    availability: 'Available' as AvailabilityStatus,
    images: '',
    description: '',
    landmarks: '',
    audience_info: '',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const data = await api.getLocations({
        search: search || undefined,
        city: filterCity !== 'All' ? filterCity : undefined,
        type: filterType !== 'All' ? filterType : undefined,
        availability: filterAvailability !== 'All' ? filterAvailability : undefined,
      });
      setLocations(data);
    } catch (err) {
      console.error('Failed to load locations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [search, filterCity, filterType, filterAvailability]);

  const handleOpenAdd = () => {
    setEditingLoc(null);
    setFormData({
      name: '',
      slug: '',
      city: 'Kalaburagi',
      area: '',
      address: '',
      maps_url: '',
      type: 'Hoarding',
      dimensions: '40ft x 20ft (800 sq.ft)',
      orientation: 'Head-on arterial road traffic',
      traffic_estimate: 'High daily vehicular flow',
      visibility: 'Unobstructed view from 350 meters',
      lighting: 'Front-lit',
      price: 65000,
      availability: 'Available',
      images: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      description: '',
      landmarks: '',
      audience_info: 'Commercial traders, professionals, and daily commuters in Kalaburagi',
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (loc: BillboardLocation) => {
    setEditingLoc(loc);
    setFormData({
      name: loc.name,
      slug: loc.slug,
      city: loc.city,
      area: loc.area,
      address: loc.address,
      maps_url: loc.maps_url,
      type: loc.type,
      dimensions: loc.dimensions,
      orientation: loc.orientation,
      traffic_estimate: loc.traffic_estimate,
      visibility: loc.visibility,
      lighting: loc.lighting,
      price: loc.price,
      availability: loc.availability,
      images: loc.images.join('\n'),
      description: loc.description,
      landmarks: loc.landmarks.join(', '),
      audience_info: loc.audience_info,
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim() || !formData.area.trim()) {
      setFormError('Billboard name, city, and area are required.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    const imageUrls = formData.images
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const landmarksList = formData.landmarks
      .split(',')
      .map(lm => lm.trim())
      .filter(lm => lm.length > 0);

    const payload = {
      ...formData,
      price: Number(formData.price),
      images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'],
      landmarks: landmarksList,
    };

    try {
      if (editingLoc) {
        await api.updateLocation(editingLoc.id, payload);
      } else {
        await api.createLocation(payload);
      }
      setIsFormOpen(false);
      fetchLocations();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save billboard location.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!locToDelete) return;
    try {
      await api.deleteLocation(locToDelete.id);
      setLocToDelete(null);
      fetchLocations();
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const handleQuickStatusChange = async (loc: BillboardLocation, newStatus: AvailabilityStatus) => {
    try {
      await api.updateLocation(loc.id, { availability: newStatus });
      fetchLocations();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-[#302B2B] tracking-tight">
            Billboard Inventory Management
          </h1>
          <p className="text-xs text-[#747474] mt-0.5">
            Create, update, inspect, and manage billboard locations in the live database &bull; Kalaburagi
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xs bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Billboard Site</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-sm bg-white border border-[#E3E3E0] flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#747474] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search locations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-xs text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            className="bg-white border border-[#E3E3E0] rounded-xs px-2.5 py-1.5 text-xs text-[#302B2B] focus:border-[#1098C7]"
          >
            <option value="All">All Cities</option>
            <option value="Kalaburagi">Kalaburagi</option>
          </select>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-white border border-[#E3E3E0] rounded-xs px-2.5 py-1.5 text-xs text-[#302B2B] focus:border-[#1098C7]"
          >
            <option value="All">All Formats</option>
            <option value="Hoarding">Hoarding</option>
            <option value="Unipole">Unipole</option>
            <option value="LED Billboard">LED Billboard</option>
            <option value="Wallscape">Wallscape</option>
            <option value="Digital Billboard">Digital Billboard</option>
            <option value="Gantry">Gantry</option>
          </select>

          <select
            value={filterAvailability}
            onChange={e => setFilterAvailability(e.target.value)}
            className="bg-white border border-[#E3E3E0] rounded-xs px-2.5 py-1.5 text-xs text-[#302B2B] focus:border-[#1098C7]"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Locations Table */}
      <div className="rounded-sm bg-white border border-[#E3E3E0] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F4] border-b border-[#E3E3E0] text-[#747474] uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Billboard Asset</th>
                <th className="py-3.5 px-3">City & Area</th>
                <th className="py-3.5 px-3">Format</th>
                <th className="py-3.5 px-3">Dimensions</th>
                <th className="py-3.5 px-3">Rate / Mo</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E3E0]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#747474]">
                    Loading billboard records...
                  </td>
                </tr>
              ) : locations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#747474]">
                    No billboard locations found.
                  </td>
                </tr>
              ) : (
                locations.map(loc => (
                  <tr key={loc.id} className="hover:bg-[#F7F7F4] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={loc.images[0]}
                          alt={loc.name}
                          className="w-12 h-9 rounded-xs object-cover border border-[#E3E3E0] shrink-0 bg-[#F7F7F4]"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-[#302B2B] truncate max-w-xs">{loc.name}</div>
                          <div className="text-[10px] text-[#747474] truncate max-w-xs">{loc.address}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-[#454141]">
                      <div>{loc.city}</div>
                      <div className="text-[10px] text-[#747474]">{loc.area}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-xs text-[11px] font-semibold bg-[#F7F7F4] text-[#302B2B] border border-[#E3E3E0]">
                        {loc.type}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[#454141] font-medium">
                      {loc.dimensions}
                    </td>

                    <td className="py-3 px-3 font-bold text-[#1098C7]">
                      ₹{loc.price.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={loc.availability}
                        onChange={e => handleQuickStatusChange(loc, e.target.value as AvailabilityStatus)}
                        className="bg-white border border-[#E3E3E0] rounded-xs px-2 py-1 text-[11px] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                      >
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/locations/${loc.slug || loc.id}`)}
                          className="p-1.5 rounded-xs hover:bg-[#E8F6FA] text-[#747474] hover:text-[#1098C7]"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(loc)}
                          className="p-1.5 rounded-xs hover:bg-[#E8F6FA] text-[#1098C7] hover:text-[#0879A3]"
                          title="Edit location"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setLocToDelete(loc)}
                          className="p-1.5 rounded-xs hover:bg-rose-50 text-rose-600 hover:text-rose-700"
                          title="Delete location"
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

      {/* Add / Edit Location Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E3E3E0] rounded-sm max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E3E3E0] pb-4">
              <h2 className="font-display font-bold text-lg text-[#302B2B]">
                {editingLoc ? 'Edit Billboard Location' : 'Add New Billboard Location'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-[#747474] hover:text-[#302B2B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xs bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#454141] font-semibold mb-1">Billboard Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sedam Road - High Court Junction Hoarding"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Area / Suburb *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sedam Road"
                    value={formData.area}
                    onChange={e => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#454141] font-semibold mb-1">Full Physical Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Billboard Format</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as BillboardType })}
                    className="w-full px-2.5 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  >
                    <option value="Hoarding">Hoarding</option>
                    <option value="Unipole">Unipole</option>
                    <option value="LED Billboard">LED Billboard</option>
                    <option value="Wallscape">Wallscape</option>
                    <option value="Bus Shelter">Bus Shelter</option>
                    <option value="Digital Billboard">Digital Billboard</option>
                    <option value="Gantry">Gantry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="40ft x 20ft"
                    value={formData.dimensions}
                    onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>

                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Illumination</label>
                  <select
                    value={formData.lighting}
                    onChange={e => setFormData({ ...formData, lighting: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  >
                    <option value="Front-lit">Front-lit</option>
                    <option value="Back-lit">Back-lit</option>
                    <option value="Digital LED">Digital LED</option>
                    <option value="Non-lit">Non-lit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Monthly Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>

                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Availability Status</label>
                  <select
                    value={formData.availability}
                    onChange={e => setFormData({ ...formData, availability: e.target.value as AvailabilityStatus })}
                    className="w-full px-2.5 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Orientation & Facing</label>
                  <input
                    type="text"
                    placeholder="e.g. Facing incoming traffic towards City Centre"
                    value={formData.orientation}
                    onChange={e => setFormData({ ...formData, orientation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>

                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Traffic Estimate</label>
                  <input
                    type="text"
                    placeholder="e.g. High daily commuter flow"
                    value={formData.traffic_estimate}
                    onChange={e => setFormData({ ...formData, traffic_estimate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#454141] font-semibold mb-1">Google Maps URL</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={formData.maps_url}
                  onChange={e => setFormData({ ...formData, maps_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                />
              </div>

              <div>
                <label className="block text-[#454141] font-semibold mb-1">Image URLs (one per line)</label>
                <textarea
                  rows={2}
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.images}
                  onChange={e => setFormData({ ...formData, images: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                />
              </div>

              <div>
                <label className="block text-[#454141] font-semibold mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Nearby Landmarks (comma separated)</label>
                  <input
                    type="text"
                    placeholder="High Court Bench, Ring Road Junction"
                    value={formData.landmarks}
                    onChange={e => setFormData({ ...formData, landmarks: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
                <div>
                  <label className="block text-[#454141] font-semibold mb-1">Audience Demographics</label>
                  <input
                    type="text"
                    placeholder="Trade merchants, commuters"
                    value={formData.audience_info}
                    onChange={e => setFormData({ ...formData, audience_info: e.target.value })}
                    className="w-full px-3 py-2 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E3E3E0]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xs bg-[#F7F7F4] hover:bg-[#E3E3E0] text-[#454141] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xs bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingLoc ? 'Save Changes' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!locToDelete}
        title="Confirm Billboard Deletion"
        message={`Are you sure you want to delete "${locToDelete?.name}"? Existing CRM leads will preserve this location's name as an archived snapshot without breaking inquiry history.`}
        confirmLabel="Permanently Delete"
        cancelLabel="Keep Location"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setLocToDelete(null)}
      />
    </div>
  );
};
