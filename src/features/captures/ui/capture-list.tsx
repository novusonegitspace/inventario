import type { AssetCapture } from "@/src/features/captures/domain/asset-capture";
import { Badge } from "@/src/shared/ui/badge";
import { Panel } from "@/src/shared/ui/panel";

export function CaptureList({ captures }: { captures: AssetCapture[] }) {
  if (captures.length === 0) {
    return (
      <Panel className="space-y-4" padding="lg">
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Todavía no hay capturas registradas
        </h3>
        <p className="max-w-2xl text-sm leading-7 text-white/60">
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
                <p className="text-lg font-semibold text-white">
                  {capture.submittedByName}
                </p>
                <p className="text-sm text-white/56">
                  {new Intl.DateTimeFormat("es-CL", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(capture.capturedAt)}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-white/42">
                Dispositivo
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {capture.deviceLabel || "No informado"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Ubicación observada
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {capture.observedLocation || "Sin dato"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Responsable observado
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {capture.observedResponsible || "Sin dato"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Latitud
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {capture.latitude || "Sin dato"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Longitud
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {capture.longitude || "Sin dato"}
              </p>
            </div>
          </div>

          {capture.notes || capture.conditionNotes ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Observaciones
                </p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {capture.notes || "Sin observaciones"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/18 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Estado observado
                </p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {capture.conditionNotes || "Sin comentarios adicionales"}
                </p>
              </div>
            </div>
          ) : null}
        </Panel>
      ))}
    </div>
  );
}
