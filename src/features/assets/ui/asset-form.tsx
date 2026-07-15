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

  return <p className="text-sm text-rose-200">{message}</p>;
}

export function AssetForm({
  campaignId,
  canEdit,
}: {
  campaignId: string;
  canEdit: boolean;
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

  return (
    <Panel className="space-y-6" glow padding="lg">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white">
          Registrar nuevo activo
        </h2>
        <p className="text-sm leading-7 text-white/60">
          Agregue manualmente activos para preparar el conteo, asignar ubicación
          y dejar clara la responsabilidad antes de salir a terreno.
        </p>
      </div>

      <form action={formAction} className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/72" htmlFor="barcode">
            Código de barras
          </label>
          <input
            className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
            defaultValue={values.barcode}
            disabled={!canEdit}
            id="barcode"
            name="barcode"
            placeholder="7501234567890"
          />
          <FieldError message={errors?.barcode} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/72" htmlFor="assetTag">
            Etiqueta interna
          </label>
          <input
            className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
            defaultValue={values.assetTag}
            disabled={!canEdit}
            id="assetTag"
            name="assetTag"
            placeholder="ACT-000124"
          />
          <FieldError message={errors?.assetTag} />
          <p className="text-xs leading-6 text-white/42">
            Use este campo para la referencia interna. La captura móvil debe
            apoyarse principalmente en el código de barras.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/72" htmlFor="name">
            Nombre del activo
          </label>
          <input
            className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
            defaultValue={values.name}
            disabled={!canEdit}
            id="name"
            name="name"
            placeholder="Notebook Dell Latitude"
          />
          <FieldError message={errors?.name} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-white/72"
            htmlFor="serialNumber"
          >
            Serie
          </label>
          <input
            className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
            defaultValue={values.serialNumber}
            disabled={!canEdit}
            id="serialNumber"
            name="serialNumber"
            placeholder="SN-998421"
          />
          <FieldError message={errors?.serialNumber} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/72" htmlFor="costCenter">
            Centro de costo
          </label>
          <input
            className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
            defaultValue={values.costCenter}
            disabled={!canEdit}
            id="costCenter"
            name="costCenter"
            placeholder="TI-OPERACIONES"
          />
          <FieldError message={errors?.costCenter} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/72" htmlFor="location">
            Ubicación
          </label>
          <input
            className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
            defaultValue={values.location}
            disabled={!canEdit}
            id="location"
            name="location"
            placeholder="Edificio Norte / Piso 2"
          />
          <FieldError message={errors?.location} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-white/72"
            htmlFor="responsible"
          >
            Responsable
          </label>
          <input
            className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:opacity-60"
            defaultValue={values.responsible}
            disabled={!canEdit}
            id="responsible"
            name="responsible"
            placeholder="Equipo de Finanzas"
          />
          <FieldError message={errors?.responsible} />
        </div>

        {errors?.form ? (
          <div className="rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 py-3 text-sm text-rose-100 md:col-span-2">
            {errors.form}
          </div>
        ) : null}

        <div className="md:col-span-2">
          <SubmitButton disabled={!canEdit} />
        </div>
      </form>
    </Panel>
  );
}
