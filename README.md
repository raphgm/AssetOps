# AssetOps — ICT Maintenance Intelligence Platform

Turn maintenance history into operational intelligence. AssetOps is a multi-tenant SaaS for centralised ICT
equipment maintenance: asset registry, digital maintenance passports, work orders, QR identification,
deterministic risk/debt analytics and an evidence-backed AI layer.

> **All demo data is synthetic.** The seeded organisation ("Meridian Institute (Synthetic Demo)") does not
> represent any real institution.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind · Prisma · PostgreSQL · Recharts · React Flow · Vitest ·
Groq (Llama) behind an `AIProvider` abstraction. No Redis is required.

## Run it

```bash
cp .env.example .env            # set DATABASE_URL, SESSION_SECRET (32+ chars); GROQ_* optional
npm install
npx prisma db push              # create the schema
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

### AI

`GROQ_API_KEY` and `GROQ_MODEL` (default `llama-3.3-70b-versatile`) are read **server-side only**. Without a key the
product still works end-to-end: investigations gather and display their evidence and show
*"AssetOps Intelligence is temporarily unavailable"* with a retry button.

## The demo story (works without touching the database)

1. Dashboard flags **Maintenance anomaly detected** — 84 printer failures in 30 days across 7 departments,
   3 locations, 3 models, one dominant vendor (computed live from records, not hardcoded).
2. **Investigate** → evidence is gathered through permission-checked tools → AI explains it (if configured).
3. **Create fleet inspection…** → confirm → one HIGH work order per affected asset.
4. Assign a technician → technician (`/app/technician`, mobile-first) scans/opens the asset, starts work,
   resolves with parts, cost, downtime and a photo.
5. Manager verifies and closes. The asset passport, dashboard metrics and audit log update.

Automated: `node e2e/demo.mjs` drives this flow in a real browser (needs the app on :3000 and the demo seed);
`tests/e2e-demo.test.ts` covers the same scenario at the service layer.

## Seeded patterns

A printer spike · B network cluster behind `NET-LAG-000381` (18 devices) · C vendor SLA decline (Apex NetServe) ·
D aging laptops · E expiring/expired warranties · F high-cost server `SRV-ABJ-000041` (₦3.1M on ₦8.2M, 18 incidents) ·
G Procurement repeat failures · H duplicate/missing data (see **Data quality**) and `public/sample-assets.csv` for the import demo.

## Architecture

```
src/lib/engines/   RiskEngine, maintenance-debt, repair-vs-replace, lifecycle simulator — pure, deterministic, no AI
src/lib/services/  assets, maintenance (append-only), work orders (state machine), analytics (SQL), import, reports, graph
src/lib/ai/        provider (Groq/abstraction) · tools (14 approved, permission-checked) · engine (intent → evidence →
                   model → schema validation → retry once) · schema (system prompt + response validation)
src/lib/rbac.ts    permission matrix; every API/page re-checks on the server; services take the caller's Session
src/app/           marketing site, auth, /app/** screens, /api/** (thin wrappers over services), /scan/[token]
```

**Trust model.** *System records* (what happened) → *Calculated* metrics (deterministic engines) → *AI analysis*
(explains only retrieved evidence, cites evidence ids, confidence = evidence availability) → *Estimates*
(debt, lifecycle; assumptions always shown). Badges in the UI make the category explicit.

**Security.** bcrypt passwords · signed httpOnly session cookie · server-side RBAC · tenant scoping in every
query · origin check on mutations (CSRF) · in-memory rate limits · zod validation · CSV formula-injection guard ·
upload MIME + magic-byte + extension + size checks with generated filenames and authorised download ·
append-only audit log · secure headers · AI prompt-injection defences (record text is truncated, sanitised, and
framed as untrusted data; no SQL tool; model output schema-validated; actions need human confirmation).

## Tests

```bash
npm test      # 80 tests: engines, RBAC, services, tenant isolation, import, AI tools/validation/degradation, auth, e2e
```

The suite uses a throwaway `assetops_test` database that it drops and recreates itself.

## Known limits / not yet built

- No live-Groq verification in CI (tests use a stub provider). Prompts and validation are exercised; model quality is not.
- Imports, AI calls and alerts run in-request (no job queue/Redis). Fine for the demo scale; move to a queue for very large files.
- Rate limiting is per-process memory; uploads use local disk (`UPLOAD_DIR`) — use shared/object storage when scaled out.
- No OAuth providers (email/password only), no email delivery (reset links are logged server-side in dev), no billing.
- Departments/vendors/locations are created via import or seed; there are no dedicated CRUD screens yet.
- Offline queueing covers technician status changes only (not the resolve form).
- The locations "map" is a dependency-free SVG bubble map, not MapLibre.
