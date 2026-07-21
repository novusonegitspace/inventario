import { getAdminOverview } from "@/src/features/admin/application/get-admin-overview";
import { MvpMetricCard } from "@/src/shared/ui/mvp-metric-card";
import { MvpTopbar } from "@/src/shared/ui/mvp-topbar";

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminPage() {
  const overview = await getAdminOverview();

  return (
    <main className="space-y-8">
      <MvpTopbar eyebrow={overview.tenantName} title="Administración" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MvpMetricCard label="Usuarios activos" value={String(overview.activeUsers)} />
        <MvpMetricCard label="Clientes activos" value={String(overview.activeClients)} />
        <MvpMetricCard label="Campañas" value={String(overview.totalCampaigns)} />
        <MvpMetricCard label="Roles con uso" value={String(overview.activeRoles)} />
        <MvpMetricCard
          label="Asignaciones visibles"
          value={String(overview.members.length)}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
              Distribución de acceso
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#667085]">
              Vista inicial de roles activos dentro del tenant actual.
            </p>
          </div>
          <div className="grid gap-3">
            {overview.roleDistribution.map((item) => (
              <div
                key={item.role}
                className="flex items-center justify-between rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-4 py-3"
              >
                <span className="text-sm font-medium text-[#14375a]">{item.label}</span>
                <span className="text-lg font-semibold text-[#14375a]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
              Equipo del tenant
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#667085]">
              Usuarios y roles que hoy están alimentando campañas, captura y revisión.
            </p>
          </div>
          {overview.members.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#d0d5dd] bg-[#f7f8fa] px-5 py-6 text-sm leading-7 text-[#667085]">
              Todavía no hay membresías activas registradas en este tenant.
            </div>
          ) : (
            <div className="grid gap-3">
              {overview.members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-4 py-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#14375a]">{member.name}</p>
                      <p className="mt-1 text-sm text-[#667085]">{member.email}</p>
                    </div>
                    <div className="text-sm text-[#667085] sm:text-right">
                      <p>{member.role}</p>
                      <p className="mt-1">
                        {member.lastSeenAt
                          ? `Última actividad ${dateFormatter.format(member.lastSeenAt)}`
                          : "Sin actividad reciente"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
            Clientes del tenant
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#667085]">
            Base inicial para futuras políticas por cliente, permisos y configuraciones.
          </p>
        </div>
        {overview.clients.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d0d5dd] bg-[#f7f8fa] px-5 py-6 text-sm leading-7 text-[#667085]">
            No hay clientes activos registrados todavía.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {overview.clients.map((client) => (
              <div
                key={client.id}
                className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4"
              >
                <p className="text-sm text-[#667085]">{client.code}</p>
                <p className="mt-1 text-base font-semibold text-[#14375a]">
                  {client.name}
                </p>
                <p className="mt-2 text-sm text-[#667085]">
                  {client.campaignCount} campañas vinculadas
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
