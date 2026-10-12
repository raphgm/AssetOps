"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does AssetOps differ from generic ticketing tools like Jira or ServiceNow?",
    a: "Generic ticketing tools only track human message exchanges without hardware context. AssetOps connects physical serial numbers, straight-line depreciation schedules, warranty SLA deadlines, digital QR passports, preventative maintenance routines, and disposal compliance directly to financial asset ledgers.",
  },
  {
    q: "How does the 70% FinOps repair threshold protect capital expenditure?",
    a: "When a hardware asset requires repair, AssetOps compares the quoted maintenance cost against the asset's current residual net book value. If cumulative repairs exceed 70% of residual value, the system flags the work order, preventing organizations from pouring repair money into obsolete machines and triggering a CapEx replacement recommendation.",
  },
  {
    q: "Does AssetOps require expensive proprietary RFID hardware scanners?",
    a: "No. AssetOps generates cryptographic, high-contrast QR passports for every physical device. Field engineers and branch IT officers can scan tags using any standard mobile phone camera or handheld 2D barcode scanner to instantly bring up service history, custody records, and open work orders.",
  },
  {
    q: "What data sanitization standards are enforced during asset decommissioning?",
    a: "AssetOps enforces NIST SP 800-88 Rev. 1 guidelines (Clear, Purge, Destroy) for storage drive sanitization. The platform logs drive serial numbers, wipe methods, and operator sign-offs, automatically issuing tamper-proof digital certificates with SHA-256 verification hashes for regulatory audits.",
  },
  {
    q: "How does the Groq AI Copilot assist IT teams without hallucinating data?",
    a: "AssetOps powers its Copilot using Groq's high-speed Llama 3 engine, grounded strictly in your organization's verified PostgreSQL database records. It diagnoses fleet spend anomalies, overdue maintenance, and contractor SLAs with direct citations to work orders and asset tags—never hallucinating fictitious hardware.",
  },
  {
    q: "Can AssetOps data and financial depreciation be exported to our ERP?",
    a: "Yes. All asset registries, multi-year CapEx forecasts, maintenance expenditure ledgers, and audit histories can be exported in one click to clean CSV/Excel and structured JSON/API feeds compatible with SAP, Oracle, Microsoft Dynamics, and regional accounting software.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all ${
              isOpen
                ? "bg-white border-cyan-300 shadow-md ring-1 ring-cyan-500/20"
                : "bg-white/80 border-slate-200/90 hover:border-slate-300 hover:bg-white"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 focus:outline-none rounded-2xl"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-sm text-slate-900 leading-snug font-sans">{faq.q}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-cyan-600" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-sans">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
