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
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  FileBadge,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<"finops" | "gis" | "preventative" | "decommission" | "qr">("finops");

  return (
    <div className="space-y-8">
      {/* Tab Navigation Pill Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-raised/80 border border-line rounded-xl max-w-4xl mx-auto backdrop-blur">
        {[
          { id: "finops", label: "Hardware FinOps", icon: Coins, tag: "IFRS / GAAP" },
          { id: "gis", label: "Real-Time GIS Map", icon: MapPin, tag: "Free Leaflet" },
          { id: "preventative", label: "PM Scheduler", icon: CalendarClock, tag: "Automated" },
          { id: "decommission", label: "Data-Wipe Certs", icon: ShieldCheck, tag: "NIST 800-88" },
          { id: "qr", label: "Mobile Passports", icon: QrCode, tag: "Field Ops" },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-surface text-fg border border-line2 shadow-md shadow-black/40 text-accent"
                  : "text-mute hover:text-fg hover:bg-surface/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-accent" : "text-dim"}`} />
              <span className="whitespace-nowrap">{t.label}</span>
              <span
                className={`hidden md:inline-block text-[9.5px] px-1.5 py-0.2 rounded font-mono uppercase ${
                  isActive ? "bg-accent/15 text-accent" : "bg-line text-dim"
                }`}
              >
                {t.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Hardware FinOps */}
      {activeTab === "finops" && (
        <div className="card p-6 sm:p-8 grid lg:grid-cols-2 gap-8 items-center animate-rise">
          <div className="space-y-4">
            <div className="eyebrow flex items-center gap-2">
              <Coins className="h-4 w-4" /> FinOps Hardware Intelligence
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
              Stop pouring budget into dying hardware.
            </h3>
            <p className="text-mute text-sm leading-relaxed">
              Traditional IT teams keep repairing aging equipment without knowing its residual value. AssetOps computes straight-line depreciation down to 10% salvage value, scores Repair-to-Value ratios in real-time, and flags negative-ROI repairs the moment lifetime spend exceeds 70% of Net Book Value.
            </p>
            <div className="space-y-2.5 pt-2">
              {[
                "Straight-Line Depreciation model with real-time Net Book Value (NBV)",
                "8-Quarter CapEx Replacement Pipeline forecasting budget through 2027",
                "Automated 70% TCO threshold: flags wasteful repairs for CFO review",
                "Full CSV / Excel export for enterprise ERP reconciliation (SAP, Oracle)",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 text-xs text-fg">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex gap-3">
              <Link href="/app/finops" className="btn btn-accent">
                Open FinOps Dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive FinOps Preview Card */}
          <div className="bg-bg/90 border border-line rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-xs text-dim">FINOPS-SCORECARD // ICT-LOS-00912</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-bad bg-bad/10 px-2 py-0.5 rounded border border-bad/30">
                <AlertTriangle className="h-3 w-3" /> REPLACE RECOMMENDED (88.4%)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded bg-raised border border-line">
                <div className="text-[10px] uppercase text-dim">Purchase Price</div>
                <div className="font-mono text-sm font-semibold text-fg mt-0.5">₦1,450,000</div>
              </div>
              <div className="p-2.5 rounded bg-raised border border-line">
                <div className="text-[10px] uppercase text-dim">Net Book Value</div>
                <div className="font-mono text-sm font-semibold text-ok mt-0.5">₦380,000</div>
              </div>
              <div className="p-2.5 rounded bg-raised border border-line">
                <div className="text-[10px] uppercase text-dim">Cumulative Repairs</div>
                <div className="font-mono text-sm font-semibold text-bad mt-0.5">₦336,000</div>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="space-y-1.5 bg-raised/50 p-3 rounded-lg border border-line">
              <div className="flex justify-between text-xs">
                <span className="text-dim">Repair-to-Value Ratio</span>
                <span className="font-mono font-bold text-bad">88.4% (Threshold: 70%)</span>
              </div>
              <div className="w-full h-2.5 bg-bg rounded-full overflow-hidden flex">
                <div className="h-full bg-accent" style={{ width: "70%" }} />
                <div className="h-full bg-bad animate-pulse" style={{ width: "18.4%" }} />
              </div>
              <div className="text-[10.5px] text-mute flex justify-between pt-0.5">
                <span>Safe repair zone (0-70%)</span>
                <span className="text-bad font-medium">Excess spend: ₦70,000</span>
              </div>
            </div>

            {/* CapEx 8-quarter preview snippet */}
            <div className="border border-line rounded-lg p-3 bg-surface/50">
              <div className="text-[11px] uppercase tracking-wider text-dim mb-2 flex justify-between">
                <span>8-Quarter Replacement Forecast</span>
                <span className="font-mono text-accent">₦41.2M CapEx Total</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
                <div className="p-1.5 rounded bg-bg border border-line">
                  <div className="text-[9px] text-dim">Q1 2026</div>
                  <div className="font-semibold text-fg">₦8.4M</div>
                </div>
                <div className="p-1.5 rounded bg-bg border border-line">
                  <div className="text-[9px] text-dim">Q2 2026</div>
                  <div className="font-semibold text-fg">₦12.1M</div>
                </div>
                <div className="p-1.5 rounded bg-bg border border-line">
                  <div className="text-[9px] text-dim">Q3 2026</div>
                  <div className="font-semibold text-fg">₦6.2M</div>
                </div>
                <div className="p-1.5 rounded bg-bg border border-line">
                  <div className="text-[9px] text-dim">Q4 2026</div>
                  <div className="font-semibold text-fg">₦14.5M</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: GIS Map */}
      {activeTab === "gis" && (
        <div className="card p-6 sm:p-8 grid lg:grid-cols-2 gap-8 items-center animate-rise">
          <div className="space-y-4">
            <div className="eyebrow flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Geospatial Estate Intelligence
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
              See your entire hardware estate across every branch.
            </h3>
            <p className="text-mute text-sm leading-relaxed">
              No more guessing where critical switches or failing UPS batteries are located. AssetOps includes a free, zero-API-key Leaflet GIS map with CARTO Dark Matter vector tiles, interactive pin-dropping, risk color halos, and one-click drilldown into campus buildings.
            </p>
            <div className="space-y-2.5 pt-2">
              {[
                "100% Free OpenStreetMap & CARTO Dark Matter tiles (zero Google Maps fees)",
                "Proportional asset cluster circles scaled by device count and failure risk",
                "Interactive GPS Pin-Drop picker when registering new branches or server rooms",
                "Fly-to location inspection with instant technician work-order dispatch",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 text-xs text-fg">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex gap-3">
              <Link href="/app/locations" className="btn btn-accent">
                Explore GIS Location Grid <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive GIS Preview Card */}
          <div className="bg-bg/90 border border-line rounded-xl p-4 shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs text-fg">NIGERIA ESTATE MAP // 4 HUBS ACTIVE</span>
              </div>
              <span className="text-[10px] text-dim uppercase">CARTO DARK TILES</span>
            </div>

            {/* Stylized Simulated Map View */}
            <div className="relative h-64 w-full bg-[#111419] rounded-lg border border-line overflow-hidden flex items-center justify-center">
              {/* Grid texture */}
              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#2e333c_1px,transparent_1px),linear-gradient(90deg,#2e333c_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Map Nodes */}
              <div className="absolute top-12 left-1/3 transform -translate-x-1/2 flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <div className="absolute -inset-2 bg-accent/20 rounded-full animate-ping" />
                  <div className="h-6 w-6 rounded-full bg-surface border-2 border-accent flex items-center justify-center text-[10px] font-bold text-accent">
                    ABJ
                  </div>
                </div>
                <span className="text-[10px] font-mono text-fg bg-surface/90 px-1.5 py-0.5 rounded border border-line mt-1">
                  Abuja HQ (1,842 units)
                </span>
              </div>

              <div className="absolute bottom-14 left-1/4 transform -translate-x-1/2 flex flex-col items-center cursor-pointer">
                <div className="relative">
                  <div className="absolute -inset-3 bg-bad/20 rounded-full animate-pulse" />
                  <div className="h-7 w-7 rounded-full bg-surface border-2 border-bad flex items-center justify-center text-[10px] font-bold text-bad">
                    LOS
                  </div>
                </div>
                <span className="text-[10px] font-mono text-fg bg-surface/90 px-1.5 py-0.5 rounded border border-line mt-1">
                  Lagos Hub (2,410 units · 12 At Risk)
                </span>
              </div>

              <div className="absolute bottom-10 right-1/3 flex flex-col items-center cursor-pointer">
                <div className="h-5 w-5 rounded-full bg-surface border-2 border-ok flex items-center justify-center text-[9px] font-bold text-ok">
                  PHC
                </div>
                <span className="text-[10px] font-mono text-fg bg-surface/90 px-1.5 py-0.5 rounded border border-line mt-1">
                  Port Harcourt (850 units)
                </span>
              </div>

              {/* Connected Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <line x1="33%" y1="28%" x2="25%" y2="65%" stroke="#5eead4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <line x1="33%" y1="28%" x2="66%" y2="72%" stroke="#5eead4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
              </svg>

              <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur px-2.5 py-1 rounded text-[10px] border border-line text-mute">
                📍 Coordinates: 9.0820° N, 8.6753° E
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-raised border border-line">
                <div className="text-[10px] text-dim uppercase">Total Locations</div>
                <div className="font-mono font-semibold text-fg">14 Sites</div>
              </div>
              <div className="p-2 rounded bg-raised border border-line">
                <div className="text-[10px] text-dim uppercase">Active Lat/Long Pins</div>
                <div className="font-mono font-semibold text-accent">100% Geo-coded</div>
              </div>
              <div className="p-2 rounded bg-raised border border-line">
                <div className="text-[10px] text-dim uppercase">Cluster Health</div>
                <div className="font-mono font-semibold text-ok">96.4% Good</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Preventative Maintenance */}
      {activeTab === "preventative" && (
        <div className="card p-6 sm:p-8 grid lg:grid-cols-2 gap-8 items-center animate-rise">
          <div className="space-y-4">
            <div className="eyebrow flex items-center gap-2">
              <CalendarClock className="h-4 w-4" /> Autonomous Routine Protection
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
              Fix degradation before it creates emergencies.
            </h3>
            <p className="text-mute text-sm leading-relaxed">
              Don&apos;t wait for a server PSU to smoke or a branch router to drop offline during peak business hours. AssetOps schedules recurring preventative servicing (30, 60, 90, 180 days), automatically dispatches work orders to certified technicians, and calculates Mean Time Between Failures.
            </p>
            <div className="space-y-2.5 pt-2">
              {[
                "Targeted by Asset Type, Location, or Department (e.g. all core switches in Abuja)",
                "Automatic batch creation of timestamped work orders with SLA countdowns",
                "Prioritized by operational criticality: High, Medium, Low",
                "Full technician accountability with verification sign-off and photo proof",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 text-xs text-fg">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex gap-3">
              <Link href="/app/preventative" className="btn btn-accent">
                View PM Scheduler <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* PM Preview Card */}
          <div className="bg-bg/90 border border-line rounded-xl p-5 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <span className="font-mono text-xs text-dim">SCHEDULED-RUN // PM-SERVER-Q1</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ok bg-ok/10 px-2 py-0.5 rounded">
                <CheckCircle className="h-3 w-3" /> ACTIVE (EVERY 90 DAYS)
              </span>
            </div>

            <div className="space-y-2">
              {[
                { title: "Quarterly Switch Stack Firmware & Dust Cleaning", target: "All Cisco / Juniper Switches", next: "In 4 days", count: "48 assets" },
                { title: "Bi-Monthly UPS Battery Load & Calibration Test", target: "Server Room APC Systems", next: "In 12 days", count: "16 units" },
                { title: "Annual Air-Conditioning & Thermal Inspection", target: "Data Center Cooling Units", next: "In 28 days", count: "6 chillers" },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg border border-line bg-raised/70 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-fg">{item.title}</div>
                    <div className="text-[11px] text-mute flex items-center gap-2 mt-0.5">
                      <span>{item.target}</span>
                      <span>•</span>
                      <span className="font-mono text-dim">{item.count}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">
                      {item.next}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-surface border border-line rounded-lg text-xs text-mute flex items-center justify-between">
              <span>Next automatic dispatch: <strong>Friday, 08:00 AM</strong></span>
              <span className="text-accent hover:underline cursor-pointer">Dispatch Now</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Certified Decommissioning */}
      {activeTab === "decommission" && (
        <div className="card p-6 sm:p-8 grid lg:grid-cols-2 gap-8 items-center animate-rise">
          <div className="space-y-4">
            <div className="eyebrow flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Regulatory Compliance & Sanitization
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
              Audit-proof NIST 800-88 data destruction.
            </h3>
            <p className="text-mute text-sm leading-relaxed">
              When hardware reaches end-of-life, failure to sanitize drives leads to crippling regulatory fines and data leaks. AssetOps certifies hardware decommissioning with cryptographic proof, NIST 800-88 / DoD 5220.22-M sanitization methods, and residual salvage value crediting.
            </p>
            <div className="space-y-2.5 pt-2">
              {[
                "Compliant with NIST SP 800-88 Rev 1, DoD 5220.22-M, and GDPR/NDPR standards",
                "Tamper-proof certificate generated with unique Certificate ID and SHA-256 hash",
                "Automatic asset state transition to RETIRED with zero ghost records left behind",
                "Salvage and recycling valuation logged directly to the FinOps capital ledger",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 text-xs text-fg">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex gap-3">
              <Link href="/app/decommission" className="btn btn-accent">
                View Certificate Vault <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Certificate Mockup Preview Card */}
          <div className="bg-[#0e1014] border-2 border-line2 rounded-xl p-6 shadow-2xl relative space-y-4 font-mono">
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <FileBadge className="h-6 w-6 text-accent" />
                <div>
                  <div className="text-xs font-bold text-fg uppercase tracking-wider">CERTIFICATE OF SANITIZATION</div>
                  <div className="text-[10px] text-dim">NIST SP 800-88 REV 1 COMPLIANT</div>
                </div>
              </div>
              <div className="text-right text-[10px] text-dim">
                <div>ID: DECOM-2026-9812</div>
                <div className="text-ok">VERIFIED VALID</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-dim block">HARDWARE ASSET</span>
                <span className="font-semibold text-fg">Dell PowerEdge R740</span>
                <span className="text-[10px] text-mute block">SRV-DC-00281</span>
              </div>
              <div>
                <span className="text-[10px] text-dim block">SANITIZATION METHOD</span>
                <span className="font-semibold text-accent">NIST 800-88 Purge</span>
                <span className="text-[10px] text-mute block">Cryptographic Erase (NVMe)</span>
              </div>
              <div>
                <span className="text-[10px] text-dim block">CERTIFIED BY</span>
                <span className="text-fg">Raphael (SecOps Lead)</span>
              </div>
              <div>
                <span className="text-[10px] text-dim block">SALVAGE RECOVERY</span>
                <span className="text-ok font-semibold">₦185,000 Credited</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-raised border border-line text-[10px] text-dim break-all">
              <span className="text-dim block text-[9px] uppercase">Cryptographic Audit Digest:</span>
              SHA256: 7e9a82f3a14c8109bf1d02c633aef234b071192e42bc51030
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Mobile QR Passports */}
      {activeTab === "qr" && (
        <div className="card p-6 sm:p-8 grid lg:grid-cols-2 gap-8 items-center animate-rise">
          <div className="space-y-4">
            <div className="eyebrow flex items-center gap-2">
              <QrCode className="h-4 w-4" /> Physical-to-Digital Bridge
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
              One mobile scan. Complete lifetime memory.
            </h3>
            <p className="text-mute text-sm leading-relaxed">
              Equip every laptop, server, printer, and access point with an encrypted QR passport label. Any authorized field technician can point their smartphone camera at the device to view historical repairs, verify warranty status, and log diagnostic notes on the spot.
            </p>
            <div className="space-y-2.5 pt-2">
              {[
                "Zero proprietary hardware needed: works with any standard mobile browser",
                "Secure cryptographically signed token prevents unauthorized serial crawling",
                "One-tap work order initiation right in front of the malfunctioning device",
                "Batch printable high-resolution QR sheets ready for thermal sticker printers",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 text-xs text-fg">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 flex gap-3">
              <Link href="/app/assets" className="btn btn-accent">
                Browse Asset Registry <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* QR Mobile Screen Mockup */}
          <div className="mx-auto w-72 rounded-[32px] border-2 border-line2 bg-surface p-3.5 shadow-2xl relative">
            <div className="rounded-[24px] bg-bg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="text-[10px] font-mono text-dim">MOBILE TECHNICIAN PASSPORT</span>
                <span className="h-2 w-2 rounded-full bg-ok" />
              </div>

              <div className="p-3 rounded-lg border border-accent/30 bg-accent/5 flex items-center gap-3">
                <div className="h-10 w-10 bg-fg text-bg rounded flex items-center justify-center shrink-0">
                  <QrCode className="h-7 w-7" />
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-fg">ICT-LAG-004821</div>
                  <div className="text-[11px] text-mute">Dell Latitude 7440</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-raised border border-line">
                  <div className="text-[9px] text-dim">Health Score</div>
                  <div className="font-bold text-ok">84 / 100</div>
                </div>
                <div className="p-2 rounded bg-raised border border-line">
                  <div className="text-[9px] text-dim">Lifetime Repairs</div>
                  <div className="font-bold text-fg">3 Interventions</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] uppercase text-dim">Quick Actions</div>
                <button className="btn btn-accent w-full text-xs h-7">Report Incident</button>
                <button className="btn w-full text-xs h-7">Log Servicing</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
