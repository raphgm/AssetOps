import Link from "next/link";
import type { Prisma, WorkOrderStatus } from "@prisma/client";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Card, EmptyState, Forbidden, PageHeader, Pagination, Status } from "@/components/ui";
import { fmtDateTime, STATUS_LABEL } from "@/lib/utils";

export const dynamic = "force-dynamic";
const COLS: WorkOrderStatus[] = ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS", "RESOLVED", "VERIFIED", "CLOSED", "CANCELLED"];
const SIZE = 40;

export default async function WorkOrders({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const s = await requireSession();
  if (!can(s.role, "workorder:read")) return <Forbidden what="work orders" />;
  const sp = await searchParams; const view = sp.view === "table" ? "table" : "board"; const page = Math.max(1, Number(sp.page) || 1);
  const open = ["OPEN", "ASSIGNED", "IN_PROGRESS", "AWAITING_PARTS"] as WorkOrderStatus[];
  const base: Prisma.WorkOrderWhereInput = { orgId: s.orgId, ...(s.role === "TECHNICIAN" ? { assigneeId: s.userId } : {}), ...(s.role === "DEPARTMENT_USER" ? { asset: { departmentId: s.departmentId ?? "x" } } : {}),
    ...(sp.overdue ? { status: { in: open }, dueAt: { lt: new Date() } } : {}), ...(sp.fleet ? { fleetKey: sp.fleet } : {}), ...(sp.status ? { status: sp.status as WorkOrderStatus } : {}), ...(sp.q ? { OR: [{ title: { contains: sp.q, mode: "insensitive" } }, { asset: { tag: { contains: sp.q, mode: "insensitive" } } }] } : {}) };
  const include = { asset: { select: { tag: true } }, assignee: { select: { name: true } } };
  const counts = await db.workOrder.groupBy({ by: ["status"], where: base, _count: true });
  const cnt = (st: string) => counts.find((c) => c.status === st)?._count ?? 0;
  const total = counts.reduce((a, c) => a + c._count, 0);
  // Board: show latest 12 per active column (never loads thousands of cards); closed/cancelled live in the table view.
  const boardCols = COLS.slice(0, 5);
  const board = view === "board" ? await Promise.all(boardCols.map((st) => db.workOrder.findMany({ where: { ...base, status: st }, orderBy: [{ priority: "desc" }, { dueAt: "asc" }], take: 12, include }))) : [];
  const rows = view === "table" ? await db.workOrder.findMany({ where: base, orderBy: { createdAt: "desc" }, skip: (page - 1) * SIZE, take: SIZE, include }) : [];
  const qs = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page" && k !== "view") as [string, string][]);
  return (
    <div>
      <PageHeader title="Work orders" subtitle={`${total.toLocaleString()} work orders${sp.overdue ? " past SLA" : ""}.`} actions={<>
        <div className="flex rounded-md border border-line2 overflow-hidden">{["board", "table"].map((v) => <Link key={v} href={`/app/work-orders?${qs}&view=${v}`} aria-current={view === v} className={`px-3 h-8 grid place-items-center text-[13px] capitalize ${view === v ? "bg-raised" : "text-mute"}`}>{v}</Link>)}</div>
        {can(s.role, "issue:report") && <Link className="btn btn-primary" href="/app/work-orders/new">{can(s.role, "workorder:create") ? "New work order" : "Report issue"}</Link>}
      </>} />
      <form className="flex gap-2 mb-3 flex-wrap" action="/app/work-orders"><input type="hidden" name="view" value={view} /><input name="q" defaultValue={sp.q} placeholder="Search title or asset ID" aria-label="Search" className="input max-w-xs" />
        <select name="status" aria-label="Status" defaultValue={sp.status ?? ""} className="input w-44"><option value="">All statuses</option>{COLS.map((c) => <option key={c} value={c}>{STATUS_LABEL[c]}</option>)}</select>
        <label className="flex items-center gap-1.5 text-mute"><input type="checkbox" name="overdue" value="1" defaultChecked={!!sp.overdue} />Past SLA only</label><button className="btn">Filter</button></form>
      {total === 0 ? <Card><EmptyState title="No work orders" body="Nothing matches. Create a work order from an asset passport or report an issue." /></Card> :
        view === "board" ? (
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5 items-start">
            {boardCols.map((st, i) => (
              <section key={st} aria-label={STATUS_LABEL[st]} className="card p-2">
                <h2 className="flex items-center justify-between px-1.5 py-1 text-[12px]"><Status value={st} /><span className="text-dim tabular-nums">{cnt(st)}</span></h2>
                <ul className="space-y-1.5 mt-1">{board[i].length === 0 && <li className="text-dim text-xs px-2 py-4 text-center">Empty</li>}
                  {board[i].map((w) => { const late = w.dueAt < new Date() && open.includes(w.status); return (
                    <li key={w.id}><Link href={`/app/work-orders/${w.id}`} className="block rounded-md border border-line bg-raised/50 hover:border-line2 p-2.5">
                      <div className="flex justify-between text-xs"><span className="text-dim">WO-{w.number}</span><Status value={w.priority} /></div>
                      <div className="mt-1 line-clamp-2">{w.title}</div>
                      <div className="mt-1.5 flex justify-between text-xs text-dim"><span className="font-mono">{w.asset.tag}</span>{late && <span className="text-bad">Past SLA</span>}</div>
                      <div className="text-xs text-dim">{w.assignee?.name ?? "Unassigned"}</div></Link></li>); })}
                </ul>
                {cnt(st) > 12 && <Link href={`/app/work-orders?view=table&status=${st}`} className="block text-center text-xs text-mute py-2 hover:text-fg">View all {cnt(st)} →</Link>}
              </section>))}
            <p className="md:col-span-3 xl:col-span-5 text-xs text-dim">Verified ({cnt("VERIFIED")}), closed ({cnt("CLOSED")}) and cancelled ({cnt("CANCELLED")}) work orders are in the <Link className="underline" href="/app/work-orders?view=table">table view</Link>.</p>
          </div>
        ) : (
          <Card pad={false}><div className="overflow-x-auto"><table className="w-full"><caption className="sr-only">Work orders</caption><thead><tr><th className="th">#</th><th className="th">Title</th><th className="th">Asset</th><th className="th">Status</th><th className="th">Priority</th><th className="th">Assigned</th><th className="th">Created</th><th className="th">Due</th></tr></thead>
            <tbody>{rows.map((w) => <tr key={w.id} className="hover:bg-raised/50"><td className="td"><Link className="hover:text-accent" href={`/app/work-orders/${w.id}`}>WO-{w.number}</Link></td><td className="td max-w-xs truncate">{w.title}</td><td className="td font-mono text-xs">{w.asset.tag}</td><td className="td"><Status value={w.status} /></td><td className="td"><Status value={w.priority} /></td><td className="td">{w.assignee?.name ?? "—"}</td><td className="td text-mute">{fmtDateTime(w.createdAt)}</td><td className="td text-mute">{fmtDateTime(w.dueAt)}</td></tr>)}</tbody></table></div>
            <Pagination page={page} pages={Math.max(1, Math.ceil(total / SIZE))} base={`/app/work-orders?view=table&${qs}`} /></Card>)}
    </div>
  );
}
