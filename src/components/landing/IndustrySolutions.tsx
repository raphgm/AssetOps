"use client";

import { useState } from "react";
import { Landmark, Hospital, GraduationCap, Building2, Check, ArrowUpRight, ShieldCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

interface IndustryItem {
  id: string;
  name: string;
  icon: any;
  tagline: string;
  badgeColor: string;
  painPoint: string;
  solution: string;
  kpis: { label: string; value: string }[];
  features: string[];
}

const INDUSTRIES: IndustryItem[] = [
  {
    id: "banking",
    name: "Commercial Banks & FinTech",
    icon: Landmark,
    tagline: "Zero downtime on branch core switches & PCI-DSS audit defense",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    painPoint:
      "When branch core switches fail, teller transactions freeze. Banks bleed millions in customer SLA penalties while legacy spreadsheets fail to prove chain of custody to central bank and PCI-DSS inspectors.",
    solution:
      "AssetOps provides sub-minute hardware health telemetry across all branches, automated 90-day preventative maintenance for core switch stacks, and NIST 800-88 cryptographic wipe certificates for decommissioned storage drives.",
    kpis: [
      { label: "Branch Switch Uptime", value: "99.98%" },
      { label: "PCI-DSS Audit Deficit", value: "0 Violations" },
      { label: "End-of-Life Data Wipe", value: "100% Cryptographic" },
    ],
    features: [
      "Branch-level Leaflet GIS map with instant router failover visibility",
      "Automated preventative maintenance routines for server room UPS and cooling",
      "Immutable tamper-proof sanitization certificates for retired storage drives",
      "Strict role-based segregation between branch technicians and central IT audit",
    ],
  },
  {
    id: "healthcare",
    name: "Hospitals & Medical Centres",
    icon: Hospital,
    tagline: "Life-critical workstation uptime & biomedical telemetry compliance",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    painPoint:
      "Unplanned hardware outages in ICU monitors, MRI diagnostic consoles, and pharmacy dispensing PCs risk patient lives. Biomedical teams struggle with lost vendor slips and delayed repairs.",
    solution:
      "AssetOps maps clinical hardware down to the specific ward, ICU room, and diagnostic theatre. Automated preventative servicing triggers weeks before equipment degrades, while mobile QR scanning alerts biomedical technicians in seconds.",
    kpis: [
      { label: "Emergency Workstation MTBF", value: "+45% Longer" },
      { label: "Biomedical PM Compliance", value: "100% On-Time" },
      { label: "Nurse-to-Technician Dispatch", value: "< 2 Minutes" },
    ],
    features: [
      "Floor and ward-level location hierarchy for surgical and diagnostic devices",
      "NIST 800-88 certified patient data destruction before workstation recycling",
      "Mobile scan-to-report QR stickers on diagnostic and doctor terminal screens",
      "Vendor SLA tracking for specialized medical hardware maintenance contracts",
    ],
  },
  {
    id: "universities",
    name: "Universities & Multi-Campus",
    icon: GraduationCap,
    tagline: "Multi-faculty lab management across decentralized academic campuses",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    painPoint:
      "Thousands of computer lab PCs and campus Wi-Fi access points are scattered across multiple campuses. Hardware goes missing, and students face broken lab machines during critical exams.",
    solution:
      "AssetOps consolidates decentralized university faculties into one unified GIS estate map. Lab managers run bulk semester preventative maintenance sprints, while student work orders route instantly to the nearest on-campus ICT technician.",
    kpis: [
      { label: "Lab Workstation Availability", value: "97.8%" },
      { label: "Ghost Asset Leakage", value: "Reduced 84%" },
      { label: "Exam Readiness Score", value: "100% Pre-tested" },
    ],
    features: [
      "Multi-campus GIS map pinpointing specific faculty buildings and computer labs",
      "Semester-break batch preventative maintenance scheduler for hundreds of PCs",
      "Self-service student incident reporting via scanned desk QR codes",
      "Hardware FinOps lifecycle planning to forecast lab hardware upgrades accurately",
    ],
  },
  {
    id: "government",
    name: "Government Parastatals & MDAs",
    icon: Building2,
    tagline: "Eliminate phantom assets & defend 8-quarter capital budgets before the Treasury",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    painPoint:
      "Public sector ministries struggle with 'ghost assets' on paper ledgers, untracked procurement vendor contracts, and recurring repair bills that exceed the cost of buying new machines.",
    solution:
      "AssetOps enforces physical GIS verification of every government asset, automates straight-line depreciation accounting according to public sector standards, and applies the 70% FinOps rule to stop wasteful recurring contractor repairs.",
    kpis: [
      { label: "Phantom Assets Identified", value: "100% Verified" },
      { label: "Defensible CapEx Forecast", value: "8 Quarters Ahead" },
      { label: "Wasteful Repair Diversion", value: "₦14.2M Saved" },
    ],
    features: [
      "8-Quarter CapEx pipeline with transparent mathematical depreciation models",
      "Anti-kickback 70% repair thresholding that flags repeat work orders",
      "Append-only immutable audit trail recording every state change and technician signature",
      "One-click CSV & Excel reporting for legislative oversight and Auditor-General reviews",
    ],
  },
];

export default function IndustrySolutions() {
  const [selectedId, setSelectedId] = useState<string>("banking");
  const current = INDUSTRIES.find((ind) => ind.id === selectedId) || INDUSTRIES[0];
  const Icon = current.icon;

  return (
    <div className="space-y-6">
      {/* 4 Industry Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {INDUSTRIES.map((ind) => {
          const ItemIcon = ind.icon;
          const isSelected = selectedId === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedId(ind.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-white border-slate-300 shadow-md ring-2 ring-teal-500/30"
                  : "bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${ind.badgeColor}`}>
                  <ItemIcon className="h-5 w-5" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    SELECTED
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-slate-900">{ind.name}</div>
              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ind.tagline}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Industry Detail Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-9 shadow-xl shadow-slate-200/50">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Challenge & Solution */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${current.badgeColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{current.name}</h3>
                <p className="text-xs font-semibold text-teal-700 mt-0.5">{current.tagline}</p>
              </div>
            </div>

            {/* Pain Point */}
            <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                <AlertCircle className="h-4 w-4 text-rose-600" /> The Operational Risk
              </div>
              <p className="text-xs text-rose-950/80 leading-relaxed font-medium">{current.painPoint}</p>
            </div>

            {/* Solution */}
            <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                <ShieldCheck className="h-4 w-4 text-teal-600" /> How AssetOps Solves It
              </div>
              <p className="text-xs text-teal-950/80 leading-relaxed font-medium">{current.solution}</p>
            </div>

            {/* Features list */}
            <div className="grid sm:grid-cols-2 gap-2 pt-1">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                  <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: KPIs */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 border-b border-slate-200 pb-2">
              Verified Sector Impact
            </div>

            <div className="space-y-2.5">
              {current.kpis.map((kpi, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between shadow-sm">
                  <span className="text-xs font-medium text-slate-600">{kpi.label}</span>
                  <span className="font-mono text-base font-black text-teal-700">{kpi.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/sign-up"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition"
              >
                Deploy Sector Pilot <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
