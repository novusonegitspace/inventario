"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAsset, type CreateAssetErrors } from "@/src/features/assets/application/create-asset";
import { type CreateAssetDraft } from "@/src/features/assets/domain/asset";

export type CreateAssetFormState = {
  errors?: CreateAssetErrors;
  values: CreateAssetDraft;
};

export async function createAssetAction(
  campaignId: string,
  _state: CreateAssetFormState,
  formData: FormData,
): Promise<CreateAssetFormState> {
  const result = await createAsset(campaignId, {
    assetTag: formData.get("assetTag"),
    barcode: formData.get("barcode"),
    name: formData.get("name"),
    serialNumber: formData.get("serialNumber"),
    location: formData.get("location"),
    responsible: formData.get("responsible"),
    costCenter: formData.get("costCenter"),
  });

  if (!result.ok) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/assets`);

  redirect(`/campaigns/${campaignId}/assets/${result.assetId}`);
}
