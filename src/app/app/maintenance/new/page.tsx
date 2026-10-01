import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { lookups } from "@/lib/lookups";
import { assetScope } from "@/lib/services/assets";
import { PageHeader, Forbidden } from "@/components/ui";
import { MaintenanceForm } from "@/components/forms";

export default async function NewRecord({ searchParams }: { searchParams: Promise<{ asset?: string }> }) {
  const s = await requireSession();
  if (!can(s.role, "maintenance:write")) return <Forbidden what="maintenance recording" />;
  const sp = await searchParams; const l = await lookups(s.orgId);
  const fixed = sp.asset ? await db.asset.findFirst({ where: assetScope(s, { id: sp.asset }) }) : null;
  const assets = fixed ? [] : (await db.asset.findMany({ where: assetScope(s), orderBy: { tag: "asc" }, take: 500, select: { id: true, tag: true, model: true } })).map((a) => ({ id: a.id, name: `${a.tag} · ${a.model}` }));
  return <div><PageHeader title="Record maintenance" subtitle="Creates an immutable record, then refreshes the asset's health, risk and analytics." />
    <MaintenanceForm assets={assets} fixed={fixed ? { id: fixed.id, label: `${fixed.tag} — ${fixed.make} ${fixed.model}` } : undefined} cats={l.cats} techs={l.techs} vendors={l.vendors} onDoneHref={fixed ? `/app/assets/${fixed.id}?tab=maintenance` : "/app/maintenance"} />
    {!fixed && <p className="text-xs text-dim mt-2 max-w-3xl">Showing the first 500 assets alphabetically. To record against a specific asset, open its passport or scan its QR code.</p>}</div>;
}
