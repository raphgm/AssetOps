import Link from "next/link";
import { ArrowRight, Check, Lock, ScrollText, ShieldCheck, Database, KeyRound, Network, Download, Timer, QrCode } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import LiveFeed from "@/components/landing/LiveFeed";
import { Logo } from "@/components/ui";

const Eyebrow = ({ children }: { children: React.ReactNode }) => <div className="eyebrow mb-3">{children}</div>;
const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1] max-w-2xl">{children}</h2>;
const Sec = ({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) => <section id={id} className={`max-w-6xl mx-auto px-4 py-20 sm:py-28 scroll-mt-14 ${className}`}>{children}</section>;
const Sample = () => <span className="text-[10px] uppercase tracking-widest text-dim">Illustrative sample data</span>;

export default function Landing() {
  return (
    <div className="bg-bg">
      <Navbar />
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(#1a1d23_1px,transparent_1px),linear-gradient(90deg,#1a1d23_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
        <Sec className="relative pt-32 sm:pt-40 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <div>
            <Eyebrow>ICT maintenance intelligence</Eyebrow>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.08]">Turn maintenance history into operational intelligence.</h1>
            <p className="text-mute text-lg mt-5 max-w-xl">AssetOps gives institutions one source of truth for every ICT asset, maintenance event, technician, vendor and work order.</p>
            <div className="flex flex-wrap gap-3 mt-8"><Link href="/sign-up" className="btn btn-accent btn-lg">Start free</Link><Link href="/sign-in" className="btn btn-lg">View live demo <ArrowRight className="h-4 w-4" /></Link></div>
            <p className="text-xs text-dim mt-4">Demo uses a clearly-labelled synthetic organisation. No credit card.</p>
          </div>
          <div className="card p-4 shadow-2xl shadow-black/50" aria-label="Dashboard preview">
            <div className="flex items-center justify-between mb-3"><span className="text-[11px] uppercase tracking-widest text-dim">Maintenance Intelligence</span><Sample /></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{[["12,482", "Assets", ""], ["95.4%", "Operational", "text-ok"], ["191", "At risk", "text-bad"], ["₦12.7M", "Maintenance spend", ""]].map(([v, l, c]) => <div key={l} className="rounded-md border border-line bg-bg/60 p-2.5"><div className={`text-xl font-semibold tabular-nums ${c}`}>{v}</div><div className="text-[10px] uppercase tracking-wider text-dim">{l}</div></div>)}</div>
            <div className="grid sm:grid-cols-[1.4fr_1fr] gap-3 mt-3">
              <div className="rounded-md border border-line bg-bg/60 p-3"><div className="text-[11px] text-dim mb-1">Requests vs resolved · 30 days</div><svg viewBox="0 0 300 90" className="w-full" role="img" aria-label="Sample trend chart"><path d="M0 70 C30 60 50 66 80 48 S130 52 160 36 S220 40 250 22 S290 18 300 14" fill="none" stroke="#5eead4" strokeWidth="2" /><path d="M0 76 C40 70 60 72 90 60 S140 58 170 48 S230 50 260 36 S290 34 300 30" fill="none" stroke="#e8eaed" strokeWidth="1.5" strokeDasharray="4 3" opacity=".7" /></svg></div>
              <div className="rounded-md border border-line bg-bg/60 p-3"><div className="flex items-center gap-1.5 text-[11px] text-dim mb-2"><span className="h-1.5 w-1.5 rounded-full bg-accent animate-dot" aria-hidden />Live activity</div><LiveFeed /></div>
            </div>
          </div>
        </Sec>
      </div>

      {/* PROBLEM */}
      <Sec id="product"><Eyebrow>The problem</Eyebrow><H2>Your maintenance history is more valuable than you think.</H2>
        <p className="text-mute mt-4 max-w-2xl">It lives in spreadsheets, inboxes, paper files, vendors&apos; systems and technicians&apos; heads. When people and vendors change, institutional knowledge walks out the door.</p>
        <div className="mt-10 grid md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4 text-center">
          <div className="flex flex-wrap justify-center gap-2">{["Spreadsheets", "Email", "Paper", "Vendors", "Technicians"].map((s) => <span key={s} className="border border-line2 border-dashed rounded-md px-3 py-1.5 text-mute text-xs uppercase tracking-wider">{s}</span>)}</div>
          <ArrowRight className="hidden md:block text-dim" aria-hidden /><div className="card py-5 px-6"><Logo className="justify-center" /></div><ArrowRight className="hidden md:block text-dim" aria-hidden />
          <div className="card py-5 px-6 border-accent/40"><div className="font-medium">One source of truth</div><div className="text-xs text-mute">Every asset. Every event.</div></div>
        </div></Sec>

      {/* PASSPORT */}
      <Sec id="how" className="border-t border-line"><div className="grid lg:grid-cols-2 gap-12 items-center">
        <div><Eyebrow>Digital maintenance passport</Eyebrow><H2>Every asset gets a memory.</H2><p className="text-mute mt-4">Every intervention becomes part of the asset&apos;s permanent maintenance history — immutable, attributed and searchable, whoever is on shift next year.</p></div>
        <div className="card p-5"><div className="flex items-start justify-between"><div><div className="font-mono text-sm">ICT-LAG-004821</div><div className="text-mute">Dell Latitude 7440</div></div><span className="inline-flex items-center gap-1.5 text-xs"><span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />Operational</span></div>
          <div className="grid grid-cols-4 gap-2 my-4 text-center">{[["72/100", "Health"], ["7", "Events"], ["38h", "Downtime"], ["₦472K", "Lifetime"]].map(([v, l]) => <div key={l} className="rounded border border-line py-2"><div className="font-semibold tabular-nums">{v}</div><div className="text-[10px] uppercase text-dim">{l}</div></div>)}</div>
          <ol className="relative border-l border-line ml-1.5 space-y-3">{[["Battery replacement", "Sep 21"], ["OS repair", "Aug 14"], ["Keyboard replacement", "Jul 29"], ["Battery replacement", "Jun 18"]].map(([t, d]) => <li key={t + d} className="pl-4 relative flex justify-between"><span className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-accent" aria-hidden />{t}<span className="text-dim text-xs">{d}</span></li>)}</ol><div className="mt-3"><Sample /></div></div>
      </div></Sec>

      {/* INTELLIGENCE */}
      <Sec id="intelligence" className="border-t border-line"><Eyebrow>Intelligence</Eyebrow><H2>Don&apos;t just record failures. Understand them.</H2>
        <p className="text-mute mt-4 max-w-2xl">AssetOps detects patterns across departments, locations, assets and vendors — with deterministic scoring you can audit, not a black box.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-10">{[["Maintenance activity", "↑ 18%", "text-warn"], ["Recurring failures", "84", ""], ["High-risk assets", "191", "text-bad"], ["SLA breaches", "23", "text-warn"]].map(([l, v, c]) => <div key={l} className="card p-4"><div className="text-[11px] uppercase tracking-wider text-dim">{l}</div><div className={`text-3xl font-semibold mt-1 tabular-nums ${c}`}>{v}</div></div>)}</div><div className="mt-2"><Sample /></div></Sec>

      {/* AI */}
      <Sec className="border-t border-line"><div className="grid lg:grid-cols-2 gap-12 items-center"><div><Eyebrow>AI, with evidence</Eyebrow><H2>Ask your maintenance data anything.</H2><p className="text-mute mt-4">Answers are built only from records your role can access. Every claim links to evidence; if the evidence isn&apos;t there, AssetOps says so. The AI explains — it never calculates scores and never changes records on its own.</p></div>
        <div className="card p-5 space-y-4"><div className="ml-auto max-w-[85%] rounded-lg bg-raised px-3 py-2">Why did maintenance costs increase this month?</div>
          <div className="space-y-2"><p>Maintenance spending increased <b>18%</b> compared with the previous month.</p><div className="text-[11px] uppercase tracking-widest text-dim">Evidence</div><ul className="space-y-1 text-[13px]">{["84 additional work orders", "₦1.2M additional repair costs", "printer-related repairs increased 31%", "7 departments affected"].map((e) => <li key={e} className="flex gap-2"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden />{e}</li>)}</ul><div className="flex gap-2 pt-1"><span className="btn">View evidence</span><span className="btn btn-accent">Investigate</span></div></div><Sample /></div></div></Sec>

      {/* GRAPH */}
      <Sec id="solutions" className="border-t border-line"><Eyebrow>Asset graph</Eyebrow><H2>See problems that individual tickets cannot.</H2>
        <p className="text-mute mt-4 max-w-2xl">Relationships between assets, departments, locations, network infrastructure, vendors and maintenance events reveal shared root causes.</p>
        <div className="card mt-10 p-6 overflow-x-auto"><svg viewBox="0 0 760 130" className="min-w-[640px] w-full" role="img" aria-label="Finance to Network Segment A to Switch-014 to 18 devices to recurring connectivity failures">
          {[["Finance", "#7aa2ff"], ["Network Segment A", "#fbbf24"], ["Switch-014", "#5eead4"], ["18 devices", "#e8eaed"], ["Recurring connectivity failures", "#f87171"]].map(([t, c], i) => <g key={t} transform={`translate(${i * 150 + 4} 40)`}><rect width="130" height="50" rx="8" fill="#101216" stroke={c} /><text x="65" y="30" textAnchor="middle" fill="#e8eaed" fontSize="11">{t.length > 20 ? <><tspan x="65" dy="-5">Recurring</tspan><tspan x="65" dy="14">connectivity failures</tspan></> : t}</text>{i < 4 && <path d={`M130 25 H150`} stroke="#3b4350" markerEnd="url(#a)" />}</g>)}
          <defs><marker id="a" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L6 3L0 6z" fill="#3b4350" /></marker></defs></svg><Sample /></div></Sec>

      {/* WORK ORDERS */}
      <Sec className="border-t border-line"><div className="grid lg:grid-cols-2 gap-12 items-center"><div><Eyebrow>Work orders</Eyebrow><H2>From issue to resolution.</H2><ol className="mt-8 flex flex-wrap gap-2 items-center">{["Report", "Assign", "Diagnose", "Repair", "Verify", "Close"].map((s, i, a) => <li key={s} className="flex items-center gap-2"><span className="border border-line2 rounded-md px-2.5 py-1 text-xs uppercase tracking-wider">{s}</span>{i < a.length - 1 && <ArrowRight className="h-3 w-3 text-dim" aria-hidden />}</li>)}</ol><p className="text-mute mt-6">Every transition is timestamped, attributed and audited. Technicians complete work from a phone in a few taps — even with patchy connectivity.</p></div>
        <div className="mx-auto w-64 rounded-[28px] border border-line2 bg-surface p-3 shadow-xl"><div className="rounded-2xl bg-bg p-3 space-y-2"><div className="text-xs text-dim">My work</div><div className="grid grid-cols-3 gap-1 text-center text-[10px]">{[["3", "High"], ["5", "Active"], ["12", "Done"]].map(([n, l]) => <div key={l} className="border border-line rounded py-1.5"><div className="text-base font-semibold">{n}</div>{l}</div>)}</div><div className="border border-line rounded-md p-2 text-xs"><div className="text-dim">WO-29381 · HIGH</div>Battery failure<div className="font-mono text-[10px] text-dim">ICT-LAG-004821</div><div className="btn btn-accent w-full mt-2 h-8">Start work</div></div></div></div></div></Sec>

      {/* DEBT */}
      <Sec className="border-t border-line"><Eyebrow>Maintenance debt</Eyebrow><H2>Know what you&apos;re postponing.</H2><p className="text-mute mt-4 max-w-2xl">AssetOps makes deferred maintenance visible with a transparent, deterministic estimate — assumptions are always shown, never hidden.</p>
        <div className="card p-6 mt-10"><div className="text-[11px] uppercase tracking-wider text-dim">Maintenance debt</div><div className="text-4xl font-semibold tabular-nums mt-1">₦8.4M <span className="text-sm text-dim font-normal">estimated exposure</span></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 text-sm">{[["47", "overdue work orders"], ["19", "recurring failures"], ["31", "aging assets"], ["8", "expired warranties"]].map(([n, l]) => <div key={l}><b className="text-lg tabular-nums">{n}</b><div className="text-mute">{l}</div></div>)}</div><div className="mt-3"><Sample /></div></div></Sec>

      {/* QR */}
      <Sec className="border-t border-line"><div className="grid lg:grid-cols-2 gap-12 items-center"><div><Eyebrow>QR identification</Eyebrow><H2>Scan any asset. Know its history.</H2><p className="text-mute mt-4">Labels encode a secure token — not a database ID — and respect each user&apos;s role and organisation.</p></div>
        <div className="mx-auto w-64 rounded-[28px] border border-line2 bg-surface p-3"><div className="rounded-2xl bg-bg p-4 space-y-2"><div className="eyebrow flex items-center gap-1.5"><QrCode className="h-3.5 w-3.5" aria-hidden />Scan</div><div className="font-mono text-sm">ICT-LAG-004821</div><div>Dell Latitude 7440</div><div className="text-xs text-mute">Finance</div><div className="text-xs flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />Operational</div>{["Report Issue", "Maintenance History", "Start Work Order"].map((b) => <div key={b} className="btn w-full">{b}</div>)}</div></div></div></Sec>

      {/* TRUST */}
      <Sec id="security" className="border-t border-line"><Eyebrow>Security & trust</Eyebrow><H2>Built so you can defend every number.</H2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-10">{[[KeyRound, "Role-based access", "Six roles, enforced on the server."], [ScrollText, "Audit logs", "Append-only record of sensitive actions."], [ShieldCheck, "Evidence-backed AI", "No evidence, no claim."], [Database, "Organisation isolation", "Every query is tenant-scoped."], [Lock, "Encrypted secrets", "Keys live in server environment only."], [Network, "Controlled integrations", "AI behind an approved tool layer."], [Download, "Data export", "CSV for every dataset."], [Timer, "Configurable retention", "Immutable records by default."]].map(([I, t, d]) => { const Icon = I as typeof Lock; return <div key={t as string} className="card p-4"><Icon className="h-4 w-4 text-accent mb-2" aria-hidden /><div className="font-medium">{t as string}</div><div className="text-mute text-xs mt-0.5">{d as string}</div></div>; })}</div>
        <p className="text-xs text-dim mt-4">AssetOps does not currently claim any third-party compliance certification.</p></Sec>

      {/* PRICING */}
      <Sec id="pricing" className="border-t border-line"><Eyebrow>Pricing</Eyebrow><H2>Start free. Grow when you need to.</H2>
        <div className="grid md:grid-cols-3 gap-3 mt-10">{[["Free", "For small ICT teams getting started.", ["Core asset registry", "Work orders & QR", "Deterministic analytics"]], ["Professional", "For institutions with multiple sites.", ["Everything in Free", "AI investigations", "Imports & reports"]], ["Enterprise", "For large estates and regulated environments.", ["Everything in Professional", "Custom retention & SSO", "Dedicated support"]]].map(([n, d, f]) => <div key={n as string} className="card p-5"><div className="font-semibold">{n as string}</div><p className="text-mute text-xs mt-1">{d as string}</p><ul className="mt-4 space-y-1.5 text-[13px]">{(f as string[]).map((x) => <li key={x} className="flex gap-2"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" aria-hidden />{x}</li>)}</ul></div>)}</div>
        <p className="text-xs text-dim mt-3">Billing is not enabled in this release; all workspaces are free during early access.</p></Sec>

      {/* CTA */}
      <Sec className="border-t border-line text-center"><h2 className="text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl mx-auto leading-[1.1]">Give your institution a maintenance memory.</h2><div className="flex justify-center flex-wrap gap-3 mt-8"><Link href="/sign-up" className="btn btn-accent btn-lg">Start using AssetOps</Link><Link href="/sign-in" className="btn btn-lg">Explore the demo</Link></div></Sec>

      <footer className="border-t border-line"><div className="max-w-6xl mx-auto px-4 py-10 flex flex-wrap items-center justify-between gap-6"><Logo />
        <nav aria-label="Footer" className="flex flex-wrap gap-6 text-[13px] text-mute">{["Product", "Solutions", "Security", "Documentation", "Contact"].map((l) => <a key={l} href={l === "Product" ? "#product" : l === "Solutions" ? "#solutions" : l === "Security" ? "#security" : "#"} className="hover:text-fg">{l}</a>)}</nav><div className="text-xs text-dim">© 2026 AssetOps</div></div></footer>
    </div>
  );
}
