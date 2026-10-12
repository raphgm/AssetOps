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
  Cpu,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";

export default function BentoGrid() {
  // Live ticking countdown for the SLA Card
  const [secondsRemaining, setSecondsRemaining] = useState(15052);

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
      {/* 1. FINOPS 70% CROSSOVER ENGINE (SPAN 7 - 2085 QUANTUM HUD) */}
      {/* ========================================================== */}
      <div className="lg:col-span-7 bg-[#070b14] border border-cyan-500/30 hover:border-cyan-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:shadow-[0_0_70px_rgba(6,182,212,0.25)] transition-all relative overflow-hidden group">
        {/* Holographic Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 2085 Cybernetic Corner Accents */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400/40 select-none">⌜ 2085.FINOPS ⌝</div>
        <div className="absolute top-3 right-3 text-[10px] font-mono text-cyan-400/40 select-none">⌞ GATE_ACTIVE ⌟</div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Coins className="w-3.5 h-3.5 text-cyan-400" />
              <span>FINOPS FOUNDATION // FOCUS™ v1.0</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse">
              86% OF NBV BREACHED
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              The 70% Crossover Rule
              <span className="text-xs font-mono font-semibold text-cyan-400/80 border border-cyan-400/30 px-2 py-0.5 rounded bg-cyan-950/40">
                v2085.4
              </span>
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
              Quantum mathematical CapEx gate automatically halts negative-ROI maintenance bleeding.
            </p>
          </div>

          {/* 2085 Holographic FinOps Ledger HUD */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-3.5 font-mono backdrop-blur-md relative overflow-hidden">
            {/* Cyber Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <div className="flex items-center justify-between text-xs relative z-10">
              <span className="font-bold text-cyan-200 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                SRV-DC-04 (Dell PowerEdge R740)
              </span>
              <span className="text-rose-400 font-black tracking-wide">
                ₦1,120,000 / ₦1,300,000 NBV
              </span>
            </div>

            {/* Glowing Split Bar Meter */}
            <div className="space-y-1 relative z-10">
              <div className="w-full bg-slate-800/90 h-4 rounded-full overflow-hidden flex border border-slate-700/80 p-0.5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-l-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                  style={{ width: "70%" }}
                  title="70% Legal Safe Zone"
                />
                <div
                  className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-r-full shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-pulse"
                  style={{ width: "16%" }}
                  title="16% Critical Breach"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 px-1">
                <span>0% DEPRECIATION</span>
                <span className="text-cyan-400 font-bold">70% CAPEX THRESHOLD</span>
                <span className="text-rose-400 font-bold">86% SINKHOLE</span>
              </div>
            </div>

            {/* Neon Data Telemetry Cards */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] relative z-10">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-rose-500/30 flex items-center justify-between">
                <span className="text-slate-400">Cumulative Sunk Cost:</span>
                <span className="font-black text-rose-400">₦1,120,000</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="text-emerald-300">Diverted to CapEx:</span>
                <span className="font-black text-emerald-300">+₦480,000</span>
              </div>
            </div>

            {/* 2085 System Override Alert */}
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 flex items-center justify-between text-xs text-rose-200 font-bold relative z-10 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400 animate-pulse" />
                SYSTEM LOCK: Repair PO Automatically Blocked
              </span>
              <span className="text-[10px] bg-rose-900/90 text-rose-200 px-2.5 py-1 rounded font-mono border border-rose-500/60 shadow-inner">
                DIVERTED TO 2025 CAPEX
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono relative z-10">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Autonomous FinOps Arbitrage Engine
          </span>
          <Link
            href="/app/finops"
            className="inline-flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300 group"
          >
            Launch FinOps Core{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. PWA CAMERA SCANNER (SPAN 5 - 2085 OPTICAL HUD) */}
      {/* ========================================================== */}
      <div className="lg:col-span-5 bg-[#05111a] border border-teal-500/30 hover:border-teal-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_50px_rgba(20,184,166,0.15)] hover:shadow-[0_0_70px_rgba(20,184,166,0.25)] transition-all relative overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* HUD Crosshairs */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-teal-400/40 select-none">⌜ OPTICAL.HUD ⌝</div>
        <div className="absolute top-3 right-3 text-[10px] font-mono text-teal-400/40 select-none">⌞ LIDAR.450NM ⌟</div>

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-400/40 text-teal-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <ScanLine className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
            <span>PWA MOBILE NEURAL SCANNER</span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Instant Field Camera
            </h3>
            <p className="text-teal-200/80 text-xs sm:text-sm mt-0.5 font-medium">
              0.08s optical & QR neural decode. Zero app store installs.
            </p>
          </div>

          {/* 2085 Sci-Fi Optical Viewfinder */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-teal-400/40 font-mono space-y-3 backdrop-blur-md relative overflow-hidden">
            <div className="w-full h-28 border border-teal-500/50 rounded-xl relative flex items-center justify-center bg-teal-950/20 overflow-hidden shadow-inner">
              {/* Laser Sweeper Beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" />
              
              {/* Target HUD Reticle */}
              <div className="w-16 h-16 border-2 border-dashed border-teal-400/60 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: "12s" }}>
                <div className="w-8 h-8 border border-cyan-300 rounded-full" />
              </div>
              <QrCode className="w-10 h-10 text-teal-300/40 absolute" />

              <div className="absolute top-2 left-2 text-[9px] text-teal-300 font-bold tracking-wider">
                ● LASER ACTIVE // 450nm
              </div>
              <div className="absolute top-2 right-2 text-[9px] text-cyan-300 font-bold">
                FPS: 120
              </div>
              <div className="absolute bottom-2 left-2 text-[9px] text-teal-300/70 font-mono">
                [X: 421.9 // Y: 894.2]
              </div>
              <div className="absolute bottom-2 right-2 text-[9px] text-emerald-300 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                0.08s DECODE
              </div>
            </div>

            {/* Scanned Tag Holographic Pill */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-teal-500/40 text-slate-100 flex items-center justify-between text-xs shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-black text-cyan-300 tracking-wider">LAP-005128</span>
                <span className="text-slate-400 text-[11px]">MacBook Pro M3 Max</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold text-[10px] shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                89% HEALTH
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono relative z-10">
          <span className="text-teal-300/70">WebRTC // Zero Plugins</span>
          <Link
            href="/app/scan"
            className="inline-flex items-center gap-1.5 font-bold text-teal-300 hover:text-teal-200 group"
          >
            Launch Camera{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 3. AUTOMATED SLA COUNTDOWN CLOCK (SPAN 4 - 2085 CHRONOMETER) */}
      {/* ========================================================== */}
      <div className="lg:col-span-4 bg-[#0a0f18] border border-amber-500/30 hover:border-amber-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_40px_rgba(245,158,11,0.12)] hover:shadow-[0_0_60px_rgba(245,158,11,0.2)] transition-all relative overflow-hidden group">
        <div className="absolute top-3 left-3 text-[10px] font-mono text-amber-400/40 select-none">⌜ TAC.SLA_WATCH ⌝</div>

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
            <span>2085 SLA CHRONOMETER</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Automated Vendor SLA
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Breaches auto-credit contractual financial penalty rebates.
            </p>
          </div>

          {/* 2085 Digital Cyber Chronometer Visual */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 text-center font-mono space-y-2.5 backdrop-blur-md relative overflow-hidden">
            <div className="text-[10px] uppercase font-bold text-amber-400/80 tracking-widest flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              TAC RESPONSE COUNTDOWN
            </div>
            
            {/* Glowing Digital Time Display */}
            <div className="text-4xl font-black text-rose-400 tracking-widest py-1 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
              {formattedTime}
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-amber-500/30">
              <div
                className="bg-gradient-to-r from-amber-400 via-rose-500 to-red-600 h-full shadow-[0_0_10px_#f43f5e]"
                style={{ width: "65%" }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-300 font-bold">
              <span className="text-amber-300">Schneider Electric TAC</span>
              <span className="text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                ₦25,000 / hr Penalty
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono relative z-10">
          <span className="text-slate-400">Zero Manual Dispute</span>
          <Link
            href="/app/work-orders"
            className="inline-flex items-center gap-1.5 font-bold text-amber-400 hover:text-amber-300 group"
          >
            Review Orders{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 4. AUTONOMOUS IOT POWER & THERMAL (SPAN 4 - 2085 TELEMETRY) */}
      {/* ========================================================== */}
      <div className="lg:col-span-4 bg-[#081214] border border-emerald-500/30 hover:border-emerald-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_40px_rgba(16,185,129,0.12)] hover:shadow-[0_0_60px_rgba(16,185,129,0.2)] transition-all relative overflow-hidden group">
        <div className="absolute top-3 left-3 text-[10px] font-mono text-emerald-400/40 select-none">⌜ IOT.NEURAL_LINK ⌝</div>

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>CRITICAL POWER & COOLING</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Autonomous IoT Telemetry
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Continuous SNMP triggers 4-hour SLA dispatch on threshold spikes.
            </p>
          </div>

          {/* Dual 2085 Holographic Telemetry Rings */}
          <div className="grid grid-cols-2 gap-2.5 font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 text-center relative overflow-hidden shadow-inner">
              <div className="text-[10px] uppercase font-bold text-emerald-400/80">UPS Battery</div>
              <div className="text-3xl font-black text-emerald-400 mt-1 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                94%
              </div>
              <div className="text-[10px] text-emerald-300 font-bold mt-0.5">● Healthy Cell</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-center relative overflow-hidden shadow-inner">
              <div className="text-[10px] uppercase font-bold text-cyan-400/80">Airflow Temp</div>
              <div className="text-3xl font-black text-cyan-300 mt-1 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                22.4°C
              </div>
              <div className="text-[10px] text-cyan-300 font-bold mt-0.5">● Cool &lt;28°C</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 flex items-center justify-between text-[11px] font-mono text-slate-200">
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Auto-Dispatch Rule Armed
            </span>
            <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
              4-HR SLA
            </span>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono relative z-10">
          <span className="text-slate-400">Sub-Minute Polling</span>
          <Link
            href="/app/telemetry"
            className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 group"
          >
            View Telemetry{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 5. ZERO-LICENSE GEOSPATIAL FLEET (SPAN 4 - 2085 ORBITAL RADAR) */}
      {/* ========================================================== */}
      <div className="lg:col-span-4 bg-[#06101e] border border-cyan-500/30 hover:border-cyan-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_40px_rgba(6,182,212,0.12)] hover:shadow-[0_0_60px_rgba(6,182,212,0.2)] transition-all relative overflow-hidden group">
        <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400/40 select-none">⌜ ORBITAL.GIS ⌝</div>

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>SOVEREIGN VECTOR GIS</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Nationwide Fleet GIS
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              100% keyless OpenStreetMap vector clustering. Zero API bills.
            </p>
          </div>

          {/* 2085 Interactive Orbital Radar Display */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 font-mono space-y-2.5 relative overflow-hidden">
            {/* Concentric Radar Circles with Rotating Sweep Beam */}
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full border border-cyan-500/20 pointer-events-none flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-cyan-500/30 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-cyan-500/40 animate-ping opacity-30" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-xs relative z-10">
              <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30 shadow-sm">
                <div className="text-[9px] text-cyan-300 font-bold">Lagos HQ</div>
                <div className="font-black text-white mt-0.5">5,410</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30 shadow-sm">
                <div className="text-[9px] text-cyan-300 font-bold">Abuja CBD</div>
                <div className="font-black text-white mt-0.5">4,120</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/30 shadow-sm">
                <div className="text-[9px] text-cyan-300 font-bold">Epe Solar</div>
                <div className="font-black text-white mt-0.5">1,840</div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex items-center justify-between text-[10.5px] text-slate-200 relative z-10">
              <span className="text-slate-400">Google Maps / Mapbox Invoices:</span>
              <span className="font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                ₦0 / MONTH
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono relative z-10">
          <span className="text-slate-400">Zero Cloud Egress</span>
          <Link
            href="/app/locations"
            className="inline-flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300 group"
          >
            Inspect Fleet Map{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
