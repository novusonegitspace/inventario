export type Evidence = {
  id: string;
  tenantId: string;
  campaignId: string;
  assetId: string;
  captureId: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  uploadedAt: Date;
  availableAt: Date | null;
  uploadedByName: string;
  scannedCode: string;
  blobPath: string;
};

export type CreateEvidenceDraft = {
  captureId: string;
  fileName: string;
};
