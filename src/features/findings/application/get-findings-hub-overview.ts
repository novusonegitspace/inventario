import "server-only";

import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { prisma } from "@/src/lib/db/prisma";

export type FindingHubItem = {
  id: string;
  title: string;
  severity: string;
  status: string;
  campaignName: string;
  assetName: string;
  createdAt: Date;
};

export type FindingsHubOverview = {
  totalOpen: number;
  critical: number;
  high: number;
  inReview: number;
  resolved: number;
  recentFindings: FindingHubItem[];
};

export async function getFindingsHubOverview(): Promise<FindingsHubOverview> {
  const context = await getRequiredAuthContext();

  const [totalOpen, critical, high, inReview, resolved, recentFindings] =
    await Promise.all([
      prisma.finding.count({
        where: {
          tenantId: context.tenantId,
          status: {
            notIn: ["RESOLVED", "DISMISSED"],
          },
        },
      }),
      prisma.finding.count({
        where: {
          tenantId: context.tenantId,
          severity: "CRITICAL",
          status: {
            notIn: ["RESOLVED", "DISMISSED"],
          },
        },
      }),
      prisma.finding.count({
        where: {
          tenantId: context.tenantId,
          severity: "HIGH",
          status: {
            notIn: ["RESOLVED", "DISMISSED"],
          },
        },
      }),
      prisma.finding.count({
        where: {
          tenantId: context.tenantId,
          status: "IN_REVIEW",
        },
      }),
      prisma.finding.count({
        where: {
          tenantId: context.tenantId,
          status: "RESOLVED",
        },
      }),
      prisma.finding.findMany({
        where: {
          tenantId: context.tenantId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        select: {
          id: true,
          title: true,
          severity: true,
          status: true,
          createdAt: true,
          campaign: {
            select: {
              name: true,
            },
          },
          asset: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

  return {
    totalOpen,
    critical,
    high,
    inReview,
    resolved,
    recentFindings: recentFindings.map((finding) => ({
      id: finding.id,
      title: finding.title,
      severity: finding.severity,
      status: finding.status,
      campaignName: finding.campaign.name,
      assetName: finding.asset?.name ?? "Activo sin vínculo",
      createdAt: finding.createdAt,
    })),
  };
}
