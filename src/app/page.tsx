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
    <div className="bg-[#030712] text-slate-100 min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 font-sans relative overflow-x-hidden">
      {/* 2080 Background Matrix Grid & Cyber Ambient Glow */}
      <div className="fixed inset-0 cyber-grid opacity-25 pointer-events-none z-0" aria-hidden />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-teal-500/10 to-indigo-500/15 rounded-full blur-[140px] pointer-events-none -z-10" aria-hidden />
      <div className="fixed bottom-0 right-10 w-[600px] h-[450px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none -z-10" aria-hidden />

      <Navbar />

      {/* 1. 2080 HERO SECTION */}
      <div className="relative pt-28 sm:pt-36 pb-16 border-b border-cyan-500/20">
        <Sec className="py-0 sm:py-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/40 bg-[#070e1e]/90 shadow-[0_0_20px_rgba(0,240,255,0.25)] text-cyan-300 text-xs font-mono font-bold mb-6">
              <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>QUANTUM-SPATIAL OS // 2080 ENTERPRISE GRID</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.08] text-white">
              Autonomous infrastructure.{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300 bg-clip-text text-transparent">
                Zero thermodynamic waste.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg mt-5 max-w-xl leading-relaxed font-sans">
              The planetary operating system for Quantum Cores, Photonic Mesh Racks, and Autonomous Nanite Swarms. Halt molecular lattice decoherence and govern sub-atomic depreciation across planetary and orbital hubs.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mt-8 font-mono">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:brightness-110 transition"
              >
                INITIALIZE NEURAL PILOT <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-[#091124] hover:bg-[#0f1b38] text-slate-200 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] transition"
              >
                DEPLOY SOVEREIGN NODE
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-7 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-400" /> Sub-ms Entanglement Lock
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-400" /> 48,920 Pre-Seeded Cores
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-400" /> Free Planetary GIS
              </span>
            </div>
          </div>

          {/* 2080 Holographic Flight Deck Hub Card */}
          <div className="bg-[#050914]/90 border border-cyan-400/50 rounded-2xl p-5 sm:p-6 shadow-[0_0_45px_rgba(0,240,255,0.2)] backdrop-blur-2xl relative font-mono overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wider">
                  QUANTUM TELEMETRY // SECTOR-01
                </span>
              </div>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
                48,920 Cores Live
              </span>
            </div>

            {/* 2080 Cyber KPI Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { v: "48,920", l: "Active QPUs", c: "text-white", bg: "bg-[#091124] border-cyan-500/30" },
                { v: "99.999%", l: "Coherence", c: "text-cyan-300", bg: "bg-cyan-950/60 border-cyan-400/40" },
                { v: "Ꞙ2.4B", l: "Q-FLOP Yield", c: "text-teal-300", bg: "bg-teal-950/60 border-teal-400/40" },
                { v: "-0.002%", l: "Entropy Flux", c: "text-emerald-400", bg: "bg-emerald-950/60 border-emerald-400/40" },
              ].map((item) => (
                <div key={item.l} className={`rounded-xl border p-2.5 ${item.bg}`}>
                  <div className={`text-lg sm:text-xl font-black ${item.c}`}>{item.v}</div>
                  <div className="text-[9.5px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider">{item.l}</div>
                </div>
              ))}
            </div>

            {/* Split Visual HUD */}
            <div className="grid sm:grid-cols-[1.2fr_1fr] gap-3">
              {/* Nanite & Lattice Decay Monitor */}
              <div className="rounded-xl border border-cyan-500/25 bg-[#091124] p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase">Molecular Lattice Decay</span>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                    14% Threshold Exceeded
                  </span>
                </div>
                <div className="space-y-1.5 my-1">
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-cyan-500/20">
                    <div className="h-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" style={{ width: "70%" }} />
                    <div className="h-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]" style={{ width: "18%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                    <span>Safe Coherence Zone</span>
                    <span className="text-rose-400 font-mono font-bold">Plasma Recycling Active</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 border-t border-cyan-500/20 pt-2 mt-2 flex justify-between">
                  <span>Atomic Salvage Credit:</span>
                  <span className="text-cyan-300 font-bold">Ꞙ420,000</span>
                </div>
              </div>

              {/* Real-time 2080 Live Event Stream */}
              <div className="rounded-xl border border-cyan-500/25 bg-[#070e1e] p-3.5">
                <div className="flex items-center gap-1.5 text-[10.5px] text-cyan-400 mb-2 font-bold uppercase">
                  <Radio className="h-2.5 w-2.5 text-cyan-400 animate-ping" />
                  Autonomous Nanite Log
                </div>
                <LiveFeed />
              </div>
            </div>

            {/* Planetary Coordinates Banner */}
            <div className="mt-3 p-2.5 rounded-xl border border-cyan-500/30 bg-[#091124] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-cyan-400" />
                <span className="text-slate-300 text-xs">Arrays: Lagos Trench, Abuja Fusion Core, Orbital Relay-Alpha</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-300 font-mono bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                PLANETARY MESH
              </span>
            </div>
          </div>
        </Sec>
      </div>

      {/* 2. 2080 SECTOR HUBS BANNER */}
      <div className="border-b border-cyan-500/20 bg-[#040714] py-6 relative z-10 font-mono">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-[10.5px] uppercase tracking-widest text-cyan-400/80 font-bold mb-4">
            MISSION-CRITICAL PLANETARY DEPLOYMENTS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { title: "Quantum Banking", desc: "Sub-picosecond entanglement", color: "border-cyan-500/30 bg-[#060c1c]" },
              { title: "Bio-Digital ICU Hubs", desc: "Synthetic organ telemetry", color: "border-teal-500/30 bg-[#060c1c]" },
              { title: "Neural Academies", desc: "50,000+ holographic pods", color: "border-indigo-500/30 bg-[#060c1c]" },
              { title: "Fusion Grids & MDAs", desc: "Zero ghost fusion turbines", color: "border-amber-500/30 bg-[#060c1c]" },
            ].map((sector) => (
              <div key={sector.title} className={`p-3.5 rounded-xl border ${sector.color} hover:border-cyan-400 transition`}>
                <div className="font-bold text-sm text-white">{sector.title}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-sans">{sector.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. THE 2080 ENTROPY CHALLENGE */}
      <Sec id="problem">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold mb-3">
            <BarChart3 className="h-3.5 w-3.5 text-rose-400" />
            <span>The Entropy Hazard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Unmonitored quantum hardware bleeds trillions in thermodynamic waste.
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base font-sans">
            Spending nanite repair energy on a molecularly degraded QPU array creates negative thermodynamic return.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 font-mono">
          {/* Legacy Primitive Way */}
          <div className="bg-[#080d1e] border-2 border-rose-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-[0_0_25px_rgba(244,63,94,0.1)]">
            <div className="inline-flex items-center gap-1.5 text-rose-300 text-xs uppercase font-black tracking-wider bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-500/40">
              ✕ Primitive Human-Manual Model
            </div>
            <h3 className="text-xl font-bold text-white">Lattice Decoherence & Capital Drift</h3>
            <ul className="space-y-3 text-xs text-slate-300 font-sans">
              {[
                "Paying Ꞙ4M in nanite energy to repair a crystal with residual coherence yield of only Ꞙ1.5M",
                "Ghost quantum substrates sitting on planetary ledgers decades after being vaporized",
                "Atmospheric solar flares causing desynchronization during trillion-credit trading cycles",
                "Retired photonic cores discarded without verified molecular lattice dissolution proof",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-black mt-0.5">✕</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2080 Autonomous Way */}
          <div className="bg-[#080d1e] border-2 border-cyan-400/60 rounded-2xl p-6 sm:p-8 space-y-4 shadow-[0_0_35px_rgba(0,240,255,0.2)]">
            <div className="inline-flex items-center gap-1.5 text-cyan-300 text-xs uppercase font-black tracking-wider bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-400/50">
              ✓ Autonomous AssetOps 2080 Model
            </div>
            <h3 className="text-xl font-bold text-white">Zero Thermodynamic Loss</h3>
            <ul className="space-y-3 text-xs text-slate-200 font-sans font-medium">
              {[
                "Automatic 14% Thermodynamic Rule diverts decaying QPUs directly to plasma recycling",
                "Planetary 3D GIS locks ground vaults, deep-sea trenches, and orbital satellite rings",
                "Autonomous Nanite Swarms perform laser micro-welds before molecular decoherence spreads",
                "IGDS-2079 certified molecular dissolution with irreversible quantum hash signatures",
              ].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sec>

      {/* 4. FEATURE PILLARS (TABS) */}
      <Sec id="features" className="border-t border-cyan-500/20">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-bold mb-3">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>Autonomous Subsystems</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Engineered for quantum, orbital, and bio-photonic realities.
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base font-sans">
            Explore the five self-healing engines that govern your planetary compute estate.
          </p>
        </div>

        <FeatureTabs />
      </Sec>

      {/* 5. QUANTUM FINOPS SIMULATOR */}
      <Sec id="calculator" className="border-t border-cyan-500/20">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-bold mb-3">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Quantum Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Model your cycle thermodynamic recovery.
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-sans">
            Adjust the substrate sliders to project Q-FLOP yield and plasma recycling salvage credits.
          </p>
        </div>

        <RoiCalculator />
      </Sec>

      {/* 6. PLANETARY GIS SPOTLIGHT */}
      <Sec id="gis" className="border-t border-cyan-500/20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-400/50 text-teal-300 text-xs font-mono font-bold">
              <Globe2 className="h-3.5 w-3.5 text-teal-400" />
              <span>Free Planetary Mesh GIS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Ground vaults to orbital satellite rings on one holographic grid.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              Managing planetary infrastructure requires spatial coordination. AssetOps connects deep sub-oceanic trenches, terrestrial fusion arrays, and satellite constellations on high-speed vector tiles with zero third-party telemetry fees.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300 font-sans">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Zero commercial satellite API fees: runs on open planetary orbital mesh</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Sub-millimeter coordinate locking for terrestrial, sub-oceanic, and orbital nodes</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Dynamic laser routing circles that illuminate red during radiation flare interference</span>
              </div>
            </div>
            <div className="pt-3 font-mono">
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-400 text-slate-950 hover:bg-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.4)] transition"
              >
                Inspect Planetary Fleet Array <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Planetary GIS Card */}
          <div className="bg-[#080d1e] border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_35px_rgba(0,240,255,0.15)] font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
                <span className="text-xs font-bold text-white">PLANETARY MESH TELEMETRY</span>
              </div>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                ACTIVE 4D RETICLE
              </span>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-[#040813] p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-[#070e20] border border-cyan-500/25">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Lagos Trench</div>
                  <div className="font-bold text-white mt-0.5">2,410 QPUs</div>
                  <span className="text-[10px] text-emerald-400 font-bold">Cryo 4.2K</span>
                </div>
                <div className="p-3 rounded-lg bg-[#070e20] border border-cyan-500/25">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Abuja Fusion</div>
                  <div className="font-bold text-white mt-0.5">1,842 QPUs</div>
                  <span className="text-[10px] text-cyan-300 font-bold">5.2 GW Grid</span>
                </div>
                <div className="p-3 rounded-lg bg-[#070e20] border border-cyan-500/25">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Relay Alpha</div>
                  <div className="font-bold text-white mt-0.5">850 QPUs</div>
                  <span className="text-[10px] text-indigo-300 font-bold">Orbit 420km</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center font-sans">
                Leaflet GIS telemetry streams via sub-nanosecond quantum links across desktop & neural implants.
              </p>
            </div>
          </div>
        </div>
      </Sec>

      {/* 7. INDUSTRY SECTORS */}
      <Sec id="solutions" className="border-t border-cyan-500/20">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-bold mb-3">
            <Building className="h-3.5 w-3.5 text-cyan-400" />
            <span>Sovereign Sector Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Built for institutions where decoherence is catastrophic.
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base font-sans">
            Select your sector below to see autonomous nanite protocols and verified thermodynamic impact.
          </p>
        </div>

        <IndustrySolutions />
      </Sec>

      {/* 8. SENTINEL AI COPILOT */}
      <Sec className="border-t border-cyan-500/20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-400/50 text-indigo-300 text-xs font-mono font-bold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Deterministic Sentinel AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Direct telemetry reasoning. Zero model hallucination.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              AssetOps connects Groq&apos;s lightning-fast Llama 3 engine directly to quantum sensor telemetry. The Sentinel diagnoses anomalies and prescribes nanite repair vectors, but it never fabricates physics. If telemetry isn&apos;t in your PostgreSQL database, it reports a phase-lock vacuum.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300 font-sans">
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Deterministic database queries: the sentinel never invents quantum states</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Every claim cites specific nanite work-order IDs and cryogenic sensors</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Strict neural tenant boundaries: your institutional telemetry never leaks</span>
              </div>
            </div>
          </div>

          {/* AI Sentinel Chat Preview */}
          <div className="bg-[#080d1e] border border-cyan-500/40 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-[0_0_35px_rgba(0,240,255,0.15)] font-mono">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">SENTINEL COPILOT // REASONING HUD</span>
              <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/40">
                GROQ LLAMA 3
              </span>
            </div>

            <div className="ml-auto max-w-[85%] rounded-2xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 px-4 py-2.5 text-xs">
              Why did Lagos Oceanic Trench maintenance entropy surge 22% this solar cycle?
            </div>

            <div className="p-4 rounded-xl bg-[#040813] border border-cyan-500/25 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs text-white font-bold">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Synthesized Diagnostic Vector:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Lagos spend increased by <strong className="text-cyan-300">Ꞙ1.84M Compute Credits</strong> across 42 nanite runs. Driven by repetitive waveguide micro-welds on 18 photonic QPUs reaching 4.8 solar cycles of age.
              </p>

              <div className="border-t border-cyan-500/20 pt-2 space-y-1 text-[11px] text-slate-400">
                <div>• SWARM-84920 to SWARM-84938 (Waveguide Laser Welds)</div>
                <div>• Autonomous Swarm: PowerTech Robotics (Turnaround 3.2ms)</div>
                <div className="text-rose-400 font-bold">• 14 cores breached 14% Thermodynamic Rule: Divert to Plasma Salvage</div>
              </div>

              <div className="pt-2 flex gap-2">
                <Link
                  href="/app/finops"
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-500 text-white hover:bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition"
                >
                  Engage Plasma Remediation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Sec>

      {/* 9. CRYPTOGRAPHIC PROOF & GOVERNANCE */}
      <Sec id="security" className="border-t border-cyan-500/20">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-bold mb-3">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span>Cryptographic Governance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Defend every quantum metric before planetary auditors.
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-sans">
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
              <div key={idx} className="bg-[#080d1e] border border-cyan-500/25 rounded-2xl p-4 shadow-sm hover:border-cyan-400 transition">
                <Icon className="h-5 w-5 text-cyan-400 mb-2" />
                <div className="font-bold text-sm text-white">{item.title}</div>
                <div className="text-slate-400 text-xs mt-1 leading-snug font-sans">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </Sec>

      {/* 10. 2080 PRICING TIERS */}
      <Sec id="pricing" className="border-t border-cyan-500/20">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-bold mb-3">
            <Coins className="h-3.5 w-3.5 text-cyan-400" />
            <span>Compute Credit Tiers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Transparent thermodynamic licensing.
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-sans">
            Full access to Quantum FinOps, Planetary GIS, and Nanite Swarms across all tiers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 font-mono">
          {/* Sub-Orbital Pilot */}
          <div className="bg-[#080d1e] border border-cyan-500/30 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Sub-Orbital Pilot</div>
              <div className="text-3xl font-black text-white mt-2">Free</div>
              <p className="text-slate-400 text-xs mt-1 font-sans">For localized arrays testing AssetOps.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300 font-sans">
                {[
                  "Up to 1,000 quantum sub-nodes",
                  "Planetary GIS map with coordinate locks",
                  "Volumetric AR Passports & nanite work orders",
                  "Deterministic coherence scoring",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-cyan-500/20 mt-6">
              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-[#0f1c38] hover:bg-[#14264c] text-white border border-cyan-500/40 transition"
              >
                INITIALIZE PILOT
              </Link>
            </div>
          </div>

          {/* Commercial Quantum */}
          <div className="bg-[#0a1226] border-2 border-cyan-400 rounded-2xl p-6 sm:p-7 shadow-[0_0_35px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/50 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 text-[10.5px] font-black uppercase text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 px-3 py-0.5 rounded-full shadow-[0_0_15px_#00f0ff]">
              MOST DEPLOYED
            </span>
            <div>
              <div className="text-xs uppercase font-bold text-cyan-300">Commercial Quantum</div>
              <div className="text-3xl font-black text-white mt-2">
                Ꞙ150,000 <span className="text-xs text-slate-400 font-normal font-sans">/ cycle</span>
              </div>
              <p className="text-slate-400 text-xs mt-1 font-sans">For multi-hub banks, clinics, and research academies.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-200 font-sans">
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
                    <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span className="font-bold text-white">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-cyan-500/20 mt-6">
              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:brightness-110 transition"
              >
                DEPLOY COMMERCIAL GRID
              </Link>
            </div>
          </div>

          {/* Sovereign Planetary */}
          <div className="bg-[#080d1e] border border-cyan-500/30 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Sovereign Planetary</div>
              <div className="text-3xl font-black text-white mt-2">Custom</div>
              <p className="text-slate-400 text-xs mt-1 font-sans">For interplanetary fleets, fusion grids & sovereign MDAs.</p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300 font-sans">
                {[
                  "Unlimited quantum cores & orbital satellites",
                  "Multi-sovereign tenant federation",
                  "Self-contained isolated PostgreSQL enclave",
                  "Custom thermodynamic depreciation models",
                  "Dedicated 24/7 autonomous sentinel drone",
                ].map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-6 border-t border-cyan-500/20 mt-6">
              <Link
                href="/sign-in"
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold bg-[#0f1c38] hover:bg-[#14264c] text-white border border-cyan-500/40 transition"
              >
                CONTACT SOVEREIGN DESK
              </Link>
            </div>
          </div>
        </div>
      </Sec>

      {/* 11. FAQ */}
      <Sec id="faq" className="border-t border-cyan-500/20">
        <div className="text-center max-w-2xl mx-auto mb-10 font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-bold mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>FAQ Protocol</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Interplanetary governance queries.
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-sans">
            Technical answers for Quantum Directors and Chief Thermodynamic Officers.
          </p>
        </div>

        <FaqAccordion />
      </Sec>

      {/* 12. FINAL HIGH-IMPACT 2080 CTA */}
      <Sec className="border-t border-cyan-500/20 text-center py-16 sm:py-24">
        <div className="bg-gradient-to-br from-[#060c1c] via-[#091228] to-[#040714] border-2 border-cyan-400/50 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.25)] font-mono">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-[1.12] relative">
            Stop losing millions to sub-atomic hardware decoherence.
          </h2>
          <p className="text-slate-300 text-base mt-4 max-w-xl mx-auto relative font-sans">
            Govern planetary compute with mathematical precision, zero entropy, and instant holographic proof.
          </p>

          <div className="flex justify-center flex-wrap gap-4 mt-8 relative">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:brightness-110 transition"
            >
              INITIALIZE SOVEREIGN NODE <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-xs bg-[#0b162f] hover:bg-[#122248] text-white border border-cyan-500/40 transition"
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
      <footer className="border-t border-cyan-500/20 bg-[#02050e] relative z-10 font-mono">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Logo />
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="text-xs text-slate-400 font-sans">
              Autonomous Quantum FinOps & Planetary Hardware Governance
            </span>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-6 text-xs text-slate-400 font-bold">
            <a href="#features" className="hover:text-cyan-400 transition">Subsystems</a>
            <a href="#calculator" className="hover:text-cyan-400 transition">FinOps</a>
            <a href="#gis" className="hover:text-cyan-400 transition">Planetary GIS</a>
            <a href="#solutions" className="hover:text-cyan-400 transition">Sectors</a>
            <a href="#pricing" className="hover:text-cyan-400 transition">Tiers</a>
            <a href="#faq" className="hover:text-cyan-400 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-pulse" />
              <span>QUANTUM GRID: ONLINE</span>
            </div>
            <div className="text-xs text-slate-500">© 2080 ASSETOPS</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
