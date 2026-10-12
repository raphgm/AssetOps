"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "../ui";

const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "FinOps Engine", href: "#finops" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-3.5 transition-all duration-300">
      <div
        className={`max-w-6xl mx-auto h-14 px-4 sm:px-5 rounded-2xl flex items-center justify-between transition-all duration-300 ${
          solid || open
            ? "bg-white/90 backdrop-blur-2xl border border-slate-200/90 shadow-lg shadow-slate-200/60"
            : "bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-sm"
        }`}
      >
        {/* Left: Minimal Clean Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="AssetOps home" className="flex items-center gap-2 group">
            <Logo />
          </Link>
        </div>

        {/* Center: Clean 4-Item Nav Links */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-8 text-[13.5px] text-slate-600 font-semibold"
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

        {/* Right: Exactly 1 subtle link + 1 bright vibrant primary CTA button */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors px-2 py-1"
          >
            Sign In
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 hover:brightness-105 hover:shadow-cyan-500/35 transition-all group"
          >
            <span>Live Platform</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg transition"
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
          className="md:hidden mt-2 p-5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl flex flex-col gap-3 animate-fadeIn"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="py-2 text-slate-700 hover:text-cyan-600 text-sm font-semibold border-b border-slate-100"
            >
              {label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Sign In
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-600 text-white text-xs font-bold shadow-md"
            >
              Launch Live Platform
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
