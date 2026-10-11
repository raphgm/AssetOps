"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, TrendingUp, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

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

  // Format currency in Nigerian Naira or standard
  const fmt = (n: number) => {
    if (n >= 1000000) {
      return `₦${(n / 1000000).toFixed(1)}M`;
    }
    return `₦${(n / 1000).toFixed(0)}k`;
  };

  return (
    <div className="card border-accent/30 bg-surface/80 backdrop-blur p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Sliders Form */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-accent/10 text-accent">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-fg">Hardware FinOps ROI Calculator</h3>
              <p className="text-xs text-mute">Simulate cost recovery based on deterministic fleet economics</p>
            </div>
          </div>

          {/* Slider 1: Fleet Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-mute uppercase tracking-wider">ICT Hardware Fleet Size</span>
              <span className="font-mono text-sm font-semibold text-accent">{fleetSize.toLocaleString()} units</span>
            </div>
            <input
              type="range"
              min={200}
              max={15000}
              step={100}
              value={fleetSize}
              onChange={(e) => setFleetSize(Number(e.target.value))}
              className="w-full h-2 bg-raised rounded-lg appearance-none cursor-pointer accent-[#5eead4]"
              aria-label="Hardware fleet size slider"
            />
            <div className="flex justify-between text-[10px] text-dim font-mono">
              <span>200 (Single branch)</span>
              <span>5,000 (Medium campus)</span>
              <span>15,000+ (Bank / Ministry)</span>
            </div>
          </div>

          {/* Slider 2: Annual Maintenance Budget */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-mute uppercase tracking-wider">Annual ICT Maintenance & Repair Spend</span>
              <span className="font-mono text-sm font-semibold text-accent">{fmt(annualBudget)}</span>
            </div>
            <input
              type="range"
              min={5000000}
              max={150000000}
              step={2500000}
              value={annualBudget}
              onChange={(e) => setAnnualBudget(Number(e.target.value))}
              className="w-full h-2 bg-raised rounded-lg appearance-none cursor-pointer accent-[#5eead4]"
              aria-label="Annual repair budget slider"
            />
            <div className="flex justify-between text-[10px] text-dim font-mono">
              <span>₦5M</span>
              <span>₦50M</span>
              <span>₦150M+</span>
            </div>
          </div>

          {/* Slider 3: Fleet Average Age */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-mute uppercase tracking-wider">Average Fleet Age (Depreciation Horizon)</span>
              <span className="font-mono text-sm font-semibold text-accent">{avgAgeYears} Years</span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={avgAgeYears}
              onChange={(e) => setAvgAgeYears(Number(e.target.value))}
              className="w-full h-2 bg-raised rounded-lg appearance-none cursor-pointer accent-[#5eead4]"
              aria-label="Average fleet age slider"
            />
            <div className="flex justify-between text-[10px] text-dim font-mono">
              <span>1 Year (Fresh fleet)</span>
              <span>4 Years (Mid-cycle)</span>
              <span>8 Years (High-debt legacy)</span>
            </div>
          </div>

          {/* Methodology Callout */}
          <div className="p-3.5 rounded-lg border border-line bg-bg/50 text-[11.5px] text-mute space-y-1">
            <div className="flex items-center gap-1.5 text-fg font-medium">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Deterministic Financial Model</span>
            </div>
            <p>
              Calculated using the 70% Net Book Value replacement threshold, proactive PM cycle downtime suppression, and NIST 800-88 residual asset salvage recovery.
            </p>
          </div>
        </div>

        {/* Live Results Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between bg-raised/70 border border-line2 rounded-xl p-6 relative">
          <div>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-[11px] uppercase tracking-wider text-dim">Projected Annual Savings</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ok bg-ok/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" /> 42% Cost Leakage Recovery
              </span>
            </div>

            <div className="my-5">
              <div className="text-4xl sm:text-5xl font-bold tracking-tight text-accent font-mono">
                {fmt(totalAnnualSavings)}
                <span className="text-base text-mute font-normal font-sans ml-2">/ year</span>
              </div>
              <p className="text-xs text-mute mt-1.5">
                Estimated 3-Year Compounded Impact: <strong className="text-fg">{fmt(threeYearValue)}</strong> across CapEx & OpEx.
              </p>
            </div>

            {/* Breakdown item rows */}
            <div className="space-y-3 border-t border-line pt-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-fg">Eliminated Negative-ROI Repairs (70% Rule)</span>
                </div>
                <span className="font-mono font-medium text-fg">{fmt(repairSavings)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-ok" />
                  <span className="text-fg">Preventative PM Downtime & SLA Defense</span>
                </div>
                <span className="font-mono font-medium text-fg">{fmt(downtimeSavings)}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-info" />
                  <span className="text-fg">Ghost Asset Recovery & NIST Salvage Resale</span>
                </div>
                <span className="font-mono font-medium text-fg">{fmt(salvageAndAuditSavings)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-line flex flex-col sm:flex-row items-center gap-3">
            <Link href="/sign-up" className="btn btn-accent btn-lg w-full sm:w-auto flex-1 font-medium">
              Start Free Assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/sign-in" className="btn btn-lg w-full sm:w-auto">
              Simulate in Live Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
