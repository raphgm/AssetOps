"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Coins,
  Wifi,
  Activity,
  MapPin,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  Clock,
  Sparkles,
  Server,
  Zap,
  Radio,
} from "lucide-react";

type TabId = "finops" | "discovery" | "telemetry" | "gis";

export default function InteractiveConsole() {
  const [activeTab, setActiveTab] = useState<TabId>("finops");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-cyan-950/30 overflow-hidden font-sans text-slate-100 ring-1 ring-white/10">
      {/* Top Console Bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 tracking-wider hidden sm:inline">
            ASSETOPS ENGINE CONSOLE
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            LIVE TELEMETRY
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {[
            { id: "finops" as TabId, label: "FinOps Hub", icon: Coins },
            { id: "discovery" as TabId, label: "Auto-Discovery", icon: Wifi },
            { id: "telemetry" as TabId, label: "IoT Telemetry", icon: Activity },
            { id: "gis" as TabId, label: "Nationwide GIS", icon: MapPin },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === id
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Console Body Area */}
      <div className="p-5 sm:p-6 min-h-[380px]">
        {/* TAB 1: FINOPS */}
        {activeTab === "finops" && (
          <div className="space-y-4 animate-fadeIn">
            {/* KPI Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Estate TCO</div>
                <div className="text-lg sm:text-xl font-black text-cyan-400 mt-1">₦428.5M</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">+4.2% Book Recovery</div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Book Value</div>
                <div className="text-lg sm:text-xl font-black text-slate-100 mt-1">₦312.8M</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Straight-Line 10% Res</div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Money Pit Saves</div>
                <div className="text-lg sm:text-xl font-black text-amber-400 mt-1">₦18.4M</div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">Diverted from Bad Fixes</div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">SLA Rebate Credits</div>
                <div className="text-lg sm:text-xl font-black text-emerald-400 mt-1">₦3.2M</div>
                <div className="text-[10px] text-emerald-400/80 mt-0.5">Vendor Contract Rebates</div>
              </div>
            </div>

            {/* Crossover Visual */}
            <div className="bg-slate-950/80 border border-rose-900/40 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-rose-300">
                    Economic Crossover Alert: 70% Repair Threshold Breach
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-bold">
                  FLAGGED FOR CAPEX REPLACEMENT
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Dell PowerEdge R740 (SRV-DC-00281) quoted repair: <strong className="text-rose-300">₦1,420,000</strong> on Net Book Value of ₦1,650,000 (86% ratio). Threshold is 70%.
              </p>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-cyan-500 h-full" style={{ width: "70%" }} title="Safe Limit 70%" />
                <div className="bg-rose-500 h-full animate-pulse" style={{ width: "16%" }} title="Breach 16%" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
                <span>Safe Threshold (70%): ₦1,155,000</span>
                <span className="text-rose-400 font-bold">Breach: Diverted to 2026 Capex</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-mono">
                FOCUS™ v1.0 Compliant Financial Breakdown
              </span>
              <Link
                href="/app/finops"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold group"
              >
                Inspect FinOps Hub <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: DISCOVERY */}
        {activeTab === "discovery" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800 px-3.5 py-2.5 rounded-2xl font-mono text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-ping" />
                <span className="text-slate-300">Subnet Target: <span className="text-cyan-400">192.168.1.0/24</span></span>
              </div>
              <span className="text-emerald-400 font-bold">3 Devices Auto-Identified</span>
            </div>

            <div className="space-y-2">
              {[
                { ip: "192.168.1.1", name: "Cisco Catalyst 9300-48P", type: "Managed Switch", mac: "00:1E:13:A8:4B:20", ports: "SSH 22, SNMP 161", status: "Enrolled" },
                { ip: "192.168.1.15", name: "Dell PowerEdge R740 iDRAC", type: "Physical Server", mac: "B8:2A:72:C1:90:33", ports: "HTTPS 443, IPMI 623", status: "Enrolled" },
                { ip: "192.168.1.42", name: "Zebra ZT411 Industrial Labeler", type: "Barcode Printer", mac: "00:07:4D:2A:9F:10", ports: "JetDirect 9100", status: "Enrolled" },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold text-slate-200">{d.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{d.ip} · {d.mac} · {d.ports}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-mono">
                Microsoft Intune & Jamf Webhook Synced
              </span>
              <Link
                href="/app/discovery"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold group"
              >
                Open Discovery Studio <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 3: TELEMETRY */}
        {activeTab === "telemetry" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">APC Smart-UPS RT 3000 (Tier III)</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">
                    NOMINAL
                  </span>
                </div>
                <div className="text-2xl font-black text-cyan-400 font-mono">94% Battery Health</div>
                <div className="text-xs text-slate-400">Load: 42% · Voltage: 229.4V · Backup Est: 52 min</div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: "94%" }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Server Room Thermal Probe #2</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800">
                    AIRFLOW OPTIMAL
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-100 font-mono">22.4°C / 48% RH</div>
                <div className="text-xs text-slate-400">Threshold: 28°C max · Automatic Work Order trigger ready</div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full" style={{ width: "45%" }} />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">
                  Automated SLA Dispatch: Trigger Critical Work Order if battery drops below 40%
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400">4-HR SLA CLOCK</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-mono">
                Polling Interval: 30s Real SNMP Traps
              </span>
              <Link
                href="/app/telemetry"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold group"
              >
                Inspect Live Telemetry <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 4: GIS */}
        {activeTab === "gis" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid sm:grid-cols-3 gap-3 font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Marina HQ Data Center</div>
                <div className="text-lg font-black text-cyan-400 mt-1">5,410 Assets</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">Lagos Island · Tier III</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Abuja Regional Hub</div>
                <div className="text-lg font-black text-cyan-400 mt-1">4,120 Assets</div>
                <div className="text-[11px] text-cyan-400 mt-0.5">Central Business District</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Epe Solar Project Site</div>
                <div className="text-lg font-black text-cyan-400 mt-1">1,840 Assets</div>
                <div className="text-[11px] text-amber-400 mt-0.5">Field Project · Substation</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span className="text-slate-300">
                  100% Keyless OpenStreetMap tiles · No commercial $5k/mo Google Maps billing
                </span>
              </div>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                KEYLESS OSM
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-mono">
                Real-Time Vector Map Clustering
              </span>
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold group"
              >
                View Nationwide Map <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
