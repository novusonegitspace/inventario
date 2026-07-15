import Link from "next/link";

import {
  getInventoryModeLabel,
  type Campaign,
} from "@/src/features/campaigns/domain/campaign";
import { getCampaignStatusMeta } from "@/src/features/campaigns/domain/campaign-status";
import { CampaignProgressMeter } from "@/src/features/campaigns/ui/campaign-progress-meter";
import { CampaignStatusBadge } from "@/src/features/campaigns/ui/campaign-status-badge";
import { Panel } from "@/src/shared/ui/panel";

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
});

function formatDate(value: Date | null) {
  return value ? dateFormatter.format(value) : "Por definir";
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const status = getCampaignStatusMeta(campaign.status);

  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <Panel
        className="flex h-full flex-col gap-6 transition duration-200 hover:border-emerald-300/24 hover:bg-slate-950/88"
        glow={campaign.status === "active"}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <CampaignStatusBadge status={campaign.status} />
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-[-0.05em] text-white">
                {campaign.name}
              </h3>
              <p className="text-sm text-white/56">
                {campaign.code} · {campaign.clientName}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-white/42">
              Sitio
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              {campaign.siteName}
            </p>
          </div>
        </div>

        <CampaignProgressMeter value={campaign.progressPercentage} />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">
              Activos
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {campaign.assetCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">
              Auditores
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {campaign.auditorCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">
              Evidencias
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {campaign.evidenceCount}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">
              Diferencias
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {campaign.differenceCount}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-white/54">
          <span>{getInventoryModeLabel(campaign.inventoryMode)}</span>
          <span className="h-1 w-1 rounded-full bg-white/24" />
          <span>
            {formatDate(campaign.scheduledStartAt)} -{" "}
            {formatDate(campaign.scheduledEndAt)}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/24" />
          <span>{status.description}</span>
        </div>
      </Panel>
    </Link>
  );
}
