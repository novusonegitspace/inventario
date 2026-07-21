import { listCampaignAuditors } from "@/src/features/auditors/application/list-campaign-auditors";
import { CampaignAuditorList } from "@/src/features/auditors/ui/campaign-auditor-list";
import { getCampaignDetail } from "@/src/features/campaigns/application/get-campaign-detail";
import { CampaignWorkspaceNav } from "@/src/features/campaigns/ui/campaign-workspace-nav";
import { CampaignStatusBadge } from "@/src/features/campaigns/ui/campaign-status-badge";
import { Badge } from "@/src/shared/ui/badge";
import { MvpMetricCard } from "@/src/shared/ui/mvp-metric-card";
import { MvpSecondaryLink } from "@/src/shared/ui/mvp-topbar";

export default async function CampaignAuditorsPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  const [campaign, auditors] = await Promise.all([
    getCampaignDetail(campaignId),
    listCampaignAuditors(campaignId),
  ]);

  if (!campaign) {
    return (
      <main className="space-y-6">
        <section className="rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#2d2d2d]">
            No encontramos la campaña solicitada
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#667085]">
            Vuelva al listado y seleccione una campaña disponible para revisar
            asignaciones del equipo.
          </p>
          <div className="mt-6">
            <MvpSecondaryLink href="/campaigns">Volver a campañas</MvpSecondaryLink>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <section className="space-y-6 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <CampaignStatusBadge status={campaign.status} />
              <Badge tone="slate">{campaign.code}</Badge>
              <Badge tone="slate">Auditores</Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#2d2d2d] sm:text-5xl">
                {campaign.name}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[#667085]">
                Revise el equipo asignado a la campaña y prepare el siguiente
                slice de progreso, roles y última actividad.
              </p>
            </div>
          </div>

          <MvpSecondaryLink href={`/campaigns/${campaign.id}`}>
            Volver a resumen
          </MvpSecondaryLink>
        </div>

        <CampaignWorkspaceNav campaignId={campaign.id} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MvpMetricCard label="Auditores asignados" value={String(auditors.length)} />
        <MvpMetricCard
          label="Supervisores"
          value={String(auditors.filter((item) => item.role === "supervisor").length)}
        />
        <MvpMetricCard
          label="Terreno"
          value={String(auditors.filter((item) => item.role === "field_auditor").length)}
        />
        <MvpMetricCard
          label="Líderes"
          value={String(
            auditors.filter(
              (item) => item.role === "project_lead" || item.role === "tenant_admin",
            ).length,
          )}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
            Auditores asignados
          </h2>
          <p className="mt-1 text-sm text-[#667085]">
            Esta vista ya existe como módulo interno formal del workspace de campaña.
          </p>
        </div>
        <CampaignAuditorList auditors={auditors} />
      </section>
    </main>
  );
}
