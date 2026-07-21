import { getAuditOverview } from "@/src/features/audit/application/get-audit-overview";
import { MvpMetricCard } from "@/src/shared/ui/mvp-metric-card";
import { MvpTopbar } from "@/src/shared/ui/mvp-topbar";

const activityFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AuditPage() {
  const overview = await getAuditOverview();

  return (
    <main className="space-y-8">
      <MvpTopbar eyebrow="Módulo principal" title="Auditoría" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MvpMetricCard label="Capturas totales" value={String(overview.captureCount)} />
        <MvpMetricCard
          label="Capturas con geo"
          value={String(overview.geolocatedCaptureCount)}
        />
        <MvpMetricCard
          label="Evidencia disponible"
          value={String(overview.evidenceAvailableCount)}
        />
        <MvpMetricCard
          label="Hallazgos abiertos"
          value={String(overview.openFindingsCount)}
        />
        <MvpMetricCard label="Eventos técnicos" value={String(overview.auditLogCount)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
              Actividad reciente
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#667085]">
              Revisión cruzada de eventos de captura, evidencia y logging técnico.
            </p>
          </div>
          {overview.recentActivity.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#d0d5dd] bg-[#f7f8fa] px-5 py-6 text-sm leading-7 text-[#667085]">
              Todavía no hay actividad para mostrar en este módulo.
            </div>
          ) : (
            <div className="grid gap-3">
              {overview.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#14375a]">{item.title}</p>
                      <p className="mt-1 text-sm leading-7 text-[#667085]">
                        {item.description}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-[#667085]">
                      {activityFormatter.format(item.occurredAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
              Controles prioritarios
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#667085]">
              Esta lectura sirve para evaluar trazabilidad antes de exportar o cerrar campañas.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-sm text-[#667085]">Cobertura georreferenciada</p>
              <p className="mt-1 text-lg font-semibold text-[#14375a]">
                {overview.captureCount === 0
                  ? "Sin datos"
                  : `${Math.round((overview.geolocatedCaptureCount / overview.captureCount) * 100)}%`}
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-sm text-[#667085]">Evidencia lista para revisión</p>
              <p className="mt-1 text-lg font-semibold text-[#14375a]">
                {overview.evidenceAvailableCount}
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-sm text-[#667085]">Pendientes de análisis</p>
              <p className="mt-1 text-lg font-semibold text-[#14375a]">
                {overview.openFindingsCount}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
