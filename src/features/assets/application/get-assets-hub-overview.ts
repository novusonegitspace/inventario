import "server-only";

import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { prisma } from "@/src/lib/db/prisma";

export type AssetHubItem = {
  id: string;
  name: string;
  assetTag: string;
  campaignName: string;
  location: string;
  responsible: string;
  captureCount: number;
  evidenceCount: number;
  findingCount: number;
  latestCaptureAt: Date | null;
};

export type AssetsHubOverview = {
  totalAssets: number;
  capturedAssets: number;
  pendingAssets: number;
  assetsWithEvidence: number;
  recentAssets: AssetHubItem[];
};

export async function getAssetsHubOverview(): Promise<AssetsHubOverview> {
  const context = await getRequiredAuthContext();

  const [totalAssets, capturedAssets, assetsWithEvidence, recentAssets] =
    await Promise.all([
      prisma.asset.count({
        where: {
          tenantId: context.tenantId,
        },
      }),
      prisma.asset.count({
        where: {
          tenantId: context.tenantId,
          latestCaptureAt: {
            not: null,
          },
        },
      }),
      prisma.asset.count({
        where: {
          tenantId: context.tenantId,
          evidenceFiles: {
            some: {},
          },
        },
      }),
      prisma.asset.findMany({
        where: {
          tenantId: context.tenantId,
        },
        orderBy: [{ updatedAt: "desc" }, { assetTag: "asc" }],
        take: 10,
        select: {
          id: true,
          name: true,
          assetTag: true,
          location: true,
          responsible: true,
          latestCaptureAt: true,
          campaign: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              captures: true,
              evidenceFiles: true,
              findings: true,
            },
          },
        },
      }),
    ]);

  return {
    totalAssets,
    capturedAssets,
    pendingAssets: Math.max(totalAssets - capturedAssets, 0),
    assetsWithEvidence,
    recentAssets: recentAssets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      assetTag: asset.assetTag,
      campaignName: asset.campaign.name,
      location: asset.location ?? "Ubicación por definir",
      responsible: asset.responsible ?? "Responsable por definir",
      captureCount: asset._count.captures,
      evidenceCount: asset._count.evidenceFiles,
      findingCount: asset._count.findings,
      latestCaptureAt: asset.latestCaptureAt,
    })),
  };
}
