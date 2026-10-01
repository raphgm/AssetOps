import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthnError, AuthzError, UserError } from "./rbac";
import { log } from "./log";

/** Wrap an API handler: JSON errors, status mapping, CSRF origin check for mutations, logging. */
export function handle<A extends unknown[]>(fn: (req: Request, ...a: A) => Promise<unknown>) {
  return async (req: Request, ...a: A) => {
    try {
      if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        const origin = req.headers.get("origin"); const host = req.headers.get("host");
        if (origin && host && new URL(origin).host !== host) return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
      }
      const out = await fn(req, ...a);
      return out instanceof Response ? out : NextResponse.json(out);
    } catch (e) {
      if (e instanceof AuthnError) return NextResponse.json({ error: e.message }, { status: 401 });
      if (e instanceof AuthzError) return NextResponse.json({ error: e.message }, { status: 403 });
      if (e instanceof ZodError) return NextResponse.json({ error: e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
      const msg = e instanceof Error ? e.message : "Unexpected error";
      const known = e instanceof UserError || /not found|invalid|already exists|cannot move|required|choose|must|not assigned/i.test(msg);
      if (!known) log.error("api.error", { path: new URL(req.url).pathname, error: msg });
      return NextResponse.json({ error: known ? msg : "Something went wrong." }, { status: known ? 400 : 500 });
    }
  };
}
export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
