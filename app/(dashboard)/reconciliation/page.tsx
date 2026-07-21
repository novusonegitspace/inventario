import { getReconciliationHubOverview } from "@/src/features/reconciliation/application/get-reconciliation-hub-overview";
import { MvpMetricCard } from "@/src/shared/ui/mvp-metric-card";
import { MvpTopbar } from "@/src/shared/ui/mvp-topbar";

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const statusLabels: Record<string, string> = {
  CONCILIATED_WITH_DIFFERENCES: "Con diferencias",
  NOT_FOUND: "No encontrado",
  SURPLUS: "Sobrante",
};

export default async function ReconciliationPage() {
  const overview = await getReconciliationHubOverview();

  return (
    <main className="space-y-8">
      <MvpTopbar eyebrow="Vista transversal" title="Conciliación" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MvpMetricCard label="Resultados" value={String(overview.totalResults)} />
        <MvpMetricCard label="Conciliados" value={String(overview.conciliated)} />
        <MvpMetricCard
          label="Con diferencias"
          value={String(overview.withDifferences)}
        />
        <MvpMetricCard label="No encontrados" value={String(overview.notFound)} />
        <MvpMetricCard label="Sobrantes" value={String(overview.surplus)} />
      </section>

      <section className="space-y-4 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
            Casos recientes a revisar
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[#667085]">
            Bandeja transversal para detectar rápido diferencias, activos no
            encontrados o sobrantes en cualquier campaña.
          </p>
        </div>
        {overview.recentIssues.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d0d5dd] bg-[#f7f8fa] px-5 py-6 text-sm leading-7 text-[#667085]">
            No hay incidencias recientes de conciliación en este entorno.
          </div>
        ) : (
          <div className="grid gap-3">
            {overview.recentIssues.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-4 py-4 lg:grid-cols-[1.2fr_1.2fr_0.8fr_1.5fr]"
              >
                <div>
                  <p className="text-base font-semibold text-[#14375a]">{item.assetName}</p>
                  <p className="mt-1 text-sm text-[#667085]">{item.assetTag}</p>
                </div>
                <div className="text-sm text-[#667085]">{item.campaignName}</div>
                <div className="text-sm font-semibold text-[#14375a]">
                  {statusLabels[item.status] ?? item.status}
                </div>
                <div className="text-sm text-[#667085]">
                  <p>{item.notes}</p>
                  <p className="mt-1">
                    {dateFormatter.format(item.calculatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
