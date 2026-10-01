import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Badge, Card, Forbidden, PageHeader, Source } from "@/components/ui";
import InvestigateButton from "@/components/InvestigateButton";
import type { AIResponse, EvidenceItem } from "@/lib/ai/schema";
import { fmtDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
const CONF: Record<string, [string, "ok" | "warn" | "bad" | "mute"]> = { high: ["High", "ok"], medium: ["Medium", "warn"], low: ["Low", "bad"], insufficient: ["Insufficient evidence", "mute"] };

function summarize(data: unknown): string {
  const t = JSON.stringify(data); return t.length > 700 ? t.slice(0, 700) + "…" : t;
}

export default async function Investigation({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireSession();
  if (!can(s.role, "ai:use")) return <Forbidden what="AI investigations" />;
  const inv = await db.aIInvestigation.findFirst({ where: { id: (await params).id, orgId: s.orgId } });
  if (!inv) notFound();
  const evidence = (inv.evidence ?? []) as unknown as EvidenceItem[];
  const result = inv.result as unknown as AIResponse | null;
  const catId = evidence.map((e) => e.href?.match(/category=([\w]+)/)?.[1]).find(Boolean);
  const E = new Map(evidence.map((e) => [e.id, e]));
  const incidents = evidence.find((e) => e.tool === "get_similar_incidents")?.data as { incidents?: number; departments?: string[]; locations?: string[]; deviceModels?: string[]; vendorShare?: { vendor: string; incidents: number }[] } | undefined;
  const canAct = can(s.role, "workorder:assign");
  const Step = ({ n, title, children, right }: { n: string; title: string; children: React.ReactNode; right?: React.ReactNode }) => (
    <section className="grid grid-cols-[28px_1fr] gap-3"><div className="text-[11px] text-dim tabular-nums pt-3.5">{n}</div><Card title={title} right={right}>{children}</Card></section>);
  const Refs = ({ ids }: { ids: string[] }) => <span className="ml-1">{ids.map((i) => <a key={i} href={`#ev-${i}`} className="text-[10px] text-accent border border-accent/30 rounded px-1 mr-0.5 no-underline">{i}</a>)}</span>;
  return (
    <div className="max-w-4xl"><PageHeader title="Investigation" subtitle={<span>{fmtDateTime(inv.createdAt)} · <Badge tone={inv.status === "complete" ? "ok" : "warn"}>{inv.status.replace("_", " ")}</Badge></span>} />
      <div className="space-y-3">
        <Step n="01" title="Question"><p className="text-base">{inv.question}</p></Step>
        <Step n="02" title="Data" right={<Source kind="record" />}>
          <p className="text-mute mb-2">{evidence.length} evidence package{evidence.length === 1 ? "" : "s"} retrieved through approved, permission-checked tools. No raw database access; only these results were shared with the model.</p>
          <ul className="space-y-1">{evidence.map((e) => <li key={e.id}><a href={`#ev-${e.id}`} className="hover:text-accent"><span className="text-accent text-xs mr-2">{e.id}</span>{e.title}</a></li>)}</ul>
        </Step>
        {incidents && <Step n="03" title="Patterns & correlations" right={<Source kind="calculated" />}>
          <ul className="space-y-1.5 text-[13px]"><li><b>{incidents.incidents}</b> incidents in the window.</li>{incidents.departments && <li>Departments affected: <b>{incidents.departments.length}</b> ({incidents.departments.slice(0, 7).join(", ")})</li>}{incidents.locations && <li>Locations: <b>{incidents.locations.length}</b> ({incidents.locations.join(", ")})</li>}{incidents.deviceModels && <li>Device models: <b>{incidents.deviceModels.length}</b> ({incidents.deviceModels.join(", ")})</li>}{incidents.vendorShare && incidents.vendorShare[0] && <li>Top vendor: <b>{incidents.vendorShare[0].vendor}</b> ({incidents.vendorShare[0].incidents} incidents)</li>}</ul></Step>}
        <Step n="04" title="AI analysis" right={<Source kind="ai" />}>
          {result ? <div className="space-y-4">
            <div className="flex items-start justify-between gap-3"><p className="text-[15px]">{result.summary}</p><Badge tone={CONF[result.confidence][1]}>{CONF[result.confidence][0]}</Badge></div>
            {result.facts.length > 0 && <div><h3 className="eyebrow mb-1.5">Observed facts</h3><ul className="space-y-1.5">{result.facts.map((f, i) => <li key={i}>• {f.text}<Refs ids={f.refs} /></li>)}</ul></div>}
            {result.patterns.length > 0 && <div><h3 className="eyebrow mb-1.5">Patterns</h3><ul className="space-y-1">{result.patterns.map((p, i) => <li key={i}>• {p}</li>)}</ul></div>}
            {result.possible_explanations.length > 0 && <div><h3 className="eyebrow mb-1.5">Possible explanations <span className="text-dim normal-case tracking-normal">(not confirmed)</span></h3><ul className="space-y-1">{result.possible_explanations.map((p, i) => <li key={i}>• {p}</li>)}</ul></div>}
            <p className="text-xs text-dim">Confidence reflects how much evidence was available — it is not a statistical probability.</p>
          </div> : <div role="alert" className="flex gap-3"><AlertTriangle className="h-5 w-5 text-warn shrink-0" /><div><div className="font-medium">{inv.error ?? "No analysis yet."}</div><p className="text-mute mt-1">The retrieved evidence below is still accurate. The rest of AssetOps is unaffected.</p><div className="mt-3"><InvestigateButton question={inv.question} categoryId={catId} label="Retry analysis" /></div></div></div>}
        </Step>
        <Step n="05" title="Evidence">
          <ul className="space-y-3">{evidence.map((e) => <li key={e.id} id={`ev-${e.id}`} className="border border-line rounded-md p-3 scroll-mt-20"><div className="flex justify-between gap-2"><span><span className="text-accent text-xs mr-2">{e.id}</span><b>{e.title}</b></span>{e.href && <Link className="text-xs text-mute hover:text-fg" href={e.href}>Open →</Link>}</div><pre className="mt-2 text-[11px] text-mute whitespace-pre-wrap break-words font-mono max-h-40 overflow-auto">{summarize(e.data)}</pre></li>)}{evidence.length === 0 && <li className="text-mute">No evidence was available for this question. Insufficient evidence to determine this.</li>}</ul>
          <p className="text-xs text-dim mt-2">Maintenance notes are shown as data only. Text inside records is never treated as an instruction.</p></Step>
        <Step n="06" title="Recommended action">
          {result && result.recommendations.length > 0 ? <ul className="space-y-1 mb-3">{result.recommendations.map((r, i) => <li key={i}>• {r}</li>)}</ul> : <p className="text-mute mb-3">No recommendation available.</p>}
          <div className="flex flex-wrap gap-2">
            {catId && canAct && <Link className="btn btn-accent" href={`/app/work-orders/new?fleet=1&category=${catId}`}>Create fleet inspection…</Link>}
            {catId && <Link className="btn" href={`/app/maintenance?category=${catId}&days=30`}>View affected records</Link>}
            <Link className="btn" href="/app/ai">New question</Link>
          </div>
          <p className="text-xs text-dim mt-2">Actions open a confirmation step. AssetOps Intelligence never changes records on its own.</p></Step>
      </div></div>
  );
}
