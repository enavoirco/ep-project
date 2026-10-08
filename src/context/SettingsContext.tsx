import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanySettings } from '../types/index.ts';
import { api } from '../services/api.ts';

interface SettingsContextType {
  settings: CompanySettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (updates: Partial<CompanySettings>) => Promise<CompanySettings>;
}

const DEFAULT_SETTINGS: CompanySettings = {
  company_name: 'Bhagyalaxmi Billboards',
  phone: '+91 98450 12345',
  whatsapp: '+91 98450 12345',
  email: 'contact@bhagyalaxmibillboards.com',
  address: 'Bhagyalaxmi Complex, Main Road, Near Super Market, Kalaburagi, Karnataka 585101',
  maps_url: 'https://maps.google.com/?q=Super+Market+Kalaburagi',
  instagram: 'https://instagram.com/bhagyalaxmi_billboards',
  facebook: 'https://facebook.com/bhagyalaxmibillboards',
  linkedin: 'https://linkedin.com/company/bhagyalaxmi-billboards',
  website_logo: '',
  primary_cta_text: 'Get a Quote',
  updated_at: new Date().toISOString(),
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.warn('Could not load dynamic settings, using defaults:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (updates: Partial<CompanySettings>) => {
    const updated = await api.updateSettings(updates);
    setSettings(updated);
    return updated;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
