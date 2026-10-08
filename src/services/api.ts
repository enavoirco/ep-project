import {
  BillboardLocation,
  Lead,
  LeadNote,
  FollowUp,
  Customer,
  Enquiry,
  ActivityLog,
  CompanySettings,
  DashboardStats,
  AdminUser,
} from '../types/index.ts';

const TOKEN_KEY = 'bhagyalaxmi_admin_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Request failed`);
  }

  return data as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request<{ user: AdminUser }>('/auth/me'),

  // Settings
  getSettings: () => request<CompanySettings>('/settings'),
  updateSettings: (settings: Partial<CompanySettings>) =>
    request<CompanySettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // Locations (Public & Admin)
  getLocations: (params?: {
    search?: string;
    city?: string;
    type?: string;
    availability?: string;
    min_price?: number;
    max_price?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.city) query.set('city', params.city);
    if (params?.type) query.set('type', params.type);
    if (params?.availability) query.set('availability', params.availability);
    if (params?.min_price) query.set('min_price', params.min_price.toString());
    if (params?.max_price) query.set('max_price', params.max_price.toString());
    const qs = query.toString();
    return request<BillboardLocation[]>(`/locations${qs ? `?${qs}` : ''}`);
  },
  getLocation: (idOrSlug: string) => request<BillboardLocation>(`/locations/${idOrSlug}`),
  createLocation: (locationData: Partial<BillboardLocation>) =>
    request<BillboardLocation>('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    }),
  updateLocation: (id: string, updates: Partial<BillboardLocation>) =>
    request<BillboardLocation>(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteLocation: (id: string) =>
    request<{ success: boolean; message: string }>(`/locations/${id}`, {
      method: 'DELETE',
    }),

  // Leads & CRM
  createEnquiry: (payload: {
    name: string;
    company?: string;
    phone: string;
    email?: string;
    whatsapp?: string;
    location_id?: string;
    location_name?: string;
    campaign_type?: string;
    budget?: number | string;
    start_date?: string;
    end_date?: string;
    message?: string;
  }) =>
    request<{ success: boolean; lead_id: string; message: string }>('/leads', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        budget: payload.budget ? String(payload.budget) : undefined,
        source: 'Billboard Enquiry',
      }),
    }),
  submitPublicLead: (payload: {
    name: string;
    company?: string;
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
    source?: string;
  }) =>
    request<{ success: boolean; lead_id: string; message: string }>('/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getAdminLeads: (params?: {
    search?: string;
    status?: string;
    priority?: string;
    source?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.priority) query.set('priority', params.priority);
    if (params?.source) query.set('source', params.source);
    if (params?.sort) query.set('sort', params.sort);
    const qs = query.toString();
    return request<Lead[]>(`/admin/leads${qs ? `?${qs}` : ''}`);
  },
  getLeadDetails: (id: string) =>
    request<Lead & { notes_list: LeadNote[]; follow_ups_list: FollowUp[] }>(`/admin/leads/${id}`),
  createAdminLead: (leadData: Partial<Lead>) =>
    request<Lead>('/admin/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    }),
  updateLead: (id: string, updates: Partial<Lead>) =>
    request<Lead>(`/admin/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  addLeadNote: (leadId: string, note: string) =>
    request<LeadNote>(`/admin/leads/${leadId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),
  convertLeadToCustomer: (leadId: string) =>
    request<{ success: boolean; customer: Customer }>(`/admin/leads/${leadId}/convert-customer`, {
      method: 'POST',
    }),
  deleteLead: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/leads/${id}`, {
      method: 'DELETE',
    }),

  // Follow-ups
  getFollowUps: () => request<FollowUp[]>('/admin/follow-ups'),
  createFollowUp: (data: Partial<FollowUp>) =>
    request<FollowUp>('/admin/follow-ups', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFollowUp: (id: string, updates: Partial<FollowUp>) =>
    request<FollowUp>(`/admin/follow-ups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteFollowUp: (id: string) =>
    request<{ success: boolean }>(`/admin/follow-ups/${id}`, {
      method: 'DELETE',
    }),

  // Customers
  getCustomers: () => request<Customer[]>('/admin/customers'),
  createCustomer: (data: Partial<Customer>) =>
    request<Customer>('/admin/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCustomer: (id: string, updates: Partial<Customer>) =>
    request<Customer>(`/admin/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteCustomer: (id: string) =>
    request<{ success: boolean }>(`/admin/customers/${id}`, {
      method: 'DELETE',
    }),

  // Enquiries & Activity & Stats
  getEnquiries: () => request<Enquiry[]>('/admin/enquiries'),
  getActivityLogs: () => request<ActivityLog[]>('/admin/activity'),
  getDashboardStats: () => request<DashboardStats>('/admin/stats'),
};
