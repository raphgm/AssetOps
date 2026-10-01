"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Activity, BarChart3, Bell, Building2, ChevronsLeft, ClipboardList, Cpu, Database, FileText, Gauge, LayoutDashboard, MapPin, Menu, Network, ScanLine, ScrollText, Search, Settings, Sparkles, Truck, Wrench, X, Boxes } from "lucide-react";
import { Logo } from "./ui";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/assets", label: "Assets", icon: Cpu },
  { href: "/app/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/app/work-orders", label: "Work Orders", icon: ClipboardList },
  { href: "/app/departments", label: "Departments", icon: Building2 },
  { href: "/app/vendors", label: "Vendors", icon: Truck },
  { href: "/app/locations", label: "Locations", icon: MapPin },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/graph", label: "Asset Graph", icon: Network },
  { href: "/app/ai", label: "AI Copilot", icon: Sparkles },
  { href: "/app/import", label: "Import", icon: Database },
  { href: "/app/reports", label: "Reports", icon: FileText },
  { href: "/app/audit", label: "Audit Log", icon: ScrollText },
];
const MOBILE = [
  { href: "/app", label: "Home", icon: LayoutDashboard }, { href: "/app/technician", label: "My work", icon: Wrench },
  { href: "/app/scan", label: "Scan", icon: ScanLine }, { href: "/app/assets", label: "Assets", icon: Boxes }, { href: "/app/ai", label: "AI", icon: Sparkles },
];

export default function Shell({ user, unread, children }: { user: { name: string; role: string; org: string; isDemo: boolean }; unread: number; children: React.ReactNode }) {
  const path = usePathname(); const router = useRouter();
  const [collapsed, setCollapsed] = useState(false); const [drawer, setDrawer] = useState(false); const [cmd, setCmd] = useState(false);
  useEffect(() => { try { setCollapsed(localStorage.getItem("sb") === "1"); } catch {} }, []);
  useEffect(() => setDrawer(false), [path]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmd((v) => !v); } };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);
  const toggle = () => setCollapsed((c) => { try { localStorage.setItem("sb", c ? "0" : "1"); } catch {} return !c; });
  const active = (h: string) => (h === "/app" ? path === "/app" : path.startsWith(h));
  async function signOut() { await fetch("/api/auth/sign-out", { method: "POST" }); router.push("/sign-in"); router.refresh(); }

  const nav = (
    <nav aria-label="Primary" className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
      {NAV.map(({ href, label, icon: I }) => (
        <Link key={href} href={href} title={label} aria-current={active(href) ? "page" : undefined}
          className={cn("flex items-center gap-2.5 h-8 px-2.5 rounded-md text-[13px] text-mute hover:text-fg hover:bg-raised transition", active(href) && "bg-raised text-fg")}>
          <I className="h-4 w-4 shrink-0" aria-hidden />{!collapsed && <span className="truncate">{label}</span>}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex">
      <aside className={cn("hidden md:flex flex-col border-r border-line bg-surface sticky top-0 h-screen shrink-0 transition-[width]", collapsed ? "w-[56px]" : "w-56")}>
        <div className="h-12 flex items-center justify-between px-3 border-b border-line"><Link href="/app"><Logo text={!collapsed} /></Link>
          {!collapsed && <button onClick={toggle} className="text-dim hover:text-fg" aria-label="Collapse sidebar"><ChevronsLeft className="h-4 w-4" /></button>}</div>
        {nav}
        <div className="p-2 border-t border-line space-y-0.5">
          <Link href="/app/settings" className="flex items-center gap-2.5 h-8 px-2.5 rounded-md text-[13px] text-mute hover:text-fg hover:bg-raised"><Settings className="h-4 w-4" aria-hidden />{!collapsed && "Settings"}</Link>
          {collapsed && <button onClick={toggle} className="flex items-center h-8 px-2.5 text-dim hover:text-fg" aria-label="Expand sidebar"><Menu className="h-4 w-4" /></button>}
        </div>
      </aside>

      {drawer && (
        <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="w-64 bg-surface border-r border-line flex flex-col animate-rise">
            <div className="h-12 flex items-center justify-between px-3 border-b border-line"><Logo /><button onClick={() => setDrawer(false)} aria-label="Close menu"><X className="h-4 w-4" /></button></div>
            {nav}
            <div className="p-2 border-t border-line"><Link href="/app/settings" className="flex items-center gap-2.5 h-8 px-2.5 text-mute"><Settings className="h-4 w-4" />Settings</Link></div>
          </div>
          <button className="flex-1 bg-black/60" aria-label="Close menu" onClick={() => setDrawer(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-12 sticky top-0 z-30 flex items-center gap-3 px-3 sm:px-5 border-b border-line bg-bg/85 backdrop-blur">
          <button className="md:hidden" onClick={() => setDrawer(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <button onClick={() => setCmd(true)} className="flex-1 max-w-md h-8 flex items-center gap-2 px-2.5 rounded-md border border-line2 bg-surface text-dim hover:border-[#3a404b] text-[13px]">
            <Search className="h-3.5 w-3.5" aria-hidden /><span className="flex-1 text-left">Search assets, work orders, vendors…</span><kbd className="hidden sm:block text-[10px] border border-line2 rounded px-1">⌘K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-2">
            {user.isDemo && <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-warn border border-warn/30 rounded px-1.5 py-0.5">Synthetic demo data</span>}
            <Link href="/app/notifications" className="relative btn btn-ghost px-2" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}><Bell className="h-4 w-4" />{unread > 0 && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" />}</Link>
            <details className="relative">
              <summary className="list-none cursor-pointer btn btn-ghost px-2 gap-2"><span className="h-6 w-6 rounded-full bg-line2 grid place-items-center text-[11px]">{user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span><span className="hidden sm:block text-left leading-tight"><span className="block text-[12px]">{user.name}</span><span className="block text-[10px] text-dim">{user.role.replace("_", " ").toLowerCase()}</span></span></summary>
              <div className="absolute right-0 mt-1 w-52 card p-1 shadow-xl z-40">
                <div className="px-2.5 py-1.5 text-xs text-dim border-b border-line mb-1">{user.org}</div>
                <Link href="/app/settings" className="block px-2.5 py-1.5 rounded hover:bg-raised">Settings</Link>
                <button onClick={signOut} className="w-full text-left px-2.5 py-1.5 rounded hover:bg-raised">Sign out</button>
              </div>
            </details>
          </div>
        </header>
        <main className="flex-1 px-3 sm:px-5 py-5 pb-24 md:pb-8 max-w-[1500px] w-full mx-auto">{children}</main>
      </div>

      <nav aria-label="Mobile" className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-surface/95 backdrop-blur border-t border-line grid grid-cols-5">
        {MOBILE.map(({ href, label, icon: I }) => (
          <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} className={cn("flex flex-col items-center justify-center gap-0.5 text-[10px] text-dim", active(href) && "text-accent")}><I className="h-5 w-5" aria-hidden />{label}</Link>
        ))}
      </nav>
      {cmd && <CommandPalette onClose={() => setCmd(false)} />}
    </div>
  );
}

interface Hit { group: string; label: string; sub?: string; href: string }
const COMMANDS: Hit[] = [
  { group: "Commands", label: "Create asset", href: "/app/assets/new" }, { group: "Commands", label: "Create work order", href: "/app/work-orders/new" },
  { group: "Commands", label: "Record maintenance", href: "/app/maintenance/new" }, { group: "Commands", label: "Scan asset", href: "/app/scan" },
  { group: "Commands", label: "Open AI Copilot", href: "/app/ai" }, { group: "Commands", label: "Import records", href: "/app/import" }, { group: "Commands", label: "Generate report", href: "/app/reports" },
];
function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter(); const [q, setQ] = useState(""); const [hits, setHits] = useState<Hit[]>([]); const [sel, setSel] = useState(0); const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);
  useEffect(() => {
    if (q.length < 2) { setHits([]); return; }
    const t = setTimeout(() => fetch(`/api/search?q=${encodeURIComponent(q)}`).then((r) => r.json()).then((d) => setHits(d.hits ?? [])).catch(() => setHits([])), 180);
    return () => clearTimeout(t);
  }, [q]);
  const cmds = COMMANDS.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
  const all = [...cmds, ...hits];
  useEffect(() => setSel(0), [q, hits.length]);
  const go = (h: Hit) => { onClose(); router.push(h.href); };
  return (
    <div className="fixed inset-0 z-[60] grid place-items-start justify-center pt-[12vh] bg-black/60 px-4" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="card w-full max-w-xl shadow-2xl animate-rise overflow-hidden" onMouseDown={(e) => e.stopPropagation()}>
        <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a command or search…" aria-label="Search" className="w-full h-11 px-4 bg-transparent border-b border-line outline-none"
          onKeyDown={(e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(all.length - 1, s + 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); } if (e.key === "Enter" && all[sel]) go(all[sel]); }} />
        <ul className="max-h-80 overflow-y-auto py-1" role="listbox">
          {all.length === 0 && <li className="px-4 py-6 text-center text-mute">{q.length < 2 ? "Type at least 2 characters to search." : "No results."}</li>}
          {all.map((h, i) => (
            <li key={h.group + h.href + h.label} role="option" aria-selected={i === sel}>
              {(i === 0 || all[i - 1].group !== h.group) && <div className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-widest text-dim">{h.group}</div>}
              <button onClick={() => go(h)} onMouseEnter={() => setSel(i)} className={cn("w-full text-left px-4 py-1.5 flex justify-between gap-3", i === sel && "bg-raised")}><span>{h.label}</span><span className="text-dim text-xs truncate">{h.sub}</span></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
