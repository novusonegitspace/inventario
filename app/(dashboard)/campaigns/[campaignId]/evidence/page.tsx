import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { CampaignStatusBadge } from "@/src/features/campaigns/ui/campaign-status-badge";
import { listCampaignEvidence } from "@/src/features/evidence/application/list-evidence";
import { EvidenceList } from "@/src/features/evidence/ui/evidence-list";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";
import { SectionHeading } from "@/src/shared/ui/section-heading";
import { StatCard } from "@/src/shared/ui/stat-card";

export default async function CampaignEvidencePage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const [campaign, evidence] = await Promise.all([
    getCampaignDetail(campaignId),
    listCampaignEvidence(campaignId),
  ]);

  if (!campaign) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Panel className="space-y-5" glow padding="lg">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white">
            No encontramos la campaña solicitada
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/60">
            Vuelva al listado de campañas y seleccione una válida para revisar
            la evidencia registrada.
          </p>
          <Button href="/campaigns">Volver a campañas</Button>
        </Panel>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <Panel className="space-y-6" glow padding="lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <CampaignStatusBadge status={campaign.status} />
              <Badge tone="slate">{campaign.code}</Badge>
              <Badge tone="slate">Evidencia</Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/62">
                Consulte todos los respaldos documentales registrados durante el
                inventario y navegue a los activos que los originaron.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={`/campaigns/${campaign.id}/assets`} size="sm">
              Ir a activos
            </Button>
            <Button href={`/campaigns/${campaign.id}`} size="sm" variant="secondary">
              Volver a campaña
            </Button>
          </div>
        </div>
      </Panel>

      <section className="grid gap-6 lg:grid-cols-3">
        <StatCard
          summary="Archivos de respaldo registrados en esta campaña."
          title="Evidencias"
          trend="Respaldo"
          value={String(evidence.length)}
        />
        <StatCard
          summary="Capturas que ya cuentan con al menos un archivo asociado."
          title="Con respaldo"
          trend="Cobertura"
          value={String(new Set(evidence.map((item) => item.captureId)).size)}
        />
        <StatCard
          summary="Activos alcanzados por el respaldo documental existente."
          title="Activos cubiertos"
          trend="Seguimiento"
          value={String(new Set(evidence.map((item) => item.assetId)).size)}
        />
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Archivos registrados"
          title="Revise el respaldo documental disponible"
          description="Cada evidencia queda vinculada a una captura y ayuda a respaldar la validación realizada por el equipo en terreno."
        />
        <EvidenceList evidence={evidence} />
      </section>
    </main>
  );
}
