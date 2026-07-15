import { captureRepository } from "@/src/features/captures/infrastructure/capture-repository";

export async function listAssetCaptures(campaignId: string, assetId: string) {
  return captureRepository.listByAssetId(campaignId, assetId);
}
