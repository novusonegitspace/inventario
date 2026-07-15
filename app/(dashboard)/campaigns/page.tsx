import { getCampaignsOverview, listCampaigns } from "@/src/features/campaigns/application/list-campaigns";
import { CampaignList } from "@/src/features/campaigns/ui/campaign-list";
import { Button } from "@/src/shared/ui/button";
import { SectionHeading } from "@/src/shared/ui/section-heading";
import { StatCard } from "@/src/shared/ui/stat-card";

export default async function CampaignsPage() {
  const [campaigns, overview] = await Promise.all([
    listCampaigns(),
    getCampaignsOverview(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Campañas"
          title="Organice cada inventario como una campaña con fechas, alcance y seguimiento"
          description="Use las campañas para separar operaciones por cliente o sede, controlar el avance del conteo y centralizar la captura de evidencias."
        />
        <Button href="/campaigns/new" size="lg">
          Nueva campaña
        </Button>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <StatCard
          summary="Campañas creadas y disponibles para el equipo."
          title="Total campañas"
          trend="Base"
          value={String(overview.total)}
        />
        <StatCard
          summary="Campañas actualmente aptas para operación y captura."
          title="Activas"
          trend="Operando"
          value={String(overview.active)}
        />
        <StatCard
          summary="Activos incluidos en las campañas registradas."
          title="Activos"
          trend="Scope"
          value={String(overview.totalAssets)}
        />
        <StatCard
          summary="Nivel promedio de avance entre campañas activas y en preparación."
          title="Avance medio"
          trend="Promedio"
          value={`${overview.averageProgress}%`}
        />
      </section>

      <CampaignList campaigns={campaigns} />
    </main>
  );
}
