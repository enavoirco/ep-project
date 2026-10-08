import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  ArrowRight,
  Compass,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { BillboardLocation, BillboardType, AvailabilityStatus } from '../types/index.ts';
import { api } from '../services/api.ts';
import { AvailabilityBadge } from '../components/common/Badge.tsx';

interface LocationsPageProps {
  navigate: (path: string) => void;
  initialType?: string;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({ navigate, initialType }) => {
  const [locations, setLocations] = useState<BillboardLocation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>(initialType || 'All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');

  const areas = [
    'All',
    'Sedam Road',
    'Station Road',
    'Super Market Area',
    'Jewargi Road',
    'Aland Road',
    'Shah Bazar',
    'Humnabad Road',
    'MSK Mill Road',
    'Ring Road',
  ];

  const types: string[] = [
    'All',
    'Hoarding',
    'Unipole',
    'LED Billboard',
    'Wallscape',
    'Gantry',
  ];

  const availabilities = ['All', 'Available', 'Booked', 'Reserved'];

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const data = await api.getLocations({
          search: search || undefined,
          type: selectedType !== 'All' ? selectedType : undefined,
          availability: selectedAvailability !== 'All' ? selectedAvailability : undefined,
        });

        if (selectedArea !== 'All') {
          setLocations(
            data.filter(
              loc =>
                (loc.area || '').toLowerCase().includes(selectedArea.toLowerCase()) ||
                (loc.name || '').toLowerCase().includes(selectedArea.toLowerCase()) ||
                (loc.address || '').toLowerCase().includes(selectedArea.toLowerCase())
            )
          );
        } else {
          setLocations(data);
        }
      } catch (err) {
        console.error('Failed to fetch locations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchLocations, 150);
    return () => clearTimeout(timer);
  }, [search, selectedArea, selectedType, selectedAvailability]);

  const clearFilters = () => {
    setSearch('');
    setSelectedArea('All');
    setSelectedType('All');
    setSelectedAvailability('All');
  };

  const hasActiveFilters =
    search !== '' ||
    selectedArea !== 'All' ||
    selectedType !== 'All' ||
    selectedAvailability !== 'All';

  return (
    <div className="space-y-12 pb-24 bg-white">
      {/* Editorial Header */}
      <section className="bg-[#F7F7F4] border-b border-[#E3E3E0] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F6FA] border border-[#1098C7]/30 text-[#1098C7] text-xs font-bold uppercase tracking-wider rounded-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Kalaburagi Outdoor Media Network</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#302B2B] tracking-tight uppercase">
            BILLBOARD LOCATIONS IN KALABURAGI
          </h1>
          <p className="text-sm text-[#454141] max-w-2xl leading-relaxed">
            Explore our curated network of premium outdoor advertising structures across major Kalaburagi traffic corridors, shopping centres, and transit gates.
          </p>
        </div>
      </section>

      {/* Filter and Catalog Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Search & Area Controls */}
        <div className="bg-[#F7F7F4] border border-[#E3E3E0] p-6 rounded-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#747474] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by area, landmark (e.g. Sedam Road, High Court, Railway Station)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] placeholder-[#747474] focus:outline-hidden focus:border-[#1098C7]"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#747474] hover:text-[#302B2B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Status / Reset */}
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-xs text-[#747474] hover:text-[#1098C7] border border-[#E3E3E0] bg-white rounded-xs flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <X className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
              <span className="text-xs text-[#747474] font-medium hidden sm:inline">
                Showing {locations.length} location{locations.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Area Corridor Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747474] block">
              Kalaburagi Corridors:
            </span>
            <div className="flex flex-wrap gap-2">
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                    selectedArea === area
                      ? 'bg-[#1098C7] text-white shadow-xs'
                      : 'bg-white border border-[#E3E3E0] text-[#302B2B] hover:border-[#1098C7] hover:text-[#1098C7]'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Type & Availability Sub-filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#E3E3E0]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#747474] block mb-1.5">
                Media Format:
              </span>
              <div className="flex flex-wrap gap-2">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                      selectedType === t
                        ? 'bg-[#302B2B] text-white'
                        : 'bg-white border border-[#E3E3E0] text-[#454141] hover:text-[#1098C7]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#747474] block mb-1.5">
                Availability Status:
              </span>
              <div className="flex flex-wrap gap-2">
                {availabilities.map(av => (
                  <button
                    key={av}
                    onClick={() => setSelectedAvailability(av)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                      selectedAvailability === av
                        ? 'bg-[#302B2B] text-white'
                        : 'bg-white border border-[#E3E3E0] text-[#454141] hover:text-[#1098C7]'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-80 bg-[#F7F7F4] animate-pulse border border-[#E3E3E0]" />
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-16 bg-[#F7F7F4] border border-[#E3E3E0] rounded-sm space-y-4">
            <Compass className="w-8 h-8 text-[#747474] mx-auto" />
            <h3 className="font-display font-bold text-lg text-[#302B2B]">
              No billboard locations match the selected filters
            </h3>
            <p className="text-xs text-[#747474] max-w-md mx-auto">
              Try adjusting your corridor area, billboard type, or availability filter to explore other available sites in Kalaburagi.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map(location => (
              <div
                key={location.id}
                className="bg-white border border-[#E3E3E0] rounded-sm overflow-hidden flex flex-col group hover:border-[#1098C7] transition-all duration-200 shadow-xs hover:shadow-md"
              >
                {/* Media Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F7F7F4]">
                  <img
                    src={location.images[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <AvailabilityBadge availability={location.availability} />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#302B2B]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
                    {location.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#747474]">
                      <MapPin className="w-3.5 h-3.5 text-[#1098C7]" />
                      <span>{location.area}, Kalaburagi</span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#302B2B] group-hover:text-[#1098C7] transition-colors leading-snug">
                      {location.name}
                    </h3>
                    <p className="text-xs text-[#454141] line-clamp-2 leading-relaxed">
                      {location.description}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-[#E3E3E0] text-xs">
                    <div>
                      <span className="text-[10px] text-[#747474] uppercase tracking-wider block">Dimensions</span>
                      <span className="font-semibold text-[#302B2B]">{location.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#747474] uppercase tracking-wider block">Illumination</span>
                      <span className="font-semibold text-[#302B2B]">{location.lighting}</span>
                    </div>
                  </div>

                  {/* Pricing / Action */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-[#747474] uppercase tracking-wider block">Rate Card</span>
                      <span className="font-display font-extrabold text-base text-[#302B2B]">
                        ₹{location.price.toLocaleString('en-IN')}
                        <span className="text-xs text-[#747474] font-normal"> /mo</span>
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/locations/${location.slug}`)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-[#E8F6FA] hover:bg-[#1098C7] text-[#1098C7] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
