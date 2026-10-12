"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Coins,
  Activity,
  MapPin,
  ArrowRight,
  Server,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  TrendingDown,
  Info,
} from "lucide-react";

type TabId = "finops" | "scanner" | "telemetry" | "gis";

export default function InteractiveConsole() {
  const [activeTab, setActiveTab] = useState<TabId>("finops");

  // Lifecycle FinOps parameters for Dell PowerEdge R740
  // Year 1 (Acquisition): ₦2,400,000
  // Year 3 (Current Age): Net Book Value = ₦1,200,000
  // 70% Threshold at Year 3 = ₦840,000
  // Historical past repairs = ₦280,000
  const acquisitionCost = 2400000;
  const currentNBV = 1200000;
  const historicalRepairs = 280000;
  const cutoffLimit = Math.round(currentNBV * 0.7); // ₦840,000

  // Repair quote slider state
  const [repairQuote, setRepairQuote] = useState(620000); // ₦620k quote

  // Total cumulative repairs = historical + proposed quote
  const totalCumulativeRepair = historicalRepairs + repairQuote;
  const ratio = Math.round((totalCumulativeRepair / currentNBV) * 100);
  const isBreached = ratio >= 70;
  const cushion = cutoffLimit - totalCumulativeRepair;

  // Exact mathematical crossover time (t between 1.0 and 5.0)
  // NBV(t) = 2400000 - (t - 1) * 550000
  // Threshold(t) = 0.70 * NBV(t) = 1680000 - (t - 1) * 385000
  // Repair(t) = 80000 + (t - 1) * ((totalCumulativeRepair - 80000) / 2) (through current age Year 3)
  // Solve for t: Threshold(t) = Repair(t)
  const repairSlope = (totalCumulativeRepair - 80000) / 2;
  const denom = 385000 + repairSlope;
  const t_cross_raw = denom > 0 ? 1 + (1680000 - 80000) / denom : 3.0;
  const t_cross = Math.max(1.2, Math.min(4.8, t_cross_raw));

  // SVG Coordinates for 600 x 200 viewBox
  // X range: x=60 (Year 1) to x=540 (Year 5). Step per year = 120px.
  // Y range: y=25 (₦2.4M) to y=175 (₦0). Height = 150px.
  const getX = (year: number) => 60 + (year - 1) * 120;
  const getY = (val: number) => 175 - (Math.max(0, Math.min(acquisitionCost, val)) / acquisitionCost) * 150;

  // Points on NBV curve
  const nbvPts = [1, 2, 3, 4, 5].map((yr) => ({
    x: getX(yr),
    y: getY(2400000 - (yr - 1) * 550000),
  }));

  // Points on 70% Threshold curve
  const threshPts = [1, 2, 3, 4, 5].map((yr) => ({
    x: getX(yr),
    y: getY((2400000 - (yr - 1) * 550000) * 0.7),
  }));

  // Points on Cumulative Repair curve
  const repairPts = [1, 2, 3, 4, 5].map((yr) => {
    let val = 80000;
    if (yr === 2) val = historicalRepairs;
    else if (yr === 3) val = totalCumulativeRepair;
    else if (yr === 4) val = totalCumulativeRepair + 280000;
    else if (yr === 5) val = totalCumulativeRepair + 550000;
    return { x: getX(yr), y: getY(val) };
  });

  // EXACT intersection coordinate:
  const intersectX = getX(t_cross);
  const intersectVal = 1680000 - (t_cross - 1) * 385000;
  const intersectY = getY(intersectVal);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden font-sans text-slate-900 ring-1 ring-slate-100 relative group">
      {/* Top Console Bar */}
      <div className="bg-slate-50/90 px-5 py-3.5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs font-mono text-slate-500 font-bold hidden sm:inline">
            ASSETOPS FINOPS ENGINE v2.4
          </span>
          <span className="inline-flex items-center gap-1 text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            MATHEMATICAL SIMULATOR
          </span>
        </div>

        {/* Visual Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-200">
          {[
            { id: "finops" as TabId, label: "70% Crossover Chart", icon: Coins },
            { id: "scanner" as TabId, label: "Live Scanner HUD", icon: QrCode },
            { id: "telemetry" as TabId, label: "Power & Thermal", icon: Activity },
            { id: "gis" as TabId, label: "Fleet Node Map", icon: MapPin },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === id
                  ? "bg-white text-cyan-800 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-cyan-600" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="p-5 sm:p-7 min-h-[460px]">
        {/* 1. VISUAL FINOPS CROSSOVER CHART */}
        {activeTab === "finops" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Stat Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-200/80">
                <div className="text-[10px] uppercase font-bold text-slate-500">Acquisition CapEx</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">₦2,400,000</div>
                <div className="text-[10.5px] text-cyan-700 font-bold">Year 1 Original Cost</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Net Book Value (Age 3)</div>
                <div className="text-lg font-black text-slate-900 mt-0.5">₦1,200,000</div>
                <div className="text-[10.5px] text-slate-600 font-bold">50% Residual Value</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80">
                <div className="text-[10px] uppercase font-bold text-slate-500">70% Replacement Gate</div>
                <div className="text-lg font-black text-indigo-900 mt-0.5">₦840,000</div>
                <div className="text-[10.5px] text-indigo-700 font-bold">Economic Repair Ceiling</div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border transition-colors ${
                  isBreached
                    ? "bg-rose-50/80 border-rose-200 text-rose-900"
                    : "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-slate-500">Proposed Cumulative Spend</div>
                <div className="text-lg font-black mt-0.5">₦{totalCumulativeRepair.toLocaleString()}</div>
                <div className="text-[10.5px] font-bold">
                  {isBreached ? `⚠ ${ratio}% OF NBV (BREACHED)` : `✓ ${ratio}% OF NBV (SAFE)`}
                </div>
              </div>
            </div>

            {/* Interactive Control Strip */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Adjust Proposed Repair Quote to Model 70% Cutoff:
                  </span>
                </div>

                {/* Preset quick buttons */}
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    onClick={() => setRepairQuote(320000)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-cyan-400 font-bold text-slate-700 transition"
                  >
                    ₦320k (50% Safe)
                  </button>
                  <button
                    onClick={() => setRepairQuote(520000)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-cyan-400 font-bold text-slate-700 transition"
                  >
                    ₦520k (67% Margin)
                  </button>
                  <button
                    onClick={() => setRepairQuote(760000)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 hover:border-rose-500 font-bold text-rose-700 transition"
                  >
                    ₦760k (87% Breach)
                  </button>
                </div>
              </div>

              {/* Slider with glowing track */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Proposed Work Order Quote:</span>
                  <span className="text-cyan-800 font-black text-sm">
                    ₦{repairQuote.toLocaleString()}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="150000"
                    max="1100000"
                    step="10000"
                    value={repairQuote}
                    onChange={(e) => setRepairQuote(Number(e.target.value))}
                    className="w-full accent-cyan-600 bg-slate-200 h-2.5 rounded-lg cursor-pointer border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* High-Fidelity SVG Financial Crossover Canvas */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm font-mono relative overflow-hidden">
              {/* Legend Bar */}
              <div className="flex flex-wrap items-center justify-between text-[11px] gap-2 pb-1 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-bold text-cyan-800">
                    <span className="w-3 h-0.5 bg-cyan-600 inline-block" /> Net Book Value (Depreciation)
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-indigo-700">
                    <span className="w-3 h-0.5 bg-indigo-500 stroke-dasharray inline-block" /> 70% FinOps Replacement Gate
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-rose-600">
                    <span className="w-3 h-0.5 bg-rose-500 inline-block" /> Cumulative Repair Trajectory
                  </span>
                </div>
                <span className="text-slate-400 text-[10px]">Asset: Dell PowerEdge R740 (S/N: CN-0X892)</span>
              </div>

              {/* SVG Canvas */}
              <div className="relative w-full h-56">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    {/* Gradients */}
                    <linearGradient id="safeFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.01" />
                    </linearGradient>
                    <linearGradient id="breachFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[
                    { label: "₦2.4M", val: 2400000 },
                    { label: "₦1.8M", val: 1800000 },
                    { label: "₦1.2M", val: 1200000 },
                    { label: "₦600k", val: 600000 },
                    { label: "₦0", val: 0 },
                  ].map((grid, i) => {
                    const y = getY(grid.val);
                    return (
                      <g key={i}>
                        <line x1="45" y1={y} x2="560" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                        <text x="40" y={y + 3.5} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                          {grid.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Vertical Year Grid Lines */}
                  {[1, 2, 3, 4, 5].map((yr) => {
                    const x = getX(yr);
                    return (
                      <g key={yr}>
                        <line x1={x} y1="20" x2={x} y2="175" stroke="#f1f5f9" strokeWidth="1" />
                        <text x={x} y="190" textAnchor="middle" fontSize="10" fill={yr === 3 ? "#0f172a" : "#64748b"} fontWeight={yr === 3 ? "bold" : "normal"} fontFamily="monospace">
                          {yr === 3 ? "Year 3 (Now)" : `Year ${yr}`}
                        </text>
                      </g>
                    );
                  })}

                  {/* 1. Net Book Value Line (Cyan) */}
                  <path
                    d={`M ${nbvPts.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                    fill="none"
                    stroke="#0891b2"
                    strokeWidth="3"
                  />

                  {/* 2. 70% Replacement Gate Line (Indigo Dashed) */}
                  <path
                    d={`M ${threshPts.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* 3. Cumulative Repair Curve (Green if safe, Rose if breached) */}
                  <path
                    d={`M ${repairPts.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                    fill="none"
                    stroke={isBreached ? "#e11d48" : "#059669"}
                    strokeWidth="3.5"
                    className="transition-all duration-150"
                  />

                  {/* Vertical Drop Line from Crossover Point to X-Axis */}
                  <line
                    x1={intersectX}
                    y1={intersectY}
                    x2={intersectX}
                    y2="175"
                    stroke={isBreached ? "#e11d48" : "#6366f1"}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Exact Mathematical Crossover Marker: LIES DIRECTLY ON BOTH CURVES */}
                  <circle
                    cx={intersectX}
                    cy={intersectY}
                    r="8"
                    fill={isBreached ? "#e11d48" : "#6366f1"}
                    className="animate-ping opacity-75"
                  />
                  <circle
                    cx={intersectX}
                    cy={intersectY}
                    r="5"
                    fill="#ffffff"
                    stroke={isBreached ? "#e11d48" : "#6366f1"}
                    strokeWidth="3"
                  />

                  {/* Year 3 Current Evaluation Dot */}
                  <circle
                    cx={getX(3)}
                    cy={getY(totalCumulativeRepair)}
                    r="4"
                    fill={isBreached ? "#e11d48" : "#059669"}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>

                {/* Floating Tooltip at Exact Crossover */}
                <div
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-full mb-2 bg-slate-950 text-white px-2.5 py-1 rounded-lg shadow-xl text-[10px] font-mono border border-slate-700 whitespace-nowrap z-20"
                  style={{
                    left: `${(intersectX / 600) * 100}%`,
                    top: `${(intersectY / 200) * 100}%`,
                  }}
                >
                  <div className="font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    70% Crossover: Year {t_cross.toFixed(1)}
                  </div>
                  <div className="text-slate-300 text-[9px]">Ceiling: ₦{Math.round(intersectVal).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* FinOps Decision Engine Output Card */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-sm ${
                isBreached
                  ? "bg-rose-50 border-rose-200 text-rose-950"
                  : "bg-emerald-50 border-emerald-200 text-emerald-950"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl border mt-0.5 ${
                    isBreached ? "bg-rose-100 border-rose-300 text-rose-700" : "bg-emerald-100 border-emerald-300 text-emerald-700"
                  }`}
                >
                  {isBreached ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm uppercase tracking-wide">
                      {isBreached
                        ? "FINOPS THRESHOLD BREACHED (REPAIR PO BLOCKED)"
                        : "FINOPS COMPLIANCE VERIFIED (REPAIR APPROVED)"}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isBreached ? "bg-rose-200 text-rose-900" : "bg-emerald-200 text-emerald-900"
                      }`}
                    >
                      {ratio}% OF NBV
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-1 font-sans">
                    {isBreached
                      ? `Proposed repairs push lifetime spend past 70% of residual value. Repair PO halted automatically to avoid sunk cost trap. Requisition diverted to 2026 CapEx procurement queue.`
                      : `Cumulative spend remains within the safe economic envelope. You have ₦${cushion.toLocaleString()} repair cushion before the replacement trigger is engaged.`}
                  </p>
                </div>
              </div>

              <div className="shrink-0 font-mono">
                {isBreached ? (
                  <Link
                    href="/app/finops"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition"
                  >
                    CapEx Queue <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href="/app/work-orders"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition"
                  >
                    Dispatch Order <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. VISUAL IN-BROWSER SCANNER VIEW */}
        {activeTab === "scanner" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Phone Mockup with Laser Viewfinder */}
              <div className="max-w-[280px] mx-auto w-full aspect-[9/16] bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800 relative overflow-hidden flex flex-col justify-between">
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto" />

                {/* Laser Viewfinder */}
                <div className="relative my-auto w-48 h-48 border-2 border-cyan-400/80 rounded-2xl mx-auto flex items-center justify-center overflow-hidden bg-slate-950/60">
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" />
                  <QrCode className="w-24 h-24 text-white/30" />
                  <div className="absolute bottom-2 text-[9px] font-mono text-cyan-300 font-bold">
                    SCANNING BARCODE / QR
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 font-mono pb-2">
                  Direct HTML5 WebRTC · 0 Downloads
                </div>
              </div>

              {/* Scanned Hardware Inspection Record */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-slate-700">QR PASSPORT SCANNED // INSTANT RECORD</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    MATCH: 100%
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Asset Tag:</span>
                    <span className="font-bold text-slate-900">SRV-DC-04</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Model:</span>
                    <span className="font-bold text-slate-900">Dell PowerEdge R740</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Serial No:</span>
                    <span className="font-bold text-cyan-800">CN-0X892-716</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Facility:</span>
                    <span className="font-bold text-slate-900">Marina HQ DC (Rack 04-B)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">FinOps Gate:</span>
                    <span className="font-bold text-rose-600">86% of NBV (Replacement Due)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Data Sanitization:</span>
                    <span className="font-bold text-emerald-700">NIST SP 800-88 Compliant</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/app/scan"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition"
                  >
                    Open Live Camera Scanner <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. VISUAL TELEMETRY GAUGES */}
        {activeTab === "telemetry" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid sm:grid-cols-2 gap-5 font-mono">
              {/* Dial 1: APC UPS Battery Gauge */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-between text-center space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase">APC SMART-UPS 3000 // BATTERY CELL</span>
                {/* SVG Gauge */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="25.12" // 90%
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900">92%</span>
                    <span className="text-[9px] text-emerald-700 font-bold uppercase">Optimal Health</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-mono">Auto-dispatches critical work order if &lt;40%</div>
              </div>

              {/* Dial 2: Server Room Thermal Gauge */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-between text-center space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase">TIER-III RACK 04-B // THERMAL SENSOR</span>
                {/* SVG Gauge */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="125.6" // 50%
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900">22.4°C</span>
                    <span className="text-[9px] text-cyan-600 font-bold uppercase">Airflow Cool</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-mono">Thermal Limit: 28°C max before auto-dispatch</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs font-mono">
              <span className="text-amber-900 font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                Automatic Critical Work Order trigger armed for 4-hour SLA
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                AUTO DISPATCH
              </span>
            </div>
          </div>
        )}

        {/* 4. VISUAL FLEET NODE MAP */}
        {activeTab === "gis" && (
          <div className="space-y-4 animate-fadeIn font-mono">
            <div className="h-72 rounded-2xl bg-slate-100 border border-slate-200 relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Node 1: Lagos HQ */}
              <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center animate-ping absolute" />
                <div className="w-5 h-5 rounded-full bg-cyan-600 border-2 border-white shadow-md relative z-10" />
                <div className="mt-1 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-[10.5px] font-bold text-slate-800 whitespace-nowrap">
                  Lagos HQ Tier-III (5,410 Units)
                </div>
              </div>

              {/* Node 2: Abuja Federal */}
              <div className="absolute top-1/4 right-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-indigo-600 border-2 border-white shadow-md relative z-10" />
                <div className="mt-1 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-[10.5px] font-bold text-slate-800 whitespace-nowrap">
                  Abuja Fed Complex (4,120 Units)
                </div>
              </div>

              {/* Node 3: Epe Solar Project */}
              <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-md relative z-10" />
                <div className="mt-1 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-[10.5px] font-bold text-slate-800 whitespace-nowrap">
                  Epe Solar Substation (1,840 Units)
                </div>
              </div>

              {/* Node 4: Port Harcourt */}
              <div className="absolute bottom-1/5 right-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-emerald-600 border-2 border-white shadow-md relative z-10" />
                <div className="mt-1 bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-slate-200 text-[10.5px] font-bold text-slate-800 whitespace-nowrap">
                  Port Harcourt Hub (2,952 Units)
                </div>
              </div>

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-xl border border-slate-200 text-[10px] text-slate-600">
                100% Keyless OpenStreetMap Tiles · Zero API Fees
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
