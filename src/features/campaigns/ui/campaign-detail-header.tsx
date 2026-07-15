import {
  canCaptureForCampaign,
  canEditCampaign,
  getCampaignStatusMeta,
} from "@/src/features/campaigns/domain/campaign-status";
import {
  getInventoryModeLabel,
  type Campaign,
} from "@/src/features/campaigns/domain/campaign";
import { CampaignStatusBadge } from "@/src/features/campaigns/ui/campaign-status-badge";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDateRange(start: Date | null, end: Date | null) {
  if (!start && !end) {
    return "Calendario pendiente";
  }

  const from = start ? dateFormatter.format(start) : "Por definir";
  const to = end ? dateFormatter.format(end) : "Por definir";

  return `${from} - ${to}`;
}

export function CampaignDetailHeader({ campaign }: { campaign: Campaign }) {
  const status = getCampaignStatusMeta(campaign.status);
  const allowsEditing = canEditCampaign(campaign.status);
  const allowsCapture = canCaptureForCampaign(campaign.status);

  return (
    <Panel className="space-y-6" glow padding="lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <CampaignStatusBadge status={campaign.status} />
            <Badge tone="slate">{campaign.code}</Badge>
            <Badge tone="slate">{getInventoryModeLabel(campaign.inventoryMode)}</Badge>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
              {campaign.name}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-white/62">
              {campaign.clientName} · {campaign.siteName} · {status.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/campaigns" size="sm" variant="secondary">
            Volver al listado
          </Button>
          <Button
            href="#next-modules"
            size="sm"
            variant={allowsCapture ? "primary" : "secondary"}
          >
            {allowsCapture ? "Preparar captura móvil" : "Captura bloqueada"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
          <p className="text-sm text-white/50">Ventana operativa</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {formatDateRange(
              campaign.scheduledStartAt,
              campaign.scheduledEndAt,
            )}
          </p>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
          <p className="text-sm text-white/50">Edición</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {allowsEditing ? "Habilitada" : "Bloqueada"}
          </p>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
          <p className="text-sm text-white/50">Captura</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {allowsCapture ? "Abierta" : "No disponible"}
          </p>
        </div>
      </div>
    </Panel>
  );
}
