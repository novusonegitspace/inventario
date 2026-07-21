import "server-only";

import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { listCampaigns } from "@/src/features/campaigns/application/list-campaigns";
import type { Campaign } from "@/src/features/campaigns/domain/campaign";
import { prisma } from "@/src/lib/db/prisma";

type DashboardSeverity = "critical" | "high" | "medium" | "low";

export type DashboardSeverityItem = {
  severity: DashboardSeverity;
  label: string;
  count: number;
};

export type DashboardActivityItem = {
  id: string;
  title: string;
  description: string;
  occurredAt: Date;
};

export type DashboardOverview = {
  totalCampaigns: number;
  activeCampaigns: number;
  totalAssets: number;
  globalProgress: number;
  openFindings: number;
  totalAuditors: number;
  activeCampaignList: Campaign[];
  findingsBySeverity: DashboardSeverityItem[];
  recentActivity: DashboardActivityItem[];
};

const severityOrder: DashboardSeverity[] = [
  "critical",
  "high",
  "medium",
  "low",
];

const severityLabels: Record<DashboardSeverity, string> = {
  critical: "Críticos",
  high: "Altos",
  medium: "Medios",
  low: "Bajos",
};

function buildSeveritySummary(findings: Array<{ severity: string }>) {
  const counters: Record<DashboardSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const finding of findings) {
    const severity = finding.severity.toLowerCase() as DashboardSeverity;

    if (severity in counters) {
      counters[severity] += 1;
    }
  }

  return severityOrder.map((severity) => ({
    severity,
    label: severityLabels[severity],
    count: counters[severity],
  }));
}

function buildCampaignActivity(campaigns: Campaign[]): DashboardActivityItem[] {
  return campaigns.slice(0, 3).map((campaign) => ({
    id: `campaign-${campaign.id}`,
    title: `Campaña ${campaign.name} actualizada`,
    description: `${campaign.clientName} · ${campaign.siteName} · ${campaign.progressPercentage}% de avance.`,
    occurredAt: campaign.updatedAt,
  }));
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const context = await getRequiredAuthContext();

  const [campaigns, findings, recentCaptures, recentEvidence] = await Promise.all([
    listCampaigns(),
    prisma.finding.findMany({
      where: {
        tenantId: context.tenantId,
        status: {
          notIn: ["RESOLVED", "DISMISSED"],
        },
      },
      select: {
        severity: true,
      },
    }),
    prisma.assetCapture.findMany({
      where: {
        tenantId: context.tenantId,
      },
      orderBy: {
        capturedAt: "desc",
      },
      take: 4,
      select: {
        id: true,
        scannedCode: true,
        capturedAt: true,
        asset: {
          select: {
            name: true,
            assetTag: true,
          },
        },
        campaign: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.evidenceFile.findMany({
      where: {
        tenantId: context.tenantId,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      take: 4,
      select: {
        id: true,
        originalFileName: true,
        uploadedAt: true,
        asset: {
          select: {
            name: true,
            assetTag: true,
          },
        },
        campaign: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const captureActivity: DashboardActivityItem[] = recentCaptures.map((capture) => ({
    id: `capture-${capture.id}`,
    title: "Captura móvil registrada",
    description: `${capture.asset?.name ?? capture.asset?.assetTag ?? capture.scannedCode} en ${capture.campaign.name}.`,
    occurredAt: capture.capturedAt,
  }));

  const evidenceActivity: DashboardActivityItem[] = recentEvidence.map((evidence) => ({
    id: `evidence-${evidence.id}`,
    title: "Evidencia asociada a campaña",
    description: `${evidence.originalFileName} vinculado a ${evidence.asset?.name ?? evidence.asset?.assetTag ?? "un activo"} en ${evidence.campaign.name}.`,
    occurredAt: evidence.uploadedAt,
  }));

  const totalAssets = campaigns.reduce((sum, campaign) => sum + campaign.assetCount, 0);
  const totalAuditors = campaigns.reduce((sum, campaign) => sum + campaign.auditorCount, 0);
  const activeCampaignList = campaigns
    .filter((campaign) => campaign.status === "active" || campaign.status === "in_review")
    .slice(0, 5);
  const globalProgress = campaigns.length
    ? Math.round(
        campaigns.reduce(
          (sum, campaign) => sum + campaign.progressPercentage,
          0,
        ) / campaigns.length,
      )
    : 0;
  const recentActivity = [
    ...captureActivity,
    ...evidenceActivity,
    ...buildCampaignActivity(campaigns),
  ]
    .sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime())
    .slice(0, 6);

  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((campaign) => campaign.status === "active").length,
    totalAssets,
    globalProgress,
    openFindings: findings.length,
    totalAuditors,
    activeCampaignList,
    findingsBySeverity: buildSeveritySummary(findings),
    recentActivity,
  };
}
