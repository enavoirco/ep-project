import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  Eye,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  MessageSquare,
  Sparkles,
  Layers,
  Phone,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { BillboardLocation } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useSettings } from '../context/SettingsContext.tsx';
import { AvailabilityBadge } from '../components/common/Badge.tsx';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const [featuredLocations, setFeaturedLocations] = useState<BillboardLocation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await api.getLocations();
        setFeaturedLocations(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured locations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const whatsappClean = (settings.whatsapp || '').replace(/[^0-9]/g, '');

  const whyChooseReasons = [
    {
      num: '01',
      title: 'HIGH VISIBILITY',
      desc: 'Strategic billboard placements positioned along heavy-commute junctions designed to put your brand directly in front of passing audiences.',
    },
    {
      num: '02',
      title: 'LOCAL KNOWLEDGE',
      desc: 'Deep market focus across Kalaburagi—from bustling wholesale markets to institutional and high-court corridors.',
    },
    {
      num: '03',
      title: 'FLEXIBLE CAMPAIGNS',
      desc: 'Adaptable solutions tailored for festive sales pushes, flagship showroom inaugurations, or long-term corporate brand dominance.',
    },
    {
      num: '04',
      title: 'SIMPLE PROCESS',
      desc: 'Choose an available location, share your campaign requirements and artwork, and let our field riggers handle the mounting.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose a Location',
      desc: 'Browse prime outdoor media inventory across Sedam Road, Station Road, Super Market, and key Kalaburagi junctions.',
    },
    {
      step: '02',
      title: 'Plan Your Campaign',
      desc: 'Select preferred duration, share creative artwork specifications, and receive customized quotation rate cards.',
    },
    {
      step: '03',
      title: 'Get Your Brand Seen',
      desc: 'Our installation team handles high-tensile flex mounting, nocturnal illumination setup, and routine site inspections.',
    },
  ];

  return (
    <div className="space-y-24 pb-20 bg-white">
      {/* 1. HERO SECTION:
          Light/clean editorial foundation with premium billboard imagery
          Dark charcoal typography (#302B2B) + Brand Blue (#1098C7) */}
      <section className="relative overflow-hidden bg-[#F7F7F4] border-b border-[#E3E3E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location Tag */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F6FA] border border-[#1098C7]/30 text-[#1098C7] text-xs font-bold uppercase tracking-wider rounded-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1098C7]" />
              <span>Kalaburagi, Karnataka &bull; Premium Outdoor Advertising</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display font-black text-4xl sm:text-6xl text-[#302B2B] tracking-tight leading-[1.08] uppercase">
                PUT YOUR BRAND WHERE <br />
                <span className="text-[#1098C7]">KALABURAGI</span> CAN SEE IT.
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#454141] text-base sm:text-lg max-w-xl font-normal leading-relaxed"
            >
              High-visibility outdoor advertising solutions across Kalaburagi, Karnataka. Strategic hoardings, unipoles, and gantry sites positioned along prime commercial and transit arteries.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={() => navigate('/locations')}
                className="group px-7 py-4 bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer rounded-xs active:translate-y-0.5"
              >
                <span>Explore Locations</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('/quote')}
                className="px-7 py-4 bg-white hover:bg-[#F7F7F4] text-[#302B2B] font-bold text-xs uppercase tracking-wider border border-[#E3E3E0] hover:border-[#1098C7] transition-all flex items-center justify-center cursor-pointer rounded-xs"
              >
                <span>Request Rate Card</span>
              </button>
            </motion.div>

            {/* Key highlights bar */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="pt-8 border-t border-[#E3E3E0] flex flex-wrap items-center gap-6 text-xs text-[#747474]"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#1098C7] rounded-full" />
                <span className="font-medium text-[#302B2B]">Prime Arterial Junctions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#1098C7] rounded-full" />
                <span className="font-medium text-[#302B2B]">Front-lit & High-Res Flex</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#1098C7] rounded-full" />
                <span className="font-medium text-[#302B2B]">Local Kalaburagi Rigger Team</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual Feature Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative bg-white rounded-sm border border-[#E3E3E0] p-2.5 shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xs bg-[#F7F7F4]">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
                  alt="Bhagyalaxmi Billboards - Kalaburagi Outdoor Display"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#302B2B]/90 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1098C7]"></span>
                  Prime Arterial Hoarding
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xs border border-[#E3E3E0] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#302B2B]">Sedam Road Corridor</p>
                    <p className="text-[11px] text-[#747474]">Kalaburagi &bull; 40ft x 20ft Front-lit</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#1098C7] bg-[#E8F6FA] px-2 py-0.5 rounded-xs">
                    High Daily Reach
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. WHY OUTDOOR ADVERTISING (Editorial Statement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#F7F7F4] border border-[#E3E3E0] p-8 sm:p-12 rounded-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs uppercase tracking-wider text-[#1098C7] font-bold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Unavoidable Physical Presence
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#302B2B] tracking-tight leading-tight">
                YOUR BRAND DESERVES MORE THAN A SCREEN.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-[#E3E3E0] lg:pl-10 text-[#454141] text-sm leading-relaxed">
              <p className="text-[#302B2B] font-semibold text-base">
                Digital ads get scrolled past or skipped in seconds. Outdoor advertising delivers round-the-clock physical scale that cannot be muted, closed, or ignored.
              </p>
              <p>
                In Kalaburagi, thousands of daily commuters traverse key thoroughfares like Sedam Road, Station Road, and Super Market. When your billboard occupies these landmarks, your message becomes part of the city’s daily landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED LOCATIONS IN KALABURAGI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E3E3E0] pb-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#1098C7] font-bold mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Kalaburagi Inventory</span>
            </div>
            <h2 className="font-display font-bold text-3xl text-[#302B2B] tracking-tight">
              Featured Billboard Locations
            </h2>
            <p className="text-xs text-[#747474] mt-1 max-w-xl">
              Representative outdoor advertising inventory across primary transit circles and commercial shopping zones in Kalaburagi.
            </p>
          </div>
          <button
            onClick={() => navigate('/locations')}
            className="inline-flex items-center gap-1.5 text-xs text-[#1098C7] hover:text-[#0879A3] font-bold uppercase tracking-wider group cursor-pointer"
          >
            <span>View All Locations</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Editorial Inventory Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(n => (
              <div key={n} className="h-96 bg-[#F7F7F4] animate-pulse border border-[#E3E3E0]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredLocations.map(location => (
              <div
                key={location.id}
                className="bg-white border border-[#E3E3E0] rounded-sm overflow-hidden flex flex-col group hover:border-[#1098C7] transition-all duration-200 shadow-xs hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F7F7F4]">
                  <img
                    src={location.images[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'}
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <AvailabilityBadge availability={location.availability} />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#302B2B]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-xs uppercase tracking-wider">
                    {location.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#747474]">
                      <MapPin className="w-3.5 h-3.5 text-[#1098C7]" />
                      <span>{location.area}, {location.city}</span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#302B2B] group-hover:text-[#1098C7] transition-colors leading-snug">
                      {location.name}
                    </h3>
                    <p className="text-xs text-[#454141] line-clamp-2 leading-relaxed">
                      {location.description}
                    </p>
                  </div>

                  {/* Specifications Meta */}
                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-[#E3E3E0] text-xs">
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
                      <span className="font-display font-extrabold text-lg text-[#302B2B]">
                        ₹{location.price.toLocaleString('en-IN')}
                        <span className="text-xs text-[#747474] font-normal"> /mo</span>
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/locations/${location.slug}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E8F6FA] hover:bg-[#1098C7] text-[#1098C7] hover:text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                    >
                      <span>Details & Booking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE BHAGYALAXMI (4 Clean Columns) */}
      <section id="why-us" className="bg-[#F7F7F4] border-y border-[#E3E3E0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#1098C7] font-bold">
              Local Excellence
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#302B2B] tracking-tight">
              WHY BUSINESSES CHOOSE US
            </h2>
            <p className="text-sm text-[#454141] leading-relaxed">
              We specialize in outdoor advertising infrastructure across Kalaburagi, offering premier inventory backed by hands-on execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseReasons.map(item => (
              <div
                key={item.num}
                className="bg-white border border-[#E3E3E0] p-6 rounded-sm space-y-4 hover:border-[#1098C7] transition-colors"
              >
                <div className="font-display font-extrabold text-2xl text-[#1098C7]">
                  {item.num}
                </div>
                <h3 className="font-display font-bold text-base text-[#302B2B] tracking-tight uppercase">
                  {item.title}
                </h3>
                <p className="text-xs text-[#454141] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SIMPLE 3-STEP PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#1098C7] font-bold">
            Execution Roadmap
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#302B2B] tracking-tight">
            HOW IT WORKS
          </h2>
          <p className="text-sm text-[#454141]">
            From location selection to nocturnal illumination in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(step => (
            <div
              key={step.step}
              className="bg-white border border-[#E3E3E0] p-8 rounded-sm space-y-4 relative"
            >
              <div className="w-10 h-10 rounded-sm bg-[#E8F6FA] text-[#1098C7] font-display font-black text-lg flex items-center justify-center">
                {step.step}
              </div>
              <h3 className="font-display font-bold text-lg text-[#302B2B]">
                {step.title}
              </h3>
              <p className="text-xs text-[#454141] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION STRIP:
          Dark charcoal background (#302B2B) + Brand Blue CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#302B2B] text-white p-8 sm:p-14 rounded-sm border border-[#454141] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1098C7] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Campaign Planning Desk
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Ready to Amplify Your Brand in Kalaburagi?
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Connect with our Kalaburagi media team today for customized billboard rate cards, bundle packages, and availability schedules.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
            <button
              onClick={() => navigate('/quote')}
              className="px-6 py-3.5 bg-[#1098C7] hover:bg-[#0879A3] text-white font-bold text-xs uppercase tracking-wider rounded-xs transition-colors cursor-pointer text-center"
            >
              Get Custom Quote
            </button>
            <a
              href={`https://wa.me/${whatsappClean}?text=Hello%20Bhagyalaxmi%20Billboards%2C%20I%20would%20like%20to%20inquire%20about%20billboard%20rates%20in%20Kalaburagi`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-[#454141] hover:bg-[#555050] text-white border border-[#555050] font-bold text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#1098C7]" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
