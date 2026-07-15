import "server-only";

import type { Prisma } from "@prisma/client";

import { matchesAssetCode } from "@/src/features/assets/domain/asset";
import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import type { ReconciliationResultItem } from "@/src/features/reconciliation/domain/reconciliation";
import { prisma } from "@/src/lib/db/prisma";

type ReconciliationRecord = Prisma.ReconciliationResultGetPayload<{
  include: {
    asset: true;
    capture: true;
  };
}>;

function mapReconciliationRecord(
  result: ReconciliationRecord,
): ReconciliationResultItem {
  return {
    id: result.id,
    campaignId: result.campaignId,
    assetId: result.assetId ?? "",
    assetTag: result.asset?.assetTag ?? "Sin etiqueta",
    assetBarcode: result.asset?.barcode ?? "",
    assetName: result.asset?.name ?? "Activo sin nombre",
    captureId: result.captureId ?? "",
    captureCode: result.capture?.scannedCode ?? "",
    status: result.status as ReconciliationResultItem["status"],
    snapshotVersion: result.snapshotVersion,
    matchedByCode: result.matchedByCode,
    locationMatches: result.locationMatches,
    responsibleMatches: result.responsibleMatches,
    physicalConditionMatches: result.physicalConditionMatches,
    costCenterMatches: result.costCenterMatches,
    serialNumberMatches: result.serialNumberMatches,
    notes: result.notes ?? "",
    calculatedAt: result.calculatedAt,
  };
}

async function requireCampaignScope(campaignId: string) {
  const context = await getRequiredAuthContext();
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignId,
      tenantId: context.tenantId,
    },
    select: {
      id: true,
      tenantId: true,
    },
  });

  if (!campaign) {
    return null;
  }

  return {
    campaignId: campaign.id,
    tenantId: campaign.tenantId,
  };
}

function buildNotes(flags: Array<{ label: string; value: boolean | null }>) {
  const differences = flags
    .filter((flag) => flag.value === false)
    .map((flag) => flag.label);

  if (differences.length === 0) {
    return "Sin diferencias detectadas en los campos comparados.";
  }

  return `Diferencias detectadas en: ${differences.join(", ")}.`;
}

export const reconciliationRepository = {
  async getLatestSnapshot(campaignId: string) {
    const scope = await requireCampaignScope(campaignId);

    if (!scope) {
      return [];
    }

    const latest = await prisma.reconciliationResult.findFirst({
      where: {
        tenantId: scope.tenantId,
        campaignId: scope.campaignId,
      },
      orderBy: [{ snapshotVersion: "desc" }, { calculatedAt: "desc" }],
      select: {
        snapshotVersion: true,
      },
    });

    if (!latest) {
      return [];
    }

    const results = await prisma.reconciliationResult.findMany({
      where: {
        tenantId: scope.tenantId,
        campaignId: scope.campaignId,
        snapshotVersion: latest.snapshotVersion,
      },
      orderBy: [{ status: "asc" }, { calculatedAt: "desc" }],
      include: {
        asset: true,
        capture: true,
      },
    });

    return results.map(mapReconciliationRecord);
  },

  async recalculate(campaignId: string) {
    const scope = await requireCampaignScope(campaignId);

    if (!scope) {
      throw new Error("Campaign not found for current organization.");
    }

    const [existing, assets] = await Promise.all([
      prisma.reconciliationResult.findFirst({
        where: {
          tenantId: scope.tenantId,
          campaignId: scope.campaignId,
        },
        orderBy: [{ snapshotVersion: "desc" }, { calculatedAt: "desc" }],
        select: {
          snapshotVersion: true,
        },
      }),
      prisma.asset.findMany({
        where: {
          tenantId: scope.tenantId,
          campaignId: scope.campaignId,
        },
        include: {
          captures: {
            orderBy: {
              capturedAt: "desc",
            },
            take: 1,
            include: {
              condition: true,
            },
          },
        },
      }),
    ]);

    const snapshotVersion = (existing?.snapshotVersion ?? 0) + 1;
    const now = new Date();

    if (assets.length === 0) {
      return [];
    }

    await prisma.$transaction(async (tx) => {
      for (const asset of assets) {
        const latestCapture = asset.captures[0];

        if (!latestCapture) {
          await tx.reconciliationResult.create({
            data: {
              tenantId: scope.tenantId,
              campaignId: scope.campaignId,
              assetId: asset.id,
              status: "NOT_FOUND",
              snapshotVersion,
              matchedByCode: false,
              notes: "No existe captura registrada para este activo.",
              calculatedAt: now,
            },
          });
          continue;
        }

        const locationMatches = latestCapture.condition?.observedLocation
          ? latestCapture.condition.observedLocation === asset.location
          : null;
        const responsibleMatches = latestCapture.condition?.observedResponsible
          ? latestCapture.condition.observedResponsible === asset.responsible
          : null;
        const costCenterMatches = latestCapture.condition?.observedCostCenter
          ? latestCapture.condition.observedCostCenter === asset.costCenter
          : null;
        const serialNumberMatches = latestCapture.condition?.observedSerialNumber
          ? latestCapture.condition.observedSerialNumber === asset.serialNumber
          : null;
        const matchedByCode = matchesAssetCode(latestCapture.scannedCode, {
          barcode: asset.barcode ?? "",
          assetTag: asset.assetTag,
        });
        const flags = [
          { label: "código", value: matchedByCode },
          { label: "ubicación", value: locationMatches },
          { label: "responsable", value: responsibleMatches },
          { label: "centro de costo", value: costCenterMatches },
          { label: "serie", value: serialNumberMatches },
        ];

        const hasDifferences = flags.some((flag) => flag.value === false);

        await tx.reconciliationResult.create({
          data: {
            tenantId: scope.tenantId,
            campaignId: scope.campaignId,
            assetId: asset.id,
            captureId: latestCapture.id,
            status: hasDifferences
              ? "CONCILIATED_WITH_DIFFERENCES"
              : "CONCILIATED",
            snapshotVersion,
            matchedByCode,
            locationMatches,
            responsibleMatches,
            physicalConditionMatches: null,
            costCenterMatches,
            serialNumberMatches,
            notes: buildNotes(flags),
            calculatedAt: now,
          },
        });
      }
    });

    return this.getLatestSnapshot(campaignId);
  },
};
