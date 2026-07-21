import type { Evidence } from "@/src/features/evidence/domain/evidence";
import { Badge } from "@/src/shared/ui/badge";
import { Panel } from "@/src/shared/ui/panel";

export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  if (evidence.length === 0) {
    return (
      <Panel className="space-y-4" padding="lg">
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
          Todavía no hay evidencias registradas
        </h3>
        <p className="max-w-2xl text-sm leading-7 text-[#667085]">
          Cuando el equipo adjunte fotos o archivos de respaldo, aquí podrá
          revisar qué captura respaldan y cuándo fueron incorporados.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-5">
      {evidence.map((item) => (
        <Panel key={item.id} className="space-y-5" padding="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{item.originalFileName}</Badge>
                <Badge tone="slate">{item.status}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-[#14375a]">
                  {item.uploadedByName}
                </p>
                <p className="text-sm text-[#667085]">
                  {new Intl.DateTimeFormat("es-CL", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(item.uploadedAt)}
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-3 py-2 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Captura
              </p>
              <p className="mt-1 text-sm font-semibold text-[#14375a]">
                {item.scannedCode || "Sin referencia"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Tipo
              </p>
              <p className="mt-2 text-sm font-semibold text-[#14375a]">
                {item.mimeType}
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Tamaño
              </p>
              <p className="mt-2 text-sm font-semibold text-[#14375a]">
                {Intl.NumberFormat("es-CL").format(item.sizeBytes)} bytes
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Ruta registrada
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-[#14375a]">
                {item.blobPath}
              </p>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}
