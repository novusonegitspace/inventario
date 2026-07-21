import Link from "next/link";

import {
  getInventoryModeLabel,
  type Campaign,
} from "@/src/features/campaigns/domain/campaign";
import { MvpStatusPill } from "@/src/shared/ui/mvp-status-pill";

export function CampaignRowList({
  campaigns,
  emptyHref = "/campaigns/new",
  emptyLabel = "Crear primera campaña",
}: {
  campaigns: Campaign[];
  emptyHref?: string;
  emptyLabel?: string;
}) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
          Todavía no hay campañas creadas
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667085]">
          Cree una campaña para separar cada operación por cliente o sede,
          preparar activos y habilitar la captura móvil del inventario.
        </p>
        <Link
          href={emptyHref}
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#14375a] px-4 text-sm font-semibold text-white transition hover:bg-[#102e4d]"
        >
          {emptyLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {campaigns.map((campaign) => (
        <Link
          key={campaign.id}
          href={`/campaigns/${campaign.id}`}
          className="flex items-center justify-between gap-3 rounded-lg border border-[#e4e7eb] bg-white p-4 text-left shadow-[0_18px_48px_rgba(20,55,90,0.05)] transition hover:border-[#cfd5dc] hover:bg-[#fbfcfd]"
        >
          <span className="grid gap-1">
            <strong className="text-base font-semibold text-[#2d2d2d]">
              {campaign.name}
            </strong>
            <small className="text-sm text-[#667085]">
              {campaign.clientName} · {campaign.siteName} ·{" "}
              {getInventoryModeLabel(campaign.inventoryMode)}
            </small>
          </span>
          <MvpStatusPill value={campaign.status} />
        </Link>
      ))}
    </div>
  );
}
