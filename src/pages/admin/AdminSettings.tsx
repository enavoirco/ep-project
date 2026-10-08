import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.tsx';
import { CompanySettings } from '../../types/index.ts';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      await updateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update company settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-[#302B2B] tracking-tight">
          Portal & Brand Configuration Settings
        </h1>
        <p className="text-xs text-[#747474] mt-0.5">
          Edit company contact details, WhatsApp integration numbers, and marketing copy in real time without code modifications &bull; Kalaburagi.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xs bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Company settings successfully saved to database and synchronized across the public website!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xs bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-sm bg-white border border-[#E3E3E0] space-y-8 shadow-xs">
        {/* Company Identity */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base text-[#302B2B] border-b border-[#E3E3E0] pb-3">
            Company Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#454141] font-semibold mb-1">Company Trading Name *</label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
              />
            </div>

            <div>
              <label className="block text-[#454141] font-semibold mb-1">Primary Website CTA Text</label>
              <input
                type="text"
                value={formData.primary_cta_text}
                onChange={e => setFormData({ ...formData, primary_cta_text: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
              />
            </div>
          </div>
        </div>

        {/* Public Contact Channels */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base text-[#302B2B] border-b border-[#E3E3E0] pb-3">
            Public Contact & Messaging Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#454141] font-semibold mb-1">Official Calling Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
              />
            </div>

            <div>
              <label className="block text-[#454141] font-semibold mb-1">WhatsApp Business Number *</label>
              <input
                type="text"
                required
                placeholder="+91 98450 12345"
                value={formData.whatsapp}
                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
              />
              <span className="text-[10px] text-[#747474] mt-1 block">
                Direct WhatsApp links on website will target this phone.
              </span>
            </div>

            <div>
              <label className="block text-[#454141] font-semibold mb-1">Corporate Inquiries Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[#454141] font-semibold mb-1">Head Office Postal Address *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
            />
          </div>

          <div className="text-xs">
            <label className="block text-[#454141] font-semibold mb-1">Google Maps Location Link</label>
            <input
              type="url"
              value={formData.maps_url}
              onChange={e => setFormData({ ...formData, maps_url: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base text-[#302B2B] border-b border-[#E3E3E0] pb-3">
            Social Media Handles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#454141] font-semibold mb-1">Instagram URL</label>
              <input
                type="url"
                value={formData.instagram || ''}
                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
              />
            </div>

            <div>
              <label className="block text-[#454141] font-semibold mb-1">Facebook URL</label>
              <input
                type="url"
                value={formData.facebook || ''}
                onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
              />
            </div>

            <div>
              <label className="block text-[#454141] font-semibold mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin || ''}
                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xs bg-white border border-[#E3E3E0] text-[#302B2B] focus:outline-hidden focus:border-[#1098C7]"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-[#E3E3E0] flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xs bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{isSaving ? 'Updating Database...' : 'Save Settings Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
