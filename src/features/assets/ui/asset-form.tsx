"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Barcode, ClipboardList, ScanLine } from "lucide-react";

import {
  createAssetAction,
  type CreateAssetFormState,
} from "@/src/features/assets/actions";
import { defaultAssetDraft } from "@/src/features/assets/domain/asset";
import { MobileBarcodeScanner } from "@/src/features/captures/ui/mobile-barcode-scanner";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={disabled || pending} fullWidth size="lg" type="submit">
      {pending ? "Guardando en maestro..." : "Guardar activo en maestro"}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm font-semibold text-[#d92d20]">{message}</p>;
}

export function AssetForm({
  campaignId,
  canEdit,
  manualRestrictionMessage,
}: {
  campaignId: string;
  canEdit: boolean;
  manualRestrictionMessage?: string;
}) {
  const createAssetForCampaign = createAssetAction.bind(null, campaignId);
  const initialState: CreateAssetFormState = {
    values: { ...defaultAssetDraft },
  };
  const [state, formAction] = useActionState(
    createAssetForCampaign,
    initialState,
  );
  const values = state?.values ?? initialState.values;
  const errors = state?.errors;
  const formDisabled = !canEdit || Boolean(manualRestrictionMessage);
  const barcodeInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Panel className="space-y-6" glow padding="lg">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[#2d2d2d]">
          Registrar activo en el maestro
        </h2>
        <p className="text-sm leading-7 text-[#667085]">
          Use este formulario para crear la base previa de activos de la campaña.
          Esto prepara el inventario, pero no contabiliza una captura de terreno.
        </p>
        {manualRestrictionMessage ? (
          <div className="rounded-lg border border-[#fedf89] bg-[#fffbeb] px-4 py-3 text-sm leading-6 text-[#93370d]">
            {manualRestrictionMessage}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f9fc] p-4">
          <ScanLine aria-hidden="true" className="h-6 w-6 text-[#0f988c]" />
          <p className="mt-3 font-semibold text-[#14375a]">1. Identifique</p>
          <p className="mt-1 text-sm leading-6 text-[#667085]">
            Ingrese o escanee el código físico del activo para evitar errores de digitación.
          </p>
        </div>
        <div className="rounded-lg border border-[#e4e7eb] bg-[#f7f9fc] p-4">
          <ClipboardList aria-hidden="true" className="h-6 w-6 text-[#0f988c]" />
          <p className="mt-3 font-semibold text-[#14375a]">2. Complete maestro</p>
          <p className="mt-1 text-sm leading-6 text-[#667085]">
            Registre descripción, ubicación esperada, responsable y centro de costo.
          </p>
        </div>
        <div className="rounded-lg border border-[#d6e9ff] bg-[#eff6ff] p-4">
          <Barcode aria-hidden="true" className="h-6 w-6 text-[#2e72d2]" />
          <p className="mt-3 font-semibold text-[#14375a]">No cuenta captura</p>
          <p className="mt-1 text-sm leading-6 text-[#667085]">
            La captura se contabiliza después, cuando el auditor valida el activo en terreno.
          </p>
        </div>
      </div>

      <details className="rounded-xl border border-[#d6e9ff] bg-[#f8fbff] p-4">
        <summary className="cursor-pointer text-base font-semibold text-[#14375a]">
          Escanear código para el maestro
        </summary>
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Use esta opción si está registrando el activo desde un celular y quiere
          evitar digitar el código físico.
        </p>
        <div className="mt-4">
          <MobileBarcodeScanner
            actionLabel="Escanear código"
            description="Abra la cámara y lea el QR o código de barras físico. Al detectarlo, se llenará el campo de código escaneable del maestro."
            disabled={formDisabled}
            disabledActionLabel="No disponible para esta campaña"
            disabledStatus="No puede registrar activos manuales con la configuración actual."
            idleStatus="Abra la cámara para llenar el código del maestro."
            infoText="Este escaneo solo llena el maestro. No contabiliza el activo como capturado."
            lastCodeLabel="Código para maestro"
            onDetected={(code) => {
              if (barcodeInputRef.current) {
                barcodeInputRef.current.value = code;
              }
            }}
            title="Escaneo para maestro"
          />
        </div>
      </details>

      <form action={formAction} className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#344054]" htmlFor="barcode">
            Código escaneable del activo
          </label>
          <input
            className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
            defaultValue={values.barcode}
            disabled={formDisabled}
            id="barcode"
            name="barcode"
            placeholder="7501234567890"
            ref={barcodeInputRef}
          />
          <p className="text-xs leading-6 text-[#667085]">
            Use el código QR o código de barras físico. Este será validado en la captura móvil.
          </p>
          <FieldError message={errors?.barcode} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#344054]" htmlFor="assetTag">
            Etiqueta interna del maestro
          </label>
          <input
            className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
            defaultValue={values.assetTag}
            disabled={formDisabled}
            id="assetTag"
            name="assetTag"
            placeholder="ACT-000124"
          />
          <FieldError message={errors?.assetTag} />
          <p className="text-xs leading-6 text-[#667085]">
            Referencia administrativa del activo dentro de la campaña.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#344054]" htmlFor="name">
            Nombre del activo
          </label>
          <input
            className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
            defaultValue={values.name}
            disabled={formDisabled}
            id="name"
            name="name"
            placeholder="Notebook Dell Latitude"
          />
          <FieldError message={errors?.name} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-[#344054]"
            htmlFor="serialNumber"
          >
            Serie
          </label>
          <input
            className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
            defaultValue={values.serialNumber}
            disabled={formDisabled}
            id="serialNumber"
            name="serialNumber"
            placeholder="SN-998421"
          />
          <FieldError message={errors?.serialNumber} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#344054]" htmlFor="costCenter">
            Centro de costo
          </label>
          <input
            className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
            defaultValue={values.costCenter}
            disabled={formDisabled}
            id="costCenter"
            name="costCenter"
            placeholder="TI-OPERACIONES"
          />
          <FieldError message={errors?.costCenter} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#344054]" htmlFor="location">
            Ubicación
          </label>
          <input
            className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
            defaultValue={values.location}
            disabled={formDisabled}
            id="location"
            name="location"
            placeholder="Edificio Norte / Piso 2"
          />
          <FieldError message={errors?.location} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-semibold text-[#344054]"
            htmlFor="responsible"
          >
            Responsable
          </label>
          <input
            className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
            defaultValue={values.responsible}
            disabled={formDisabled}
            id="responsible"
            name="responsible"
            placeholder="Equipo de Finanzas"
          />
          <FieldError message={errors?.responsible} />
        </div>

        {errors?.form ? (
          <div className="rounded-lg border border-[#fda29b] bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#b42318] md:col-span-2">
            {errors.form}
          </div>
        ) : null}

        <div className="md:col-span-2">
          <SubmitButton disabled={formDisabled} />
        </div>
      </form>
    </Panel>
  );
}
