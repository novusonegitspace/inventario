import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { canEditCampaign } from "@/src/features/campaigns/domain/campaign-status";
import {
  defaultAssetDraft,
  normalizeBarcode,
  normalizeAssetTag,
  type CreateAssetDraft,
} from "@/src/features/assets/domain/asset";
import { assetRepository } from "@/src/features/assets/infrastructure/asset-repository";

export type CreateAssetErrors = Partial<Record<keyof CreateAssetDraft, string>> & {
  form?: string;
};

export type CreateAssetResult =
  | {
      ok: true;
      assetId: string;
      values: CreateAssetDraft;
    }
  | {
      ok: false;
      errors: CreateAssetErrors;
      values: CreateAssetDraft;
    };

export async function createAsset(
  campaignId: string,
  input: Partial<Record<keyof CreateAssetDraft, FormDataEntryValue | null>>,
): Promise<CreateAssetResult> {
  const values: CreateAssetDraft = {
    ...defaultAssetDraft,
    assetTag: normalizeAssetTag(String(input.assetTag ?? "")),
    barcode: normalizeBarcode(String(input.barcode ?? "")),
    name: String(input.name ?? "").trim(),
    serialNumber: String(input.serialNumber ?? "").trim(),
    location: String(input.location ?? "").trim(),
    responsible: String(input.responsible ?? "").trim(),
    costCenter: String(input.costCenter ?? "").trim(),
  };

  const errors: CreateAssetErrors = {};
  const campaign = await getCampaignDetail(campaignId);

  if (!campaign) {
    errors.form = "No encontramos la campaña seleccionada.";
  } else if (!canEditCampaign(campaign.status)) {
    errors.form = "La campaña está cerrada y no admite nuevos activos.";
  }

  if (values.assetTag.length < 3) {
    errors.assetTag = "Ingrese una etiqueta o código válido para el activo.";
  }

  if (values.barcode.length < 3) {
    errors.barcode =
      "Ingrese un código de barras o identificador escaneable para el activo.";
  }

  if (values.name.length < 3) {
    errors.name = "Ingrese un nombre reconocible para el activo.";
  }

  if (!values.location) {
    errors.location = "Indique la ubicación actual del activo.";
  }

  if (!values.responsible) {
    errors.responsible = "Indique la persona o área responsable.";
  }

  const existingAssets = campaign ? await assetRepository.listByCampaignId(campaignId) : [];

  if (existingAssets.some((asset) => asset.assetTag === values.assetTag)) {
    errors.assetTag = "Ya existe un activo con esa etiqueta en esta campaña.";
  }

  if (
    values.barcode &&
    existingAssets.some((asset) => asset.barcode === values.barcode)
  ) {
    errors.barcode =
      "Ya existe un activo con ese código de barras en esta campaña.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values,
    };
  }

  const asset = await assetRepository.create(campaignId, values);

  return {
    ok: true,
    assetId: asset.id,
    values,
  };
}
