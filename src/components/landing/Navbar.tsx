"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "../ui";

const LINKS = [
  ["FinOps & Features", "#features"],
  ["GIS Map", "#gis"],
  ["Industry Solutions", "#solutions"],
  ["ROI Calculator", "#calculator"],
  ["Security & Compliance", "#security"],
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
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        solid || open
          ? "bg-bg/90 backdrop-blur-md border-b border-line shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="AssetOps home">
            <Logo />
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-medium text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-full">
            <Sparkles className="h-2.5 w-2.5" /> v2.4 FINOPS LIVE
          </span>
        </div>

        <nav aria-label="Main" className="hidden xl:flex items-center gap-6 text-[13px] text-mute font-medium">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} className="hover:text-fg transition-colors">
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2.5">
          <Link href="/sign-in" className="btn btn-ghost text-xs">
            Sign in
          </Link>
          <Link href="/sign-in" className="btn text-xs border-accent/40 text-accent hover:border-accent">
            Live Demo
          </Link>
          <Link href="/sign-up" className="btn btn-accent text-xs">
            Start Free <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <button
          className="xl:hidden p-2 text-mute hover:text-fg rounded-md"
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
          className="xl:hidden px-4 pb-6 pt-2 flex flex-col gap-2 bg-bg/95 border-t border-line backdrop-blur-lg"
        >
          {LINKS.map(([l, h]) => (
            <a
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              className="py-2 text-mute hover:text-fg text-sm border-b border-line/40"
            >
              {l}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3">
            <Link href="/sign-in" className="btn w-full justify-center text-xs">
              Explore Live Demo
            </Link>
            <Link href="/sign-up" className="btn btn-accent w-full justify-center text-xs">
              Start Free Trial
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
