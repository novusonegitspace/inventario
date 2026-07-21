"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  createAssetAction,
  type CreateAssetFormState,
} from "@/src/features/assets/actions";
import { defaultAssetDraft } from "@/src/features/assets/domain/asset";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={disabled || pending} fullWidth size="lg" type="submit">
      {pending ? "Guardando activo..." : "Registrar activo"}
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

  return (
    <Panel className="space-y-6" glow padding="lg">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-[#2d2d2d]">
          Registrar nuevo activo
        </h2>
        <p className="text-sm leading-7 text-[#667085]">
          Agregue manualmente activos para preparar el conteo, asignar ubicación
          y dejar clara la responsabilidad antes de salir a terreno.
        </p>
        {manualRestrictionMessage ? (
          <div className="rounded-lg border border-[#fedf89] bg-[#fffbeb] px-4 py-3 text-sm leading-6 text-[#93370d]">
            {manualRestrictionMessage}
          </div>
        ) : null}
      </div>

      <form action={formAction} className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#344054]" htmlFor="barcode">
            Código de barras
          </label>
          <input
            className="h-12 w-full rounded-lg border border-[#d6deea] bg-white px-4 text-[#14375a] outline-none transition placeholder:text-[#98a2b3] focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f8fa] disabled:text-[#98a2b3]"
            defaultValue={values.barcode}
            disabled={formDisabled}
            id="barcode"
            name="barcode"
            placeholder="7501234567890"
          />
          <FieldError message={errors?.barcode} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#344054]" htmlFor="assetTag">
            Etiqueta interna
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
            Use este campo para la referencia interna. La captura móvil debe
            apoyarse principalmente en el código de barras.
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
