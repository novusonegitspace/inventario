import "server-only";

import { Prisma } from "@prisma/client";

import type { Asset, CreateAssetDraft } from "@/src/features/assets/domain/asset";
import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { prisma } from "@/src/lib/db/prisma";

export type AssetRepository = {
  listByCampaignId(campaignId: string): Promise<Asset[]>;
  countManualByCampaignId(campaignId: string): Promise<number>;
  getById(campaignId: string, assetId: string): Promise<Asset | null>;
  findByBarcodeOrTag(campaignId: string, code: string): Promise<Asset | null>;
  create(campaignId: string, input: CreateAssetDraft): Promise<Asset>;
};

export class DuplicateAssetError extends Error {
  constructor() {
    super("Duplicate asset");
    this.name = "DuplicateAssetError";
  }
}

type AssetRecord = Prisma.AssetGetPayload<{
  include: {
    _count: {
      select: {
        captures: true;
        evidenceFiles: true;
        findings: true;
      };
    };
  };
}>;

function mapAssetRecord(asset: AssetRecord): Asset {
  return {
    id: asset.id,
    tenantId: asset.tenantId,
    campaignId: asset.campaignId,
    assetTag: asset.assetTag,
    barcode: asset.barcode ?? "",
    name: asset.name,
    serialNumber: asset.serialNumber ?? "",
    location: asset.location ?? "",
    responsible: asset.responsible ?? "",
    costCenter: asset.costCenter ?? "",
    isActive: asset.isActive,
    latestCaptureAt: asset.latestCaptureAt,
    captureCount: asset._count.captures,
    evidenceCount: asset._count.evidenceFiles,
    findingCount: asset._count.findings,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
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

export const assetRepository: AssetRepository = {
  async listByCampaignId(campaignId) {
    const scope = await requireCampaignScope(campaignId);

    if (!scope) {
      return [];
    }

    const assets = await prisma.asset.findMany({
      where: {
        tenantId: scope.tenantId,
        campaignId: scope.campaignId,
      },
      orderBy: [{ updatedAt: "desc" }, { assetTag: "asc" }],
      include: {
        _count: {
          select: {
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    return assets.map(mapAssetRecord);
  },

  async countManualByCampaignId(campaignId) {
    const scope = await requireCampaignScope(campaignId);

    if (!scope) {
      return 0;
    }

    return prisma.asset.count({
      where: {
        tenantId: scope.tenantId,
        campaignId: scope.campaignId,
        assetMasterRowId: null,
      },
    });
  },

  async getById(campaignId, assetId) {
    const scope = await requireCampaignScope(campaignId);

    if (!scope) {
      return null;
    }

    const asset = await prisma.asset.findFirst({
      where: {
        id: assetId,
        campaignId: scope.campaignId,
        tenantId: scope.tenantId,
      },
      include: {
        _count: {
          select: {
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    if (!asset) {
      return null;
    }

    return mapAssetRecord(asset);
  },

  async findByBarcodeOrTag(campaignId, code) {
    const scope = await requireCampaignScope(campaignId);

    if (!scope || !code) {
      return null;
    }

    const asset = await prisma.asset.findFirst({
      where: {
        tenantId: scope.tenantId,
        campaignId: scope.campaignId,
        OR: [{ barcode: code }, { assetTag: code }],
      },
      include: {
        _count: {
          select: {
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    if (!asset) {
      return null;
    }

    return mapAssetRecord(asset);
  },

  async create(campaignId, input) {
    const scope = await requireCampaignScope(campaignId);

    if (!scope) {
      throw new Error("Campaign not found for current organization.");
    }

    try {
      const asset = await prisma.asset.create({
        data: {
          tenantId: scope.tenantId,
          campaignId: scope.campaignId,
          assetTag: input.assetTag,
          barcode: input.barcode || null,
          name: input.name,
          serialNumber: input.serialNumber || null,
          location: input.location || null,
          responsible: input.responsible || null,
          costCenter: input.costCenter || null,
        },
        include: {
          _count: {
            select: {
              captures: true,
              evidenceFiles: true,
              findings: true,
            },
          },
        },
      });

      return mapAssetRecord(asset);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new DuplicateAssetError();
      }

      throw error;
    }
  },
};
