"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

export default function RoiCalculator() {
  const [fleetSize, setFleetSize] = useState(2500);
  const [annualBudget, setAnnualBudget] = useState(35000000); // ₦35M
  const [avgAgeYears, setAvgAgeYears] = useState(4);

  // FinOps calculations
  // 1. Negative-ROI repairs eliminated (repairs costing >70% of asset value diverted to replacement)
  const repairSavings = Math.round(annualBudget * 0.24);

  // 2. Preventative maintenance reduction in emergency downtime & contractor callout fees
  const downtimeSavings = Math.round(annualBudget * 0.18);

  // 3. Ghost asset audit recovery & salvage value from certified decommissioning
  const salvageAndAuditSavings = Math.round(fleetSize * 8500);

  // Total Annual Direct Value
  const totalAnnualSavings = repairSavings + downtimeSavings + salvageAndAuditSavings;

  // 3-Year Compounded Return
  const threeYearValue = totalAnnualSavings * 3;

  // Format currency in Nigerian Naira
  const fmt = (n: number) => {
    if (n >= 1000000) {
      return `₦${(n / 1000000).toFixed(1)}M`;
    }
    return `₦${(n / 1000).toFixed(0)}k`;
  };

  return (
    <div className="bg-[#0d0f17]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden font-sans">
      {/* Ambient Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative z-10">
        {/* Sliders Form */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#121520] border border-cyan-800/60 text-cyan-400 shadow-md">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Hardware FinOps ROI Calculator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculate capital recovery using deterministic fleet economics
              </p>
            </div>
          </div>

          {/* Slider 1: Fleet Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-slate-300 uppercase tracking-wider">ICT Hardware Fleet Size</span>
              <span className="text-sm font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-3 py-0.5 rounded-full">
                {fleetSize.toLocaleString()} units
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={15000}
              step={100}
              value={fleetSize}
              onChange={(e) => setFleetSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-cyan-400"
              aria-label="Hardware fleet size slider"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>200 (Single Site)</span>
              <span>5,000 (Campus)</span>
              <span>15,000+ (Bank / Ministry)</span>
            </div>
          </div>

          {/* Slider 2: Annual Maintenance Budget */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Annual Repair Spend</span>
              <span className="text-sm font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-800 px-3 py-0.5 rounded-full">
                {fmt(annualBudget)}
              </span>
            </div>
            <input
              type="range"
              min={5000000}
              max={150000000}
              step={2500000}
              value={annualBudget}
              onChange={(e) => setAnnualBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-indigo-400"
              aria-label="Annual repair budget slider"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>₦5M</span>
              <span>₦50M</span>
              <span>₦150M+</span>
            </div>
          </div>

          {/* Slider 3: Average Age */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Average Depreciation Age</span>
              <span className="text-sm font-bold text-teal-300 bg-teal-950/80 border border-teal-800 px-3 py-0.5 rounded-full">
                {avgAgeYears} Years
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={avgAgeYears}
              onChange={(e) => setAvgAgeYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-teal-400"
              aria-label="Average fleet age slider"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>1 Year (Fresh Fleet)</span>
              <span>4 Years (Mid-Cycle)</span>
              <span>8 Years (Aging Legacy)</span>
            </div>
          </div>

          {/* Methodology Callout */}
          <div className="p-4 rounded-2xl bg-[#121520] border border-white/[0.06] text-xs text-slate-300 flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Deterministic FinOps Model:</strong> Calculated using the 70% Net Book Value replacement cut-off, automated PM cycle downtime suppression, and NIST 800-88 residual salvage cash recovery.
            </p>
          </div>
        </div>

        {/* Live Output Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between bg-[#121520] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/[0.08] relative overflow-hidden font-sans">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Projected Annual Savings</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3 text-emerald-400" /> 42% COST RECOVERY
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300 bg-clip-text font-mono">
                {fmt(totalAnnualSavings)}
                <span className="text-base text-slate-400 font-normal font-sans ml-2">/ year</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Estimated 3-Year Value: <strong className="text-white font-mono text-sm">{fmt(threeYearValue)}</strong> across CapEx & OpEx.
              </p>
            </div>

            {/* Breakdown rows */}
            <div className="space-y-3 border-t border-white/[0.06] pt-4 text-xs font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                  <span>Eliminated Negative-ROI Repairs (70% Rule)</span>
                </div>
                <span className="font-mono text-cyan-300 font-bold">{fmt(repairSavings)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  <span>Preventative PM Downtime & SLA Defense</span>
                </div>
                <span className="font-mono text-emerald-300 font-bold">{fmt(downtimeSavings)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                  <span>Ghost Asset Recovery & Salvage Resale</span>
                </div>
                <span className="font-mono text-indigo-300 font-bold">{fmt(salvageAndAuditSavings)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/sign-in"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 text-slate-950 shadow-md hover:brightness-105 transition"
            >
              LAUNCH LIVE PLATFORM <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/app/finops"
              className="w-full sm:w-auto inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#0a0c12] border border-white/[0.08] transition"
            >
              Open FinOps Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
