import { getAssetsHubOverview } from "@/src/features/assets/application/get-assets-hub-overview";
import { MvpMetricCard } from "@/src/shared/ui/mvp-metric-card";
import { MvpTopbar } from "@/src/shared/ui/mvp-topbar";

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AssetsPage() {
  const overview = await getAssetsHubOverview();

  return (
    <main className="space-y-8">
      <MvpTopbar eyebrow="Vista transversal" title="Activos" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MvpMetricCard label="Activos totales" value={String(overview.totalAssets)} />
        <MvpMetricCard label="Con captura" value={String(overview.capturedAssets)} />
        <MvpMetricCard label="Pendientes" value={String(overview.pendingAssets)} />
        <MvpMetricCard
          label="Con evidencia"
          value={String(overview.assetsWithEvidence)}
        />
      </section>

      <section className="space-y-4 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
            Activos recientes
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[#667085]">
            Esta vista sirve como bandeja transversal para revisar activos que
            se están moviendo entre campañas, capturas y evidencias.
          </p>
        </div>
        {overview.recentAssets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d0d5dd] bg-[#f7f8fa] px-5 py-6 text-sm leading-7 text-[#667085]">
            Todavía no existen activos cargados en este tenant.
          </div>
        ) : (
          <div className="grid gap-3">
            {overview.recentAssets.map((asset) => (
              <div
                key={asset.id}
                className="grid gap-4 rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-4 py-4 lg:grid-cols-[1.7fr_1fr_1fr_1fr]"
              >
                <div>
                  <p className="text-base font-semibold text-[#14375a]">{asset.name}</p>
                  <p className="mt-1 text-sm text-[#667085]">
                    {asset.assetTag} · {asset.campaignName}
                  </p>
                </div>
                <div className="text-sm text-[#667085]">
                  <p>{asset.location}</p>
                  <p className="mt-1">{asset.responsible}</p>
                </div>
                <div className="text-sm text-[#667085]">
                  <p>{asset.captureCount} capturas</p>
                  <p className="mt-1">{asset.evidenceCount} evidencias</p>
                </div>
                <div className="text-sm text-[#667085]">
                  <p>{asset.findingCount} hallazgos</p>
                  <p className="mt-1">
                    {asset.latestCaptureAt
                      ? `Última captura ${dateFormatter.format(asset.latestCaptureAt)}`
                      : "Sin captura todavía"}
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
