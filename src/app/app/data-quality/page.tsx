import Link from "next/link";
import { Prisma } from "@prisma/client";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Card, Forbidden, PageHeader, Stat } from "@/components/ui";
import { fmtDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function DataQuality() {
  const s = await requireSession();
  if (!can(s.role, "asset:import")) return <Forbidden what="data quality" />;
  const o = s.orgId;
  const [total, noSerial, dups, badDates, dupList, badList, records] = await Promise.all([
    db.asset.count({ where: { orgId: o, deletedAt: null } }),
    db.asset.count({ where: { orgId: o, deletedAt: null, OR: [{ serial: null }, { serial: "" }] } }),
    db.$queryRaw<{ n: bigint }[]>(Prisma.sql`SELECT COALESCE(SUM(c-1),0) n FROM (SELECT count(*) c FROM "Asset" WHERE "orgId"=${o} AND "deletedAt" IS NULL AND serial IS NOT NULL AND serial<>'' GROUP BY serial HAVING count(*)>1) x`),
    db.$queryRaw<{ n: bigint }[]>(Prisma.sql`SELECT count(*) n FROM "MaintenanceRecord" r JOIN "Asset" a ON a.id=r."assetId" WHERE r."orgId"=${o} AND (r."performedAt" < a."acquiredAt" OR r."performedAt" > now())`),
    db.$queryRaw<{ serial: string; tags: string[] }[]>(Prisma.sql`SELECT serial, array_agg(tag) tags FROM "Asset" WHERE "orgId"=${o} AND "deletedAt" IS NULL AND serial IS NOT NULL AND serial<>'' GROUP BY serial HAVING count(*)>1 ORDER BY serial LIMIT 15`),
    db.$queryRaw<{ id: string; tag: string; performedAt: Date; acquiredAt: Date; aid: string }[]>(Prisma.sql`SELECT r.id, a.tag, r."performedAt", a."acquiredAt", a.id aid FROM "MaintenanceRecord" r JOIN "Asset" a ON a.id=r."assetId" WHERE r."orgId"=${o} AND (r."performedAt" < a."acquiredAt" OR r."performedAt" > now()) ORDER BY r."performedAt" LIMIT 15`),
    db.maintenanceRecord.count({ where: { orgId: o } }),
  ]);
  const nDup = Number(dups[0].n), nBad = Number(badDates[0].n);
  const denom = Math.max(1, total * 2 + records);
  const score = Math.max(0, Math.round(100 - ((noSerial + nDup * 2 + nBad) / denom) * 100 * 3));
  return (
    <div><PageHeader title="Data quality" subtitle="Calculated live from your records. Fix issues at the source; history stays immutable." actions={<Link className="btn" href="/app/import">Import center</Link>} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-3"><Stat label="Overall" value={`${score}%`} tone={score >= 90 ? "ok" : "warn"} /><Stat label="Missing asset IDs" value={0} sub="asset ID is required" /><Stat label="Duplicate assets (serial)" value={nDup} tone={nDup ? "warn" : undefined} /><Stat label="Missing serial numbers" value={noSerial} href="/app/assets?noserial=1" tone={noSerial ? "warn" : undefined} /><Stat label="Invalid maintenance dates" value={nBad} tone={nBad ? "warn" : undefined} /></div>
      <div className="grid lg:grid-cols-2 gap-3">
        <Card title="Duplicate serial numbers" pad={false}>{dupList.length === 0 ? <p className="p-4 text-mute">No duplicates.</p> : <table className="w-full"><thead><tr><th className="th">Serial</th><th className="th">Assets</th></tr></thead><tbody>{dupList.map((d) => <tr key={d.serial}><td className="td font-mono text-xs">{d.serial}</td><td className="td font-mono text-xs">{d.tags.join(", ")}</td></tr>)}</tbody></table>}<p className="p-3 text-xs text-dim border-t border-line">Remediation: confirm which record is correct, then retire or correct the duplicate asset.</p></Card>
        <Card title="Maintenance dates outside asset lifetime" pad={false}>{badList.length === 0 ? <p className="p-4 text-mute">No invalid dates.</p> : <table className="w-full"><thead><tr><th className="th">Asset</th><th className="th">Record date</th><th className="th">Acquired</th></tr></thead><tbody>{badList.map((b) => <tr key={b.id}><td className="td font-mono text-xs"><Link className="hover:text-accent" href={`/app/assets/${b.aid}?tab=maintenance`}>{b.tag}</Link></td><td className="td text-warn">{fmtDate(b.performedAt)}</td><td className="td text-mute">{fmtDate(b.acquiredAt)}</td></tr>)}</tbody></table>}<p className="p-3 text-xs text-dim border-t border-line">Remediation: correct the asset&apos;s acquisition date, or add a corrective record. Original records are never edited.</p></Card>
      </div></div>
  );
}
