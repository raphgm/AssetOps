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

  // 2. Preventative maintenance reduction in emergency downtime & urgent contractor callout fees
  const downtimeSavings = Math.round(annualBudget * 0.18);

  // 3. Ghost asset audit recovery & salvage salvage value from certified decommissioning
  const salvageAndAuditSavings = Math.round(fleetSize * 8500);

  // Total Annual Direct Value
  const totalAnnualSavings = repairSavings + downtimeSavings + salvageAndAuditSavings;

  // 3-Year Compounded Financial Return
  const threeYearValue = totalAnnualSavings * 3;

  // Format currency
  const fmt = (n: number) => {
    if (n >= 1000000) {
      return `₦${(n / 1000000).toFixed(1)}M`;
    }
    return `₦${(n / 1000).toFixed(0)}k`;
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 relative overflow-hidden">
      {/* Decorative ambient color glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-100/60 via-cyan-100/40 to-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">
        {/* Sliders Form */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 shadow-sm">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Hardware FinOps Calculator</h3>
              <p className="text-xs text-slate-500">Estimate immediate cost recovery on physical hardware</p>
            </div>
          </div>

          {/* Slider 1: Fleet Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 uppercase tracking-wider">ICT Fleet Size</span>
              <span className="font-mono text-sm font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
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
              className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600 border border-slate-200"
              aria-label="Hardware fleet size slider"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>200 (Single Site)</span>
              <span>5,000 (Campus)</span>
              <span>15,000+ (Bank / Ministry)</span>
            </div>
          </div>

          {/* Slider 2: Annual Maintenance Budget */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 uppercase tracking-wider">Annual Repair & Maintenance Spend</span>
              <span className="font-mono text-sm font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
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
              className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600 border border-slate-200"
              aria-label="Annual repair budget slider"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>₦5M</span>
              <span>₦50M</span>
              <span>₦150M+</span>
            </div>
          </div>

          {/* Slider 3: Fleet Average Age */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 uppercase tracking-wider">Average Hardware Age</span>
              <span className="font-mono text-sm font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
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
              className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-slate-200"
              aria-label="Average fleet age slider"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>1 Year (Fresh Fleet)</span>
              <span>4 Years (Mid-Cycle)</span>
              <span>8 Years (Aging Legacy)</span>
            </div>
          </div>

          {/* Micro explanation */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              Powered by the <strong className="text-slate-800">70% Net Book Value rule</strong>, proactive PM cycle downtime suppression, and NIST 800-88 salvage credit recovery.
            </p>
          </div>
        </div>

        {/* Live Results Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl" />

          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Projected Annual Savings</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" /> 42% Recovery
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-teal-400 font-mono">
                {fmt(totalAnnualSavings)}
                <span className="text-base text-slate-400 font-normal font-sans ml-2">/ year</span>
              </div>
              <p className="text-xs text-slate-300 mt-2">
                Estimated 3-Year Value: <strong className="text-white font-mono text-sm">{fmt(threeYearValue)}</strong> across CapEx & OpEx.
              </p>
            </div>

            {/* Breakdown rows */}
            <div className="space-y-3 border-t border-slate-800/80 pt-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-teal-400" />
                  <span className="text-slate-300">Eliminated Negative-ROI Repairs (70% Rule)</span>
                </div>
                <span className="font-mono font-bold text-teal-300">{fmt(repairSavings)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">PM Downtime & SLA Breach Defense</span>
                </div>
                <span className="font-mono font-bold text-emerald-300">{fmt(downtimeSavings)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="text-slate-300">Ghost Asset Recovery & Salvage Resale</span>
                </div>
                <span className="font-mono font-bold text-cyan-300">{fmt(salvageAndAuditSavings)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 text-slate-950 shadow-md hover:brightness-105 transition"
            >
              Start Free Assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
            >
              Simulate in Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
