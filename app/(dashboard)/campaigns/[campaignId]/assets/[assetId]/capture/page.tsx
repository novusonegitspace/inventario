import { getAssetDetail } from "@/src/features/assets/application/get-asset-detail";
import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { getCampaignSettings } from "@/src/features/campaigns/application/get-campaign-settings";
import { canCaptureForCampaign } from "@/src/features/campaigns/domain/campaign-status";
import { listAssetCaptures } from "@/src/features/captures/application/list-asset-captures";
import { defaultAssetCaptureDraft } from "@/src/features/captures/domain/asset-capture";
import { CaptureForm } from "@/src/features/captures/ui/capture-form";
import { CaptureList } from "@/src/features/captures/ui/capture-list";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";
import { SectionHeading } from "@/src/shared/ui/section-heading";

export default async function AssetCapturePage({
  params,
}: {
  params: Promise<{ campaignId: string; assetId: string }>;
}) {
  const { campaignId, assetId } = await params;
  const [campaign, asset, settings, captures] = await Promise.all([
    getCampaignDetail(campaignId),
    getAssetDetail(campaignId, assetId),
    getCampaignSettings(campaignId),
    listAssetCaptures(campaignId, assetId),
  ]);

  if (!campaign || !asset) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Panel className="space-y-5" glow padding="lg">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white">
            No pudimos abrir la captura de este activo
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/60">
            Vuelva a la campaña y seleccione un activo válido para registrar la
            captura desde terreno.
          </p>
          <Button href={`/campaigns/${campaignId}/assets`} variant="secondary">
            Volver a activos
          </Button>
        </Panel>
      </main>
    );
  }

  const canCapture = canCaptureForCampaign(campaign.status);

  return (
    <main className="mx-auto flex w-full max-w-[1480px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <Panel className="space-y-6" glow padding="lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{asset.barcode || asset.assetTag}</Badge>
              <Badge tone="slate">{campaign.code}</Badge>
              <Badge tone="slate">Captura</Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                {asset.name}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/62">
                Registre el código leído, el contexto de terreno y las
                observaciones del activo para dejar trazabilidad de la visita.
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

      <CaptureForm
        assetId={asset.id}
        campaignId={campaign.id}
        canCapture={canCapture}
        initialValues={{
          ...defaultAssetCaptureDraft,
          scannedCode: asset.barcode || asset.assetTag,
          observedLocation: asset.location,
          observedResponsible: asset.responsible,
          observedCostCenter: asset.costCenter,
          observedSerialNumber: asset.serialNumber,
        }}
        requiresGeo={Boolean(settings?.captureRequiresGeo)}
      />

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Historial reciente"
          title="Consulte las últimas capturas registradas sobre este activo"
          description="Revise qué se escaneó, quién hizo la captura y qué observaciones quedaron registradas durante las visitas anteriores."
        />
        <CaptureList captures={captures} />
      </section>
    </main>
  );
}
