"use client";

import { useState } from "react";
import { Landmark, Hospital, GraduationCap, Building2, Check, ArrowUpRight, ShieldCheck, AlertCircle, Orbit, Cpu, Sparkles } from "lucide-react";
import Link from "next/link";

interface IndustryItem {
  id: string;
  name: string;
  icon: any;
  tagline: string;
  badgeColor: string;
  painPoint: string;
  solution: string;
  kpis: { label: string; value: string }[];
  features: string[];
}

const INDUSTRIES: IndustryItem[] = [
  {
    id: "banking",
    name: "Interstellar Banking & Quantum FinTech",
    icon: Landmark,
    tagline: "Sub-picosecond quantum entanglement sync & zero trading core desynchronization",
    badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-400/40",
    painPoint:
      "When orbital-to-terrestrial quantum relays suffer atmospheric phase decoherence, algorithmic trading vaults freeze. Banks bleed trillions in compute arbitrage while archaic audit ledgers fail to prove entanglement fidelity.",
    solution:
      "AssetOps provides sub-nanosecond hardware health telemetry across terrestrial vault rings and orbital satellite arrays, autonomous nanite waveguide stabilization, and cryptographic molecular purge certs for retired quantum storage crystals.",
    kpis: [
      { label: "Quantum Mesh Coherence", value: "99.9999%" },
      { label: "Interplanetary Audit Deficit", value: "0 Violations" },
      { label: "End-of-Life State Erasure", value: "100% Cryptographic" },
    ],
    features: [
      "Planetary 3D GIS tracking ground arrays and orbital satellite relays in real time",
      "Autonomous nanite swarm maintenance for cryogenic superconducting conduits",
      "Immutable tamper-proof molecular dissolution certificates for decommissioned QPUs",
      "Strict neural-signature role segregation between fleet engineers and quantum auditors",
    ],
  },
  {
    id: "healthcare",
    name: "Bio-Digital Hospitals & Synthetic Life Hubs",
    icon: Hospital,
    tagline: "Life-critical organ synthesis consoles & zero-entropy neural ICU telemetry",
    badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-400/40",
    painPoint:
      "Hardware degradation in synthetic organ printers, cryogenic preservation pods, and neural ICU consoles risks human lives. Biomedical teams battle micro-lattice stress fractures that human eyes cannot see.",
    solution:
      "AssetOps tracks clinical hardware down to the exact bio-theatre chamber. Autonomous nanite inspection swarms execute laser micro-welds weeks before molecular lattice breakdown occurs, while volumetric holo-passports allow instant surgical intervention.",
    kpis: [
      { label: "Organ Synthesizer Uptime", value: "100.00%" },
      { label: "Nanite PM Compliance", value: "100% Autonomous" },
      { label: "Neural Alarm to Nanite Dispatch", value: "< 50 Milliseconds" },
    ],
    features: [
      "Chamber-level bio-digital hierarchy for surgical and cryogenic telemetry nodes",
      "IGDS-2079 certified patient genomic data destruction prior to substrate recycling",
      "Volumetric AR holographic auras projected directly over surgical console chassis",
      "Sub-atomic SLA tracking for specialized bio-quantum hardware contracts",
    ],
  },
  {
    id: "universities",
    name: "Mega-Campus Neural Academies",
    icon: GraduationCap,
    tagline: "50,000+ holographic neural pods across multi-planetary research campuses",
    badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-400/40",
    painPoint:
      "Tens of thousands of neural-interface headsets and quantum student compute pods are scattered across vast continental campuses. Ghost asset leakage is rampant, and exam pods frequently face quantum decoherence during testing.",
    solution:
      "AssetOps consolidates decentralized faculty nodes into one unified planetary GIS grid. Campus managers run semester nanite re-alignment sweeps, and stolen neural pods automatically engage spatial coordinate lockdown.",
    kpis: [
      { label: "Student Neural Pod Availability", value: "99.85%" },
      { label: "Ghost Asset Leakage", value: "Eradicated 100%" },
      { label: "Exam Grid Readiness", value: "Phase-Locked" },
    ],
    features: [
      "Planetary GIS mapping specific academic faculties, research domes, and quantum labs",
      "Inter-semester batch nanite maintenance sweeps across thousands of student pods",
      "Spatial geofencing: quantum hardware auto-freezes if moved beyond faculty borders",
      "Thermodynamic FinOps forecasting hardware upgrade budgets 8 solar cycles ahead",
    ],
  },
  {
    id: "government",
    name: "Sovereign Fusion Grids & Planetary MDAs",
    icon: Building2,
    tagline: "Eradicate ghost hardware in multi-GW fusion grids & defend 8-cycle capital budgets",
    badgeColor: "bg-amber-950/80 text-amber-300 border-amber-400/40",
    painPoint:
      "Public sector ministries struggle with unverified hardware on paper ledgers, untracked procurement vendor contracts, and recurring repair budgets on obsolete quantum cores that should have been recycled.",
    solution:
      "AssetOps enforces drone-verified physical inventory of every sovereign asset, automates thermodynamic straight-line depreciation, and applies the 14% lattice rule to stop wasteful public-sector contractor repair waste.",
    kpis: [
      { label: "Phantom Assets Identified", value: "100% Verified" },
      { label: "Defensible CapEx Forecast", value: "8 Solar Cycles" },
      { label: "Wasteful Repair Diversion", value: "Ꞙ142M Recovered" },
    ],
    features: [
      "8-Cycle CapEx pipeline with transparent mathematical depreciation models",
      "Anti-kickback 14% molecular decay cut-off stopping repeat contractor repair scams",
      "Append-only immutable audit trail recording every state change and neural signature",
      "One-click neural data reporting for parliamentary energy committees and public audit",
    ],
  },
];

export default function IndustrySolutions() {
  const [selectedId, setSelectedId] = useState<string>("banking");
  const current = INDUSTRIES.find((ind) => ind.id === selectedId) || INDUSTRIES[0];
  const Icon = current.icon;

  return (
    <div className="space-y-6 font-mono">
      {/* 4 Industry Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {INDUSTRIES.map((ind) => {
          const ItemIcon = ind.icon;
          const isSelected = selectedId === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedId(ind.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-[#091124] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/50"
                  : "bg-[#050914]/80 border-cyan-500/20 hover:border-cyan-400/50 hover:bg-[#070e1e]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${ind.badgeColor}`}>
                  <ItemIcon className="h-5 w-5" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/40">
                    LOCKED
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-white">{ind.name}</div>
              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-sans">{ind.tagline}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Industry Detail Card */}
      <div className="bg-[#060a16]/95 border border-cyan-500/30 rounded-2xl p-6 sm:p-9 shadow-[0_0_40px_rgba(0,240,255,0.12)]">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Challenge & Solution */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${current.badgeColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">{current.name}</h3>
                <p className="text-xs font-semibold text-cyan-300 mt-0.5">{current.tagline}</p>
              </div>
            </div>

            {/* Pain Point */}
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                <AlertCircle className="h-4 w-4 text-rose-400" /> Systemic Entropy Hazard
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{current.painPoint}</p>
            </div>

            {/* Solution */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <ShieldCheck className="h-4 w-4 text-cyan-400" /> Autonomous 2080 Resolution
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{current.solution}</p>
            </div>

            {/* Features list */}
            <div className="grid sm:grid-cols-2 gap-2 pt-1">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: KPIs */}
          <div className="lg:col-span-5 bg-[#091124] border border-cyan-500/30 rounded-xl p-5 space-y-4">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 border-b border-cyan-500/20 pb-2">
              Verified Telemetry Benchmarks
            </div>

            <div className="space-y-2.5">
              {current.kpis.map((kpi, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#040813] border border-cyan-500/25 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-sans">{kpi.label}</span>
                  <span className="text-base font-black text-cyan-300">{kpi.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:brightness-110 transition"
              >
                INITIALIZE SECTOR PROTOCOL <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
