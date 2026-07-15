import { getAssetsOverview, listAssets } from "@/src/features/assets/application/list-assets";
import { AssetForm } from "@/src/features/assets/ui/asset-form";
import { AssetList } from "@/src/features/assets/ui/asset-list";
import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { canEditCampaign } from "@/src/features/campaigns/domain/campaign-status";
import { CampaignStatusBadge } from "@/src/features/campaigns/ui/campaign-status-badge";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";
import { SectionHeading } from "@/src/shared/ui/section-heading";
import { StatCard } from "@/src/shared/ui/stat-card";

export default async function CampaignAssetsPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const [campaign, assets, overview] = await Promise.all([
    getCampaignDetail(campaignId),
    listAssets(campaignId),
    getAssetsOverview(campaignId),
  ]);

  if (!campaign) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Panel className="space-y-5" glow padding="lg">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white">
            No encontramos la campaña solicitada
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/60">
            Vuelva al listado y seleccione una campaña disponible para revisar
            o registrar activos.
          </p>
          <Button href="/campaigns">Volver a campañas</Button>
        </Panel>
      </main>
    );
  }

  const canEdit = canEditCampaign(campaign.status);

  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <Panel className="space-y-6" padding="lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <CampaignStatusBadge status={campaign.status} />
              <Badge tone="slate">{campaign.code}</Badge>
              <Badge tone="slate">Activos</Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/62">
                Organice el maestro de activos de la campaña, revise
                responsables y prepare el inventario antes de la captura en
                terreno.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={`/campaigns/${campaign.id}`} size="sm" variant="secondary">
              Volver a campaña
            </Button>
            <Button href="#nuevo-activo" size="sm">
              Nuevo activo
            </Button>
          </div>
        </div>
      </Panel>

      <section className="grid gap-6 lg:grid-cols-4">
        <StatCard
          summary="Activos registrados dentro de esta campaña."
          title="Total activos"
          trend="Inventario"
          value={String(overview.total)}
        />
        <StatCard
          summary="Activos que ya tienen responsable asignado."
          title="Con responsable"
          trend="Control"
          value={String(overview.withResponsible)}
        />
        <StatCard
          summary="Activos con ubicación definida para el conteo."
          title="Con ubicación"
          trend="Ubicación"
          value={String(overview.withLocation)}
        />
        <StatCard
          summary="Activos que aún no registran captura."
          title="Pendientes"
          trend="Por capturar"
          value={String(overview.pendingCapture)}
        />
      </section>

      <SectionHeading
        eyebrow="Listado de activos"
        title="Revise los activos incluidos en esta campaña"
        description="Abra cada activo para consultar su trazabilidad, verificar si ya fue capturado y preparar el seguimiento del inventario."
      />

      <AssetList assets={assets} campaignId={campaign.id} />

      <section className="space-y-6" id="nuevo-activo">
        <SectionHeading
          eyebrow="Nuevo activo"
          title="Registre activos manualmente cuando el inventario lo requiera"
          description="Use esta carga rápida para incorporar equipos, mobiliario u otros bienes antes de salir a terreno."
        />

        {!canEdit ? (
          <Panel className="space-y-3" padding="lg">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              La campaña está cerrada
            </h2>
            <p className="text-sm leading-7 text-white/60">
              No es posible agregar nuevos activos porque la campaña ya fue
              cerrada.
            </p>
          </Panel>
        ) : null}

        <AssetForm campaignId={campaign.id} canEdit={canEdit} />
      </section>
    </main>
  );
}
