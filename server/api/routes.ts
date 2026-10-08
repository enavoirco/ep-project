import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database/db.ts';
import { requireAuth, generateToken, AuthenticatedRequest } from './middleware.ts';
import { LeadStatus, LeadPriority, BillboardType, AvailabilityStatus } from '../../src/types/index.ts';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = db.getAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(admin.id, admin.email);

    db.logActivity(admin.id, admin.name, 'Admin Login', 'auth', admin.id, `Admin ${admin.name} logged in successfully`);

    return res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.admin });
});

// ==========================================
// 2. COMPANY SETTINGS (Public GET, Protected PUT)
// ==========================================

apiRouter.get('/settings', (_req: Request, res: Response) => {
  return res.json(db.getSettings());
});

apiRouter.put('/settings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updates = req.body;
    const settings = db.updateSettings(updates, req.admin?.id, req.admin?.name);
    return res.json(settings);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update company settings' });
  }
});

// ==========================================
// 3. BILLBOARD LOCATIONS
// ==========================================

// Public GET all locations with search & filters
apiRouter.get('/locations', (req: Request, res: Response) => {
  try {
    let locations = db.getLocations();

    const { search, city, type, availability, min_price, max_price } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      locations = locations.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.landmarks.some(lm => lm.toLowerCase().includes(q))
      );
    }

    if (city && typeof city === 'string' && city !== 'All') {
      locations = locations.filter(l => l.city.toLowerCase() === city.toLowerCase());
    }

    if (type && typeof type === 'string' && type !== 'All') {
      locations = locations.filter(l => l.type === type);
    }

    if (availability && typeof availability === 'string' && availability !== 'All') {
      locations = locations.filter(l => l.availability === availability);
    }

    if (min_price && !isNaN(Number(min_price))) {
      locations = locations.filter(l => l.price >= Number(min_price));
    }

    if (max_price && !isNaN(Number(max_price))) {
      locations = locations.filter(l => l.price <= Number(max_price));
    }

    return res.json(locations);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve billboard locations' });
  }
});

// Public GET location by id or slug
apiRouter.get('/locations/:idOrSlug', (req: Request, res: Response) => {
  try {
    const loc = db.getLocationById(req.params.idOrSlug);
    if (!loc) {
      return res.status(404).json({ error: 'Billboard location not found' });
    }
    return res.json(loc);
  } catch (err: any) {
    return res.status(500).json({ error: 'Error fetching location details' });
  }
});

// Protected POST create new location
apiRouter.post('/locations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      city,
      area,
      address,
      maps_url,
      type,
      dimensions,
      orientation,
      traffic_estimate,
      visibility,
      lighting,
      price,
      availability,
      images,
      description,
      landmarks,
      audience_info,
    } = req.body;

    if (!name || !city || !area || !address || !type || !dimensions || price === undefined) {
      return res.status(400).json({ error: 'Missing required billboard fields (name, city, area, address, type, dimensions, price)' });
    }

    const newLoc = db.createLocation(
      {
        slug: req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        name,
        city,
        area,
        address,
        maps_url: maps_url || `https://maps.google.com/?q=${encodeURIComponent(area + ' ' + city)}`,
        latitude: req.body.latitude ? Number(req.body.latitude) : undefined,
        longitude: req.body.longitude ? Number(req.body.longitude) : undefined,
        type: type as BillboardType,
        dimensions,
        orientation: orientation || 'Main road facing',
        traffic_estimate: traffic_estimate || '150,000+ daily impressions',
        visibility: visibility || 'Clear view from 300 meters',
        lighting: lighting || 'Front-lit',
        price: Number(price),
        availability: (availability as AvailabilityStatus) || 'Available',
        images: Array.isArray(images) && images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        ],
        description: description || '',
        landmarks: Array.isArray(landmarks) ? landmarks : typeof landmarks === 'string' ? landmarks.split(',').map((s: string) => s.trim()) : [],
        audience_info: audience_info || 'High traffic commuters and commercial shoppers',
      },
      req.admin?.id,
      req.admin?.name
    );

    return res.status(201).json(newLoc);
  } catch (err: any) {
    console.error('Error creating location:', err);
    return res.status(500).json({ error: 'Failed to create billboard location' });
  }
});

// Protected PUT update location
apiRouter.put('/locations/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const updated = db.updateLocation(id, updates, req.admin?.id, req.admin?.name);

    if (!updated) {
      return res.status(404).json({ error: 'Billboard location not found' });
    }

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update billboard location' });
  }
});

// Protected DELETE location with confirmation & relationship safeguard
apiRouter.delete('/locations/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const success = db.deleteLocation(id, req.admin?.id, req.admin?.name);

    if (!success) {
      return res.status(404).json({ error: 'Billboard location not found' });
    }

    return res.json({ success: true, message: 'Billboard location deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete billboard location' });
  }
});

// ==========================================
// 4. CRM & LEADS
// ==========================================

// Public POST create enquiry / lead (Website Contact, Billboard Enquiry, Quote Request)
apiRouter.post('/leads', (req: Request, res: Response) => {
  try {
    const {
      name,
      company,
      phone,
      email,
      whatsapp,
      location_id,
      campaign_type,
      budget,
      start_date,
      end_date,
      message,
      source,
    } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Name, phone number, and email are required' });
    }

    // Resolve location name if location_id is provided
    let location_name: string | undefined = undefined;
    if (location_id) {
      const loc = db.getLocationById(location_id);
      if (loc) {
        location_name = loc.name;
      }
    } else if (req.body.location_name) {
      location_name = req.body.location_name;
    }

    const lead = db.createLead({
      name: name.trim(),
      company: (company || 'Individual / Business').trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: (whatsapp || phone).trim(),
      location_id,
      location_name,
      campaign_type,
      budget,
      start_date,
      end_date,
      message,
      source: source || 'Website',
      status: 'New',
      priority: 'Medium',
      follow_up_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Next day auto follow-up
      notes: message ? `Initial enquiry message: ${message}` : undefined,
    });

    // Record Enquiry log
    db.createEnquiry({
      lead_id: lead.id,
      location_id,
      location_name,
      form_type: source === 'Quote Request' ? 'Quote Request' : location_id ? 'Location Enquiry' : 'Contact Form',
      payload: req.body,
    });

    return res.status(201).json({
      success: true,
      lead_id: lead.id,
      message: 'Thank you! Your enquiry has been received. Our media specialist will contact you shortly.',
    });
  } catch (err: any) {
    console.error('Error creating public lead:', err);
    return res.status(500).json({ error: 'Failed to submit enquiry. Please try again or reach out on WhatsApp.' });
  }
});

// Protected GET all CRM leads with filtering & sorting
apiRouter.get('/admin/leads', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    let leads = db.getLeads();
    const { status, priority, source, search, sort } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      leads = leads.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.location_name && l.location_name.toLowerCase().includes(q))
      );
    }

    if (status && typeof status === 'string' && status !== 'All') {
      leads = leads.filter(l => l.status === status);
    }

    if (priority && typeof priority === 'string' && priority !== 'All') {
      leads = leads.filter(l => l.priority === priority);
    }

    if (source && typeof source === 'string' && source !== 'All') {
      leads = leads.filter(l => l.source === source);
    }

    if (sort === 'oldest') {
      leads.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return res.json(leads);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve CRM leads' });
  }
});

// Protected GET single lead details with notes
apiRouter.get('/admin/leads/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const lead = db.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const notes = db.getLeadNotes(lead.id);
    const followUps = db.getFollowUps().filter(f => f.lead_id === lead.id);

    return res.json({
      ...lead,
      notes_list: notes,
      follow_ups_list: followUps,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch lead details' });
  }
});

// Protected POST create lead manually by admin
apiRouter.post('/admin/leads', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      company,
      phone,
      email,
      whatsapp,
      location_id,
      campaign_type,
      budget,
      start_date,
      end_date,
      message,
      source,
      status,
      priority,
      assigned_to,
      follow_up_date,
      notes,
    } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Customer name, phone, and email are required' });
    }

    let location_name: string | undefined = undefined;
    if (location_id) {
      const loc = db.getLocationById(location_id);
      if (loc) location_name = loc.name;
    }

    const lead = db.createLead(
      {
        name,
        company: company || 'Individual',
        phone,
        email,
        whatsapp: whatsapp || phone,
        location_id,
        location_name,
        campaign_type,
        budget,
        start_date,
        end_date,
        message,
        source: source || 'Phone',
        status: (status as LeadStatus) || 'New',
        priority: (priority as LeadPriority) || 'Medium',
        assigned_to: assigned_to || req.admin?.name,
        follow_up_date,
        notes,
      },
      req.admin?.id,
      req.admin?.name
    );

    return res.status(201).json(lead);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create manual lead' });
  }
});

// Protected PUT update lead
apiRouter.put('/admin/leads/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateLead(req.params.id, req.body, req.admin?.id, req.admin?.name);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Protected POST add note to lead
apiRouter.post('/admin/leads/:id/notes', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ error: 'Note text cannot be empty' });
    }

    const lead = db.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const newNote = db.addLeadNote(lead.id, note.trim(), req.admin?.name || 'Admin');
    return res.status(201).json(newNote);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save note' });
  }
});

// Protected POST convert lead to customer
apiRouter.post('/admin/leads/:id/convert-customer', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const customer = db.convertLeadToCustomer(req.params.id, req.admin?.id, req.admin?.name);
    if (!customer) {
      return res.status(404).json({ error: 'Lead not found or could not be converted' });
    }
    return res.json({ success: true, customer });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to convert lead to customer' });
  }
});

// Protected DELETE lead
apiRouter.delete('/admin/leads/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteLead(req.params.id, req.admin?.id, req.admin?.name);
    if (!success) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    return res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// ==========================================
// 5. FOLLOW-UPS
// ==========================================

apiRouter.get('/admin/follow-ups', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getFollowUps());
});

apiRouter.post('/admin/follow-ups', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { lead_id, title, due_date, status, notes } = req.body;
    const lead = db.getLeadById(lead_id);
    if (!lead) {
      return res.status(400).json({ error: 'Valid lead ID is required' });
    }

    const item = db.createFollowUp({
      lead_id,
      lead_name: lead.name,
      lead_company: lead.company,
      lead_phone: lead.phone,
      title: title || `Follow-up with ${lead.name}`,
      due_date: due_date || new Date().toISOString().split('T')[0],
      status: status || 'Pending',
      notes,
    });

    return res.status(201).json(item);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create follow-up' });
  }
});

apiRouter.put('/admin/follow-ups/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateFollowUp(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Follow-up not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update follow-up' });
  }
});

apiRouter.delete('/admin/follow-ups/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteFollowUp(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Follow-up not found' });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete follow-up' });
  }
});

// ==========================================
// 6. CUSTOMERS
// ==========================================

apiRouter.get('/admin/customers', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getCustomers());
});

apiRouter.post('/admin/customers', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, company, phone, email, address, notes, total_spend, status } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Customer name, phone, and email are required' });
    }

    const customer = db.createCustomer(
      {
        name,
        company: company || 'Individual',
        phone,
        email,
        address,
        notes,
        total_spend: Number(total_spend) || 0,
        status: status || 'Active',
      },
      req.admin?.id,
      req.admin?.name
    );

    return res.status(201).json(customer);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create customer' });
  }
});

apiRouter.put('/admin/customers/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateCustomer(req.params.id, req.body, req.admin?.id, req.admin?.name);
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update customer' });
  }
});

apiRouter.delete('/admin/customers/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const success = db.deleteCustomer(req.params.id, req.admin?.id, req.admin?.name);
    if (!success) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// ==========================================
// 7. ENQUIRIES, ACTIVITY & STATS
// ==========================================

apiRouter.get('/admin/enquiries', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getEnquiries());
});

apiRouter.get('/admin/activity', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getActivityLogs(100));
});

apiRouter.get('/admin/stats', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getDashboardStats());
});
