import { redirect } from "next/navigation";

import { logout } from "@/src/features/auth/actions";
import { getAuthSession } from "@/src/features/auth/session";
import {
  getCampaignsOverview,
  listCampaigns,
} from "@/src/features/campaigns/application/list-campaigns";
import { CampaignList } from "@/src/features/campaigns/ui/campaign-list";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";
import { SectionHeading } from "@/src/shared/ui/section-heading";
import { StatCard } from "@/src/shared/ui/stat-card";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  const [campaigns, overview] = await Promise.all([
    listCampaigns(),
    getCampaignsOverview(),
  ]);

  const recentCampaigns = campaigns.slice(0, 2);

  return (
    <main className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
      <Panel className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Badge>Panel principal</Badge>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              Bienvenido, {session.name}
            </h1>
            <p className="text-sm text-white/60">
              Organización activa: {session.tenantName}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/campaigns/new" size="sm">
            Nueva campaña
          </Button>
          <form action={logout}>
            <button className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/6 px-5 text-sm font-semibold text-white transition hover:bg-white/10">
              Cerrar sesión
            </button>
          </form>
        </div>
      </Panel>

      <SectionHeading
        eyebrow="Entrada operativa"
        title="Supervise el avance del inventario y entre a las campañas activas"
        description="Desde aquí puede revisar el estado general de la operación, abrir campañas recientes y continuar la ejecución del inventario."
      />

      <section className="grid gap-6 lg:grid-cols-4">
        <StatCard
          summary="Campañas creadas para organizar inventarios por cliente o sede."
          title="Campañas"
          trend="Base"
          value={String(overview.total)}
        />
        <StatCard
          summary="Campañas que ya pueden abrir operación y captura."
          title="Activas"
          trend="Operando"
          value={String(overview.active)}
        />
        <StatCard
          summary="Porcentaje promedio de avance entre las campañas registradas."
          title="Avance medio"
          trend="Promedio"
          value={`${overview.averageProgress}%`}
        />
        <StatCard
          summary="Cantidad total de activos considerados en las campañas listadas."
          title="Activos"
          trend="Scope"
          value={String(overview.totalAssets)}
        />
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Campañas recientes"
            title="Retome campañas recientes y continúe la operación"
            description="Abra una campaña para revisar configuración, preparar activos, registrar capturas y seguir el cierre del inventario."
          />
          <Button href="/campaigns" variant="secondary">
            Ver todas
          </Button>
        </div>
        <CampaignList campaigns={recentCampaigns} />
      </section>
    </main>
  );
}
