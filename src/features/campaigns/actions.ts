"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  activateCampaign,
} from "@/src/features/campaigns/application/activate-campaign";
import {
  createCampaign,
  type CreateCampaignFormErrors,
} from "@/src/features/campaigns/application/create-campaign";
import {
  updateCampaignSettings,
  type UpdateCampaignSettingsErrors,
} from "@/src/features/campaigns/application/update-campaign-settings";
import {
  type CreateCampaignDraft,
} from "@/src/features/campaigns/domain/campaign";
import {
  defaultCampaignSettingsInput,
  type CampaignSettingsInput,
} from "@/src/features/campaigns/domain/campaign-settings";

export type CreateCampaignFormState = {
  errors?: CreateCampaignFormErrors;
  values: CreateCampaignDraft;
};

export type UpdateCampaignSettingsFormState = {
  errors?: UpdateCampaignSettingsErrors;
  message?: string;
  values: CampaignSettingsInput;
};

export async function activateCampaignAction(campaignId: string) {
  const result = await activateCampaign(campaignId);

  if (!result.ok) {
    throw new Error(result.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/assets`);
  redirect(`/campaigns/${campaignId}`);
}

export async function createCampaignAction(
  _state: CreateCampaignFormState,
  formData: FormData,
): Promise<CreateCampaignFormState> {
  const result = await createCampaign({
    name: formData.get("name"),
    code: formData.get("code"),
    clientName: formData.get("clientName"),
    siteName: formData.get("siteName"),
    inventoryMode: formData.get("inventoryMode"),
    scheduledStartAt: formData.get("scheduledStartAt"),
    scheduledEndAt: formData.get("scheduledEndAt"),
  });

  if (!result.ok) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }

  redirect(`/campaigns/${result.campaignId}`);
}

export async function updateCampaignSettingsAction(
  campaignId: string,
  _state: UpdateCampaignSettingsFormState,
  formData: FormData,
): Promise<UpdateCampaignSettingsFormState> {
  const result = await updateCampaignSettings(campaignId, {
    captureRequiresPhoto: formData.get("captureRequiresPhoto"),
    captureRequiresGeo: formData.get("captureRequiresGeo"),
    allowManualAssets: formData.get("allowManualAssets"),
    closeBlocksCaptures: formData.get("closeBlocksCaptures"),
    notes: formData.get("notes"),
  });

  if (!result.ok) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/settings`);

  return {
    message: "Configuración guardada.",
    values: result.values ?? defaultCampaignSettingsInput,
  };
}
