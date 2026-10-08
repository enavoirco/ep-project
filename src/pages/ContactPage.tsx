import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';
import { api } from '../services/api.ts';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMessage('Please provide your name, phone, and email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await api.submitPublicLead({
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        source: 'Website',
      });

      setSuccessMessage(res.message);
      setFormData({ name: '', company: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappClean = (settings.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <div className="pb-24 space-y-12 bg-white">
      {/* Editorial Header */}
      <section className="bg-[#F7F7F4] border-b border-[#E3E3E0] py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F6FA] border border-[#1098C7]/30 text-[#1098C7] text-xs font-bold uppercase tracking-wider rounded-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kalaburagi Media Desk</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#302B2B] tracking-tight uppercase">
            CONTACT BHAGYALAXMI BILLBOARDS
          </h1>
          <p className="text-sm text-[#454141] max-w-2xl leading-relaxed">
            Reach out directly to our Kalaburagi office for site inspections, availability checks, or long-term outdoor advertising campaigns.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Office Contact Dossier */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-wider text-[#1098C7] font-bold block">
                Local Presence
              </span>
              <h2 className="font-display font-bold text-2xl text-[#302B2B]">
                Operating in Kalaburagi, Karnataka
              </h2>
              <p className="text-xs text-[#454141] leading-relaxed">
                Our operations team manages site rigging, safety checks, and lighting inspections across the city.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-4">
              <div className="p-5 bg-[#F7F7F4] border border-[#E3E3E0] rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#302B2B] uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-[#1098C7]" />
                  <span>Main Office Address</span>
                </div>
                <p className="text-xs text-[#454141] leading-relaxed pl-6">
                  {settings.address}
                </p>
                {settings.maps_url && (
                  <div className="pl-6 pt-1">
                    <a
                      href={settings.maps_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#1098C7] hover:text-[#0879A3] font-semibold"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="p-5 bg-[#F7F7F4] border border-[#E3E3E0] rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#302B2B] uppercase tracking-wider">
                  <Phone className="w-4 h-4 text-[#1098C7]" />
                  <span>Phone & Calling Desk</span>
                </div>
                <p className="text-sm font-semibold text-[#302B2B] pl-6">
                  <a href={`tel:${settings.phone}`} className="hover:text-[#1098C7] transition-colors">
                    {settings.phone}
                  </a>
                </p>
                <p className="text-[11px] text-[#747474] pl-6">
                  Monday to Saturday, 9:30 AM – 7:30 PM IST
                </p>
              </div>

              <div className="p-5 bg-[#F7F7F4] border border-[#E3E3E0] rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#302B2B] uppercase tracking-wider">
                  <Mail className="w-4 h-4 text-[#1098C7]" />
                  <span>Email Inquiries</span>
                </div>
                <p className="text-sm font-semibold text-[#302B2B] pl-6">
                  <a href={`mailto:${settings.email}`} className="hover:text-[#1098C7] transition-colors">
                    {settings.email}
                  </a>
                </p>
              </div>

              <div className="p-5 bg-[#E8F6FA] border border-[#1098C7]/30 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0879A3] uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4 text-[#1098C7]" />
                  <span>Instant WhatsApp Connect</span>
                </div>
                <p className="text-xs text-[#454141] leading-relaxed">
                  For quick billboard availability queries, send us a WhatsApp message directly with your brand requirements.
                </p>
                <a
                  href={`https://wa.me/${whatsappClean}?text=Hello%20Bhagyalaxmi%20Billboards%2C%20I%20would%20like%20to%20inquire%20about%20billboard%20advertising%20in%20Kalaburagi`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open WhatsApp Media Desk</span>
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-[#E3E3E0] p-6 sm:p-10 rounded-sm space-y-6 shadow-xs">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#302B2B]">
                Send a Direct Message
              </h2>
              <p className="text-xs text-[#747474] mt-1">
                Fill out the form below and our outdoor campaigns manager will respond promptly.
              </p>
            </div>

            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anand Deshmukh"
                  className="w-full px-3 py-2.5 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-2.5 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@business.com"
                    className="w-full px-3 py-2.5 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                  Business / Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Deshmukh Textiles"
                  className="w-full px-3 py-2.5 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#747474] mb-1.5">
                  Your Message / Outdoor Requirements
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the desired location (e.g. Sedam Road, Super Market), expected duration, or billboard dimensions..."
                  className="w-full px-3 py-2.5 bg-white border border-[#E3E3E0] rounded-xs text-xs text-[#302B2B] focus:border-[#1098C7] focus:outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#1098C7] hover:bg-[#0879A3] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Kalaburagi Desk</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
