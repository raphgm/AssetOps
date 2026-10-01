import { describe, it, expect, vi, beforeAll } from "vitest";

const jar = new Map<string, string>();
vi.mock("next/headers", () => ({ cookies: async () => ({ get: (k: string) => (jar.has(k) ? { value: jar.get(k) } : undefined), set: (k: string, v: string) => void jar.set(k, v), delete: (k: string) => void jar.delete(k) }) }));

import { db } from "@/lib/db";
import { hashPassword, verifyPassword, getSession, createSession, destroySession, requireSession } from "@/lib/auth";
import { POST as signIn } from "@/app/api/auth/sign-in/route";
import { POST as signUp } from "@/app/api/auth/sign-up/route";
import { POST as forgot } from "@/app/api/auth/forgot/route";
import { POST as reset } from "@/app/api/auth/reset/route";
import { makeWorld, type World } from "./world";
import { AuthnError, AuthzError } from "@/lib/rbac";

const req = (path: string, body: unknown, ip = "1.1.1.1") => new Request(`http://localhost${path}`, { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip, host: "localhost", origin: "http://localhost" }, body: JSON.stringify(body) });
let W: World;
beforeAll(async () => {
  W = await makeWorld("AU", { assets: 1 });
  await db.user.update({ where: { id: W.sessions.ICT_MANAGER.userId }, data: { passwordHash: await hashPassword("correct horse 9") } });
});

describe("authentication", () => {
  it("hashes passwords (bcrypt) and verifies them", async () => {
    const h = await hashPassword("secret-pass-1"); expect(h).not.toContain("secret"); expect(h.startsWith("$2")).toBe(true);
    expect(await verifyPassword("secret-pass-1", h)).toBe(true); expect(await verifyPassword("nope", h)).toBe(false);
  });
  it("signs in with valid credentials, sets an httpOnly session and resolves it", async () => {
    const res = await signIn(req("/api/auth/sign-in", { email: W.sessions.ICT_MANAGER.email, password: "correct horse 9" }));
    expect(res.status).toBe(200); expect(jar.get("assetops_session")).toBeTruthy();
    const s = await getSession(); expect(s).toMatchObject({ orgId: W.orgId, role: "ICT_MANAGER" });
    expect(await db.auditLog.count({ where: { orgId: W.orgId, action: "auth.sign_in" } })).toBe(1);
  });
  it("rejects wrong passwords and unknown users with the same message", async () => {
    const a = await signIn(req("/api/auth/sign-in", { email: W.sessions.ICT_MANAGER.email, password: "wrong" }, "2.2.2.2"));
    const b = await signIn(req("/api/auth/sign-in", { email: "ghost@x.test", password: "wrong" }, "3.3.3.3"));
    expect(a.status).toBe(400); expect((await a.json()).error).toBe((await b.json()).error);
  });
  it("rate limits repeated attempts", async () => {
    let last = 0; for (let i = 0; i < 12; i++) last = (await signIn(req("/api/auth/sign-in", { email: "brute@x.test", password: "x" }, "9.9.9.9"))).status;
    expect(last).toBe(400); const r = await signIn(req("/api/auth/sign-in", { email: "brute@x.test", password: "x" }, "9.9.9.9")); expect((await r.json()).error).toMatch(/Too many/);
  });
  it("blocks cross-origin mutations (CSRF)", async () => {
    const r = new Request("http://localhost/api/auth/sign-in", { method: "POST", headers: { "content-type": "application/json", origin: "https://evil.example", host: "localhost" }, body: JSON.stringify({ email: "a@b.co", password: "x" }) });
    expect((await signIn(r)).status).toBe(403);
  });
  it("sessions die on sign-out, tampering and deactivation", async () => {
    await destroySession(); expect(await getSession()).toBeNull();
    await createSession(W.sessions.TECHNICIAN.userId); expect((await getSession())?.role).toBe("TECHNICIAN");
    jar.set("assetops_session", jar.get("assetops_session")! + "x"); expect(await getSession()).toBeNull();
    await createSession(W.sessions.TECHNICIAN.userId); await db.user.update({ where: { id: W.sessions.TECHNICIAN.userId }, data: { active: false } }); expect(await getSession()).toBeNull();
  });
  it("requireSession enforces authentication and permission server-side", async () => {
    await destroySession(); await expect(requireSession()).rejects.toBeInstanceOf(AuthnError);
    await createSession(W.sessions.AUDITOR.userId); await expect(requireSession("asset:write")).rejects.toBeInstanceOf(AuthzError);
    expect((await requireSession("audit:read")).role).toBe("AUDITOR");
  });
  it("sign-up creates an isolated organisation with a super admin and default categories", async () => {
    const res = await signUp(req("/api/auth/sign-up", { name: "Ada Obi", org: "Acme Institute", email: "ada@acme.test", password: "longenough1" }, "4.4.4.4"));
    expect(res.status).toBe(200);
    const u = await db.user.findUniqueOrThrow({ where: { email: "ada@acme.test" } });
    expect(u.role).toBe("SUPER_ADMIN"); expect(u.passwordHash).not.toContain("longenough1");
    expect(await db.maintenanceCategory.count({ where: { orgId: u.orgId } })).toBeGreaterThan(5); expect(u.orgId).not.toBe(W.orgId);
    expect((await signUp(req("/api/auth/sign-up", { name: "Ada Obi", org: "Acme Institute", email: "ada@acme.test", password: "longenough1" }, "4.4.4.5"))).status).toBe(400);
    expect((await signUp(req("/api/auth/sign-up", { name: "Bo", org: "Org", email: "bo@acme.test", password: "short" }, "4.4.4.6"))).status).toBe(400);
  });
  it("password reset: token is single-use, expires, and unknown emails are not revealed", async () => {
    const a = await (await forgot(req("/api/auth/forgot", { email: "ada@acme.test" }, "5.5.5.5"))).json();
    const b = await (await forgot(req("/api/auth/forgot", { email: "nobody@acme.test" }, "5.5.5.6"))).json();
    expect(a.ok).toBe(true); expect(b.ok).toBe(true); expect(b.devLink).toBeUndefined();
    const token = a.devLink.split("/").pop();
    expect((await reset(req("/api/auth/reset", { token, password: "brand-new-pass-2" }))).status).toBe(200);
    const sIn = await signIn(req("/api/auth/sign-in", { email: "ada@acme.test", password: "brand-new-pass-2" }, "6.6.6.6")); expect(sIn.status).toBe(200);
    expect((await reset(req("/api/auth/reset", { token, password: "another-pass-3" }))).status).toBe(400);   // reused
  });
});
