"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "../ui";

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Hardware FinOps", href: "#finops" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        solid || open
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-sm shadow-slate-100"
          : "bg-white/70 backdrop-blur-md border-b border-slate-200/50"
      }`}
    >
      <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Clean Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="AssetOps home" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        {/* Center: Focused 4-Item Nav */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-8 text-[13.5px] text-slate-600 font-medium"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="hover:text-cyan-600 transition-colors py-1"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right: Exactly 1 subtle link + 1 primary CTA button (Zero clutter) */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors px-2 py-1.5"
          >
            Sign In
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow transition-all group"
          >
            <span>Launch Live Demo</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden px-5 pb-6 pt-3 flex flex-col gap-3 bg-white border-t border-slate-200 shadow-xl animate-fadeIn"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-slate-700 hover:text-cyan-600 text-sm font-semibold border-b border-slate-100"
            >
              {label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100"
            >
              Sign In
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow hover:bg-slate-800"
            >
              Launch Live Demo
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
