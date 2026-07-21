import type { CampaignStatus } from "@/src/features/campaigns/domain/campaign-status";

export const inventoryModes = [
  "simple_count",
  "full_audit",
  "custom",
] as const;

export type InventoryMode = (typeof inventoryModes)[number];

export type Campaign = {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  status: CampaignStatus;
  clientName: string;
  siteName: string;
  inventoryMode: InventoryMode;
  auditorCount: number;
  assetCount: number;
  captureCount: number;
  evidenceCount: number;
  differenceCount: number;
  progressPercentage: number;
  scheduledStartAt: Date | null;
  scheduledEndAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCampaignDraft = {
  name: string;
  code: string;
  clientName: string;
  description: string;
  siteName: string;
  inventoryMode: InventoryMode;
  scheduledStartAt: string;
  scheduledEndAt: string;
  captureRequiresPhoto: boolean;
  captureRequiresGeo: boolean;
  allowManualAssets: boolean;
  closeBlocksCaptures: boolean;
};

export const defaultCampaignDraft: CreateCampaignDraft = {
  name: "",
  code: "",
  clientName: "",
  description: "",
  siteName: "",
  inventoryMode: "simple_count",
  scheduledStartAt: "",
  scheduledEndAt: "",
  captureRequiresPhoto: false,
  captureRequiresGeo: false,
  allowManualAssets: false,
  closeBlocksCaptures: true,
};

const inventoryModeLabels: Record<InventoryMode, string> = {
  simple_count: "Conteo simple",
  full_audit: "Auditoría completa",
  custom: "Personalizado",
};

export function getInventoryModeLabel(mode: InventoryMode) {
  return inventoryModeLabels[mode];
}

export function normalizeCampaignCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}
