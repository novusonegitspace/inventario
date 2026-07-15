import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { getCampaignSettings } from "@/src/features/campaigns/application/get-campaign-settings";
import { canEditCampaign } from "@/src/features/campaigns/domain/campaign-status";
import { CampaignDetailHeader } from "@/src/features/campaigns/ui/campaign-detail-header";
import { CampaignProgressMeter } from "@/src/features/campaigns/ui/campaign-progress-meter";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";
import { SectionHeading } from "@/src/shared/ui/section-heading";
import { StatCard } from "@/src/shared/ui/stat-card";

const campaignModules = [
  {
    label: "Resumen",
    description: "Estado operativo, avance y reglas del ciclo.",
    href: "#",
  },
  {
    label: "Activos",
    description: "Maestro, carga manual y futuras importaciones.",
    href: "assets",
  },
  {
    label: "Evidencias",
    description: "Fotos, archivos y trazabilidad por captura.",
    href: "evidence",
  },
  {
    label: "Conciliación",
    description: "Diferencias revisables y snapshot recalculable.",
    href: "reconciliation",
  },
  {
    label: "Configuración",
    description: "Modo de inventario y criterios de conciliación.",
    href: "settings",
  },
  {
    label: "Timeline",
    description: "Eventos append-only y seguimiento de cambios.",
    href: "#",
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
      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Panel className="space-y-5" glow padding="lg">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white">
            La campaña no existe o ya no está disponible
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/60">
            Revise el listado de campañas y seleccione una campaña válida para
            consultar su avance, configuración y próximos pasos.
          </p>
          <div className="flex gap-3">
            <Button href="/campaigns">Volver al listado</Button>
            <Button href="/campaigns/new" variant="secondary">
              Crear campaña
            </Button>
          </div>
        </Panel>
      </main>
    );
  }

  const allowsEditing = canEditCampaign(campaign.status);

  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <CampaignDetailHeader campaign={campaign} />

      <section className="grid gap-6 lg:grid-cols-4">
        <StatCard
          summary="Activos cargados o esperados dentro de esta campaña."
          title="Activos"
          trend="Scope"
          value={String(campaign.assetCount)}
        />
        <StatCard
          summary="Capturas ya registradas dentro del flujo móvil."
          title="Capturas"
          trend="Field"
          value={String(campaign.captureCount)}
        />
        <StatCard
          summary="Evidencias asociadas a los registros de terreno."
          title="Evidencias"
          trend="Trace"
          value={String(campaign.evidenceCount)}
        />
        <StatCard
          summary="Diferencias que luego alimentarán conciliación."
          title="Diferencias"
          trend="Review"
          value={String(campaign.differenceCount)}
        />
      </section>

      <Panel className="space-y-5" padding="lg">
        <SectionHeading
          eyebrow="Avance"
          title="Siga el estado general del inventario en esta campaña"
          description="Revise el avance del conteo y confirme si la campaña sigue abierta para edición, captura y seguimiento operativo."
        />
        <CampaignProgressMeter value={campaign.progressPercentage} />
        {!allowsEditing ? (
          <div className="rounded-[24px] border border-amber-300/18 bg-amber-300/10 px-5 py-4 text-sm leading-7 text-amber-100">
            La campaña está cerrada. La UI ya refleja la regla de negocio que
            bloqueará edición y nuevas capturas.
          </div>
        ) : null}
      </Panel>

      {settings ? (
        <Panel className="space-y-5" padding="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Configuración"
              title="Revise las reglas de captura y cierre de la campaña"
              description="Aquí puede confirmar si la operación exige foto, geolocalización, activos manuales y bloqueo de capturas al cerrar."
            />
            <Button href={`/campaigns/${campaign.id}/settings`} variant="secondary">
              Editar configuración
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
              <p className="text-sm text-white/50">Foto obligatoria</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {settings.captureRequiresPhoto ? "Sí" : "No"}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
              <p className="text-sm text-white/50">Geo obligatoria</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {settings.captureRequiresGeo ? "Sí" : "No"}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
              <p className="text-sm text-white/50">Activos manuales</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {settings.allowManualAssets ? "Permitidos" : "Bloqueados"}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-black/24 p-5">
              <p className="text-sm text-white/50">Bloqueo al cierre</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {settings.closeBlocksCaptures ? "Activo" : "Desactivado"}
              </p>
            </div>
          </div>
        </Panel>
      ) : null}

      <section className="space-y-6" id="next-modules">
        <SectionHeading
          eyebrow="Módulos"
          title="Acceda a las áreas clave de la campaña"
          description="Use estos accesos para continuar con la preparación del inventario, la captura en terreno y la revisión de resultados."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {campaignModules.map((module) => (
            <Panel key={module.label} className="flex h-full flex-col gap-5">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200/72">
                  {module.label}
                </p>
                <p className="text-sm leading-7 text-white/60">
                  {module.description}
                </p>
              </div>
              <Button
                href={
                  module.href === "settings"
                    ? `/campaigns/${campaign.id}/settings`
                    : module.href === "assets"
                      ? `/campaigns/${campaign.id}/assets`
                      : module.href === "evidence"
                        ? `/campaigns/${campaign.id}/evidence`
                      : module.href === "reconciliation"
                        ? `/campaigns/${campaign.id}/reconciliation`
                      : module.href
                }
                variant="secondary"
              >
                {module.href === "settings"
                  ? "Abrir configuración"
                  : module.href === "assets"
                    ? "Abrir activos"
                    : module.href === "evidence"
                      ? "Abrir evidencia"
                    : module.href === "reconciliation"
                      ? "Abrir conciliación"
                    : "Disponible pronto"}
              </Button>
            </Panel>
          ))}
        </div>
      </section>
    </main>
  );
}
