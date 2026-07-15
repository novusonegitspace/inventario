"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createAssetCaptureAction,
  type CreateAssetCaptureFormState,
} from "@/src/features/captures/actions";
import {
  defaultAssetCaptureDraft,
  type CreateAssetCaptureDraft,
} from "@/src/features/captures/domain/asset-capture";
import { MobileBarcodeScanner } from "@/src/features/captures/ui/mobile-barcode-scanner";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={disabled || pending} fullWidth size="lg" type="submit">
      {pending ? "Registrando captura..." : "Guardar captura"}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-rose-200">{message}</p>;
}

export function CaptureForm({
  assetId,
  campaignId,
  canCapture,
  initialValues,
  requiresGeo,
}: {
  assetId: string;
  campaignId: string;
  canCapture: boolean;
  initialValues: CreateAssetCaptureDraft;
  requiresGeo: boolean;
}) {
  const createCaptureForAsset = createAssetCaptureAction.bind(
    null,
    campaignId,
    assetId,
  );
  const initialState: CreateAssetCaptureFormState = {
    values: {
      ...defaultAssetCaptureDraft,
      ...initialValues,
    },
  };
  const [state, formAction] = useActionState(createCaptureForAsset, {
    ...initialState,
  });
  const values = state?.values ?? initialState.values;
  const errors = state?.errors;
  const scannedCodeInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-6">
      <MobileBarcodeScanner
        disabled={!canCapture}
        onDetected={(code) => {
          if (scannedCodeInputRef.current) {
            scannedCodeInputRef.current.value = code;
          }
        }}
      />

      <Panel className="space-y-6" glow padding="lg">
        <div className="space-y-3">
          <Badge>Captura móvil</Badge>
          <div className="space-y-2">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white">
              Registre la lectura del activo y deje constancia del estado observado.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-white/62">
              Complete el código leído, el contexto del dispositivo y las
              observaciones de terreno para dejar trazabilidad de la captura.
            </p>
          </div>
        </div>

        <form action={formAction} className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/72" htmlFor="scannedCode">
              Código leído
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.scannedCode}
              disabled={!canCapture}
              id="scannedCode"
              name="scannedCode"
              placeholder="ACT-000124"
              ref={scannedCodeInputRef}
            />
            <FieldError message={errors?.scannedCode} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/72" htmlFor="deviceLabel">
              Dispositivo
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.deviceLabel}
              disabled={!canCapture}
              id="deviceLabel"
              name="deviceLabel"
              placeholder="iPhone Supervisión Norte"
            />
            <FieldError message={errors?.deviceLabel} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/72" htmlFor="latitude">
              Latitud
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.latitude}
              disabled={!canCapture}
              id="latitude"
              name="latitude"
              placeholder="-33.4500"
            />
            {requiresGeo ? (
              <p className="text-xs text-emerald-200/72">
                Esta campaña exige registrar geolocalización.
              </p>
            ) : null}
            <FieldError message={errors?.latitude} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/72" htmlFor="longitude">
              Longitud
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.longitude}
              disabled={!canCapture}
              id="longitude"
              name="longitude"
              placeholder="-70.6667"
            />
            <FieldError message={errors?.longitude} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="physicalCondition"
            >
              Estado físico
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.physicalCondition}
              disabled={!canCapture}
              id="physicalCondition"
              name="physicalCondition"
              placeholder="Buen estado"
            />
            <FieldError message={errors?.physicalCondition} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="observedSerialNumber"
            >
              Serie observada
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.observedSerialNumber}
              disabled={!canCapture}
              id="observedSerialNumber"
              name="observedSerialNumber"
              placeholder="SN-998421"
            />
            <FieldError message={errors?.observedSerialNumber} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="observedLocation"
            >
              Ubicación observada
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.observedLocation}
              disabled={!canCapture}
              id="observedLocation"
              name="observedLocation"
              placeholder="Edificio Norte / Piso 2"
            />
            <FieldError message={errors?.observedLocation} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="observedResponsible"
            >
              Responsable observado
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.observedResponsible}
              disabled={!canCapture}
              id="observedResponsible"
              name="observedResponsible"
              placeholder="Equipo de Finanzas"
            />
            <FieldError message={errors?.observedResponsible} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="observedCostCenter"
            >
              Centro de costo observado
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.observedCostCenter}
              disabled={!canCapture}
              id="observedCostCenter"
              name="observedCostCenter"
              placeholder="TI-OPERACIONES"
            />
            <FieldError message={errors?.observedCostCenter} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-white/72" htmlFor="notes">
              Observaciones de captura
            </label>
            <textarea
              className="min-h-28 w-full rounded-[24px] border border-white/10 bg-white/6 px-4 py-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.notes}
              disabled={!canCapture}
              id="notes"
              name="notes"
              placeholder="Ejemplo: activo visible y operativo, ubicado en la estación asignada."
            />
            <FieldError message={errors?.notes} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="conditionNotes"
            >
              Notas sobre el estado observado
            </label>
            <textarea
              className="min-h-24 w-full rounded-[24px] border border-white/10 bg-white/6 px-4 py-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
              defaultValue={values.conditionNotes}
              disabled={!canCapture}
              id="conditionNotes"
              name="conditionNotes"
              placeholder="Ejemplo: presenta desgaste leve en carcasa, pero permanece operativo."
            />
            <FieldError message={errors?.conditionNotes} />
          </div>

          {errors?.form ? (
            <div className="rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 py-3 text-sm text-rose-100 md:col-span-2">
              {errors.form}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <SubmitButton disabled={!canCapture} />
          </div>
        </form>
      </Panel>
    </div>
  );
}
