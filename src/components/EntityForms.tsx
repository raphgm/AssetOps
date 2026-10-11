"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapPinPicker from "./MapPinPicker";

export async function api(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(d.error ?? "Request failed");
  return d;
}

// -------------------------------------------------------------
// LOCATION FORM
// -------------------------------------------------------------
export function LocationForm({
  initial,
  onDoneHref = "/app/locations",
}: {
  initial?: {
    id: string;
    name: string;
    city: string;
    code: string;
    lat: number | null;
    lng: number | null;
  };
  onDoneHref?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({
    lat: initial?.lat ?? null,
    lng: initial?.lng ?? null,
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = Boolean(initial?.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    try {
      if (isEdit) {
        await api(`/api/locations/${initial!.id}`, "PATCH", {
          name,
          city,
          code: code || undefined,
          lat: coords.lat,
          lng: coords.lng,
        });
      } else {
        await api("/api/locations", "POST", {
          name,
          city,
          code: code || undefined,
          lat: coords.lat,
          lng: coords.lng,
        });
      }
      router.push(onDoneHref);
      router.refresh();
    } catch (err: any) {
      setErr(err.message);
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Are you sure you want to delete the location "${initial.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setErr("");
    try {
      await api(`/api/locations/${initial.id}`, "DELETE");
      router.push("/app/locations");
      router.refresh();
    } catch (err: any) {
      setErr(err.message);
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 max-w-2xl space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="loc-name">
            Location Name *
          </label>
          <input
            id="loc-name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!isEdit && !code && e.target.value.length >= 3) {
                setCode(e.target.value.slice(0, 3).toUpperCase());
              }
            }}
            placeholder="e.g. Lagos HQ / Victoria Island Branch"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="loc-city">
            City / Region *
          </label>
          <input
            id="loc-city"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Lagos, Abuja, Port Harcourt"
            className="input"
          />
        </div>
      </div>

      <div className="w-full sm:w-1/2">
        <label className="label" htmlFor="loc-code">
          Facility Code
        </label>
        <input
          id="loc-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. LAG, ABJ, PHC"
          className="input font-mono uppercase"
          maxLength={6}
        />
        <p className="text-[11px] text-dim mt-1">
          Used in asset barcodes and serial number prefixes.
        </p>
      </div>

      <div className="pt-2 border-t border-line">
        <label className="label mb-2">Geographic Coordinates (Pin Drop)</label>
        <MapPinPicker
          initialLat={coords.lat}
          initialLng={coords.lng}
          onLocationChange={(lat, lng) => setCoords({ lat, lng })}
          heightClass="h-[280px]"
        />
      </div>

      {err && (
        <div role="alert" className="p-2.5 rounded bg-bad/10 border border-bad/30 text-bad text-xs">
          {err}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-line">
        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || busy}
            className="btn text-bad border-bad/30 hover:bg-bad/10 text-xs"
          >
            {deleting ? "Deleting…" : "Delete location"}
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-ghost"
            disabled={busy || deleting}
          >
            Cancel
          </button>
          <button type="submit" disabled={busy || deleting} className="btn btn-primary">
            {busy ? "Saving…" : isEdit ? "Update location" : "Create location"}
          </button>
        </div>
      </div>
    </form>
  );
}

// -------------------------------------------------------------
// DEPARTMENT FORM
// -------------------------------------------------------------
export function DepartmentForm({
  initial,
  onDoneHref = "/app/departments",
}: {
  initial?: { id: string; name: string };
  onDoneHref?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = Boolean(initial?.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    try {
      if (isEdit) {
        await api(`/api/departments/${initial!.id}`, "PATCH", { name });
      } else {
        await api("/api/departments", "POST", { name });
      }
      router.push(onDoneHref);
      router.refresh();
    } catch (err: any) {
      setErr(err.message);
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Are you sure you want to delete "${initial.name}"?`)) return;

    setDeleting(true);
    setErr("");
    try {
      await api(`/api/departments/${initial.id}`, "DELETE");
      router.push("/app/departments");
      router.refresh();
    } catch (err: any) {
      setErr(err.message);
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 max-w-lg space-y-4">
      <div>
        <label className="label" htmlFor="dept-name">
          Department Name *
        </label>
        <input
          id="dept-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Information Technology, Operations, Legal"
          className="input"
        />
      </div>

      {err && (
        <div role="alert" className="p-2.5 rounded bg-bad/10 border border-bad/30 text-bad text-xs">
          {err}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-line">
        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || busy}
            className="btn text-bad border-bad/30 hover:bg-bad/10 text-xs"
          >
            {deleting ? "Deleting…" : "Delete department"}
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-ghost"
            disabled={busy || deleting}
          >
            Cancel
          </button>
          <button type="submit" disabled={busy || deleting} className="btn btn-primary">
            {busy ? "Saving…" : isEdit ? "Update department" : "Create department"}
          </button>
        </div>
      </div>
    </form>
  );
}

// -------------------------------------------------------------
// VENDOR FORM
// -------------------------------------------------------------
export function VendorForm({
  initial,
  onDoneHref = "/app/vendors",
}: {
  initial?: { id: string; name: string; slaHours: number; email?: string | null };
  onDoneHref?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slaHours, setSlaHours] = useState(initial?.slaHours ?? 24);
  const [email, setEmail] = useState(initial?.email ?? "");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = Boolean(initial?.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    try {
      if (isEdit) {
        await api(`/api/vendors/${initial!.id}`, "PATCH", {
          name,
          slaHours: Number(slaHours),
          email: email || null,
        });
      } else {
        await api("/api/vendors", "POST", {
          name,
          slaHours: Number(slaHours),
          email: email || undefined,
        });
      }
      router.push(onDoneHref);
      router.refresh();
    } catch (err: any) {
      setErr(err.message);
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Are you sure you want to delete vendor "${initial.name}"?`)) return;

    setDeleting(true);
    setErr("");
    try {
      await api(`/api/vendors/${initial.id}`, "DELETE");
      router.push("/app/vendors");
      router.refresh();
    } catch (err: any) {
      setErr(err.message);
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 max-w-lg space-y-4">
      <div>
        <label className="label" htmlFor="vendor-name">
          Vendor Name *
        </label>
        <input
          id="vendor-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Cisco Systems, Dell Technologies, Apex NetServe"
          className="input"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="vendor-sla">
            Target SLA (Hours) *
          </label>
          <input
            id="vendor-sla"
            type="number"
            min={1}
            required
            value={slaHours}
            onChange={(e) => setSlaHours(parseInt(e.target.value) || 24)}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="vendor-email">
            Support Email
          </label>
          <input
            id="vendor-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="support@vendor.com"
            className="input"
          />
        </div>
      </div>

      {err && (
        <div role="alert" className="p-2.5 rounded bg-bad/10 border border-bad/30 text-bad text-xs">
          {err}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-line">
        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || busy}
            className="btn text-bad border-bad/30 hover:bg-bad/10 text-xs"
          >
            {deleting ? "Deleting…" : "Delete vendor"}
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-ghost"
            disabled={busy || deleting}
          >
            Cancel
          </button>
          <button type="submit" disabled={busy || deleting} className="btn btn-primary">
            {busy ? "Saving…" : isEdit ? "Update vendor" : "Create vendor"}
          </button>
        </div>
      </div>
    </form>
  );
}
