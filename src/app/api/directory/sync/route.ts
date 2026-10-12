import { requireSession } from "@/lib/auth";
import { handle } from "@/lib/api";
import { audit } from "@/lib/audit";
import { actorOf } from "@/lib/services/assets";
import { db } from "@/lib/db";
import { DEFAULT_DIRECTORY_CONFIG, syncActiveDirectory } from "@/lib/directory/entraSync";

/**
 * GET /api/directory/sync
 * Return status of Microsoft Entra ID & Active Directory integration.
 */
export const GET = handle(async () => {
  const s = await requireSession("user:manage");

  const [totalUsers, totalDepts] = await Promise.all([
    db.user.count({ where: { orgId: s.orgId } }),
    db.department.count({ where: { orgId: s.orgId } }),
  ]);

  return {
    config: DEFAULT_DIRECTORY_CONFIG,
    metrics: {
      totalUsers,
      totalDepartments: totalDepts,
      status: "HEALTHY",
      syncProtocol: "Microsoft Graph API v1.0 + SCIM 2.0",
      autoSyncActive: true,
      identityProvider: "Microsoft Entra ID (Azure AD)",
      tenantDomain: DEFAULT_DIRECTORY_CONFIG.tenantDomain,
      tenantId: DEFAULT_DIRECTORY_CONFIG.tenantId,
      lastSyncedAt: DEFAULT_DIRECTORY_CONFIG.lastSyncedAt,
    },
  };
});

/**
 * POST /api/directory/sync
 * Trigger automated synchronization of users from Microsoft Entra ID / Active Directory.
 */
export const POST = handle(async () => {
  const s = await requireSession("user:manage");

  const syncResult = await syncActiveDirectory(s.orgId);

  await audit(
    actorOf(s),
    "user.created",
    "User",
    `entra-sync-${Date.now()}`,
    undefined,
    {
      source: "Microsoft Entra ID / Active Directory",
      syncedCount: syncResult.syncedCount,
      createdCount: syncResult.createdCount,
      updatedCount: syncResult.updatedCount,
      departmentsMapped: syncResult.departmentsMapped,
    }
  );

  return {
    ok: true,
    message: `Synchronized ${syncResult.syncedCount} enterprise accounts from Microsoft Entra ID.`,
    result: syncResult,
  };
});
