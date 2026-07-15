import type { Campaign } from "@/src/features/campaigns/domain/campaign";
import { campaignRepository } from "@/src/features/campaigns/infrastructure/campaign-repository";

export type CampaignsOverview = {
  total: number;
  active: number;
  totalAssets: number;
  averageProgress: number;
};

export async function listCampaigns() {
  return campaignRepository.list();
}

export async function getCampaignsOverview(): Promise<CampaignsOverview> {
  const campaigns = await campaignRepository.list();

  return summarizeCampaigns(campaigns);
}

export function summarizeCampaigns(campaigns: Campaign[]): CampaignsOverview {
  const totalAssets = campaigns.reduce(
    (sum, campaign) => sum + campaign.assetCount,
    0,
  );
  const progressTotal = campaigns.reduce(
    (sum, campaign) => sum + campaign.progressPercentage,
    0,
  );

  return {
    total: campaigns.length,
    active: campaigns.filter((campaign) => campaign.status === "active").length,
    totalAssets,
    averageProgress: campaigns.length
      ? Math.round(progressTotal / campaigns.length)
      : 0,
  };
}
