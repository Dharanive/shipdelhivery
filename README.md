# ShipDelhivery — Modern Logistics & Parcel Tracking Platform

ShipDelhivery is a full-stack, responsive logistics and parcel-tracking application built with Next.js App Router, React Three Fiber (Three.js), Tailwind CSS, Motion for React, and Supabase PostgreSQL.

---

## 🚀 Key Features

- **Stylized Isometric 3D Warehouse Hero**: Procedural Three.js scene featuring animated conveyor belts, cardboard parcels following dynamic paths, sorting stations with scanning pulse effects, warehouse racks with pallets, and delivery trucks.
- **Robust Tracking System**: Real-time status lookups with sanitized public tracking event history, timeline visualizations, and input validation.
- **Warehouse Operations (Staff)**: Dedicated portal for warehouse personnel with incoming queues, shipment inspection, and barcode/manual scanning workflows.
- **Admin Command Center**: Executive metrics overview, hub management, role assignments, and audit logging.
- **Resilient Fallback**: Graceful degradation to an accessible CSS-only isometric fallback when WebGL is unavailable, with full support for `prefers-reduced-motion`.
- **Zero Paid Dependencies**: Built entirely using procedural geometry, free-tier Supabase, and standard open-source libraries.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 4 + Custom Design Tokens (Midnight navy `#0B1220`, Electric blue `#38BDF8`, Cargo orange `#FB923C`)
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations**: Motion for React (`motion/react`)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & `@supabase/ssr`
- **Validation**: Zod
- **Icons**: Lucide React
- **Testing**: Vitest (Unit) & Playwright (E2E)
- **Package Manager**: pnpm

---

## 📦 Getting Started

### 1. Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### 2. Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### 3. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Starts the Next.js development server |
| `pnpm build` | Compiles and builds the production application |
| `pnpm start` | Starts the production server |
| `pnpm type-check` | Runs TypeScript compiler in `--noEmit` mode |
| `pnpm test` | Runs unit tests using Vitest |
| `pnpm test:watch`| Runs Vitest in interactive watch mode |
| `pnpm test:e2e` | Runs end-to-end tests using Playwright |
| `pnpm lint` | Runs ESLint across the codebase |

---

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages & API routes
│   │   ├── api/tracking/    # Public tracking API with rate limiting
│   │   ├── services/        # Services catalog page
│   │   ├── track/           # Customer parcel tracking & result view
│   │   ├── warehouse/       # Warehouse staff portal & scanning
│   │   ├── admin/           # Administrative command center
│   │   └── auth/login/      # Staff authentication
│   ├── components/
│   │   ├── layout/          # Navigation, Footer, layouts
│   │   ├── tracking/        # TrackingForm, TrackingResult, Timeline
│   │   ├── sections/        # Homepage hero, stats, services, features
│   │   └── dashboard/       # DashboardShell, metric cards
│   ├── features/
│   │   └── shipments/       # Status definitions, transition rules, logic
│   ├── three/               # 3D procedural warehouse components (R3F)
│   └── types/               # Domain TypeScript interfaces & types
├── supabase/
│   ├── migrations/          # PostgreSQL migrations with RLS policies
│   └── seed.sql             # Labeled demo seed dataset
├── tests/
│   ├── unit/                # Vitest unit test suites
│   └── e2e/                 # Playwright integration specs
├── .env.example             # Environment variable template
└── vitest.config.ts         # Vitest configuration
```

---

## 🔒 Security Architecture

- **Row Level Security (RLS)**: Enforced across all Supabase tables (`warehouses`, `profiles`, `shipments`, `tracking_events`, `audit_logs`).
- **Data Minimization**: Public tracking endpoints only return sanitized projections (cities, timestamps, status milestones), preventing PII leakage.
- **Strict Role-Based Authorization**: Roles (`admin`, `warehouse_staff`) validated server-side.
- **In-Memory Rate Limiting**: Protects public tracking lookup endpoints against scraping and abuse.
