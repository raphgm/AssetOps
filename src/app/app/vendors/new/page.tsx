import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader, Forbidden } from "@/components/ui";
import { VendorForm } from "@/components/EntityForms";

export default async function NewVendor() {
  const s = await requireSession();
  if (!can(s.role, "vendor:write")) return <Forbidden what="vendor creation" />;

  return (
    <div>
      <PageHeader
        title="New vendor"
        subtitle="Register an equipment manufacturer, maintenance contractor, or parts supplier."
      />
      <VendorForm />
    </div>
  );
}
