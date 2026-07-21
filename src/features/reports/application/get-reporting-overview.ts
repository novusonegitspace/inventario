import "server-only";

import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { listCampaigns } from "@/src/features/campaigns/application/list-campaigns";
import type { Campaign } from "@/src/features/campaigns/domain/campaign";
import { prisma } from "@/src/lib/db/prisma";

export type ReportingExportItem = {
  id: string;
  kind: string;
  status: string;
  campaignName: string;
  createdAt: Date;
};

export type ReportingOverview = {
  reportableCampaigns: number;
  evidenceTotal: number;
  differencesTotal: number;
  averageProgress: number;
  campaignsToReport: Campaign[];
  recentExports: ReportingExportItem[];
};

export async function getReportingOverview(): Promise<ReportingOverview> {
  const context = await getRequiredAuthContext();
  const [campaigns, exportJobs] = await Promise.all([
    listCampaigns(),
    prisma.exportJob.findMany({
      where: {
        tenantId: context.tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      select: {
        id: true,
        kind: true,
        status: true,
        createdAt: true,
        campaign: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const reportable = campaigns.filter((campaign) => campaign.status !== "draft");
  const campaignsToReport = [...reportable]
    .sort(
      (left, right) =>
        right.differenceCount - left.differenceCount ||
        right.evidenceCount - left.evidenceCount ||
        left.progressPercentage - right.progressPercentage,
    )
    .slice(0, 6);

  return {
    reportableCampaigns: reportable.length,
    evidenceTotal: campaigns.reduce((sum, campaign) => sum + campaign.evidenceCount, 0),
    differencesTotal: campaigns.reduce(
      (sum, campaign) => sum + campaign.differenceCount,
      0,
    ),
    averageProgress: campaigns.length
      ? Math.round(
          campaigns.reduce(
            (sum, campaign) => sum + campaign.progressPercentage,
            0,
          ) / campaigns.length,
        )
      : 0,
    campaignsToReport,
    recentExports: exportJobs.map((job) => ({
      id: job.id,
      kind: job.kind,
      status: job.status,
      campaignName: job.campaign?.name ?? "Reporte transversal",
      createdAt: job.createdAt,
    })),
  };
}
