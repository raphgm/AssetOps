import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { refreshAlerts } from "@/lib/services/alerts";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import MarkRead from "@/components/MarkRead";
import { fmtDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function Notifications() {
  const s = await requireSession();
  await refreshAlerts(s.orgId);
  const rows = await db.notification.findMany({ where: { orgId: s.orgId }, orderBy: { at: "desc" }, take: 60 });
  return <div><PageHeader title="Notifications" actions={<MarkRead />} /><Card pad={false}>{rows.length === 0 ? <EmptyState title="All clear" body="Alerts for SLA breaches, expiring warranties and anomalies appear here." /> : <ul className="divide-y divide-line">{rows.map((n) => <li key={n.id}><Link href={n.href ?? "/app"} className="flex items-start gap-3 px-4 py-3 hover:bg-raised/50"><span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${n.readAt ? "bg-line2" : "bg-accent"}`} aria-label={n.readAt ? "read" : "unread"} /><span className="flex-1"><span className="block">{n.title}</span>{n.body && <span className="block text-mute text-xs">{n.body}</span>}</span><span className="text-dim text-xs">{fmtDateTime(n.at)}</span></Link></li>)}</ul>}</Card></div>;
}
