export type ReconciliationStatus =
  | "PENDING"
  | "CONCILIATED"
  | "CONCILIATED_WITH_DIFFERENCES"
  | "NOT_FOUND"
  | "SURPLUS";

export type ReconciliationResultItem = {
  id: string;
  campaignId: string;
  assetId: string;
  assetTag: string;
  assetBarcode: string;
  assetName: string;
  captureId: string;
  captureCode: string;
  status: ReconciliationStatus;
  snapshotVersion: number;
  matchedByCode: boolean;
  locationMatches: boolean | null;
  responsibleMatches: boolean | null;
  physicalConditionMatches: boolean | null;
  costCenterMatches: boolean | null;
  serialNumberMatches: boolean | null;
  notes: string;
  calculatedAt: Date;
};
