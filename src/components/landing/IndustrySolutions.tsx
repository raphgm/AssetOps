"use client";

import { useState } from "react";
import { Landmark, Hospital, GraduationCap, Building2, Check, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
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
    name: "Commercial Banking & FinTech",
    icon: Landmark,
    tagline: "High-density ATM, server rack, and branch terminal fleet governance",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    painPoint:
      "When branch edge routers, ATM controller PCs, or core server nodes suffer unpredicted hardware downtime, banking transactions halt. Branches bleed millions in customer churn while paper logs fail to track multi-branch IT drift.",
    solution:
      "AssetOps provides sub-minute hardware health telemetry across headquarters data centers and nationwide branch terminals, preventative maintenance schedules, and cryptographic NIST 800-88 certificates for retired storage drives.",
    kpis: [
      { label: "Fleet Uptime Compliance", value: "99.94%" },
      { label: "CBN Audit Reconciliation", value: "100% Verified" },
      { label: "Data Sanitization Standard", value: "NIST 800-88" },
    ],
    features: [
      "Real-time GIS mapping headquarter data centers and regional branch terminals",
      "Automated preventative maintenance routines for power conditioning and rack cooling",
      "Tamper-proof digital decommission certificates for decommissioned NVMe and SAS drives",
      "Strict role segregation between field engineers, procurement officers, and internal auditors",
    ],
  },
  {
    id: "healthcare",
    name: "Hospitals & Diagnostic Networks",
    icon: Hospital,
    tagline: "Life-critical biomedical diagnostic consoles & workstation availability",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    painPoint:
      "Hardware degradation in ICU telemetry terminals, MRI workstation consoles, and diagnostic PCs directly jeopardizes patient diagnostics. Biomedical teams battle unlogged component failures with zero preventative alerts.",
    solution:
      "AssetOps tracks clinical workstations and diagnostic computing assets down to the exact hospital wing and room. Scheduled preventative maintenance alerts dispatch biomedical engineers weeks before thermal or component breakdown occurs.",
    kpis: [
      { label: "Diagnostic Console Uptime", value: "99.98%" },
      { label: "Preventative Maintenance Compliance", value: "98.6%" },
      { label: "SLA Response to Critical Outages", value: "< 15 Minutes" },
    ],
    features: [
      "Wing-and-room location hierarchy for operating theatres, ICU pods, and radiology units",
      "Verified patient health data sanitization prior to drive disposal or warranty replacement",
      "High-contrast QR passport scanning for instant mobile inspection by biomedical engineers",
      "Strict vendor SLA tracking for specialized medical hardware maintenance contracts",
    ],
  },
  {
    id: "universities",
    name: "Higher Education & Multi-Campuses",
    icon: GraduationCap,
    tagline: "Governing 10,000+ laboratory workstations across dispersed campus faculties",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    painPoint:
      "Thousands of computer lab workstations, campus WiFi access points, and lecture hall projectors are scattered across massive acreage. Ghost asset shrinkage is rampant, and lab machines fail right before exam windows.",
    solution:
      "AssetOps consolidates decentralized faculty IT inventory into one unified geospatial interface. Campus IT leads run semester preventative maintenance sweeps, and asset custody transfer logs prevent hardware disappearance.",
    kpis: [
      { label: "Lab Workstation Readiness", value: "99.2%" },
      { label: "Ghost Asset Leakage", value: "Eradicated 94%" },
      { label: "Exam Window Availability", value: "Zero Downtime" },
    ],
    features: [
      "Geospatial fleet mapping specific campus faculties, departmental labs, and lecture complexes",
      "Pre-semester batch maintenance workflows across thousands of lab PCs and UPS backups",
      "Custodian assignment tracking: clear accountability between department heads and IT staff",
      "Predictive FinOps budgeting hardware upgrade cycles 3 to 5 fiscal years in advance",
    ],
  },
  {
    id: "government",
    name: "Public Sector MDAs & Parastatals",
    icon: Building2,
    tagline: "Eliminate ghost hardware and defend capital procurement expenditure before audit",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    painPoint:
      "Government ministries struggle with untracked hardware on legacy spreadsheets, duplicate procurement contractor orders, and recurring repair budgets sunk into obsolete 7-year-old laptops and desktop towers.",
    solution:
      "AssetOps enforces verified physical barcode/QR inventory for every public sector asset, automates straight-line depreciation, and applies the 70% FinOps rule to stop wasteful third-party contractor repair spending.",
    kpis: [
      { label: "Physical Inventory Accuracy", value: "99.8%" },
      { label: "Auditable CapEx Horizon", value: "5 Fiscal Years" },
      { label: "Runaway Repair Costs Recovered", value: "₦142M Saved" },
    ],
    features: [
      "Multi-year CapEx replacement pipeline with transparent mathematical depreciation schedules",
      "Anti-leakage 70% repair cost cut-off stopping repeat contractor repair inflation",
      "Immutable audit trail logging every asset status change, custody reassignment, and sign-off",
      "One-click PDF/CSV governance reports for parliamentary budget committees and state auditors",
    ],
  },
];

export default function IndustrySolutions() {
  const [selectedId, setSelectedId] = useState<string>("banking");
  const current = INDUSTRIES.find((ind) => ind.id === selectedId) || INDUSTRIES[0];
  const Icon = current.icon;

  return (
    <div className="space-y-6 font-sans">
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
                  ? "bg-white border-cyan-400 shadow-md ring-2 ring-cyan-500/20"
                  : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${ind.badgeColor}`}>
                  <ItemIcon className="h-5 w-5" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                    SELECTED
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-slate-900">{ind.name}</div>
              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-sans">{ind.tagline}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Industry Detail Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Challenge & Solution */}
          <div className="lg:col-span-7 space-y-5 font-sans">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl border ${current.badgeColor}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-950 tracking-tight">{current.name}</h3>
                <p className="text-xs font-bold text-cyan-700 mt-0.5 font-mono">{current.tagline}</p>
              </div>
            </div>

            {/* Pain Point */}
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                <AlertCircle className="h-4 w-4 text-rose-600" /> Operational Downtime & Drift Risk
              </div>
              <p className="text-xs text-rose-950 leading-relaxed font-medium">{current.painPoint}</p>
            </div>

            {/* Solution */}
            <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
                <ShieldCheck className="h-4 w-4 text-teal-600" /> AssetOps Intelligent Resolution
              </div>
              <p className="text-xs text-teal-950 leading-relaxed font-medium">{current.solution}</p>
            </div>

            {/* Features list */}
            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                  <Check className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: KPIs */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 font-mono">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 border-b border-slate-200 pb-2">
              Verified Telemetry Benchmarks
            </div>

            <div className="space-y-3">
              {current.kpis.map((kpi, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between shadow-sm">
                  <span className="text-xs text-slate-600 font-sans font-medium">{kpi.label}</span>
                  <span className="text-base font-black text-cyan-700">{kpi.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/sign-in"
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition"
              >
                DEPLOY SECTOR WORKFLOW <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
