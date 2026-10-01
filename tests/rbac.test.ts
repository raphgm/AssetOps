import { describe, it, expect } from "vitest";
import { can, ROLE_PERMISSIONS } from "@/lib/rbac";
import { TRANSITIONS } from "@/lib/services/workorders";

describe("RBAC matrix", () => {
  it("super admin can do everything", () => { expect(ROLE_PERMISSIONS.SUPER_ADMIN).toContain("user:manage"); expect(can("SUPER_ADMIN", "audit:read")).toBe(true); });
  it("auditor is strictly read-only", () => {
    const writes = ["asset:write", "asset:import", "maintenance:write", "workorder:create", "workorder:assign", "workorder:update", "workorder:verify", "vendor:write", "user:manage", "issue:report"] as const;
    writes.forEach((p) => expect(can("AUDITOR", p)).toBe(false));
    ["asset:read", "maintenance:read", "workorder:read", "audit:read", "report:read"].forEach((p) => expect(can("AUDITOR", p as never)).toBe(true));
  });
  it("technician works orders but cannot assign, manage users or see audit/analytics", () => {
    expect(can("TECHNICIAN", "workorder:update")).toBe(true); expect(can("TECHNICIAN", "maintenance:write")).toBe(true);
    ["workorder:assign", "user:manage", "audit:read", "analytics:read", "ai:use", "vendor:write"].forEach((p) => expect(can("TECHNICIAN", p as never)).toBe(false));
  });
  it("department user can only report and view", () => { expect(can("DEPARTMENT_USER", "issue:report")).toBe(true); expect(can("DEPARTMENT_USER", "asset:write")).toBe(false); expect(can("DEPARTMENT_USER", "ai:use")).toBe(false); });
  it("director sees everything but does not operate", () => { expect(can("ICT_DIRECTOR", "analytics:read")).toBe(true); expect(can("ICT_DIRECTOR", "workorder:assign")).toBe(false); expect(can("ICT_DIRECTOR", "workorder:verify")).toBe(true); });
  it("manager can assign but not manage users or read audit", () => { expect(can("ICT_MANAGER", "workorder:assign")).toBe(true); expect(can("ICT_MANAGER", "user:manage")).toBe(false); expect(can("ICT_MANAGER", "audit:read")).toBe(false); });
});
describe("work order state machine", () => {
  it("closed and cancelled are terminal", () => { expect(Object.keys(TRANSITIONS.CLOSED)).toHaveLength(0); expect(Object.keys(TRANSITIONS.CANCELLED)).toHaveLength(0); });
  it("cannot skip verification", () => { expect(TRANSITIONS.IN_PROGRESS.CLOSED).toBeUndefined(); expect(TRANSITIONS.RESOLVED.CLOSED).toBeUndefined(); expect(TRANSITIONS.RESOLVED.VERIFIED).toBe("workorder:verify"); });
});
