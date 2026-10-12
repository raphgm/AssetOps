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
    a: "No. AssetOps includes an in-browser HTML5 camera scanner that works directly on mobile phones without installing an app store binary. It also generates print-ready QR passport stickers with company logos and serial tags for physical labeling.",
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
    a: "Yes. All asset registers, depreciation schedules, maintenance expenditure ledgers, and audit histories can be exported in one click to streaming Excel .xlsx and Linux Foundation FOCUS™ v1.0 JSON format for SAP, Oracle, and Microsoft Dynamics.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto font-sans">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all ${
              isOpen
                ? "bg-[#121520] border-cyan-500/50 shadow-lg shadow-cyan-950/20 ring-1 ring-cyan-500/20"
                : "bg-[#0d0f17]/80 border-white/[0.06] hover:border-white/[0.12] hover:bg-[#121520]/50"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 focus:outline-none rounded-2xl"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                {faq.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-cyan-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.06]">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
