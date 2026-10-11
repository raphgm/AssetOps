import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader, Forbidden } from "@/components/ui";
import { VendorForm } from "@/components/EntityForms";

export default async function EditVendor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const s = await requireSession();
  if (!can(s.role, "vendor:write")) return <Forbidden what="vendor editing" />;
  const { id } = await params;

  const v = await db.vendor.findFirst({
    where: { id, orgId: s.orgId },
  });
  if (!v) notFound();

  return (
    <div>
      <PageHeader
        title={`Edit ${v.name}`}
        subtitle="Update vendor contract SLA and contact details."
      />
      <VendorForm initial={v} onDoneHref={`/app/vendors/${id}`} />
    </div>
  );
}
