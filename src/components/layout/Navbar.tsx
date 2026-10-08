import React, { useState, useEffect } from 'react';
import { Phone, ArrowRight, Menu, X, Lock, MapPin } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.tsx';
import { BrandLogo } from '../common/BrandLogo.tsx';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Locations', path: '/locations' },
    { label: 'Why Us', path: '/#why-us' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-200">
      {/* 5. TOP INFORMATION BAR:
          Background: #302B2B | Text: #FFFFFF | Accent: #1098C7
          Compact editorial bar */}
      <div className="bg-[#302B2B] text-white text-[11px] py-1.5 px-4 sm:px-8 border-b border-[#454141]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#1098C7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1098C7] animate-pulse"></span>
              OUTDOOR ADVERTISING NETWORK
            </span>
            <span className="text-[#454141] hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-zinc-300 font-medium">
              <MapPin className="w-3 h-3 text-[#1098C7]" />
              Kalaburagi, Karnataka, India
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-300">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="hover:text-[#1098C7] transition-colors flex items-center gap-1.5 font-medium"
            >
              <Phone className="w-3 h-3 text-[#1098C7]" />
              <span>{settings.phone}</span>
            </a>
            <span className="text-[#454141]">|</span>
            <button
              onClick={() => handleNav('/admin/login')}
              className="text-zinc-300 hover:text-[#1098C7] transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              title="Admin CRM Login"
            >
              <Lock className="w-3 h-3 text-zinc-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN NAVBAR:
          Background: #FFFFFF
          Navigation: #302B2B
          Active navigation: #1098C7
          Bottom border: #E3E3E0
          Primary CTA: #1098C7 (Hover #0879A3, Text #FFFFFF) */}
      <div
        className={`bg-white border-b border-[#E3E3E0] transition-shadow duration-200 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Brand Logo with actual Bhagyalaxmi Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <BrandLogo variant="full" theme="light" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => {
              const isActive =
                link.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(link.path) && link.path !== '/#why-us';

              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.path)}
                  className={`text-xs uppercase tracking-wider font-bold transition-colors py-1 cursor-pointer ${
                    isActive
                      ? 'text-[#1098C7] border-b-2 border-[#1098C7]'
                      : 'text-[#302B2B] hover:text-[#1098C7]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Primary Brand Blue Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => handleNav('/quote')}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer active:translate-y-0.5"
            >
              <span>{settings.primary_cta_text || 'Get a Quote'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#302B2B] hover:text-[#1098C7] rounded-sm cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E3E3E0] px-4 py-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3">
            {navLinks.map(link => {
              const isActive =
                link.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(link.path) && link.path !== '/#why-us';
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.path)}
                  className={`text-left text-sm font-bold uppercase tracking-wider py-2 px-3 rounded-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#E8F6FA] text-[#1098C7]'
                      : 'text-[#302B2B] hover:bg-[#F7F7F4] hover:text-[#1098C7]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#E3E3E0] space-y-3">
            <button
              onClick={() => handleNav('/quote')}
              className="w-full py-3 bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs uppercase tracking-wider text-center rounded-sm transition-colors cursor-pointer"
            >
              {settings.primary_cta_text || 'Get a Quote'}
            </button>
            <button
              onClick={() => handleNav('/admin/login')}
              className="w-full py-2.5 bg-[#F7F7F4] text-[#302B2B] border border-[#E3E3E0] hover:border-[#1098C7] font-semibold text-xs uppercase tracking-wider text-center rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#747474]" />
              <span>Admin Portal Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
