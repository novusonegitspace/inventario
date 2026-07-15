import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { CampaignStatusBadge } from "@/src/features/campaigns/ui/campaign-status-badge";
import { recalculateReconciliationAction } from "@/src/features/reconciliation/actions";
import {
  getReconciliationOverview,
  listLatestReconciliationResults,
} from "@/src/features/reconciliation/application/list-reconciliation-results";
import { ReconciliationList } from "@/src/features/reconciliation/ui/reconciliation-list";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";
import { SectionHeading } from "@/src/shared/ui/section-heading";
import { StatCard } from "@/src/shared/ui/stat-card";

export default async function CampaignReconciliationPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const [campaign, results, overview] = await Promise.all([
    getCampaignDetail(campaignId),
    listLatestReconciliationResults(campaignId),
    getReconciliationOverview(campaignId),
  ]);

  if (!campaign) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Panel className="space-y-5" glow padding="lg">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white">
            No encontramos la campaña solicitada
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/60">
            Vuelva al listado de campañas y seleccione una válida para ejecutar
            la conciliación del inventario.
          </p>
          <Button href="/campaigns">Volver a campañas</Button>
        </Panel>
      </main>
    );
  }

  const recalculateForCampaign = recalculateReconciliationAction.bind(
    null,
    campaign.id,
  );

  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <Panel className="space-y-6" glow padding="lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <CampaignStatusBadge status={campaign.status} />
              <Badge tone="slate">{campaign.code}</Badge>
              <Badge tone="slate">Conciliación</Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/62">
                Compare la información del maestro con las capturas de terreno
                para detectar coincidencias, diferencias y activos sin registro.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <form action={recalculateForCampaign}>
              <Button size="sm" type="submit">
                Recalcular
              </Button>
            </form>
            <Button href={`/campaigns/${campaign.id}`} size="sm" variant="secondary">
              Volver a campaña
            </Button>
          </div>
        </div>
      </Panel>

      <section className="grid gap-6 lg:grid-cols-4">
        <StatCard
          summary="Activos incluidos en el último cálculo."
          title="Total revisado"
          trend="Snapshot"
          value={String(overview.total)}
        />
        <StatCard
          summary="Activos conciliados sin diferencias en los campos comparados."
          title="Conciliados"
          trend="Correctos"
          value={String(overview.conciliated)}
        />
        <StatCard
          summary="Activos con diferencias detectadas entre maestro y captura."
          title="Con diferencias"
          trend="Revisión"
          value={String(overview.withDifferences)}
        />
        <StatCard
          summary="Activos que aún no cuentan con captura registrada."
          title="Sin captura"
          trend="Pendientes"
          value={String(overview.notFound)}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Resultado"
          title="Revise el último snapshot de conciliación de la campaña"
          description="Cada fila resume el estado de un activo comparando código, ubicación, responsable, centro de costo y serie cuando hay datos observados."
        />
        <ReconciliationList results={results} />
      </section>
    </main>
  );
}
