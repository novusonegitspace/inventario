import type { AssetCapture } from "@/src/features/captures/domain/asset-capture";
import { Badge } from "@/src/shared/ui/badge";
import { Panel } from "@/src/shared/ui/panel";

export function CaptureList({ captures }: { captures: AssetCapture[] }) {
  if (captures.length === 0) {
    return (
      <Panel className="space-y-4" padding="lg">
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#2d2d2d]">
          Todavía no hay capturas registradas
        </h3>
        <p className="max-w-2xl text-sm leading-7 text-[#667085]">
          Cuando el equipo escanee este activo desde el celular, aquí podrá
          revisar fecha, responsable y observaciones del registro.
        </p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-5">
      {captures.map((capture) => (
        <Panel key={capture.id} className="space-y-5" padding="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{capture.scannedCode}</Badge>
                {capture.physicalCondition ? (
                  <Badge tone="slate">{capture.physicalCondition}</Badge>
                ) : null}
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-[#14375a]">
                  {capture.submittedByName}
                </p>
                <p className="text-sm text-[#667085]">
                  {new Intl.DateTimeFormat("es-CL", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(capture.capturedAt)}
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] px-3 py-2 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Dispositivo
              </p>
              <p className="mt-1 text-sm font-semibold text-[#14375a]">
                {capture.deviceLabel || "No informado"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Ubicación observada
              </p>
              <p className="mt-2 text-sm font-semibold text-[#14375a]">
                {capture.observedLocation || "Sin dato"}
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Responsable observado
              </p>
              <p className="mt-2 text-sm font-semibold text-[#14375a]">
                {capture.observedResponsible || "Sin dato"}
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Latitud
              </p>
              <p className="mt-2 text-sm font-semibold text-[#14375a]">
                {capture.latitude || "Sin dato"}
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Longitud
              </p>
              <p className="mt-2 text-sm font-semibold text-[#14375a]">
                {capture.longitude || "Sin dato"}
              </p>
            </div>
          </div>

          {capture.notes || capture.conditionNotes ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                  Observaciones
                </p>
                <p className="mt-2 text-sm leading-7 text-[#344054]">
                  {capture.notes || "Sin observaciones"}
                </p>
              </div>
              <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                  Estado observado
                </p>
                <p className="mt-2 text-sm leading-7 text-[#344054]">
                  {capture.conditionNotes || "Sin comentarios adicionales"}
                </p>
              </div>
            </div>
          ) : null}

          {Object.keys(capture.customFields).length > 0 ? (
            <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f8fa] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                Campos adicionales
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {Object.entries(capture.customFields).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#667085]">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#14375a]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Panel>
      ))}
    </div>
  );
}
