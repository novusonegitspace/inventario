export type Asset = {
  id: string;
  tenantId: string;
  campaignId: string;
  assetTag: string;
  barcode: string;
  name: string;
  serialNumber: string;
  location: string;
  responsible: string;
  costCenter: string;
  isActive: boolean;
  latestCaptureAt: Date | null;
  captureCount: number;
  evidenceCount: number;
  findingCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAssetDraft = {
  assetTag: string;
  barcode: string;
  name: string;
  serialNumber: string;
  location: string;
  responsible: string;
  costCenter: string;
};

export const defaultAssetDraft: CreateAssetDraft = {
  assetTag: "",
  barcode: "",
  name: "",
  serialNumber: "",
  location: "",
  responsible: "",
  costCenter: "",
};

export function normalizeAssetTag(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

export function normalizeBarcode(value: string) {
  return value.trim().toUpperCase().slice(0, 64);
}

export function matchesAssetCode(
  scannedCode: string,
  asset: { barcode: string; assetTag: string },
) {
  const normalizedCode = normalizeBarcode(scannedCode);

  if (!normalizedCode) {
    return false;
  }

  return (
    normalizedCode === normalizeBarcode(asset.barcode) ||
    normalizedCode === normalizeBarcode(asset.assetTag)
  );
}
