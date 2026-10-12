"use client";

import { useState } from "react";
import {
  Landmark,
  Hospital,
  GraduationCap,
  Building2,
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Server,
  Cpu,
  Radio,
  Clock,
  QrCode,
  Lock,
  Layers,
  Sparkles,
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
    badgeTone: "text-cyan-400 border-cyan-500/40 bg-cyan-950/60",
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
    badgeTone: "text-emerald-400 border-emerald-500/40 bg-emerald-950/60",
    ruleBadge: "HIPAA / CLINICAL CRITICAL",
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
    badgeTone: "text-purple-400 border-purple-500/40 bg-purple-950/60",
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
    badgeTone: "text-amber-400 border-amber-500/40 bg-amber-950/60",
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
      {/* 4 Cybernetic Sector Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {INDUSTRIES.map((ind) => {
          const ItemIcon = ind.icon;
          const isSelected = selectedId === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedId(ind.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? "bg-[#081220] border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50"
                  : "bg-[#070b14]/90 border-slate-800 hover:border-slate-700 hover:bg-[#0c1424]"
              }`}
            >
              {/* Corner Reticle for Selected Tab */}
              {isSelected && (
                <div className="absolute top-2 right-2 text-[9px] font-mono text-cyan-400 font-bold">
                  ⌜ ACTIVE ⌟
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${ind.badgeTone}`}>
                  <ItemIcon className="h-5 w-5" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-400/50 animate-pulse">
                    LINKED
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-white">{ind.name}</div>
              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
                {ind.tagline}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2085 Interactive Aerospace Topology Deck */}
      <div className="bg-[#070b14] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.15)] relative overflow-hidden">
        {/* Holographic Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 2085 HUD Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border ${current.badgeTone} shadow-md`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {current.name}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/40">
                  {current.ruleBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{current.summary}</p>
            </div>
          </div>

          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition group"
          >
            Launch Sector Workflow{" "}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Visual Body: 2085 Topology Flow Diagram + KPI Panel */}
        <div className="grid lg:grid-cols-12 gap-6 mt-6 items-center relative z-10">
          {/* Visual Topology Diagram (Span 8) */}
          <div className="lg:col-span-8 bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 relative overflow-hidden font-mono backdrop-blur-md">
            {/* Cyber Grid Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-4 flex items-center justify-between relative z-10">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                LIVE INFRASTRUCTURE TOPOLOGY // VERIFIED PIPELINE
              </span>
              <span className="text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 text-[9.5px]">
                ● ZERO LATENCY DRIFT
              </span>
            </div>

            {/* Visual Node Flow Chart with connecting lines */}
            <div className="grid sm:grid-cols-3 gap-3 relative z-10">
              {current.nodes.map((node, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 shadow-sm space-y-2 relative group hover:border-cyan-400/60 transition"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        node.status === "online"
                          ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                          : node.status === "warning"
                          ? "bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse"
                          : "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                      }`}
                    />
                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded ${
                        node.status === "online"
                          ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/40"
                          : node.status === "warning"
                          ? "bg-amber-950/90 text-amber-300 border border-amber-500/40"
                          : "bg-cyan-950/90 text-cyan-300 border border-cyan-500/40"
                      }`}
                    >
                      {node.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white font-sans">{node.label}</div>
                    <div className="text-[10.5px] text-slate-400">{node.sub}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10.5px]">
                    <span className="text-slate-500">Metric:</span>
                    <span className="font-bold text-cyan-300">{node.metric}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Connecting Visual Flow Track */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Zap className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                Hardware FinOps Engine actively models depreciation & risk
              </span>
              <span className="text-slate-400">100% Keyless Vector Sync</span>
            </div>
          </div>

          {/* KPI Benchmarks (Span 4) */}
          <div className="lg:col-span-4 space-y-3 font-mono">
            {current.kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm flex items-center justify-between hover:border-cyan-500/40 transition"
              >
                <div>
                  <div className="text-xs text-slate-400 font-sans font-medium">{kpi.label}</div>
                  <div className="text-[10.5px] text-emerald-400 font-bold mt-0.5">{kpi.trend}</div>
                </div>
                <div className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
