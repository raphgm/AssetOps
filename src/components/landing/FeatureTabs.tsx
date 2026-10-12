"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Coins,
  MapPin,
  CalendarClock,
  ShieldCheck,
  QrCode,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  FileBadge,
} from "lucide-react";

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<"finops" | "gis" | "preventative" | "decommission" | "qr">("finops");

  return (
    <div className="space-y-6">
      {/* Minimalist Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 border border-slate-200 rounded-2xl max-w-4xl mx-auto backdrop-blur shadow-inner">
        {[
          { id: "finops", label: "Hardware FinOps", icon: Coins, color: "text-cyan-600", activeBg: "bg-white text-cyan-800 shadow-sm border-slate-200" },
          { id: "gis", label: "Real-Time GIS Map", icon: MapPin, color: "text-teal-600", activeBg: "bg-white text-teal-800 shadow-sm border-slate-200" },
          { id: "preventative", label: "PM Scheduler", icon: CalendarClock, color: "text-violet-600", activeBg: "bg-white text-violet-800 shadow-sm border-slate-200" },
          { id: "decommission", label: "Data-Wipe Certs", icon: ShieldCheck, color: "text-rose-600", activeBg: "bg-white text-rose-800 shadow-sm border-slate-200" },
          { id: "qr", label: "QR Passports", icon: QrCode, color: "text-amber-600", activeBg: "bg-white text-amber-800 shadow-sm border-slate-200" },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                isActive
                  ? `${t.activeBg} border-slate-200 shadow-sm`
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Icon className={`h-4 w-4 ${t.color}`} />
              <span className="whitespace-nowrap font-sans">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Hardware FinOps */}
      {activeTab === "finops" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center shadow-2xl shadow-slate-200/50">
          <div className="space-y-4 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold font-mono">
              <Coins className="h-3.5 w-3.5 text-cyan-600" /> FINOPS HARDWARE INTELLIGENCE
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Stop pouring budget into financially dead hardware.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              AssetOps models physical hardware depreciation in real-time. When cumulative repair costs exceed <strong className="text-cyan-700">70% of Net Book Value</strong>, the platform automatically flags the machine for replacement instead of endless maintenance.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              {[
                "Straight-Line Depreciation model down to 10% residual salvage value",
                "8-Quarter CapEx Replacement Pipeline forecasting procurement budgets",
                "Automated 70% TCO threshold: prevents wasteful repair sign-offs",
                "Instant CSV export formatted for SAP, Oracle ERP, and Excel ledgers",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 font-mono">
              <Link
                href="/app/finops"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm transition"
              >
                Access FinOps Dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* FinOps Visual Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-500 font-mono">ASSET // ICT-LOS-00912</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" /> REPLACE (88.4%)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Initial Price</div>
                <div className="text-sm font-black text-slate-900 mt-0.5 font-mono">₦1,450,000</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Net Book Value</div>
                <div className="text-sm font-black text-cyan-600 mt-0.5 font-mono">₦380,000</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400">Repairs Total</div>
                <div className="text-sm font-black text-rose-600 mt-0.5 font-mono">₦336,000</div>
              </div>
            </div>

            {/* Repair Ratio Bar */}
            <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Repair-to-Value Ratio</span>
                <span className="text-rose-600 font-bold font-mono">88.4% (Threshold: 70%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                <div className="h-full bg-cyan-500" style={{ width: "70%" }} />
                <div className="h-full bg-rose-500 animate-pulse" style={{ width: "18.4%" }} />
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between pt-0.5">
                <span>Safe repair zone (0-70%)</span>
                <span className="text-rose-600 font-bold">Excess: ₦70,000</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-sm text-xs">
              <div className="text-[11px] uppercase font-bold text-slate-500 mb-2 flex justify-between">
                <span>8-Quarter Replacement Forecast</span>
                <span className="text-cyan-700 font-bold font-mono">₦41.2M CapEx</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
                <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[9px] text-slate-400">Q1 2026</div>
                  <div className="font-bold text-slate-800">₦8.4M</div>
                </div>
                <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[9px] text-slate-400">Q2 2026</div>
                  <div className="font-bold text-slate-800">₦12.1M</div>
                </div>
                <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[9px] text-slate-400">Q3 2026</div>
                  <div className="font-bold text-slate-800">₦6.2M</div>
                </div>
                <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[9px] text-slate-400">Q4 2026</div>
                  <div className="font-bold text-slate-800">₦14.5M</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: GIS Map */}
      {activeTab === "gis" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center shadow-2xl shadow-slate-200/50">
          <div className="space-y-4 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold font-mono">
              <MapPin className="h-3.5 w-3.5 text-teal-600" /> GEOSPATIAL FLEET TRACKING
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              See your entire hardware estate across every branch.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              No more guessing where critical switches or failing UPS batteries are located. AssetOps includes free OpenStreetMap geospatial tracking featuring proportional risk clusters, live address configuration, and an interactive pin-drop picker.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              {[
                "100% Free OpenStreetMap vector tiles (zero API keys, zero Google Maps fees)",
                "Proportional asset cluster circles scaled by device count and failure risk",
                "Interactive GPS Pin-Drop picker when registering branches or server rooms",
                "Fly-to site inspection with instant work-order dispatch",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 font-mono">
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition"
              >
                Access GIS Fleet Grid <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* GIS Visual Preview */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_#14b8a6]" />
                <span className="text-xs font-bold text-white">NIGERIA ESTATE NODES // ACTIVE</span>
              </div>
              <span className="text-[10px] text-teal-400">14 SITES ACTIVE</span>
            </div>

            <div className="relative h-60 w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
              <div className="absolute top-8 left-1/3 flex flex-col items-center">
                <div className="h-7 w-7 rounded-full bg-teal-950 border-2 border-teal-400 flex items-center justify-center text-[10px] font-bold text-teal-300 shadow-[0_0_12px_#14b8a6]">
                  ABJ
                </div>
                <span className="text-[10px] text-teal-200 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1">
                  Abuja Data Center (1,842 units)
                </span>
              </div>

              <div className="absolute bottom-10 left-1/4 flex flex-col items-center">
                <div className="h-7 w-7 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-300 shadow-[0_0_12px_#00f0ff]">
                  LOS
                </div>
                <span className="text-[10px] text-cyan-200 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1">
                  Lagos HQ (2,410 units · 12 At Risk)
                </span>
              </div>

              <div className="absolute bottom-12 right-1/4 flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-indigo-950 border-2 border-indigo-400 flex items-center justify-center text-[9px] font-bold text-indigo-300 shadow-[0_0_12px_#818cf8]">
                  PHC
                </div>
                <span className="text-[10px] text-indigo-200 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 mt-1">
                  Port Harcourt Hub (850 units)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-[9px] text-slate-400 uppercase">Branches</div>
                <div className="font-bold text-white">14 Sites</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-[9px] text-slate-400 uppercase">GPS Accuracy</div>
                <div className="font-bold text-teal-400">100% Pinned</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                <div className="text-[9px] text-slate-400 uppercase">Health</div>
                <div className="font-bold text-cyan-400">96.4% Good</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Preventative Maintenance */}
      {activeTab === "preventative" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center shadow-2xl shadow-slate-200/50">
          <div className="space-y-4 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold font-mono">
              <CalendarClock className="h-3.5 w-3.5 text-violet-600" /> ROUTINE MAINTENANCE ENGINE
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Fix degradation before it creates business emergencies.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Don&apos;t wait for a server power supply to fail or a branch switch to drop offline during peak transactions. AssetOps schedules recurring service cadences (30, 90, 180 days) and automatically creates batch work orders.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              {[
                "Targeted by Asset Type, Location, or Department",
                "Automatic batch creation of timestamped work orders with SLA countdowns",
                "Prioritized by operational criticality: High, Medium, Low",
                "Verified technician sign-off with photographic evidence and part logs",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 font-mono">
              <Link
                href="/app/preventative"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 shadow-sm transition"
              >
                Inspect PM Scheduler <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* PM Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-xs font-bold text-slate-500 font-mono">SCHEDULE // PM-CORE-Q1</span>
              <span className="text-[11px] font-bold text-violet-800 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                ACTIVE (EVERY 90 DAYS)
              </span>
            </div>

            <div className="space-y-2">
              {[
                { title: "Quarterly Switch Stack Firmware & Dust Cleaning", target: "All Cisco / Juniper Switches", next: "In 4 days", count: "48 assets" },
                { title: "Bi-Monthly UPS Battery Load & Calibration Test", target: "Server Room APC Systems", next: "In 12 days", count: "16 units" },
                { title: "Annual Air-Conditioning & Thermal Inspection", target: "Data Center Cooling Units", next: "In 28 days", count: "6 chillers" },
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between shadow-sm">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span>{item.target}</span> • <span className="font-mono text-cyan-600 font-bold">{item.count}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-violet-800 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
                    {item.next}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Certified Decommissioning */}
      {activeTab === "decommission" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center shadow-2xl shadow-slate-200/50">
          <div className="space-y-4 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-rose-600" /> NIST 800-88 SANITIZATION
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Audit-proof data wipe & retirement certificates.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Retiring servers or storage arrays without cryptographic proof invites massive regulatory fines. AssetOps certifies disposal with NIST 800-88 & DoD 5220.22-M sanitization methods and automatically logs salvage recovery value.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              {[
                "Compliant with NIST SP 800-88 Rev 1, DoD 5220.22-M, and NDPR/GDPR",
                "Tamper-evident certificate with unique Certificate ID and SHA-256 digest",
                "Automatic transition to RETIRED state with zero ghost inventory",
                "Salvage and recycling valuation credited straight to FinOps capital ledger",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 font-mono">
              <Link
                href="/app/decommission"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition"
              >
                Access Certificate Vault <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Certificate Mockup */}
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-lg relative space-y-3 text-xs">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileBadge className="h-6 w-6 text-rose-600" />
                <div>
                  <div className="text-xs font-black text-slate-900 uppercase">SANITIZATION CERTIFICATE</div>
                  <div className="text-[10px] text-slate-500 font-mono">NIST SP 800-88 REV 1 COMPLIANT</div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                VERIFIED VALID
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">ASSET</span>
                <span className="font-bold text-slate-800">Dell PowerEdge R740</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">METHOD</span>
                <span className="font-bold text-rose-600">NIST 800-88 Purge</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">CERTIFIED BY</span>
                <span className="text-slate-800">SecOps Lead</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">SALVAGE RECOVERY</span>
                <span className="text-teal-700 font-bold">₦185,000 Credited</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-500 break-all font-mono">
              SHA256: 7e9a82f3a14c8109bf1d02c633aef234b071192e42bc51030
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: QR Passports */}
      {activeTab === "qr" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center shadow-2xl shadow-slate-200/50">
          <div className="space-y-4 font-sans">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono">
              <QrCode className="h-3.5 w-3.5 text-amber-600" /> DIGITAL HARDWARE PASSPORTS
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              One mobile scan. Complete lifetime maintenance history.
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Equip every laptop, server, and access point with an encrypted QR passport label. Any technician with a smartphone camera can point at the device to view historical repairs, verify warranty status, and log diagnostic notes on the spot.
            </p>
            <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
              {[
                "Zero proprietary hardware needed: works on any standard mobile browser",
                "Cryptographically signed token prevents unauthorized serial crawling",
                "One-tap work order initiation right in front of the malfunctioning device",
                "Batch printable high-resolution QR sheets for thermal label printers",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 font-mono">
              <Link
                href="/app/assets"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition"
              >
                Browse Asset Registry <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* QR Phone Mockup */}
          <div className="mx-auto w-64 rounded-3xl border-2 border-slate-300 bg-slate-900 p-3 shadow-xl">
            <div className="rounded-2xl bg-white p-4 space-y-3 text-slate-800 font-mono">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] text-slate-400 font-bold">DIGITAL PASSPORT</span>
                <span className="h-2 w-2 rounded-full bg-teal-500" />
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <div className="h-9 w-9 bg-slate-900 text-white rounded-lg flex items-center justify-center shrink-0">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">ICT-LAG-004821</div>
                  <div className="text-[11px] text-slate-500 font-sans">Dell Latitude 7440</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-teal-50 border border-teal-200">
                  <div className="text-[9px] text-teal-700 font-bold">HEALTH</div>
                  <div className="font-bold text-teal-800">84 / 100</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                  <div className="text-[9px] text-slate-500 font-bold">REPAIRS</div>
                  <div className="font-bold text-slate-800">3 Total</div>
                </div>
              </div>

              <button className="w-full py-2 rounded-xl text-xs font-bold bg-slate-900 text-white font-sans hover:bg-slate-800 transition">
                Log New Work Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
