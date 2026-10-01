import type { Role } from "@prisma/client";

export type Permission =
  | "asset:read" | "asset:write" | "asset:import"
  | "maintenance:read" | "maintenance:write"
  | "workorder:read" | "workorder:create" | "workorder:assign" | "workorder:update" | "workorder:verify"
  | "vendor:read" | "vendor:write" | "department:read" | "location:read"
  | "analytics:read" | "ai:use" | "audit:read" | "user:manage" | "report:read" | "issue:report";

const ALL: Permission[] = ["asset:read", "asset:write", "asset:import", "maintenance:read", "maintenance:write", "workorder:read", "workorder:create", "workorder:assign", "workorder:update", "workorder:verify", "vendor:read", "vendor:write", "department:read", "location:read", "analytics:read", "ai:use", "audit:read", "user:manage", "report:read", "issue:report"];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: ALL,
  ICT_DIRECTOR: ["asset:read", "maintenance:read", "workorder:read", "workorder:verify", "vendor:read", "department:read", "location:read", "analytics:read", "ai:use", "report:read", "audit:read", "issue:report"],
  ICT_MANAGER: ["asset:read", "asset:write", "asset:import", "maintenance:read", "maintenance:write", "workorder:read", "workorder:create", "workorder:assign", "workorder:update", "workorder:verify", "vendor:read", "vendor:write", "department:read", "location:read", "analytics:read", "ai:use", "report:read", "issue:report"],
  TECHNICIAN: ["asset:read", "maintenance:read", "maintenance:write", "workorder:read", "workorder:update", "issue:report", "department:read", "location:read"],
  DEPARTMENT_USER: ["asset:read", "workorder:read", "issue:report"],
  AUDITOR: ["asset:read", "maintenance:read", "workorder:read", "vendor:read", "department:read", "location:read", "analytics:read", "audit:read", "report:read"],
};

export function can(role: Role, p: Permission) { return ROLE_PERMISSIONS[role].includes(p); }

export class AuthzError extends Error { status = 403; constructor(msg = "You do not have access to this resource.") { super(msg); } }
export class AuthnError extends Error { status = 401; constructor(msg = "Authentication required.") { super(msg); } }

export function assertCan(role: Role, p: Permission) { if (!can(role, p)) throw new AuthzError(`Missing permission: ${p}`); }

/** Errors safe to show to the user verbatim. */
export class UserError extends Error {}
