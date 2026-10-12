"use client";

import { useEffect, useState } from "react";
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
  AlertTriangle,
  Radio,
} from "lucide-react";

export default function BentoGrid() {
  // Live ticking countdown for the SLA Card
  const [secondsRemaining, setSecondsRemaining] = useState(15102);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-5 font-sans">
      {/* ========================================================== */}
      {/* 1. FINOPS 70% CROSSOVER ENGINE (SPAN 7 - VISUAL FIRST) */}
      {/* ========================================================== */}
      <div className="lg:col-span-7 bg-white border-2 border-slate-200/90 hover:border-cyan-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold">
              <Coins className="w-3.5 h-3.5 text-cyan-600" />
              <span>FINOPS FOUNDATION // FOCUS™ v1.0</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              86% OF NBV BREACHED
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-950 tracking-tight">
              The 70% Crossover Rule
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
              Automated CapEx gate halts negative-ROI repair spending.
            </p>
          </div>

          {/* High-Impact Visual FinOps Comparison Graphic */}
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">SRV-DC-04 (Dell PowerEdge R740)</span>
              <span className="text-rose-700 font-black">₦1,120,000 / ₦1,300,000 NBV</span>
            </div>

            {/* Split Bar Meter */}
            <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden flex border border-slate-300">
              <div className="bg-cyan-600 h-full" style={{ width: "70%" }} title="70% Safe Zone" />
              <div className="bg-rose-500 h-full animate-pulse" style={{ width: "16%" }} title="16% Breach" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Cumulative Sunk Cost:</span>
                <span className="font-bold text-rose-600">₦1,120,000</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="text-emerald-800">Diverted to CapEx:</span>
                <span className="font-bold text-emerald-900">+₦480,000</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-950 font-bold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Repair PO Automatically Blocked
              </span>
              <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded font-mono">
                DIVERTED TO 2025 CAPEX
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Mathematical Replacement Gate</span>
          <Link
            href="/app/finops"
            className="inline-flex items-center gap-1.5 font-bold text-cyan-700 hover:text-cyan-800 group"
          >
            Open FinOps Engine <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. PWA CAMERA SCANNER (SPAN 5 - VISUAL HUD) */}
      {/* ========================================================== */}
      <div className="lg:col-span-5 bg-gradient-to-br from-teal-600 to-cyan-800 text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl relative overflow-hidden group">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-mono font-bold backdrop-blur-md">
            <ScanLine className="w-3.5 h-3.5 text-teal-200" />
            <span>PWA MOBILE CAMERA SCANNER</span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Instant Field Camera Scanner
            </h3>
            <p className="text-teal-100 text-xs sm:text-sm mt-0.5 font-medium">
              Sub-second QR & barcode recognition. Zero app installs.
            </p>
          </div>

          {/* Visual Viewfinder & Scanned Card */}
          <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-400/30 font-mono space-y-3 backdrop-blur-md">
            <div className="w-full h-24 border-2 border-white/70 rounded-xl relative flex items-center justify-center bg-teal-950/30 overflow-hidden">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" />
              <QrCode className="w-12 h-12 text-white/50" />
              <div className="absolute top-2 left-2 text-[9px] text-teal-200 font-bold">LASER ACTIVE</div>
              <div className="absolute bottom-2 right-2 text-[9px] text-teal-200 font-bold">0.2s DECODE</div>
            </div>

            {/* Scanned Tag Result Pill */}
            <div className="p-2.5 rounded-xl bg-white/95 text-slate-900 flex items-center justify-between text-xs shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-black text-cyan-800">LAP-005128</span>
                <span className="text-slate-500 text-[11px]">MacBook Pro M3 Max</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                89% HEALTH
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-mono relative z-10">
          <span className="text-teal-100">Safari & Chrome WebRTC</span>
          <Link
            href="/app/scan"
            className="inline-flex items-center gap-1.5 font-bold text-white hover:text-teal-100 group"
          >
            Launch Camera <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 3. AUTOMATED SLA COUNTDOWN CLOCK (SPAN 4 - VISUAL FIRST) */}
      {/* ========================================================== */}
      <div className="lg:col-span-4 bg-white border-2 border-slate-200/90 hover:border-amber-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>LIVE SLA CLOCK</span>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-950 tracking-tight">
              Automated Vendor SLA Timer
            </h3>
            <p className="text-slate-600 text-xs mt-0.5">
              Breaches auto-credit contractual financial penalty rebates.
            </p>
          </div>

          {/* Giant Digital Countdown Timer Visual */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 text-center font-mono space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-500">
              Vendor TAC Response Countdown
            </div>
            <div className="text-3xl font-black text-rose-600 tracking-wider">
              {formattedTime}
            </div>
            <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full" style={{ width: "65%" }} />
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 text-amber-950 font-bold">
              <span>Schneider Electric TAC</span>
              <span className="text-rose-700">₦25,000 / hr Penalty</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Contract SLA Enforced</span>
          <Link
            href="/app/work-orders"
            className="inline-flex items-center gap-1.5 font-bold text-amber-800 hover:text-amber-900 group"
          >
            Review Orders <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 4. AUTONOMOUS IOT POWER & THERMAL (SPAN 4 - VISUAL FIRST) */}
      {/* ========================================================== */}
      <div className="lg:col-span-4 bg-white border-2 border-slate-200/90 hover:border-emerald-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>CRITICAL POWER & COOLING</span>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-950 tracking-tight">
              Autonomous IoT Telemetry
            </h3>
            <p className="text-slate-600 text-xs mt-0.5">
              Continuous SNMP triggers 4-hour SLA dispatch on threshold spikes.
            </p>
          </div>

          {/* Dual Visual Telemetry Dials */}
          <div className="grid grid-cols-2 gap-2.5 font-mono">
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">UPS Battery</div>
              <div className="text-2xl font-black text-emerald-800 mt-1">94%</div>
              <div className="text-[10px] text-emerald-700 font-bold">Healthy Cell</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-500">Airflow Temp</div>
              <div className="text-2xl font-black text-cyan-800 mt-1">22.4°C</div>
              <div className="text-[10px] text-cyan-700 font-bold">Cool &lt;28°C</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-slate-700 font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Auto-Dispatch Rule Armed
            </span>
            <span className="text-emerald-700 font-bold">4-HR SLA</span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Sub-Minute Polling</span>
          <Link
            href="/app/telemetry"
            className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 group"
          >
            View Telemetry <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 5. ZERO-LICENSE GEOSPATIAL FLEET (SPAN 4 - VISUAL FIRST) */}
      {/* ========================================================== */}
      <div className="lg:col-span-4 bg-white border-2 border-slate-200/90 hover:border-cyan-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold">
            <MapPin className="w-3.5 h-3.5 text-cyan-600" />
            <span>ZERO-LICENSE GEOSPATIAL</span>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-950 tracking-tight">
              Nationwide Fleet GIS
            </h3>
            <p className="text-slate-600 text-xs mt-0.5">
              100% keyless OpenStreetMap vector clustering. Zero API bills.
            </p>
          </div>

          {/* Mini Interactive Node Radar Visual */}
          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 font-mono space-y-2 relative overflow-hidden">
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-[9px] text-slate-500 font-bold">Lagos HQ</div>
                <div className="font-black text-slate-900 mt-0.5">5,410</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-[9px] text-slate-500 font-bold">Abuja CBD</div>
                <div className="font-black text-slate-900 mt-0.5">4,120</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-[9px] text-slate-500 font-bold">Epe Solar</div>
                <div className="font-black text-slate-900 mt-0.5">1,840</div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white/90 border border-slate-200 flex items-center justify-between text-[10.5px]">
              <span className="text-slate-600">Google Maps / Mapbox Invoices:</span>
              <span className="font-black text-emerald-700">₦0 / MONTH</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Vector Clustering</span>
          <Link
            href="/app/locations"
            className="inline-flex items-center gap-1.5 font-bold text-cyan-700 hover:text-cyan-800 group"
          >
            Inspect Fleet Map <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
