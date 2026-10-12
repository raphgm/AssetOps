"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Zap, Radio } from "lucide-react";
import { Logo } from "../ui";

const LINKS = [
  ["Subsystems", "#features"],
  ["Quantum FinOps", "#calculator"],
  ["Planetary GIS", "#gis"],
  ["Sectors", "#solutions"],
  ["Cryptographic Proof", "#security"],
  ["Tiers", "#pricing"],
  ["FAQ", "#faq"],
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = () => setSolid(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid || open
          ? "bg-[#030712]/90 backdrop-blur-2xl border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(0,240,255,0.15)]"
          : "bg-[#030712]/60 backdrop-blur-md border-b border-cyan-500/15"
      }`}
    >
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="AssetOps home">
            <Logo />
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[10.5px] font-mono text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <Radio className="h-2.5 w-2.5 text-cyan-400 animate-pulse" />
            <span>GRID: ONLINE · 99.999% COHERENCE</span>
          </div>
        </div>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-300 font-medium tracking-wide">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} className="hover:text-cyan-400 transition-colors duration-200">
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/sign-in"
            className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-800 transition"
          >
            Neural Sign In
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-cyan-400/50 bg-cyan-950/50 text-cyan-300 hover:bg-cyan-900/60 shadow-[0_0_15px_rgba(0,240,255,0.2)] transition"
          >
            Live Demo
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:brightness-110 transition"
          >
            Deploy Node <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-slate-300 hover:text-cyan-400 rounded-md"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="lg:hidden px-4 pb-6 pt-2 flex flex-col gap-2 bg-[#050914] border-t border-cyan-500/30 shadow-2xl"
        >
          {LINKS.map(([l, h]) => (
            <a
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              className="py-2 text-slate-300 hover:text-cyan-400 text-xs font-mono border-b border-slate-900"
            >
              {l}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3">
            <Link
              href="/sign-in"
              className="btn justify-center text-xs font-mono bg-cyan-950 text-cyan-300 border-cyan-500/40"
            >
              Live Demo
            </Link>
            <Link
              href="/sign-up"
              className="btn btn-accent justify-center text-xs font-mono"
            >
              Deploy Node
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
