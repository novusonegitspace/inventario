"use client";

import {
  ArrowRight,
  Barcode,
  Building2,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CloudUpload,
  FileSpreadsheet,
  FileText,
  Hash,
  Info,
  MapPin,
  Package,
  Paperclip,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Trash2,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  updateCaptureSettingsAction,
  type CaptureSettingsFormState,
} from "@/src/features/campaign-settings/actions";
import {
  importAssetMasterAction,
  type AssetMasterImportFormState,
} from "@/src/features/asset-imports/actions";
import {
  createAssetInlineAction,
  type CreateAssetFormState,
} from "@/src/features/assets/actions";
import {
  defaultAssetDraft,
  type CreateAssetDraft,
} from "@/src/features/assets/domain/asset";
import {
  getInventoryModeLabel,
  getPresetForMode,
  type AssetManagementMethod,
  type CaptureField,
  type CaptureSettingsInput,
  type EvidenceRequirement,
  type FieldDataType,
  type FieldRequirement,
  type InventoryMode,
} from "@/src/features/campaign-settings/domain/capture-settings";
import { cn } from "@/src/shared/lib/cn";

const modeOptions: Array<{
  mode: InventoryMode;
  title: string;
  description: string;
  Icon: LucideIcon;
}> = [
  {
    mode: "simple_count",
    title: "Conteo simple",
    description: "Ideal para inventarios rápidos donde solo se requiere contar cantidades.",
    Icon: Package,
  },
  {
    mode: "full_audit",
    title: "Auditoría completa",
    description: "Captura detallada con evidencia obligatoria y trazabilidad completa.",
    Icon: ShieldCheck,
  },
  {
    mode: "custom",
    title: "Personalizado",
    description: "Configura campos, evidencia y reglas según la campaña.",
    Icon: SlidersHorizontal,
  },
];

const methodOptions: Array<{
  method: AssetManagementMethod;
  title: string;
  description: string;
  Icon: LucideIcon;
}> = [
  {
    method: "bulk_only",
    title: "Carga masiva (maestro)",
    description: "Carga un archivo con el listado de activos a contar.",
    Icon: CloudUpload,
  },
  {
    method: "manual_only",
    title: "Registro manual",
    description: "Agrega activos desde la sección Activos. Máximo 20 activos.",
    Icon: FileText,
  },
  {
    method: "hybrid",
    title: "Ambos",
    description: "Usa un maestro y permite agregar excepciones manuales.",
    Icon: SlidersHorizontal,
  },
];

const fieldIconMap: Record<string, LucideIcon> = {
  asset_code: Barcode,
  quantity_found: Hash,
  observed_location: MapPin,
  physical_condition: ShieldCheck,
  observed_responsible: UserRound,
  asset_photo: Camera,
  notes: FileText,
  capture_status: CheckCircle2,
  serial_number: Barcode,
  cost_center: Building2,
  critical_asset: CircleAlert,
};

const requirementLabels: Record<FieldRequirement, string> = {
  required: "Obligatorio",
  optional: "Opcional",
  not_applicable: "No aplica",
};

const evidenceLabels: Record<EvidenceRequirement, string> = {
  required: "Obligatoria",
  optional: "Opcional",
  not_applicable: "No aplica",
  required_when_difference: "Obligatoria cuando exista diferencia",
};

const dataTypeOptions: Array<{
  type: FieldDataType;
  label: string;
  Icon: LucideIcon;
}> = [
  { type: "text", label: "Texto", Icon: FileText },
  { type: "number", label: "Número", Icon: Hash },
  { type: "date", label: "Fecha", Icon: CalendarDays },
  { type: "select", label: "Lista", Icon: SlidersHorizontal },
  { type: "boolean", label: "Sí / No", Icon: CheckCircle2 },
  { type: "file", label: "Archivo", Icon: Paperclip },
];

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0f988c] px-6 text-sm font-semibold !text-white shadow-[0_16px_32px_rgba(15,152,140,0.24)] transition hover:bg-[#0b7f75] disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled || pending}
      type="submit"
    >
      <Save aria-hidden="true" className="h-5 w-5" />
      {pending ? "Guardando..." : "Guardar configuración"}
    </button>
  );
}

function ImportMasterButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="h-11 rounded-lg bg-[#0f988c] px-5 text-sm font-semibold !text-white disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? "Importando..." : "Validar e importar"}
    </button>
  );
}

function ManualAssetSubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="h-11 rounded-lg bg-[#0f988c] px-5 text-sm font-semibold !text-white shadow-[0_14px_28px_rgba(15,152,140,0.22)] transition hover:bg-[#0b7f75] disabled:cursor-not-allowed disabled:opacity-50"
      disabled={disabled || pending}
      type="submit"
    >
      {pending ? "Registrando..." : "Registrar activo"}
    </button>
  );
}

function ModeCard({
  Icon,
  active,
  description,
  disabled,
  onClick,
  title,
}: {
  Icon: LucideIcon;
  active: boolean;
  description: string;
  disabled: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className={cn(
        "grid w-full grid-cols-[auto_auto_1fr] items-start gap-4 rounded-lg border p-4 text-left transition",
        active
          ? "border-[#16b8ac] bg-[#eefbf8] shadow-[0_16px_34px_rgba(15,152,140,0.10)]"
          : "border-[#e4e7eb] bg-white hover:border-[#b7d8d4]",
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span
        className={cn(
          "mt-1 grid h-5 w-5 place-items-center rounded-full border-2",
          active ? "border-[#0f988c] bg-[#0f988c]" : "border-[#b7c3d0]",
        )}
      >
        {active ? <Check aria-hidden="true" className="h-3 w-3 text-white" /> : null}
      </span>
      <Icon aria-hidden="true" className="mt-1 h-8 w-8 text-[#46618a]" strokeWidth={2.1} />
      <span>
        <span className="block text-base font-semibold text-[#14375a]">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-[#667085]">{description}</span>
      </span>
    </button>
  );
}

function ManualAssetField({
  disabled,
  error,
  label,
  name,
  placeholder,
  required,
  value,
}: {
  disabled: boolean;
  error?: string;
  label: string;
  name: keyof CreateAssetDraft;
  placeholder: string;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#344054]">
        {label}
        {required ? <span className="text-[#0f988c]"> *</span> : null}
      </span>
      <input
        className={cn(
          "h-12 rounded-lg border px-4 text-[#14375a] outline-none transition focus:border-[#16b8ac]",
          disabled ? "cursor-not-allowed bg-[#f7f9fc] text-[#98a2b3]" : "",
          error ? "border-[#fda29b] bg-[#fff8f8]" : "border-[#d6deea] bg-white",
        )}
        defaultValue={value}
        disabled={disabled}
        name={name}
        placeholder={placeholder}
      />
      {error ? <span className="text-xs font-semibold text-[#d92d20]">{error}</span> : null}
    </label>
  );
}

function Toggle({
  checked,
  description,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  disabled: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-lg p-2">
      <span>
        <span className="block text-sm font-semibold text-[#14375a]">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-[#667085]">{description}</span>
      </span>
      <button
        aria-pressed={checked}
        className={cn(
          "relative mt-1 h-7 w-12 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-[#0f988c]" : "bg-[#cfd6e2]",
        )}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition",
            checked ? "left-6" : "left-1",
          )}
        />
      </button>
    </label>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-[#e4e7eb] bg-white p-5 shadow-[0_18px_40px_rgba(20,55,90,0.045)]", className)}>
      {children}
    </section>
  );
}

function RequirementPicker({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean;
  onChange: (value: FieldRequirement) => void;
  value: FieldRequirement;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {(["required", "optional", "not_applicable"] as const).map((requirement) => (
        <button
          className={cn(
            "grid h-9 place-items-center rounded-full border text-xs font-semibold transition",
            value === requirement
              ? "border-[#16b8ac] bg-[#e9fbf7] text-[#0f988c]"
              : "border-[#d6deea] bg-white text-[#667085]",
          )}
          disabled={disabled}
          key={requirement}
          onClick={() => onChange(requirement)}
          type="button"
        >
          {requirement === "required" ? "Obl." : requirement === "optional" ? "Opc." : "N/A"}
        </button>
      ))}
    </div>
  );
}

function FieldRows({
  canEdit,
  fields,
  onDeleteField,
  onUpdateField,
}: {
  canEdit: boolean;
  fields: CaptureField[];
  onDeleteField: (index: number) => void;
  onUpdateField: (index: number, patch: Partial<CaptureField>) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#e4e7eb]">
      <div className="hidden grid-cols-[1fr_130px_130px_130px_60px] bg-[#f7f9fc] px-4 py-3 text-xs font-semibold text-[#667085] md:grid">
        <span>Campo</span>
        <span>Obligatorio</span>
        <span>Opcional</span>
        <span>No aplica</span>
        <span />
      </div>

      <div className="divide-y divide-[#eef1f5]">
        {fields.map((fieldItem, index) => {
          const Icon = fieldIconMap[fieldItem.key] ?? FileText;

          return (
            <div
              className="grid gap-3 px-4 py-3 md:grid-cols-[1fr_130px_130px_130px_60px] md:items-center"
              key={`${fieldItem.key}-${index}`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#46618a]" />
                <div className="min-w-0">
                  <p className="font-semibold text-[#14375a]">{fieldItem.label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-[#667085]">{fieldItem.helpText}</p>
                </div>
              </div>

              <div className="md:hidden">
                <RequirementPicker
                  disabled={!canEdit || fieldItem.key === "asset_code"}
                  onChange={(requirement) => onUpdateField(index, { requirement })}
                  value={fieldItem.requirement}
                />
              </div>

              {(["required", "optional", "not_applicable"] as const).map((requirement) => (
                <label
                  className="hidden items-center justify-center md:flex"
                  key={requirement}
                >
                  <input
                    checked={fieldItem.requirement === requirement}
                    className="h-5 w-5 accent-[#0f988c]"
                    disabled={!canEdit || fieldItem.key === "asset_code"}
                    onChange={() => onUpdateField(index, { requirement })}
                    type="radio"
                  />
                </label>
              ))}

              <button
                className="hidden h-9 w-9 place-items-center rounded-lg text-[#98a2b3] transition hover:bg-[#fff1f1] hover:text-[#d92d20] disabled:cursor-not-allowed disabled:opacity-30 md:grid"
                disabled={!canEdit || fieldItem.isSystem}
                onClick={() => onDeleteField(index)}
                type="button"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SelectBox({
  disabled,
  label,
  onChange,
  value,
}: {
  disabled: boolean;
  label: string;
  onChange: (value: EvidenceRequirement) => void;
  value: EvidenceRequirement;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[#344054]">{label}</span>
      <span className="relative block">
        <select
          className="h-11 w-full appearance-none rounded-lg border border-[#d6deea] bg-white px-4 pr-10 text-sm font-semibold text-[#0f988c] outline-none transition focus:border-[#16b8ac] disabled:cursor-not-allowed disabled:bg-[#f7f9fc] disabled:text-[#98a2b3]"
          disabled={disabled}
          onChange={(event) => onChange(event.target.value as EvidenceRequirement)}
          value={value}
        >
          {Object.entries(evidenceLabels).map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]"
        />
      </span>
    </label>
  );
}

function ManualAssetModal({
  campaignId,
  canEdit,
  manualAssetLimit,
  onClose,
}: {
  campaignId: string;
  canEdit: boolean;
  manualAssetLimit: number | null;
  onClose: () => void;
}) {
  const createAssetForCampaign = createAssetInlineAction.bind(null, campaignId);
  const initialState: CreateAssetFormState = {
    values: defaultAssetDraft,
  };
  const [state, formAction] = useActionState<CreateAssetFormState, FormData>(
    createAssetForCampaign,
    initialState,
  );
  const values = state.values ?? defaultAssetDraft;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#101828]/60 p-4 backdrop-blur-sm">
      <form
        action={formAction}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-[0_24px_70px_rgba(20,55,90,0.24)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#eef1f5] p-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#14375a]">Registrar activo manual</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Cree un activo directamente en esta campaña para casos manuales o excepciones del maestro.
            </p>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-[#667085] transition hover:bg-[#f2f4f7]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-xl border border-[#e4e7eb] bg-[#f8fffd] px-4 py-3 text-sm leading-6 text-[#46618a]">
            <span className="font-semibold text-[#14375a]">Uso recomendado:</span>{" "}
            registre aquí activos puntuales. Para listados grandes use la carga maestra.
            {manualAssetLimit !== null ? (
              <span className="mt-1 block font-semibold text-[#0f988c]">
                Límite configurado: {manualAssetLimit} activos manuales.
              </span>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ManualAssetField
              disabled={!canEdit}
              error={state.errors?.assetTag}
              label="Código interno / etiqueta"
              name="assetTag"
              placeholder="Ej: PC-001245"
              required
              value={values.assetTag}
            />
            <ManualAssetField
              disabled={!canEdit}
              error={state.errors?.barcode}
              label="Código QR / código de barras"
              name="barcode"
              placeholder="Ej: 7807210026386"
              required
              value={values.barcode}
            />
            <ManualAssetField
              disabled={!canEdit}
              error={state.errors?.name}
              label="Descripción del activo"
              name="name"
              placeholder="Ej: Notebook Dell Latitude"
              required
              value={values.name}
            />
            <ManualAssetField
              disabled={!canEdit}
              error={state.errors?.serialNumber}
              label="Número de serie"
              name="serialNumber"
              placeholder="Ej: SN-98231"
              value={values.serialNumber}
            />
            <ManualAssetField
              disabled={!canEdit}
              error={state.errors?.location}
              label="Ubicación esperada"
              name="location"
              placeholder="Ej: Santiago - Casa Matriz"
              required
              value={values.location}
            />
            <ManualAssetField
              disabled={!canEdit}
              error={state.errors?.responsible}
              label="Responsable esperado"
              name="responsible"
              placeholder="Ej: Felipe Godoy"
              required
              value={values.responsible}
            />
            <ManualAssetField
              disabled={!canEdit}
              error={state.errors?.costCenter}
              label="Centro de costo"
              name="costCenter"
              placeholder="Ej: ADM-001"
              value={values.costCenter}
            />
          </div>

          {state.errors?.form ? (
            <div className="rounded-lg border border-[#fda29b] bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#b42318]">
              {state.errors.form}
            </div>
          ) : null}

          {state.message ? (
            <div className="rounded-lg border border-[#8ed8d0] bg-[#f0fffc] px-4 py-3 text-sm font-semibold text-[#0f988c]">
              {state.message}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#eef1f5] p-6 sm:flex-row sm:justify-end">
          <button className="h-11 rounded-lg border border-[#d6deea] px-5 text-sm font-semibold text-[#46618a]" onClick={onClose} type="button">
            Cerrar
          </button>
          <ManualAssetSubmitButton disabled={!canEdit} />
        </div>
      </form>
    </div>
  );
}

function MasterUploadModal({
  campaignId,
  onClose,
}: {
  campaignId: string;
  onClose: () => void;
}) {
  const importMasterForCampaign = importAssetMasterAction.bind(null, campaignId);
  const initialState: AssetMasterImportFormState = {
    values: {
      fileName: "",
    },
  };
  const [state, formAction] = useActionState<AssetMasterImportFormState, FormData>(
    importMasterForCampaign,
    initialState,
  );
  const [fileName, setFileName] = useState("");
  const summary = state.summary;
  const selectedFileName = fileName || state.values.fileName;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#101828]/60 p-4 backdrop-blur-sm">
      <form
        action={formAction}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-[0_24px_70px_rgba(20,55,90,0.24)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#eef1f5] p-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#14375a]">Cargar maestro de activos</h2>
            <p className="mt-2 text-sm text-[#667085]">
              Cargue el listado base para crear o actualizar activos de la campaña.
            </p>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-[#667085] transition hover:bg-[#f2f4f7]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 p-6 lg:grid-cols-[1fr_260px]">
          <label className="grid min-h-[230px] cursor-pointer place-items-center rounded-xl border-2 border-dashed border-[#8ed8d0] bg-[#f8fffd] p-8 text-center">
            <input
              accept=".csv,.xlsx"
              className="sr-only"
              name="assetMasterFile"
              onChange={(event) => {
                setFileName(event.target.files?.[0]?.name ?? "");
              }}
              type="file"
            />
            <span>
              <UploadCloud aria-hidden="true" className="mx-auto h-12 w-12 text-[#0f988c]" />
              <span className="mt-4 block text-lg font-semibold text-[#14375a]">
                Arrastra aquí tu archivo maestro
              </span>
              <span className="mt-2 block text-sm text-[#667085]">o selecciona archivo</span>
              <span className="mx-auto mt-4 inline-flex h-10 items-center rounded-lg border border-[#16b8ac] px-4 text-sm font-semibold text-[#0f988c]">
                Seleccionar archivo
              </span>
              <span className="mt-4 block text-sm text-[#667085]">
                Excel (.xlsx) o CSV (.csv), máximo 50 MB
              </span>
              {selectedFileName ? (
                <span className="mt-3 block text-sm font-semibold text-[#14375a]">{selectedFileName}</span>
              ) : null}
              {state.errors?.file ? (
                <span className="mt-3 block text-sm font-semibold text-[#d92d20]">{state.errors.file}</span>
              ) : null}
            </span>
          </label>

          <div className="grid place-items-center rounded-xl bg-[#f7f9fc] p-6 text-center">
            <FileSpreadsheet aria-hidden="true" className="h-12 w-12 text-[#0f988c]" />
            <p className="mt-4 font-semibold text-[#14375a]">¿No tienes una plantilla?</p>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Descarga una plantilla base con los campos mínimos requeridos.
            </p>
            <a
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0f988c]"
              download
              href="/templates/asset-master-template.csv"
            >
              Descargar plantilla
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="space-y-5 px-6 pb-6">
          <div>
            <h3 className="font-semibold text-[#14375a]">Campos mínimos requeridos en el maestro</h3>
            <div className="mt-4 grid gap-3 text-sm text-[#46618a] sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Código del activo",
                "Descripción",
                "Categoría",
                "Ubicación esperada",
                "Responsable esperado",
                "Número de serie",
                "Centro de costo",
                "Activo crítico",
              ].map((item) => (
                <span className="inline-flex items-center gap-2" key={item}>
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#0f988c]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#e4e7eb] bg-[#f7f9fc] p-4">
            <h3 className="font-semibold text-[#14375a]">Validación del archivo</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {[
                ["Total de registros", summary ? String(summary.totalRows) : "-"],
                ["Válidos", summary ? String(summary.validRows) : "-"],
                ["Advertencias", summary ? String(summary.warningRows) : "-"],
                ["Errores", summary ? String(summary.errorRows) : "-"],
              ].map(([label, value]) => (
                <div className="rounded-lg bg-white p-4 text-center" key={label}>
                  <p className="text-2xl font-semibold text-[#14375a]">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#667085]">{label}</p>
                </div>
              ))}
            </div>
            {summary ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-white px-4 py-3">
                  <p className="text-sm font-semibold text-[#14375a]">Resultado de importación</p>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">
                    {summary.importedAssets} activos nuevos y {summary.updatedAssets} activos actualizados.
                  </p>
                </div>
                <div className="rounded-lg bg-[#eff6ff] px-4 py-3 text-sm font-medium leading-6 text-[#2e72d2]">
                  Las filas válidas ya quedaron sincronizadas con el maestro y el listado de activos.
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-[#eff6ff] px-4 py-3 text-sm font-medium text-[#2e72d2]">
                Al importar validaremos encabezados, duplicados y campos mínimos antes de crear activos.
              </div>
            )}

            {summary?.errors.length ? (
              <div className="mt-4 rounded-lg border border-[#fda29b] bg-[#fff1f1] px-4 py-3">
                <p className="text-sm font-semibold text-[#b42318]">Errores detectados</p>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-[#b42318]">
                  {summary.errors.map((item) => (
                    <li key={`${item.row}-${item.message}`}>Fila {item.row}: {item.message}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {summary?.warnings.length ? (
              <div className="mt-4 rounded-lg border border-[#fedf89] bg-[#fffbeb] px-4 py-3">
                <p className="text-sm font-semibold text-[#93370d]">Advertencias</p>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-[#93370d]">
                  {summary.warnings.map((item) => (
                    <li key={`${item.row}-${item.message}`}>Fila {item.row}: {item.message}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {state.errors?.form ? (
              <div className="mt-4 rounded-lg border border-[#fda29b] bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#b42318]">
                {state.errors.form}
              </div>
            ) : null}

            {state.message ? (
              <div className="mt-4 rounded-lg border border-[#8ed8d0] bg-[#f0fffc] px-4 py-3 text-sm font-semibold text-[#0f988c]">
                {state.message}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#eef1f5] p-6 sm:flex-row sm:justify-end">
          <button className="h-11 rounded-lg border border-[#d6deea] px-5 text-sm font-semibold text-[#46618a]" onClick={onClose} type="button">
            Cancelar
          </button>
          <ImportMasterButton disabled={!selectedFileName} />
        </div>
      </form>
    </div>
  );
}

function CustomFieldModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (field: CaptureField) => void;
}) {
  const [label, setLabel] = useState("");
  const [helpText, setHelpText] = useState("");
  const [dataType, setDataType] = useState<FieldDataType>("text");
  const [requirement, setRequirement] = useState<FieldRequirement>("optional");

  function handleSave() {
    const key = label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    if (!key || !label.trim()) {
      return;
    }

    onSave({
      key,
      label: label.trim(),
      dataType,
      requirement,
      helpText: helpText.trim(),
      options: [],
      defaultValue: "",
      showInMobileCapture: true,
      showInAssetDetail: true,
      showInReports: true,
      visibilityCondition: "",
      isSystem: false,
      scope: "capture",
      position: 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#101828]/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-[0_24px_70px_rgba(20,55,90,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#eef1f5] p-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#14375a]">Agregar campo personalizado</h2>
            <p className="mt-2 text-sm text-[#667085]">
              Define un campo nuevo que será utilizado durante la toma física.
            </p>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-[#667085] transition hover:bg-[#f2f4f7]"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div className="space-y-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#344054]">Nombre del campo</span>
              <input
                className="h-12 rounded-lg border border-[#d6deea] px-4 text-[#14375a] outline-none focus:border-[#16b8ac]"
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Ej: Número de inventario interno"
                value={label}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#344054]">Descripción</span>
              <input
                className="h-12 rounded-lg border border-[#d6deea] px-4 text-[#14375a] outline-none focus:border-[#16b8ac]"
                onChange={(event) => setHelpText(event.target.value)}
                placeholder="Texto de ayuda para el auditor"
                value={helpText}
              />
            </label>
            <div>
              <p className="text-sm font-semibold text-[#344054]">Tipo de campo</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {dataTypeOptions.map(({ Icon, label: optionLabel, type }) => (
                  <button
                    className={cn(
                      "grid min-h-20 place-items-center rounded-lg border p-3 text-sm font-semibold transition",
                      dataType === type
                        ? "border-[#16b8ac] bg-[#eefbf8] text-[#0f988c]"
                        : "border-[#d6deea] text-[#46618a] hover:border-[#8ed8d0]",
                    )}
                    key={type}
                    onClick={() => setDataType(type)}
                    type="button"
                  >
                    <Icon aria-hidden="true" className="mb-2 h-6 w-6" />
                    {optionLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-[#344054]">Obligatoriedad</p>
              <div className="mt-3 space-y-3">
                {(["required", "optional", "not_applicable"] as const).map((option) => (
                  <label className="flex items-center gap-3 text-sm font-semibold text-[#46618a]" key={option}>
                    <input
                      checked={requirement === option}
                      className="h-5 w-5 accent-[#0f988c]"
                      onChange={() => setRequirement(option)}
                      type="radio"
                    />
                    {requirementLabels[option]}
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[#f2c878] bg-[#fff8eb] p-4 text-sm leading-6 text-[#8a5d00]">
              <p className="font-semibold">Ejemplo de condición</p>
              <p className="mt-1">
                Mostrar cuando: <strong>Estado físico</strong> es <strong>Dañado</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#eef1f5] p-6 sm:flex-row sm:justify-end">
          <button className="h-11 rounded-lg border border-[#d6deea] px-5 text-sm font-semibold text-[#46618a]" onClick={onClose} type="button">
            Cancelar
          </button>
          <button className="h-11 rounded-lg bg-[#0f988c] px-5 text-sm font-semibold !text-white" onClick={handleSave} type="button">
            Guardar campo
          </button>
        </div>
      </div>
    </div>
  );
}

export function PhysicalCaptureSettingsForm({
  campaignId,
  canEdit,
  initialValues,
}: {
  campaignId: string;
  canEdit: boolean;
  initialValues: CaptureSettingsInput;
}) {
  const updateCaptureSettingsForCampaign =
    updateCaptureSettingsAction.bind(null, campaignId);
  const [state, formAction] = useActionState<CaptureSettingsFormState, FormData>(
    updateCaptureSettingsForCampaign,
    { values: initialValues },
  );
  const [draft, setDraft] = useState<CaptureSettingsInput>(state.values);
  const [showMasterUpload, setShowMasterUpload] = useState(false);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [showManualAssetModal, setShowManualAssetModal] = useState(false);

  function selectMode(mode: InventoryMode) {
    const preset = getPresetForMode(mode);
    setDraft({
      ...preset,
      notes: draft.notes,
    });
  }

  function updateDraft(patch: Partial<CaptureSettingsInput>) {
    setDraft((current) => ({
      ...current,
      ...patch,
    }));
  }

  function updateField(index: number, patch: Partial<CaptureField>) {
    setDraft((current) => ({
      ...current,
      fields: current.fields.map((fieldItem, fieldIndex) =>
        fieldIndex === index ? { ...fieldItem, ...patch } : fieldItem,
      ),
    }));
  }

  function deleteField(index: number) {
    setDraft((current) => ({
      ...current,
      fields: current.fields.filter((_, fieldIndex) => fieldIndex !== index),
    }));
  }

  function addCustomField(field: CaptureField) {
    setDraft((current) => ({
      ...current,
      fields: [
        ...current.fields,
        {
          ...field,
          position: current.fields.length,
        },
      ],
    }));
    setShowCustomFieldModal(false);
  }

  const selectedMode = modeOptions.find((option) => option.mode === draft.inventoryMode) ?? modeOptions[0];
  const SelectedIcon = selectedMode.Icon;
  const requiresMaster =
    draft.inventoryMode === "full_audit" ||
    draft.assetManagementMethod === "bulk_only" ||
    draft.assetManagementMethod === "hybrid";
  const totalExample = draft.conditionOptions.reduce(
    (sum, option) => sum + option.exampleQuantity,
    0,
  );

  return (
    <>
      <form action={formAction} className="space-y-5">
        <input name="settingsJson" type="hidden" value={JSON.stringify(draft)} />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#d6deea] bg-white px-5 text-sm font-semibold text-[#46618a] transition hover:border-[#8ed8d0] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canEdit}
            onClick={() => selectMode(draft.inventoryMode)}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="h-5 w-5" />
            Restablecer valores por defecto
          </button>
          <SubmitButton disabled={!canEdit} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
          <aside className="rounded-xl border border-[#e4e7eb] bg-white p-5 shadow-[0_18px_40px_rgba(20,55,90,0.045)]">
            <h2 className="text-lg font-semibold text-[#14375a]">Tipo de inventario</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Selecciona el tipo de inventario para esta campaña.
            </p>
            <div className="mt-5 grid gap-3">
              {modeOptions.map((option) => (
                <ModeCard
                  Icon={option.Icon}
                  active={draft.inventoryMode === option.mode}
                  description={option.description}
                  disabled={!canEdit}
                  key={option.mode}
                  onClick={() => selectMode(option.mode)}
                  title={option.title}
                />
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-[#eff6ff] p-4 text-sm font-medium leading-6 text-[#2e72d2]">
              <Info aria-hidden="true" className="mb-2 h-5 w-5" />
              Esta configuración se aplicará en la captura móvil del auditor.
            </div>
          </aside>

          <section className="space-y-5">
            <Card>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-5">
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#e9fbf7] text-[#0f988c]">
                    <SelectedIcon aria-hidden="true" className="h-10 w-10" strokeWidth={2.1} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-[#14375a]">
                        {getInventoryModeLabel(draft.inventoryMode)}
                      </h2>
                      <span className="rounded-full bg-[#dff8f4] px-3 py-1 text-xs font-semibold text-[#0f988c]">
                        Seleccionado
                      </span>
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">
                      {draft.inventoryMode === "simple_count"
                        ? "Registra únicamente la cantidad de activos encontrados por tipo o código."
                        : draft.inventoryMode === "full_audit"
                          ? "Captura información detallada del activo con evidencia obligatoria y trazabilidad completa."
                          : "Configura manualmente campos, evidencia, reglas y secciones que aplicarán en terreno."}
                    </p>
                  </div>
                </div>

                {requiresMaster ? (
                  <div className="text-left lg:text-center">
                    <button
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#d6deea] px-5 text-sm font-semibold text-[#14375a] transition hover:border-[#8ed8d0]"
                      onClick={() => setShowMasterUpload(true)}
                      type="button"
                    >
                      <CloudUpload aria-hidden="true" className="h-5 w-5" />
                      Cargar maestro
                    </button>
                    <p className="mt-2 text-xs font-semibold text-[#667085]">
                      {draft.inventoryMode === "full_audit" ? "Carga masiva obligatoria" : "Carga masiva opcional"}
                    </p>
                  </div>
                ) : null}
              </div>
            </Card>

            <Card>
              <div>
                <h3 className="text-lg font-semibold text-[#14375a]">1. Método de gestión de activos</h3>
                <p className="mt-1 text-sm text-[#667085]">
                  Define cómo se gestionarán los activos para esta campaña.
                </p>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {methodOptions.map(({ Icon, description, method, title }) => (
                  <button
                    className={cn(
                      "grid min-h-32 grid-cols-[auto_1fr] gap-4 rounded-xl border p-5 text-left transition",
                      draft.assetManagementMethod === method
                        ? "border-[#16b8ac] bg-[#f0fffc]"
                        : "border-[#e4e7eb] hover:border-[#8ed8d0]",
                    )}
                    disabled={!canEdit || (draft.inventoryMode === "full_audit" && method !== "bulk_only")}
                    key={method}
                    onClick={() => updateDraft({ assetManagementMethod: method })}
                    type="button"
                  >
                    <span
                      className={cn(
                        "mt-1 grid h-5 w-5 place-items-center rounded-full border-2",
                        draft.assetManagementMethod === method ? "border-[#0f988c] bg-[#0f988c]" : "border-[#b7c3d0]",
                      )}
                    >
                      {draft.assetManagementMethod === method ? <Check aria-hidden="true" className="h-3 w-3 text-white" /> : null}
                    </span>
                    <span>
                      <Icon aria-hidden="true" className="mb-3 h-7 w-7 text-[#46618a]" />
                      <span className="block font-semibold text-[#14375a]">{title}</span>
                      <span className="mt-2 block text-sm leading-6 text-[#667085]">{description}</span>
                    </span>
                  </button>
                ))}
              </div>
              {(draft.assetManagementMethod === "manual_only" || draft.assetManagementMethod === "hybrid") ? (
                <div className="mt-4 flex flex-col gap-3 rounded-lg bg-[#eff6ff] px-4 py-3 text-sm font-medium text-[#2e72d2] sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Registre activos manuales desde esta misma configuración. Si acaba de cambiar el método,
                    guarde la configuración antes de crear activos.
                  </span>
                  <button
                    className="inline-flex items-center gap-2 font-semibold text-[#0f988c] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!canEdit}
                    onClick={() => setShowManualAssetModal(true)}
                    type="button"
                  >
                    Registrar activo manual
                    <Plus aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </Card>

            <div className="grid gap-5 2xl:grid-cols-[1fr_420px]">
              <Card>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#14375a]">2. Campos a capturar</h3>
                    <p className="mt-1 text-sm text-[#667085]">
                      Define qué información deberá registrar el auditor en terreno.
                    </p>
                  </div>
                  {draft.inventoryMode === "custom" ? (
                    <button
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#8ed8d0] px-4 text-sm font-semibold text-[#0f988c]"
                      disabled={!canEdit}
                      onClick={() => setShowCustomFieldModal(true)}
                      type="button"
                    >
                      <Plus aria-hidden="true" className="h-4 w-4" />
                      Agregar campo
                    </button>
                  ) : null}
                </div>
                <div className="mt-5">
                  <FieldRows
                    canEdit={canEdit}
                    fields={draft.fields}
                    onDeleteField={deleteField}
                    onUpdateField={updateField}
                  />
                </div>
                {state.errors?.fields ? (
                  <p className="mt-3 text-sm font-semibold text-[#d92d20]">{state.errors.fields}</p>
                ) : null}
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-[#14375a]">3. Evidencia</h3>
                <p className="mt-1 text-sm text-[#667085]">
                  Configura el tipo y nivel de evidencia requerida.
                </p>
                <div className="mt-5 space-y-4">
                  <SelectBox
                    disabled={!canEdit}
                    label="Foto del activo"
                    onChange={(primaryPhotoRequirement) => updateDraft({ primaryPhotoRequirement })}
                    value={draft.primaryPhotoRequirement}
                  />
                  <SelectBox
                    disabled={!canEdit}
                    label="Fotos adicionales"
                    onChange={(additionalPhotosRequirement) => updateDraft({ additionalPhotosRequirement })}
                    value={draft.additionalPhotosRequirement}
                  />
                  {draft.additionalPhotosRequirement === "required" ? (
                    <label className="grid gap-2">
                      <span className="text-sm font-semibold text-[#344054]">Mínimo de fotos adicionales</span>
                      <input
                        className="h-11 rounded-lg border border-[#d6deea] px-4 text-[#14375a] outline-none focus:border-[#16b8ac]"
                        disabled={!canEdit}
                        min={0}
                        onChange={(event) => updateDraft({ additionalPhotosMin: Number(event.target.value) })}
                        type="number"
                        value={draft.additionalPhotosMin}
                      />
                    </label>
                  ) : null}
                  <SelectBox
                    disabled={!canEdit}
                    label="Otros archivos"
                    onChange={(otherFilesRequirement) => updateDraft({ otherFilesRequirement })}
                    value={draft.otherFilesRequirement}
                  />
                  <SelectBox
                    disabled={!canEdit}
                    label="Observaciones con foto"
                    onChange={(photoObservationRule) => updateDraft({ photoObservationRule })}
                    value={draft.photoObservationRule}
                  />
                </div>
                <div className="mt-5 rounded-lg bg-[#eff6ff] px-4 py-3 text-sm font-medium leading-6 text-[#2e72d2]">
                  Toda evidencia se almacenará con fecha, hora, usuario, ubicación, hash y dispositivo.
                </div>
              </Card>
            </div>

            <div className="grid gap-5 2xl:grid-cols-[1fr_420px]">
              <Card>
                <h3 className="text-lg font-semibold text-[#14375a]">4. Condición y estado</h3>
                <p className="mt-1 text-sm text-[#667085]">
                  Permite distribuir la cantidad encontrada por condición física del activo.
                </p>
                <div className="mt-5 grid gap-5 lg:grid-cols-[320px_1fr]">
                  <div>
                    <p className="text-sm font-semibold text-[#344054]">Estado físico</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Bueno", "Regular", "Malo", "Dañado", "No aplica"].map((label, index) => (
                        <span
                          className={cn(
                            "rounded-lg border px-4 py-2 text-sm font-semibold",
                            index === 0
                              ? "border-[#0f988c] bg-[#0f988c] !text-white"
                              : "border-[#d6deea] bg-white text-[#46618a]",
                          )}
                          key={label}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <label className="mt-5 grid gap-2">
                      <span className="text-sm font-semibold text-[#344054]">
                        Obligar observación cuando
                      </span>
                      <select
                        className="h-11 rounded-lg border border-[#d6deea] px-4 text-sm font-semibold text-[#46618a] outline-none"
                        disabled={!canEdit}
                        onChange={(event) => updateDraft({ conditionRequiresObservationRule: event.target.value })}
                        value={draft.conditionRequiresObservationRule}
                      >
                        <option value="difference_or_bad_condition">Existe diferencia o estado malo/dañado</option>
                        <option value="always">Siempre</option>
                        <option value="never">Nunca</option>
                      </select>
                    </label>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-[#e4e7eb]">
                    <div className="grid grid-cols-[1fr_1.5fr_90px] bg-[#f7f9fc] px-4 py-3 text-xs font-semibold text-[#667085]">
                      <span>Condición</span>
                      <span>Descripción</span>
                      <span className="text-right">Ejemplo</span>
                    </div>
                    {draft.conditionOptions.map((option) => (
                      <div className="grid grid-cols-[1fr_1.5fr_90px] gap-3 border-t border-[#eef1f5] px-4 py-3 text-sm" key={option.key}>
                        <span className="flex items-center gap-2 font-semibold text-[#46618a]">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: option.color }} />
                          {option.label}
                        </span>
                        <span className="text-[#667085]">{option.description}</span>
                        <span className="text-right font-semibold text-[#14375a]">{option.exampleQuantity}</span>
                      </div>
                    ))}
                    <div className="grid grid-cols-[1fr_90px] border-t border-[#eef1f5] px-4 py-3 text-sm font-semibold text-[#14375a]">
                      <span>Total cantidad encontrada</span>
                      <span className="text-right text-[#0f988c]">{totalExample}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-[#14375a]">5. Activos sobrantes</h3>
                <p className="mt-1 text-sm text-[#667085]">
                  Permite registrar activos que no existen en el maestro.
                </p>
                <div className="mt-5 space-y-4">
                  <Toggle
                    checked={draft.allowSurplusAssets}
                    description="El auditor podrá registrar activos encontrados fuera del maestro."
                    disabled={!canEdit}
                    label="Permitir registrar activos sobrantes"
                    onChange={(allowSurplusAssets) => updateDraft({ allowSurplusAssets })}
                  />
                  <div className="space-y-3 pt-2">
                    <p className="text-sm font-semibold text-[#344054]">Información requerida para sobrantes</p>
                    {[
                      "Descripción",
                      "Tipo de activo",
                      "Cantidad",
                      "Ubicación observada",
                      "Foto opcional",
                      "Observaciones",
                    ].map((item) => (
                      <span className="flex items-center gap-2 text-sm font-medium text-[#46618a]" key={item}>
                        <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#0f988c]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {draft.inventoryMode === "custom" ? (
              <Card>
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#14375a]">6. Resumen de configuración móvil</h3>
                    <p className="mt-1 text-sm text-[#667085]">
                      Vista previa de cómo se verá la captura en terreno según los elementos configurados.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-[#8ed8d0] bg-[#f8fffd] p-4">
                    <Smartphone aria-hidden="true" className="h-12 w-12 text-[#14375a]" />
                    <div>
                      <p className="text-sm font-semibold text-[#14375a]">
                        {draft.fields.filter((fieldItem) => fieldItem.requirement !== "not_applicable").length} campos activos
                      </p>
                      <p className="mt-1 text-xs text-[#667085]">
                        {draft.fields.filter((fieldItem) => fieldItem.requirement === "required").length} obligatorios en móvil
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : null}

            <Card>
              <h3 className="text-lg font-semibold text-[#14375a]">Opciones adicionales</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Toggle
                  checked={draft.allowOfflineCapture}
                  description="Los registros se sincronizarán al recuperar conexión."
                  disabled={!canEdit}
                  label="Permitir registros sin conexión"
                  onChange={(allowOfflineCapture) => updateDraft({ allowOfflineCapture })}
                />
                <Toggle
                  checked={draft.allowEditRecords}
                  description="Los auditores podrán corregir sus registros."
                  disabled={!canEdit}
                  label="Permitir editar registros"
                  onChange={(allowEditRecords) => updateDraft({ allowEditRecords })}
                />
                <Toggle
                  checked={draft.requireSupervisorReview}
                  description="Todos los registros deberán ser revisados."
                  disabled={!canEdit}
                  label="Requiere revisión de supervisor"
                  onChange={(requireSupervisorReview) => updateDraft({ requireSupervisorReview })}
                />
                <Toggle
                  checked={draft.autoCloseCampaign}
                  description="La campaña se cerrará al alcanzar el 100%."
                  disabled={!canEdit}
                  label="Cierre automático de campaña"
                  onChange={(autoCloseCampaign) => updateDraft({ autoCloseCampaign })}
                />
              </div>
              <label className="mt-5 grid gap-2">
                <span className="text-sm font-semibold text-[#344054]">Notas operativas</span>
                <textarea
                  className="min-h-28 rounded-lg border border-[#d6deea] px-4 py-3 text-[#14375a] outline-none focus:border-[#16b8ac]"
                  disabled={!canEdit}
                  onChange={(event) => updateDraft({ notes: event.target.value })}
                  placeholder="Ej: Los auditores deben registrar una observación cuando exista diferencia de ubicación."
                  value={draft.notes}
                />
              </label>
            </Card>

            {state.errors?.form ? (
              <div className="rounded-lg border border-[#fda29b] bg-[#fff1f1] px-4 py-3 text-sm font-semibold text-[#b42318]">
                {state.errors.form}
              </div>
            ) : null}

            {state.message ? (
              <div className="rounded-lg border border-[#8ed8d0] bg-[#f0fffc] px-4 py-3 text-sm font-semibold text-[#0f988c]">
                {state.message}
              </div>
            ) : null}

            <div className="rounded-lg bg-[#eff6ff] px-4 py-3 text-sm font-medium text-[#2e72d2]">
              Esta configuración puede modificarse antes o durante la campaña según los permisos del usuario.
            </div>
          </section>
        </div>
      </form>

      {showMasterUpload ? (
        <MasterUploadModal
          campaignId={campaignId}
          onClose={() => setShowMasterUpload(false)}
        />
      ) : null}

      {showCustomFieldModal ? (
        <CustomFieldModal
          onClose={() => setShowCustomFieldModal(false)}
          onSave={addCustomField}
        />
      ) : null}

      {showManualAssetModal ? (
        <ManualAssetModal
          campaignId={campaignId}
          canEdit={canEdit}
          manualAssetLimit={draft.manualAssetLimit}
          onClose={() => setShowManualAssetModal(false)}
        />
      ) : null}
    </>
  );
}
