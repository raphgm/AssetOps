"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Radio, Sparkles } from "lucide-react";
import { Logo } from "../ui";

const LINKS = [
  ["Subsystems", "#features"],
  ["Quantum FinOps", "#calculator"],
  ["Planetary GIS", "#gis"],
  ["Sectors", "#solutions"],
  ["Proof", "#security"],
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        solid || open
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-sm shadow-slate-100"
          : "bg-white/60 backdrop-blur-md border-b border-slate-200/60"
      }`}
    >
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="AssetOps home">
            <Logo />
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span>2080 QUANTUM OS // 99.999% COHERENCE</span>
          </span>
        </div>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-6 text-[13px] text-slate-600 font-semibold">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} className="hover:text-cyan-600 transition-colors">
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2.5 font-mono">
          <Link
            href="/sign-in"
            className="text-xs font-bold text-slate-600 hover:text-slate-950 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            Neural Sign In
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-xl border border-cyan-200 bg-cyan-50/70 text-cyan-800 hover:bg-cyan-100 transition shadow-sm"
          >
            Holo-Demo
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:brightness-105 transition"
          >
            Deploy Node <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
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
          className="lg:hidden px-4 pb-6 pt-2 flex flex-col gap-2 bg-white border-t border-slate-200 shadow-xl"
        >
          {LINKS.map(([l, h]) => (
            <a
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              className="py-2 text-slate-700 hover:text-cyan-600 text-xs font-bold border-b border-slate-100"
            >
              {l}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3 font-mono">
            <Link
              href="/sign-in"
              className="btn justify-center text-xs bg-slate-100 text-slate-800"
            >
              Holo-Demo
            </Link>
            <Link
              href="/sign-up"
              className="btn btn-accent justify-center text-xs"
            >
              Deploy Node
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
