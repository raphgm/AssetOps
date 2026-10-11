"use client";

import { useState } from "react";
import { Landmark, Hospital, GraduationCap, Building2, Check, ArrowUpRight, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";

interface IndustryItem {
  id: string;
  name: string;
  icon: any;
  tagline: string;
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
    tagline: "Zero downtime on branch core switches & PCI-DSS audit defensibility",
    painPoint:
      "When a branch router or ATM network bridge fails, trading and customer deposits halt. Banks bleed millions in SLA penalties while legacy spreadsheets fail to prove hardware chain of custody to central bank and PCI-DSS auditors.",
    solution:
      "AssetOps provides sub-minute hardware telemetry across hundreds of bank branches, automated 90-day preventative maintenance for core switch stacks, and NIST 800-88 cryptographic data wipe certificates whenever SSDs or ATM controllers are decommissioned.",
    kpis: [
      { label: "Branch Network Uptime", value: "99.98%" },
      { label: "PCI-DSS Audit Deficit", value: "0 Violations" },
      { label: "End-of-Life Wipe Proof", value: "100% Cryptographic" },
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
    painPoint:
      "Unplanned hardware outages in ICU telemetry workstations, digital MRI consoles, and pharmacy dispensing PCs risk patient lives. Biomedical engineers struggle with fragmented vendor service slips and delayed parts ordering.",
    solution:
      "AssetOps maps clinical hardware down to the specific ward, ICU room, and diagnostic theatre. Automated preventative calibration schedules trigger work orders weeks before equipment degrades, while mobile QR scanning lets nurses call emergency biomedical support in seconds.",
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
    painPoint:
      "Thousands of computer lab workstations, classroom projectors, and campus Wi-Fi access points are spread across massive multi-campus acres. Equipment frequently goes missing, and students face broken lab machines during critical exams.",
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
    painPoint:
      "Public sector ministries struggle with 'ghost assets' on paper ledgers, untracked procurement vendor contracts, and recurring repair bills that exceed the cost of buying new machines, creating massive audit queries.",
    solution:
      "AssetOps enforces physical GIS verification of every government asset, automates straight-line depreciation accounting according to public sector standards, and applies the 70% FinOps rule to stop wasteful recurring contractor repairs.",
    kpis: [
      { label: "Phantom Assets Identified", value: "100% Verified" },
      { label: "Defensible CapEx Forecast", value: "8 Quarters Ahead" },
      { label: "Wasteful Repair Diversion", value: "₦14.2M Saved" },
    ],
    features: [
      "8-Quarter CapEx pipeline with transparent mathematical depreciation models",
      "Anti-kickback 70% repair thresholding that flags unjustified repeat work orders",
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
    <div className="space-y-8">
      {/* Industry Selector Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {INDUSTRIES.map((ind) => {
          const ItemIcon = ind.icon;
          const isSelected = selectedId === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedId(ind.id)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-surface border-accent/60 shadow-lg shadow-accent/5 ring-1 ring-accent/30"
                  : "bg-surface/50 border-line hover:border-line2 hover:bg-surface"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 rounded-lg ${
                    isSelected ? "bg-accent/15 text-accent" : "bg-raised text-dim"
                  }`}
                >
                  <ItemIcon className="h-5 w-5" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono text-accent uppercase tracking-wider font-semibold">
                    ACTIVE
                  </span>
                )}
              </div>
              <div>
                <div className="font-semibold text-sm text-fg">{ind.name}</div>
                <div className="text-[11px] text-mute line-clamp-1 mt-0.5">{ind.tagline}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Industry Detail Card */}
      <div className="card p-6 sm:p-8 bg-surface/90 border-line2 relative overflow-hidden animate-rise">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Challenge & Solution */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-fg tracking-tight">{current.name}</h3>
                <p className="text-xs text-accent font-medium mt-0.5">{current.tagline}</p>
              </div>
            </div>

            {/* Pain Point */}
            <div className="p-4 rounded-lg bg-bad/5 border border-bad/20 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-bad">
                <AlertCircle className="h-4 w-4" /> The Institutional Pain Point
              </div>
              <p className="text-xs text-mute leading-relaxed">{current.painPoint}</p>
            </div>

            {/* Solution */}
            <div className="p-4 rounded-lg bg-ok/5 border border-ok/20 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-ok">
                <ShieldCheck className="h-4 w-4" /> How AssetOps Solves It
              </div>
              <p className="text-xs text-mute leading-relaxed">{current.solution}</p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-dim">
                Tailored Architecture & Guardrails
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {current.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-fg">
                    <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Verified KPI Impact & CTA */}
          <div className="lg:col-span-5 bg-raised/80 border border-line rounded-xl p-5 space-y-6">
            <div className="text-xs uppercase tracking-wider text-dim border-b border-line pb-2 flex items-center justify-between">
              <span>Measurable Institutional Impact</span>
              <span className="text-ok font-mono text-[10px]">VERIFIED BENCHMARKS</span>
            </div>

            <div className="space-y-3">
              {current.kpis.map((kpi, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-bg border border-line flex items-center justify-between">
                  <span className="text-xs text-mute">{kpi.label}</span>
                  <span className="font-mono text-base font-bold text-accent">{kpi.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-line space-y-3">
              <div className="text-[11px] text-mute leading-relaxed">
                Pre-configured workflows available out of the box for {current.name}. Zero complex consulting cycles required.
              </div>
              <Link href="/sign-up" className="btn btn-accent w-full text-xs h-9 justify-center font-medium">
                Request Tailored Sector Pilot <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
