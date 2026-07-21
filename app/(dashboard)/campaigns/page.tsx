import Link from "next/link";

import {
  getCampaignsOverview,
  listCampaigns,
  summarizeCampaigns,
} from "@/src/features/campaigns/application/list-campaigns";
import {
  campaignStatuses,
  getCampaignStatusMeta,
} from "@/src/features/campaigns/domain/campaign-status";
import { CampaignTrackingTable } from "@/src/features/campaigns/ui/campaign-tracking-table";
import { MvpMetricCard } from "@/src/shared/ui/mvp-metric-card";
import { MvpPrimaryLink, MvpTopbar } from "@/src/shared/ui/mvp-topbar";

function readSingle(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    status?: string | string[];
    client?: string | string[];
    from?: string | string[];
    to?: string | string[];
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const [campaigns, overview] = await Promise.all([
    listCampaigns(),
    getCampaignsOverview(),
  ]);
  const query = readSingle(resolvedSearchParams.q).trim().toLowerCase();
  const status = readSingle(resolvedSearchParams.status);
  const client = readSingle(resolvedSearchParams.client);
  const from = readSingle(resolvedSearchParams.from);
  const to = readSingle(resolvedSearchParams.to);
  const clientOptions = [...new Set(campaigns.map((campaign) => campaign.clientName))]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesQuery =
      !query ||
      campaign.name.toLowerCase().includes(query) ||
      campaign.code.toLowerCase().includes(query) ||
      campaign.clientName.toLowerCase().includes(query) ||
      campaign.siteName.toLowerCase().includes(query);

    const matchesStatus = !status || campaign.status === status;
    const matchesClient = !client || campaign.clientName === client;
    const referenceStart = campaign.scheduledStartAt ?? campaign.createdAt;
    const referenceEnd = campaign.scheduledEndAt ?? campaign.updatedAt;
    const matchesFrom = !from || referenceStart >= new Date(`${from}T00:00:00.000Z`);
    const matchesTo = !to || referenceEnd <= new Date(`${to}T23:59:59.999Z`);

    return (
      matchesQuery &&
      matchesStatus &&
      matchesClient &&
      matchesFrom &&
      matchesTo
    );
  });
  const filteredOverview = summarizeCampaigns(filteredCampaigns);
  const filteredAuditors = filteredCampaigns.reduce(
    (sum, campaign) => sum + campaign.auditorCount,
    0,
  );

  return (
    <main className="space-y-8">
      <MvpTopbar
        eyebrow="Operación"
        title="Campañas"
        action={<MvpPrimaryLink href="/campaigns/new">Nueva campaña</MvpPrimaryLink>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MvpMetricCard label="Campañas visibles" value={String(filteredCampaigns.length)} />
        <MvpMetricCard label="Activas" value={String(filteredOverview.active)} />
        <MvpMetricCard label="Activos" value={String(filteredOverview.totalAssets)} />
        <MvpMetricCard label="Auditores" value={String(filteredAuditors)} />
        <MvpMetricCard
          label="Avance medio"
          value={`${filteredOverview.averageProgress}%`}
        />
      </section>

      <section className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
              Seguimiento operativo
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[#667085]">
              Filtre por campaña, cliente, estado y calendario para priorizar la
              preparación, ejecución o revisión del inventario.
            </p>
          </div>
          <p className="text-sm text-[#667085]">
            Total tenant: {overview.total} campañas registradas.
          </p>
        </div>
        <form className="mt-6 grid gap-4 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto_auto]">
          <input
            className="h-12 rounded-lg border border-[#d0d5dd] bg-[#f7f8fa] px-4 text-sm text-[#14375a] outline-none transition focus:border-[#1f9e7a]"
            defaultValue={query}
            name="q"
            placeholder="Buscar por campaña, código, cliente o sitio"
          />
          <select
            className="h-12 rounded-lg border border-[#d0d5dd] bg-[#f7f8fa] px-4 text-sm text-[#14375a] outline-none transition focus:border-[#1f9e7a]"
            defaultValue={status}
            name="status"
          >
            <option value="">Todos los estados</option>
            {campaignStatuses.map((item) => (
              <option key={item} value={item}>
                {getCampaignStatusMeta(item).label}
              </option>
            ))}
          </select>
          <select
            className="h-12 rounded-lg border border-[#d0d5dd] bg-[#f7f8fa] px-4 text-sm text-[#14375a] outline-none transition focus:border-[#1f9e7a]"
            defaultValue={client}
            name="client"
          >
            <option value="">Todos los clientes</option>
            {clientOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            className="h-12 rounded-lg border border-[#d0d5dd] bg-[#f7f8fa] px-4 text-sm text-[#14375a] outline-none transition focus:border-[#1f9e7a]"
            defaultValue={from}
            name="from"
            type="date"
          />
          <input
            className="h-12 rounded-lg border border-[#d0d5dd] bg-[#f7f8fa] px-4 text-sm text-[#14375a] outline-none transition focus:border-[#1f9e7a]"
            defaultValue={to}
            name="to"
            type="date"
          />
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#14375a] px-4 text-sm font-semibold text-white transition hover:bg-[#102e4d]"
            type="submit"
          >
            Filtrar
          </button>
          <Link
            href="/campaigns"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#e4e7eb] bg-white px-4 text-sm font-semibold text-[#14375a] transition hover:bg-[#f7f8fa]"
          >
            Limpiar
          </Link>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
            Campañas
          </h2>
          <p className="mt-1 text-sm text-[#667085]">
            Haga clic en cualquier fila para abrir resumen, activos, auditores,
            evidencias, conciliación y configuración de la campaña.
          </p>
        </div>
        <CampaignTrackingTable campaigns={filteredCampaigns} />
      </section>
    </main>
  );
}
