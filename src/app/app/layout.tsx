import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Shell from "@/components/Shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/sign-in");
  const [org, unread] = await Promise.all([db.organization.findUniqueOrThrow({ where: { id: s.orgId } }), db.notification.count({ where: { orgId: s.orgId, readAt: null } })]);
  return <Shell user={{ name: s.name, role: s.role, org: org.name, isDemo: org.isDemo }} unread={unread}>{children}</Shell>;
}
