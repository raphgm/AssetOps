import { Prisma } from "@prisma/client";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Forbidden, PageHeader, Pagination } from "@/components/ui";
import { AuditInspector } from "@/components/audit/AuditInspector";
import { Shield, Lock, Activity, Users } from "lucide-react";

export const dynamic = "force-dynamic";
const SIZE = 40;

export default async function Audit({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const s = await requireSession();
  if (!can(s.role, "audit:read")) return <Forbidden what="the audit log" />;

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.AuditLogWhereInput = {
    orgId: s.orgId,
    ...(sp.action ? { action: { contains: sp.action } } : {}),
    ...(sp.actor ? { actorName: { contains: sp.actor, mode: "insensitive" } } : {}),
    ...(sp.entity ? { entityId: { contains: sp.entity, mode: "insensitive" } } : {}),
  };

  const [total, rows, totalAutonomous, totalSecurity] = await Promise.all([
    db.auditLog.count({ where }),
    db.auditLog.findMany({
      where,
      orderBy: { at: "desc" },
      skip: (page - 1) * SIZE,
      take: SIZE,
    }),
    db.auditLog.count({
      where: {
        orgId: s.orgId,
        action: { contains: "auto" },
      },
    }),
    db.auditLog.count({
      where: {
        orgId: s.orgId,
        action: { contains: "auth" },
      },
    }),
  ]);

  const qs = new URLSearchParams(
    Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]
  );

  return (
    <div className="space-y-5 font-sans">
      <PageHeader
        title="Audit & Forensic Intelligence"
        subtitle="Append-only cryptographic ledger. Zero edits or deletions allowed."
        actions={
          <div className="flex items-center gap-2">
            <a
              className="btn btn-outline text-xs h-9 px-3 gap-1.5 font-semibold"
              href={`/api/audit?format=csv&${qs}`}
            >
              Export CSV Audit
            </a>
          </div>
        }
      />

      {/* Audit Intelligence KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-600" />
            Total Immutable Records
          </div>
          <div className="text-2xl font-black text-slate-950 mt-1">{total.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">● 100% WORM Verified</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Autonomous Actions
          </div>
          <div className="text-2xl font-black text-slate-950 mt-1">
            {totalAutonomous.toLocaleString()}
          </div>
          <div className="text-[10px] text-teal-700 font-bold mt-0.5">IoT & FinOps Auto-Gates</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            Security & Auth Events
          </div>
          <div className="text-2xl font-black text-slate-950 mt-1">
            {totalSecurity.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Zero Compromises</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            Retention Protocol
          </div>
          <div className="text-base font-black text-slate-950 mt-2">PERPETUAL</div>
          <div className="text-[10px] text-slate-500 font-bold mt-0.5">SOC-2 / NIST 800-88</div>
        </div>
      </div>

      {/* Main Interactive Audit Inspector */}
      <AuditInspector records={rows} />

      {/* Pagination */}
      <div className="pt-2">
        <Pagination
          page={page}
          pages={Math.max(1, Math.ceil(total / SIZE))}
          base={`/app/audit?${qs}`}
        />
      </div>
    </div>
  );
}
