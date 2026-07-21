import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { getCampaignSettings } from "@/src/features/campaigns/application/get-campaign-settings";
import { canEditCampaign } from "@/src/features/campaigns/domain/campaign-status";
import { CampaignDetailHeader } from "@/src/features/campaigns/ui/campaign-detail-header";
import { CampaignProgressMeter } from "@/src/features/campaigns/ui/campaign-progress-meter";
import { CampaignWorkspaceNav } from "@/src/features/campaigns/ui/campaign-workspace-nav";
import { MvpMetricCard } from "@/src/shared/ui/mvp-metric-card";
import { MvpSecondaryLink, MvpTopbar } from "@/src/shared/ui/mvp-topbar";

const campaignModules = [
  {
    label: "Activos",
    description: "Maestro, carga manual y futuras importaciones.",
    href: "assets",
    cta: "Abrir activos",
  },
  {
    label: "Auditores",
    description: "Asignación de equipo, roles y seguimiento de campaña.",
    href: "auditors",
    cta: "Abrir auditores",
  },
  {
    label: "Evidencias",
    description: "Fotos, archivos y trazabilidad por captura.",
    href: "evidence",
    cta: "Abrir evidencia",
  },
  {
    label: "Conciliación",
    description: "Diferencias revisables y snapshot recalculable.",
    href: "reconciliation",
    cta: "Abrir conciliación",
  },
  {
    label: "Configuración",
    description: "Modo de inventario y criterios de conciliación.",
    href: "settings",
    cta: "Abrir configuración",
  },
] as const;

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const [campaign, settings] = await Promise.all([
    getCampaignDetail(campaignId),
    getCampaignSettings(campaignId),
  ]);

  if (!campaign) {
    return (
      <main>
        <section className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#2d2d2d]">
            La campaña no existe o ya no está disponible
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#667085]">
            Revise el listado de campañas y seleccione una campaña válida para
            consultar su avance, configuración y próximos pasos.
          </p>
          <div className="mt-6 flex gap-3">
            <MvpSecondaryLink href="/campaigns">Volver al listado</MvpSecondaryLink>
            <MvpSecondaryLink href="/campaigns/new">Crear campaña</MvpSecondaryLink>
          </div>
        </section>
      </main>
    );
  }

  const allowsEditing = canEditCampaign(campaign.status);

  return (
    <main className="space-y-8">
      <MvpTopbar eyebrow="Campaña" title={campaign.name} />

      <CampaignDetailHeader campaign={campaign} />
      <CampaignWorkspaceNav campaignId={campaign.id} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MvpMetricCard label="Activos cargados" value={String(campaign.assetCount)} />
        <MvpMetricCard label="Capturas" value={String(campaign.captureCount)} />
        <MvpMetricCard label="Evidencias" value={String(campaign.evidenceCount)} />
        <MvpMetricCard label="Diferencias" value={String(campaign.differenceCount)} />
      </section>

      <section className="space-y-5 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#667085]">
            Avance
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
            Siga el estado general del inventario en esta campaña
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[#667085]">
            Revise el avance del conteo y confirme si la campaña sigue abierta
            para edición, captura y seguimiento operativo.
          </p>
        </div>
        <CampaignProgressMeter value={campaign.progressPercentage} tone="light" />
        {!allowsEditing ? (
          <div className="rounded-lg border border-[#ffe2b7] bg-[#fff4e5] px-5 py-4 text-sm leading-7 text-[#b54708]">
            La campaña está cerrada. La UI ya refleja la regla de negocio que
            bloqueará edición y nuevas capturas.
          </div>
        ) : null}
      </section>

      {settings ? (
        <section className="space-y-5 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#667085]">
                Configuración
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
                Revise las reglas de captura y cierre de la campaña
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[#667085]">
                Aquí puede confirmar si la operación exige foto, geolocalización,
                activos manuales y bloqueo de capturas al cerrar.
              </p>
            </div>
            <MvpSecondaryLink href={`/campaigns/${campaign.id}/settings`}>
              Editar configuración
            </MvpSecondaryLink>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-5">
              <p className="text-sm text-[#667085]">Foto obligatoria</p>
              <p className="mt-2 text-xl font-semibold text-[#14375a]">
                {settings.captureRequiresPhoto ? "Sí" : "No"}
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-5">
              <p className="text-sm text-[#667085]">Geo obligatoria</p>
              <p className="mt-2 text-xl font-semibold text-[#14375a]">
                {settings.captureRequiresGeo ? "Sí" : "No"}
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-5">
              <p className="text-sm text-[#667085]">Activos manuales</p>
              <p className="mt-2 text-xl font-semibold text-[#14375a]">
                {settings.allowManualAssets ? "Permitidos" : "Bloqueados"}
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-5">
              <p className="text-sm text-[#667085]">Bloqueo al cierre</p>
              <p className="mt-2 text-xl font-semibold text-[#14375a]">
                {settings.closeBlocksCaptures ? "Activo" : "Desactivado"}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-6" id="next-modules">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#667085]">
            Módulos
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
            Acceda a las áreas clave de la campaña
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[#667085]">
            Use estos accesos para continuar con la preparación del inventario,
            la captura en terreno y la revisión de resultados.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {campaignModules.map((module) => (
            <div
              key={module.label}
              className="flex h-full flex-col gap-5 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.05)]"
            >
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#667085]">
                  {module.label}
                </p>
                <p className="text-sm leading-7 text-[#667085]">{module.description}</p>
              </div>
              <MvpSecondaryLink href={`/campaigns/${campaign.id}/${module.href}`}>
                {module.cta}
              </MvpSecondaryLink>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
