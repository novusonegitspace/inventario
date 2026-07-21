import { assetRepository } from "@/src/features/assets/infrastructure/asset-repository";

export async function countManualAssets(campaignId: string) {
  return assetRepository.countManualByCampaignId(campaignId);
}
