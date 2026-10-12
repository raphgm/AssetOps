"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does AssetOps 2080 differ from primitive 2020s ticketing systems?",
    a: "Ancient tools only tracked text complaints between humans. AssetOps 2080 directly interfaces with sub-atomic quantum sensors, tracks molecular lattice degradation in real-time, coordinates autonomous nanite repair swarms, and synchronizes thermodynamic CapEx depreciation across orbital and planetary grids without human bottleneck.",
  },
  {
    q: "How does the 14% Thermodynamic Lattice Rule prevent capital waste?",
    a: "When a quantum photonic substrate experiences molecular decay, continuing to spend nanite energy repairing micro-conduits creates negative thermodynamic return. Once cumulative repair energy reaches 14% of residual quantum coherence yield, AssetOps automatically halts repairs and diverts the core to molecular plasma recycling.",
  },
  {
    q: "Does AssetOps require physical transponders or handheld barcode readers?",
    a: "No. All assets project a volumetric 4D holographic aura in spatial coordinate space. Fleet engineers and autonomous inspection drones authenticate hardware using neural eye-tracking and biometric neural signature handshakes—zero physical labels required.",
  },
  {
    q: "What data dissolution standards are enforced for quantum crystal retirement?",
    a: "AssetOps fully enforces Interplanetary Governance Data Standard IGDS-2079 (Laser-Induced Molecular Lattice Collapse & Quantum Entanglement Erasure). The system issues a tamper-proof certificate anchored to quantum-entangled hash signatures that cannot be forged or reversed by any classical or quantum supercomputer.",
  },
  {
    q: "How does the autonomous Sentinel AI operate without human hallucination?",
    a: "AssetOps uses a deterministic neural copilot grounded strictly in the local planetary PostgreSQL ledger. The sentinel cannot hallucinate metrics: every claim must cite verified physical nanite telemetry, quantum coherence readings, and cryptographic ledger IDs. If telemetry is unavailable, it explicitly reports a phase-lock vacuum.",
  },
  {
    q: "Can telemetry be exported directly to Interplanetary Sovereign ERPs?",
    a: "Yes. All views—including 8-Solar Cycle CapEx pipelines, nanite work logs, and planetary GIS arrays—stream via sub-nanosecond neural APIs and export to standard structured quantum formats for immediate ingestion into sovereign treasury ledgers.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto font-mono">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all ${
              isOpen
                ? "bg-[#070e1e] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                : "bg-[#050914]/80 border-cyan-500/20 hover:border-cyan-400/40 hover:bg-[#070d1a]"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 focus:outline-none rounded-2xl"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-sm text-white leading-snug">{faq.q}</span>
              <ChevronDown
                className={`h-4 w-4 text-cyan-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-cyan-500/15 pt-3 font-sans">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
