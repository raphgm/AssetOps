"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Globe2,
  Bot,
  ShieldCheck,
  Radio,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  FileBadge,
  Sparkles,
  Zap,
  Layers,
} from "lucide-react";

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<"finops" | "gis" | "preventative" | "decommission" | "qr">("finops");

  return (
    <div className="space-y-6 font-mono">
      {/* 2080 HUD Pill Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#050914] border border-cyan-500/30 rounded-2xl max-w-4xl mx-auto backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,255,0.1)]">
        {[
          { id: "finops", label: "Quantum FinOps", icon: Cpu, color: "text-cyan-400", activeBg: "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]" },
          { id: "gis", label: "Planetary GIS", icon: Globe2, color: "text-teal-400", activeBg: "bg-teal-950/80 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]" },
          { id: "preventative", label: "Nanite Swarms", icon: Bot, color: "text-indigo-400", activeBg: "bg-indigo-950/80 border-indigo-400 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]" },
          { id: "decommission", label: "Molecular Purge", icon: ShieldCheck, color: "text-rose-400", activeBg: "bg-rose-950/80 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]" },
          { id: "qr", label: "Spatial Holo-Passports", icon: Radio, color: "text-amber-400", activeBg: "bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]" },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                isActive
                  ? `${t.activeBg}`
                  : "border-transparent text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <Icon className={`h-4 w-4 ${t.color}`} />
              <span className="whitespace-nowrap">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Quantum FinOps */}
      {activeTab === "finops" && (
        <div className="bg-[#060a16]/95 border border-cyan-500/30 rounded-2xl p-6 sm:p-9 grid lg:grid-cols-2 gap-8 items-center shadow-[0_0_40px_rgba(0,240,255,0.12)]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-bold">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" /> THERMODYNAMIC Q-FLOP GOVERNANCE
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Eliminate thermodynamic decay before quantum lattice decoheres.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              AssetOps models sub-atomic hardware degradation in real-time. When cumulative lattice repair energy exceeds <strong className="text-cyan-300">14% of quantum coherence yield</strong>, the substrate automatically de-crystallizes into raw plasma salvage.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300">
              {[
                "Quantum Coherence Straight-Line Degradation down to 10% lattice reserve",
                "8-Solar Cycle CapEx Replacement Pipeline forecasting compute requirements",
                "Autonomous 14% Thermodynamic Rule: halts wasteful nanite micro-welds",
                "Neural telemetry export formatted for Interplanetary Ledger reconciliation",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 font-sans">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Link
                href="/app/finops"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition"
              >
                Access Quantum FinOps Ledger <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* FinOps 2080 Visual Card */}
          <div className="bg-[#0a1020] border border-cyan-500/40 rounded-xl p-5 space-y-4 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-xs text-slate-400">CORE // Q-SUB-LOS-00912</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" /> PLASMA PURGE (88.4%)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-lg bg-[#040813] border border-cyan-500/25">
                <div className="text-[10px] uppercase text-slate-400">Synthesis Cost</div>
                <div className="text-sm font-bold text-white mt-0.5">Ꞙ14.5M</div>
              </div>
              <div className="p-3 rounded-lg bg-[#040813] border border-cyan-500/25">
                <div className="text-[10px] uppercase text-slate-400">Coherence Yield</div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">Ꞙ3.8M</div>
              </div>
              <div className="p-3 rounded-lg bg-[#040813] border border-cyan-500/25">
                <div className="text-[10px] uppercase text-slate-400">Entropy Deficit</div>
                <div className="text-sm font-bold text-rose-400 mt-0.5">Ꞙ3.3M</div>
              </div>
            </div>

            {/* Coherence Bar */}
            <div className="space-y-1.5 bg-[#040813] p-3.5 rounded-xl border border-cyan-500/25">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-sans">Lattice Decay Ratio</span>
                <span className="text-rose-400 font-bold">88.4% (Threshold: 70%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-cyan-500/20">
                <div className="h-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" style={{ width: "70%" }} />
                <div className="h-full bg-rose-500 animate-pulse" style={{ width: "18.4%" }} />
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between pt-0.5 font-sans">
                <span>Safe Coherence Zone</span>
                <span className="text-rose-400 font-mono font-bold">Lattice Purge Triggered</span>
              </div>
            </div>

            <div className="border border-cyan-500/25 rounded-xl p-3 bg-[#040813] text-xs">
              <div className="text-[11px] uppercase text-slate-400 mb-2 flex justify-between">
                <span>8-Solar Cycle CapEx Forecast</span>
                <span className="text-cyan-400 font-bold">Ꞙ412.5M Planned</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-500">Cycle 1</div>
                  <div className="font-bold text-slate-200">Ꞙ84M</div>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-500">Cycle 2</div>
                  <div className="font-bold text-slate-200">Ꞙ121M</div>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-500">Cycle 3</div>
                  <div className="font-bold text-slate-200">Ꞙ62M</div>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-500">Cycle 4</div>
                  <div className="font-bold text-slate-200">Ꞙ145M</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Planetary GIS */}
      {activeTab === "gis" && (
        <div className="bg-[#060a16]/95 border border-teal-500/30 rounded-2xl p-6 sm:p-9 grid lg:grid-cols-2 gap-8 items-center shadow-[0_0_40px_rgba(20,184,166,0.12)]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-400/50 text-teal-300 text-xs font-bold">
              <Globe2 className="h-3.5 w-3.5 text-teal-400" /> PLANETARY & ORBITAL TELEMETRY
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Track ground vaults, sub-oceanic trenches, and orbital satellite rings.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              Hardware operations in 2080 are no longer confined to brick-and-mortar server closets. AssetOps visualizes deep oceanic superconducting cables, terrestrial fusion grids, and orbital relay constellations on an interactive 3D planetary mesh.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300 font-sans">
              {[
                "Zero latency planetary coordinate locks with sub-millimeter precision",
                "Orbital satellite drift and solar radiation exposure heatmaps",
                "Deep-sea trench temperature and superconducting pressure telemetry",
                "Instant failover rerouting during solar flare electromagnetic pulses",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-400 text-slate-950 hover:bg-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.4)] transition"
              >
                Access Planetary GIS Fleet <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Planetary Visual */}
          <div className="bg-[#0a1020] border border-teal-500/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_#14b8a6]" />
                <span className="text-xs text-white">TERRA & ORBITAL NODES // ACTIVE</span>
              </div>
              <span className="text-[10px] text-teal-400">LAT: 9.0820°N // ORBIT: 420KM</span>
            </div>

            <div className="relative h-60 w-full bg-[#030611] rounded-lg border border-teal-500/25 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 cyber-grid opacity-30" />

              {/* Orbital node */}
              <div className="absolute top-8 left-1/3 flex flex-col items-center">
                <div className="h-7 w-7 rounded-full bg-teal-950 border-2 border-teal-400 flex items-center justify-center text-[10px] font-bold text-teal-300 shadow-[0_0_15px_#14b8a6]">
                  ORB
                </div>
                <span className="text-[10px] text-teal-200 bg-slate-900/90 px-2 py-0.5 rounded border border-teal-500/30 mt-1">
                  Relay Alpha (Alt 420km)
                </span>
              </div>

              {/* Terrestrial node */}
              <div className="absolute bottom-10 left-1/4 flex flex-col items-center">
                <div className="h-7 w-7 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-300 shadow-[0_0_15px_#00f0ff]">
                  LOS
                </div>
                <span className="text-[10px] text-cyan-200 bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/30 mt-1">
                  Lagos Oceanic Trench (Cryo 4K)
                </span>
              </div>

              {/* Fusion node */}
              <div className="absolute bottom-12 right-1/4 flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-indigo-950 border-2 border-indigo-400 flex items-center justify-center text-[9px] font-bold text-indigo-300 shadow-[0_0_15px_#818cf8]">
                  ABJ
                </div>
                <span className="text-[10px] text-indigo-200 bg-slate-900/90 px-2 py-0.5 rounded border border-indigo-500/30 mt-1">
                  Abuja Fusion Core (5.2 GW)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[9px] text-slate-500 uppercase">Array Hubs</div>
                <div className="font-bold text-white">48 Sectors</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[9px] text-slate-500 uppercase">Entanglement</div>
                <div className="font-bold text-teal-400">100% Synced</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[9px] text-slate-500 uppercase">Coherence</div>
                <div className="font-bold text-cyan-400">99.999%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Nanite Swarms */}
      {activeTab === "preventative" && (
        <div className="bg-[#060a16]/95 border border-indigo-500/30 rounded-2xl p-6 sm:p-9 grid lg:grid-cols-2 gap-8 items-center shadow-[0_0_40px_rgba(99,102,241,0.12)]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-400/50 text-indigo-300 text-xs font-bold">
              <Bot className="h-3.5 w-3.5 text-indigo-400" /> AUTONOMOUS SWARM PROTOCOL
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Self-healing circuits. Zero human technician callouts.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              Human hands haven&apos;t touched enterprise server chassis in decades. AssetOps directs fleets of microscopic nanite drones that navigate thermal conduits, de-dust sub-micron optical waveguides, and atomic-solder degrading quantum gates before downtime occurs.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300 font-sans">
              {[
                "Real-time microscopic laser welding with zero server shutdown",
                "Automated 30-day thermal conduit purge and particulate de-crystallization",
                "Drone swarm coordination with cryptographic proof-of-repair logs",
                "Predictive lattice restoration prior to semiconductor lattice breach",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Link
                href="/app/preventative"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-400 text-slate-950 hover:bg-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition"
              >
                Inspect Nanite Dispatcher <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Nanite Card */}
          <div className="bg-[#0a1020] border border-indigo-500/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2.5">
              <span className="text-xs text-slate-400">DISPATCH // SWARM-742-ALPHA</span>
              <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/40">
                ACTIVE REPAIR RUN
              </span>
            </div>

            <div className="space-y-2">
              {[
                { title: "Optical Waveguide Phase Alignment", target: "Cryo QPU Array #04", status: "In Progress (92%)", drones: "4,200 micro-drones" },
                { title: "Fusion Conduit Superconducting Purge", target: "Main Terawatt Bus", status: "Scheduled (2h)", drones: "12,000 micro-drones" },
                { title: "Memory Crystal Lattice Recalibration", target: "Atlantic Vault Core", status: "Completed", drones: "800 micro-drones" },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl border border-indigo-500/25 bg-[#040813] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                      <span>{item.target}</span> • <span className="font-mono text-cyan-400">{item.drones}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/40">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Molecular Purge */}
      {activeTab === "decommission" && (
        <div className="bg-[#060a16]/95 border border-rose-500/30 rounded-2xl p-6 sm:p-9 grid lg:grid-cols-2 gap-8 items-center shadow-[0_0_40px_rgba(244,63,94,0.12)]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-400/50 text-rose-300 text-xs font-bold">
              <ShieldCheck className="h-3.5 w-3.5 text-rose-400" /> ZERO-STATE ATOMIC PURGE
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Molecular data dissolution & quantum entanglement erasure.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              In 2080, overwriting a disk with zeroes is ancient history. When a quantum memory crystal reaches end-of-life, AssetOps triggers laser-induced molecular lattice collapse, erasing all quantum entanglement states with certified proof for interstellar regulators.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300 font-sans">
              {[
                "Compliant with Interplanetary Governance Data Standard IGDS-2079",
                "Irreversible sub-atomic lattice collapse with 0 reconstructible states",
                "Quantum Entangled Certificate generated with unique cryptographic hash",
                "Molecular scrap recovery credits logged directly into the FinOps ledger",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Link
                href="/app/decommission"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition"
              >
                Access Certificate Vault <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Certificate Mockup 2080 */}
          <div className="bg-[#0a1020] border-2 border-rose-500/40 rounded-xl p-5 shadow-2xl relative space-y-3 text-xs">
            <div className="flex items-start justify-between border-b border-rose-500/20 pb-3">
              <div className="flex items-center gap-2">
                <FileBadge className="h-6 w-6 text-rose-400" />
                <div>
                  <div className="text-xs font-bold text-white uppercase">MOLECULAR DISSOLUTION CERTIFICATE</div>
                  <div className="text-[10px] text-slate-400">IGDS-2079 QUANTUM PURGE STANDARD</div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                PURGED // ZERO STATE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">SUBSTRATE</span>
                <span className="font-bold text-white">Quantum Crystal Q-9481</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">DISSOLUTION METHOD</span>
                <span className="font-bold text-rose-400">Laser Lattice Collapse</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">CERTIFIED SYSTEM</span>
                <span className="text-slate-300">Autonomous Sentinel AI</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">PLASMA SALVAGE</span>
                <span className="text-cyan-400 font-bold">Ꞙ420,000 Recovered</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 break-all">
              QUANTUM-HASH: 9f8a2bc4109de7a00318bbca7104f291048ba9e1
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Spatial Holo-Passports */}
      {activeTab === "qr" && (
        <div className="bg-[#060a16]/95 border border-amber-500/30 rounded-2xl p-6 sm:p-9 grid lg:grid-cols-2 gap-8 items-center shadow-[0_0_40px_rgba(245,158,11,0.12)]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/50 text-amber-300 text-xs font-bold">
              <Radio className="h-3.5 w-3.5 text-amber-400" /> VOLUMETRIC AR PASSPORTS
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Spatial neural aura projecting above physical hardware.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              No QR stickers or handheld screens. Wearable neural contacts or drone optics project a 4D holographic aura 5 centimeters above any quantum chassis. Look at the machine to view lifetime coherence, nanite logs, and cryptographic ownership.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-300 font-sans">
              {[
                "Neural eye-tracking authentication with zero handheld scanners",
                "Instant biometric verification tied to employee neural implant signature",
                "One-thought work order dispatch directly into the nanite fleet queue",
                "Volumetric holographic teardown diagrams projected in 3D air",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Link
                href="/app/assets"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition"
              >
                Inspect Holo-Passport Registry <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* AR Hologram Mockup */}
          <div className="mx-auto w-72 rounded-3xl border-2 border-amber-400/40 bg-gradient-to-b from-[#0c1428] to-[#040814] p-4 shadow-[0_0_35px_rgba(245,158,11,0.25)]">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-[10px] text-amber-400 font-bold">NEURAL AR RETICLE</span>
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              </div>

              <div className="p-3 rounded-xl border border-amber-500/30 bg-[#070e1e] flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-950 border border-amber-400 text-amber-300 rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_12px_#f59e0b]">
                  <Radio className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Q-CORE-LAG-004821</div>
                  <div className="text-[10.5px] text-slate-400 font-sans">Photonic Synapse Array</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#070e1e] border border-cyan-500/30">
                  <div className="text-[9px] text-slate-400">COHERENCE</div>
                  <div className="font-bold text-cyan-300">99.98%</div>
                </div>
                <div className="p-2 rounded-lg bg-[#070e1e] border border-amber-500/30">
                  <div className="text-[9px] text-slate-400">ENTROPY</div>
                  <div className="font-bold text-amber-300">-0.002%</div>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                Engage Nanite Re-alignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
