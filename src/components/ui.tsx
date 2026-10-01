import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Lock } from "lucide-react";
import { cn, STATUS_LABEL } from "@/lib/utils";

export function Logo({ className, text = true }: { className?: string; text?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 17.5 12 6l6 11.5M8.2 13.5h7.6" stroke="#5eead4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="6" r="2.2" fill="#0a0b0d" stroke="#5eead4" strokeWidth="1.6" />
        <circle cx="6" cy="17.5" r="2.2" fill="#0a0b0d" stroke="#e8eaed" strokeWidth="1.6" />
        <circle cx="18" cy="17.5" r="2.2" fill="#0a0b0d" stroke="#e8eaed" strokeWidth="1.6" />
      </svg>
      {text && <span>AssetOps</span>}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-mute mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const TONE: Record<string, string> = {
  ok: "text-ok", warn: "text-warn", bad: "text-bad", info: "text-info", mute: "text-mute",
};
const STATUS_TONE: Record<string, string> = {
  OPERATIONAL: "ok", UNDER_MAINTENANCE: "info", AT_RISK: "bad", RETIRED: "mute",
  OPEN: "warn", ASSIGNED: "info", IN_PROGRESS: "info", AWAITING_PARTS: "warn", RESOLVED: "ok", VERIFIED: "ok", CLOSED: "mute", CANCELLED: "mute",
  LOW: "mute", MEDIUM: "info", HIGH: "warn", CRITICAL: "bad",
  healthy: "ok", watch: "warn", attention: "warn", critical: "bad",
};
/** Status is conveyed by a dot AND a text label (never colour alone). */
export function Status({ value, label }: { value: string; label?: string }) {
  const tone = STATUS_TONE[value] ?? "mute";
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px]">
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", TONE[tone])} aria-hidden />
      <span>{label ?? STATUS_LABEL[value] ?? value[0].toUpperCase() + value.slice(1)}</span>
    </span>
  );
}

export function Badge({ children, tone = "mute" }: { children: ReactNode; tone?: "ok" | "warn" | "bad" | "info" | "mute" | "accent" }) {
  const c = { ok: "text-ok border-ok/30", warn: "text-warn border-warn/30", bad: "text-bad border-bad/30", info: "text-info border-info/30", mute: "text-mute border-line2", accent: "text-accent border-accent/30" }[tone];
  return <span className={cn("inline-flex items-center rounded border px-1.5 py-px text-[11px] font-medium uppercase tracking-wide", c)}>{children}</span>;
}

/** Makes the REAL / CALCULATED / AI / ESTIMATE distinction explicit. */
export function Source({ kind }: { kind: "record" | "calculated" | "ai" | "estimate" }) {
  const m = { record: ["System record", "mute"], calculated: ["Calculated", "info"], ai: ["AI analysis", "accent"], estimate: ["Estimate", "warn"] } as const;
  return <Badge tone={m[kind][1]}>{m[kind][0]}</Badge>;
}

export function Stat({ label, value, sub, href, tone }: { label: string; value: ReactNode; sub?: ReactNode; href?: string; tone?: "bad" | "warn" | "ok" }) {
  const inner = (
    <div className="card px-4 py-3 h-full transition hover:border-line2 hover:bg-raised/60">
      <div className="text-[11px] uppercase tracking-wider text-dim">{label}</div>
      <div className={cn("text-2xl font-semibold tracking-tight mt-1 tabular-nums", tone && TONE[tone])}>{value}</div>
      {sub && <div className="text-mute text-xs mt-0.5">{sub}</div>}
    </div>
  );
  return href ? <Link href={href} className="block rounded-lg animate-rise">{inner}</Link> : <div className="animate-rise">{inner}</div>;
}

export function Card({ title, right, children, className, pad = true }: { title?: ReactNode; right?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={cn("card animate-rise", className)}>
      {(title || right) && (
        <header className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-line">
          <h2 className="text-[13px] font-medium">{title}</h2>
          {right}
        </header>
      )}
      <div className={pad ? "p-4" : ""}>{children}</div>
    </section>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-raised", className)} aria-hidden />;
}
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading">
      <Skeleton className="h-7 w-56 mb-2" /><Skeleton className="h-4 w-80 mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
      <Skeleton className="h-72" />
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      <Inbox className="h-7 w-7 text-dim mb-3" aria-hidden />
      <div className="font-medium">{title}</div>
      <p className="text-mute max-w-sm mt-1">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
export function ErrorState({ title = "Something went wrong", body, retry }: { title?: string; body?: string; retry?: ReactNode }) {
  return (
    <div role="alert" className="card flex flex-col items-center text-center py-12 px-6">
      <AlertTriangle className="h-7 w-7 text-warn mb-3" aria-hidden />
      <div className="font-medium">{title}</div>
      <p className="text-mute max-w-sm mt-1">{body ?? "We couldn't load this. Your data is safe — try again."}</p>
      {retry && <div className="mt-4">{retry}</div>}
    </div>
  );
}
export function Forbidden({ what = "this page" }: { what?: string }) {
  return (
    <div role="alert" className="card flex flex-col items-center text-center py-14 px-6">
      <Lock className="h-7 w-7 text-dim mb-3" aria-hidden />
      <div className="font-medium">You don&apos;t have access to {what}</div>
      <p className="text-mute max-w-sm mt-1">Your role doesn&apos;t include this permission. Ask a Super Admin if you need access.</p>
    </div>
  );
}

/** WHAT / WHY / WHAT NOW — applied to every important metric. */
export function Www({ what, why, now, href, cta }: { what: string; why: string; now: string; href?: string; cta?: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3 text-[12.5px]">
      {[["What", what], ["Why", why], ["What now", now]].map(([k, v]) => (
        <div key={k}><div className="text-[10px] uppercase tracking-widest text-dim">{k}</div><div className="mt-0.5">{v}</div></div>
      ))}
      {href && <div className="sm:col-span-3"><Link href={href} className="btn btn-accent">{cta ?? "Investigate"}</Link></div>}
    </div>
  );
}

export function Pagination({ page, pages, base }: { page: number; pages: number; base: string }) {
  if (pages <= 1) return null;
  const href = (p: number) => `${base}${base.includes("?") ? "&" : "?"}page=${p}`;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between px-3 py-2 text-mute text-xs">
      <span>Page {page} of {pages}</span>
      <div className="flex gap-2">
        {page > 1 ? <Link className="btn" href={href(page - 1)}>Previous</Link> : <span className="btn opacity-40">Previous</span>}
        {page < pages ? <Link className="btn" href={href(page + 1)}>Next</Link> : <span className="btn opacity-40">Next</span>}
      </div>
    </nav>
  );
}
