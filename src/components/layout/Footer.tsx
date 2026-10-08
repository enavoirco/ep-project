import React from 'react';
import { MapPin, Phone, Mail, MessageSquare, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.tsx';
import { BrandLogo } from '../common/BrandLogo.tsx';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const whatsappClean = (settings.whatsapp || '').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#302B2B] text-zinc-300 border-t border-[#454141] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#454141]">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="full" theme="dark" />
            <p className="text-xs text-zinc-300 max-w-sm leading-relaxed">
              Leading outdoor advertising company providing high-visibility billboard locations, unipoles, and highway gantry placements across Kalaburagi, Karnataka.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${whatsappClean}?text=Hello%20Bhagyalaxmi%20Billboards%2C%20I%20am%20interested%20in%20outdoor%20advertising%20in%20Kalaburagi`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#454141] border border-[#555050] text-white hover:text-[#1098C7] hover:border-[#1098C7] transition-colors text-xs font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#1098C7]" />
                <span>WhatsApp Media Desk</span>
              </a>
              <button
                onClick={() => navigate('/admin/login')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-[#454141]/60 border border-[#454141] text-zinc-400 hover:text-white transition-colors text-xs cursor-pointer"
              >
                <span>Admin CRM</span>
                <ArrowUpRight className="w-3 h-3 text-[#1098C7]" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#1098C7] font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-[#1098C7] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/locations')}
                  className="hover:text-[#1098C7] transition-colors cursor-pointer"
                >
                  Billboard Inventory
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-[#1098C7] transition-colors cursor-pointer"
                >
                  About Our Network
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/quote')}
                  className="hover:text-[#1098C7] transition-colors cursor-pointer"
                >
                  Request Rate Card
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-[#1098C7] transition-colors cursor-pointer"
                >
                  Contact Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Key Areas in Kalaburagi */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#1098C7] font-bold">
              Kalaburagi Corridors
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li>
                <button
                  onClick={() => navigate('/locations')}
                  className="hover:text-[#1098C7] transition-colors text-left cursor-pointer"
                >
                  Sedam Road Corridors
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/locations')}
                  className="hover:text-[#1098C7] transition-colors text-left cursor-pointer"
                >
                  Station Road Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/locations')}
                  className="hover:text-[#1098C7] transition-colors text-left cursor-pointer"
                >
                  Super Market Retail Area
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/locations')}
                  className="hover:text-[#1098C7] transition-colors text-left cursor-pointer"
                >
                  Jewargi Road Artery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/locations')}
                  className="hover:text-[#1098C7] transition-colors text-left cursor-pointer"
                >
                  Ring Road & Humnabad Road
                </button>
              </li>
            </ul>
          </div>

          {/* Office Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#1098C7] font-bold">
              Office & Inquiries
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#1098C7] shrink-0 mt-0.5" />
                <p className="leading-relaxed text-zinc-200">{settings.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1098C7] shrink-0" />
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-[#1098C7] transition-colors font-medium text-white"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#1098C7] shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-[#1098C7] transition-colors text-zinc-200"
                >
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Authorized Outdoor Advertising Sites</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>
            &copy; {new Date().getFullYear()} Bhagyalaxmi Billboards. Kalaburagi, Karnataka, India. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[11px]">
            <button
              onClick={() => navigate('/about')}
              className="hover:text-[#1098C7] transition-colors cursor-pointer"
            >
              Company Profile
            </button>
            <button
              onClick={() => navigate('/locations')}
              className="hover:text-[#1098C7] transition-colors cursor-pointer"
            >
              Inventory Standards
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="hover:text-[#1098C7] transition-colors cursor-pointer"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
