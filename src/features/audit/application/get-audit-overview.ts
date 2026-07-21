import "server-only";

import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { prisma } from "@/src/lib/db/prisma";

export type AuditActivityItem = {
  id: string;
  title: string;
  description: string;
  occurredAt: Date;
};

export type AuditOverview = {
  captureCount: number;
  geolocatedCaptureCount: number;
  evidenceAvailableCount: number;
  openFindingsCount: number;
  auditLogCount: number;
  recentActivity: AuditActivityItem[];
};

export async function getAuditOverview(): Promise<AuditOverview> {
  const context = await getRequiredAuthContext();

  const [
    captureCount,
    geolocatedCaptureCount,
    evidenceAvailableCount,
    openFindingsCount,
    auditLogCount,
    recentCaptures,
    recentEvidence,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.assetCapture.count({
      where: {
        tenantId: context.tenantId,
      },
    }),
    prisma.assetCapture.count({
      where: {
        tenantId: context.tenantId,
        latitude: {
          not: null,
        },
        longitude: {
          not: null,
        },
      },
    }),
    prisma.evidenceFile.count({
      where: {
        tenantId: context.tenantId,
        status: "AVAILABLE",
      },
    }),
    prisma.finding.count({
      where: {
        tenantId: context.tenantId,
        status: {
          notIn: ["RESOLVED", "DISMISSED"],
        },
      },
    }),
    prisma.auditLog.count({
      where: {
        tenantId: context.tenantId,
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
        campaign: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.auditLog.findMany({
      where: {
        tenantId: context.tenantId,
      },
      orderBy: {
        occurredAt: "desc",
      },
      take: 4,
      select: {
        id: true,
        action: true,
        entityType: true,
        occurredAt: true,
        campaign: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const captureActivity: AuditActivityItem[] = recentCaptures.map((capture) => ({
    id: `capture-${capture.id}`,
    title: "Captura registrada en terreno",
    description: `${capture.asset?.name ?? capture.asset?.assetTag ?? capture.scannedCode} dentro de ${capture.campaign.name}.`,
    occurredAt: capture.capturedAt,
  }));

  const evidenceActivity: AuditActivityItem[] = recentEvidence.map((evidence) => ({
    id: `evidence-${evidence.id}`,
    title: "Nueva evidencia disponible",
    description: `${evidence.originalFileName} quedó asociada a ${evidence.campaign.name}.`,
    occurredAt: evidence.uploadedAt,
  }));

  const logActivity: AuditActivityItem[] = recentAuditLogs.map((log) => ({
    id: `log-${log.id}`,
    title: `Evento técnico ${log.action}`,
    description: `${log.entityType} ${log.campaign?.name ? `en ${log.campaign.name}` : "sin campaña asociada"}.`,
    occurredAt: log.occurredAt,
  }));

  return {
    captureCount,
    geolocatedCaptureCount,
    evidenceAvailableCount,
    openFindingsCount,
    auditLogCount,
    recentActivity: [...captureActivity, ...evidenceActivity, ...logActivity]
      .sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime())
      .slice(0, 8),
  };
}
