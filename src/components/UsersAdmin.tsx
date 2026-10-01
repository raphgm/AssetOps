"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./forms";

const ROLES = ["SUPER_ADMIN", "ICT_DIRECTOR", "ICT_MANAGER", "TECHNICIAN", "DEPARTMENT_USER", "AUDITOR"];
export function InviteForm({ depts }: { depts: { id: string; name: string }[] }) {
  const r = useRouter(); const [err, setErr] = useState(""); const [pw, setPw] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setErr(""); setPw(""); const f = e.currentTarget; try { const d = await api("/api/users", "POST", Object.fromEntries(new FormData(f))); setPw(d.tempPassword); f.reset(); r.refresh(); } catch (x) { setErr((x as Error).message); } }
  return <form onSubmit={go} className="grid sm:grid-cols-5 gap-2 items-end">
    <div><label className="label" htmlFor="u-name">Name</label><input id="u-name" name="name" className="input" required /></div><div><label className="label" htmlFor="u-email">Email</label><input id="u-email" name="email" type="email" className="input" required /></div>
    <div><label className="label" htmlFor="u-role">Role</label><select id="u-role" name="role" className="input" defaultValue="TECHNICIAN">{ROLES.map((x) => <option key={x} value={x}>{x.replace("_", " ").toLowerCase()}</option>)}</select></div>
    <div><label className="label" htmlFor="u-dept">Department</label><select id="u-dept" name="departmentId" className="input"><option value="">—</option>{depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div><button className="btn btn-primary">Add user</button>
    {err && <p role="alert" className="text-bad text-xs sm:col-span-5">{err}</p>}{pw && <p role="status" className="text-xs sm:col-span-5">Temporary password (shown once): <code className="font-mono bg-raised px-1.5 py-0.5 rounded">{pw}</code></p>}</form>;
}
export function UserRow({ id, role, active, self }: { id: string; role: string; active: boolean; self: boolean }) {
  const r = useRouter(); const [err, setErr] = useState("");
  async function patch(b: object) { setErr(""); try { await api(`/api/users/${id}`, "PATCH", b); r.refresh(); } catch (x) { setErr((x as Error).message); } }
  if (self) return <span className="text-dim text-xs">you</span>;
  return <span className="flex items-center gap-2"><select aria-label="Role" className="input h-7 w-40" defaultValue={role} onChange={(e) => patch({ role: e.target.value })}>{ROLES.map((x) => <option key={x} value={x}>{x.replace("_", " ").toLowerCase()}</option>)}</select><button className="btn h-7" onClick={() => patch({ active: !active })}>{active ? "Deactivate" : "Activate"}</button>{err && <span role="alert" className="text-bad text-xs">{err}</span>}</span>;
}
