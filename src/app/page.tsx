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
  Bot,
  Orbit,
  Zap,
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
      {/* 2080 Luminous Prismatic Ambient Glows */}
      <div className="fixed inset-0 prismatic-mesh opacity-70 pointer-events-none z-0" aria-hidden />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-cyan-200/40 via-teal-200/30 to-indigo-200/35 rounded-full blur-[140px] pointer-events-none -z-10" aria-hidden />
      <div className="fixed bottom-0 right-10 w-[600px] h-[450px] bg-emerald-200/25 rounded-full blur-[140px] pointer-events-none -z-10" aria-hidden />

      <Navbar />

      {/* 1. 2080 MINIMAL MODERN HERO SECTION */}
      <div className="relative pt-28 sm:pt-36 pb-16 border-b border-slate-200/80">
        <Sec className="py-0 sm:py-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-200 bg-cyan-50/70 shadow-sm text-cyan-800 text-xs font-mono font-bold mb-6">
              <Radio className="h-3.5 w-3.5 text-cyan-600 animate-pulse" />
              <span>QUANTUM-SPATIAL OS // 2080 ENTERPRISE GRID</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] text-slate-950 font-sans">
              Autonomous hardware.{" "}
              <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
                Zero thermodynamic waste.
              </span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg mt-5 max-w-xl leading-relaxed font-sans font-normal">
              The 2080 planetary operating system for Quantum Cores, Photonic Mesh Arrays, and Autonomous Nanite Swarms. Halt molecular lattice decoherence and govern sub-atomic depreciation across planetary and orbital hubs.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mt-8 font-mono">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 hover:brightness-105 transition"
              >
                INITIALIZE NEURAL PILOT <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm transition"
              >
                DEPLOY SOVEREIGN NODE
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-7 text-xs font-mono text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> Sub-ms Entanglement Lock
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> 48,920 Pre-Seeded Cores
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-600" /> Free Planetary GIS
              </span>
            </div>
          </div>

          {/* 2080 Luminous Flight Deck Hub Card */}
          <div className="bg-white/95 border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-indigo-100/60 backdrop-blur-2xl relative font-mono overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 ring-4 ring-cyan-100 animate-pulse" />
                <span className="text-xs font-bold text-slate-800 tracking-wider">
                  QUANTUM TELEMETRY // SECTOR-01
                </span>
              </div>
              <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                48,920 Cores Live
              </span>
            </div>

            {/* 2080 Vibrant KPI Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { v: "48,920", l: "Active QPUs", c: "text-slate-900", bg: "bg-slate-50 border-slate-200" },
                { v: "99.999%", l: "Coherence", c: "text-emerald-600", bg: "bg-emerald-50/70 border-emerald-200" },
                { v: "Ꞙ2.4B", l: "Q-FLOP Yield", c: "text-cyan-700", bg: "bg-cyan-50/70 border-cyan-200" },
                { v: "-0.002%", l: "Entropy Flux", c: "text-indigo-700", bg: "bg-indigo-50/70 border-indigo-200" },
              ].map((item) => (
                <div key={item.l} className={`rounded-2xl border p-2.5 ${item.bg}`}>
                  <div className={`text-lg sm:text-xl font-black ${item.c}`}>{item.v}</div>
                  <div className="text-[9.5px] uppercase font-bold text-slate-500 mt-0.5 tracking-wider">{item.l}</div>
                </div>
              ))}
            </div>

            {/* Split Visual HUD */}
            <div className="grid sm:grid-cols-[1.2fr_1fr] gap-3">
              {/* Nanite & Lattice Decay Monitor */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-bold text-slate-600 uppercase">Molecular Lattice Decay</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    14% Threshold Exceeded
                  </span>
                </div>
                <div className="space-y-1.5 my-1">
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex border border-slate-200">
                    <div className="h-full bg-cyan-500 shadow-sm" style={{ width: "70%" }} />
                    <div className="h-full bg-rose-500 animate-pulse shadow-sm" style={{ width: "18%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-sans font-medium">
                    <span>Safe Coherence Zone</span>
                    <span className="text-rose-600 font-mono font-bold">Plasma Recycling Active</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 border-t border-slate-200 pt-2 mt-2 flex justify-between">
                  <span>Atomic Salvage Credit:</span>
                  <span className="text-cyan-700 font-bold">Ꞙ420,000</span>
                </div>
              </div>

              {/* Real-time 2080 Live Event Stream */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
                <div className="flex items-center gap-1.5 text-[10.5px] text-cyan-700 mb-2 font-bold uppercase">
                  <Radio className="h-2.5 w-2.5 text-cyan-600 animate-ping" />
                  Autonomous Nanite Log
                </div>
                <LiveFeed />
              </div>
            </div>

            {/* Planetary Coordinates Banner */}
            <div className="mt-3 p-2.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-cyan-600" />
                <span className="text-slate-600 text-xs font-medium font-sans">Arrays: Lagos Trench, Abuja Fusion Core, Orbital Relay-Alpha</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-800 font-mono bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                PLANETARY MESH
              </span>
            </div>
          </div>
        </Sec>
      </div>

      {/* 2. 2080 SECTOR HUBS BANNER */}
      <div className="border-b border-slate-200/80 bg-white py-6 relative z-10 font-mono">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-[10.5px] uppercase tracking-widest text-slate-400 font-bold mb-4">
            MISSION-CRITICAL PLANETARY DEPLOYMENTS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { title: "Quantum Banking", desc: "Sub-picosecond entanglement", color: "border-blue-200 bg-blue-50/50" },
              { title: "Bio-Digital ICU Hubs", desc: "Synthetic organ telemetry", color: "border-emerald-200 bg-emerald-50/50" },
              { title: "Neural Academies", desc: "50,000+ holographic pods", color: "border-purple-200 bg-purple-50/50" },
              { title: "Fusion Grids & MDAs", desc: "Zero ghost fusion turbines", color: "border-amber-200 bg-amber-50/50" },
            ].map((sector) => (
              <div key={sector.title} className={`p-3.5 rounded-2xl border ${sector.color} hover:shadow-md transition`}>
                <div className="font-bold text-sm text-slate-900">{sector.title}</div>
                <div className="text-xs text-slate-500 mt-0.5 font-sans">{sector.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. THE 2080 ENTROPY CHALLENGE */}
      <Sec id="problem">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-3">
            <BarChart3 className="h-3.5 w-3.5 text-rose-600" />
            <span>The Entropy Hazard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Unmonitored quantum hardware bleeds trillions in thermodynamic waste.
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base font-sans">
            Spending nanite repair energy on a molecularly degraded QPU array creates negative thermodynamic return.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 font-mono">
          {/* Legacy Primitive Way */}
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="inline-flex items-center gap-1.5 text-rose-700 text-xs uppercase font-black tracking-wider bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              ✕ Primitive Human-Manual Model
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-sans">Lattice Decoherence & Capital Drift</h3>
            <ul className="space-y-3 text-xs text-slate-600 font-sans">
              {[
                "Paying Ꞙ4M in nanite energy to repair a crystal with residual coherence yield of only Ꞙ1.5M",
                "Ghost quantum substrates sitting on planetary ledgers decades after being vaporized",
                "Atmospheric solar flares causing desynchronization during trillion-credit trading cycles",
                "Retired photonic cores discarded without verified molecular lattice dissolution proof",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-black mt-0.5">✕</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2080 Autonomous Way */}
          <div className="bg-white border-2 border-cyan-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/20">
            <div className="inline-flex items-center gap-1.5 text-cyan-800 text-xs uppercase font-black tracking-wider bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
              ✓ Autonomous AssetOps 2080 Model
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-sans">Zero Thermodynamic Loss</h3>
            <ul className="space-y-3 text-xs text-slate-700 font-sans font-medium">
              {[
                "Automatic 14% Thermodynamic Rule diverts decaying QPUs directly to plasma recycling",
                "Planetary 3D GIS locks ground vaults, deep-sea trenches, and orbital satellite rings",
                "Autonomous Nanite Swarms perform laser micro-welds before molecular decoherence spreads",
                "IGDS-2079 certified molecular dissolution with irreversible quantum hash signatures",
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
            <span>Autonomous Subsystems</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Engineered for quantum, orbital, and bio-photonic realities.
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base font-sans">
            Explore the five self-healing engines that govern your planetary compute estate.
          </p>
        </div>

        <FeatureTabs />
      </Sec>

      {/* 5. QUANTUM FINOPS SIMULATOR */}
      <Sec id="calculator" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Cpu className="h-3.5 w-3.5 text-cyan-600" />
            <span>Quantum Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Model your cycle thermodynamic recovery.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans">
            Adjust the substrate sliders to project Q-FLOP yield and plasma recycling salvage credits.
          </p>
        </div>

        <RoiCalculator />
      </Sec>

      {/* 6. PLANETARY GIS SPOTLIGHT */}
      <Sec id="gis" className="border-t border-slate-200/80">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
              <Globe2 className="h-3.5 w-3.5 text-teal-600" />
              <span>Free Planetary Mesh GIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
              Ground vaults to orbital satellite rings on one holographic grid.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              Managing planetary infrastructure requires spatial coordination. AssetOps connects deep sub-oceanic trenches, terrestrial fusion arrays, and satellite constellations on high-speed vector tiles with zero third-party telemetry fees.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium font-sans">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Zero commercial satellite API fees: runs on open planetary orbital mesh</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Sub-millimeter coordinate locking for terrestrial, sub-oceanic, and orbital nodes</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Dynamic laser routing circles that illuminate red during radiation flare interference</span>
              </div>
            </div>
            <div className="pt-3 font-mono">
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition"
              >
                Inspect Planetary Fleet Array <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Planetary GIS Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl shadow-slate-200/50 font-mono">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900">PLANETARY MESH TELEMETRY</span>
              </div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                ACTIVE 4D RETICLE
              </span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Lagos Trench</div>
                  <div className="font-bold text-slate-900 mt-0.5">2,410 QPUs</div>
                  <span className="text-[10px] text-emerald-700 font-bold">Cryo 4.2K</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Abuja Fusion</div>
                  <div className="font-bold text-slate-900 mt-0.5">1,842 QPUs</div>
                  <span className="text-[10px] text-cyan-700 font-bold">5.2 GW Grid</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Relay Alpha</div>
                  <div className="font-bold text-slate-900 mt-0.5">850 QPUs</div>
                  <span className="text-[10px] text-indigo-700 font-bold">Orbit 420km</span>
                </div>
              </div>
              <p className="text-[11.5px] text-slate-500 text-center font-sans">
                Leaflet GIS telemetry streams via sub-nanosecond quantum links across desktop & neural implants.
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
            <span>Sovereign Sector Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Built for institutions where decoherence is catastrophic.
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base font-sans">
            Select your sector below to see autonomous nanite protocols and verified thermodynamic impact.
          </p>
        </div>

        <IndustrySolutions />
      </Sec>

      {/* 8. SENTINEL AI COPILOT */}
      <Sec className="border-t border-slate-200/80">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono font-bold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Deterministic Sentinel AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
              Direct telemetry reasoning. Zero model hallucination.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              AssetOps connects Groq&apos;s lightning-fast Llama 3 engine directly to quantum sensor telemetry. The Sentinel diagnoses anomalies and prescribes nanite repair vectors, but it never fabricates physics. If telemetry isn&apos;t in your PostgreSQL database, it reports a phase-lock vacuum.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium font-sans">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Deterministic database queries: the sentinel never invents quantum states</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Every claim cites specific nanite work-order IDs and cryogenic sensors</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Strict neural tenant boundaries: your institutional telemetry never leaks</span>
              </div>
            </div>
          </div>

          {/* AI Sentinel Chat Preview */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-2xl shadow-indigo-100/50 font-mono">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase">SENTINEL COPILOT // REASONING HUD</span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                GROQ LLAMA 3
              </span>
            </div>

            <div className="ml-auto max-w-[85%] rounded-2xl bg-slate-900 text-white px-4 py-2.5 text-xs font-sans">
              Why did Lagos Oceanic Trench maintenance entropy surge 22% this solar cycle?
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-900 font-bold font-sans">
                <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
                <span>Synthesized Diagnostic Vector:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Lagos spend increased by <strong className="text-slate-900">Ꞙ1.84M Compute Credits</strong> across 42 nanite runs. Driven by repetitive waveguide micro-welds on 18 photonic QPUs reaching 4.8 solar cycles of age.
              </p>

              <div className="border-t border-slate-200 pt-2 space-y-1 text-[11px] text-slate-600">
                <div>• SWARM-84920 to SWARM-84938 (Waveguide Laser Welds)</div>
                <div>• Autonomous Swarm: PowerTech Robotics (Turnaround 3.2ms)</div>
                <div className="text-rose-700 font-bold">• 14 cores breached 14% Thermodynamic Rule: Divert to Plasma Salvage</div>
              </div>

              <div className="pt-2 flex gap-2">
                <Link
                  href="/app/finops"
                  className="px-3.5 py-2 rounded-xl text-[11px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
                >
                  Engage Plasma Remediation
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
            <span>Cryptographic Governance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Defend every quantum metric before planetary auditors.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans">
            Mathematical, cryptographic, and physical proof anchored to immutable ledger hashes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {[
            { icon: KeyRound, title: "Six-Tier Neural RBAC", desc: "Admin, Fleet Lead, Nanite Tech, Manager, Auditor, Drone View." },
            { icon: ScrollText, title: "Immutable Ledger Log", desc: "Append-only record of every nanite dispatch and purge state." },
            { icon: Database, title: "Quantum Isolation", desc: "Every query scoped strictly to sovereign organization ID." },
            { icon: FileBadge, title: "IGDS-2079 Standard", desc: "Cryptographic proof of irreversible molecular data dissolution." },
            { icon: Download, title: "One-Click Neural Export", desc: "Direct feeds formatted for Sovereign Treasury and SAP ledgers." },
            { icon: Lock, title: "Entangled Secrets", desc: "Quantum keys generated in hardware security enclaves only." },
            { icon: Radio, title: "Spatial AR Reticles", desc: "Hardware authenticated via neural eye-tracking biometric aura." },
            { icon: Timer, title: "Centennial Retention", desc: "Preserve hardware maintenance histories for dispute defense." },
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

      {/* 10. 2080 PRICING TIERS */}
      <Sec id="pricing" className="border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Coins className="h-3.5 w-3.5 text-cyan-600" />
            <span>Compute Credit Tiers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Transparent thermodynamic licensing.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans">
            Full access to Quantum FinOps, Planetary GIS, and Nanite Swarms across all tiers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 font-mono">
          {/* Sub-Orbital Pilot */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Sub-Orbital Pilot</div>
              <div className="text-3xl font-black text-slate-900 mt-2">Free</div>
              <p className="text-slate-500 text-xs mt-1 font-sans">For localized arrays testing AssetOps.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-sans font-medium">
                {[
                  "Up to 1,000 quantum sub-nodes",
                  "Planetary GIS map with coordinate locks",
                  "Volumetric AR Passports & nanite work orders",
                  "Deterministic coherence scoring",
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
                INITIALIZE PILOT
              </Link>
            </div>
          </div>

          {/* Commercial Quantum */}
          <div className="bg-white border-2 border-cyan-400 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-500/10 ring-2 ring-cyan-500/20 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 text-[10.5px] font-black uppercase text-white bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-600 px-3.5 py-0.5 rounded-full shadow-md shadow-cyan-500/30">
              MOST DEPLOYED
            </span>
            <div>
              <div className="text-xs uppercase font-bold text-cyan-800">Commercial Quantum</div>
              <div className="text-3xl font-black text-slate-950 mt-2">
                Ꞙ150,000 <span className="text-xs text-slate-500 font-normal font-sans">/ cycle</span>
              </div>
              <p className="text-slate-500 text-xs mt-1 font-sans">For multi-hub banks, clinics, and research academies.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-800 font-sans font-medium">
                {[
                  "Up to 25,000 monitored quantum cores",
                  "Full Thermodynamic FinOps & 14% Rule",
                  "8-Solar Cycle CapEx Replacement Forecaster",
                  "Autonomous Nanite Swarm Scheduler",
                  "IGDS-2079 Certified Molecular Purge",
                  "Groq Llama 3 Sentinel AI Copilot",
                  "Sub-second neural ERP telemetry export",
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
                DEPLOY COMMERCIAL GRID
              </Link>
            </div>
          </div>

          {/* Sovereign Planetary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Sovereign Planetary</div>
              <div className="text-3xl font-black text-slate-900 mt-2">Custom</div>
              <p className="text-slate-500 text-xs mt-1 font-sans">For interplanetary fleets, fusion grids & sovereign MDAs.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-sans font-medium">
                {[
                  "Unlimited quantum cores & orbital satellites",
                  "Multi-sovereign tenant federation",
                  "Self-contained isolated PostgreSQL enclave",
                  "Custom thermodynamic depreciation models",
                  "Dedicated 24/7 autonomous sentinel drone",
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
                CONTACT SOVEREIGN DESK
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
            <span>FAQ Protocol</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 font-sans">
            Interplanetary governance queries.
          </h2>
          <p className="text-slate-600 mt-2 text-sm font-sans">
            Technical answers for Quantum Directors and Chief Thermodynamic Officers.
          </p>
        </div>

        <FaqAccordion />
      </Sec>

      {/* 12. FINAL HIGH-IMPACT 2080 CTA */}
      <Sec className="border-t border-slate-200/80 text-center py-16 sm:py-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl font-mono">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-[1.12] relative font-sans">
            Stop losing millions to sub-atomic hardware decoherence.
          </h2>
          <p className="text-slate-300 text-base mt-4 max-w-xl mx-auto relative font-sans font-normal">
            Govern planetary compute with mathematical precision, zero entropy, and instant holographic proof.
          </p>

          <div className="flex justify-center flex-wrap gap-4 mt-8 relative">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 text-slate-950 shadow-md hover:brightness-105 transition"
            >
              INITIALIZE SOVEREIGN NODE <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
            >
              EXPLORE HOLO-DEMO
            </Link>
          </div>

          <div className="mt-5 text-xs text-slate-400 relative font-sans">
            Holo-demo includes 48,920 pre-seeded sub-atomic cores across Terra and Orbit. Instant neural tap.
          </div>
        </div>
      </Sec>

      {/* 13. 2080 FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white relative z-10 font-mono">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Logo />
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-sans">
              Autonomous Quantum FinOps & Planetary Hardware Governance
            </span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-6 text-xs text-slate-600 font-bold font-sans">
            <a href="#features" className="hover:text-cyan-600 transition">Subsystems</a>
            <a href="#calculator" className="hover:text-cyan-600 transition">FinOps</a>
            <a href="#gis" className="hover:text-cyan-600 transition">Planetary GIS</a>
            <a href="#solutions" className="hover:text-cyan-600 transition">Sectors</a>
            <a href="#pricing" className="hover:text-cyan-600 transition">Tiers</a>
            <a href="#faq" className="hover:text-cyan-600 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-sm animate-pulse" />
              <span>QUANTUM GRID: ONLINE</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">© 2080 ASSETOPS</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
