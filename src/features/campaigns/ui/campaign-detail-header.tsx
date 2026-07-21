import {
  activateCampaignAction,
} from "@/src/features/campaigns/actions";
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
import { MvpSecondaryLink } from "@/src/shared/ui/mvp-topbar";

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
  const activateAction = activateCampaignAction.bind(null, campaign.id);

  return (
    <section className="space-y-6 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <CampaignStatusBadge status={campaign.status} />
            <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#eef5fb] px-3 text-xs font-bold text-[#14375a]">
              {campaign.code}
            </span>
            <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#eef5fb] px-3 text-xs font-bold text-[#14375a]">
              {getInventoryModeLabel(campaign.inventoryMode)}
            </span>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#2d2d2d] sm:text-5xl">
              {campaign.name}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[#667085]">
              {campaign.clientName} · {campaign.siteName} · {status.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <MvpSecondaryLink href="/campaigns">Volver al listado</MvpSecondaryLink>
          {campaign.status === "draft" ? (
            <form action={activateAction}>
              <button className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#14375a] px-4 text-sm font-semibold text-white transition hover:bg-[#102e4d]" type="submit">
                Iniciar campaña
              </button>
            </form>
          ) : (
            <a
              href="#next-modules"
              className={
                allowsCapture
                  ? "inline-flex min-h-10 items-center justify-center rounded-lg bg-[#14375a] px-4 text-sm font-semibold text-white transition hover:bg-[#102e4d]"
                  : "inline-flex min-h-10 items-center justify-center rounded-lg border border-[#e4e7eb] bg-white px-4 text-sm font-semibold text-[#14375a] transition hover:bg-[#f7f8fa]"
              }
            >
              {allowsCapture ? "Preparar captura móvil" : "Captura bloqueada"}
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-5">
          <p className="text-sm text-[#667085]">Ventana operativa</p>
          <p className="mt-2 text-xl font-semibold text-[#14375a]">
            {formatDateRange(
              campaign.scheduledStartAt,
              campaign.scheduledEndAt,
            )}
          </p>
        </div>
        <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-5">
          <p className="text-sm text-[#667085]">Edición</p>
          <p className="mt-2 text-xl font-semibold text-[#14375a]">
            {allowsEditing ? "Habilitada" : "Bloqueada"}
          </p>
        </div>
        <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-5">
          <p className="text-sm text-[#667085]">Captura</p>
          <p className="mt-2 text-xl font-semibold text-[#14375a]">
            {allowsCapture ? "Abierta" : "No disponible"}
          </p>
        </div>
      </div>

      {campaign.status === "draft" ? (
        <div className="rounded-lg border border-[#ffe2b7] bg-[#fff4e5] px-5 py-4 text-sm leading-7 text-[#b54708]">
          La campaña sigue en preparación. Mientras no se inicie, la captura móvil,
          la cámara y el registro de terreno permanecerán bloqueados.
        </div>
      ) : null}
    </section>
  );
}
