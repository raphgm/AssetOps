import Link from "next/link";
import {
  ArrowRight,
  Check,
  Lock,
  ScrollText,
  ShieldCheck,
  Database,
  KeyRound,
  Download,
  Timer,
  QrCode,
  Sparkles,
  MapPin,
  Coins,
  Shield,
  FileBadge,
  Building,
  HelpCircle,
  BarChart3,
  Layers,
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
    className={`max-w-6xl mx-auto px-4 py-16 sm:py-24 scroll-mt-16 ${className}`}
  >
    {children}
  </section>
);

export default function Landing() {
  return (
    <div className="bg-slate-50/80 text-slate-900 min-h-screen selection:bg-teal-200 font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden pt-28 sm:pt-36 pb-14 border-b border-slate-200/80">
        {/* Radiant luminous gradient mesh */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-teal-200/40 via-cyan-200/35 to-indigo-200/30 rounded-full blur-[100px] pointer-events-none -z-10"
          aria-hidden
        />
        <div
          className="absolute top-1/4 right-10 w-[450px] h-[350px] bg-emerald-200/30 rounded-full blur-[90px] pointer-events-none -z-10"
          aria-hidden
        />

        <Sec className="py-0 sm:py-6 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-200 bg-white shadow-sm text-teal-800 text-xs font-bold mb-6">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              <span>Next-Gen Hardware FinOps & GIS Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] text-slate-950">
              Hardware intelligence.{" "}
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                Zero blind spots.
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg mt-5 max-w-xl leading-relaxed font-normal">
              One source of truth for every ICT asset, repair cost, geospatial location, and certified retirement. Cut wasteful repairs with automated FinOps intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 hover:opacity-95 transition"
              >
                Launch Live Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-sm transition"
              >
                Start Free Workspace
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-teal-600" /> No credit card needed
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-teal-600" /> Pre-loaded 5,100+ assets
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-teal-600" /> Free Leaflet GIS
              </span>
            </div>
          </div>

          {/* Clean Bright Preview Card */}
          <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-slate-200/80 backdrop-blur relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  AssetOps Live Hub
                </span>
              </div>
              <span className="text-[10.5px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 font-mono">
                5,100+ Nodes Live
              </span>
            </div>

            {/* Bright KPI Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { v: "12,482", l: "Total Assets", c: "text-slate-900", bg: "bg-slate-50 border-slate-200" },
                { v: "96.4%", l: "Operational", c: "text-emerald-600", bg: "bg-emerald-50/60 border-emerald-200/70" },
                { v: "₦428M", l: "Net Value", c: "text-teal-700", bg: "bg-teal-50/60 border-teal-200/70" },
                { v: "₦41M", l: "CapEx Due", c: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/70" },
              ].map((item) => (
                <div key={item.l} className={`rounded-xl border p-2.5 ${item.bg}`}>
                  <div className={`text-lg sm:text-xl font-black font-mono ${item.c}`}>{item.v}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5 tracking-wider">{item.l}</div>
                </div>
              ))}
            </div>

            {/* Split Mini Cards */}
            <div className="grid sm:grid-cols-[1.2fr_1fr] gap-3">
              {/* FinOps Mini Bar Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-600 uppercase">FinOps Repair Threshold</span>
                  <span className="text-[10px] font-bold font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    88% Flagged
                  </span>
                </div>
                <div className="space-y-1.5 my-1">
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="h-full bg-teal-500" style={{ width: "70%" }} />
                    <div className="h-full bg-rose-500 animate-pulse" style={{ width: "18%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Safe repairs (0-70%)</span>
                    <span className="text-rose-600 font-bold">Replace triggered</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-2 mt-2 flex justify-between">
                  <span>Replacement Window:</span>
                  <span className="text-slate-900 font-bold font-mono">Q2 2026</span>
                </div>
              </div>

              {/* Live Activity Feed */}
              <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2 font-bold uppercase">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" aria-hidden />
                  Live Event Stream
                </div>
                <LiveFeed />
              </div>
            </div>

            {/* Map Mini Banner */}
            <div className="mt-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-600" />
                <span className="text-slate-600 text-xs font-medium">GIS Nodes: Lagos, Abuja, Port Harcourt, Ibadan</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-700 font-mono bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                CARTO DARK
              </span>
            </div>
          </div>
        </Sec>
      </div>

      {/* 2. SECTORS TRUST BANNER */}
      <div className="border-b border-slate-200/80 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-4">
            Deployed Across Mission-Critical Infrastructure
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { title: "Commercial Banks", desc: "Core switch stacks & ATM uptime", color: "text-blue-700 bg-blue-50 border-blue-200" },
              { title: "Tertiary Hospitals", desc: "Biomedical & ICU telemetry", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
              { title: "Universities", desc: "Multi-campus lab management", color: "text-purple-700 bg-purple-50 border-purple-200" },
              { title: "Government MDAs", desc: "Phantom asset & audit defense", color: "text-amber-700 bg-amber-50 border-amber-200" },
            ].map((sector) => (
              <div key={sector.title} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70">
                <div className="font-bold text-sm text-slate-900">{sector.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{sector.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PROBLEM VS SOLUTION */}
      <Sec id="problem">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-3">
            <BarChart3 className="h-3.5 w-3.5 text-rose-600" />
            <span>The Hardware Problem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Spreadsheets don&apos;t know when hardware is financially dead.
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            IT teams keep paying contractor repair bills without knowing the asset already exceeded 70% of its residual value.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Legacy Card */}
          <div className="bg-white border-2 border-rose-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="inline-flex items-center gap-1.5 text-rose-700 text-xs uppercase font-black tracking-wider bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              ✕ The Reactive Spreadsheet Way
            </div>
            <h3 className="text-xl font-bold text-slate-900">Blind Spending & Audit Queries</h3>
            <ul className="space-y-3 text-xs text-slate-600">
              {[
                "Paying ₦400k to fix a laptop with a residual book value of only ₦200k",
                "Phantom / ghost assets sitting on the balance sheet years after disappearing",
                "Core switches failing unexpectedly during critical banking or exam hours",
                "Discarded hard drives thrown out without cryptographic wipe certificates",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-black mt-0.5">✕</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AssetOps Card */}
          <div className="bg-white border-2 border-teal-300 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md shadow-teal-500/5 ring-1 ring-teal-500/20">
            <div className="inline-flex items-center gap-1.5 text-teal-800 text-xs uppercase font-black tracking-wider bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              ✓ The AssetOps FinOps Way
            </div>
            <h3 className="text-xl font-bold text-slate-900">Deterministic & Audit-Proof</h3>
            <ul className="space-y-3 text-xs text-slate-700 font-medium">
              {[
                "Automatic 70% threshold stops bad repairs and alerts management immediately",
                "Live Leaflet GIS map with pin-dropping verifies physical branch presence",
                "Automated 90-day preventative maintenance schedules prevent downtime",
                "NIST 800-88 cryptographic sanitization certificates with SHA-256 digests",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sec>

      {/* 4. FEATURE PILLARS (TABS) */}
      <Sec id="features" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Layers className="h-3.5 w-3.5 text-cyan-600" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Engineered for physical hardware realities.
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Click through the five core engines that govern your hardware lifecycle from unboxing to retirement.
          </p>
        </div>

        <FeatureTabs />
      </Sec>

      {/* 5. FINOPS ROI CALCULATOR */}
      <Sec id="calculator" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-3">
            <Coins className="h-3.5 w-3.5 text-teal-600" />
            <span>Cost Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Calculate your hardware cost recovery.
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            Drag the sliders to see how much capital your institution can recover this year.
          </p>
        </div>

        <RoiCalculator />
      </Sec>

      {/* 6. GIS MAP SPOTLIGHT */}
      <Sec id="gis" className="border-t border-slate-200/80">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold">
              <MapPin className="h-3.5 w-3.5 text-cyan-600" />
              <span>Free Leaflet GIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Interactive estate mapping. Zero map API fees.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Managing distributed hardware requires geospatial context. AssetOps comes out of the box with zero-config Leaflet maps featuring CARTO Dark vector tiles, proportional risk clusters, and an interactive pin-drop picker.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                <span>Zero Google Maps billing: uses free OpenStreetMap and CARTO vector tiles</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                <span>Click-to-drop coordinate picker with Nigerian city presets and device GPS support</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                <span>Proportional bubble clusters that turn amber/red during hardware failures</span>
              </div>
            </div>
            <div className="pt-3">
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm transition"
              >
                View Full Location Fleet <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* GIS Visual Graphic */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-slate-800">NATIONWIDE ASSET CLUSTERS</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-700 font-mono bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                REAL-TIME GPS
              </span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Lagos HQ</div>
                  <div className="font-bold text-slate-900 mt-0.5">2,410 Units</div>
                  <span className="text-[10px] text-emerald-700 font-bold">97.2% Normal</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Abuja DC</div>
                  <div className="font-bold text-slate-900 mt-0.5">1,842 Units</div>
                  <span className="text-[10px] text-amber-700 font-bold">3 PM Due</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Port Harcourt</div>
                  <div className="font-bold text-slate-900 mt-0.5">850 Units</div>
                  <span className="text-[10px] text-rose-700 font-bold">1 Urgent WO</span>
                </div>
              </div>
              <p className="text-[11.5px] text-slate-500 text-center font-medium">
                Leaflet tiles render smoothly across mobile and desktop without external API tokens.
              </p>
            </div>
          </div>
        </div>
      </Sec>

      {/* 7. INDUSTRY SOLUTIONS */}
      <Sec id="solutions" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-3">
            <Building className="h-3.5 w-3.5 text-blue-600" />
            <span>Tailored Sector Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Built for institutions where downtime is not an option.
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Select your organization below to see customized compliance workflows and impact benchmarks.
          </p>
        </div>

        <IndustrySolutions />
      </Sec>

      {/* 8. EVIDENCE-BACKED AI ENGINE (GROQ LLM) */}
      <Sec className="border-t border-slate-200/80">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Zero-Hallucination AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Ask your maintenance data anything. Backed by evidence.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              AssetOps combines Groq&apos;s high-speed Llama 3 engine with strict database ground truth. The AI explains patterns and answers natural-language questions, but it will never invent numbers. If evidence isn&apos;t in your database, it says so.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Deterministic queries only: the model never fabricates metrics</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Every claim links to verified work order numbers and timestamps</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Strict tenant isolation: your institutional data never leaks or trains models</span>
              </div>
            </div>
          </div>

          {/* AI Chat Preview */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">AI Copilot · Evidence Grounded</span>
              <span className="text-[10px] font-bold text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Groq Llama 3
              </span>
            </div>

            <div className="ml-auto max-w-[85%] rounded-2xl bg-slate-900 text-white px-4 py-2.5 text-xs font-medium">
              Why did Lagos branch maintenance spend surge 22% this quarter?
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-900 font-bold">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Synthesized Diagnosis:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Lagos spend rose by <strong className="text-slate-900">₦1.84M</strong> across 42 work orders. Driven by repetitive battery replacements on 18 workstations reaching 4.8 years of age.
              </p>

              <div className="border-t border-slate-200 pt-2 space-y-1 text-[11px] text-slate-700 font-mono">
                <div>• WO-84920 to WO-84938 (UPS Battery Replacements)</div>
                <div>• Vendor: PowerTech Solutions (Avg turn-around 3.2 days)</div>
                <div className="text-rose-700 font-bold">• FinOps Status: 14 units breached 70% NBV threshold</div>
              </div>

              <div className="pt-2 flex gap-2">
                <Link
                  href="/app/finops"
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  View FinOps Remediation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Sec>

      {/* 9. SECURITY & GOVERNANCE */}
      <Sec id="security" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
            <Shield className="h-3.5 w-3.5 text-slate-700" />
            <span>Governance & Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Defend every number before internal and external auditors.
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            Strict mathematical, cryptographic, and operational transparency across every process.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: KeyRound, title: "Six-Tier RBAC", desc: "Admin, Lead Tech, Technician, Manager, Auditor, Viewer." },
            { icon: ScrollText, title: "Immutable Audit Log", desc: "Append-only record of every work order and config update." },
            { icon: Database, title: "Tenant Isolation", desc: "Every query scoped strictly to your organization ID." },
            { icon: FileBadge, title: "NIST 800-88 Proof", desc: "Tamper-evident certificates for certified data sanitization." },
            { icon: Download, title: "One-Click ERP Export", desc: "CSV & JSON feeds formatted for SAP, Oracle, and Dynamics." },
            { icon: Lock, title: "Encrypted Secrets", desc: "Credentials stored in server environment variables only." },
            { icon: QrCode, title: "Signed QR Passports", desc: "Codes contain signed tokens, not raw exposed database IDs." },
            { icon: Timer, title: "Configurable Retention", desc: "Preserve maintenance histories for warranty disputes." },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                <Icon className="h-5 w-5 text-teal-600 mb-2" />
                <div className="font-bold text-sm text-slate-900">{item.title}</div>
                <div className="text-slate-500 text-xs mt-1 leading-snug">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </Sec>

      {/* 10. PRICING */}
      <Sec id="pricing" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-3">
            <Coins className="h-3.5 w-3.5 text-teal-600" />
            <span>Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Simple, predictable pricing.
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            Full access to FinOps calculations, GIS mapping, and QR passports across all plans.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400 font-mono">Starter / Pilot</div>
              <div className="text-3xl font-black text-slate-900 mt-2 font-mono">Free</div>
              <p className="text-slate-500 text-xs mt-1">For single-site ICT teams evaluating AssetOps.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-medium">
                {[
                  "Up to 500 monitored hardware assets",
                  "Core Leaflet GIS map with pin-dropping",
                  "Digital QR Passports & mobile work orders",
                  "Deterministic health scoring",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-teal-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-900 transition"
              >
                Start Free
              </Link>
            </div>
          </div>

          {/* Professional Plan */}
          <div className="bg-white border-2 border-teal-400 rounded-2xl p-6 sm:p-7 shadow-xl shadow-teal-500/10 ring-2 ring-teal-500/20 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 text-[10.5px] font-mono font-black uppercase text-white bg-gradient-to-r from-teal-600 to-cyan-600 px-3 py-0.5 rounded-full shadow-sm">
              MOST POPULAR
            </span>
            <div>
              <div className="text-xs uppercase font-bold text-teal-700 font-mono">Professional</div>
              <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
                ₦150,000 <span className="text-xs text-slate-500 font-normal font-sans">/ month</span>
              </div>
              <p className="text-slate-500 text-xs mt-1">For multi-branch banks, colleges, and regional clinics.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-800 font-medium">
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
                    <Check className="h-4 w-4 text-teal-600 shrink-0" />
                    <span className="font-bold">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 text-white shadow-md hover:brightness-105 transition"
              >
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400 font-mono">Enterprise & Sovereign</div>
              <div className="text-3xl font-black text-slate-900 mt-2 font-mono">Custom</div>
              <p className="text-slate-500 text-xs mt-1">For national banking fleets, universities & government MDAs.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-medium">
                {[
                  "Unlimited hardware assets & branches",
                  "Multi-organization tenant federation",
                  "On-premise / Sovereign PostgreSQL deployment",
                  "Custom IFRS / GAAP depreciation algorithms",
                  "Dedicated SLA & 24/7 incident engineer",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-teal-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href="/sign-in"
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>
      </Sec>

      {/* 11. FAQ */}
      <Sec id="faq" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-slate-600" />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Frequently answered questions.
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            Common questions from IT Directors and Finance Controllers.
          </p>
        </div>

        <FaqAccordion />
      </Sec>

      {/* 12. FINAL HIGH-IMPACT CTA */}
      <Sec className="border-t border-slate-200/80 text-center py-16 sm:py-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-[1.12] relative">
            Stop losing millions to invisible hardware degradation.
          </h2>
          <p className="text-slate-300 text-base mt-4 max-w-xl mx-auto relative font-normal">
            Govern physical hardware with mathematical precision and zero audit surprises.
          </p>

          <div className="flex justify-center flex-wrap gap-3.5 mt-8 relative">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 text-slate-950 shadow-lg hover:brightness-105 transition"
            >
              Start Free Workspace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
            >
              Explore Live Demo
            </Link>
          </div>

          <div className="mt-5 text-xs text-slate-400 relative">
            Live demo includes 5,100+ pre-seeded assets across Nigeria. Instant access.
          </div>
        </div>
      </Sec>

      {/* 13. BRIGHT MODERN FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Logo light />
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-medium">
              Hardware FinOps & ICT Maintenance Intelligence
            </span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-6 text-xs text-slate-600 font-semibold">
            <a href="#features" className="hover:text-slate-950 transition">Features</a>
            <a href="#calculator" className="hover:text-slate-950 transition">FinOps ROI</a>
            <a href="#gis" className="hover:text-slate-950 transition">GIS Map</a>
            <a href="#solutions" className="hover:text-slate-950 transition">Solutions</a>
            <a href="#pricing" className="hover:text-slate-950 transition">Pricing</a>
            <a href="#faq" className="hover:text-slate-950 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>All Systems Operational</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">© 2026 AssetOps</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
