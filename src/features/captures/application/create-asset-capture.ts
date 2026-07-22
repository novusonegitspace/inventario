import { getAssetDetail } from "@/src/features/assets/application/get-asset-detail";
import {
  matchesAssetCode,
  normalizeBarcode,
} from "@/src/features/assets/domain/asset";
import { assetRepository } from "@/src/features/assets/infrastructure/asset-repository";
import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { canCaptureForCampaign } from "@/src/features/campaigns/domain/campaign-status";
import { getCaptureSettings } from "@/src/features/campaign-settings/application/get-capture-settings";
import type { CaptureField } from "@/src/features/campaign-settings/domain/capture-settings";
import {
  defaultAssetCaptureDraft,
  type CreateAssetCaptureDraft,
} from "@/src/features/captures/domain/asset-capture";
import { captureRepository } from "@/src/features/captures/infrastructure/capture-repository";
import { evidenceRepository } from "@/src/features/evidence/infrastructure/evidence-repository";

const MAX_EVIDENCE_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_EVIDENCE_FILE_SIZE_LABEL = "8 MB";

export type CreateAssetCaptureErrors = Partial<
  Record<Exclude<keyof CreateAssetCaptureDraft, "customFields">, string>
> & {
  customFields?: Record<string, string>;
  evidenceFile?: string;
  form?: string;
};

type CreateAssetCaptureInput = Partial<
  Record<Exclude<keyof CreateAssetCaptureDraft, "customFields">, FormDataEntryValue | null>
> & {
  customFields?: Record<string, string>;
  evidenceFile?: FormDataEntryValue | null;
};

export type CreateAssetCaptureResult =
  | {
      ok: true;
      captureId: string;
      values: CreateAssetCaptureDraft;
    }
  | {
      ok: false;
      errors: CreateAssetCaptureErrors;
      values: CreateAssetCaptureDraft;
    };

function isFiniteCoordinate(value: string) {
  if (!value) {
    return true;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed);
}

const dedicatedFieldNames: Record<
  string,
  Exclude<keyof CreateAssetCaptureDraft, "customFields">
> = {
  asset_code: "scannedCode",
  notes: "notes",
  observed_location: "observedLocation",
  physical_condition: "physicalCondition",
  observed_responsible: "observedResponsible",
  serial_number: "observedSerialNumber",
  cost_center: "observedCostCenter",
};

function isActiveMobileField(field: CaptureField) {
  return field.showInMobileCapture && field.requirement !== "not_applicable";
}

function getFieldValue(field: CaptureField, values: CreateAssetCaptureDraft) {
  const dedicatedFieldName = dedicatedFieldNames[field.key];

  if (dedicatedFieldName) {
    const value = values[dedicatedFieldName];
    return typeof value === "string" ? value : "";
  }

  return values.customFields[field.key] ?? "";
}

function isRequiredFileField(field: CaptureField) {
  return (
    field.requirement === "required" &&
    (field.dataType === "file" || field.key === "asset_photo")
  );
}

function conditionRequiresNotes(rule: string, physicalCondition: string) {
  if (rule === "always") {
    return true;
  }

  if (rule !== "difference_or_bad_condition") {
    return false;
  }

  const normalized = physicalCondition
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return ["malo", "danado", "dañado", "damaged"].includes(normalized);
}

function getEvidenceFile(input: CreateAssetCaptureInput) {
  return input.evidenceFile instanceof File && input.evidenceFile.size > 0
    ? input.evidenceFile
    : null;
}

export async function createAssetCapture(
  campaignId: string,
  assetId: string,
  input: CreateAssetCaptureInput,
): Promise<CreateAssetCaptureResult> {
  const values: CreateAssetCaptureDraft = {
    ...defaultAssetCaptureDraft,
    scannedCode: normalizeBarcode(String(input.scannedCode ?? "")),
    latitude: String(input.latitude ?? "").trim(),
    longitude: String(input.longitude ?? "").trim(),
    notes: String(input.notes ?? "").trim(),
    deviceLabel: String(input.deviceLabel ?? "").trim(),
    physicalCondition: String(input.physicalCondition ?? "").trim(),
    observedLocation: String(input.observedLocation ?? "").trim(),
    observedResponsible: String(input.observedResponsible ?? "").trim(),
    observedCostCenter: String(input.observedCostCenter ?? "").trim(),
    observedSerialNumber: String(input.observedSerialNumber ?? "").trim(),
    conditionNotes: String(input.conditionNotes ?? "").trim(),
    customFields: input.customFields ?? {},
  };
  const evidenceFile = getEvidenceFile(input);

  const errors: CreateAssetCaptureErrors = {};
  const [campaign, asset, settings] = await Promise.all([
    getCampaignDetail(campaignId),
    getAssetDetail(campaignId, assetId),
    getCaptureSettings(campaignId),
  ]);

  if (!campaign || !asset) {
    errors.form = "No encontramos el activo o la campaña seleccionada.";
  } else if (!canCaptureForCampaign(campaign.status)) {
    errors.form = "La campaña no admite capturas en su estado actual.";
  }

  if (!values.scannedCode) {
    errors.scannedCode = "Ingrese el código leído o confirmado en terreno.";
  }

  if (asset && values.scannedCode && !matchesAssetCode(values.scannedCode, asset)) {
    const matchedAsset = await assetRepository.findByBarcodeOrTag(
      campaignId,
      values.scannedCode,
    );

    errors.scannedCode =
      matchedAsset && matchedAsset.id !== asset.id
        ? `El código escaneado corresponde al activo ${matchedAsset.assetTag} y no al activo actual.`
        : "El código escaneado no coincide con el barcode ni con la etiqueta interna de este activo.";
  }

  if (!isFiniteCoordinate(values.latitude)) {
    errors.latitude = "Ingrese una latitud válida.";
  }

  if (!isFiniteCoordinate(values.longitude)) {
    errors.longitude = "Ingrese una longitud válida.";
  }

  const activeFields = settings?.fields.filter(isActiveMobileField) ?? [];
  const fieldErrors: Record<string, string> = {};

  for (const field of activeFields) {
    if (isRequiredFileField(field)) {
      continue;
    }

    if (field.requirement === "required" && !getFieldValue(field, values)) {
      const dedicatedFieldName = dedicatedFieldNames[field.key];

      if (dedicatedFieldName) {
        errors[dedicatedFieldName as Exclude<keyof CreateAssetCaptureDraft, "customFields">] =
          `Complete ${field.label.toLowerCase()}.`;
      } else {
        fieldErrors[field.key] = `Complete ${field.label.toLowerCase()}.`;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    errors.customFields = fieldErrors;
  }

  const requiresGeo = activeFields.some(
    (field) => field.key === "observed_location" && field.requirement === "required",
  );

  if (requiresGeo && (!values.latitude || !values.longitude)) {
    errors.latitude = "Esta campaña exige geolocalización.";
    errors.longitude = "Esta campaña exige geolocalización.";
  }

  const requiresEvidence =
    settings?.primaryPhotoRequirement === "required" ||
    activeFields.some(isRequiredFileField);

  if (requiresEvidence && !evidenceFile) {
    errors.evidenceFile = "Adjunte la foto o evidencia requerida para esta captura.";
  }

  if (evidenceFile && evidenceFile.size > MAX_EVIDENCE_FILE_SIZE_BYTES) {
    errors.evidenceFile = `La evidencia no puede superar ${MAX_EVIDENCE_FILE_SIZE_LABEL}. Tome una foto más liviana o reduzca el archivo antes de guardar.`;
  }

  if (
    settings &&
    conditionRequiresNotes(
      settings.conditionRequiresObservationRule,
      values.physicalCondition,
    ) &&
    !values.conditionNotes
  ) {
    errors.conditionNotes = "Esta condición requiere una observación de respaldo.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values,
    };
  }

  const capture = await captureRepository.createForAsset(campaignId, assetId, values);

  if (evidenceFile) {
    try {
      await evidenceRepository.createForAsset(
        campaignId,
        assetId,
        capture.id,
        evidenceFile,
      );
    } catch (error) {
      return {
        ok: false,
        errors: {
          form:
            error instanceof Error
              ? `La captura fue registrada, pero no pudimos adjuntar evidencia: ${error.message}`
              : "La captura fue registrada, pero no pudimos adjuntar evidencia.",
        },
        values,
      };
    }
  }

  return {
    ok: true,
    captureId: capture.id,
    values,
  };
}
