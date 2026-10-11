# AssetOps — ICT Hardware FinOps & Maintenance Intelligence Platform

Turn physical IT equipment and maintenance history into capital intelligence and operational governance. AssetOps is a multi-tenant SaaS for centralised ICT equipment lifecycle management: asset registry, digital maintenance passports, work orders, QR identification, **Hardware FinOps (depreciation & CapEx forecasting)**, **preventative maintenance scheduling**, **certified data-wipe decommissioning**, and an evidence-backed AI layer.

---

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind · Prisma · PostgreSQL · Leaflet (Carto Dark & OpenStreetMap) · Recharts · React Flow · Vitest · Groq (Llama 3.3 70B) behind an `AIProvider` abstraction. No Redis is required.

---

## Run It

```bash
cp .env.example .env            # set DATABASE_URL, SESSION_SECRET (32+ chars); GROQ_* optional
npm install
npx prisma db push              # create/sync the schema
npm run db:seed                 # ~5,100 assets · ~21k maintenance events · ~8.6k work orders (≈12 s)
npm run build && npm start      # or: npm run dev
```

Sign in at `/sign-in` — all demo accounts use password `demo1234!`:

| Email | Role |
|---|---|
| `demo@assetops.local` | Super Admin |
| `director@assetops.local` | ICT Director |
| `manager@assetops.local` | ICT Manager |
| `technician@assetops.local` | Technician (A. Ibrahim) |
| `finance@assetops.local` | Department user (Finance) |
| `auditor@assetops.local` | Auditor |

Set `SHOW_DEMO_HINT=0` in production to hide the demo-credentials card on the sign-in page.

---

## Core Capabilities

### 1. 💰 Hardware FinOps & Capital Planning (`/app/finops`)
- **Balance Sheet Depreciation:** Real-time straight-line depreciation engine tracking Total Capital Deployed, Net Book Value (NBV), Accumulated Depreciation, and Monthly P&L run-rate write-downs.
- **CapEx Budget Replacement Forecaster:** Deterministically maps hardware End-of-Life (EOL) dates over the next 8 quarters (2 years) so finance teams can forecast replacement budgets accurately.
- **TCO Repair-vs-Replace Scorecard:** Flags assets where cumulative repair spend exceeds 50% (*Watch List*) or 70% (*Economically Irrational*) of brand-new replacement cost.
- **FinOps CSV Export:** Download audit-ready balance sheet reports (`/api/finops?format=csv`).

### 2. 📍 Real Estate Map & Interactive Pin-Drop (`/app/locations`)
- **Free, Interactive GIS:** Powered by Leaflet with zero API key dependencies. Supports **Dark Mode (CARTO Dark Matter)**, **OpenStreetMap**, and **Satellite** tile layers.
- **Risk-Aware Proportional Markers:** Circles sized by asset volume and color-coded by operational risk (Teal for healthy, Red for at-risk).
- **Interactive Pin-Drop Tool (`/app/locations/new`):** Click or drag on the map to automatically populate exact GPS coordinates for new facility branches, or jump via quick-city presets.

### 3. 🛡️ Preventative Maintenance (PM) Scheduler (`/app/preventative`)
- **Recurring Routine Engine:** Set up recurring servicing schedules (monthly, quarterly, semi-annual, annual) scoped to hardware types or physical sites (e.g. UPS battery tests, server dust cleaning, inverter load tests).
- **Countdown Indicators:** Live visual countdown tracking (*Scheduled*, *Due in X days*, *Overdue*).
- **One-Click Work Order Dispatch:** Instantly generate preventative work orders with pre-configured SLAs.

### 4. 📜 Certified Decommissioning & Data-Wipe (`/app/decommission`)
- **NIST 800-88 & DoD 5220.22-M Compliance:** Issue verified data sanitization certificates (Clear, Purge, Cryptographic Erase, Physical Shredding) for regulatory compliance (NDPR, PCI-DSS, ISO 27001).
- **Audit-Verifiable Disposal Certificates:** Tracks certificate numbers (`CERT-DC-2026-XXXXXX`), certifying officer, recycling vendor, and salvage cash recovery.
- **Statutory Board of Survey Pack:** Automatically transitions hardware to `RETIRED` with an immutable audit trail.

### 5. 🏢 Full Management (CRUD) for Real Operations
- **Locations (`/app/locations`):** Add, edit, and delete real physical sites, office branches, and campus facilities.
- **Departments (`/app/departments`):** Manage organizational teams and cost centers.
- **Vendors (`/app/vendors`):** Manage third-party hardware suppliers, maintenance contractors, contract SLAs, and contact emails.
- **Safety Guards:** Deletion protection prevents deleting locations or departments while active assets are assigned.

### 6. 🤖 Evidence-Backed AI Layer (Groq Llama 3.3 70B)
- **Anomaly Detection:** Flags sudden failure spikes across departments, locations, and hardware models.
- **Evidence-First Copilot:** AI explains root causes using permission-checked database tools, cites evidence records, and allows one-click creation of fleet inspection work orders.
- **Graceful Degradation:** The entire system functions end-to-end even without an AI API key.

---

## Architecture

```
src/lib/engines/   finops (depreciation & CapEx), debt, repair-vs-replace, RiskEngine — pure, deterministic
src/lib/services/  assets, maintenance (append-only), work orders (state machine), analytics (SQL), import, reports, graph
src/lib/ai/        provider (Groq/abstraction) · tools (14 approved, permission-checked) · engine & schema validation
src/lib/rbac.ts    permission matrix; every API/page re-checks on the server; services take the caller's Session
src/components/    LocationMap, MapPinPicker, EntityForms, PreventativeClient, DecommissionClient, Shell, ui
src/app/           marketing site, auth, /app/** screens, /api/** (thin wrappers over services), /scan/[token]
```

**Trust model.** *System records* (what happened) → *Calculated* metrics (deterministic engines) → *AI analysis* (explains only retrieved evidence, cites evidence ids, confidence = evidence availability) → *Estimates* (debt, lifecycle; assumptions always shown). Badges in the UI make the category explicit.

**Security.** bcrypt passwords · signed httpOnly session cookie · server-side RBAC · tenant scoping in every query · origin check on mutations (CSRF) · in-memory rate limits · zod validation · CSV formula-injection guard · append-only audit log · secure headers.

---

## Tests

```bash
npm test      # 80 tests: engines, RBAC, services, tenant isolation, import, AI tools/validation, auth, e2e
```

The suite uses a throwaway `assetops_test` database that it drops and recreates itself.

---

## Known Limits / Production Scaling

- Imports, AI calls and alerts run in-request (no job queue/Redis). Move to BullMQ/Redis when processing >10,000 row imports.
- Rate limiting is per-process memory; uploads use local disk (`UPLOAD_DIR`) — configure S3 / Google Cloud Storage when scaled across multiple containers.
- Reset links are logged server-side in dev (plug in SendGrid/Resend for production email delivery).
