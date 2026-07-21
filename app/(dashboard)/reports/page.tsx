import Link from "next/link";

import { getInventoryModeLabel } from "@/src/features/campaigns/domain/campaign";
import { MvpStatusPill } from "@/src/shared/ui/mvp-status-pill";
import { getReportingOverview } from "@/src/features/reports/application/get-reporting-overview";
import { MvpMetricCard } from "@/src/shared/ui/mvp-metric-card";
import { MvpTopbar } from "@/src/shared/ui/mvp-topbar";

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const exportKindLabels: Record<string, string> = {
  EXCEL: "Excel",
  PDF: "PDF",
  EVIDENCE_ZIP: "ZIP de evidencias",
};

const exportStatusLabels: Record<string, string> = {
  QUEUED: "En cola",
  RUNNING: "En proceso",
  SUCCEEDED: "Listo",
  FAILED: "Falló",
  CANCELED: "Cancelado",
};

export default async function ReportsPage() {
  const overview = await getReportingOverview();

  return (
    <main className="space-y-8">
      <MvpTopbar eyebrow="Módulo principal" title="Reportes" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MvpMetricCard label="Campañas reportables" value={String(overview.reportableCampaigns)} />
        <MvpMetricCard label="Evidencias disponibles" value={String(overview.evidenceTotal)} />
        <MvpMetricCard label="Diferencias abiertas" value={String(overview.differencesTotal)} />
        <MvpMetricCard label="Avance medio" value={`${overview.averageProgress}%`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
              Campañas que requieren salida formal
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[#667085]">
              Priorice operaciones con diferencias abiertas, avance suficiente y
              evidencia disponible antes de emitir exportaciones finales.
            </p>
          </div>
          {overview.campaignsToReport.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#d0d5dd] bg-[#f7f8fa] px-5 py-6 text-sm leading-7 text-[#667085]">
              Todavía no hay campañas fuera de borrador que entren al circuito de reporte.
            </div>
          ) : (
            <div className="grid gap-3">
              {overview.campaignsToReport.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-4 py-4 transition hover:border-[#cfd5dc] hover:bg-[#fbfcfd]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <MvpStatusPill value={campaign.status} />
                        <span className="text-sm text-[#667085]">{campaign.code}</span>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-[#2d2d2d]">
                          {campaign.name}
                        </p>
                        <p className="mt-1 text-sm text-[#667085]">
                          {campaign.clientName} · {campaign.siteName} ·{" "}
                          {getInventoryModeLabel(campaign.inventoryMode)}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-2 text-sm text-[#667085] sm:text-right">
                      <span>{campaign.progressPercentage}% de avance</span>
                      <span>{campaign.evidenceCount} evidencias</span>
                      <span>{campaign.differenceCount} diferencias</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-[#e4e7eb] bg-white p-6 shadow-[0_18px_48px_rgba(20,55,90,0.08)]">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
              Exportaciones recientes
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#667085]">
              Estado de paquetes Excel, PDF o ZIP a nivel transversal del tenant.
            </p>
          </div>
          {overview.recentExports.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#d0d5dd] bg-[#f7f8fa] px-5 py-6 text-sm leading-7 text-[#667085]">
              Aún no se han generado exportaciones en este entorno.
            </div>
          ) : (
            <div className="grid gap-3">
              {overview.recentExports.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#14375a]">
                        {exportKindLabels[item.kind] ?? item.kind}
                      </p>
                      <p className="mt-1 text-sm leading-7 text-[#667085]">
                        {item.campaignName}
                      </p>
                    </div>
                    <div className="text-right text-sm text-[#667085]">
                      <p>{exportStatusLabels[item.status] ?? item.status}</p>
                      <p className="mt-1">{dateFormatter.format(item.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
