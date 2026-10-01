import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { lookups } from "@/lib/lookups";
import { PageHeader, Forbidden } from "@/components/ui";
import { NewAssetForm } from "@/components/forms";

export default async function NewAsset() {
  const s = await requireSession();
  if (!can(s.role, "asset:write")) return <Forbidden what="asset creation" />;
  const l = await lookups(s.orgId);
  return <div><PageHeader title="New asset" subtitle="A QR code and maintenance passport are created automatically." /><NewAssetForm types={l.types} depts={l.depts} locs={l.locs} vendors={l.vendors} /></div>;
}
