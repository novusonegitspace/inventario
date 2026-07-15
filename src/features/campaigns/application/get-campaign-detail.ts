import { campaignRepository } from "@/src/features/campaigns/infrastructure/campaign-repository";

export async function getCampaignDetail(campaignId: string) {
  return campaignRepository.getById(campaignId);
}
