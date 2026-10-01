"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "./ui";

type Mode = "sign-in" | "sign-up" | "forgot" | "reset";
const COPY: Record<Mode, { title: string; sub: string; cta: string }> = {
  "sign-in": { title: "Sign in to AssetOps", sub: "Welcome back.", cta: "Sign in" },
  "sign-up": { title: "Create your organisation", sub: "Start with a free workspace.", cta: "Create workspace" },
  forgot: { title: "Reset your password", sub: "We'll generate a reset link for your account.", cta: "Send reset link" },
  reset: { title: "Choose a new password", sub: "Use at least 8 characters.", cta: "Update password" },
};

export default function AuthForm({ mode, token, showDemo }: { mode: Mode; token?: string; showDemo?: boolean }) {
  const r = useRouter();
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState<{ text: string; link?: string } | null>(null);
  const c = COPY[mode];

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(""); setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const url = { "sign-in": "/api/auth/sign-in", "sign-up": "/api/auth/sign-up", forgot: "/api/auth/forgot", reset: "/api/auth/reset" }[mode];
    try {
      const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(mode === "reset" ? { token, password: f.password } : f) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Request failed");
      if (mode === "forgot") setMsg({ text: "If that email has an account, a reset link has been generated.", link: d.devLink });
      else if (mode === "reset") r.push("/sign-in");
      else { r.push(mode === "sign-up" ? "/app/onboarding" : "/app"); }
    } catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong"); } finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block mb-8"><Logo /></Link>
        <h1 className="text-xl font-semibold tracking-tight">{c.title}</h1>
        <p className="text-mute mt-1 mb-6">{c.sub}</p>
        <form onSubmit={submit} className="space-y-3" noValidate>
          {mode === "sign-up" && <>
            <div><label className="label" htmlFor="name">Your name</label><input id="name" name="name" className="input" required autoComplete="name" /></div>
            <div><label className="label" htmlFor="org">Organisation</label><input id="org" name="org" className="input" required /></div>
          </>}
          {mode !== "reset" && <div><label className="label" htmlFor="email">Work email</label><input id="email" name="email" type="email" className="input" required autoComplete="email" /></div>}
          {mode !== "forgot" && <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" className="input" required minLength={mode === "sign-in" ? 1 : 8} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} /></div>}
          {err && <p role="alert" className="text-bad text-xs">{err}</p>}
          {msg && <div role="status" className="text-xs text-ok">{msg.text}{msg.link && <> <Link className="underline" href={msg.link}>Open reset link</Link> <span className="text-dim">(shown because no email provider is configured)</span></>}</div>}
          <button className="btn btn-primary w-full h-9" disabled={busy}>{busy ? "Please wait…" : c.cta}</button>
        </form>
        <div className="mt-5 text-xs text-mute flex justify-between">
          {mode === "sign-in" && <><Link href="/forgot-password" className="hover:text-fg">Forgot password?</Link><Link href="/sign-up" className="hover:text-fg">Create account</Link></>}
          {mode === "sign-up" && <Link href="/sign-in" className="hover:text-fg">Already have an account? Sign in</Link>}
          {(mode === "forgot" || mode === "reset") && <Link href="/sign-in" className="hover:text-fg">Back to sign in</Link>}
        </div>
        {mode === "sign-in" && showDemo && (
          <div className="mt-8 card p-3 text-xs text-mute">
            <div className="text-fg font-medium mb-1">Synthetic demo organisation</div>
            <code className="font-mono">demo@assetops.local</code> / <code className="font-mono">demo1234!</code>
            <div className="mt-1">Also: manager@, director@, technician@, auditor@, finance@ (same password, @assetops.local).</div>
          </div>
        )}
      </div>
    </main>
  );
}
