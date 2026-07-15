import type { ReconciliationResultItem } from "@/src/features/reconciliation/domain/reconciliation";
import { reconciliationRepository } from "@/src/features/reconciliation/infrastructure/reconciliation-repository";

export type ReconciliationOverview = {
  total: number;
  conciliated: number;
  withDifferences: number;
  notFound: number;
};

export async function listLatestReconciliationResults(campaignId: string) {
  return reconciliationRepository.getLatestSnapshot(campaignId);
}

export function summarizeReconciliation(
  results: ReconciliationResultItem[],
): ReconciliationOverview {
  return {
    total: results.length,
    conciliated: results.filter((result) => result.status === "CONCILIATED")
      .length,
    withDifferences: results.filter(
      (result) => result.status === "CONCILIATED_WITH_DIFFERENCES",
    ).length,
    notFound: results.filter((result) => result.status === "NOT_FOUND").length,
  };
}

export async function getReconciliationOverview(campaignId: string) {
  const results = await reconciliationRepository.getLatestSnapshot(campaignId);

  return summarizeReconciliation(results);
}
