import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { BillboardLocation } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useSettings } from '../context/SettingsContext.tsx';

interface QuotePageProps {
  navigate: (path: string) => void;
  preselectedLocationId?: string;
}

export const QuotePage: React.FC<QuotePageProps> = ({ navigate, preselectedLocationId }) => {
  const { settings } = useSettings();
  const [locations, setLocations] = useState<BillboardLocation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    whatsapp: '',
    location_id: preselectedLocationId || '',
    campaign_type: 'Brand Awareness',
    duration: '1 Month',
    budget: '₹50,000 - ₹1,00,000',
    start_date: '',
    end_date: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await api.getLocations();
        setLocations(data);
        if (preselectedLocationId && !formData.location_id) {
          setFormData(prev => ({ ...prev, location_id: preselectedLocationId }));
        }
      } catch (err) {
        console.error('Failed to load locations for quote generator:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, [preselectedLocationId]);

  const selectedLocation = locations.find(l => l.id === formData.location_id);

  const calculateEstimate = () => {
    if (!selectedLocation) return null;
    const baseMonthly = selectedLocation.price;
    let months = 1;
    let discount = 0;

    if (formData.duration === '3 Months') {
      months = 3;
      discount = 0.05; // 5% discount
    } else if (formData.duration === '6 Months') {
      months = 6;
      discount = 0.1; // 10% discount
    } else if (formData.duration === '12 Months') {
      months = 12;
      discount = 0.15; // 15% discount
    }

    const subtotal = baseMonthly * months;
    const discountedTotal = subtotal * (1 - discount);
    return {
      monthly: baseMonthly,
      months,
      discountPercent: discount * 100,
      total: Math.round(discountedTotal),
    };
  };

  const estimate = calculateEstimate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMessage('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const notes = [
        `Requested Quote for Location: ${selectedLocation ? selectedLocation.name : 'Not Specified'}`,
        `Duration: ${formData.duration}`,
        `Budget Preference: ${formData.budget}`,
        formData.message ? `Notes: ${formData.message}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const res = await api.createEnquiry({
        name: formData.name,
        company: formData.company || undefined,
        phone: formData.phone,
        email: formData.email || undefined,
        whatsapp: formData.whatsapp || formData.phone,
        location_id: formData.location_id || undefined,
        campaign_type: formData.campaign_type,
        budget: estimate ? estimate.total : undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        message: notes,
      });

      setSubmittedLeadId(res.lead_id || 'ok');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappClean = (settings.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <div className="pb-24 space-y-12 bg-white">
      {/* Editorial Header */}
      <section className="bg-[#F7F7F4] border-b border-[#E3E3E0] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F6FA] border border-[#1098C7]/30 text-[#1098C7] text-xs font-bold uppercase tracking-wider rounded-xs">
            <Calculator className="w-3.5 h-3.5" />
            <span>Rate Card & Campaign Planner</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#302B2B] tracking-tight uppercase">
            REQUEST A CUSTOM QUOTATION
          </h1>
          <p className="text-sm text-[#454141] leading-relaxed">
            Select your preferred Kalaburagi billboard corridor and campaign parameters to receive a formal quotation from our media desk.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {submittedLeadId ? (
          <div className="bg-[#F7F7F4] border border-[#E3E3E0] p-8 sm:p-12 rounded-sm text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-display font-bold text-2xl text-[#302B2B]">
              Quotation Request Received!
            </h2>
            <p className="text-sm text-[#454141] max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-[#302B2B]">{formData.name}</strong>. Our Kalaburagi outdoor operations team has logged your campaign requirements and will contact you via phone/WhatsApp within 24 hours.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/${whatsappClean}?text=Hello%20Bhagyalaxmi%20Billboards%2C%20I%20have%20submitted%20a%20quote%20request%20for%20${encodeURIComponent(
                  formData.name
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-[#454141] hover:bg-[#302B2B] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#1098C7]" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  setSubmittedLeadId(null);
                  setFormData({
                    name: '',
                    company: '',
                    phone: '',
                    email: '',
                    whatsapp: '',
                    location_id: '',
                    campaign_type: 'Brand Awareness',
                    duration: '1 Month',
                    budget: '₹50,000 - ₹1,00,000',
                    start_date: '',
                    end_date: '',
                    message: '',
                  });
                }}
                className="px-5 py-2.5 bg-white border border-[#E3E3E0] hover:border-[#1098C7] text-[#302B2B] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                Request Another Quote
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-8 bg-white border border-[#E3E3E0] p-6 sm:p-8 rounded-sm space-y-6">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Location Selection */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                    Select Target Billboard Site
                  </label>
                  <select
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                  >
                    <option value="">General Inquiry / Help Me Choose a Location</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.area} &bull; {loc.dimensions}) - ₹{loc.price.toLocaleString('en-IN')}/mo
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Suresh Kulkarni"
                      className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Kulkarni Enterprises"
                      className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                      Campaign Duration
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                    >
                      <option value="1 Month">1 Month</option>
                      <option value="3 Months">3 Months (5% package discount)</option>
                      <option value="6 Months">6 Months (10% package discount)</option>
                      <option value="12 Months">12 Months (15% annual package)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                      Target Campaign Start
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
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                    Campaign Scope / Artwork Details
                  </label>
                  <textarea
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Provide details on flex printing needs, campaign objectives, or specific dates..."
                    className="w-full px-3 py-2 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#1098C7] hover:bg-[#0879A3] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {isSubmitting ? (
                    <span>Generating Quotation...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Quotation Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#F7F7F4] border border-[#E3E3E0] p-6 rounded-sm space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#747474] block">
                  Campaign Estimate Summary
                </span>

                {selectedLocation ? (
                  <div className="space-y-4">
                    <div className="border-b border-[#E3E3E0] pb-3">
                      <h4 className="font-display font-bold text-base text-[#302B2B]">
                        {selectedLocation.name}
                      </h4>
                      <p className="text-xs text-[#747474] mt-0.5">
                        {selectedLocation.area}, Kalaburagi
                      </p>
                      <p className="text-xs text-[#747474]">
                        Dimensions: {selectedLocation.dimensions}
                      </p>
                    </div>

                    {estimate && (
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-[#454141]">
                          <span>Base Monthly:</span>
                          <span className="font-semibold text-[#302B2B]">
                            ₹{estimate.monthly.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between text-[#454141]">
                          <span>Campaign Period:</span>
                          <span className="font-semibold text-[#302B2B]">
                            {estimate.months} Month{estimate.months > 1 ? 's' : ''}
                          </span>
                        </div>
                        {estimate.discountPercent > 0 && (
                          <div className="flex justify-between text-emerald-700 font-semibold">
                            <span>Package Discount:</span>
                            <span>{estimate.discountPercent}% Off</span>
                          </div>
                        )}
                        <div className="pt-3 border-t border-[#E3E3E0] flex justify-between items-baseline">
                          <span className="font-bold text-[#302B2B]">Estimated Total:</span>
                          <span className="font-display font-black text-xl text-[#1098C7]">
                            ₹{estimate.total.toLocaleString('en-IN')}*
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#747474] leading-relaxed">
                    Select a billboard site to generate an instant duration and rate calculation.
                  </p>
                )}

                <div className="pt-3 border-t border-[#E3E3E0] text-[11px] text-[#747474] space-y-1">
                  <p>&bull; Taxes (GST) applicable as per government norms.</p>
                  <p>&bull; Final rate card issued post site verification.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
