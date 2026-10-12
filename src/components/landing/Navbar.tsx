"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
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
            ? "bg-[#0b0d13]/85 backdrop-blur-2xl border border-white/[0.09] shadow-2xl shadow-black/80"
            : "bg-[#0b0d13]/50 backdrop-blur-md border border-white/[0.05]"
        }`}
      >
        {/* Left: Minimal Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="AssetOps home" className="flex items-center gap-2.5 group">
            <Logo />
          </Link>
        </div>

        {/* Center: Floating Menu Links */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-7 text-[13px] text-slate-300 font-medium"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="hover:text-cyan-400 transition-colors py-1"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right: Exactly 1 subtle text link + 1 primary glow CTA button */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-2 py-1"
          >
            Sign In
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:brightness-110 hover:shadow-cyan-500/30 transition-all group"
          >
            <span>Live Platform</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg transition"
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
          className="md:hidden mt-2 p-5 rounded-2xl bg-[#0b0d13]/95 backdrop-blur-2xl border border-white/[0.09] shadow-2xl flex flex-col gap-3 animate-fadeIn"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="py-2 text-slate-200 hover:text-cyan-400 text-sm font-medium border-b border-white/[0.05]"
            >
              {label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-white/[0.08] text-xs font-bold text-slate-200 hover:bg-white/[0.05]"
            >
              Sign In
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 text-slate-950 text-xs font-bold shadow-md"
            >
              Launch Live Platform
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
