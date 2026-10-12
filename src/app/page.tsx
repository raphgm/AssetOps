import Link from "next/link";
import {
  ArrowRight,
  Check,
  Lock,
  ScrollText,
  Database,
  KeyRound,
  Download,
  Timer,
  Radio,
  Sparkles,
  MapPin,
  Coins,
  Shield,
  FileBadge,
  Building,
  HelpCircle,
  BarChart3,
  Layers,
  Cpu,
  Globe2,
  Server,
  QrCode,
  Wrench,
  Activity,
  Zap,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  ArrowUpRight,
  Sliders,
  ScanLine,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import InteractiveConsole from "@/components/landing/InteractiveConsole";
import BentoGrid from "@/components/landing/BentoGrid";
import RoiCalculator from "@/components/landing/RoiCalculator";
import IndustrySolutions from "@/components/landing/IndustrySolutions";
import FaqAccordion from "@/components/landing/FaqAccordion";
import { Logo } from "@/components/ui";

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
    className={`max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20 relative z-10 ${className}`}
  >
    {children}
  </section>
);

export default function Landing() {
  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen selection:bg-cyan-100 selection:text-cyan-900 font-sans relative overflow-x-hidden">
      {/* 1. VIBRANT LUMINOUS MESH GLOWS (STRIPE / ATTIO AESTHETIC) */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% -10%, rgba(6, 182, 212, 0.20), rgba(99, 102, 241, 0.12), rgba(20, 184, 166, 0.10), transparent 75%)",
        }}
        aria-hidden
      />
      <div
        className="fixed bottom-0 right-10 w-[800px] h-[500px] pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 80% 90%, rgba(16, 185, 129, 0.14), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Subtle Micro-Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.45] -z-20"
        style={{
          backgroundImage: "radial-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      {/* Floating Bright Capsule Navbar */}
      <Navbar />

      {/* 2. BRIGHT HERO SECTION */}
      <div className="relative pt-28 sm:pt-36 pb-16 border-b border-slate-200/80">
        <Sec className="py-0 sm:py-4">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            {/* Ambient Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-200 bg-white/90 shadow-sm text-cyan-900 text-xs font-mono font-bold mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
              <span>FINOPS FOUNDATION ALIGNED // FOCUS™ v1.0 STANDARD</span>
            </div>

            {/* High-Contrast Luminous Heading */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-slate-950 font-sans">
              Turn physical infrastructure into{" "}
              <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                mathematical FinOps precision.
              </span>
            </h1>

            {/* Outcome Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg mt-5 leading-relaxed font-sans max-w-2xl mx-auto font-normal">
              Stop pouring maintenance budget into terminal assets. Unify real-time network auto-discovery, IoT power telemetry, keyless OpenStreetMap GIS, and 70% threshold financial governance in one mission-critical operating system.
            </p>

            {/* CTA Buttons: Exactly 1 primary + 1 secondary */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8 font-sans">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 hover:brightness-105 transition-all"
              >
                <span>Launch Live Platform</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#finops"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm transition"
              >
                Model FinOps ROI
              </a>
            </div>

            {/* Compliance Proof Chips */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-mono text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> FOCUS™ v1.0 Spec
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> 70% Repair Threshold
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> 100% Keyless OSM
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> NIST SP 800-88 Decommission
              </span>
            </div>
          </div>

          {/* Interactive Console Centerpiece */}
          <div className="max-w-5xl mx-auto">
            <InteractiveConsole />
          </div>
        </Sec>
      </div>

      {/* 3. ENTERPRISE SECTOR BANNER */}
      <div className="border-b border-slate-200/80 bg-white py-6 relative z-10 font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-4">
            MISSION-CRITICAL INFRASTRUCTURE FLEET GOVERNANCE
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { title: "Commercial Banking", desc: "Sub-minute branch & ATM uptime", color: "border-blue-200 bg-blue-50/50" },
              { title: "Diagnostic Healthcare", desc: "Life-critical clinical terminals", color: "border-emerald-200 bg-emerald-50/50" },
              { title: "Higher Education", desc: "10,000+ campus lab computers", color: "border-purple-200 bg-purple-50/50" },
              { title: "Energy & Field Sites", desc: "Solar arrays & power substations", color: "border-amber-200 bg-amber-50/50" },
            ].map((sector) => (
              <div key={sector.title} className={`p-4 rounded-2xl border ${sector.color} hover:shadow-md transition`}>
                <div className="font-bold text-sm text-slate-900">{sector.title}</div>
                <div className="text-xs text-slate-500 mt-1 font-sans">{sector.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BENTO GRID: THE 5 PRODUCTION UPGRADES */}
      <Sec id="platform">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold mb-3">
            <Layers className="h-3.5 w-3.5 text-cyan-600" />
            <span>PLATFORM ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Five core engines. One integrated operating system.
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base font-sans">
            Built from the ground up for IT directors, field engineers, and financial controllers.
          </p>
        </div>

        <BentoGrid />
      </Sec>

      {/* 5. BEFORE VS. AFTER COMPARISON */}
      <Sec className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono font-bold mb-3">
            <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
            <span>OPERATIONAL TRANSFORMATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            The difference between spreadsheet drift and FinOps governance.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 font-sans">
          {/* Legacy Spreadsheets */}
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="inline-flex items-center gap-1.5 text-rose-700 text-xs uppercase font-mono font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              ✕ Legacy Spreadsheets & Blind Ticketing
            </div>
            <h3 className="text-xl font-bold text-slate-900">Uncontrolled Repair Debt & Lost Assets</h3>
            <ul className="space-y-3 text-xs text-slate-600">
              {[
                "Paying ₦1.6M to repeatedly repair an old server with a residual book value of only ₦1.8M",
                "Ghost laptops and desktop towers sitting on asset ledgers years after disappearing from branches",
                "Reactive emergency breakdowns causing multi-hour branch outages during peak business hours",
                "Vendor SLA breaches going completely undetected without financial penalty rebates",
                "Retired storage drives discarded or swapped without verifiable NIST SP 800-88 sanitization proof",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold mt-0.5">✕</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AssetOps Standard */}
          <div className="bg-white border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-500/20">
            <div className="inline-flex items-center gap-1.5 text-cyan-800 text-xs uppercase font-mono font-bold bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
              ✓ The AssetOps FinOps Standard
            </div>
            <h3 className="text-xl font-bold text-slate-900">Disciplined Hardware Governance & Cost Control</h3>
            <ul className="space-y-3 text-xs text-slate-700 font-medium">
              {[
                "Automated 70% FinOps threshold halts repeat repair POs and diverts capital to fresh procurement",
                "Subnet auto-discovery and MDM webhooks register hardware without manual serial entry",
                "Continuous SNMP power & thermal telemetry automatically dispatches critical 4-hour SLA work orders",
                "Live vendor SLA clock tracks support responsiveness and automatically logs contractual rebate credits",
                "Cryptographic NIST SP 800-88 data sanitization certificates issued with SHA-256 tamper-proof hashes",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sec>

      {/* 6. HARDWARE FINOPS ROI CALCULATOR */}
      <Sec id="finops" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Cpu className="h-3.5 w-3.5 text-cyan-600" />
            <span>FINOPS ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Model your enterprise hardware cost recovery.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans font-normal">
            Adjust fleet parameters to calculate estimated maintenance savings and CapEx recovery.
          </p>
        </div>

        <RoiCalculator />
      </Sec>

      {/* 7. NATIONWIDE FLEET GIS SPOTLIGHT */}
      <Sec id="gis" className="border-t border-slate-200/80">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
              <Globe2 className="h-3.5 w-3.5 text-teal-600" />
              <span>Zero-License Fleet GIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
              Headquarter data centers to remote project sites on one map.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans font-normal">
              Managing physical IT infrastructure requires geospatial clarity. AssetOps connects central server rooms, campus faculties, and remote client project sites (e.g. solar farms, marine terminals, transmission substations) on high-speed vector tiles with zero third-party Google Maps or Mapbox license fees.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium font-sans">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Zero commercial map billing: runs on 100% keyless OpenStreetMap</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Real-time location clustering with room, rack, and site-level asset counts</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Status color coding: green for operational, amber for scheduled PM, red for critical outage</span>
              </div>
            </div>
            <div className="pt-3 font-mono">
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition"
              >
                Inspect Nationwide Fleet Map <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* GIS Telemetry Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900">GEOSPATIAL FLEET TELEMETRY</span>
              </div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                ACTIVE VECTOR TILES
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Lagos Head Office</div>
                  <div className="font-bold text-slate-900 mt-0.5">5,410 Assets</div>
                  <span className="text-[10px] text-emerald-700 font-bold">Tier III DC</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Abuja Regional</div>
                  <div className="font-bold text-slate-900 mt-0.5">4,120 Assets</div>
                  <span className="text-[10px] text-cyan-700 font-bold">Fed Complex</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Epe Solar Site</div>
                  <div className="font-bold text-slate-900 mt-0.5">1,840 Assets</div>
                  <span className="text-[10px] text-indigo-700 font-bold">Substation</span>
                </div>
              </div>
              <p className="text-[11.5px] text-slate-500 text-center font-sans">
                OpenStreetMap GIS telemetry streams live updates across desktop browsers and mobile field devices.
              </p>
            </div>
          </div>
        </div>
      </Sec>

      {/* 8. INDUSTRY SECTORS */}
      <Sec id="solutions" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Building className="h-3.5 w-3.5 text-cyan-600" />
            <span>ENTERPRISE SOLUTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Built for institutions where hardware downtime is unacceptable.
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base font-sans font-normal">
            Tailored preventative workflows and proven financial impact for your sector.
          </p>
        </div>

        <IndustrySolutions />
      </Sec>

      {/* 9. DETERMINISTIC AI COPILOT */}
      <Sec className="border-t border-slate-200/80">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono font-bold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Deterministic AI Copilot</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
              Direct database reasoning. Zero model hallucinations.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans font-normal">
              AssetOps connects Groq&apos;s lightning-fast Llama 3 engine directly to physical hardware records. The Copilot diagnoses spend anomalies and surfaces overdue preventative maintenance, but it never fabricates facts. If data isn&apos;t in your database, it reports no record found.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium font-sans">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Deterministic database queries: the assistant never invents fake hardware metrics</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Every diagnostic answer cites specific work orders, serial numbers, and cost centers</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Strict multi-tenant security: your institutional data never leaks to public training sets</span>
              </div>
            </div>
          </div>

          {/* AI Copilot Chat Preview */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase">AI COPILOT // REASONING FEED</span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                GROQ LLAMA 3
              </span>
            </div>

            <div className="ml-auto max-w-[85%] rounded-2xl bg-slate-900 text-white px-4 py-2.5 text-xs font-sans">
              Why did Lagos IT maintenance spend surge 28% this quarter?
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-900 font-bold font-sans">
                <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
                <span>Synthesized Fleet Diagnostic:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Lagos spend increased by <strong className="text-slate-900">₦1,840,000</strong> across 42 maintenance tickets. Driven primarily by repetitive fan tray and power supply repairs on 14 Dell PowerEdge R740 servers now past 4.8 years of age.
              </p>

              <div className="border-t border-slate-200 pt-2 space-y-1 text-[11px] text-slate-600">
                <div>• WO-29381 to WO-29422 (PowerEdge Server Cooling & PSU)</div>
                <div>• Primary Vendor: PowerTech Hardware Services (SLA 3.2 hrs)</div>
                <div className="text-rose-700 font-bold">• 9 units exceeded the 70% FinOps threshold: recommend CapEx replacement</div>
              </div>

              <div className="pt-2 flex gap-2">
                <Link
                  href="/app/finops"
                  className="px-3.5 py-2 rounded-xl text-[11px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
                >
                  Review CapEx Replacement Queue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Sec>

      {/* 10. COMPLIANCE & AUDIT DEFENSE */}
      <Sec id="security" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
            <Shield className="h-3.5 w-3.5 text-slate-700" />
            <span>GOVERNANCE & AUDIT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Defend every hardware metric before auditors.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans font-normal">
            Mathematical, cryptographic, and operational proof anchored to tamper-proof records.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
          {[
            { icon: KeyRound, title: "Six-Tier Enterprise RBAC", desc: "Admin, IT Lead, Field Tech, Procurement, Auditor, Read-Only." },
            { icon: ScrollText, title: "Immutable Audit Log", desc: "Append-only record of every status change, custody transfer, and sign-off." },
            { icon: Database, title: "PostgreSQL Isolation", desc: "Every query scoped strictly to your organization tenant ID." },
            { icon: FileBadge, title: "NIST SP 800-88 Standard", desc: "Cryptographic proof of irreversible storage drive media sanitization." },
            { icon: Download, title: "1-Click Audit & FOCUS™", desc: "Excel .xlsx export and Linux Foundation FOCUS™ v1.0 standard JSON." },
            { icon: Lock, title: "Encrypted Data Enclave", desc: "AES-256 encryption at rest and TLS 1.3 encryption in transit." },
            { icon: QrCode, title: "Digital QR Passports", desc: "Scan physical hardware with any smartphone camera for instant history." },
            { icon: Timer, title: "Live SLA Countdown", desc: "Contract breach detection with automated vendor penalty calculations." },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                <Icon className="h-5 w-5 text-cyan-600 mb-2" />
                <div className="font-bold text-sm text-slate-900 font-sans">{item.title}</div>
                <div className="text-slate-500 text-xs mt-1 leading-snug font-sans">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </Sec>

      {/* 11. PRICING TIERS */}
      <Sec id="pricing" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Coins className="h-3.5 w-3.5 text-cyan-600" />
            <span>TRANSPARENT PRICING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Predictable, transparent licensing.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans font-normal">
            Full access to Hardware FinOps, Nationwide GIS, and QR Passports across all plans.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 font-mono">
          {/* Starter Tier */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Starter Fleet</div>
              <div className="text-3xl font-black text-slate-900 mt-2">Free</div>
              <p className="text-slate-500 text-xs mt-1 font-sans">For small IT teams evaluating AssetOps.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-sans font-medium">
                {[
                  "Up to 250 monitored physical assets",
                  "Nationwide GIS map with location pins",
                  "Digital QR Passports & work orders",
                  "Straight-line asset depreciation",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href="/sign-in"
                className="w-full inline-flex items-center justify-center py-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 transition"
              >
                START FREE
              </Link>
            </div>
          </div>

          {/* Professional Tier */}
          <div className="bg-white border-2 border-cyan-400 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-500/10 ring-2 ring-cyan-500/20 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 text-[10.5px] font-black uppercase text-white bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 px-3.5 py-0.5 rounded-full shadow-md">
              MOST POPULAR
            </span>
            <div>
              <div className="text-xs uppercase font-bold text-cyan-800">Professional Fleet</div>
              <div className="text-3xl font-black text-slate-950 mt-2">
                ₦150,000 <span className="text-xs text-slate-500 font-normal font-sans">/ month</span>
              </div>
              <p className="text-slate-500 text-xs mt-1 font-sans">For multi-branch banks, clinics, and academic institutions.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-800 font-sans font-medium">
                {[
                  "Up to 5,000 monitored ICT hardware assets",
                  "Full 70% FinOps Suite & threshold warnings",
                  "Auto-Discovery (Subnet Scanner + MDM Webhook)",
                  "Live IoT Power & Thermal Telemetry",
                  "In-Browser Camera Barcode/QR Scanner",
                  "Automated Vendor SLA Dispatch & Timer",
                  "1-Click Excel .xlsx & FOCUS™ v1.0 Export",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                    <span className="font-bold text-slate-950">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href="/sign-in"
                className="w-full inline-flex items-center justify-center py-3 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 text-white shadow-md hover:brightness-105 transition"
              >
                DEPLOY PROFESSIONAL
              </Link>
            </div>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Enterprise Custom</div>
              <div className="text-3xl font-black text-slate-900 mt-2">Custom</div>
              <p className="text-slate-500 text-xs mt-1 font-sans">For large enterprises, conglomerates, and government MDAs.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-sans font-medium">
                {[
                  "Unlimited physical assets & branch locations",
                  "Multi-tenant branch federation & SSO",
                  "Dedicated PostgreSQL enclave or on-prem deployment",
                  "Custom straight-line & declining balance depreciation",
                  "Dedicated 24/7 technical account engineer & SLA",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href="/sign-in"
                className="w-full inline-flex items-center justify-center py-3 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white transition"
              >
                CONTACT ENTERPRISE DESK
              </Link>
            </div>
          </div>
        </div>
      </Sec>

      {/* 12. FAQ */}
      <Sec id="faq" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-600" />
            <span>ENTERPRISE FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Frequently asked questions.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans font-normal">
            Clear technical and financial answers for IT Directors, CIOs, and CFOs.
          </p>
        </div>

        <FaqAccordion />
      </Sec>

      {/* 13. FINAL HIGH-IMPACT BRIGHT GRADIENT BANNER */}
      <Sec className="border-t border-slate-200/80 text-center py-16 sm:py-24">
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl font-mono">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-[1.12] relative font-sans text-white">
            Stop losing millions to untracked IT hardware and runaway repairs.
          </h2>
          <p className="text-teal-50 text-base mt-4 max-w-xl mx-auto relative font-sans font-normal">
            Take control of your enterprise infrastructure with mathematical FinOps precision, automated preventative maintenance, and instant compliance proof.
          </p>

          <div className="flex justify-center flex-wrap gap-4 mt-8 relative font-sans">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs bg-white text-slate-950 shadow-lg shadow-black/10 hover:bg-slate-50 transition"
            >
              LAUNCH LIVE PLATFORM <ArrowRight className="h-4 w-4 text-cyan-600" />
            </Link>
          </div>

          <div className="mt-5 text-xs text-teal-100 relative font-sans">
            Enterprise hardware tracking across nationwide offices and client project sites.
          </div>
        </div>
      </Sec>

      {/* 14. BRIGHT CLEAN FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white relative z-10 font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Logo />
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-sans">
              Enterprise ICT Hardware FinOps & Lifecycle Intelligence
            </span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-6 text-xs text-slate-600 font-semibold font-sans">
            <a href="#platform" className="hover:text-cyan-600 transition">Platform</a>
            <a href="#finops" className="hover:text-cyan-600 transition">FinOps Engine</a>
            <a href="#gis" className="hover:text-cyan-600 transition">Nationwide GIS</a>
            <a href="#solutions" className="hover:text-cyan-600 transition">Solutions</a>
            <a href="#pricing" className="hover:text-cyan-600 transition">Pricing</a>
            <a href="#faq" className="hover:text-cyan-600 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse shadow-sm" />
              <span>FINOPS CLUSTER: ONLINE</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">© ASSETOPS</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
