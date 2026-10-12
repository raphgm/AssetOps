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
} from "lucide-react";

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<"finops" | "gis" | "preventative" | "decommission" | "qr">("finops");

  return (
    <div className="space-y-6 font-mono">
      {/* Minimalist Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 border border-slate-200 rounded-2xl max-w-4xl mx-auto backdrop-blur shadow-inner">
        {[
          { id: "finops", label: "Quantum FinOps", icon: Cpu, color: "text-cyan-600", activeBg: "bg-white text-cyan-800 shadow-sm border-slate-200" },
          { id: "gis", label: "Planetary GIS", icon: Globe2, color: "text-teal-600", activeBg: "bg-white text-teal-800 shadow-sm border-slate-200" },
          { id: "preventative", label: "Nanite Swarms", icon: Bot, color: "text-violet-600", activeBg: "bg-white text-violet-800 shadow-sm border-slate-200" },
          { id: "decommission", label: "Molecular Purge", icon: ShieldCheck, color: "text-rose-600", activeBg: "bg-white text-rose-800 shadow-sm border-slate-200" },
          { id: "qr", label: "Holo-Passports", icon: Radio, color: "text-amber-600", activeBg: "bg-white text-amber-800 shadow-sm border-slate-200" },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                isActive
                  ? `${t.activeBg} border-slate-200 shadow-sm`
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Icon className={`h-4 w-4 ${t.color}`} />
              <span className="whitespace-nowrap font-sans">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Quantum FinOps */}
      {activeTab === "finops" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center shadow-2xl shadow-slate-200/50">
          <div className="space-y-4 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold font-mono">
              <Cpu className="h-3.5 w-3.5 text-cyan-600" /> THERMODYNAMIC Q-FLOP GOVERNANCE
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Eliminate thermodynamic decay before quantum lattice decoheres.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              AssetOps models sub-atomic hardware degradation in real-time. When cumulative lattice repair energy exceeds <strong className="text-cyan-700">14% of quantum coherence yield</strong>, the substrate automatically de-crystallizes into raw plasma salvage.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              {[
                "Quantum Coherence Straight-Line Degradation down to 10% lattice reserve",
                "8-Solar Cycle CapEx Replacement Pipeline forecasting compute requirements",
                "Autonomous 14% Thermodynamic Rule: halts wasteful nanite micro-welds",
                "Neural telemetry export formatted for Interplanetary Ledger reconciliation",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 font-mono">
              <Link
                href="/app/finops"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm transition"
              >
                Access Quantum FinOps Ledger <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* FinOps Visual Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-500">CORE // Q-SUB-LOS-00912</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" /> PLASMA PURGE (88.4%)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Synthesis Cost</div>
                <div className="text-sm font-black text-slate-900 mt-0.5">Ꞙ14.5M</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Coherence Yield</div>
                <div className="text-sm font-black text-cyan-600 mt-0.5">Ꞙ3.8M</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Entropy Deficit</div>
                <div className="text-sm font-black text-rose-600 mt-0.5">Ꞙ3.3M</div>
              </div>
            </div>

            {/* Coherence Bar */}
            <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-sans font-medium">Lattice Decay Ratio</span>
                <span className="text-rose-600 font-bold">88.4% (Threshold: 70%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                <div className="h-full bg-cyan-500" style={{ width: "70%" }} />
                <div className="h-full bg-rose-500 animate-pulse" style={{ width: "18.4%" }} />
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between pt-0.5 font-sans">
                <span>Safe Coherence Zone</span>
                <span className="text-rose-600 font-mono font-bold">Lattice Purge Triggered</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-sm text-xs">
              <div className="text-[11px] uppercase font-bold text-slate-500 mb-2 flex justify-between">
                <span>8-Solar Cycle CapEx Forecast</span>
                <span className="text-cyan-700 font-bold">Ꞙ412.5M Planned</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
                <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[9px] text-slate-400">Cycle 1</div>
                  <div className="font-bold text-slate-800">Ꞙ84M</div>
                </div>
                <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[9px] text-slate-400">Cycle 2</div>
                  <div className="font-bold text-slate-800">Ꞙ121M</div>
                </div>
                <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[9px] text-slate-400">Cycle 3</div>
                  <div className="font-bold text-slate-800">Ꞙ62M</div>
                </div>
                <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[9px] text-slate-400">Cycle 4</div>
                  <div className="font-bold text-slate-800">Ꞙ145M</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Planetary GIS */}
      {activeTab === "gis" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center shadow-2xl shadow-slate-200/50">
          <div className="space-y-4 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold font-mono">
              <Globe2 className="h-3.5 w-3.5 text-teal-600" /> PLANETARY & ORBITAL TELEMETRY
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Track ground vaults, sub-oceanic trenches, and orbital satellite rings.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Hardware operations in 2080 span deep oceanic trenches, terrestrial fusion arrays, and satellite constellations visualized on an interactive 3D planetary mesh.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              {[
                "Zero latency planetary coordinate locks with sub-millimeter precision",
                "Orbital satellite drift and solar radiation exposure heatmaps",
                "Deep-sea trench temperature and superconducting pressure telemetry",
                "Instant failover rerouting during solar flare electromagnetic pulses",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 font-mono">
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition"
              >
                Access Planetary GIS Fleet <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Planetary Visual */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_#14b8a6]" />
                <span className="text-xs font-bold text-white">TERRA & ORBITAL NODES // ACTIVE</span>
              </div>
              <span className="text-[10px] text-teal-400 font-mono">LAT: 9.0820°N // ORBIT: 420KM</span>
            </div>

            <div className="relative h-60 w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              <div className="absolute top-8 left-1/3 flex flex-col items-center">
                <div className="h-7 w-7 rounded-full bg-teal-950 border-2 border-teal-400 flex items-center justify-center text-[10px] font-bold text-teal-300 shadow-[0_0_12px_#14b8a6]">
                  ORB
                </div>
                <span className="text-[10px] text-teal-200 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1">
                  Relay Alpha (Alt 420km)
                </span>
              </div>

              <div className="absolute bottom-10 left-1/4 flex flex-col items-center">
                <div className="h-7 w-7 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-300 shadow-[0_0_12px_#00f0ff]">
                  LOS
                </div>
                <span className="text-[10px] text-cyan-200 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1">
                  Lagos Oceanic Trench (Cryo 4K)
                </span>
              </div>

              <div className="absolute bottom-12 right-1/4 flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-indigo-950 border-2 border-indigo-400 flex items-center justify-center text-[9px] font-bold text-indigo-300 shadow-[0_0_12px_#818cf8]">
                  ABJ
                </div>
                <span className="text-[10px] text-indigo-200 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1">
                  Abuja Fusion Core (5.2 GW)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-[9px] text-slate-400 uppercase">Array Hubs</div>
                <div className="font-bold text-white">48 Sectors</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-[9px] text-slate-400 uppercase">Entanglement</div>
                <div className="font-bold text-teal-400">100% Synced</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-[9px] text-slate-400 uppercase">Coherence</div>
                <div className="font-bold text-cyan-400">99.999%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Nanite Swarms */}
      {activeTab === "preventative" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center shadow-2xl shadow-slate-200/50">
          <div className="space-y-4 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold font-mono">
              <Bot className="h-3.5 w-3.5 text-violet-600" /> AUTONOMOUS SWARM PROTOCOL
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Self-healing circuits. Zero human technician callouts.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              AssetOps directs fleets of microscopic nanite drones that navigate thermal conduits, de-dust optical waveguides, and atomic-solder degrading quantum gates before downtime occurs.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              {[
                "Real-time microscopic laser welding with zero server shutdown",
                "Automated 30-day thermal conduit purge and particulate de-crystallization",
                "Drone swarm coordination with cryptographic proof-of-repair logs",
                "Predictive lattice restoration prior to semiconductor lattice breach",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 font-mono">
              <Link
                href="/app/preventative"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 shadow-sm transition"
              >
                Inspect Nanite Dispatcher <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Nanite Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-xs font-bold text-slate-500">DISPATCH // SWARM-742-ALPHA</span>
              <span className="text-[11px] font-bold text-violet-800 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                ACTIVE REPAIR RUN
              </span>
            </div>

            <div className="space-y-2">
              {[
                { title: "Optical Waveguide Phase Alignment", target: "Cryo QPU Array #04", status: "In Progress (92%)", drones: "4,200 micro-drones" },
                { title: "Fusion Conduit Superconducting Purge", target: "Main Terawatt Bus", status: "Scheduled (2h)", drones: "12,000 micro-drones" },
                { title: "Memory Crystal Lattice Recalibration", target: "Atlantic Vault Core", status: "Completed", drones: "800 micro-drones" },
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between shadow-sm">
                  <div>
                    <div className="text-xs font-bold text-slate-900 font-sans">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-sans">
                      <span>{item.target}</span> • <span className="font-mono text-cyan-600 font-bold">{item.drones}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-violet-800 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
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
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center shadow-2xl shadow-slate-200/50">
          <div className="space-y-4 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-rose-600" /> ZERO-STATE ATOMIC PURGE
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Molecular data dissolution & quantum entanglement erasure.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              When a quantum memory crystal reaches end-of-life, AssetOps triggers laser-induced molecular lattice collapse, erasing all quantum entanglement states with certified proof for interplanetary regulators.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              {[
                "Compliant with Interplanetary Governance Data Standard IGDS-2079",
                "Irreversible sub-atomic lattice collapse with 0 reconstructible states",
                "Quantum Entangled Certificate generated with unique cryptographic hash",
                "Molecular scrap recovery credits logged directly into the FinOps ledger",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 font-mono">
              <Link
                href="/app/decommission"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition"
              >
                Access Certificate Vault <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Certificate Mockup 2080 */}
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-lg relative space-y-3 text-xs">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileBadge className="h-6 w-6 text-rose-600" />
                <div>
                  <div className="text-xs font-black text-slate-900 uppercase font-sans">MOLECULAR DISSOLUTION CERTIFICATE</div>
                  <div className="text-[10px] text-slate-500 font-mono">IGDS-2079 QUANTUM PURGE STANDARD</div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                PURGED // ZERO STATE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">SUBSTRATE</span>
                <span className="font-bold text-slate-800">Quantum Crystal Q-9481</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">METHOD</span>
                <span className="font-bold text-rose-600">Laser Lattice Collapse</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">CERTIFIED SYSTEM</span>
                <span className="text-slate-800">Sentinel AI Sentinel</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">PLASMA SALVAGE</span>
                <span className="text-teal-700 font-bold">Ꞙ420,000 Recovered</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-500 break-all font-mono">
              QUANTUM-HASH: 9f8a2bc4109de7a00318bbca7104f291048ba9e1
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Spatial Holo-Passports */}
      {activeTab === "qr" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center shadow-2xl shadow-slate-200/50">
          <div className="space-y-4 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono">
              <Radio className="h-3.5 w-3.5 text-amber-600" /> VOLUMETRIC AR PASSPORTS
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Spatial neural aura projecting above physical hardware.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              No QR stickers or handheld screens. Wearable neural contacts or drone optics project a 4D holographic aura 5 centimeters above any quantum chassis to view lifetime coherence, nanite logs, and cryptographic ownership.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              {[
                "Neural eye-tracking authentication with zero handheld scanners",
                "Instant biometric verification tied to employee neural implant signature",
                "One-thought work order dispatch directly into the nanite fleet queue",
                "Volumetric holographic teardown diagrams projected in 3D air",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 font-mono">
              <Link
                href="/app/assets"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition"
              >
                Inspect Holo-Passport Registry <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* AR Hologram Mockup */}
          <div className="mx-auto w-72 rounded-3xl border-2 border-slate-300 bg-slate-900 p-4 shadow-xl">
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] text-amber-400 font-bold">NEURAL AR RETICLE</span>
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-500/10 border border-amber-400/40 text-amber-400 rounded-lg flex items-center justify-center shrink-0">
                  <Radio className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Q-CORE-LAG-004821</div>
                  <div className="text-[10.5px] text-slate-400 font-sans">Photonic Synapse Array</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">COHERENCE</div>
                  <div className="font-bold text-cyan-400">99.98%</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">ENTROPY</div>
                  <div className="font-bold text-amber-400">-0.002%</div>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition">
                Engage Nanite Re-alignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
