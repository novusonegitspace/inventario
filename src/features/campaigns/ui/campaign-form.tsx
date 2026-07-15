"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  createCampaignAction,
  type CreateCampaignFormState,
} from "@/src/features/campaigns/actions";
import {
  defaultCampaignDraft,
  getInventoryModeLabel,
  inventoryModes,
} from "@/src/features/campaigns/domain/campaign";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button fullWidth size="lg" type="submit">
      {pending ? "Creando campaña..." : "Crear campaña"}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-rose-200">{message}</p>;
}

export function CampaignForm() {
  const initialState: CreateCampaignFormState = {
    values: { ...defaultCampaignDraft },
  };
  const [state, formAction] = useActionState(
    createCampaignAction,
    initialState,
  );
  const values = state?.values ?? initialState.values;
  const errors = state?.errors;

  return (
    <Panel className="w-full" glow padding="lg">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge>Nueva campaña</Badge>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-white">
              Abra una campaña lista para crecer a activos, captura y cierre.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-white/62">
              En este punto priorizamos pocos campos, buen naming y una fecha
              clara. La configuración profunda seguirá dentro de la campaña.
            </p>
          </div>
        </div>

        <form action={formAction} className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-white/72" htmlFor="name">
              Nombre de campaña
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50"
              defaultValue={values.name}
              id="name"
              name="name"
              placeholder="Inventario Planta Norte 2026"
            />
            <FieldError message={errors?.name} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/72" htmlFor="code">
              Código corto
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50"
              defaultValue={values.code}
              id="code"
              name="code"
              placeholder="PLANTA-NORTE-2026"
            />
            <FieldError message={errors?.code} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="inventoryMode"
            >
              Modo de inventario
            </label>
            <select
              className="h-13 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-white outline-none transition focus:border-emerald-300/50"
              defaultValue={values.inventoryMode}
              id="inventoryMode"
              name="inventoryMode"
            >
              {inventoryModes.map((mode) => (
                <option key={mode} value={mode}>
                  {getInventoryModeLabel(mode)}
                </option>
              ))}
            </select>
            <FieldError message={errors?.inventoryMode} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="clientName"
            >
              Cliente o unidad
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50"
              defaultValue={values.clientName}
              id="clientName"
              name="clientName"
              placeholder="Novus Manufacturing"
            />
            <FieldError message={errors?.clientName} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="siteName"
            >
              Sitio operativo
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50"
              defaultValue={values.siteName}
              id="siteName"
              name="siteName"
              placeholder="Planta Norte"
            />
            <FieldError message={errors?.siteName} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="scheduledStartAt"
            >
              Inicio estimado
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition focus:border-emerald-300/50"
              defaultValue={values.scheduledStartAt}
              id="scheduledStartAt"
              name="scheduledStartAt"
              type="date"
            />
            <FieldError message={errors?.scheduledStartAt} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-white/72"
              htmlFor="scheduledEndAt"
            >
              Fin estimado
            </label>
            <input
              className="h-13 w-full rounded-2xl border border-white/10 bg-white/6 px-4 text-white outline-none transition focus:border-emerald-300/50"
              defaultValue={values.scheduledEndAt}
              id="scheduledEndAt"
              name="scheduledEndAt"
              type="date"
            />
            <FieldError message={errors?.scheduledEndAt} />
          </div>

          {errors?.form ? (
            <div className="rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 py-3 text-sm text-rose-100 md:col-span-2">
              {errors.form}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <SubmitButton />
          </div>
        </form>
      </div>
    </Panel>
  );
}
