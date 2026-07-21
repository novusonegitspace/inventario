import {
  assetManagementMethods,
  evidenceRequirements,
  fieldDataTypes,
  fieldRequirements,
  fieldScopes,
  getPresetForMode,
  inventoryModes,
  type CaptureField,
  type CaptureSettingsInput,
} from "@/src/features/campaign-settings/domain/capture-settings";
import { captureSettingsRepository } from "@/src/features/campaign-settings/infrastructure/campaign-settings-repository";

export type UpdateCaptureSettingsErrors = {
  form?: string;
  inventoryMode?: string;
  fields?: string;
};

export type UpdateCaptureSettingsResult =
  | {
      ok: true;
      values: CaptureSettingsInput;
    }
  | {
      ok: false;
      errors: UpdateCaptureSettingsErrors;
      values: CaptureSettingsInput;
    };

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(0, Math.round(value));
}

function normalizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function normalizeField(value: unknown, index: number): CaptureField | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const key = normalizeString(record.key)
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const label = normalizeString(record.label);
  const dataType = fieldDataTypes.includes(record.dataType as never)
    ? record.dataType as CaptureField["dataType"]
    : "text";
  const requirement = fieldRequirements.includes(record.requirement as never)
    ? record.requirement as CaptureField["requirement"]
    : "optional";
  const scope = fieldScopes.includes(record.scope as never)
    ? record.scope as CaptureField["scope"]
    : "capture";

  if (!key || !label) {
    return null;
  }

  return {
    key,
    label,
    dataType,
    requirement,
    helpText: normalizeString(record.helpText),
    options: normalizeStringList(record.options),
    defaultValue: normalizeString(record.defaultValue),
    showInMobileCapture: normalizeBoolean(record.showInMobileCapture, true),
    showInAssetDetail: normalizeBoolean(record.showInAssetDetail, true),
    showInReports: normalizeBoolean(record.showInReports, true),
    visibilityCondition: normalizeString(record.visibilityCondition),
    isSystem: normalizeBoolean(record.isSystem, false),
    scope,
    position: index,
  };
}

export async function updateCaptureSettings(
  campaignId: string,
  payload: unknown,
): Promise<UpdateCaptureSettingsResult> {
  const record = payload && typeof payload === "object"
    ? payload as Record<string, unknown>
    : {};
  const inventoryMode = inventoryModes.includes(record.inventoryMode as never)
    ? record.inventoryMode as CaptureSettingsInput["inventoryMode"]
    : "simple_count";
  const preset = getPresetForMode(inventoryMode);
  const fields = Array.isArray(record.fields)
    ? record.fields
        .map((field, index) => normalizeField(field, index))
        .filter((field): field is CaptureField => Boolean(field))
    : preset.fields;
  const errors: UpdateCaptureSettingsErrors = {};

  if (fields.length === 0) {
    errors.fields = "Debe existir al menos un campo de captura.";
  }

  if (!fields.some((field) => field.key === "asset_code" && field.requirement === "required")) {
    errors.fields = "El código del activo debe mantenerse obligatorio.";
  }

  const values: CaptureSettingsInput = {
    inventoryMode,
    assetManagementMethod: assetManagementMethods.includes(record.assetManagementMethod as never)
      ? record.assetManagementMethod as CaptureSettingsInput["assetManagementMethod"]
      : preset.assetManagementMethod,
    allowOfflineCapture: normalizeBoolean(record.allowOfflineCapture, preset.allowOfflineCapture),
    allowEditRecords: normalizeBoolean(record.allowEditRecords, preset.allowEditRecords),
    requireSupervisorReview: normalizeBoolean(
      record.requireSupervisorReview,
      preset.requireSupervisorReview,
    ),
    autoCloseCampaign: normalizeBoolean(record.autoCloseCampaign, preset.autoCloseCampaign),
    allowSurplusAssets: normalizeBoolean(record.allowSurplusAssets, preset.allowSurplusAssets),
    manualAssetLimit: normalizeNumber(record.manualAssetLimit, preset.manualAssetLimit),
    primaryPhotoRequirement: evidenceRequirements.includes(record.primaryPhotoRequirement as never)
      ? record.primaryPhotoRequirement as CaptureSettingsInput["primaryPhotoRequirement"]
      : preset.primaryPhotoRequirement,
    additionalPhotosRequirement: evidenceRequirements.includes(record.additionalPhotosRequirement as never)
      ? record.additionalPhotosRequirement as CaptureSettingsInput["additionalPhotosRequirement"]
      : preset.additionalPhotosRequirement,
    additionalPhotosMin: normalizeNumber(
      record.additionalPhotosMin,
      preset.additionalPhotosMin,
    ) ?? 0,
    otherFilesRequirement: evidenceRequirements.includes(record.otherFilesRequirement as never)
      ? record.otherFilesRequirement as CaptureSettingsInput["otherFilesRequirement"]
      : preset.otherFilesRequirement,
    photoObservationRule: evidenceRequirements.includes(record.photoObservationRule as never)
      ? record.photoObservationRule as CaptureSettingsInput["photoObservationRule"]
      : preset.photoObservationRule,
    conditionOptions: preset.conditionOptions,
    conditionRequiresObservationRule:
      normalizeString(record.conditionRequiresObservationRule) ||
      preset.conditionRequiresObservationRule,
    notes: normalizeString(record.notes),
    fields,
  };

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values,
    };
  }

  const updated = await captureSettingsRepository.updateByCampaignId(campaignId, values);

  if (!updated) {
    return {
      ok: false,
      errors: {
        form: "No pudimos encontrar esta campaña para guardar la configuración.",
      },
      values,
    };
  }

  return {
    ok: true,
    values,
  };
}

