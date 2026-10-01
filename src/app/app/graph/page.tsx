import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { assetGraph } from "@/lib/services/graph";
import { EmptyState, Forbidden, PageHeader, Card } from "@/components/ui";
import GraphView from "@/components/GraphView";

export const dynamic = "force-dynamic";
export default async function Graph({ searchParams }: { searchParams: Promise<{ asset?: string }> }) {
  const s = await requireSession();
  if (!can(s.role, "asset:read")) return <Forbidden what="the asset graph" />;
  const g = await assetGraph(s, (await searchParams).asset);
  return <div><PageHeader title="Asset relationship graph" subtitle="See problems that individual tickets cannot. Click a node to open it." />
    {g.nodes.length === 0 ? <Card><EmptyState title="No relationships yet" body="Link assets to network devices to see shared-infrastructure patterns." /></Card> : <GraphView {...g} />}</div>;
}
