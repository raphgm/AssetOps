"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does AssetOps differ from general IT ticketing tools like Jira or ServiceNow?",
    a: "Standard ticketing tools only track incident tickets. Once closed, hardware context is lost. AssetOps is built specifically for physical ICT assets: it attaches every intervention to an immutable Digital Hardware Passport, computes straight-line depreciation, manages geospatial GIS locations, tracks contractor SLAs, and forecasts 8-quarter replacement CapEx.",
  },
  {
    q: "How does the 70% FinOps repair-vs-replace rule work?",
    a: "AssetOps continuously calculates the real-time Net Book Value (NBV) of each device down to a 10% residual salvage value. Whenever a repair quote is entered, AssetOps sums all historical repair spend. If total repair cost exceeds 70% of current Net Book Value, the system automatically flags the work order as 'Negative-ROI / Replace Recommended'.",
  },
  {
    q: "Does AssetOps require proprietary GPS beacons or barcode scanners?",
    a: "No. AssetOps uses open standards. Every asset receives an encrypted QR passport label scanned using the standard camera on any smartphone without installing external apps. For estate mapping, our GIS interface runs on lightweight, free Leaflet vector tiles with interactive pin-dropping—zero Google Maps billing required.",
  },
  {
    q: "What data destruction standards are supported for decommissioning?",
    a: "AssetOps fully supports NIST SP 800-88 Rev 1 (Clear, Purge, and Cryptographic Erase), DoD 5220.22-M 3-pass sanitization, and certified physical degaussing. When an asset is retired, the system generates a tamper-evident Certificate of Sanitization featuring a unique Certificate ID, certifying officer, and SHA-256 cryptographic digest.",
  },
  {
    q: "How does the AI assistant avoid hallucinations with enterprise data?",
    a: "AssetOps uses an evidence-backed architecture powered by Groq's high-speed Llama 3 engine. The model is strictly constrained to deterministic, read-only queries against your tenant's PostgreSQL database. The AI cannot hallucinate metrics: every claim must cite specific work orders, asset tags, or financial figures. If no evidence exists, the model explicitly declines to answer.",
  },
  {
    q: "Can we export reports directly to SAP, Oracle ERP, or Microsoft Excel?",
    a: "Yes. Every view—including the 8-Quarter CapEx Replacement pipeline, Asset Registry, Preventative Maintenance schedules, and FinOps TCO scorecard—includes one-click CSV and structured JSON exports formatted specifically for immediate ingest into enterprise ERP ledgers.",
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
                ? "bg-white border-teal-200 shadow-md shadow-teal-500/5 ring-1 ring-teal-500/20"
                : "bg-white/80 border-slate-200/90 hover:border-slate-300 hover:bg-white"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 focus:outline-none rounded-2xl"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-sm text-slate-900 leading-snug">{faq.q}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-teal-600" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
