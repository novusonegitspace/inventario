import { captureSettingsRepository } from "@/src/features/campaign-settings/infrastructure/campaign-settings-repository";

export async function getCaptureSettings(campaignId: string) {
  return captureSettingsRepository.getByCampaignId(campaignId);
}

