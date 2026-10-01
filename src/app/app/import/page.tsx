import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Card, Forbidden, PageHeader } from "@/components/ui";
import ImportWizard from "@/components/ImportWizard";
import { fmtDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function ImportPage() {
  const s = await requireSession();
  if (!can(s.role, "asset:import")) return <Forbidden what="the import center" />;
  const jobs = await db.importJob.findMany({ where: { orgId: s.orgId }, orderBy: { createdAt: "desc" }, take: 5 });
  return <div><PageHeader title="Import center" subtitle="Bring assets and maintenance history into one source of truth." actions={<Link className="btn" href="/app/data-quality">Data quality</Link>} /><ImportWizard />
    {jobs.length > 0 && <Card title="Recent imports" className="max-w-4xl mt-3" pad={false}><table className="w-full"><tbody>{jobs.map((j) => <tr key={j.id}><td className="td">{j.filename}</td><td className="td text-mute">{j.kind}</td><td className="td tabular-nums">{j.imported}/{j.total}</td><td className="td text-mute">{fmtDateTime(j.createdAt)}</td><td className="td"><a className="text-accent" href={`/api/import/${j.id}/errors`}>Errors</a></td></tr>)}</tbody></table></Card>}</div>;
}
