import { assetRepository } from "@/src/features/assets/infrastructure/asset-repository";

export async function getAssetDetail(campaignId: string, assetId: string) {
  return assetRepository.getById(campaignId, assetId);
}
