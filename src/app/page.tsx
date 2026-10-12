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
  AlertTriangle,
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

            {/* Concise Outcome Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg mt-5 leading-relaxed font-sans max-w-2xl mx-auto font-normal">
              Automate hardware discovery, IoT power telemetry, and 70% FinOps replacement thresholds across nationwide sites.
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
                <Check className="h-3.5 w-3.5 text-cyan-600" /> FOCUS™ v1.0 Standard
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> 70% Repair Cutoff
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> 100% Keyless OSM
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> NIST SP 800-88
              </span>
            </div>
          </div>

          {/* Interactive Console Centerpiece */}
          <div className="max-w-5xl mx-auto">
            <InteractiveConsole />
          </div>
        </Sec>
      </div>

      {/* 3. ENTERPRISE LIVE TELEMETRY TICKER */}
      <div className="border-b border-slate-200/80 bg-white py-5 relative z-10 font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {[
              { label: "Commercial Banking", metric: "1,420 ATM Nodes", status: "99.98% Up", color: "text-blue-700 bg-blue-50 border-blue-200" },
              { label: "Clinical Healthcare", metric: "850 Monitors", status: "22.4°C Cool", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
              { label: "Higher Education", metric: "12,400 Terminals", status: "Zero Drift", color: "text-purple-700 bg-purple-50 border-purple-200" },
              { label: "Energy Field Sites", metric: "48 Inverters", status: "₦0 Map Fees", color: "text-amber-700 bg-amber-50 border-amber-200" },
            ].map((sector) => (
              <div key={sector.label} className={`p-3 rounded-2xl border ${sector.color} shadow-sm`}>
                <div className="text-[10px] uppercase font-bold text-slate-500">{sector.label}</div>
                <div className="font-black text-sm text-slate-900 mt-0.5">{sector.metric}</div>
                <div className="text-[10.5px] font-bold mt-0.5 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{sector.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BENTO GRID: 5 CORE PRODUCTION ENGINES */}
      <Sec id="platform">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold mb-3">
            <Layers className="h-3.5 w-3.5 text-cyan-600" />
            <span>PLATFORM ENGINES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Five core engines. One integrated OS.
          </h2>
        </div>

        <BentoGrid />
      </Sec>

      {/* 5. VISUAL BEFORE VS. AFTER: SPREADSHEET DRIFT VS. FINOPS PRECISION */}
      <Sec className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono font-bold mb-3">
            <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
            <span>OPERATIONAL TRANSFORMATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Spreadsheet drift vs. AssetOps precision.
          </h2>
        </div>

        {/* Visual Split Graphic */}
        <div className="grid md:grid-cols-2 gap-6 font-mono">
          {/* Left: The Messy Spreadsheet Visual */}
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-slate-800">asset_inventory_final_v4.xlsx</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                CAPITAL DRAIN
              </span>
            </div>

            {/* Mock Spreadsheet Rows */}
            <div className="rounded-xl border border-rose-100 bg-rose-50/30 overflow-hidden text-[11px]">
              <div className="grid grid-cols-4 bg-rose-100/50 p-2 font-bold text-slate-700 border-b border-rose-200 text-[10px] uppercase">
                <span>Tag ID</span>
                <span>Age</span>
                <span>Repairs</span>
                <span>Audit State</span>
              </div>
              <div className="divide-y divide-rose-100">
                <div className="grid grid-cols-4 p-2 text-slate-800 bg-white">
                  <span>SRV-DC-04</span>
                  <span>6.2 yrs</span>
                  <span className="text-rose-700 font-bold">₦1.6M (Repeat #6)</span>
                  <span className="text-rose-600 font-bold">⚠ Sunk Cost Drain</span>
                </div>
                <div className="grid grid-cols-4 p-2 text-slate-800 bg-rose-50/50">
                  <span>NB-FIN-18</span>
                  <span>3.1 yrs</span>
                  <span>₦0</span>
                  <span className="text-rose-600 font-bold">✕ Ghost Asset</span>
                </div>
                <div className="grid grid-cols-4 p-2 text-slate-800 bg-white">
                  <span>SW-BR-09</span>
                  <span>7.0 yrs</span>
                  <span className="text-rose-700 font-bold">₦540k</span>
                  <span className="text-rose-600 font-bold">#REF! Stale</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
              <span className="font-bold">Unchecked Maintenance Bleed</span>
              <span className="font-black text-rose-700">₦2.14M Wasted</span>
            </div>
          </div>

          {/* Right: The AssetOps FinOps Engine Visual */}
          <div className="bg-white border-2 border-cyan-400 rounded-3xl p-5 sm:p-7 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-500/20 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900">AssetOps Autonomous FinOps Engine</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                ACTIVE GOVERNANCE
              </span>
            </div>

            {/* FinOps Cutoff Gauge Visual */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">SRV-DC-04 (Dell PowerEdge R740)</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  86% OF NBV
                </span>
              </div>

              {/* Progress ratio */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-cyan-500 h-full" style={{ width: "70%" }} />
                <div className="bg-rose-500 h-full animate-pulse" style={{ width: "16%" }} />
              </div>

              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200">
                <span className="text-emerald-700 font-bold">✓ Repair PO Automatically Blocked</span>
                <span className="text-cyan-800 font-bold">Diverted to 2026 CapEx</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 flex items-center justify-between">
              <span className="font-bold">Cryptographic NIST SP 800-88</span>
              <span className="font-black text-cyan-800">SHA-256 Verified</span>
            </div>
          </div>
        </div>
      </Sec>

      {/* 6. HARDWARE FINOPS ROI CALCULATOR */}
      <Sec id="finops" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Cpu className="h-3.5 w-3.5 text-cyan-600" />
            <span>FINOPS ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Model your fleet capital recovery.
          </h2>
        </div>

        <RoiCalculator />
      </Sec>

      {/* 7. NATIONWIDE FLEET GIS SPOTLIGHT (VISUAL MAP RADAR) */}
      <Sec id="gis" className="border-t border-slate-200/80">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
              <Globe2 className="h-3.5 w-3.5 text-teal-600" />
              <span>Zero-License Fleet GIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
              Headquarter data centers to remote project sites.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              100% keyless OpenStreetMap vector clustering. Zero Google Maps or Mapbox monthly billing invoices.
            </p>

            {/* Live Location Visual Chips */}
            <div className="grid sm:grid-cols-3 gap-2.5 font-mono pt-2">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Marina HQ DC</div>
                <div className="font-black text-slate-900 mt-0.5 text-sm">5,410 Units</div>
                <div className="text-[10px] text-emerald-700 font-bold">Tier III Active</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Abuja CBD Hub</div>
                <div className="font-black text-slate-900 mt-0.5 text-sm">4,120 Units</div>
                <div className="text-[10px] text-cyan-700 font-bold">Sub-Minute Sync</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-[9px] text-slate-400 uppercase font-bold">Epe Solar Site</div>
                <div className="font-black text-slate-900 mt-0.5 text-sm">1,840 Units</div>
                <div className="text-[10px] text-amber-700 font-bold">Substation RTU</div>
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

          {/* Visual Map Radar Canvas */}
          <div className="h-72 rounded-3xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center font-mono shadow-xl">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Node 1: Lagos HQ */}
            <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center animate-ping absolute" />
              <div className="w-5 h-5 rounded-full bg-cyan-600 border-2 border-white shadow-md relative z-10" />
              <div className="mt-1 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-[10.5px] font-bold text-slate-800 whitespace-nowrap">
                Lagos HQ (5,410 Units)
              </div>
            </div>

            {/* Node 2: Abuja */}
            <div className="absolute top-1/4 right-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-indigo-600 border-2 border-white shadow-md relative z-10" />
              <div className="mt-1 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-[10.5px] font-bold text-slate-800 whitespace-nowrap">
                Abuja Fed Hub (4,120 Units)
              </div>
            </div>

            {/* Node 3: Epe Solar */}
            <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-md relative z-10" />
              <div className="mt-1 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-[10.5px] font-bold text-slate-800 whitespace-nowrap">
                Epe Solar Substation (1,840 Units)
              </div>
            </div>

            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-xl border border-slate-200 text-[10px] text-slate-600">
              Keyless OpenStreetMap Vector Mesh · ₦0 API Billing
            </div>
          </div>
        </div>
      </Sec>

      {/* 8. INDUSTRY TOPOLOGY WORKFLOWS */}
      <Sec id="solutions" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Building className="h-3.5 w-3.5 text-cyan-600" />
            <span>ENTERPRISE SOLUTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Built for mission-critical uptime.
          </h2>
        </div>

        <IndustrySolutions />
      </Sec>

      {/* 9. DETERMINISTIC AI COPILOT */}
      <Sec className="border-t border-slate-200/80">
        <div className="grid lg:grid-cols-2 gap-8 items-center font-sans">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono font-bold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Deterministic AI Copilot</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Direct database reasoning. Zero hallucinations.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Synthesizes physical work orders, serial records, and telemetry with Groq Llama 3 speed.
            </p>

            <div className="grid sm:grid-cols-3 gap-2 pt-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-indigo-600 font-bold">Direct SQL</div>
                <div className="text-slate-500 text-[11px] mt-0.5">No hallucination</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-cyan-700 font-bold">Exact Work Orders</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Cited WO-29381</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-emerald-700 font-bold">Private Tenant</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Zero leak</div>
              </div>
            </div>
          </div>

          {/* AI Copilot Visual Feed */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase">AI COPILOT // REASONING FEED</span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                GROQ LLAMA 3
              </span>
            </div>

            <div className="ml-auto max-w-[85%] rounded-2xl bg-slate-900 text-white px-4 py-2 text-xs font-sans">
              Why did Lagos maintenance spend spike this quarter?
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-sans">
                <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
                <span>Fleet Diagnostic Result:</span>
              </div>
              <p className="text-slate-600 font-sans">
                Lagos spend rose by <strong className="text-slate-900">₦1.84M</strong> across 42 tickets on 14 aging PowerEdge R740 servers.
              </p>
              <div className="text-[11px] text-rose-700 font-bold">
                • 9 units breached the 70% FinOps threshold: replacement recommended
              </div>
            </div>
          </div>
        </div>
      </Sec>

      {/* 10. CRYPTOGRAPHIC AUDIT DEFENSE */}
      <Sec id="security" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
            <Shield className="h-3.5 w-3.5 text-slate-700" />
            <span>GOVERNANCE & AUDIT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Defend every hardware metric before auditors.
          </h2>
        </div>

        {/* Visual Cryptographic Certificate Card */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl font-mono">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Visual Certificate Stamp */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[11px] font-bold text-slate-800">NIST SP 800-88 REV. 1 CERTIFICATE</span>
                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Device: Dell EMC PowerVault ME4024</div>
                <div>Drive Serial: WDC-WUS721010ALE6L4</div>
                <div className="text-[10px] text-slate-500 break-all font-mono">
                  SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                </div>
              </div>
              <div className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
                Tamper-Proof Cryptographic Sanitization Proof Confirmed
              </div>
            </div>

            {/* 4 Compliance Chips */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "NIST SP 800-88", sub: "Data sanitization proof" },
                { title: "FOCUS™ v1.0", sub: "Linux Foundation standard" },
                { title: "Six-Tier RBAC", sub: "Strict role segregation" },
                { title: "1-Click Audit", sub: "Instant Excel & JSON export" },
              ].map((c, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-xs text-slate-900 font-sans">{c.title}</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5 font-sans">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Sec>

      {/* 11. PRICING TIERS */}
      <Sec id="pricing" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Coins className="h-3.5 w-3.5 text-cyan-600" />
            <span>PRICING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Transparent licensing.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 font-mono">
          {/* Starter Tier */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Starter Fleet</div>
              <div className="text-3xl font-black text-slate-900 mt-2">Free</div>
              <ul className="mt-5 space-y-2 text-xs text-slate-700 font-sans">
                {["Up to 250 monitored assets", "Nationwide GIS map", "Digital QR Passports", "Straight-line depreciation"].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link href="/sign-in" className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 transition">
                START FREE
              </Link>
            </div>
          </div>

          {/* Professional Tier */}
          <div className="bg-white border-2 border-cyan-400 rounded-3xl p-6 sm:p-7 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-500/20 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 text-[10px] font-black uppercase text-white bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 px-3 py-0.5 rounded-full shadow-md">
              POPULAR
            </span>
            <div>
              <div className="text-xs uppercase font-bold text-cyan-800">Professional Fleet</div>
              <div className="text-3xl font-black text-slate-950 mt-2">
                ₦150,000 <span className="text-xs text-slate-500 font-normal font-sans">/ month</span>
              </div>
              <ul className="mt-5 space-y-2 text-xs text-slate-900 font-sans font-medium">
                {[
                  "Up to 5,000 monitored assets",
                  "Full 70% FinOps Suite & warnings",
                  "Subnet Scanner + MDM Webhooks",
                  "Live IoT Power & Thermal Telemetry",
                  "Camera Barcode/QR Scanner",
                  "Automated SLA Timer & Rebates",
                  "1-Click Excel & FOCUS™ v1.0",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link href="/sign-in" className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 text-white shadow-md hover:brightness-105 transition">
                DEPLOY PROFESSIONAL
              </Link>
            </div>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Enterprise Custom</div>
              <div className="text-3xl font-black text-slate-900 mt-2">Custom</div>
              <ul className="mt-5 space-y-2 text-xs text-slate-700 font-sans">
                {["Unlimited assets & locations", "Multi-tenant federation & SSO", "Dedicated PostgreSQL enclave", "Custom depreciation schedules", "24/7 dedicated support engineer"].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link href="/sign-in" className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white transition">
                CONTACT ENTERPRISE
              </Link>
            </div>
          </div>
        </div>
      </Sec>

      {/* 12. FAQ */}
      <Sec id="faq" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-600" />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Frequently asked questions.
          </h2>
        </div>

        <FaqAccordion />
      </Sec>

      {/* 13. FINAL HIGH-IMPACT BRIGHT GRADIENT BANNER */}
      <Sec className="border-t border-slate-200/80 text-center py-16 sm:py-20">
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl font-mono">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto leading-tight relative font-sans text-white">
            Take control of enterprise infrastructure with FinOps precision.
          </h2>

          <div className="flex justify-center flex-wrap gap-4 mt-8 relative font-sans">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs bg-white text-slate-950 shadow-lg hover:bg-slate-50 transition"
            >
              LAUNCH LIVE PLATFORM <ArrowRight className="h-4 w-4 text-cyan-600" />
            </Link>
          </div>
        </div>
      </Sec>

      {/* 14. BRIGHT CLEAN FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white relative z-10 font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-slate-300">|</span>
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
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              <span>ONLINE</span>
            </div>
            <div className="text-xs text-slate-400">© ASSETOPS</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
