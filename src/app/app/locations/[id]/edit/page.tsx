import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader, Forbidden } from "@/components/ui";
import { LocationForm } from "@/components/EntityForms";

export default async function EditLocation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const s = await requireSession();
  if (!can(s.role, "location:write")) return <Forbidden what="location editing" />;
  const { id } = await params;

  const l = await db.location.findFirst({
    where: { id, orgId: s.orgId },
  });
  if (!l) notFound();

  return (
    <div>
      <PageHeader
        title={`Edit ${l.name}`}
        subtitle={`Update facility details and coordinates (${l.city})`}
      />
      <LocationForm initial={l} onDoneHref={`/app/locations/${id}`} />
    </div>
  );
}
