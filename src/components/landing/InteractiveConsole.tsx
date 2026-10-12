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
  Table,
  BarChart3,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Clock,
  Radio,
  Cpu,
} from "lucide-react";

type TabId = "finops" | "scanner" | "telemetry" | "gis";
type FinOpsViewMode = "chart" | "ledger";

interface FiscalYearData {
  year: string;
  age: number;
  beginningNBV: number;
  depreciation: number;
  endingNBV: number;
  threshold70: number;
  periodRepair: number;
  cumulativeRepair: number;
  ratio: number;
  isBreached: boolean;
  status: "Historical" | "Current Evaluation" | "Projected";
}

export default function InteractiveConsole() {
  const [activeTab, setActiveTab] = useState<TabId>("finops");
  const [finopsView, setFinopsView] = useState<FinOpsViewMode>("chart");

  // Real enterprise asset: Dell PowerEdge R740 2U (Dual Xeon Gold, 128GB RAM)
  // Acquisition (FY2022): ₦2,400,000
  // 5-Year Straight-Line Depreciation to ₦200,000 salvage floor = ₦440,000 / year
  // Current Age: Year 3 (FY2024)
  // Beginning NBV Year 3: ₦1,520,000 | Ending NBV: ₦1,080,000 | Midpoint Average: ₦1,300,000
  // 70% Cutoff Ceiling at Year 3 = 0.70 * ₦1,300,000 = ₦910,000
  // Historical repairs: FY2022 = ₦80,000; FY2023 = ₦240,000 (Total past = ₦320,000)
  const [proposedQuote, setProposedQuote] = useState(650000); // ₦650,000 quote

  const acquisitionCapEx = 2400000;
  const salvageFloor = 200000;
  const annualDepr = 440000;
  const currentAssetAge = 3;

  // Year 3 Current Financials
  const currentNBV = 1300000;
  const currentCeiling = Math.round(currentNBV * 0.7); // ₦910,000
  const historicalRepairs = 320000;
  const totalCumulativeCurrent = historicalRepairs + proposedQuote;
  const currentRatio = Math.round((totalCumulativeCurrent / currentNBV) * 100);
  const isCurrentBreached = totalCumulativeCurrent >= currentCeiling;
  const variance = currentCeiling - totalCumulativeCurrent;

  // Build authentic 5-year IFRS depreciation schedule
  const fiscalYears: FiscalYearData[] = [
    {
      year: "FY2022",
      age: 1,
      beginningNBV: 2400000,
      depreciation: 440000,
      endingNBV: 1960000,
      threshold70: Math.round(2180000 * 0.7),
      periodRepair: 80000,
      cumulativeRepair: 80000,
      ratio: Math.round((80000 / 2180000) * 100),
      isBreached: false,
      status: "Historical",
    },
    {
      year: "FY2023",
      age: 2,
      beginningNBV: 1960000,
      depreciation: 440000,
      endingNBV: 1520000,
      threshold70: Math.round(1740000 * 0.7),
      periodRepair: 240000,
      cumulativeRepair: 320000,
      ratio: Math.round((320000 / 1740000) * 100),
      isBreached: false,
      status: "Historical",
    },
    {
      year: "FY2024 (Now)",
      age: 3,
      beginningNBV: 1520000,
      depreciation: 440000,
      endingNBV: 1080000,
      threshold70: currentCeiling,
      periodRepair: proposedQuote,
      cumulativeRepair: totalCumulativeCurrent,
      ratio: currentRatio,
      isBreached: isCurrentBreached,
      status: "Current Evaluation",
    },
    {
      year: "FY2025 (Proj)",
      age: 4,
      beginningNBV: 1080000,
      depreciation: 440000,
      endingNBV: 640000,
      threshold70: Math.round(860000 * 0.7),
      periodRepair: 350000,
      cumulativeRepair: totalCumulativeCurrent + 350000,
      ratio: Math.round(((totalCumulativeCurrent + 350000) / 860000) * 100),
      isBreached: totalCumulativeCurrent + 350000 >= Math.round(860000 * 0.7),
      status: "Projected",
    },
    {
      year: "FY2026 (Decom)",
      age: 5,
      beginningNBV: 640000,
      depreciation: 440000,
      endingNBV: salvageFloor,
      threshold70: Math.round(420000 * 0.7),
      periodRepair: 0,
      cumulativeRepair: totalCumulativeCurrent + 350000,
      ratio: Math.round(((totalCumulativeCurrent + 350000) / 420000) * 100),
      isBreached: true,
      status: "Projected",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden font-sans text-slate-900 ring-1 ring-slate-100">
      {/* 1. TOP CONSOLE TOOLBAR */}
      <div className="bg-slate-50/95 px-5 py-3 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
            AssetOps Enterprise Console
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-medium">
            SRV-DC-04 // Lagos Marina DC
          </span>
        </div>

        {/* Console Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
          {[
            { id: "finops" as TabId, label: "70% FinOps Engine", icon: Coins },
            { id: "scanner" as TabId, label: "Camera QR Scanner", icon: QrCode },
            { id: "telemetry" as TabId, label: "Power & Thermal Telemetry", icon: Activity },
            { id: "gis" as TabId, label: "Nationwide GIS Map", icon: MapPin },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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

      {/* 2. MAIN VIEWPORT */}
      <div className="p-5 sm:p-7 min-h-[460px]">
        {/* ========================================================== */}
        {/* TAB 1: 70% FINOPS ACTUARIAL & LIFECYCLE REPLACEMENT ENGINE */}
        {/* ========================================================== */}
        {activeTab === "finops" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Asset Specification & Accounting Header */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-950">
                    Dell PowerEdge R740 2U Dual Xeon
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                    TIER-III CORE COMPUTE
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    S/N: CN-0G792-716
                  </span>
                </div>
                <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Installed: March 2022 (Marina HQ Data Center, Rack 04-B)</span>
                  <span>Cost Center: 7104-IT (Core Banking Infrastructure)</span>
                  <span>Depreciation: 5-Yr Straight-Line (IFRS / GAAP)</span>
                </div>
              </div>

              {/* View Switcher: Chart vs Ledger */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setFinopsView("chart")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    finopsView === "chart"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Fiscal Lifecycle Chart</span>
                </button>
                <button
                  onClick={() => setFinopsView("ledger")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    finopsView === "ledger"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Depreciation Ledger</span>
                </button>
              </div>
            </div>

            {/* Interactive Quotation Simulator Strip */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Simulate Proposed FY2024 Work Order Repair Quote:
                  </span>
                </div>

                {/* Scenario Presets */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 text-[11px]">Presets:</span>
                  <button
                    onClick={() => setProposedQuote(240000)}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 font-medium text-slate-700 transition"
                  >
                    ₦240k (Fan & PSU - Safe)
                  </button>
                  <button
                    onClick={() => setProposedQuote(560000)}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 font-medium text-slate-700 transition"
                  >
                    ₦560k (Drive Array - Near Gate)
                  </button>
                  <button
                    onClick={() => setProposedQuote(850000)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 font-semibold text-rose-700 transition"
                  >
                    ₦850k (System Board - Breached)
                  </button>
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">Proposed Work Order Quote:</span>
                  <span className="text-base font-black text-slate-950 font-mono">
                    ₦{proposedQuote.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1100000"
                  step="25000"
                  value={proposedQuote}
                  onChange={(e) => setProposedQuote(Number(e.target.value))}
                  className="w-full accent-cyan-600 bg-slate-200 h-2 rounded-lg cursor-pointer border border-slate-200"
                />
                <div className="flex justify-between text-[10.5px] font-mono text-slate-400">
                  <span>₦100k (Routine Maintenance)</span>
                  <span>70% Replacement Ceiling: ₦910,000</span>
                  <span>₦1.1M (Severe Sunk Cost)</span>
                </div>
              </div>
            </div>

            {/* VIEW A: AUTHENTIC FISCAL LIFECYCLE BAR / COMPARISON CHART */}
            {finopsView === "chart" && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className="w-3 h-3 rounded bg-cyan-600 inline-block" /> Net Book Value
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className="w-3 h-3 rounded bg-slate-300 inline-block" /> 70% Replacement Gate
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Cumulative Maintenance Spend
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Year 3 Status: {isCurrentBreached ? "⚠ 70% Gate Breached" : "✓ Within Economic Envelope"}
                  </span>
                </div>

                {/* 5 Fiscal Columns Comparison */}
                <div className="grid grid-cols-5 gap-3 pt-2">
                  {fiscalYears.map((fy) => {
                    const isEvalYear = fy.age === 3;
                    const maxVal = 2400000;
                    const nbvHeight = Math.round((fy.beginningNBV / maxVal) * 160);
                    const threshHeight = Math.round((fy.threshold70 / maxVal) * 160);
                    const repairHeight = Math.round((fy.cumulativeRepair / maxVal) * 160);

                    return (
                      <div
                        key={fy.year}
                        className={`rounded-xl p-3 flex flex-col justify-between border transition-all ${
                          isEvalYear
                            ? "bg-white border-2 border-cyan-400 shadow-md ring-2 ring-cyan-500/20"
                            : "bg-white/70 border-slate-200"
                        }`}
                      >
                        {/* Year Title */}
                        <div className="text-center pb-2 border-b border-slate-100">
                          <div className="text-xs font-bold text-slate-900">{fy.year}</div>
                          <div className="text-[10px] text-slate-500">{fy.status}</div>
                        </div>

                        {/* Comparative Bars Area */}
                        <div className="h-44 flex items-end justify-center gap-2 py-2 relative">
                          {/* 70% Threshold Horizontal Marker on Active Column */}
                          <div
                            className="absolute inset-x-0 border-t border-dashed border-indigo-400/80 z-10 pointer-events-none"
                            style={{ bottom: `${threshHeight}px` }}
                          />

                          {/* Net Book Value Bar */}
                          <div className="w-1/2 flex flex-col items-center">
                            <span className="text-[9px] font-mono text-slate-500 mb-1">
                              ₦{(fy.beginningNBV / 1000000).toFixed(1)}M
                            </span>
                            <div
                              className="w-full bg-gradient-to-t from-cyan-700 to-cyan-500 rounded-t-md transition-all duration-300"
                              style={{ height: `${nbvHeight}px` }}
                            />
                            <span className="text-[9px] text-slate-500 mt-1">NBV</span>
                          </div>

                          {/* Cumulative Repair Bar */}
                          <div className="w-1/2 flex flex-col items-center">
                            <span
                              className={`text-[9px] font-mono font-bold mb-1 ${
                                fy.isBreached ? "text-rose-600" : "text-emerald-700"
                              }`}
                            >
                              ₦{(fy.cumulativeRepair / 1000000).toFixed(1)}M
                            </span>
                            <div
                              className={`w-full rounded-t-md transition-all duration-300 ${
                                fy.isBreached
                                  ? "bg-gradient-to-t from-rose-700 to-rose-500"
                                  : "bg-gradient-to-t from-emerald-700 to-emerald-500"
                              }`}
                              style={{ height: `${Math.min(160, repairHeight)}px` }}
                            />
                            <span className="text-[9px] text-slate-500 mt-1">Repairs</span>
                          </div>
                        </div>

                        {/* Bottom Ratio Badge */}
                        <div className="pt-2 border-t border-slate-100 text-center">
                          <div
                            className={`text-[10.5px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              fy.isBreached
                                ? "bg-rose-100 text-rose-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {fy.ratio}% of NBV
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW B: IFRS / GAAP DEPRECIATION & REPAIR LEDGER (TABLE) */}
            {finopsView === "ledger" && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[10.5px] uppercase">
                      <tr>
                        <th className="py-3 px-4">Accounting Period</th>
                        <th className="py-3 px-4">Beginning NBV</th>
                        <th className="py-3 px-4">Depreciation</th>
                        <th className="py-3 px-4">70% Gate</th>
                        <th className="py-3 px-4">Period Repair</th>
                        <th className="py-3 px-4">Cumulative Debt</th>
                        <th className="py-3 px-4">Repair Ratio</th>
                        <th className="py-3 px-4">Audit Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                      {fiscalYears.map((row) => {
                        const isEval = row.age === 3;
                        return (
                          <tr
                            key={row.year}
                            className={isEval ? "bg-cyan-50/50 font-bold" : "hover:bg-slate-50/50"}
                          >
                            <td className="py-3 px-4 font-sans font-bold flex items-center gap-2">
                              {row.year}
                              {isEval && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-600 text-white font-mono">
                                  CURRENT
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">₦{row.beginningNBV.toLocaleString()}</td>
                            <td className="py-3 px-4 text-slate-500">₦{row.depreciation.toLocaleString()}</td>
                            <td className="py-3 px-4 text-indigo-700 font-bold">
                              ₦{row.threshold70.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">₦{row.periodRepair.toLocaleString()}</td>
                            <td className="py-3 px-4">₦{row.cumulativeRepair.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded font-bold ${
                                  row.isBreached
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {row.ratio}%
                              </span>
                            </td>
                            <td className="py-3 px-4 font-sans">
                              {row.isBreached ? (
                                <span className="text-rose-700 font-bold flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5" /> Block PO · Divert to CapEx
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve Maintenance PO
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Official FOCUS™ / FinOps Audit Enforcement Verdict */}
            <div
              className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-sm ${
                isCurrentBreached
                  ? "bg-rose-50 border-rose-300 text-rose-950"
                  : "bg-emerald-50 border-emerald-300 text-emerald-950"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl border mt-0.5 shrink-0 ${
                    isCurrentBreached
                      ? "bg-rose-100 border-rose-300 text-rose-700"
                      : "bg-emerald-100 border-emerald-300 text-emerald-700"
                  }`}
                >
                  {isCurrentBreached ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-sm uppercase tracking-wide">
                      {isCurrentBreached
                        ? "FINOPS THRESHOLD BREACHED: REPAIR PO BLOCKED"
                        : "FINOPS COMPLIANCE VERIFIED: REPAIR PO APPROVED"}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isCurrentBreached
                          ? "bg-rose-200 text-rose-900 border border-rose-300"
                          : "bg-emerald-200 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      {currentRatio}% OF NET BOOK VALUE
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-sans leading-relaxed">
                    {isCurrentBreached
                      ? `Proposed quote pushes lifetime repair spend to ₦${totalCumulativeCurrent.toLocaleString()}, exceeding the ₦${currentCeiling.toLocaleString()} economic replacement ceiling. Under the 70% rule, sinking further repair capital into this server is negative-ROI. Capital automatically rerouted to 2025 CapEx replacement queue.`
                      : `Proposed quote keeps lifetime repair spend (₦${totalCumulativeCurrent.toLocaleString()}) safely beneath the ₦${currentCeiling.toLocaleString()} threshold. You retain ₦${variance.toLocaleString()} in repair buffer before replacement is mandated. Work order authorized for vendor dispatch.`}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 font-mono">
                {isCurrentBreached ? (
                  <Link
                    href="/app/finops"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition"
                  >
                    View CapEx Queue <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href="/app/work-orders"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition"
                  >
                    Authorize PO <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: IN-BROWSER CAMERA QR SCANNER & DIGITAL ASSET PASSPORT */}
        {/* ========================================================== */}
        {activeTab === "scanner" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Modern Phone Viewfinder with Laser Scanner */}
              <div className="max-w-[280px] mx-auto w-full aspect-[9/16] bg-slate-900 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800 relative overflow-hidden flex flex-col justify-between">
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto" />

                {/* Laser Viewfinder */}
                <div className="relative my-auto w-48 h-48 border-2 border-cyan-400 rounded-2xl mx-auto flex items-center justify-center overflow-hidden bg-slate-950/70">
                  <div className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" />
                  <QrCode className="w-24 h-24 text-white/30" />
                  <div className="absolute bottom-2 text-[9px] font-mono text-cyan-300 font-bold">
                    CAMERA ACTIVE // AUTO-FOCUS
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 font-mono pb-2">
                  HTML5 WebRTC · Works in Safari & Chrome
                </div>
              </div>

              {/* Scanned Hardware Inspection Record */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-slate-700">QR PASSPORT // SCANNED ASSET RECORD</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    STATUS: ACTIVE
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Asset Tag:</span>
                    <span className="font-bold text-slate-900">SRV-DC-04</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Hardware Model:</span>
                    <span className="font-bold text-slate-900">Dell PowerEdge R740</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Serial Number:</span>
                    <span className="font-bold text-cyan-800">CN-0G792-716</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Assigned Facility:</span>
                    <span className="font-bold text-slate-900">Marina HQ DC (Rack 04-B)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">FinOps Threshold:</span>
                    <span className="font-bold text-rose-600">86% of NBV (Replacement Due)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Data Sanitization:</span>
                    <span className="font-bold text-emerald-700">NIST SP 800-88 rev 1 Compliant</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/app/scan"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition"
                  >
                    Open Live Field Camera Scanner <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: LIVE TELEMETRY SENSORS (UPS POWER & THERMAL) */}
        {/* ========================================================== */}
        {activeTab === "telemetry" && (
          <div className="space-y-5 animate-fadeIn font-mono">
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Dial 1: APC UPS Battery Gauge */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-between text-center space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  APC SMART-UPS 3000 // BATTERY TELEMETRY
                </span>
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
                      strokeDashoffset="25.12"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900">92%</span>
                    <span className="text-[9px] text-emerald-700 font-bold uppercase">Optimal Cell Health</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500">Autonomous SLA dispatch triggers if &lt;40%</div>
              </div>

              {/* Dial 2: Server Room Thermal Sensor */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-between text-center space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  TIER-III RACK 04-B // AIRFLOW TEMPERATURE
                </span>
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
                      strokeDashoffset="125.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900">22.4°C</span>
                    <span className="text-[9px] text-cyan-600 font-bold uppercase">Within ASHRAE Standard</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500">Thermal Limit: 28.0°C before automated alert</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
              <span className="text-amber-900 font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                Live SNMP Traps Armed: Critical 4-Hour Vendor SLA Clock
              </span>
              <span className="px-2.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                ACTIVE TELEMETRY
              </span>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: NATIONWIDE FLEET GIS VECTOR MAP */}
        {/* ========================================================== */}
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
