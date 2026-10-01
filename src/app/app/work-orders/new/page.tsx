import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { lookups } from "@/lib/lookups";
import { assetScope } from "@/lib/services/assets";
import { PageHeader, Forbidden } from "@/components/ui";
import { WorkOrderForm } from "@/components/forms";

export default async function NewWorkOrder({ searchParams }: { searchParams: Promise<{ asset?: string; report?: string; fleet?: string; category?: string }> }) {
  const s = await requireSession();
  if (!can(s.role, "issue:report")) return <Forbidden what="work orders" />;
  const sp = await searchParams; const l = await lookups(s.orgId);
  const report = sp.report === "1" || !can(s.role, "workorder:create");
  const fixed = sp.asset ? await db.asset.findFirst({ where: assetScope(s, { id: sp.asset }) }) : null;
  let fleet: { assetIds: string[]; key: string; title: string } | undefined;
  if (sp.fleet && sp.category && can(s.role, "workorder:assign")) {
    const cat = await db.maintenanceCategory.findFirst({ where: { id: sp.category, orgId: s.orgId } });
    if (cat) {
      const ids = await db.maintenanceRecord.findMany({ where: { orgId: s.orgId, categoryId: cat.id, performedAt: { gte: new Date(Date.now() - 30 * 864e5) } }, distinct: ["assetId"], select: { assetId: true } });
      fleet = { assetIds: ids.map((i) => i.assetId), key: `fleet-${cat.name.toLowerCase().replace(/\W+/g, "-")}-${new Date().toISOString().slice(0, 10)}`, title: `Fleet inspection: ${cat.name.toLowerCase()} failures` };
    }
  }
  const assets = fixed || fleet ? [] : (await db.asset.findMany({ where: assetScope(s), orderBy: { tag: "asc" }, take: 500, select: { id: true, tag: true, model: true } })).map((a) => ({ id: a.id, name: `${a.tag} · ${a.model}` }));
  return <div><PageHeader title={fleet ? "Create fleet inspection" : report ? "Report an issue" : "New work order"} subtitle={fleet ? "Review the scope below. Work orders are created only when you confirm." : undefined} />
    <WorkOrderForm assets={assets} cats={l.cats} techs={l.techs} vendors={l.vendors} report={report} fleet={fleet} fixedAsset={fixed ? { id: fixed.id, label: `${fixed.tag} — ${fixed.make} ${fixed.model}` } : undefined} /></div>;
}
