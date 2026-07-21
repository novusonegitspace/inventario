"use server";

import { revalidatePath } from "next/cache";

import {
  importAssetMaster,
  type AssetMasterImportErrors,
} from "@/src/features/asset-imports/application/import-asset-master";
import {
  defaultAssetMasterImportValues,
  type AssetMasterImportSummary,
  type AssetMasterImportValues,
} from "@/src/features/asset-imports/domain/asset-master-import";

export type AssetMasterImportFormState = {
  errors?: AssetMasterImportErrors;
  message?: string;
  summary?: AssetMasterImportSummary;
  values: AssetMasterImportValues;
};

export async function importAssetMasterAction(
  campaignId: string,
  _state: AssetMasterImportFormState,
  formData: FormData,
): Promise<AssetMasterImportFormState> {
  const result = await importAssetMaster(campaignId, formData.get("assetMasterFile"));

  if (!result.ok) {
    return {
      errors: result.errors,
      summary: result.summary,
      values: result.values,
    };
  }

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/assets`);
  revalidatePath(`/campaigns/${campaignId}/settings`);

  return {
    message: result.message,
    summary: result.summary,
    values: result.values,
  };
}

export async function resetAssetMasterImportState(): Promise<AssetMasterImportFormState> {
  return {
    values: defaultAssetMasterImportValues,
  };
}
