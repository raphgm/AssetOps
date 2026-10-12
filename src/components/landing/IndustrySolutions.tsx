"use client";

import { useState } from "react";
import { Landmark, Hospital, GraduationCap, Building2, Check, ArrowUpRight, ShieldCheck, AlertCircle } from "lucide-react";
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
    tagline: "Sub-picosecond quantum entanglement sync & zero trading desynchronization",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    painPoint:
      "When orbital-to-terrestrial quantum relays suffer phase decoherence, algorithmic trading vaults freeze. Banks bleed trillions in compute arbitrage while archaic ledgers fail to prove entanglement fidelity.",
    solution:
      "AssetOps provides sub-nanosecond hardware health telemetry across terrestrial vaults and orbital satellite arrays, autonomous nanite waveguide stabilization, and cryptographic molecular purge certs for retired QPUs.",
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
    name: "Bio-Digital Hospitals & Synthetic Life",
    icon: Hospital,
    tagline: "Life-critical organ synthesis consoles & zero-entropy neural ICU telemetry",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    painPoint:
      "Hardware degradation in synthetic organ printers, cryogenic preservation pods, and neural ICU consoles risks human lives. Biomedical teams battle micro-lattice stress fractures that human eyes cannot see.",
    solution:
      "AssetOps tracks clinical hardware down to the exact bio-theatre chamber. Autonomous nanite inspection swarms execute laser micro-welds weeks before molecular breakdown occurs.",
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
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    painPoint:
      "Tens of thousands of neural-interface headsets and quantum student compute pods are scattered across vast continental campuses. Ghost asset leakage is rampant, and pods face decoherence during exams.",
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
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    painPoint:
      "Public sector ministries struggle with unverified hardware on paper ledgers, untracked procurement vendor contracts, and recurring repair budgets on obsolete quantum cores.",
    solution:
      "AssetOps enforces drone-verified physical inventory of every sovereign asset, automates thermodynamic straight-line depreciation, and applies the 14% lattice rule to stop contractor repair waste.",
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
    <div className="space-y-6">
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
                  ? "bg-white border-slate-300 shadow-md ring-2 ring-cyan-500/30"
                  : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${ind.badgeColor}`}>
                  <ItemIcon className="h-5 w-5" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                    LOCKED
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-slate-900">{ind.name}</div>
              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-sans">{ind.tagline}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Industry Detail Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-slate-200/50">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Challenge & Solution */}
          <div className="lg:col-span-7 space-y-5 font-sans">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl border ${current.badgeColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-950 tracking-tight">{current.name}</h3>
                <p className="text-xs font-bold text-cyan-700 mt-0.5 font-mono">{current.tagline}</p>
              </div>
            </div>

            {/* Pain Point */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                <AlertCircle className="h-4 w-4 text-rose-600" /> Systemic Entropy Hazard
              </div>
              <p className="text-xs text-rose-950 leading-relaxed font-medium">{current.painPoint}</p>
            </div>

            {/* Solution */}
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                <ShieldCheck className="h-4 w-4 text-teal-600" /> Autonomous 2080 Resolution
              </div>
              <p className="text-xs text-teal-950 leading-relaxed font-medium">{current.solution}</p>
            </div>

            {/* Features list */}
            <div className="grid sm:grid-cols-2 gap-2 pt-1">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                  <Check className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: KPIs */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 font-mono">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 border-b border-slate-200 pb-2">
              Verified Telemetry Benchmarks
            </div>

            <div className="space-y-2.5">
              {current.kpis.map((kpi, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between shadow-sm">
                  <span className="text-xs font-medium text-slate-600 font-sans">{kpi.label}</span>
                  <span className="text-base font-black text-cyan-700">{kpi.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-black bg-slate-950 hover:bg-slate-800 text-white shadow-md transition"
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
