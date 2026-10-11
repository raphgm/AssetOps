import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader, Forbidden } from "@/components/ui";
import { DepartmentForm } from "@/components/EntityForms";

export default async function EditDepartment({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const s = await requireSession();
  if (!can(s.role, "department:write")) return <Forbidden what="department editing" />;
  const { id } = await params;

  const d = await db.department.findFirst({
    where: { id, orgId: s.orgId },
  });
  if (!d) notFound();

  return (
    <div>
      <PageHeader
        title={`Edit ${d.name}`}
        subtitle="Update department name or organizational unit."
      />
      <DepartmentForm initial={d} onDoneHref={`/app/departments/${id}`} />
    </div>
  );
}
