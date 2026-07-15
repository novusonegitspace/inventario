export type CampaignSettings = {
  campaignId: string;
  captureRequiresPhoto: boolean;
  captureRequiresGeo: boolean;
  allowManualAssets: boolean;
  closeBlocksCaptures: boolean;
  notes: string;
  updatedAt: Date;
};

export type CampaignSettingsInput = {
  captureRequiresPhoto: boolean;
  captureRequiresGeo: boolean;
  allowManualAssets: boolean;
  closeBlocksCaptures: boolean;
  notes: string;
};

export const defaultCampaignSettingsInput: CampaignSettingsInput = {
  captureRequiresPhoto: false,
  captureRequiresGeo: false,
  allowManualAssets: false,
  closeBlocksCaptures: true,
  notes: "",
};
