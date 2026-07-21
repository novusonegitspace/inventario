import "server-only";

import type { Prisma } from "@prisma/client";

import type {
  Campaign,
  CreateCampaignDraft,
  InventoryMode,
} from "@/src/features/campaigns/domain/campaign";
import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import { getPresetForMode } from "@/src/features/campaign-settings/domain/capture-settings";
import { prisma } from "@/src/lib/db/prisma";
import { filterPrismaModelData } from "@/src/lib/db/prisma-model-data";

export type CampaignRepository = {
  list(): Promise<Campaign[]>;
  getById(id: string): Promise<Campaign | null>;
  create(input: CreateCampaignDraft): Promise<Campaign>;
  activate(id: string): Promise<Campaign | null>;
};

function mapCampaignStatus(status: string) {
  if (status === "ACTIVE") {
    return "active";
  }

  if (status === "IN_REVIEW") {
    return "in_review";
  }

  if (status === "COMPLETED") {
    return "completed";
  }

  if (status === "CLOSED") {
    return "closed";
  }

  return "draft";
}

function mapInventoryMode(mode: string): InventoryMode {
  if (mode === "FULL_AUDIT" || mode === "CYCLE_COUNT") {
    return "full_audit";
  }

  if (mode === "CUSTOM" || mode === "SELECTIVE") {
    return "custom";
  }

  return "simple_count";
}

function mapInventoryModeForDb(mode: InventoryMode) {
  if (mode === "full_audit") {
    return "FULL_AUDIT";
  }

  if (mode === "custom") {
    return "CUSTOM";
  }

  return "SIMPLE_COUNT";
}

function normalizeClientCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

function mapAssetManagementMethodForDb(method: string) {
  if (method === "manual_only") {
    return "MANUAL_ONLY";
  }

  if (method === "hybrid") {
    return "HYBRID";
  }

  return "BULK_ONLY";
}

function mapEvidenceRequirementForDb(requirement: string) {
  if (requirement === "required") {
    return "REQUIRED";
  }

  if (requirement === "not_applicable") {
    return "NOT_APPLICABLE";
  }

  if (requirement === "required_when_difference") {
    return "REQUIRED_WHEN_DIFFERENCE";
  }

  return "OPTIONAL";
}

function mapFieldRequirementForDb(requirement: string) {
  if (requirement === "required") {
    return "REQUIRED";
  }

  if (requirement === "not_applicable") {
    return "NOT_APPLICABLE";
  }

  return "OPTIONAL";
}

function fieldData(
  tenantId: string,
  campaignId: string,
  field: ReturnType<typeof getPresetForMode>["fields"][number],
  index: number,
) {
  return filterPrismaModelData("CampaignInventoryField", {
    tenantId,
    campaignId,
    key: field.key,
    label: field.label,
    dataType: field.dataType.toUpperCase(),
    requirement: mapFieldRequirementForDb(field.requirement),
    helpText: field.helpText || null,
    optionsJson: field.options.length > 0 ? JSON.stringify(field.options) : null,
    defaultValue: field.defaultValue || null,
    showInMobileCapture: field.showInMobileCapture,
    showInAssetDetail: field.showInAssetDetail,
    showInReports: field.showInReports,
    visibilityConditionJson: field.visibilityCondition || null,
    isSystem: field.isSystem,
    scope: field.scope.toUpperCase(),
    isRequired: field.requirement === "required",
    isVisible: field.requirement !== "not_applicable",
    position: index,
  });
}

type CampaignRecord = Prisma.CampaignGetPayload<{
  include: {
    client: true;
    _count: {
      select: {
        auditors: true;
        assets: true;
        captures: true;
        evidenceFiles: true;
        findings: true;
      };
    };
  };
}>;

function mapCampaignRecord(campaign: CampaignRecord): Campaign {
  return {
    id: campaign.id,
    tenantId: campaign.tenantId,
    name: campaign.name,
    code: campaign.code,
    status: mapCampaignStatus(campaign.status),
    clientName: campaign.client?.name ?? "Sin cliente",
    siteName: campaign.siteName ?? "Sitio por definir",
    inventoryMode: mapInventoryMode(campaign.inventoryMode),
    auditorCount: campaign._count.auditors,
    assetCount: campaign._count.assets,
    captureCount: campaign._count.captures,
    evidenceCount: campaign._count.evidenceFiles,
    differenceCount: campaign._count.findings,
    progressPercentage: campaign.progressPercentage,
    scheduledStartAt: campaign.scheduledStartAt,
    scheduledEndAt: campaign.scheduledEndAt,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
  };
}

export const campaignRepository: CampaignRepository = {
  async list() {
    const context = await getRequiredAuthContext();
    const campaigns = await prisma.campaign.findMany({
      where: {
        tenantId: context.tenantId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        client: true,
        _count: {
          select: {
            auditors: true,
            assets: true,
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    return campaigns.map(mapCampaignRecord);
  },

  async getById(id) {
    const context = await getRequiredAuthContext();
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        tenantId: context.tenantId,
      },
      include: {
        client: true,
        _count: {
          select: {
            auditors: true,
            assets: true,
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    if (!campaign) {
      return null;
    }

    return mapCampaignRecord(campaign);
  },

  async create(input) {
    const context = await getRequiredAuthContext();
    const clientCode = normalizeClientCode(input.clientName);
    const capturePreset = getPresetForMode(input.inventoryMode);
    const captureRequiresPhoto =
      capturePreset.primaryPhotoRequirement === "required" ||
      capturePreset.additionalPhotosRequirement === "required";
    const allowManualAssets =
      capturePreset.assetManagementMethod === "manual_only" ||
      capturePreset.assetManagementMethod === "hybrid";
    const settingsCreateData = filterPrismaModelData(
      "CampaignSettings",
      {
        tenantId: context.tenantId,
        assetManagementMethod: mapAssetManagementMethodForDb(
          capturePreset.assetManagementMethod,
        ),
        allowOfflineCapture: capturePreset.allowOfflineCapture,
        allowEditRecords: capturePreset.allowEditRecords,
        requireSupervisorReview: capturePreset.requireSupervisorReview,
        autoCloseCampaign: capturePreset.autoCloseCampaign,
        allowSurplusAssets: capturePreset.allowSurplusAssets,
        manualAssetLimit: capturePreset.manualAssetLimit,
        primaryPhotoRequirement: mapEvidenceRequirementForDb(
          capturePreset.primaryPhotoRequirement,
        ),
        additionalPhotosRequirement: mapEvidenceRequirementForDb(
          capturePreset.additionalPhotosRequirement,
        ),
        additionalPhotosMin: capturePreset.additionalPhotosMin,
        otherFilesRequirement: mapEvidenceRequirementForDb(
          capturePreset.otherFilesRequirement,
        ),
        photoObservationRule: mapEvidenceRequirementForDb(
          capturePreset.photoObservationRule,
        ),
        conditionOptionsJson: JSON.stringify(
          capturePreset.conditionOptions,
        ),
        conditionRequiresObservationRule:
          capturePreset.conditionRequiresObservationRule,
        captureRequiresPhoto,
        captureRequiresGeo: capturePreset.fields.some(
          (field) =>
            field.key === "observed_location" &&
            field.requirement !== "not_applicable",
        ),
        allowManualAssets,
        closeBlocksCaptures: !capturePreset.allowEditRecords,
      },
    ) as Prisma.CampaignSettingsUncheckedCreateWithoutCampaignInput;

    const client = await prisma.client.upsert({
      where: {
        tenantId_code: {
          tenantId: context.tenantId,
          code: clientCode,
        },
      },
      update: {
        name: input.clientName,
        isActive: true,
      },
      create: {
        tenantId: context.tenantId,
        code: clientCode,
        name: input.clientName,
      },
    });

    const campaign = await prisma.campaign.create({
      data: {
        tenantId: context.tenantId,
        clientId: client.id,
        createdById: context.userId,
        code: input.code,
        name: input.name,
        description: input.description || null,
        siteName: input.siteName,
        status: "DRAFT",
        inventoryMode: mapInventoryModeForDb(input.inventoryMode),
        scheduledStartAt: input.scheduledStartAt
          ? new Date(`${input.scheduledStartAt}T09:00:00.000Z`)
          : null,
        scheduledEndAt: input.scheduledEndAt
          ? new Date(`${input.scheduledEndAt}T18:00:00.000Z`)
          : null,
        settings: {
          create: settingsCreateData,
        },
      },
      include: {
        client: true,
        _count: {
          select: {
            auditors: true,
            assets: true,
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    if (capturePreset.fields.length > 0) {
      await prisma.campaignInventoryField.createMany({
        data: capturePreset.fields.map((fieldItem, index) =>
          fieldData(
            context.tenantId,
            campaign.id,
            fieldItem,
            index,
          ) as Prisma.CampaignInventoryFieldCreateManyInput,
        ),
      });
    }

    return mapCampaignRecord(campaign);
  },

  async activate(id) {
    const context = await getRequiredAuthContext();

    const existing = await prisma.campaign.findFirst({
      where: {
        id,
        tenantId: context.tenantId,
      },
      include: {
        client: true,
        _count: {
          select: {
            auditors: true,
            assets: true,
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    if (!existing) {
      return null;
    }

    if (existing.status === "ACTIVE") {
      return mapCampaignRecord(existing);
    }

    const campaign = await prisma.campaign.update({
      where: {
        id: existing.id,
      },
      data: {
        status: "ACTIVE",
        startedAt: existing.startedAt ?? new Date(),
      },
      include: {
        client: true,
        _count: {
          select: {
            auditors: true,
            assets: true,
            captures: true,
            evidenceFiles: true,
            findings: true,
          },
        },
      },
    });

    return mapCampaignRecord(campaign);
  },
};
