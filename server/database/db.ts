import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import {
  BillboardLocation,
  Lead,
  LeadNote,
  FollowUp,
  Customer,
  Enquiry,
  ActivityLog,
  CompanySettings,
} from '../../src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface AdminRecord {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager';
  created_at: string;
}

export interface DatabaseSchema {
  admins: AdminRecord[];
  locations: BillboardLocation[];
  leads: Lead[];
  lead_notes: LeadNote[];
  follow_ups: FollowUp[];
  customers: Customer[];
  enquiries: Enquiry[];
  activity_logs: ActivityLog[];
  settings: CompanySettings;
}

function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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

const SEED_LOCATIONS: BillboardLocation[] = [
  {
    id: 'loc_001',
    slug: 'sedam-road-commercial-corridor-hoarding',
    name: 'Sedam Road - High Court Junction Hoarding',
    city: 'Kalaburagi',
    area: 'Sedam Road',
    address: 'Sedam Road, Near High Court Bench & Ring Road Junction, Kalaburagi, Karnataka 585105',
    maps_url: 'https://maps.google.com/?q=Sedam+Road+Kalaburagi',
    latitude: 17.3297,
    longitude: 76.8343,
    type: 'Hoarding',
    dimensions: '40ft x 20ft (800 sq.ft)',
    orientation: 'Facing incoming vehicular traffic from Ring Road towards City Centre',
    traffic_estimate: 'High daily vehicular flow across court & university commuter corridor',
    visibility: 'Unobstructed head-on visibility for over 350 meters',
    lighting: 'Front-lit',
    price: 65000,
    availability: 'Available',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Prominent large-format hoarding situated along the busy Sedam Road artery in Kalaburagi. Captures continuous daily traffic between the High Court Bench, Gulbarga University, medical colleges, and the central commercial area.',
    landmarks: ['Karnataka High Court Bench', 'Ring Road Junction', 'Central University Transit Point'],
    audience_info: 'Legal professionals, university faculty, corporate business commuters, and regional travelers.',
    created_at: new Date('2026-01-10T10:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'loc_002',
    slug: 'station-road-railway-terminal-unipole',
    name: 'Station Road - Central Railway Terminal Unipole',
    city: 'Kalaburagi',
    area: 'Station Road',
    address: 'Station Road, Opposite Kalaburagi Railway Station, Kalaburagi, Karnataka 585102',
    maps_url: 'https://maps.google.com/?q=Station+Road+Kalaburagi',
    latitude: 17.3364,
    longitude: 76.8378,
    type: 'Unipole',
    dimensions: '35ft x 20ft (700 sq.ft)',
    orientation: 'Facing passenger traffic exiting and entering Railway Station Circle',
    traffic_estimate: 'Heavy 24/7 footfall and vehicular convergence at central transit hub',
    visibility: 'Elevated cantilever unipole towering over station square and commercial hotels',
    lighting: 'Front-lit',
    price: 75000,
    availability: 'Available',
    images: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Standalone steel unipole structure positioned directly opposite the Kalaburagi Central Railway Station. Exceptional dwell times due to continuous vehicular pickup and drop-off traffic.',
    landmarks: ['Kalaburagi Railway Station', 'Sardar Vallabhbhai Patel Chowk', 'Hotel Grand'],
    audience_info: 'Interstate rail passengers, business visitors, local shoppers, and hospitality guests.',
    created_at: new Date('2026-01-12T11:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'loc_003',
    slug: 'super-market-area-retail-epicentre-hoarding',
    name: 'Super Market Area - Prime Retail Circle Hoarding',
    city: 'Kalaburagi',
    area: 'Super Market Area',
    address: 'Super Market Main Circle, Near City Bus Stand, Kalaburagi, Karnataka 585101',
    maps_url: 'https://maps.google.com/?q=Super+Market+Kalaburagi',
    latitude: 17.3340,
    longitude: 76.8280,
    type: 'Hoarding',
    dimensions: '50ft x 20ft (1,000 sq.ft)',
    orientation: 'Dominating central commercial roundabout and bazaar approach',
    traffic_estimate: 'Dense retail footfall and high-density shopper vehicular volume',
    visibility: 'Head-on view across the city’s primary retail and trading market',
    lighting: 'Front-lit',
    price: 85000,
    availability: 'Booked',
    images: [
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'The premier consumer advertising asset in Kalaburagi. Located right in the heart of the bustling Super Market commercial hub beside major jewellery, apparel, textile, and electronics retail outlets.',
    landmarks: ['Main City Bus Stand', 'Sarafa Gold Bazaar', 'Gandhi Chowk'],
    audience_info: 'Active retail buyers, families, trade merchants, and district-wide shoppers.',
    created_at: new Date('2026-01-15T09:30:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'loc_004',
    slug: 'jewargi-road-ksrtc-terminus-gantry',
    name: 'Jewargi Road - KSRTC Central Bus Terminus Gantry',
    city: 'Kalaburagi',
    area: 'Jewargi Road',
    address: 'Jewargi Road, Opposite Central Bus Stand, Kalaburagi, Karnataka 585102',
    maps_url: 'https://maps.google.com/?q=Jewargi+Road+Kalaburagi',
    latitude: 17.3210,
    longitude: 76.8290,
    type: 'Gantry',
    dimensions: '45ft x 20ft (900 sq.ft)',
    orientation: 'Spans roadway facing intercity traffic moving towards Jewargi and Vijayapura',
    traffic_estimate: 'High highway vehicular flow connecting regional districts',
    visibility: 'Full-span dual-lane gantry visibility from over 400 meters',
    lighting: 'Front-lit',
    price: 70000,
    availability: 'Available',
    images: [
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Spanning across Jewargi Road, this overhead highway gantry commands 100% of the traffic approaching the regional KSRTC bus terminus and the state highway network.',
    landmarks: ['KSRTC Central Bus Stand', 'ESIC Medical Complex', 'Jewargi Bypass'],
    audience_info: 'Interdistrict commuters, logistics fleets, trade merchants, and medical visitors.',
    created_at: new Date('2026-01-20T14:15:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'loc_005',
    slug: 'aland-road-checkpost-circle-unipole',
    name: 'Aland Road - Checkpost Junction Unipole',
    city: 'Kalaburagi',
    area: 'Aland Road',
    address: 'Aland Road Checkpost Circle, Near RTO Office, Kalaburagi, Karnataka 585103',
    maps_url: 'https://maps.google.com/?q=Aland+Road+Kalaburagi',
    latitude: 17.3502,
    longitude: 76.8190,
    type: 'Unipole',
    dimensions: '30ft x 15ft (450 sq.ft)',
    orientation: 'Head-on view facing traffic entering Kalaburagi from Aland & Maharashtra border',
    traffic_estimate: 'Substantial daily inter-state and district commercial traffic',
    visibility: 'Elevated single-mast structure with clean viewing angle',
    lighting: 'Front-lit',
    price: 45000,
    availability: 'Available',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Strategic entry-point unipole capturing vehicles entering Kalaburagi from the northern agricultural and industrial zones along Aland Road.',
    landmarks: ['Regional Transport Office (RTO)', 'Khwaja Bande Nawaz Dargah Approach', 'Old Checkpost'],
    audience_info: 'Regional traders, transport operators, government visitors, and local residents.',
    created_at: new Date('2026-01-25T16:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'loc_006',
    slug: 'shah-bazar-heritage-market-wallscape',
    name: 'Shah Bazar - Historic Commercial Wallscape',
    city: 'Kalaburagi',
    area: 'Shah Bazar',
    address: 'Shah Bazar Main Street, Near Fort Entrance, Kalaburagi, Karnataka 585104',
    maps_url: 'https://maps.google.com/?q=Shah+Bazar+Kalaburagi',
    latitude: 17.3412,
    longitude: 76.8220,
    type: 'Wallscape',
    dimensions: '40ft x 25ft (1,000 sq.ft)',
    orientation: 'Facade mount facing high-density bazaar intersection',
    traffic_estimate: 'Continuous local market and pedestrian commercial density',
    visibility: 'Prominent building facade canvas visible along the market thoroughfare',
    lighting: 'Front-lit',
    price: 50000,
    availability: 'Reserved',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Large-scale building facade billboard located in the bustling Shah Bazar market, delivering sustained exposure to thousands of daily wholesale and retail patrons.',
    landmarks: ['Kalaburagi Fort', 'Historic Shah Bazar Gate', 'Cloth Merchants Association'],
    audience_info: 'Wholesale buyers, retail consumers, cultural tourists, and residential families.',
    created_at: new Date('2026-02-01T10:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'loc_007',
    slug: 'humnabad-ring-road-junction-digital-led',
    name: 'Humnabad Road - Ring Road Junction Digital LED',
    city: 'Kalaburagi',
    area: 'Humnabad Road',
    address: 'Humnabad Road & Outer Ring Road Intersection, Kalaburagi, Karnataka 585104',
    maps_url: 'https://maps.google.com/?q=Humnabad+Road+Kalaburagi',
    latitude: 17.3380,
    longitude: 76.8520,
    type: 'LED Billboard',
    dimensions: '30ft x 15ft (450 sq.ft High-Definition SMD LED)',
    orientation: 'Facing NH-50 junction and Ring Road commuter traffic',
    traffic_estimate: 'High highway intersection volume with prolonged signal wait times',
    visibility: 'Ultra-bright outdoor SMD LED with daylight-readable clarity',
    lighting: 'Digital LED',
    price: 80000,
    availability: 'Available',
    images: [
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Modern digital LED screen positioned at the major junction of Humnabad Road and the Ring Road. Supports dynamic video playback, split-second creative changes, and round-the-clock brand rotation.',
    landmarks: ['Ring Road East Junction', 'NH-50 Interchange', 'Industrial Area Gateway'],
    audience_info: 'Highway commuters, commercial transport drivers, industrial executives, and urban travelers.',
    created_at: new Date('2026-02-05T12:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'loc_008',
    slug: 'msk-mill-old-jewargi-road-cantilever',
    name: 'MSK Mill Road - Old Jewargi Crossing Cantilever',
    city: 'Kalaburagi',
    area: 'MSK Mill Road',
    address: 'Near MSK Mill Compound, Old Jewargi Road, Kalaburagi, Karnataka 585102',
    maps_url: 'https://maps.google.com/?q=MSK+Mill+Road+Kalaburagi',
    latitude: 17.3190,
    longitude: 76.8220,
    type: 'Hoarding',
    dimensions: '35ft x 18ft (630 sq.ft)',
    orientation: 'Facing traffic connecting Old Jewargi Road to District Stadium',
    traffic_estimate: 'Steady daily residential and institutional transit flow',
    visibility: 'Elevated cantilever structure positioned for clear approach visibility',
    lighting: 'Front-lit',
    price: 40000,
    availability: 'Available',
    images: [
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'High-visibility hoarding serving the busy MSK Mill Road and Old Jewargi Road crossing. Ideal for local consumer branding, retail inaugurations, and regional institutional promotions.',
    landmarks: ['MSK Mill Historic Compound', 'Old Jewargi Crossing', 'District Stadium Area'],
    audience_info: 'Local residents, educational students, sports patrons, and local market shoppers.',
    created_at: new Date('2026-02-10T08:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SEED_LEADS: Lead[] = [
  {
    id: 'lead_001',
    name: 'Santosh Patil',
    company: 'Patil Jewellers Super Market Branch',
    phone: '+91 98451 22334',
    email: 'santosh@patiljewellers.com',
    whatsapp: '+91 98451 22334',
    location_id: 'loc_003',
    location_name: 'Super Market Area - Prime Retail Circle Hoarding',
    campaign_type: 'Festival Gold Jewellery Promotion',
    budget: '₹2,50,000 (3 Months)',
    start_date: '2026-04-10',
    end_date: '2026-07-10',
    message: 'We require a 3-month continuous booking for the Super Market hoardings during the upcoming wedding season. Please share rate card and mounting specs.',
    source: 'Website',
    status: 'Qualified',
    priority: 'High',
    assigned_to: 'Vikram Shinde',
    follow_up_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    notes: 'Client reviewed media kit. Sent creative dimension sheet for Super Market hoarding.',
    created_at: new Date('2026-03-01T10:15:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead_002',
    name: 'Basavaraj Biradar',
    company: 'Biradar Mega Mart & Electronics',
    phone: '+91 98860 77889',
    email: 'b.biradar@megamart.in',
    whatsapp: '+91 98860 77889',
    location_id: 'loc_001',
    location_name: 'Sedam Road - High Court Junction Hoarding',
    campaign_type: 'New Showroom Launch Campaign',
    budget: '₹1,80,000',
    start_date: '2026-04-01',
    end_date: '2026-06-30',
    message: 'Launching a new electronics branch on Sedam Road. Looking for the premier High Court junction hoarding site.',
    source: 'Quote Request',
    status: 'Proposal Sent',
    priority: 'Urgent',
    assigned_to: 'Vikram Shinde',
    follow_up_date: new Date().toISOString().split('T')[0],
    notes: 'Proposal sent with illumination confirmation.',
    created_at: new Date('2026-03-05T14:30:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'lead_003',
    name: 'Anand Deshmukh',
    company: 'Kalaburagi Agro Traders',
    phone: '+91 94481 44556',
    email: 'anand@kalaburagiagro.com',
    whatsapp: '+91 94481 44556',
    location_id: 'loc_004',
    location_name: 'Jewargi Road - KSRTC Central Bus Terminus Gantry',
    campaign_type: 'Agricultural Seeds & Fertilizer Season',
    budget: '₹1,20,000',
    start_date: '2026-05-01',
    end_date: '2026-07-01',
    message: 'Inquiring regarding Jewargi Road gantry availability before the kharif monsoon sowing season.',
    source: 'Billboard Enquiry',
    status: 'New',
    priority: 'Medium',
    assigned_to: 'Rajesh Kulkarni',
    follow_up_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    notes: 'Inquiry received via website billboard details page.',
    created_at: new Date('2026-03-12T09:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust_001',
    name: 'Basavaraj Biradar',
    company: 'Biradar Mega Mart & Electronics',
    phone: '+91 98860 77889',
    email: 'b.biradar@megamart.in',
    address: 'Sedam Road Commercial Hub, Kalaburagi, Karnataka 585105',
    notes: 'Long-term client for Sedam Road and Super Market hoardings.',
    total_spend: 360000,
    status: 'Active',
    created_at: new Date('2026-01-28T12:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SEED_FOLLOW_UPS: FollowUp[] = [
  {
    id: 'fol_001',
    lead_id: 'lead_002',
    lead_name: 'Basavaraj Biradar',
    lead_company: 'Biradar Mega Mart & Electronics',
    lead_phone: '+91 98860 77889',
    title: 'Follow up on Sedam Road billboard rate proposal',
    due_date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    notes: 'Confirm if client creative team approved dimension sheet.',
    created_at: new Date('2026-03-06T15:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'fol_002',
    lead_id: 'lead_001',
    lead_name: 'Santosh Patil',
    lead_company: 'Patil Jewellers Super Market Branch',
    lead_phone: '+91 98451 22334',
    title: 'Confirm Akshaya Tritiya creative flex printing timeline',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    status: 'Pending',
    notes: 'Mounting team needs final artwork 4 days prior to campaign live date.',
    created_at: new Date('2026-03-02T11:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SEED_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act_001',
    admin_id: 'adm_001',
    admin_name: 'Senior Director',
    action: 'Location Added',
    entity_type: 'location',
    entity_id: 'loc_007',
    description: 'Added new premium asset: Humnabad Road - Ring Road Junction Digital LED',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'act_002',
    admin_id: 'adm_001',
    admin_name: 'Senior Director',
    action: 'Lead Status Updated',
    entity_type: 'lead',
    entity_id: 'lead_002',
    description: 'Updated Biradar Mega Mart status to Proposal Sent',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = this.getDefaultSchema();
    this.init();
  }

  private getDefaultSchema(): DatabaseSchema {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || adminPassword.length < 12) {
      throw new Error('ADMIN_PASSWORD must be set to at least 12 characters before starting the server.');
    }

    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    const defaultAdmin: AdminRecord = {
      id: 'adm_001',
      email: process.env.ADMIN_EMAIL || 'admin@bhagyalaxmi.com',
      password_hash: passwordHash,
      name: 'Operations Director',
      role: 'super_admin',
      created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
    };

    return {
      admins: [defaultAdmin],
      locations: SEED_LOCATIONS,
      leads: SEED_LEADS,
      lead_notes: [
        {
          id: 'note_001',
          lead_id: 'lead_001',
          note: 'Called client on phone. They requested 300dpi flex specification sheet and lighting inspection report for Super Market hoarding.',
          created_by: 'Vikram Shinde',
          created_at: new Date('2026-03-01T12:00:00Z').toISOString(),
        },
      ],
      follow_ups: SEED_FOLLOW_UPS,
      customers: SEED_CUSTOMERS,
      enquiries: [],
      activity_logs: SEED_ACTIVITIES,
      settings: DEFAULT_SETTINGS,
    };
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      // Check if DB file exists and check if it contains old Bangalore data
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // If data contains Bangalore / Bengaluru, reset to pristine Kalaburagi schema!
        const hasOldData = JSON.stringify(parsed).toLowerCase().includes('bengaluru') || JSON.stringify(parsed).toLowerCase().includes('marathahalli');
        if (hasOldData) {
          console.log('Detected legacy location data, migrating database to Kalaburagi, Karnataka...');
          this.data = this.getDefaultSchema();
          this.save();
        } else {
          this.data = {
            ...this.getDefaultSchema(),
            ...parsed,
          };
        }
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Failed to load database file, resetting to initial seed:', err);
      this.data = this.getDefaultSchema();
      this.save();
      this.isLoaded = true;
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Critical database write error:', err);
    }
  }

  // --- LOG ACTIVITY ---
  public logActivity(
    adminId: string,
    adminName: string,
    action: string,
    entityType: ActivityLog['entity_type'],
    entityId: string | undefined,
    description: string
  ) {
    const log: ActivityLog = {
      id: generateId('act'),
      admin_id: adminId,
      admin_name: adminName,
      action,
      entity_type: entityType,
      entity_id: entityId,
      description,
      created_at: new Date().toISOString(),
    };
    this.data.activity_logs.unshift(log);
    if (this.data.activity_logs.length > 200) {
      this.data.activity_logs = this.data.activity_logs.slice(0, 200);
    }
    this.save();
    return log;
  }

  // --- ADMINS ---
  public getAdminByEmail(email: string): AdminRecord | undefined {
    return this.data.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  }

  public getAdminById(id: string): AdminRecord | undefined {
    return this.data.admins.find(a => a.id === id);
  }

  // --- SETTINGS ---
  public getSettings(): CompanySettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<CompanySettings>, adminId?: string, adminName?: string): CompanySettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.save();
    if (adminId && adminName) {
      this.logActivity(adminId, adminName, 'Updated Company Settings', 'settings', undefined, 'Modified contact and branding details');
    }
    return this.data.settings;
  }

  // --- LOCATIONS ---
  public getLocations(): BillboardLocation[] {
    return [...this.data.locations];
  }

  public getLocationById(idOrSlug: string): BillboardLocation | undefined {
    return this.data.locations.find(l => l.id === idOrSlug || l.slug === idOrSlug);
  }

  public createLocation(loc: Omit<BillboardLocation, 'id' | 'created_at' | 'updated_at'>, adminId?: string, adminName?: string): BillboardLocation {
    const id = generateId('loc');
    const slug = loc.slug || loc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newLoc: BillboardLocation = {
      ...loc,
      id,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.locations.unshift(newLoc);
    this.save();

    if (adminId && adminName) {
      this.logActivity(adminId, adminName, 'Added Location', 'location', id, `Added billboard "${newLoc.name}" in ${newLoc.area}, ${newLoc.city}`);
    }
    return newLoc;
  }

  public updateLocation(id: string, updates: Partial<BillboardLocation>, adminId?: string, adminName?: string): BillboardLocation | null {
    const idx = this.data.locations.findIndex(l => l.id === id);
    if (idx === -1) return null;

    const current = this.data.locations[idx];
    const updated: BillboardLocation = {
      ...current,
      ...updates,
      id: current.id,
      updated_at: new Date().toISOString(),
    };
    this.data.locations[idx] = updated;
    this.save();

    if (adminId && adminName) {
      this.logActivity(adminId, adminName, 'Updated Location', 'location', id, `Updated location "${updated.name}"`);
    }
    return updated;
  }

  public deleteLocation(id: string, adminId?: string, adminName?: string): boolean {
    const idx = this.data.locations.findIndex(l => l.id === id);
    if (idx === -1) return false;

    const locToDelete = this.data.locations[idx];

    // Data integrity safeguard: preserve historical location name on any existing CRM leads
    this.data.leads.forEach(lead => {
      if (lead.location_id === id) {
        lead.location_name = `${locToDelete.name} (Archived)`;
        lead.location_id = undefined;
      }
    });

    this.data.locations.splice(idx, 1);
    this.save();

    if (adminId && adminName) {
      this.logActivity(adminId, adminName, 'Deleted Location', 'location', id, `Deleted billboard "${locToDelete.name}"`);
    }
    return true;
  }

  // --- LEADS ---
  public getLeads(): Lead[] {
    return [...this.data.leads];
  }

  public getLeadById(id: string): Lead | undefined {
    return this.data.leads.find(l => l.id === id);
  }

  public createLead(
    leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>,
    adminId?: string,
    adminName?: string
  ): Lead {
    const id = generateId('lead');
    const newLead: Lead = {
      ...leadData,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.leads.unshift(newLead);

    if (newLead.follow_up_date) {
      this.createFollowUp({
        lead_id: id,
        lead_name: newLead.name,
        lead_company: newLead.company,
        lead_phone: newLead.phone,
        title: `Initial follow-up with ${newLead.name}`,
        due_date: newLead.follow_up_date,
        status: 'Pending',
        notes: newLead.notes || 'Scheduled upon lead creation',
      });
    }

    this.save();

    if (adminId && adminName) {
      this.logActivity(adminId, adminName, 'Created Lead', 'lead', id, `Created lead for "${newLead.name}" (${newLead.company})`);
    } else {
      this.logActivity('system', 'System Automation', 'New Website Lead', 'lead', id, `New lead received from "${newLead.name}" via ${newLead.source}`);
    }
    return newLead;
  }

  public updateLead(id: string, updates: Partial<Lead>, adminId?: string, adminName?: string): Lead | null {
    const idx = this.data.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;

    const current = this.data.leads[idx];
    const prevStatus = current.status;
    const updated: Lead = {
      ...current,
      ...updates,
      id: current.id,
      updated_at: new Date().toISOString(),
    };
    this.data.leads[idx] = updated;
    this.save();

    if (adminId && adminName) {
      const msg = prevStatus !== updated.status 
        ? `Changed lead "${updated.name}" status from ${prevStatus} to ${updated.status}`
        : `Updated details for lead "${updated.name}"`;
      this.logActivity(adminId, adminName, 'Updated Lead', 'lead', id, msg);
    }
    return updated;
  }

  public deleteLead(id: string, adminId?: string, adminName?: string): boolean {
    const idx = this.data.leads.findIndex(l => l.id === id);
    if (idx === -1) return false;

    const leadName = this.data.leads[idx].name;
    this.data.leads.splice(idx, 1);

    this.data.lead_notes = this.data.lead_notes.filter(n => n.lead_id !== id);
    this.data.follow_ups = this.data.follow_ups.filter(f => f.lead_id !== id);

    this.save();

    if (adminId && adminName) {
      this.logActivity(adminId, adminName, 'Deleted Lead', 'lead', id, `Deleted lead record for "${leadName}"`);
    }
    return true;
  }

  // --- LEAD NOTES ---
  public getLeadNotes(leadId: string): LeadNote[] {
    return this.data.lead_notes
      .filter(n => n.lead_id === leadId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addLeadNote(leadId: string, noteText: string, authorName: string): LeadNote {
    const note: LeadNote = {
      id: generateId('note'),
      lead_id: leadId,
      note: noteText,
      created_by: authorName,
      created_at: new Date().toISOString(),
    };
    this.data.lead_notes.unshift(note);
    this.save();
    return note;
  }

  // --- FOLLOW UPS ---
  public getFollowUps(): FollowUp[] {
    return [...this.data.follow_ups].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }

  public createFollowUp(item: Omit<FollowUp, 'id' | 'created_at' | 'updated_at'>): FollowUp {
    const fol: FollowUp = {
      ...item,
      id: generateId('fol'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.follow_ups.unshift(fol);
    this.save();
    return fol;
  }

  public updateFollowUp(id: string, updates: Partial<FollowUp>): FollowUp | null {
    const idx = this.data.follow_ups.findIndex(f => f.id === id);
    if (idx === -1) return null;
    const current = this.data.follow_ups[idx];
    const updated: FollowUp = {
      ...current,
      ...updates,
      id: current.id,
      updated_at: new Date().toISOString(),
    };
    this.data.follow_ups[idx] = updated;
    this.save();
    return updated;
  }

  public deleteFollowUp(id: string): boolean {
    const idx = this.data.follow_ups.findIndex(f => f.id === id);
    if (idx === -1) return false;
    this.data.follow_ups.splice(idx, 1);
    this.save();
    return true;
  }

  // --- CUSTOMERS ---
  public getCustomers(): Customer[] {
    return [...this.data.customers];
  }

  public createCustomer(cust: Omit<Customer, 'id' | 'created_at' | 'updated_at'>, adminId?: string, adminName?: string): Customer {
    const id = generateId('cust');
    const newCustomer: Customer = {
      ...cust,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.customers.unshift(newCustomer);
    this.save();

    if (adminId && adminName) {
      this.logActivity(adminId, adminName, 'Created Customer', 'customer', id, `Added customer "${newCustomer.name}" (${newCustomer.company})`);
    }
    return newCustomer;
  }

  public convertLeadToCustomer(leadId: string, adminId?: string, adminName?: string): Customer | null {
    const lead = this.getLeadById(leadId);
    if (!lead) return null;

    const existing = this.data.customers.find(
      c => c.email.toLowerCase() === lead.email.toLowerCase() || c.phone === lead.phone
    );
    if (existing) {
      return existing;
    }

    let numericSpend = 0;
    if (lead.budget) {
      const match = lead.budget.replace(/[^0-9]/g, '');
      if (match) numericSpend = parseInt(match, 10);
    }

    const customer = this.createCustomer(
      {
        name: lead.name,
        company: lead.company,
        phone: lead.phone,
        email: lead.email,
        address: lead.location_name ? `Associated with ${lead.location_name}` : 'Kalaburagi, Karnataka',
        notes: `Converted from won lead #${lead.id}. Campaign: ${lead.campaign_type || 'N/A'}. Budget: ${lead.budget || 'N/A'}`,
        lead_id: lead.id,
        total_spend: numericSpend,
        status: 'Active',
      },
      adminId,
      adminName
    );

    this.updateLead(leadId, { status: 'Won' }, adminId, adminName);
    return customer;
  }

  public updateCustomer(id: string, updates: Partial<Customer>, adminId?: string, adminName?: string): Customer | null {
    const idx = this.data.customers.findIndex(c => c.id === id);
    if (idx === -1) return null;
    const current = this.data.customers[idx];
    const updated: Customer = {
      ...current,
      ...updates,
      id: current.id,
      updated_at: new Date().toISOString(),
    };
    this.data.customers[idx] = updated;
    this.save();

    if (adminId && adminName) {
      this.logActivity(adminId, adminName, 'Updated Customer', 'customer', id, `Updated customer "${updated.name}"`);
    }
    return updated;
  }

  public deleteCustomer(id: string, adminId?: string, adminName?: string): boolean {
    const idx = this.data.customers.findIndex(c => c.id === id);
    if (idx === -1) return false;
    const custName = this.data.customers[idx].name;
    this.data.customers.splice(idx, 1);
    this.save();

    if (adminId && adminName) {
      this.logActivity(adminId, adminName, 'Deleted Customer', 'customer', id, `Deleted customer record for "${custName}"`);
    }
    return true;
  }

  // --- ENQUIRIES ---
  public getEnquiries(): Enquiry[] {
    return [...this.data.enquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at'>): Enquiry {
    const item: Enquiry = {
      ...enquiry,
      id: generateId('enq'),
      created_at: new Date().toISOString(),
    };
    this.data.enquiries.unshift(item);
    this.save();
    return item;
  }

  // --- ACTIVITY LOGS ---
  public getActivityLogs(limit: number = 100): ActivityLog[] {
    return this.data.activity_logs.slice(0, limit);
  }

  // --- STATS ---
  public getDashboardStats() {
    const locations = this.data.locations;
    const leads = this.data.leads;
    const followUps = this.data.follow_ups;

    const available_count = locations.filter(l => l.availability === 'Available').length;
    const booked_count = locations.filter(l => l.availability === 'Booked').length;
    const reserved_count = locations.filter(l => l.availability === 'Reserved').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const follow_ups_due = followUps.filter(f => f.status === 'Pending' && f.due_date <= todayStr).length;

    const leads_by_status: Record<string, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      'Proposal Sent': 0,
      Negotiation: 0,
      Won: 0,
      Lost: 0,
      'Follow-up Required': 0,
    };

    const leads_by_source: Record<string, number> = {};

    leads.forEach(l => {
      leads_by_status[l.status] = (leads_by_status[l.status] || 0) + 1;
      leads_by_source[l.source] = (leads_by_source[l.source] || 0) + 1;
    });

    const new_leads = leads_by_status['New'] || 0;
    const quotes_requested = leads.filter(l => l.source === 'Quote Request').length;

    return {
      locations_count: locations.length,
      available_count,
      booked_count,
      reserved_count,
      total_leads: leads.length,
      new_leads,
      follow_ups_due,
      quotes_requested,
      leads_by_status,
      leads_by_source,
      recent_leads: leads.slice(0, 6),
      recent_activities: this.data.activity_logs.slice(0, 8),
    };
  }
}

export const db = new Database();
