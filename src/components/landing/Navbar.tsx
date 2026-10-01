"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui";

const LINKS = [["Product", "#product"], ["How it works", "#how"], ["Intelligence", "#intelligence"], ["Solutions", "#solutions"], ["Security", "#security"], ["Pricing", "#pricing"]];
export default function Navbar() {
  const [solid, setSolid] = useState(false); const [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setSolid(window.scrollY > 12); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors ${solid || open ? "bg-bg/90 backdrop-blur border-b border-line" : "bg-transparent border-b border-transparent"}`}>
      <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
        <Link href="/" aria-label="AssetOps home"><Logo /></Link>
        <nav aria-label="Main" className="hidden lg:flex gap-6 text-[13px] text-mute">{LINKS.map(([l, h]) => <a key={h} href={h} className="hover:text-fg transition">{l}</a>)}</nav>
        <div className="hidden lg:flex items-center gap-2"><Link href="/sign-in" className="btn btn-ghost">Sign in</Link><Link href="/sign-up" className="btn btn-primary">Start free</Link></div>
        <button className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav aria-label="Mobile" className="lg:hidden px-4 pb-4 flex flex-col gap-1 border-t border-line">{LINKS.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="py-2 text-mute">{l}</a>)}<div className="flex gap-2 pt-2"><Link href="/sign-in" className="btn flex-1">Sign in</Link><Link href="/sign-up" className="btn btn-primary flex-1">Start free</Link></div></nav>}
    </header>
  );
}
