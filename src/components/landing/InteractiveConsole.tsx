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
} from "lucide-react";

type TabId = "finops" | "discovery" | "telemetry" | "gis";

export default function InteractiveConsole() {
  const [activeTab, setActiveTab] = useState<TabId>("finops");
  const [repairQuote, setRepairQuote] = useState(1450000); // ₦1.45M
  const netBookValue = 1650000; // ₦1.65M
  const thresholdRatio = Math.round((repairQuote / netBookValue) * 100);
  const isCrossoverBreached = thresholdRatio >= 70;

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xl shadow-indigo-100/70 overflow-hidden font-sans text-slate-900 ring-1 ring-slate-100 relative group">
      {/* Top Window Chrome */}
      <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-500 font-semibold">
            <span>assetops-kernel</span>
            <span className="text-slate-400">/</span>
            <span className="text-cyan-700">telemetry-cluster</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE TELEMETRY · 24ms
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl border border-slate-200">
          {[
            { id: "finops" as TabId, label: "FinOps Crossover", icon: Coins },
            { id: "discovery" as TabId, label: "Network Scanner", icon: Wifi },
            { id: "telemetry" as TabId, label: "IoT Telemetry", icon: Activity },
            { id: "gis" as TabId, label: "Geospatial GIS", icon: MapPin },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === id
                  ? "bg-white text-cyan-800 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-cyan-600" />
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
              <div className="bg-slate-50/80 border border-slate-200 p-3.5 rounded-2xl">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Estate Total TCO</div>
                <div className="text-xl font-black text-cyan-800 mt-1">₦428,500,000</div>
                <div className="text-[10.5px] text-emerald-700 mt-0.5 font-bold">FOCUS™ v1.0 Audited</div>
              </div>
              <div className="bg-slate-50/80 border border-slate-200 p-3.5 rounded-2xl">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Net Book Value</div>
                <div className="text-xl font-black text-slate-900 mt-1">₦312,800,000</div>
                <div className="text-[10.5px] text-slate-500 mt-0.5 font-bold">10% Residual Line</div>
              </div>
              <div className="bg-slate-50/80 border border-slate-200 p-3.5 rounded-2xl">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Money Pit Halts</div>
                <div className="text-xl font-black text-amber-700 mt-1">₦18,400,000</div>
                <div className="text-[10.5px] text-amber-700 mt-0.5 font-bold">Diverted to CapEx</div>
              </div>
              <div className="bg-slate-50/80 border border-slate-200 p-3.5 rounded-2xl">
                <div className="text-[10px] text-slate-500 uppercase font-bold">SLA Rebate Credits</div>
                <div className="text-xl font-black text-emerald-700 mt-1">₦3,200,000</div>
                <div className="text-[10.5px] text-emerald-700 mt-0.5 font-bold">Automated Recovery</div>
              </div>
            </div>

            {/* Interactive Threshold Simulator */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Interactive 70% Crossover Simulator: Dell PowerEdge R740 (SRV-DC-00281)
                  </span>
                </div>
                <span
                  className={`text-[10.5px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                    isCrossoverBreached
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {isCrossoverBreached ? "STOP REPAIR: HALTED BY FINOPS RULE" : "APPROVED WITHIN SAFE BUDGET"}
                </span>
              </div>

              {/* Slider Control */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600 font-semibold">Simulate Repair Quote:</span>
                  <span className="text-cyan-700 font-black">₦{repairQuote.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="2000000"
                  step="50000"
                  value={repairQuote}
                  onChange={(e) => setRepairQuote(Number(e.target.value))}
                  className="w-full accent-cyan-600 bg-slate-200 h-2.5 rounded-lg cursor-pointer border border-slate-200"
                />
              </div>

              {/* Visual Meter Bar */}
              <div className="space-y-2">
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex relative border border-slate-200">
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
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Safe Threshold (70%): ₦1,155,000</span>
                  <span className={isCrossoverBreached ? "text-rose-700 font-bold" : "text-emerald-700 font-bold"}>
                    Current Ratio: {thresholdRatio}% of Net Book Value
                  </span>
                </div>
              </div>

              {/* Outcome Resolution */}
              <div className="text-xs text-slate-700 pt-2 border-t border-slate-100 flex items-center justify-between font-medium">
                <span>
                  {isCrossoverBreached
                    ? "Financial Action: Repair PO blocked. ₦1,450,000 diverted to replacement procurement queue."
                    : "Financial Action: Repair quote is economically viable. Dispatched to vendor work order."}
                </span>
                <span className="text-cyan-800 font-mono font-bold text-[11px]">AUTONOMOUS RULE</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-mono">
                FOCUS™ v1.0 Spec · Net Book Value (10% Residual Straight-Line)
              </span>
              <Link
                href="/app/finops"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-700 hover:text-cyan-800 font-bold group"
              >
                Inspect Live FinOps Hub <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. SUBNET DISCOVERY & MDM */}
        {activeTab === "discovery" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <Radio className="w-3.5 h-3.5 text-cyan-600 animate-ping" />
                <span className="text-slate-700">
                  Subnet Probe: <span className="text-cyan-700 font-bold">192.168.1.0/24</span> (Ports: 22, 80, 443, 161, 9100)
                </span>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 3 Devices Enrolled
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { ip: "192.168.1.1", name: "Cisco Catalyst 9300-48P", type: "Core Switch", mac: "00:1E:13:A8:4B:20", ports: "SSH 22 · SNMP v3 (161)", desc: "48-Port PoE+ Layer 3 Switch" },
                { ip: "192.168.1.15", name: "Dell PowerEdge R740 iDRAC", type: "Server", mac: "B8:2A:72:C1:90:33", ports: "HTTPS 443 · IPMI 623", desc: "Dual Xeon Gold, 128GB ECC RAM" },
                { ip: "192.168.1.42", name: "Zebra ZT411 Industrial Labeler", type: "Barcode Printer", mac: "00:07:4D:2A:9F:10", ports: "JetDirect 9100", desc: "Thermal Barcode Sticker Station" },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 grid place-items-center text-cyan-700">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {d.name}
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                          {d.type}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {d.ip} · {d.mac} · {d.ports}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ENROLLED
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 flex items-center justify-between text-xs">
              <span className="text-cyan-900 font-mono font-medium">
                Microsoft Intune & Jamf Webhook: 48 company laptops synced with live battery health
              </span>
              <span className="text-cyan-800 font-mono font-bold text-[10.5px]">MDM ACTIVE</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-mono">Zero Manual Serial Typing Required</span>
              <Link
                href="/app/discovery"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-700 hover:text-cyan-800 font-bold group"
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
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">APC Smart-UPS RT 3000 (Ikeja DC)</span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    NOMINAL
                  </span>
                </div>
                <div className="text-2xl font-black text-cyan-700 font-mono">94% Battery Health</div>
                <div className="text-xs text-slate-500">Load: 42% · Voltage: 229.4V · Estimated Runtime: 52 min</div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-emerald-500 h-full" style={{ width: "94%" }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Server Room Thermal Probe #2</span>
                  <span className="text-[10px] font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 font-bold">
                    OPTIMAL
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">22.4°C / 48% RH</div>
                <div className="text-xs text-slate-500">Threshold: 28°C max · Automatic Work Order Trigger Armed</div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-cyan-500 h-full" style={{ width: "45%" }} />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-amber-900 font-medium">
                  Autonomous SLA Dispatch: Critical Work Order auto-dispatched if battery drops below 40%
                </span>
              </div>
              <span className="text-[10.5px] font-mono font-bold text-amber-800">4-HR SLA CLOCK</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-mono">SNMP Traps + Webhook Ingest Live</span>
              <Link
                href="/app/telemetry"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-700 hover:text-cyan-800 font-bold group"
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
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Marina HQ Data Center</div>
                <div className="text-xl font-black text-cyan-800 mt-1">5,410 Assets</div>
                <div className="text-[11px] text-emerald-700 mt-0.5 font-bold">Lagos Island · Tier III DC</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Abuja Regional Hub</div>
                <div className="text-xl font-black text-cyan-800 mt-1">4,120 Assets</div>
                <div className="text-[11px] text-cyan-700 mt-0.5 font-bold">Central Business District</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Epe Solar Project Site</div>
                <div className="text-xl font-black text-cyan-800 mt-1">1,840 Assets</div>
                <div className="text-[11px] text-amber-700 mt-0.5 font-bold">Substation & Inverter Farm</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span className="text-teal-900 font-medium">
                  100% Keyless OpenStreetMap: Zero surprise $5,000/mo Google Maps or Mapbox invoices
                </span>
              </div>
              <span className="text-[10.5px] font-mono text-teal-800 bg-white px-2.5 py-0.5 rounded border border-teal-200 font-bold">
                KEYLESS OSM
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-mono">Sub-Second Vector Tile Clustering</span>
              <Link
                href="/app/locations"
                className="inline-flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-800 font-bold group"
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
