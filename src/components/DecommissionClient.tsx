"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./EntityForms";

export function NewDecommissionModal({
  assets,
}: {
  assets: { id: string; tag: string; make: string; model: string; serial: string | null }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [assetId, setAssetId] = useState("");
  const [wipeMethod, setWipeMethod] = useState("NIST 800-88 Rev 1 (Clear / 3-Pass Overwrite)");
  const [disposalVendor, setDisposalVendor] = useState("");
  const [salvageValue, setSalvageValue] = useState(0);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm("This will permanently mark the asset as RETIRED and issue a certified audit decommissioning record. Proceed?")) {
      return;
    }

    setBusy(true);
    setErr("");
    try {
      await api("/api/decommission", "POST", {
        assetId,
        wipeMethod,
        disposalVendor: disposalVendor || null,
        salvageValue: Number(salvageValue),
        notes,
      });
      setOpen(false);
      setAssetId("");
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-primary">
        + Issue Decommission Certificate
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 className="text-base font-semibold text-fg">
            Certified Hardware Decommissioning & Data Wipe
          </h2>
          <button onClick={() => setOpen(false)} className="text-dim hover:text-fg">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="label" htmlFor="dc-asset">
              Select Hardware Asset *
            </label>
            <select
              id="dc-asset"
              required
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="input font-mono text-xs"
            >
              <option value="">— Select active equipment to retire —</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.tag} &bull; {a.make} {a.model} {a.serial ? `(S/N: ${a.serial})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="dc-wipe">
              Data Sanitization / Destruction Protocol *
            </label>
            <select
              id="dc-wipe"
              required
              value={wipeMethod}
              onChange={(e) => setWipeMethod(e.target.value)}
              className="input"
            >
              <option value="NIST 800-88 Rev 1 (Clear / 3-Pass Overwrite)">
                NIST 800-88 Rev 1 (Clear / 3-Pass Overwrite)
              </option>
              <option value="NIST 800-88 Purge (Cryptographic Erase / Secure Erase)">
                NIST 800-88 Purge (Cryptographic Erase / Secure Erase)
              </option>
              <option value="DoD 5220.22-M (7-Pass Overwrite)">
                DoD 5220.22-M (7-Pass Overwrite)
              </option>
              <option value="Physical Drive Shredding / Degaussing (Destruction)">
                Physical Drive Shredding / Degaussing (Destruction)
              </option>
              <option value="Factory NVRAM Reset & Cryptographic Reset (Network Hardware)">
                Factory NVRAM Reset & Cryptographic Reset (Network Hardware)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="dc-vendor">
                Recycling / Disposal Vendor
              </label>
              <input
                id="dc-vendor"
                value={disposalVendor}
                onChange={(e) => setDisposalVendor(e.target.value)}
                placeholder="e.g. EcoWaste Recyclers"
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="dc-salvage">
                Salvage Recovery (₦)
              </label>
              <input
                id="dc-salvage"
                type="number"
                min={0}
                value={salvageValue}
                onChange={(e) => setSalvageValue(Number(e.target.value))}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="dc-notes">
              Witness / Audit Officer Notes
            </label>
            <textarea
              id="dc-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Drive wiped by ICT Security Officer, signed off by Internal Audit."
              className="input h-16"
            />
          </div>

          {err && (
            <div className="text-bad text-xs bg-bad/10 p-2 rounded border border-bad/30">
              {err}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn btn-ghost"
              disabled={busy}
            >
              Cancel
            </button>
            <button type="submit" disabled={busy} className="btn btn-primary">
              {busy ? "Certifying…" : "Certify Decommission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
