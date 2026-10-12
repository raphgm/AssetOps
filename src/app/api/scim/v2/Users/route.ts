import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { randomBytes } from "crypto";
import { Role } from "@prisma/client";

/**
 * SCIM 2.0 Users API (RFC 7644)
 * Enables automated user provisioning from Microsoft Entra ID, Okta, and Google Workspace.
 */

// Helper to authenticate SCIM Bearer token
function authenticateSCIM(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  const expectedToken = process.env.SCIM_BEARER_TOKEN || "assetops_scim_2085_enterprise_token";
  if (!auth || !auth.startsWith("Bearer ")) return false;
  return auth.slice(7) === expectedToken;
}

export async function GET(req: NextRequest) {
  if (!authenticateSCIM(req)) {
    return NextResponse.json({ status: "401", scimType: "unauthorized", detail: "Invalid SCIM Bearer token" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const startIndex = Math.max(1, parseInt(searchParams.get("startIndex") || "1", 10));
  const count = Math.min(100, Math.max(1, parseInt(searchParams.get("count") || "50", 10)));

  // Query users across database
  const [totalResults, users] = await Promise.all([
    db.user.count(),
    db.user.findMany({
      skip: startIndex - 1,
      take: count,
      include: { department: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const Resources = users.map((u) => ({
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    id: u.id,
    userName: u.email,
    name: {
      formatted: u.name,
      givenName: u.name.split(" ")[0] || u.name,
      familyName: u.name.split(" ").slice(1).join(" ") || "",
    },
    displayName: u.name,
    active: u.active,
    emails: [{ value: u.email, primary: true }],
    roles: [{ value: u.role, primary: true }],
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
      department: u.department?.name || "General",
    },
    meta: {
      resourceType: "User",
      created: u.createdAt.toISOString(),
      location: `/api/scim/v2/Users/${u.id}`,
    },
  }));

  return NextResponse.json({
    schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
    totalResults,
    startIndex,
    itemsPerPage: Resources.length,
    Resources,
  });
}

export async function POST(req: NextRequest) {
  if (!authenticateSCIM(req)) {
    return NextResponse.json({ status: "401", scimType: "unauthorized", detail: "Invalid SCIM Bearer token" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const email = (body.userName || body.emails?.[0]?.value || "").toLowerCase();
    const name = body.displayName || body.name?.formatted || email.split("@")[0] || "Entra User";
    
    // Find first organization
    const org = await db.organization.findFirst();
    if (!org) {
      return NextResponse.json({ status: "500", detail: "No organization found" }, { status: 500 });
    }

    const deptName = body["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"]?.department;
    let departmentId: string | null = null;

    if (deptName) {
      let dept = await db.department.findFirst({ where: { orgId: org.id, name: deptName } });
      if (!dept) {
        dept = await db.department.create({ data: { orgId: org.id, name: deptName } });
      }
      departmentId = dept.id;
    }

    // Role mapping from SCIM
    let role: Role = "TECHNICIAN";
    const scimRole = body.roles?.[0]?.value?.toUpperCase();
    if (scimRole && ["SUPER_ADMIN", "ICT_DIRECTOR", "ICT_MANAGER", "TECHNICIAN", "DEPARTMENT_USER", "AUDITOR"].includes(scimRole)) {
      role = scimRole as Role;
    }

    const randomPw = randomBytes(24).toString("base64");
    const passwordHash = await hashPassword(randomPw);

    const user = await db.user.create({
      data: {
        orgId: org.id,
        email,
        name,
        role,
        departmentId,
        active: body.active !== false,
        passwordHash,
      },
      include: { department: true },
    });

    return NextResponse.json(
      {
        schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
        id: user.id,
        userName: user.email,
        displayName: user.name,
        active: user.active,
        emails: [{ value: user.email, primary: true }],
        roles: [{ value: user.role, primary: true }],
        meta: {
          resourceType: "User",
          created: user.createdAt.toISOString(),
          location: `/api/scim/v2/Users/${user.id}`,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ status: "400", scimType: "invalidValue", detail: err.message }, { status: 400 });
  }
}
