"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createEvidence,
  type CreateEvidenceErrors,
} from "@/src/features/evidence/application/create-evidence";

export type CreateEvidenceFormState = {
  errors?: CreateEvidenceErrors;
  values: {
    captureId: string;
  };
};

export async function createEvidenceAction(
  campaignId: string,
  assetId: string,
  _state: CreateEvidenceFormState,
  formData: FormData,
): Promise<CreateEvidenceFormState> {
  const result = await createEvidence(campaignId, assetId, {
    captureId: formData.get("captureId"),
    file: formData.get("file"),
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
  revalidatePath(`/campaigns/${campaignId}/assets/${assetId}/evidence`);

  redirect(`/campaigns/${campaignId}/assets/${assetId}/evidence`);
}
