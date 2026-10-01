import { requireSession } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import Scanner from "@/components/Scanner";
export default async function Scan() { await requireSession("asset:read"); return <div><PageHeader title="Scan asset" subtitle="Point the camera at an AssetOps QR label." /><Scanner /></div>; }
