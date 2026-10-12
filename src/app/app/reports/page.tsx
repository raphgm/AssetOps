import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { REPORTS } from "@/lib/services/reports";
import { Card, Forbidden, PageHeader } from "@/components/ui";
import { FileSpreadsheet, FileText, Download, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Reports() {
  const s = await requireSession();
  if (!can(s.role, "report:read")) return <Forbidden what="reports" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compliance & Audit Reports"
        subtitle="One-click audit packs for statutory accounting, external auditors, ISO 27001, and FinOps governance."
        actions={
          <a
            href="/api/reports/focus"
            className="btn btn-primary text-xs flex items-center gap-1.5"
            download
          >
            <Download className="h-4 w-4" />
            1-Click FOCUS™ Audit Pack
          </a>
        }
      />

      {/* Compliance Certification Banner */}
      <div className="card p-4 border border-line bg-surface/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-ok/10 border border-ok/30 text-ok">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-fg">Statutory & External Audit Ready</div>
            <div className="text-xs text-dim">
              All records include immutable timestamps, depreciation schedules, chain of custody, and Linux Foundation FOCUS v1.0 cost schemas.
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/reports/asset-register?format=excel"
            className="btn btn-ghost text-xs border border-line flex items-center gap-1"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-ok" />
            Full Fixed Asset Register (.xlsx)
          </a>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(REPORTS)
          .filter(([, r]) => can(s.role, r.perm))
          .map(([k, r]) => (
            <Card key={k} title={r.title} className="flex flex-col justify-between">
              <p className="text-xs text-dim mb-4">
                {k === "asset-register"
                  ? "Complete fleet register with serials, status, health score, and warranty periods."
                  : k === "finops-focus"
                  ? "Standardized Linux Foundation FOCUS v1.0 cost dataset for FinOps ingestion."
                  : k === "lifecycle"
                  ? "Actuarial asset wear-out curves and replacement capital forecasts."
                  : k === "vendor"
                  ? "SLA breach tracking, average resolution hours, and contract penalty recovery."
                  : k === "cost"
                  ? "Cumulative maintenance cost breakdown by hardware failure category."
                  : k === "department"
                  ? "Departmental showback, asset density, and repeat failure metrics."
                  : k === "risk"
                  ? "High-risk assets requiring immediate preventative intervention."
                  : "Immutable operational audit log of all system changes and user actions."}
              </p>

              <div className="pt-3 border-t border-line flex flex-wrap items-center gap-2">
                <a
                  className="btn btn-ghost text-xs py-1 px-2.5 border border-line flex items-center gap-1"
                  href={`/api/reports/${k}?format=excel`}
                  title="Download Microsoft Excel spreadsheet"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-ok" />
                  Excel
                </a>
                <a
                  className="btn btn-ghost text-xs py-1 px-2.5 border border-line"
                  href={`/api/reports/${k}`}
                  title="Download standard CSV"
                >
                  CSV
                </a>
                <Link
                  className="btn btn-ghost text-xs py-1 px-2.5 border border-line flex items-center gap-1 text-accent ml-auto"
                  href={`/app/reports/${k}`}
                  title="Print or export as PDF"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Print / PDF
                </Link>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
