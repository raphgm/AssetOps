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
  Server,
  Zap,
  Radio,
  Sliders,
  CheckCircle2,
  Terminal,
} from "lucide-react";

type TabId = "finops" | "discovery" | "telemetry" | "gis";

export default function InteractiveConsole() {
  const [activeTab, setActiveTab] = useState<TabId>("finops");
  const [repairQuote, setRepairQuote] = useState(1450000); // ₦1.45M
  const netBookValue = 1650000; // ₦1.65M
  const thresholdRatio = Math.round((repairQuote / netBookValue) * 100);
  const isCrossoverBreached = thresholdRatio >= 70;

  return (
    <div className="bg-[#0c0e14] border border-white/[0.08] rounded-3xl shadow-2xl shadow-cyan-950/40 overflow-hidden font-sans text-slate-100 ring-1 ring-white/[0.05] relative group">
      {/* Top Console Chrome */}
      <div className="bg-[#090b10] px-4 py-3 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-semibold">assetops-kernel</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400">telemetry-cluster</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            LIVE TELEMETRY · 24ms
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-[#121520] p-1 rounded-xl border border-white/[0.06]">
          {[
            { id: "finops" as TabId, label: "FinOps Crossover", icon: Coins },
            { id: "discovery" as TabId, label: "Network Scanner", icon: Wifi },
            { id: "telemetry" as TabId, label: "IoT Telemetry", icon: Activity },
            { id: "gis" as TabId, label: "Geospatial GIS", icon: MapPin },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === id
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Console Display Viewport */}
      <div className="p-5 sm:p-7 min-h-[400px]">
        {/* 1. FINOPS CROSSOVER ENGINE */}
        {activeTab === "finops" && (
          <div className="space-y-5 animate-fadeIn">
            {/* KPI Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="bg-[#121520] border border-white/[0.06] p-3.5 rounded-2xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Estate Total TCO</div>
                <div className="text-xl font-black text-cyan-400 mt-1">₦428,500,000</div>
                <div className="text-[10.5px] text-emerald-400 mt-0.5">FOCUS™ v1.0 Audited</div>
              </div>
              <div className="bg-[#121520] border border-white/[0.06] p-3.5 rounded-2xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Book Value</div>
                <div className="text-xl font-black text-slate-100 mt-1">₦312,800,000</div>
                <div className="text-[10.5px] text-slate-400 mt-0.5">10% Residual Line</div>
              </div>
              <div className="bg-[#121520] border border-white/[0.06] p-3.5 rounded-2xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Money Pit Halts</div>
                <div className="text-xl font-black text-amber-400 mt-1">₦18,400,000</div>
                <div className="text-[10.5px] text-amber-300 mt-0.5">Diverted to CapEx</div>
              </div>
              <div className="bg-[#121520] border border-white/[0.06] p-3.5 rounded-2xl">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">SLA Rebate Credits</div>
                <div className="text-xl font-black text-emerald-400 mt-1">₦3,200,000</div>
                <div className="text-[10.5px] text-emerald-300 mt-0.5">Automated Recovery</div>
              </div>
            </div>

            {/* Interactive Threshold Simulator */}
            <div className="bg-[#121520] border border-white/[0.08] rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Interactive 70% Crossover Simulator: Dell PowerEdge R740 (SRV-DC-00281)
                  </span>
                </div>
                <span
                  className={`text-[10.5px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                    isCrossoverBreached
                      ? "bg-rose-950 text-rose-300 border-rose-800"
                      : "bg-emerald-950 text-emerald-300 border-emerald-800"
                  }`}
                >
                  {isCrossoverBreached ? "STOP REPAIR: HALTED BY FINOPS RULE" : "APPROVED WITHIN SAFE BUDGET"}
                </span>
              </div>

              {/* Slider Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Simulate Repair Quote:</span>
                  <span className="text-cyan-300 font-bold">₦{repairQuote.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="2000000"
                  step="50000"
                  value={repairQuote}
                  onChange={(e) => setRepairQuote(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Visual Meter Bar */}
              <div className="space-y-2">
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex relative">
                  <div
                    className="bg-cyan-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(thresholdRatio, 70)}%` }}
                    title="Safe Repair Window (Up to 70%)"
                  />
                  {thresholdRatio > 70 && (
                    <div
                      className="bg-rose-500 h-full animate-pulse transition-all duration-300"
                      style={{ width: `${Math.min(thresholdRatio - 70, 30)}%` }}
                      title="Runaway Breach"
                    />
                  )}
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Safe Threshold (70%): ₦1,155,000</span>
                  <span className={isCrossoverBreached ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    Current Ratio: {thresholdRatio}% of Net Book Value
                  </span>
                </div>
              </div>

              {/* Outcome Resolution */}
              <div className="text-xs text-slate-300 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span>
                  {isCrossoverBreached
                    ? "Financial Action: Repair PO blocked. ₦1,450,000 diverted to replacement procurement queue."
                    : "Financial Action: Repair quote is economically viable. Dispatched to vendor work order."}
                </span>
                <span className="text-cyan-400 font-mono font-bold text-[11px]">AUTONOMOUS RULE</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-mono">
                FOCUS™ v1.0 Spec · Net Book Value (10% Residual Straight-Line)
              </span>
              <Link
                href="/app/finops"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold group"
              >
                Inspect Live FinOps Hub <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. SUBNET DISCOVERY & MDM */}
        {activeTab === "discovery" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between bg-[#121520] border border-white/[0.06] px-4 py-3 rounded-2xl font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-ping" />
                <span className="text-slate-300">
                  Subnet Probe: <span className="text-cyan-400">192.168.1.0/24</span> (Ports: 22, 80, 443, 161, 9100)
                </span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 3 Devices Enrolled
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { ip: "192.168.1.1", name: "Cisco Catalyst 9300-48P", type: "Core Switch", mac: "00:1E:13:A8:4B:20", ports: "SSH 22 · SNMP v3 (161)", desc: "48-Port PoE+ Layer 3 Switch" },
                { ip: "192.168.1.15", name: "Dell PowerEdge R740 iDRAC", type: "Server", mac: "B8:2A:72:C1:90:33", ports: "HTTPS 443 · IPMI 623", desc: "Dual Xeon Gold, 128GB ECC RAM" },
                { ip: "192.168.1.42", name: "Zebra ZT411 Industrial Labeler", type: "Barcode Printer", mac: "00:07:4D:2A:9F:10", ports: "JetDirect 9100", desc: "Thermal Barcode Sticker Station" },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#121520] border border-white/[0.06] text-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-950/70 border border-cyan-800/60 grid place-items-center text-cyan-400">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        {d.name}
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-normal">
                          {d.type}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {d.ip} · {d.mac} · {d.ports}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    ENROLLED
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121520] border border-cyan-900/30 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-mono">
                Microsoft Intune & Jamf Webhook: 48 company laptops synced with live battery health
              </span>
              <span className="text-cyan-400 font-mono font-bold text-[10.5px]">MDM ACTIVE</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-mono">Zero Manual Serial Typing Required</span>
              <Link
                href="/app/discovery"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold group"
              >
                Open Discovery Studio <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        )}

        {/* 3. IOT CRITICAL POWER & TELEMETRY */}
        {activeTab === "telemetry" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#121520] border border-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">APC Smart-UPS RT 3000 (Ikeja DC)</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                    NOMINAL
                  </span>
                </div>
                <div className="text-2xl font-black text-cyan-400 font-mono">94% Battery Health</div>
                <div className="text-xs text-slate-400">Load: 42% · Voltage: 229.4V · Estimated Runtime: 52 min</div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: "94%" }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121520] border border-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Server Room Thermal Probe #2</span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                    OPTIMAL
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-100 font-mono">22.4°C / 48% RH</div>
                <div className="text-xs text-slate-400">Threshold: 28°C max · Automatic Work Order Trigger Armed</div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full" style={{ width: "45%" }} />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#121520] border border-amber-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">
                  Autonomous SLA Dispatch: Critical Work Order auto-dispatched if battery drops below 40%
                </span>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-amber-300">4-HR SLA CLOCK</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-mono">SNMP Traps + Webhook Ingest Live</span>
              <Link
                href="/app/telemetry"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold group"
              >
                Inspect Telemetry Engine <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        )}

        {/* 4. NATIONWIDE GEOSPATIAL GIS */}
        {activeTab === "gis" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid sm:grid-cols-3 gap-3 font-mono">
              <div className="p-4 rounded-2xl bg-[#121520] border border-white/[0.06]">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Marina HQ Data Center</div>
                <div className="text-xl font-black text-cyan-400 mt-1">5,410 Assets</div>
                <div className="text-[11px] text-emerald-400 mt-0.5">Lagos Island · Tier III DC</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#121520] border border-white/[0.06]">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Abuja Regional Hub</div>
                <div className="text-xl font-black text-cyan-400 mt-1">4,120 Assets</div>
                <div className="text-[11px] text-cyan-300 mt-0.5">Central Business District</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#121520] border border-white/[0.06]">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Epe Solar Project Site</div>
                <div className="text-xl font-black text-cyan-400 mt-1">1,840 Assets</div>
                <div className="text-[11px] text-amber-400 mt-0.5">Substation & Inverter Farm</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#121520] border border-teal-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span className="text-slate-300">
                  100% Keyless OpenStreetMap: Zero surprise $5,000/mo Google Maps or Mapbox invoices
                </span>
              </div>
              <span className="text-[10.5px] font-mono text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-800 font-bold">
                KEYLESS OSM
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-mono">Sub-Second Vector Tile Clustering</span>
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold group"
              >
                Inspect Nationwide Map <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
