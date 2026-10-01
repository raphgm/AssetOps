import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/provider";
import { Badge, Card, PageHeader } from "@/components/ui";
import { InviteForm, UserRow } from "@/components/UsersAdmin";

export const dynamic = "force-dynamic";
export default async function Settings() {
  const s = await requireSession();
  const [org, users, depts] = await Promise.all([db.organization.findUniqueOrThrow({ where: { id: s.orgId } }), can(s.role, "user:manage") ? db.user.findMany({ where: { orgId: s.orgId }, orderBy: { name: "asc" }, include: { department: true } }) : [], db.department.findMany({ where: { orgId: s.orgId }, orderBy: { name: "asc" } })]);
  const ai = getAIProvider();
  return (
    <div className="max-w-4xl space-y-3"><PageHeader title="Settings" />
      <Card title="Organisation"><dl className="grid grid-cols-[140px_1fr] gap-y-1.5"><dt className="text-dim">Name</dt><dd>{org.name}</dd><dt className="text-dim">Plan</dt><dd><Badge tone="accent">{org.plan}</Badge> <span className="text-dim text-xs">Free · Professional · Enterprise tiers are supported by the tenant model; billing is not enabled yet.</span></dd><dt className="text-dim">Your role</dt><dd className="capitalize">{s.role.replace("_", " ").toLowerCase()}</dd></dl></Card>
      <Card title="AssetOps Intelligence"><p>Provider: <b>{ai.name}</b> — {ai.available() ? <Badge tone="ok">configured</Badge> : <Badge tone="warn">not configured</Badge>}</p><p className="text-mute text-xs mt-1">{ai.available() ? "Investigations use the configured model with evidence-only prompts." : "Set GROQ_API_KEY and GROQ_MODEL on the server to enable AI analysis. Deterministic analytics, evidence gathering and all core features work without it."} Secrets stay server-side and are never sent to the browser.</p></Card>
      {can(s.role, "user:manage") && <Card title="Team"><InviteForm depts={depts} /><div className="overflow-x-auto mt-4"><table className="w-full"><thead><tr><th className="th">Name</th><th className="th">Email</th><th className="th">Department</th><th className="th">Status</th><th className="th">Role</th></tr></thead><tbody>{users.map((u) => <tr key={u.id}><td className="td">{u.name}</td><td className="td text-mute">{u.email}</td><td className="td">{u.department?.name ?? "—"}</td><td className="td">{u.active ? "Active" : "Inactive"}</td><td className="td"><UserRow id={u.id} role={u.role} active={u.active} self={u.id === s.userId} /></td></tr>)}</tbody></table></div></Card>}
      <Card title="Data & retention"><p className="text-mute">Maintenance records and audit entries are immutable and retained indefinitely by default. Export any dataset from <a className="underline" href="/app/reports">Reports</a>. Configurable retention windows are planned.</p></Card></div>
  );
}
