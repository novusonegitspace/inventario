import "server-only";

import type { Prisma } from "@prisma/client";

import { getRequiredAuthContext } from "@/src/features/auth/auth-context";
import {
  defaultConditionOptions,
  getPresetForMode,
  isInventoryMode,
  type AssetManagementMethod,
  type CaptureField,
  type CaptureSettings,
  type CaptureSettingsInput,
  type ConditionOption,
  type EvidenceRequirement,
  type FieldDataType,
  type FieldRequirement,
  type FieldScope,
  type InventoryMode,
} from "@/src/features/campaign-settings/domain/capture-settings";
import { prisma } from "@/src/lib/db/prisma";
import { filterPrismaModelData } from "@/src/lib/db/prisma-model-data";

type CampaignSettingsRecord = Prisma.CampaignGetPayload<{
  include: {
    settings: true;
    inventoryFields: {
      orderBy: {
        position: "asc";
      };
    };
  };
}>;

function mapInventoryMode(value: string): InventoryMode {
  const normalized = value.toLowerCase();

  if (isInventoryMode(normalized)) {
    return normalized;
  }

  if (value === "FULL_AUDIT" || value === "FULL_COUNT" || value === "CYCLE_COUNT") {
    return "full_audit";
  }

  if (value === "CUSTOM" || value === "SELECTIVE") {
    return "custom";
  }

  return "simple_count";
}

function mapInventoryModeForDb(value: InventoryMode) {
  if (value === "full_audit") {
    return "FULL_AUDIT";
  }

  if (value === "custom") {
    return "CUSTOM";
  }

  return "SIMPLE_COUNT";
}

function mapAssetManagementMethod(value: string | null | undefined): AssetManagementMethod {
  if (!value) {
    return "bulk_only";
  }

  if (value === "MANUAL_ONLY" || value.toLowerCase() === "manual_only") {
    return "manual_only";
  }

  if (value === "HYBRID" || value.toLowerCase() === "hybrid") {
    return "hybrid";
  }

  return "bulk_only";
}

function mapAssetManagementMethodForDb(value: AssetManagementMethod) {
  if (value === "manual_only") {
    return "MANUAL_ONLY";
  }

  if (value === "hybrid") {
    return "HYBRID";
  }

  return "BULK_ONLY";
}

function mapFieldRequirement(value: string | null | undefined, isRequired: boolean): FieldRequirement {
  if (value === "REQUIRED" || value === "required") {
    return "required";
  }

  if (value === "NOT_APPLICABLE" || value === "not_applicable") {
    return "not_applicable";
  }

  return isRequired ? "required" : "optional";
}

function mapFieldRequirementForDb(value: FieldRequirement) {
  if (value === "required") {
    return "REQUIRED";
  }

  if (value === "not_applicable") {
    return "NOT_APPLICABLE";
  }

  return "OPTIONAL";
}

function mapEvidenceRequirement(value: string | null | undefined): EvidenceRequirement {
  if (value === "REQUIRED" || value === "required") {
    return "required";
  }

  if (value === "NOT_APPLICABLE" || value === "not_applicable") {
    return "not_applicable";
  }

  if (value === "REQUIRED_WHEN_DIFFERENCE" || value === "required_when_difference") {
    return "required_when_difference";
  }

  return "optional";
}

function mapEvidenceRequirementForDb(value: EvidenceRequirement) {
  if (value === "required") {
    return "REQUIRED";
  }

  if (value === "not_applicable") {
    return "NOT_APPLICABLE";
  }

  if (value === "required_when_difference") {
    return "REQUIRED_WHEN_DIFFERENCE";
  }

  return "OPTIONAL";
}

function mapFieldDataType(value: string): FieldDataType {
  const normalized = value.toLowerCase();

  if (
    normalized === "number" ||
    normalized === "date" ||
    normalized === "boolean" ||
    normalized === "select" ||
    normalized === "file"
  ) {
    return normalized;
  }

  return "text";
}

function mapFieldScope(value: string | null | undefined): FieldScope {
  if (value === "SURPLUS" || value === "surplus") {
    return "surplus";
  }

  if (value === "BOTH" || value === "both") {
    return "both";
  }

  return "capture";
}

function parseStringList(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parseConditionOptions(value: string | null | undefined): ConditionOption[] {
  if (!value) {
    return defaultConditionOptions;
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return defaultConditionOptions;
    }

    return parsed
      .filter((item): item is ConditionOption => {
        return (
          typeof item?.key === "string" &&
          typeof item?.label === "string" &&
          typeof item?.description === "string" &&
          typeof item?.color === "string" &&
          typeof item?.exampleQuantity === "number"
        );
      })
      .slice(0, 8);
  } catch {
    return defaultConditionOptions;
  }
}

function mapField(record: CampaignSettingsRecord["inventoryFields"][number]): CaptureField {
  return {
    id: record.id,
    key: record.key,
    label: record.label,
    dataType: mapFieldDataType(record.dataType),
    requirement: mapFieldRequirement(record.requirement, record.isRequired),
    helpText: record.helpText ?? "",
    options: parseStringList(record.optionsJson),
    defaultValue: record.defaultValue ?? "",
    showInMobileCapture: record.showInMobileCapture ?? record.isVisible ?? true,
    showInAssetDetail: record.showInAssetDetail ?? true,
    showInReports: record.showInReports ?? true,
    visibilityCondition: record.visibilityConditionJson ?? "",
    isSystem: record.isSystem ?? false,
    scope: mapFieldScope(record.scope),
    position: record.position,
  };
}

function settingsData(
  tenantId: string,
  campaignId: string,
  input: CaptureSettingsInput,
) {
  const requiresPhoto =
    input.primaryPhotoRequirement === "required" ||
    input.additionalPhotosRequirement === "required";

  return filterPrismaModelData("CampaignSettings", {
    tenantId,
    campaignId,
    assetManagementMethod: mapAssetManagementMethodForDb(input.assetManagementMethod),
    allowOfflineCapture: input.allowOfflineCapture,
    allowEditRecords: input.allowEditRecords,
    requireSupervisorReview: input.requireSupervisorReview,
    autoCloseCampaign: input.autoCloseCampaign,
    allowSurplusAssets: input.allowSurplusAssets,
    manualAssetLimit: input.manualAssetLimit,
    primaryPhotoRequirement: mapEvidenceRequirementForDb(input.primaryPhotoRequirement),
    additionalPhotosRequirement: mapEvidenceRequirementForDb(input.additionalPhotosRequirement),
    additionalPhotosMin: input.additionalPhotosMin,
    otherFilesRequirement: mapEvidenceRequirementForDb(input.otherFilesRequirement),
    photoObservationRule: mapEvidenceRequirementForDb(input.photoObservationRule),
    conditionOptionsJson: JSON.stringify(input.conditionOptions),
    conditionRequiresObservationRule: input.conditionRequiresObservationRule,
    captureRequiresPhoto: requiresPhoto,
    captureRequiresGeo: input.fields.some((field) => field.key === "observed_location"),
    allowManualAssets:
      input.assetManagementMethod === "manual_only" ||
      input.assetManagementMethod === "hybrid",
    closeBlocksCaptures: !input.allowEditRecords,
    notes: input.notes || null,
  });
}

function fieldData(tenantId: string, campaignId: string, field: CaptureField) {
  const requirement = mapFieldRequirementForDb(field.requirement);

  return filterPrismaModelData("CampaignInventoryField", {
    tenantId,
    campaignId,
    key: field.key,
    label: field.label,
    dataType: field.dataType.toUpperCase(),
    requirement,
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
    position: field.position,
  });
}

function mapRecord(record: CampaignSettingsRecord): CaptureSettings {
  const mode = mapInventoryMode(record.inventoryMode);
  const preset = getPresetForMode(mode);
  const settings = record.settings;

  if (!settings) {
    return {
      ...preset,
      campaignId: record.id,
      updatedAt: record.updatedAt,
    };
  }

  const fields = record.inventoryFields.map(mapField);

  return {
    campaignId: record.id,
    inventoryMode: mode,
    assetManagementMethod: mapAssetManagementMethod(settings.assetManagementMethod),
    allowOfflineCapture: settings.allowOfflineCapture,
    allowEditRecords: settings.allowEditRecords,
    requireSupervisorReview: settings.requireSupervisorReview,
    autoCloseCampaign: settings.autoCloseCampaign,
    allowSurplusAssets: settings.allowSurplusAssets,
    manualAssetLimit: settings.manualAssetLimit,
    primaryPhotoRequirement: mapEvidenceRequirement(settings.primaryPhotoRequirement),
    additionalPhotosRequirement: mapEvidenceRequirement(settings.additionalPhotosRequirement),
    additionalPhotosMin: settings.additionalPhotosMin,
    otherFilesRequirement: mapEvidenceRequirement(settings.otherFilesRequirement),
    photoObservationRule: mapEvidenceRequirement(settings.photoObservationRule),
    conditionOptions: parseConditionOptions(settings.conditionOptionsJson),
    conditionRequiresObservationRule:
      settings.conditionRequiresObservationRule ?? preset.conditionRequiresObservationRule,
    notes: settings.notes ?? "",
    fields: fields.length > 0 ? fields : preset.fields,
    updatedAt: settings.updatedAt,
  };
}

async function findCampaignWithSettings(campaignId: string, tenantId: string) {
  return prisma.campaign.findFirst({
    where: {
      id: campaignId,
      tenantId,
    },
    include: {
      settings: true,
      inventoryFields: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
}

async function hydrateDefaults(record: CampaignSettingsRecord, tenantId: string) {
  if (record.settings && record.inventoryFields.length > 0) {
    return record;
  }

  const mode = mapInventoryMode(record.inventoryMode);
  const preset = getPresetForMode(mode);

  await prisma.$transaction(async (tx) => {
    if (!record.settings) {
      await tx.campaignSettings.create({
        data: settingsData(
          tenantId,
          record.id,
          preset,
        ) as Prisma.CampaignSettingsUncheckedCreateInput,
      });
    }

    if (record.inventoryFields.length === 0) {
      await tx.campaignInventoryField.createMany({
        data: preset.fields.map((fieldItem) =>
          fieldData(
            tenantId,
            record.id,
            fieldItem,
          ) as Prisma.CampaignInventoryFieldCreateManyInput
        ),
      });
    }
  });

  const hydrated = await findCampaignWithSettings(record.id, tenantId);
  return hydrated ?? record;
}

export const captureSettingsRepository = {
  async getByCampaignId(campaignId: string): Promise<CaptureSettings | null> {
    const context = await getRequiredAuthContext();
    const record = await findCampaignWithSettings(campaignId, context.tenantId);

    if (!record) {
      return null;
    }

    const hydrated = await hydrateDefaults(record, context.tenantId);
    return mapRecord(hydrated);
  },

  async updateByCampaignId(
    campaignId: string,
    input: CaptureSettingsInput,
  ): Promise<CaptureSettings | null> {
    const context = await getRequiredAuthContext();
    const record = await findCampaignWithSettings(campaignId, context.tenantId);

    if (!record) {
      return null;
    }

    await prisma.$transaction(async (tx) => {
      await tx.campaign.update({
        where: {
          id: campaignId,
        },
        data: {
          inventoryMode: mapInventoryModeForDb(input.inventoryMode),
        },
      });

      await tx.campaignSettings.upsert({
        where: {
          campaignId,
        },
        update: settingsData(
          context.tenantId,
          campaignId,
          input,
        ) as Prisma.CampaignSettingsUncheckedUpdateInput,
        create: settingsData(
          context.tenantId,
          campaignId,
          input,
        ) as Prisma.CampaignSettingsUncheckedCreateInput,
      });

      await tx.campaignInventoryField.deleteMany({
        where: {
          campaignId,
          tenantId: context.tenantId,
        },
      });

      if (input.fields.length > 0) {
        await tx.campaignInventoryField.createMany({
          data: input.fields
            .map((fieldItem, index) => ({
              ...fieldItem,
              position: index,
            }))
            .map((fieldItem) =>
              fieldData(
                context.tenantId,
                campaignId,
                fieldItem,
              ) as Prisma.CampaignInventoryFieldCreateManyInput
            ),
        });
      }
    });

    return this.getByCampaignId(campaignId);
  },

  async resetByCampaignId(
    campaignId: string,
    mode: InventoryMode,
  ): Promise<CaptureSettings | null> {
    const preset = getPresetForMode(mode);
    return this.updateByCampaignId(campaignId, preset);
  },
};
