import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { PageHeader, Forbidden } from "@/components/ui";
import { LocationForm } from "@/components/EntityForms";

export default async function NewLocation() {
  const s = await requireSession();
  if (!can(s.role, "location:write")) return <Forbidden what="location creation" />;

  return (
    <div>
      <PageHeader
        title="New location"
        subtitle="Add a physical site, office branch, campus or facility with geographic coordinates."
      />
      <LocationForm />
    </div>
  );
}
