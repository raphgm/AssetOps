import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { REPORTS } from "@/lib/services/reports";
import { Card, Forbidden, PageHeader } from "@/components/ui";

export default async function Reports() {
  const s = await requireSession();
  if (!can(s.role, "report:read")) return <Forbidden what="reports" />;
  return <div><PageHeader title="Reports" subtitle="Export as CSV, or open a printable view and save as PDF." />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{Object.entries(REPORTS).filter(([, r]) => can(s.role, r.perm)).map(([k, r]) => <Card key={k} title={r.title}><div className="flex gap-2"><a className="btn" href={`/api/reports/${k}`}>CSV</a><Link className="btn" href={`/app/reports/${k}`}>Print / PDF</Link></div></Card>)}</div></div>;
}
