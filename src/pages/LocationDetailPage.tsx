import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Send,
  AlertCircle,
  MessageSquare,
  Compass,
  Phone,
  Clock,
  Eye,
} from 'lucide-react';
import { BillboardLocation } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useSettings } from '../context/SettingsContext.tsx';
import { AvailabilityBadge } from '../components/common/Badge.tsx';

interface LocationDetailPageProps {
  idOrSlug: string;
  navigate: (path: string) => void;
}

export const LocationDetailPage: React.FC<LocationDetailPageProps> = ({ idOrSlug, navigate }) => {
  const { settings } = useSettings();
  const [location, setLocation] = useState<BillboardLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Enquiry form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    whatsapp: '',
    campaign_type: 'Brand Awareness',
    budget: '',
    start_date: '',
    end_date: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getLocation(idOrSlug);
        setLocation(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load billboard location details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocation();
  }, [idOrSlug]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setFormError('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await api.createEnquiry({
        name: formData.name,
        company: formData.company || undefined,
        phone: formData.phone,
        email: formData.email || undefined,
        whatsapp: formData.whatsapp || formData.phone,
        location_id: location?.id,
        campaign_type: formData.campaign_type,
        budget: formData.budget ? Number(formData.budget) : undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        message: formData.message || `Inquiry for billboard: ${location?.name}`,
      });

      setSubmitSuccess('Thank you! Your inquiry has been sent to our Kalaburagi media team.');
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        whatsapp: '',
        campaign_type: 'Brand Awareness',
        budget: '',
        start_date: '',
        end_date: '',
        message: '',
      });
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#F7F7F4] w-48 rounded" />
          <div className="h-96 bg-[#F7F7F4] rounded-sm" />
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-24 text-center space-y-6">
        <AlertCircle className="w-12 h-12 text-[#1098C7] mx-auto" />
        <h2 className="font-display font-bold text-2xl text-[#302B2B]">
          Billboard Location Not Found
        </h2>
        <p className="text-sm text-[#747474]">{error || 'The requested billboard site does not exist.'}</p>
        <button
          onClick={() => navigate('/locations')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Locations</span>
        </button>
      </div>
    );
  }

  const whatsappClean = (settings.whatsapp || '').replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(
    `Hello Bhagyalaxmi Billboards, I would like to inquire about "${location.name}" (${location.dimensions}) on ${location.area}, Kalaburagi.`
  );

  return (
    <div className="pb-24 space-y-10 bg-white">
      {/* Top Breadcrumb Bar */}
      <div className="bg-[#F7F7F4] border-b border-[#E3E3E0] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/locations')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#747474] hover:text-[#1098C7] uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </button>
          <div className="flex items-center gap-3">
            <AvailabilityBadge availability={location.availability} />
            <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-[#E3E3E0] text-[#302B2B] rounded-xs">
              {location.type}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content (Images + Specs) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[#F7F7F4] border border-[#E3E3E0]">
                <img
                  src={location.images[activeImageIndex] || location.images[0]}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {location.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {location.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xs overflow-hidden border-2 shrink-0 cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#1098C7]' : 'border-[#E3E3E0] opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Area */}
            <div className="space-y-3 border-b border-[#E3E3E0] pb-6">
              <div className="flex items-center gap-2 text-xs text-[#747474]">
                <MapPin className="w-4 h-4 text-[#1098C7]" />
                <span className="font-semibold text-[#302B2B]">{location.area}, Kalaburagi, Karnataka</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#302B2B]">
                {location.name}
              </h1>
              <p className="text-xs text-[#454141] leading-relaxed">
                {location.address}
              </p>
              {location.maps_url && (
                <a
                  href={location.maps_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#1098C7] hover:text-[#0879A3] font-semibold"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="font-display font-bold text-lg text-[#302B2B]">Site Overview</h2>
              <p className="text-xs text-[#454141] leading-relaxed">
                {location.description}
              </p>
            </div>

            {/* Specifications Table */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-lg text-[#302B2B]">Media Specifications</h2>
              <div className="border border-[#E3E3E0] rounded-sm overflow-hidden text-xs">
                <div className="grid grid-cols-2 p-3 bg-[#F7F7F4] border-b border-[#E3E3E0]">
                  <span className="text-[#747474] font-medium">Dimensions</span>
                  <span className="font-bold text-[#302B2B]">{location.dimensions}</span>
                </div>
                <div className="grid grid-cols-2 p-3 bg-white border-b border-[#E3E3E0]">
                  <span className="text-[#747474] font-medium">Structure Type</span>
                  <span className="font-bold text-[#302B2B]">{location.type}</span>
                </div>
                <div className="grid grid-cols-2 p-3 bg-[#F7F7F4] border-b border-[#E3E3E0]">
                  <span className="text-[#747474] font-medium">Illumination</span>
                  <span className="font-bold text-[#302B2B]">{location.lighting}</span>
                </div>
                <div className="grid grid-cols-2 p-3 bg-white border-b border-[#E3E3E0]">
                  <span className="text-[#747474] font-medium">Viewing Orientation</span>
                  <span className="font-bold text-[#302B2B]">{location.orientation}</span>
                </div>
                <div className="grid grid-cols-2 p-3 bg-[#F7F7F4] border-b border-[#E3E3E0]">
                  <span className="text-[#747474] font-medium">Visibility Range</span>
                  <span className="font-bold text-[#302B2B]">{location.visibility}</span>
                </div>
                <div className="grid grid-cols-2 p-3 bg-white">
                  <span className="text-[#747474] font-medium">Audience / Commuter Traffic</span>
                  <span className="font-bold text-[#302B2B]">{location.traffic_estimate}</span>
                </div>
              </div>
            </div>

            {/* Nearby Landmarks */}
            {location.landmarks && location.landmarks.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-display font-bold text-lg text-[#302B2B]">Nearby Landmarks</h2>
                <div className="flex flex-wrap gap-2">
                  {location.landmarks.map((landmark, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#F7F7F4] border border-[#E3E3E0] text-[#454141] text-xs rounded-xs font-medium"
                    >
                      {landmark}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Rate Card & Booking Form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Price Box */}
            <div className="bg-[#F7F7F4] border border-[#E3E3E0] p-6 rounded-sm space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#747474] block">
                Standard Rate Card
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-3xl text-[#302B2B]">
                  ₹{location.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#747474]">/ month</span>
              </div>
              <p className="text-[11px] text-[#747474] leading-relaxed">
                * Rates are indicative. Discounts apply for multi-month campaigns or multi-location Kalaburagi packages. High-tensile flex printing and mounting services available.
              </p>

              {/* Instant WhatsApp Action */}
              <a
                href={`https://wa.me/${whatsappClean}?text=${encodedMsg}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#454141] hover:bg-[#302B2B] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#1098C7]" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>

            {/* Booking / Enquiry Form */}
            <div className="bg-white border border-[#E3E3E0] p-6 rounded-sm space-y-5 shadow-xs">
              <div>
                <h3 className="font-display font-bold text-lg text-[#302B2B]">
                  Check Availability & Request Quote
                </h3>
                <p className="text-xs text-[#747474] mt-0.5">
                  Direct submission to the Bhagyalaxmi Billboards operations desk.
                </p>
              </div>

              {submitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1">
                      Company / Brand
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Patil Jewellers"
                      className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@brand.com"
                    className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1">
                      Campaign Type
                    </label>
                    <select
                      name="campaign_type"
                      value={formData.campaign_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                    >
                      <option value="Brand Awareness">Brand Awareness</option>
                      <option value="Showroom Launch">Showroom Launch</option>
                      <option value="Festive Sale">Festive Sale</option>
                      <option value="Political / Event">Event / Conference</option>
                      <option value="Real Estate">Real Estate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1">
                      Target Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1">
                    Special Requirements / Message
                  </label>
                  <textarea
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Mention preferred months, duration, or mounting assistance..."
                    className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#1098C7] hover:bg-[#0879A3] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Media Team</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
