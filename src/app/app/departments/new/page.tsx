import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader, Forbidden } from "@/components/ui";
import { DepartmentForm } from "@/components/EntityForms";

export default async function NewDepartment() {
  const s = await requireSession();
  if (!can(s.role, "department:write")) return <Forbidden what="department creation" />;

  return (
    <div>
      <PageHeader
        title="New department"
        subtitle="Add an organizational unit, branch team, or cost center."
      />
      <DepartmentForm />
    </div>
  );
}
