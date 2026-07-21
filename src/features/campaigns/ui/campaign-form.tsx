"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  GripVertical,
} from "lucide-react";

import {
  createCampaignAction,
  type CreateCampaignFormState,
} from "@/src/features/campaigns/actions";
import {
  defaultCampaignDraft,
  getInventoryModeLabel,
  inventoryModes,
  normalizeCampaignCode,
  type CreateCampaignDraft,
} from "@/src/features/campaigns/domain/campaign";
import { cn } from "@/src/shared/lib/cn";

type WizardStep = 0 | 1 | 2;
type FieldMode = "required" | "optional" | "disabled";

const wizardSteps = [
  "Información general",
  "Configuración de toma física",
  "Revisión y confirmación",
] as const;

const captureRows: Array<{
  key: string;
  label: string;
  observation: string;
  locked?: boolean;
}> = [
  {
    key: "assetCode",
    label: "Código del activo (QR / Código de barras)",
    observation: "Siempre obligatorio",
    locked: true,
  },
  {
    key: "observedLocation",
    label: "Ubicación observada",
    observation: "Ej: Piso, oficina, área",
  },
  {
    key: "physicalStatus",
    label: "Estado físico",
    observation: "Bueno, Regular, Malo",
  },
  {
    key: "observedResponsible",
    label: "Responsable observado",
    observation: "Persona que utiliza el activo",
  },
  {
    key: "assetPhoto",
    label: "Foto del activo",
    observation: "Se solicitará solo si aplica diferencias",
  },
  {
    key: "notes",
    label: "Observaciones",
    observation: "Comentario del auditor",
  },
  {
    key: "gps",
    label: "Ubicación GPS",
    observation: "Captura automática",
  },
  {
    key: "timestamp",
    label: "Fecha y hora",
    observation: "Captura automática",
    locked: true,
  },
  {
    key: "auditor",
    label: "Auditor",
    observation: "Usuario autenticado",
    locked: true,
  },
];

const initialFieldModes: Record<string, FieldMode> = {
  assetCode: "required",
  observedLocation: "required",
  physicalStatus: "optional",
  observedResponsible: "optional",
  assetPhoto: "optional",
  notes: "optional",
  gps: "required",
  timestamp: "required",
  auditor: "required",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0f988c] px-6 text-base font-semibold text-white shadow-[0_16px_32px_rgba(15,152,140,0.22)] transition hover:bg-[#087e75] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Creando..." : "Crear campaña"}
      <Check aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
    </button>
  );
}

function getAutoCampaignCode(draft: CreateCampaignDraft) {
  const base = normalizeCampaignCode(draft.name || draft.clientName || "CAMPANA");
  const year = draft.scheduledStartAt.slice(0, 4);
  const code = normalizeCampaignCode([base, year].filter(Boolean).join("-"));

  return code || "CAMPANA";
}

function StepRail({
  activeStep,
  canOpenStep,
  goToStep,
}: {
  activeStep: WizardStep;
  canOpenStep: (step: WizardStep) => boolean;
  goToStep: (step: WizardStep) => void;
}) {
  return (
    <aside className="rounded-lg border border-[#d8e0ec] bg-white p-4 xl:p-6">
      <div className="grid grid-cols-3 gap-2 xl:grid-cols-1 xl:gap-5">
        {wizardSteps.map((title, index) => {
          const step = index as WizardStep;
          const isActive = activeStep === step;
          const isDone = activeStep > step;
          const isLocked = !canOpenStep(step);

          return (
            <button
              className={cn(
                "flex min-w-0 items-center gap-3 rounded-lg p-2 text-left transition xl:p-3",
                isActive ? "bg-[#f0fbfa]" : "hover:bg-[#f8fafc]",
                isLocked && "cursor-not-allowed opacity-55 hover:bg-transparent",
              )}
              disabled={isLocked}
              key={title}
              onClick={() => goToStep(step)}
              type="button"
            >
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold",
                  isActive || isDone
                    ? "bg-[#0f988c] text-white"
                    : "bg-[#d8e0ec] text-[#667085]",
                )}
              >
                {index + 1}
              </span>
              <span className="hidden min-w-0 text-sm font-semibold text-[#344054] sm:block">
                {title}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function FieldLabel({
  children,
  htmlFor,
  required = false,
}: {
  children: string;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-semibold text-[#667085]" htmlFor={htmlFor}>
      {children}
      {required ? <span className="text-[#0f988c]"> *</span> : null}
    </label>
  );
}

function TextInput({
  id,
  label,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
  error,
}: {
  id: keyof CreateCampaignDraft;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: "text" | "date";
  value: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <input
          className="h-14 w-full rounded-lg border border-[#d8e0ec] bg-white px-4 text-base font-medium text-[#344054] outline-none transition placeholder:text-[#98a2b3] focus:border-[#0f988c]"
          id={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
        {type === "date" ? (
          <CalendarDays
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#667085]"
            strokeWidth={2}
          />
        ) : null}
      </div>
      {error ? <p className="text-sm font-medium text-[#b42318]">{error}</p> : null}
    </div>
  );
}

function ToggleRow({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      className="grid w-full grid-cols-[1fr_auto] items-center gap-5 rounded-lg p-3 text-left transition hover:bg-[#f8fafc]"
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span>
        <span className="block text-base font-semibold text-[#344054]">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-[#667085]">{description}</span>
      </span>
      <span
        className={cn(
          "relative h-8 w-14 rounded-full transition",
          checked ? "bg-[#0f988c]" : "bg-[#c7ceda]",
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition",
            checked ? "left-7" : "left-1",
          )}
        />
      </span>
    </button>
  );
}

function ModeRadio({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        "grid h-6 w-6 place-items-center rounded-full border-2 transition",
        checked ? "border-[#0f988c]" : "border-[#cfd8e6]",
        disabled ? "cursor-not-allowed opacity-70" : "hover:border-[#0f988c]",
      )}
      disabled={disabled}
      onClick={onChange}
      type="button"
    >
      <span
        className={cn(
          "h-3 w-3 rounded-full transition",
          checked ? "bg-[#0f988c]" : "bg-transparent",
        )}
      />
    </button>
  );
}

function CampaignHiddenFields({
  campaignCode,
  draft,
}: {
  campaignCode: string;
  draft: CreateCampaignDraft;
}) {
  return (
    <>
      <input name="name" type="hidden" value={draft.name} />
      <input name="code" type="hidden" value={campaignCode} />
      <input name="clientName" type="hidden" value={draft.clientName} />
      <input name="description" type="hidden" value={draft.description} />
      <input name="siteName" type="hidden" value={draft.siteName} />
      <input name="inventoryMode" type="hidden" value={draft.inventoryMode} />
      <input name="scheduledStartAt" type="hidden" value={draft.scheduledStartAt} />
      <input name="scheduledEndAt" type="hidden" value={draft.scheduledEndAt} />
      <input name="captureRequiresPhoto" type="hidden" value={draft.captureRequiresPhoto ? "true" : "false"} />
      <input name="captureRequiresGeo" type="hidden" value={draft.captureRequiresGeo ? "true" : "false"} />
      <input name="allowManualAssets" type="hidden" value={draft.allowManualAssets ? "true" : "false"} />
      <input name="closeBlocksCaptures" type="hidden" value={draft.closeBlocksCaptures ? "true" : "false"} />
    </>
  );
}

export function CampaignForm() {
  const initialState: CreateCampaignFormState = {
    values: { ...defaultCampaignDraft, captureRequiresGeo: true },
  };
  const [serverState, formAction] = useActionState(
    createCampaignAction,
    initialState,
  );
  const [step, setStep] = useState<WizardStep>(0);
  const [fieldModes, setFieldModes] = useState(initialFieldModes);
  const [offlineEnabled, setOfflineEnabled] = useState(true);
  const [supervisorReview, setSupervisorReview] = useState(true);
  const [draft, setDraft] = useState<CreateCampaignDraft>(initialState.values);

  const errors = serverState?.errors;
  const campaignCode = useMemo(() => getAutoCampaignCode(draft), [draft]);
  const stepOneReady =
    draft.name.trim().length >= 4 &&
    draft.clientName.trim().length > 0 &&
    draft.siteName.trim().length > 0 &&
    draft.scheduledStartAt.trim().length > 0 &&
    draft.scheduledEndAt.trim().length > 0 &&
    draft.scheduledEndAt >= draft.scheduledStartAt;

  const reviewItems = [
    ["Campaña", draft.name],
    ["Cliente", draft.clientName],
    ["Sede principal", draft.siteName],
    ["Fechas", `${draft.scheduledStartAt || "Sin inicio"} - ${draft.scheduledEndAt || "Sin fin"}`],
    ["Código interno", campaignCode],
    ["Tipo de inventario", getInventoryModeLabel(draft.inventoryMode)],
    ["Foto del activo", draft.captureRequiresPhoto ? "Obligatoria" : "Opcional"],
    ["Ubicación GPS", draft.captureRequiresGeo ? "Obligatoria" : "Opcional"],
    ["Registros sin conexión", offlineEnabled ? "Permitidos" : "Desactivados"],
    ["Revisión supervisor", supervisorReview ? "Requerida" : "No requerida"],
  ];

  const updateField = <K extends keyof CreateCampaignDraft>(
    key: K,
    value: CreateCampaignDraft[K],
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateMode = (key: string, mode: FieldMode) => {
    setFieldModes((current) => ({
      ...current,
      [key]: mode,
    }));

    if (key === "assetPhoto") {
      updateField("captureRequiresPhoto", mode === "required");
    }

    if (key === "gps") {
      updateField("captureRequiresGeo", mode === "required");
    }
  };

  const goNext = () => {
    setStep((current) => Math.min(2, current + 1) as WizardStep);
  };

  const goBack = () => {
    setStep((current) => Math.max(0, current - 1) as WizardStep);
  };

  const canOpenStep = (targetStep: WizardStep) => {
    if (targetStep === 0) {
      return true;
    }

    return stepOneReady;
  };

  return (
    <form action={formAction} className="grid gap-5 xl:grid-cols-[280px_1fr]">
      <CampaignHiddenFields campaignCode={campaignCode} draft={draft} />
      <StepRail activeStep={step} canOpenStep={canOpenStep} goToStep={setStep} />

      <section className="rounded-lg border border-[#d8e0ec] bg-white shadow-[0_18px_44px_rgba(20,55,90,0.06)]">
        {errors?.form || errors?.code ? (
          <div className="border-b border-[#ffdad6] bg-[#fff1f0] px-5 py-4 text-sm font-medium text-[#b42318]">
            {errors.form ?? errors.code}
          </div>
        ) : null}

        <div className="space-y-5 p-4 sm:p-6">
          <section className={cn(step === 0 ? "block" : "hidden")}>
            <div className="rounded-lg border border-[#d8e0ec] p-4 sm:p-6">
              <h2 className="text-2xl font-semibold text-[#14375a]">1. Información general</h2>
              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                <TextInput
                  error={errors?.name}
                  id="name"
                  label="Nombre de la campaña"
                  onChange={(value) => updateField("name", value)}
                  placeholder="Inventario Banco X"
                  required
                  value={draft.name}
                />

                <div className="space-y-2">
                  <FieldLabel htmlFor="clientName" required>
                    Cliente
                  </FieldLabel>
                  <div className="relative">
                    <input
                      className="h-14 w-full rounded-lg border border-[#d8e0ec] bg-white px-4 pr-12 text-base font-medium text-[#344054] outline-none transition placeholder:text-[#98a2b3] focus:border-[#0f988c]"
                      id="clientName"
                      onChange={(event) => updateField("clientName", event.target.value)}
                      placeholder="Banco X"
                      value={draft.clientName}
                    />
                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#667085]"
                      strokeWidth={2}
                    />
                  </div>
                  {errors?.clientName ? <p className="text-sm font-medium text-[#b42318]">{errors.clientName}</p> : null}
                </div>

                <TextInput
                  id="description"
                  label="Descripción"
                  onChange={(value) => updateField("description", value)}
                  placeholder="Toma física de activos fijos 2026"
                  value={draft.description}
                />

                <TextInput
                  error={errors?.scheduledStartAt}
                  id="scheduledStartAt"
                  label="Fecha inicio"
                  onChange={(value) => updateField("scheduledStartAt", value)}
                  placeholder=""
                  required
                  type="date"
                  value={draft.scheduledStartAt}
                />

                <TextInput
                  error={errors?.scheduledEndAt}
                  id="scheduledEndAt"
                  label="Fecha fin"
                  onChange={(value) => updateField("scheduledEndAt", value)}
                  placeholder=""
                  required
                  type="date"
                  value={draft.scheduledEndAt}
                />

                <div className="space-y-2">
                  <FieldLabel htmlFor="siteName" required>
                    Lugar / Sede principal
                  </FieldLabel>
                  <div className="relative">
                    <input
                      className="h-14 w-full rounded-lg border border-[#d8e0ec] bg-white px-4 pr-12 text-base font-medium text-[#344054] outline-none transition placeholder:text-[#98a2b3] focus:border-[#0f988c]"
                      id="siteName"
                      onChange={(event) => updateField("siteName", event.target.value)}
                      placeholder="Santiago - Casa Matriz"
                      value={draft.siteName}
                    />
                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#667085]"
                      strokeWidth={2}
                    />
                  </div>
                  {errors?.siteName ? <p className="text-sm font-medium text-[#b42318]">{errors.siteName}</p> : null}
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_2fr]">
                <div className="space-y-2">
                  <FieldLabel htmlFor="inventoryMode">Modo de inventario</FieldLabel>
                  <select
                    className="h-14 w-full rounded-lg border border-[#d8e0ec] bg-white px-4 text-base font-medium text-[#344054] outline-none transition focus:border-[#0f988c]"
                    id="inventoryMode"
                    onChange={(event) =>
                      updateField(
                        "inventoryMode",
                        event.target.value as CreateCampaignDraft["inventoryMode"],
                      )
                    }
                    value={draft.inventoryMode}
                  >
                    {inventoryModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {getInventoryModeLabel(mode)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-lg bg-[#f8fafc] px-4 py-3 text-sm font-medium leading-6 text-[#667085]">
                  Código interno generado:{" "}
                  <span className="font-semibold text-[#14375a]">{campaignCode}</span>
                </div>
              </div>
            </div>
          </section>

          <section className={cn(step === 1 ? "block" : "hidden")}>
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
              <div className="rounded-lg border border-[#d8e0ec] p-4 sm:p-6">
                <h2 className="text-2xl font-semibold text-[#14375a]">
                  2. Configuración de campos de toma física
                </h2>
                <p className="mt-2 text-base font-medium text-[#667085]">
                  Defina qué información deben registrar los auditores al capturar cada activo.
                </p>

                <div className="mt-6 hidden overflow-hidden rounded-lg border border-[#e4e7eb] md:block">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-[#f8fafc] text-[#667085]">
                      <tr>
                        <th className="w-10 px-4 py-4" />
                        <th className="px-4 py-4 text-left font-semibold">Campo</th>
                        <th className="px-4 py-4 text-center font-semibold">Obligatorio</th>
                        <th className="px-4 py-4 text-center font-semibold">Opcional</th>
                        <th className="px-4 py-4 text-center font-semibold">No aplicar</th>
                        <th className="px-4 py-4 text-left font-semibold">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eef2f7]">
                      {captureRows.map((row) => (
                        <tr key={row.key}>
                          <td className="px-4 py-4 text-[#667085]">
                            <GripVertical aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                          </td>
                          <td className="px-4 py-4 font-semibold text-[#344054]">{row.label}</td>
                          {(["required", "optional", "disabled"] as const).map((mode) => (
                            <td className="px-4 py-4" key={mode}>
                              <div className="flex justify-center">
                                <ModeRadio
                                  checked={fieldModes[row.key] === mode}
                                  disabled={row.locked && mode !== "required"}
                                  label={`${row.label} ${mode}`}
                                  onChange={() => updateMode(row.key, mode)}
                                />
                              </div>
                            </td>
                          ))}
                          <td className="px-4 py-4 font-medium text-[#667085]">{row.observation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 grid gap-3 md:hidden">
                  {captureRows.map((row) => (
                    <div className="rounded-lg border border-[#e4e7eb] p-4" key={row.key}>
                      <div className="flex items-start gap-3">
                        <GripVertical aria-hidden="true" className="mt-0.5 h-5 w-5 text-[#667085]" strokeWidth={2} />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#344054]">{row.label}</p>
                          <p className="mt-1 text-sm font-medium leading-6 text-[#667085]">{row.observation}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {(["required", "optional", "disabled"] as const).map((mode) => (
                          <button
                            className={cn(
                              "rounded-lg border px-2 py-2 text-xs font-semibold",
                              fieldModes[row.key] === mode
                                ? "border-[#0f988c] bg-[#f0fbfa] text-[#0f988c]"
                                : "border-[#d8e0ec] text-[#667085]",
                            )}
                            disabled={row.locked && mode !== "required"}
                            key={mode}
                            onClick={() => updateMode(row.key, mode)}
                            type="button"
                          >
                            {mode === "required" ? "Oblig." : mode === "optional" ? "Opc." : "No aplica"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-[#d8e0ec] p-4 sm:p-6">
                <h2 className="text-2xl font-semibold text-[#14375a]">3. Opciones adicionales</h2>
                <div className="mt-7 space-y-3">
                  <ToggleRow
                    checked={offlineEnabled}
                    description="Los registros se sincronizarán al recuperar conexión."
                    label="Permitir registros sin conexión"
                    onChange={setOfflineEnabled}
                  />
                  <ToggleRow
                    checked={draft.allowManualAssets}
                    description="Los auditores podrán registrar activos no encontrados."
                    label="Permitir activos no encontrados"
                    onChange={(checked) => updateField("allowManualAssets", checked)}
                  />
                  <ToggleRow
                    checked={supervisorReview}
                    description="Todos los registros deberán ser revisados."
                    label="Requiere revisión de supervisor"
                    onChange={setSupervisorReview}
                  />
                  <ToggleRow
                    checked={draft.closeBlocksCaptures}
                    description="Evita nuevas capturas una vez cerrada la campaña."
                    label="Bloquear captura al cierre"
                    onChange={(checked) => updateField("closeBlocksCaptures", checked)}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={cn(step === 2 ? "block" : "hidden")}>
            <div className="rounded-lg border border-[#d8e0ec] p-4 sm:p-6">
              <h2 className="text-2xl font-semibold text-[#14375a]">4. Revisión y confirmación</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {reviewItems.map(([label, value]) => (
                  <div className="rounded-lg bg-[#f8fafc] p-4" key={label}>
                    <p className="text-xs font-semibold uppercase text-[#667085]">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-[#14375a]">{value || "Sin definir"}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-[#e4e7eb] bg-white/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex gap-3">
            {step > 0 ? (
              <button
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#d8e0ec] bg-white px-5 text-base font-semibold text-[#14375a] transition hover:bg-[#f8fafc]"
                onClick={goBack}
                type="button"
              >
                <ArrowLeft aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
                Volver
              </button>
            ) : (
              <Link
                className="inline-flex h-12 items-center justify-center rounded-lg px-5 text-base font-semibold text-[#0f988c] transition hover:bg-[#f8fafc]"
                href="/campaigns"
              >
                Cancelar
              </Link>
            )}
          </div>

          {step < 2 ? (
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0f988c] px-6 text-base font-semibold text-white shadow-[0_16px_32px_rgba(15,152,140,0.22)] transition hover:bg-[#087e75] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={step === 0 && !stepOneReady}
              onClick={goNext}
              type="button"
            >
              Siguiente
              <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
            </button>
          ) : (
            <SubmitButton />
          )}
        </div>
      </section>
    </form>
  );
}
