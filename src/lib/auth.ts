import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { db } from "./db";
import { AuthnError, assertCan, type Permission } from "./rbac";

const COOKIE = "assetops_session";
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET ?? "");
export interface Session { userId: string; orgId: string; role: Role; name: string; email: string; departmentId: string | null }

export const hashPassword = (p: string) => bcrypt.hash(p, 10);
export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h);

export async function createSession(userId: string) {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) throw new Error("SESSION_SECRET must be set (32+ chars)");
  const token = await new SignJWT({ uid: userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * 86400 });
}
export async function destroySession() { (await cookies()).delete(COOKIE); }

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const u = await db.user.findUnique({ where: { id: String(payload.uid) } });
    if (!u || !u.active) return null;
    return { userId: u.id, orgId: u.orgId, role: u.role, name: u.name, email: u.email, departmentId: u.departmentId };
  } catch { return null; }
}

/** Require a session and (optionally) a permission. Every service call takes the resulting orgId. */
export async function requireSession(perm?: Permission): Promise<Session> {
  const s = await getSession();
  if (!s) throw new AuthnError();
  if (perm) assertCan(s.role, perm);
  return s;
}
