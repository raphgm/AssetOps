"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Users,
  Key,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { api } from "./forms";

const ROLES = [
  "SUPER_ADMIN",
  "ICT_DIRECTOR",
  "ICT_MANAGER",
  "TECHNICIAN",
  "DEPARTMENT_USER",
  "AUDITOR",
];

interface DirectoryMetrics {
  status: string;
  tenantDomain: string;
  tenantId: string;
  identityProvider: string;
  syncProtocol: string;
  lastSyncedAt: string;
  autoSyncActive: boolean;
}

export function DirectorySyncControl({
  initialMetrics,
}: {
  initialMetrics?: DirectoryMetrics;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [copiedSCIM, setCopiedSCIM] = useState(false);

  const scimUrl = typeof window !== "undefined" ? `${window.location.origin}/api/scim/v2/Users` : "/api/scim/v2/Users";

  async function handleSync() {
    setLoading(true);
    setSyncStatus(null);
    setError(null);
    try {
      const res = await api("/api/directory/sync", "POST", {});
      setSyncStatus(
        res.message || `Successfully synced ${res.result?.syncedCount ?? "enterprise"} accounts from Microsoft Entra ID.`
      );
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sync from Microsoft Entra ID");
    } finally {
      setLoading(false);
    }
  }

  function copySCIMEndpoint() {
    navigator.clipboard.writeText(scimUrl);
    setCopiedSCIM(true);
    setTimeout(() => setCopiedSCIM(false), 2000);
  }

  return (
    <div className="rounded-2xl border-2 border-cyan-200/80 bg-gradient-to-br from-cyan-50/60 via-white to-slate-50 p-5 shadow-sm space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-100 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-md shadow-cyan-600/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-slate-950">
                Microsoft Entra ID & Active Directory Sync
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Directory Connected
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Automated identity governance & SCIM 2.0 user provisioning via{" "}
              <span className="font-bold text-cyan-950">contoso.onmicrosoft.com</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="btn btn-outline text-xs h-9 px-3 gap-1.5 font-bold"
          >
            <Key className="w-3.5 h-3.5 text-slate-500" />
            {showConfig ? "Hide Config" : "SCIM & Tenant Setup"}
          </button>
          <button
            type="button"
            onClick={handleSync}
            disabled={loading}
            className="btn btn-primary text-xs h-9 px-4 gap-2 font-bold shadow-md shadow-cyan-500/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Synchronizing Entra ID..." : "Sync Users from Entra ID"}
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-mono flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            {syncStatus}
          </span>
          <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
            Just Now
          </span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Directory Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Tenant Domain</div>
          <div className="font-bold text-slate-900 mt-0.5 truncate">contoso.onmicrosoft.com</div>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Protocol</div>
          <div className="font-bold text-slate-900 mt-0.5">MS Graph v1.0 + SCIM</div>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Auto-Sync Cadence</div>
          <div className="font-bold text-emerald-700 mt-0.5">Every 15 min (Active)</div>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Last Sync Check</div>
          <div className="font-bold text-slate-900 mt-0.5">Automated</div>
        </div>
      </div>

      {/* Collapsible SCIM & Entra ID Configuration Card */}
      {showConfig && (
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 text-xs font-mono space-y-3 mt-2">
          <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              MICROSOFT ENTRA ID & SCIM 2.0 PROVISIONING CREDENTIALS
            </span>
            <span className="text-slate-400">RFC 7644 Standard</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase">SCIM 2.0 Tenant Endpoint URL</label>
              <div className="flex items-center gap-1.5">
                <input
                  readOnly
                  value={scimUrl}
                  className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={copySCIMEndpoint}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Copy SCIM URL"
                >
                  {copiedSCIM ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase">Directory Tenant ID</label>
              <input
                readOnly
                value="8f72a4e1-6d9b-4c20-a815-e23f091bc8d1"
                className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono"
              />
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-center justify-between">
            <span>
              <b>RBAC Policy:</b> Active Directory groups automatically bind to AssetOps roles (e.g.{" "}
              <code className="text-cyan-300">SG-AssetOps-Techs</code> → <code className="text-cyan-300">TECHNICIAN</code>).
            </span>
            <span className="text-emerald-400 font-bold">Auto-Enforced</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function InviteForm({ depts }: { depts: { id: string; name: string }[] }) {
  const r = useRouter();
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [pw, setPw] = useState("");

  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setPw("");
    const f = e.currentTarget;
    try {
      const d = await api("/api/users", "POST", Object.fromEntries(new FormData(f)));
      setPw(d.tempPassword);
      f.reset();
      r.refresh();
    } catch (x) {
      setErr((x as Error).message);
    }
  }

  return (
    <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-bold text-slate-800 text-xs">Manual Local Account Creation</span>
          <span className="text-slate-500 text-[11px] ml-2">
            (Emergency break-glass bypass / contractor accounts outside Entra ID)
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="btn btn-outline text-xs h-7 px-2.5 gap-1 font-bold"
        >
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {open ? "Collapse Form" : "+ Add Local Account"}
        </button>
      </div>

      {open && (
        <form onSubmit={go} className="grid sm:grid-cols-5 gap-2 items-end mt-3 pt-3 border-t border-slate-200">
          <div>
            <label className="label text-[11px]" htmlFor="u-name">
              Name
            </label>
            <input id="u-name" name="name" className="input text-xs h-8" required />
          </div>
          <div>
            <label className="label text-[11px]" htmlFor="u-email">
              Email
            </label>
            <input id="u-email" name="email" type="email" className="input text-xs h-8" required />
          </div>
          <div>
            <label className="label text-[11px]" htmlFor="u-role">
              Role
            </label>
            <select id="u-role" name="role" className="input text-xs h-8" defaultValue="TECHNICIAN">
              {ROLES.map((x) => (
                <option key={x} value={x}>
                  {x.replace("_", " ").toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label text-[11px]" htmlFor="u-dept">
              Department
            </label>
            <select id="u-dept" name="departmentId" className="input text-xs h-8">
              <option value="">—</option>
              {depts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary text-xs h-8">Add Local User</button>
          {err && <p role="alert" className="text-bad text-xs sm:col-span-5">{err}</p>}
          {pw && (
            <p role="status" className="text-xs sm:col-span-5 text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200">
              Temporary password (shown once):{" "}
              <code className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold">
                {pw}
              </code>
            </p>
          )}
        </form>
      )}
    </div>
  );
}

export function UserRow({
  id,
  role,
  active,
  self,
}: {
  id: string;
  role: string;
  active: boolean;
  self: boolean;
}) {
  const r = useRouter();
  const [err, setErr] = useState("");

  async function patch(b: object) {
    setErr("");
    try {
      await api(`/api/users/${id}`, "PATCH", b);
      r.refresh();
    } catch (x) {
      setErr((x as Error).message);
    }
  }

  if (self) return <span className="text-dim text-xs font-mono font-bold">(You)</span>;

  return (
    <span className="flex items-center gap-2">
      <select
        aria-label="Role"
        className="input h-7 w-36 text-xs font-medium"
        defaultValue={role}
        onChange={(e) => patch({ role: e.target.value })}
      >
        {ROLES.map((x) => (
          <option key={x} value={x}>
            {x.replace("_", " ").toLowerCase()}
          </option>
        ))}
      </select>
      <button
        className={`btn h-7 text-xs px-2.5 font-bold ${
          active ? "btn-outline text-slate-700" : "btn-primary bg-emerald-600 text-white"
        }`}
        onClick={() => patch({ active: !active })}
      >
        {active ? "Deactivate" : "Activate"}
      </button>
      {err && <span role="alert" className="text-bad text-xs">{err}</span>}
    </span>
  );
}
