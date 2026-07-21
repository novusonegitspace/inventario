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
          <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[#2d2d2d]">
            Adjunte un archivo a una captura ya registrada
          </h2>
          <p className="text-sm leading-7 text-[#667085]">
            Seleccione la captura correspondiente y cargue una foto o archivo
            relacionado con la validación del activo.
          </p>
        </div>
      </div>

      <form action={formAction} className="grid gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#344054]" htmlFor="captureId">
            Captura relacionada
          </label>
          <select
            className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
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
            <p className="text-sm font-semibold text-[#d92d20]">{errors.captureId}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#344054]" htmlFor="file">
            Archivo de respaldo
          </label>
          <input
            className="block w-full rounded-lg border border-[#d6deea] bg-white px-4 py-4 text-sm text-[#14375a] file:mr-4 file:rounded-lg file:border-0 file:bg-[#0f988c] file:px-4 file:py-2 file:font-semibold file:!text-white disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
            disabled={!canEdit || captures.length === 0}
            id="file"
            name="file"
            type="file"
          />
          {errors?.file ? (
            <p className="text-sm font-semibold text-[#d92d20]">{errors.file}</p>
          ) : null}
        </div>

        {errors?.form ? (
          <div className="rounded-lg border border-[#fda29b] bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#b42318]">
            {errors.form}
          </div>
        ) : null}

        <SubmitButton disabled={!canEdit || captures.length === 0} />
      </form>
    </Panel>
  );
}
