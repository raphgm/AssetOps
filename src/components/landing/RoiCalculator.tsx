"use client";

import { useState } from "react";
import Link from "next/link";
import { Cpu, ArrowRight, TrendingUp, Sparkles, Orbit, Radio, ShieldAlert } from "lucide-react";

export default function RoiCalculator() {
  const [fleetSize, setFleetSize] = useState(12500);
  const [annualBudget, setAnnualBudget] = useState(85000000); // Ꞙ85M
  const [avgAgeYears, setAvgAgeYears] = useState(4);

  // 2080 Thermodynamic FinOps calculations
  // 1. Molecular decay repairs diverted to plasma recycling centrifuges (14% lattice threshold)
  const repairSavings = Math.round(annualBudget * 0.28);

  // 2. Nanite swarm preventative re-soldering eliminating quantum decoherence outages
  const downtimeSavings = Math.round(annualBudget * 0.22);

  // 3. Sub-atomic salvage recovery from zero-state molecular purges
  const salvageAndAuditSavings = Math.round(fleetSize * 4200);

  // Total Annual Direct Value
  const totalAnnualSavings = repairSavings + downtimeSavings + salvageAndAuditSavings;

  // 3-Solar Cycle Compounded Return
  const threeYearValue = totalAnnualSavings * 3;

  // Format currency in Compute Credits (Ꞙ)
  const fmt = (n: number) => {
    if (n >= 1000000) {
      return `Ꞙ${(n / 1000000).toFixed(1)}M`;
    }
    return `Ꞙ${(n / 1000).toFixed(0)}k`;
  };

  return (
    <div className="relative rounded-2xl bg-[#060a16]/90 border border-cyan-500/30 p-6 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.12)] backdrop-blur-2xl overflow-hidden font-mono">
      {/* Background radial lasers */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Grid pattern */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative z-10">
        {/* Sliders Form */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-wider">
                THERMODYNAMIC FINOPS SIMULATOR
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Simulate sub-atomic cost recovery and Q-FLOP coherence preservation
              </p>
            </div>
          </div>

          {/* Slider 1: Quantum Substrate Fleet */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Quantum Substrate Nodes</span>
              <span className="font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/40">
                {fleetSize.toLocaleString()} Sub-Cores
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={fleetSize}
              onChange={(e) => setFleetSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-cyan-500/30"
              aria-label="Quantum core fleet size slider"
            />
            <div className="flex justify-between text-[10.5px] text-slate-500 font-sans">
              <span>1k (Ground Array)</span>
              <span>25k (Orbital Ring)</span>
              <span>100k+ (Planetary Grid)</span>
            </div>
          </div>

          {/* Slider 2: Annual Compute Credit Budget */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Cycle Thermodynamic Energy Budget</span>
              <span className="font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-500/40">
                {fmt(annualBudget)}
              </span>
            </div>
            <input
              type="range"
              min={10000000}
              max={300000000}
              step={5000000}
              value={annualBudget}
              onChange={(e) => setAnnualBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-400 border border-indigo-500/30"
              aria-label="Annual compute energy budget slider"
            />
            <div className="flex justify-between text-[10.5px] text-slate-500 font-sans">
              <span>Ꞙ10M Credits</span>
              <span>Ꞙ150M</span>
              <span>Ꞙ300M+</span>
            </div>
          </div>

          {/* Slider 3: Lattice Degradation Age */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Molecular Lattice Attrition Cycle</span>
              <span className="font-bold text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded border border-teal-500/40">
                {avgAgeYears} Solar Cycles
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={avgAgeYears}
              onChange={(e) => setAvgAgeYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400 border border-teal-500/30"
              aria-label="Lattice degradation cycle slider"
            />
            <div className="flex justify-between text-[10.5px] text-slate-500 font-sans">
              <span>Cycle 1 (Zero Entropy)</span>
              <span>Cycle 5 (Mid-Lattice)</span>
              <span>Cycle 10 (Critical Attrition)</span>
            </div>
          </div>

          {/* 2080 Governance Law callout */}
          <div className="p-3.5 rounded-xl bg-[#091124] border border-cyan-500/25 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Article 84: Autonomous Zero-Entropy Protocol</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              When lattice molecular attrition crosses 14%, quantum decoherence outpaces cooling efficiency. AssetOps auto-reroutes workloads and schedules nanite de-crystallization into plasma recycling.
            </p>
          </div>
        </div>

        {/* Live HUD Output Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between bg-gradient-to-br from-[#070d1e] to-[#040711] border border-cyan-400/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(0,240,255,0.15)] relative">
          <div className="absolute top-0 right-0 p-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full">
              <Radio className="h-3 w-3 text-emerald-400 animate-pulse" /> ENTROPY DECAY: -0.002%
            </span>
          </div>

          <div>
            <div className="border-b border-cyan-500/20 pb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400">Recovered Thermodynamic Capital</span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300 bg-clip-text">
                {fmt(totalAnnualSavings)}
                <span className="text-sm text-slate-400 font-normal font-sans ml-2">/ Solar Cycle</span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-2">
                Compounded 3-Cycle Yield: <strong className="text-cyan-300 font-mono text-sm">{fmt(threeYearValue)}</strong> across planetary arrays.
              </p>
            </div>

            {/* Breakdown rows */}
            <div className="space-y-3 border-t border-cyan-500/20 pt-4 text-xs font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                  <span>Molecular Lattice Decay Rerouting (14% Rule)</span>
                </div>
                <span className="text-cyan-300 font-bold">{fmt(repairSavings)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  <span>Autonomous Nanite Re-soldering & SLA Defense</span>
                </div>
                <span className="text-emerald-300 font-bold">{fmt(downtimeSavings)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                  <span>Sub-Atomic Zero-State Scrap Resale</span>
                </div>
                <span className="text-indigo-300 font-bold">{fmt(salvageAndAuditSavings)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:brightness-110 transition"
            >
              INITIALIZE NEURAL PILOT <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 transition"
            >
              Simulate in Holo-Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
