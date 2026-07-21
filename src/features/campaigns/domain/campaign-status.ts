export const campaignStatuses = [
  "draft",
  "active",
  "in_review",
  "completed",
  "closed",
] as const;

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
    label: "Borrador",
    description: "La campaña todavía se está preparando.",
    tone: "slate",
    allowsCapture: false,
    allowsEditing: true,
  },
  active: {
    label: "Activa",
    description: "La operación está en terreno y acepta capturas.",
    tone: "emerald",
    allowsCapture: true,
    allowsEditing: true,
  },
  in_review: {
    label: "En revisión",
    description: "La campaña está en revisión y restringe cambios operativos.",
    tone: "outline",
    allowsCapture: false,
    allowsEditing: true,
  },
  completed: {
    label: "Completada",
    description: "La ejecución terminó y queda lista para reporte o cierre.",
    tone: "outline",
    allowsCapture: false,
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
