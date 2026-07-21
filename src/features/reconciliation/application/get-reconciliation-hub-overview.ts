import "server-only";

import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { prisma } from "@/src/lib/db/prisma";

export type ReconciliationHubItem = {
  id: string;
  campaignName: string;
  assetName: string;
  assetTag: string;
  status: string;
  notes: string;
  calculatedAt: Date;
};

export type ReconciliationHubOverview = {
  totalResults: number;
  conciliated: number;
  withDifferences: number;
  notFound: number;
  surplus: number;
  recentIssues: ReconciliationHubItem[];
};

export async function getReconciliationHubOverview(): Promise<ReconciliationHubOverview> {
  const context = await getRequiredAuthContext();

  const [totalResults, conciliated, withDifferences, notFound, surplus, recentIssues] =
    await Promise.all([
      prisma.reconciliationResult.count({
        where: {
          tenantId: context.tenantId,
        },
      }),
      prisma.reconciliationResult.count({
        where: {
          tenantId: context.tenantId,
          status: "CONCILIATED",
        },
      }),
      prisma.reconciliationResult.count({
        where: {
          tenantId: context.tenantId,
          status: "CONCILIATED_WITH_DIFFERENCES",
        },
      }),
      prisma.reconciliationResult.count({
        where: {
          tenantId: context.tenantId,
          status: "NOT_FOUND",
        },
      }),
      prisma.reconciliationResult.count({
        where: {
          tenantId: context.tenantId,
          status: "SURPLUS",
        },
      }),
      prisma.reconciliationResult.findMany({
        where: {
          tenantId: context.tenantId,
          status: {
            in: ["CONCILIATED_WITH_DIFFERENCES", "NOT_FOUND", "SURPLUS"],
          },
        },
        orderBy: {
          calculatedAt: "desc",
        },
        take: 10,
        select: {
          id: true,
          status: true,
          notes: true,
          calculatedAt: true,
          campaign: {
            select: {
              name: true,
            },
          },
          asset: {
            select: {
              name: true,
              assetTag: true,
            },
          },
        },
      }),
    ]);

  return {
    totalResults,
    conciliated,
    withDifferences,
    notFound,
    surplus,
    recentIssues: recentIssues.map((item) => ({
      id: item.id,
      campaignName: item.campaign.name,
      assetName: item.asset?.name ?? "Activo sin nombre",
      assetTag: item.asset?.assetTag ?? "Sin etiqueta",
      status: item.status,
      notes: item.notes ?? "Sin observaciones registradas.",
      calculatedAt: item.calculatedAt,
    })),
  };
}
