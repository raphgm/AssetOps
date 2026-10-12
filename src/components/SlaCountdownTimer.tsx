"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle, CheckCircle, Send, Check } from "lucide-react";

interface SlaTimerProps {
  workOrderId: string;
  status: string;
  priority: string;
  createdAt: string | Date;
  dueAt: string | Date;
  resolvedAt?: string | Date | null;
  slaHours: number;
  vendorName?: string | null;
  vendorEmail?: string | null;
}

export default function SlaCountdownTimer({
  workOrderId,
  status,
  priority,
  createdAt,
  dueAt,
  resolvedAt,
  slaHours,
  vendorName,
  vendorEmail,
}: SlaTimerProps) {
  const [now, setNow] = useState(Date.now());
  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState("");

  // Live timer tick every 1000ms
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dueTime = new Date(dueAt).getTime();
  const createTime = new Date(createdAt).getTime();
  const resolveTime = resolvedAt ? new Date(resolvedAt).getTime() : null;
  const isResolved = Boolean(resolveTime) || ["RESOLVED", "CLOSED"].includes(status);

  // Time elapsed and total window
  const totalWindowMs = Math.max(1, dueTime - createTime);

  // Format ms to human readable
  const formatDuration = (ms: number) => {
    const absMs = Math.abs(ms);
    const hrs = Math.floor(absMs / (1000 * 60 * 60));
    const mins = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((absMs % (1000 * 60)) / 1000);
    return `${hrs}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
  };

  const handleNotifyVendor = async () => {
    if (!vendorName) return;
    setNotifying(true);
    setNotifyMsg("");
    try {
      const res = await fetch(`/api/work-orders/${workOrderId}/notify-vendor`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send notice");
      setNotified(true);
      setNotifyMsg(`SLA dispatch notification sent to ${vendorEmail || vendorName}`);
    } catch (e: any) {
      setNotifyMsg(e.message);
    } finally {
      setNotifying(false);
    }
  };

  if (isResolved && resolveTime) {
    const wasBreached = resolveTime > dueTime;
    const diff = Math.abs(resolveTime - dueTime);
    const timeTaken = resolveTime - createTime;

    return (
      <div className={`p-4 rounded-xl border ${wasBreached ? "bg-bad/10 border-bad/30" : "bg-ok/10 border-ok/30"} space-y-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {wasBreached ? (
              <AlertTriangle className="h-5 w-5 text-bad" />
            ) : (
              <CheckCircle className="h-5 w-5 text-ok" />
            )}
            <span className="font-bold text-sm text-fg">
              {wasBreached ? "SLA Breached" : "SLA Guarantee Met"}
            </span>
          </div>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${wasBreached ? "bg-bad/20 text-bad" : "bg-ok/20 text-ok"}`}>
            {wasBreached ? `Overdue by ${formatDuration(diff)}` : `Met by ${formatDuration(diff)}`}
          </span>
        </div>
        <p className="text-xs text-mute">
          Resolution time: <span className="font-semibold text-fg">{formatDuration(timeTaken)}</span> against guaranteed {slaHours}h target window.
        </p>
      </div>
    );
  }

  // Active Live Work Order SLA
  const msRemaining = dueTime - now;
  const isOverdue = msRemaining <= 0;
  const elapsedMs = now - createTime;
  const pctElapsed = Math.min(100, Math.max(0, Math.round((elapsedMs / totalWindowMs) * 100)));

  return (
    <div className={`p-4 rounded-xl border transition-all ${isOverdue ? "bg-bad/10 border-bad/40 shadow-md shadow-bad/10" : "bg-surface border-line"} space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${isOverdue ? "text-bad animate-pulse" : "text-accent"}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-dim">
              Guaranteed Vendor SLA Countdown ({slaHours}h)
            </span>
          </div>
          <div className={`font-mono text-xl sm:text-2xl font-black tabular-nums tracking-tight ${isOverdue ? "text-bad" : "text-fg"}`}>
            {isOverdue ? `−${formatDuration(msRemaining)}` : formatDuration(msRemaining)}
          </div>
        </div>

        <span
          className={`text-[10px] font-bold uppercase px-2 py-1 rounded border tracking-wider ${
            isOverdue
              ? "bg-bad text-white border-bad shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              : pctElapsed > 75
              ? "bg-warn/20 text-warn border-warn/40"
              : "bg-ok/20 text-ok border-ok/40"
          }`}
        >
          {isOverdue ? "SLA BREACHED" : pctElapsed > 75 ? "URGENT / EXPIRING" : "ON TRACK"}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-dim">
          <span>{pctElapsed}% of target window elapsed</span>
          <span>{isOverdue ? "Breached: Penalty accruing" : "Guaranteed deadline"}</span>
        </div>
        <div className="h-2 rounded-full bg-raised overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isOverdue ? "bg-bad" : pctElapsed > 75 ? "bg-warn" : "bg-accent"
            }`}
            style={{ width: `${pctElapsed}%` }}
          />
        </div>
      </div>

      {/* Vendor SLA Dispatch Action */}
      {vendorName && (
        <div className="pt-2 border-t border-line/60 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-dim">
            Vendor Partner: <span className="font-semibold text-fg">{vendorName}</span>
            {vendorEmail && <span className="text-mute ml-1">({vendorEmail})</span>}
          </div>

          <button
            type="button"
            onClick={handleNotifyVendor}
            disabled={notifying || notified}
            className={`btn text-xs py-1 px-3 inline-flex items-center gap-1.5 transition ${
              notified
                ? "bg-ok/20 text-ok border border-ok/40 cursor-default"
                : "btn-ghost hover:bg-raised text-accent border border-line"
            }`}
          >
            {notified ? (
              <>
                <Check className="h-3.5 w-3.5" /> Notice Dispatched
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" /> {notifying ? "Sending…" : "Dispatch SLA Notice"}
              </>
            )}
          </button>
        </div>
      )}

      {notifyMsg && (
        <p className="text-[11px] text-ok mt-1 font-medium">{notifyMsg}</p>
      )}
    </div>
  );
}
