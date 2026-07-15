import { getAssetDetail } from "@/src/features/assets/application/get-asset-detail";
import {
  matchesAssetCode,
  normalizeBarcode,
} from "@/src/features/assets/domain/asset";
import { assetRepository } from "@/src/features/assets/infrastructure/asset-repository";
import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { getCampaignSettings } from "@/src/features/campaigns/application/get-campaign-settings";
import { canCaptureForCampaign } from "@/src/features/campaigns/domain/campaign-status";
import {
  defaultAssetCaptureDraft,
  type CreateAssetCaptureDraft,
} from "@/src/features/captures/domain/asset-capture";
import { captureRepository } from "@/src/features/captures/infrastructure/capture-repository";

export type CreateAssetCaptureErrors = Partial<
  Record<keyof CreateAssetCaptureDraft, string>
> & {
  form?: string;
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

export async function createAssetCapture(
  campaignId: string,
  assetId: string,
  input: Partial<Record<keyof CreateAssetCaptureDraft, FormDataEntryValue | null>>,
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
  };

  const errors: CreateAssetCaptureErrors = {};
  const [campaign, asset, settings] = await Promise.all([
    getCampaignDetail(campaignId),
    getAssetDetail(campaignId, assetId),
    getCampaignSettings(campaignId),
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

  if (settings?.captureRequiresGeo && (!values.latitude || !values.longitude)) {
    errors.latitude = "Esta campaña exige geolocalización.";
    errors.longitude = "Esta campaña exige geolocalización.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values,
    };
  }

  const capture = await captureRepository.createForAsset(campaignId, assetId, values);

  return {
    ok: true,
    captureId: capture.id,
    values,
  };
}
