import type { CampaignStatus } from "@/src/features/campaigns/domain/campaign-status";
import { MvpStatusPill } from "@/src/shared/ui/mvp-status-pill";

export function CampaignStatusBadge({
  status,
}: {
  status: CampaignStatus;
}) {
  return <MvpStatusPill value={status} />;
}
