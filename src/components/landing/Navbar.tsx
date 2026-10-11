"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "../ui";

const LINKS = [
  ["Features", "#features"],
  ["FinOps ROI", "#calculator"],
  ["GIS Map", "#gis"],
  ["Solutions", "#solutions"],
  ["Security", "#security"],
  ["Pricing", "#pricing"],
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
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm shadow-slate-100"
          : "bg-white/60 backdrop-blur-sm border-b border-slate-100"
      }`}
    >
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="AssetOps home">
            <Logo light />
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10.5px] font-mono font-semibold text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-full">
            <Sparkles className="h-3 w-3 text-teal-600" /> v2.4 FINOPS
          </span>
        </div>

        <nav aria-label="Main" className="hidden lg:flex items-center gap-6 text-[13px] text-slate-600 font-medium">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} className="hover:text-slate-900 transition-colors">
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/sign-in"
            className="text-xs font-medium text-slate-600 hover:text-slate-950 px-3 py-1.5 rounded-md hover:bg-slate-100 transition"
          >
            Sign in
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-md border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100 transition"
          >
            Live Demo
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-md bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-600/20 hover:shadow-cyan-600/35 hover:opacity-95 transition"
          >
            Start Free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md"
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
              className="py-2 text-slate-700 hover:text-teal-600 text-sm border-b border-slate-100 font-medium"
            >
              {l}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3">
            <Link
              href="/sign-in"
              className="btn justify-center text-xs bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"
            >
              Explore Live Demo
            </Link>
            <Link
              href="/sign-up"
              className="btn justify-center text-xs bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium"
            >
              Start Free Workspace
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
