import Link from "next/link";
import {
  ArrowRight,
  Check,
  Lock,
  ScrollText,
  ShieldCheck,
  Database,
  KeyRound,
  Network,
  Download,
  Timer,
  QrCode,
  Sparkles,
  TrendingUp,
  MapPin,
  Coins,
  CalendarClock,
  Shield,
  FileBadge,
  Building,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  BarChart3,
  Server,
  Layers,
  Activity,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import LiveFeed from "@/components/landing/LiveFeed";
import RoiCalculator from "@/components/landing/RoiCalculator";
import FeatureTabs from "@/components/landing/FeatureTabs";
import IndustrySolutions from "@/components/landing/IndustrySolutions";
import FaqAccordion from "@/components/landing/FaqAccordion";
import { Logo } from "@/components/ui";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="eyebrow mb-3 flex items-center gap-2">{children}</div>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.12] max-w-2xl text-fg">
    {children}
  </h2>
);

const Sec = ({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    id={id}
    className={`max-w-6xl mx-auto px-4 py-20 sm:py-28 scroll-mt-16 ${className}`}
  >
    {children}
  </section>
);

const Sample = () => (
  <span className="text-[10px] uppercase tracking-widest text-dim font-mono">
    Enterprise Telemetry
  </span>
);

export default function Landing() {
  return (
    <div className="bg-bg text-fg min-h-screen selection:bg-accent/25">
      <Navbar />

      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden pt-24 sm:pt-32 pb-16 border-b border-line">
        {/* Ambient background glows and micro-grid */}
        <div
          className="absolute inset-0 opacity-[0.25] [background-image:linear-gradient(#22262d_1px,transparent_1px),linear-gradient(90deg,#22262d_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
          aria-hidden
        />
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-accent/10 rounded-full blur-[140px] pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-info/10 rounded-full blur-[120px] pointer-events-none"
          aria-hidden
        />

        <Sec className="relative py-0 sm:py-8 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-medium mb-6 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Gen Hardware FinOps & GIS Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight leading-[1.08] text-fg">
              The operating system for enterprise hardware & FinOps.
            </h1>

            <p className="text-mute text-base sm:text-lg mt-5 max-w-xl leading-relaxed">
              Stop bleeding millions on unverified repairs and phantom assets. AssetOps delivers real-time GIS estate mapping, deterministic depreciation forecasting, automated preventative maintenance, and NIST 800-88 data sanitization.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link href="/sign-in" className="btn btn-accent btn-lg font-medium shadow-lg shadow-accent/20">
                Launch Live Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/sign-up" className="btn btn-lg font-medium">
                Start Free Workspace
              </Link>
              <a href="#calculator" className="btn btn-ghost text-xs text-mute hover:text-accent">
                Calculate ROI ↓
              </a>
            </div>

            <div className="flex items-center gap-4 mt-6 text-xs text-dim">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" /> Pre-seeded demo dataset
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" /> Free Leaflet GIS
              </span>
            </div>
          </div>

          {/* Interactive Live Preview Card */}
          <div className="card p-5 sm:p-6 shadow-2xl shadow-black/80 border-line2 bg-surface/90 backdrop-blur relative" aria-label="Dashboard preview">
            <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-ok animate-dot" />
                <span className="text-xs font-mono font-medium text-fg uppercase tracking-wider">
                  AssetOps Telemetry Hub
                </span>
              </div>
              <span className="text-[10px] text-accent font-mono bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                5,100+ Live Nodes
              </span>
            </div>

            {/* Real KPI Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { v: "12,482", l: "Monitored Assets", c: "text-fg" },
                { v: "96.4%", l: "Operational", c: "text-ok" },
                { v: "₦428.4M", l: "Net Book Value", c: "text-accent" },
                { v: "₦41.2M", l: "8-Qtr CapEx Need", c: "text-warn" },
              ].map((item) => (
                <div key={item.l} className="rounded-lg border border-line bg-raised/70 p-2.5">
                  <div className={`text-lg sm:text-xl font-bold font-mono ${item.c}`}>{item.v}</div>
                  <div className="text-[9.5px] uppercase tracking-wider text-dim mt-0.5">{item.l}</div>
                </div>
              ))}
            </div>

            {/* Live Visual Widget Split */}
            <div className="grid sm:grid-cols-[1.2fr_1fr] gap-3">
              {/* FinOps Mini Bar Card */}
              <div className="rounded-lg border border-line bg-raised/60 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-dim uppercase">FinOps Repair Threshold</span>
                  <span className="text-[10px] font-mono text-bad">88.4% Flagged</span>
                </div>
                <div className="space-y-1.5 my-1">
                  <div className="w-full h-2 bg-bg rounded-full overflow-hidden flex">
                    <div className="h-full bg-accent" style={{ width: "70%" }} />
                    <div className="h-full bg-bad animate-pulse" style={{ width: "18.4%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-mute">
                    <span>Safe repairs (0-70%)</span>
                    <span className="text-bad">Replace triggered</span>
                  </div>
                </div>
                <div className="text-[10.5px] text-dim border-t border-line/60 pt-2 mt-2 flex justify-between">
                  <span>CapEx Replacement Window:</span>
                  <span className="text-fg font-mono">Q2 2026</span>
                </div>
              </div>

              {/* Live Activity Feed */}
              <div className="rounded-lg border border-line bg-raised/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-dim mb-2 font-medium uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-dot" aria-hidden />
                  Live Event Feed
                </div>
                <LiveFeed />
              </div>
            </div>

            {/* Map Mini Banner */}
            <div className="mt-3 p-2.5 rounded-lg border border-line bg-bg/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="text-mute text-[11.5px]">Geospatial Pins: Lagos, Abuja, Port Harcourt, Ibadan</span>
              </div>
              <span className="text-[10px] font-mono text-accent">CARTO DARK</span>
            </div>
          </div>
        </Sec>
      </div>

      {/* 2. TRUSTED BY SECTOR SOCIAL PROOF */}
      <div className="border-b border-line bg-surface/30 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-xs uppercase tracking-widest text-dim mb-6 font-medium">
            Architected for Mission-Critical Infrastructure Across Sectors
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { title: "Commercial Banks", desc: "Core switch stacks & ATM uptime" },
              { title: "Tertiary Hospitals", desc: "Biomedical & ICU telemetry" },
              { title: "Universities", desc: "Multi-campus lab management" },
              { title: "Public Sector MDAs", desc: "Phantom asset & audit defense" },
            ].map((sector) => (
              <div key={sector.title} className="p-3 rounded-lg border border-line/50 bg-raised/40">
                <div className="font-semibold text-sm text-fg">{sector.title}</div>
                <div className="text-xs text-mute mt-0.5">{sector.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PROBLEM VS SOLUTION MATRIX */}
      <Sec id="problem">
        <Eyebrow>
          <BarChart3 className="h-4 w-4 text-accent" /> The Enterprise Breakdown
        </Eyebrow>
        <H2>Spreadsheets don&apos;t know when hardware is financially dead.</H2>
        <p className="text-mute mt-4 max-w-2xl text-base">
          ICT hardware represents over 35% of an enterprise&apos;s capital footprint. Yet maintenance history is lost across vendor paper receipts, technician WhatsApp chats, and stale Excel sheets.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {/* Legacy Pitfall Card */}
          <div className="card p-6 sm:p-7 border-bad/30 bg-bad/5 space-y-4">
            <div className="flex items-center gap-2 text-bad text-xs uppercase font-bold tracking-wider">
              <span>✕ The Reactive Legacy Model</span>
            </div>
            <h3 className="text-xl font-semibold text-fg">Costly, Blind & Audit-Exposed</h3>
            <ul className="space-y-3 text-xs text-mute">
              {[
                "Repairing equipment repeatedly without knowing it exceeded 70% of residual value",
                "Phantom / ghost assets sitting on accounting ledgers years after disappearing",
                "Unplanned downtime on branch core switches halting transactions during peak hours",
                "Decommissioned hard drives thrown away without cryptographic sanitization proof",
                "Budget battles with the CFO due to zero predictive 8-quarter CapEx evidence",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-bad font-bold mt-0.5">✕</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AssetOps Solution Card */}
          <div className="card p-6 sm:p-7 border-accent/40 bg-accent/5 space-y-4">
            <div className="flex items-center gap-2 text-accent text-xs uppercase font-bold tracking-wider">
              <span>✓ The AssetOps FinOps Model</span>
            </div>
            <h3 className="text-xl font-semibold text-fg">Deterministic, Geospatial & Audit-Proof</h3>
            <ul className="space-y-3 text-xs text-mute">
              {[
                "Automatic 70% FinOps threshold flags negative-ROI repairs for instant replacement",
                "Real-time Leaflet GIS map with pinpoint coordinate verification for every branch",
                "Autonomous Preventative Maintenance schedules preventing emergency downtime",
                "Tamper-proof NIST 800-88 sanitization certificates with unique SHA-256 hashes",
                "Defensible 8-quarter CapEx forecasting exportable directly to Excel, SAP & Oracle",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-fg">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sec>

      {/* 4. INTERACTIVE FEATURE PILLARS (TABS) */}
      <Sec id="features" className="border-t border-line">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="eyebrow justify-center">
            <Layers className="h-4 w-4 text-accent" /> Core Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
            Engineered for physical hardware realities.
          </h2>
          <p className="text-mute mt-3 text-sm sm:text-base">
            Explore the five operational pillars that transform your hardware maintenance from a cost sink into strategic financial intelligence.
          </p>
        </div>

        <FeatureTabs />
      </Sec>

      {/* 5. INTERACTIVE ROI & FINOPS CALCULATOR */}
      <Sec id="calculator" className="border-t border-line">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="eyebrow justify-center">
            <Coins className="h-4 w-4 text-accent" /> Cost Modeling
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
            Calculate your hardware cost recovery.
          </h2>
          <p className="text-mute mt-2 text-sm">
            Adjust the sliders below to estimate annual savings from eliminated wasteful repairs, automated PM downtime suppression, and NIST salvage resale.
          </p>
        </div>

        <RoiCalculator />
      </Sec>

      {/* 6. GIS MAP SPOTLIGHT */}
      <Sec id="gis" className="border-t border-line">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <Eyebrow>
              <MapPin className="h-4 w-4 text-accent" /> Interactive GIS Infrastructure
            </Eyebrow>
            <H2>Every server room, lab, and branch on one interactive map.</H2>
            <p className="text-mute text-base leading-relaxed">
              Managing distributed ICT hardware requires geospatial context. AssetOps comes out of the box with zero-config Leaflet GIS maps featuring dark vector tiles, cluster risk color-coding, and an interactive pin-drop picker.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-fg">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>Zero Google Maps API charges: uses free OpenStreetMap and CARTO Dark tiles</span>
              </div>
              <div className="flex items-start gap-2.5 text-fg">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>Click-to-drop coordinate picker with Nigerian city presets and device GPS support</span>
              </div>
              <div className="flex items-start gap-2.5 text-fg">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>Proportional bubble clusters that scale with asset count and turn amber/red during failures</span>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/app/locations" className="btn btn-accent">
                View Full Location Fleet <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Visual GIS Graphic */}
          <div className="card p-5 bg-surface/90 border-line2 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs text-fg">NATIONWIDE ASSET CLUSTERS</span>
              </div>
              <span className="text-[10px] text-dim uppercase">REAL-TIME GPS</span>
            </div>
            <div className="rounded-lg border border-line bg-[#0d0f13] p-4 text-center space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-left text-xs">
                <div className="p-2.5 rounded bg-raised border border-line">
                  <div className="text-[10px] text-dim uppercase">Lagos HQ</div>
                  <div className="font-semibold text-fg mt-0.5">2,410 Units</div>
                  <span className="text-[9.5px] text-ok">97.2% Normal</span>
                </div>
                <div className="p-2.5 rounded bg-raised border border-line">
                  <div className="text-[10px] text-dim uppercase">Abuja DC</div>
                  <div className="font-semibold text-fg mt-0.5">1,842 Units</div>
                  <span className="text-[9.5px] text-warn">3 PM Due</span>
                </div>
                <div className="p-2.5 rounded bg-raised border border-line">
                  <div className="text-[10px] text-dim uppercase">Port Harcourt</div>
                  <div className="font-semibold text-fg mt-0.5">850 Units</div>
                  <span className="text-[9.5px] text-bad">1 Urgent WO</span>
                </div>
              </div>
              <p className="text-[11px] text-mute">
                Built-in Leaflet engine renders instantly without external telemetry keys or billing quotas.
              </p>
            </div>
          </div>
        </div>
      </Sec>

      {/* 7. INDUSTRY SOLUTIONS */}
      <Sec id="solutions" className="border-t border-line">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="eyebrow justify-center">
            <Building className="h-4 w-4 text-accent" /> Tailored Sector Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
            Built for institutions where downtime is not an option.
          </h2>
          <p className="text-mute mt-3 text-sm sm:text-base">
            Select your sector below to see how AssetOps eliminates downtime, passes audits, and enforces strict financial governance.
          </p>
        </div>

        <IndustrySolutions />
      </Sec>

      {/* 8. EVIDENCE-BACKED AI ENGINE (GROQ LLM) */}
      <Sec className="border-t border-line">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <Eyebrow>
              <Sparkles className="h-4 w-4 text-accent" /> Zero-Hallucination Intelligence
            </Eyebrow>
            <H2>Ask your maintenance data anything. Backed by evidence.</H2>
            <p className="text-mute text-base leading-relaxed">
              AssetOps combines Groq&apos;s lightning-fast Llama 3 engine with strict database ground truth. The AI explains patterns and answers natural-language queries, but it will never calculate fake numbers or invent work orders. If the evidence isn&apos;t in your PostgreSQL database, AssetOps says so.
            </p>
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-fg">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>Deterministic SQL queries only: the LLM never fabricates metrics</span>
              </div>
              <div className="flex items-start gap-2.5 text-fg">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>Every claim links to verified work order numbers and timestamps</span>
              </div>
              <div className="flex items-start gap-2.5 text-fg">
                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>Strict tenant isolation: your institutional data never leaks or trains models</span>
              </div>
            </div>
          </div>

          {/* AI Interactive Chat Mockup */}
          <div className="card p-5 sm:p-6 space-y-4 shadow-2xl border-line2 bg-surface/90">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-xs font-mono text-dim uppercase">AI Copilot · Evidence Grounded</span>
              <span className="text-[10px] text-accent font-mono bg-accent/10 px-2 py-0.5 rounded">
                Groq Llama 3
              </span>
            </div>

            <div className="ml-auto max-w-[85%] rounded-xl bg-raised border border-line px-3.5 py-2 text-xs text-fg">
              Why did Lagos branch maintenance spend surge 22% this quarter?
            </div>

            <div className="p-4 rounded-xl bg-bg border border-line space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-fg font-medium">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>Synthesized Diagnosis:</span>
              </div>
              <p className="text-xs text-mute leading-relaxed">
                Lagos maintenance spend rose by <strong className="text-fg">₦1.84M</strong> across 42 work orders. Surge was driven by repetitive battery replacements on 18 Dell workstations reaching 4.8 years of age.
              </p>

              <div className="border-t border-line/70 pt-2 space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-dim tracking-wider">
                  Verified Audit Citations:
                </div>
                <div className="space-y-1 text-[11px] text-fg font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-accent">•</span> WO-84920 to WO-84938 (UPS Battery Replacements)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-accent">•</span> Vendor: PowerTech Solutions (Avg turn-around 3.2 days)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-accent">•</span> FinOps Status: 14 units breached 70% NBV threshold
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Link href="/app/finops" className="btn btn-accent text-[11px] h-7 px-2.5">
                  View FinOps Remediation
                </Link>
                <button className="btn text-[11px] h-7 px-2.5">Export Audit Trail</button>
              </div>
            </div>
          </div>
        </div>
      </Sec>

      {/* 9. ENTERPRISE SECURITY & GOVERNANCE */}
      <Sec id="security" className="border-t border-line">
        <Eyebrow>
          <Shield className="h-4 w-4 text-accent" /> Enterprise Security
        </Eyebrow>
        <H2>Built so you can defend every number before auditors.</H2>
        <p className="text-mute mt-3 max-w-2xl text-base">
          From central bank inspectors to internal auditors, AssetOps provides complete mathematical, cryptographic, and operational transparency.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
          {[
            {
              icon: KeyRound,
              title: "Six-Tier RBAC",
              desc: "Strict server-enforced roles: Admin, Lead Tech, Technician, Manager, Auditor, Viewer.",
            },
            {
              icon: ScrollText,
              title: "Immutable Audit Log",
              desc: "Append-only cryptographic record of every work order, certification, and config update.",
            },
            {
              icon: Database,
              title: "Tenant Isolation",
              desc: "Every database query is automatically scoped to your institutional organization ID.",
            },
            {
              icon: FileBadge,
              title: "NIST 800-88 Proof",
              desc: "Tamper-evident certificates for certified data sanitization and disk purging.",
            },
            {
              icon: Download,
              title: "One-Click ERP Export",
              desc: "Native CSV & JSON feeds formatted for immediate ingestion by SAP, Oracle, and Dynamics.",
            },
            {
              icon: Lock,
              title: "Encrypted Secrets",
              desc: "Database credentials and API keys stored in server environment variables only.",
            },
            {
              icon: QrCode,
              title: "Secure Signed QR",
              desc: "QR codes contain signed verification tokens, not exposed raw database IDs.",
            },
            {
              icon: Timer,
              title: "Configurable Retention",
              desc: "Keep maintenance histories forever for legal and warranty dispute defense.",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card p-4.5 bg-surface/70 border-line hover:border-line2 transition">
                <Icon className="h-5 w-5 text-accent mb-2.5" />
                <div className="font-semibold text-sm text-fg">{item.title}</div>
                <div className="text-mute text-xs mt-1 leading-relaxed">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </Sec>

      {/* 10. PRICING TIERS */}
      <Sec id="pricing" className="border-t border-line">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="eyebrow justify-center">
            <Coins className="h-4 w-4 text-accent" /> Transparent Licensing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
            Predictable tiers for every estate size.
          </h2>
          <p className="text-mute mt-3 text-sm sm:text-base">
            No surprise add-ons. Full access to FinOps calculations, GIS mapping, and QR passports across all plans.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="card p-6 bg-surface/80 border-line flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-dim font-mono">Starter / Pilot</div>
              <div className="text-3xl font-bold text-fg mt-2 font-mono">Free</div>
              <p className="text-mute text-xs mt-1">For single-site ICT teams evaluating AssetOps.</p>
              <ul className="mt-6 space-y-2.5 text-xs">
                {[
                  "Up to 500 monitored hardware assets",
                  "Core Leaflet GIS map with pin-dropping",
                  "Digital QR Passports & mobile work orders",
                  "Deterministic health scoring",
                  "Community support",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-line mt-6">
              <Link href="/sign-up" className="btn w-full justify-center">
                Start Free
              </Link>
            </div>
          </div>

          {/* Professional Plan */}
          <div className="card p-6 bg-surface border-accent/60 shadow-xl shadow-accent/5 ring-1 ring-accent/30 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 text-[10px] font-mono font-bold uppercase tracking-wider text-accent bg-bg border border-accent/40 px-2.5 py-0.5 rounded-full">
              MOST POPULAR
            </span>
            <div>
              <div className="text-xs uppercase tracking-wider text-accent font-mono">Professional</div>
              <div className="text-3xl font-bold text-fg mt-2 font-mono">
                ₦150,000 <span className="text-xs text-mute font-normal font-sans">/ month</span>
              </div>
              <p className="text-mute text-xs mt-1">For multi-branch banks, colleges, and regional clinics.</p>
              <ul className="mt-6 space-y-2.5 text-xs">
                {[
                  "Up to 5,000 monitored hardware assets",
                  "Full Hardware FinOps Suite (NBV & 70% Rule)",
                  "8-Quarter CapEx Replacement Forecaster",
                  "Automated Preventative Maintenance (PM) Engine",
                  "NIST 800-88 Certified Decommissioning",
                  "Groq Llama 3 AI Evidence-backed Copilot",
                  "One-click CSV & ERP spreadsheet export",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-fg font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-line mt-6">
              <Link href="/sign-up" className="btn btn-accent w-full justify-center font-medium">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="card p-6 bg-surface/80 border-line flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-dim font-mono">Enterprise & Sovereign</div>
              <div className="text-3xl font-bold text-fg mt-2 font-mono">Custom</div>
              <p className="text-mute text-xs mt-1">For national banking fleets, universities & government MDAs.</p>
              <ul className="mt-6 space-y-2.5 text-xs">
                {[
                  "Unlimited hardware assets & branches",
                  "Multi-organization tenant federation",
                  "On-premise / Sovereign PostgreSQL deployment",
                  "Custom IFRS / GAAP depreciation algorithms",
                  "Dedicated SLA & 24/7 incident engineer",
                  "Custom ERP direct API connectors (SAP, Oracle)",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-line mt-6">
              <Link href="/sign-in" className="btn w-full justify-center">
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-dim">
            ✨ Early Access Notice: All premium FinOps and AI features are unlocked in the live demo sandbox.
          </p>
        </div>
      </Sec>

      {/* 11. FAQ SECTION */}
      <Sec id="faq" className="border-t border-line">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="eyebrow justify-center">
            <HelpCircle className="h-4 w-4 text-accent" /> Frequently Answered Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
            Everything you need to know.
          </h2>
          <p className="text-mute mt-2 text-sm">
            Common questions from IT Directors, Finance Heads, and Systems Engineers.
          </p>
        </div>

        <FaqAccordion />
      </Sec>

      {/* 12. FINAL HIGH-IMPACT CTA BANNER */}
      <Sec className="border-t border-line text-center py-20 sm:py-28">
        <div className="card p-8 sm:p-14 border-accent/40 bg-gradient-to-b from-surface via-raised to-bg relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/15 rounded-full blur-[120px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto leading-[1.12] text-fg relative">
            Stop losing millions to invisible hardware degradation.
          </h2>
          <p className="text-mute text-base mt-4 max-w-xl mx-auto relative">
            Join institutions using AssetOps to govern physical hardware with mathematical precision and zero audit surprises.
          </p>

          <div className="flex justify-center flex-wrap gap-4 mt-8 relative">
            <Link href="/sign-up" className="btn btn-accent btn-lg font-medium shadow-lg shadow-accent/20">
              Start Free Workspace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sign-in" className="btn btn-lg font-medium">
              Explore Live Synthetic Demo
            </Link>
          </div>

          <div className="mt-6 text-xs text-dim relative">
            Live demo includes 5,100+ assets pre-loaded across Nigeria. Instant access.
          </div>
        </div>
      </Sec>

      {/* 13. MODERN FOOTER */}
      <footer className="border-t border-line bg-surface/50">
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Logo />
            <span className="hidden sm:inline text-line2">|</span>
            <span className="text-xs text-mute">
              Hardware FinOps & ICT Maintenance Intelligence
            </span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-6 text-xs text-mute font-medium">
            <a href="#features" className="hover:text-fg transition">Features</a>
            <a href="#gis" className="hover:text-fg transition">GIS Map</a>
            <a href="#solutions" className="hover:text-fg transition">Solutions</a>
            <a href="#calculator" className="hover:text-fg transition">FinOps ROI</a>
            <a href="#security" className="hover:text-fg transition">Security</a>
            <a href="#pricing" className="hover:text-fg transition">Pricing</a>
            <a href="#faq" className="hover:text-fg transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-ok bg-ok/10 px-2 py-0.5 rounded-full border border-ok/20">
              <span className="h-1.5 w-1.5 rounded-full bg-ok animate-dot" />
              <span>All Systems Operational</span>
            </div>
            <div className="text-xs text-dim font-mono">© 2026 AssetOps</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
