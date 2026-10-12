"use client";

import { useState } from "react";
import {
  Landmark,
  Hospital,
  GraduationCap,
  Building2,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface TopologyNode {
  label: string;
  sub: string;
  status: "online" | "warning" | "verified";
  metric: string;
}

interface IndustryItem {
  id: string;
  name: string;
  icon: any;
  tagline: string;
  badgeTone: string;
  ruleBadge: string;
  summary: string;
  kpis: { label: string; value: string; trend: string }[];
  nodes: TopologyNode[];
}

const INDUSTRIES: IndustryItem[] = [
  {
    id: "banking",
    name: "Commercial Banking & FinTech",
    icon: Landmark,
    tagline: "High-density ATM, server rack, and branch terminal fleet",
    badgeTone: "bg-blue-50 text-blue-700 border-blue-100",
    ruleBadge: "CBN / FOCUS™ v1.0 ALIGNED",
    summary: "Sub-minute branch router & ATM uptime with automated 70% CapEx replacement gates.",
    kpis: [
      { label: "Branch Uptime", value: "99.98%", trend: "+0.4% vs SLA" },
      { label: "CBN Audit Match", value: "100%", trend: "Zero Drift" },
      { label: "Bad Fixes Blocked", value: "₦28.4M", trend: "Diverted to CapEx" },
    ],
    nodes: [
      { label: "ATM Edge Fleet", sub: "1,420 NCR Nodes", status: "online", metric: "0.8ms Ping" },
      { label: "Branch SD-WAN", sub: "Cisco Catalyst 9300", status: "online", metric: "100% Up" },
      { label: "Tier-III Marina DC", sub: "48 Server Racks", status: "verified", metric: "NIST 800-88" },
    ],
  },
  {
    id: "healthcare",
    name: "Hospitals & Diagnostic Networks",
    icon: Hospital,
    tagline: "Biomedical diagnostic consoles & clinical workstation availability",
    badgeTone: "bg-emerald-50 text-emerald-700 border-emerald-100",
    ruleBadge: "HIPAA / PATIENT PRIVACY",
    summary: "Wing-and-room biomedical tracking with automated thermal alerts before component breakdown.",
    kpis: [
      { label: "Console Uptime", value: "99.99%", trend: "Life-Critical" },
      { label: "PM Compliance", value: "98.6%", trend: "Scheduled" },
      { label: "Response Time", value: "< 12 Min", trend: "Autonomous Dispatch" },
    ],
    nodes: [
      { label: "ICU Vital Displays", sub: "48 Telemetry Pods", status: "online", metric: "100% Calibrated" },
      { label: "MRI Workstation", sub: "Dual Xeon PACs Node", status: "warning", metric: "24.2°C Thermal Warning" },
      { label: "Encrypted Storage", sub: "NIST SP 800-88 Wipe", status: "verified", metric: "SHA-256 Signed" },
    ],
  },
  {
    id: "universities",
    name: "Higher Education & Multi-Campuses",
    icon: GraduationCap,
    tagline: "Governing 10,000+ laboratory workstations across dispersed faculties",
    badgeTone: "bg-purple-50 text-purple-700 border-purple-100",
    ruleBadge: "ZERO GHOST ASSETS",
    summary: "Consolidate faculty IT labs into one GIS map with pre-semester maintenance sweeps.",
    kpis: [
      { label: "Lab Readiness", value: "99.4%", trend: "Exam-Ready" },
      { label: "Shrinkage Cut", value: "94%", trend: "Custody Tracked" },
      { label: "Annual CapEx Saved", value: "₦42.0M", trend: "5-Year Horizon" },
    ],
    nodes: [
      { label: "Science Lab A", sub: "120 Workstations", status: "online", metric: "Pre-Exam Passed" },
      { label: "Engineering Hub", sub: "85 CAD Terminals", status: "online", metric: "UPS Verified" },
      { label: "Faculty Ledger", sub: "10,400 Tagged Units", status: "verified", metric: "0 Ghost Units" },
    ],
  },
  {
    id: "government",
    name: "Public Sector MDAs & Parastatals",
    icon: Building2,
    tagline: "Eliminate ghost hardware and defend capital procurement before audit",
    badgeTone: "bg-amber-50 text-amber-700 border-amber-100",
    ruleBadge: "PARLIAMENTARY AUDIT PROOF",
    summary: "Cryptographic QR passports and 70% threshold stops runaway third-party contractor repair invoices.",
    kpis: [
      { label: "Physical Match", value: "99.9%", trend: "QR Verified" },
      { label: "Repair Inflation Cut", value: "₦142M", trend: "Contractors Blocked" },
      { label: "Audit Horizon", value: "5 Years", trend: "Straight-Line" },
    ],
    nodes: [
      { label: "Ministry Desktops", sub: "4,800 All-in-Ones", status: "online", metric: "QR Tagged" },
      { label: "Legacy Servers", sub: "14 PowerEdge Units", status: "warning", metric: "70% FinOps Breached" },
      { label: "Certified Disposal", sub: "Tamper-Proof Audit", status: "verified", metric: "Auditor Approved" },
    ],
  },
];

export default function IndustrySolutions() {
  const [selectedId, setSelectedId] = useState<string>("government");
  const current = INDUSTRIES.find((ind) => ind.id === selectedId) || INDUSTRIES[0];
  const Icon = current.icon;

  return (
    <div className="space-y-6 font-sans">
      {/* 4 Industry Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {INDUSTRIES.map((ind) => {
          const ItemIcon = ind.icon;
          const isSelected = selectedId === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedId(ind.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-white border-cyan-500 shadow-sm ring-1 ring-cyan-500/20"
                  : "bg-white/70 border-slate-200/80 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg border ${ind.badgeTone}`}>
                  <ItemIcon className="h-4 w-4" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                    Active
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-slate-900">{ind.name}</div>
              <div className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
                {ind.tagline}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Solution Architecture Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm">
        {/* Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${current.badgeTone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {current.name}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {current.ruleBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{current.summary}</p>
            </div>
          </div>

          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            Launch Sector Workflow <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Visual Body: Node Flow Diagram + KPI Panel */}
        <div className="grid lg:grid-cols-12 gap-5 mt-5 items-center">
          {/* Topology Diagram (Span 8) */}
          <div className="lg:col-span-8 bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 sm:p-5">
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-3.5 flex items-center justify-between">
              <span>Live Infrastructure Topology</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-[10px] font-medium">
                ● Zero Latency Drift
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-2.5">
              {current.nodes.map((node, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/80 rounded-lg p-3 shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        node.status === "online"
                          ? "bg-emerald-500"
                          : node.status === "warning"
                          ? "bg-amber-500"
                          : "bg-cyan-500"
                      }`}
                    />
                    <span
                      className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded uppercase ${
                        node.status === "online"
                          ? "bg-emerald-50 text-emerald-800"
                          : node.status === "warning"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-cyan-50 text-cyan-800"
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-900">{node.label}</div>
                    <div className="text-[11px] text-slate-500">{node.sub}</div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Metric:</span>
                    <span className="font-medium text-slate-700">{node.metric}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-cyan-600" />
                Hardware FinOps Engine actively models depreciation & risk
              </span>
              <span className="text-slate-400">100% Keyless Vector Sync</span>
            </div>
          </div>

          {/* KPI Panel (Span 4) */}
          <div className="lg:col-span-4 space-y-2.5">
            {current.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50/60 border border-slate-200/70 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs text-slate-500 font-medium">{kpi.label}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{kpi.trend}</div>
                </div>
                <div className="text-xl font-bold text-slate-900">{kpi.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
