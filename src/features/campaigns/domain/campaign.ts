import type { CampaignStatus } from "@/src/features/campaigns/domain/campaign-status";

export const inventoryModes = [
  "full_count",
  "selective",
  "cycle_count",
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
  siteName: string;
  inventoryMode: InventoryMode;
  scheduledStartAt: string;
  scheduledEndAt: string;
};

export const defaultCampaignDraft: CreateCampaignDraft = {
  name: "",
  code: "",
  clientName: "",
  siteName: "",
  inventoryMode: "full_count",
  scheduledStartAt: "",
  scheduledEndAt: "",
};

const inventoryModeLabels: Record<InventoryMode, string> = {
  full_count: "Conteo total",
  selective: "Selectivo",
  cycle_count: "Cíclico",
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
