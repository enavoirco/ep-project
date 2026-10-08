-- Bhagyalaxmi Billboards - PostgreSQL / Supabase Schema Definition
-- Production Migration Script

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Billboard Locations Table
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    maps_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    type VARCHAR(50) NOT NULL, -- Hoarding, Unipole, LED Billboard, Wallscape, etc.
    dimensions VARCHAR(100) NOT NULL,
    orientation VARCHAR(255),
    traffic_estimate VARCHAR(255),
    visibility VARCHAR(255),
    lighting VARCHAR(50) DEFAULT 'Front-lit',
    price NUMERIC(12, 2) NOT NULL,
    availability VARCHAR(50) DEFAULT 'Available', -- Available, Booked, Reserved, Maintenance
    images TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    landmarks TEXT[] NOT NULL DEFAULT '{}',
    audience_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRM Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE SET NULL,
    location_name VARCHAR(255),
    campaign_type VARCHAR(100),
    budget VARCHAR(100),
    start_date DATE,
    end_date DATE,
    message TEXT,
    source VARCHAR(50) DEFAULT 'Website',
    status VARCHAR(50) DEFAULT 'New', -- New, Contacted, Qualified, Proposal Sent, Negotiation, Won, Lost, Follow-up Required
    priority VARCHAR(50) DEFAULT 'Medium', -- Low, Medium, High, Urgent
    assigned_to VARCHAR(255),
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Lead Internal Notes Table
CREATE TABLE IF NOT EXISTS lead_notes (
    id VARCHAR(64) PRIMARY KEY,
    lead_id VARCHAR(64) NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Follow-up Tasks Table
CREATE TABLE IF NOT EXISTS follow_ups (
    id VARCHAR(64) PRIMARY KEY,
    lead_id VARCHAR(64) NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    lead_name VARCHAR(255) NOT NULL,
    lead_company VARCHAR(255),
    lead_phone VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Completed, Cancelled
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    notes TEXT,
    lead_id VARCHAR(64) REFERENCES leads(id) ON DELETE SET NULL,
    total_spend NUMERIC(12, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enquiries Audit Table
CREATE TABLE IF NOT EXISTS enquiries (
    id VARCHAR(64) PRIMARY KEY,
    lead_id VARCHAR(64) REFERENCES leads(id) ON DELETE SET NULL,
    location_id VARCHAR(64),
    location_name VARCHAR(255),
    form_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Audit Activity Log Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(64) PRIMARY KEY,
    admin_id VARCHAR(64) NOT NULL,
    admin_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(64),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Company Configuration Settings Table
CREATE TABLE IF NOT EXISTS company_settings (
    id INT PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    maps_url TEXT,
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    linkedin VARCHAR(255),
    website_logo TEXT,
    primary_cta_text VARCHAR(100) DEFAULT 'Get a Quote',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_availability ON locations(availability);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due_date ON follow_ups(due_date);
