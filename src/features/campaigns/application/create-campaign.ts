import {
  defaultCampaignDraft,
  normalizeCampaignCode,
  type CreateCampaignDraft,
  type InventoryMode,
  inventoryModes,
} from "@/src/features/campaigns/domain/campaign";
import { campaignRepository } from "@/src/features/campaigns/infrastructure/campaign-repository";

export type CreateCampaignFormErrors = Partial<
  Record<keyof CreateCampaignDraft, string>
> & {
  form?: string;
};

export type CreateCampaignResult =
  | {
      ok: true;
      campaignId: string;
    }
  | {
      ok: false;
      errors: CreateCampaignFormErrors;
      values: CreateCampaignDraft;
    };

function isInventoryMode(value: string): value is InventoryMode {
  return inventoryModes.includes(value as InventoryMode);
}

export async function createCampaign(
  input: Partial<Record<keyof CreateCampaignDraft, FormDataEntryValue | null>>,
): Promise<CreateCampaignResult> {
  const values: CreateCampaignDraft = {
    ...defaultCampaignDraft,
    name: String(input.name ?? "").trim(),
    code: normalizeCampaignCode(String(input.code ?? "")),
    clientName: String(input.clientName ?? "").trim(),
    siteName: String(input.siteName ?? "").trim(),
    inventoryMode: isInventoryMode(String(input.inventoryMode ?? ""))
      ? String(input.inventoryMode) as InventoryMode
      : defaultCampaignDraft.inventoryMode,
    scheduledStartAt: String(input.scheduledStartAt ?? "").trim(),
    scheduledEndAt: String(input.scheduledEndAt ?? "").trim(),
  };

  const errors: CreateCampaignFormErrors = {};

  if (values.name.length < 4) {
    errors.name = "Ingrese un nombre más claro para la campaña.";
  }

  if (values.code.length < 4) {
    errors.code = "El código debe tener al menos 4 caracteres válidos.";
  }

  if (!values.clientName) {
    errors.clientName = "Indique el cliente o unidad responsable.";
  }

  if (!values.siteName) {
    errors.siteName = "Indique el sitio donde ocurrirá el inventario.";
  }

  if (!values.scheduledStartAt) {
    errors.scheduledStartAt = "Defina una fecha estimada de inicio.";
  }

  if (
    values.scheduledStartAt &&
    values.scheduledEndAt &&
    values.scheduledEndAt < values.scheduledStartAt
  ) {
    errors.scheduledEndAt =
      "La fecha de término no puede ser anterior al inicio.";
  }

  const existing = await campaignRepository.list();

  if (existing.some((campaign) => campaign.code === values.code)) {
    errors.code = "Ese código ya está ocupado por otra campaña.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values,
    };
  }

  const campaign = await campaignRepository.create(values);

  return {
    ok: true,
    campaignId: campaign.id,
  };
}
