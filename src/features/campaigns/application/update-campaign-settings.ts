import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import {
  canEditCampaign,
} from "@/src/features/campaigns/domain/campaign-status";
import {
  defaultCampaignSettingsInput,
  type CampaignSettingsInput,
} from "@/src/features/campaigns/domain/campaign-settings";
import { campaignSettingsRepository } from "@/src/features/campaigns/infrastructure/campaign-settings-repository";

export type UpdateCampaignSettingsErrors = Partial<
  Record<keyof CampaignSettingsInput, string>
> & {
  form?: string;
};

export type UpdateCampaignSettingsResult =
  | {
      ok: true;
      values: CampaignSettingsInput;
      updatedAt: Date;
    }
  | {
      ok: false;
      errors: UpdateCampaignSettingsErrors;
      values: CampaignSettingsInput;
    };

function toBoolean(value: FormDataEntryValue | null) {
  return value === "on";
}

export async function updateCampaignSettings(
  campaignId: string,
  input: Partial<Record<keyof CampaignSettingsInput, FormDataEntryValue | null>>,
): Promise<UpdateCampaignSettingsResult> {
  const values: CampaignSettingsInput = {
    ...defaultCampaignSettingsInput,
    captureRequiresPhoto: toBoolean(input.captureRequiresPhoto ?? null),
    captureRequiresGeo: toBoolean(input.captureRequiresGeo ?? null),
    allowManualAssets: toBoolean(input.allowManualAssets ?? null),
    closeBlocksCaptures: toBoolean(input.closeBlocksCaptures ?? null),
    notes: String(input.notes ?? "").trim(),
  };

  const errors: UpdateCampaignSettingsErrors = {};
  const campaign = await getCampaignDetail(campaignId);

  if (!campaign) {
    errors.form = "La campaña ya no existe o no pertenece al tenant actual.";
  } else if (!canEditCampaign(campaign.status)) {
    errors.form =
      "La campaña está cerrada. No se permite editar configuración.";
  }

  if (values.notes.length > 1000) {
    errors.notes = "Las notas no pueden superar 1000 caracteres.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values,
    };
  }

  const settings = await campaignSettingsRepository.updateByCampaignId(
    campaignId,
    values,
  );

  if (!settings) {
    return {
      ok: false,
      errors: {
        form: "No se pudo resolver la configuración de la campaña.",
      },
      values,
    };
  }

  return {
    ok: true,
    values,
    updatedAt: settings.updatedAt,
  };
}
