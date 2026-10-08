import React from 'react';
import {
  ShieldCheck,
  Compass,
  Building,
  Wrench,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Eye,
  Award,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { settings } = useSettings();

  const corridors = [
    {
      name: 'Sedam Road',
      desc: 'Connects the city center with the Karnataka High Court Bench, Gulbarga University, and regional educational institutions.',
    },
    {
      name: 'Station Road',
      desc: 'Central transit avenue surrounding the Kalaburagi Central Railway Station with continuous day and night commuter density.',
    },
    {
      name: 'Super Market Area',
      desc: 'The commercial heart of Kalaburagi, drawing trade merchants, gold & textile shoppers, and district-wide consumer traffic.',
    },
    {
      name: 'Jewargi Road',
      desc: 'Inter-district highway thoroughfare opposite the KSRTC Central Bus Stand connecting to regional commerce routes.',
    },
    {
      name: 'Aland Road & Ring Road',
      desc: 'Major industrial and state highway approaches capturing regional transit vehicles entering Kalaburagi.',
    },
    {
      name: 'Shah Bazar & MSK Mill',
      desc: 'High-density traditional trading and residential arteries delivering sustained eye-level street awareness.',
    },
  ];

  return (
    <div className="space-y-20 pb-20 bg-white">
      {/* Hero Banner */}
      <section className="relative py-16 lg:py-20 bg-[#F7F7F4] border-b border-[#E3E3E0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8F6FA] border border-[#1098C7]/30 text-[#1098C7] text-xs font-bold uppercase tracking-wider rounded-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Outdoor Advertising &bull; Kalaburagi, Karnataka</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#302B2B] tracking-tight uppercase max-w-3xl leading-tight">
            YOUR BRAND DESERVES MORE THAN A SCREEN.
          </h1>

          <p className="text-base sm:text-lg text-[#454141] max-w-2xl leading-relaxed">
            Bhagyalaxmi Billboards is Kalaburagi’s dedicated outdoor advertising partner. We connect regional brands, retail institutions, and national enterprises with prime physical visibility across the city’s most traversed thoroughfares.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/locations')}
              className="px-6 py-3.5 bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Explore Kalaburagi Sites</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3.5 bg-white border border-[#E3E3E0] hover:border-[#1098C7] text-[#302B2B] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
            >
              <span>Contact Media Desk</span>
            </button>
          </div>
        </div>
      </section>

      {/* Narrative Section: Who We Are */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <span className="text-xs uppercase tracking-wider text-[#1098C7] font-bold block mb-2">
              Who We Are
            </span>
            <h2 className="font-display font-bold text-2xl text-[#302B2B]">
              Rooted in the Commercial Heart of Kalaburagi
            </h2>
          </div>
          <div className="md:col-span-8 space-y-4 text-sm text-[#454141] leading-relaxed">
            <p>
              Founded with the objective of providing dependable, high-impact outdoor media infrastructure, Bhagyalaxmi Billboards manages strategic hoardings, unipoles, and gantry sites across Kalaburagi, Karnataka.
            </p>
            <p>
              Unlike purely digital mediums where attention spans are measured in milliseconds, outdoor hoardings anchor your brand into the physical fabric of the city. Commuters passing through Sedam Road or Station Road see your banner day after day, turning familiarity into commercial trust.
            </p>
          </div>
        </div>
      </section>

      {/* Core Kalaburagi Corridors Covered */}
      <section className="bg-[#F7F7F4] border-y border-[#E3E3E0] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#1098C7] font-bold block mb-1">
              Geographic Presence
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#302B2B]">
              Key Kalaburagi Advertising Corridors
            </h2>
            <p className="text-xs text-[#747474] mt-1 max-w-xl">
              Our inventory covers the high-velocity transit, institutional, and mercantile arteries of the city.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corridors.map((c, i) => (
              <div
                key={i}
                className="bg-white border border-[#E3E3E0] p-6 rounded-sm space-y-3 hover:border-[#1098C7] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1098C7]" />
                  <h3 className="font-display font-bold text-base text-[#302B2B]">
                    {c.name}
                  </h3>
                </div>
                <p className="text-xs text-[#454141] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Operating Standards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-left space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#1098C7] font-bold">
            Execution Standards
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#302B2B]">
            How We Manage Outdoor Media
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 bg-[#F7F7F4] border border-[#E3E3E0] p-6 rounded-sm">
            <div className="w-9 h-9 rounded-sm bg-[#E8F6FA] text-[#1098C7] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#302B2B]">
              Legal Compliance
            </h3>
            <p className="text-xs text-[#454141] leading-relaxed">
              We operate exclusively on authorized advertising sites adhering to local municipal guidelines and zoning standards.
            </p>
          </div>

          <div className="space-y-3 bg-[#F7F7F4] border border-[#E3E3E0] p-6 rounded-sm">
            <div className="w-9 h-9 rounded-sm bg-[#E8F6FA] text-[#1098C7] flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#302B2B]">
              Rigging & Print Quality
            </h3>
            <p className="text-xs text-[#454141] leading-relaxed">
              Experienced local riggers ensure high-tensile flex mounting, wrinkle-free tensioning, and nocturnal floodlight maintenance.
            </p>
          </div>

          <div className="space-y-3 bg-[#F7F7F4] border border-[#E3E3E0] p-6 rounded-sm">
            <div className="w-9 h-9 rounded-sm bg-[#E8F6FA] text-[#1098C7] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-[#302B2B]">
              Local Market Advice
            </h3>
            <p className="text-xs text-[#454141] leading-relaxed">
              We guide clients on optimal viewing angles, traffic bottlenecks, and location matching according to business objectives.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="bg-[#302B2B] text-white p-8 sm:p-12 rounded-sm border border-[#454141] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-2xl text-white">
              Plan Your Campaign with Us
            </h3>
            <p className="text-xs text-zinc-300">
              Speak with our Kalaburagi desk for site inspections, availability, and rate quotations.
            </p>
          </div>
          <button
            onClick={() => navigate('/quote')}
            className="px-6 py-3.5 bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer shrink-0"
          >
            Request Rate Card
          </button>
        </div>
      </section>
    </div>
  );
};
