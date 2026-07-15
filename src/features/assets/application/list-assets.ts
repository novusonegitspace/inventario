import type { Asset } from "@/src/features/assets/domain/asset";
import { assetRepository } from "@/src/features/assets/infrastructure/asset-repository";

export type AssetsOverview = {
  total: number;
  withResponsible: number;
  withLocation: number;
  pendingCapture: number;
};

export async function listAssets(campaignId: string) {
  return assetRepository.listByCampaignId(campaignId);
}

export function summarizeAssets(assets: Asset[]): AssetsOverview {
  return {
    total: assets.length,
    withResponsible: assets.filter((asset) => Boolean(asset.responsible)).length,
    withLocation: assets.filter((asset) => Boolean(asset.location)).length,
    pendingCapture: assets.filter((asset) => asset.captureCount === 0).length,
  };
}

export async function getAssetsOverview(campaignId: string) {
  const assets = await assetRepository.listByCampaignId(campaignId);

  return summarizeAssets(assets);
}
