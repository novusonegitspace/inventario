"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createAssetCapture,
  type CreateAssetCaptureErrors,
} from "@/src/features/captures/application/create-asset-capture";
import {
  type CreateAssetCaptureDraft,
} from "@/src/features/captures/domain/asset-capture";

export type CreateAssetCaptureFormState = {
  errors?: CreateAssetCaptureErrors;
  values: CreateAssetCaptureDraft;
};

export async function createAssetCaptureAction(
  campaignId: string,
  assetId: string,
  _state: CreateAssetCaptureFormState,
  formData: FormData,
): Promise<CreateAssetCaptureFormState> {
  const customFields = Object.fromEntries(
    Array.from(formData.entries())
      .filter(([key]) => key.startsWith("customField:"))
      .map(([key, value]) => [
        key.replace("customField:", ""),
        String(value ?? "").trim(),
      ])
      .filter(([, value]) => value.length > 0),
  );

  const result = await createAssetCapture(campaignId, assetId, {
    scannedCode: formData.get("scannedCode"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    notes: formData.get("notes"),
    deviceLabel: formData.get("deviceLabel"),
    physicalCondition: formData.get("physicalCondition"),
    observedLocation: formData.get("observedLocation"),
    observedResponsible: formData.get("observedResponsible"),
    observedCostCenter: formData.get("observedCostCenter"),
    observedSerialNumber: formData.get("observedSerialNumber"),
    conditionNotes: formData.get("conditionNotes"),
    customFields,
    evidenceFile: formData.get("evidenceFile"),
  });

  if (!result.ok) {
    return {
      errors: result.errors,
      values: result.values,
    };
  }

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/assets`);
  revalidatePath(`/campaigns/${campaignId}/assets/${assetId}`);
  revalidatePath(`/campaigns/${campaignId}/assets/${assetId}/capture`);

  redirect(`/campaigns/${campaignId}/assets/${assetId}`);
}
