import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { getCaptureSettings } from "@/src/features/campaign-settings/application/get-capture-settings";
import { PhysicalCaptureSettingsForm } from "@/src/features/campaign-settings/ui/physical-capture-settings-form";
import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { canEditCampaign } from "@/src/features/campaigns/domain/campaign-status";
import { CampaignWorkspaceNav } from "@/src/features/campaigns/ui/campaign-workspace-nav";

export default async function CampaignSettingsPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const [campaign, settings] = await Promise.all([
    getCampaignDetail(campaignId),
    getCaptureSettings(campaignId),
  ]);

  if (!campaign || !settings) {
    return (
      <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-[#e4e7eb] bg-white p-8 shadow-[0_18px_44px_rgba(20,55,90,0.06)]">
          <h1 className="text-3xl font-semibold text-[#14375a]">
            No pudimos abrir la configuración de esta campaña
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#667085]">
            Verifique que la campaña exista y vuelva a intentarlo desde el
            listado principal.
          </p>
          <Link
            className="mt-6 inline-flex h-11 items-center rounded-lg bg-[#0f988c] px-5 text-sm font-semibold text-white"
            href="/campaigns"
          >
            Volver a campañas
          </Link>
        </section>
      </main>
    );
  }

  const canEdit = canEditCampaign(campaign.status);

  return (
    <main className="mx-auto flex w-full max-w-[1760px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#667085]">
        <Link className="text-[#2e90fa] transition hover:text-[#14375a]" href="/campaigns">
          Campañas
        </Link>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
        <Link
          className="text-[#2e90fa] transition hover:text-[#14375a]"
          href={`/campaigns/${campaign.id}`}
        >
          {campaign.name}
        </Link>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
        <span className="text-[#14375a]">Configuración de toma física</span>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#14375a] sm:text-4xl">
            Configuración de toma física
          </h1>
          <p className="mt-2 max-w-3xl text-base leading-7 text-[#667085]">
            Define cómo se capturará la información durante la toma física de
            esta campaña: maestro, campos, evidencia, sobrantes y reglas móviles.
          </p>
        </div>
        <div className="rounded-full border border-[#d6deea] bg-white px-4 py-2 text-sm font-semibold text-[#46618a]">
          {campaign.code} · {campaign.clientName}
        </div>
      </div>

      <CampaignWorkspaceNav campaignId={campaign.id} />

      {!canEdit ? (
        <div className="rounded-lg border border-[#f2c878] bg-[#fff8eb] px-4 py-3 text-sm font-semibold text-[#8a5d00]">
          Esta campaña no permite editar configuración en su estado actual.
        </div>
      ) : null}

      <PhysicalCaptureSettingsForm
        campaignId={campaign.id}
        canEdit={canEdit}
        initialValues={{
          inventoryMode: settings.inventoryMode,
          assetManagementMethod: settings.assetManagementMethod,
          allowOfflineCapture: settings.allowOfflineCapture,
          allowEditRecords: settings.allowEditRecords,
          requireSupervisorReview: settings.requireSupervisorReview,
          autoCloseCampaign: settings.autoCloseCampaign,
          allowSurplusAssets: settings.allowSurplusAssets,
          manualAssetLimit: settings.manualAssetLimit,
          primaryPhotoRequirement: settings.primaryPhotoRequirement,
          additionalPhotosRequirement: settings.additionalPhotosRequirement,
          additionalPhotosMin: settings.additionalPhotosMin,
          otherFilesRequirement: settings.otherFilesRequirement,
          photoObservationRule: settings.photoObservationRule,
          conditionOptions: settings.conditionOptions,
          conditionRequiresObservationRule: settings.conditionRequiresObservationRule,
          notes: settings.notes,
          fields: settings.fields,
        }}
      />
    </main>
  );
}

