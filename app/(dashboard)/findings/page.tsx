import { getFindingsHubOverview } from "@/src/features/findings/application/get-findings-hub-overview";
import { MvpMetricCard } from "@/src/shared/ui/mvp-metric-card";
import { MvpTopbar } from "@/src/shared/ui/mvp-topbar";

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const severityClasses: Record<string, string> = {
  CRITICAL: "border-[#fecdca] bg-[#fef3f2] text-[#b42318]",
  HIGH: "border-[#fde6c6] bg-[#fff7ed] text-[#b54708]",
  MEDIUM: "border-[#d0d5dd] bg-[#f8fafc] text-[#344054]",
  LOW: "border-[#cceee4] bg-[#effcf7] text-[#11715d]",
};

export default async function FindingsPage() {
  const overview = await getFindingsHubOverview();

  return (
    <main className="space-y-8">
      <MvpTopbar eyebrow="Vista transversal" title="Hallazgos" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MvpMetricCard label="Abiertos" value={String(overview.totalOpen)} />
        <MvpMetricCard label="Críticos" value={String(overview.critical)} />
        <MvpMetricCard label="Altos" value={String(overview.high)} />
        <MvpMetricCard label="En revisión" value={String(overview.inReview)} />
        <MvpMetricCard label="Resueltos" value={String(overview.resolved)} />
      </section>

      <section className="space-y-4 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
            Hallazgos recientes
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[#667085]">
            Use esta bandeja para seguir diferencias relevantes y priorizar
            revisión operativa a nivel transversal.
          </p>
        </div>
        {overview.recentFindings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d0d5dd] bg-[#f7f8fa] px-5 py-6 text-sm leading-7 text-[#667085]">
            No hay hallazgos registrados todavía.
          </div>
        ) : (
          <div className="grid gap-3">
            {overview.recentFindings.map((finding) => (
              <div
                key={finding.id}
                className="grid gap-4 rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-4 py-4 lg:grid-cols-[1.6fr_1fr_0.8fr_0.8fr_1fr]"
              >
                <div>
                  <p className="text-base font-semibold text-[#14375a]">{finding.title}</p>
                  <p className="mt-1 text-sm text-[#667085]">
                    {finding.campaignName} · {finding.assetName}
                  </p>
                </div>
                <div className="text-sm text-[#667085]">{finding.status}</div>
                <div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${severityClasses[finding.severity] ?? severityClasses.MEDIUM}`}
                  >
                    {finding.severity}
                  </span>
                </div>
                <div className="text-sm text-[#667085]">{dateFormatter.format(finding.createdAt)}</div>
                <div className="text-sm font-medium text-[#14375a]">Revisión pendiente</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
