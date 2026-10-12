import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { getAIProvider } from "@/lib/ai/provider";
import { Badge, Card, PageHeader } from "@/components/ui";
import { InviteForm, UserRow, DirectorySyncControl } from "@/components/UsersAdmin";

export const dynamic = "force-dynamic";

export default async function Settings() {
  const s = await requireSession();
  const [org, users, depts] = await Promise.all([
    db.organization.findUniqueOrThrow({ where: { id: s.orgId } }),
    can(s.role, "user:manage")
      ? db.user.findMany({
          where: { orgId: s.orgId },
          orderBy: { name: "asc" },
          include: { department: true },
        })
      : [],
    db.department.findMany({ where: { orgId: s.orgId }, orderBy: { name: "asc" } }),
  ]);
  const ai = getAIProvider();

  return (
    <div className="max-w-5xl space-y-4 font-sans">
      <PageHeader title="Settings" />

      {/* Organisation Overview Card */}
      <Card title="Organisation">
        <dl className="grid grid-cols-[160px_1fr] gap-y-2 text-sm">
          <dt className="text-slate-500 font-medium">Organization</dt>
          <dd className="font-bold text-slate-950">{org.name}</dd>
          <dt className="text-slate-500 font-medium">Subscription Tier</dt>
          <dd>
            <Badge tone="accent">{org.plan}</Badge>{" "}
            <span className="text-slate-500 text-xs ml-2">
              Free · Professional · Enterprise tiers supported by tenant model.
            </span>
          </dd>
          <dt className="text-slate-500 font-medium">Your Role</dt>
          <dd className="capitalize font-bold text-cyan-950">
            {s.role.replace("_", " ").toLowerCase()}
          </dd>
        </dl>
      </Card>

      {/* AI Intelligence Provider */}
      <Card title="AssetOps Intelligence Engine">
        <div className="text-sm">
          <p>
            Provider: <b className="text-slate-950">{ai.name}</b> —{" "}
            {ai.available() ? (
              <Badge tone="ok">Configured</Badge>
            ) : (
              <Badge tone="warn">Not configured</Badge>
            )}
          </p>
          <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
            {ai.available()
              ? "Investigations use the configured model with evidence-only prompts."
              : "Set GROQ_API_KEY and GROQ_MODEL on the server to enable AI analysis. Deterministic analytics, evidence gathering and all core features work without it."}{" "}
            Secrets stay server-side and are never sent to the browser.
          </p>
        </div>
      </Card>

      {/* Team & Active Directory / Entra ID Identity Management */}
      {can(s.role, "user:manage") && (
        <Card title="Team & Identity Governance">
          {/* Active Directory & Microsoft Entra ID Sync Suite */}
          <DirectorySyncControl />

          {/* User Directory Table */}
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-950 text-sm">Enterprise Accounts ({users.length})</h4>
                <p className="text-xs text-slate-500">
                  Provisioned via Microsoft Entra ID (Azure AD), SCIM 2.0, or local break-glass.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Identity</th>
                    <th className="py-2.5 px-3">Directory Source</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Role & Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {users.map((u) => {
                    const isEntraSynced = u.email.includes("onmicrosoft.com") || u.email.includes("contoso");
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-950">{u.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{u.email}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          {isEntraSynced ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                              Entra ID Synced
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Local Account
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {u.department?.name ? (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-medium">
                              {u.department.name}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold ${
                              u.active
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.active ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            {u.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <UserRow id={u.id} role={u.role} active={u.active} self={u.id === s.userId} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Manual user creation as emergency fallback */}
            <div className="pt-2">
              <InviteForm depts={depts} />
            </div>
          </div>
        </Card>
      )}

      {/* Data & Retention Card */}
      <Card title="Data & retention">
        <p className="text-slate-600 text-sm leading-relaxed">
          Maintenance records and audit entries are immutable and retained indefinitely by default.
          Export any dataset from{" "}
          <a className="font-bold text-cyan-800 underline hover:text-cyan-900" href="/app/reports">
            Reports
          </a>
          . Configurable retention windows are planned.
        </p>
      </Card>
    </div>
  );
}
