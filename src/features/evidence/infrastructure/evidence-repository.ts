import "server-only";

import { createHash } from "node:crypto";

import type { Prisma } from "@prisma/client";

import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import type { Evidence } from "@/src/features/evidence/domain/evidence";
import { prisma } from "@/src/lib/db/prisma";

type EvidenceRecord = Prisma.EvidenceFileGetPayload<{
  include: {
    uploadedBy: true;
    capture: true;
  };
}>;

function mapEvidenceRecord(evidence: EvidenceRecord): Evidence {
  return {
    id: evidence.id,
    tenantId: evidence.tenantId,
    campaignId: evidence.campaignId,
    assetId: evidence.assetId ?? "",
    captureId: evidence.captureId ?? "",
    originalFileName: evidence.originalFileName,
    mimeType: evidence.mimeType,
    sizeBytes: Number(evidence.sizeBytes),
    status: evidence.status,
    uploadedAt: evidence.uploadedAt,
    availableAt: evidence.availableAt,
    uploadedByName: evidence.uploadedBy?.displayName ?? "Usuario de campo",
    scannedCode: evidence.capture?.scannedCode ?? "",
    blobPath: evidence.blobPath,
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

export const evidenceRepository = {
  async listByCampaignId(campaignId: string) {
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
      return [];
    }

    const evidenceFiles = await prisma.evidenceFile.findMany({
      where: {
        tenantId: campaign.tenantId,
        campaignId: campaign.id,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      include: {
        uploadedBy: true,
        capture: true,
      },
    });

    return evidenceFiles.map(mapEvidenceRecord);
  },

  async listByAssetId(campaignId: string, assetId: string) {
    const scope = await requireAssetScope(campaignId, assetId);

    if (!scope) {
      return [];
    }

    const evidenceFiles = await prisma.evidenceFile.findMany({
      where: {
        tenantId: scope.tenantId,
        campaignId: scope.campaignId,
        assetId: scope.assetId,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      include: {
        uploadedBy: true,
        capture: true,
      },
    });

    return evidenceFiles.map(mapEvidenceRecord);
  },

  async createForAsset(
    campaignId: string,
    assetId: string,
    captureId: string,
    file: File,
  ) {
    const scope = await requireAssetScope(campaignId, assetId);

    if (!scope) {
      throw new Error("Asset not found for current organization.");
    }

    const capture = await prisma.assetCapture.findFirst({
      where: {
        id: captureId,
        tenantId: scope.tenantId,
        campaignId: scope.campaignId,
        assetId: scope.assetId,
      },
      select: {
        id: true,
      },
    });

    if (!capture) {
      throw new Error("Capture not found for this asset.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sha256 = createHash("sha256").update(buffer).digest("hex");

    const duplicate = await prisma.evidenceFile.findFirst({
      where: {
        tenantId: scope.tenantId,
        sha256,
      },
      select: {
        id: true,
      },
    });

    if (duplicate) {
      throw new Error("This evidence was already registered in the organization.");
    }

    const evidence = await prisma.evidenceFile.create({
      data: {
        tenantId: scope.tenantId,
        campaignId: scope.campaignId,
        assetId: scope.assetId,
        captureId: capture.id,
        uploadedById: scope.userId,
        sha256,
        originalFileName: file.name,
        blobPath: `local://assetlens/evidence/${sha256}/${file.name}`,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: BigInt(file.size),
        status: "AVAILABLE",
        availableAt: new Date(),
      },
      include: {
        uploadedBy: true,
        capture: true,
      },
    });

    return mapEvidenceRecord(evidence);
  },
};
