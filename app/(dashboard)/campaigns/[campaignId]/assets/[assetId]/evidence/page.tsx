import { getAssetDetail } from "@/src/features/assets/application/get-asset-detail";
import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { canEditCampaign } from "@/src/features/campaigns/domain/campaign-status";
import { listAssetCaptures } from "@/src/features/captures/application/list-asset-captures";
import { listEvidence } from "@/src/features/evidence/application/list-evidence";
import { EvidenceForm } from "@/src/features/evidence/ui/evidence-form";
import { EvidenceList } from "@/src/features/evidence/ui/evidence-list";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";
import { SectionHeading } from "@/src/shared/ui/section-heading";
import { StatCard } from "@/src/shared/ui/stat-card";

export default async function AssetEvidencePage({
  params,
}: {
  params: Promise<{ campaignId: string; assetId: string }>;
}) {
  const { campaignId, assetId } = await params;
  const [campaign, asset, captures, evidence] = await Promise.all([
    getCampaignDetail(campaignId),
    getAssetDetail(campaignId, assetId),
    listAssetCaptures(campaignId, assetId),
    listEvidence(campaignId, assetId),
  ]);

  if (!campaign || !asset) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Panel className="space-y-5" glow padding="lg">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white">
            No pudimos abrir la evidencia de este activo
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/60">
            Vuelva al listado de activos y seleccione un registro válido para
            revisar o adjuntar respaldos.
          </p>
          <Button href={`/campaigns/${campaignId}/assets`} variant="secondary">
            Volver a activos
          </Button>
        </Panel>
      </main>
    );
  }

  const canEdit = canEditCampaign(campaign.status);

  return (
    <main className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <Panel className="space-y-6" glow padding="lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{asset.assetTag}</Badge>
              <Badge tone="slate">{campaign.code}</Badge>
              <Badge tone="slate">Evidencia</Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                {asset.name}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/62">
                Reúna fotos y archivos de respaldo para dejar evidencia clara de
                la revisión realizada sobre este activo.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              href={`/campaigns/${campaign.id}/assets/${asset.id}`}
              size="sm"
              variant="secondary"
            >
              Volver al activo
            </Button>
            <Button href={`/campaigns/${campaign.id}/assets`} size="sm" variant="secondary">
              Ver activos
            </Button>
          </div>
        </div>
      </Panel>

      <section className="grid gap-6 lg:grid-cols-3">
        <StatCard
          summary="Archivos de respaldo asociados a este activo."
          title="Evidencias"
          trend="Respaldo"
          value={String(evidence.length)}
        />
        <StatCard
          summary="Capturas disponibles para relacionar con evidencia."
          title="Capturas"
          trend="Referencia"
          value={String(captures.length)}
        />
        <StatCard
          summary="Estado del activo dentro de la campaña actual."
          title="Estado"
          trend="Activo"
          value={asset.isActive ? "Operativo" : "Inactivo"}
        />
      </section>

      <EvidenceForm
        assetId={asset.id}
        campaignId={campaign.id}
        canEdit={canEdit}
        captures={captures}
      />

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Respaldo registrado"
          title="Consulte las evidencias cargadas para este activo"
          description="Revise archivos, fechas y capturas relacionadas para tener respaldo documental del conteo o la validación."
        />
        <EvidenceList evidence={evidence} />
      </section>
    </main>
  );
}
