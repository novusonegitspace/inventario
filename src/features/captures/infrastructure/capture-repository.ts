import "server-only";

import { Prisma } from "@prisma/client";

import type {
  AssetCapture,
  CreateAssetCaptureDraft,
} from "@/src/features/captures/domain/asset-capture";
import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { prisma } from "@/src/lib/db/prisma";
import { filterPrismaModelData } from "@/src/lib/db/prisma-model-data";

type CaptureRecord = Prisma.AssetCaptureGetPayload<{
  include: {
    submittedBy: true;
    condition: true;
  };
}>;

function toStringValue(value: Prisma.Decimal | null) {
  return value ? value.toString() : "";
}

function parseCustomFields(value: string | null | undefined): Record<string, string> {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .filter((entry): entry is [string, string] => {
          const [key, item] = entry;
          return typeof key === "string" && typeof item === "string";
        }),
    );
  } catch {
    return {};
  }
}

function mapCaptureRecord(capture: CaptureRecord): AssetCapture {
  return {
    id: capture.id,
    tenantId: capture.tenantId,
    campaignId: capture.campaignId,
    assetId: capture.assetId ?? "",
    submittedByName: capture.submittedBy?.displayName ?? "Usuario de campo",
    scannedCode: capture.scannedCode,
    latitude: toStringValue(capture.latitude),
    longitude: toStringValue(capture.longitude),
    notes: capture.notes ?? "",
    deviceLabel: capture.deviceLabel ?? "",
    capturedAt: capture.capturedAt,
    physicalCondition: capture.condition?.physicalCondition ?? "",
    observedLocation: capture.condition?.observedLocation ?? "",
    observedResponsible: capture.condition?.observedResponsible ?? "",
    observedCostCenter: capture.condition?.observedCostCenter ?? "",
    observedSerialNumber: capture.condition?.observedSerialNumber ?? "",
    conditionNotes: capture.condition?.notes ?? "",
    customFields: parseCustomFields(capture.condition?.customFieldsJson),
  };
}

async function requireAssetScope(campaignId: string, assetId: string) {
  const context = await getRequiredAuthContext();
  const asset = await prisma.asset.findFirst({
    where: {
      id: assetId,
      campaignId,
      tenantId: context.tenantId,
    },
    select: {
      id: true,
      campaignId: true,
      tenantId: true,
    },
  });

  if (!asset) {
    return null;
  }

  return {
    assetId: asset.id,
    campaignId: asset.campaignId,
    tenantId: asset.tenantId,
    userId: context.userId,
  };
}

function toDecimalValue(value: string) {
  return value ? new Prisma.Decimal(value) : null;
}

export const captureRepository = {
  async listByAssetId(campaignId: string, assetId: string) {
    const scope = await requireAssetScope(campaignId, assetId);

    if (!scope) {
      return [];
    }

    const captures = await prisma.assetCapture.findMany({
      where: {
        tenantId: scope.tenantId,
        campaignId: scope.campaignId,
        assetId: scope.assetId,
      },
      orderBy: {
        capturedAt: "desc",
      },
      include: {
        submittedBy: true,
        condition: true,
      },
    });

    return captures.map(mapCaptureRecord);
  },

  async createForAsset(
    campaignId: string,
    assetId: string,
    input: CreateAssetCaptureDraft,
  ) {
    const scope = await requireAssetScope(campaignId, assetId);

    if (!scope) {
      throw new Error("Asset not found for current organization.");
    }

    const capture = await prisma.$transaction(async (tx) => {
      const created = await tx.assetCapture.create({
        data: {
          tenantId: scope.tenantId,
          campaignId: scope.campaignId,
          assetId: scope.assetId,
          submittedById: scope.userId,
          scannedCode: input.scannedCode,
          latitude: toDecimalValue(input.latitude),
          longitude: toDecimalValue(input.longitude),
          notes: input.notes || null,
          deviceLabel: input.deviceLabel || null,
        },
        include: {
          submittedBy: true,
          condition: true,
        },
      });

      await tx.assetCaptureCondition.create({
        data: filterPrismaModelData("AssetCaptureCondition", {
          tenantId: scope.tenantId,
          campaignId: scope.campaignId,
          captureId: created.id,
          physicalCondition: input.physicalCondition || null,
          observedLocation: input.observedLocation || null,
          observedResponsible: input.observedResponsible || null,
          observedCostCenter: input.observedCostCenter || null,
          observedSerialNumber: input.observedSerialNumber || null,
          customFieldsJson:
            Object.keys(input.customFields).length > 0
              ? JSON.stringify(input.customFields)
              : null,
          notes: input.conditionNotes || null,
        }) as Prisma.AssetCaptureConditionUncheckedCreateInput,
      });

      await tx.asset.update({
        where: {
          id: scope.assetId,
        },
        data: {
          latestCaptureAt: created.capturedAt,
        },
      });

      return tx.assetCapture.findUniqueOrThrow({
        where: {
          id: created.id,
        },
        include: {
          submittedBy: true,
          condition: true,
        },
      });
    });

    return mapCaptureRecord(capture);
  },
};
