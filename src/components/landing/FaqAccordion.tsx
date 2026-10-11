"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does AssetOps differ from general IT ticketing tools like Jira Service Management or ServiceNow?",
    a: "Standard ticketing tools only track the lifecycle of an incident ticket (who reported it, who resolved it). Once the ticket is closed, the hardware context is lost. AssetOps is built specifically for physical ICT infrastructure: it attaches every intervention to an immutable Digital Hardware Passport, computes straight-line depreciation, manages geospatial GIS locations, tracks contractor SLA penalties, and forecasts 8-quarter replacement CapEx so your CFO and CIO speak the same language.",
  },
  {
    q: "How does the 70% FinOps repair-vs-replace rule work?",
    a: "AssetOps continuously calculates the real-time Net Book Value (NBV) of each device using initial purchase price, age, and useful life down to a 10% residual salvage value. Whenever a technician logs a repair quote or work order, AssetOps sums all historical repair spend. If total repair cost exceeds 70% of the asset's current Net Book Value, the system automatically flags the work order as 'Negative-ROI / Replace Recommended', alerting IT management before good money is thrown at dying machinery.",
  },
  {
    q: "Does AssetOps require proprietary GPS hardware or expensive barcode scanners?",
    a: "No. AssetOps uses open standards. Every asset receives an encrypted QR passport label that can be scanned using the standard camera on any iOS or Android phone without installing external apps. For estate mapping, our GIS interface runs on lightweight, free Leaflet vector tiles with interactive pin-dropping and browser GPS coordinates—zero Google Maps billing or specialized tracking beacons required.",
  },
  {
    q: "What data destruction standards are supported for certified decommissioning?",
    a: "AssetOps fully supports NIST SP 800-88 Rev 1 (Clear, Purge, and Cryptographic Erase), DoD 5220.22-M 3-pass sanitization, and certified physical degaussing. When an asset is retired, the system generates a tamper-evident Certificate of Sanitization featuring a unique Certificate ID, technician attribution, salvage recovery credit, and an immutable SHA-256 cryptographic digest ready for external auditors.",
  },
  {
    q: "How does the AI assistant work, and is our institutional data private?",
    a: "AssetOps uses an evidence-backed architecture powered by Groq's high-speed Llama 3 engine. The model is constrained to deterministic, read-only queries against your tenant's scoped PostgreSQL database. The AI cannot hallucinate metrics: every claim must cite specific work orders, asset tags, or financial figures. If no evidence exists, the model explicitly declines to answer. Your data is never used to train global models.",
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
            className={`border rounded-xl transition-all ${
              isOpen ? "bg-surface border-line2 shadow-md" : "bg-surface/40 border-line hover:border-line2"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-sm text-fg leading-snug">{faq.q}</span>
              <ChevronDown
                className={`h-4 w-4 text-dim shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-accent" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-xs text-mute leading-relaxed border-t border-line/50 pt-3 animate-rise">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
