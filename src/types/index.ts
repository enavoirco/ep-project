export type BillboardType = 
  | 'Hoarding'
  | 'Unipole'
  | 'LED Billboard'
  | 'Wallscape'
  | 'Bus Shelter'
  | 'Digital Billboard'
  | 'Gantry'
  | 'Other';

export type AvailabilityStatus = 'Available' | 'Booked' | 'Reserved' | 'Maintenance';

export interface BillboardLocation {
  id: string;
  slug: string;
  name: string;
  city: string;
  area: string;
  address: string;
  maps_url: string;
  latitude?: number;
  longitude?: number;
  type: BillboardType;
  dimensions: string;
  orientation: string;
  traffic_estimate: string;
  visibility: string;
  lighting: 'Front-lit' | 'Back-lit' | 'Digital LED' | 'Non-lit';
  price: number; // Monthly price in INR (₹)
  availability: AvailabilityStatus;
  images: string[];
  description: string;
  landmarks: string[];
  audience_info: string;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost'
  | 'Follow-up Required';

export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type LeadSource = 
  | 'Website'
  | 'Billboard Enquiry'
  | 'Quote Request'
  | 'Location Enquiry'
  | 'Phone'
  | 'WhatsApp'
  | 'Referral'
  | 'Other';

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  whatsapp?: string;
  location_id?: string;
  location_name?: string;
  campaign_type?: string;
  budget?: string;
  start_date?: string;
  end_date?: string;
  message?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  assigned_to?: string;
  follow_up_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  lead_name: string;
  lead_company?: string;
  lead_phone: string;
  title: string;
  due_date: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
  lead_id?: string;
  total_spend: number;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  lead_id: string;
  location_id?: string;
  location_name?: string;
  form_type: 'Contact Form' | 'Quote Request' | 'Location Enquiry';
  payload: Record<string, any>;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  entity_type: 'location' | 'lead' | 'customer' | 'settings' | 'follow_up' | 'auth';
  entity_id?: string;
  description: string;
  created_at: string;
}

export interface CompanySettings {
  company_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  maps_url: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  website_logo?: string;
  primary_cta_text: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager';
}

export interface DashboardStats {
  locations_count: number;
  available_count: number;
  booked_count: number;
  reserved_count: number;
  total_leads: number;
  new_leads: number;
  follow_ups_due: number;
  quotes_requested: number;
  leads_by_status: Record<LeadStatus, number>;
  leads_by_source: Record<string, number>;
  recent_leads: Lead[];
  recent_activities: ActivityLog[];
}
