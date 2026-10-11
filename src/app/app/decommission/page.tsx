import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Card, Forbidden, PageHeader, Source, Badge } from "@/components/ui";
import { naira } from "@/lib/utils";
import { NewDecommissionModal } from "@/components/DecommissionClient";

export const dynamic = "force-dynamic";

export default async function DecommissionPage() {
  const s = await requireSession();
  if (!can(s.role, "asset:read")) return <Forbidden what="decommissioning records" />;

  const [certs, availableAssets] = await Promise.all([
    db.decommissionCertificate.findMany({
      where: { orgId: s.orgId },
      include: { asset: { include: { type: true, location: true } } },
      orderBy: { certifiedAt: "desc" },
    }),
    db.asset.findMany({
      where: { orgId: s.orgId, status: { not: "RETIRED" }, deletedAt: null },
      select: { id: true, tag: true, make: true, model: true, serial: true },
      take: 100,
      orderBy: { tag: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hardware Decommissioning & Data-Wipe"
        subtitle="Certified chain-of-custody, NIST 800-88 sanitization verification, and statutory Board of Survey disposal audit."
        actions={
          can(s.role, "asset:write") ? (
            <NewDecommissionModal assets={availableAssets} />
          ) : null
        }
      />

      <Card pad={false} right={<Source kind="record" />}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Decommission certificates</caption>
            <thead>
              <tr>
                <th className="th">Certificate No.</th>
                <th className="th">Hardware Asset</th>
                <th className="th">Sanitization Protocol</th>
                <th className="th">Verified Officer</th>
                <th className="th">Disposal Vendor</th>
                <th className="th">Salvage Recovery</th>
                <th className="th">Certified Date</th>
              </tr>
            </thead>
            <tbody>
              {certs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="td text-center text-mute py-8">
                    No hardware decommissioning certificates issued yet. Click "+ Issue Decommission Certificate" to certify disposal of retired equipment.
                  </td>
                </tr>
              ) : (
                certs.map((c) => (
                  <tr key={c.id} className="hover:bg-raised/50">
                    <td className="td font-mono text-xs font-semibold text-accent">
                      {c.certificateNumber}
                    </td>
                    <td className="td">
                      <div className="font-medium text-fg">
                        <Link href={`/app/assets/${c.asset.id}`} className="hover:underline font-mono">
                          {c.asset.tag}
                        </Link>
                        {" • "}
                        {c.asset.make} {c.asset.model}
                      </div>
                      <div className="text-[11px] text-dim">
                        {c.asset.type.name} &bull; S/N: {c.asset.serial ?? "N/A"}
                      </div>
                    </td>
                    <td className="td text-xs">
                      <Badge tone="ok">{c.wipeMethod.split("(")[0].trim()}</Badge>
                      <div className="text-[10px] text-dim mt-0.5 max-w-xs truncate">
                        {c.wipeMethod}
                      </div>
                    </td>
                    <td className="td text-xs text-fg">{c.verifiedBy}</td>
                    <td className="td text-xs text-mute">
                      {c.disposalVendor ?? "In-house disposal"}
                    </td>
                    <td className="td tabular-nums text-xs font-medium text-ok">
                      {naira(c.salvageValue)}
                    </td>
                    <td className="td text-xs text-mute">
                      {new Date(c.certifiedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
