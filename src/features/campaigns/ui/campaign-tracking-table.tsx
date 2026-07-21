import Link from "next/link";

import { getInventoryModeLabel, type Campaign } from "@/src/features/campaigns/domain/campaign";
import { getCampaignStatusMeta } from "@/src/features/campaigns/domain/campaign-status";
import { CampaignProgressMeter } from "@/src/features/campaigns/ui/campaign-progress-meter";
import { MvpStatusPill } from "@/src/shared/ui/mvp-status-pill";

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDateRange(start: Date | null, end: Date | null) {
  if (!start && !end) {
    return "Sin calendario";
  }

  const from = start ? dateFormatter.format(start) : "Por definir";
  const to = end ? dateFormatter.format(end) : "Por definir";

  return `${from} - ${to}`;
}

export function CampaignTrackingTable({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  if (campaigns.length === 0) {
    return (
      <section className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
          No hay campañas que coincidan con los filtros
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667085]">
          Ajuste cliente, estado o fechas para volver a cargar la vista de seguimiento
          de campañas.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-[#e4e7eb] bg-white shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
      <div className="hidden grid-cols-[2.2fr_1.2fr_1.3fr_1.5fr_0.7fr_0.8fr_0.9fr_1fr] gap-4 border-b border-[#e4e7eb] bg-[#f7f8fa] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#667085] xl:grid">
        <span>Campaña</span>
        <span>Cliente</span>
        <span>Fechas</span>
        <span>Avance</span>
        <span>Activos</span>
        <span>Auditores</span>
        <span>Estado</span>
        <span>Última actividad</span>
      </div>
      <div className="divide-y divide-[#e4e7eb]">
        {campaigns.map((campaign) => {
          const statusMeta = getCampaignStatusMeta(campaign.status);

          return (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="grid gap-4 px-6 py-5 transition hover:bg-[#fbfcfd] xl:grid-cols-[2.2fr_1.2fr_1.3fr_1.5fr_0.7fr_0.8fr_0.9fr_1fr]"
            >
              <div className="space-y-1">
                <p className="text-base font-semibold text-[#2d2d2d]">{campaign.name}</p>
                <p className="text-sm text-[#667085]">
                  {campaign.code} · {campaign.siteName}
                </p>
                <p className="text-sm text-[#667085]">
                  {getInventoryModeLabel(campaign.inventoryMode)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-[#14375a]">{campaign.clientName}</p>
                <p className="text-sm text-[#667085]">{statusMeta.description}</p>
              </div>

              <div className="text-sm leading-7 text-[#667085]">
                {formatDateRange(campaign.scheduledStartAt, campaign.scheduledEndAt)}
              </div>

              <div className="space-y-2">
                <CampaignProgressMeter value={campaign.progressPercentage} tone="light" />
              </div>

              <div className="text-sm font-semibold text-[#14375a]">{campaign.assetCount}</div>

              <div className="text-sm font-semibold text-[#14375a]">
                {campaign.auditorCount}
              </div>

              <div className="flex items-start">
                <MvpStatusPill value={campaign.status} />
              </div>

              <div className="text-sm text-[#667085]">
                {dateFormatter.format(campaign.updatedAt)}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
