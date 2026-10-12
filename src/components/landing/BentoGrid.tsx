"use client";

import Link from "next/link";
import {
  Coins,
  QrCode,
  Clock,
  Activity,
  MapPin,
  ArrowRight,
  ScanLine,
  Zap,
  Server,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-5 font-sans">
      {/* 1. FinOps 70% Crossover Rule (Span 7) */}
      <div className="lg:col-span-7 bg-white border border-slate-200/90 hover:border-cyan-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-100/70 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold mb-4">
            <Coins className="w-3.5 h-3.5 text-cyan-600" />
            <span>FINOPS FOUNDATION ALIGNED // FOCUS™ v1.0</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
            The 70% Crossover Rule: Halt runaway maintenance debt.
          </h3>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed font-normal">
            Pouring ₦1.6M into repeatedly patching a server with residual book value of ₦1.8M is financial negligence. AssetOps continuously evaluates cumulative repair debt against Net Book Value, automatically blocking the repair PO and redirecting capital to fresh CapEx procurement.
          </p>

          {/* Visual Mini Ledger */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold uppercase text-[10.5px]">
                SRV-DC-00281 (Dell PowerEdge R740)
              </span>
              <span className="text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded font-bold border border-rose-200 text-[10.5px]">
                THRESHOLD BREACH: 86% OF NBV
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex border border-slate-200">
              <div className="bg-cyan-500 h-full" style={{ width: "70%" }} />
              <div className="bg-rose-500 h-full animate-pulse" style={{ width: "16%" }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-700 pt-1 border-t border-slate-200">
              <span>Cumulative Repairs: ₦1,420,000</span>
              <span className="text-cyan-800 font-bold">₦480,000 Diverted to 2026 CapEx</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
          <span className="text-xs text-slate-500 font-mono">
            Inform · Optimize · Operate
          </span>
          <Link
            href="/app/finops"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800 group"
          >
            Explore FinOps Engine <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* 2. In-Browser PWA Camera Scanner (Span 5) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-teal-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-mono font-bold mb-4 backdrop-blur-md">
            <ScanLine className="w-3.5 h-3.5 text-teal-200" />
            <span>PWA MOBILE CAMERA SCANNER</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white leading-tight">
            Instant Field Scanning. Zero App Store downloads.
          </h3>
          <p className="text-teal-50 text-xs sm:text-sm mt-3 leading-relaxed font-normal">
            Equip field engineers inspecting an Abuja substation or Kano depot with direct in-browser HTML5 scanning. Tap to launch the laser HUD, scan serial tags, and inspect machine history in sub-seconds.
          </p>

          {/* Scanner Viewfinder Visual */}
          <div className="mt-5 p-4 rounded-2xl bg-teal-900/40 border border-teal-400/40 relative flex items-center justify-center font-mono backdrop-blur-md">
            <div className="w-44 h-24 border-2 border-white/80 rounded-xl relative flex items-center justify-center bg-teal-950/20">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent absolute animate-pulse shadow-sm shadow-cyan-300" />
              <QrCode className="w-10 h-10 text-white/40" />
            </div>
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-teal-100">
              <span>Laser HUD Active</span>
              <span>100% In-Browser PWA</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between relative z-10">
          <span className="text-xs text-teal-100 font-mono">Safari & Chrome Ready</span>
          <Link
            href="/app/scan"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-teal-100 group"
          >
            Launch Camera Scanner <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* 3. Automated SLA Engine & Vendor Penalty Credits (Span 4) */}
      <div className="lg:col-span-4 bg-white border border-slate-200/90 hover:border-amber-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-slate-200/40 transition-all">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold mb-3">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>LIVE SLA CLOCK & REBATES</span>
          </div>
          <h3 className="text-xl font-black text-slate-950 tracking-tight">
            Automated Vendor SLA Dispatch & Timer
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            The instant a Work Order opens, AssetOps triggers an automated email to vendor support (e.g. Cisco TAC, Schneider Electric). A live SLA timer starts ticking — any breach automatically routes financial penalty credits to your FinOps ledger.
          </p>

          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
              <span>Vendor: Schneider Power TAC</span>
              <span className="text-rose-600 animate-pulse">4h 12m REMAINING</span>
            </div>
            <div className="text-[10.5px] text-slate-600 font-sans">
              Contract Rebate: ₦25,000 / hour breached
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Contract SLA Enforced</span>
          <Link
            href="/app/work-orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 group"
          >
            Review Orders <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* 4. Critical Power & Cooling Telemetry (Span 4) */}
      <div className="lg:col-span-4 bg-white border border-slate-200/90 hover:border-emerald-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-slate-200/40 transition-all">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-3">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>CRITICAL POWER & COOLING</span>
          </div>
          <h3 className="text-xl font-black text-slate-950 tracking-tight">
            Autonomous IoT Work Order Dispatch
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Continuous SNMP telemetry monitors smart UPS battery swelling, voltage anomalies, and server room thermal runaway. When battery health drops below 40% or temperatures pass 28°C, a Critical Work Order is dispatched instantly.
          </p>

          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
              <span>APC Smart-UPS 3000</span>
              <span className="text-emerald-700 font-bold">94% HEALTH</span>
            </div>
            <div className="text-[10.5px] text-slate-600 font-sans">
              Autonomous 4-hour SLA dispatch rule armed
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Sub-Minute Polling</span>
          <Link
            href="/app/telemetry"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 group"
          >
            View Telemetry <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* 5. Zero-License Geospatial Stack (Span 4) */}
      <div className="lg:col-span-4 bg-white border border-slate-200/90 hover:border-cyan-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-slate-200/40 transition-all">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold mb-3">
            <MapPin className="w-3.5 h-3.5 text-cyan-600" />
            <span>ZERO-LICENSE GEOSPATIAL</span>
          </div>
          <h3 className="text-xl font-black text-slate-950 tracking-tight">
            Corporate HQs to Remote Project Sites
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Natively track Corporate HQs, regional branches, and client project sites (e.g. solar farms, marine terminals, transmission substations) with verified street addresses and 100% keyless OpenStreetMap vector clustering.
          </p>

          <div className="mt-4 p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-cyan-900">
              <span>Nationwide Locations</span>
              <span className="text-cyan-700 font-bold">100% KEYLESS OSM</span>
            </div>
            <div className="text-[10.5px] text-slate-600 font-sans">
              Zero Google Maps or Mapbox monthly API bills
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Vector Clustering</span>
          <Link
            href="/app/locations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800 group"
          >
            Inspect Fleet Map <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
