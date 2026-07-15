import type { CampaignStatus } from "@/src/features/campaigns/domain/campaign-status";
import { getCampaignStatusMeta } from "@/src/features/campaigns/domain/campaign-status";
import { Badge } from "@/src/shared/ui/badge";

export function CampaignStatusBadge({
  status,
}: {
  status: CampaignStatus;
}) {
  const meta = getCampaignStatusMeta(status);

  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
