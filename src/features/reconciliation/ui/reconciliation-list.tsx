import type { ReconciliationResultItem } from "@/src/features/reconciliation/domain/reconciliation";
import { Badge } from "@/src/shared/ui/badge";
import { Panel } from "@/src/shared/ui/panel";

function getStatusLabel(status: ReconciliationResultItem["status"]) {
  if (status === "CONCILIATED") {
    return { label: "Conciliado", tone: "emerald" as const };
  }

  if (status === "CONCILIATED_WITH_DIFFERENCES") {
    return { label: "Con diferencias", tone: "slate" as const };
  }

  if (status === "NOT_FOUND") {
    return { label: "Sin captura", tone: "outline" as const };
  }

  return { label: "Pendiente", tone: "outline" as const };
}

export function ReconciliationList({
  results,
}: {
  results: ReconciliationResultItem[];
}) {
  if (results.length === 0) {
    return (
      <Panel className="space-y-4" padding="lg">
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Todavía no hay conciliaciones calculadas
        </h3>
        <p className="max-w-2xl text-sm leading-7 text-white/60">
          Ejecute una conciliación para comparar los datos del maestro contra la
          última captura registrada de cada activo.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-5">
      {results.map((result) => {
        const status = getStatusLabel(result.status);

        return (
          <Panel key={result.id} className="space-y-5" padding="lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={status.tone}>{status.label}</Badge>
                  <Badge tone="slate">{result.assetTag}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">
                    {result.assetName}
                  </p>
                  <p className="text-sm text-white/56">
                    Captura: {result.captureCode || "Sin captura asociada"}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                  Snapshot
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  v{result.snapshotVersion}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Código
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {result.matchedByCode ? "Coincide" : "Difiere"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Ubicación
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {result.locationMatches === null
                    ? "Sin dato"
                    : result.locationMatches
                      ? "Coincide"
                      : "Difiere"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Responsable
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {result.responsibleMatches === null
                    ? "Sin dato"
                    : result.responsibleMatches
                      ? "Coincide"
                      : "Difiere"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Centro de costo
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {result.costCenterMatches === null
                    ? "Sin dato"
                    : result.costCenterMatches
                      ? "Coincide"
                      : "Difiere"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Serie
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {result.serialNumberMatches === null
                    ? "Sin dato"
                    : result.serialNumberMatches
                      ? "Coincide"
                      : "Difiere"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Resultado
              </p>
              <p className="mt-2 text-sm leading-7 text-white/70">
                {result.notes}
              </p>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
