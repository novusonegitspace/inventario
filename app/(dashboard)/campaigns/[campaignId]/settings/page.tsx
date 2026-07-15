import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { getCampaignSettings } from "@/src/features/campaigns/application/get-campaign-settings";
import {
  canEditCampaign,
  canCaptureForCampaign,
} from "@/src/features/campaigns/domain/campaign-status";
import { CampaignSettingsForm } from "@/src/features/campaigns/ui/campaign-settings-form";
import { CampaignStatusBadge } from "@/src/features/campaigns/ui/campaign-status-badge";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";
import { SectionHeading } from "@/src/shared/ui/section-heading";

export default async function CampaignSettingsPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const [campaign, settings] = await Promise.all([
    getCampaignDetail(campaignId),
    getCampaignSettings(campaignId),
  ]);

  if (!campaign || !settings) {
    return (
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Panel className="space-y-5" glow padding="lg">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white">
            No pudimos abrir la configuración de esta campaña
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/60">
            Verifique que la campaña exista y vuelva a intentarlo desde el
            listado principal.
          </p>
          <Button href="/campaigns">Volver a campañas</Button>
        </Panel>
      </main>
    );
  }

  const canEdit = canEditCampaign(campaign.status);
  const canCapture = canCaptureForCampaign(campaign.status);

  return (
    <main className="mx-auto flex w-full max-w-[1380px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <Panel className="space-y-6" padding="lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <CampaignStatusBadge status={campaign.status} />
              <Badge tone="slate">{campaign.code}</Badge>
              <Badge tone="slate">Configuración</Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/62">
                Defina cómo debe comportarse la captura de activos, qué datos
                son obligatorios y qué sucede cuando la campaña se cierra.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={`/campaigns/${campaign.id}`} size="sm" variant="secondary">
              Volver al detalle
            </Button>
            <Button href="/campaigns" size="sm" variant="secondary">
              Ver campañas
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
            <p className="text-sm text-white/50">Edición</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {canEdit ? "Habilitada" : "Bloqueada"}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
            <p className="text-sm text-white/50">Captura actual</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {canCapture ? "Disponible" : "No disponible"}
            </p>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
            <p className="text-sm text-white/50">Última actualización</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {new Intl.DateTimeFormat("es-CL", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }).format(settings.updatedAt)}
            </p>
          </div>
        </div>
      </Panel>

      <SectionHeading
        eyebrow="Configuración operativa"
        title="Configure las reglas que guían el trabajo en terreno"
        description="Ajuste los requisitos de evidencia, la geolocalización, la creación manual de activos y el bloqueo de capturas al cierre."
      />

      <CampaignSettingsForm
        campaignId={campaign.id}
        canEdit={canEdit}
        initialValues={{
          captureRequiresPhoto: settings.captureRequiresPhoto,
          captureRequiresGeo: settings.captureRequiresGeo,
          allowManualAssets: settings.allowManualAssets,
          closeBlocksCaptures: settings.closeBlocksCaptures,
          notes: settings.notes,
        }}
      />
    </main>
  );
}
