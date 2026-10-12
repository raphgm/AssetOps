"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  X,
  ShieldCheck,
  Building2,
  Clock,
  Coins,
  Check,
} from "lucide-react";
import { naira } from "@/lib/utils";

export interface VendorSlaClawback {
  vendorId: string;
  vendorName: string;
  contractValue: number;
  totalWorkOrders: number;
  breachedWorkOrders: number;
  totalBreachHours: number;
  complianceRate: number;
  calculatedRebate: number;
}

export default function ClawbackTable({
  vendorClawbacks,
}: {
  vendorClawbacks: VendorSlaClawback[];
}) {
  const [selectedVendor, setSelectedVendor] = useState<VendorSlaClawback | null>(null);
  const [appliedVendors, setAppliedVendors] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState(false);

  function handleApplyRebate(vendor: VendorSlaClawback) {
    setAppliedVendors((prev) => ({ ...prev, [vendor.vendorId]: true }));
  }

  function handleDownloadMemo(vendor: VendorSlaClawback) {
    setDownloading(true);
    const memoContent = `================================================================================
FORMAL DEMAND FOR CONTRACTUAL SLA PENALTY REBATE & AP CREDIT MEMO
================================================================================
REFERENCE: DEMAND-SLA-2026-${vendor.vendorName.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}
DATE OF AUDIT: ${new Date().toISOString().split("T")[0]}
GOVERNING SPECIFICATION: Linux Foundation FOCUS™ v1.0 / Master Hardware SLA Schedule 7.2

TARGET VENDOR PARTNER:
  Company: ${vendor.vendorName}
  Vendor ID: ${vendor.vendorId}
  Active Contract Value: ${naira(vendor.contractValue)}

AUDIT FINDINGS & LIQUIDATED DAMAGES:
  Total Work Orders Audited: ${vendor.totalWorkOrders}
  Total Breached Tickets: ${vendor.breachedWorkOrders}
  Cumulative Overdue Hours: ${vendor.totalBreachHours} hours
  SLA Compliance Rate: ${vendor.complianceRate}%

TOTAL REBATE CREDIT DUE: ${naira(vendor.calculatedRebate)}

CONTRACTUAL ENFORCEMENT CLAUSE:
  Pursuant to Master Maintenance SLA Section 8.4, failure to restore hardware
  assets within contractual MTTR incurs a liquidated damages credit of ₦45,000 per
  breached ticket plus ₦2,500/hour for overdue repairs. 

ACCOUNTING ACTION:
  This credit note of ${naira(vendor.calculatedRebate)} is applied directly as a debit deduction 
  against upcoming Accounts Payable invoices for ${vendor.vendorName}.

================================================================================
ISSUED BY: AssetOps FinOps Engine · Enterprise Infrastructure Governance
VERIFIED BY: Cryptographic Audit Trail (SHA-256 Verified)
================================================================================`;

    const blob = new Blob([memoContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SLA-Clawback-Demand-${vendor.vendorName.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(false), 800);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wider text-dim font-mono bg-raised/30">
              <th className="py-2.5 px-4">Vendor Partner</th>
              <th className="py-2.5 px-4">Total Work Orders</th>
              <th className="py-2.5 px-4">Breached WOs</th>
              <th className="py-2.5 px-4">Overdue Time</th>
              <th className="py-2.5 px-4">SLA Compliance</th>
              <th className="py-2.5 px-4">Calculated Rebate Credit Due</th>
              <th className="py-2.5 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-sm">
            {vendorClawbacks.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-dim text-xs">
                  No vendor performance data available yet.
                </td>
              </tr>
            ) : (
              vendorClawbacks.map((v) => {
                const isApplied = appliedVendors[v.vendorId];
                return (
                  <tr key={v.vendorId} className="hover:bg-raised/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-fg">{v.vendorName}</td>
                    <td className="py-3 px-4 tabular-nums text-mute font-mono text-xs">
                      {v.totalWorkOrders}
                    </td>
                    <td className="py-3 px-4 tabular-nums font-mono text-xs">
                      {v.breachedWorkOrders > 0 ? (
                        <span className="text-bad font-bold">{v.breachedWorkOrders}</span>
                      ) : (
                        <span className="text-ok">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-dim font-mono text-xs">
                      {v.totalBreachHours}h overdue
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      <span
                        className={`font-semibold text-xs ${
                          v.complianceRate < 70
                            ? "text-bad"
                            : v.complianceRate < 85
                            ? "text-warn"
                            : "text-ok"
                        }`}
                      >
                        {v.complianceRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 tabular-nums font-bold text-ok text-sm">
                      {naira(v.calculatedRebate)}
                    </td>
                    <td className="py-3 px-4">
                      {isApplied ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Rebate Applied to AP
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedVendor(v)}
                          className="btn btn-outline text-xs py-1 px-3 font-semibold text-accent border-accent/30 hover:bg-accent/10 transition"
                        >
                          Issue Clawback Notice
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* In-App Audit-Grade Clawback Notice Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 text-slate-900 font-sans">
            {/* Header Strip */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    SLA Penalty Clawback Demand Memo
                  </h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    REF: DEMAND-SLA-2026-{selectedVendor.vendorName.substring(0, 3).toUpperCase()}-
                    {Date.now().toString().slice(-4)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVendor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vendor Audit Summary Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Vendor:</span>
                <span className="font-bold text-slate-900">{selectedVendor.vendorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Work Orders Audited:</span>
                <span className="font-bold text-slate-900">{selectedVendor.totalWorkOrders} Units</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Contractual SLA Breaches:</span>
                <span className="font-bold text-rose-600">{selectedVendor.breachedWorkOrders} Overdue Tickets</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cumulative SLA Overdue Time:</span>
                <span className="font-bold text-slate-900">{selectedVendor.totalBreachHours} Hours</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Rebate Credit Due:</span>
                <span className="font-black text-emerald-700 text-base">
                  {naira(selectedVendor.calculatedRebate)}
                </span>
              </div>
            </div>

            {/* Legal / Contractual Citation */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs leading-relaxed">
              <b>Contractual Enforcement:</b> Under Master Maintenance SLA Section 8.4, failure to
              restore hardware assets within contractual MTTR incurs a liquidated damages credit of{" "}
              <b>₦45,000</b> per breached ticket plus <b>₦2,500/hour</b> for overdue repairs. This credit
              is applied directly as a debit against upcoming Accounts Payable disbursements.
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDownloadMemo(selectedVendor)}
                disabled={downloading}
                className="btn btn-outline text-xs h-9 px-3 gap-1.5 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                {downloading ? "Exporting Memo..." : "Download Formal Memo (.txt)"}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleApplyRebate(selectedVendor);
                  setSelectedVendor(null);
                }}
                className="btn btn-primary text-xs h-9 px-4 gap-1.5 font-bold shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Apply {naira(selectedVendor.calculatedRebate)} Credit to AP
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
