export const campaignStatuses = ["draft", "active", "closed"] as const;

export type CampaignStatus = (typeof campaignStatuses)[number];

export type CampaignStatusMeta = {
  label: string;
  description: string;
  tone: "emerald" | "slate" | "outline";
  allowsCapture: boolean;
  allowsEditing: boolean;
};

const campaignStatusMeta: Record<CampaignStatus, CampaignStatusMeta> = {
  draft: {
    label: "Preparación",
    description: "La campaña todavía se está preparando.",
    tone: "slate",
    allowsCapture: false,
    allowsEditing: true,
  },
  active: {
    label: "En curso",
    description: "La operación está en terreno y acepta capturas.",
    tone: "emerald",
    allowsCapture: true,
    allowsEditing: true,
  },
  closed: {
    label: "Cerrada",
    description: "La campaña cerró y bloquea edición y nuevas capturas.",
    tone: "outline",
    allowsCapture: false,
    allowsEditing: false,
  },
};

export function getCampaignStatusMeta(status: CampaignStatus) {
  return campaignStatusMeta[status];
}

export function canEditCampaign(status: CampaignStatus) {
  return campaignStatusMeta[status].allowsEditing;
}

export function canCaptureForCampaign(status: CampaignStatus) {
  return campaignStatusMeta[status].allowsCapture;
}
