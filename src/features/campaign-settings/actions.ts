"use server";

import { revalidatePath } from "next/cache";

import {
  updateCaptureSettings,
  type UpdateCaptureSettingsErrors,
} from "@/src/features/campaign-settings/application/update-capture-settings";
import {
  getPresetForMode,
  isInventoryMode,
  type CaptureSettingsInput,
} from "@/src/features/campaign-settings/domain/capture-settings";
import { captureSettingsRepository } from "@/src/features/campaign-settings/infrastructure/campaign-settings-repository";

export type CaptureSettingsFormState = {
  errors?: UpdateCaptureSettingsErrors;
  message?: string;
  values: CaptureSettingsInput;
};

function parsePayload(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return {};
  }

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

export async function updateCaptureSettingsAction(
  campaignId: string,
  _state: CaptureSettingsFormState,
  formData: FormData,
): Promise<CaptureSettingsFormState> {
  const payload = parsePayload(formData.get("settingsJson"));
  const result = await updateCaptureSettings(campaignId, payload);

  if (!result.ok) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/settings`);
  revalidatePath(`/campaigns/${campaignId}/assets`);

  return {
    message: "Configuración de toma física guardada.",
    values: result.values,
  };
}

export async function resetCaptureSettingsAction(
  campaignId: string,
  mode: string,
): Promise<CaptureSettingsFormState> {
  const inventoryMode = isInventoryMode(mode) ? mode : "simple_count";
  const values = getPresetForMode(inventoryMode);
  const result = await captureSettingsRepository.resetByCampaignId(campaignId, inventoryMode);

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/settings`);

  if (!result) {
    return {
      errors: {
        form: "No pudimos restablecer la configuración de esta campaña.",
      },
      values,
    };
  }

  return {
    message: "Valores por defecto restablecidos.",
    values,
  };
}

