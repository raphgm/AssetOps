import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { assetByToken } from "@/lib/services/qr";
import { Logo, Status, Forbidden } from "@/components/ui";
import { fmtDate, naira } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function ScanPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = await getSession();
  if (!s) redirect(`/sign-in`);
  const a = await assetByToken(token);
  // Tenant isolation: a token from another organisation is indistinguishable from an unknown one.
  if (!a || a.orgId !== s.orgId || (s.role === "DEPARTMENT_USER" && a.departmentId !== s.departmentId)) return <main className="min-h-screen grid place-items-center p-4"><Forbidden what="this asset" /></main>;
  const [mine, last] = await Promise.all([
    db.workOrder.findMany({ where: { assetId: a.id, status: { in: ["ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"] }, ...(s.role === "TECHNICIAN" ? { assigneeId: s.userId } : {}) }, orderBy: { dueAt: "asc" }, take: 3 }),
    db.maintenanceRecord.findFirst({ where: { assetId: a.id }, orderBy: { performedAt: "desc" }, include: { category: true } }),
  ]);
  return (
    <main className="min-h-screen max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-6"><Link href="/app"><Logo /></Link><span className="eyebrow">Scan</span></div>
      <div className="card p-5 animate-rise">
        <div className="font-mono text-lg">{a.tag}</div><div className="mt-0.5">{a.make} {a.model}</div><div className="text-mute text-xs">{a.department.name} · {a.location.name}</div>
        <div className="mt-3"><Status value={a.status} /></div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center"><div className="card py-2"><div className="text-lg font-semibold">{a.healthScore}</div><div className="text-[10px] uppercase text-dim">Health</div></div><div className="card py-2"><div className="text-lg font-semibold">{a.maintenanceCount}</div><div className="text-[10px] uppercase text-dim">Events</div></div><div className="card py-2"><div className="text-lg font-semibold">{naira(a.lifetimeCost)}</div><div className="text-[10px] uppercase text-dim">Cost</div></div></div>
        {last && <p className="text-xs text-mute mt-3">Last: {last.category.name} on {fmtDate(last.performedAt)}</p>}
      </div>
      <div className="mt-3 space-y-2">
        {mine.map((w) => <Link key={w.id} href={`/app/work-orders/${w.id}`} className="btn btn-accent w-full h-12">{w.status === "ASSIGNED" ? "Start" : "Continue"} WO-{w.number} · {w.title.slice(0, 28)}</Link>)}
        {can(s.role, "issue:report") && <Link href={`/app/work-orders/new?asset=${a.id}&report=1`} className="btn w-full h-12">Report issue</Link>}
        {can(s.role, "maintenance:read") && <Link href={`/app/assets/${a.id}?tab=maintenance`} className="btn w-full h-12">Maintenance history</Link>}
        {can(s.role, "workorder:create") && <Link href={`/app/work-orders/new?asset=${a.id}`} className="btn w-full h-12">Start work order</Link>}
        {can(s.role, "maintenance:write") && <Link href={`/app/maintenance/new?asset=${a.id}`} className="btn w-full h-12">Add maintenance</Link>}
        <Link href={`/app/assets/${a.id}`} className="block text-center text-xs text-mute pt-2">Open full passport →</Link>
      </div>
    </main>
  );
}
