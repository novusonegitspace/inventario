export type AssetCapture = {
  id: string;
  tenantId: string;
  campaignId: string;
  assetId: string;
  submittedByName: string;
  scannedCode: string;
  latitude: string;
  longitude: string;
  notes: string;
  deviceLabel: string;
  capturedAt: Date;
  physicalCondition: string;
  observedLocation: string;
  observedResponsible: string;
  observedCostCenter: string;
  observedSerialNumber: string;
  conditionNotes: string;
};

export type CreateAssetCaptureDraft = {
  scannedCode: string;
  latitude: string;
  longitude: string;
  notes: string;
  deviceLabel: string;
  physicalCondition: string;
  observedLocation: string;
  observedResponsible: string;
  observedCostCenter: string;
  observedSerialNumber: string;
  conditionNotes: string;
};

export const defaultAssetCaptureDraft: CreateAssetCaptureDraft = {
  scannedCode: "",
  latitude: "",
  longitude: "",
  notes: "",
  deviceLabel: "",
  physicalCondition: "",
  observedLocation: "",
  observedResponsible: "",
  observedCostCenter: "",
  observedSerialNumber: "",
  conditionNotes: "",
};
