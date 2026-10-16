# Bhagyalaxmi Billboards - Outdoor Advertising in Kalaburagi, Karnataka

A complete, production-ready, full-stack website and executive CRM portal built for **Bhagyalaxmi Billboards** — an established outdoor advertising (OOH) media company based in **Kalaburagi, Karnataka, India**.

---

## 🌟 Key Features

### 1. Professional Kalaburagi Public Website
- **Hero Section**: High-impact editorial headline ("PUT YOUR BRAND WHERE KALABURAGI CAN SEE IT"), cinematic outdoor photography, subtle zoom transitions, and clear CTAs ("Explore Locations", "Get a Quote").
- **Dynamic Inventory Catalog (`/locations`)**: Real-time database-driven billboard locations searchable by area and filterable by Kalaburagi area, billboard format, and availability.
  - Sedam Road (High Court Corridor)
  - Station Road (Central Railway Terminal)
  - Super Market Area (Prime Retail Circle)
  - Jewargi Road (KSRTC Central Bus Terminus)
  - Aland Road (Northern Interstate Gateway)
  - Shah Bazar (Heritage Market Wallscape)
  - Humnabad Road & Ring Road (Digital LED)
  - MSK Mill Road & Old Jewargi Road
- **Editorial Location Details (`/locations/:slug`)**: Left gallery layout, right spec sheet (format, dimensions, illumination, status), and detailed sections covering visibility, traffic characteristics, nearby landmarks, and an embedded direct booking inquiry form.
- **Campaign Quote Engine (`/quote`)**: Multi-parameter campaign planner with location dropdown, duration options, budget bands, and instant CRM ingestion.
- **Human & Local About Us (`/about`)**: "Your brand deserves more than a screen. At Bhagyalaxmi Billboards, we help businesses get noticed through strategic outdoor advertising locations across Kalaburagi."
- **Why Us & How It Works**: 3-step visual execution timeline (01 Choose a Location, 02 Plan Your Campaign, 03 Get Your Brand Seen).
- **Strong Local CTA**: "READY TO GET NOTICED IN KALABURAGI?"
- **Contact & WhatsApp Media Desk (`/contact`)**: Direct office contact, phone, email, and WhatsApp connectivity in Kalaburagi.

### 2. Full-Stack Executive Admin CRM Portal
- **Secure Authentication (`/admin/login`)**: Bcrypt hashed passwords with signed JWT bearer session verification.
  - Configure a unique admin email and strong password using `ADMIN_EMAIL` and `ADMIN_PASSWORD` before first startup.
  - Set a unique `JWT_SECRET` of at least 32 characters; the server refuses to start without it.
- **Operations Dashboard (`/admin`)**: Metric cards, pipeline progression, lead sources analytics, follow-up alerts, and live audit feed.
- **Billboard Inventory Management (`/admin/locations`)**: Full CRUD for Kalaburagi sites with accidental deletion safeguards.
- **CRM & Lead Management (`/admin/leads`)**: Visual Kanban pipeline (7 stages) + table view, one-click Call/WhatsApp/Email, and customer conversion.
- **Scheduled Follow-up System (`/admin/follow-ups`)**: Tabbed tracking for Overdue, Due Today, and Upcoming follow-ups.
- **Customer Directory (`/admin/customers`)**: Lifetime client account records tracking total campaign spend.
- **Inbound Enquiries Audit (`/admin/enquiries`)**: Raw audit stream of all website contact, quote calculator, and location inquiry submissions.
- **System Activity Log (`/admin/activity`)**: Immutable audit trail of administrative actions.
- **Portal Settings (`/admin/settings`)**: Live configuration for company phone, WhatsApp number, email, and Kalaburagi office address.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion) v12, Lucide React icons
- **Backend**: Express.js API server in `server.ts`
- **Database Engine**: Persistent database engine with atomic file writes (`data/database.json`), full relational constraints, and Kalaburagi seed inventory
- **PostgreSQL / Supabase Ready**: Schema migration file in `supabase/migrations/01_init.sql` and seed script in `supabase/seed.sql`

---

## 🚀 Local Development & Execution

```bash
# Create a local environment file and set ADMIN_PASSWORD and JWT_SECRET in it.
copy .env.example .env

# Install dependencies
npm install --legacy-peer-deps

# Terminal 1: Run the backend API on http://localhost:3000
npm run dev:backend

# Terminal 2: Run the frontend on http://localhost:5173
npm run dev:frontend

# Build the frontend for production
npm run build

# Start the production server (serves the built frontend and API)
npm start
```

The initial admin account is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` when the local database is first initialized. Use a unique password of at least 12 characters and a unique `JWT_SECRET` of at least 32 characters in `.env`; do not commit `.env` or `data/database.json`. The Vite development server proxies `/api` requests to the backend on port 3000.

## Deploying to Vercel and Render

Vercel serves the Vite frontend but does not start the Express API. Deploy the backend as a separate Render Web Service:

1. Create a Render Web Service from this repository. Set its root directory to the directory containing this app's `package.json` (leave it blank if `package.json` is at the repository root).
2. Set the build command to `npm install` and the start command to `npm start`.
3. Add a persistent disk mounted at `/var/data`, then set `DATA_DIR` to `/var/data`.
4. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters), and `JWT_SECRET` (at least 32 characters) in the Render environment settings. Generate unique production secrets; do not reuse development credentials.
5. Once Render has deployed, verify `https://<your-render-service>.onrender.com/api/health` returns `{"status":"ok",...}`.
6. In the Vercel project's environment variables, set `VITE_API_URL` to the Render service origin (for example, `https://your-api.onrender.com`, without `/api`). Redeploy the Vercel frontend so the build includes that value.

Keep the persistent disk attached to the backend service: the local JSON database is stored there and contains admin credentials, enquiries, and CRM data. The initial admin account is created only when the database file is first initialized.
