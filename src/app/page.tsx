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
  TrendingDown,
  Activity,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import LiveFeed from "@/components/landing/LiveFeed";
import RoiCalculator from "@/components/landing/RoiCalculator";
import FeatureTabs from "@/components/landing/FeatureTabs";
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
    className={`max-w-6xl mx-auto px-4 py-16 sm:py-24 scroll-mt-16 relative z-10 ${className}`}
  >
    {children}
  </section>
);

export default function Landing() {
  return (
    <div className="bg-[#ffffff] text-slate-900 min-h-screen selection:bg-cyan-100 font-sans relative overflow-x-hidden">
      {/* Luminous Ambient Prismatic Glows */}
      <div className="fixed inset-0 prismatic-mesh opacity-70 pointer-events-none z-0" aria-hidden />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-cyan-200/40 via-teal-200/30 to-indigo-200/35 rounded-full blur-[140px] pointer-events-none -z-10" aria-hidden />
      <div className="fixed bottom-0 right-10 w-[600px] h-[450px] bg-emerald-200/25 rounded-full blur-[140px] pointer-events-none -z-10" aria-hidden />

      <Navbar />

      {/* 1. MINIMAL MODERN HERO SECTION */}
      <div className="relative pt-28 sm:pt-36 pb-16 border-b border-slate-200/80">
        <Sec className="py-0 sm:py-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-200 bg-cyan-50/70 shadow-sm text-cyan-800 text-xs font-mono font-bold mb-6">
              <Radio className="h-3.5 w-3.5 text-cyan-600 animate-pulse" />
              <span>HARDWARE FINOPS OS // ENTERPRISE FLEET INTELLIGENCE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] text-slate-950 font-sans">
              Hardware intelligence.{" "}
              <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                Ahead of its time.
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg mt-5 max-w-xl leading-relaxed font-sans font-normal">
              The unified operating system for enterprise ICT hardware, geospatial fleet tracking, and automated FinOps intelligence. Halt runaway repair costs with the 70% threshold rule, enforce preventative maintenance, and govern asset lifecycles from acquisition to certified NIST 800-88 decommissioning.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mt-8 font-mono">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 hover:brightness-105 transition"
              >
                EXPLORE LIVE DEMO <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm transition"
              >
                START FREE TRIAL
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-7 text-xs font-mono text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> 12,482 Monitored Assets
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> 70% Repair-to-Value Rule
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> Real-Time Nationwide GIS
              </span>
            </div>
          </div>

          {/* Luminous Flight Deck Hub Card */}
          <div className="bg-white/95 border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-indigo-100/60 backdrop-blur-2xl relative font-mono overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 ring-4 ring-cyan-100 animate-pulse" />
                <span className="text-xs font-bold text-slate-800 tracking-wider">
                  FLEET TELEMETRY // PRODUCTION
                </span>
              </div>
              <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                12,482 Assets Live
              </span>
            </div>

            {/* Vibrant KPI Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { v: "12,482", l: "Monitored", c: "text-slate-900", bg: "bg-slate-50 border-slate-200" },
                { v: "96.4%", l: "Uptime", c: "text-emerald-600", bg: "bg-emerald-50/70 border-emerald-200" },
                { v: "₦428M", l: "Net Value", c: "text-cyan-700", bg: "bg-cyan-50/70 border-cyan-200" },
                { v: "₦41M", l: "CapEx Due", c: "text-indigo-700", bg: "bg-indigo-50/70 border-indigo-200" },
              ].map((item) => (
                <div key={item.l} className={`rounded-2xl border p-2.5 ${item.bg}`}>
                  <div className={`text-lg sm:text-xl font-black ${item.c}`}>{item.v}</div>
                  <div className="text-[9.5px] uppercase font-bold text-slate-500 mt-0.5 tracking-wider">{item.l}</div>
                </div>
              ))}
            </div>

            {/* Split Visual HUD */}
            <div className="grid sm:grid-cols-[1.2fr_1fr] gap-3">
              {/* FinOps 70% Rule Monitor */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-bold text-slate-600 uppercase">FinOps 70% Repair Rule</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Threshold Flagged
                  </span>
                </div>
                <div className="space-y-1.5 my-1">
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex border border-slate-200">
                    <div className="h-full bg-cyan-500 shadow-sm" style={{ width: "70%" }} />
                    <div className="h-full bg-rose-500 animate-pulse shadow-sm" style={{ width: "16%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-sans font-medium">
                    <span>Safe Repair Budget (70%)</span>
                    <span className="text-rose-600 font-mono font-bold">WO-29381 Quoted: 86%</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 border-t border-slate-200 pt-2 mt-2 flex justify-between">
                  <span>Diverted to CapEx:</span>
                  <span className="text-cyan-700 font-bold">₦480,000 Recovered</span>
                </div>
              </div>

              {/* Real-time Live Event Stream */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
                <div className="flex items-center gap-1.5 text-[10.5px] text-cyan-700 mb-2 font-bold uppercase">
                  <Radio className="h-2.5 w-2.5 text-cyan-600 animate-ping" />
                  Live Maintenance Feed
                </div>
                <LiveFeed />
              </div>
            </div>

            {/* Nationwide Coordinates Banner */}
            <div className="mt-3 p-2.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-600" />
                <span className="text-slate-600 text-xs font-medium font-sans">Hubs: Lagos HQ Data Center (5,410), Abuja Regional (4,120), Port Harcourt (2,952)</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-800 font-mono bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                NATIONWIDE FLEET
              </span>
            </div>
          </div>
        </Sec>
      </div>

      {/* 2. SECTOR HUBS BANNER */}
      <div className="border-b border-slate-200/80 bg-white py-6 relative z-10 font-mono">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-[10.5px] uppercase tracking-widest text-slate-400 font-bold mb-4">
            MISSION-CRITICAL ENTERPRISE INFRASTRUCTURE
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { title: "Commercial Banking", desc: "Sub-minute branch & ATM uptime", color: "border-blue-200 bg-blue-50/50" },
              { title: "Diagnostic Networks", desc: "Life-critical clinical terminals", color: "border-emerald-200 bg-emerald-50/50" },
              { title: "Higher Education", desc: "10,000+ campus lab computers", color: "border-purple-200 bg-purple-50/50" },
              { title: "Public Sector MDAs", desc: "Zero ghost hardware & 5-yr CapEx", color: "border-amber-200 bg-amber-50/50" },
            ].map((sector) => (
              <div key={sector.title} className={`p-3.5 rounded-2xl border ${sector.color} hover:shadow-md transition`}>
                <div className="font-bold text-sm text-slate-900">{sector.title}</div>
                <div className="text-xs text-slate-500 mt-0.5 font-sans">{sector.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. THE HARDWARE FINOPS CHALLENGE */}
      <Sec id="problem">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-3">
            <BarChart3 className="h-3.5 w-3.5 text-rose-600" />
            <span>The FinOps Dilemma</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Unmonitored enterprise hardware bleeds millions in untracked repair cycles.
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base font-sans">
            Pouring maintenance budget into equipment past its economic lifecycle creates runaway operational loss.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 font-mono">
          {/* Legacy Primitive Way */}
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="inline-flex items-center gap-1.5 text-rose-700 text-xs uppercase font-black tracking-wider bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              ✕ Legacy Spreadsheet & Ticketing Model
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-sans">Runaway Costs & Asset Blindspots</h3>
            <ul className="space-y-3 text-xs text-slate-600 font-sans">
              {[
                "Paying ₦1.6M to repeatedly repair a server with residual book value of only ₦1.8M",
                "Ghost laptops and desktop towers sitting on asset ledgers years after disappearing",
                "Reactive emergency breakdowns causing multi-hour branch outages during peak business hours",
                "Retired storage drives discarded or swapped without verified NIST 800-88 sanitization certificates",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-black mt-0.5">✕</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AssetOps Intelligent Way */}
          <div className="bg-white border-2 border-cyan-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/20">
            <div className="inline-flex items-center gap-1.5 text-cyan-800 text-xs uppercase font-black tracking-wider bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
              ✓ AssetOps Intelligent FinOps Model
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-sans">Disciplined Hardware Financial Governance</h3>
            <ul className="space-y-3 text-xs text-slate-700 font-sans font-medium">
              {[
                "Automatic 70% FinOps Rule flags repeat repair quotes and diverts capital to fresh procurement",
                "Real-time GIS tracks headquarter data centers and regional branch terminals on one dashboard",
                "Automated Preventative Maintenance routines dispatch technicians weeks before component failure",
                "NIST SP 800-88 certified media sanitization with tamper-proof PDF audit certificates",
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

      {/* 4. FEATURE PILLARS (TABS) */}
      <Sec id="features" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Layers className="h-3.5 w-3.5 text-cyan-600" />
            <span>Intelligent Subsystems</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Engineered for enterprise scale, financial rigor, and speed.
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base font-sans">
            Explore the five core engines that govern your physical ICT infrastructure.
          </p>
        </div>

        <FeatureTabs />
      </Sec>

      {/* 5. HARDWARE FINOPS SIMULATOR */}
      <Sec id="calculator" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Cpu className="h-3.5 w-3.5 text-cyan-600" />
            <span>FinOps Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Model your enterprise hardware cost recovery.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans">
            Adjust fleet parameters to calculate estimated maintenance savings and CapEx recovery.
          </p>
        </div>

        <RoiCalculator />
      </Sec>

      {/* 6. NATIONWIDE FLEET GIS SPOTLIGHT */}
      <Sec id="gis" className="border-t border-slate-200/80">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
              <Globe2 className="h-3.5 w-3.5 text-teal-600" />
              <span>Zero-License Fleet GIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
              Headquarter data centers to regional branches on one interactive map.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              Managing physical IT infrastructure requires geospatial clarity. AssetOps connects central server rooms, campus faculties, and remote state offices on high-speed vector tiles with zero third-party Google Maps or Mapbox license fees.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium font-sans">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Zero commercial map billing: runs on high-performance open-source Leaflet</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Real-time location clustering with room and rack level asset counts</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Status color coding: green for operational, amber for scheduled PM, red for critical outage</span>
              </div>
            </div>
            <div className="pt-3 font-mono">
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition"
              >
                Inspect Nationwide Fleet Map <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* GIS Hubs Telemetry Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl shadow-slate-200/50 font-mono">
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
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Port Harcourt</div>
                  <div className="font-bold text-slate-900 mt-0.5">2,952 Assets</div>
                  <span className="text-[10px] text-indigo-700 font-bold">Coastal Hub</span>
                </div>
              </div>
              <p className="text-[11.5px] text-slate-500 text-center font-sans">
                Leaflet GIS telemetry streams live updates across desktop browsers and mobile field devices.
              </p>
            </div>
          </div>
        </div>
      </Sec>

      {/* 7. INDUSTRY SECTORS */}
      <Sec id="solutions" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Building className="h-3.5 w-3.5 text-cyan-600" />
            <span>Enterprise Sector Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Built for institutions where hardware downtime is unacceptable.
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base font-sans">
            Select your sector below to see tailored preventative workflows and proven financial impact.
          </p>
        </div>

        <IndustrySolutions />
      </Sec>

      {/* 8. GROQ AI COPILOT */}
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
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              AssetOps connects Groq&apos;s lightning-fast Llama 3 engine directly to physical hardware records. The Copilot diagnoses spend anomalies and surfaces overdue preventative maintenance, but it never fabricates facts. If data isn&apos;t in your PostgreSQL database, it reports no record found.
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
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-2xl shadow-indigo-100/50 font-mono">
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
                Lagos spend increased by <strong className="text-slate-900">₦1.84M</strong> across 42 maintenance tickets. Driven primarily by repetitive fan tray and power supply repairs on 14 Dell PowerEdge R740 servers now past 4.8 years of age.
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

      {/* 9. CRYPTOGRAPHIC PROOF & GOVERNANCE */}
      <Sec id="security" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
            <Shield className="h-3.5 w-3.5 text-slate-700" />
            <span>Governance & Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Defend every hardware metric before internal and external auditors.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans">
            Mathematical, cryptographic, and operational proof anchored to tamper-proof records.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {[
            { icon: KeyRound, title: "Six-Tier Enterprise RBAC", desc: "Admin, IT Lead, Field Tech, Procurement, Auditor, Read-Only." },
            { icon: ScrollText, title: "Immutable Audit Log", desc: "Append-only record of every status change, custody transfer, and sign-off." },
            { icon: Database, title: "PostgreSQL Isolation", desc: "Every query scoped strictly to your organization tenant ID." },
            { icon: FileBadge, title: "NIST SP 800-88 Standard", desc: "Cryptographic proof of irreversible storage drive media sanitization." },
            { icon: Download, title: "One-Click ERP Export", desc: "Direct feeds formatted for SAP, Oracle, and Microsoft Dynamics." },
            { icon: Lock, title: "Encrypted Data Enclave", desc: "AES-256 encryption at rest and TLS 1.3 encryption in transit." },
            { icon: QrCode, title: "Digital QR Passports", desc: "Scan physical hardware with any smartphone camera for instant history." },
            { icon: Timer, title: "Multi-Year Retention", desc: "Preserve lifecycle maintenance histories for warranty and dispute defense." },
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

      {/* 10. PRICING TIERS */}
      <Sec id="pricing" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Coins className="h-3.5 w-3.5 text-cyan-600" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Predictable, transparent licensing.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans">
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
                href="/sign-up"
                className="w-full inline-flex items-center justify-center py-3 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 transition"
              >
                START FREE
              </Link>
            </div>
          </div>

          {/* Professional Tier */}
          <div className="bg-white border-2 border-cyan-400 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-500/10 ring-2 ring-cyan-500/20 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 text-[10.5px] font-black uppercase text-white bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 px-3.5 py-0.5 rounded-full shadow-md shadow-cyan-500/30">
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
                  "5-Year CapEx Replacement Forecaster",
                  "Automated Preventative Maintenance Scheduler",
                  "NIST SP 800-88 Certified Media Decommissioning",
                  "Groq Llama 3 AI Telemetry Copilot",
                  "Automated CSV/Excel & ERP data export",
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
                href="/sign-up"
                className="w-full inline-flex items-center justify-center py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 text-white shadow-md hover:brightness-105 transition"
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
                className="w-full inline-flex items-center justify-center py-3 rounded-2xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white transition"
              >
                CONTACT ENTERPRISE DESK
              </Link>
            </div>
          </div>
        </div>
      </Sec>

      {/* 11. FAQ */}
      <Sec id="faq" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-600" />
            <span>Enterprise FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Frequently asked questions.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans">
            Clear technical and financial answers for IT Directors, CIOs, and CFOs.
          </p>
        </div>

        <FaqAccordion />
      </Sec>

      {/* 12. FINAL HIGH-IMPACT CTA */}
      <Sec className="border-t border-slate-200/80 text-center py-16 sm:py-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl font-mono">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-[1.12] relative font-sans">
            Stop losing millions to untracked IT hardware and runaway repairs.
          </h2>
          <p className="text-slate-300 text-base mt-4 max-w-xl mx-auto relative font-sans font-normal">
            Take control of your enterprise infrastructure with mathematical FinOps precision, automated preventative maintenance, and instant compliance proof.
          </p>

          <div className="flex justify-center flex-wrap gap-4 mt-8 relative">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 text-slate-950 shadow-md hover:brightness-105 transition"
            >
              START FREE WITH ASSETOPS <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
            >
              EXPLORE LIVE PLATFORM
            </Link>
          </div>

          <div className="mt-5 text-xs text-slate-400 relative font-sans">
            Enterprise hardware tracking across nationwide offices and client project sites.
          </div>
        </div>
      </Sec>

      {/* 13. FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white relative z-10 font-mono">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Logo />
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-sans">
              Enterprise ICT Hardware FinOps & Lifecycle Intelligence
            </span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-6 text-xs text-slate-600 font-bold font-sans">
            <a href="#features" className="hover:text-cyan-600 transition">Subsystems</a>
            <a href="#calculator" className="hover:text-cyan-600 transition">FinOps</a>
            <a href="#gis" className="hover:text-cyan-600 transition">Nationwide GIS</a>
            <a href="#solutions" className="hover:text-cyan-600 transition">Sectors</a>
            <a href="#pricing" className="hover:text-cyan-600 transition">Tiers</a>
            <a href="#faq" className="hover:text-cyan-600 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-sm animate-pulse" />
              <span>TELEMETRY ENGINE: ONLINE</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">© ASSETOPS</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
