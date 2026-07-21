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
import type {
  CaptureField,
  CaptureSettingsInput,
} from "@/src/features/campaign-settings/domain/capture-settings";
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

  return <p className="text-sm font-semibold text-[#d92d20]">{message}</p>;
}

const dedicatedFieldKeys = new Set([
  "asset_code",
  "notes",
  "observed_location",
  "physical_condition",
  "observed_responsible",
  "serial_number",
  "cost_center",
  "asset_photo",
]);

function isActiveMobileField(field: CaptureField) {
  return field.showInMobileCapture && field.requirement !== "not_applicable";
}

function RequiredMark({ required }: { required: boolean }) {
  if (!required) {
    return null;
  }

  return <span className="text-[#0f988c]"> *</span>;
}

function CustomFieldInput({
  disabled,
  error,
  field,
  value,
}: {
  disabled: boolean;
  error?: string;
  field: CaptureField;
  value: string;
}) {
  const inputName = `customField:${field.key}`;
  const defaultValue = value || field.defaultValue;
  const commonClassName =
    "h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]";

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[#344054]" htmlFor={inputName}>
        {field.label}
        <RequiredMark required={field.requirement === "required"} />
      </label>

      {field.dataType === "select" ? (
        <select
          className={commonClassName}
          defaultValue={defaultValue}
          disabled={disabled}
          id={inputName}
          name={inputName}
        >
          <option value="">Seleccione una opción</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.dataType === "boolean" ? (
        <label className="flex h-12 items-center gap-3 rounded-lg border border-[#d6deea] bg-white px-4 text-sm font-semibold text-[#344054]">
          <input
            className="h-5 w-5 accent-[#0f988c]"
            defaultChecked={defaultValue === "true" || defaultValue === "Sí"}
            disabled={disabled}
            name={inputName}
            type="checkbox"
            value="true"
          />
          Sí
        </label>
      ) : (
        <input
          className={commonClassName}
          defaultValue={defaultValue}
          disabled={disabled}
          id={inputName}
          name={inputName}
          placeholder={field.helpText || field.label}
          type={field.dataType === "number" || field.dataType === "date" ? field.dataType : "text"}
        />
      )}

      {field.helpText ? <p className="text-xs leading-5 text-[#667085]">{field.helpText}</p> : null}
      <FieldError message={error} />
    </div>
  );
}

export function CaptureForm({
  assetId,
  campaignId,
  canCapture,
  initialValues,
  settings,
}: {
  assetId: string;
  campaignId: string;
  canCapture: boolean;
  initialValues: CreateAssetCaptureDraft;
  settings: CaptureSettingsInput;
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
  const activeFields = settings.fields.filter(isActiveMobileField);
  const fieldByKey = new Map(activeFields.map((field) => [field.key, field]));
  const customFields = activeFields.filter(
    (field) => !dedicatedFieldKeys.has(field.key) && field.dataType !== "file",
  );
  const evidenceFields = activeFields.filter(
    (field) => field.key === "asset_photo" || field.dataType === "file",
  );
  const evidenceRequired =
    settings.primaryPhotoRequirement === "required" ||
    evidenceFields.some((field) => field.requirement === "required");
  const showEvidenceInput =
    evidenceFields.length > 0 ||
    settings.primaryPhotoRequirement !== "not_applicable" ||
    settings.additionalPhotosRequirement !== "not_applicable" ||
    settings.otherFilesRequirement !== "not_applicable";
  const requiresGeo =
    fieldByKey.get("observed_location")?.requirement === "required";

  function getField(key: string) {
    return fieldByKey.get(key);
  }

  function renderTextField({
    fieldKey,
    name,
    placeholder,
    type = "text",
  }: {
    fieldKey: string;
    name: Exclude<keyof CreateAssetCaptureDraft, "customFields">;
    placeholder: string;
    type?: string;
  }) {
    const field = getField(fieldKey);

    if (!field) {
      return null;
    }

    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[#344054]" htmlFor={name}>
          {field.label}
          <RequiredMark required={field.requirement === "required"} />
        </label>
        <input
          className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
          defaultValue={String(values[name] ?? "")}
          disabled={!canCapture}
          id={name}
          name={name}
          placeholder={placeholder}
          ref={name === "scannedCode" ? scannedCodeInputRef : undefined}
          type={type}
        />
        {field.helpText ? <p className="text-xs leading-5 text-[#667085]">{field.helpText}</p> : null}
        <FieldError message={errors?.[name]} />
      </div>
    );
  }

  function renderTextareaField({
    fieldKey,
    name,
    placeholder,
  }: {
    fieldKey: string;
    name: "notes" | "conditionNotes";
    placeholder: string;
  }) {
    const field =
      fieldKey === "conditionNotes"
        ? undefined
        : getField(fieldKey);

    if (fieldKey !== "conditionNotes" && !field) {
      return null;
    }

    return (
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-semibold text-[#344054]" htmlFor={name}>
          {field?.label ?? "Notas sobre el estado observado"}
          <RequiredMark required={field?.requirement === "required"} />
        </label>
        <textarea
          className="min-h-24 w-full rounded-lg border border-[#d6deea] bg-white px-4 py-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
          defaultValue={String(values[name] ?? "")}
          disabled={!canCapture}
          id={name}
          name={name}
          placeholder={placeholder}
        />
        <FieldError message={errors?.[name]} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!canCapture ? (
        <div className="rounded-lg border border-[#fedf89] bg-[#fffbeb] px-5 py-4 text-sm leading-7 text-[#93370d]">
          La campaña aún está en preparación. Iníciela desde el resumen de campaña
          para habilitar cámara, capturas y registro de terreno.
        </div>
      ) : null}

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
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#2d2d2d]">
              Registre la lectura del activo y deje constancia del estado observado.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-[#667085]">
              Complete el código leído, el contexto del dispositivo y las
              observaciones de terreno para dejar trazabilidad de la captura.
            </p>
          </div>
        </div>

        <form
          action={formAction}
          className="grid gap-5 md:grid-cols-2"
          encType="multipart/form-data"
        >
          {renderTextField({
            fieldKey: "asset_code",
            name: "scannedCode",
            placeholder: "ACT-000124",
          })}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#344054]" htmlFor="deviceLabel">
              Dispositivo
            </label>
            <input
              className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
              defaultValue={values.deviceLabel}
              disabled={!canCapture}
              id="deviceLabel"
              name="deviceLabel"
              placeholder="iPhone Supervisión Norte"
            />
            <FieldError message={errors?.deviceLabel} />
          </div>

          {renderTextField({
            fieldKey: "observed_location",
            name: "observedLocation",
            placeholder: "Edificio Norte / Piso 2",
          })}

          {renderTextField({
            fieldKey: "physical_condition",
            name: "physicalCondition",
            placeholder: "Bueno",
          })}

          {renderTextField({
            fieldKey: "serial_number",
            name: "observedSerialNumber",
            placeholder: "SN-998421",
          })}

          {renderTextField({
            fieldKey: "observed_responsible",
            name: "observedResponsible",
            placeholder: "Equipo de Finanzas",
          })}

          {renderTextField({
            fieldKey: "cost_center",
            name: "observedCostCenter",
            placeholder: "TI-OPERACIONES",
          })}

          {customFields.map((field) => (
            <CustomFieldInput
              disabled={!canCapture}
              error={errors?.customFields?.[field.key]}
              field={field}
              key={field.key}
              value={values.customFields[field.key] ?? ""}
            />
          ))}

          {requiresGeo ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="latitude">
                  Latitud *
                </label>
                <input
                  className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
                  defaultValue={values.latitude}
                  disabled={!canCapture}
                  id="latitude"
                  name="latitude"
                  placeholder="-33.4500"
                />
                <p className="text-xs text-[#667085]">
                  Esta campaña exige registrar geolocalización.
                </p>
                <FieldError message={errors?.latitude} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="longitude">
                  Longitud *
                </label>
                <input
                  className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
                  defaultValue={values.longitude}
                  disabled={!canCapture}
                  id="longitude"
                  name="longitude"
                  placeholder="-70.6667"
                />
                <FieldError message={errors?.longitude} />
              </div>
            </>
          ) : null}

          {showEvidenceInput ? (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-[#344054]" htmlFor="evidenceFile">
                Evidencia de captura
                <RequiredMark required={evidenceRequired} />
              </label>
              <input
                accept="image/*,.pdf"
                capture="environment"
                className="block w-full rounded-lg border border-[#d6deea] bg-white px-4 py-4 text-sm text-[#14375a] file:mr-4 file:rounded-lg file:border-0 file:bg-[#0f988c] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
                disabled={!canCapture}
                id="evidenceFile"
                name="evidenceFile"
                type="file"
              />
              <p className="text-xs leading-5 text-[#667085]">
                La evidencia queda asociada a la captura con hash, usuario, fecha y dispositivo.
              </p>
              <FieldError message={errors?.evidenceFile} />
            </div>
          ) : null}

          {renderTextareaField({
            fieldKey: "notes",
            name: "notes",
            placeholder: "Ejemplo: activo visible y operativo, ubicado en la estación asignada.",
          })}

          {getField("physical_condition") ? renderTextareaField({
            fieldKey: "conditionNotes",
            name: "conditionNotes",
            placeholder: "Ejemplo: presenta desgaste leve en carcasa, pero permanece operativo.",
          }) : null}

          {errors?.form ? (
            <div className="rounded-lg border border-[#fda29b] bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#b42318] md:col-span-2">
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
