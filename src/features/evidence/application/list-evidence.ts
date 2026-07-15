import { evidenceRepository } from "@/src/features/evidence/infrastructure/evidence-repository";

export async function listCampaignEvidence(campaignId: string) {
  return evidenceRepository.listByCampaignId(campaignId);
}

export async function listEvidence(campaignId: string, assetId: string) {
  return evidenceRepository.listByAssetId(campaignId, assetId);
}
