"use server";

import { revalidatePath } from "next/cache";

import { reconciliationRepository } from "@/src/features/reconciliation/infrastructure/reconciliation-repository";

export async function recalculateReconciliationAction(campaignId: string) {
  await reconciliationRepository.recalculate(campaignId);

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/reconciliation`);
}
