import { campaignSettingsRepository } from "@/src/features/campaigns/infrastructure/campaign-settings-repository";

export async function getCampaignSettings(campaignId: string) {
  return campaignSettingsRepository.getByCampaignId(campaignId);
}
