"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  updateCampaignSettingsAction,
} from "@/src/features/campaigns/actions";
import type { CampaignSettingsInput } from "@/src/features/campaigns/domain/campaign-settings";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Panel } from "@/src/shared/ui/panel";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={disabled || pending} fullWidth size="lg" type="submit">
      {pending ? "Guardando..." : "Guardar configuración"}
    </Button>
  );
}

function ToggleField({
  defaultChecked,
  description,
  disabled,
  name,
  title,
}: {
  defaultChecked: boolean;
  description: string;
  disabled: boolean;
  name: keyof CampaignSettingsInput;
  title: string;
}) {
  return (
    <label className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-black/20 p-5">
      <input
        className="mt-1 h-4 w-4 accent-emerald-300"
        defaultChecked={defaultChecked}
        disabled={disabled}
        name={name}
        type="checkbox"
      />
      <div className="space-y-2">
        <p className="text-base font-semibold text-white">{title}</p>
        <p className="text-sm leading-7 text-white/60">{description}</p>
      </div>
    </label>
  );
}

export function CampaignSettingsForm({
  campaignId,
  canEdit,
  initialValues,
}: {
  campaignId: string;
  canEdit: boolean;
  initialValues: CampaignSettingsInput;
}) {
  const updateCampaignSettingsForCampaign =
    updateCampaignSettingsAction.bind(null, campaignId);
  const [state, formAction] = useActionState(
    updateCampaignSettingsForCampaign,
    { values: initialValues },
  );

  return (
    <Panel className="space-y-6" glow padding="lg">
        <div className="space-y-3">
          <Badge>Configuración de campaña</Badge>
          <div className="space-y-2">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white">
              Defina los requisitos de captura y las restricciones del cierre.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-white/62">
              Estos ajustes controlan la forma en que el equipo registra activos,
              adjunta evidencia y completa el inventario.
            </p>
          </div>
        </div>

      <form action={formAction} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <ToggleField
            defaultChecked={state.values.captureRequiresPhoto}
            description="Exija evidencia fotográfica en cada captura de activo."
            disabled={!canEdit}
            name="captureRequiresPhoto"
            title="Requerir foto"
          />
          <ToggleField
            defaultChecked={state.values.captureRequiresGeo}
            description="Pida geolocalización durante la captura en terreno."
            disabled={!canEdit}
            name="captureRequiresGeo"
            title="Requerir geolocalización"
          />
          <ToggleField
            defaultChecked={state.values.allowManualAssets}
            description="Permita crear activos manuales si el maestro no los trae."
            disabled={!canEdit}
            name="allowManualAssets"
            title="Permitir activos manuales"
          />
          <ToggleField
            defaultChecked={state.values.closeBlocksCaptures}
            description="Bloquee nuevas capturas una vez que la campaña se cierre."
            disabled={!canEdit}
            name="closeBlocksCaptures"
            title="Bloquear capturas al cierre"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/72" htmlFor="notes">
            Notas operativas
          </label>
          <textarea
            className="min-h-36 w-full rounded-[24px] border border-white/10 bg-white/6 px-4 py-4 text-white outline-none transition placeholder:text-white/28 focus:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-60"
            defaultValue={state.values.notes}
            disabled={!canEdit}
            id="notes"
            name="notes"
            placeholder="Ejemplo: la campaña requiere foto en patios exteriores y geolocalización solo para equipos movibles."
          />
          {state.errors?.notes ? (
            <p className="text-sm text-rose-200">{state.errors.notes}</p>
          ) : null}
        </div>

        {state.errors?.form ? (
          <div className="rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {state.errors.form}
          </div>
        ) : null}

        {state.message ? (
          <div className="rounded-2xl border border-emerald-300/24 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
            {state.message}
          </div>
        ) : null}

        <SubmitButton disabled={!canEdit} />
      </form>
    </Panel>
  );
}
