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
  AlertTriangle,
} from "lucide-react";

export default function BentoGrid() {
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
      {/* 1. FinOps 70% Crossover Rule (Span 7) */}
      <div className="lg:col-span-7 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 text-xs font-medium">
              <Coins className="w-3.5 h-3.5 text-cyan-600" />
              FinOps Foundation // FOCUS™ v1.0
            </span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
              86% of NBV Breached
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              The 70% Crossover Rule
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Automated CapEx gate halts negative-ROI repair spending before approval.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                SRV-DC-04 (Dell PowerEdge R740)
              </span>
              <span className="text-rose-600 font-bold">₦1,120,000 / ₦1,300,000 NBV</span>
            </div>

            {/* Split Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-cyan-600 h-full rounded-l-full" style={{ width: "70%" }} />
              <div className="bg-rose-500 h-full rounded-r-full" style={{ width: "16%" }} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-500">Cumulative Sunk Cost</span>
                <span className="font-bold text-slate-900">₦1,120,000</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <span className="text-emerald-700">Diverted to CapEx</span>
                <span className="font-bold text-emerald-800">+₦480,000</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-between text-rose-900 font-medium">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                Repair PO Automatically Blocked
              </span>
              <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-rose-200 font-semibold text-rose-700">
                Diverted to 2025 CapEx
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">Mathematical Replacement Gate</span>
          <Link
            href="/app/finops"
            className="inline-flex items-center gap-1.5 font-semibold text-cyan-700 hover:text-cyan-800 group"
          >
            Open FinOps Engine{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 2. Instant Field Camera Scanner (Span 5) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-teal-700 to-cyan-900 text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-medium backdrop-blur-sm">
            <ScanLine className="w-3.5 h-3.5 text-teal-200" />
            PWA Mobile Camera Scanner
          </span>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Instant Field Camera Scanner
            </h3>
            <p className="text-teal-100/90 text-sm mt-1">
              Sub-second QR & barcode recognition. Zero app installs required.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-950/40 border border-white/10 space-y-3 backdrop-blur-sm">
            <div className="w-full h-24 border border-white/30 rounded-lg relative flex items-center justify-center bg-teal-950/20 overflow-hidden">
              <div className="absolute inset-x-0 h-0.5 bg-cyan-300 shadow-[0_0_8px_#22d3ee] animate-pulse top-1/2 -translate-y-1/2" />
              <QrCode className="w-10 h-10 text-white/40" />
              <div className="absolute top-2 left-2 text-[10px] text-teal-200 font-medium">Laser Active</div>
              <div className="absolute bottom-2 right-2 text-[10px] text-teal-200 font-semibold">0.2s Decode</div>
            </div>

            <div className="p-2.5 rounded-lg bg-white text-slate-900 flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-900">LAP-005128</span>
                <span className="text-slate-500 text-[11px]">MacBook Pro M3 Max</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                89% Health
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <span className="text-teal-100">Safari & Chrome WebRTC</span>
          <Link
            href="/app/scan"
            className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-teal-100 group"
          >
            Launch Camera{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 3. Automated Vendor SLA Timer (Span 4) */}
      <div className="lg:col-span-4 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-800 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Live SLA Clock
          </span>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Automated Vendor SLA Timer
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Breaches auto-credit contractual financial penalty rebates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 text-center space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              TAC Response Countdown
            </div>
            <div className="text-3xl font-extrabold text-rose-600 font-mono tracking-wider">
              {formattedTime}
            </div>
            <div className="w-full bg-amber-200/70 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: "65%" }} />
            </div>
            <div className="flex items-center justify-between text-xs pt-1 font-medium">
              <span className="text-slate-700">Schneider Electric TAC</span>
              <span className="text-rose-600 font-semibold">₦25,000 / hr Penalty</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">Contract Enforced</span>
          <Link
            href="/app/work-orders"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900 group"
          >
            Review Orders{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 4. Autonomous IoT Telemetry (Span 4) */}
      <div className="lg:col-span-4 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            Critical Power & Cooling
          </span>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Autonomous IoT Telemetry
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Continuous SNMP triggers 4-hour SLA dispatch on threshold spikes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-500">UPS Battery</div>
              <div className="text-2xl font-bold text-emerald-800 mt-0.5">94%</div>
              <div className="text-[11px] text-emerald-700 font-medium">Healthy Cell</div>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-100 text-center">
              <div className="text-[10px] uppercase font-semibold text-slate-500">Airflow Temp</div>
              <div className="text-2xl font-bold text-cyan-800 mt-0.5">22.4°C</div>
              <div className="text-[11px] text-cyan-700 font-medium">Cool &lt;28°C</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Auto-Dispatch Rule Armed
            </span>
            <span className="text-emerald-700 font-semibold">4-HR SLA</span>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">Sub-Minute Polling</span>
          <Link
            href="/app/telemetry"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900 group"
          >
            View Telemetry{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 5. Zero-License Geospatial Fleet GIS (Span 4) */}
      <div className="lg:col-span-4 bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-cyan-600" />
            Zero-License Geospatial
          </span>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Nationwide Fleet GIS
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              100% keyless OpenStreetMap vector clustering. Zero API bills.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2">
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <div className="p-2 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-medium">Lagos HQ</div>
                <div className="font-bold text-slate-900 mt-0.5">5,410</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-medium">Abuja CBD</div>
                <div className="font-bold text-slate-900 mt-0.5">4,120</div>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200/70 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-medium">Epe Solar</div>
                <div className="font-bold text-slate-900 mt-0.5">1,840</div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200/70 flex items-center justify-between text-xs">
              <span className="text-slate-500">Google Maps / Mapbox Invoices:</span>
              <span className="font-bold text-emerald-700">₦0 / MONTH</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">Vector Clustering</span>
          <Link
            href="/app/locations"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900 group"
          >
            Inspect Fleet Map{" "}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
