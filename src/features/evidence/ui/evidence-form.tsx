"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  createEvidenceAction,
  type CreateEvidenceFormState,
} from "@/src/features/evidence/actions";
import type { AssetCapture } from "@/src/features/captures/domain/asset-capture";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={disabled || pending} fullWidth size="lg" type="submit">
      {pending ? "Registrando evidencia..." : "Registrar evidencia"}
    </Button>
  );
}

export function EvidenceForm({
  assetId,
  campaignId,
  canEdit,
  captures,
}: {
  assetId: string;
  campaignId: string;
  canEdit: boolean;
  captures: AssetCapture[];
}) {
  const createEvidenceForAsset = createEvidenceAction.bind(
    null,
    campaignId,
    assetId,
  );
  const initialState: CreateEvidenceFormState = {
    values: {
      captureId: "",
    },
  };
  const [state, formAction] = useActionState(
    createEvidenceForAsset,
    initialState,
  );
  const values = state?.values ?? initialState.values;
  const errors = state?.errors;

  return (
    <Panel className="space-y-6" glow padding="lg">
      <div className="space-y-3">
        <Badge>Respaldo documental</Badge>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white">
            Adjunte un archivo a una captura ya registrada
          </h2>
          <p className="text-sm leading-7 text-white/60">
            Seleccione la captura correspondiente y cargue una foto o archivo
            relacionado con la validación del activo.
          </p>
        </div>
      </div>

      <form action={formAction} className="grid gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/72" htmlFor="captureId">
            Captura relacionada
          </label>
          <select
            className="h-13 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-white outline-none transition focus:border-emerald-300/50 disabled:opacity-60"
            defaultValue={values.captureId}
            disabled={!canEdit || captures.length === 0}
            id="captureId"
            name="captureId"
          >
            <option value="">Seleccione una captura</option>
            {captures.map((capture) => (
              <option key={capture.id} value={capture.id}>
                {capture.scannedCode} ·{" "}
                {new Intl.DateTimeFormat("es-CL", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(capture.capturedAt)}
              </option>
            ))}
          </select>
          {errors?.captureId ? (
            <p className="text-sm text-rose-200">{errors.captureId}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/72" htmlFor="file">
            Archivo de respaldo
          </label>
          <input
            className="block w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-emerald-300 file:px-4 file:py-2 file:font-semibold file:text-slate-950 disabled:opacity-60"
            disabled={!canEdit || captures.length === 0}
            id="file"
            name="file"
            type="file"
          />
          {errors?.file ? (
            <p className="text-sm text-rose-200">{errors.file}</p>
          ) : null}
        </div>

        {errors?.form ? (
          <div className="rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {errors.form}
          </div>
        ) : null}

        <SubmitButton disabled={!canEdit || captures.length === 0} />
      </form>
    </Panel>
  );
}
