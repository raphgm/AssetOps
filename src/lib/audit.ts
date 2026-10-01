import { db } from "./db";
import type { Prisma } from "@prisma/client";

export interface Actor { id?: string | null; name: string; orgId: string; ip?: string | null }

/** Append-only audit trail. There is deliberately no update/delete helper. */
export async function audit(actor: Actor, action: string, entity: string, entityId: string, before?: unknown, after?: unknown, tx: Prisma.TransactionClient | typeof db = db) {
  await tx.auditLog.create({
    data: {
      orgId: actor.orgId, actorId: actor.id ?? null, actorName: actor.name, action, entity, entityId,
      before: before === undefined ? undefined : (JSON.parse(JSON.stringify(before)) as Prisma.InputJsonValue),
      after: after === undefined ? undefined : (JSON.parse(JSON.stringify(after)) as Prisma.InputJsonValue),
      ip: actor.ip ?? null,
    },
  });
}
